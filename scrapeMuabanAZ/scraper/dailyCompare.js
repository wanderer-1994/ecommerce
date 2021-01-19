const fs = require("fs-extra");

function dailyCompareAddUpdateDelete(data, cb){
    if(data.new_products.length < 1){
        if(cb) cb(data);
    }else{
        let isNew = true;
        let compareItems = ["category", "prod_name", "prod_link", "in_price", "out_price", "prod_stock", "warranty"];
        let notCompare = ["thumb", "prod_code", "prod_img"]
        for(let i = 0; i < data.old_products.length; i++){
            if(data.new_products[0].prod_code == data.old_products[i].prod_code){
                isNew = false;
                let isChanged = false;
                compareItems.forEach(item => {
                    if(data.new_products[0][item] != data.old_products[i][item]){
                        isChanged = true;
                    }
                })
                if(isChanged){
                    if(!data.changedProducts) data.changedProducts = [];
                    data.changedProducts.push({...data.new_products[0]});
                }
                if(!isChanged) console.log("notChanged prod_code: ", data.new_products[0].prod_code);
                data.old_products.splice(i, 1);
                break;
            }
        }
        if(isNew){
            if(!data.addNew) data.addNew = [];
            data.addNew.push({...data.new_products[0]});
        }
        data.new_products.splice(0, 1);
        dailyCompareAddUpdateDelete(data, cb);
    }
}

fs.readFile("../result/initialProduct_17Jan.json", "utf-8", (err, old_products) => {
    old_products = JSON.parse(old_products);
    fs.readFile("../result/initialProduct.json", "utf-8", (err, new_products) => {
        console.log("start!");
        new_products = JSON.parse(new_products);
        let data = new Object;
        data.new_products = new_products;
        data.old_products = old_products;
        data.addNew = [];
        data.changedProducts = [];
        dailyCompareAddUpdateDelete({...data}, result => {
            console.log("done: ")
            console.log("addNew: ", result.addNew)
            console.log("changedProducts: ", result.changedProducts);
            console.log("deletedProduct: ", data.old_products);
        })
    })
})