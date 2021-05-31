const utility = require("../utils/utility");

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
        result = categories.filter(item => !item.parent);
    } else {
        result = categories.filter(item => item.parent === parent_id);
    };
    result = utility.sortArrayByAttribute({
        array: result,
        attribute_id: "position",
        sort_rule: "ASC"
    })
    result.forEach(item => {
        item.children = structurizeCategories(categories, item.entity_id);
    });
    return result;
}

module.exports = {
    getCategoryAttribute,
    structurizeCategories
}