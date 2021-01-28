import shop from "../api/shop";
import * as types from "../constants/ActionTypes";
import store from "../store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ls from "local-storage";
import axios from "axios";
import { getCookie, setCookie } from "../functions";
import { ApiUrl, SellerUrl } from "../constants/ActionTypes";
import { IntlActions } from "react-redux-multilingual";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { localhost } from "../constants/variable";
// import { css$1 } from "react-select/dist/chunk-9e023caa.cjs.dev";

//get All Units
export const receiveUnits = units => ({
  type: types.RECEIVE_UNITS,
  units
});
export const getAllUnits = () => dispatch => {
  try {
    shop.getUnits(units => {
      dispatch(receiveUnits(units));
      return units;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

//Log Out
export const receiveLogOut = () => ({
  type: types.USER_LOGOUT
});
export const getLogOut = () => dispatch => {
  try {
    axios.post(
      `${SellerUrl}/get_logged_out.php`,
      { sellerid: ls.get('sellerid'), security_token: "", plateform_type: "" },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(response => {
      setCookie("mhinpbn", "", -1);
      setCookie("currency", "", -1);
      setCookie("countryid", "", -1);
      setCookie("country_name", "", -1);
      setCookie("country_code", "", -1);

      ls.remove('sellerid')
      ls.remove('AUTH')
      dispatch(receiveLogOut());
      dispatch(getCartLength(null,''));
      //window.location.href = SellerUrl + '/logout.php'
      var url_origin = '';
      url_origin = window.location.origin;
      var url_type = '';
      switch(url_origin){
      case 'http://localhost:3000' :
        url_type = 'lo';
        break;
        case 'https://beldara.com' :
        url_type = 'go';
        break;
        case 'https://en.beldara.com' :
        url_type = 'en';
        break;
        case 'https://uat.beldara.com' :
        url_type = 'uat';
        break;
      }
      window.location.href = SellerUrl + '/logout.php?type='+url_type;
    })
      .catch(error => {
        window.location.href = '/'
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log('Logout Unsuccesfull');
    window.location.href = '/'
  }
};

//FB and Google Login
export const getUserRegister = (email, familyName, givenName, name, imageUrl, id) => dispatch => {
  axios.post(
    `${ApiUrl}/common/get_user_register.php`,
    { email: email, visitorid: getCookie('mhinpbnb'), lname: familyName, fname: givenName, name: name, imageUrl: imageUrl, id: id, security_token: "", plateform_type: "" },
    { headers: { "Content-Type": "multipart/form-data" } }
  )
    .then(response => {
      if (response.data.statusId == '1') {

        setCookie("mhinpbn", response.data.result.sellerid, 365);
        setCookie("mhinpbnb", response.data.result.visitorid, 365);

        if (getCookie('country_code') === undefined || getCookie('country_code') == '') {
          setCookie('country_code', response.data.result.country, 365);
          setCookie('country_name', response.data.result.country_name, 365);
          setCookie('countryid', response.data.result.countryid, 365);
        }

        ls.set("AUTH", response.data.result.sellerid);
        dispatch(ReceiveLoggedIn(response.data.result));
        dispatch(IntlActions.setLocale(response.data.result.language));
      }
      // return response.data.result.products;
    })
    .catch(error => {
      const result = error.response;
      return Promise.reject(result);
    });
};


//Login
export const ReceiveLoggedIn = user => ({
  type: types.RECEIVE_LOGIN,
  user
});

export const getLoggedIn = () => dispatch => {
  // shop.getProducts(products => {
  // dispatch(receiveProducts(products));
  // return products;
  // })x
  // console.log(getCookie("mhinpbn"))
  let sellerid = getCookie("mhinpbn");
  if (ls.hasOwnProperty("sellerid")) {
    // get the key's value from localStorage
    // let value = localStorage.getItem(sellerid);
    // // parse the localStorage string and setState
    // try {
    // value = JSON.parse(value);
    // this.setState({ [key]: value });
    // } catch (e) {
    // // handle empty string
    // this.setState({ [key]: value });
    // }
  } else if (sellerid && sellerid!='' && sellerid!==undefined){
    ls.set("sellerid", sellerid);
    ls.set("log_id",parseInt(sellerid))

    //console.log("ls set:" + ls.set("sellerid", sellerid));
    //if (!ls.get("AUTH")) {
    try {
      axios
        .post(
          `${ApiUrl}/common/get_user_detail.php`,
          { sellerid: sellerid, security_token: "", plateform_type: "" },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
          ls.set("AUTH", response.data.result.sellerid);
          setCookie('mhinpbnb', response.data.result.visitorid, 365)

          if (getCookie('country_code') === undefined || getCookie('country_code') == '') {
            setCookie('country_code', response.data.result.country, 365)
            setCookie('country_name', response.data.result.country_name, 365)
            setCookie('countryid', response.data.result.countryid, 365);
          }

          // ls.set("language", response.data.result.language);
          dispatch(ReceiveLoggedIn(response.data.result));
          // return response.data.result.products;
        })
        .catch(error => {
          // const result = error.response;
          // return Promise.reject(result);
        });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
    //}
  }
  if (getCookie("mhinpbn") === "") {
    ls.remove("AUTH");
    ls.remove("sellerid");
    dispatch(ReceiveLoggedIn(""));
  }
};

////GET CURRENCY VALUE
export const receiveCurrencyValue = currencyValue => ({
  type: types.CURRENCY_VALUE,
  currencyValue
});
export const getAllCurrencyValue = () => dispatch => {
  try {
    shop.getCurrencyValue(currencyValue => {
      dispatch(receiveCurrencyValue(currencyValue));
      return currencyValue;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};
////GET Total VALUE
export const receiveTotalValue = value => ({
  type: types.TOTAL_VALUE,
  value
});
export const getTotalCost = value => dispatch => {
  try {
    dispatch(receiveTotalValue(value));
    return value;
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

//update User
export const getUpdateUser = sellerid => dispatch => {
  try {
    axios
      .post(
        `${ApiUrl}/common/get_user_detail.php`,
        { sellerid: sellerid, security_token: "", plateform_type: "" },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        ls.set("AUTH", response.data.result.sellerid);
        ls.set("sellerid", response.data.result.sellerid);
        setCookie('mhinpbnb', response.data.result.visitorid)
        dispatch(ReceiveLoggedIn(response.data.result));
        dispatch(getCartLength(response.data.result.sellerid,getCookie('mhinpbnb')))

        dispatch(IntlActions.setLocale(response.data.result.language));


        // return response.data.result.products;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
};

//
//Get Language
export const receiveLanguage = languageMaster => ({
  type: types.RECEIVE_LANGUAGE_MASTER,
  languageMaster
});

export const getAllLanguages = domain => async dispatch => {
  try {
    // await axios.post(`${ApiUrl}/common/get_language_master.php`,{security_token:'',plateform_type:''}, {headers: {'Content-Type': 'multipart/form-data'}})
    // .then(response => {

    // dispatch(receiveLanguage(response.data.result));
    // return response.data.result;
    // })
    // .catch(error => {
    // const result = error.response;
    // return Promise.reject(result);
    // });
    var langCode;
    // switch (domain) {
    // case "CHINESE":
    // langCode = {
    // id: "4",
    // code: "zh",
    // language: "中文",
    // main_language: "Chinese",
    // url: "https://chinese.beldara.com"
    // };
    // break;
    // case "HINDI":
    // langCode = {
    // id: "12",
    // code: "hi",
    // language: "हिंदी",
    // main_language: "Hindi",
    // url: "https://hindi.beldara.com"
    // };
    // break;

    // case "ARABIC":
    // langCode = {
    // id: "13",
    // code: "ar",
    // language: "عربى",
    // main_language: "Arabic",
    // url: "https://beldara.com"
    // };
    // break;

    // case "GERMAN":
    // langCode = {
    // id: "15",
    // code: "de",
    // language: "Deutsche",
    // main_language: "German",
    // url: "https://german.beldara.com"
    // };
    // break;

    // default:
    // langCode = {
    // id: "3",
    // code: "en",
    // language: "English",
    // main_language: "English",
    // url: "https://beldara.com"
    // };
    // break;
    // }
    langCode = [
      {
        id: "3",
        code: "en",
        language: "English",
        main_language: "English",
        url: "https://beldara.com"
      },
      {
        id: "12",
        code: "hi",
        language: "हिंदी",
        main_language: "Hindi",
        url: "https://hindi.beldara.com"
      },
      {
        id: "4",
        code: "zh",
        language: "中文",
        main_language: "Chinese",
        url: "https://chinese.beldara.com"
      },
      {
        id: "13",
        code: "ar",
        language: "عربى",
        main_language: "Arabic",
        url: "https://arabic.beldara.com"
      },
      {
        id: "15",
        code: "de",
        language: "Deutsche",
        main_language: "German",
        url: "https://german.beldara.com"
      },
      {
        id: "5",
        code: "ru",
        language: "русский",
        main_language: "russian",
        url: "https://russian.beldara.com"
      }
    ];
    dispatch(receiveLanguage(langCode));
    return langCode;
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
};
///

//

export const fetchProductsBegin = () => ({
  type: types.FETCH_PRODUCTS_BEGIN
});

//
export const searchProducts = searchResults => ({
  type: types.SEARCH_PRODUCTS,
  searchResults
});

export const getSearchResults = (from, limit) => dispatch => {
  dispatch(fetchProductsBegin());
  try {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    var query = params.get("q");
    return axios
      .post(
        `${ApiUrl}/common/search_result1.php`,
        {
          term: query,
          sellerid: ls.get("sellerid"),
          security_token: "",
          plateform_type: "",
          from: from,
          limit: limit
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        // console.log(response.data.result)
        //dispatch(searchProducts(response.data.result));

        return response.data.result;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
  // shop.getSearchProducts(searchResults => {
  // console.log(searchResults)
  // dispatch(searchProducts(searchResults));
  // return searchResults;
  // })
};
////// Wholesale of the day

export const receiveWholesaleDay = product => ({
  type: types.RECEIVE_WHOLESALE_PRODUCT,
  product
});
export const getWholesaleDay = () => dispatch => {
  dispatch(showLoading("sectionBar"));

  axios.post(`${ApiUrl}/common/get_wholesale_of_day.php`,
    {
      security_token: "",
      plateform_type: "",
      sellerid: getCookie('mhinpbn'),
      visitorid: getCookie('mhinpbnb')
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  )
    .then(response => {

      dispatch(receiveWholesaleDay(response.data.result));

      return response.data.result.products;
    })
    .catch(error => {
      const result = error.response;
      return Promise.reject(result);
    });
  // shop.getRecentSearch(products => {
  //   dispatch(receiveWholesaleDay(products));
  //   return products;
  // });
  dispatch(hideLoading("sectionBar"));
};

////// Recent Search

export const receiveRecentProducts = product => ({
  type: types.RECEIVE_RECENT_PRODUCTS,
  product
});
export const getRecentSearch = () => dispatch => {
  dispatch(showLoading("sectionBar"));
  axios.post(`${ApiUrl}/common/recent_search.php`,
    {
      security_token: "",
      plateform_type: "",
      sellerid: getCookie('mhinpbn'),
      visitorid: getCookie('mhinpbnb')
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  )
    .then(response => {

      dispatch(receiveRecentProducts(response.data.result));

      return response.data.result.products;
    })
    .catch(error => {
      const result = error.response;
      return Promise.reject(result);
    });
  // shop.getRecentSearch(products => {
  //   dispatch(receiveRecentProducts(products));
  //   return products;
  // });
  dispatch(hideLoading("sectionBar"));
};

////// Recommended Products

export const receiveRecommendedProduct = product => ({
  type: types.RECEIVE_RECOMMENDED_PRODUCT,
  product
});
export const getRecommendedProducts = () => dispatch => {
  dispatch(showLoading("sectionBar"));

  axios.post(`${ApiUrl}/common/recommended_product.php`,
    {
      security_token: "",
      plateform_type: "",
      sellerid: getCookie('mhinpbn'),
      visitorid: getCookie('mhinpbnb')
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  )
    .then(response => {
      dispatch(receiveRecommendedProduct(response.data.result));

      return response.data.result.products;
    })
    .catch(error => {
      const result = error.response;
      return Promise.reject(result);
    });

  // shop.getRecommendation(products => {
  //   dispatch(receiveRecommendedProduct(products));
  //   return products;
  // });
  dispatch(hideLoading("sectionBar"));
};

///Chat with Supplier State pass

export const receiveChat = chatWithSupplier => ({
  type: types.RECEIVE_CHAT,
  chatWithSupplier
});
export const getChatWithSupplier = (data) => dispatch => {
  //  let statePass = {
  //    sellerid:data,
  //    chatWithSupplier:true
  //  }
   dispatch(receiveChat(data))
};

////// Top Products

export const receiveProducts = products => ({
  type: types.RECEIVE_PRODUCTS,
  products
});
export const getAllProducts = () => dispatch => {
  dispatch(showLoading("sectionBar"));
  dispatch(fetchProductsBegin());
  shop.getProducts(products => {
    dispatch(receiveProducts(products));
    return products;
  });
  dispatch(hideLoading("sectionBar"));
};
///////////////////
///////
export const fetchSingleProduct = productId => ({
  type: types.FETCH_SINGLE_PRODUCT,
  productId
});

//remove single product
export const ClearSingleProduct = () => ({
  type: types.CLEAR_SINGLE_PRODUCT,
});

/////////Fetch Single Product
export const SingleProduct = productId => ({
  type: types.SINGLE_PRODUCT,
  productId
});
export const getSingleProduct = url => dispatch => {
  try {
    dispatch(ClearSingleProduct(''));
    return axios
      .post(
        `${ApiUrl}/common/fetch_single_prod.php`,
        // `${ApiUrl}/common/fetch_single_prod_test.php`,
        {
          url: url,
          sellerid: ls.get("sellerid"),
          security_token: "",
          plateform_type: ""
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        dispatch(SingleProduct(response.data.result));
        // return Promise.reject(error)
        return response.data.result;
        // return Promise.resolve()
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
};

///// Get products By Category
export const productsByCategory = searchResults => ({
  type: types.RECEIVE_PRODUCTSBYCATEGORY,
  searchResults
});

export const getSearchResultsByCategory = (from, limit, query) => dispatch => {
  //dispatch(fetchProductsBegin());
  try {
   return axios
      .post(
        `${ApiUrl}/common/search_result_cat.php`,
        {
          term: query,
          sellerid: ls.get("sellerid"),
          security_token: "",
          plateform_type: "",
          from: from,
          limit: limit
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        
        //dispatch(productsByCategory(response.data.result));
        return response.data.result;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
  // shop.getSearchProducts(searchResults => {
  // console.log(searchResults)
  // dispatch(searchProducts(searchResults));
  // return searchResults;
  // })
};

//Get Products by LP \ getProductsByLP
export const clearState = () => ({
  type: types.CLEAR_ALL_STATE
});

//Get Products by LP \ getProductsByLP
export const receiveProductsByLP = ProductsByLP => ({
  type: types.RECEIVE_PRODUCTSBYLP,
  ProductsByLP
});

export const getProductsByLP = (cat_id,type,datatype)=> dispatch => {
  if(type == '1'){
    axios.post("https://api.beldara.com/common/get_prod_by_lp.php",
      { security_token: "", plateform_type: "", cat_id: cat_id },
      {headers: {'Content-Type': 'multipart/form-data'}}
    )
    .then(response => {
      dispatch(receiveProductsByLP(response.data.result));
    })
    .catch(error => {
      const result = error.response;
      return Promise.reject(result);
    });
  }else{
    axios.post("https://api.beldara.com/common/get_prod_by_lp_universal.php",
      { security_token: "", plateform_type: "", term :cat_id,sellerid:ls.get('sellerid'),type:datatype,currency:"INR",user_cat:cat_id},
      {headers: {'Content-Type': 'multipart/form-data'}}
    )
    .then(response => {
      console.log(200,'lp',response)
      dispatch(receiveProductsByLP(response.data.result));
    })
    .catch(error => {
      const result = error.response;
      return Promise.reject(result);
    });
  }
};

//////Get RElated Products
export const receiveRelatedProducts = products => ({
  type: types.RECEIVE_RELATED_PRODUCTS,
  products
});
export const getRelatedProducts = productId => dispatch => {
  try {
    axios
      .post(
        "https://api.beldara.com/common/get_seller_related_prod.php",
        { prod_id: productId, security_token: "", plateform_type: "" },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        dispatch(receiveRelatedProducts(response.data.result));
        return response.data.result;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

/////Get Banners
export const receiveBanners = banners => ({
  type: types.RECEIVE_BANNERS,
  banners
});
export const getAllBanners = language => dispatch => {
  try {
    var data = [];
    shop.getBanners(banners => {
      banners.forEach(item => {
        if (item.lang === language) data.push(item);
      });
      dispatch(receiveBanners(data));
      return data;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};
////
export const receiveCountry = data => ({
  type: types.RECEIVE_COUNTRY,
  data
});
export const getAllCountry = () => dispatch => {
  try {
    shop.getCountries(data => {
      dispatch(receiveCountry(data));
      return data;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};
// Get All Landing Page
export const receiveLP = lp => ({
  type: types.RECEIVE_LP,
  lp
});
export const getAllLP = () => dispatch => {
  try {
    shop.getLP(lp => {
      dispatch(receiveLP(lp));
      return lp;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

///Get all Testomonails
export const receiveTM = tm => ({
  type: types.RECEIVE_TM,
  tm
});
export const getAllTM = () => dispatch => {
  try {
    shop.getTM(tm => {
      dispatch(receiveTM(tm));
      return tm;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};
////GET ALL BRANDS
export const receiveBrands = brands => ({
  type: types.RECEIVE_BRANDS,
  brands
});
export const getAllBrands = () => dispatch => {
  try {
    shop.getBrands(brands => {
      dispatch(receiveBrands(brands));
      return brands;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};
/////Get StoreFront
export const receiveStoreFront = store => ({
  type: types.RECEIVE_STORE,
  store
});
// export const getStoreFront = (surl) => async (dispatch) => {
// try {
// // console.log('Ho')
// axios.post("https://api.beldara.com/common/SFData.php",{security_token:'',plateform_type:'',surl:surl}, {headers: {'Content-Type': 'multipart/form-data'}})
// .then(response => {
// console.log(response)
// dispatch(await receiveStoreFront(response.data.result));
// return response.data.result;
// })
// .catch(error => {
// const result = error.response;
// return Promise.reject(result);
// });

// } catch (e){
// console.log(`😱 File not found: ${e}`);
// }
// }
export function getStoreFront(surl) {
  try {
    // console.log('Ho')
    return async dispatch => {
      await axios
        .post(
          "https://api.beldara.com/common/SFData.php",
          { security_token: "", plateform_type: "", surl: surl },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
          dispatch(receiveStoreFront(response.data.result));
          return response.data.result;
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    };
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
}

// get Seller Products
export const receiveSellerProducts = products => ({
  type: types.RECEIVE_SELLER_PRODUCTS,
  products
});
export const getSellerProducts = (sellerid, offset, limit) => dispatch => {
  try {
    // console.log('Ho')
    axios
      .post(
        "https://api.beldara.com/common/MyProductList.php",
        {
          security_token: "",
          plateform_type: "",
          sellerid: sellerid,
          limit: limit,
          from: offset
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        dispatch(receiveSellerProducts(response.data.result));
        return response.data.result;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

/////Get Career
export const receiveCareers = careers => ({
  type: types.RECEIVE_CAREERS,
  careers
});
export const getAllCareers = () => dispatch => {
  try {
    shop.getCareers(careers => {
      dispatch(receiveCareers(careers));
      return careers;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

/////Get Mediapr
export const receiveMediapr = mediapr => ({
  type: types.RECEIVE_MEDIA_PR,
  mediapr
});
export const getAllMediapr = () => dispatch => {
  try {
    shop.getMediapr(mediapr => {
      dispatch(receiveMediapr(mediapr));
      return mediapr;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

/////Get Buy Lead

export const receiveBuyLead = buyLead => ({
  type: types.RECEIVE_BUY_LEAD,
  buyLead
});

export const getAllBuyLead = (from, limit) => dispatch => {
  try {
    axios
      .post(
        `${ApiUrl}/common/buy_lead.php`,
        { security_token: "", plateform_type: "web", from: from, limit: limit },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        dispatch(receiveBuyLead(response.data));
        return response.data;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
};

/////Get MediaRelease
export const receiveMediaRelease = mediaRelease => ({
  type: types.RECEIVE_MEDIA_RELEASE,
  mediaRelease
});
export const getAllMediaRelease = () => dispatch => {
  try {
    shop.getMediaRelease(mediaRelease => {
      dispatch(receiveMediaRelease(mediaRelease));
      return mediaRelease;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

/////Get language content

export const receiveLangContent = langContent => ({
  type: types.RECEIVE_LANGUAGE_CONTENT,
  langContent
});

export const receiveLangContent_about_en = langContent => ({
  type: types.RECEIVE_LANGUAGE_CONTENT,
  langContent
});

// const dyfuncLang = (langContent, page, lang) => {
// {`return getAllLangContent_${page}_${lang}(${langContent})`}
// };

export const getAllLangContent = (page, lang) => dispatch => {
  try {
    shop.getLangContent(langContent => {
      dispatch(receiveLangContent(langContent));
      return langContent;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};

/////////Get All Categories
export const receiveCategories = categories => ({
  type: types.RECEIVE_CATEGORIES,
  categories
});
export const getAllCategories = () => dispatch => {
  try {
    shop.getCategories(categories => {
      // console.log(categories)
      dispatch(receiveCategories(categories));
      return categories;
    });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
};


// Start Order
export const receiveStartOrder = cart => ({
  type: types.CREATE_ORDER,
  cart
});

export const startYourOrder = (cartItems, symbol, totalProductCost, totalShippingCost, totalCartValue, sellerid) => dispatch => {

  try {
    axios.post(
      `${ApiUrl}/common/create_order.php`,
      { security_token: "", plateform_type: "", cartItems: cartItems, symbol: symbol, totalProductCost: totalProductCost, totalShippingCost: totalShippingCost, totalCartValue: totalCartValue, sellerid: sellerid },
      { headers: { "Content-Type": "multipart/form-data" } }
    )
      .then(async response => {
        dispatch(receiveStartOrder(response.data.result));
        return response.data.result;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
};

//it seems that I should probably use this as the basis for "Cart"
export const receiveCart = (cart, symbol) => ({
  type: types.GET_CART,
  cart, symbol
});

export const receiveGetCart = (cart, symbol, inrValue) => ({
  type: types.RECEIVE_GET_CART,
  cart, symbol, inrValue
});

// dispatch({
//   type: types.CHANGE_QTY,
//   pid, qty, symbol, inrValue, usdValue
//  });

export const emptyCart = cart => ({
  type: types.EMPTY_CART,
  cart
});

export const getCart = (sellerid, visitorid, symbol, inrValue) => dispatch => {

  dispatch(emptyCart(''));
  //toast.success("Item Added to Cart");
  try {
    // if (sellerid) {

    return axios.post(
      `${ApiUrl}/common/get_cart.php`,
      { security_token: "", plateform_type: "", sellerid: sellerid, visitorid: visitorid },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(async response => {
      if (response.data.result) {

        dispatch(receiveGetCart(response.data.result, symbol, inrValue));
      }
      return response.data.result;
    }).catch(error => {
      const result = error.response;
      return Promise.reject(result);
    });
    // } else {
    //   return null
    // }
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }

};



export const addToCart = (product, qty) => dispatch => {
  toast.success("Item Added to Cart");
  dispatch(addToCartUnsafe(product, qty));
};


export const addToCartAndRemoveWishlist = (product, qty) => dispatch => {
  toast.success("Item Added to Cart");

  dispatch(addToCartUnsafe(product, qty));
  dispatch(removeFromWishlist(product));
};
export const addToCartUnsafe = (product, qty) => ({
  type: types.ADD_TO_CART,
  product,
  qty
});
export const removeFromCart = cartitemid => dispatch => {
  toast.error("Item Removed from Cart");
  try {
    axios.post(
      `${ApiUrl}/common/delete_cart_item.php`,
      { security_token: "", plateform_type: "web", cartitemid: cartitemid },
      { headers: { "Content-Type": "multipart/form-data" } }
    )
      .then(response => {
        dispatch({
          type: types.REMOVE_FROM_CART,
          cartitemid
        });
        return response.data;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
};

export const changeQty = (productid, cartitemid, qty, symbol, inrValue, usdValue) => dispatch => {

  try {
    axios.post(
      `${ApiUrl}/common/update_cart_test.php`,
      { security_token: "", plateform_type: "", cartitemid: cartitemid, qty: qty, productid: productid, currency: symbol,country_to:getCookie('countryid'),method:'air',country_code:getCookie('country_code') },
      { headers: { "Content-Type": "multipart/form-data" } }
    )
      .then(response => {
        dispatch({
          type: types.CHANGE_QTY,
          productid, qty, symbol, inrValue, usdValue
        });
        return response.data;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }

};

export const incrementQty = (productid, cartitemid, qty, symbol, inrValue, usdValue) => dispatch => {

  try {
    axios.post(
      `${ApiUrl}/common/update_cart.php`,
      { security_token: "", plateform_type: "", cartitemid: cartitemid, qty: qty },
      { headers: { "Content-Type": "multipart/form-data" } }
    )
      .then(response => {
        dispatch({
          type: types.CHANGE_QTY,
          productid, qty, symbol, inrValue, usdValue
        });
        return response.data;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }

};

export const updateCart = (symbol, inrValue, usdValue) => dispatch => {
  dispatch({
    type: types.RECEIVE_CART,
    symbol, inrValue, usdValue
  });
};

export const calcCart = () => dispatch => {
  dispatch({
    type: types.RECEIVE_CART
  });
};

export const decrementQty = (productid, cartitemid, qty, symbol, inrValue, usdValue) => dispatch => {
  toast.warn("Item Decrement Qty to Cart");

  try {
    axios.post(
      `${ApiUrl}/common/update_cart.php`,
      { security_token: "", plateform_type: "", cartitemid: cartitemid, qty: qty },
      { headers: { "Content-Type": "multipart/form-data" } }
    )
      .then(response => {
        dispatch({
          type: types.CHANGE_QTY,
          productid, qty, symbol, inrValue, usdValue
        });
        return response.data;
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
};

//it seems that I should probably use this as the basis for "Wishlist"
export const addToWishlist = product => dispatch => {
  toast.success("Item Added to Wishlist");
  dispatch(addToWishlistUnsafe(product));
};
export const addToWishlistUnsafe = product => ({
  type: types.ADD_TO_WISHLIST,
  product
});
export const removeFromWishlist = product_id => dispatch => {
  toast.error("Item Removed from Wishlist");
  dispatch({
    type: types.REMOVE_FROM_WISHLIST,
    product_id
  });
};

//Compare Products
export const addToCompare = product => dispatch => {
  toast.success("Item Added to Compare");
  dispatch(addToCompareUnsafe(product));
};
export const addToCompareUnsafe = product => ({
  type: types.ADD_TO_COMPARE,
  product
});
export const removeFromCompare = product_id => ({
  type: types.REMOVE_FROM_COMPARE,
  product_id
});

// Filters
export const filterBrand = brand => ({
  type: types.FILTER_BRAND,
  brand
});
export const filterColor = color => ({
  type: types.FILTER_COLOR,
  color
});
export const filterPrice = value => ({
  type: types.FILTER_PRICE,
  value
});
export const filterSort = sort_by => ({
  type: types.SORT_BY,
  sort_by
});

// Currency
export const changeCurrency = symbol => ({
  type: types.CHANGE_CURRENCY,
  symbol
});

export const cartListItems = cartLength => ({
  type: types.CART_LENGTH,
  cartLength
});

export const clearCartListItems = () => ({
  type: types.REMOVE_CART_LENGTH
})

//fetch cartlength
export const getCartLength = (sellerid,visitorid) => dispatch => {
  try{
    // console.log(sellerid,visitorid,1256);
    dispatch(clearCartListItems());
    axios
      .post(
        `${ApiUrl}/common/getCartlength.php`,
        {
          sellerid:sellerid,
          security_token:"",
          plateform_type:"web",
          visitor_id:visitorid
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(response => {
        // console.log(response.data.result,1256);
        dispatch(cartListItems(response.data.result));
        // return Promise.reject(error)
        // return response.data.result;
        // return Promise.resolve()
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  }catch(e){
    console.log(`😱 Axios request failed: ${e}`);
  }
}
