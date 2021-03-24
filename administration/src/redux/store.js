import { createStore } from 'redux';

const initState = {
    appLoading: true
};

function reducer (state = initState, action) {
    switch (action.type) {
        case "APP_LOADING":
            return { ...state, appLoading: action.payload };
        case "APP_ALERT":
            return {...state, appAlert: action.payload};
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;