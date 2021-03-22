import { Link } from "react-router-dom";

function OrderList (props) {
    return (
        <div className="order-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/order">Create Order</Link>
            </div>
        </div>
    )
}

export default OrderList;