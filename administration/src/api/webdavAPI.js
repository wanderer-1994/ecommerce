import axios from "axios";
import * as categoryModel from "../objectModels/CategoryModel";
import * as eavUtils from "../objectModels/eavUtils";
import queryString from "query-string";

axios.defaults.baseURL = window.location.origin.replace(/\:\d+$/, `:${process.env.REACT_APP_SERVER_PORT}`);

async function listDirectory (folder_path) {
    try {
        let response = await axios({
            method: "GET",
            url: "/api" + folder_path
        });
        let data = response.data;
        if (data.item_list) {
            let folders = data.item_list.filter(item => item.is_directory === true).sort((a, b) => a.path - b.path);
            let files = data.item_list.filter(item => item.is_file === true).sort((a, b) => a.path - b.path);
            data.item_list = [...folders, ...files]
        }
        return data;
    } catch (err) {
        throw err;
    }
}

async function mkdir (folder_path) {
    try {
        let response = await axios({
            method: "POST",
            url: "/api" + folder_path
        });
        let data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
}

async function deleteItem (item_path) {
    try {
        let response = await axios({
            method: "DELETE",
            url: "/api" + item_path
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

async function uploadFiles (folder_path, formData) {
    try {
        let response = await axios({
            method: "POST",
            url: "/api" + folder_path,
            data: formData,
            headers: {"content-type": "multipart/form-data"}
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export {
    listDirectory,
    mkdir,
    deleteItem,
    uploadFiles
}