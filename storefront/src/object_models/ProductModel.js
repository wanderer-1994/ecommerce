import utility from "../utils/utility";
import constant from "../utils/constant";
import CategoryModel from "./CategoryModel";

/**
 * Return entity if entity_id is sepecified. If no entity_id specified, return parent/self
 * @param {Object} product 
 * @param {String} entity_id 
 * @returns 
 */
function getEntity (product, entity_id) {
    if (!product) return null;
    let temp = [];
    if (product.self) temp.push(product.self);
    if (product.parent) temp.push(product.parent);
    if (product.variants) temp.push(...product.variants);
    if (entity_id) {
        return temp.find(prod_entity => prod_entity.entity_id === entity_id);
    };
    return temp[0];
}

/**
 * 
 * @param {Object} product 
 * @returns {Array.<{
 *  entity_id   : String,
 *  imgUrl      : String
 * }>}
 */
function getGallery (product) {
    let temp = [];
    let gallery = [];
    if (product.self) temp.push(product.self);
    if (product.parent) temp.push(product.parent);
    if (product.variants) temp.push(...product.variants);
    temp.forEach(prod_entity => {
        let entity_id = prod_entity.entity_id;
        let entity_gallery = (prod_entity.attributes) ? prod_entity.attributes.find(item => item.attribute_id === "gallery") : null;
        if (entity_gallery && Array.isArray(entity_gallery.value)) {
            entity_gallery.value.forEach(item => {
                gallery.push({
                    entity_id: entity_id,
                    imgUrl: item
                })
            })
        }
    });
    return gallery;
};

function getThumbnail (product, entity_id) {
    let result = getProductSuperAttribute(product, "thumbnail", entity_id);
    if (utility.isValueEmpty(result) || (Array.isArray(result) && result.length === 0)) {
        let gallery = getGallery(product);
        if (gallery.length > 0) {
            if (!utility.isValueEmpty(entity_id)) {
                gallery = gallery.filter(imgItem => imgItem.entity_id === entity_id);
            }
            result = gallery[0].imgUrl;
        }
    };
    return result;
}

/**
 * Return entity attribute value, if empty, return parent attribute value
 * @param {Object} product 
 * @param {String} attribute_id 
 * @param {String} entity_id 
 * @returns 
 */
function getProductSuperAttribute (product, attribute_id, entity_id) {
    let result;
    let entity = getEntity(product, entity_id);
    if (entity) {
        let attribute = (entity.attributes || []).find(attr_item => attr_item.attribute_id === attribute_id);
        if (attribute) result = attribute.value;
    };
    if (utility.isValueEmpty(result)  || (Array.isArray(result) && result.length === 0)) {
        entity = (product.self || product.parent) || {};
        let attribute = (entity.attributes || []).find(attr_item => attr_item.attribute_id === attribute_id);
        if (attribute) result = attribute.value;
    }
    return result;
};

/**
 * Return attribute value of specified entity. If no entity_id specified, return null.
 * @param {Object} product 
 * @param {String} attribute_id 
 * @param {String} entity_id 
 * @returns 
 */
function getEntityAttribute (product, attribute_id, entity_id) {
    let result;
    if (utility.isValueEmpty(entity_id)) {
        return null;
    }
    let entity = getEntity(product, entity_id);
    if (entity) {
        let attribute = (entity.attributes || []).find(attr_item => attr_item.attribute_id === attribute_id);
        if (attribute) result = attribute.value;
    };
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
    let result;
    let entity = getEntity(product, entity_id) || getEntity(product);
    if (entity) {
        let name_attribute = (entity.attributes || []).find(attr_item => attr_item.attribute_id === "name");
        if (name_attribute) result = name_attribute.value;
    };
    return result;
}

/**
 * 
 * @param {Object} product
 * @param {String} entity_id
 * @returns {String}
 */
function generateProductUrl (product, entity_id) {
    let productName = (getName(product, entity_id) || getName(product)) || "";
    if (utility.isValueEmpty(entity_id)) {
        let temp = (product.self || product.parent) || {};
        entity_id = temp.entity_id || "";
    }
    return encodeURI(`${productName}${constant.URL_PROD_SPLITER}${entity_id}`);
}

/**
 * 
 * @param {Object} product 
 * @param {Array.<Object>} categories 
 * @param {String | null} entity_id 
 * @returns {Object}
 */
function getPrimaryCategory (product, categories, entity_id) {
    if (!product || !categories) return;
    let rootCategory;
    let entity = getEntity(product, entity_id);
    if (entity) {
        (entity.categories || []).forEach((assignment, index) => {
            if (assignment.is_primary === true || index === 0) {
                let rootCategoryId = assignment.category_id;
                let category = categories.find(catItem => catItem.entity_id === rootCategoryId);
                if (category) rootCategory = category;
            }
        })
    };
    return rootCategory;
}

/**
 * 
 * @param {Object} product 
 * @param {Object} category 
 * @returns {Array.<{
 *  attribute_id        : String,
 *  displayName         : String,
 *  values: Array.<{
 *      value               : String,
 *      available_quantity  : Number,
 *      entities            : Array.<{
 *          entity_id           : String,
 *          available_quantity  : Number
 *      }>
 *  }>
 * }>}
 */
function getProductSwatch(product, category) {
    let swatchAttributes = CategoryModel.getCategoryAttribute(category, "variationModel");
    try {
        swatchAttributes = JSON.parse(swatchAttributes);
        if (!Array.isArray(swatchAttributes)) {
            throw new Error("swatchAttribute config not exist or invalid!");
        };
        swatchAttributes = swatchAttributes.filter(item => !utility.isValueEmpty(item.attribute_id));
    } catch (err) {
        swatchAttributes = [];
    }
    let swatchModel = [];
    if (!Array.isArray(product.variants) || product.variants.length === 0) return swatchModel;
    swatchAttributes.forEach(swatchItem => {
        let attribute_id = swatchItem.attribute_id;
        let matchSwatch = swatchModel.find(item => item.attribute_id === attribute_id);
        if (!matchSwatch) {
            matchSwatch = {
                attribute_id: attribute_id,
                displayName: swatchItem.displayName,
                values: []
            };
            swatchModel.push(matchSwatch);
        };
        product.variants.forEach(entity => {
            let value = getEntityAttribute(product, attribute_id, entity.entity_id);
            if (!utility.isValueEmpty(value)) {
                if (Array.isArray(value)) {
                    value.forEach(v_item => {
                        if (utility.isValueEmpty(v_item)) return;
                        let matchValue = matchSwatch.values.find(item => item.value === v_item);
                        if (!matchValue) {
                            matchValue = {
                                value: value,
                                available_quantity: 0,
                                entities: []
                            };
                            matchSwatch.values.push(matchValue);
                        };
                        let matchEntity = matchValue.entities.find(item => item.entity_id === entity.entity_id);
                        if (!matchEntity) {
                            matchEntity = {
                                entity_id: entity.entity_id,
                                available_quantity: 0
                            };
                            matchValue.entities.push(matchEntity)
                        };
                        matchEntity.available_quantity += (entity.available_quantity || 0);
                        matchValue.available_quantity += (entity.available_quantity || 0);
                    })
                } else {
                    let matchValue = matchSwatch.values.find(item => item.value === value);
                    if (!matchValue) {
                        matchValue = {
                            value: value,
                            available_quantity: 0,
                            entities: []
                        };
                        matchSwatch.values.push(matchValue);
                    };
                    let matchEntity = matchValue.entities.find(item => item.entity_id === entity.entity_id);
                    if (!matchEntity) {
                        matchEntity = {
                            entity_id: entity.entity_id,
                            available_quantity: 0
                        };
                        matchValue.entities.push(matchEntity)
                    };
                    matchEntity.available_quantity += (entity.available_quantity || 0);
                    matchValue.available_quantity += (entity.available_quantity || 0);
                }
            }
        })
    });
    swatchModel = swatchModel.filter(item => item.values.length > 0);
    return swatchModel;
}

export default {
    getEntity,
    getGallery,
    getThumbnail,
    getProductSuperAttribute,
    getEntityAttribute,
    getPrice,
    getName,
    generateProductUrl,
    getPrimaryCategory,
    getProductSwatch
}