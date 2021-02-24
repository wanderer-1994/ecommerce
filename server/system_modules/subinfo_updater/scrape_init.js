const scraper = require("./pdcom_functions");
const msClient = require("../mysql/mysql");
const productMgr = require("../product/product");
const categoryMgr = require("../category/category");
const search = require("../search/search");
const fs = require("fs-extra");
const utils = require("../functions");
async function getSupplierProduct () {
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
    // eav_varchar(255): "sup_link", "sup_name", "sup_warranty", "thumbnail"
    // eav_multi_value: "images", "subsection"
    // eav_int: "sup_price", "is_new", "is_online"
    // inventory: "available_quantity"
    // product_category_assignment: "category"
    // product_tier_price: "tier_price"
    
    await msClient.connectAsync();
    let time = Date.now();

    // init product
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
        product.created_at = time;
        product.updated_at = time;
        product.categories = [{
            category_id: product.category,
            position: null
        }];
        product.tier_price = product.sup_price;
        product.attributes = [];
        product.attributes.push({
            attribute_id: "sup_link",
            value: product.sup_link
        });
        product.attributes.push({
            attribute_id: "sup_name",
            value: product.sup_name
        });
        product.attributes.push({
            attribute_id: "sup_warranty",
            value: product.sup_warranty
        });
        product.attributes.push({
            attribute_id: "images",
            value: [product.images]
        });
        product.attributes.push({
            attribute_id: "thumbnail",
            value: product.thumbnail
        });
        if (product.subsection) {
            product.attributes.push({
                attribute_id: "subsection",
                value: [product.subsection]
            });
        }
        product.attributes.push({
            attribute_id: "sup_price",
            value: product.sup_price
        });
        product.attributes.push({
            attribute_id: "name",
            value: product.sup_name
        });
        product.attributes.push({
            attribute_id: "is_new",
            value: 1
        });
        product.attributes.push({
            attribute_id: "is_online",
            value: 0
        });
        product.attributes.forEach((attribute, index) => {
            let is_valid = false;
            if (attribute && attribute.value !== null && attribute.value !== undefined && attribute.value !== "") {
                let attribute_definition = msClient.productEav.find(item => item.attribute_id === attribute.attribute_id);
                if (attribute_definition) {
                    ["html_type", "data_type"].forEach(key => {
                        attribute[key] = attribute_definition[key];
                    });
                    is_valid = true;
                }
            }
            if (!is_valid) product.attributes[index] = null;
        })
        product.attributes = product.attributes.filter(item => item !== null);
    });
    for (let i = 0; i < init_products.length; i++) {
        await productMgr.saveProductEntity(init_products[i])
    };

    // init category
    let init_categories = [];
    init_products.forEach(product => {
        if (Array.isArray(product.categories)) {
            product.categories.map(cat_item => {
                let match = init_categories.find(m_item => m_item.category_id == cat_item.category_id);
                if (!match) {
                    let new_category = {
                        entity_id: cat_item.category_id,
                        name: "Place holder",
                        parent: null,
                        is_online: "1",
                        position: null,
                        attributes: [
                            {
                                attribute_id: "title_caption",
                                value: "Placeholder title caption"
                            },
                            {
                                attribute_id: "banner_image",
                                value: "https://static.toiimg.com/photo/72975551.cms"
                            },
                            {
                                attribute_id: "introduction",
                                value: "Placeholder introduction"
                            }
                        ]
                    };
                    new_category.attributes.forEach((attribute, index) => {
                        let is_valid = false;
                        if (attribute && attribute.value !== null && attribute.value !== undefined && attribute.value !== "") {
                            let attribute_definition = msClient.categoryEav.find(item => item.attribute_id === attribute.attribute_id);
                            if (attribute_definition) {
                                ["html_type", "data_type"].forEach(key => {
                                    attribute[key] = attribute_definition[key];
                                });
                                is_valid = true;
                            }
                        }
                        if (!is_valid) new_category.attributes[index] = null;
                    });
                    new_category.attributes = new_category.attributes.filter(item => item !== null);
                    init_categories.push(new_category);
                }
            })
        }
    });

    for (let i = 0; i < init_categories.length; i++) {
        await categoryMgr.saveCategoryEntity(init_categories[i])
    };

    // init build product search eav index
    let result = await search.buildProductSearchEavIndex();
    // await fs.writeJSON("./product_eav_index.json", result);

    console.log("execution time: ", (Date.now() - time), " ms")
    msClient.disconnect();
}

initProductDatabase();