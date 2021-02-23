const mysql = require("mysql");
var persist;

const msClient = mysql.createConnection(
    {
        host: "localhost",
        user: "TKH",
        password: "niemtinvahyvong123",
        multipleStatements: true
    }
)

msClient.promiseQuery = sql => {
    return new Promise((resolve, reject) => {
        msClient.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

msClient.insertRows = (table, attr_arr, record_arr) => {
    return new Promise(async (resolve, reject) => {
        try{
            let sql_prepare_attr = "";
            attr_arr.forEach(attr => {
                sql_prepare_attr += `${attr}, `;
            })
            sql_prepare_attr = sql_prepare_attr.replace(/, $/, "");

            let sql_prepare_record = "";
            record_arr.forEach(record => {
                let record_values = "";
                attr_arr.forEach(attr => {
                    let isEscape = require_escape.find(item => {return item == attr});
                    if(isEscape){
                        (record[attr] == null || record[attr] == "null") ? record_values += "null, " : record_values += `"${escape(record[attr])}", `;
                    }else{
                        (record[attr] == null || record[attr] == "null") ? record_values += "null, " : record_values += `"${escape(record[attr])}", `;
                    }
                });
                record_values = record_values.replace(/, $/, "");
                sql_prepare_record += `(${record_values}), `;
            })
            sql_prepare_record = sql_prepare_record.replace(/, $/, "");
            let sql_insert_query = `INSERT INTO ${table} (${sql_prepare_attr}) VALUES ${sql_prepare_record}`;
            let result = await msClient.promiseQuery(sql_insert_query);
            resolve(result);
        }catch(err){
            reject(err);
        }
    })
}

msClient.updateRows = (table, attr_arr, record_arr) => {
    return new Promise(async (resolve, reject) => {
        try{
            let sql_prepare_attr = "";
            let sql_prepare_on_duplicate = "";
            attr_arr.forEach(attr => {
                sql_prepare_attr += `${attr}, `;
                sql_prepare_on_duplicate += `${attr}=VALUES(${attr}), `;
            })
            sql_prepare_attr = sql_prepare_attr.replace(/, $/, "");
            sql_prepare_on_duplicate = sql_prepare_on_duplicate.replace(/, $/, "");

            let sql_prepare_record = "";
            record_arr.forEach(record => {
                let record_values = "";
                attr_arr.forEach(attr => {
                    let isEscape = require_escape.find(item => {return item == attr});
                    if(isEscape){
                        (record[attr] == null || record[attr] == "null") ? record_values += "null, " : record_values += `"${escape(record[attr])}", `;
                    }else{
                        (record[attr] == null || record[attr] == "null") ? record_values += "null, " : record_values += `"${escape(record[attr])}", `;
                    }
                });
                record_values = record_values.replace(/, $/, "");
                sql_prepare_record += `(${record_values}), `;
            })
            sql_prepare_record = sql_prepare_record.replace(/, $/, "");
            let sql_insert_onduplicate_query = `INSERT INTO ${table} (${sql_prepare_attr}) VALUES ${sql_prepare_record}
                                                ON DUPLICATE KEY UPDATE ${sql_prepare_on_duplicate}`;
            let result = await msClient.promiseQuery(sql_insert_onduplicate_query);
            resolve(result);
        }catch(err){
            reject(err);
        }
    })
}

msClient.getProductEav = async function () {
    try {
        let sql =
        `
        SELECT * FROM \`ecommerce\`.product_eav;
        `;
        let productEav = await msClient.promiseQuery(sql);
        return productEav;
    } catch (err) {
        return [];
    }
}

msClient.getCategoryEav = async function () {
    try {
        let sql =
        `
        SELECT * FROM \`ecommerce\`.category_eav;
        `;
        let categoryEav = await msClient.promiseQuery(sql);
        return categoryEav;
    } catch (err) {
        return [];
    }
}

msClient.getSearchDictionary = async function () {
    try {
        let sql = 'SELECT * FROM `ecommerce`.search_dictionary';
        let searchDictionary = await msClient.promiseQuery(sql);
        return searchDictionary;
    } catch (err) {
        return [];
    }
}

msClient.connectAsync = async () => {
    return new Promise((resolve, reject) => {
        msClient.connect(async (err) => {
            if(err){
                console.log("msClient err: ", err);
            }else{
                msClient.searchDictionary = await msClient.getSearchDictionary();
                msClient.productEav = await msClient.getProductEav();
                msClient.categoryEav = await msClient.getCategoryEav()
                resolve();
                persist = setInterval(() => {
                    msClient.query("SELECT 1;");
                }, 60*60*1000) // 1hr đánh thức mysql server 1 lần

                console.log("ms database connected...")
            }
        });
    })
}

msClient.disconnect = () => {
    msClient.end();
    clearInterval(persist);
}

module.exports = msClient;