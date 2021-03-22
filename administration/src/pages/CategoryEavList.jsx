import { Link } from "react-router-dom";

function CategoryEavList (props) {
    return (
        <div className="category-eav-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/eav/category">New Attribute</Link>
            </div>
        </div>
    )
}

export default CategoryEavList;