// const search = require("./search_with_index");
const search = require("./search");
const msClient = require("../mysql/mysql");
const fs = require("fs-extra");

async function run () {
    
    let start = Date.now();
    let searchConfig = {
        categories: ["speaker", "phone_accessories", "charger"],
        // entity_ids: ["PR0010", "PR0001"],
        refinements: [
            {
                attribute_id: "subsection",
                value: ["usb", "charge_cable"]
            },
            {
                attribute_id: "sup_warranty",
                value: ["12T"]
            },
            // {
            //     attribute_id: "sup_price",
            //     value: [36000]
            // }
        ],
        searchPhrase: "Cáp sạc nhanh HOCO DU10 who i am wandering this wasteland",
        searchDictionary: msClient.searchDictionary,
        page: 1
    };
    if (Array.isArray(searchConfig.refinements)) {
        searchConfig.refinements.map((attribute, index) => {
            let match = msClient.productEav.find(m_item => m_item.attribute_id == attribute.attribute_id);
            if (match) {
                attribute.html_type = match.html_type;
                attribute.data_type = match.data_type;
            } else {
                searchConfig.refinements[index] = null;
            }
        });
        searchConfig.refinements = searchConfig.refinements.filter(item => item !==  null);
    }
    let searchResult = await search.search(searchConfig);
    // console.log("Search took ", Date.now() - start, " ms")
    // await fs.writeJSON("./search_result_with_index.json", searchResult);
    // await fs.writeJSON("./search_result.json", searchResult);
    
};

// run();
(async () => {
    await msClient.connectAsync();
    let arr = [];
    for(let i = 0; i < 500; i++) {
        arr.push(i);
        let start = Date.now();
        let result = await run();
        // let result = await fs.readJSON("./search_result.json");
        console.log("Search ", i, " took ", Date.now() - start, " ms")
    }
    arr.forEach(async (item, index) => {
        // let start = Date.now();
        // let result = await run();
        // // let result = await fs.readJSON("./search_result.json");
        // console.log("Search ", index, " took ", Date.now() - start, " ms")
    })
    // msClient.disconnect();
})()