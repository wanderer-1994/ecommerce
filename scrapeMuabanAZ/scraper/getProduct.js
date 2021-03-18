const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");

function set_out_price(in_price){
    let in_price_range = [10000, 30000, 50000, 100000, 150000];
    let profit_range = [7000, 10000, 15000, 20000, 25000];
    let out_price;
    for(let i = 0; i < in_price_range.length; i++){
        if(in_price < in_price_range[i]){
            out_price = in_price + profit_range[i];
            break;
        }
    }
    if(!out_price) out_price = in_price + 30000;
    return out_price;
}

async function getProduct(data, cb){
    console.log(`getting #${data.index + 1}: ${data.rootCategories[data.index].category_link}`)
    let response = await axios({
        method: "GET",
        url: data.rootCategories[data.index].category_link
    });
    const $ = cheerio.load(response.data);
    let rawProductList = $(".product-all .product");
    // get product data
    let required = ["thumb", "image", "prod_name", "prod_link", "prod_code", "category", "in_price", "out_price", "prod_stock", "warranty"];
    let category = data.rootCategories[data.index].category_link.replace(/https:\/\/muabangiasiaz.com\/san-pham/, "").replace(/\.htm.*$/, "");
    for(let i = 0; i < rawProductList.length; i++){
        let product = $(".product-all .product").eq(i);
        let data_product = new Object;
        // 1 - category
        data_product.category = category;
        // 2 - thumb
        data_product.thumb = "https://muabangiasiaz.com/" + product.find("img")[0].attribs.src;
        // 3 - prod_img
        data_product.prod_img = data_product.thumb.replace("thumb/400x400/2/", "");
        // 3 - name
        data_product.prod_name = product.find(".ten-product h3 a")[0].children[0].data.replace(/^\s*/, "").replace(/\s*$/, "");
        // 3 - link
        data_product.prod_link = "https://muabangiasiaz.com/" + product.find(".ten-product h3 a")[0].attribs.href;
        // 4 - code
        data_product.prod_code = product.find(".masp").eq(0).text();
        let prod_code_start = data_product.prod_code.indexOf("MÃ SP: ") + "MÃ SP: ".length;
        data_product.prod_code = data_product.prod_code.slice(prod_code_start).replace(/^\s*/, "").replace(/\s*$/, "");
        // 5 - in_price
        data_product.in_price = product.find(".gia-product").text();
        let in_price_start = data_product.in_price.indexOf("GIÁ: ") + "GIÁ: ".length;
        let in_price_end = data_product.in_price.indexOf(" đ");
        data_product.in_price = data_product.in_price.slice(in_price_start, in_price_end).replace(/[.,\s]/g, "");
        data_product.in_price = parseInt(data_product.in_price);
        // 6 - out_price
        data_product.out_price = set_out_price(data_product.in_price);
        // 7 - prod_stock = Còn hàng || Tạm hết hàng
        data_product.prod_stock = product.find(".masp font").text().replace(/^\s*/, "").replace(/\s*$/, "");
        // warranty
        data_product.warranty = product.find(".xemchitiet").text();
        let warranty_start = data_product.warranty.indexOf("Bảo hành: ") + "Bảo hành: ".length;
        data_product.warranty = data_product.warranty.slice(warranty_start).replace(/^\s*/, "").replace(/\s*$/, "");
        if(data_product.prod_code != ""){   // Loại trừ trường hợp prod_code = "" (Tai nghe bluetooth Samsung S4, .v.v)
            let isDuplicated = false;       // Loại trừ trường hợp 2 prod_code bằng nhau (2sp cùng mã 002348)
            for(let j = 0; j < data.products.length; j++){
                if(data.products[j].prod_code == data_product.prod_code){
                    isDuplicated = true;
                    break;
                }
            }
            if(!isDuplicated) data.products.push(data_product);
        }  
    }
    // get additional page if exist
    let paginationLinks = $(".pagination a");
    let pagination_text = $(".pagination a").eq(paginationLinks.length - 2).text();
    let pagination_link = $(".pagination a").eq(paginationLinks.length - 2).attr("href");
    if(pagination_text.indexOf("Trang tiếp") != -1){
        let newCategory = {...data.rootCategories[data.index]};
        newCategory.category_link = pagination_link.replace(":443", "");
        data.rootCategories.splice(data.index + 1, 0, newCategory);
    }
    // single link done notification
    console.log(`done #${data.index + 1}: ${data.rootCategories[data.index].category_link}`)
    // run function if more links remains
    data.index += 1;
    if(data.index < data.rootCategories.length){
        getProduct(data, cb);
    }else{
        if(cb) cb();
    }
}

(async () => {
    console.log("start");
    let data = new Object;
    data.rootCategories = await fs.readFileSync("../result/rootChildCategory.json");
    data.rootCategories = JSON.parse(data.rootCategories);
    data.rootCategories.forEach(item => {
        item.category_link = "https://muabangiasiaz.com/" + item.category_link;
    })
    data.products = [];
    data.index = 0;
    getProduct(data, async () => {
        await fs.writeJSONSync("../result/initialProduct.json", data.products);
        console.log("end");
    });
})()

