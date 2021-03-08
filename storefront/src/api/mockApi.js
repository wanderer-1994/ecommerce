async function getHomePageData () {
    return {
        bannerImage: "http://127.0.0.1:5500/img/device-selector-banner-1920-width-optimised.jpg",
        categories: [
            {
                category_id: "",
                name: "",
                thumbnail: "",
                feature_products: [1,2,3,4,5,6]
            },
            {
                category_id: "",
                name: "",
                thumbnail: "",
                feature_products: [1,2,3,4,5,6]
            },
            {
                category_id: "",
                name: "",
                thumbnail: "",
                feature_products: [1,2,3,4,5,6]
            },
            {
                category_id: "",
                name: "",
                thumbnail: "",
                feature_products: [1,2,3,4,5,6]
            }
        ],

    }
}

async function getCategoryPageData () {
    return {
        title: "Head Phone",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias id voluptatem explicabo neque vero ratione facilis incidunt earum! Hic numquam magnam totam soluta, enim blanditiis nam ut ipsum a delectus.",
        bannerImage: "https://cdn.shopify.com/s/files/1/1764/3679/files/slide01_bg_2c7a814b-0985-4b4a-9958-8f2e96e20076.jpg?v=1517022095",
        subCategories: [1,2,3,4,5,6, 7, 8]
    }
}

async function searchProduct () {
    return [
        {
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
            tier_price: 23000
        },
        {
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
            tier_price: 23000
        },
        {
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
            tier_price: 23000
        },
        {
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
            tier_price: 23000
        },
        {
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
            tier_price: 23000
        },
        {
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSR33gfVh233lIvfMtixFN1Q8qV3diLbLf_fjfJz0CgUC0A0gKf",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea perferendis consequuntur consectetur, praesentium obcaecati deserunt rerum dignissimos, sed enim velit, eaque nemo sequi sunt earum voluptatum. Necessitatibus neque assumenda deleniti.",
            tier_price: 23000
        }
    ]
}

module.exports = {
    getHomePageData,
    getCategoryPageData,
    searchProduct
}