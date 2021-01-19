const request = require("request");
const cheerio = require("cheerio");

const get_pdbtProdDetail = (prod_link, prod_stock) => {
    // let required = ["prod_link", "sup_name", "sup_price", "sup_warranty"]; không có "prod_stock"
    return new Promise((resolve, reject) => {
        request(
            {
                method: "GET",
                rejectUnauthorized: false,
                url: prod_link
            },
            (err, response, body) => {
                try{
                    let $ = cheerio.load(body);
                    let prodDetail = new Object;
                    prodDetail.prod_link = prod_link;
                    prodDetail.sup_name = $(".main-product-detail .title h1").text().replace(/^\s*/, "").replace(/\s*$/, "");
                    prodDetail.sup_price = $(".content .ul-list-product-detail li span").eq(0).text().replace(/\D/g,"");
                    prodDetail.sup_price = isNaN(parseInt(prodDetail.sup_price)) ? 0 : parseInt(prodDetail.sup_price);
                    prodDetail.prod_stock = prod_stock;
                    prodDetail.sup_warranty = $(".wrap").text().replace(/^\s*/, "").replace(/\s*$/, "").slice(0, 45);
                    // "prod_img" & "prod_thumb" is for initial product only, not for update
                    prodDetail.prod_img = "http://phatdatbinhthoi.com.vn/" + $(".wrap-on-image img").attr("src");
                    prodDetail.prod_thumb = "http://phatdatbinhthoi.com.vn/thumb/220x210/2/" + $(".wrap-on-image img").attr("src");
                    resolve(prodDetail);
                }catch(err){
                    if(!err.err_message){
                        err.err_message = `failed_get_prodDetail: ${prod_link}`;
                    }else{
                        err.err_message += `failed_get_prodDetail: ${prod_link}-imgSpliter_TKH-`
                    }
                    reject(err);
                }
            }
        )
    })
}

module.exports = {
    get_pdbtProdDetail,

}