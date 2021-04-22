import axios from "axios";
import * as categoryModel from "../objectModels/CategoryModel";
import * as eavUtils from "../objectModels/eavUtils";
import queryString from "query-string";

axios.defaults.baseURL = window.location.origin.replace(/\:\d+$/, ":4000");

// auth
async function adminAuth(authInfo) {

}

async function adminLogout(admin_cookie) {

}

// product
async function adminSearchProduct(config) {
    try {
        let query = queryString.stringify(config);
        let response = await axios({
            method: "GET",
            url: `/api/admin/product?${query}`
        });
        return response.data;
    } catch (err) {
        console.log("mocking: adminSearchProduct");
        return {
            "currentPage": 1,
            "totalPages": 1,
            "totalFound": 1,
            "send": 1,
            "psize": 24,
            "products": [
                {
                    "product_id": "PR0002",
                    "type_id": "simple",
                    "self": {
                        "entity_id": "PR0002",
                        "product_id": "PR0002",
                        "type_id": "simple",
                        "created_at": 1618333200000,
                        "updated_at": 1618336254250,
                        "tier_price": 145000,
                        "available_quantity": 1,
                        "categories": [
                            {
                                "category_id": "storage",
                                "position": 0
                            }
                        ],
                        "attributes": [
                            {
                                "attribute_id": "is_new",
                                "label": "SP mới",
                                "referred_target": null,
                                "admin_only": 1,
                                "html_type": "boolean",
                                "data_type": "int",
                                "validation": "0|1",
                                "is_super": 1,
                                "is_system": 1,
                                "unit": null,
                                "value": 1
                            },
                            {
                                "attribute_id": "is_online",
                                "label": "Online",
                                "referred_target": null,
                                "admin_only": 0,
                                "html_type": "boolean",
                                "data_type": "int",
                                "validation": "0|1",
                                "is_super": 1,
                                "is_system": 1,
                                "unit": null,
                                "value": 0
                            },
                            {
                                "attribute_id": "sup_price",
                                "label": "Supplier price",
                                "referred_target": null,
                                "admin_only": 1,
                                "html_type": "input",
                                "data_type": "int",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 0,
                                "unit": null,
                                "value": 145000
                            },
                            {
                                "attribute_id": "name",
                                "label": "Product name",
                                "referred_target": null,
                                "admin_only": 0,
                                "html_type": "input",
                                "data_type": "varchar",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 1,
                                "unit": null,
                                "value": "USB 3.0 16G HOCO UD5 Chính hãng"
                            },
                            {
                                "attribute_id": "sup_link",
                                "label": "Supplier url",
                                "referred_target": null,
                                "admin_only": 1,
                                "html_type": "input",
                                "data_type": "varchar",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 0,
                                "unit": null,
                                "value": "https://phatdatcomputer.vn/san-pham/usb-30-16g-hoco-ud5-chinh-hang"
                            },
                            {
                                "attribute_id": "sup_name",
                                "label": "Supplier product name",
                                "referred_target": null,
                                "admin_only": 1,
                                "html_type": "input",
                                "data_type": "varchar",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 0,
                                "unit": null,
                                "value": "USB 3.0 16G HOCO UD5 Chính hãng"
                            },
                            {
                                "attribute_id": "sup_warranty",
                                "label": "Supplier warranty",
                                "referred_target": null,
                                "admin_only": 1,
                                "html_type": "input",
                                "data_type": "varchar",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 0,
                                "unit": null,
                                "value": "12T"
                            },
                            {
                                "attribute_id": "thumbnail",
                                "label": "Thumbnail",
                                "referred_target": null,
                                "admin_only": 0,
                                "html_type": "input",
                                "data_type": "varchar",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 1,
                                "unit": null,
                                "value": "https://phatdatcomputer.vn/upload/product/usb-hoco-16gb-ud5-30-chinh-hang1568793534_250x250.jpg"
                            },
                            {
                                "attribute_id": "subsection",
                                "label": "Tiểu mục",
                                "referred_target": null,
                                "admin_only": 1,
                                "html_type": "multiinput",
                                "data_type": "varchar",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 1,
                                "unit": null,
                                "value": [
                                    "usb"
                                ]
                            },
                            {
                                "attribute_id": "images",
                                "label": "Main images",
                                "referred_target": null,
                                "admin_only": 0,
                                "html_type": "multiinput",
                                "data_type": "varchar",
                                "validation": null,
                                "is_super": 1,
                                "is_system": 1,
                                "unit": null,
                                "value": [
                                    "https://phatdatcomputer.vn/upload/product/usb-hoco-16gb-ud5-30-chinh-hang1568793534.jpg"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    }
}

async function createProductEntities (product_entities) {
    try {
        let response = await axios({
            method: "POST",
            url: "/api/admin/product",
            data: {
                product_entities: product_entities
            }
        });
        console.log("live api: createProductEntities");
        return response.data;
    } catch (err) {
        console.log("mocking: createProductEntities");
        return {
            "product_entities": [
                {
                    ...product_entities[0],
                    "isSuccess": true
                }
            ]
        }
    }
}

async function updateProductEntities (product_entities) {
    try {
        let response = await axios({
            method: "PUT",
            url: "/api/admin/product",
            data: {
                product_entities: product_entities
            }
        });
        console.log("live api: updateproductEntities");
        return response.data;
    } catch (err) {
        console.log("mocking: updateProductEntities");
        return {
            "product_entities": [
                {
                    ...product_entities[0],
                    "isSuccess": true
                }
            ]
        }
    }
}

async function deleteProductEntities (entity_ids) {
    try {
        let response = await axios({
            method: "DELETE",
            url: "/api/admin/product",
            data: {
                product_ids: entity_ids
            }
        });
        console.log("live api: updateCategories");
        return response.data;
    } catch (err) {
        console.log("mocking: deleteProducts");
        return {
            isSuccess: true
        }
    }
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
        let unsortable = data.categories.filter(item => typeof(item.name) !== "string" || item.name.length < 1);
        data.categories = data.categories
        .filter(item => typeof(item.name) === "string" && item.name.length >= 1)
        .sort((a, b) => {
            if (a.name && b.name) return (a.name - b.name);
            if (!a.name && !b.name) return 0;
            if (a.name) return 0;
            return 1;
        });
        data.categories = [...data.categories, ...unsortable];
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

async function createCategories (categories) {
    try {
        let response = await axios({
            method: "POST",
            url: "/api/admin/category",
            data: {
                categories: categories
            }
        });
        console.log("live api: createCategories");
        return response.data;
    } catch (err) {
        console.log("mocking: createCategories")
        let response = {
            data: {
                categories: [{}]
            }
        };
        response.data.categories[0].isSuccess = true;
        response.data.categories[0].m_failure = "You have error in your sql syntax!";
        return response.data;
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
        return response.data;
    } catch (err) {
        let response = {
            data: {
                categories: [{}]
            }
        };
        response.data.categories[0].isSuccess = false;
        response.data.categories[0].m_failure = "You have error in your sql syntax!";
        return response.data;
    }
}

async function deleteCategories (entity_ids) {
    try {
        let response = await axios({
            method: "DELETE",
            url: "/api/admin/category",
            data: {
                category_ids: entity_ids
            }
        });
        console.log("live api: deleteCategories");
        return response.data;
    } catch (err) {
        console.log("mocking: deleteCategories");
        let response = {
            isSuccess: true
        };
        return response
    }
}

async function getCategoryProducts (category_id) {
    try {
        let response = await axios({
            method: "GET",
            url: `/api/admin/category/product?category_id=${category_id}`
        });
        console.log("live api: getCategoryProducts");
        let products = response.data || [];
        let unsortable = products.filter(item => typeof(item.position) !== "number" || item.position < 1);
        products = products
        .filter(item => typeof(item.position) === "number" && item.position >= 1)
        .sort((a, b) => {
            return a.position - b.position;
        });
        products = [...products, ...unsortable];
        return products;
    } catch (err) {
        console.log("mocking: getCategoryProducts");
        let response = {
            data: [
                {
                    product_id: "PR0001",
                    position: 1
                },
                {
                    product_id: "PR0004",
                    position: 2
                }
            ]
        };
        return response.data
    }
}

// category eav
async function getCategoryEavs () {
    try {
        let response = await axios({
            method: "GET",
            url: "/api/admin/category/eav"
        });
        console.log("live api: getCategoryEavs");
        response.data.category_eavs = eavUtils.sortEavByPosition(response.data.category_eavs);
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
        response.category_eavs = eavUtils.sortEavByPosition(response.category_eavs);
        return response.category_eavs;
    }
}

async function updateCategoryEavs (eavs) {
    try {
        let response = await axios({
            method: "PUT",
            url: "/api/admin/category/eav",
            data: {
                category_eavs: eavs
            }
        });
        console.log("live api: updateCategoryEavs");
        return response.data
    } catch (err) {
        console.log("mocking: updateCategoryEavs");
        eavs.forEach(item => item.isSuccess = true);
        let response = {
            category_eavs: eavs
        };
        return response;
    }
}

async function deleteCategoryEavs (eav_ids) {
    try {
        let response = await axios({
            method: "DELETE",
            url: "/api/admin/category/eav",
            data: {
                category_eav_ids: eav_ids
            }
        });
        console.log("live api: deleteCategoryEavs");
        return response.data
    } catch (err) {
        console.log("mocking: deleteCategoryEavs");
        let response = {
            isSuccess: true
        };
        return response;
    }
}

async function createCategoryEavs (eavs) {
    try {
        let response = await axios({
            method: "POST",
            url: "/api/admin/category/eav",
            data: {
                category_eavs: eavs
            }
        });
        console.log("live api: createCategoryEavs");
        return response.data
    } catch (err) {
        console.log("mocking: createCategoryEavs");
        eavs.forEach(item => item.isSuccess = true);
        let response = {
            category_eavs: eavs
        };
        return response;
    }
}

// product
async function getProductEntityOnly (config) {
    try {
        let entity_ids;
        let keyword;
        let page;
        let type_ids;
        let psize;
        if (config.entity_ids && config.entity_ids.length > 0) {
            entity_ids = config.entity_ids.join("|");
        }
        if (config.keyword && config.keyword.replace(/^\s+|\s+$/g, "") !== "") {
            keyword = config.keyword;
        }
        if (config.type_ids && config.type_ids.length > 0) {
            type_ids = config.type_ids.join("|");
        }
        if (parseInt(config.page) == config.page && parseInt(config.page) > 0) {
            page = parseInt(config.page);
        }
        if (parseInt(config.psize) == config.psize && parseInt(config.psize) > 0) {
            psize = parseInt(config.psize);
        } else if (config.psize === "infinite") {
            psize = config.psize;
        };
        let query = queryString.stringify({
            entity_only: true,
            entity_ids: entity_ids,
            keyword: keyword,
            type_ids: type_ids,
            page: page,
            psize: psize
        })
        let url = `api/admin/product?${query}`;
        let response = await axios({
            method: "GET",
            url: url
        });
        console.log("live api: getProductEntityOnly");
        return response.data;
    } catch (err) {
        console.log(err);
        console.log("mocking: getProductEntityOnly");
        return {
            "currentPage": 1,
            "totalPages": 1,
            "totalFound": 2,
            "send": 2,
            "psize": 24,
            "products": [
                {
                    "entity_id": "PR0005",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": 1617854798283,
                    "updated_at": 1617854798283,
                    "name": "USB 3.0 64G HOCO UD8 Type-C Chính hãng"
                },
                {
                    "entity_id": "PR0010",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": 1617854798283,
                    "updated_at": 1617854798283,
                    "name": "Cáp sạc nhanh HOCO X21 Plus Type-C (Silicone, 3.0A, 1m)"
                }
            ]
        };
    }
}

// product eav
// category eav
async function getProductEavs () {
    try {
        let response = await axios({
            method: "GET",
            url: "/api/admin/product/eav"
        });
        console.log("live api: getProductEavs");
        response.data.product_eavs = eavUtils.sortEavByPosition(response.data.product_eavs);
        return response.data.product_eavs;
    } catch (err) {
        console.log("mocking: getProductEavs");
        let response = {
            "product_eavs": [
                {
                    "attribute_id": "images",
                    "label": "Main Images",
                    "referred_target": "cell phone S",
                    "admin_only": 0,
                    "html_type": "multiinput",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 0,
                    "is_system": 0,
                    "unit": "pcs"
                },
                {
                    "attribute_id": "is_new",
                    "label": "SP mới",
                    "referred_target": null,
                    "admin_only": 1,
                    "html_type": "boolean",
                    "data_type": "int",
                    "validation": "0|1",
                    "is_super": 1,
                    "is_system": 1,
                    "unit": null
                },
                {
                    "attribute_id": "is_online",
                    "label": "Online",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "boolean",
                    "data_type": "int",
                    "validation": "0|1",
                    "is_super": 1,
                    "is_system": 1,
                    "unit": null
                },
                {
                    "attribute_id": "is_sale",
                    "label": "For sale",
                    "referred_target": null,
                    "admin_only": 1,
                    "html_type": "boolean",
                    "data_type": "int",
                    "validation": "0|1",
                    "is_super": 0,
                    "is_system": 0,
                    "unit": null
                },
                {
                    "attribute_id": "name",
                    "label": "Product name",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "input",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 1,
                    "unit": null
                },
                {
                    "attribute_id": "subsection",
                    "label": "Tiểu mục",
                    "referred_target": null,
                    "admin_only": 1,
                    "html_type": "multiinput",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 1,
                    "unit": null
                },
                {
                    "attribute_id": "sup_link",
                    "label": "Supplier url",
                    "referred_target": null,
                    "admin_only": 1,
                    "html_type": "input",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 0,
                    "unit": null
                },
                {
                    "attribute_id": "sup_name",
                    "label": "Supplier product name",
                    "referred_target": null,
                    "admin_only": 1,
                    "html_type": "input",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 0,
                    "unit": null
                },
                {
                    "attribute_id": "sup_price",
                    "label": "Supplier price",
                    "referred_target": null,
                    "admin_only": 1,
                    "html_type": "input",
                    "data_type": "int",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 0,
                    "unit": null
                },
                {
                    "attribute_id": "sup_warranty",
                    "label": "Supplier warranty",
                    "referred_target": null,
                    "admin_only": 1,
                    "html_type": "input",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 0,
                    "unit": null
                },
                {
                    "attribute_id": "thumbnail",
                    "label": "Thumbnail",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "input",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 1,
                    "unit": null
                },
                {
                    "attribute_id": "timbre",
                    "label": "Âm's vực",
                    "referred_target": null,
                    "admin_only": 0,
                    "html_type": "multiselect",
                    "data_type": "varchar",
                    "validation": null,
                    "is_super": 1,
                    "is_system": 0,
                    "unit": null,
                    "options": [
                        {
                            "option_value": "trebel",
                            "sort_order": 1
                        },
                        {
                            "option_value": "mid",
                            "sort_order": 2
                        },
                        {
                            "option_value": "bass",
                            "sort_order": 1
                        }
                    ]
                }
            ]
        };
        response.product_eavs = eavUtils.sortEavByPosition(response.product_eavs);
        return response.product_eavs;
    }
}

async function updateProductEavs (eavs) {
    try {
        let response = await axios({
            method: "PUT",
            url: "/api/admin/product/eav",
            data: {
                product_eavs: eavs
            }
        });
        console.log("live api: updateProductEavs");
        return response.data
    } catch (err) {
        console.log("mocking: updateProductEavs");
        eavs.forEach(item => item.isSuccess = true);
        let response = {
            product_eavs: eavs
        };
        return response;
    }
}

async function deleteProductEavs (eav_ids) {
    try {
        let response = await axios({
            method: "DELETE",
            url: "/api/admin/product/eav",
            data: {
                product_eav_ids: eav_ids
            }
        });
        console.log("live api: deleteProductEavs");
        return response.data
    } catch (err) {
        console.log("mocking: deleteProductEavs");
        let response = {
            isSuccess: true
        };
        return response;
    }
}

async function createProductEavs (eavs) {
    try {
        let response = await axios({
            method: "POST",
            url: "/api/admin/product/eav",
            data: {
                product_eavs: eavs
            }
        });
        console.log("live api: createProductEavs");
        return response.data
    } catch (err) {
        console.log("mocking: createProductEavs");
        eavs.forEach(item => item.isSuccess = true);
        let response = {
            product_eavs: eavs
        };
        return response;
    }
}

export {
    adminAuth,
    adminLogout,
    adminSearchProduct,
    createProductEntities,
    updateProductEntities,
    deleteProductEntities,
    getProductEntityOnly,
    initProducts,
    updateSupInfo,
    adminSearchOrder,
    adminUpdateOrders,
    getCategories,
    updateCategories,
    deleteCategories,
    createCategories,
    getCategoryProducts,
    getCategoryEavs,
    updateCategoryEavs,
    deleteCategoryEavs,
    createCategoryEavs,
    getProductEavs,
    updateProductEavs,
    deleteProductEavs,
    createProductEavs
}