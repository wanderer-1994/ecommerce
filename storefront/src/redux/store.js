import { createStore } from "redux";

function get_storageCart () {
    try{
        let cart = localStorage.getItem("cart");
        if(!cart){
            cart = [];
        }else{
            cart = JSON.parse(cart);
        }
        return cart;
    }catch(err){
        localStorage.setItem("cart", JSON.stringify([]));
        return [];
    }
}

const initialState = {
    cart: get_storageCart(),
    appLoading: true,
    appAlert: 1
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case "INITIAL_APP_DATA":
            return {...state, ...action.payload};
        case "UPDATE_PRODUCTS":
            return {...state, products: action.payload};
        case "UPDATE_APPLOADING":
            return {...state, appLoading: action.payload};
        case "UPDATE_APP_ALERT":
            return {...state, appAlert: action.payload};
        case "UPDATE_CART":
            return {...state, cart: action.payload};
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;