import { useState, useEffect } from "react";
import api from "../api/mockApi";
import "./Category.css";
import productModel from "../object_models/ProductModel";
import categoryModel from "../object_models/CategoryModel";
import appFunction from "../utils/appFunction";
import { connect } from "react-redux";
import constant from "../utils/constant";
import queryString from "query-string";

function Category (props) {
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        async function fetchProducts (searchConfig) {
            try{
                let search = await api.searchProduct(searchConfig);
                if (search.currentPage !== 0 && search.currentPage !== searchConfig.page) {
                    let query = queryString.parse(props.location.search);
                    query.page = search.currentPage;
                    query = queryString.stringify(query);
                    props.history.push(`${props.location.pathname}?${query}`);
                }
                setProducts(search.products);
            } catch(err) {
                console.log(err);
            }
        }

        let categoryId;
        if (props.location.pathname.indexOf(constant.URL_CAT_SPLITER) !== -1) {
            categoryId = props.location.pathname.split(constant.URL_CAT_SPLITER).reverse()[0];
        }
        let categories = props.categories ? JSON.parse(JSON.stringify(props.categories)) : [];
        let category = categories.find(cat_item => cat_item.entity_id == categoryId) || {};
        category.children = categories.filter(cat_item => cat_item.parent === category.entity_id).sort((a, b) => a.position - b.position);
        setCategory(category);

        // call api product
        let query = queryString.parse(props.location.search);
        let page = query.page ? query.page : 1;
        page = parseInt(page) == page ? page : 1;
        let searchConfig = {
            page: page,
            psize: constant.PAGE_SIZE
        };
        searchConfig.categories = categoryId || undefined;
        fetchProducts(searchConfig);
    }, [props.location.pathname]);

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

function mapStateToProps (state) {
    return {
        categories: state.categories
    }
}

export default connect(mapStateToProps)(Category);