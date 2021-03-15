import { useState, useEffect } from "react";
import api from "../api/mockApi";
import "./Category.css";
import productModel from "../objectModels/ProductModel";
import categoryModel from "../objectModels/CategoryModel";

function Category () {
    const [category_id, setCategoryId] = useState("charger");
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        async function fetchCategory () {
            try {
                let categories = await api.getCategories();
                let category = categories.find(cat_item => cat_item.entity_id == category_id);
                category.children = categories.filter(cat_item => cat_item.parent === category.entity_id).sort((a, b) => a.position - b.position);
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
                dangerouslySetInnerHTML={{__html: categoryModel.getCategoryAttribute(category, "introduction")}}
            >
            </div>
            <div className="cat-image">
                <img src={categoryModel.getCategoryAttribute(category, "banner_image")} alt="" />
            </div>
            {renderSubCategories(category)}
            {renderProducts(products)}
        </div>
    )
};

function renderSubCategories (category) {
    if (!category || !category.children || !category.children.length > 0) return null;
    return (
        <div className="sub-categories">
            <div className="slider-inner" style={{minWidth: `${category.children.length*200}px`}}>
                {category.children.map((item, index) => {
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

export default Category;