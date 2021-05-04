const msClient = require("../system_modules/mysql/mysql");

const tbs_to_refresh = [
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
]

async function refresh () {
    let sql = "START TRANSACTION;";
    tbs_to_refresh.forEach(tb => {
        sql += `TRUNCATE TABLE \`ecommerce\`.${tb.tb_name};`
    })
    sql += "COMMIT;"
    let result = msClient.promiseQuery(sql);
    console.log("### Category eav data refreshed!");
    msClient.disconnect();
};

refresh();