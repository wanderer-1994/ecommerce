const formidable = require("formidable");
const formParser = formidable({multiples: true});
formParser.parseAsync = (req) => {
    return new Promise ((resolve, reject) => {
        formParser.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({
                fields: fields,
                files: files
            })
        })
    })
};

module.exports = formParser;