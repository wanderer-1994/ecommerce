const fs = require("fs-extra");
fs.readFile("../result/sortedProductByCode.json", "utf-8", (err, data) => {
    let products = JSON.parse(data);
    let sellProducts = [];
    products.forEach(item => {
        if(item.prod_stock == "Còn hàng"){
            sellProducts.push({...item});
        }
    })
    fs.writeJSON("../result/sellProducts.json", sellProducts);
})