import { useEffect } from "react";
import $ from "jquery";
const windowScroll = [undefined, undefined];

function ScrollRestoration (props) {

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        let previousScroll = windowScroll[windowScroll.length - 2];
        let currentScroll;
        if (previousScroll && props.location.pathname === previousScroll.pathname) {
            windowScroll.pop();
            currentScroll = previousScroll;
        } else {
            currentScroll = {
                pathname: props.location.pathname,
                scrollX: 0,
                scrollY: 0
            };
            windowScroll.push(currentScroll);
        };
        
        setTimeout(() => {
            window.scrollTo({
                top: currentScroll.scrollY,
                left: currentScroll.scrollX,
                behavior: "smooth"
            });
        }, 100)

        // listen to & update scroll on window scroll
        $(window).on("scroll.preserveScroll", () => {
            windowScroll[windowScroll.length - 1] = {
                pathname: props.location.pathname,
                scrollX: window.scrollX,
                scrollY: window.scrollY
            };
        });
        return function () {
            $(window).off("scroll.preserveScroll");
        }
    }, [props.location.pathname])

    return null;
}

export default ScrollRestoration;