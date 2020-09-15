import { combineReducers } from 'redux';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual'
//loadingbar
// Import custom components
import productReducer from './products';

import cartReducer from './cart';
import filtersReducer from './filters';
import wishlistReducer from './wishlist';
import compareReducer from './compare';
import bannersReducer from './banners';
import categoryReducer from './categories';
import loginReducer from './login';
import careersReducer from './career';
import mediaprReducer from './mediapr';
import mediaReleaseReducer from './mediaRelease';
import buyLeadReducer from './buylead';
import languageMasterReducer from './languageMaster';
import langContentReducer from './languageContent';
// const
// import unitReducer from './units';
import lpReducer from './lp';
import tmReducer from './tm';
import unitReducer from './units';
import prodLPReducer from './prodByLP'
import singleProdReducer from './singleProduct'
import storeFrontReducer from './storeFront'
import currencyValueReducer from './currencyValue'
import privaypolicyReducer from './privacyPolicy';
import clearStateReducer from './clearState';
import chatReducer from './chatwithsupplier'
import recommendedProductReducer from './recommendedProduct';
import wholesaleDayReducer from './wholesaleDay';
import recentSearchReducer from './recentSearch';

import cartlengthReducer from './cartlength';

// import languageMasterReducer from './languageMaster';
import asyncComponent from '../AsyncComponent'
// import UnusedFilesWebpackPlugin from "unused-files-webpack-plugin";

// const productReducer = asyncComponent(() =>
//     import('./products').then(module => module.default)
// )

const appReducer = combineReducers({
    user:loginReducer,
    banners: bannersReducer,
    tm:tmReducer,
    careers: careersReducer,
    mediapr: mediaprReducer,
    mediaRelease: mediaReleaseReducer,
    buyLead: buyLeadReducer,
    categories:categoryReducer,
    data: productReducer,
    cartList: cartReducer,
    filters: filtersReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    units: unitReducer,
    lp:lpReducer,
    units: unitReducer,
    productsByLP:prodLPReducer,
    languageMaster:languageMasterReducer,
    langContent:langContentReducer,
    store : storeFrontReducer,
    singleProduct:singleProdReducer,
    currencyValue: currencyValueReducer,
    privacyPolicy: privaypolicyReducer,
    clearState: clearStateReducer,
    recommendedProduct: recommendedProductReducer,
    wholesaleDay: wholesaleDayReducer,
    recentSearch: recentSearchReducer,
    chat:chatReducer,
    cartLength:cartlengthReducer,
    Intl
});

const rootReducer = (state, action) => {
    // if (state.cartList.cart)
    //     console.log(state.cartList.cart[0].eachprice)

    //console.log('reducer', state, action)
    if (action.type === 'USER_LOGOUT') {
        state = undefined
    }

    if (action.type === 'CLEAR_ALL_STATE') {
        state = undefined
    }
    
    return appReducer(state, action)
}

export default rootReducer;