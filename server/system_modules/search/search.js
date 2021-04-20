const mysqlutils = require("../mysql/mysqlutils");
const fulltextSearch = require("./fulltextSearch");
const msClient = require("../mysql/mysql");
const { getProductEavTableName } = require("../product/product_eav_table");
const { psize } = require("../const/config");
const productEntityInheritFields = ["product_id", "entity_id", "type_id", "parent", "created_at", "updated_at"];
const productEntityPropsAsAttributes = [
    {
        attribute_id: "tier_price",
        data_type: "int"
    },
    {
        attribute_id: "available_quantity",
        data_type: "int"
    }
];
const attributeInheritFields = [
    {
        attribute_id: "attribute_id",
        data_type: "varchar"
    },
    {
        attribute_id: "label",
        data_type: "varchar"
    },
    {
        attribute_id: "referred_target",
        data_type: "varchar"
    },
    {
        attribute_id: "admin_only",
        data_type: "int"
    },
    {
        attribute_id: "html_type",
        data_type: "varchar"
    },
    {
        attribute_id: "data_type",
        data_type: "varchar"
    },
    {
        attribute_id: "validation",
        data_type: "varchar"
    },
    {
        attribute_id: "is_super",
        data_type: "int"
    },
    {
        attribute_id: "is_system",
        data_type: "int"
    },
    {
        attribute_id: "unit",
        data_type: "varchar"
    },
    {
        attribute_id: "value",
        data_type: "keep-as-is"
    }
];
const multivalueAttributes = ["multiselect", "multiinput"];
const productTypeIds = ["self", "parent", "variants"];

function createSearchQueryDB ({ categories, entity_ids, refinements, searchPhrase, searchDictionary, inStock, tier_price }) {
    // ## search by category_id
    let queryCID = "";
    if (categories && categories.length > 0) {
        queryCID =
        `
        WITH RECURSIVE \`cte\` (entity_id) AS (
            SELECT entity_id
            FROM \`ecommerce\`.category_entity
            WHERE entity_id IN (\'${categories.map(item => mysqlutils.escapeQuotes(item)).join("\', \'")}\')
            UNION ALL
            SELECT p.entity_id
            FROM \`ecommerce\`.category_entity AS \`p\`
            INNER JOIN \`cte\` ON \`p\`.parent = \`cte\`.entity_id
        )
        SELECT product_id, MAX(weight) AS weight, \'category\' AS \`type\` FROM (
            SELECT
            IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            IF(\`pca\`.position IS NOT NULL, 100 + \`pca\`.position, 100) AS \`weight\`
            FROM \`ecommerce\`.product_category_assignment AS \`pca\`
            INNER JOIN \`ecommerce\`.product_entity AS \`pe\` ON \`pe\`.entity_id = \`pca\`.product_id
            WHERE \`pca\`.category_id IN(SELECT DISTINCT entity_id FROM \`cte\`)
        ) as \`alias\`
        GROUP BY product_id
        `;
    }
    // ## search by entity_ids
    let queryPID = ""
    if (entity_ids && entity_ids.length > 0) {
        queryPID =
        `
        SELECT product_id, MAX(weight) AS weight, \'entity_id\' AS \`type\` FROM (
            SELECT IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            1000 AS \`weight\`
            FROM \`ecommerce\`.\`product_entity\` AS \`pe\`
            WHERE \`pe\`.entity_id IN (\'${entity_ids.map(item => mysqlutils.escapeQuotes(item)).join("\', \'")}\')
        ) AS \`alias\`
        GROUP BY product_id
        `;
    }
    // ## search by attribute refinements
    let queryRefinement = "";
    if (refinements && refinements.length > 0) {
        refinements.map((item, index) => {
            let table_name = getProductEavTableName(item);
            if (table_name) {
                item.table = table_name;
                item.query = `(\`eav\`.attribute_id ='${mysqlutils.escapeQuotes(item.attribute_id)}' AND \`eav\`.value IN ('${item.value.map(item => mysqlutils.escapeQuotes(item.toString())).join("\', \'")}'))`
            } else {
                refinements[index] = null;
            }
        });
        refinements = refinements.filter(item => item !== null);
        let table_grouping = {
            product_eav_int: refinements.filter(item => item.table == "product_eav_int").map(item => item.query).join(" OR "),
            product_eav_decimal: refinements.filter(item => item.table == "product_eav_decimal").map(item => item.query).join(" OR "),
            product_eav_varchar: refinements.filter(item => item.table == "product_eav_varchar").map(item => item.query).join(" OR "),
            product_eav_text: refinements.filter(item => item.table == "product_eav_text").map(item => item.query).join(" OR "),
            product_eav_datetime: refinements.filter(item => item.table == "product_eav_datetime").map(item => item.query).join(" OR "),
            product_eav_multi_value: refinements.filter(item => item.table == "product_eav_multi_value").map(item => item.query).join(" OR "),
        };

        let componentQueries = [];
        Object.keys(table_grouping).forEach(key => {
            if (table_grouping[key] !== "") {
                componentQueries.push(
                    `
                    SELECT IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id) AS product_id, \`eav\`.attribute_id
                    FROM \`ecommerce\`.\`${key}\` AS \`eav\`
                    INNER JOIN \`ecommerce\`.product_entity AS \`pe\` ON \`pe\`.entity_id = \`eav\`.entity_id
                    WHERE ${table_grouping[key]}
                    `
                )
            }
        })
        if (componentQueries.length > 0) {
            queryRefinement =
            `
            SELECT product_id, 10*${refinements.length} AS \`weight\`, \'attribute\' AS \`type\` FROM (
                SELECT product_id, GROUP_CONCAT(attribute_id) AS attribute_ids FROM (
                    ${componentQueries.join(" UNION ALL ")}
                ) AS \`alias\` GROUP BY product_id
            ) AS \`alias2\`
            WHERE (${refinements.map(item => `FIND_IN_SET('${mysqlutils.escapeQuotes(item.attribute_id)}', \`alias2\`.attribute_ids)`).join(" AND ")})
            `;
        }
    }
    // ## search by search phrase
    let querySearchPhrase = "";
    if (searchPhrase) {
        querySearchPhrase = fulltextSearch.generateFulltextSqlSearchProductEntity({ searchPhrase, searchDictionary });
    }
    // ## search by inStock
    let queryInStock = "";
    if (inStock == true) {
        queryInStock =
        `
        SELECT product_id, 100 AS \`weight\`, 'inStock' AS \`type\` FROM (
            SELECT DISTNCT(IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id)) AS product_id
            FROM \`ecommerce\`.inventory AS \`inv\`
            LEFT JOIN \`ecommerce\`.product_entity AS \`pe\` ON \`pe\`.entity_id = \`inv\`.entity_id
            WHERE \`inv\`.available_quantity > 0
        ) AS \`alias\`
        `;
    }
    // ### search by price
    let queryTierPrice = "";
    if (tier_price) {
        if (typeof(tier_price.min) === "number" && typeof(tier_price.max) === "number") {
            queryTierPrice =
            `
            SELECT product_id, 50 AS \`weight\`, 'tier_price' AS \`type\` FROM (
                SELECT DISTINCT(IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id)) AS product_id
                FROM \`ecommerce\`.product_tier_price AS \`tier_price\`
                LEFT JOIN \`ecommerce\`.product_entity AS \`pe\` ON \`pe\`.entity_id = \`tier_price\`.entity_id
                WHERE \`tier_price\`.price > ${tier_price.min} AND \`tier_price\`.price < ${tier_price.max}
            ) AS \`alias\`
            `;
        } else if(typeof(tier_price.min) === "number") {
            queryTierPrice =
            `
            SELECT product_id, 50 AS \`weight\`, 'tier_price' AS \`type\` FROM (
                SELECT DISTINCT(IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id)) AS product_id
                FROM \`ecommerce\`.product_tier_price AS \`tier_price\`
                LEFT JOIN \`ecommerce\`.product_entity AS \`pe\` ON \`pe\`.entity_id = \`tier_price\`.entity_id
                WHERE \`tier_price\`.price > ${tier_price.min}
            ) AS \`alias\`
            `;
        } else if(typeof(tier_price.max) === "number") {
            queryTierPrice =
            `
            SELECT product_id, 50 AS \`weight\`, 'tier_price' AS \`type\` FROM (
                SELECT DISTINCT(IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id)) AS product_id
                FROM \`ecommerce\`.product_tier_price AS \`tier_price\`
                LEFT JOIN \`ecommerce\`.product_entity AS \`pe\` ON \`pe\`.entity_id = \`tier_price\`.entity_id
                WHERE \`tier_price\`.price < ${tier_price.max}
            ) AS \`alias\`
            `;
        } else if(typeof(tier_price.equal) === "number") {
            queryTierPrice =
            `
            SELECT product_id, 50 AS \`weight\`, 'tier_price' AS \`type\` FROM (
                SELECT DISTINCT(IF(\`pe\`.parent IS NOT NULL AND \`pe\`.parent != '', \`pe\`.parent, \`pe\`.entity_id)) AS product_id
                FROM \`ecommerce\`.product_tier_price AS \`tier_price\`
                LEFT JOIN \`ecommerce\`.product_entity AS \`pe\` ON \`pe\`.entity_id = \`tier_price\`.entity_id
                WHERE \`tier_price\`.price = ${tier_price.equal}
            ) AS \`alias\`
            `;
        }
    }
    // ## final assembled search query
    let assembledQuery = [queryCID, queryPID, queryRefinement, querySearchPhrase, queryInStock, queryTierPrice]
    .filter(item => (item != null && item != ""));
    
    if (assembledQuery.length == 0) {
        assembledQuery = 
        `
        SELECT entity_id AS product_id, 1 AS \`weight\`, 'all' AS \`type\`
        FROM \`ecommerce\`.product_entity WHERE parent IS NULL OR parent = ''
        `;
    } else {
        assembledQuery = assembledQuery.join(" UNION ALL ")
    }

    return assembledQuery;
};

function searchConfigValidation ({ categories, entity_ids, refinements, searchPhrase, inStock, tier_price }) {
    try {
        let required = [];
        if (categories && Array.isArray(categories) && categories.length > 0) {
            categories.forEach(item => {
                if (typeof(item) != "string" || item.length == 0)
                    throw new Error("Search config invalid: categories must be a list of none-empty string!");
            });
            required.push("category");
        } else if (categories && !Array.isArray(categories)) {
            throw new Error("Search config invalid: categories must be an array!");
        }
        if (entity_ids && Array.isArray(entity_ids) && entity_ids.length > 0) {
            entity_ids.forEach(item => {
                if (typeof(item) != "string" || item.length == 0)
                    throw new Error("Search config invalid: entity_ids must be a list of none-empty string!");
            });
            required.push("entity_id");
        } else if (entity_ids && !Array.isArray(entity_ids)) {
            throw new Error("Search config invalid: entity_ids must be an array!");
        }
        if (refinements && Array.isArray(refinements) && refinements.length > 0) {
            refinements.forEach(item => {
                if (typeof(item.attribute_id) != "string" || item.attribute_id.length == 0)
                    throw new Error("Search config invalid: refinement attribute_id must be a none-empty string!");
                if (!Array.isArray(item.value) || item.value.length == 0)
                    throw new Error("Search config invalid: refinement value must be a none-empty list!");
                item.value.forEach(value => {
                    if (typeof(value) != "number" && typeof(value) != "string")
                        throw new Error("Search config invalid: refinement value must be a list of string or number!")
                })
            });
            required.push("attribute");
        } else if (refinements && !Array.isArray(refinements)) {
            throw new Error("Search config invalid: refinements must be an array!")
        }
        if (
            (searchPhrase != null && typeof(searchPhrase) != "string") ||
            (typeof(searchPhrase) == "string" && searchPhrase.trim().length == 0)
        ) {
            throw new Error("Search config invalid: searchPhrase must be none-empty string!")
        } else if (searchPhrase) {
            required.push("name");
        };
        if (inStock === true) {
            required.push("inStock");
        }; 
        if (tier_price) {
            if (
                ("min" in tier_price && tier_price.min !== null && typeof(tier_price.min) !== "number") ||
                ("max" in tier_price && tier_price.max !== null && typeof(tier_price.max) !== "number") ||
                ("equal" in tier_price && tier_price.equal !== null && typeof(tier_price.equal) !== "number")
            ) {
                throw new Error("Error: Search config invalid - tier_price.min, tier_price.max, tier_price.equal must be number")
            }
            if (typeof(tier_price.min) === "number" || typeof(tier_price.max) === "number" || typeof(tier_price.equal) === "number") {
                required.push("tier_price");
            }
        }
        return required;
    } catch (err) {
        throw err
    }
}

function filterProductEntitiesByRequired ({ products, required }) {
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let isPassed = true;
        for (let j = 0; j < required.length; j++) {
            let match = product.__items.find(search_type => search_type.type == required[j]);
            if (!match) {
                isPassed= false;
                break;
            }
        };
        if (!isPassed) {
            products.splice(i, 1);
            i -= 1;
        };
    };
    return products;
}

function sortProductsBySignificantWeight (products) {
    products.forEach(product => {
        product.weight = 0;
        product.__items.forEach(search_type => {
            product.weight += search_type.weight;
        });
        delete product.__items;
    })
    products.sort((a, b) => {
        return b.weight - a.weight;
    });
    return products;
};

function filterDistinctProductEntities (products) {
    let filtered = [];
    products.forEach(product => {
        let match = filtered.find(m_item => m_item.product_id == product.product_id);
        if (!match) filtered.push(product);
    });
    return filtered;
}

async function getDetailProducts (products, option) {
    if (products.length == 0) return [];
    let product_ids = products.map(item => `'${mysqlutils.escapeQuotes(item.product_id.toString())}'`).join(", ");
    let sql =
    `
    SELECT \`pe\`.entity_id, \`pe\`.product_id, \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, \`pe\`.value, \`attributes\`.*, \`pe\`.attribute_id FROM (
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_int AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_decimal AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_varchar AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_text AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_datetime AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity as \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_multi_value AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id in (${product_ids}) OR \`pe\`.parent in (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, 'available_quantity' AS \`attribute_id\`, \`inv\`.available_quantity AS \`value\`
        FROM \`ecommerce\`.product_entity as \`pe\`
        LEFT JOIN \`ecommerce\`.inventory AS \`inv\` ON \`inv\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id in (${product_ids}) OR \`pe\`.parent in (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, 'tier_price' AS \`attribute_id\`, \`tier_price\`.price AS \`value\`
        FROM \`ecommerce\`.product_entity as \`pe\`
        LEFT JOIN \`ecommerce\`.product_tier_price AS \`tier_price\` ON \`tier_price\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id in (${product_ids}) OR \`pe\`.parent in (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`pe\`.parent, \`pe\`.created_at, \`pe\`.updated_at, 'category' AS \`attribute_id\`, CONCAT(\`pca\`.category_id, '---', IFNULL(\`pca\`.position, "0")) AS \`value\`
        FROM \`ecommerce\`.product_entity as \`pe\`
        LEFT JOIN \`ecommerce\`.product_category_assignment AS \`pca\` ON \`pca\`.product_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id in (${product_ids}) OR \`pe\`.parent in (${product_ids})
    ) AS \`pe\`
    LEFT JOIN \`ecommerce\`.product_eav AS \`attributes\` ON \`attributes\`.attribute_id = \`pe\`.attribute_id
    ORDER BY \`pe\`.product_id, \`pe\`.entity_id
    `;
    let rawData = await msClient.promiseQuery(sql);
    let _products = modelizeProductsData(rawData, {isAdmin: option.isAdmin});
    return _products;
}

function modelizeProductsData (rawData, option) {
    try {
        let products = mysqlutils.groupByAttribute({
            rawData: rawData,
            groupBy: "product_id"
        });
        products.forEach((product, index) => {
            let self = product.__items.find(line_item => line_item.entity_id == product.product_id);
            if(!self){
                console.warn("Product ", product.product_id, " has no parent. Hence is ignored!");
                products[index] = null;
                return;
            }
            product.type_id = self.type_id;
            product.__items = mysqlutils.groupByAttribute({
                rawData: product.__items,
                groupBy: "entity_id"
            });
            switch (product.type_id) {
                case "simple": case "bundle": case "grouped": case "downloadable":
                    product.self = product.__items.find(line_item => line_item.entity_id == product.product_id);
                    break;
                case "master":
                    product.parent = product.__items.find(line_item => line_item.entity_id == product.product_id);
                    product.variants = product.__items.filter(line_item => line_item.entity_id != product.product_id);
                    break;
                default:
                    products[index] = null;
                    return;
            };
            product.__items.forEach(product_entity => {
                if(product_entity.__items[0]){
                    productEntityInheritFields.forEach(field_item => {
                        product_entity[field_item] = product_entity.__items[0][field_item] || product_entity[field_item];
                    });
                    productEntityPropsAsAttributes.forEach(prop_attribute => {
                        let match = product_entity.__items.find(m_item => m_item.attribute_id == prop_attribute.attribute_id);
                        if (match) {
                            let converted_value = mysqlutils.convertDataType(match.value, prop_attribute.data_type)
                            if (converted_value !== null && converted_value !== undefined && converted_value !== "") {
                                product_entity[prop_attribute.attribute_id] = converted_value;
                            }
                        }
                    });
                    product_entity.categories = [];
                    product_entity.__items.forEach(attribute => {
                        if (attribute && attribute.attribute_id === "category" && attribute.value !== null) {
                            attribute.value = attribute.value.toString();
                            let category_id = attribute.value.replace(/---\d+$/, "");
                            let position = attribute.value.slice(category_id.length + 3);
                            position = parseInt(position);
                            if (isNaN(position)) {
                                position = 0;
                            };
                            product_entity.categories.push({
                                category_id: category_id,
                                position: position
                            })
                        }
                    })
                }
                product_entity.attributes = mysqlutils.groupByAttribute({
                    rawData: product_entity.__items,
                    groupBy: "attribute_id",
                    nullExcept: [null, "", "category", ...productEntityPropsAsAttributes.map(item => item.attribute_id)]
                });
                product_entity.attributes.forEach(attr_item => {
                    if(attr_item.__items[0]){
                        if("__items" in attr_item.__items[0]){
                            throw new Error("Invalid property name \"__item\". \"__item\" is framework preserved key.")
                        }
                        attributeInheritFields.forEach(field_item => {
                            attr_item[field_item.attribute_id] = mysqlutils.convertDataType(attr_item.__items[0][field_item.attribute_id], field_item.data_type);
                        });
                        attr_item.value = mysqlutils.convertDataType(attr_item.value, attr_item.data_type);
                    }
                    if(multivalueAttributes.indexOf(attr_item.html_type) !== -1){
                        attr_item.value = [];
                        attr_item.__items.forEach(value_item => {
                            if (value_item) {
                                let converted_value = mysqlutils.convertDataType(value_item.value, attr_item.data_type);
                                if (converted_value !== null && converted_value !== undefined && converted_value !== "") {
                                    attr_item.value.push(converted_value);
                                }
                            }
                        })
                    }
                    delete attr_item.__items;
                });
                delete product_entity.__items;
                if (!option || !option.isAdmin) {
                    product_entity.attributes = product_entity.attributes.filter(item => item.admin_only != 1);
                }
            });
            delete product.__items;
        })
        products = products.filter(product => product != null);
        return products;
    } catch (error) {
        throw error;
    }
}

function extractRefinements (req) {
    let refinements = [];
    Object.keys(req.query).forEach(key => {
        if (key.indexOf("filter_") == 0) {
            let value = req.query[key] || "";
            if (value.length > 0) {
                key = key.replace(/^filter_/g, "");
                value = value.split("|");
                refinements.push({
                    attribute_id: key,
                    value: value
                })
            }
        }
    })
    return refinements;
}

async function search (searchConfig) {
    let required = searchConfigValidation(searchConfig);
    let assembledQuery = createSearchQueryDB(searchConfig);
    let rowData = await msClient.promiseQuery(assembledQuery);
    let products = mysqlutils.groupByAttribute({
        rawData: rowData,
        groupBy: "product_id"
    });
    products = filterProductEntitiesByRequired({ products, required });
    products = sortProductsBySignificantWeight(products);
    products = filterDistinctProductEntities(products);
    let currentPage = parseInt(searchConfig.page);
    if(isNaN(currentPage) || currentPage < 1) currentPage = 1;
    let totalFound = products.length;
    let totalPages = Math.ceil(products.length/psize);
    if(currentPage > totalPages) currentPage = totalPages;
    let slice_start = (currentPage - 1)*psize;
    let slice_end = currentPage*psize;
    products = products.slice(slice_start, slice_end);
    products = await getDetailProducts(products, {isAdmin: searchConfig && searchConfig.isAdmin ? searchConfig.isAdmin : null});
    return {
        currentPage: currentPage,
        totalPages: totalPages,
        totalFound: totalFound,
        send: products.length,
        psize: psize,
        products: products
    }
}

async function buildProductSearchEavIndex () {
    try {
        for (let i = 1; i > 0; i++) {
            let searchConfig = {page: i};
            let searchResult = await search(searchConfig);
            let products = searchResult.products;
            for (let j = 0; j < products.length; j++) {
                let attributes = [];
                productTypeIds.forEach(type_id => {
                    if (type_id !== "variants") {
                        if (products[j][type_id] && Array.isArray(products[j][type_id].attributes)) {
                            attributes.push(...products[j][type_id].attributes);
                        }
                    } else {
                        if (Array.isArray(products[j]["variants"])) {
                            products[j]["variants"].forEach(variant => {
                                if (variant && Array.isArray(variant.attributes)) {
                                    attributes.push(...variant.attributes);
                                }
                            })
                        }
                    }
                });
                attributes = attributes.filter(item => {
                    let valid = true;
                    if (typeof(item.attribute_id) !== "string" || item.attribute_id === "") valid = false;
                    if (Array.isArray(item.value)) {
                        item.value = item.value.filter(v_item => v_item !== null && v_item !== undefined && v_item !== "");
                        if (item.value.length == 0) valid = false;
                    } else if ((typeof(item.value) !== "string" && typeof(item.value) !== "number") || item.value === "") {
                        valid = false;
                    } else {
                        // convert value to consistent array format for easy manipulation
                        item.value = [item.value];
                    };
                    return valid;
                })
                let sql_build_index = "";
                if (attributes.length > 0) {
                    let product_id = mysqlutils.escapeQuotes(products[j].product_id);
                    sql_build_index =
                    `
                    INSERT INTO \`ecommerce\`.product_eav_index (product_id, attribute_id, value)
                    VALUES
                    ${attributes.map(
                        attribute => {
                            let attribute_id = mysqlutils.escapeQuotes(attribute.attribute_id);
                            return attribute.value.map(
                                v_item => `("${product_id}", "${attribute_id}", "${mysqlutils.escapeQuotes(v_item)}")`
                            ).join(",\n");
                        }
                    ).join(",\n")} AS new
                    ON DUPLICATE KEY UPDATE
                    product_id = new.product_id,
                    attribute_id = new.attribute_id,
                    value = new.value;
                    `;
                };
                await msClient.promiseQuery(sql_build_index);
            }
            if (i >= searchResult.totalPages) break;
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    extractRefinements,
    search,
    buildProductSearchEavIndex
}