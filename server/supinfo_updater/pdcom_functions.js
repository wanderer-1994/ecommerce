const axios = require("axios");
const cheerio = require("cheerio");

async function get_phatdatcomQuotation (quotation_link) {
    try{
        let default_quotation_link = "https://phatdatcomputer.vn/bang-gia/bang-gia-tat-ca-san-pham";
        if (quotation_link && quotation_link != "default") default_quotation_link = quotation_link;
        let response = await axios({
            method: "get",
            url: default_quotation_link,
        });
        let $ = cheerio.load(response.data);
        let products = [];
        let $tb_rows = $(".box_banggia").find(".row_title2");
        $tb_rows.each(function () {
            let sup_link = $(this).find(".rowbg.c5").find("a").eq(0).attr("href");
            if(sup_link){
                let product = new Object;
                product.sup_link = "https://phatdatcomputer.vn/" + sup_link;
                product.sup_name = ($(this).find(".rowbg.c1").text() || "").replace(/^"+|"+$/g, "");
                product.sup_price = ($(this).find(".rowbg.c2").text() || "").replace(/\D/g, "");
                product.sup_price = parseInt(product.sup_price);
                if (isNaN(product.sup_price)) product.sup_price = 0;
                product.sup_warranty = $(this).find(".rowbg.c3").text().replace(/\s/g,"");
                product.sup_stock = $(this).find(".rowbg.c4").text() || "";
                if(product.sup_stock.toUpperCase().indexOf("CÒN HÀNG") > -1){
                    product.sup_stock = 1;
                }else{
                    product.sup_stock = 0;
                }
                products.push(product);
            }
        })
        return products;
    }catch(err){
        err.message = "##### Failed_get_phatdatcomQuotation-imgSpliter_TKH-\n" + err.message;
        throw err;
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