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

module.exports = {
    getGallerry,
    getThumbnail,
    getTierPrice,
    getName
}