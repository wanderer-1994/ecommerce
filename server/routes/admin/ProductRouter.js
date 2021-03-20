const express = require("express");
const router = express.Router();
const msClient = require("../../system_modules/mysql/mysql");
const { updateSupInfo } = require("../../system_modules/subinfo_updater/general_updater");
const {
    createSystemErrMessage,
    unescapeSelectedData
} = require("../../system_modules/functions");
const {
    items_per_page
} = require("../../system_modules/const/config");
const productMgr = require("../../system_modules/product/productMgr");
const search = require("../../system_modules/search/search");
const productEavRouter = require("./ProductEavRouter");

router.use("/product", productEavRouter);

router.get("/product", async (req, res) => {
    // req.query= {page, categories, entity_ids, refinements, searchPhrase}
    // res.json({products: [], Alert: [], currentPage: number, totalPages: number})
    try{
        let refinements = search.extractRefinements(req);
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
                page: req.query.page,
                isAdmin: true
            };
            let searchResult = await search.search(searchConfig);
            res.json(searchResult);
        }
    }catch(err){
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
        let entity_ids = req.entity_ids || [];
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
        let attr_to_init = ["prod_img", "prod_thumb", "sup_name", "sup_price", "sup_warranty", "prod_stock"]
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let product_ids = req.body.product_ids;
        if(!product_ids || product_ids.length < 1) return res.end();
        // first select
        let sql_selectProduct = `SELECT * FROM phukiendhqg.product WHERE prod_id IN (${msClient.getSqlInCondittion(product_ids)});`;
        let products_to_init = await msClient.promiseQuery(sql_selectProduct);
        products_to_init = unescapeSelectedData(products_to_init);
        let products_init_data = products_to_init.map(prod_item => {
            return {
                prod_id: prod_item.prod_id,
                prod_link: prod_item.prod_link,
                prod_stock: prod_item.prod_stock    // thêm prod_stock vì pd bình thới ko cập nhật prod_stock
            }
        })
        products_init_data = await updateSupInfo(products_init_data);
        let { updated_products, failed_products } = products_init_data;

        // lưu những sp update được vào database
        let last_updated = Date.now();
        products_to_init.forEach(old_prod_item => {
            let match_item = updated_products.find(new_prod_item => {
                return new_prod_item.prod_id == old_prod_item.prod_id;
            })
            if(match_item){
                old_prod_item.last_updated = `${last_updated}`;
                old_prod_item.updated_info = "";
                attr_to_init.forEach(attr_item => {
                    if(old_prod_item[attr_item] != match_item[attr_item]){
                        old_prod_item.updated_info += `<li><span style="color: red">${attr_item}</span> changed from <span style="color: red">${old_prod_item[attr_item]}</span> to <span style="color: red">${match_item[attr_item]}</span></li>`;
                        old_prod_item[attr_item] = match_item[attr_item];
                    }
                })
            }else{
                old_prod_item.last_updated = `${last_updated}`;
                old_prod_item.updated_info = `<li style="color: red">err</li>`;
            }
        })
        // save updated products && failed updated products
        let init_product_attr_arr = [];
        for(let i in products_to_init[0]){
            init_product_attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.product", init_product_attr_arr, products_to_init);
        // reselect after update
        products_to_init = await msClient.promiseQuery(sql_selectProduct);
        res.json({
            updated_products: products_to_init
        });

    }catch(err){
        try{
            console.log("check err: ", err);
            res.Alert.push(createSystemErrMessage(001))
            res.json({Alert: res.Alert})
        }catch(err){
            console.log("err 2: ", err)
        }
    }
})

router.put("/product/supinfo", async (req, res) => {
    // req.body:    {product_ids: [prod_id]}
    // res.json({isSuccess: boolean, products, Alert: []})
    try{
        let attr_to_update = ["sup_name", "sup_price", "sup_warranty", "prod_stock"]
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let product_ids = req.body.product_ids;
        if(!product_ids || product_ids.length < 1) return res.end();
        // first select
        let sql_selectProduct = `SELECT * FROM phukiendhqg.product WHERE prod_id IN (${msClient.getSqlInCondittion(product_ids)});`;
        let products_to_update = await msClient.promiseQuery(sql_selectProduct);
        products_to_update = unescapeSelectedData(products_to_update);
        let products_update_data = products_to_update.map(prod_item => {
            return {
                prod_id: prod_item.prod_id,
                prod_link: prod_item.prod_link,
                prod_stock: prod_item.prod_stock    // thêm prod_stock vì pd bình thới ko cập nhật prod_stock
            }
        })
        products_update_data = await updateSupInfo(products_update_data);
        let { updated_products, failed_products } = products_update_data;

        // lưu những sp update được vào database
        let last_updated = Date.now();
        products_to_update.forEach(old_prod_item => {
            let match_item = updated_products.find(new_prod_item => {
                return new_prod_item.prod_id == old_prod_item.prod_id;
            })
            if(match_item){
                delete match_item.prod_thumb;
                delete match_item.prod_img;
                old_prod_item.last_updated = 0;
                old_prod_item.updated_info = "";
                attr_to_update.forEach(attr_item => {
                    if(old_prod_item[attr_item] != match_item[attr_item]){
                        old_prod_item.updated_info += `<li><span style="color: red">${attr_item}</span> changed from <span style="color: red">${old_prod_item[attr_item]}</span> to <span style="color: red">${match_item[attr_item]}</span></li>`;
                        old_prod_item[attr_item] = match_item[attr_item];
                        old_prod_item.last_updated = `${last_updated}`;
                    }
                })
            }else{
                old_prod_item.last_updated = `${last_updated}`;
                old_prod_item.updated_info = `<li style="color: red">err</li>`;
            }
        })
        // save updated products && failed updated products
        let update_product_attr_arr = [];
        for(let i in products_to_update[0]){
            update_product_attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.product", update_product_attr_arr, products_to_update);
        // reselect after update
        products_to_update = await msClient.promiseQuery(sql_selectProduct);
        res.json({
            updated_products: products_to_update
        });

    }catch(err){
        try{
            console.log("check err: ", err);
            res.Alert.push(createSystemErrMessage(001))
            res.json({Alert: res.Alert})
        }catch(err){
            console.log("err 2: ", err)
        }
    }
})

module.exports = router;