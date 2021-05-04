const msClient = require("../system_modules/mysql/mysql");

const tbs_to_refresh = [
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
]

async function refresh () {
    let sql = "START TRANSACTION;";
    tbs_to_refresh.forEach(tb => {
        sql += `TRUNCATE TABLE \`ecommerce\`.${tb.tb_name};`
    })
    sql += "COMMIT;"
    let result = msClient.promiseQuery(sql);
    console.log("### Product data refreshed!");
    msClient.disconnect();
};

refresh();