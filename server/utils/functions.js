const escapeHTML = (text) => {
    let htmlString = ["\/", "\"", "\'", "\/", "\&"];
    if(typeof(text) != "string") return text;
    htmlString.forEach(item => {
        text = text.replace(new RegExp(item, "g"), `\\${item}`)
    });
    return text;
}

const createSystemErrMessage = ERRCODE => {
    return "<h3>LỖI HỆ THỐNG --- ERRCODE_" + ERRCODE + "</h3>"
}

unescapeSelectedData = ori_data_array => {
    let data_array = JSON.parse(JSON.stringify(ori_data_array));
    data_array.forEach((data_item, index) => {
        for(let i in data_item){
            data_item[i] = unescape(data_item[i]);
        }
        data_array[index] = data_item;
    })
    return data_array;
}

module.exports = {
    escapeHTML,
    createSystemErrMessage,
    unescapeSelectedData
}