import store from "../redux/store";
import $ from "jquery";
import transitions from "@material-ui/core/styles/transitions";

const get_animationPath = (target) => {
    let target_pos = target.getBoundingClientRect();
    let cart_pos = document.getElementsByClassName("UserCart")[0].getBoundingClientRect();
    let departure = {
        top: target_pos.top + target_pos.height/2,
        left: target_pos.left + target_pos.width/2
    }
    let arrival = {
        top: cart_pos.top + cart_pos.height/2,
        left: cart_pos.left + cart_pos.width/2
    };
    let animationPath = {
        departure: departure,
        arrival: arrival
    }
    return animationPath;
}

const flyToCartEffect = (animationPath, img_url) => {
    return new Promise(async (resolve, reject) => {
        try{
            let animation_img =
            $('<div>', {
                className: "addToCartAnimation",
                html: $('<img>', {
                     src: img_url,
                })
            });
            animation_img.css({
                "position": "fixed",
                "top": `${animationPath.departure.top}px`,
                "left": `${animationPath.departure.left}px`,
                "width": "80px",
                "height": "70px",
                "border-radius": "5px",
                "background-color": "white",
                "border": "1px solid gray",
                "padding": "3px",
                "z-index": "1000",
                "opacity": "1"
            });
            animation_img.find("img").css({
                "max-width": "99%",
                "max-height": "99%",
                "display": "block",
                "margin": "auto"
            })
            $("body").append(animation_img);
            // run the animation
            let animation_frames = 150;
            let top_travel_per_frame = (animationPath.arrival.top - animationPath.departure.top)/animation_frames;
            let left_travel_per_frame = (animationPath.arrival.left - animationPath.departure.left)/animation_frames;
            let opacity_travel_per_frame = -0.2/animation_frames;
            let top = animationPath.departure.top;
            let left = animationPath.departure.left;
            let opacity = 1;
            let countFrame = 0;
            let animation_run = setInterval(() => {
                opacity = opacity;
                top = top + top_travel_per_frame;
                left = left + left_travel_per_frame;
                animation_img.css({
                    "opacity": `${opacity}`,
                    "top": `${top}px`,
                    "left": `${left}px`
                });
                countFrame += 1;
                if(countFrame >= animation_frames){
                    animation_img.remove();
                    clearInterval(animation_run);
                    resolve();
                }
            }, 1)
        }catch(err){
            resolve();
        }
    })
}

const saveCartToLocalStorage = (cart) => {
    let cart_string = JSON.stringify(cart);
    localStorage.setItem("cart", cart_string);
}

const addToCart = async (target, img_url, order_item) => {
    let animationPath = get_animationPath(target);
    await flyToCartEffect(animationPath, img_url);

    let cur_cart = store.getState().cart || [];
    let order_duplicate = cur_cart.find(item => {return item.prod_id == order_item.prod_id});
    if(order_duplicate){
        order_duplicate.order_qty += order_item.order_qty;
        if(order_duplicate.note && order_duplicate.note != ""){
            order_duplicate.note += `- ${order_item.note || ""}`;
        }else{
            order_duplicate.note = order_item.note;
        }
    }else{
        cur_cart.unshift(order_item);
    }
    store.dispatch({type: "UPDATE_CART", payload: cur_cart});
    saveCartToLocalStorage(cur_cart);
}

const orderQtyChange = async (target, prod_thumb, prod_id, new_order_qty, new_order_note) => {
    let cur_cart = JSON.parse(JSON.stringify(store.getState().cart || []));
    let matchOrder = cur_cart.find(item => {return item.prod_id == prod_id});
    if(!matchOrder){
        return;
    }else{
        matchOrder.order_qty = parseInt(new_order_qty);
        matchOrder.note = new_order_note;
        if(matchOrder.order_qty < 1) {
            cur_cart.splice(cur_cart.indexOf(matchOrder), 1);
        }
    }
    store.dispatch({type: "UPDATE_CART", payload: cur_cart});
    saveCartToLocalStorage(cur_cart);
}

const emptyCart = async () => {
    store.dispatch({type: "UPDATE_CART", payload: []});
    saveCartToLocalStorage([]);
}

const appLoading = isLoading => {
    store.dispatch({type: "UPDATE_APPLOADING", payload: isLoading});
}

const open_appAlert = options => {
    if(options != null){
        $("body").css("overflow", "hidden");
    }else{
        $("body").css("overflow", "auto");
    }
    store.dispatch({type: "UPDATE_APP_ALERT", payload: options});
}

export {
    addToCart,
    orderQtyChange,
    emptyCart,
    open_appAlert,
    appLoading
}