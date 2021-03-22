import { createStore } from 'redux';

const initState = {

};

function reducer (state = initState, action) {
    switch (action.type) {
        case "A":
            return state;
        case "B":
            return state;
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;