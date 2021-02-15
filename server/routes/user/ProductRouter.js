const express = require("express");
const router = express.Router();
const msClient = require("../utils/mysql/mysql");
const search = require("../../utils/search/search");
const {
    createSystemErrMessage,
} = require("../utils/functions");
const {
    items_per_page
} = require("../../utils/const/config");

router.get("/product", async (req, res) => {
    // req.query= {page, categories, entity_ids, refinements, searchPhrase}
    // res.json({products: [], Alert: [], currentPage: number, totalPages: number})
    try{
        let prod_attr_for_client =  ["prod_id", "prod_link", "sup_name", "prod_name", "prod_review", "prod_thumb", "prod_img",
                                    "category", "warranty", "prod_price", "saleoff_percent", "prod_trend", "prod_description"];
        let attrs_to_select = msClient.getSqlAttrToSelect(prod_attr_for_client);

        let searchConfig = {
            categories: req.query.categories ? req.query.categories.split("|") : null,
            entity_ids: req.query.entity_ids ? req.query.entity_ids.split("|") : null,
            refinements: search.extractRefinements(req),
            searchPhrase: req.query.keyword,
            searchDictionary: msClient.searchDictionary,
            page: req.query.page
        };
        let searchResult = await search.search(searchConfig);
        res.json(searchResult);
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert});
    }
})

module.exports = router;