const express = require("express");
const router = express.Router();
const msClient = require("../../system_modules/mysql/mysql");
const eavGroupMgr = require("../../system_modules/eav/eavGroupMgr");

router.get("/eav/group", async (req, res) => {
    try {
        let entity_type = req.query.entity_type;
        let eav_groups = await eavGroupMgr.getEavGroups(entity_type);
        res.json({
            entity_type: entity_type,
            eav_groups: eav_groups
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.post("/eav/group", async (req, res) => {
    try {
        let entity_type = req.query.entity_type;
        let eav_groups = Array.isArray(req.body.eav_groups) ? req.body.eav_groups : [];
        let promises = [];
        eav_groups.forEach(item => {
            promises.push(
                eavGroupMgr.saveEavGroup(entity_type, item, {mode: "CREATE"})
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
            res.json({
                eav_groups: eav_groups
            })
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.put("/eav/group", async (req, res) => {
    try {
        let entity_type = req.query.entity_type;
        let eav_groups = Array.isArray(req.body.eav_groups) ? req.body.eav_groups : [];
        let promises = [];
        eav_groups.forEach(item => {
            promises.push(
                eavGroupMgr.saveEavGroup(entity_type, item, {mode: "UPDATE"})
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
            res.json({
                eav_groups: eav_groups
            })
        })
    } catch (err) {
        res.json({
            err: err.message
        })
    }
});

router.delete("/eav/group", async (req, res) => {
    try {
        let entity_type = req.query.entity_type;
        let eav_group_ids = Array.isArray(req.body.eav_group_ids) ? req.body.eav_group_ids : [];
        let result = await eavGroupMgr.deleteEavGroups(entity_type, eav_group_ids);
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