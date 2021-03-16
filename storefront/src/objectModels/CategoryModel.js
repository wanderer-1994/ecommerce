function getCategoryAttribute (category, attribute_id) {
    if (category && category.attributes) {
        let target_attr = category.attributes.find(item => item.attribute_id === attribute_id);
        if (target_attr) return target_attr.value;
        return null;
    };
    return null;
};

function structurizeCategories (categories) {
    let result = [];
    result = categories.filter(item => !item.parent).sort((a, b) => a.position - b.position);
    return result;
}

module.exports = {
    getCategoryAttribute,
    structurizeCategories
}