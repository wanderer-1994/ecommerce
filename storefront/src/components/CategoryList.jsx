import { Link } from "react-router-dom";
import CategoryModel from "../object_models/CategoryModel";
import "./CategoryList.css";

function CategoryList ({ categories }) {
    if (!categories || categories.length === 0) return null;
    return (
        <div className="category-list">
            <div className="slider-inner" style={{minWidth: `${categories.length*200}px`}}>
                {categories.map((categoryItem, index) => {
                    return (
                        <Link key={index} className="item" to={CategoryModel.generateCategoryUrl(categoryItem)}
                            style={{backgroundImage: `url(${CategoryModel.getCategoryAttributeToHostUrl(categoryItem, "thumbnail")})`}}
                        >
                            <span className="name">{categoryItem.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default CategoryList;