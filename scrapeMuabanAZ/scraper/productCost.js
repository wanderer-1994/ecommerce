const fs = require("fs-extra");
fs.readFile("../result/sellProducts.json", "utf-8", (err, data) => {
    let products = JSON.parse(data);
    let cost = 0;
    let except = 0;
    let limit = 10000;
    let demo = [];
    products.forEach(item => {
        if(item.in_price < limit){
            cost += item.in_price;
            except += 1;
            demo.push({...item});
        }
    })
    console.log("limit: ", limit);
    console.log("cost: ", cost);
    console.log("average: ", cost/except);
    console.log("number of prods: ", except);
    demo.sort((a, b) => {
        return b.in_price - a.in_price;
    })
    fs.writeJSON("../result/demo.json", demo);
})