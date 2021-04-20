const data_type_int = ['int', 'datetime'];
const data_type_decimal = ['decimal'];
const data_type_text = ['varchar', 'text', 'html'];

function separateSQL (text) {
    if(!text || typeof(text) !== 'string') return [];
    let sqls = text.split(/^#+.*\n$/);
    sqls.forEach((statement, index) => {
        sqls[index] = statement.trim();
    });
    return sqls;
}

function groupByAttribute ({rawData, groupBy, nullExcept}) {
    if(!rawData || !groupBy || !Array.isArray(rawData) || typeof(groupBy) != "string" || (nullExcept && !Array.isArray(nullExcept))){
        throw new Error("Raw data could not be grouped because of invalid input!")
    }
    let result = [];
    rawData.forEach((item, index) => {
        if(!(groupBy in item)){
            throw new Error("Input data invalid, item " + JSON.stringify(item) + " does not have attribute " + groupBy);
        } else if (!nullExcept || (nullExcept.indexOf(item[groupBy]) == -1)) {
            let match = result.find(m_item => (m_item[groupBy] == item[groupBy]));
            if (!match) {
                match = {
                    [groupBy]: item[groupBy],
                    __items: []
                };
                result.push(match);
            }
            match.__items.push(item);
        };
    });
    return result;
}

function escapeQuotes (string) {
    return string.toString().replace(/\`/g, "\\`").replace(/\"/g, '\\"').replace(/\'/g, "\\'");
}

function buildProductEavIndexJson (products) {
    let eav_index_list = [];
    let entity_list = [];
    products.forEach(product => {
        if (product.self) {
            product.self.product_id = product.product_id;
            entity_list.push(product.self);
        }
        if (product.parent) {
            product.parent.product_id = product.product_id;
            entity_list.push(product.parent);
        }
        if (product.variants) {
            product.variants.forEach(variant => {
                variant.product_id = product.product_id;
            });
            entity_list = [...entity_list, ...product.variants];
        }
    })
    entity_list.forEach(entity => {
        if (entity.attributes) {
            entity.attributes.forEach(attribute => {
                if (isAttributeSearchable(attribute)) {
                    let value = attribute.value;
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                    value.forEach(v_item => {
                        let eav_index = {
                            entity_id: entity.entity_id,
                            product_id: entity.product_id,
                            attribute_id: attribute.attribute_id,
                            value: v_item
                        };
                        let match = eav_index_list.find(item => (
                            item.product_id == eav_index.product_id &&
                            item.attribute_id == eav_index.attribute_id &&
                            item.value == eav_index.value
                        ));
                        if (!match) {
                            eav_index_list.push(eav_index);
                        }
                    })
                }
            })
        }
    })
    return eav_index_list;
}

function isAttributeSearchable (attribute) {
    return (
        attribute.html_type == "select" ||
        attribute.html_type == "multiselect" ||
        attribute.data_type == "boolean"
    ) && (
        attribute.data_type != "text" &&
        attribute.data_type != "html"
    )
}

function convertDataType (value, data_type) {
    switch (data_type) {
        case "int": case "datetime":
            value = parseInt(value);
            if (isNaN(value)) value = null;
            break;
        case "decimal":
            value = parseFloat(value);
            if (isNaN(value)) value = null;
            break;
        default:
            break;
    };
    return value;
}

function validateValue ({value, data_type, html_type, validation}) {
    if (validation) {
        let regex = new RegExp(validation);
        if (!regex.test(value.toString())) return false;
    }
    if (html_type === "boolean") {
        return value === 1 || value === 0;
    };
    if (data_type_int.indexOf(data_type) !== -1) {
        return typeof(value) === "number" && value === parseInt(value);
    };
    if (data_type_decimal.indexOf(data_type) !== -1) {
        return typeof(value) === "number";
    };
    if (data_type_text.indexOf(data_type) !== -1) {
        return typeof(value) === "string";
    };
    // if no data_type specified, always return true
    return true;
}

function isValueEmpty (value) {
    return value === null || value === undefined || value === "";
}

module.exports = {
    separateSQL,
    groupByAttribute,
    escapeQuotes,
    buildProductEavIndexJson,
    isAttributeSearchable,
    convertDataType,
    validateValue,
    isValueEmpty
}