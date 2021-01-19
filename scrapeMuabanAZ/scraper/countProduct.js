const fs = require("fs-extra");
fs.readFile("../result/initialProduct.json", "utf-8", (err, data) => {
    let products = JSON.parse(data);
    let avai = 0;
    let notAvail = 0;
    let others = [];
    products.forEach(item => {
        if(item.prod_stock == "Còn hàng"){
            avai += 1;
        }else if(item.prod_stock == "Tạm hết hàng"){
            notAvail += 1;
        }else{
            others.push(item.prod_stock);
        }
    })
    console.log("avai: ", avai);
    console.log("notAvai: ", notAvail);
    console.log("others: ", others.length);
    console.log("others: ", others);
})