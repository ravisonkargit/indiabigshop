import {
    RECEIVE_WHOLESALE_PRODUCT } from "../constants/ActionTypes";


const initialState = {
    product:[]
};


const wholesaleDayReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_WHOLESALE_PRODUCT:
            // h
            return { ...state,
                product:action.product
            }
        default:
            return state;
    }
};
export default wholesaleDayReducer;
