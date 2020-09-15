
import {
    RECEIVE_UNITS } from "../constants/ActionTypes";


const initialState = {
    units:[]
};


const unitReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_UNITS:
            return { ...state,
                units:action.units
            }
        default:
            return state;
    }
};
export default unitReducer;
