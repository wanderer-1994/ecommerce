import { useState, useEffect } from "react";
import "./Home.css";
import api from "../api/mockApi";
import categoryModel from "../object_models/CategoryModel";

function Home () {
    const [bannerImage, setBannerImage] = useState("");
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        api.getHomePageData()
            .then(data => {
                data.categories.structured = categoryModel.structurizeCategories(data.categories);
                setBannerImage(data.bannerImage);
                setCategories(data.categories);
            })
            .catch(err => {

            });
    }, []);
    return (
        <div className="home-page">
            <div className="banner">
                <img src={bannerImage} alt=""/>
                <div className="banner-search">
                    <input type="text" placeholder="Look for the thing u like..."/>
                    <span className="svg-bgr">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </span>
                </div>
            </div>
            {renderFeatureMenu(categories)}
            {renderFeatureProduct(categories)}
        </div>
    )
}

function renderFeatureMenu (categories) {
    if (categories && categories.length > 0) {
        return (
            <div className="feature-menu">
                <div className="container">
                    {categories.map((category, index) => {
                        return (
                            <div key={index} className="feature-item">item {index + 1}</div>
                        )
                    })}
                </div>
            </div>
        )
    };
    return null;
}

function renderFeatureProduct (categories) {
    if (!categories) return null;
    let copy = categories.filter(item => item.feature_products && item.feature_products.length > 0);
    if (copy.length > 0) {
        return (
            <div className="feature-product">
                {copy.map((category, cat_index) => {
                    return (
                        <div key={cat_index} className="feature-item">
                            {cat_index % 2 === 0 ? <div className="feature-image"></div> : null}
                            <div className="product-wrapper">
                                {category.feature_products.map((product, prod_index) => {
                                    return (
                                        <div key={prod_index} className="product-item"></div>
                                    )
                                })}
                            </div>
                            {cat_index % 2 === 1 ? <div className="feature-image"></div> : null}
                        </div>
                    )
                })}
            </div>
        )
    };
    return null;
}

export default Home;