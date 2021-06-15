import { Link } from "react-router-dom";
import utility from "../utils/utility";
import ProductModel from "../object_models/ProductModel";
import "./ProductList.css";

function ProductList ({ products }) {
    if (!products || products.length === 0) return null;
    return (
        <div className="prod-list">
            {products.map((product, index) => {
                let price = ProductModel.getPrice(product);
                let price_text = "...đ";
                if (price.tier_price !== null && price.tier_price !== undefined) {
                    price_text = price.tier_price.toLocaleString().replace(/\./g, ",") + "đ";
                } else if (!utility.isValueEmpty(price.max_price) && !utility.isValueEmpty(price.min_price)) {
                    price_text = `${price.min_price.toLocaleString().replace(/\./g, ",")}đ - ${price.max_price.toLocaleString().replace(/\./g, ",")}đ`
                }
                return (
                    <div key={index} className="prod-box">
                        <div className="prod-thumbnail">
                            {/* product thumbnai is parent-inherited. If neither entity or parent has thumbnail, taken the first gallerry img */}
                            <img src={utility.toPublicUrlWithHost(ProductModel.getThumbnail(product))} alt="" />    
                        </div>
                        <div className="prod-info">
                            <Link className="prod-name"
                                to={ProductModel.generateProductUrl(product)}
                            >{ProductModel.getName(product) || "..."}</Link>
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

export default ProductList;