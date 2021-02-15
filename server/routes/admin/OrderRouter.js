const express = require("express");
const msClient = require("../utils/mysql/mysql");
const router = express.Router();
const { createSystemErrMessage, unescapeSelectedData } = require("../utils/functions")
const { getTimeStampId } = require("../utils/const/timestamp_id_keeper");
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/order", checkAdminByCookie, async (req, res) => {
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