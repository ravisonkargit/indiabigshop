import {
    REMOVE_FROM_CART,
    CHANGE_QTY,
    RECEIVE_CART,
    EMPTY_CART,
    RECEIVE_GET_CART,
    GET_CART,
    DECREMENT_QTY } from "../constants/ActionTypes";
import { getCookie } from "../functions";

var country_code = getCookie('country_code');

export default function cartReducer(state = {
    cart: []
}, action) {
    let startPrice = 0;
    let endPrice = 0;
    let startRange = 0;
    let endRange = 0;
    switch (action.type) {
        case EMPTY_CART:
            return {
                state: state.cart
            }
        case RECEIVE_CART:
            let priceCalc = 0;
            let eachprice = 0;
            state.cart.forEach((product, index) => { 
                    priceCalc = 0;
                    eachprice = 0;
                    if (product.qty >= 0) {
                        if (product.price && product.price.length > 0) {
                            product.price.forEach((val, ind) => {
                                if (val.rangestart <= product.qty && val.rangeend >= product.qty) {
                                    if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                        priceCalc = (parseFloat(val.eachunit) / parseFloat(action.inrValue)) * parseInt(product.qty)
                                        eachprice = (parseFloat(val.eachunit) / parseFloat(action.inrValue))
                                    } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                        priceCalc = parseFloat(val.eachunit) * parseFloat(action.inrValue) * parseInt(product.qty)
                                        eachprice = parseFloat(val.eachunit) * parseFloat(action.inrValue)
                                    } else {
                                        priceCalc = parseFloat(val.eachunit) * parseInt(product.qty)
                                        eachprice = parseFloat(val.eachunit)
                                    }
                                }
                            
                            if (ind == 0) {
                                if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                    startPrice = (parseFloat(val.eachunit) / parseFloat(action.inrValue));
                                    endPrice = (parseFloat(val.eachunit) / parseFloat(action.inrValue));
                                } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                    startPrice = parseFloat(val.eachunit) * parseFloat(action.inrValue)
                                    endPrice = parseFloat(val.eachunit) * parseFloat(action.inrValue)
                                } else {
                                    startPrice = parseFloat(val.eachunit)
                                    endPrice = parseFloat(val.eachunit)
                                }
        
                                startRange = parseFloat(val.rangestart);
                                endRange = parseFloat(val.rangeend);
                            } else {
                                if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                    endPrice = parseFloat(val.eachunit) / parseFloat(action.inrValue);
                                } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                    endPrice = parseFloat(val.eachunit) * parseFloat(action.inrValue);
                                } else {
                                    endPrice = parseFloat(val.eachunit)
                                }
        
                                endRange = parseFloat(val.rangeend);
                            }
                            })
            
                            if (eachprice == 0) {
                                if (product.qty < startRange) {
                                    priceCalc = parseFloat(startPrice) * parseInt(product.qty)
                                    eachprice = parseFloat(startPrice)
                                } else if (product.qty > endRange) {
                                    priceCalc = parseFloat(endPrice) * parseInt(product.qty)
                                    eachprice = parseFloat(endPrice)
                                }
                            }

                            if (product.price_in && product.price_in !== undefined && product.price_in != '') {
                                if (country_code == '' || country_code.toLowerCase() == 'in') {
                                    priceCalc = parseFloat(priceCalc + ((product.price_in / 100) * priceCalc))
                                    eachprice = parseFloat(eachprice + ((product.price_in / 100) * eachprice))
                                }
                            }
                
                            if (product.price_us && product.price_us !== undefined && product.price_us != '') {
                                if (country_code.toLowerCase() == 'us') {
                                    priceCalc = parseFloat(priceCalc + ((product.price_us / 100) * priceCalc))
                                    eachprice = parseFloat(eachprice + ((product.price_us / 100) * eachprice))
                                }
                            }
                        }
                        else {
                            priceCalc = 0
                            eachprice = 0
                        }
                   
                        product.qty = parseInt(product.qty) //  qty
                        product.eachprice = eachprice.toFixed(2) //  eachprice
                        product.totalprice = priceCalc.toFixed(2) //  sum
    
                    }
                })
                    return state;

        case CHANGE_QTY:
           // console.log(action, state)
            startPrice = 0;
            endPrice = 0;
            startRange = 0;
            endRange = 0;
            let calcPrice = 0;
            let unitprice = 0;
            state.cart.forEach((product, index) => { 
                //console.log(product, index)
                calcPrice = 0;
                unitprice = 0;
                if (action.qty >= 0 && product.productid == action.productid && product.price && product.price.length > 0) {
                    product.price.forEach((val, ind) => {
                        //console.log(val.rangestart, action.qty , val.rangeend, action.symbol, val.currency, val.eachunit)
                        if (parseInt(val.rangestart) <= parseInt(action.qty) && parseInt(val.rangeend) >= parseInt(action.qty) ) {
                            //console.log('inside')
                            if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                //console.log('inside first')
                                calcPrice = (parseFloat(val.eachunit) / parseFloat(action.inrValue)) * parseInt(action.qty)
                                unitprice = (parseFloat(val.eachunit) / parseFloat(action.inrValue))
                            } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                //console.log('inside second')
                                calcPrice = parseFloat(val.eachunit) * parseFloat(action.inrValue) * parseInt(action.qty)
                                unitprice = parseFloat(val.eachunit) * parseFloat(action.inrValue)
                            } else {
                                //console.log('inside third')
                                calcPrice = parseFloat(val.eachunit) * parseInt(action.qty)
                                unitprice = parseFloat(val.eachunit)
                            }
                            
                        }

                        if (ind == 0){
                            if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                startPrice = (parseFloat(val.eachunit) / parseFloat(action.inrValue));
                                endPrice = (parseFloat(val.eachunit) / parseFloat(action.inrValue));
                            } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                startPrice = parseFloat(val.eachunit) * parseFloat(action.inrValue)
                                endPrice = parseFloat(val.eachunit) * parseFloat(action.inrValue)
                            }else{
                                startPrice = parseFloat(val.eachunit)
                                endPrice = parseFloat(val.eachunit)
                            }
    
                            startRange = parseFloat(val.rangestart);
                            endRange = parseFloat(val.rangeend);
                        }else{
                            if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                endPrice = parseFloat(val.eachunit) / parseFloat(action.inrValue);
                            } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                endPrice = parseFloat(val.eachunit) * parseFloat(action.inrValue);
                            }else{
                                endPrice = parseFloat(val.eachunit)
                            }
    
                            endRange = parseFloat(val.rangeend);
                        }
                    })
                    
                    if (unitprice == 0){
                        if (action.qty < startRange){
                            calcPrice = parseFloat(startPrice) * parseInt(action.qty)
                            unitprice = parseFloat(startPrice) 
                        }else if (action.qty > endRange){
                            calcPrice = parseFloat(endPrice) * parseInt(action.qty)
                            unitprice = parseFloat(endPrice) 
                        }
                    }

                    if (product.price_in && product.price_in !== undefined && product.price_in != '') {
                        if (country_code == '' || country_code.toLowerCase() == 'in') {
                            calcPrice = parseFloat(calcPrice + ((product.price_in / 100) * calcPrice))
                            unitprice = parseFloat(unitprice + ((product.price_in / 100) * unitprice))
                        }
                    }
        
                    if (product.price_us && product.price_us !== undefined && product.price_us != '') {
                        if (country_code.toLowerCase() == 'us') {
                            calcPrice = parseFloat(calcPrice + ((product.price_us / 100) * calcPrice))
                            unitprice = parseFloat(unitprice + ((product.price_us / 100) * unitprice))
                        }
                    }
                    //console.log(product.qty, product.eachprice, product.totalprice)
                    product.qty = parseInt(action.qty) // change qty
                    product.eachprice = unitprice.toFixed(2) // change eachprice
                    product.totalprice = calcPrice.toFixed(2) // change sum
                    //console.log(product)
                }
                })

                return state;

        case DECREMENT_QTY:

            if (Object.keys(state.cart).findIndex(product => state.cart[product].item.cartitemid == action.cartitemid) !== -1) {
                Object.keys(state.cart).forEach((product, index) => { 
                    if (state.cart[product].item.cartitemid == action.cartitemid ) {
                        if (state.cart[product].item.qty > 0 && parseFloat(state.cart[product].item.price) > parseFloat(0)) {
                            state.cart[product].item.qty = parseInt(action.qty) // Decrement qty
                            state.cart[product].item.totalprice = parseFloat(state.cart[product].item.price) * parseInt(action.qty) // Decrement sum
                        } else {
                            state.cart[product].item.qty = parseInt(action.qty) // Decrement qty
                            state.cart[product].item.totalprice = parseInt(state.cart[product].item.price)                      
                        }
                    }
                })
                return state;
            }
            
            // if (state.cart.findIndex(product => product.cartitemid == action.cartitemid) !== -1) {
            //     const cart = state.cart.reduce((cartAcc, product) => {
            //         if (product.cartitemid == action.cartitemid && product.qty > 1) {
            //             cartAcc.push({ ...product, qty: action.qty, sum: product.price * action.qty }) // Decrement qty
            //         } else {
            //             cartAcc.push(product)
            //         }

            //         return cartAcc
            //     }, [])

            //     return { ...state, cart }
            // }

            // return { ...state, cart: [...state.cart, { ...action.product, qty: action.qty, sum: action.product.price*action.qty }] }

        case REMOVE_FROM_CART:
            const removeProduct = state.cart.filter(eachcart => eachcart.cartitemid != action.cartitemid)
            return { ...state, cart: removeProduct }
            break;
            // return {
            // state: removeProduct
            // }
        case RECEIVE_GET_CART:
            let tempState = [];
            startPrice = 0;
            endPrice = 0;
            startRange = 0;
            endRange = 0;
            let inrValue = 71;
            state = {
                cart: action.cart
            }
            if (action.inrValue){
             inrValue = action.inrValue;
            }
            action.cart.forEach((product, index) => {
                calcPrice = 0;
                unitprice = 0;
                if (product.price && product.price.length > 0) {
                    product.price.forEach((val, ind) => {
                        if (parseInt(val.rangestart) <= parseInt(product.qty) && parseInt(val.rangeend) >= parseInt(product.qty)) {
                            if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                //console.log('inside first')
                                calcPrice = (parseFloat(val.eachunit) / parseFloat(inrValue)) * parseInt(product.qty)
                                unitprice = (parseFloat(val.eachunit) / parseFloat(inrValue))
                            } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                //console.log('inside second')
                                calcPrice = parseFloat(val.eachunit) * parseFloat(inrValue) * parseInt(product.qty)
                                unitprice = parseFloat(val.eachunit) * parseFloat(inrValue)
                            } else {
                                //console.log('inside third')
                                calcPrice = parseFloat(val.eachunit) * parseInt(product.qty)
                                unitprice = parseFloat(val.eachunit)
                            }
                        }
                        if (ind == 0) {
                            if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                startPrice = (parseFloat(val.eachunit) / parseFloat(inrValue));
                                endPrice = (parseFloat(val.eachunit) / parseFloat(inrValue));
                            } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                startPrice = parseFloat(val.eachunit) * parseFloat(inrValue)
                                endPrice = parseFloat(val.eachunit) * parseFloat(inrValue)
                            } else {
                                startPrice = parseFloat(val.eachunit)
                                endPrice = parseFloat(val.eachunit)
                            }

                            startRange = parseFloat(val.rangestart);
                            endRange = parseFloat(val.rangeend);
                        } else {
                            if ((action.symbol == 'USD') && (val.currency == 'INR' || val.currency == '')) {
                                endPrice = parseFloat(val.eachunit) / parseFloat(inrValue);
                            } else if ((action.symbol == 'INR') && val.currency == 'USD') {
                                endPrice = parseFloat(val.eachunit) * parseFloat(inrValue);
                            } else {
                                endPrice = parseFloat(val.eachunit)
                            }

                            endRange = parseFloat(val.rangeend);
                        }
                        
                    })


                    if (unitprice == 0) {
                        if (product.qty < startRange) {
                            calcPrice = parseFloat(startPrice) * parseInt(product.qty)
                            unitprice = parseFloat(startPrice)
                        } else if (product.qty > endRange) {
                            calcPrice = parseFloat(endPrice) * parseInt(product.qty)
                            unitprice = parseFloat(endPrice)
                        }
                    }
    

                    if (product.price_in && product.price_in !== undefined && product.price_in != '') {
                        if (country_code == '' || country_code.toLowerCase() == 'in') {
                            calcPrice = parseFloat(calcPrice + ((product.price_in / 100) * calcPrice))
                            unitprice = parseFloat(unitprice + ((product.price_in / 100) * unitprice))
                        }
                    }

        
                    if (product.price_us && product.price_us !== undefined && product.price_us != '') {
                        if (country_code.toLowerCase() == 'us') {
                            calcPrice = parseFloat(calcPrice + ((product.price_us / 100) * calcPrice))
                            unitprice = parseFloat(unitprice + ((product.price_us / 100) * unitprice))
                           // console.log('if in country '+country_code.toLowerCase(),calcPrice,unitprice);
                        }
                    }

                } else {
                    calcPrice = 0;
                    unitprice = 0;
                }
                state.cart[index].eachprice = parseFloat(unitprice).toFixed(2) // change eachprice
                state.cart[index].totalprice = parseFloat(calcPrice).toFixed(2) // change sum
            })


            return state;
        
        case GET_CART:
            return state = { 
                cart: action.cart
            }

        default:
            return state;
    }
    
}