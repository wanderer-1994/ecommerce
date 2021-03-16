const express = require("express");
const msClient = require("../../system_modules/mysql/mysql");
const router = express.Router();
const { checkAdminByCookie } = require("../../system_modules/middlewares/middlewares");
const { createSystemErrMessage } = require("../../system_modules/functions");
const { modelizeCategoriesData } = require("../../system_modules/category/categoryModel");

router.get("/category", async (req, res) => {
    try{
        let sql_get_categories =
        `
        SELECT \`attributes\`.*, \`ce\`.* FROM (
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_int AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_decimal AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_varchar AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_text AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_datetime AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_multi_value AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
        ) AS \`ce\`
        LEFT JOIN \`ecommerce\`.\`category_eav\` AS \`attributes\`
        ON \`ce\`.attribute_id = \`attributes\`.attribute_id
        `;
        let rawData = await msClient.promiseQuery(sql_get_categories);
        let categories = modelizeCategoriesData(rawData, {isAdmin: true});
        res.json({categories: categories});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

router.post("/category", async (req, res) => {
    // req.body:    {categories: [category]}
    // category:    {category_path, category_name, priority}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let categories = req.body.categories;
        let attr_arr = [];
        for(let i in categories[0]){
            attr_arr.push(i);
        }
        await msClient.insertRows("phukiendhqg.category", attr_arr, categories);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.put("/category", checkAdminByCookie, async (req, res) => {
    // req.body:    {categories: [category]}
    // category:    {category_id, category_path, category_name, priority}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let categories = req.body.categories;
        let attr_arr = [];
        for(let i in categories[0]){
            attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.category", attr_arr, categories);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.delete("/category", checkAdminByCookie, async (req, res) => {
    // req.body:    {category_ids: [category_id]}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        
        let category_ids = req.body.category_ids;
        await msClient.deleteRows("phukiendhqg.category", "category_id", category_ids);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

module.exports = router;