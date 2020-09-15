
import {
    RECEIVE_TM } from "../constants/ActionTypes";


const initialState = {
    tm:[]
};


const tmReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_TM:
            return { ...state,
                tm:action.tm
            }
        default:
            return state;
    }
};
export default tmReducer;