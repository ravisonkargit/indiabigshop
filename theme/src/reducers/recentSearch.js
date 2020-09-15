import {
    RECEIVE_RECENT_PRODUCTS } from "../constants/ActionTypes";


const initialState = {
    product:[]
};


const recentSearchReducer = (state = initialState, action) => {
    //console.log('RECEIVE_RECENT_PRODUCTS: ',action)
    switch (action.type) {
        case RECEIVE_RECENT_PRODUCTS:
            // h
            return { ...state,
                product:action.product
            }
        default:
            return state;
    }
};
export default recentSearchReducer;
