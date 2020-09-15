import {
    RECEIVE_RECOMMENDED_PRODUCT } from "../constants/ActionTypes";

const initialState = {
    product:[]
};


const recommendedProductReducer = (state = initialState, action) => {
   // console.log('RECEIVE_RECOMMENDED_PRODUCT: ',action)
    switch (action.type) {
        case RECEIVE_RECOMMENDED_PRODUCT:
            // h
            return { ...state,
                product:action.product
            }
        default:
            return state;
    }
};
export default recommendedProductReducer;
