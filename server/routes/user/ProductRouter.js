const express = require("express");
const router = express.Router();
const msClient = require("../utils/mysql/mysql");
const { updateSupInfo } = require("../utils/subinfo_updater/general_updater");
const {
    createSystemErrMessage,
    unescapeSelectedData
} = require("../utils/functions");
const {
    items_per_page
} = require("../utils/const/config");
const { checkAdminByCookie } = require("../utils/middlewares/middlewares");

router.get("/product", async (req, res) => {
    // req.query= {page, category, searchName}
    // res.json({products: [], Alert: [], currentPage: number, totalPages: number})
    try{
        let prod_attr_for_client =  ["prod_id", "prod_link", "sup_name", "prod_name", "prod_review", "prod_thumb", "prod_img",
                                    "category", "warranty", "prod_price", "saleoff_percent", "prod_trend", "prod_description"];
        let attrs_to_select = msClient.getSqlAttrToSelect(prod_attr_for_client);

        let query = req.query;
        let sql_select_condition = "(prod_stock > 0) AND last_updated = 0 AND";
        if(query.prod_id){
            sql_select_condition = `${sql_select_condition} (prod_id="${query.prod_id} AND ")`;
        }
        if(query.category){
            sql_select_condition = `${sql_select_condition} (${msClient.getSqlCategoryLike_OrCondition(query.category)}) AND`;
        };

        if(query.searchName){
            // query.searchName = query.searchName.toUpperCase(); really wrong bởi vì toUpperCase() phải sau hàm escape mới cho kết quả search chính xác
            let searchName_condition = `UPPER(sup_name) like "%${escape(query.searchName).toUpperCase()}%"
                                        OR UPPER(prod_name) like "%${escape(query.searchName).toUpperCase()}%"
                                        OR UPPER(s_key) like "%${escape(query.searchName).toUpperCase()}%"`;
            sql_select_condition = `${sql_select_condition} (${searchName_condition}) AND`;
        };
        sql_select_condition = sql_select_condition.replace(/\sAND$/, "");

        let sql_search_product = `SELECT ${attrs_to_select} FROM phukiendhqg.product WHERE (${sql_select_condition}) ORDER BY prod_trend DESC`;
        let products = await msClient.promiseQuery(sql_search_product);
        let currentPage = query.page || 1;
        let totalPages = products.length/items_per_page;
        if(totalPages > parseInt(totalPages)) totalPages = parseInt(totalPages) + 1;
        if(currentPage < 1) currentPage = 1;
        if(currentPage > totalPages) currentPage = totalPages;
        let slice_start = (currentPage - 1)*items_per_page;
        let slice_end = currentPage*items_per_page;
        products = products.slice(slice_start, slice_end);
        res.json({
            products: products,
            totalPages: totalPages,
            currentPage: currentPage
        })
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert});
    }
})

module.exports = router;