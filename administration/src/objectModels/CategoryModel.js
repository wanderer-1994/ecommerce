const category_entity_columns = [{
        column: "entity_id",
        valueInvalidMessage: `'entity_id' must be none-empty string`,
        f_convert_value: function(value) {},
        f_validation: function(value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "name",
        valueInvalidMessage: `'name' must be none-empty string`,
        f_convert_value: function(value) {},
        f_validation: function(value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "parent",
        valueInvalidMessage: `'parent' must be none-empty string or left empty`,
        f_convert_value: function(value) {},
        f_validation: function(value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "is_online",
        valueInvalidMessage: `'is_online' must be number true|false or 1|0 or left empty`,
        f_convert_value: value => {
            if (value === 1 || value === true) return 1;
            if (value === 0 || value === false) return 0;
            return value;
        },
        f_validation: function(value) {
            return value === 1 || value === 0;
        }
    },
    {
        column: "position",
        valueInvalidMessage: `'position' must be non-negative number (type int) or left empty`,
        f_convert_value: function(value) {},
        f_validation: function(value) {
            return typeof(value) === "number" && value >= 0 && value === parseInt(value);
        }
    }
];

const category_eav_columns = [{
        column: "attribute_id",
        f_convert_value: function(value) {},
        f_validation: (value) => { return typeof(value) === "string" && value.length > 0 },
        valueInvalidMessage: "'attribute_id' must be none-empty string."
    },
    {
        column: "value",
        f_convert_value: function(value) {},
        f_validation: (value) => {
            let isValid = true;
            if ((typeof(value) === "string" || typeof(value) === "number") && value.toString().length > 0) return true;
            if (!Array.isArray(value)) return false;
            value.forEach(v_item => {
                if ((typeof(v_item) !== "string" && typeof(v_item) !== "number") || v_item.toString().length === 0) {
                    isValid = false;
                };
            });
            return isValid;
        },
        valueInvalidMessage: "'value' must be null or number or string or array containing numbers|none-empty strings."
    }
];

function getCategoryAttribute(category, attribute_id) {
    if (category && category.attributes) {
        let target_attr = category.attributes.find(item => item.attribute_id === attribute_id);
        if (target_attr) return target_attr.value;
        return null;
    };
    return null;
};

function structurizeCategories(categories, parent_id) {
    let result = [];
    if (!parent_id) {
        result = categories.filter(item => !item.parent).sort((a, b) => a.position - b.position);
    } else {
        result = categories.filter(item => item.parent === parent_id).sort((a, b) => a.position - b.position);
    };
    result.forEach(item => {
        item.children = structurizeCategories(categories, item.entity_id);
    });
    return result;
}

function validateCategoryModel(category) {
    let isValid = true;
    let m_failure = "";
    category_entity_columns.forEach(property => {
        let value = category[property.column];
        value = property.f_convert_value ? property.f_convert_value(value) : value;
        if (value !== null && value !== "" && value !== undefined) {
            if (!property.f_validation(category[property.column])) {
                isValid = false;
                console.log("here 4", property.column, " - ", category[property.column], category)
                m_failure += `\n\t Invalid entity property: ${property.valueInvalidMessage}.`
            }
        } else {
            delete category[property.column];
        };
    });
    switch (category.attributes) {
        case null:
        case "":
        case undefined:
            delete category.attributes;
            break;
        default:
            if (!Array.isArray(category.attributes)) {
                isValid = false;
                console.log("here 1")
                m_failure += `\n\t 'attributes' must be an array containing attribute items.`;
                break;
            };
            for (let i = 0; i < category.attributes.length; i++) {
                let attr_item = category.attributes[i];
                Object.keys(attr_item).forEach(key => {
                    if (key !== "attribute_id" && key !== "value") delete attr_item[key];
                });
                if (attr_item.attribute_id === null || attr_item.attribute_id === "" || attr_item.attribute_id === undefined) {
                    isValid = false;
                    console.log("here 2")
                    m_failure += "'attribute_id' must not be empty.";
                    continue;
                };
                if (attr_item.value === undefined) {
                    category.attributes.splice(i, 1);
                    i -= 1;
                    continue;
                };
                if (attr_item.value === null || attr_item.value === "") continue;
                category_eav_columns.forEach(col_item => {
                    let value = attr_item[col_item.column];
                    if (value !== null && value !== "" && value !== undefined) {
                        if (!col_item.f_validation(value)) {
                            isValid = false;
                            console.log("here 3")
                            m_failure += `\n\t ${col_item.valueInvalidMessage}`;
                        }
                    }
                })
            };
            break;
    }
    return {
        isValid: isValid,
        m_failure: m_failure
    };
}

module.exports = {
    getCategoryAttribute,
    structurizeCategories,
    validateCategoryModel
}