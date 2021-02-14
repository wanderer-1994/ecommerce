const express = require("express");
const msClient = require("../utils/mysql/mysql");
const router = express.Router();
const { createSystemErrMessage, unescapeSelectedData } = require("../utils/functions")
const { getTimeStampId } = require("../utils/const/timestamp_id_keeper");
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/order-user", async (req, res) => {
    try{
        let query = req.query;
        if(!query.user_tel || query.user_tel == "") return res.json({orders: []});
        if(!query.since) query.since = 0;
        if(!query.upto) query.upto = 9999999999999; // timestamp có 13 số
        if(query.since > query.upto) query.since = query.upto;
        let sql_get_orders_by_tel = `SELECT * FROM phukiendhqg.order WHERE user_tel="${query.user_tel}"
                                    AND timestamp_id > "${query.since}" AND timestamp_id < "${query.upto}" ORDER BY timestamp_id DESC`;
        let orders = await msClient.promiseQuery(sql_get_orders_by_tel);
        res.json({orders: orders});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

router.get("/order-admin", checkAdminByCookie, async (req, res) => {
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let query = req.query;
        if(!query.since) query.since = 0;
        query.upto = query.upto.toString();
        if(!query.upto) query.upto = 9999999999999; // timestamp có 13 số ...
        query.upto = query.upto.toString();         // ...nhưng lưu dạng varchar(13) chứ ko phải timestamp hay int(13)
        if(!query.searchText) query.searchText = "";
        if(!query.searchStatus) query.searchStatus = "";
        if(query.since > query.upto) query.since = query.upto;// user_name, user_tel, user_address, prod_name, sup_name, s_key
        let sql_search_orders = `SELECT * FROM phukiendhqg.order WHERE
                                (
                                user_tel LIKE "%${escape(query.searchText)}%" OR user_tel is null
                                OR UPPER(user_name) LIKE "%${escape(query.searchText.toUpperCase())}%" OR user_name is null
                                OR UPPER(user_address) LIKE "%${escape(query.searchText.toUpperCase())}%" OR user_address is null
                                OR UPPER(prod_name) LIKE "%${escape(query.searchText.toUpperCase())}%" OR prod_name is null
                                OR UPPER(sup_name) LIKE "%${escape(query.searchText.toUpperCase())}%" OR sup_name is null
                                OR UPPER(s_key) LIKE "%${escape(query.searchText.toUpperCase())}%" OR s_key is null
                                )
                                AND (status LIKE "%${escape(query.searchStatus)}%" OR status is null)
                                AND timestamp_id > "${query.since}" AND timestamp_id < "${query.upto}"
                                ORDER BY timestamp_id DESC`;
        let orders = await msClient.promiseQuery(sql_search_orders);
        res.json({orders: orders});
    }catch(err){
        console.log(err)
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

router.post("/order", async (req, res) => {
    // req.body: {user: user, products: [product]}
    // res.json({isSuccess: boolean, Alert: [], deleted_products})
    try{
        let order_status = ["đã tiếp nhận", "đơn ảo", "đã giao", "đang bảo hành"];
        let user_require = ["user_tel", "user_name", "user_address"];
        let product_require = ["prod_id", "order_qty", "note"];
        let user = req.body.user || {};
        let products = req.body.products || [];
        
        // check user valid
        let isUserValid = true;
        user_require.forEach(attr => {
            if(!user[attr] || user[attr] == "") isUserValid = false;
        })
        if(!isUserValid){
            res.Alert.push("Thông tin giao hàng chưa đầy đủ bạn ơi, hic!");
            return res.json({
                isSuccess: false,
                Alert: res.Alert
            })
        }

        // check products valid
        let deleted_products = [];
        let in_query = "";
        products.forEach(product => {
            if(product.prod_id && product.prod_id != "") in_query += `"${product.prod_id}", `;
        })
        in_query = in_query.replace(/, $/, "");
        if(in_query.length < 2){
            res.Alert.push("Không có sản phẩm nào. Bạn vui lòng kiểm tra lại đơn hàng nhé!");
            return res.json({
                isSuccess: false,
                Alert: res.Alert
            })
        }
        let sql_selectProducts = `SELECT * FROM phukiendhqg.product WHERE prod_id IN (${in_query}) AND prod_stock > 0;`;
        let database_products = await msClient.promiseQuery(sql_selectProducts);
        database_products = unescapeSelectedData(database_products);
        let attr_not_included_in_order = ["prod_review", "prod_stock", "last_updated", "updated_info"];
        for(let i = 0; i < products.length; i++){
            let product = products[i];
            let database_match = database_products.find(item => {return item.prod_id == product.prod_id});
            if(!database_match){
                deleted_products.push({...product})
            }else{
                attr_not_included_in_order.forEach(attr => {
                    delete database_match[attr];
                })
                products[i] = {...database_match, ...product};
            }
        }

        if(deleted_products.length > 0){
            res.Alert.push("Một số sản phẩm đã hết hàng, bạn check đơn lại nha!");
            return res.json({
                isSuccess: false,
                Alert: res.Alert,
                deleted_products: deleted_products
            })
        }

        // tìm kiếm user by user_tel
        let sql_find_user = `SELECT * FROM phukiendhqg.user WHERE user_tel="${escape(user.user_tel)}"`;
        let users = await msClient.promiseQuery(sql_find_user);
        if(users[0]){
            // nếu tìm thấy => update thông tin user
            user = {...users[0], ...user};
        }else{
            // nếu không tìm thấy => lưu user mới
            user = {...user, user_id: getTimeStampId()};
        }
        let user_attr_arr = [];
            for(let i in user){
                user_attr_arr.push(i);
        }

        // save product
        let timestamp_id = getTimeStampId();
        for(let i = 0; i < products.length; i++){
            products[i] = {...products[i], timestamp_id: timestamp_id, status: "đã tiếp nhận", ...user}
        }
        let attr_arr = [];
        for(let i in products[0]){
            attr_arr.push(i);
        }
        await msClient.insertRows("phukiendhqg.order", attr_arr, products);
        res.json({
            isSuccess: true,
            Alert: res.Alert
        })
        // save new user
        msClient.updateRows("phukiendhqg.user", user_attr_arr, [user]);

    }catch(err){
        res.Alert.push(createSystemErrMessage(001));
        res.json({
            isSuccess: false,
            Alert: res.Alert
        })
    }
});

router.put("/order", checkAdminByCookie, async (req, res) => {
    // req.body: {orders: [order]}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        let orders = req.body.orders;
        let attr_arr = [];
        for(let i in orders[0]){
            attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.order", attr_arr, orders);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.put("/order-userwarranty", async (req, res) => {
    // req.body: {record_id: record_id}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        let record_id = req.body.record_id;
        if(!record_id || record_id == "")  return res.end();
        let sql_trigger_warranty = `UPDATE phukiendhqg.order SET status="${escape("đang bảo hành")}" WHERE record_id="${record_id}"`;
        await msClient.promiseQuery(sql_trigger_warranty);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001));
        res.json({Alert: res.Alert})
    }
});

module.exports = router;