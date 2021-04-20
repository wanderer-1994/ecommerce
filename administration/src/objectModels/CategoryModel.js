import * as valueValidation from "./eav/valueValidation";
import database_data_type from "./database_data_type";

const category_entity_columns = [{
        column: "entity_id",
        valueInvalidMessage: `'entity_id' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "name",
        valueInvalidMessage: `'name' must be none-empty string`,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "parent",
        valueInvalidMessage: `'parent' must be none-empty string or left empty`,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "is_online",
        valueInvalidMessage: `'is_online' must be true|false or 1|0 or left empty`,
        f_convert_value: database_data_type["BOOLEAN"].f_convert_value,
        f_validation: database_data_type["BOOLEAN"].f_validation
    },
    {
        column: "position",
        valueInvalidMessage: `'position' must be non-negative number (type int) or left empty`,
        f_convert_value: database_data_type["NONE_NEGATIVE_INT"].f_convert_value,
        f_validation: database_data_type["NONE_NEGATIVE_INT"].f_validation
    }
];

const category_eav_columns = [{
        column: "attribute_id",
        f_convert_value: function({ value }) {
            return database_data_type["NONE_EMPTY_STRING"].f_convert_value(value);
        },
        f_validation: ({ value }) => { return database_data_type["NONE_EMPTY_STRING"].f_validation(value) },
        valueInvalidMessage: "'attribute_id' must be none-empty string."
    },
    {
        column: "value",
        f_convert_value: valueValidation.convertValue,
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
                    if (!valueValidation.validateValue({ value: v_item, data_type, html_type, validation })) {
                        isValid = false;
                        invalid_values.push(v_item);
                    }
                });
                if (!isValid) {
                    self.valueInvalidMessage += `\n\t attribute '${attribute_id}' contains invalid value ${invalid_values.map(item => `'${item}'`).join(", ")}.`
                };
                return isValid;
            };
            if (!valueValidation.validateValue({ value, data_type, html_type, validation })) {
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

function structurizeCategories(categories, parent) {
    this.initStructure = (categories, parent) => {
        let result = [];
        if (!parent) {
            result = categories.filter(item => !item.parent).sort((a, b) => a.position - b.position);
        } else {
            result = categories.filter(item => {
                // isIncluded prevent forever looping when recursive parent assignment occurred
                let isIncluded = item.__isIncluded;
                // prevent case self assignment: item.entity_id !== parent.entity_id
                // prevent case recursive assignment: item.entity_id !== parent.parent
                if (item.parent === parent.entity_id && item.entity_id !== parent.entity_id && item.entity_id !== parent.parent) {
                    item.__isIncluded = true;
                }
                return item.entity_id !== parent.entity_id && item.parent === parent.entity_id && !isIncluded && item.entity_id !== parent.parent;
            }).sort((a, b) => a.position - b.position);
        };
        result.forEach(item => {
            if (typeof(item.entity_id) === "string" || typeof(item.entity_id) === "number" && item.entity_id.toString().length > 0) {
                item.children = this.initStructure(categories, item);
            }
        });
        return result;
    }
    let result = this.initStructure(categories, parent);
    // process invalid parent assignments
    let cat_with_invalid_parent = categories.filter(item => item.parent && !item.__isIncluded);
    cat_with_invalid_parent = cat_with_invalid_parent.filter(item => item.__isIncluded !== true);
    result.push(...cat_with_invalid_parent);
    categories.forEach(item => {
        delete item.__isIncluded;
    })
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