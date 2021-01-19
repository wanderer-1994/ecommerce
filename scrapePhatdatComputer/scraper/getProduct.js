const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs-extra");

// phatdatcom thumb:    https://phatdatcomputer.vn/upload/product/ssd-samsung-860-evo-500gb-sata-3-chinh-hang1567098829.jpg
//                      https://phatdatcomputer.vn/upload/product/ssd-samsung-860-evo-500gb-sata-3-chinh-hang1567098829_300x206.17529880478.jpg
// or                   https://phatdatcomputer.vn/upload/product/ssd-m2-sata-256gb-kingmax-chinh-hang1577174804.jpg
//                      https://phatdatcomputer.vn/upload/product/ssd-m2-sata-256gb-kingmax-chinh-hang1577174804_250x250.jpg

//  pdvv thumb :    https://phatdatvinhvien.com/thumb/600x400/1/upload/product/2m-3555.jpg
//                  https://phatdatvinhvien.com/thumb/300x222/2/upload/product/2m-3555.jpg
//                  https://phatdatvinhvien.com/thumb/220x195/1/upload/product/2m-3555.jpg

// daily update
function get_phatdatcomQuotation(){
    // let required = ["prod_link", "sup_warranty", "prod_stock"]
    return new Promise((resolve, reject) => {
            console.log("get pdcom Quo");
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
                        err.err_code = "001";
                        err.err_message = "get_phatdatcomQuotation";
                        reject(err);
                    }
                }
            )
    })
}

function get_phatdatvvQuotation(){
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    // let required = ["prod_link", "sup_warranty", "prod_stock"]
    return new Promise((resolve, reject) => {
        console.log("get pdvv Quo");
        request(
            {
                method: "GET",
                // rejectUnauthorized: false,
                url: "https://phatdatvinhvien.com/bao-gia.html"
            }, 
            (err, response, body) => {
                try{
                    let $ = cheerio.load(body);
                    let products = [];
                    let tb_rows = $("#main .sub_main table tbody tr");
                    for(let i = 0; i < tb_rows.length; i++){
                        let tr_data = tb_rows.eq(i);
                        let prod_link = tr_data.find("td").eq(1).find(".xemthem_baogia a").eq(0).attr("href");
                        if(prod_link){
                            let product = new Object;
                            product.prod_link = prod_link;
                            if(product.prod_link.indexOf("phatdatvinhvien.com") < 0) 
                                product.prod_link = "https://phatdatvinhvien.com/" + product.prod_link;
                            product.sup_warranty = tr_data.find("td").eq(3).find(".baohanh").text().replace(/\s/g,"");
                            product.prod_stock = 1;
                            products.push(product);
                        }
                    }
                    resolve(products);
                }catch(err){
                    err.err_code = "001";
                    err.err_message = "get_phatdatcomQuotation";
                    reject(err);
                }
            }
        )
    })
}

function get_pdcomProdDetail(prod_link){
    // let required = ["prod_link", "sup_name", "sup_price"];
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
                    prodDetail.sup_price = parseInt(prodDetail.sup_price);
                    resolve(prodDetail);
                }catch(err){
                    reject(err);
                }
            }
        )
    })
}

function get_pdvvProdDetail(prod_link){
    // let required = ["prod_link", "sup_name", "sup_price"];
    return new Promise((resolve, reject) => {
        request(
            {
                method: "GET",
                // rejectUnauthorized: false,
                url: prod_link
            },
            (err, response, body) => {
                try{
                    let $ = cheerio.load(body);
                    let prodDetail = new Object;
                    prodDetail.prod_link = prod_link;
                    prodDetail.sup_name = $(".info_detail .name_detail").text().replace(/^\s*/, "").replace(/\s*$/, "");
                    prodDetail.sup_price = $(".info_detail .gia_detail span").text().replace(/\D/g, "");
                    prodDetail.sup_price = parseInt(prodDetail.sup_price);
                    resolve(prodDetail);
                }catch(err){
                    reject(err);
                }
            }
        )
    })
}

function get_singleProdDetail(pdcomQuo, pdvvQuo, prod_link){
    return new Promise( async (resolve, reject) => {
        // let required = ["prod_link", "sup_name", "prod_stock", "sup_warranty", "sup_price"];
        console.log("get  prodDetail: ", prod_link);
        let trial = 1;
        let max_trial = 5
        while(trial <= max_trial){
            try{
                let prodDetail = new Object;
                let prodDetail_Quo;
                if(prod_link.indexOf("https://phatdatvinhvien.com") > -1){
                    prodDetail = await get_pdvvProdDetail(prod_link);
                    prodDetail_Quo = pdvvQuo.find(item => {return item.prod_link == prod_link});
                }else if(prod_link.indexOf("https://phatdatcomputer.vn") > -1){
                    prodDetail = await get_pdcomProdDetail(prod_link);
                    prodDetail_Quo = pdcomQuo.find(item => {return item.prod_link == prod_link});
                };
                let Quo_update = ["sup_warranty", "prod_stock"];
                if(!prodDetail_Quo) trial = max_trial + 1;
                Quo_update.forEach(item => {
                    prodDetail[item] = prodDetail_Quo[item];
                })
                trial = max_trial + 1;
                resolve(prodDetail);
            }catch(err){
                if(trial >= max_trial){
                    resolve("err");
                }
                trial += 1;
            }
        }
    })
}

async function updateProductsData(){
    let trial = 1;
    let max_trial = 5;
    while(trial <= max_trial){
        try{
            let last_updated = Date.now();
            let pdcomQuo = await get_phatdatcomQuotation();
            let pdvvQuo = await get_phatdatvvQuotation();
            let products = fs.readFileSync("../result/changedProducts.json", "utf-8");
            products = JSON.parse(products);
            products.forEach(item => {item.prod_stock = 1})
            let changed_products = [];
            for(let i = 0; i < products.length; i++){
                let product = products[i];
                let prodDetail = await get_singleProdDetail(pdcomQuo, pdvvQuo, product.prod_link);
                if(prodDetail == "err"){
                    // let must = ["prod_stock", "last_updated", "updated_info"];
                    // update sang prod_stock = 0; last_updated = current_time_stamp, updated_info = "err";
                    product.updated_info = `<div><strong  style="color: red">err</strong></div>`;
                    product.last_updated = last_updated;
                    product.prod_stock = 0;
                    changed_products.push({...product});
                }else{
                    // check các thông tin xem có giống nhau ko, bao gồm
                    let required = ["sup_name", "prod_stock", "sup_warranty", "sup_price"];
                    product.updated_info = "";
                    let isChanged = false;
                    required.forEach(prod_attr => {
                        if(product[prod_attr] != prodDetail[prod_attr]){
                            isChanged = true;
                            product.updated_info += `<li>${prod_attr} change from <strong>${product[prod_attr]}</strong> to <strong>${prodDetail[prod_attr]}</strong></li>`;
                            product[prod_attr] = prodDetail[prod_attr];
                        }
                    });
                    product.updated_info = `<div>${product.updated_info}</div>`;
                    if(isChanged){
                        product.last_updated = last_updated;
                        product.prod_stock = 0;
                        changed_products.push({...product});
                    };
                }
            }
            console.log("products: ", products.length);
            console.log("changed products: ", changed_products.length);
            // fs.writeJSON("../result/changedProducts2.json", changed_products);
            trial = max_trial + 1;
        }catch(err){
            if(trial >= max_trial){
                console.log(err);
            }
            trial += 1;
        }
    }
}

// initial products
function pdcom_initialProduct(prod_link){
    // let required = ["prod_link", "prod_thumb", "prod_img"]
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
                    let initialProd = new Object;
                    initialProd.prod_link = prod_link;
                    initialProd.prod_img = "https://phatdatcomputer.vn/" + $(".content .ct-l img").eq(0).attr("src");
                    initialProd.prod_thumb = "";
                    resolve(initialProd);
                }catch(err){
                    reject(err);
                }
            }
        )
    })
}

function pdvv_initialProduct(prod_link){
    // let required = ["prod_link", "prod_thumb", "prod_img"]
    return new Promise((resolve, reject) => {
        request(
            {
                method: "GET",
                // rejectUnauthorized: false,
                url: prod_link
            },
            (err, response, body) => {
                try{
                    let $ = cheerio.load(body);
                    let initialProd = new Object;
                    initialProd.prod_link = prod_link;
                    initialProd.prod_img = "https://phatdatvinhvien.com/" + $(".main_img_detail img").attr("src");
                    initialProd.prod_thumb = $(".list_sub_img_detail img").eq(0).attr("src");
                    if(initialProd.prod_thumb){
                        initialProd.prod_thumb = "https://phatdatvinhvien.com/" + initialProd.prod_thumb;
                    }else{
                        initialProd.prod_thumb = "";
                    }
                    resolve(initialProd);
                }catch(err){
                    reject(err);
                }
            }
        )
    })
}

function get_singleInitialProd(prod_link){
    return new Promise( async (resolve, reject) => {
        // let required = ["prod_link", "prod_thumb", "prod_img"]
        console.log("get  initialProd: ", prod_link);
        let trial = 1;
        let max_trial = 5
        while(trial <= max_trial){
            try{
                let initialProd = new Object;
                if(prod_link.indexOf("https://phatdatvinhvien.com") > -1){
                    initialProd = await pdvv_initialProduct(prod_link);
                }else if(prod_link.indexOf("https://phatdatcomputer.vn") > -1){
                    initialProd = await pdcom_initialProduct(prod_link);
                };
                // done
                trial = max_trial + 1;
                resolve(initialProd);
            }catch(err){
                if(trial >= max_trial){
                    resolve("err");
                }
                trial += 1;
            }
        }
    })
}

async function initialProd(){
    let trial = 1;
    let max_trial = 5;
    while(trial <= max_trial){
        try{
            let products = fs.readFileSync("../result/changedProducts.json", "utf-8");
            products = JSON.parse(products);
            // products.forEach(item => {item.prod_stock = 1})
            let initiated_products = [];
            for(let i = 0; i < products.length; i++){
                let product = products[i];
                let initialProd = await get_singleInitialProd(product.prod_link);
                if(initialProd != "err"){
                    let required = ["prod_thumb", "prod_img"];
                    required.forEach(prod_attr => {
                        product[prod_attr] = initialProd[prod_attr];
                    });
                    initiated_products.push({...product});
                }
            }
            console.log("products: ", products.length);
            console.log("initiated products: ", initiated_products.length);
            fs.writeJSON("../result/initiatedProducts.json", initiated_products);
            trial = max_trial + 1;
        }catch(err){
            if(trial >= max_trial){
                console.log(err);
            }
            trial += 1;
        }
    }
}

function capital_import_calculation(){
    fs.readFile("../result/changedProducts.json", "utf-8", (err, products) => {
        let price = [10000, 50000, 100000, 200000, 400000];
        let number = [100, 50, 20, 10, 5];
        products = JSON.parse(products);
        let total_price = 0;
        let count_product = 0;
        products.forEach(item => {
            let isAdded = false;
            for(let i = 0; i < price.length; i++){
                if(total_price < price[i])
                total_price += item.sup_price*number[i];
                count_product += number[i];
                isAdded = true;
                break;
            }
            if(isAdded){
                total_price += item.sup_price;
                count_product += 1;
            }
        })
        console.log("total_price: ", total_price);
        console.log("total_product: ", products.length, " count_product: ", count_product)
    })
}

// initialProd();

// capital_import_calculation();