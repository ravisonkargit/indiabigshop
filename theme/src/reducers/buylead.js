
import {
    RECEIVE_BUY_LEAD } from "../constants/ActionTypes";


const initialState = {
    careers:[]
};


const buyLeadReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_BUY_LEAD:
            // h
            return { ...state,
                buyLead:action.buyLead
            }
        default:
            return state;
    }
};
export default buyLeadReducer;