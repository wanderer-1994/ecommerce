import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import api from "../api/mockApi";
import CategoryModel from "../objectModels/CategoryModel";
import utility from "../utils/utility";

function CategoryItemRecursive ({ level, category }) {
    let image_url = CategoryModel.getCategoryAttribute(category, "thumbnail");
    if (image_url) {
        image_url = utility.toPublicUrlWithHost(image_url);
    }
    return (
        <span className={`nav-item item-level-${level}`}>
            <Link to={`/${encodeURIComponent(category.name)}-cat.${category.entity_id}`}>
                <span>{category.name}</span>
                {level === 1 ? <div className="underline"></div> : null}
            </Link>
            {category.children && category.children.length > 0 ? (
                <div className="child-container">
                    {category.children.map((child, index) => {
                        return (
                            <CategoryItemRecursive key={index} level={level + 1} category={child} />
                        )
                    })}
                    <div className="thumb-image" style={{
                        backgroundImage: `url(${image_url || ""})`
                    }}></div>
                </div>
            ) : null}
        </span>
    )
}

function Navbar (props) {

    const [navigation, setNavigation] = useState([]);

    useEffect(() => {
        api.getSiteNavigation()
        .then(categories => {
            console.log(categories);
            setNavigation(categories);
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div className="nav-bar-horizontal">
            <div className="nav-wrapper">
                {navigation.map((category, index) => {
                    return (
                        <CategoryItemRecursive key={index} level={1} category={category} />
                    )
                })}
            </div>
        </div>
    )
}

export default Navbar;