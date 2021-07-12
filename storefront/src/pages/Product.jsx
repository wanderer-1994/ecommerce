import "./Product.css";
import { useEffect, useState, Fragment } from "react";
import api from "../api/mockApi";
import appFunction from "../utils/appFunction";
import constant from "../utils/constant";
import ProductModel from "../object_models/ProductModel";
import utility from "../utils/utility";
import { Carousel } from "antd";
import $ from "jquery";
import { connect } from "react-redux";
import queryString from "query-string";
window.ScrollControl = window.ScrollControl || [];

function Product (props) {

    const [product, setProduct] = useState({});
    const [selectedEntity, setSelectedEntity] = useState(undefined);
    const [selectedSwatch, setSelectedSwatch] = useState({});
    const [entity_id, setEntityId] = useState("");
    const [carouselAuto, setCarouselAuto] = useState(true);
    const [primaryCategory, setPrimaryCategory] = useState({});
    const [swatchModel, setSwatchModel] = useState([]);

    useEffect(() => {
        async function fetchProductData () {
            try {
                let indentifier = appFunction.addAppLoading();
                let productId;
                if (props.location.pathname.indexOf(constant.URL_PROD_SPLITER) !== -1) {
                    productId = props.location.pathname.split(constant.URL_PROD_SPLITER).reverse()[0];
                };
                let search = await api.searchProduct({entity_ids: productId || undefined});
                let apiProduct = search.products[0] || {};
                setProduct(apiProduct);
                if (apiProduct.type_id === "simple" && apiProduct.self) {
                    setSelectedEntity(apiProduct.self);
                };
                appFunction.removeAppLoading(indentifier);
                let productEntity = ProductModel.getEntity(apiProduct, productId);
                if (productEntity && productEntity.entity_id === productId) {
                    let productUrl = ProductModel.generateProductUrl(apiProduct, productId);
                    let browserUrl = encodeURI(props.location.pathname.replace(/^\//, ""));
                    // redirect when url not match
                    if (browserUrl !== productUrl) {
                        props.history.replace(productUrl);
                    };
                    setEntityId(productId);
                    if (props.location.hash) { // auto scroll to selected product when url contains #product-variant-id
                        let $selectedVariantImg = $(props.location.hash);
                        if ($selectedVariantImg && $selectedVariantImg[0] && typeof ($selectedVariantImg[0] === "function")) {
                            let appScroll = window.ScrollControl.find(item => item.pathname === props.location.pathname);
                            if (!appScroll || (appScroll.scrollX === 0 && appScroll.scrollY === 0)) { // Prevent conflict with app scroll restoration
                                setTimeout(() => {
                                    $selectedVariantImg[0].scrollIntoView({behavior: "smooth"});
                                }, 100);
                            }
                        }
                    }
                };
                // set carousel not auto when specified entity & entity has gallery image
                if (productEntity !== apiProduct.parent && productEntity !== apiProduct.self) {
                    let gallery = ProductModel.getGallery(apiProduct);
                    let isHasGalleryImg = gallery.some(item => {
                        return item.entity_id === productId;
                    })
                    setCarouselAuto(!isHasGalleryImg)
                } else {
                    setCarouselAuto(true);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchProductData();
        // set selected swatch
        let query = queryString.parse(props.location.search);
        Object.keys(query).forEach(key => {
            if (key.indexOf("v_") === 0 && key.length > 2 && !utility.isValueEmpty(query[key])) {
                let attribute_id = key.replace(/^v_/, "");
                selectedSwatch[attribute_id] = query[key];
            }
        });
        setSelectedSwatch({...selectedSwatch});
    }, [props.location.pathname]);

    useEffect(() => {
        let primaryCategory = ProductModel.getPrimaryCategory(product, props.categories);
        setPrimaryCategory(primaryCategory);
        if (primaryCategory) {
            let swatchModel = ProductModel.getProductSwatch(product, primaryCategory);
            setSwatchModel(swatchModel);
        }
    }, [props.categories, product]);

    function handleSelectSwatch (attribute_id, value) {
        if (selectedSwatch[attribute_id] === value) {
            delete selectedSwatch[attribute_id];
        } else {
            selectedSwatch[attribute_id] = value;
        };
        setSelectedSwatch({...selectedSwatch});
    }

    let gallery = ProductModel.getGallery(product);
    let carouselPos = 0;
    let currentEntityId; // control #id of image gallery
    let currentEntityIndex = 0;
    if (carouselAuto === false) {
        for (let i = 0; i < gallery.length; i++) {
            if (gallery[i].entity_id === entity_id) {
                carouselPos = i;
                break;
            }
        };
    };

    return (
        <div className="product-page">
            <div className="prod-main-content">
                <div className="text-content">
                    <div className="wrap-box">
                        <div className="name">{ProductModel.getName(product, entity_id)}</div>
                        {swatchModel.length > 0 ? (
                            <div className="variation">
                                <table>
                                    <tbody>
                                        {swatchModel.map((swatchItem, index) => {
                                            return (
                                                <tr key={index} className="swatch-attribute">
                                                    <td className="swatch-name">{swatchItem.displayName || swatchItem.attribute_id}</td>
                                                    <td className="swatch-value">
                                                        {swatchItem.values.map((swatchValue, idx) => {
                                                            let isSelected = selectedSwatch[swatchItem.attribute_id] === swatchValue.value;
                                                            return (
                                                                <span key={idx}
                                                                    className={`swatch-value-item${swatchValue.available_quantity > 0 ? "" : " unavailable"}${isSelected ? " selected" : ""}`}
                                                                    onClick={() => handleSelectSwatch(swatchItem.attribute_id, swatchValue.value)}
                                                                >{swatchValue.value}</span>
                                                            )
                                                        })}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                        <a href={`${props.location.pathname}#${gallery[5] ? gallery[5].entity_id : ""}`}>test</a><br/>
                        <a href={`${props.location.pathname}#${gallery[5] ? gallery[5].entity_id : ""}`}>abc</a>
                    </div>
                </div>
                <div className="gallery">
                    <div className="mobile-carousel">
                        <Carousel autoplay={carouselAuto} draggable={true} swipe={true}
                            ref={slider => {
                                if (slider) {
                                    window.slider = slider;
                                    setTimeout(() => {
                                        if (carouselPos > 0) {
                                            window.slider.goTo(carouselPos);
                                        }
                                    }, 100)
                                }
                            }}
                        >
                            {gallery.map((img, index) => {
                                return (
                                    <div key={index}>
                                        <div className="carousel-item"
                                            style={{backgroundImage: `url(${utility.toPublicUrlWithHost(img.imgUrl)})`}}
                                        ></div>
                                    </div>
                                )
                            })}
                        </Carousel>
                    </div>
                    <div className="desktop-gallery">
                        {gallery.length === 1 ? 
                        (
                            <div id={`#${gallery[0].entity_id}`} className="gallery-unique">
                                <img src={utility.toPublicUrlWithHost(gallery[0].imgUrl)} alt="" />
                            </div>
                        ) : gallery.map((img, index) => {
                            if (img.entity_id !== currentEntityId) {
                                currentEntityId = img.entity_id;
                                currentEntityIndex = 0;
                            } else {
                                currentEntityIndex += 1;
                            };
                            let isSelected = props.location.hash.replace(/^#/, "") === currentEntityId ? true : false;
                            return (
                                <div key={index} 
                                    id={`${currentEntityId}${currentEntityIndex === 0 ? "" : `_${currentEntityIndex}`}`}
                                    className={`gallery-item${isSelected ? " selected" : ""}`}
                                >
                                    <img src={utility.toPublicUrlWithHost(img.imgUrl)} alt="" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div id="abc" className="related">
                    hehe
            </div>
        </div>
    )
}

function mapStateToProps (state) {
    return {
        categories: state.categories
    }
}

export default connect(mapStateToProps)(Product);