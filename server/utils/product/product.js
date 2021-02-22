const msClient = require("../mysql/mysql");
const mysqlutils = require("../mysql/mysqlutils");

const attr_product_entity = ["entity_id", "type_id", "parent", "created_at", "updated_at"];
const attr_product_category_assignment = ["product_id", "category_id", "position"];
const attr_inventory = ["entity_id", "available_quantity"];
const attr_eav = ["entity_id", "attribute_id", "value"];

async function saveProductEntity (product) {
    // product_entity: "entity_id", "type_id", "created_at", "updated_at"
    // eav_varchar(255): "sup_link", "sup_name", "sup_warranty", "images", "thumbnail", "subsection"
    // eav_int: "sup_price", "is_new", "is_online"
    // inventory: "available_quantity"
    // product_category_assignment: "category"

    let sqltb_product_entity = [];
    attr_product_entity.forEach(item => {
        if (product[item] != null) {
            sqltb_product_entity.push(item);
        }
    });
    if (sqltb_product_entity.length > 0) {
        sqltb_product_entity =
        `
        INSERT INTO \`ecommerce\`.product_entity (${sqltb_product_entity.map(item => item).join(", ")})
        VALUES ("${sqltb_product_entity.map(item => mysqlutils.escapeQuotes(product[item])).join(", ")}") AS new
        ON DUPLICATE KEY UPDATE
        ${sqltb_product_entity.map(item => `${item} = new.${item}`).join(",\n")};
        `;
    } else {
        sqltb_product_entity = null;
    };

    let sql_product_category_assignment = null;
    if (Array.isArray(product.categories)) {
        product.categories = product.categories.filter(item => (
            "attribute_id" in item && (item.position == null || typeof(item.position) == "number")
        ))
        if (product.categories.length > 0) {
            sql_product_category_assignment =
            `
            INSERT INTO \`ecommerce\`.product_category_assignment (${attr_product_category_assignment.map(item => item).join(",")})
            VALUES
            ${product.categories
                .map(item =>
                    `("${mysqlutils.escapeQuotes(product.entity_id)}", "${mysqlutils.escapeQuotes(item.category_id)}", ${item.position ? item.position : "null"})`
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
        INSERT INTO \`ecommerce\`.inventory (${attr_inventory.map(item => item).join(", ")})
        VALUES ("${mysqlutils.escapeQuotes(product.entity_id)}", ${product.available_quantity}) AS new
        ON DUPLICATE KEY UPDATE
        ${attr_inventory.map(item => `${item} = new.${item}`).join(",\n")};
        `;
    }

    let single_value_eav = {
        product_eav_int = [],
        product_eav_decimal = [],
        product_eav_varchar = [],
        product_eav_text = [],
        product_eav_datetime = []
    }
    let sql_eav_multi_value = [];

}

module.exports = {

}