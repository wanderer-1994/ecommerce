const mysql = require("mysql");

const msClient = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "tkh170294",
        // database: "phukiendhqg",
        multipleStatements: true
    }
)

const require_escape = ["prod_link", "updated_info"]

msClient.getSqlAttrToSelect = attrs_array => {
    let attr_to_select = "";
    attrs_array.forEach(item => {
        attr_to_select += `${item}, `
    });
    attr_to_select = attr_to_select.replace(/, $/, "");
    return attr_to_select;
}

msClient.getSqlInCondittion = selected_array => {
    let result_string = "";
    selected_array.forEach(item => {
        result_string += `"${item}", `
    });
    result_string = result_string.replace(/, $/, "");
    return result_string;
}

msClient.getSqlCategoryLike_OrCondition = category => {
    let categories = category.split(",");
    let result_string = "";
    categories.forEach(item => {
        result_string += `category LIKE "%${escape(item)}%" OR `;
    })
    result_string = result_string.replace(/ OR $/, "");
    return result_string;
}

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

msClient.deleteRows = (table, key_index, keys_arr) => {
    return new Promise(async (resolve, reject) => {
        try{
            let sql_prepare_keys = msClient.getSqlInCondittion(keys_arr);
            let sql_insert_delete_rows = `DELETE FROM ${table} WHERE ${key_index} IN (${sql_prepare_keys})`
            let result = await msClient.promiseQuery(sql_insert_delete_rows);
            resolve(result);
        }catch(err){
            reject(err);
        }
    })
}

msClient.connectAsync = async () => {
    return new Promise((resolve, reject) => {
        msClient.connect(err => {
            if(err){
                console.log("msClient err: ", err);
                setTimeout(() => {
                    msClient.connectAsync();
                }, 2000);
            }else{
                resolve();
                setInterval(() => {
                    msClient.query("SELECT 1;");
                }, 60*60*1000) // 1hr đánh thức mysql server 1 lần

                console.log("ms database connected...")
            }
        });
    })
}

msClient.connectAsync();

module.exports = msClient;