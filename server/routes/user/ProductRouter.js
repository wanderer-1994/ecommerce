const express = require("express");
const router = express.Router();
const msClient = require("../../system_modules/mysql/mysql");
const search = require("../../system_modules/search/search");
const config = require("../../system_modules/const/config");
const {
    createSystemErrMessage,
} = require("../../system_modules/functions");

router.get("/product", async (req, res) => {
    // req.query= {page, categories, entity_ids, refinements, searchPhrase}
    // res.json({products: [], Alert: [], currentPage: number, totalPages: number})
    try{
        let refinements = search.extractRefinements(req);
        refinements.forEach((attribute, index) => {
            let match = msClient.productEav.find(m_item => m_item.attribute_id == attribute.attribute_id && m_item.admin_only != 1);
            if (match) {
                attribute.html_type = match.html_type;
                attribute.data_type = match.data_type;
            } else {
                refinements[index] = null;
            }
        });

        let isRefinementsValid = true;
        refinements = refinements.filter(item => {
            if (item === null) {
                isRefinementsValid = false;
                return false;
            };
            return true;
        });

        if (!isRefinementsValid) {
            res.redirect("./abc");
        } else {
            let searchConfig = {
                categories: req.query.categories ? req.query.categories.split("|") : null,
                entity_ids: req.query.entity_ids ? req.query.entity_ids.split("|") : null,
                categoryRecursive: ["0", "1"].indexOf(req.query.categoryRecursive) !== -1 ? parseInt(req.query.categoryRecursive) : 1,
                refinements: refinements,
                searchPhrase: req.query.keyword,
                searchDictionary: msClient.searchDictionary,
                pagination: {
                    page: req.query.page,
                    psize: config.PAGE_SIZE
                },
                isAdmin: false
            };
            let searchResult = await search.search(searchConfig);
            res.json(searchResult);
        }
    }catch(err){
        res.Alert.push(createSystemErrMessage(001))
        res.json({Alert: res.Alert});
    }
})

module.exports = router;