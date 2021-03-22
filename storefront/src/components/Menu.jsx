import { useEffect } from "react";
import $ from "../jquery/Jquery";
import "./Menu.css";

function Menu () {

    useEffect(() => {
        function windowHeight () {
            return (window.innerHeight - 65);
        };
        
        function windowWidth () {
            return (window.innerWidth - 65);
        };
    
        function toggleNavbar ($navBar) {
            if ($navBar.hasClass("open")) {
                $navBar.removeClass("open");
                $("body").css("overflow", "");
                $(document).off("click.navbarclose")
            } else {
                $navBar.addClass("open");
                $("body").css("overflow", "hidden");
            }
        }

        $(".nav-bar").draggable({ limitTop: 0, limitBottom: windowHeight, limitLeft: 0, limitRight: windowWidth }, function () {
            return !$(".nav-bar").hasClass("open");
        });
        
        $(document).onClickNonDrag({allowX: 5, allowY: 5}, (e) => {
            let $navBar = $(".nav-bar");
            if($(".nav-bar .menu-icon:hover").length > 0) {
                toggleNavbar($navBar);
            } else {
                let $navbar = $(".nav-bar.open");
                if($navbar.length > 0){
                    toggleNavbar($navbar);
                }
            }
        });
    }, []);

    return (
        <div className="nav-bar">
            <div className="menu-icon">
                <div className="burger"></div>
            </div>
            <div className="menu-wrapper">
                <div className="menu-option">
                    <div className="option-main"></div>
                    <div className="option-filter">
                        <div className="option-filter-item">mot</div>
                        <div className="option-filter-item">hai muoi</div>
                        <div className="option-filter-item">hai muoi ba</div>
                    </div>
                </div>
                <div className="menu-option">
                    <div className="option-main"></div>
                    <div className="option-filter">
                        <div className="option-filter-item">mot</div>
                    </div>
                </div>
                <div className="menu-option">
                    <div className="option-main"></div>
                    <div className="option-filter">
                        <div className="option-filter-item">mot</div>
                        <div className="option-filter-item">hai muoi</div>
                        <div className="option-filter-item">hai muoi ba</div>
                        <div className="option-filter-item">hai muoi</div>
                        <div className="option-filter-item">hai muoi ba</div>
                    </div>
                </div>
                <div className="menu-option">
                    <div className="option-main"></div>
                    <div className="option-filter"></div>
                </div>
                <div className="menu-option">
                    <div className="option-main"></div>
                    <div className="option-filter"></div>
                </div>
                <div className="menu-option">
                    <div className="option-main"></div>
                    <div className="option-filter"></div>
                </div>
                <div className="menu-option">
                    <div className="option-main"></div>
                    <div className="option-filter"></div>
                </div>
            </div>
        </div>
    )
}

export default Menu;