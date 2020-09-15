
import {
    RECEIVE_CATEGORIES } from "../constants/ActionTypes";


const initialState = {
    categories:[]
};


const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_CATEGORIES:
            return { ...state,
                categories:action.categories
            }
        default:
            return state;
    }
};
export default categoryReducer;