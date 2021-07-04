import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryModel from "../object_models/CategoryModel";
import utility from "../utils/utility";
import $ from "jquery";
import { connect } from "react-redux";

function CategoryItemRecursive (props) {
    const { level, category } = {...props}
    let image_url = CategoryModel.getCategoryAttribute(category, "thumbnail");
    if (image_url) {
        image_url = utility.toPublicUrlWithHost(image_url);
    }
    let splited_children = utility.splitArray(category.children || [], 4);
    return (
        <span className={`nav-item item-level-${level}`}>
            <Link to={CategoryModel.generateCategoryUrl(category)}
                {...props}
            >
                <span>{category.name}</span>
                {level === 1 ? <div className="underline"></div> : null}
            </Link>
            {splited_children && splited_children.length > 0 ? (
                <div className="child-container">
                    {splited_children.map((spl_arr, arr_idx) => {
                        return (
                            <div className="nav-item-spliter" key={arr_idx}>
                                {spl_arr.map((child_cat, cat_idx) => {
                                    return (
                                        <CategoryItemRecursive key={cat_idx} level={level + 1} category={child_cat}
                                            onMouseEnter={(event) => {
                                                let child_image_url = CategoryModel.getCategoryAttribute(child_cat, "thumbnail");
                                                if (child_image_url) {
                                                    child_image_url = utility.toPublicUrlWithHost(child_image_url);
                                                    $(event.target).parents(".child-container").children(".thumb-image").css("background-image", `url(${child_image_url})`);
                                                }
                                            }}
                                            onMouseLeave={(event) => {
                                                $(event.target).parents(".child-container").children(".thumb-image").css("background-image", `url(${image_url || ""})`);
                                            }}
                                        />
                                    )
                                })}
                            </div>
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
        setNavigation(props.navigation || []);
    }, [props.navigation]);

    useEffect(() => {
        const navbarHeight = parseInt($(".navbar-horizontal").css("height"));
        const thresoldScrollPosition = navbarHeight; // 100px scroll to start navbar slide
        const timeoutThresold = 150; // 150ms delay to trigger navbar slide
        let scrollTimeoutKeeper;
        let initialScroll = window.scrollY;
        $(window).on("scroll.navbarslide", () => {
            let scrollDirection = window.scrollY >= initialScroll ? "DOWN" : "UP";
            initialScroll = window.scrollY;
            if (scrollTimeoutKeeper) {
                clearInterval(scrollTimeoutKeeper);
            };
            if (scrollDirection === "UP" && window.scrollY > thresoldScrollPosition) {
                scrollTimeoutKeeper = setTimeout(() => {
                    $(".navbar-horizontal").css({"top": `${-navbarHeight}px`});
                    setTimeout(() => {
                        $(".navbar-horizontal").addClass("slide-down");
                        $(".navbar-horizontal").css({"top": "0px"});
                    }, 0);
                }, timeoutThresold);
            };
            if (window.scrollY === 0 || scrollDirection === "DOWN") {
                $(".navbar-horizontal").removeClass("slide-down");
                $(".navbar-horizontal").css({"top": ""});
            }
        });
        return function () {
            $(window).off("scroll.navbarslide");
        }
    }, []);

    return (
        <div className="navbar-horizontal">
            <Link className="navbar-logo" to="/">GO!</Link>
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

function mapStateToProps (state) {
    return {
        navigation: state.structurizedCategories
    }
}

export default connect(mapStateToProps)(Navbar);