const fs = require("fs-extra");

function getRootChildCategory(){
    fs.readFile("../result/category.json", "utf8", (err, data) => {
        let categories = JSON.parse(data);
        let childCategory = [];
        categories.forEach((item, index) => {
            let split = item.category_path.split("/")
            let category_id = split[split.length - 1];
            let is_rootChild = true;
            for(let i = 0; i < categories.length; i++){
                if(categories[i].category_path.indexOf(`/${category_id}/`) != -1){
                    is_rootChild = false;
                    break;
                }
            }
            if(is_rootChild) childCategory.push(item);
            console.log(childCategory.length);
        });
        // fs.writeJSON("../result/rootChildCategory.json", childCategory);
        console.log("end");
    })
}
console.log("start")
getRootChildCategory();