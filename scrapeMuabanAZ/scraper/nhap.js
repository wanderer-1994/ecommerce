const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const json2csvParser = require("json2csv").parse;

for(let i =0; i<6; i++){
    console.log("fresh init err console.log", i);
}

const except = ["name", "thumbnail_image", "categories", "price", "base_image", "description", "base_image_label", "thumbnail_image_lable"]

fs.readFile("./finalProduct/fields", "utf8", async (err, data) => {
    let fields = data.split("/");
    console.log(fields.length);
    let products = await fs.readFileSync("./finalProduct/trial100_final.json", "utf8");
    products = JSON.parse(products);
    products.forEach(product => {
        fields.forEach(key => {
            let isExist = false;
            except.forEach(existed_key => {
                if(key == existed_key) isExist = true;
            })
            if(!isExist) product[key] = "";
        })
    });
    let csv = json2csvParser(products, {fields});
    console.log(csv);
    fs.writeFile("./finalProduct/trial100_final.csv", csv);
})

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");

let linkList = "";

axios({
    method: "GET",
    url: "https://www.jondon.com/"
}, response => {
    let $ = cheerio.load(body);
    let rawList = $("nav li.level1>a");
    for(let i = 0; i < rawList.length; i++){
        linkList += (rawList[i].attribs.href + "\n");
    }
    linkList = linkList.replace(/\n$/, "");
    // fs.writeFile("./files/rootLinks", linkList);
})