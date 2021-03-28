import axios from "axios";
import * as categoryModel from "../objectModels/CategoryModel";

axios.defaults.baseURL = "http://localhost:4000";

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
            url: "/api/admin/category"
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
            url: "/api/admin/category",
            data: {
                categories: categories
            }
        });
        console.log("live api: updateCategories");
        response.data.categories[0].isSuccess = false;
        response.data.categories[0].m_failure = "You have error in your sql syntax!";
        return response.data;
    } catch (err) {

    }
}

async function deleteCategories (entity_ids) {
    try {
        let response = await axios({
            method: "DELETE",
            url: "/api/admin/category",
            data: {
                category_ids: ["abc", "def"]
            }
        });
        response.data.isSuccess = false;
        response.data.m_failure = "You have error in your sql syntax!";
        console.log("live api: updateCategories");
        return response.data;
    } catch (err) {
        console.log("mocking: deleteCategories");
        let response = {
            isSuccess: true
        };
        return response
    }
}

// category eav
async function getCategoryEavs () {
    try {
        let response = await axios({
            method: "GET",
            url: "/api/admin/category/eav"
        });
        console.log("live api: getCategoryEavs")
        return response.data.category_eavs;
    } catch (err) {
        console.log("mocking: getCategoryEavs");
        let response = {
            "category_eavs": [
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
                    "unit": null
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
                    "unit": null
                },
                {
                    "attribute_id": "site_locales",
                    "label": "Available in locales",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "select",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 0,
                    "is_system": 0,
                    "unit": null,
                    "options": [
                        {
                            "option_value": "AU",
                            "sort_order": 4
                        },
                        {
                            "option_value": "UK",
                            "sort_order": 3
                        },
                        {
                            "option_value": "US",
                            "sort_order": 2
                        },
                        {
                            "option_value": "VI",
                            "sort_order": 1
                        }
                    ]
                },
                {
                    "attribute_id": "style_fashion",
                    "label": "Style fashion",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "input",
                    "data_type": "int",
                    "validation": "^[1,2,3]$",
                    "is_super": 0,
                    "is_system": 0,
                    "unit": "pcs"
                },
                {
                    "attribute_id": "title_caption",
                    "label": "Caption title",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "multiselect",
                    "data_type": "text",
                    "validation": null,
                    "is_super": 0,
                    "is_system": 1,
                    "unit": null,
                    "options": [
                        {
                            "option_value": "D",
                            "sort_order": 4
                        },
                        {
                            "option_value": "C",
                            "sort_order": 3
                        },
                        {
                            "option_value": "B",
                            "sort_order": 2
                        },
                        {
                            "option_value": "A",
                            "sort_order": 1
                        }
                    ]
                },
                {
                    "attribute_id": "password",
                    "label": "User password",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "password",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 0,
                    "is_system": 1,
                    "unit": null
                },
                {
                    "attribute_id": "is_special",
                    "label": "Special occasion",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "boolean",
                    "data_type": "int",
                    "validation": null,
                    "is_super": 0,
                    "is_system": 1,
                    "unit": null
                },
                {
                    "attribute_id": "img_gallery",
                    "label": "Gallery",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "multiinput",
                    "data_type": "html",
                    "validation": "^http\\:\\/\\/\\S+$",
                    "is_super": 0,
                    "is_system": 1,
                    "unit": null
                }
            ]
        };
        return response.category_eavs;
    }
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
    deleteCategories,
    getCategoryEavs
}