
import {
    RECEIVE_STORE, RECEIVE_SELLER_PRODUCTS } from "../constants/ActionTypes";


const initialState = {
    data: [],
    products:[]
};


const storeFrontReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_STORE:
            return { ...state,
                data:action.store
            }
        case RECEIVE_SELLER_PRODUCTS: 
            return {...state,
                products:action.products
            }
        default:
            return state;
    }
};
export default storeFrontReducer;