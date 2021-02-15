const express = require("express");
const msClient = require("../utils/mysql/mysql");
const router = express.Router();
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/user-user", async (req, res) => {
    try{
        let user_tel = req.query.user_tel;
        if(!user_tel || user_tel == "") return res.end();
        let sql_get_users_by_tel = `SELECT * FROM phukiendhqg.user WHERE user_tel="${user_tel}" LIMIT 1`;
        let users = await msClient.promiseQuery(sql_get_users_by_tel);
        res.json({user: users[0]});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

module.exports = router;