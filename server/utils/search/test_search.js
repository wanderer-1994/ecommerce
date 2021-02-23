const search = require("./search");
const msClient = require("../mysql/mysql");

async function run () {
    await msClient.connectAsync();
    let searchConfig = {
        categories: ["storage", "charger"],
        entity_ids: ["PR0010", "PR0001"],
        refinements: [
            {
                attribute_id: "subsection",
                value: ["usb", "charge_cable"]
            },
            {
                attribute_id: "sup_warranty",
                value: ["12T"]
            },
        ],
        searchPhrase: "Cáp sạc nhanh HOCO X21 Chính hãng",
        searchDictionary: msClient.searchDictionary,
        page: 3
    };
    let searchResult = await search.search(searchConfig);
    msClient.disconnect();
    console.log(searchResult);
};

run();