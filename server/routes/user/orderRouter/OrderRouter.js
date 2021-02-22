const express = require("express");
const msClient = require("../../utils/mysql/mysql");
const mysqlutils = require("../../../utils/mysql/mysqlutils");
const router = express.Router();
const { createSystemErrMessage, unescapeSelectedData } = require("../../utils/functions")
const { getTimeStampId } = require("../../../utils/const/timestamp_id_keeper");
const { checkAdminByCookie } = require("../../utils/middlewares/middlewares");
const { modelizeOrdersData } = require("./helper");
const search = require("../../../utils/search/search");
const orderHelper = require("./helper");
const order_status_label_mapping = [
    {
        status_id: 1,
        default: "confirmed",
        vi: "đã xác nhận"
    },
    {
        status_id: 2,
        default: "completed",
        vi: "đã hoàn thành"
    },
    {
        status_id: 3,
        default: "request for retun",
        vi: "yêu cầu trả hàng"
    },
    {
        status_id: 4,
        default: "returned",
        vi: "đã trả hàng"
    },
    {
        status_id: 5,
        default: "canceled",
        vi: "đã hủy"
    },
    {
        status_id: 6,
        default: "acanceled by admin",
        vi: "đã hủy bởi quản trị viên"
    }
];
const shipping_status_label_mapping = [
    {
        status_id: 1,
        default: "on prepare",
        vi: "đang chuẩn bị hàng"
    },
    {
        status_id: 2,
        default: "on shipping",
        vi: "đang giao hàng"
    },
    {
        status_id: 3,
        default: "shipped",
        vi: "đã giao hàng"
    },
    {
        status_id: 4,
        default: "canceled",
        vi: "đã hủy"
    }
]

router.get("/order", async (req, res) => {
    try{
        let query = req.query;
        if(!query.user_tel || query.user_tel == "") return res.json({orders: []});
        if(!query.since) query.since = 0;
        if(!query.upto) query.upto = 9999999999999; // timestamp có 13 số
        if(query.since > query.upto) query.since = query.upto;
        let sql_get_orders_by_tel =
        `
        SELECT
        order.entity_id AS order_id, order.order_time, order.status, order.shipping_status, order.rcver_name, order.rcver_tel, order.address,
        items.prod_id, items.prod_name, items.price, items.discount_percent, items.discount_direct, items.warranty, items.prod_thumb, items.category
        FROM \`ecommerce\`.order AS \`order\`
        LEFT JOIN \`ecommerce\`.address AS \`address\` ON address.entity_id = order.address
        LEFT JOIN \`ecommerce\`.order_item AS \`items\` ON items.order_id = order.entity_id
        WHERE user_tel="${mysqlutils.escapeQuotes(query.user_tel)}" AND order_time > "${mysqlutils.escapeQuotes(query.since)}" AND order_time < "${mysqlutils.escapeQuotes(query.upto)}"
        ORDER BY order_time DESC
        `;
        let rawOrders = await msClient.promiseQuery(sql_get_orders_by_tel);
        orders = modelizeOrdersData(rawOrders);
        res.json({orders: orders});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))});
    }
});

router.post("/order", async (req, res) => {
    // req.body: {user: user, products: [product]}
    // res.json({isSuccess: boolean, Alert: [], deleted_products})
    try{
        let user_require = ["user_tel", "user_name", "user_address"];
        let product_require = ["prod_id", "order_qty"];
        let user = req.body.user || {};
        let products = req.body.products || [];
        
        // check user valid
        let isUserValid = true;
        user_require.forEach(attr => {
            if(!user[attr] || user[attr] == "") isUserValid = false;
        })
        if(!isUserValid){
            res.Alert.push("Thông tin giao hàng chưa đầy đủ bạn ơi, hic!");
            return res.json({
                isSuccess: false,
                Alert: res.Alert
            })
        }

        // check products valid
        if(products.length < 2){
            res.Alert.push("Không có sản phẩm nào. Bạn vui lòng kiểm tra lại đơn hàng nhé!");
            return res.json({
                isSuccess: false,
                Alert: res.Alert
            })
        };
        let searchConfig = {
            entity_ids: item.prod_id
        }
        let database_products = await search.search(searchConfig);
        let unavailable_products = orderHelper.checkProductInStock({
            entity_ids: item.prod_id,
            products: database_products
        });
        // let attr_not_included_in_order = ["prod_review", "prod_stock", "last_updated", "updated_info"];
        // for(let i = 0; i < products.length; i++){
        //     let product = products[i];
        //     let database_match = database_products.find(item => {return item.prod_id == product.prod_id});
        //     if(!database_match){
        //         unavailable_products.push({...product})
        //     }else{
        //         attr_not_included_in_order.forEach(attr => {
        //             delete database_match[attr];
        //         })
        //         products[i] = {...database_match, ...product};
        //     }
        // }

        if(unavailable_products.length > 0){
            res.Alert.push("Một số sản phẩm đã hết hàng, bạn check đơn lại nha!");
            return res.json({
                isSuccess: false,
                Alert: res.Alert,
                unavailable_products: unavailable_products
            })
        }

        // save order
        let order_item_query = products.map(product => {
            let keys = [];
            let values = [];
            Object.keys(product).forEach(key => {
                if(key in product && key != null) {
                    keys.push(mysqlutils.escapeQuotes(key));
                    values.push(mysqlutils.escapeQuotes(product[key]));
                }
            })
            return `INSERT INTO \`ecommerce\`.order_item (order_id, ${keys.join(", ")}) VALUES (@order_id, "${values.join(`", "`)}");`
        });
        let order_query =
        `
        START TRANSACTION;
        INSERT INTO \`ecommerce\`.order (order_time, status, shipping_status, rcver_name, rcver_tel, address)
        VALUES ("${Date.now()}", "1", "1", "${mysqlutils.escapeQuotes(user.user_name)}", "${mysqlutils.escapeQuotes(user.user_tel)}", "${mysqlutils.escapeQuotes(user.user_address)}");
        SELECT @order_id:=last_insert_id();
        ${order_item_query.join("\n")}
        COMMIT;

        `
        
        res.json({
            isSuccess: true,
            Alert: res.Alert
        })

    }catch(err){
        res.Alert.push(createSystemErrMessage(001));
        res.json({
            isSuccess: false,
            Alert: res.Alert
        })
    }
});

router.put("/order", checkAdminByCookie, async (req, res) => {
    // req.body: {orders: [order]}
    // res.json({isSuccess: boolean, Alert: []})
    try{
        if(!req.admin || !req.admin.admin_id) return res.end();
        let orders = req.body.orders;
        let attr_arr = [];
        for(let i in orders[0]){
            attr_arr.push(i);
        }
        await msClient.updateRows("phukiendhqg.order", attr_arr, orders);
        res.json({isSuccess: true, Alert: res.Alert});
    }catch(err){
        res.json({Alert: res.Alert.push(createSystemErrMessage(001))})
    }
});

module.exports = router;