
import {
    RECEIVE_MEDIA_PR } from "../constants/ActionTypes";


const initialState = {
    mediapr:[]
};


const mediaprReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_MEDIA_PR:
            return { ...state,
                mediapr:action.mediapr
            }
        default:
            return state;
    }
};
export default mediaprReducer;