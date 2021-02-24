const msClient = require("../mysql/mysql");
const mysqlutils = require("../mysql/mysqlutils");

const attr_product_entity = ["entity_id", "type_id", "parent", "created_at", "updated_at"];
const attr_product_category_assignment = ["product_id", "category_id", "position"];
const attr_inventory = ["entity_id", "available_quantity"];
const attr_tier_price = ["entity_id", "price"];
const attr_eav = ["entity_id", "attribute_id", "value"];
const { getProductEavTableName } = require("./product_eav_table");

async function saveProductEntity (product) {
    // product_entity: "entity_id", "type_id", "created_at", "updated_at"
    // eav_varchar(255): "sup_link", "sup_name", "sup_warranty", "thumbnail"
    // eav_multi_value: "images", "subsection"
    // eav_int: "sup_price", "is_new", "is_online"
    // inventory: "available_quantity"
    // product_category_assignment: "category"
    // product_tier_price: "tier_price"

    try {
        let sqltb_product_entity = [];
        attr_product_entity.forEach(item => {
            if (product[item] !== null && product[item] !== "" && product[item] !== undefined) {
                sqltb_product_entity.push(item);
            }
        });
        if (sqltb_product_entity.length > 0) {
            sqltb_product_entity =
            `
            INSERT INTO \`ecommerce\`.product_entity (${sqltb_product_entity.map(item => item).join(", ")})
            VALUES ("${sqltb_product_entity.map(item => mysqlutils.escapeQuotes(product[item])).join(`", "`)}") AS new
            ON DUPLICATE KEY UPDATE
            ${sqltb_product_entity.map(item => `${item} = new.${item}`).join(",\n")};
            `;
        } else {
            sqltb_product_entity = null;
        };

        let sql_product_category_assignment = null;
        if (Array.isArray(product.categories)) {
            product.categories = product.categories.filter(item => (
                "category_id" in item && (item.position == null || typeof(item.position) == "number")
            ))
            if (product.categories.length > 0) {
                sql_product_category_assignment =
                `
                INSERT INTO \`ecommerce\`.product_category_assignment (${attr_product_category_assignment.map(item => item).join(",")})
                VALUES
                ${product.categories
                    .map(item =>
                        `("${mysqlutils.escapeQuotes(product.entity_id)}", "${mysqlutils.escapeQuotes(item.category_id)}", "${item.position ? item.position : 0}")`
                    ).join(",\n")
                }
                AS new
                ON DUPLICATE KEY UPDATE
                ${attr_product_category_assignment.map(item => `${item} = new.${item}`).join(",\n")};
                `;
            }
        }

        let sql_inventory = null;
        if (typeof(product.available_quantity) == "number") {
            sql_inventory =
            `
            INSERT INTO \`ecommerce\`.inventory (${attr_inventory.map(col_item => col_item).join(", ")})
            VALUES ("${mysqlutils.escapeQuotes(product.entity_id)}", ${product.available_quantity}) AS new
            ON DUPLICATE KEY UPDATE
            ${attr_inventory.map(col_item => `${col_item} = new.${col_item}`).join(",\n")};
            `;
        }

        let sql_price = null;
        if (typeof(product.tier_price) == "number") {
            sql_price =
            `
            INSERT INTO \`ecommerce\`.product_tier_price (${attr_tier_price.map(col_item => col_item).join(", ")})
            VALUES ("${mysqlutils.escapeQuotes(product.entity_id)}", ${product.tier_price}) AS new
            ON DUPLICATE KEY UPDATE
            ${attr_tier_price.map(col_item => `${col_item} = new.${col_item}`).join(",\n")};
            `;
        }

        let sql_eav_single_value = {
            product_eav_int: [],
            product_eav_decimal: [],
            product_eav_varchar: [],
            product_eav_text: [],
            product_eav_datetime: []
        }
        let sql_eav_multi_value = [];

        product.attributes.forEach(attribute => {
            let is_valid = false;
            let table_name = getProductEavTableName(attribute);
            if (table_name == "product_eav_multi_value") {
                sql_eav_multi_value.push(attribute);
                is_valid = true;
            } else if (Object.keys(sql_eav_single_value).indexOf(table_name) != -1) {
                sql_eav_single_value[table_name].push(attribute);
                is_valid = true;
            }
            if (!is_valid) {
                console.log("Warning: skip attribute ", attribute);
            }
        });

        Object.keys(sql_eav_single_value).forEach(tb_item => {
            sql_eav_single_value[tb_item].forEach((row_item, index) => {
                let sql_row_item;
                if (row_item.value === null || row_item.value === "") {
                    sql_row_item =
                    `
                    DELETE FROM \`ecommerce\`.${tb_item}
                    WHERE entity_id = "${mysqlutils.escapeQuotes(product.entity_id)}"
                    AND attribute_id = "${mysqlutils.escapeQuotes(row_item.attribute_id)}";
                    `;
                } else {
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
            let sql_row_item =
            `
            DELETE FROM \`ecommerce\`.product_eav_multi_value
            WHERE entity_id = "${mysqlutils.escapeQuotes(product.entity_id)}"
            AND attribute_id = "${mysqlutils.escapeQuotes(row_item.attribute_id)}";
            `;
            if (Array.isArray(row_item.value) && row_item.value.length > 0) {
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
            sql_eav_multi_value[index] = sql_row_item;
        })

        let assembled_sql_update_product = [
            sqltb_product_entity,
            sql_product_category_assignment,
            sql_inventory,
            sql_price,
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
            .filter(item => (item != null && item != ""))
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

module.exports = {
    saveProductEntity
}