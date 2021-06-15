import { useEffect } from "react";
import $ from "jquery";
const windowScroll = [undefined, undefined];

function ScrollRestoration (props) {

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        let newScroll;
        if (windowScroll && windowScroll[0] && props.location.pathname === windowScroll[0].pathname) {
            newScroll = windowScroll[0];
        } else {
            newScroll = {
                pathname: props.location.pathname,
                scrollX: 0,
                scrollY: 0
            }
        };
        windowScroll.shift();
        windowScroll.push(newScroll);
        
        setTimeout(() => {
            window.scrollTo({
                top: newScroll.scrollY,
                behavior: "smooth"
            });
        }, 100)

        // listen to & update scroll on window scroll
        $(window).on("scroll.preserveScroll", () => {
            windowScroll[1] = {
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