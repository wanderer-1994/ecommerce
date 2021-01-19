const fs = require("fs-extra");

// by prod_code

fs.readFile("../result/initialProduct.json", "utf-8", (err, data) => {
    let products = JSON.parse(data);
    products.sort((a, b) => {
        return b.prod_code.replace(/SP/g, "") - a.prod_code.replace(/SP/g, "");
    })
    fs.writeJSON("../result/sortedProductByCode.json", products);
})

// by in_price

fs.readFile("../result/initialProduct.json", "utf-8", (err, data) => {
    let products = JSON.parse(data);
    products.sort((a, b) => {
        return b.in_price - a.in_price;
    })
    fs.writeJSON("../result/sortedProductByPrice.json", products);
})