const express = require("express");
const router = express.Router();
const msClient = require("../../system_modules/mysql/mysql");
const productEavMgr = require("../../system_modules/product/productEavMgr");

router.get("/eav", async (req, res) => {
    try {
        let sql_get_product_eav =
        `
        SELECT * FROM \`ecommerce\`.product_eav;
        `;
        let result = await msClient.promiseQuery(sql_get_product_eav);
        res.json({
            product_eav: result
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.post("/eav", (req, res) => {
    try {
        let product_eavs = Array.isArray(req.body.product_eavs) ? req.body.product_eavs : [];
        let promises = [];
        product_eavs.forEach(item => {
            promises.push(
                productEavMgr.saveProductEav(item, {mode: "CREATE"})
                .then(() => {
                    item.isSuccess = true;
                })
                .catch(err => {
                    item.isSuccess = false;
                    item.m_failure = err.message;
                })
            )
        });
        Promise.all(promises).then(() => {
            res.json({
                product_eavs: product_eavs
            })
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.put("/eav", (req, res) => {
    try {
        let product_eavs = Array.isArray(req.body.product_eavs) ? req.body.product_eavs : [];
        let promises = [];
        product_eavs.forEach(item => {
            promises.push(
                productEavMgr.saveProductEav(item, {mode: "UPDATE"})
                .then(() => {
                    item.isSuccess = true;
                })
                .catch(err => {
                    item.isSuccess = false;
                    item.m_failure = err.message;
                })
            )
        });
        Promise.all(promises).then(() => {
            res.json({
                product_eavs: product_eavs
            })
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.delete("/eav", (req, res) => {
    try {
        let product_eav_ids = Array.isArray(req.body.product_eav_ids) ? req.body.product_eav_ids : [];
        let result = await productEavMgr.deleteProductEavs(product_eav_ids);
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