import { useState, useEffect } from "react";
import api from "../api/mockApi";
import "./Category.css";

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
                    return (
                        <div key={index} className="prod-box">
                            <div className="prod-thumbnail">
                                <img src={product.thumbnail} alt="" />
                            </div>
                            <div className="prod-info">
                                <div className="prod-name">{product.name || "..."}</div>
                                <div className="price">
                                    <span class="old">279,000đ</span>{product.tier_price ? product.tier_price.toLocaleString().replace(/\./g, ",") : "..."}đ
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
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        async function fetchCategory () {
            try {
                let data = await api.getCategoryPageData();
                setCategory(data);
            } catch (err) {

            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        async function fetchProducts () {
            try{
                let data = await api.searchProduct();
                setProducts(data);
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