const msClient = require("../../system_modules/mysql/mysql");
const mysqlutils = require("../../system_modules/mysql/mysqlutils");
const product_eav_columns = [
    {
        column: "attribute_id",
        valueInvalidMessage: "'attribute_id' must be number or none-empty string.",
        validation_function: function (value) {
            return (typeof(value) === "string" || typeof(value) === "number") && value.toString().length > 0;
        }
    },
    {
        column: "label",
        valueInvalidMessage: "'label' must be none-empty string.",
        validation_function: function (value) {
            return typeof(value) === "string" && value.toString().length > 0;
        }
    },
    {
        column: "referred_target",
        valueInvalidMessage: "'referred_target' must be none-empty string.",
        validation_function: function (value) {
            return typeof(value) === "string" && value.toString().length > 0;
        }
    },
    {
        column: "admin_only",
        valueInvalidMessage: "'admin_only' must be enum (0, 1).",
        validation_function: function (value) {
            return value === 0 || value === 1;
        }
    },
    {
        column: "html_type",
        valueInvalidMessage: "'html_type' must be enum ('input', 'multiinput', 'select', 'multiselect', 'password', 'boolean').",
        validation_function: function (value) {
            return ['input', 'multiinput', 'select', 'multiselect', 'password', 'boolean'].indexOf(value) !== -1;
        }
    },
    {
        column: "data_type",
        valueInvalidMessage: "'data_type' must be enum ('int', 'decimal', 'varchar', 'text', 'html', 'datetime').",
        validation_function: function (value) {
            return ['int', 'decimal', 'varchar', 'text', 'html', 'datetime'].indexOf(value) !== -1;
        }
    },
    {
        column: "validation",
        valueInvalidMessage: "'validation' must be none-empty string",
        validation_function: function (value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "is_super",
        valueInvalidMessage: "'is_super' must be enum (0, 1).",
        validation_function: function (value) {
            return value === 0 || value === 1;
        }
    },
    {
        column: "is_system",
        valueInvalidMessage: "'is_system' must be enum (0, 1).",
        validation_function: function (value) {
            return value === 0 || value === 1;
        }
    },
    {
        column: "unit",
        valueInvalidMessage: "'unit' must be none-empty string",
        validation_function: function (value) {
            return typeof(value) === "string" && value.length > 0;
        }
    }
];
const product_eav_option_columns = [
    {
        column: "attribute_id"
    },
    {
        column: "value"
    },
    {
        column: "sort_order"
    }
];

async function getProductEavs () {
    try {
        let sql_get_product_eav =
        `
        SELECT \`pe\`.*, \`peo\`.sort_order, \`peo\`.value AS \`option_value\`
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
        if (option.mode === "UPDATE") {
            let match = msClient.productEav.find(m_item => m_item.attribute_id === product_eav.attribute_id);
            if (!match) throw new Error(`ERROR: product_eav with attribute_id '${product_eav.attribute_id}' not exist`);
            product_eav.html_type = product_eav.html_type || match.html_type;
            product_eav.data_type = product_eav.data_type || match.data_type;
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
            sql_product_eav_entity =
            `
            INSERT INTO \`ecommerce\`.product_eav (${sql_product_eav_entity.map(item => item.column).join(", ")})
            VALUES (${sql_product_eav_entity.map(item => {
                if (product_eav[item.column] === null || product_eav[item.column] === "" || product_eav[item.column] === undefined) {
                    return "NULL";
                } else {
                    return `"${mysqlutils.escapeQuotes(product_eav[item.column])}"`;
                }
            }).join(", ")}) AS new
            ${option.mode === "UPDATE" ? `ON DUPLICATE KEY UPDATE
            ${sql_product_eav_entity.map(item => `${item.column} = new.${item.column}`).join(",\n")}` : ""};
            `;
        } else {
            sql_product_eav_entity = null;
        };
        
        let sql_eav_option;
        switch (option.mode) {
            default:
                if (['select', 'multiselect'].indexOf(product_eav.html_type) === -1) {
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
                if (product_eav.options && product_eav.options.length > 0 && ['select', 'multiselect'].indexOf(product_eav.html_type) !== -1) {
                    sql_eav_option +=
                    `
                    INSERT INTO \`ecommerce\`.product_eav_option (${product_eav_option_columns.map(col_item => col_item.column).join(", ")})
                    VALUES
                    ${product_eav.options.map(opt_item => `("${mysqlutils.escapeQuotes(product_eav.attribute_id)}" , "${mysqlutils.escapeQuotes(opt_item.option_value)}", ${opt_item.sort_order ? `"${mysqlutils.escapeQuotes(opt_item.sort_order)}"` : "NULL"})`).join(",\n")}
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
            }
        ];
        let sql_delete_product_eav =
        `
        START TRANSACTION;
        ${tbs_to_delete.map(table => {
            return `DELETE FROM \`ecommerce\`.${table.tb_name} WHERE \`${table.entity_column}\` IN (${product_eav_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")});`
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
                    if (option.option_value !== null && option.option_value !== "" && option.option_value !== undefined) {
                        eav.options.push({
                            option_value: mysqlutils.convertDataType(option.option_value, eav.data_type),
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
        if (['select', 'multiselect'].indexOf(product_eav.html_type) === -1) {
            isValid = false;
            m_failure += `'options' can only applied for html_type ('select', 'multiselect').`;
        };
        if (!Array.isArray(product_eav.options)) {
            isValid = false;
            m_failure += `invalid 'options'.`
        };
        if (Array.isArray(product_eav.options)) {
            product_eav.options.forEach(opt_item => {
                if (!opt_item || opt_item.option_value === null && opt_item.option_value === "" && opt_item.option_value === undefined) {
                    isValid = false;
                    m_failure += `invalid 'options' value.`;
                    return;
                };
                if (opt_item.sort_order !== null && opt_item.sort_order !== "" && opt_item.sort_order !== undefined) {
                    if (typeof(opt_item.sort_order) !== "number") {
                        isValid = false;
                        m_failure += `invalid 'sort_order' for option. 'sort_order' must be number or left empty.`;
                        return;
                    }
                };
                let is_data_valid = mysqlutils.validateAttributeValue({
                    value: opt_item.option_value,
                    data_type: product_eav.data_type,
                    html_type: product_eav.html_type
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