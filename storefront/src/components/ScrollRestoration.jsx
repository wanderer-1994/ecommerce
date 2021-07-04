import { useEffect } from "react";
import $ from "jquery";
window.ScrollControl = window.ScrollControl || [];

function ScrollRestoration (props) {

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        let pageScroll = window.ScrollControl.find(item => item.pathname === props.location.pathname);
        if (!pageScroll) {
            pageScroll = {
                pathname: props.location.pathname,
                scrollX: 0,
                scrollY: 0
            };
            window.ScrollControl.push(pageScroll);
        }
        
        setTimeout(() => {
            window.scrollTo({
                top: pageScroll.scrollY,
                left: pageScroll.scrollX,
                behavior: "smooth"
            });
        }, 100)

        // listen to & update scroll on window scroll
        let setScrollTimeout; // an unknown auto scroll by window occurs right at location.pathname change. Timeout to ignore this scroll.
        $(window).on("scroll.preserveScroll", () => {
            setScrollTimeout = setTimeout(() => {
               pageScroll.scrollX = window.scrollX;
               pageScroll.scrollY = window.scrollY;
            }, 200);
        });
        return function () {
            $(window).off("scroll.preserveScroll");
            if (setScrollTimeout) clearInterval(setScrollTimeout);
        }
    }, [props.location.pathname])

    return null;
}

export default ScrollRestoration;