const msClient = require("./system_modules/mysql/mysql");
const Search = require("./system_modules/search/search");
const fs = require("fs-extra");
const pdComUpdater = require("./supinfo_updater/pdcom_functions");

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

async function getPDCQuotation () {
    let new_products = await pdComUpdater.get_phatdatcomQuotation();
    console.log(new_products[0]);
};

async function getDBProducts () {
    try{
        await msClient.connectAsync();
        let supplier_products = await pdComUpdater.get_phatdatcomQuotation();
        let search_db_product_config = {
            refinements: [{
                attribute_id: "sup_link",
                value: supplier_products.map(item => item.sup_link)
            }],
            pagination: {
                psize: "infinite"
            },
            isAdmin: true
        };
        search_db_product_config.refinements.forEach((attribute, index) => {
            let match = msClient.productEav.find(m_item => m_item.attribute_id == attribute.attribute_id);
            if (match) {
                attribute.html_type = match.html_type;
                attribute.data_type = match.data_type;
            } else {
                search_db_product_config.refinements[index] = null;
            }
        });
        let db_products = await Search.search(search_db_product_config);
        console.log(db_products);
        msClient.disconnect();
    }catch(err){
        console.log(err);
        msClient.disconnect();
    }
}

getPDCQuotation();