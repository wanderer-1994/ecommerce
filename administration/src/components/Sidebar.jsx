import { Link } from "react-router-dom";
import routes from "../routes";
import "./Sidebar.css";
import ArrowRight from "@material-ui/icons/ArrowRight";
import $ from "jquery";

function Sidebar () {
    return (
        <div className="side-bar open" style={{'--width': "230px"}}>
            <div>
                <div className="switch-icon" onClick={(event) => toggleSidebar(event)}><ArrowRight /></div>
            </div>
            <div className="wrapper">
                {routes.map((item, index) => <Link key={index} to={item.path}>{item.ref_name}</Link>)}
            </div>
        </div>
    )
}

function toggleSidebar (event) {
    if ($(event.target).parents(".side-bar").hasClass("close")) {
        $(event.target).parents(".side-bar").removeClass("close");
        $(event.target).parents(".side-bar").css("--width", "");
        $(event.target).parents(".side-bar").next(".main").css("--width", "");
    } else {
        $(event.target).parents(".side-bar").addClass("close");
        $(event.target).parents(".side-bar").css("--width", "30px");
        $(event.target).parents(".side-bar").next(".main").css("--width", "30px");
    }
}

export default Sidebar;