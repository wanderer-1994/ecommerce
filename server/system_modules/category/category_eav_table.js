const category_eav_table = [
    {
        html_type: "boolean",
        data_type: "ANY",
        table: "category_eav_int"
    },
    {
        html_type: "multiinput",
        data_type: "ANY",
        table: "category_eav_multi_value"
    },
    {
        html_type: "multiselect",
        data_type: "ANY",
        table: "category_eav_multi_value"
    },
    {
        html_type: "password",
        data_type: "ANY",
        table: "category_eav_varchar"
    },
    // 
    {
        html_type: "input",
        data_type: "int",
        table: "category_eav_int"
    },
    {
        html_type: "input",
        data_type: "decimal",
        table: "category_eav_decimal"
    },
    {
        html_type: "input",
        data_type: "varchar",
        table: "category_eav_varchar"
    },
    {
        html_type: "input",
        data_type: "text",
        table: "category_eav_text"
    },
    {
        html_type: "input",
        data_type: "html",
        table: "category_eav_text"
    },
    {
        html_type: "input",
        data_type: "datetime",
        table: "category_eav_datetime"
    },
    // 
    {
        html_type: "select",
        data_type: "int",
        table: "category_eav_int"
    },
    {
        html_type: "select",
        data_type: "decimal",
        table: "category_eav_decimal"
    },
    {
        html_type: "select",
        data_type: "varchar",
        table: "category_eav_varchar"
    },
    {
        html_type: "select",
        data_type: "text",
        table: "category_eav_text"
    },
    {
        html_type: "select",
        data_type: "html",
        table: "category_eav_text"
    },
    {
        html_type: "select",
        data_type: "datetime",
        table: "category_eav_datetime"
    },
]

function getCategoryEavTableName (attribute) {
    let table_indicator = category_eav_table.find(item => {
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
    getCategoryEavTableName
}