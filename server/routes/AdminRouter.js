const express = require("express");
const msClient = require("../utils/mysql/mysql");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const { createSystemErrMessage } = require("../utils/functions")
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

// router.use(checkAdminByCookie);

router.get("/admin-staff", checkAdminByCookie, async (req, res) => {
    try{
        if(!req.admin || !req.admin.admin_id) return res.redirect("/");
        res.json({admin: req.admin});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001));
        res.json({Alert: res.Alert});
    }
});

router.get("/admin-root", checkAdminByCookie, async (req, res) => {
    try{
        if(!req.admin || !req.admin.admin_id) return res.redirect("/");

        let sql_get_admins = "SELECT * FROM phukiendhqg.admin";
        let admins = await msClient.promiseQuery(sql_get_admins);
        res.json({admins: admins});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert});
    }
});

router.post("/admin/auth", checkAdminByCookie, async (req, res) => {
    // req.body: {admin_cookie, admin_tel, admin_pas}
    // res.json({admin, Alert})
    try{
        if(req.admin && req.admin.admin_id) return res.json({admin: req.admin});
        let require = ["admin_tel", "admin_pas"];
        let { admin_tel, admin_pas } = req.body;
        let admin;
        let isSaveCookie = false;
        if(!admin_tel || admin_tel == "" || !admin_pas || admin_pas == "") return res.end();
        let sql_findAdmin = `SELECT * FROM phukiendhqg.admin WHERE admin_tel="${admin_tel}" AND admin_pas="${admin_pas}" LIMIT 1;`
        let admins = await msClient.promiseQuery(sql_findAdmin);
        if(admins[0] && admins[0].admin_id){
            admin = admins[0];
            if(!admin.admin_cookie || admin.admin_cookie == ""){
                admin.admin_cookie = uuidv4();
                isSaveCookie = true;
            }
        }
        res.json({admin: admin});
        if(isSaveCookie){
            msClient.updateRows("phukiendhqg.admin", ["admin_id", "admin_cookie"], [admin]);
        }
    }catch(err){
        res.Alert.push(createSystemErrMessage(001));
        res.json({admin: [], Alert: res.Alert})
    }
})

router.post("/admin/unauth", checkAdminByCookie, async (req, res) => {
    // req.body: {admin_cookie}
    // res.json({admin, Alert})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        let sql_deleteAdminCookie = `UPDATE phukiendhqg.admin SET admin_cookie="" WHERE admin_cookie="${req.admin.admin_cookie}";`
        await msClient.promiseQuery(sql_deleteAdminCookie);
        res.json({isSuccess: true});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001));
        res.json({isSuccess: false, Alert: res.Alert})
    }
})

router.post("/admin", checkAdminByCookie, async (req, res) => {
    // req.body: {admins: [admin]}
    // admin:    {admin_tel, admin_pas, admin_name}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let admins = req.body.admins;
        let attr_arr = [];
        for(let i in admins[0]){
            attr_arr.push(i);
        }
        await msClient.insertRows("phukiendhqg.admin", attr_arr, admins);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
});

router.put("/admin", checkAdminByCookie, async (req, res) => {
    // req.body: {admins: [admin]}
    // admin:    {admin_id, admin_tel, admin_pas, admin_name}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let admins = req.body.admins;
        let attr_arr = [];
        for(let i in admins[0]){
            attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.user", attr_arr, admins);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
});

router.delete("/admin", checkAdminByCookie, async (req, res) => {
    // req.body:    {admin_ids: [admin_id]}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let admin_ids = req.body.admin_ids;
        await msClient.deleteRows("phukiendhqg.admin", "admin_id", admin_ids);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert})
    }
});

module.exports = router;