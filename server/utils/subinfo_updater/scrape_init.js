const scraper = require("./pdcom_functions");
const msClient = require("../mysql/mysql");
const fs = require("fs-extra");
const axios = require("axios");
const utils = require("../functions");
async function getSubProduct () {
    const init_products = await fs.readJSON("./init_products.json", "utf8");
    let products = [];
    let quotation = await scraper.get_phatdatcomQuotation({
        url: "default"
    });
    for (let i = 0; i < init_products.length; i++) {
        let product_links = init_products[i].products;
        for (let j = 0; j < product_links.length; j++) {
            console.log("getting: ", product_links[j])
            let product = await scraper.get_pdcomProdDetail(product_links[j], quotation);
            product.category = init_products[i].category;
            product.subsection = init_products[i].subsection;
            products.push(product);
        };
    }
    await fs.writeJSON("./init_products_1.json", products);
}

async function initProductDatabase () {
    // product_entity: "entity_id", "type_id", "created_at", "updated_at"
    // eav_varchar(255): "sup_link", "sup_name", "sup_warranty", "images", "thumbnail", "subsection"
    // eav_int: "sup_price", "is_new", "is_online"
    // inventory: "available_quantity"
    // product_category_assignment: "category"
    let time = Date.now();
    await msClient.connectAsync();
    let init_products = await fs.readJSON("./init_products_1.json", "utf8");
    init_products.forEach((product, index) => {
        Object.keys(product).forEach(key => {
            if (product[key] == null || product[key] == "") delete product[key];
        });
        let zerofill_id = utils.generateZerofillId({
            absolute_id: index + 1,
            zerofil_length: 4
        })
        product.entity_id = `PR${zerofill_id}`;
        product.type_id = "simple";
        product.images = [product.images];
        product.created_at = time;
        product.updated_at = time;
        product.is_new = "1";
        product.is_online = "0";
    });
    console.log(init_products[0])
    msClient.disconnect();
}

initProductDatabase();