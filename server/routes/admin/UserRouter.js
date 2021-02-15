const express = require("express");
const msClient = require("../utils/mysql/mysql");
const router = express.Router();
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/user", checkAdminByCookie, async (req, res) => {
    try{
        if(!req.admin || !req.admin.admin_id) return res.redirect("/");

        let sql_get_users = "SELECT * FROM phukiendhqg.user";
        let users = await msClient.promiseQuery(sql_get_users);
        res.json({users: users});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

router.post("/user", checkAdminByCookie, async (req, res) => {
    // req.body: {users: [user]}
    // user:     {user_tel, user_name, user_address, user_location, completed_order}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let users = req.body.users;
        let attr_arr = [];
        for(let i in users[0]){
            attr_arr.push(i);
        }
        await msClient.insertRows("phukiendhqg.user", attr_arr, users);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.post("/user-addComletedOrder", checkAdminByCookie, async (req, res) => {
    // req.body: {user_id: user_id}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let user_id = req.body.user_id;
        let sql_increase_completed_order_by_1 =
        `UPDATE phukiendhqg.user SET completed_order=(completed_order + 1) WHERE user_id="${user_id}"`
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.put("/user", checkAdminByCookie, async (req, res) => {
    // req.body: {users: [user]}
    // user:     {user_id, user_tel, user_name, user_address, user_location, completed_order}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let users = req.body.users;
        let attr_arr = [];
        for(let i in users[0]){
            attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.user", attr_arr, users);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.delete("/user", checkAdminByCookie, async (req, res) => {
    // req.body:    {user_ids: [user_id]}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let user_ids = req.body.user_ids;
        await msClient.deleteRows("phukiendhqg.user", "user_id", user_ids);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

module.exports = router;