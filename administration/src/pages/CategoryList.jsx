import { Link } from "react-router-dom";

function CategoryList (props) {
    return (
        <div className="category-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/category">New Category</Link>
            </div>
            <div className="content">
                
            </div>
        </div>
    )
}

export default CategoryList;