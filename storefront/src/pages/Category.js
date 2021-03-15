import { useState, useEffect } from "react";
import api from "../api/mockApi";
import "./Category.css";
import productModel from "../objectModels/ProductModel";

function renderSubCategories (category) {
    if (!category || !category.subCategories || !category.subCategories.length > 0) return null;
    return (
        <div className="sub-categories">
            <div className="slider-inner" style={{minWidth: `${category.subCategories.length*200}px`}}>
                {category.subCategories.map((item, index) => {
                    return (
                        <div key={index} className="item"></div>
                    )
                })}
            </div>
        </div>
    )
}

function renderProducts (products) {
    if (products && products.length > 0) {
        return (
            <div className="prod-list">
                {products.map((product, index) => {
                    let tier_price = productModel.getTierPrice(product);
                    let tier_price_text = "...đ";
                    if (tier_price.price !== null && tier_price.price !== undefined) {
                        tier_price_text = tier_price.price.toLocaleString().replace(/\./g, ",") + "đ";
                    } else if (
                        tier_price.max_price !== null &&
                        tier_price.max_price !== undefined &&
                        tier_price.min_price !== null &&
                        tier_price.min_price !== undefined
                    ) {
                        tier_price_text = `${tier_price.min_price.toLocaleString().replace(/\./g, ",")}đ - ${tier_price.max_price.toLocaleString().replace(/\./g, ",")}đ`
                    }
                    return (
                        <div key={index} className="prod-box">
                            <div className="prod-thumbnail">
                                <img src={productModel.getThumbnail(product)} alt="" />
                            </div>
                            <div className="prod-info">
                                <div className="prod-name">{productModel.getName(product) || "..."}</div>
                                <div className="price">
                                    <span className="old">279,000đ</span>{tier_price_text}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return null
    }
}

function Category () {
    const [category_id, setCategoryId] = useState("charger");
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        async function fetchCategory () {
            try {
                let data = await api.getCategories();
                let category = data.categories.find(cat_item => cat_item.entity_id == category_id);
                setCategory(category);
            } catch (err) {

            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        async function fetchProducts () {
            try{
                let search = await api.searchProduct();
                setProducts(search.products);
            } catch(err) {

            }
        }
        fetchProducts();
    }, [])

    return (
        <div className="category-page">
            <div className="cat-title">{category.title}</div>
            <div
                className="cat-description"
                dangerouslySetInnerHTML={{__html: category.description}}
            >
            </div>
            <div className="cat-image">
                <img src={category.bannerImage} alt="" />
            </div>
            {renderSubCategories(category)}
            {renderProducts(products)}
        </div>
    )
}

export default Category;