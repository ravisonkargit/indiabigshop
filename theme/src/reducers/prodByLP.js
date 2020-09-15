
import {
    RECEIVE_PRODUCTSBYLP } from "../constants/ActionTypes";


const initialState = {
    productsByLP:[]
};


const prodLPReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_PRODUCTSBYLP:
            return { ...state,
                productsByLP:action.ProductsByLP
            }
        default:
            return state;
    }
};
export default prodLPReducer;
