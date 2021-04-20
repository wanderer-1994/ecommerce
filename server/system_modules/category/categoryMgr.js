const msClient = require("../mysql/mysql");
const mysqlutils = require("../mysql/mysqlutils");

const category_entity_columns = [
    // always declaire PRIMARY_KEY column first
    {
        column: "entity_id",
        valueInvalidMessage: `'entity_id' must be none-empty string`,
        validation_function: function (value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "name",
        valueInvalidMessage: `'name' must be none-empty string`,
        validation_function: function (value) {
            return typeof(value) === "string" && value.length > 0;
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
        column: "is_online",
        valueInvalidMessage: `'is_online' must be number 0|1 or left empty`,
        validation_function: function (value) {
            return value === 1 || value === 0;
        }
    },
    {
        column: "position",
        valueInvalidMessage: `'position' must be non-negative number (type int) or left empty`,
        validation_function: function (value) {
            return typeof(value) === "number" && value >= 0 && value === parseInt(value);
        }
    }
];
const attr_eav = ["entity_id", "attribute_id", "value"];
const { getCategoryEavTableName } = require("./category_eav_table");

async function saveCategoryEntity (category, option) {
    // category_entity: "entity_id", "name", "is_online", "position"
    // eav_varchar(255): "banner_image"
    // eav_multi_text: "title_caption", "introduction"

    try {
        if (category.entity_id === null || category.entity_id === "" && category.entity_id === undefined)
            throw new Error(`ERROR: 'entity_id' is not specified`);
        // check if category exists for case update

        if (option.mode === "UPDATE") {
            let sql_category_exist =
            `
            SELECT entity_id FROM \`ecommerce\`.category_entity
            WHERE \`entity_id\` = "${mysqlutils.escapeQuotes(category.entity_id)}";
            `;
            let match_category = await msClient.promiseQuery(sql_category_exist);
            if (match_category.length === 0) throw new Error(`ERROR: category with entity_id '${category.entity_id}' not exist`);
        }

        // main handling
        let isUserFailure = false;
        let messageUserFailure = "ERROR:";

        // check category parent exist
        if (category.parent !== null && category.parent !== "" && category.parent !== undefined && typeof(category.parent) == "string") {
            if (category.parent === category.entity_id) throw new Error(`ERROR: Invalid self parent assignment for category '${category.entity_id}'`);
            let sql_check_parent_exist_n_recursive =
            `
            WITH RECURSIVE \`cte\` (entity_id, parent) AS (
                SELECT \`entity_id\`, \`parent\`
                FROM \`ecommerce\`.category_entity
                WHERE \`entity_id\` = "${mysqlutils.escapeQuotes(category.parent)}"
                UNION ALL
                SELECT p.entity_id, p.parent
                FROM \`ecommerce\`.category_entity AS \`p\`
                INNER JOIN \`cte\` ON \`p\`.entity_id = \`cte\`.parent
            )
            SELECT * FROM \`cte\`;
            `;
            let parents = await msClient.promiseQuery(sql_check_parent_exist_n_recursive);
            if (parents.length === 0) {
                isUserFailure = true;
                messageUserFailure += `\n\t Invalid parent category: category with entity_id '${category.parent}' not exist.`
            };
            if (parents.length > 0) {
                let is_recursive_assigned = false;
                parents.forEach(parent_item => {
                    if (parent_item.parent && parent_item.parent.toString() === category.entity_id.toString()) {
                        is_recursive_assigned = true;
                    }
                });
                if (is_recursive_assigned) {
                    isUserFailure = true;
                    messageUserFailure += `\n\t Invalid recursive parent assignment: could not assign child category to be parent.`
                }
            }
        };

        let entityValidation = validateCategoryModel(category);
        if (entityValidation.m_warning) {
            category.m_warning = category.m_warning ? category.m_warning += `\n\t ${entityValidation.m_warning}` : `ERROR:\n\t ${entityValidation.m_warning}`;
        };
        if(entityValidation.m_failure) {
            messageUserFailure += entityValidation.m_failure;
        }
        if (!entityValidation.isValid) {
            isUserFailure = true;
        };
        
        let sqltb_category_entity = [];
        category_entity_columns.forEach(col_item => {
            let isNotNull;
            if (option.mode === "CREATE") {
                isNotNull = category[col_item.column] !== null && category[col_item.column] !== "" && category[col_item.column] !== undefined;
            } else if (option.mode === "UPDATE") {
                isNotNull = col_item.column in category;
            };
            if (isNotNull) {
                sqltb_category_entity.push(col_item);
            }
        });
        if (sqltb_category_entity.length > 0) {
            if (option.mode === "CREATE") {
                sqltb_category_entity =
                `
                INSERT INTO \`ecommerce\`.category_entity (${sqltb_category_entity.map(col_item => col_item.column).join(", ")})
                VALUES (${sqltb_category_entity.map(col_item => {
                    if (category[col_item.column] === null || category[col_item.column] === "" || category[col_item.column] === undefined) {
                        return "NULL";
                    } else {
                        return `"${mysqlutils.escapeQuotes(category[col_item.column])}"`;
                    }
                }).join(", ")});
                `;
            } else if (option.mode === "UPDATE") {
                if (sqltb_category_entity.length <= 1) {
                    sqltb_category_entity = null;
                } else {
                    sqltb_category_entity =
                    `
                    UPDATE \`ecommerce\`.category_entity SET ${sqltb_category_entity.map(col_item => {
                        if (col_item.column === "entity_id") return null;
                        return `${col_item.column} = ${mysqlutils.isValueEmpty(category[col_item.column]) ? "NULL" : `"${mysqlutils.escapeQuotes(category[col_item.column])}"`}`
                    }).filter(item => item !== null).join(", ")}
                    WHERE entity_id = "${mysqlutils.escapeQuotes(category.entity_id)}";
                    `
                }
            }
        };

        let sql_eav_single_value = {
            category_eav_int: [],
            category_eav_decimal: [],
            category_eav_varchar: [],
            category_eav_text: [],
            category_eav_datetime: []
        }
        let sql_eav_multi_value = [];

        (category.attributes || []).forEach(attribute => {
            // check if category_eav table has the attribute_id && data_type and html_type is valid
            let is_exist_attribute = false;
            let match = msClient.categoryEav.find(m_item => m_item.attribute_id == attribute.attribute_id);
            attribute.data_type = match ? match.data_type : null;
            attribute.html_type = match ? match.html_type : null;
            attribute.validation = match ? match.validation : null;
            let table_name = getCategoryEavTableName(attribute);
            let isValueValid = validateCategoryAttributeValue(attribute, table_name);
            if (match && !isValueValid) {
                isUserFailure = true;
                messageUserFailure += `\n\t Invalid value for attribute '${attribute.attribute_id}'`;
                return;
            }
            if (match && table_name == "category_eav_multi_value" && isValueValid) {
                sql_eav_multi_value.push(attribute);
                is_exist_attribute = true;
            } else if (match && Object.keys(sql_eav_single_value).indexOf(table_name) != -1 && isValueValid) {
                sql_eav_single_value[table_name].push(attribute);
                is_exist_attribute = true;
            }
            if (!is_exist_attribute) {
                category.m_warning = category.m_warning ? category.m_warning += `\n\t Skip invalid attribute '${attribute.attribute_id}'` : `ERROR:\n\t Skip invalid attribute '${attribute.attribute_id}'`;
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
                    WHERE entity_id = "${mysqlutils.escapeQuotes(category.entity_id)}"
                    AND attribute_id = "${mysqlutils.escapeQuotes(row_item.attribute_id)}";
                    `;
                } else if (row_item.value !== undefined) {
                    sql_row_item =
                    `
                    INSERT INTO \`ecommerce\`.${tb_item} (${attr_eav.map(col_item => col_item).join(", ")})
                    VALUES
                    ("${mysqlutils.escapeQuotes(category.entity_id)}", "${mysqlutils.escapeQuotes(row_item.attribute_id)}", "${mysqlutils.escapeQuotes(row_item.value)}") AS new
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
                DELETE FROM \`ecommerce\`.category_eav_multi_value
                WHERE entity_id = "${mysqlutils.escapeQuotes(category.entity_id)}"
                AND attribute_id = "${mysqlutils.escapeQuotes(row_item.attribute_id)}";
                `;
            }
            if (Array.isArray(row_item.value)) {
                row_item.value = row_item.value.filter(v_item => v_item !== undefined && v_item !== null && v_item !== "");
                if (row_item.value.length > 0) {
                    sql_row_item +=
                    `
                    INSERT INTO \`ecommerce\`.category_eav_multi_value (${attr_eav.map(col_item => col_item).join(", ")})
                    VALUES
                    ${row_item.value
                        .map(
                            value_item => `("${mysqlutils.escapeQuotes(category.entity_id)}", "${mysqlutils.escapeQuotes(row_item.attribute_id)}", "${mysqlutils.escapeQuotes(value_item)}")`
                        )
                        .join(",\n")
                    };
                    `;
                }
            }
            sql_eav_multi_value[index] = sql_row_item;
        })

        let assembled_sql_update_category = [
            sqltb_category_entity,
            ...sql_eav_single_value.category_eav_int,
            ...sql_eav_single_value.category_eav_decimal,
            ...sql_eav_single_value.category_eav_varchar,
            ...sql_eav_single_value.category_eav_text,
            ...sql_eav_single_value.category_eav_datetime,
            ...sql_eav_multi_value
        ];
        assembled_sql_update_category =
        `
        START TRANSACTION;
        ${assembled_sql_update_category
            .filter(item => (item !== null && item !== "" && item !== undefined))
            .join("")
        }
        COMMIT;
        `;
        assembled_sql_update_category = assembled_sql_update_category.replace(/\n+(\s|\t)+/g, "\n").replace(/;\n/g, ";\n\n");
        let result = await msClient.promiseQuery(assembled_sql_update_category);
        return result;
    } catch (err) {
        throw err;
    }
}

async function deleteCategoryEntities (category_ids) {
    let tbs_to_delete = [
        {
            tb_name: "category_entity",
            entity_column: "entity_id"
        },
        {
            tb_name: "category_eav_int",
            entity_column: "entity_id"
        },
        {
            tb_name: "category_eav_decimal",
            entity_column: "entity_id"
        },
        {
            tb_name: "category_eav_varchar",
            entity_column: "entity_id"
        },
        {
            tb_name: "category_eav_text",
            entity_column: "entity_id"
        },
        {
            tb_name: "category_eav_datetime",
            entity_column: "entity_id"
        },
        {
            tb_name: "category_eav_multi_value",
            entity_column: "entity_id"
        },
        {
            tb_name: "product_category_assignment",
            entity_column: "category_id"
        }
    ];
    let sql_delete_category =
    `
    START TRANSACTION;
    ${tbs_to_delete.map(table => {
        return `DELETE FROM \`ecommerce\`.${table.tb_name} WHERE \`${table.entity_column}\` IN (${category_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")});`
    }).join("\n")}
    UPDATE \`ecommerce\`.category_entity SET parent = NULL WHERE entity_id IN (
        SELECT entity_id FROM (
            SELECT entity_id FROM \`ecommerce\`.category_entity WHERE parent IN (${category_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")})
        ) as temp
    );
    COMMIT;
    `
    let result = await msClient.promiseQuery(sql_delete_category);
    return result;
}

function validateCategoryModel (category) {
    let isValid = true;
    let m_failure = "";
    category_entity_columns.forEach(property => {
        if (category[property.column] !== null && category[property.column] !== "" && category[property.column] !== undefined) {
            if (!property.validation_function(category[property.column])) {
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

function validateCategoryAttributeValue (attribute, table_name) {
    if (!table_name) return false;
    let isValuesValid = true;
    if (table_name === "category_eav_multi_value") {
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

module.exports = {
    saveCategoryEntity,
    deleteCategoryEntities
}