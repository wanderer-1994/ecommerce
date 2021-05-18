const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const PATH = require("path");
const config = require("./config");

(async function initiateFileServer () {
    let is_root_exist = await fs.pathExists(config.ROOT_FOLDER);
    if (!is_root_exist) {
        await fs.mkdir(config.ROOT_FOLDER);
    };

    router.get("*", async (req, res) => {
        try {
            let folder_path = req.path.replace(/\/$/, "");
            folder_path = `${config.ROOT_FOLDER}${folder_path}`;
            let is_path_exist = await fs.pathExists(folder_path);
            if (!is_path_exist) {
                return res.json({
                    path_exist: false
                })
            };
            let stat = fs.lstatSync(folder_path);
            if (stat.isFile()) {
                res.sendFile(folder_path);
            } else if (stat.isDirectory()) {
                let item_list = await fs.readdir(folder_path);
                for (let i = 0; i < item_list.length; i++) {
                    let item_stat = fs.lstatSync(`${folder_path}/${item_list[i]}`);
                    item_list[i] = {
                        name: item_list[i],
                        is_file: item_stat.isFile(),
                        is_directory: item_stat.isDirectory()
                    }
                }
                res.json({
                    item_list: item_list,
                    icon_directory: config.ICON_DIRECTORY,
                    icon_file: config.ICON_FILE
                });
            } else {
                res.json({
                    path_exist: false
                })
            }
        } catch (err) {
            res.json({
                err: err.message
            })
        }
    });
})();

module.exports = router;
