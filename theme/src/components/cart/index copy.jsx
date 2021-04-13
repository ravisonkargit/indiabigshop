import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import ls from "local-storage";
import Breadcrumb from "../common/breadcrumb";
import {getCartTotal, getShippingCost, getTotalCartValue, getTotalShippingCost } from "../../services";
import { removeFromCart, incrementQty, decrementQty, changeQty, getCart, updateCart,   getAllCountry, receiveGetCart, receiveCart} from "../../actions";
import store from "../../store";
import { imgUrl } from "../../constants/variable";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import * as types from "../../constants/ActionTypes";
import $ from "jquery";
import { captureEvent, getCookie } from "../../functions";
import LoadingComponent from "../products/common/loading-bar";

var countryOfSeller = [];
var tshipcost = 0;
var tproductcost = 0;
var tcartcost = 0;
var defaultCountry = [];
class cartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCartValue: 0,
      totalProductCost: 0,
      totalShippingCost: 0,
      cartItems: null,
      symbol: "INR",
      usdValue: 1,
      inrValue: 1,
      update: 0,
      shippingCharges: [],
      // shippingCountry: 93,
      // shippingCountryName: 'Afghanistan',
      express: "air",
      simProduct: "",
      shippingNotAvailable: 0,
      shippingDetails: [],
      reloadAgain: 0,
      isShippingCountry: 0,
      isPageLoaded: 0,
      cartid: "",
      buyer_country: "",
      buyer_country_id: "",
      buyer_country_name: "",
      is_price_above_threshold: 0,
      min_threshold_inr: 500,
      min_threshold: 500,
      min_threshold_amount_inr: 50,
      min_threshold_amount: 50
    };
  }

  componentDidMount() {
    // is logged in then get cart products
    if (ls.get('sellerid')) {
      try {
        store.dispatch(getCart(ls.get("sellerid"),getCookie("mhinpbnb"),this.props.data.symbol)).then(response => {
          if (response)
            store.dispatch(receiveGetCart(response, this.props.data.symbol));
          
          if (this.state.isPageLoaded == 0) {
            this.setState({
              isPageLoaded: 1
            });
          }

        });
      } catch (e) {
        console.log('not found');
      }
    }
    store.dispatch(getAllCountry());

    var toast = $('#toast_message').detach();
    $(toast).insertAfter('.breadcrumb-section');
  }

  UNSAFE_componentWillReceiveProps = async nextProps => {
    console.log("test");
    const {shippingCountry, shippingCountryName, totalProductCost, min_threshold, is_price_above_threshold, totalShippingCost, totalCartValue, min_threshold_amount, buyer_country_id , inrValue, usdValue} = this.state

    try {
      // update cart value with changed currency
      if (nextProps.data.symbol != this.props.data.symbol) {
        store.dispatch(updateCart(nextProps.data.symbol,inrValue,usdValue));
      }

      // set country of user
      if (nextProps.user) {
        if (nextProps.user.user) {
          await this.setState({
            hasCountry: 1
          })

          if (
            nextProps.user.user.countryid &&
            nextProps.user.user.country_name &&
            !shippingCountry &&
            !shippingCountryName
          ) {
            await this.setState({
              shippingCountry: nextProps.user.user.countryid,
              shippingCountryName: nextProps.user.user.country_name
            });
            defaultCountry = [
              {
                value: shippingCountry,
                label: shippingCountryName
              }
            ];
          }
        }
      }

      // if user country not saved then check in cookie
      if (getCookie("countryid") && (!shippingCountry || shippingCountry == "")) {
        await this.setState({
          hasCountry: 1
        })
        await this.setState({
          shippingCountry: getCookie("countryid"),
          shippingCountryName: getCookie("country_name")
        });
        defaultCountry = [
          {
            value: shippingCountry,
            label: shippingCountryName
          }
        ];
      }
    } catch (e) {
      console.log("can not set country");
    }

    // get cart details is not gathered already
    let temp = 0;
    if (ls.get("sellerid") && nextProps.cartList.cart) {
      
      if (nextProps.cartList.cart.length == 0) {
        store.dispatch(getCart(ls.get("sellerid"), this.props.data.symbol)).then(response => {
            if (response)
              store.dispatch(receiveCart(response, this.props.data.symbol));

            if (this.state.isPageLoaded == 0) {
              this.setState({
                isPageLoaded: 1
              });
            }
          });
      } else {
        if (this.state.isPageLoaded == 0) {
          this.setState({
            isPageLoaded: 1
          });
        }
      }
    }

    // mark as pagerloaded so that is sellerid is not available (user not logged in) then stop loader
    if (!ls.get("sellerid") && this.state.isPageLoaded == 0) {
      this.setState({
        isPageLoaded: 1
      });
    }

    // check in next props if cartlist is received, if yes than change cart count
    if (nextProps.cartList.cart) {
      if (nextProps.cartList.cart.length > 0) {
        $(".cart_badge").text(nextProps.cartList.cart.length);
        if (this.state.reloadAgain == 0) {
          this.setState({
            reloadAgain: 1
          });

          // run change qty in cart to update cart detail first time
          nextProps.cartList.cart.forEach(async (res, ind) => {
            let productid = res.productid;
            let qty = res.qty;
            let symbol = this.props.data.symbol;
            let inrValue, usdValue
            try {
              inrValue = this.props.currencyValue.currencyValue[0].INR;
              usdValue = this.props.currencyValue.currencyValue[0].USD;
            } catch (e) {
              inrValue = 70;
              usdValue = 1;
            }
            await store.dispatch({
              type: types.CHANGE_QTY,
              productid,qty,symbol,inrValue,usdValue
            });
          });
        }
      }
    }
    
    // update usd value
    try {
      if (this.state.usdValue != nextProps.currencyValue.currencyValue[0].USD) {
        await this.setState({
          usdValue: nextProps.currencyValue.currencyValue[0].USD
        });
      }
    } catch (e) {
      await this.setState({
        usdValue: 1
      });
    }
   // update inr value
    try {
      if (this.state.inrValue != nextProps.currencyValue.currencyValue[0].INR) {
        await this.setState({
          inrValue: nextProps.currencyValue.currencyValue[0].INR
        });
      }
    } catch (e) {
      await this.setState({
        inrValue: 70
      });
    }

    // set cart details in state
    await this.setState({
      cartItems: nextProps.cartList.cart,
      symbol: nextProps.data.symbol
    });

    // update cart
    if (nextProps.cartList.cart) {
      if (inrValue != "1" && nextProps.cartList.cart.length != 0) {
        if (this.state.update == 0) {
          store.dispatch( updateCart( this.state.symbol, inrValue, usdValue ) );
          await this.setState({
            update: 1
          });
        }
      }

      // get shipping charges for seller abd buyer country
      let countryToCheck, countryid;
      countryOfSeller = [];
      nextProps.cartList.cart.forEach((eachcartitem, index) => {
        this.setState({
          cartid: eachcartitem.cartid
        });
        if (eachcartitem.name != "" && eachcartitem.name !== undefined) {
          {
            eachcartitem.sellerCountry
              ? (countryToCheck = eachcartitem.sellerCountry)
              : (countryToCheck = "india");
          }

          {
            eachcartitem.countryid
              ? (countryid = eachcartitem.countryid)
              : (countryid = 91);
          }

          if (!countryOfSeller[countryToCheck]) {
            countryOfSeller[countryToCheck] = {
              country: countryToCheck,
              shippingCost: 0,
              countryid: countryid,
              weight: parseFloat(0),
              express: this.state.express
            };
          }

          if (
            eachcartitem.weight !== undefined &&
            eachcartitem.weight != null &&
            eachcartitem.weight != "" &&
            parseFloat(eachcartitem.weight) > parseFloat(0.0)
          ) {
            countryOfSeller[countryToCheck]["weight"] =
              parseFloat(countryOfSeller[countryToCheck]["weight"]) +
              parseFloat(eachcartitem.weight) * eachcartitem.qty;
          } else {
            countryOfSeller[countryToCheck]["weight"] =
              parseFloat(countryOfSeller[countryToCheck]["weight"]) +
              eachcartitem.qty;
          }

              
        }
      });

      this.setState({
        shippingCharges: countryOfSeller
      });
    }

     
    
    
    // get cart value, totalproduct cost
    try {
      console.log('getCartTotal', nextProps.cartList.cart)
      await getCartTotal(nextProps.cartList.cart).then(async val => {
        if (totalProductCost != val) {
          console.log('set totalprice', totalProductCost, val)
          await this.setState({
            totalProductCost: val
          });
          console.log('getCartTotal', totalProductCost, val)
        }
        if ((buyer_country_id == '91' || (buyer_country_id != '91' && getCookie('country_code').toLowerCase() == 'in')) && parseFloat(totalProductCost) > parseFloat(min_threshold) ||
          ((buyer_country_id != '91' && buyer_country_id != '1') && (buyer_country_id === undefined || buyer_country_id === null || buyer_country_id == '') && getCookie('country_code').toLowerCase() != 'in' && getCookie('country_code').toLowerCase() != 'us')) {
          console.log('call shipping')
          this.handleShipping();
          this.handleCountry();
        }
        this.set_shipping_for_below_threshold(totalProductCost, min_threshold, is_price_above_threshold, min_threshold_amount, totalShippingCost, totalCartValue)
      });
    } catch (e) {
      console.log('get cart total')
    }

    // if (this.state.shippingCountry && this.state.shippingCountryName &&
    //   (this.state.buyer_country_id == '91' || (this.state.buyer_country_id != '91' && getCookie('country_code').toLowerCase() == 'in')) && parseFloat(this.state.totalProductCost) > parseFloat(this.state.min_threshold) ||
    //   ((this.state.buyer_country_id != '91' && this.state.buyer_country_id != '1') && (this.state.buyer_country_id === undefined || this.state.buyer_country_id === null || this.state.buyer_country_id == '') && getCookie('country_code').toLowerCase() != 'in' && getCookie('country_code').toLowerCase() != 'us')
    // ) {
    //   console.log('calling country 314',this.state.shippingCountry , this.state.shippingCountryName, this.state.totalProductCost , this.state.min_threshold)
    //   this.handleCountry();
    // }
  

    // this.handleCountry()
  };

  goToOrder = () => {

    const { totalShippingCost, buyer_country, buyer_country_id, totalProductCost, totalCartValue, shippingCountry, cartItems, symbol, buyer_country_name } = this.state;

    if ((
      (parseFloat(totalShippingCost) > parseFloat(0) && parseFloat(totalProductCost) > parseFloat(0) && parseFloat(totalCartValue) > parseFloat(0)) &&
      (buyer_country_id != '91' && buyer_country_id != '1') &&
      ((buyer_country_id.toLowerCase() == '' || buyer_country_id.toLowerCase() === undefined || buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase() != 'us' && getCookie('country_code').toLowerCase() != 'in')
    ) ||
      (parseFloat(totalProductCost) > parseFloat(0) && ((buyer_country_id == '91' || buyer_country_id == '1') || (buyer_country_id != '91' && buyer_country_id != '1' && (getCookie('country_code').toLowerCase() == 'us' || getCookie('country_code').toLowerCase() == 'in')))) ||
      (shippingCountry == "1" && parseFloat(totalProductCost) > parseFloat(0))
    ) {

      captureEvent("cart", "check_out", '{"cart":"' +
        JSON.stringify(cartItems) +
        '", "totalShippingCost":"' +
        totalShippingCost +
        '", "totalCartValue":"' +
        totalCartValue +
        '", "totalProductCost":"' +
        totalProductCost +
        '", "symbol":"' +
        symbol +
        '"}', "success", ls.get("sellerid"), getCookie("mhinpbnb")
      );
      var pixeldata = [];
      cartItems.forEach((val, i) => {
        if (i == 0)
          pixeldata = [{ 'id': val.productid, 'quantity': val.qty }];
        else
          pixeldata = [...pixeldata, { 'id': val.productid, 'quantity': val.qty }];
      })

      this.props.history.push({
        pathname:
          "/start-order/" +
          ls.get("sellerid") +
          "_" +
          parseInt(totalCartValue) +
          ".html",
        state: {
          totalCartValue: totalCartValue,
          totalProductCost: totalProductCost,
          totalShippingCost: totalShippingCost,
          cartItems: cartItems,
          countryName: this.state.shippingCountryName,
          symbol: symbol,
          cartid: this.state.cartid,
          pixeldata: pixeldata,
          shippingCharges: this.state.shippingCharges,
          inrValue: this.state.inrValue,
          buyer_country: buyer_country,
          buyer_country_id: buyer_country_id,
          buyer_country_name: buyer_country_name
        }
      });
      this.setState({
        shippingNotAvailable: 0
      });
    } else {
      captureEvent("cart","check_out",'{"cart":"' +JSON.stringify(this.state.cartItems) +'", "totalShippingCost":"' +this.state.totalShippingCost +'", "totalCartValue":"' +this.state.totalCartValue +'", "totalProductCost":"' +this.state.totalProductCost +'", "symbol":"' +this.state.symbol +'"}',"failure",ls.get("sellerid"),getCookie("mhinpbnb"));
      this.setState({
        shippingNotAvailable: 1
      });
    }
  };

  // Handle Shipping Country
  handleCountry = async e => {
   
    if (e) {
      await this.setState({
        shippingCountry: e.value,
        shippingCountryName: e.label
      });

      captureEvent("cart","country_change",this.state.shippingCountryName,this.state.express,ls.get("sellerid"),getCookie("mhinpbnb"));

    } else {
      console.log('calling to call all cost - fisrt else -  handleCountry');
      this.calc_all_cost(
        this.state.cartItems,
        this.state.shippingDetails,
        this.state.shippingCharges,
        this.state.shippingCountry,
        this.state.symbol,
        this.state.inrValue,
        this.state.usdValue,
        this.state.totalProductCost,
        getCookie('country_code')
      );
    }
  
    if ((this.state.buyer_country_id == '91' || (this.state.buyer_country_id != '91' && getCookie('country_code').toLowerCase() == 'in')) && parseFloat(this.state.totalProductCost) > parseFloat(this.state.min_threshold) ||
      ((this.state.buyer_country_id != '91' && this.state.buyer_country_id != '1') && (this.state.buyer_country_id === undefined || this.state.buyer_country_id === null || this.state.buyer_country_id == '') && getCookie('country_code').toLowerCase() != 'in' && getCookie('country_code').toLowerCase() != 'us')) {
      try {
        axios.post(
          "https://api.indiabigshop.com/common/calculate_country_wise_price.php",
          {
            security_token: "",
            plateform_type: "",
            sellerid: ls.get("sellerid"),
            country_to: this.state.shippingCountry,
            express: this.state.express
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        ).then(response => {
          this.setState({
            shippingDetails: response.data,
            isShippingCountry: response.data.statusId
          });
          console.log('calling to call all cost - country_wise -  handleCountry', this.state.totalProductCost, this.state.min_threshold);
          this.calc_all_cost(
            this.state.cartItems,
            response.data,
            this.state.shippingCharges,
            this.state.shippingCountry,
            this.state.symbol,
            this.state.inrValue,
            this.state.usdValue,
            this.state.totalProductCost,
            getCookie('country_code')
          );
        }).catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
      } catch (e) {
        console.log(' calc')
      }
    }
    
  };

  showToast(data) {
    
    $("#toast_message").removeClass('hide').addClass('show')
    if (data.statusId == '1')
      $('.toast-body').removeClass('bg-success bg-danger').addClass('bg-success').html('<span class="text-light"><i class="fa fa-check text-light"></i> ' + data.result + '</span>');
    else
      $('.toast-body').removeClass('bg-success bg-danger').addClass('bg-danger').html('<span class="text-light"><i class="fa fa-times text-light"></i> ' + data.result + '</span>');
    
    var clearint = setInterval(function () {
      $("#toast_message").removeClass('show').addClass('hide');
      clearInterval(clearint)
    }, 3000)
    
  }

  calc_all_cost = (cartItems,shippingDetails,shippingCharges,shippingCountry,symbol,inrValue,usdValue,totalProductCost,country_code) => {
    //if (country_code.toLowerCase() == 'in' || country_code == '') {
    if ((this.state.buyer_country_id == '91' || (this.state.buyer_country_id != '91' && getCookie('country_code').toLowerCase() == 'in')) && parseFloat(this.state.totalProductCost) > parseFloat(this.state.min_threshold) ||
    ((this.state.buyer_country_id != '91' && this.state.buyer_country_id != '1') && (this.state.buyer_country_id === undefined || this.state.buyer_country_id === null || this.state.buyer_country_id == '') && getCookie('country_code').toLowerCase() != 'in' && getCookie('country_code').toLowerCase() != 'us')){
      try {
        getShippingCost(
          cartItems,
          shippingDetails,
          shippingCharges,
          shippingCountry,
          symbol,
          inrValue,
          usdValue,
          country_code
        ).then(async val => {
          await this.setState({
            shippingCharges: val
          });
        });

        getTotalShippingCost(shippingCharges).then(async val => {
          await this.setState({
            totalShippingCost: val
          });
          console.log('calc_all_cost', this.state.totalShippingCost, val)
          getTotalCartValue(this.state.totalShippingCost, totalProductCost).then(
            val => {
              this.setState({
                totalCartValue: val
              });
              console.log('calc_all_cost insside', this.state.totalCartValue, val)
            }
            
          );
        });

      } catch (e) {
        console.log('calc')
      }
    }

  };

  decreaseOneQty = (pid, cid, qty, quantity, symbol, inr, usd) => {
    if (qty > 1 && qty > quantity) {
      --qty;
      captureEvent(
        "cart",
        "decrease_qty",
        '{"productid":"' +
        pid +
        '", "qty":"' +
        qty +
        '", "min_qty":"' +
        quantity +
        '", "symbol":"' +
        symbol +
        '"}',
        pid,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      this.props.changeQty(pid, cid, qty, symbol, inr, usd);
    } else {
      captureEvent(
        "cart",
        "decrease_qty",
        '{"productid":"' +
        pid +
        '", "qty":"' +
        qty +
        '", "min_qty":"' +
        quantity +
        '", "symbol":"' +
        symbol +
        '"}',
        pid,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
    }
  };

  increaseOneQty = (pid, cid, qty, symbol, inr, usd) => {
    ++qty;
    captureEvent(
      "cart",
      "increase_qty",
      '{"productid":"' +
      pid +
      '", "qty":"' +
      qty +
      '", "symbol":"' +
      symbol +
      '"}',
      pid,
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
    this.props.changeQty(pid, cid, qty, symbol, inr, usd);
  };


  set_shipping_for_below_threshold = async (totalProductCost, min_threshold, is_price_above_threshold, min_threshold_amount, totalShippingCost, totalCartValue) => {
  console.log('BEFORE', totalProductCost, min_threshold, is_price_above_threshold, min_threshold_amount)
  if (totalProductCost !== undefined && totalProductCost !== null && totalProductCost != '' && parseFloat(totalProductCost) != parseFloat(0)) {
    if ((parseFloat(totalProductCost) < parseFloat(min_threshold)) && is_price_above_threshold != 1) {
      console.log('first', totalProductCost, min_threshold, is_price_above_threshold, min_threshold_amount)
      await this.setState({
        is_price_above_threshold: 1,
        totalShippingCost: min_threshold_amount,
        totalCartValue: parseFloat(min_threshold_amount) + parseFloat(totalProductCost)
      })
      console.log('second', totalProductCost, min_threshold, is_price_above_threshold, totalShippingCost, totalCartValue, min_threshold_amount)
    } else if ( (parseFloat(totalProductCost) > parseFloat(min_threshold)) &&  is_price_above_threshold != 0) {
      console.log('else', totalProductCost, min_threshold, is_price_above_threshold)
      await this.setState({
        is_price_above_threshold: 0
      })
    }
  } else if ( is_price_above_threshold != 0) {
    console.log('bigger else', totalProductCost, min_threshold, is_price_above_threshold)
      await this.setState({
        is_price_above_threshold: 0
      })
}
}

  componentWillUpdate = async (nextProps) => {
    console.log(this.props, nextProps )
    let calcitem = []

    const { min_threshold_inr, inrValue, min_threshold, min_threshold_amount_inr, min_threshold_amount, totalProductCost, totalShippingCost, totalCartValue, is_price_above_threshold } = this.state
    console.log('componentWillUpdate',  totalProductCost, min_threshold, is_price_above_threshold, totalShippingCost, totalCartValue)

    try {
      if ((this.props.data.symbol != nextProps.data.symbol) || (this.props.data.symbol == 'USD' && parseFloat(this.state.min_threshold_amount) == parseFloat(this.state.min_threshold_amount_inr))) {
        let temp_threshold;
        let temp_threshold_amount;
        if (nextProps.data.symbol == 'INR') {
          await this.setState({
            min_threshold: min_threshold_inr,
            min_threshold_amount: min_threshold_amount_inr
          })
        } else if (nextProps.data.symbol == 'USD') {
          temp_threshold = (min_threshold_inr / parseFloat(inrValue));
          temp_threshold_amount = (min_threshold_amount_inr / parseFloat(inrValue));
          temp_threshold = temp_threshold.toFixed(2)
          temp_threshold_amount = temp_threshold_amount.toFixed(2)

          await this.setState({
            min_threshold: temp_threshold,
            min_threshold_amount: temp_threshold_amount
          })
        }
      }
      console.log('threshold change', min_threshold_amount, min_threshold, this.props.data.symbol , nextProps.data.symbol, inrValue)
    }catch (e) {
      
    }

    try {
      if (nextProps.user.user.country !=  this.state.buyer_country)
        await this.setState({
          buyer_country: nextProps.user.user.country,
          buyer_country_id: nextProps.user.user.countryid,
          buyer_country_name: nextProps.user.user.country_name
        })
    } catch (e) {
      
    }

    this.set_shipping_for_below_threshold(totalProductCost, min_threshold, is_price_above_threshold, min_threshold_amount, totalShippingCost, totalCartValue)

    


    if (
      parseFloat(totalShippingCost) > parseFloat(0.0) ||
      parseFloat(totalProductCost) > parseFloat(0.0) ||
      parseFloat(totalCartValue) > parseFloat(0.0)
    ) {
      if (
        parseFloat(totalShippingCost) != parseFloat(tshipcost) ||
        parseFloat(totalProductCost) != parseFloat(tproductcost) ||
        parseFloat(totalCartValue) != parseFloat(tcartcost)
      ) {
        tshipcost = totalShippingCost;
        tproductcost = totalProductCost;
        tcartcost = totalCartValue;
        
        

      try{
        axios
          .post(
            "https://api.indiabigshop.com/common/update_total_price_cart.php",
            {
              security_token: "",
              plateform_type: "",
              sellerid: ls.get("sellerid"),
              visitorid: getCookie("mhinpbnb"),
              totalShippingCost: this.state.totalShippingCost,
              totalProductCost: this.state.totalProductCost,
              totalCartValue: this.state.totalCartValue,
              symbol: this.state.symbol,
              cartitem: this.state.cartItems
            },
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then(response => { })
          .catch(error => {
            const result = error.response;
            return Promise.reject(result);
          });
      }catch (e) {
        console.log('total price')
      }

        captureEvent(
          "cart",
          "cart_loaded",
          "cart_loaded",
          "success",
          ls.get("sellerid"),
          getCookie("mhinpbnb")
        );
      }
    }
  }

  //Handle Express
  handleShipping = async (e, country) => {
   
    if (e) {
      await this.setState({
        express: e.value
      });
      captureEvent(
        "cart",
        "shipping_method_change",
        this.state.express,
        this.state.shippingCountryName,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      let changeInShippingCharge = this.state.shippingCharges;
      Object.keys(changeInShippingCharge).forEach((key, index) => {
        if (country == key) {
          changeInShippingCharge[key].express = e.value;
        }
      });
      this.setState({
        shippingCharges: changeInShippingCharge
      });
      axios
        .post(
          "https://api.indiabigshop.com/common/calculate_country_wise_price.php",
          {
            security_token: "",
            plateform_type: "",
            sellerid: ls.get("sellerid"),
            country_to: this.state.shippingCountry,
            express: this.state.express
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
          this.setState({
            shippingDetails: response.data,
            isShippingCountry: response.data.statusId
          });

          console.log('calling to call all cost else handleShipping');
          this.calc_all_cost(
            this.state.cartItems,
            this.state.shippingDetails,
            this.state.shippingCharges,
            this.state.shippingCountry,
            this.state.symbol,
            this.state.inrValue,
            this.state.usdValue,
            this.state.totalProductCost,
            getCookie('country_code')
          );
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    } else {
      console.log('calling to call all cost if handleShipping');
      this.calc_all_cost(
        this.state.cartItems,
        this.state.shippingDetails,
        this.state.shippingCharges,
        this.state.shippingCountry,
        this.state.symbol,
        this.state.inrValue,
        this.state.usdValue,
        this.state.totalProductCost,
        getCookie('country_code')
      );
    }
  };

  deleteCartitem(item) {
    if (window.confirm("Do you want to delete this item from your cart?")) {
      captureEvent("cart","delete_cart_item", item.productid, (this.state.cartItems.length - 1), ls.get("sellerid"), getCookie("mhinpbnb"));
      this.props.removeFromCart(item.cartitemid);
    }
  }

  shipDetMethod(shipMethod, startcnt, endcnt) {
    let showmethod = shipMethod;
    //return showmethod.slice(startcnt, endcnt)

    if (startcnt == 1 && endcnt == 1) return [shipMethod[0], shipMethod[2]];
    else {
      let temp = showmethod.splice(startcnt, endcnt);
      return showmethod;
    }
  }

  render() {
    //console.log(this.state.isShippingCountry)
    const { shippingCountry, shippingCountryName, hasCountry, cartItems, symbol, totalProductCost, is_price_above_threshold, shippingCharges, isShippingCountry, totalShippingCost, totalCartValue, buyer_country, buyer_country_id, buyer_country_name} = this.state

    const InputProps = {
      required: true
    };

    const shipMethod = [
      { value: "air", label: "Air Express", country: "india" },
      { value: "sea_surface", label: "Ocean Express", country: "india" },
      { value: "surface", label: "Surface", country: "india" }
    ];
    return (
      <div>
        {/*SEO Support*/}
        <Helmet>
          <title>Cart</title>
          <meta name="description" content="Cart on Beldara.com" />
        </Helmet>
        {/*SEO Support End */}

        <Breadcrumb title={"Cart"} />
        {this.state.isPageLoaded == 0 ? (
          <LoadingComponent />
        ) : cartItems && cartItems.length > 0 ? (
          <section className="cart-section section-b-space">
            <div className="container">
                <div className="row">

                  <div className="col-sm-12">
                    {(shippingCountry && shippingCountryName && hasCountry == '1') ?
                      ''
                      : <div className="d-flex justify-content-left align-items-center mb-3">
                      <div className="pr-4">Select Your Country:</div>
                      <div className="w-50">
                        {(shippingCountry &&
                          shippingCountryName) ? (
                            <Select
                              isOptionSelected="true"
                              options={this.props.data.countries}
                              onChange={this.handleCountry}
                              headingProps={InputProps}
                              defaultValue={defaultCountry}
                            //defaultValue={''}
                            />
                          ) : (
                            <Select
                              isOptionSelected="true"
                              options={this.props.data.countries}
                              onChange={this.handleCountry}
                              headingProps={InputProps}
                              placeholder={"Select Country"}
                            // defaultValue={this.props.data.countries[0]}
                            //defaultValue={''}
                            />
                          )}
                      </div>
                    </div>}
                  <table className="table cart-table table-responsive-xs">
                    <thead>
                      <tr className="table-head">
                        <th scope="col">image</th>
                        <th scope="col">product name</th>
                        <th scope="col">price</th>
                        <th scope="col">quantity</th>
                        <th scope="col">total</th>
                        <th scope="col">action</th>
                      </tr>
                    </thead>

                    {cartItems.map((eachcartitem, index) => {
                      if (
                        eachcartitem.name != "" &&
                        eachcartitem.name !== undefined
                      ) {
                        let item = eachcartitem;

                        return (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <a
                                  target="_blank"
                                  href={`${process.env.PUBLIC_URL}/product/${item.url}.html`}
                                >
                                  <img
                                    src={`${imgUrl}/product_images_thumb/${item.img}`}
                                    alt={`${item.name} on Beldara.com`}
                                  />
                                </a>

                                <div className="text-dark">
                                  {" "}
                                  Seller from{" "}
                                  <span className="h5 text-dark text-capitalize">
                                    {item.sellerCountry
                                      ? item.sellerCountry
                                      : "India"}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div
                                  className="mobile-cart-content row mouse_pointer"
                                  onClick={() => {
                                    this.deleteCartitem(item)
                                  }}
                                >
                                  
                                  <i className="fa fa-times text-danger ml-auto"></i>
                                </div>
                                <a
                                  target="_blank"
                                  href={`${process.env.PUBLIC_URL}/product/${item.url}.html`}
                                >
                                  {item.name}
                                </a>

                                <div className="mobile-cart-content row">
                                  {parseFloat(item.eachprice) >
                                  parseFloat(0.0) ? (
                                    <div className="col-xs-12">
                                      <div className="qty-box border-right border-light">
                                        <div className="input-group">
                                          <span className="input-group-prepend">
                                            <button
                                              type="button"
                                              className="btn quantity-left-minus"
                                              onClick={() =>
                                                this.decreaseOneQty(
                                                  item.productid,
                                                  item.cartitemid,
                                                  item.qty,
                                                  item.quantity,
                                                  symbol,
                                                  this.state.inrValue,
                                                  this.state.usdValue,
                                                  item.eachprice
                                                )
                                              }
                                              data-type="minus"
                                              data-field=""
                                            >
                                              <i className="fa fa-minus"></i>
                                            </button>
                                          </span>
                                          <input
                                            type="text"
                                            name="quantity"
                                            value={item.qty}
                                            readOnly={true}
                                            className="form-control input-number"
                                          />

                                          <span className="input-group-prepend">
                                            <button
                                              className="btn quantity-right-plus"
                                              onClick={() =>
                                                this.increaseOneQty(
                                                  item.productid,
                                                  item.cartitemid,
                                                  item.qty,
                                                  symbol,
                                                  this.state.inrValue,
                                                  this.state.usdValue,
                                                  item.eachprice
                                                )
                                              }
                                              data-type="plus"
                                              disabled={
                                                item.qty >= item.stock
                                                  ? true
                                                  : false
                                              }
                                            >
                                              <i className="fa fa-plus"></i>
                                            </button>
                                          </span>
                                        </div>
                                      </div>

                                      <small className="text-dark">
                                        Each Price: {symbol} {item.eachprice}
                                      </small>
                                      <div className="text-dark">
                                        <small className="text-dark">
                                          <b>
                                            Total Price: {symbol}{" "}
                                            {item.totalprice}{" "}
                                          </b>
                                        </small>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className=" text-danger">
                                      OUT OF STOCK
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <h4>
                                    {symbol} {item.eachprice}
                                  </h4>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <div className="qty-box">
                                    <div className="input-group">
                                      <span className="input-group-prepend">
                                        <button
                                          type="button"
                                          className="btn quantity-left-minus"
                                          onClick={() =>
                                            this.decreaseOneQty(
                                              item.productid,
                                              item.cartitemid,
                                              item.qty,
                                              item.quantity,
                                              symbol,
                                              this.state.inrValue,
                                              this.state.usdValue,
                                              item.eachprice
                                            )
                                          }
                                          data-type="minus"
                                          data-field=""
                                        >
                                          <i className="fa fa-minus"></i>
                                        </button>
                                      </span>
                                      <input
                                        type="text"
                                        name="quantity"
                                        value={item.qty}
                                        readOnly={true}
                                        className="form-control input-number"
                                      />

                                      <span className="input-group-prepend">
                                        <button
                                          className="btn quantity-right-plus"
                                          onClick={() =>
                                            this.increaseOneQty(
                                              item.productid,
                                              item.cartitemid,
                                              item.qty,
                                              symbol,
                                              this.state.inrValue,
                                              this.state.usdValue,
                                              item.eachprice
                                            )
                                          }
                                          data-type="plus"
                                          disabled={
                                            item.qty >= item.stock
                                              ? true
                                              : false
                                          }
                                        >
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className=" text-danger">
                                    OUT OF STOCK
                                  </div>
                                )}
                              </td>
                              <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <h4 className="td-color">
                                    {symbol} {item.totalprice}
                                  </h4>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                <span
                                  className="mouse_pointer"
                                  onClick={() => {
                                    this.deleteCartitem(item)
                                  }}
                                >
                                  <i className="fa fa-times text-danger"></i>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        );
                      }
                    })}
                  </table>

                  <div className="d-flex align-items-center">
                    <div className="text-right w-50 mr-5">Total Product Cost :</div>
                    <div className="text-left h6">
                      {symbol} {totalProductCost}
                    </div>
                    </div>

                    {((shippingCountry == "91" || ( (buyer_country_id === undefined || buyer_country_id === null || buyer_country_id == '' ) && getCookie('country_code').toLowerCase() == 'in') ) && (is_price_above_threshold == '1') ) ?
                      
                      <React.Fragment>
                        <div className="d-flex align-items-center">
                          <div className="text-right w-50 mr-5">
                            Shipping Cost:
                          </div>
                          <div className="text-left h6">
                            {symbol +" " + totalShippingCost}
                          </div>
                      </div>
                       <div className="d-flex align-items-center">
                     
                       <div className="text-right w-50 mr-5">
                       Total Cost:
                       </div>
                       <div className="text-left h6">
                         {symbol +" " + totalCartValue}
                       </div>
                      </div>
                     </React.Fragment>
                        : shippingCountry == "1" && hasCountry == '1' ? 
                      'second':
                      ( getCookie('country_code').toLowerCase() != 'us') ?
                          <React.Fragment>
                            
                        {Object.keys(shippingCharges).map(
                          (eachcountry, index) => {
                            return (
                              <React.Fragment key={index}>
                                <div className="d-flex justify-content-left align-items-center my-3">
                                  <div className="text-right mr-5 w-50 ">
                                    Shipping from{" "}
                                    {shippingCharges[eachcountry].country}:
                            </div>
                                  <div style={{ width: "40%" }} className="text-left">
                                    {shippingCountryName ? (
                                      shippingCountryName.toLowerCase() ==
                                        shippingCharges[
                                          eachcountry
                                        ].country.toLowerCase() ? (
                                          <Select
                                            id={shippingCharges[eachcountry].country}
                                            isOptionSelected="true"
                                            options={this.shipDetMethod(shipMethod,1,1)}
                                            defaultValue={ this.shipDetMethod(shipMethod, 1, 1)[0] }
                                            onChange={e => { this.handleShipping( e, this.state.shippingCharges[eachcountry].country) }}
                                          />
                                        ) : (
                                          <Select
                                            id={this.state.shippingCharges[eachcountry].country}
                                            isOptionSelected="true"
                                            options={this.shipDetMethod(shipMethod,2,1)}
                                            defaultValue={
                                              this.shipDetMethod(shipMethod, 2, 1)[0]
                                            }
                                            onChange={e => {
                                              this.handleShipping(e,this.state.shippingCharges[eachcountry].country);
                                            }}
                                          />
                                        )
                                    ) : (
                                        <Select
                                          id={
                                            this.state.shippingCharges[eachcountry]
                                              .country
                                          }
                                          isOptionSelected="true"
                                          options={shipMethod}
                                          defaultValue={shipMethod[0]}
                                          onChange={e => {this.handleShipping(e,shippingCharges[eachcountry].country) }}
                                        />
                                      )}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div className="text-right w-50 mr-5">
                                    Shipping Cost From{" "}
                                   
                                    {shippingCharges[eachcountry].country}:
                            </div>

                                  {parseInt(isShippingCountry) ==
                                    parseInt(1) ? (
                                      parseFloat(
                                        shippingCharges[eachcountry]
                                          .shippingCost
                                      ) > parseFloat(0) ? (
                                          <div className="text-left h6">
                                            {" "}
                                            {symbol +
                                              " " +
                                              shippingCharges[eachcountry].shippingCost}{" "}
                                          </div>
                                        ) : (
                                          <div className="text-left">
                                            {" "}
                                            Please select another Shipping Method / QTY to Continue  32123{" "}
                                          </div>
                                        )
                                    ) : (
                                      <div className="text-left">
                                        {" "}
                                        Select Shipping Country to check Shipping Cost{" "}
                                      </div>
                                    )}
                                </div>
                              </React.Fragment>
                            );
                          }
                        )}
                      
                      <div className="d-flex align-items-center">
                    <div className="text-right w-50 mr-5">Total Price :</div>

                    {parseInt(isShippingCountry) == parseInt(1) ? (
                      parseFloat(totalShippingCost) >
                      parseFloat(0) ? (
                        <div className="text-left h6">
                          {symbol + " " + totalCartValue}{" "}
                        </div>
                      ) : (
                        <div className="text-left">
                          {" "}
                          Please select another Shipping Method / QTY to
                          Continue{" "}
                        </div>
                      )
                    ) : (
                      <div className="text-left">
                        {" "}
                        Select Shipping Country to check Total Cost{" "}
                      </div>
                    )}
                  </div>
                  </React.Fragment>
                        : ''}
                </div>
              </div>
              <div className="row cart-buttons">
                <div className="col-6">
                  <Link to={process.env.PUBLIC_URL} className="btn btn-solid">
                    continue shopping
                  </Link>
                </div>
                <div className="col-6">
                  {this.state.shippingNotAvailable == 1 ? (
                    <div className="text text-danger">
                      Please select Shipping Country and method to proceed
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={this.goToOrder}
                    className="btn btn-solid mouse_pointer"
                  >
                    check out
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="cart-section section-b-space">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div>
                    <div className="col-sm-12 empty-cart-cls text-center">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/icon-empty-cart.png`}
                        className="img-fluid mb-4"
                        alt=""
                      />
                      <h3>
                        <strong>Your Cart is Empty</strong>
                      </h3>
                      <h4>Explore more shortlist some items.</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }
}
// const mapStateToProps = (state) => ({
//     cartItems: state.cartList.cart,
//     symbol: state.data.symbol,
//     // getCartTotal(state.cartList.cart).then(val => {
//     //     total = val
//     // })
//     // getCartTotal(state.cartList.cart).then((val) => { return val})
// })

const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  { removeFromCart, incrementQty, decrementQty, changeQty }
)(cartComponent);
