const { get_pdbtProdDetail } = require("./pdbt_functions");
const { get_pdcomProdDetail, get_phatdatcomQuotation } = require("./pdcom_functions");

async function updateSupInfo (products) { // products là array sp chỉ có [{prod_id, prod_link}] đã được unescape()
    let pdcom_Quotation = [];
    try{
        pdcom_Quotation = await get_phatdatcomQuotation();
    }catch(err){
        err_message += `${err.err_message}-imgSpliter_TKH-`;
    }
    let updated_products = [];
    let failed_products = [];
    for(let i = 0; i < products.length; i++ ){
        try{
            if(products[i].prod_link.indexOf("https://phatdatbinhthoi.com.vn") > -1){
                let sup_product = await get_pdbtProdDetail(products[i].prod_link, products[i].prod_stock);
                sup_product.prod_id = products[i].prod_id;
                updated_products.push(sup_product);
            }else if(products[i].prod_link.indexOf("https://phatdatcomputer.vn") > -1 && pdcom_Quotation.length > 0){
                let sup_product = await get_pdcomProdDetail(products[i].prod_link, pdcom_Quotation);
                sup_product.prod_id = products[i].prod_id;
                updated_products.push(sup_product);
            }else if(products[i].prod_link.indexOf("https://phatdatcomputer.vn") > -1 && pdcom_Quotation.length <= 0){
                err_message += `failed_get_prodDetail: ${products[i].prod_link}-imgSpliter_TKH-`;
                failed_products.push({...products[i]});
            }
        }catch(err){
            failed_products.push({...products[i]});
        }
    }
    return {
        updated_products: updated_products,
        failed_products: failed_products,
    };
}

module.exports = {
    updateSupInfo
}