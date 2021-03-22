import { Link } from "react-router-dom";

function ProductEavList (props) {
    return (
        <div className="product-eav-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/eav/product">New Attribute</Link>
            </div>
        </div>
    )
}

export default ProductEavList;