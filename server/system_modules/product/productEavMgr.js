const msClient = require("../../system_modules/mysql/mysql");
const mysqlutils = require("../../system_modules/mysql/mysqlutils");
const eavCommon = require("../common/eav/eavCommon");
const product_eav_columns = eavCommon.eav_columns;
const product_eav_option_columns = eavCommon.eav_option_columns;

async function getProductEavs () {
    try {
        let sql_get_product_eav =
        `
        SELECT \`pe\`.*, \`peo\`.label AS option_label, \`peo\`.sort_order, \`peo\`.value AS \`option_value\`
        FROM \`ecommerce\`.product_eav AS \`pe\`
        LEFT JOIN \`ecommerce\`.product_eav_option AS \`peo\`
        ON \`pe\`.html_type IN ('select', 'multiselect') AND \`pe\`.attribute_id = \`peo\`.attribute_id;
        `;
        let rawData = await msClient.promiseQuery(sql_get_product_eav);
        let product_eavs = modelizeProductEavs(rawData);
        return product_eavs;
    } catch (err) {
        throw err;
    }
}

async function saveProductEav (product_eav, option) {
    try {
        let validation = validateProductEavModel(product_eav);
        if (validation.m_warning) {
            product_eav.m_warning = `WARNING: \n\t ${validation.m_warning}`;
        }
        if (!validation.isValid) {
            throw new Error( `ERROR: \n\t ${validation.m_failure}`);
        };

        // check if product_eav exist for case update
        let match = msClient.productEav.find(m_item => m_item.attribute_id === product_eav.attribute_id) || {};
        if (option.mode === "UPDATE") {
            if (match.attribute_id === undefined) throw new Error(`ERROR: product_eav with attribute_id '${product_eav.attribute_id}' not exist`);
        };

        let sql_product_eav_entity = [];
        product_eav_columns.forEach(col_item => {
            let isNotNull;
            if (option.mode === "UPDATE") {
                isNotNull = col_item.column in product_eav;
            } else if(option.mode === "CREATE") {
                isNotNull = product_eav[col_item.column] !== null && product_eav[col_item.column] !== "" && product_eav[col_item.column] !== undefined
            };
            if (isNotNull) {
                sql_product_eav_entity.push(col_item);
            }
        });
        if (sql_product_eav_entity.length > 0) {
            if (option.mode === "CREATE") {
                sql_product_eav_entity =
                `
                INSERT INTO \`ecommerce\`.product_eav (${sql_product_eav_entity.map(col_item => col_item.column).join(", ")})
                VALUES (${sql_product_eav_entity.map(col_item => {
                    if (product_eav[col_item.column] === null || product_eav[col_item.column] === "" || product_eav[col_item.column] === undefined) {
                        return "NULL";
                    } else {
                        return `"${mysqlutils.escapeQuotes(product_eav[col_item.column])}"`;
                    }
                }).join(", ")});
                `;
            } else if (option.mode === "UPDATE") {
                if (sql_product_eav_entity.length <= 1) {
                    sql_product_eav_entity = null;
                } else {
                    sql_product_eav_entity =
                    `
                    UPDATE \`ecommerce\`.product_eav SET ${sql_product_eav_entity.map(col_item => {
                        if (col_item.column === "attribute_id") return null;
                        return `${col_item.column} = ${
                            product_eav[col_item.column] === null || product_eav[col_item.column] === "" || product_eav[col_item.column] === undefined ?
                            "NULL" :
                            `"${mysqlutils.escapeQuotes(product_eav[col_item.column])}"`}`
                    }).filter(item => item !== null).join(", ")}
                    WHERE attribute_id = "${mysqlutils.escapeQuotes(product_eav.attribute_id)}";
                    `
                }
            }
        } else {
            sql_product_eav_entity = null;
        };
        
        let sql_eav_option;
        switch (option.mode) {
            default:
                if (['select', 'multiselect'].indexOf(product_eav.html_type || match.html_type) === -1) {
                    sql_eav_option =
                    `
                    DELETE FROM \`ecommerce\`.product_eav_option WHERE \`attribute_id\` = "${mysqlutils.escapeQuotes(product_eav.attribute_id)}";
                    `;
                    break;
                }
                if (!("options" in product_eav) && option.mode === "UPDATE") break;
                sql_eav_option =
                `
                DELETE FROM \`ecommerce\`.product_eav_option WHERE \`attribute_id\` = "${mysqlutils.escapeQuotes(product_eav.attribute_id)}";
                `;
                if (product_eav.options && product_eav.options.length > 0) {
                    sql_eav_option +=
                    `
                    INSERT INTO \`ecommerce\`.product_eav_option (${product_eav_option_columns.map(col_item => col_item.column).join(", ")})
                    VALUES
                    ${product_eav.options.map(opt_item => `("${mysqlutils.escapeQuotes(product_eav.attribute_id)}" , "${mysqlutils.escapeQuotes(opt_item.option_value)}", ${!mysqlutils.isValueEmpty(opt_item.label) ? `"${mysqlutils.escapeQuotes(opt_item.label)}"` : "NULL"}, ${opt_item.sort_order ? `"${mysqlutils.escapeQuotes(opt_item.sort_order)}"` : "NULL"})`).join(",\n")}
                    AS new
                    ON DUPLICATE KEY UPDATE 
                    ${product_eav_option_columns.map(col_item => `${col_item.column} = new.${col_item.column}`).join(",\n")};
                    `;
                }
        };

        let assembled_sql = [sql_product_eav_entity, sql_eav_option].filter(item => item !== null && item !== "" && item !== undefined);
        if (assembled_sql.length > 0) {
            assembled_sql =
            `
            START TRANSACTION;
            ${assembled_sql.join("\n")}
            COMMIT;
            `;
            assembled_sql = assembled_sql.replace(/\n+(\s|\t)+/g, "\n").replace(/;\n/g, ";\n\n");
            let result = await msClient.promiseQuery(assembled_sql);
            return result;
        };
        return null;
    } catch (err) {
        throw err;
    }
};

async function deleteProductEavs (product_eav_ids, option) {
    try {
        // validate input
        let isValid = true;
        product_eav_ids.forEach(eav_id => {
            if (!validateProductEavId(eav_id)) {
                isValid = false;
            }
        });
        if (!isValid) throw new Error("ERROR: product 'entity_id' must be non-empty string or number.");
        let tbs_to_delete = [
            {
                tb_name: "product_eav",
                entity_column: "attribute_id"
            },
            {
                tb_name: "product_eav_int",
                entity_column: "attribute_id"
            },
            {
                tb_name: "product_eav_decimal",
                entity_column: "attribute_id"
            },
            {
                tb_name: "product_eav_varchar",
                entity_column: "attribute_id"
            },
            {
                tb_name: "product_eav_text",
                entity_column: "attribute_id"
            },
            {
                tb_name: "product_eav_datetime",
                entity_column: "attribute_id"
            },
            {
                tb_name: "product_eav_multi_value",
                entity_column: "attribute_id"
            },
            {
                tb_name: "product_eav_option",
                entity_column: "attribute_id"
            },
            {
                tb_name: "eav_group_assignment",
                entity_column: "attribute_id",
                extra: `AND \`entity_type\` = "product"`
            }
        ];
        let sql_delete_product_eav =
        `
        START TRANSACTION;
        ${tbs_to_delete.map(table => {
            return `DELETE FROM \`ecommerce\`.${table.tb_name} WHERE \`${table.entity_column}\` IN (${product_eav_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")})${table.extra ? ` ${table.extra}` : ""};`
        }).join("\n")}
        COMMIT;
        `
        let result = await msClient.promiseQuery(sql_delete_product_eav);
        return result;
    } catch (err) {
        throw err;
    }
};

function modelizeProductEavs (rawData) {
    let product_eavs = mysqlutils.groupByAttribute({
        rawData: rawData,
        groupBy: "attribute_id",
        nullExcept: ["", null]
    });
    product_eavs.forEach(eav => {
        if (eav.__items && eav.__items[0]) {
            product_eav_columns.forEach(col_item => {
                eav[col_item.column] = eav.__items[0][col_item.column];
            });
            if (['select', 'multiselect'].indexOf(eav.html_type) !== -1) {
                eav.options = [];
                (eav.__items || []).forEach(option => {
                    if (!mysqlutils.isValueEmpty(option.option_value)) {
                        eav.options.push({
                            option_value: mysqlutils.convertDataType(option.option_value, eav.data_type),
                            label: option.option_label,
                            sort_order: option.sort_order
                        })
                    }
                })
            };
        };
        delete eav.__items;
    });

    product_eavs.forEach(eav => {
        ["admin_only", "is_super", "is_system"].forEach(col_item => {
            if (eav[col_item] !== null && eav[col_item] !== "" && eav[col_item] !== undefined) {
                eav[col_item] = parseInt(eav[col_item]);
            }
        })
    })

    return product_eavs;
}

function validateProductEavModel (product_eav) {
    let isValid = true;
    let m_failure = "";
    let match_eav_definition = msClient.productEav.find(m_item => m_item.attribute_id === product_eav.attribute_id) || {};
    if (["number", "string"].indexOf(typeof(product_eav.attribute_id)) === -1 || product_eav.attribute_id.toString().length === 0) {
        isValid = false;
        m_failure += `'attribute_id' must not be empty.`
    }
    product_eav_columns.forEach(col_item => {
        if (product_eav[col_item.column] !== null && product_eav[col_item.column] !== "" && product_eav[col_item.column] !== undefined) {
            if (!col_item.validation_function(product_eav[col_item.column])) {
                isValid = false;
                m_failure += `\n\t ${col_item.valueInvalidMessage}`;
            }
        }
    });
    if ("options" in product_eav) {
        if (['select', 'multiselect'].indexOf(product_eav.html_type || match_eav_definition.html_type) === -1) {
            isValid = false;
            m_failure += `'options' can only applied for html_type ('select', 'multiselect').`;
        };
        if (!Array.isArray(product_eav.options)) {
            isValid = false;
            m_failure += `invalid 'options'.`
        };
        if (Array.isArray(product_eav.options)) {
            product_eav.options.forEach(opt_item => {
                if (!opt_item || mysqlutils.isValueEmpty(opt_item.option_value)) {
                    isValid = false;
                    m_failure += `invalid 'options' value.`;
                    return;
                };
                if (!mysqlutils.isValueEmpty(opt_item.sort_order) && typeof(opt_item.sort_order) !== "number") {
                    isValid = false;
                    m_failure += `invalid 'sort_order' for option. 'sort_order' must be number or left empty.`;
                    return;
                };
                if (!mysqlutils.isValueEmpty(opt_item.label) && typeof(opt_item.label) !== "string") {
                    isValid = false;
                    m_failure += `invalid 'label' for option. 'label' must be string or left empty.`;
                    return;
                };
                let is_data_valid = mysqlutils.validateValue({
                    value: opt_item.option_value,
                    data_type: product_eav.data_type || match_eav_definition.data_type,
                    html_type: product_eav.html_type || match_eav_definition.html_type
                });
                if (!is_data_valid) {
                    isValid = false;
                    m_failure += `invalid 'options' value.`
                }
            })
        };
    }
    return {
        isValid: isValid,
        m_failure: m_failure
    }
}

function validateProductEavId (product_eav_id) {
    if ((typeof(product_eav_id) !== "string" && typeof(product_eav_id) !== "number") || product_eav_id.toString().length === 0) {
        return false;
    };
    return true;
}

module.exports = {
    getProductEavs,
    saveProductEav,
    deleteProductEavs
}