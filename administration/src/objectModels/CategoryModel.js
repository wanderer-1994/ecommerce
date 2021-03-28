import * as eavValidation from "./eav/eavValidation";

const category_entity_columns = [{
        column: "entity_id",
        valueInvalidMessage: `'entity_id' must be none-empty string`,
        f_convert_value: function(value) {
            if (typeof(value) === "string" || typeof(value) === "number") {
                return value.toString();
            };
            return value;
        },
        f_validation: function(value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "name",
        valueInvalidMessage: `'name' must be none-empty string`,
        f_validation: function(value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "parent",
        valueInvalidMessage: `'parent' must be none-empty string or left empty`,
        f_validation: function(value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "is_online",
        valueInvalidMessage: `'is_online' must be true|false or 1|0 or left empty`,
        f_convert_value: value => {
            // input type number still return string!!
            // using value == "0" instead of value == 0 to prevent case 0 == ""
            if (value == "1" || value === true || value === "true") return 1; // eslint-disable-line
            if (value == "0" || value === false || value === "false") return 0; // eslint-disable-line
            return value;
        },
        f_validation: function(value) {
            return value === 1 || value === 0;
        }
    },
    {
        column: "position",
        valueInvalidMessage: `'position' must be non-negative number (type int) or left empty`,
        f_convert_value: function(value) {
            if (parseInt(value) == value) { // eslint-disable-line
                return parseInt(value);
            };
            return value;
        },
        f_validation: function(value) {
            return typeof(value) === "number" && value >= 0 && value === parseInt(value);
        }
    }
];

const category_eav_columns = [{
        column: "attribute_id",
        f_convert_value: function({ value }) {
            if (typeof(value) === "string" || typeof(value) === "number") {
                return value.toString();
            };
            return value;
        },
        f_validation: ({ value }) => { return typeof(value) === "string" && value.length > 0 },
        valueInvalidMessage: "'attribute_id' must be none-empty string."
    },
    {
        column: "value",
        f_convert_value: eavValidation.converAttributeValue,
        f_validation: ({ attribute_id, value, data_type, html_type, validation, self }) => {
            self.valueInvalidMessage = "";
            if (value === null || value === "" || value === undefined) return true;
            if (["multiinput", "multiselect"].indexOf(html_type) !== -1 && !Array.isArray(value)) {
                self.valueInvalidMessage += `\n\t attribute '${attribute_id}' must have value of type array.`
                return false;
            };
            if (Array.isArray(value)) {
                let isValid = true;
                let invalid_values = [];
                value.forEach(v_item => {
                    if (!eavValidation.validateAttributeValue({ value: v_item, data_type, html_type, validation })) {
                        isValid = false;
                        invalid_values.push(v_item);
                    }
                });
                if (!isValid) {
                    self.valueInvalidMessage += `\n\t attribute '${attribute_id}' contains invalid value ${invalid_values.map(item => `'${item}'`).join(", ")}.`
                };
                return isValid;
            };
            if (!eavValidation.validateAttributeValue({ value, data_type, html_type, validation })) {
                self.valueInvalidMessage += `\n\t attribute '${attribute_id}' has invalid value.`;
                return false;
            };
            return true;
        },
        valueInvalidMessage: ""
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

function validateCategoryModel (category) {
    let isValid = true;
    let m_failure = "";
    category_entity_columns.forEach(col_item => {
        switch (category[col_item.column]) {
            case undefined:
                delete category[col_item.column];
                break;
            case null:
            case "":
                break;
            default:
                if (col_item.f_convert_value) {
                    category[col_item.column] = col_item.f_convert_value(category[col_item.column]);
                };
                if (!col_item.f_validation(category[col_item.column])) {
                    isValid = false;
                    m_failure += `\n\t Invalid entity property: ${col_item.valueInvalidMessage}.`
                }
                break;
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
                m_failure += `\n\t 'attributes' must be an array containing attribute items.`;
                break;
            };
            for (let i = 0; i < category.attributes.length; i++) {
                let attr_item = category.attributes[i];
                if (attr_item.attribute_id === null || attr_item.attribute_id === "" || attr_item.attribute_id === undefined) {
                    isValid = false;
                    m_failure += "'attribute_id' must not be empty.";
                    continue;
                };
                if (attr_item.value === undefined) {
                    category.attributes.splice(i, 1);
                    i -= 1;
                    continue;
                };
                if (attr_item.value === null || attr_item.value === "") continue;
                /*eslint-disable */
                category_eav_columns.forEach(col_item => {
                    switch (attr_item[col_item.column]) {
                        case null:
                        case "":
                        case undefined:
                            break;
                        default:
                            if (col_item.f_convert_value) {
                                attr_item[col_item.column] = col_item.f_convert_value({
                                    value: attr_item[col_item.column],
                                    data_type: attr_item.data_type,
                                    html_type: attr_item.html_type
                                });
                            };
                            if (!col_item.f_validation({
                                attribute_id: attr_item.attribute_id,
                                value: attr_item[col_item.column],
                                html_type: attr_item.html_type,
                                data_type: attr_item.data_type,
                                validation: attr_item.validation,
                                self: col_item
                            })) {
                                isValid = false;
                                m_failure += `\n\t ${col_item.valueInvalidMessage}`;
                            }
                            break;
                    }
                })
                /*eslint-enable */
            };
            break;
    };

    if (isValid && Array.isArray(category.attributes)) {
        // delete remnant fields of eav attributes
        category.attributes.forEach(attribute => {
            Object.keys(attribute).forEach(key => {
                if (["attribute_id", "value"].indexOf(key) === -1) {
                    delete attribute[key];
                }
            })
        })
    };

    return {
        isValid: isValid,
        m_failure: m_failure
    };
};

export {
    getCategoryAttribute,
    structurizeCategories,
    validateCategoryModel
}