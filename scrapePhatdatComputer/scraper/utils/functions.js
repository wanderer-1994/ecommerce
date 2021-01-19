const escapeHTML = (text) => {
    let htmlString = ["\/", "\"", "\'", "\/", "\&"];
    if(typeof(text) != "string") return text;
    htmlString.forEach(item => {
        text = text.replace(new RegExp(item, "g"), `\\${item}`)
    });
    return text;
}

module.exports = {
    escapeHTML
}