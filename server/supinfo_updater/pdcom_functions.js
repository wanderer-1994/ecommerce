const axios = require("axios");
const cheerio = require("cheerio");

async function get_phatdatcomQuotation ({ url }) {
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    // let required = ["prod_link", "sup_warranty", "prod_stock"]
    try{
        let default_url = "https://phatdatcomputer.vn/bang-gia/bang-gia-tat-ca-san-pham";
        if (url && url != "default") default_url = url;
        let response = await axios({
            method: "get",
            url: default_url,
        });
        let $ = cheerio.load(response.data);
        let products = [];
        let tb_rows = $(".box_banggia").find(".row_title2");
        for(let i = 0; i < tb_rows.length; i++){
            let tr_data = tb_rows.eq(i);
            let sup_link = tr_data.find(".rowbg.c5").find("a").eq(0).attr("href");
            if(sup_link){
                let product = new Object;
                product.sup_link = "https://phatdatcomputer.vn/" + sup_link;
                product.sup_warranty = tr_data.find(".rowbg.c3").text().replace(/\s/g,"");
                product.available_quantity = tr_data.find(".rowbg.c4").text() || "";
                if(product.available_quantity.toUpperCase().indexOf("CÒN HÀNG") > -1){
                    product.available_quantity = 1;
                }else{
                    product.available_quantity = 0;
                }
                products.push(product);
            }
        }
        return products;
    }catch(err){
        if(!err.err_message){
            err.err_message = "failed_get_phatdatcomQuotation";
        }else{
            err.err_message += "failed_get_phatdatcomQuotation-imgSpliter_TKH-"
        }
        return err;
    }
}

async function get_pdcomProdDetail (sup_link, pdcom_Quotation) {
    // let required = ["sup_link", "sup_name", "sup_price", "sup_warranty", "prod_stock"];
    try{
        let response = await axios({
            method: "get",
            url: sup_link
        })
        let $ = cheerio.load(response.data);
        let prodDetail = new Object;
        prodDetail.sup_link = sup_link;
        prodDetail.sup_name = $(".content .ct-r .ct-tit").text().replace(/^\s*/, "").replace(/\s*$/, "");
        prodDetail.sup_price = $(".content .ct-r .ct-sp-gia span").eq(0).text().replace(/\D/g,"");
        prodDetail.sup_price = isNaN(parseInt(prodDetail.sup_price)) ? 0 : parseInt(prodDetail.sup_price);
        let match_item = pdcom_Quotation.find(quo_item => {
            return quo_item.sup_link == prodDetail.sup_link;
        })
        prodDetail.sup_warranty = match_item.sup_warranty;
        prodDetail.available_quantity = match_item.available_quantity;
        // "images" & "thumbnail" is for initial product only, not for update
        prodDetail.images = "https://phatdatcomputer.vn/" + $(".content .ct-l img").eq(0).attr("src");
        prodDetail.thumbnail = prodDetail.images.replace(/\.jpg$/, "_250x250.jpg");
        return prodDetail;
    }catch(err){
        if(!err.err_message){
            err.err_message = `failed_get_prodDetail: ${sup_link}`;
        }else{
            err.err_message += `failed_get_prodDetail: ${sup_link}-imgSpliter_TKH-`
        }
        return err;
    }
}

module.exports = {
    get_phatdatcomQuotation,
    get_pdcomProdDetail
}