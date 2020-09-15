import {
    RECEIVE_LANGUAGE_MASTER } from "../constants/ActionTypes";


const initialState = {
    languageMaster:[]
};


const languageMasterReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_LANGUAGE_MASTER:
            // 
            return { ...state,
                languageMaster:action.languageMaster
            }
        default:
            return state;
    }
};
export default languageMasterReducer;