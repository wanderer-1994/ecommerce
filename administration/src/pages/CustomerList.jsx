import { Link } from "react-router-dom";

function CustomerList (props) {
    return (
        <div className="customer-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/customer">New Customer</Link>
            </div>
        </div>
    )
}

export default CustomerList;