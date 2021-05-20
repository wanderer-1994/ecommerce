import { createStore } from 'redux';

const initState = {
    appLoading: true,
    appAlert: false,
    fileBrowserInstances: []
};

function reducer (state = initState, action) {
    switch (action.type) {
        case "APP_LOADING":
            return { ...state, appLoading: action.payload };
        case "APP_ALERT":
            return {...state, appAlert: action.payload};
        case "FILE_BROWSER_INSTANCE":
            return {...state, fileBrowserInstances: action.payload};
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;