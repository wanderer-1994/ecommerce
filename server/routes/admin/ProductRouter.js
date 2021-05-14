const express = require("express");
const router = express.Router();
const msClient = require("../../system_modules/mysql/mysql");
const pdComUpdater = require("../../supinfo_updater/pdcom_functions");
const { createSystemErrMessage } = require("../../system_modules/functions");
const { psize } = require("../../system_modules/const/config");
const productMgr = require("../../system_modules/product/productMgr");
const Search = require("../../system_modules/search/search");
const ProductModel = require("../../system_modules/search/ProductModel");
const productEavRouter = require("./ProductEavRouter");
const mysqlutils = require("../../system_modules/mysql/mysqlutils");

router.use("/product", productEavRouter);

router.get("/product", async (req, res) => {
    // req.query= {page, categories, entity_ids, refinements, searchPhrase}
    // res.json({products: [], Alert: [], currentPage: number, totalPages: number})
    try{
        // extract params
        let page = req.query.page;
        let items = req.query.psize;
        if (parseInt(page) != page || page < 1) {
            page = 1;
        };
        page = parseInt(page);
        switch (items) {
            default:
                if (items === "infinite") break;
                if (parseInt(items) != items || items < 1) {
                    items = psize;
                    break;
                } else {
                    items = parseInt(items);
                    break;
                };
        };

        // admin get entity_only
        if (req.query.entity_only === "true") {
            let searchResult = await productMgr.getProductEntityOnly({
                searchConfig: {
                    searchPhrase: (req.query.keyword || "").replace(/^\s+|\s+$/g, ""),
                    entity_ids: (req.query.entity_ids || "").split("|").filter(item => item.replace(/^\s+|\s+$/g, "") !== ""),
                    type_ids: (req.query.type_ids || "").split("|").filter(item => item.replace(/^\s+|\s+$/g, "") !== "")
                },
                pagination: {
                    page: page,
                    psize: items
                }
            });
            return res.json(searchResult)
        };

        // admin get full product attributes
        let refinements = Search.extractRefinements(req);
        refinements.forEach((attribute, index) => {
            let match = msClient.productEav.find(m_item => m_item.attribute_id == attribute.attribute_id && m_item.admin_only != 1);
            if (match) {
                attribute.html_type = match.html_type;
                attribute.data_type = match.data_type;
            } else {
                refinements[index] = null;
            }
        });

        let isRefinementsValid = true;
        refinements = refinements.filter(item => {
            if (item === null) {
                isRefinementsValid = false;
                return false;
            };
            return true;
        });

        if (!isRefinementsValid) {
            res.redirect("./abc");
        } else {
            let searchConfig = {
                categories: req.query.categories ? req.query.categories.split("|") : null,
                entity_ids: req.query.entity_ids ? req.query.entity_ids.split("|") : null,
                refinements: refinements,
                searchPhrase: req.query.keyword,
                searchDictionary: msClient.searchDictionary,
                pagination: {
                    page: req.query.page,
                    psize: items
                },
                isAdmin: true
            };
            let searchResult = await Search.search(searchConfig);
            res.json(searchResult);
        }
    }catch(err){
        console.log(err);
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert});
    }
})

router.post("/product", async (req, res) => {
    // req.body:    {product_entities: []}
    // product:     {prod_link, category}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        let product_entities = req.body.product_entities || [];
        let promises = [];
        product_entities.forEach(entity => {
            promises.push(
                productMgr.saveProductEntity(entity, {mode: "CREATE"})
                .then(() => {
                    entity.isSuccess = true;
                })
                .catch(err => {
                    entity.isSuccess = false;
                    entity.m_failure = err.message;
                })
            );
        });
        Promise.all(promises).then(() => {
            res.json({
                product_entities: product_entities
            });
        })
     }catch(err){
         res.Alert.push(createSystemErrMessage(001))
         res.json({Alert: res.Alert})
     }
})

router.put("/product", async (req, res) => {
    // req.body:    {product_entities: []}
    // res.json({isSuccess: boolean, products, Alert: []})
    try{
        let product_entities = req.body.product_entities || [];
        let promises = [];
        product_entities.forEach(entity => {
            promises.push(
                productMgr.saveProductEntity(entity, {mode: "UPDATE"})
                .then(() => {
                    entity.isSuccess = true;
                })
                .catch(err => {
                    entity.isSuccess = false;
                    entity.m_failure = err.message;
                })
            );
        });
        Promise.all(promises).then(() => {
            res.json({
                product_entities: product_entities
            });
        });
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
})

router.delete("/product", async (req, res) => {
    // req.body:    {entity_ids: []}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        let entity_ids = req.body.product_ids || [];
        let result = await productMgr.deleteProductEntities(entity_ids);
        res.json({
            isSuccess: true,
            result: result
        });
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
})

router.put("/product/initprod", async (req, res) => {
    // req.body:    {product_ids: [prod_id]}
    // res.json({isSuccess: boolean, products, Alert: []})
    try{
        
    }catch(err){

    }
})

router.put("/product/supplier/update", async (req, res) => {
    // req.body:    {product_ids: [prod_id]}
    // res.json({isSuccess: boolean, products, Alert: []})
    try{
        let today = new Date();
        let updated_attributes = ["sup_name", "sup_price", "sup_stock", "sup_warranty"];
        let supplier_products = await pdComUpdater.get_phatdatcomQuotation();
        let search_db_product_config = {
            pagination: {
                psize: "infinite"
            },
            isAdmin: true
        };
        let searchResult = await Search.search(search_db_product_config);
        let db_products = searchResult.products;
        let updated_products = [];
        db_products.forEach(product => {
            let updated_temp = [];
            let product_entities = [product.self, product.parent, ...(product.variants || [])].filter(item => !mysqlutils.isValueEmpty(item));
            product_entities.forEach(entity => {
                let sup_link = ProductModel.getAttributeValue(product, entity, "sup_link", false);

                // if no sup_link => product is not come from supplier
                if (!sup_link) return;
                let supplier_match_prod = supplier_products.find(item => item.sup_link === sup_link);
                let product_update_obj = {
                    entity_id: entity.entity_id,
                    attributes: []
                };

                // if no supplier_match_prod => alert supplier product lost
                if (!supplier_match_prod) {
                    product_update_obj.attributes.push({
                        attribute_id: "supplier_updated_info",
                        value: `<ul><li>Date: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}</li><li style="color:red;">Supplier product link is lost!</li></ul>`
                    });
                    updated_temp.push(product_update_obj);
                } else {
                    // if supplier_match_prod => check if info change
                    let changes = [];
                    updated_attributes.forEach(attribute_id => {
                        let value = ProductModel.getAttributeValue(product, entity, attribute_id, false);
                        if (value !== supplier_match_prod[attribute_id]) {
                            if (!mysqlutils.isValueEmpty(value) || !mysqlutils.isValueEmpty(supplier_match_prod[attribute_id])) {
                                product_update_obj.attributes.push({
                                    attribute_id: attribute_id,
                                    value: supplier_match_prod[attribute_id]
                                });
                                changes.push(
                                `<li><span style="color:red;">${attribute_id}</span> changes from <span style="color:red;">${mysqlutils.isValueEmpty(value) ? "null" : value}</span> to <span style="color:red;">${mysqlutils.isValueEmpty(supplier_match_prod[attribute_id]) ? "null" : supplier_match_prod[attribute_id]}</span></li>`
                                )
                            }
                        }
                    });
                    if (product_update_obj.attributes.length > 0) {
                        changes = 
                        `<ul><li>Date: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}</li>${changes.join("\n")}</ul>`;
                        product_update_obj.attributes.push({
                            attribute_id: "supplier_updated_info",
                            value: changes
                        });
                        updated_temp.push(product_update_obj);
                    };

                };
            });
            
            // update supplier_update_acknowledge for self & parent only
            if (updated_temp.length > 0) {
                let representive_entity = product.parent || product.self;
                if (representive_entity) {
                    let updated_temp_match = updated_temp.find(item => item.entity_id === representive_entity.entity_id);
                    if (!updated_temp_match) {
                        updated_temp_match = {
                            entity_id: representive_entity.entity_id,
                            attributes: []
                        };
                        updated_temp.push(updated_temp_match);
                    };
                    updated_temp_match.attributes.push({
                        attribute_id: "supplier_update_acknowledge",
                        value: 0
                    });
                };
                updated_products.push(...updated_temp);
            }
        });

        // update supplier_last_updated for all updated_products entities & save
        if (updated_products.length > 0) {
            updated_products.forEach(item => {
                item.attributes.push({
                    attribute_id: "supplier_last_updated",
                    value: today.getTime()
                })
            })
        };

        // concat new updated info with existing updated info
        if (updated_products.length > 0) {
            let sql_get_supplier_updated_info = 
            `
            SELECT \`pe\`.entity_id, \`pet\`.value FROM \`ecommerce\`.product_entity AS \`pe\`
            LEFT JOIN \`ecommerce\`.product_eav_text AS \`pet\`
            ON \`pe\`.entity_id = \`pet\`.entity_id AND \`pet\`.attribute_id = "supplier_updated_info";
            `
            let currentUpdatedInfo = await msClient.promiseQuery(sql_get_supplier_updated_info);
            updated_products.forEach(item => {
                let updated_info = item.attributes.find(attr_item => {
                    return attr_item.attribute_id === "supplier_updated_info";
                });
                if (updated_info) {
                    let existing_updated_info = currentUpdatedInfo.find(prod_item => {
                        return prod_item.entity_id === item.entity_id;
                    });
                    if (existing_updated_info && !mysqlutils.isValueEmpty(existing_updated_info.value)) {
                        updated_info.value = updated_info.value + "--------------------" + existing_updated_info.value;
                    };
                    while (updated_info.value.length > 60000) {
                        let temp = updated_info.value.split("--------------------");
                        temp.pop();
                        updated_info.value = temp.join("--------------------");
                    }
                }
            })
        };

        res.json({updated_products: updated_products});
    }catch(err){
        console.log(err);
        res.json({err: err.message})
    }
})

module.exports = router;