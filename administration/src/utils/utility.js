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
    }
};

export default utility;