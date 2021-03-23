import { Link } from "react-router-dom";
import routes from "../routes";
import "./Sidebar.css";
import ArrowRight from "@material-ui/icons/ArrowRight";
import $ from "jquery";

function Sidebar (props) {
    return (
        <div className="side-bar open">
            <div>
                <div className="switch-icon" onClick={(event) => toggleSidebar(event)}><ArrowRight /></div>
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

function toggleSidebar (event) {
    if ($(event.target).parents(".side-bar").hasClass("close")) {
        $(event.target).parents(".side-bar").removeClass("close");
        $(event.target).parents("body").css("--width", "");
    } else {
        $(event.target).parents(".side-bar").addClass("close");
        $(event.target).parents("body").css("--width", "30px");
    }
}

export default Sidebar;