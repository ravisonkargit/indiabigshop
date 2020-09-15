
import {
    RECEIVE_BANNERS, RECEIVE_BRANDS } from "../constants/ActionTypes";


const initialState = {
    banners: [],
    brands: []
};


const bannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_BANNERS:
            return { ...state,
                banners:action.banners
            }
        case RECEIVE_BRANDS:
            return { ...state,
                brands:action.brands
            }
        default:
            return state;
    }
};
export default bannerReducer;