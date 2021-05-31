import store from "../redux/store";

function appLoading (appLoading) {
    store.dispatch({
        type: "APP_LOADING",
        payload: appLoading
    })
}

function appAlert (alert) {
    store.dispatch({
        type: "APP_ALERT",
        payload: alert
    })
};

export {
    appLoading,
    appAlert
}