const fs = require("fs-extra");

async function test () {
    try {
        // let del = fs.rmdirSync("abc/hihi.js", {recursive: true});
        // let del = await fs.mkdir("abc/def");
        console.log(fs.existsSync("./abc/server.js"));
    } catch (err) {
        console.log(err);
    }
};

test();