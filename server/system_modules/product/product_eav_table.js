const product_eav_table = [
    {
        html_type: "boolean",
        data_type: "ANY",
        table: "product_eav_int"
    },
    {
        html_type: "multiinput",
        data_type: "ANY",
        table: "product_eav_multi_value"
    },
    {
        html_type: "multiselect",
        data_type: "ANY",
        table: "product_eav_multi_value"
    },
    {
        html_type: "password",
        data_type: "ANY",
        table: "product_eav_varchar"
    },
    // 
    {
        html_type: "input",
        data_type: "int",
        table: "product_eav_int"
    },
    {
        html_type: "input",
        data_type: "decimal",
        table: "product_eav_decimal"
    },
    {
        html_type: "input",
        data_type: "varchar",
        table: "product_eav_varchar"
    },
    {
        html_type: "input",
        data_type: "text",
        table: "product_eav_text"
    },
    {
        html_type: "input",
        data_type: "html",
        table: "product_eav_text"
    },
    {
        html_type: "input",
        data_type: "datetime",
        table: "product_eav_datetime"
    },
    // 
    {
        html_type: "select",
        data_type: "int",
        table: "product_eav_int"
    },
    {
        html_type: "select",
        data_type: "decimal",
        table: "product_eav_decimal"
    },
    {
        html_type: "select",
        data_type: "varchar",
        table: "product_eav_varchar"
    },
    {
        html_type: "select",
        data_type: "text",
        table: "product_eav_text"
    },
    {
        html_type: "select",
        data_type: "html",
        table: "product_eav_text"
    },
    {
        html_type: "select",
        data_type: "datetime",
        table: "product_eav_datetime"
    },
]

function getProductEavTableName (attribute) {
    let table_indicator = product_eav_table.find(item => {
        return (
            item.html_type == attribute.html_type &&
            (item.data_type == attribute.data_type || item.data_type == "ANY")
        )
    });
    if (table_indicator) {
        return table_indicator.table;
    };
    return null;
}

module.exports = {
    getProductEavTableName
}