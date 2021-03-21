const express = require("express");
const router = express.Router();
const msClient = require("../../system_modules/mysql/mysql");
const categoryEavMgr = require("../../system_modules/category/categoryEavMgr");

router.get("/eav", async (req, res) => {
    try {
        let category_eavs = await categoryEavMgr.getCategoryEavs();
        res.json({
            category_eavs: category_eavs
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.post("/eav", async (req, res) => {
    try {
        let category_eavs = Array.isArray(req.body.category_eavs) ? req.body.category_eavs : [];
        let promises = [];
        category_eavs.forEach(item => {
            promises.push(
                categoryEavMgr.saveCategoryEav(item, {mode: "CREATE"})
                .then(() => {
                    item.isSuccess = true;
                })
                .catch(err => {
                    item.isSuccess = false;
                    item.m_failure = err.message;
                })
            )
        });
        Promise.all(promises).then(async () => {
            msClient.categoryEav = await categoryEavMgr.getCategoryEavs();
            res.json({
                category_eavs: category_eavs
            })
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.put("/eav", async (req, res) => {
    try {
        let category_eavs = Array.isArray(req.body.category_eavs) ? req.body.category_eavs : [];
        let promises = [];
        category_eavs.forEach(item => {
            promises.push(
                categoryEavMgr.saveCategoryEav(item, {mode: "UPDATE"})
                .then(() => {
                    item.isSuccess = true;
                })
                .catch(err => {
                    item.isSuccess = false;
                    item.m_failure = err.message;
                })
            )
        });
        Promise.all(promises).then(async () => {
            msClient.categoryEav = await categoryEavMgr.getCategoryEavs();
            res.json({
                category_eavs: category_eavs
            })
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.delete("/eav", async (req, res) => {
    try {
        let category_eav_ids = Array.isArray(req.body.category_eav_ids) ? req.body.category_eav_ids : [];
        let result = await categoryEavMgr.deleteCategoryEavs(category_eav_ids);
        msClient.categoryEav = await categoryEavMgr.getCategoryEavs();
        res.json({
            isSuccess: true,
            result: result
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

module.exports = router;