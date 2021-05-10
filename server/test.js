const msClient = require("./system_modules/mysql/mysql");
const fs = require("fs-extra");

async function test () {
    await msClient.connectAsync();
    let sql =
    `
    START TRANSACTION;

    INSERT INTO \`ecommerce\`.category_eav (attribute_id, label, admin_only, html_type, data_type, is_super, is_system)
    VALUES ("style_fashion", "Style fashion", "0", "multiselect", "text", "0", "1") AS new
    ;


    DELETE FROM \`ecommerce\`.category_eav_option WHERE \`attribute_id\` = "style_fashion";

    INSERT INTO \`ecommerce\`.category_eav_option (attribute_id, value, sort_order)
    VALUES
    ("style_fashion" , "young", NULL)),
    ("style_fashion" , "street walk", NULL)),
    ("style_fashion" , "old school", NULL))
    AS new
    ON DUPLICATE KEY UPDATE
    attribute_id = new.attribute_id,
    value = new.value,
    sort_order = new.sort_order;

    COMMIT;

    `;
    let result = await msClient.promiseQuery(sql);
    console.log(result);
};

async function count () {
    let data = await fs.readJSONSync("./supinfo_updater/init_products.json");
    let count = 0;
    data.forEach(item => {
        count += item.products.length;
    });
    console.log("total: ", count);
}

count();