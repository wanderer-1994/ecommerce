const mysqlutils = require("../mysql/mysqlutils");
const categoryAttributeInheritFields = [
    {
        attribute_id: "attribute_id",
        data_type: "varchar"
    },
    {
        attribute_id: "label",
        data_type: "varchar"
    },
    {
        attribute_id: "referred_target",
        data_type: "varchar"
    },
    {
        attribute_id: "admin_only",
        data_type: "int"
    },
    {
        attribute_id: "html_type",
        data_type: "varchar"
    },
    {
        attribute_id: "data_type",
        data_type: "varchar"
    },
    {
        attribute_id: "validation",
        data_type: "varchar"
    },
    {
        attribute_id: "is_super",
        data_type: "int"
    },
    {
        attribute_id: "is_system",
        data_type: "int"
    },
    {
        attribute_id: "unit",
        data_type: "varchar"
    },
    {
        attribute_id: "value",
        data_type: "keep-as-is"
    }
];
const multivalueAttributes = ["multiselect", "multiinput"];
const categoryInheritAttributes = [
    {
        attribute_id: "name",
        data_type: "varchar"
    },
    {
        attribute_id: "parent",
        data_type: "varchar"
    },
    {
        attribute_id: "is_online",
        data_type: "int"
    },
    {
        attribute_id: "position",
        data_type: "int"
    }
];

function modelizeCategoriesData (rawData) {
    try {
        let categories = mysqlutils.groupByAttribute({
            rawData: rawData,
            groupBy: "entity_id",
            nullExcept: [null, ""]
        });
        categories.forEach(category => {
            categoryInheritAttributes.forEach(field_item => {
                category[field_item.attribute_id] = mysqlutils.convertDataType(category.__items[0][field_item.attribute_id], field_item.data_type);
            });

            category.attributes = mysqlutils.groupByAttribute({
                rawData: category.__items,
                groupBy: "attribute_id",
                nullExcept: [null, ""]
            });

            category.attributes.forEach(attr_item => {
                categoryAttributeInheritFields.forEach(field_item => {
                    attr_item[field_item.attribute_id] = mysqlutils.convertDataType(attr_item.__items[0][field_item.attribute_id], field_item.data_type);
                });
                attr_item.value = mysqlutils.convertDataType(attr_item.value, attr_item.data_type);

                if (multivalueAttributes.indexOf(attr_item.html_type) !== -1) {
                    attr_item.value = [];
                    attr_item.__items.forEach(value_item => {
                        if (value_item) {
                            let converted_value = mysqlutils.convertDataType(value_item.value, attr_item.data_type);
                            if (converted_value !== null && converted_value !== undefined && converted_value !== "") {
                                attr_item.value.push(converted_value);
                            }
                        }
                    })
                };
                delete attr_item.__items;
            })

            delete category.__items;
        })
        return categories;
    } catch (err) {
        console.log(err);
        throw error;
    }
}

module.exports = {
    modelizeCategoriesData
}