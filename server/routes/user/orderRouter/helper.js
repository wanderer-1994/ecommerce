const mysqlutils = require("../../../system_modules/mysql/mysqlutils");
const orderInheritFields = ["order_time", "status", "shipping_status", "rcver_name", "rcver_tel"];
const productInheritFields = ["prod_name", "price", "discount_percent", "discount_direct", "warranty", "prod_thumb", "category"];

function modelizeOrdersData (rawData) {
    let orders = mysqlutils.groupByAttribute({
        rawData: rawData,
        groupBy: "order_id"
    });
    orders.forEach(order => {
        if (order.__items.length > 0) {
            orderInheritFields.forEach(attribute => {
                order[attribute] = order.__items[0][attribute];
            })
            order.shipment = {
                city: order.__items[0].city,
                ward: order.__items[0].ward,
                address_line: order.__items[0].address_line
            };
            order.products = mysqlutils.groupByAttribute({
                rawData: order.__items,
                groupBy: "prod_id"
            });
            order.products.forEach(product => {
                if (product.__items.length > 0) {
                    productInheritFields.forEach(attribute => {
                        product[attribute] = product.__items[0][attribute];
                    })
                };
                delete product.__items;
            })
            delete order.__items;
        } else {
            order.shipment = {};
            order.products = [];
        }
    });
    return orders;
};

function checkProductInStock ({ entity_ids, products }) {
    let unavailable_products = [];
    let all_product_entities = [];
    products.forEach(product => {
        if (product.self) all_product_entities.push(product.self);
        if (product.variants) all_product_entities.push(...variants);
    });
    entity_ids.forEach(prod_entity => {
        let isAvailable = false;
        let match = all_product_entities.find(m_item => m_item.entity_id == prod_entity);
        if (match) {
            let available_quantity = (match.attributes || []).find(attribute => 
                (attribute.attribute_id == "available_quantity") && (parseInt(attribute.value) > 0)
            );
            if (available_quantity) isAvailable = true;
        };
        if (!isAvailable) {
            unavailable_products.push(prod_entity);
        }
    });
    return unavailable_products;
}

module.exports = {
    modelizeOrdersData,
    checkProductInStock
}