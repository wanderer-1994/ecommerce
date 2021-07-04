import { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import utility from "../utils/utility";
import ProductModel from "../object_models/ProductModel";
import "./ProductList.css";

function ProductList (props) {
    let { products, category } = props;
    if (!products || products.length === 0) return null;
    return (
        <div className="prod-list">
            {products.map((product, index) => {
                // price
                let price = ProductModel.getPrice(product);
                let price_text = "...đ";
                if (price.tier_price !== null && price.tier_price !== undefined) {
                    price_text = price.tier_price.toLocaleString().replace(/\./g, ",") + "đ";
                } else if (!utility.isValueEmpty(price.max_price) && !utility.isValueEmpty(price.min_price)) {
                    price_text = `${price.min_price.toLocaleString().replace(/\./g, ",")}đ - ${price.max_price.toLocaleString().replace(/\./g, ",")}đ`
                };
                let productUrl = ProductModel.generateProductUrl(product);
                let productSwatch = ProductModel.getProductSwatch(product, category);
                return (
                    <div key={index} className="prod-box">
                        <div className="prod-thumbnail">
                            <Link
                                to={productUrl}
                            >
                                {/* product thumbnai is parent-inherited. If neither entity or parent has thumbnail, taken the first gallery img */}
                                <img src={utility.toPublicUrlWithHost(ProductModel.getThumbnail(product))} alt="" />    
                            </Link>
                        </div>
                        <div className="prod-info">
                            <Link className="prod-name"
                                to={productUrl}
                            >{ProductModel.getName(product) || "..."}</Link>
                            {productSwatch.length > 0 ? (
                                <div className="prod-swatch">
                                    {productSwatch.map((swatch, index) => {
                                        return (
                                            <Fragment key={index}>
                                                {swatch.values && swatch.values.length > 0 ? (
                                                    <div className="swatch-attribute">
                                                        {swatch.values.map((valueItem, idx) => {
                                                            let entity_id = valueItem.entities && valueItem.entities[0] ? valueItem.entities[0].entity_id : null;
                                                            let entityUrl = ProductModel.generateProductUrl(product, entity_id);
                                                            return (
                                                                <Link key={idx}
                                                                    className={`swatch-value ${valueItem.available_quantity > 0 ? "available" : "unavailable"}`}
                                                                    to={entityUrl}
                                                                >{valueItem.value}</Link>
                                                            )
                                                        })}
                                                    </div>
                                                ) : null}
                                            </Fragment>
                                        )
                                    })}
                                </div>
                            ) : null}
                            <div className="price">
                                <span className="old">279,000đ</span>{price_text}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function mapStateToProps (state) {
    return {
        categories: state.categories
    }
}

export default connect(mapStateToProps)(ProductList);