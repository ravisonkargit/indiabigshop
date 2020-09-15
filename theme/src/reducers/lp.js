
import {
    RECEIVE_LP } from "../constants/ActionTypes";


const initialState = {
    lp:[]
};


const lpReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_LP:
            return { ...state,
                lp:action.lp
            }
        default:
            return state;
    }
};
export default lpReducer;