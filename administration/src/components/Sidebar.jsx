import { Link } from "react-router-dom";
import routes from "../routes";
import "./Sidebar.css";
import ArrowRight from "@material-ui/icons/ArrowRight";
import $ from "jquery";
import { useEffect } from "react";

function Sidebar (props) {
    useEffect(() => {
        // get localstorage side-bar status
        let status = localStorage.getItem("sidebarStatus");
        status = (parseInt(status) === 0) ? false : true;
        toggleSidebar(status);

        // open/close sidebar on mouse hover
        $(".side-bar .wrapper").on("mouseover", function () {
            toggleSidebarHover(true);
        });
        $(".side-bar .wrapper").on("mouseleave", function () {
            toggleSidebarHover(false);
        });
        return () => {
            $(".side-bar .wrapper").off("mouseover");
            $(".side-bar .wrapper").off("mouseleave");
        }
    }, []);
    return (
        <div className="side-bar">
            <div>
                <div className="switch-icon" onClick={toggleSidebar}><ArrowRight /></div>
            </div>
            <div className="wrapper">
                <Link className="logo" to="/"></Link>
                {
                    routes
                    .filter(item => item.showOnSidebar)
                    .map((item, index) =>
                        <Link
                            key={index}
                            to={item.path}
                            className={`navitem ${props.location.pathname === item.path ? "active" : ""}`}
                        >{item.ref_name}</Link>)
                }
            </div>
        </div>
    )
}

function toggleSidebar (isOpen) {
    if (isOpen !== true && isOpen !== false) {
        isOpen = $(".side-bar").hasClass("close");
    }
    if (isOpen) {
        $(".side-bar").removeClass("close");
        $("body").css("--width", $("body").css("--oriWidth"));
        localStorage.removeItem("sidebarStatus");
    } else {
        $(".side-bar").addClass("close");
        $("body").css("--width", "");
        localStorage.setItem("sidebarStatus", 0);
    };
}

function toggleSidebarHover (isOpen) {
    if (isOpen) {
        $("#root .side-bar").addClass("open-hover");
        $("#root").css("--width", $("body").css("--oriWidth"));
    } else {
        $("#root .side-bar").removeClass("open-hover");
        $("#root").css("--width", "");
    }
}

export default Sidebar;