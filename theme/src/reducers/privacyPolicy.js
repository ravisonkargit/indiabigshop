import {
    RECEIVE_PRIVACYPOLICY } from "../constants/ActionTypes";
    


const initialState = {
    data:[]
};


const privaypolicyReducer = (state = initialState, action) => {
    
    return { ...state,
        data: action.data
    };
};
export default privaypolicyReducer;