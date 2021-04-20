import * as valueValidation from "./eav/valueValidation";
import database_data_type from "./database_data_type";

const product_entity_columns = [
    {
        column: "entity_id",
        valueInvalidMessage: `'entity_id' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "name",
        valueInvalidMessage: `'name' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation,
    },
    {
        column: "type_id",
        valueInvalidMessage: `'type_id' must be enum (simple|master|variant|grouped|bundle)`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: (value) => ['simple', 'master', 'variant', 'grouped', 'bundle'].indexOf(value) !== -1
    },
    {
        column: "parent",
        valueInvalidMessage: `'parent' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "created_at",
        valueInvalidMessage: `'created_at' must be type datetime`,
        f_convert_value: database_data_type["NONE_NEGATIVE_INT"].f_convert_value,
        f_validation: database_data_type["NONE_NEGATIVE_INT"].f_validation
    },
    {
        column: "updated_at",
        valueInvalidMessage: `'updated-at' must be type datetime`,
        f_convert_value: database_data_type["NONE_NEGATIVE_INT"].f_convert_value,
        f_validation: database_data_type["NONE_NEGATIVE_INT"].f_validation
    }
];

const product_eav_columns = [
    {
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

function getGallerry (product) {
    let temp = [];
    let gallerry = [];
    if (product.self) temp.push(product.self);
    if (product.master) temp.push(product.master);
    if (product.variants) temp.push(...product.variants);
    temp.forEach(prod_entity => {
        let entity_id = prod_entity.entity_id;
        let entity_gallerry = (prod_entity.attributes) ? prod_entity.attributes.find(item => item.attribute_id === "images") : null;
        if (entity_gallerry && entity_gallerry.value) {
            entity_gallerry.value.forEach(item => {
                gallerry.push({
                    entity_id: entity_id,
                    image: item
                })
            })
        }
    });
    return gallerry;
};

function getThumbnail (product) {
    let temp = product.master || product.self;
    let result;
    if (temp) {
        let thumb_attribute = (temp.attributes || []).find(attr_item => attr_item.attribute_id === "thumbnail");
        if (thumb_attribute) result = thumb_attribute.value;
    };
    return result;
};

function getTierPrice(product, entity_id) {
    let temp = [];
    if (product.self) temp.push(product.self);
    if (product.master) temp.push(product.master);
    if (product.variants) temp.push(...product.variants);
    let result = {
        price: null
    };
    if (entity_id) {
        let match = temp.find(prod_entity => {
            return prod_entity.entity_id === entity_id;
        });
        if (match) result.price = match.tier_price;
        return result;
    };
    // if no entity_id specified
    let tier_price_list = [];
    temp.forEach(prod_entity => {
        if (prod_entity.tier_price !== null && prod_entity.tier_price !== undefined) {
            let match = tier_price_list.find(item => item === prod_entity.tier_price);
            if (match !== undefined) return;
            tier_price_list.push(prod_entity.tier_price);
        }
    });
    if (tier_price_list.length === 1) {
        result.price = tier_price_list[0];
    } else if (tier_price_list.length > 1) {
        result.max_price = Math.max(...tier_price_list);
        result.min_price = Math.min(...tier_price_list);
    };
    return result;
};

function getName (product, entity_id) {
    let temp = [];
    if (product.self) temp.push(product.self);
    if (product.master) temp.push(product.master);
    if (product.variants) temp.push(...product.variants);
    let result;
    let prod_entity;
    if (entity_id) {
        prod_entity = temp.find(prod_entity => prod_entity.entity_id === entity_id);
    } else {
        prod_entity = temp[0];
    }
    if (prod_entity) {
        let name_attribute = (prod_entity.attributes || []).find(attr_item => attr_item.attribute_id === "name");
        if (name_attribute) result = name_attribute.value;
    };
    return result;
}

function validateProductModel (product) {
    let isValid = true;
    let m_failure = "";
    product_entity_columns.forEach(col_item => {
        switch (product[col_item.column]) {
            case undefined:
                delete product[col_item.column];
                break;
            case null:
            case "":
                break;
            default:
                if (col_item.f_convert_value) {
                    product[col_item.column] = col_item.f_convert_value(product[col_item.column]);
                };
                if (!col_item.f_validation(product[col_item.column])) {
                    isValid = false;
                    m_failure += `\n\t Invalid entity property: ${col_item.valueInvalidMessage}.`
                }
                break;
        };
    });

    switch (product.attributes) {
        case null:
        case "":
        case undefined:
            delete product.attributes;
            break;
        default:
            if (!Array.isArray(product.attributes)) {
                isValid = false;
                m_failure += `\n\t 'attributes' must be an array containing attribute items.`;
                break;
            };
            for (let i = 0; i < product.attributes.length; i++) {
                let attr_item = product.attributes[i];
                if (attr_item.attribute_id === null || attr_item.attribute_id === "" || attr_item.attribute_id === undefined) {
                    isValid = false;
                    m_failure += "'attribute_id' must not be empty.";
                    continue;
                };
                if (attr_item.value === undefined) {
                    product.attributes.splice(i, 1);
                    i -= 1;
                    continue;
                };
                if (attr_item.value === null || attr_item.value === "") continue;
                /*eslint-disable */
                product_eav_columns.forEach(col_item => {
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

    if (isValid && Array.isArray(product.attributes)) {
        // delete remnant fields of eav attributes
        product.attributes.forEach(attribute => {
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
}

function extractProductEntity ({ product, entity_id }) {
    let entities = [...(product.variants || [])];
    if (product.self) {
        entities.push(product.self);
    };
    if (product.parent) {
        entities.push(product.parent);
    }
    let entity = entities.find(item => item.entity_id === entity_id) || {};
    return entity;
}

export {
    getGallerry,
    getThumbnail,
    getTierPrice,
    getName,
    validateProductModel,
    extractProductEntity
}