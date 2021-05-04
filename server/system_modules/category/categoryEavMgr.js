const msClient = require("../../system_modules/mysql/mysql");
const mysqlutils = require("../../system_modules/mysql/mysqlutils");
const category_eav_columns = [
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
const category_eav_option_columns = [
    {
        column: "attribute_id"
    },
    {
        column: "value"
    },
    {
        column: "label"
    },
    {
        column: "sort_order"
    }
]

async function getCategoryEavs () {
    try {
        let sql_get_category_eav =
        `
        SELECT \`ce\`.*, \`ceo\`.label AS option_label, \`ceo\`.sort_order, \`ceo\`.value AS \`option_value\`
        FROM \`ecommerce\`.category_eav AS \`ce\`
        LEFT JOIN \`ecommerce\`.category_eav_option AS \`ceo\`
        ON \`ce\`.html_type IN ('select', 'multiselect') AND \`ce\`.attribute_id = \`ceo\`.attribute_id;
        `;
        let rawData = await msClient.promiseQuery(sql_get_category_eav);
        let category_eavs = modelizeCategoryEavs(rawData);
        return category_eavs;
    } catch (err) {
        throw err;
    }
}

async function saveCategoryEav (category_eav, option) {
    try {
        let validation = validateCategoryEavModel(category_eav);
        if (validation.m_warning) {
            category_eav.m_warning = `WARNING: \n\t ${validation.m_warning}`;
        }
        if (!validation.isValid) {
            throw new Error( `ERROR: \n\t ${validation.m_failure}`);
        };

        // check if category_eav exist for case update
        let match = msClient.categoryEav.find(m_item => m_item.attribute_id === category_eav.attribute_id) || {};
        if (option.mode === "UPDATE") {
            if (match.attribute_id === undefined) throw new Error(`ERROR: category_eav with attribute_id '${category_eav.attribute_id}' not exist`);
        };

        let sql_category_eav_entity = [];
        category_eav_columns.forEach(col_item => {
            let isNotNull;
            if (option.mode === "UPDATE") {
                isNotNull = col_item.column in category_eav;
            } else if(option.mode === "CREATE") {
                isNotNull = category_eav[col_item.column] !== null && category_eav[col_item.column] !== "" && category_eav[col_item.column] !== undefined
            };
            if (isNotNull) {
                sql_category_eav_entity.push(col_item);
            }
        });
        if (sql_category_eav_entity.length > 0) {
            if (option.mode === "CREATE") {
                sql_category_eav_entity =
                `
                INSERT INTO \`ecommerce\`.category_eav (${sql_category_eav_entity.map(col_item => col_item.column).join(", ")})
                VALUES (${sql_category_eav_entity.map(col_item => {
                    if (category_eav[col_item.column] === null || category_eav[col_item.column] === "" || category_eav[col_item.column] === undefined) {
                        return "NULL";
                    } else {
                        return `"${mysqlutils.escapeQuotes(category_eav[col_item.column])}"`;
                    }
                }).join(", ")});
                `;
            } else if (option.mode === "UPDATE") {
                if (sql_category_eav_entity.length <= 1) {
                    sql_category_eav_entity = null;
                } else {
                    sql_category_eav_entity =
                    `
                    UPDATE \`ecommerce\`.category_eav SET ${sql_category_eav_entity.map(col_item => {
                        if (col_item.column === "attribute_id") return null;
                        return `${col_item.column} = ${
                            category_eav[col_item.column] === null || category_eav[col_item.column] === "" || category_eav[col_item.column] === undefined ?
                            "NULL" :
                            `"${mysqlutils.escapeQuotes(category_eav[col_item.column])}"`}`
                    }).filter(item => item !== null).join(", ")}
                    WHERE attribute_id = "${mysqlutils.escapeQuotes(category_eav.attribute_id)}";
                    `
                }
            }
        } else {
            sql_category_eav_entity = null;
        };
        
        let sql_eav_option;
        switch (option.mode) {
            default:
                if (['select', 'multiselect'].indexOf(category_eav.html_type || match.html_type) === -1) {
                    sql_eav_option =
                    `
                    DELETE FROM \`ecommerce\`.category_eav_option WHERE \`attribute_id\` = "${mysqlutils.escapeQuotes(category_eav.attribute_id)}";
                    `;
                    break;
                }
                if (!("options" in category_eav) && option.mode === "UPDATE") break;
                sql_eav_option =
                `
                DELETE FROM \`ecommerce\`.category_eav_option WHERE \`attribute_id\` = "${mysqlutils.escapeQuotes(category_eav.attribute_id)}";
                `;
                if (category_eav.options && category_eav.options.length > 0) {
                    sql_eav_option +=
                    `
                    INSERT INTO \`ecommerce\`.category_eav_option (${category_eav_option_columns.map(col_item => col_item.column).join(", ")})
                    VALUES
                    ${category_eav.options.map(opt_item => `("${mysqlutils.escapeQuotes(category_eav.attribute_id)}" , "${mysqlutils.escapeQuotes(opt_item.option_value)}", ${!mysqlutils.isValueEmpty(opt_item.label) ? `"${mysqlutils.escapeQuotes(opt_item.label)}"` : "NULL"}, ${opt_item.sort_order ? `"${mysqlutils.escapeQuotes(opt_item.sort_order)}"` : "NULL"})`).join(",\n")}
                    AS new
                    ON DUPLICATE KEY UPDATE 
                    ${category_eav_option_columns.map(col_item => `${col_item.column} = new.${col_item.column}`).join(",\n")};
                    `;
                }
        };

        let assembled_sql = [sql_category_eav_entity, sql_eav_option].filter(item => item !== null && item !== "" && item !== undefined);
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

async function deleteCategoryEavs (category_eav_ids, option) {
    try {
        // validate input
        let isValid = true;
        category_eav_ids.forEach(eav_id => {
            if (!validateCategoryEavId(eav_id)) {
                isValid = false;
            }
        });
        if (!isValid) throw new Error("ERROR: category 'entity_id' must not be non-empty string or number.");
        let tbs_to_delete = [
            {
                tb_name: "category_eav",
                entity_column: "attribute_id"
            },
            {
                tb_name: "category_eav_int",
                entity_column: "attribute_id"
            },
            {
                tb_name: "category_eav_decimal",
                entity_column: "attribute_id"
            },
            {
                tb_name: "category_eav_varchar",
                entity_column: "attribute_id"
            },
            {
                tb_name: "category_eav_text",
                entity_column: "attribute_id"
            },
            {
                tb_name: "category_eav_datetime",
                entity_column: "attribute_id"
            },
            {
                tb_name: "category_eav_option",
                entity_column: "attribute_id"
            },
            {
                tb_name: "category_eav_multi_value",
                entity_column: "attribute_id"
            }
        ];
        let sql_delete_category_eav =
        `
        START TRANSACTION;
        ${tbs_to_delete.map(table => {
            return `DELETE FROM \`ecommerce\`.${table.tb_name} WHERE \`${table.entity_column}\` IN (${category_eav_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")});`
        }).join("\n")}
        COMMIT;
        `
        let result = await msClient.promiseQuery(sql_delete_category_eav);
        return result;
    } catch (err) {
        throw err;
    }
};

function modelizeCategoryEavs (rawData) {
    let category_eavs = mysqlutils.groupByAttribute({
        rawData: rawData,
        groupBy: "attribute_id",
        nullExcept: ["", null]
    });
    category_eavs.forEach(eav => {
        if (eav.__items && eav.__items[0]) {
            category_eav_columns.forEach(col_item => {
                eav[col_item.column] = eav.__items[0][col_item.column];
            });
            if (['select', 'multiselect'].indexOf(eav.html_type) !== -1) {
                eav.options = [];
                (eav.__items || []).forEach(option => {
                    if (option.option_value !== null && option.option_value !== "" && option.option_value !== undefined) {
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

    category_eavs.forEach(eav => {
        ["admin_only", "is_super", "is_system"].forEach(col_item => {
            if (eav[col_item] !== null && eav[col_item] !== "" && eav[col_item] !== undefined) {
                eav[col_item] = parseInt(eav[col_item]);
            }
        })
    })

    return category_eavs;
}

function validateCategoryEavModel (category_eav) {
    let isValid = true;
    let m_failure = "";
    let match_eav_definition = msClient.categoryEav.find(m_item => m_item.attribute_id === category_eav.attribute_id) || {};
    if (["number", "string"].indexOf(typeof(category_eav.attribute_id)) === -1 || category_eav.attribute_id.toString().length === 0) {
        isValid = false;
        m_failure += `'attribute_id' must not be empty.`
    }
    category_eav_columns.forEach(col_item => {
        if (category_eav[col_item.column] !== null && category_eav[col_item.column] !== "" && category_eav[col_item.column] !== undefined) {
            if (!col_item.validation_function(category_eav[col_item.column])) {
                isValid = false;
                m_failure += `\n\t ${col_item.valueInvalidMessage}`;
            }
        }
    });
    if ("options" in category_eav) {
        if (['select', 'multiselect'].indexOf(category_eav.html_type || match_eav_definition.html_type) === -1) {
            isValid = false;
            m_failure += `'options' can only applied for html_type ('select', 'multiselect').`;
        };
        if (!Array.isArray(category_eav.options)) {
            isValid = false;
            m_failure += `invalid 'options'.`
        };
        if (Array.isArray(category_eav.options)) {
            category_eav.options.forEach(opt_item => {
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
                }
                let is_data_valid = mysqlutils.validateValue({
                    value: opt_item.option_value,
                    data_type: category_eav.data_type || match_eav_definition.data_type,
                    html_type: category_eav.html_type || match_eav_definition.html_type
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

function validateCategoryEavId (category_eav_id) {
    if ((typeof(category_eav_id) !== "string" && typeof(category_eav_id) !== "number") || category_eav_id.toString().length === 0) {
        return false;
    };
    return true;
}

module.exports = {
    getCategoryEavs,
    saveCategoryEav,
    deleteCategoryEavs
}