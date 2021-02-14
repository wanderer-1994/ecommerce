const express = require("express");
const msClient = require("../utils/mysql/mysql");
const router = express.Router();
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/category", async (req, res) => {
    try{
        let sql_get_categories = "SELECT * FROM phukiendhqg.category";
        let categories = await msClient.promiseQuery(sql_get_categories);
        res.json({categories: categories});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

module.exports = router;