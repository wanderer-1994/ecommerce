import { Link } from "react-router-dom";

function ProductList (props) {
    return (
        <div className="product-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/product">New Product</Link>
            </div>
        </div>
    )
}

export default ProductList;