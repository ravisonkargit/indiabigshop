
import {
    RECEIVE_PRICE_SETTING } from "../constants/ActionTypes";


const initialState = {
    priceSetting:[]
};


const PriceSettingReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_PRICE_SETTING:
            return { ...state,
                priceSetting:action.priceSetting
            }
        default:
            return state;
    }
};
export default PriceSettingReducer;