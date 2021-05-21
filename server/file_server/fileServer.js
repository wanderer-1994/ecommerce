const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const PATH = require("path");
const formParser = require("../system_modules/form/formParser");
const config = require("./config");

function getFolderPath (req, res, next) {
    try {
        req.original_folder_path = decodeURIComponent(req.path.replace(/\/$/, ""));
        req.folder_path = `${config.ROOT_FOLDER}${req.original_folder_path}`;
        return next();
    } catch (err) {
        return next();
    }
}

async function saveFile (file, folder_path, isOverWrite) {
    try {
        folder_path = folder_path.replace(/\/$/, "");
        let file_path = folder_path + "/" + file.name;
        if (fs.existsSync(file_path) && !isOverWrite) {
            throw new Error(`Could not upload file ${file.name}. File already exists!`);
        };
        await fs.copy(file.path, folder_path + "/" + file.name);
        await fs.unlink(file.path);
    } catch (err) {
        throw err
    }
}

(async function initiateFileServer () {
    let is_root_exist = await fs.pathExists(config.ROOT_FOLDER);
    if (!is_root_exist) {
        await fs.mkdir(config.ROOT_FOLDER);
    };

    router.get("*", getFolderPath, async (req, res) => {
        try {
            let is_path_exist = await fs.pathExists(req.folder_path);
            if (!is_path_exist) {
                return res.json({
                    path_exist: false
                })
            };
            let stat = fs.lstatSync(req.folder_path);
            if (stat.isFile()) {
                res.sendFile(req.folder_path);
            } else if (stat.isDirectory()) {
                let item_list = await fs.readdir(req.folder_path);
                for (let i = 0; i < item_list.length; i++) {
                    let item_stat = fs.lstatSync(`${req.folder_path}/${item_list[i]}`);
                    item_list[i] = {
                        name: item_list[i],
                        is_file: item_stat.isFile(),
                        is_directory: item_stat.isDirectory()
                    }
                }
                res.json({
                    item_list: item_list,
                    icon_directory: config.ICON_DIRECTORY,
                    icon_file: config.ICON_FILE,
                    icon_delete: config.ICON_DELETE
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

    router.post("*", getFolderPath, async (req, res) => {
        try {
            let formData = await formParser.parseAsync(req);
            if (formData.fields.action && formData.fields.action === "upload") {
                let promises = [];
                Object.keys(formData.files).forEach(key => {
                    promises.push(
                        saveFile(formData.files[key], req.folder_path, formData.fields.isOverWrite)
                        .then(() => {return {
                            isSuccess: true,
                            file: formData.files[key].name
                        }})
                        .catch(err => {
                            return {
                                isSuccess: false,
                                err_message: err.message,
                                file: formData.files[key].name
                            }
                        })
                    );
                })
                Promise.all(promises).then(data => {
                    res.json({
                        result: data
                    })
                })
            } else {
                await fs.mkdir(req.folder_path);
                res.json({
                    isSuccess: true
                })
            }
        } catch (err) {
            res.json({
                err_message: err.message
            })
        }
    });

    router.delete("*", getFolderPath, async (req, res) => {
        try {
            if (req.folder_path === config.ROOT_FOLDER) {
                throw new Error("Delete root folder is prohibited!")
            };
            fs.rmdirSync(req.folder_path, {recursive: true});
            res.json({
                isSuccess: true
            })
        } catch (err) {
            res.json({
                err_message: err.message
            })
        }
    })

})();

module.exports = router;
