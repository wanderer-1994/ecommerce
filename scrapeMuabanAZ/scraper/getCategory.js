const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");

async function getCategory(){
    let categoryList = [];
    let response = await axios({
        method: "GET",
        url: "https://muabangiasiaz.com/"
    });
    const $ = cheerio.load(response.data);
    let rawList = $(".menu-parent .menu:nth-child(3) .ul-child a");
    for(let i = 0; i < rawList.length; i++){
        console.log(i);
        let category_path = rawList[i].attribs.href.replace(/.html$/, "").replace(/.htm$/, "").replace(/^san-pham/, "");
        let category_name = rawList[i].children[0].data;
        let category_link = rawList[i].attribs.href;
        let category = {
            category_path: category_path,
            category_name: category_name,
            category_link: category_link
        }
        categoryList.push(category);
    }
    // fs.writeJSON("../result/category.json", categoryList);
    console.log("end");
}

console.log("start");
getCategory();