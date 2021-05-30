const axios = require("axios");

const utility = {
    isValueEmpty: function (value) {
        return value === null || value === undefined || value === ""
    },

    webdavToPublicUrl: function (webdav_url) {
        if (typeof(webdav_url) !== "string") return webdav_url;
        return  webdav_url.replace("/webdav", "");
    },

    toPublicUrlWithHost: function (public_url) {
        if (typeof(public_url) !== "string") return public_url;
        if (/^http/.test(public_url)) {
            return public_url;
        };
        return axios.defaults.baseURL + public_url;
    },

    sortArrayByAttribute: function ({ array, attribute_id, sort_rule }) {
        try {
            let sortable_items = array.filter(item => typeof(item[attribute_id]) === "number" && item[attribute_id] > 0);
            let unsortable_items = array.filter(item => typeof(item[attribute_id]) !== "number" || item[attribute_id] < 0);
            sortable_items.sort((a, b) => {
                if (sort_rule === "DES") return b[attribute_id] - a[attribute_id];
                return a[attribute_id] - b[attribute_id];
            });
            return [...sortable_items, ...unsortable_items];
        } catch (err) {
            throw err;
        }
    }
};

export default utility;