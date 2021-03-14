function getGallerry (product) {
    let temp = [];
    let gallerry = [];
    if (product.self) temp.push(product.self);
    if (product.master) temp.push(product.master);
    if (product.variants) temp.push(...product.variants);
    console.log(temp);
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
}

module.exports = {
    getGallerry
}