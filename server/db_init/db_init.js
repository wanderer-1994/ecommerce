const fs = require("fs-extra");
const msClient = require("../system_modules/mysql/mysql");

var executes = [
    'schema_init.txt',
    'data_product_eav.txt',
    'data_category_eav.txt',
    // 'data_product_eav_datetime.txt',
    // 'data_product_category_assignment.txt',
    // 'data_product_eav_decimal.txt',
    // 'data_product_eav_int.txt',
    // 'data_product_eav_multi_value.txt',
    // 'data_product_eav_text.txt',
    // 'data_product_eav_varchar.txt',
    // 'data_product_entity.txt',
    // 'data_category_entity.txt'
];
async function initEcommerceDB ()  {
    try {
        let start = Date.now()
        await msClient.connectAsync();
        let sqls = [];
        for (let i = 0; i < executes.length; i++) {
            let fileData = await fs.readFile(`./data/${executes[i]}`, "utf-8");
            fileData = fileData.split(/\n###.*|^###.*/);
            fileData.forEach(sql => {
                sql = sql.trim();
                if (sql.length > 0) sqls.push(sql);
            })
        }
        for (let i = 0; i < sqls.length; i++) {
            await msClient.promiseQuery(sqls[i]);
        }
        let end = Date.now();
        console.log("DB init took ", end - start, " ms");
        msClient.disconnect();
    } catch (error) {
        throw error;
    }
};

initEcommerceDB()