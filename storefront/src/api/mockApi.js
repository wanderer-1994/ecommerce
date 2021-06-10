const axios = require("axios");
const utility = require("../utils/utility");
const CategoryModel = require("../object_models/CategoryModel");

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
    return [
        {
            "entity_id": "charger",
            "name": "Place holder",
            "parent": null,
            "is_online": 1,
            "position": null,
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

async function searchProduct () {
    return {
        "currentPage": 1,
        "totalPages": 1,
        "totalFound": 1,
        "send": 1,
        "psize": 24,
        "products": [
            {
                "product_id": "PR0001",
                "type_id": "simple",
                "self": {
                    "product_id": "PR0001",
                    "entity_id": "PR0001",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": null,
                    "updated_at": null,
                    "categories": [
                        {
                            "category_id": "abc",
                            "position": 12
                        },
                        {
                            "category_id": "cdf",
                            "position": 3
                        }
                    ],
                    "tier_price": 28000,
                    "available_quantity": 12,
                    "attributes": [
                        {
                            "attribute_id": "name",
                            "value": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
                            "html_type": "input",
                            "data_type": "varchar"
                        },
                        {
                            "attribute_id": "description",
                            "value": "<p>The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel, not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with plenty of room to spare, it's ideal for athletes with places to go.<p>\n<ul>\n<li>Dual top handles.</li>\n<li>Adjustable shoulder strap.</li>\n<li>Full-length zipper.</li>\n<li>L 29\" x W 13\" x H 11\".</li>\n</ul>",
                            "frontend_input": "textarea",
                            "frontend_label": "Description"
                        },
                        {
                            "attribute_id": "price",
                            "value": "34.000000",
                            "frontend_input": "price",
                            "frontend_label": "Price"
                        },
                        {
                            "attribute_id": "images",
                            "value": ["https://i.pinimg.com/originals/82/9b/e0/829be0d8df7b925534164af7ccd74194.jpg", "https://static.rogerebert.com/uploads/review/primary_image/reviews/happy-feet-two-2011/EB20111116REVIEWS111119984AR.jpg", "https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/wb-883316455302-Full-Image_GalleryBackground-en-US-1483994511251._SX1080_.jpg", "https://decider.com/wp-content/uploads/2017/06/happy-feet.jpg?quality=80&strip=all&w=568", "https://cdn.shopify.com/s/files/1/1711/1231/products/Megayouput-5D-diy-diamond-painting-Cross-Stitch-Diamond-Embroidery-mosaic-pattern-Cute-penguin-picture-Cartoon-kids_1024x1024.jpg?v=1571609287"],
                            "frontend_input": "media_image",
                            "frontend_label": "Base"
                        },
                        {
                            "attribute_id": "thumbnail",
                            "value": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
                            "frontend_input": "media_image",
                            "frontend_label": "Thumbnail"
                        },
                        {
                            "attribute_id": "status",
                            "value": "1",
                            "frontend_input": "select",
                            "frontend_label": "Enable Product"
                        },
                        {
                            "attribute_id": "visibility",
                            "value": "4",
                            "frontend_input": "select",
                            "frontend_label": "Visibility"
                        },
                        {
                            "attribute_id": "url_key",
    
                            "value": "joust-duffle-bag",
                            "frontend_input": "text",
                            "frontend_label": "URL Key"
                        }
                    ]
                }
            },
            {
                "product_id": "PR0002",
                "type_id": "simple",
                "self": {
                    "product_id": "PR0002",
                    "entity_id": "PR0002",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": null,
                    "updated_at": null,
                    "categories": [
                        {
                            "category_id": "abc",
                            "position": 12
                        },
                        {
                            "category_id": "cdf",
                            "position": 3
                        }
                    ],
                    "tier_price": 28000,
                    "available_quantity": 12,
                    "attributes": [
                        {
                            "attribute_id": "name",
                            "value": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
                            "html_type": "input",
                            "data_type": "varchar"
                        },
                        {
                            "attribute_id": "description",
                            "value": "<p>The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel, not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with plenty of room to spare, it's ideal for athletes with places to go.<p>\n<ul>\n<li>Dual top handles.</li>\n<li>Adjustable shoulder strap.</li>\n<li>Full-length zipper.</li>\n<li>L 29\" x W 13\" x H 11\".</li>\n</ul>",
                            "frontend_input": "textarea",
                            "frontend_label": "Description"
                        },
                        {
                            "attribute_id": "price",
                            "value": "34.000000",
                            "frontend_input": "price",
                            "frontend_label": "Price"
                        },
                        {
                            "attribute_id": "images",
                            "value": ["https://i.pinimg.com/originals/82/9b/e0/829be0d8df7b925534164af7ccd74194.jpg", "https://static.rogerebert.com/uploads/review/primary_image/reviews/happy-feet-two-2011/EB20111116REVIEWS111119984AR.jpg", "https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/wb-883316455302-Full-Image_GalleryBackground-en-US-1483994511251._SX1080_.jpg", "https://decider.com/wp-content/uploads/2017/06/happy-feet.jpg?quality=80&strip=all&w=568", "https://cdn.shopify.com/s/files/1/1711/1231/products/Megayouput-5D-diy-diamond-painting-Cross-Stitch-Diamond-Embroidery-mosaic-pattern-Cute-penguin-picture-Cartoon-kids_1024x1024.jpg?v=1571609287"],
                            "frontend_input": "media_image",
                            "frontend_label": "Base"
                        },
                        {
                            "attribute_id": "thumbnail",
                            "value": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
                            "frontend_input": "media_image",
                            "frontend_label": "Thumbnail"
                        },
                        {
                            "attribute_id": "status",
                            "value": "1",
                            "frontend_input": "select",
                            "frontend_label": "Enable Product"
                        },
                        {
                            "attribute_id": "visibility",
                            "value": "4",
                            "frontend_input": "select",
                            "frontend_label": "Visibility"
                        },
                        {
                            "attribute_id": "url_key",
    
                            "value": "joust-duffle-bag",
                            "frontend_input": "text",
                            "frontend_label": "URL Key"
                        }
                    ]
                }
            },
            {
                "product_id": "PR0003",
                "type_id": "simple",
                "self": {
                    "product_id": "PR0003",
                    "entity_id": "PR0003",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": null,
                    "updated_at": null,
                    "categories": [
                        {
                            "category_id": "abc",
                            "position": 12
                        },
                        {
                            "category_id": "cdf",
                            "position": 3
                        }
                    ],
                    "tier_price": 28000,
                    "available_quantity": 12,
                    "attributes": [
                        {
                            "attribute_id": "name",
                            "value": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
                            "html_type": "input",
                            "data_type": "varchar"
                        },
                        {
                            "attribute_id": "description",
                            "value": "<p>The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel, not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with plenty of room to spare, it's ideal for athletes with places to go.<p>\n<ul>\n<li>Dual top handles.</li>\n<li>Adjustable shoulder strap.</li>\n<li>Full-length zipper.</li>\n<li>L 29\" x W 13\" x H 11\".</li>\n</ul>",
                            "frontend_input": "textarea",
                            "frontend_label": "Description"
                        },
                        {
                            "attribute_id": "price",
                            "value": "34.000000",
                            "frontend_input": "price",
                            "frontend_label": "Price"
                        },
                        {
                            "attribute_id": "images",
                            "value": ["https://i.pinimg.com/originals/82/9b/e0/829be0d8df7b925534164af7ccd74194.jpg", "https://static.rogerebert.com/uploads/review/primary_image/reviews/happy-feet-two-2011/EB20111116REVIEWS111119984AR.jpg", "https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/wb-883316455302-Full-Image_GalleryBackground-en-US-1483994511251._SX1080_.jpg", "https://decider.com/wp-content/uploads/2017/06/happy-feet.jpg?quality=80&strip=all&w=568", "https://cdn.shopify.com/s/files/1/1711/1231/products/Megayouput-5D-diy-diamond-painting-Cross-Stitch-Diamond-Embroidery-mosaic-pattern-Cute-penguin-picture-Cartoon-kids_1024x1024.jpg?v=1571609287"],
                            "frontend_input": "media_image",
                            "frontend_label": "Base"
                        },
                        {
                            "attribute_id": "thumbnail",
                            "value": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
                            "frontend_input": "media_image",
                            "frontend_label": "Thumbnail"
                        },
                        {
                            "attribute_id": "status",
                            "value": "1",
                            "frontend_input": "select",
                            "frontend_label": "Enable Product"
                        },
                        {
                            "attribute_id": "visibility",
                            "value": "4",
                            "frontend_input": "select",
                            "frontend_label": "Visibility"
                        },
                        {
                            "attribute_id": "url_key",
    
                            "value": "joust-duffle-bag",
                            "frontend_input": "text",
                            "frontend_label": "URL Key"
                        }
                    ]
                }
            },
            {
                "product_id": "PR004",
                "type_id": "simple",
                "self": {
                    "product_id": "PR004",
                    "entity_id": "PR004",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": null,
                    "updated_at": null,
                    "categories": [
                        {
                            "category_id": "abc",
                            "position": 12
                        },
                        {
                            "category_id": "cdf",
                            "position": 3
                        }
                    ],
                    "tier_price": 28000,
                    "available_quantity": 12,
                    "attributes": [
                        {
                            "attribute_id": "name",
                            "value": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
                            "html_type": "input",
                            "data_type": "varchar"
                        },
                        {
                            "attribute_id": "description",
                            "value": "<p>The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel, not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with plenty of room to spare, it's ideal for athletes with places to go.<p>\n<ul>\n<li>Dual top handles.</li>\n<li>Adjustable shoulder strap.</li>\n<li>Full-length zipper.</li>\n<li>L 29\" x W 13\" x H 11\".</li>\n</ul>",
                            "frontend_input": "textarea",
                            "frontend_label": "Description"
                        },
                        {
                            "attribute_id": "price",
                            "value": "34.000000",
                            "frontend_input": "price",
                            "frontend_label": "Price"
                        },
                        {
                            "attribute_id": "images",
                            "value": ["https://i.pinimg.com/originals/82/9b/e0/829be0d8df7b925534164af7ccd74194.jpg", "https://static.rogerebert.com/uploads/review/primary_image/reviews/happy-feet-two-2011/EB20111116REVIEWS111119984AR.jpg", "https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/wb-883316455302-Full-Image_GalleryBackground-en-US-1483994511251._SX1080_.jpg", "https://decider.com/wp-content/uploads/2017/06/happy-feet.jpg?quality=80&strip=all&w=568", "https://cdn.shopify.com/s/files/1/1711/1231/products/Megayouput-5D-diy-diamond-painting-Cross-Stitch-Diamond-Embroidery-mosaic-pattern-Cute-penguin-picture-Cartoon-kids_1024x1024.jpg?v=1571609287"],
                            "frontend_input": "media_image",
                            "frontend_label": "Base"
                        },
                        {
                            "attribute_id": "thumbnail",
                            "value": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
                            "frontend_input": "media_image",
                            "frontend_label": "Thumbnail"
                        },
                        {
                            "attribute_id": "status",
                            "value": "1",
                            "frontend_input": "select",
                            "frontend_label": "Enable Product"
                        },
                        {
                            "attribute_id": "visibility",
                            "value": "4",
                            "frontend_input": "select",
                            "frontend_label": "Visibility"
                        },
                        {
                            "attribute_id": "url_key",
    
                            "value": "joust-duffle-bag",
                            "frontend_input": "text",
                            "frontend_label": "URL Key"
                        }
                    ]
                }
            },
            {
                "product_id": "PR005",
                "type_id": "simple",
                "self": {
                    "product_id": "PR005",
                    "entity_id": "PR005",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": null,
                    "updated_at": null,
                    "categories": [
                        {
                            "category_id": "abc",
                            "position": 12
                        },
                        {
                            "category_id": "cdf",
                            "position": 3
                        }
                    ],
                    "tier_price": 28000,
                    "available_quantity": 12,
                    "attributes": [
                        {
                            "attribute_id": "name",
                            "value": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
                            "html_type": "input",
                            "data_type": "varchar"
                        },
                        {
                            "attribute_id": "description",
                            "value": "<p>The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel, not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with plenty of room to spare, it's ideal for athletes with places to go.<p>\n<ul>\n<li>Dual top handles.</li>\n<li>Adjustable shoulder strap.</li>\n<li>Full-length zipper.</li>\n<li>L 29\" x W 13\" x H 11\".</li>\n</ul>",
                            "frontend_input": "textarea",
                            "frontend_label": "Description"
                        },
                        {
                            "attribute_id": "price",
                            "value": "34.000000",
                            "frontend_input": "price",
                            "frontend_label": "Price"
                        },
                        {
                            "attribute_id": "images",
                            "value": ["https://i.pinimg.com/originals/82/9b/e0/829be0d8df7b925534164af7ccd74194.jpg", "https://static.rogerebert.com/uploads/review/primary_image/reviews/happy-feet-two-2011/EB20111116REVIEWS111119984AR.jpg", "https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/wb-883316455302-Full-Image_GalleryBackground-en-US-1483994511251._SX1080_.jpg", "https://decider.com/wp-content/uploads/2017/06/happy-feet.jpg?quality=80&strip=all&w=568", "https://cdn.shopify.com/s/files/1/1711/1231/products/Megayouput-5D-diy-diamond-painting-Cross-Stitch-Diamond-Embroidery-mosaic-pattern-Cute-penguin-picture-Cartoon-kids_1024x1024.jpg?v=1571609287"],
                            "frontend_input": "media_image",
                            "frontend_label": "Base"
                        },
                        {
                            "attribute_id": "thumbnail",
                            "value": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
                            "frontend_input": "media_image",
                            "frontend_label": "Thumbnail"
                        },
                        {
                            "attribute_id": "status",
                            "value": "1",
                            "frontend_input": "select",
                            "frontend_label": "Enable Product"
                        },
                        {
                            "attribute_id": "visibility",
                            "value": "4",
                            "frontend_input": "select",
                            "frontend_label": "Visibility"
                        },
                        {
                            "attribute_id": "url_key",
    
                            "value": "joust-duffle-bag",
                            "frontend_input": "text",
                            "frontend_label": "URL Key"
                        }
                    ]
                }
            },
            {
                "product_id": "PR006",
                "type_id": "simple",
                "self": {
                    "product_id": "PR006",
                    "entity_id": "PR006",
                    "type_id": "simple",
                    "parent": null,
                    "created_at": null,
                    "updated_at": null,
                    "categories": [
                        {
                            "category_id": "abc",
                            "position": 12
                        },
                        {
                            "category_id": "cdf",
                            "position": 3
                        }
                    ],
                    "tier_price": 28000,
                    "available_quantity": 12,
                    "attributes": [
                        {
                            "attribute_id": "name",
                            "value": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
                            "html_type": "input",
                            "data_type": "varchar"
                        },
                        {
                            "attribute_id": "description",
                            "value": "<p>The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel, not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with plenty of room to spare, it's ideal for athletes with places to go.<p>\n<ul>\n<li>Dual top handles.</li>\n<li>Adjustable shoulder strap.</li>\n<li>Full-length zipper.</li>\n<li>L 29\" x W 13\" x H 11\".</li>\n</ul>",
                            "frontend_input": "textarea",
                            "frontend_label": "Description"
                        },
                        {
                            "attribute_id": "price",
                            "value": "34.000000",
                            "frontend_input": "price",
                            "frontend_label": "Price"
                        },
                        {
                            "attribute_id": "images",
                            "value": ["https://i.pinimg.com/originals/82/9b/e0/829be0d8df7b925534164af7ccd74194.jpg", "https://static.rogerebert.com/uploads/review/primary_image/reviews/happy-feet-two-2011/EB20111116REVIEWS111119984AR.jpg", "https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/wb-883316455302-Full-Image_GalleryBackground-en-US-1483994511251._SX1080_.jpg", "https://decider.com/wp-content/uploads/2017/06/happy-feet.jpg?quality=80&strip=all&w=568", "https://cdn.shopify.com/s/files/1/1711/1231/products/Megayouput-5D-diy-diamond-painting-Cross-Stitch-Diamond-Embroidery-mosaic-pattern-Cute-penguin-picture-Cartoon-kids_1024x1024.jpg?v=1571609287"],
                            "frontend_input": "media_image",
                            "frontend_label": "Base"
                        },
                        {
                            "attribute_id": "thumbnail",
                            "value": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
                            "frontend_input": "media_image",
                            "frontend_label": "Thumbnail"
                        },
                        {
                            "attribute_id": "status",
                            "value": "1",
                            "frontend_input": "select",
                            "frontend_label": "Enable Product"
                        },
                        {
                            "attribute_id": "visibility",
                            "value": "4",
                            "frontend_input": "select",
                            "frontend_label": "Visibility"
                        },
                        {
                            "attribute_id": "url_key",
    
                            "value": "joust-duffle-bag",
                            "frontend_input": "text",
                            "frontend_label": "URL Key"
                        }
                    ]
                }
            },
        ]
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

async function getSiteNavigation () {
    try {
        let response = await axios({
            method: "GET",
            url: "/api/category"
        });
        let categories = response.data.categories;
        let structurized = CategoryModel.structurizeCategories(categories, "");
        return structurized;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getHomePageData,
    getCategories,
    searchProduct,
    placeOrder,
    getOrderHistory,
    validateCart,
    accessAnnounce,
    getSiteNavigation
}