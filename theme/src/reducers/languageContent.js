
import {
    RECEIVE_LANGUAGE_CONTENT } from "../constants/ActionTypes";


const initialState = {
    langContent:[]
};

const langContentReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_LANGUAGE_CONTENT:
            // 
            return { ...state,
                langContent:action.langContent
            }
        default:
            return state;
    }
};
export default langContentReducer;