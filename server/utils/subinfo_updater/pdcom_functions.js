const request = require("request");
const cheerio = require("cheerio");

const get_phatdatcomQuotation = () => {
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    // let required = ["prod_link", "sup_warranty", "prod_stock"]
    return new Promise((resolve, reject) => {
        request(
            {
                method: "GET",
                rejectUnauthorized: false,
                url: "https://phatdatcomputer.vn/bang-gia/bang-gia-tat-ca-san-pham"
            }, 
            (err, response, body) => {
                try{
                    let $ = cheerio.load(body);
                    let products = [];
                    let tb_rows = $(".content table").eq(2).find("tbody tr");
                    for(let i = 0; i < tb_rows.length; i++){
                        let tr_data = tb_rows.eq(i);
                        let prod_link = tr_data.find("td").eq(4).find("p a").eq(0).attr("href");
                        if(prod_link){
                            let product = new Object;
                            product.prod_link = prod_link;
                            product.sup_warranty = tr_data.find("td").eq(2).find("p").text().replace(/\s/g,"");
                            product.prod_stock = tr_data.find("td").eq(3).find("p").text();
                            if(product.prod_stock.indexOf("CÒN HÀNG") > -1){
                                product.prod_stock = 1;
                            }else{
                                product.prod_stock = 0;
                            }
                            products.push(product);
                        }
                    }
                    resolve(products);
                }catch(err){
                    if(!err.err_message){
                        err.err_message = "failed_get_phatdatcomQuotation";
                    }else{
                        err.err_message += "failed_get_phatdatcomQuotation-imgSpliter_TKH-"
                    }
                    reject(err);
                }
            }
        )
    })
}

const get_pdcomProdDetail = (prod_link, pdcom_Quotation) => {
    // let required = ["prod_link", "sup_name", "sup_price", "sup_warranty", "prod_stock"];
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
                    prodDetail.sup_name = $(".content .ct-r .ct-tit").text().replace(/^\s*/, "").replace(/\s*$/, "");
                    prodDetail.sup_price = $(".content .ct-r .ct-sp-gia span").text().replace(/\D/g,"");
                    prodDetail.sup_price = isNaN(parseInt(prodDetail.sup_price)) ? 0 : parseInt(prodDetail.sup_price);
                    let match_item = pdcom_Quotation.find(quo_item => {
                        return quo_item.prod_link == prodDetail.prod_link;
                    })
                    prodDetail.sup_warranty = match_item.sup_warranty;
                    prodDetail.prod_stock = match_item.prod_stock;
                    // "prod_img" & "prod_thumb" is for initial product only, not for update
                    prodDetail.prod_img = "https://phatdatcomputer.vn/" + $(".content .ct-l img").eq(0).attr("src");
                    prodDetail.prod_thumb = prodDetail.prod_img.replace(/\.jpg$/, "_250x250.jpg");
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
    get_phatdatcomQuotation,
    get_pdcomProdDetail
}