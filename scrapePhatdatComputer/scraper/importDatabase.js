const msClient = require("./utils/mysql");
const fs = require("fs-extra");
const escapeHTML = require("./utils/functions").escapeHTML;

async function db_importProduct(){
    try{
        let products = fs.readFileSync("../result/changedProducts.json", "utf-8");
        products = JSON.parse(products);
        products = products.slice(0, 200); 
        let attr = ["category", "prod_link", "updated_info", "last_updated", "prod_stock", "sup_name",
                    "sup_warranty", "sup_price", "prod_thumb", "prod_img"];
        let keys = "";
        attr.forEach(item => {
            keys += `${item}, `
        })
        keys = keys.replace(/, $/,"");
        let values = "(";
        products.forEach((product, index) => {
            attr.forEach(item => {
                if(item == "prod_stock"){
                    values += `'${escape(1)}', `;
                }else{
                    values += `'${escape(product[item])}', `;
                }
            });
            values = values.replace(/, $/,"");
            values += "), (";
        });
        values = values.replace(/, \($/, "");
        let sql_importProd = `INSERT INTO phukiendhqg.product (${keys}) VALUES ${values}`;
        // let sql_importProd = `SELECT * FROM phukiendhqg.product WHERE prod_id="3"`;
        let result = await msClient.promiseQuery(sql_importProd);
        console.log("success: ", result);
        // await msClient.promiseQuery("truncate table phukiendhqg.product;");
    }catch(err){
        console.log(err);
    }
}

async function db_importCategory(){
    try{
        let categories = fs.readFileSync("../result/category.json", "utf-8");
        categories = JSON.parse(categories);
        let attr = ["category_path", "category_name", "priority"];
        let keys = "";
        attr.forEach(item => {
            keys += `${item}, `
        })
        keys = keys.replace(/, $/,"");
        let values = "(";
        categories.forEach((category, index) => {
            attr.forEach(item => {
                // values += `'${escapeHTML(category[item])}', `;
                values += `'${escape(category[item])}', `;
            });
            values = values.replace(/, $/,"");
            values += "), (";
        });
        values = values.replace(/, \($/, "");
        let sql_importCat = `INSERT INTO phukiendhqg.category (${keys}) VALUES ${values}`;
        // let sql_importProd = `SELECT * FROM phukiendhqg.product WHERE prod_id="3"`;
        let result = await msClient.promiseQuery(sql_importCat);
        console.log("success: ", result);
        // await msClient.promiseQuery("truncate table phukiendhqg.category;");
    }catch(err){
        console.log(err);
    }
}

// db_importProduct();