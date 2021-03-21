async function getProductEavs () {
    
}

async function saveProductEav (product_eavs, option) {
    try {

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

function validateProductEavModel () {
    let isValid = true;
    let m_failure = "";
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