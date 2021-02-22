const express = require("express");
const msClient = require("../utils/mysql/mysql");
const router = express.Router();
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/category", async (req, res) => {
    try{
        let sql_get_categories =
        `
        SLECT \`attributes\`.*, \`ce\`.* FROM (
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_int AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            WHERE \`ce\`.is_online = '1'
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_decimal AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            WHERE \`ce\`.is_online = '1'
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_varchar AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            WHERE \`ce\`.is_online = '1'
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_text AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            WHERE \`ce\`.is_online = '1'
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_datetime AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            WHERE \`ce\`.is_online = '1'
            UNION
            SELECT \`ce\`.*, \`eav\`.attribute_id, \`eav\`.value
            FROM \`ecommerce\`.\`category_entity\` AS \`ce\`
            LEFT JOIN \`ecommerce\`.category_eav_multi_value AS \`eav\` ON \`eav\`.entity_id = \`ce\`.entity_id
            WHERE \`ce\`.is_online = '1'
        ) AS \`ce\`
        LEFT JOIN \`ecommerce\`.\`category_eav\` AS \`attributes\`
        ON \`sum\`.attribute_id = \`attributes\`.attribute_id
        `;
        let categories = await msClient.promiseQuery(sql_get_categories);
        res.json({categories: categories});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

module.exports = router;