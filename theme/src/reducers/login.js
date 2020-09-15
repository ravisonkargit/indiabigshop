
import {
    RECEIVE_LOGIN } from "../constants/ActionTypes";


const initialState = {
    user:[]
};


const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_LOGIN:
            return { ...state,
                user:action.user
            }
        default:
            return state;
    }
};
export default loginReducer;