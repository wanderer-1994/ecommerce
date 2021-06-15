import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/mockApi";
import "./Category.css";
import CategoryModel from "../object_models/CategoryModel";
import appFunction from "../utils/appFunction";
import { connect } from "react-redux";
import constant from "../utils/constant";
import queryString from "query-string";
import ProductList from "../components/ProductList";
import CategoryList from "../components/CategoryList";

function Category (props) {
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        async function fetchProducts (searchConfig) {
            let indentifier = appFunction.addAppLoading();
            try{
                let search = await api.searchProduct(searchConfig);
                if (search.currentPage !== 0 && search.currentPage !== searchConfig.page) {
                    let query = queryString.parse(props.location.search);
                    query.page = search.currentPage;
                    query = queryString.stringify(query);
                    props.history.push(`${props.location.pathname}?${query}`);
                }
                setProducts(search.products);
                appFunction.removeAppLoading(indentifier);
            } catch(err) {
                console.log(err);
                appFunction.removeAppLoading(indentifier);
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

        if (category.entity_id === categoryId) {
            let categoryUrl = CategoryModel.generateCategoryUrl(category);
            let browserUrl = encodeURI(props.location.pathname.replace(/^\//, ""));
            if (browserUrl !== categoryUrl) {
                props.history.replace(categoryUrl);
                console.log(browserUrl)
                console.log(categoryUrl)
            } else {
                // call api product
                let query = queryString.parse(props.location.search);
                let page = query.page ? query.page : 1;
                page = parseInt(page) == page ? page : 1;
                let searchConfig = {
                    page: page,
                    categoryRecursive: 0,
                    // psize: server default psize = 12
                };
                searchConfig.categories = categoryId || undefined;
                fetchProducts(searchConfig);
            }
        }
    }, [props.location.pathname, props.categories]);

    return (
        <div className="category-page">
            <div className="banner-image"
                style={{backgroundImage: `url(${CategoryModel.getCategoryAttributeToHostUrl(category, "banner_image")})`}}
            >
                <div className="cat-title">{category.name}</div>
                <div
                    className="cat-description"
                    dangerouslySetInnerHTML={{__html: CategoryModel.getCategoryAttribute(category, "introduction")}}
                >
                </div>
            </div>
            <CategoryList categories={category.children} />
            <ProductList products={products} />
        </div>
    )
};

function mapStateToProps (state) {
    return {
        categories: state.categories
    }
}

export default connect(mapStateToProps)(Category);