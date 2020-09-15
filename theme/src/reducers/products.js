import ls from 'local-storage'
import axios from 'axios';
import {
    FETCH_SINGLE_PRODUCT,
    CHANGE_CURRENCY,
    RECEIVE_PRODUCTS,SEARCH_PRODUCTS,RECEIVE_PRODUCTSBYCATEGORY,RECEIVE_RELATED_PRODUCTS,TOTAL_VALUE, RECEIVE_COUNTRY } from "../constants/ActionTypes";
import { getCookie } from '../functions';

let setCurrency;
if (getCookie('currency'))
    setCurrency = getCookie('currency');
else
    setCurrency = 'INR';


const initialState = {
    products: [],
    searchProducts:[],
    symbol: setCurrency,
    product_details: [],
    totalCount: [],
    productsByCategory: [],
    relatedProducts: [],
    countries: [],
    totalCost: [],
    inrValue:71.50
};


const productReducer = (state = initialState, action) => {
    // console.log(state)
    switch (action.type) {
        case RECEIVE_PRODUCTS:
            // console.log(action.type)
            return { ...state,
                products: action.products
            };
        case SEARCH_PRODUCTS:
            return { ...state,
                searchProducts: action.searchResults[0][0],
                totalCount: action.searchResults[0][1]
           }
        case RECEIVE_PRODUCTSBYCATEGORY:
            return { ...state,
                productsByCategory: action.searchResults[0][0],
                totalCount: action.searchResults[0][1],
                categoryBanner: action.searchResults[0][2]
            }   
        case FETCH_SINGLE_PRODUCT:
            if (state.products.findIndex(product => product.id === action.productId) !== -1) {
                const singleItem = state.products.reduce((itemAcc, product) => {
                    return product
                }, [])
                return { ...state,
                    product_details: singleItem };
            }
        case RECEIVE_RELATED_PRODUCTS:
            return { ...state,
                relatedProducts: action.products
            };
        case CHANGE_CURRENCY:
            return { ...state,
                symbol: action.symbol
            };
        case RECEIVE_COUNTRY:
            return {
                ...state,
                countries:action.data
            }
        case TOTAL_VALUE:
            return {
                ...state,
                totalCost:action.value
            }
        default:
            return state;
    }
};
export default productReducer;