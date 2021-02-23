const mysqlutils = require("../mysql/mysqlutils");
const fulltextSearch = require("./fulltextSearch");
const msClient = require("../mysql/mysql");
const { items_per_page } = require("../../utils/const/config");
const productEntityInheritFields = ["product_id", "entity_id", "type_id"];
const attributeInheritFields = ["attribute_id", "value", "label", "html_type", "data_type", "validation", "is_super", "is_system", "unit"];
const multivalueAttributes = ["multiselect", "multiinput"];

function createSearchQueryDB ({ categories, entity_ids, refinements, searchPhrase, searchDictionary, inStock }) {
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
        let refinementComponentQueries = refinements.map(item => {
            return `(\`attribute_id\`='${mysqlutils.escapeQuotes(item.attribute_id)}' AND \`value\` IN ('${item.value.map(item => mysqlutils.escapeQuotes(item.toString())).join("\', \'")}'))`
        }).join(" OR ");
        
        queryRefinement =
        `
        SELECT product_id, 10*${refinements.length} AS \`weight\`, \'attribute\' AS \`type\` FROM
        (   SELECT product_id, GROUP_CONCAT(attribute_id) AS attribute_ids FROM
            (   SELECT \`eav\`.product_id, \`eav\`.attribute_id
                FROM \`ecommerce\`.\`product_eav_index\` AS \`eav\`
                WHERE ${refinementComponentQueries}
            ) AS \`alias\` GROUP BY product_id
        ) AS \`alias2\`
        WHERE (${refinements.map(item => `FIND_IN_SET('${mysqlutils.escapeQuotes(item.attribute_id)}', \`alias2\`.attribute_ids)`).join(" AND ")})
        `;
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
    // ## final assembled search query
    let assembledQuery = [queryCID, queryPID, queryRefinement, querySearchPhrase, queryInStock]
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

function searchConfigValidation ({ categories, entity_ids, refinements, searchPhrase, inStock }) {
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
        if (inStock == true) {
            required.push("inStock");
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

async function getDetailProducts (products) {
    if (products.length == 0) return [];
    let product_ids = products.map(item => `'${mysqlutils.escapeQuotes(item.product_id.toString())}'`).join(", ");
    let sql =
    `
    SELECT \`pe\`.entity_id, \`pe\`.product_id, \`pe\`.type_id, \`pe\`.value, \`attributes\`.*  FROM (
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_int AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_decimal AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_varchar AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_text AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_datetime AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id IN (${product_ids}) OR \`pe\`.parent IN (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, \`eav\`.attribute_id, \`eav\`.value
        FROM \`ecommerce\`.product_entity as \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_multi_value AS \`eav\` ON \`eav\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id in (${product_ids}) OR \`pe\`.parent in (${product_ids})
        UNION
        SELECT
            \`pe\`.entity_id, IF((\`pe\`.parent IS NOT NULL AND \`pe\`.parent != ''), \`pe\`.parent, \`pe\`.entity_id) AS product_id,
            \`pe\`.type_id, 'available_quantity' AS \`attribute_id\`, \`inv\`.available_quantity AS \`value\`
        FROM \`ecommerce\`.product_entity as \`pe\`
        LEFT JOIN \`ecommerce\`.inventory AS \`inv\` ON \`inv\`.entity_id = \`pe\`.entity_id
        WHERE \`pe\`.entity_id in (${product_ids}) OR \`pe\`.parent in (${product_ids})
    ) AS \`pe\`
    LEFT JOIN \`ecommerce\`.product_eav AS \`attributes\` ON \`attributes\`.attribute_id = \`pe\`.attribute_id
    ORDER BY \`pe\`.product_id, \`pe\`.entity_id
    `;
    let rawData = await msClient.promiseQuery(sql);
    let _products = modelizeProductsData(rawData);
    return _products;
}

function modelizeProductsData (rawData) {
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
                    })
                }
                product_entity.attributes = mysqlutils.groupByAttribute({
                    rawData: product_entity.__items,
                    groupBy: "attribute_id",
                    nullExcept: [null, ""]
                });
                product_entity.attributes.forEach(attr_item => {
                    if(attr_item.__items[0]){
                        if("__items" in attr_item.__items[0]){
                            throw new Error("Invalid property name \"__item\". \"__item\" is framework preserved key.")
                        }
                        attributeInheritFields.forEach(field_item => {
                            attr_item[field_item] = attr_item.__items[0][field_item] || attr_item[field_item];
                        })
                    }
                    if(multivalueAttributes.indexOf(attr_item.html_type) != -1){
                        attr_item.value = [];
                        attr_item.__items.forEach(value_item => {
                            attr_item.value.push(value_item.value);
                        })
                    }
                    delete attr_item.__items;
                });
                delete product_entity.__items;
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
    let totalPages = Math.ceil(products.length/items_per_page);
    if(currentPage > totalPages) currentPage = totalPages;
    let slice_start = (currentPage - 1)*items_per_page;
    let slice_end = currentPage*items_per_page;
    products = products.slice(slice_start, slice_end);
    products = await getDetailProducts(products);
    return {
        currentPage: currentPage,
        totalPages: totalPages,
        items_per_page: items_per_page,
        products: products
    }
}

async function buildProductSearchEavIndex () {
    try {
        let searchConfig = {};
        let result = await search(searchConfig);
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    extractRefinements,
    search,
    buildProductSearchEavIndex
}