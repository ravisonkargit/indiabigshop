
import {
    CLEAR_ALL_STATE } from "../constants/ActionTypes";


const initialState = {
    state:[]
};


const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
            return { ...state
            }
        default:
            return state;
    }
};
export default categoryReducer;