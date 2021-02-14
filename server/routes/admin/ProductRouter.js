const express = require("express");
const router = express.Router();
const msClient = require("../utils/mysql/mysql");
const { updateSupInfo } = require("../utils/subinfo_updater/general_updater");
const {
    createSystemErrMessage,
    unescapeSelectedData
} = require("../utils/functions");
const {
    items_per_page
} = require("../utils/const/config");
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/product", checkAdminByCookie, async (req, res) => {
    // return full data
    // res.json({products: [], Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.redirect("/");

        let sql_search_product = `SELECT * FROM phukiendhqg.product`;
        let products = await msClient.promiseQuery(sql_search_product);
        res.json({
            products: products,
        })
    }catch(err){
        res.Alert.push(createSystemErrMessage(001));
        res.json({Alert: res.Alert})
    }
})

router.post("/product", checkAdminByCookie, async (req, res) => {
    // req.body:    {products: [product]}
    // product:     {prod_link, category}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let products = req.body.products;
        let attr_arr = [];
        for(let i in products[0]){
            attr_arr.push(i);
        }
        await msClient.insertRows("phukiendhqg.product", attr_arr, products);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
})

router.put("/product", checkAdminByCookie, async (req, res) => {
    // req.body:    {products: [product]}
    // res.json({isSuccess: boolean, products, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        let products = req.body.products;
        if(!products || products.length < 1) return res.end();
        // get product_ids for latter select statement
        let product_ids = [];
        products.forEach(prod_item => {
            product_ids.push(prod_item.prod_id);
        })
        // handle update product
        let attr_arr = [];
        for(let i in products[0]){
            attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.product", attr_arr, products);
        let sql_reSelectProduct = `SELECT * FROM phukiendhqg.product WHERE prod_id IN (${msClient.getSqlInCondittion(product_ids)});`;
        let updated_products = await msClient.promiseQuery(sql_reSelectProduct);
        res.json({isSuccess: true, updated_products: updated_products, Alert: res.Alert});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
})

router.delete("/product", checkAdminByCookie, async (req, res) => {
    // req.body:    {prod_ids: [prod_id]}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        let product_id = req.query.product_id;
        if(!product_id || product_id == "") return res.end();
        await msClient.deleteRows("phukiendhqg.product", "prod_id", [product_id]);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        console.log(err);
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
})

router.put("/product/initprod", checkAdminByCookie, async (req, res) => {
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

router.put("/product/supinfo", checkAdminByCookie, async (req, res) => {
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