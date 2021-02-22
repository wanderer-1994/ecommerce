const express = require("express");
const router = express.Router();
const msClient = require("../utils/mysql/mysql");
const mysqlutils = require("../../utils/mysql/mysqlutils");
const { updateSupInfo } = require("../utils/subinfo_updater/general_updater");
const {
    escapeHTML,
    createSystemErrMessage,
    validateCartContent,
    unescapeSelectedData
} = require("../utils/functions");
const {
    items_per_page
} = require("../utils/const/config");
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.post("/cart/validate", async (req, res) => {
    // req.body = {prod_ids: prod_ids}
    // res.json({products: [], Alert: []})
    try{
        let prod_ids = req.body.prod_ids || [];
        if(!prod_ids || !prod_ids.length || prod_ids.length <= 0) return res.end();
        prod_ids.forEach((item, index) => {
            if(!item || item == "") prod_ids.splice(index, 1);
        })
        if(prod_ids.length <= 0) return res.end();

        let prod_attr_for_client =  ["prod_id"];
        let sqlSelectProduct =
        `
        SELECT "${prod_attr_for_client.map(item => mysqlutils.escapeQuotes(item)).join(`", "`)}"
        FROM phukiendhqg.product
        WHERE prod_id IN ("${prod_ids.map(item => mysqlutils.escapeQuotes(item)).join(`", "`)}")
        AND (prod_stock > 0) AND (last_updated = 0);
        `;
        let products = await msClient.promiseQuery(sqlSelectProduct);
        res.json({
            products: products,
            Alert: res.Alert
        })
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert});
    }
})

router.post("/access/statistic", async (req, res) => {
    // req.body = {machine_key: machine_key, last_access: last_access}
    // res.json({isSuccess: boolean})
    try{
        machine_key = req.body.machine_key;
        last_access = req.body.last_access;
        if(isNaN(parseInt(machine_key)) || isNaN(parseInt(last_access))) return res.end();
        
        let sqlSelectMachine = `SELECT* FROM phukiendhqg.accessrecord WHERE machine_key = "${mysqlultils.escapeQuotes(machine_key)}" LIMIT 1;`;
        let machines = await msClient.promiseQuery(sqlSelectMachine);
        let machine_item = new Object();
        if(machines && machines[0] && machines[0].machine_key){
            // increase
            machine_item = machines[0];
            let access_history = JSON.parse(machine_item.access_history);
            access_history.push(last_access);
            machine_item.access_history = JSON.stringify(access_history);
        }else{
            // save
            machine_item.access_history = JSON.stringify([last_access]);
            machine_item.machine_key = machine_key;
        }
        let sql =
        `
        INSERT INTO \`ecommerce\`.accessrecord (\`machine_key\`, \`access_history\`)
        VALUES ("${mysqlutils.escapeQuotes(machine_item.machine_key)}", "${mysqlutils.escapeQuotes(machine_item.access_history)}")
        ON DUPLICATE KEY UPDATE \`access_history\`= "${mysqlutils.escapeQuotes(machine_item.access_history)}"
        `;
        await msClient.promiseQuery(sql);
        res.json({
            isSuccess: true
        })
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert});
    }
})

module.exports = router;