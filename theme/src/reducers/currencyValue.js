import {
    CURRENCY_VALUE } from "../constants/ActionTypes";


const initialState = {
    currencyValue:[]
};


const currencyValueReducer = (state = initialState, action) => {
    switch (action.type) {
        case CURRENCY_VALUE:
            // h
            return { ...state,
                currencyValue:action.currencyValue
            }
        default:
            return state;
    }
};
export default currencyValueReducer;
