const express = require("express");
const msClient = require("../../system_modules/mysql/mysql");
const mysqlutils = require("../../system_modules/mysql/mysqlutils");
const router = express.Router();
const { checkAdminByCookie } = require("../../system_modules/middlewares/middlewares");
const { createSystemErrMessage } = require("../../system_modules/functions");
const { modelizeCategoriesData } = require("../../system_modules/category/categoryModel");
const { saveCategoryEntity, deleteCategoryEntities } = require("../../system_modules/category/category");

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
    try{
        let categories = req.body.categories;
        for (let i = 0; i < categories.length; i++) {
            try {
                await saveCategoryEntity(categories[i], {mode: "CREATE"});
                categories[i].isSuccess = true;
            } catch (err) {
                categories[i].isSuccess = false;
                categories[i].m_failure = err.toString();
            }
        };
        res.json(categories);
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.put("/category", async (req, res) => {
    // req.body:    {categories: [category]}
    try{
        let categories = req.body.categories;
        for (let i = 0; i < categories.length; i++) {
            try {
                await saveCategoryEntity(categories[i], {mode: "UPDATE"});
                categories[i].isSuccess = true;
            } catch (err) {
                categories[i].isSuccess = false;
                categories[i].m_failure = err.toString();
            }
        };
        res.json(categories);
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

router.delete("/category", checkAdminByCookie, async (req, res) => {
    // req.body:    {category_ids: [category_id]}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        let category_ids = req.category_ids;
        let result = await deleteCategoryEntities(category_ids);
        res.json({
            isSuccess: true,
            result: result
        })
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

module.exports = router;