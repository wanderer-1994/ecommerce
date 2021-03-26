import axios from "axios";
import * as categoryModel from "../objectModels/CategoryModel";

// auth
async function adminAuth(authInfo) {

}

async function adminLogout(admin_cookie) {

}

async function adminSearchProduct() {

}

// product
async function addProducts() {

}

async function updateProducts() {

}

async function deleteProducts() {

}

async function initProducts() {

}

async function updateSupInfo() {

}

// order
async function adminSearchOrder(searchConfig) {

}

async function adminUpdateOrders(orders) {

}

// category
async function getCategories() {
    try {
        let response = await axios({
            method: "GET",
            url: "http://localhost:4000/api/admin/category"
        });
        let data = response.data;
        data.structured = categoryModel.structurizeCategories(data.categories || []);
        console.log("live api: getCategories");
        return data;
    } catch (err) {
        console.log("mocking: getCategories");
        let response = {
            "categories": [{
                    "entity_id": "adapter",
                    "name": "Adapter",
                    "parent": "cables",
                    "is_online": 1,
                    "position": null,
                    "attributes": [{
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
                        "value": "https://id-live-01.slatic.net/p/fa4215d316e0046945b9ac8d2025fd41.jpg"
                    }]
                },
                {
                    "entity_id": "cables",
                    "name": "Cable",
                    "parent": "charger",
                    "is_online": 1,
                    "position": null,
                    "attributes": [{
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
                        "value": "https://product.hstatic.net/1000297956/product/71ine4dujtl._sl1500__e9712c14f15348ccb9abd893d79e07b4_master.jpg"
                    }]
                },
                {
                    "entity_id": "charger",
                    "name": "Place holder",
                    "parent": null,
                    "is_online": 1,
                    "position": null,
                    "attributes": [{
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
                    "entity_id": "phone_accessories",
                    "name": "Place holder",
                    "parent": null,
                    "is_online": 1,
                    "position": null,
                    "attributes": [{
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
                    "attributes": [{
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
                    "attributes": [{
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
                    "attributes": [{
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
        };
        response.structured = categoryModel.structurizeCategories(response.categories || []);
        return response;
    }
}

async function updateCategories(categories) {
    try {
        let response = await axios({
            method: "PUT",
            url: "http://localhost:4000/api/admin/category",
            data: {
                categories: categories
            }
        });
        console.log("live api: updateCategories");
        return response.data;
    } catch (err) {

    }
}

function deleteCategories (entity_ids) {

}

export {
    adminAuth,
    adminLogout,
    adminSearchProduct,
    addProducts,
    updateProducts,
    deleteProducts,
    initProducts,
    updateSupInfo,
    adminSearchOrder,
    adminUpdateOrders,
    getCategories,
    updateCategories,
    deleteCategories
}