import { createStore } from 'redux';

const initState = {
    appLoading: true
};

function reducer (state = initState, action) {
    switch (action.type) {
        case "APPLOADING":
            return { ...state, appLoading: action.payload };
        case "B":
            return state;
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;