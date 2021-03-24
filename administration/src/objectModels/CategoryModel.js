const category_entity_columns = [
    {
        column: "entity_id",
        valueInvalidMessage: `'entity_id' must be none-empty string`,
        f_validation: function (value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "name",
        valueInvalidMessage: `'name' must be none-empty string`,
        f_validation: function (value) {
            return typeof(value) === "string" && value.length > 0;
        }
    },
    {
        column: "parent",
        valueInvalidMessage: `'parent' must be none-empty string or left empty`,
        f_validation: function (value) {
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
        f_validation: function (value) {
            return value === 1 || value === 0;
        }
    },
    {
        column: "position",
        valueInvalidMessage: `'position' must be non-negative number (type int) or left empty`,
        f_validation: function (value) {
            return typeof(value) === "number" && value >= 0 && value === parseInt(value);
        }
    }
];

function getCategoryAttribute (category, attribute_id) {
    if (category && category.attributes) {
        let target_attr = category.attributes.find(item => item.attribute_id === attribute_id);
        if (target_attr) return target_attr.value;
        return null;
    };
    return null;
};

function structurizeCategories (categories, parent_id) {
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
    category_entity_columns.forEach(property => {
        let value = category[property.column];
        value = property.f_convert_value ? property.f_convert_value(value) : value;
        if (value !== null && value !== "" && value !== undefined) {
            if (!property.f_validation(category[property.column])) {
                isValid = false;
                m_failure += `\n\t Invalid entity property: ${property.valueInvalidMessage}.`
            }
        } else {
            delete category[property.column];
        }
    });
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