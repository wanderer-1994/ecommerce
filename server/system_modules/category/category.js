const msClient = require("../mysql/mysql");
const mysqlutils = require("../mysql/mysqlutils");

const attr_category_entity = ["entity_id", "name", "parent", "is_online", "position"];
const attr_eav = ["entity_id", "attribute_id", "value"];
const { getCategoryEavTableName } = require("./category_eav_table");

async function saveCategoryEntity (category, option) {
    // category_entity: "entity_id", "name", "is_online", "position"
    // eav_varchar(255): "banner_image"
    // eav_multi_text: "title_caption", "introduction"

    try {
        let sqltb_category_entity = [];
        attr_category_entity.forEach(item => {
            if (category[item] !== null && category[item] !== "" && category[item] !== undefined) {
                sqltb_category_entity.push(item);
            }
        });
        if (sqltb_category_entity.length > 0) {
            sqltb_category_entity =
            `
            INSERT INTO \`ecommerce\`.category_entity (${sqltb_category_entity.map(item => item).join(", ")})
            VALUES ("${sqltb_category_entity.map(item => mysqlutils.escapeQuotes(category[item])).join(`", "`)}") AS new
            ${option && option.mode === "UPDATE" ? `ON DUPLICATE KEY UPDATE
            ${sqltb_category_entity.map(item => `${item} = new.${item}`).join(",\n")}` : ""};
            `;
        } else {
            return new Error("ERROR: category 'entity_id' is not specified");
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
            let is_valid = false;
            let table_name = getCategoryEavTableName(attribute);
            let match = msClient.categoryEav.find(m_item => m_item.attribute_id == attribute.attribute_id);
            if (match && table_name == "category_eav_multi_value") {
                sql_eav_multi_value.push(attribute);
                is_valid = true;
            } else if (match && Object.keys(sql_eav_single_value).indexOf(table_name) != -1) {
                sql_eav_single_value[table_name].push(attribute);
                is_valid = true;
            }
            if (!is_valid) {
                let message = `Warning: skip attribute '${attribute.attribute_id}'`;
                category.m_warning = category.m_warning ? category.m_warning.push(message) : [message];
            }
        });

        Object.keys(sql_eav_single_value).forEach(tb_item => {
            sql_eav_single_value[tb_item].forEach((row_item, index) => {
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
            let sql_row_item =
            `
            DELETE FROM \`ecommerce\`.category_eav_multi_value
            WHERE entity_id = "${mysqlutils.escapeQuotes(category.entity_id)}"
            AND attribute_id = "${mysqlutils.escapeQuotes(row_item.attribute_id)}";
            `;
            if (Array.isArray(row_item.value) && row_item.value.length > 0) {
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
            .filter(item => (item != null && item != ""))
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
    COMMIT;
    `
    let result = await msClient.promiseQuery(sql_delete_category);
    return result;
}

module.exports = {
    saveCategoryEntity,
    deleteCategoryEntities
}