
//Banners
export const getBanners = (state) => {
    return state.banners;
}


// Get Unique Brands from Json Data
export const getBrands = (products) => {
    var uniqueBrands = [];
    products.map((product, index) => {
        if (product.tags) {
            product.tags.map((tag) => {
                if (uniqueBrands.indexOf(tag) === -1) {
                    uniqueBrands.push(tag);
                }
            })
        }
    })
    //console.log(uniqueBrands)
    return uniqueBrands;
}

// Get Unique Colors from Json Data
export const getColors = (products) => {
    var uniqueColors = [];
    products.map((product, index) => {
        if (product.colors) {
            product.colors.map((color) => {
                if (uniqueColors.indexOf(color) === -1) {
                    uniqueColors.push(color);
                }
            })
        }
    })
    //console.log(uniqueBrands)
    return uniqueColors;
}

// Get Minimum and Maximum Prices from Json Data
export const getMinMaxPrice = (products) => {
    let min = 100, max = 1000;

    products.map((product, index) => {
        let v = product.price;
        min = (v < min) ? v : min;
        max = (v > max) ? v : max;
    })

    return { 'min': min, 'max': max };
}

export const getVisibleproducts = (data, { brand, color, value, sortBy }) => {
    return data.products.filter(product => {

        let brandMatch;
        if (product.tags)
            brandMatch = product.tags.some(tag => brand.includes(tag))
        else
            brandMatch = true;

        let colorMatch;
        if (color && product.colors) {
            colorMatch = product.colors.includes(color)
        } else {
            colorMatch = true;
        }

        const startPriceMatch = typeof value.min !== 'number' || value.min <= product.price;
        const endPriceMatch = typeof value.max !== 'number' || product.price <= value.max;

        return brandMatch && colorMatch && startPriceMatch && endPriceMatch;
    }).sort((product1, product2) => {
        if (sortBy === 'HighToLow') {
            return product2.price < product1.price ? -1 : 1;
        } else if (sortBy === 'LowToHigh') {
            return product2.price > product1.price ? -1 : 1;
        } else if (sortBy === 'Newest') {
            return product2.id < product1.id ? -1 : 1;
        } else if (sortBy === 'AscOrder') {
            return product1.name.localeCompare(product2.name);
        } else if (sortBy === 'DescOrder') {
            return product2.name.localeCompare(product1.name);
        } else {
            return product2.id > product1.id ? -1 : 1;
        }
    });
}
//Get products by category 
export const getProductsByCategory = (data, { brand, color, value, sortBy }) => {
    return data.productsByCategory;
}
//Search Products Result
export const getSearchProducts = (data, { brand, color, value, sortBy }) => {
    return data.searchProducts;
    return data.searchProducts.filter(product => {
        let brandMatch;
        if (product.tags)
            brandMatch = product.tags.some(tag => brand.includes(tag))
        else
            brandMatch = true;

        let colorMatch;
        if (color && product.colors) {
            colorMatch = product.colors.includes(color)
        } else {
            colorMatch = true;
        }

        const startPriceMatch = typeof value.min !== 'number' || value.min <= product.price;
        const endPriceMatch = typeof value.max !== 'number' || product.price <= value.max;

        return brandMatch && colorMatch && startPriceMatch && endPriceMatch;
    }).sort((product1, product2) => {
        if (sortBy === 'HighToLow') {
            return product2.price < product1.price ? -1 : 1;
        } else if (sortBy === 'LowToHigh') {
            return product2.price > product1.price ? -1 : 1;
        } else if (sortBy === 'Newest') {
            return product2.id < product1.id ? -1 : 1;
        } else if (sortBy === 'AscOrder') {
            return product1.name.localeCompare(product2.name);
        } else if (sortBy === 'DescOrder') {
            return product2.name.localeCompare(product1.name);
        } else {
            return product2.id > product1.id ? -1 : 1;
        }
    });
}

// export const getCartTotal = cartItems => {
//     console.log(cartItems)
//     var total = 0;
//     if(cartItems)
//     for (var i = 0; i < cartItems.length; i++){

//             total += parseInt(cartItems[i].item.qty, 10)*parseFloat((cartItems[i].eachprice), 10);
//             total = 1;
//         }
//     return total;
// }

export const getCartTotal = async (cartItems) => {
    let total = 0;
    if (cartItems) {
        cartItems.forEach((val, ind) => {
            total += parseFloat(val.totalprice)
        })
    }
    console.log(150,'getCartTotal',total,parseFloat(total).toFixed(2));
    // return total.toFixed(2);
    return parseFloat(total).toFixed(2);

}

export const getCartWeight = async (cartItems) => {
    let weight = 1.00;
    if (cartItems) {
        cartItems.forEach((val, ind) => {
            if (val.weight !== undefined && val.weight != '' && parseFloat(val.weight) != parseFloat(0.00))
                weight += parseFloat(val.weight)
            else
                weight += parseFloat(1)
        })
    }
    // console.log('getCartWeight', weight)

    return weight.toFixed(2);
}

// export const priceConversion = async (price, currencyOfPrice, inrValue, usdValue, currency) => {
//     let totalprice = 0;
//     if (currency == 'USD' && currencyOfPrice == 'INR')
//         totalprice = parseFloat(price) / parseFloat(inrValue)
//     else if (currency == 'INR' && currencyOfPrice == 'USD')
//         totalprice = parseFloat(price) * parseFloat(inrValue)
//     else
//         totalprice = parseFloat(price)
//     console.log(price, currencyOfPrice, inrValue, usdValue, currency,totalprice,177);

//     return totalprice.toFixed(2);
// }


export const priceConversion = async (price, currencyOfPrice, inrValue, usdValue, currency) => {
    let totalprice = 0;
    if (currency == 'USD' && currencyOfPrice == 'INR')
        totalprice = parseFloat(price) / parseFloat(inrValue)
    else if (currency == 'INR' && currencyOfPrice == 'USD')
        // totalprice = parseFloat(price) * parseFloat(inrValue)
        totalprice = Math.round(parseFloat(price) * parseFloat(inrValue));
    else
        totalprice = parseFloat(price)
    console.log(price, currencyOfPrice, inrValue, usdValue, currency,totalprice,177);

    return totalprice.toFixed(2);
}


export const priceCheckMinAuctionPrice = async (price, currencyOfProduct, currency, qty, inrValue, threshold, priceto, pricefrom) => {
    var minprice = 1;
    var hasRange = 0;
    var rangeStart = 0;
    var rangeStartPrice = 0;
    var rangeEnd = 0;
    var rangeEndPrice = 0;
    var threshold = threshold;
    
    var priceto = parseFloat(priceto);
    var pricefrom = parseFloat(pricefrom);

    var qty = parseFloat(qty);

    
    if (price.length > 0){
        price.forEach((val, ind) => {
            // get start range and price
            if (ind == 0){
                rangeStart = parseFloat(val.rangestart);
                rangeStartPrice = parseFloat(val.eachunit);
            }

            // get end range and price
            if (ind == (price.length - 1)){
                rangeEnd = parseFloat(val.rangestart);
                rangeEndPrice = parseFloat(val.eachunit);
            }

            // check if price falls in range bracket
            if (qty >= parseFloat(val.rangestart) && qty <= parseFloat(val.rangeend) && parseFloat(val.eachunit) > 0){
                hasRange++;
                
                if (currencyOfProduct !='USD' && currency =='USD'){
                    minprice = parseFloat(val.eachunit) / inrValue;
                }else if (currencyOfProduct =='USD' && currency !='USD'){
                    minprice = parseFloat(val.eachunit) * inrValue;
                }else{
                    minprice = parseFloat(val.eachunit)
                }
            }
            

            if (ind == (price.length - 1) && hasRange == 0){
                if (qty < rangeStart){
                    if (currencyOfProduct !='USD' && currency =='USD'){
                        minprice = parseFloat(rangeStartPrice / inrValue);
                    }else if (currencyOfProduct =='USD' && currency !='USD'){
                        minprice = parseFloat(rangeStartPrice * inrValue);
                    }else{
                        minprice = rangeStartPrice
                    }
                }else if (qty > rangeEnd){
                    if (currencyOfProduct !='USD' && currency =='USD'){
                        minprice = parseFloat(rangeEndPrice / inrValue);
                    }else if (currencyOfProduct =='USD' && currency !='USD'){
                        minprice = parseFloat(rangeEndPrice * inrValue);
                    }else{
                        minprice = rangeEndPrice
                    }
                }
            }
        })
    }

    if (priceto > 0 && parseInt(minprice) == 1){
        if (currencyOfProduct !='USD' && currency =='USD'){
            minprice = parseFloat(priceto / inrValue);
        }else if (currencyOfProduct =='USD' && currency !='USD'){
            minprice = parseFloat(priceto * inrValue);
        }else{
            minprice = priceto
        }
    }
    console.log(minprice)
    minprice = (threshold / 100) * minprice;
    console.log(minprice)
    return minprice.toFixed(2);
}

export const minTresholdBarrier = async (price, currency) => {
    let tprice = price;

    if (currency == 'USD') {
        tprice = parseFloat(tprice) < parseFloat(5) ? 5 : parseFloat(tprice);
    } else {
        tprice = parseFloat(tprice) < parseFloat(40) ? 40 : parseFloat(tprice);
    }

    return tprice.toFixed(2);
}
// 20/04/20 
// export const getTotalCartValue = async (shippingCost, totalProductCost,wallet_amount,wallet_eanbled) => {
//     let totalprice = parseFloat(shippingCost) + parseFloat(totalProductCost)
//     // console.log(totalprice,wallet_amount,wallet_eanbled,276);
//     if(totalprice > wallet_amount && wallet_eanbled){
//         return parseFloat(totalprice - wallet_amount).toFixed(2);
//     }else{
//         return totalprice.toFixed(2);
//     }
// }

//21/04/20
export const getTotalCartValue = async (shippingCost, totalProductCost,wallet_amount,wallet_eanbled) => {
    let totalprice = parseFloat(shippingCost) + parseFloat(totalProductCost)
    // console.log(totalprice,wallet_amount,wallet_eanbled,276);
    if(totalProductCost > wallet_amount && wallet_eanbled){
        return parseFloat(totalprice - wallet_amount).toFixed(2);
    }else if(totalProductCost < wallet_amount && wallet_eanbled){
        var new_amount_to_cut = totalProductCost/2;
        return parseFloat(totalprice - new_amount_to_cut).toFixed(2);
    }else{
        return totalprice.toFixed(2);
    }
}

// old one 
// export const getTotalCartValue = async (shippingCost, totalProductCost) => {
//     let totalprice = parseFloat(shippingCost) + parseFloat(totalProductCost)
//         return totalprice.toFixed(2);
// }

export const getTotalShippingCost = async (shippingCost, symbol) => {
    let totalShippingPrice = 0;

    if (shippingCost) {
        Object.keys(shippingCost).forEach((val, ind) => {
            totalShippingPrice += parseFloat(shippingCost[val].shippingCost)
        })
    }

    // if (symbol == 'USD')
    //     totalShipCost = parseFloat(totalShippingPrice) < parseFloat(5) ? 5 : totalShippingPrice.toFixed(2);
    // else 
    //     totalShipCost = parseFloat(totalShippingPrice) < parseFloat(40) ? 40 : totalShippingPrice.toFixed(2);

    return totalShippingPrice;
}

export const getFinalShippingCost = async (shippingCost, symbol) => {
    let finalShippingPrice = 0;

    if (shippingCost) {
        Object.keys(shippingCost).forEach((val, ind) => {
            finalShippingPrice += parseFloat(shippingCost[val].finalShippingCost)
        })
    }

    // if (symbol == 'USD')
    //     totalShipCost = parseFloat(totalShippingPrice) < parseFloat(5) ? 5 : totalShippingPrice.toFixed(2);
    // else 
    //     totalShipCost = parseFloat(totalShippingPrice) < parseFloat(40) ? 40 : totalShippingPrice.toFixed(2);

    return finalShippingPrice;
}

// export const getShippingCost = async (cartItems, shippingData, shippingDetails, shippingToCountry, currency, inrValue, usdValue) => {
//    // console.log('getShippingCost')
//    console.log('getShippingCost start: ', cartItems, shippingData, shippingDetails, shippingToCountry, currency, inrValue, usdValue)
//     let shippingCalc = shippingDetails;
//     let startShippingCost, endShippingCost, startShippingRange, endShippingRange;
//     if (shippingDetails && cartItems && shippingData.statusId == '1' ) {

//         // variable which stores shipping cost for products of each counrty
//         Object.keys(shippingDetails).forEach((val, ind) => { 
//             shippingCalc[val].shippingCost = 0;

//             // for each product in cart
//             cartItems.forEach((cart, index) => {
//                 if (val.toLowerCase() == cart.sellerCountry.toLowerCase()) {

//                     // for each shipping cost range 
//                     shippingData.result.forEach((eachCountryShippingDetails, i) => { 
//                         if (eachCountryShippingDetails.country_from == shippingDetails[val].countryid && eachCountryShippingDetails.country_to == shippingToCountry) { 

//                             if (startShippingCost == 0 || startShippingCost === undefined || startShippingCost == '')
//                                 startShippingRange = parseFloat(eachCountryShippingDetails.weight_from)

//                                 endShippingRange = parseFloat(eachCountryShippingDetails.weight_to)

//                             if (currency == 'USD') {
//                                 if (startShippingCost == 0 || startShippingCost === undefined || startShippingCost == '')
//                                     startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);

//                                 endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);
//                             } else {
//                                 if (startShippingCost == 0 || startShippingCost === undefined || startShippingCost == '')
//                                     startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);

//                                 endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);
//                             }


//                             if (parseFloat(eachCountryShippingDetails.weight_from) <= (parseFloat(shippingCalc[val].weight) * cart.qty) && parseFloat(eachCountryShippingDetails.weight_to) >= (parseFloat(shippingCalc[val].weight) * cart.qty)) {

//                                 if (currency == 'USD') {

//                                     if (!startShippingCost || startShippingCost === undefined || startShippingCost == '')
//                                         startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);

//                                     endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);

//                                     shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * cart.qty * (parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue)))
//                                 } else {

//                                     if (!startShippingCost || startShippingCost === undefined || startShippingCost == '')
//                                         startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);

//                                     endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);

//                                     shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * cart.qty * parseFloat(eachCountryShippingDetails[shippingDetails[val].express]))

//                                 }

//                             }

//                         }
//                     })


//                     // if shipping cost for particular weight not found then take value outside the range
//                     if ( shippingCalc[val].shippingCost == 0 ) {
//                         if (parseFloat(startShippingRange) > (parseFloat(shippingCalc[val].weight)) * cart.qty)
//                             shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * cart.qty * parseFloat(startShippingCost))

//                         if (parseFloat(endShippingRange) < (parseFloat(shippingCalc[val].weight)) * cart.qty)
//                             shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * cart.qty * parseFloat(endShippingCost))

//                     }
//                     shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost).toFixed(2)
//                 }
//             })
//         })
//     }
//     console.log('getShippingCost', shippingCalc)
//     return shippingCalc;
// }


export const getShippingCost = async (cartItems, shippingData, shippingDetails, shippingToCountry, currency, inrValue, usdValue) => {
    console.log('shippingDetails: '+shippingDetails,'shippingData: '+shippingData,440);
    // console.log( 'getShippingCost' ,cartItems, shippingData, shippingDetails, shippingToCountry, currency, inrValue, usdValue)
    let shippingCalc = shippingDetails;
    let totalShipCost = 0;
    let finalshippingCost = 0
    let startShippingCost, endShippingCost, startShippingRange, endShippingRange;
    if (shippingDetails && cartItems && shippingData.statusId == '1') {
        // variable which stores shipping cost for products of each counrty
        Object.keys(shippingDetails).forEach((val, ind) => {

            shippingCalc[val].shippingCost = 0;

            // for each shipping cost range 
            shippingData.result.forEach((eachCountryShippingDetails, i) => {

                if (eachCountryShippingDetails.country_from == shippingDetails[val].countryid && eachCountryShippingDetails.country_to == shippingToCountry) {

                    if (startShippingCost == 0 || startShippingCost === undefined || startShippingCost == '') {
                        startShippingRange = parseFloat(eachCountryShippingDetails.weight_from)
                    } else {
                        if (parseFloat(startShippingRange) > parseFloat(eachCountryShippingDetails.weight_from)) {
                            startShippingRange = parseFloat(eachCountryShippingDetails.weight_from)
                        }
                    }


                    endShippingRange = parseFloat(eachCountryShippingDetails.weight_to)

                    if (currency == 'USD') {
                        if (startShippingCost == 0 || startShippingCost === undefined || startShippingCost == '') {
                            startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);
                        } else {
                            if (parseFloat(startShippingCost) > parseFloat(parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue))) {
                                startShippingCost = parseFloat(parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue))
                            }
                        }

                        endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);
                    } else {
                        if (startShippingCost == 0 || startShippingCost === undefined || startShippingCost == '') {
                            startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);
                        } else {
                            if (parseFloat(startShippingCost) > parseFloat(eachCountryShippingDetails[shippingDetails[val].express])) {
                                startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express])
                            }
                        }

                        endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);
                    }


                    if (parseFloat(eachCountryShippingDetails.weight_from) <= (parseFloat(shippingCalc[val].weight)) && parseFloat(eachCountryShippingDetails.weight_to) >= (parseFloat(shippingCalc[val].weight))) {

                        if (currency == 'USD') {

                            if (!startShippingCost || startShippingCost === undefined || startShippingCost == '')
                                startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);

                            endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue);

                            shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * (parseFloat(eachCountryShippingDetails[shippingDetails[val].express]) / parseFloat(inrValue)))
                        } else {

                            if (!startShippingCost || startShippingCost === undefined || startShippingCost == '')
                                startShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);

                            endShippingCost = parseFloat(eachCountryShippingDetails[shippingDetails[val].express]);

                            shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * parseFloat(eachCountryShippingDetails[shippingDetails[val].express]))

                        }

                    }

                }
            })

            // console.log( 'getShippingCost shipping cost mid' ,shippingCalc)
            // if shipping cost for particular weight not found then take value outside the range

            if (shippingCalc[val].shippingCost == 0) {
                if (parseFloat(startShippingRange) > (parseFloat(shippingCalc[val].weight)))
                    shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * parseFloat(startShippingCost))

                if (parseFloat(endShippingRange) < (parseFloat(shippingCalc[val].weight)))
                    shippingCalc[val].shippingCost = parseFloat(shippingCalc[val].shippingCost) + (parseFloat(shippingCalc[val].weight) * parseFloat(endShippingCost))

            }

            totalShipCost = 0;
            finalshippingCost = 0;
            if (currency == 'USD') {
                finalshippingCost = parseFloat(shippingCalc[val].shippingCost);
                totalShipCost = parseFloat(shippingCalc[val].shippingCost) > parseFloat(5) ? parseFloat(shippingCalc[val].shippingCost) : 5;
            } else {
                finalshippingCost = parseFloat(shippingCalc[val].shippingCost);
                totalShipCost = parseFloat(shippingCalc[val].shippingCost) > parseFloat(40) ? parseFloat(shippingCalc[val].shippingCost) : 40;
            }

            //shippingCalc[val].shippingCost =   parseFloat(shippingCalc[val].shippingCost).toFixed(2)

            shippingCalc[val].shippingCost = parseFloat(totalShipCost).toFixed(2)
            shippingCalc[val].finalShippingCost = parseFloat(finalshippingCost).toFixed(2)

        })
    }
    // console.log( 'getShippingCost shipping cost' ,shippingCalc)
    return shippingCalc;//shippingCalc;
}


// Get Trending Tag wise Collection
export const getTrendingTagCollection = (products, type, tag) => {
    const items = products.filter(product => {
        return product.category === type && product.tags.includes(tag);
        // return product.category === type && product.tags.includes(tag);
    })
    return items.slice(0, 8)
}

// Get Trending Collection
export const getTrendingCollection = (products, type) => {
    const items = products.filter(product => {
        return product.category === type;
    })
    return items.slice(0, 28)
}

// Get Special 5 Collection
export const getSpecialCollection = (products, type) => {
    const items = products.filter(product => {
        return product.category === type;
    })
    return items.slice(0, 5)
}

// Get TOP Collection
export const getTopCollection = products => {
    const items = products.filter(product => {
        return product.rating > 4;
    })
    return items.slice(0, 8)
}

// Get New Products
export const getNewProducts = (products, type) => {
    const items = products.filter(product => {
        return product.new === true && product.category === type;
    })

    return items.slice(0, 8)
}
//
export const bindActionCreators = (products, type) => {
    const products1 = this.props.products.push(...products)
    return products1
}
// Get Related Items
export const getRelatedItems = (products, type) => {
    const items = products.filter(product => {
        return product.category === type;
    })
    return items.slice(0, 4)
}
// Get Related From Search 
// export const getRelatedItems = (products, type) => {
//     const items = products.filter(product => {
//         return product.category === type;
//     })
//     return items.slice(0,4)

// }


// Get Best Seller Furniture
export const getBestSellerProducts = (products, type) => {
    const items = products.filter(product => {
        return product.sale === true && product.category === type;
    })

    return items.slice(0, 8)
}

// Get Best Seller
export const getBestSeller = products => {
    const items = products.filter(product => {
        return product.sale === true;
    })

    return items.slice(0, 8)
}

// Get Mens Wear
export const getMensWear = products => {
    const items = products.filter(product => {
        return product.category === 'men';
    })

    return items.slice(0, 8)
}

// Get Womens Wear
export const getWomensWear = products => {
    const items = products.filter(product => {
        return product.category === 'women';
    })

    return items.slice(0, 8)
}

// Get Single Product
export const getSingleItem = (products, id) => {

    const items = products.find((element) => {
        return element.id === id;
    })
    return items;
}
