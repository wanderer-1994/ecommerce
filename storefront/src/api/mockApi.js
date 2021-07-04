const axios = require("axios");
const utility = require("../utils/utility");
const CategoryModel = require("../object_models/CategoryModel");
const queryString = require("query-string");

if (process.env.REACT_APP_CLIENT_PORT && process.env.REACT_APP_SERVER_PORT) {
    axios.defaults.baseURL = window.location.origin.replace(process.env.REACT_APP_CLIENT_PORT, process.env.REACT_APP_SERVER_PORT);
} else {
    axios.defaults.baseURL = window.location.origin;
}

async function getHomePageData () {
    return {
        bannerImage: "https://i.pinimg.com/originals/78/61/73/7861735800c9086f638ae1421c706e08.jpg",
        categories: [
            {
                "entity_id": "charger",
                "name": "Place holder",
                "parent": null,
                "is_online": 1,
                "position": null,
                "feature_products": [1,2,3,4,5,6],
                "attributes": [
                    {
                        "attribute_id": "banner_image",
                        "label": "Banner Image",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "varchar",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "https://cdn.shopify.com/s/files/1/1764/3679/files/slide01_bg_2c7a814b-0985-4b4a-9958-8f2e96e20076.jpg?v=1517022095"
                    },
                    {
                        "attribute_id": "introduction",
                        "label": "Introduction",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias id voluptatem explicabo neque vero ratione facilis incidunt earum! Hic numquam magnam totam soluta, enim blanditiis nam ut ipsum a delectus."
                    },
                    {
                        "attribute_id": "title_caption",
                        "label": "Caption title",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder title caption"
                    }
                ]
            },
            {
                "entity_id": "phone_accessories",
                "name": "Place holder",
                "parent": null,
                "is_online": 1,
                "position": null,
                "feature_products": [1,2,3,4,5,6],
                "attributes": [
                    {
                        "attribute_id": "banner_image",
                        "label": "Banner Image",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "varchar",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "https://static.toiimg.com/photo/72975551.cms"
                    },
                    {
                        "attribute_id": "introduction",
                        "label": "Introduction",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder introduction"
                    },
                    {
                        "attribute_id": "title_caption",
                        "label": "Caption title",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder title caption"
                    }
                ]
            },
            {
                "entity_id": "sound_accessories",
                "name": "Place holder",
                "parent": null,
                "is_online": 1,
                "position": null,
                "feature_products": [1,2,3,4,5,6],
                "attributes": [
                    {
                        "attribute_id": "banner_image",
                        "label": "Banner Image",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "varchar",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "https://static.toiimg.com/photo/72975551.cms"
                    },
                    {
                        "attribute_id": "introduction",
                        "label": "Introduction",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder introduction"
                    },
                    {
                        "attribute_id": "title_caption",
                        "label": "Caption title",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder title caption"
                    }
                ]
            },
            {
                "entity_id": "speaker",
                "name": "Place holder",
                "parent": null,
                "is_online": 1,
                "position": null,
                "feature_products": [1,2,3,4,5,6],
                "attributes": [
                    {
                        "attribute_id": "banner_image",
                        "label": "Banner Image",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "varchar",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "https://static.toiimg.com/photo/72975551.cms"
                    },
                    {
                        "attribute_id": "introduction",
                        "label": "Introduction",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder introduction"
                    },
                    {
                        "attribute_id": "title_caption",
                        "label": "Caption title",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder title caption"
                    }
                ]
            },
            {
                "entity_id": "storage",
                "name": "Place holder",
                "parent": null,
                "is_online": 1,
                "position": null,
                "feature_products": [1,2,3,4,5,6],
                "attributes": [
                    {
                        "attribute_id": "banner_image",
                        "label": "Banner Image",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "varchar",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "https://static.toiimg.com/photo/72975551.cms"
                    },
                    {
                        "attribute_id": "introduction",
                        "label": "Introduction",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder introduction"
                    },
                    {
                        "attribute_id": "title_caption",
                        "label": "Caption title",
                        "referred_target": null,
                        "admin_only": 0,
                        "html_type": "input",
                        "data_type": "text",
                        "validation": null,
                        "is_super": 0,
                        "is_system": 1,
                        "unit": null,
                        "value": "Placeholder title caption"
                    }
                ]
            }
        ]
    }
}

async function getCategories () {
    try {
        let response = await axios({
            method: "GET",
            url: "/api/category"
        });
        let categories = response.data.categories;
        let structurized = CategoryModel.structurizeCategories(categories, "");
        return { categories, structurized };
    } catch (err) {
        throw err;
    }
}

/**
 * @param {{
 *  categories: String,
 *  entity_ids: String,
 *  keyword: String,
 *  page: Number,
 *  psize: Number,
 *  filter_attribute_id: String
 * }} searchConfig
 * @returns {{
 *  currentPage: Number,
 *  products: Array.<{product: Object}>,
 *  psize: Number,
 *  send: Number,
 *  totalFound: Number,
 *  totalPages: Number
 * }}
 */
async function searchProduct (searchConfig) {
    try {
        try {
            let query = queryString.stringify(searchConfig);
            let response = await axios({
                method: "GET",
                url: `/api/product?${query}`
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    }
}

async function placeOrder (user, products) {
    return {
        isSuccess: true
    }
}

async function getOrderHistory (user) {
 return [
    {
        user: {
            order_id: "",
            order_time: 1234567891234,
            status: "",
            shipping_status: "",
            rcver_name: "",
            rcver_tel: "",
            address: "",
        },
        products: [
            {
                entity_id: "PR003",
                prod_id: "PR002",
                prod_name: "",
                prod_thumb: "",
                price: 23000,
                discount_percent: null,
                discount_direct: null,
                warranty: null,
                category: null,
                variant: "",
                quantity: 1,
            },
            {
                entity_id: "PR001",
                prod_id: "PR001",
                prod_name: "",
                prod_thumb: "",
                price: 23000,
                discount_percent: null,
                discount_direct: null,
                warranty: null,
                category: null,
                variant: "",
                quantity: 2,
            }
        ]
    }
 ];
}

async function validateCart (prod_entities) {
    // prod_entities: [{entity_id, quantity}]
}

async function accessAnnounce (machine_key, last_access) {

}

module.exports = {
    getHomePageData,
    getCategories,
    searchProduct,
    placeOrder,
    getOrderHistory,
    validateCart,
    accessAnnounce
}