import store from "../redux/store";

function addAppLoading () {
    let identifier = new Object();
    let current = store.getState().appLoading;
    current.push(identifier);
    store.dispatch({
        type: "UPDATE_APPLOADING",
        payload: [...current]
    });
    return identifier;
}

function removeAppLoading (identifier) {
    let current = store.getState().appLoading;
    current = current.filter(item => item !== identifier);
    store.dispatch({
        type: "UPDATE_APPLOADING",
        payload: [...current]
    });
}

function appAlert (alert) {
    store.dispatch({
        type: "UPDATE_APP_ALERT",
        payload: alert
    })
};

export default {
    addAppLoading,
    removeAppLoading,
    appAlert
}