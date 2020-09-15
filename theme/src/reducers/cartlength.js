
import {
    CART_LENGTH,REMOVE_CART_LENGTH } from "../constants/ActionTypes";


const initialState = {
    cartLength:[]
};


const cartlengthReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_LENGTH:
            // console.log(action,1256);
            return { ...state,
                cartLength:action.cartLength
            }
        case REMOVE_CART_LENGTH:
            return {
                ...state,
                cartLength:''
            }    
        default:
            return state;
    }
};
export default cartlengthReducer;