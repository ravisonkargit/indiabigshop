
import {
    RECEIVE_CAREERS } from "../constants/ActionTypes";


const initialState = {
    careers:[]
};


const careersReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_CAREERS:
            // h
            return { ...state,
                careers:action.careers
            }
        default:
            return state;
    }
};
export default careersReducer;