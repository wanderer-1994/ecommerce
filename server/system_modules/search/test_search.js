const search = require("./search");
const msClient = require("../mysql/mysql");
const fs = require("fs-extra");

async function run () {
    await msClient.connectAsync();
    let searchConfig = {
        // categories: ["speaker", "phone_accessories"],
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
        ],
        // searchPhrase: "USB",
        searchDictionary: msClient.searchDictionary,
        page: 3
    };
    let searchResult = await search.search(searchConfig);
    await fs.writeJSON("./search_result.json", searchResult);
    msClient.disconnect();
};

run();