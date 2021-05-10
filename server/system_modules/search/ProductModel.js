const mysqlutils = require("../mysql/mysqlutils");

function getAttributeValue (product, entity, attribute_id, inheritIfNull) {
    try {
        let entity_id = entity.entity_id || entity;
        let entities = [product.self, product.parent, ...(product.variants || [])].filter(item => !mysqlutils.isValueEmpty(item));
        let target = entities.find(item => item.entity_id === entity_id);
        let value = getEntityAttributeValue(target, attribute_id);
        if (mysqlutils.isValueEmpty(value) || (Array.isArray(value) && value.length === 0)) {
            if (inheritIfNull === true) {
                value = getEntityAttributeValue(product.parent, attribute_id);
            }
        };
        return value;
    } catch (err) {
        return undefined;
    }
}

function getEntityAttributeValue (entity, attribute_id) {
    try {
        let attribute = entity.attributes.find(item => item.attribute_id === attribute_id);
        return attribute.value;
    } catch (err) {
        return undefined;
    }
}

module.exports = {
    getAttributeValue
}