
import {
    RECEIVE_MEDIA_RELEASE } from "../constants/ActionTypes";


const initialState = {
    mediaRelease:[]
};


const mediaReleaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_MEDIA_RELEASE:
            return { ...state,
                mediaRelease:action.mediaRelease
            }
        default:
            return state;
    }
};
export default mediaReleaseReducer;