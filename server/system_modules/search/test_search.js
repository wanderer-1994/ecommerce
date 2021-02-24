const search = require("./search");
const msClient = require("../mysql/mysql");
const fs = require("fs-extra");

async function run () {
    await msClient.connectAsync();
    let start = Date.now();
    let searchConfig = {
        categories: ["speaker", "phone_accessories", "charger"],
        entity_ids: ["PR0010", "PR0001", "PR0029"],
        refinements: [
            {
                attribute_id: "subsection",
                value: ["usb", "charge_cable"]
            },
            {
                attribute_id: "sup_warranty",
                value: ["12T"]
            },
            {
                attribute_id: "sup_price",
                value: [36000]
            }
        ],
        searchPhrase: "Cáp sạc nhanh HOCO DU10 cai gi the ha ban ban dang lam gi the vay",
        searchDictionary: msClient.searchDictionary,
        page: 3
    };
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
    let searchResult = await search.search(searchConfig);
    console.log("Search took ", Date.now() - start, " ms")
    await fs.writeJSON("./search_result_no_indexs.json", searchResult);
    msClient.disconnect();
};

run();