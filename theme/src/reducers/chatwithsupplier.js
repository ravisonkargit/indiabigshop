
import {
    RECEIVE_CHAT } from "../constants/ActionTypes";


const initialState = {
    chatToSeller:[]
};


const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_CHAT:
            console.log(action.chatWithSupplier)
            // let chatWithSupplier1 = action.chatWithSupplier
            return { ...state,
                chatToSeller:action.chatWithSupplier
            }
        default:
            return state;
    }
};
export default chatReducer;