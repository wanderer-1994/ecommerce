import utility from "../utils/utility";
import constant from "../utils/constant";

function getGallerry (product) {
    let temp = [];
    let gallerry = [];
    if (product.self) temp.push(product.self);
    if (product.parent) temp.push(product.parent);
    if (product.variants) temp.push(...product.variants);
    temp.forEach(prod_entity => {
        let entity_id = prod_entity.entity_id;
        let entity_gallerry = (prod_entity.attributes) ? prod_entity.attributes.find(item => item.attribute_id === "gallery") : null;
        if (entity_gallerry && Array.isArray(entity_gallerry.value)) {
            entity_gallerry.value.forEach(item => {
                gallerry.push({
                    entity_id: entity_id,
                    imgUrl: item
                })
            })
        }
    });
    return gallerry;
};

function getThumbnail (product, entity_id) {
    let result = getProductSuperAttribute(product, "thumbnail", entity_id);
    if (utility.isValueEmpty(result) || (Array.isArray(result) && result.length === 0)) {
        let gallerry = getGallerry(product);
        if (gallerry.length > 0) result = gallerry[0].imgUrl;
    };
    return result;
}

function getProductSuperAttribute (product, attribute_id, entity_id) {
    let temp = [];
    if (product.self) temp.push(product.self);
    if (product.parent) temp.push(product.parent);
    if (product.variants) temp.push(...product.variants);
    let result;
    let prod_entity;
    if (entity_id) {
        prod_entity = temp.find(prod_entity => prod_entity.entity_id === entity_id) || {};
        let thumb_attribute = (prod_entity.attributes || []).find(attr_item => attr_item.attribute_id === attribute_id);
        if (thumb_attribute) result = thumb_attribute.value;
    };
    if (utility.isValueEmpty(result)  || (Array.isArray(result) && result.length === 0)) {
        let prod_entity = (product.self || product.parent) || {};
        let thumb_attribute = (prod_entity.attributes || []).find(attr_item => attr_item.attribute_id === attribute_id);
        if (thumb_attribute) result = thumb_attribute.value;
    }
    return result;
};

function getPrice(product, entity_id) {
    let temp = [];
    if (product.self) temp.push(product.self);
    if (product.parent) temp.push(product.parent);
    if (product.variants) temp.push(...product.variants);
    let result = {
        price: null
    };
    if (entity_id) {
        let match = temp.find(prod_entity => {
            return prod_entity.entity_id === entity_id;
        });
        if (match) result.tier_price = match.tier_price;
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
        result.tier_price = tier_price_list[0];
    } else if (tier_price_list.length > 1) {
        result.max_price = Math.max(...tier_price_list);
        result.min_price = Math.min(...tier_price_list);
    };
    return result;
};

function getName (product, entity_id) {
    let temp = [];
    if (product.self) temp.push(product.self);
    if (product.parent) temp.push(product.parent);
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

function generateProductUrl (product, entity_id) {
    let productName = getName(product, entity_id) || "";
    if (utility.isValueEmpty(entity_id)) {
        let temp = (product.self || product.parent) || {};
        entity_id = temp.entity_id || "";
    }
    return encodeURI(`${productName}${constant.URL_PROD_SPLITER}${entity_id}`);
}

export default {
    getGallerry,
    getThumbnail,
    getProductSuperAttribute,
    getPrice,
    getName,
    generateProductUrl
}