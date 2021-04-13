
import {
    SINGLE_PRODUCT, CLEAR_SINGLE_PRODUCT } from "../constants/ActionTypes";


const initialState = {
    product:[]
};


const singleProdReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case SINGLE_PRODUCT:
            return { ...state,
                product:action.productId
            }
        case CLEAR_SINGLE_PRODUCT:
            return { ...state,
                product:''
            }
        default:
            return state;
    }
};
export default singleProdReducer;