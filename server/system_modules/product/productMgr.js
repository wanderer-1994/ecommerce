const msClient = require("../mysql/mysql");
const mysqlutils = require("../mysql/mysqlutils");

const attr_product_entity = [
    {
        column: "entity_id",
        valueInvalidMessage: `'entity_id' must be none-empty string`,
        validation_function: function (value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "type_id",
        valueInvalidMessage: `'type_id' must be enum ('simple', 'master', 'variant', 'grouped', 'bundle') or left empty`,
        validation_function: function (value) {
            return ['simple', 'master', 'variant', 'grouped', 'bundle'].indexOf(value) !== -1;
        }
    },
    {
        column: "parent",
        valueInvalidMessage: `'parent' must be none-empty string or left empty`,
        validation_function: function (value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "created_at",
        valueInvalidMessage: `'created_at' must be timestamp number or left empty`,
        validation_function: function (value) {
            return typeof(value) === "number" && value > 0 && value === parseInt(value);
        }
    },
    {
        column: "updated_at",
        valueInvalidMessage: `'updated_at' must be timestamp number or left empty`,
        validation_function: function (value) {
            return typeof(value) === "number" && value > 0 && value === parseInt(value);
        }
    }
];
const attr_product_category_assignment = ["product_id", "category_id", "position"];
const attr_inventory = ["entity_id", "available_quantity"];
const attr_tier_price = ["entity_id", "price"];
const attr_eav = ["entity_id", "attribute_id", "value"];
const { getProductEavTableName } = require("./product_eav_table");

async function saveProductEntity (product, option) {
    // product_entity: "entity_id", "type_id", "created_at", "updated_at"
    // eav_varchar(255): "sup_link", "sup_name", "sup_warranty", "thumbnail"
    // eav_multi_value: "images", "subsection"
    // eav_int: "sup_price", "is_new", "is_online"
    // inventory: "available_quantity"
    // product_category_assignment: "category"
    // product_tier_price: "tier_price"

    try {
        if (product.entity_id === null || product.entity_id === "" && product.entity_id === undefined) throw new Error("ERROR: 'entity_id' is not specified");

        // check if product exist for case update
        if (option.mode === "UPDATE") {
            let sql_product_exist =
            `
            SELECT entity_id FROM \`ecommerce\`.product_entity
            WHERE \`entity_id\` = "${mysqlutils.escapeQuotes(product.entity_id)}";
            `;
            let match_product = await msClient.promiseQuery(sql_product_exist);
            if (match_product.length === 0) throw new Error(`ERROR: category with entity_id '${product.entity_id}' is not exist`);
        };

        // main handling
        let isUserFailure = false;
        let messageUserFailure = "ERROR:";

        // check product parent exist
        if (!mysqlutils.isValueEmpty(product.parent) && typeof(product.parent) == "string") {
            let sql_check_parent_exist =
            `
            SELECT \`entity_id\`, \`type_id\` FROM \`ecommerce\`.product_entity WHERE \`entity_id\` = "${mysqlutils.escapeQuotes(product.parent)}";
            `;
            let parent = await msClient.promiseQuery(sql_check_parent_exist);
            if (parent.length === 0) {
                isUserFailure = true;
                messageUserFailure += `\n\t Invalid parent product: product with entity_id '${product.parent}' not exist.`
            };
            if (parent && parent[0] && parent[0].type_id !== "master") {
                isUserFailure = true;
                messageUserFailure += `\n\t Could not assign non-master product as parent: product with entity_id '${product.parent}' is not a master product.`
            }
            
        };

        let entityValidation = validateProductEntity(product);
        if (entityValidation.m_warning) {
            product.m_warning = product.m_warning ? product.m_warning += `\n\t ${entityValidation.m_warning}` : `ERROR:\n\t ${entityValidation.m_warning}`;
        };
        if(entityValidation.m_failure) {
            messageUserFailure += entityValidation.m_failure;
        }
        if (!entityValidation.isValid) {
            isUserFailure = true;
        };

        let sqltb_product_entity = [];
        attr_product_entity.forEach(item => {
            let isNotNull;
            if (option.mode === "CREATE") {
                isNotNull = product[item.column] !== null && product[item.column] !== "" && product[item.column] !== undefined;
            } else if (option.mode === "UPDATE") {
                isNotNull = item.column in product;
            }
            if (isNotNull) {
                sqltb_product_entity.push(item);
            }
        });
        if (sqltb_product_entity.length > 0) {
            if (option.mode === "CREATE") {
                sqltb_product_entity =
                `
                INSERT INTO \`ecommerce\`.product_entity (${sqltb_product_entity.map(col_item => col_item.column).join(", ")})
                VALUES (${sqltb_product_entity.map(col_item => {
                    if (product[col_item.column] === null || product[col_item.column] === "" || product[col_item.column] === undefined) {
                        return "NULL";
                    } else {
                        return `"${mysqlutils.escapeQuotes(product[col_item.column])}"`;
                    }
                }).join(", ")});
                `;
            } else if (option.mode === "UPDATE") {
                if (sqltb_product_entity.length <= 1) {
                    sqltb_product_entity = null;
                } else {
                    sqltb_product_entity =
                    `
                    UPDATE \`ecommerce\`.product_entity SET ${sqltb_product_entity.map(col_item => {
                        if (col_item.column === "entity_id") return null;
                        return `${col_item.column} = ${mysqlutils.isValueEmpty(product[col_item.column]) ? "NULL" : `"${mysqlutils.escapeQuotes(product[col_item.column])}"`}`
                    }).filter(item => item !== null).join(", ")}
                    WHERE entity_id = "${mysqlutils.escapeQuotes(product.entity_id)}";
                    `;
                }
            }
        } else {
            sqltb_product_entity = null;
        }

        let sql_product_category_assignment;

        // use switch is just a coding cheat to create a block where I can break anytime I want
        // if assign product to any category & no type_id specified: ensure product type_id is not "variant"
        switch (option.mode) {
            default:
                if (product.categories === undefined && option.mode === "UPDATE") break;
                if (mysqlutils.isValueEmpty(product.categories) || (Array.isArray(product.categories) && product.categories.length === 0) ) {
                    sql_product_category_assignment =
                    `
                    DELETE FROM \`ecommerce\`.product_category_assignment WHERE \`product_id\` = "${mysqlutils.escapeQuotes(product.entity_id)}";
                    `
                    break;
                }
                if (!Array.isArray(product.categories)) {
                    isUserFailure = true;
                    messageUserFailure += `\n\t Invalid category assignment`;
                    break;
                };
                let validation = await validateProductCategoryAssignment(product.categories);
                if (validation.m_warning) {
                    product.m_warning = product.m_warning ? product.m_warning += `\n\t ${validation.m_warning}` : `ERROR:\n\t ${validation.m_warning}`;
                };
                if(validation.m_failure) {
                    messageUserFailure += validation.m_failure;
                }
                if (!validation.isValid) {
                    isUserFailure = true;
                    break;
                };
                let unassign_category = product.categories.filter(item => item.action === "UNASSIGN");
                let assign_category = product.categories.filter(item => !("action" in item) || item.action === "ASSIGN");
                if (unassign_category.length > 0) {
                    unassign_category =
                    `
                    DELETE FROM \`ecommerce\`.product_category_assignment
                    WHERE \`product_id\` = "${mysqlutils.escapeQuotes(product.entity_id)}"
                    AND \`category_id\` IN (${unassign_category.map(item => `"${mysqlutils.escapeQuotes(item.category_id)}"`).join(", ")});
                    `;
                } else {
                    unassign_category = "";
                }
                if (assign_category.length > 0) {
                    // if assign product to any category & no type_id specified: ensure product type_id is not "variant"
                    if (option.mode === "CREATE" && product.type_id === "variant") {
                        isUserFailure = true;
                        messageUserFailure += `\n\t Could not assign variant product to category!`;
                    } else if (option.mode === "UPDATE") {
                        let sql_check_product_type = `SELECT entity_id, type_id FROM \`ecommerce\`.product_entity WHERE entity_id = "${mysqlutils.escapeQuotes(product.entity_id)}";`;
                        let product_type = await msClient.promiseQuery(sql_check_product_type);
                        if (product_type && product_type[0] && product_type[0].type_id === "variant") {
                            isUserFailure = true;
                            messageUserFailure += `\n\t Could not assign variant product ${product.entity_id} to category!`;
                        }
                    };
                    assign_category =
                    `
                    INSERT INTO \`ecommerce\`.product_category_assignment (${attr_product_category_assignment.map(item => item).join(",")})
                    VALUES
                    ${assign_category
                        .map(item =>
                            `("${mysqlutils.escapeQuotes(product.entity_id)}", "${mysqlutils.escapeQuotes(item.category_id)}", "${item.position ? item.position : 0}")`
                        ).join(",\n")
                    }
                    AS new
                    ON DUPLICATE KEY UPDATE
                    ${attr_product_category_assignment.map(item => `${item} = new.${item}`).join(",\n")};
                    `;
                } else {
                    assign_category = "";
                }
                sql_product_category_assignment = unassign_category + assign_category;
                break;
        };

        let sql_inventory;
        switch (option.mode) {
            default:
                if (product.available_quantity === undefined && option.mode === "UPDATE") break;
                if (product.available_quantity === null || product.available_quantity === "" || product.available_quantity === undefined) {
                    sql_inventory =
                    `
                    DELETE FROM \`ecommerce\`.inventory WHERE \`entity_id\` = "${mysqlutils.escapeQuotes(product.entity_id)}";
                    `
                    break;
                };
                let validation = validateProductInventory(product.available_quantity);
                if (validation.m_warning) {
                    product.m_warning = product.m_warning ? product.m_warning += `\n\t ${validation.m_warning}` : `ERROR:\n\t ${validation.m_warning}`;
                };
                if(validation.m_failure) {
                    messageUserFailure += validation.m_failure;
                }
                if (!validation.isValid) {
                    isUserFailure = true;
                    break;
                };
                sql_inventory =
                `
                INSERT INTO \`ecommerce\`.inventory (${attr_inventory.map(col_item => col_item).join(", ")})
                VALUES ("${mysqlutils.escapeQuotes(product.entity_id)}", ${product.available_quantity}) AS new
                ON DUPLICATE KEY UPDATE
                ${attr_inventory.map(col_item => `${col_item} = new.${col_item}`).join(",\n")};
                `;
                break;
        }

        let sql_price;
        switch (option.mode) {
            default:
                if (product.tier_price === undefined && option.mode === "UPDATE") break;
                if (product.tier_price === null || product.tier_price === "" || product.tier_price === undefined) {
                    sql_inventory =
                    `
                    DELETE FROM \`ecommerce\`.product_tier_price WHERE \`entity_id\` = "${mysqlutils.escapeQuotes(product.entity_id)}";
                    `
                    break;
                };
                let validation = validateTierPrice(product.tier_price);
                if (validation.m_warning) {
                    product.m_warning = product.m_warning ? product.m_warning += `\n\t ${validation.m_warning}` : `ERROR:\n\t ${validation.m_warning}`;
                };
                if(validation.m_failure) {
                    messageUserFailure += validation.m_failure;
                }
                if (!validation.isValid) {
                    isUserFailure = true;
                    break;
                };
                sql_price =
                `
                INSERT INTO \`ecommerce\`.product_tier_price (${attr_tier_price.map(col_item => col_item).join(", ")})
                VALUES ("${mysqlutils.escapeQuotes(product.entity_id)}", ${product.tier_price}) AS new
                ON DUPLICATE KEY UPDATE
                ${attr_tier_price.map(col_item => `${col_item} = new.${col_item}`).join(",\n")};
                `;
                break;
        }

        // if set type_id to variant, remove all category-assignment & child-product of product
        // if set type_id to simple, remove all child-product of product
        let sql_if_variant;
        switch (option.mode) {
            case "UPDATE":
                if (product.type_id === "variant") {
                    sql_if_variant =
                    `
                    UPDATE \`ecommerce\`.product_entity SET type_id="simple", parent = NULL WHERE parent = "${mysqlutils.escapeQuotes(product.entity_id)}";
                    DELETE FROM \`ecommerce\`.product_category_assignment WHERE \`product_id\` = "${mysqlutils.escapeQuotes(product.entity_id)}";
                    `;
                    break;
                };
                if (product.type_id === "simple") {
                    sql_if_variant =
                    `
                    UPDATE \`ecommerce\`.product_entity SET type_id="simple", parent = NULL WHERE parent = "${mysqlutils.escapeQuotes(product.entity_id)}";
                    `;
                    break;
                };
            default:
                break;
        };

        let sql_eav_single_value = {
            product_eav_int: [],
            product_eav_decimal: [],
            product_eav_varchar: [],
            product_eav_text: [],
            product_eav_datetime: []
        }
        let sql_eav_multi_value = [];

        (product.attributes || []).forEach(attribute => {
            // check if product_eav table has the attribute_id && data_type and html_type is valid
            let is_exist_attribute = false;
            let match = msClient.productEav.find(m_item => m_item.attribute_id == attribute.attribute_id);
            attribute.data_type = match ? match.data_type : null;
            attribute.html_type = match ? match.html_type : null;
            attribute.validation = match ? match.validation : null;
            let table_name = getProductEavTableName(attribute);
            let isValueValid = validateProductAttributeValue(attribute, table_name);
            if (match && !isValueValid) {
                isUserFailure = true;
                messageUserFailure += `\n\t Invalid value for attribute '${attribute.attribute_id}'`;
                return;
            }
            if (match && table_name == "product_eav_multi_value" && isValueValid) {
                sql_eav_multi_value.push(attribute);
                is_exist_attribute = true;
            } else if (match && Object.keys(sql_eav_single_value).indexOf(table_name) != -1 && isValueValid) {
                sql_eav_single_value[table_name].push(attribute);
                is_exist_attribute = true;
            }
            if (!is_exist_attribute) {
                product.m_warning = product.m_warning ? product.m_warning += `\n\t Skip invalid attribute '${attribute.attribute_id}'` : `ERROR:\n\t Skip invalid attribute '${attribute.attribute_id}'`;
            }
        });

        if (isUserFailure) {
            throw new Error(messageUserFailure);
        };

        Object.keys(sql_eav_single_value).forEach(tb_item => {
            sql_eav_single_value[tb_item].forEach((row_item, index) => {
                // case value in ("" or null): delete that attribute value of product
                // case value = undefined (no value property in attribute object): no update
                // case value in (number or string): update attribute value for product
                let sql_row_item;
                if (row_item.value === null || row_item.value === "") {
                    sql_row_item =
                    `
                    DELETE FROM \`ecommerce\`.${tb_item}
                    WHERE entity_id = "${mysqlutils.escapeQuotes(product.entity_id)}"
                    AND attribute_id = "${mysqlutils.escapeQuotes(row_item.attribute_id)}";
                    `;
                } else if (row_item.value !== undefined) {
                    sql_row_item =
                    `
                    INSERT INTO \`ecommerce\`.${tb_item} (${attr_eav.map(col_item => col_item).join(", ")})
                    VALUES
                    ("${mysqlutils.escapeQuotes(product.entity_id)}", "${mysqlutils.escapeQuotes(row_item.attribute_id)}", "${mysqlutils.escapeQuotes(row_item.value)}") AS new
                    ON DUPLICATE KEY UPDATE
                    ${attr_eav.map(col_item => `${col_item} = new.${col_item}`).join(",\n")};
                    `;
                }
                sql_eav_single_value[tb_item][index] = sql_row_item
            })
        });

        sql_eav_multi_value.forEach((row_item, index) => {
            // same rule as single_value_attributes
            let sql_row_item;
            if (row_item.value !== undefined) {
                sql_row_item =
                `
                DELETE FROM \`ecommerce\`.product_eav_multi_value
                WHERE entity_id = "${mysqlutils.escapeQuotes(product.entity_id)}"
                AND attribute_id = "${mysqlutils.escapeQuotes(row_item.attribute_id)}";
                `;
            }
            if (Array.isArray(row_item.value)) {
                row_item.value = row_item.value.filter(v_item => v_item !== undefined && v_item !== null && v_item !== "");
                if (row_item.value.length > 0) {
                    sql_row_item +=
                    `
                    INSERT INTO \`ecommerce\`.product_eav_multi_value (${attr_eav.map(col_item => col_item).join(", ")})
                    VALUES
                    ${row_item.value
                        .map(
                            value_item => `("${mysqlutils.escapeQuotes(product.entity_id)}", "${mysqlutils.escapeQuotes(row_item.attribute_id)}", "${mysqlutils.escapeQuotes(value_item)}")`
                        )
                        .join(",\n")
                    };
                    `;
                }
            }
            sql_eav_multi_value[index] = sql_row_item;
        })

        let assembled_sql_update_product = [
            sqltb_product_entity,
            sql_product_category_assignment,
            sql_inventory,
            sql_price,
            sql_if_variant,
            ...sql_eav_single_value.product_eav_int,
            ...sql_eav_single_value.product_eav_decimal,
            ...sql_eav_single_value.product_eav_varchar,
            ...sql_eav_single_value.product_eav_text,
            ...sql_eav_single_value.product_eav_datetime,
            ...sql_eav_multi_value
        ];
        assembled_sql_update_product =
        `
        START TRANSACTION;
        ${assembled_sql_update_product
            .filter(item => !mysqlutils.isValueEmpty(item))
            .join("")
        }
        COMMIT;
        `;
        assembled_sql_update_product = assembled_sql_update_product.replace(/\n+(\s|\t)+/g, "\n").replace(/;\n/g, ";\n\n");
        let result = await msClient.promiseQuery(assembled_sql_update_product);
        return result;
    } catch (err) {
        throw err;
    }
}

async function deleteProductEntities (product_ids) {
    let tbs_to_delete = [
        {
            tb_name: "product_entity",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_eav_int",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_eav_decimal",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_eav_varchar",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_eav_text",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_eav_datetime",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_eav_multi_value",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_category_assignment",
            entity_column: "product_id"
        },
        {
            tb_name: "inventory",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_tier_price",
            entity_column: "entity_id"
        }
    ];
    let sql_delete_product =
    `
    START TRANSACTION;
    ${tbs_to_delete.map(table => {
        return `DELETE FROM \`ecommerce\`.${table.tb_name} WHERE \`${table.entity_column}\` IN (${product_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")});`
    }).join("\n")}
    UPDATE \`ecommerce\`.product_entity SET parent = NULL WHERE entity_id IN (
        SELECT entity_id FROM (
            SELECT entity_id FROM \`ecommerce\`.product_entity WHERE parent IN (${product_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")})
        ) as temp
    );
    COMMIT;
    `
    let result = await msClient.promiseQuery(sql_delete_product);
    return result;
};

async function getProductEntityOnly ({ searchConfig, pagination }) {
    try {
        let sql_search_product =
        `
        SELECT \`pe\`.*, \`pev\`.value AS \`name\`
        FROM \`ecommerce\`.product_entity AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_varchar AS \`pev\`
        ON \`pev\`.attribute_id = "name" AND \`pev\`.entity_id = \`pe\`.entity_id
        `;
        let conditions = [];
        if (searchConfig.entity_ids && searchConfig.entity_ids.length > 0) {
            conditions.push(
                `\`pe\`.entity_id IN (${searchConfig.entity_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")})`
            );
        }
        if (searchConfig.type_ids && searchConfig.type_ids.length > 0) {
            conditions.push(
                `\`pe\`.type_id IN (${searchConfig.type_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")})`
            );
        }
        if (searchConfig.searchPhrase.length > 0) {
            conditions.push(
                `UPPER(\`pev\`.value) LIKE "%${mysqlutils.escapeQuotes(searchConfig.searchPhrase.toUpperCase())}%"`
            )
        }
        if (conditions.length === 0) {
            sql_search_product += `;`;
        } else {
            sql_search_product += ` WHERE ${conditions.join(" AND ")};`;
        }
        let products = await msClient.promiseQuery(sql_search_product);
        let totalFound = products.length;
        if (pagination.psize === "infinite") {
            pagination.psize = products.length;
        }
        let totalPages = Math.ceil(products.length/pagination.psize);
        if(pagination.page > totalPages) pagination.page = totalPages;
        let slice_start = (pagination.page - 1) * pagination.psize;
        let slice_end = pagination.page * pagination.psize;
        products = products.slice(slice_start, slice_end);
        return {
            currentPage: pagination.page,
            totalPages: totalPages,
            totalFound: totalFound,
            send: products.length,
            psize: pagination.psize,
            products: products
        }
    } catch (err) {
        throw err;
    }
}

function validateProductEntity (product) {
    let isValid = true;
    let m_failure = "";
    attr_product_entity.forEach(property => {
        if (!mysqlutils.isValueEmpty(product[property.column])) {
            if (!property.validation_function(product[property.column])) {
                isValid = false;
                m_failure += `\n\t Invalid entity property: ${property.valueInvalidMessage}.`
            }
        }
    });
    return {
        isValid: isValid,
        m_failure: m_failure
    };
}

function validateProductAttributeValue (attribute, table_name) {
    if (!table_name) return false;
    let isValuesValid = true;
    if (table_name === "product_eav_multi_value") {
        // case attribute value is of type multi_value: value must be in (null, "", undefined, or a an empty array or array contains valid and not null value)
        if (attribute.value !== null && attribute.value !== "" && attribute.value !== undefined && !Array.isArray(attribute.value)) {
            isValuesValid = false;
        } else if (Array.isArray(attribute.value)) {
            for (let i = 0; i < attribute.value.length; i ++) {
                if (attribute.value[i] === null || attribute.value[i] === "" || attribute.value[i] === undefined) {
                    isValuesValid = false;
                } else {
                    isValuesValid = mysqlutils.validateValue({
                        value: attribute.value[i],
                        data_type: attribute.data_type,
                        html_type: attribute.html_type,
                        validation: attribute.validation
                    })
                };
                if (!isValuesValid) break;
            }
        }
    } else {
        // case attribute value is of type single_value: value must in (null, "", undefined, or a valid value)
        if (attribute.value !== null && attribute.value !== "" && attribute.value !== undefined) {
            isValuesValid = mysqlutils.validateValue({
                value: attribute.value,
                data_type: attribute.data_type,
                html_type: attribute.html_type,
                validation: attribute.validation
            })
        }
    };
    return isValuesValid;
}

async function validateProductCategoryAssignment (category_assignments) {
    let isValid = true;
    let m_failure = "";
    category_assignments.forEach(item => {
        if (item.category_id === null || item.category_id === "" || item.category_id === undefined) {
            isValid = false;
            m_failure += `\n\t Invalid assignment for category_id '${item.category_id}: 'category_id' must not be empty.`;  
        };
        if ("action" in item && item.action !== "ASSIGN" && item.action !== "UNASSIGN") {
            isValid = false;
            m_failure += `\n\t Invalid assignment for category_id '${item.category_id}': 'action' must be 'ASSIGN' or 'UNASSIGN'.`;
        };
        if (
            "position" in item &&
            item.position !== null &&
            item.position !== "" &&
            item.position !== undefined &&
            typeof(item.position) !== "number"
        ) {
            isValid = false;
            m_failure += `\n\t Invalid assignment for category_id '${item.category_id}: position must be a number or left empty.`;
        };
        let duplicate = category_assignments.filter(m_item => m_item.category_id === item.category_id);
        if (duplicate.length !== 1) {
            isValid = false;
            m_failure += `\n\t Invalid assignment for category_id '${item.category_id}: duplicate 'category_id' in category list.`;
        }
    });
    
    if (!isValid) {
        return {
            isValid: false,
            m_failure: m_failure
        }
    };
    let sql_check_category_exist =
    `
    SELECT \`entity_id\` FROM \`ecommerce\`.category_entity
    WHERE \`entity_id\` IN (${category_assignments.map(item => `"${mysqlutils.escapeQuotes(item.category_id)}"`).join(", ")});
    `
    let available_categories = await msClient.promiseQuery(sql_check_category_exist);
    category_assignments.forEach(item => {
        if (!available_categories.find(m_item => m_item.entity_id === item.category_id)) {
            isValid = false;
            m_failure += `\n\t Invalid assignment for category_id '${item.category_id}: category_id not exist.`;
        }
    });
    return {
        isValid: isValid,
        m_failure: m_failure
    }
}

function validateProductInventory (available_quantity) {
    if (typeof(available_quantity) !== "number" || available_quantity !== parseInt(available_quantity) || available_quantity < 0) {
        return {
            isValid: false,
            m_failure: `\n\t Invalid product stock quantity: 'available_quantity' must be a non-negative number (type int) or left empty.`,
        }
    };
    return {
        isValid: true,
    };
}

function validateTierPrice (price) {
    if (typeof(price) !== "number" || price < 0) {
        return {
            isValid: false,
            m_failure: `\n\t Invalid product tier price: 'tier_price' must be a non-negative number or left empty.`,
        }
    }
    return {
        isValid: true,
    }
}

module.exports = {
    saveProductEntity,
    deleteProductEntities,
    getProductEntityOnly
}