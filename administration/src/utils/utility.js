const utility = {
    isValueEmpty: function (value) {
        return value === null || value === undefined || value === ""
    },

    webdavToPublicUrl: function (webdav_url) {
        if (typeof(webdav_url) !== "string") return webdav_url;
        return  webdav_url.replace("/webdav", "");
    }
};

export default utility;