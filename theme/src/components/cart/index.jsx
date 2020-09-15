import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ls from "local-storage";
import Breadcrumb from "../common/breadcrumb";
import {
  getCartTotal,
  getShippingCost,
  getTotalCartValue,
  getTotalShippingCost,
  getFinalShippingCost,
} from "../../services";
import {
  removeFromCart,
  incrementQty,
  decrementQty,
  changeQty,
  getCart,
  updateCart,
  getAllCountry,
  receiveGetCart,
  receiveCart,
  getCartLength
} from "../../actions";
import store from "../../store";
import { imgUrl } from "../../constants/variable";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import * as types from "../../constants/ActionTypes";
import { isMobile } from "react-device-detect";
import $ from "jquery";
import { captureEvent, getCookie, showToast } from "../../functions";
import LoadingComponent from "../products/common/loading-bar";
var cartData;
var countryOfSeller = [];
var tshipcost = 0;
var tproductcost = 0;
var tcartcost = 0;
var defaultCountry = [];
var shippingArray ;


function hasClass(el, className)
{
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(el, className)
{
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
}

function removeClass(el, className)
{
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className))
    {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}
var _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
var _docWidth = (document.width !== undefined) ? document.width : document.body.offsetWidth;
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
      inrValue: 70.90,
      update: 0,
      shippingCharges: [],
      shippingCountry: 91,
      // shippingCountryName: 'Afghanistan',
      express: "air",
      simProduct: "",
      shippingNotAvailable: 0,
      shippingDetails: [],
      reloadAgain: 0,
      isShippingCountry: 0,
      isPageLoaded: 0,
      cartid: "",
      minShippingCostINR: 40,
      minShippingCostUSD: 5,
      minShippingCost: 40,
      finalShippingCost: 0,
      shouldUpdate: 1,
      wallet_amount: 0.0,
      select_wallet_amount_option: false,
      wallet_used: 0,
      totalCartStaticValue: 0,
      render_total_static: 0,
      wallet_usd_amount: 0,
      validation : false,
      validation_text : 'shopping amount must be greater than wallet amount',
      shippingArray : [],
      cartSmallDetails : [],
      txn_type:'credit',
      noShippinCost:true,
      shipMethod:[{ value: "surface", label: "Surface", country: "india" }]
    };

    this.decreaseOneQty = this.decreaseOneQty.bind(this);
    this.increaseOneQty = this.increaseOneQty.bind(this);
    this.deleteCartitem = this.deleteCartitem.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidMount(){
    // console.log('componentDidMount',84);
    this.updateCart();
    axios.post(
      `${types.ApiUrl}/common/get_constant_value.php`,
      {},
      {
        headers:{
          "content-type":"multipart/form-data"
        }
      }
    ).then(res =>{
        if(res.data.statusId == '1'){
          if(res.data.result[0]['field']){
            // console.log('solved',res.data.result[0]['field'],res.data.result[0]['value']);
            this.setState({
              inrValue : res.data.result[0]['value']
            })
          }else{
            console.log('error occured');
          }
        }
    }).catch(error => {
      console.log('error occured');
    })
    if(!isMobile){
      window.addEventListener('scroll', this.handleScroll);
    }
    if(getCookie('country_code') == 'in' || getCookie('country_code') == 'IN'){
      var shipMethod = [
        { value: "surface", label: "Surface", country: "india" },
      ];
      this.setState({shipMethod:shipMethod})
    }else{
      var shipMethod = [
        { value: "air", label: "Air Express", country: "india" },
        { value: "sea_surface", label: "Ocean Express", country: "india" }
      ];
      this.setState({shipMethod:shipMethod})
    }
  }

  componentWillUnmount(){
    if(!isMobile){
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  async componentWillReceiveProps(nextProps){
    if(this.state.shippingCountry != getCookie('countryid')){
      if(getCookie('country_code') == 'in' || getCookie('country_code') == 'IN'){
        var shipMethod = [
          { value: "surface", label: "Surface", country: "india" },
        ];
      }else{
        var shipMethod = [
          { value: "air", label: "Air Express", country: "india" },
          { value: "sea_surface", label: "Ocean Express", country: "india" },
        ];
      }
      this.activateLoader()
        // console.log('country changed',this.state.shippingCountry,getCookie('countryid'),92);
        axios.post(
          `${types.ApiUrl}/common/update_country_cart.php`,
          {sellerid:ls.get('log_id'),plateform_type:'',security_token:'',visitor_id:getCookie('mhinpbnb'),currency:getCookie('currency'),txn_type:this.state.txn_type,country_code:getCookie('country_code'),country_to:getCookie('countryid')},
          {
            headers:{
              "content-type":"multipart/form-data"
            }
          }
        ).then(async response =>{
          if(response.data.statusId == '1'){
            var shippingArray = await response.data.result.shippingcost;
            shippingArray.forEach(element => {
              var country_name = element.country;
              countryOfSeller[country_name.toLowerCase()] = {
                country:country_name.toLowerCase(),
                shippingCost:element.shipping_charge,
                express:element.shipping_type,
                countryid:element.countryid
              }
            });
            // console.log(countryOfSeller,shippingArray,this.props.data.symbol,113);
            await this.setState({
               cartItems:response.data.result.cart,
               isPageLoaded:1,
              //  symbol:getCookie('currency'),
               totalProductCost:response.data.result.cartamount.basePrice,
               totalCartStaticValue:response.data.result.cartamount.totalCartStaticValue,
               totalCartValue:response.data.result.cartamount.totalPrice,
               shippingDetails: response.data.result.shippingcost,
               isShippingCountry: response.data.statusId,
               shippingCharges : countryOfSeller,
               shippingArray : shippingArray,
               totalShippingCost : response.data.result.cartamount.finalShippingCost,
               shippingCountry : getCookie('countryid'),
               cartSmallDetails:response.data.result.cartamount,
               shippingCountryName : getCookie('country_name'),
               shipMethod:shipMethod
            })
            this.deactivateLoader()
            // console.log(response.data.result,128);
          }else{
            console.log('error occured');
            await this.setState({
              cartItems:null
            })
          }
        }).catch(error =>{
          console.log(error);
        });
    }
    if(this.state.symbol != getCookie('currency')){
      this.activateLoader()
      // console.log('currency changed',this.state.symbol,getCookie('currency'),98);
      axios.post(
        `${types.ApiUrl}/common/update_currency_cart.php`,
        {sellerid:ls.get('log_id'),plateform_type:'',security_token:'',visitor_id:getCookie('mhinpbnb'),symbol:getCookie('currency'),txn_type:this.state.txn_type},
        {
          headers:{
            "content-type":"multipart/form-data"
          }
        }
      ).then(async response =>{
        if(response.data.statusId == '1'){
          var shippingArray = await response.data.result.shippingcost;
          shippingArray.forEach(element => {
            var country_name = element.country;
            countryOfSeller[country_name.toLowerCase()] = {
              country:country_name.toLowerCase(),
              shippingCost:element.shipping_charge,
              express:element.shipping_type,
              countryid:element.countryid
            }
          });
          // console.log(countryOfSeller,shippingArray,this.props.data.symbol,156);
          await this.setState({
             cartItems:response.data.result.cart,
             isPageLoaded:1,
             totalProductCost:response.data.result.cartamount.basePrice,
             totalCartStaticValue:response.data.result.cartamount.totalCartStaticValue,
             totalCartValue:response.data.result.cartamount.totalPrice,
             shippingDetails: response.data.result.shippingcost,
             isShippingCountry: response.data.statusId,
             shippingCharges : countryOfSeller,
             shippingArray : shippingArray,
             totalShippingCost : response.data.result.cartamount.finalShippingCost,
             cartSmallDetails:response.data.result.cartamount,
             shippingCountryName : getCookie('country_name'),
             symbol:getCookie('currency'),
          })
          this.deactivateLoader()
          // console.log(response.data.result,170);
        }else{
          console.log('error occured');
          await this.setState({
            cartItems:null,
            isPageLoaded:1
          })
        }
      }).catch(error =>{
        console.log(error);
      });
    }
    // else{
    //   console.log('currency not changed',this.state.symbol,getCookie('currency'),98);
    // }
    
  }



  updateCart = async ()  => {
    this.activateLoader();
    axios.post(
      `${types.ApiUrl}/common/receive_cart.php`,
      {sellerid:ls.get('log_id'),plateform_type:'',security_token:'',visitor_id:getCookie('mhinpbnb'),symbol:getCookie('currency'),country_code:getCookie('country_code'),txn_type:this.state.txn_type},
      {
        headers:{
          "content-type":"multipart/form-data"
        }
      }
    ).then(async response =>{
      if(response.data.statusId == '1'){
        var shippingArray = await response.data.result.shippingcost;
        shippingArray.forEach(element => {
          var country_name = element.country;
          countryOfSeller[country_name.toLowerCase()] = {
            country:country_name.toLowerCase(),
            shippingCost:element.shipping_charge,
            express:element.shipping_type,
            countryid:element.countryid
          }
        });
        // console.log(countryOfSeller,shippingArray,104);
        await this.setState({
           cartItems:response.data.result.cart,
           isPageLoaded:1,
           symbol:getCookie('currency'),
           totalProductCost:response.data.result.cartamount.basePrice,
           totalCartStaticValue:response.data.result.cartamount.totalCartStaticValue,
           totalCartValue:response.data.result.cartamount.totalPrice,
           shippingDetails: response.data.result.shippingcost,
           isShippingCountry: response.data.statusId,
           shippingCharges : countryOfSeller,
           shippingArray : shippingArray,
           totalShippingCost : response.data.result.cartamount.finalShippingCost,
           shippingCountry : getCookie('countryid'),
           cartSmallDetails:response.data.result.cartamount,
           shippingCountryName : getCookie('country_name'),
           cartid:response.data.result.cartamount.cartID
        })
        if(response.data.result.cart.length > 0){
          var length = response.data.result.cart.length;
          var i;
          for(i=0;i<length;i++){
            // console.log(response.data.result.cart[i]['productid']);
            if(response.data.result.cart[i]['productid'] == '345161'){
              await this.setState({noShippinCost:true})
                // console.log('satisfied')
                break;
            }else{
              // console.log('not satisfied')
            }
          }
        }
          this.check_product_available(response.data.result.cart);
          this.deactivateLoader();
        // console.log(response.data.result,115);
      }else{
        console.log('error occured');
        await this.setState({
          cartItems:null,
          isPageLoaded:1
        })
      }
    }).catch(error =>{
      console.log(error);
    });
  }

  checkForDecreaseQty = async (qty,offer_from_date,offer_to_date,offer_min_qty,offer_stock,cid) => {
    // console.log(qty,offer_from_date,offer_to_date,offer_min_qty,offer_stock,'checkForDecreaseQty');
    if(this.offerExist(offer_from_date,offer_to_date) && parseInt(qty)-1 < offer_min_qty){
      $('#validate_'+cid).removeClass('d-none');
         this.setState({
          validation:true,
          validation_text: 'Minimum Qty should be '+offer_min_qty
        });
        // console.log('if','checkForDecreaseQty',this.state.validation_text,this.state.validation)
         return false;
    }else{
      // console.log('else','checkForDecreaseQty',this.state.validation_text,this.state.validation)
       this.setState({
        validation:false,
      });
      return true;
    }
  }


  decreaseOneQty = async (pid, cid, qty, quantity, symbol, inr, usd, eachprice,offer_price,offer_from_date,offer_to_date,offer_min_qty,offer_mrp_price,offer_currency,offer_unit,offer_stock) => {
    if(offer_stock == 0)
      return false
      
    $('.common_validate_class').addClass('d-none');
    var checkForOffer = await this.checkForDecreaseQty(qty,offer_from_date,offer_to_date,offer_min_qty,offer_stock,cid);
    if(checkForOffer){
      if (qty > 1 && qty > quantity) {
      this.generateSpinner(cid);
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
        // this.props.changeQty(pid, cid, qty, symbol, inr, usd);
        axios.post(
          `${types.ApiUrl}/common/update_cart_test.php`,
          { security_token: "", plateform_type: "", cartitemid: cid, qty: qty, productid: pid, currency:getCookie('currency'),country_to:getCookie('countryid'),method:'air',country_code:getCookie('country_code'),visitor_id:getCookie('mhinpbnb'),sellerid:ls.get('log_id'),txn_type:this.state.txn_type },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
          .then(async response => {
            if(response.data.statusId == '1'){
              var shippingArray = await response.data.result.shippingcost;
              shippingArray.forEach(element => {
                var country_name = element.country;
                countryOfSeller[country_name.toLowerCase()] = {
                  country:country_name.toLowerCase(),
                  shippingCost:element.shipping_charge,
                  express:element.shipping_type,
                  countryid:element.countryid
                }
              });
              // console.log(countryOfSeller,shippingArray,286);
              await this.setState({
                 cartItems:response.data.result.cart,
                 isPageLoaded:1,
                 symbol:getCookie('currency'),
                 totalProductCost:response.data.result.cartamount.basePrice,
                 totalCartStaticValue:response.data.result.cartamount.totalCartStaticValue,
                 totalCartValue:response.data.result.cartamount.totalPrice,
                 shippingDetails: response.data.result.shippingcost,
                 isShippingCountry: response.data.statusId,
                 shippingCharges : countryOfSeller,
                 shippingArray : shippingArray,
                 totalShippingCost : response.data.result.cartamount.finalShippingCost,
                 cartSmallDetails:response.data.result.cartamount,
                 shippingCountryName : getCookie('country_name')
              })
              this.removeSpinner(cid);
              // console.log(response.data.result,300);
            }else{
              console.log('error occured',302);
            }
          })
          .catch(error => {
            const result = error.response;
            return Promise.reject(result);
          });
        this.setState({
          shouldUpdate: 1,
          //  totalCartStaticValue:new_static_value
        });
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
    }
  }


  offerExist = (from_date,to_date) => {
    if(from_date !== undefined && from_date !== null && from_date !== '' && to_date !== undefined && to_date !== null && to_date !== ''){
      let dateObj = new Date();
    let month = dateObj.getMonth()+1;
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let todayDate = year + '-' + month + '-' + day;
    // let todayDate = '2021-5-8';


    //Generate an array where the first element is the year, second is month and third is day
    var splitFrom = from_date.split('-');
    var splitTo = to_date.split('-');
    var splitToday = todayDate.split('-');

    //Create a date object from the arrays
    var newFrom = splitFrom[1]+ "," + splitFrom[2] + "," + splitFrom[0];
    var newTo = splitTo[1]+ "," + splitTo[2] + "," + splitTo[0];
    var newToday = splitToday[1]+ "," + splitToday[2] + "," + splitToday[0];

    newFrom = newFrom.toString();
    newTo = newTo.toString();
    newToday = newToday.toString();

    var fromDate = Date.parse(newFrom);
    var toDate = Date.parse(newTo);
    var todayDates = Date.parse(newToday);

    // console.log(splitFrom,splitTo,splitToday,'array',fromDate,toDate,todayDates,'days',newFrom,newTo,newToday);
    if(todayDates >= fromDate){
        if(toDate >= todayDates){
          return true;
        }else{
          return false;
        }
    }else{
      return false;
    }
    }else{
      return false;
    }
  }

  checkForQty = async (qty,offer_from_date,offer_to_date,offer_min_qty,offer_stock,cid) => {
    // console.log(qty,offer_stock,offer_from_date,offer_to_date,offer_min_qty,offer_stock,'checkForQty');
    if(this.offerExist(offer_from_date,offer_to_date) && parseInt(qty)+1 > offer_stock){
        $('#validate_'+cid).removeClass('d-none').html('Only '+ offer_stock +' stock left !');
         this.setState({
          validation:true,
          // validation_text: 'Only '+ offer_stock +' stock left !'
        });
        // console.log('if','checkForQty',this.state.validation_text,this.state.validation)
        return false;
    }else{
      // console.log('else','checkForQty',this.state.validation_text,this.state.validation)
       this.setState({
        validation:false,
      });
      return true;
    }
  }

  increaseOneQty = async (pid, cid, qty, symbol, inr, usd, eachprice,offer_price,offer_from_date,offer_to_date,offer_min_qty,offer_mrp_price,offer_currency,offer_unit,offer_stock,items)  => {
    if(offer_stock == 0)
      return false

    $('.common_validate_class').addClass('d-none');
    var checkForIncreaseQty = await this.checkForQty(qty,offer_from_date,offer_to_date,offer_min_qty,offer_stock,cid);
    if(checkForIncreaseQty){
      this.generateSpinner(cid);
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
    //productid, cartitemid, qty, symbol, inrValue, usdValue)
    axios.post(
      `${types.ApiUrl}/common/update_cart_test.php`,
      { security_token: "", plateform_type: "", cartitemid: cid, qty: qty, productid: pid, currency:getCookie('currency'),country_to:getCookie('countryid'),method:'air',country_code:getCookie('country_code'),visitor_id:getCookie('mhinpbnb'),sellerid:ls.get('log_id'),txn_type:this.state.txn_type },
      { headers: { "Content-Type": "multipart/form-data" } }
    )
      .then(async response => {
        if(response.data.statusId == '1'){
          var shippingArray = await response.data.result.shippingcost;
          shippingArray.forEach(element => {
            var country_name = element.country;
            countryOfSeller[country_name.toLowerCase()] = {
              country:country_name.toLowerCase(),
              shippingCost:element.shipping_charge,
              express:element.shipping_type,
              countryid:element.countryid
            }
          });
          // console.log(countryOfSeller,shippingArray,286);
          await this.setState({
             cartItems:response.data.result.cart,
             isPageLoaded:1,
             symbol:getCookie('currency'),
             totalProductCost:response.data.result.cartamount.basePrice,
             totalCartStaticValue:response.data.result.cartamount.totalCartStaticValue,
             totalCartValue:response.data.result.cartamount.totalPrice,
             shippingDetails: response.data.result.shippingcost,
             isShippingCountry: response.data.statusId,
             shippingCharges : countryOfSeller,
             shippingArray : shippingArray,
             totalShippingCost : response.data.result.cartamount.finalShippingCost,
             cartSmallDetails:response.data.result.cartamount,
             shippingCountryName : getCookie('country_name')
          })
          // console.log(response.data.result,300);
          this.removeSpinner(cid);
        }else{
          console.log('error occured',302);
        }
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
    // this.props.changeQty(pid, cid, qty, symbol, inr, usd);
    this.setState({
      shouldUpdate: 1,
      //  totalCartStaticValue:new_static_value
    });
    }
  }

  deleteCartitem = async (item) => {
    //  console.log('deleteCartitem',item,387,this.state.cartItems.length);
    if (window.confirm("Do you want to delete this item from your cart?")) {
      showToast("Product Removed from Cart", "1");
      // if (this.state.cartItems.length == 1) {
        axios.post(
          `${types.ApiUrl}/common/delete_cart_item_test.php`,
          {cartitemid:item.cartitemid,sellerid:ls.get('log_id'),plateform_type:'web',security_token:'',visitor_id:getCookie('mhinpbnb'),symbol:getCookie('currency'),txn_type:this.state.txn_type},
          {
            headers:{
              "content-type":"multipart/form-data"
            }
          }
        ).then(async response =>{
          if(response.data.statusId == '1'){
          store.dispatch(getCartLength(ls.get('log_id'),getCookie('mhinpbnb')));
            var shippingArray = await response.data.result.shippingcost;
            shippingArray.forEach(element => {
              var country_name = element.country;
              countryOfSeller[country_name.toLowerCase()] = {
                country:country_name.toLowerCase(),
                shippingCost:element.shipping_charge,
                express:element.shipping_type,
                countryid:element.countryid
              }
            });
            // console.log(countryOfSeller,shippingArray,411);
            await this.setState({
               cartItems:response.data.result.cart,
               isPageLoaded:1,
               symbol:getCookie('currency'),
               totalProductCost:response.data.result.cartamount.basePrice,
               totalCartStaticValue:response.data.result.cartamount.totalCartStaticValue,
               totalCartValue:response.data.result.cartamount.totalPrice,
               shippingDetails: response.data.result.shippingcost,
               isShippingCountry: response.data.statusId,
               shippingCharges : countryOfSeller,
               shippingArray : shippingArray,
               totalShippingCost : response.data.result.cartamount.finalShippingCost,
               shippingCountry : getCookie('countryid'),
               shippingCountryName : getCookie('country_name')
            })
            this.check_product_available(response.data.result.cart);
            // console.log(response.data.result,426);
          }else{
            console.log('error occured');
          }
        }).catch(error =>{
          console.log(error);
        })
      // }

      captureEvent(
        "cart",
        "delete_cart_item",
        item.productid,
        this.state.cartItems.length - 1,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
    }
  }


  handleShipping = async (e, country) => {
  this.activateLoader()
  // this.generateSpinner(country+'_1');
  //  console.log(e,country,236,this.state.shippingArray);
  shippingArray = this.state.shippingArray;
  var newarray = [];
  var shipmethod;
  shippingArray.forEach((element,index) => {
    if(element.country == country){
      // console.log('if',country,element.country,248);
      shipmethod = e.value;
    }else{
      shipmethod = element.shipping_type;
      // console.log('else',country,element.country,248);
    }
    var new_object = {
      country : element.country,
      shipping_charge : element.shipping_charge,
      currency : element.currency,
      countryid : element.countryid,
      shipping_type : shipmethod
    }
    newarray.push(new_object);
    // console.log(newarray,248);
  });
  axios.post(
    `${types.ApiUrl}/common/update_shipping_cost_method.php`,
    {security_token:'',plateform_type:'',visitor_id:getCookie('mhinpbnb'),sellerid:ls.get('log_id'),symbol:getCookie('currency'),shipping_array:newarray},
    {
      headers:{
        "content-type":"multipart/form-data"
      }
    }
  ).then(async response => {
    // console.log(res,269);
    if(response.data.statusId == '1'){
      var shippingArray = await response.data.result.shippingcost;
      shippingArray.forEach(element => {
        var country_name = element.country;
        countryOfSeller[country_name.toLowerCase()] = {
          country:country_name.toLowerCase(),
          shippingCost:element.shipping_charge,
          express:element.shipping_type,
          countryid:element.countryid
        }
      });
      // console.log(countryOfSeller,shippingArray,286);
      await this.setState({
         cartItems:response.data.result.cart,
         isPageLoaded:1,
         symbol:getCookie('currency'),
         totalProductCost:response.data.result.cartamount.basePrice,
         totalCartStaticValue:response.data.result.cartamount.totalCartStaticValue,
         totalCartValue:response.data.result.cartamount.totalPrice,
         shippingDetails: response.data.result.shippingcost,
         isShippingCountry: response.data.statusId,
         shippingCharges : countryOfSeller,
         shippingArray : shippingArray,
         totalShippingCost : response.data.result.cartamount.finalShippingCost,
         cartSmallDetails:response.data.result.cartamount,
         shippingCountryName : getCookie('country_name')
      })
      this.deactivateLoader()
      // this.removeSpinner(country+'_1');
      // console.log(response.data.result,300);
    }else{
      console.log('error occured',302);
    }
  }).catch(error =>{
    console.log(error);
  });
  // console.log(newarray,249);
  };



  handleChange = async () => {
    if (
      $("#wallet_amount_check").prop("checked") == true
    ) {
        await this.setState({
          txn_type:'debit'
        })
        this.updateCart();
    }else{
      await this.setState({
        txn_type:'credit'
      })
      this.updateCart();
    }
  }


  goToOrder = () => {
    if (
      (parseFloat(this.state.totalShippingCost) > parseFloat(0) &&
      parseFloat(this.state.totalProductCost) > parseFloat(0) &&
      parseFloat(this.state.totalCartValue) > parseFloat(0))
      || this.state.noShippinCost
    ) {
      captureEvent(
        "cart",
        "check_out",
        '{"cart":"' +
          JSON.stringify(this.state.cartItems) +
          '", "totalShippingCost":"' +
          this.state.totalShippingCost +
          '", "totalCartValue":"' +
          this.state.totalCartValue +
          '", "totalProductCost":"' +
          this.state.totalProductCost +
          '", "symbol":"' +
          this.state.symbol +
          '"}',
        "success",
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      var pixeldata = [];
      this.state.cartItems.forEach((val, i) => {
        if (i == 0) pixeldata = [{ id: val.productid, quantity: val.qty }];
        else
          pixeldata = [...pixeldata, { id: val.productid, quantity: val.qty }];
      });
      if($("#wallet_amount_check").prop("checked") == true){
            var cashback_amount = this.state.cartSmallDetails.wallet;
          if(this.state.symbol == 'USD'){
              var cashback_amount_usd = cashback_amount;
              var cashback_amount_inr = cashback_amount*this.state.inrValue;
          }else{
              var cashback_amount_inr = cashback_amount;
              var cashback_amount_usd = cashback_amount/this.state.inrValue;
          }
          

      }else{
        var cashback_amount_inr = 0;
        var cashback_amount_usd = 0;
      }
      // console.log(cashback_amount,cashback_amount_usd,cashback_amount_inr);
      if (ls.get("sellerid")) {
        this.props.history.push({
          pathname:
            "/start-order/" +
            ls.get("sellerid") +
            "_" +
            parseInt(this.state.totalCartValue) +
            ".html",
          // pathname:
          //   "/start-order-test/" +
          //   ls.get("sellerid") +
          //   "_" +
          //   parseInt(this.state.totalCartValue) +
          //   ".html",
          state: {
            totalCartValue: this.state.totalCartValue,
            totalProductCost: parseFloat(this.state.totalProductCost).toFixed(2),
            totalShippingCost: this.state.totalShippingCost,
            finalShippingCost: this.state.totalShippingCost,
            cartItems: this.state.cartItems,
            countryName: this.state.shippingCountryName,
            symbol: this.state.symbol,
            cartid: this.state.cartid,
            pixeldata: pixeldata,
            shippingCharges: this.state.shippingCharges,
            inrValue: this.state.inrValue,
            totalCartStaticValue: this.state.totalCartStaticValue,
            cashback_amount_inr : cashback_amount_inr,
            cashback_amount_usd : cashback_amount_usd,
            txn_type:this.state.txn_type
          },
        });
      } else {
        this.props.history.push({
          pathname: "/register.html",
          state: {
            totalCartValue: this.state.totalCartValue,
            totalProductCost: parseFloat(this.state.totalProductCost).toFixed(2),
            totalShippingCost: this.state.totalShippingCost,
            finalShippingCost: this.state.finalShippingCost,
            cartItems: this.state.cartItems,
            countryName: this.state.shippingCountryName,
            symbol: this.state.symbol,
            cartid: this.state.cartid,
            pixeldata: pixeldata,
            shippingCharges: this.state.shippingCharges,
            inrValue: this.state.inrValue,
            link:
              "/start-order/" +
              Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 8) +
              ".html",
          //  link:
          //     "/start-order-test/" +
          //     Math.random()
          //       .toString(36)
          //       .replace(/[^a-z]+/g, "")
          //       .substr(0, 8) +
          //     ".html",
          },
        });
      }
      this.setState({
        shippingNotAvailable: 0,
      });
    } else {
      captureEvent(
        "cart",
        "check_out",
        '{"cart":"' +
          JSON.stringify(this.state.cartItems) +
          '", "totalShippingCost":"' +
          this.state.totalShippingCost +
          '", "totalCartValue":"' +
          this.state.totalCartValue +
          '", "totalProductCost":"' +
          this.state.totalProductCost +
          '", "symbol":"' +
          this.state.symbol +
          '"}',
        "failure",
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      this.setState({
        shippingNotAvailable: 1,
      });
    }
  };

  shipDetMethod(shipMethod, startcnt, endcnt, type) {
    let showmethod = [...shipMethod];
    //  console.log('shipDetMethod: ',shipMethod, startcnt, endcnt, type, showmethod)

    let temp1 = showmethod.splice(startcnt, endcnt);
    return showmethod;
  }
  
  generateSpinner(id){
    var el = document.getElementById(id);
    // console.log(el,743);
    var className = 'd-none';
    el.classList.remove(className)
  }

  removeSpinner(id){
    var el = document.getElementById(id);
    var className = 'd-none';
    if (el.classList)
            el.classList.add(className)
  }


  check_product_available(item){
    var filter_array = [];
    item.map((eachitem,index)=>{
        filter_array.push(eachitem.offer_stock);
    })
    var i = 0;
    // filter_array = ["1","0","2"];
    // console.log(filter_array,852);
    for (i = 0; i < filter_array.length; i++) {
        if(filter_array[i] == "0"){
            $('#checkout_button').attr('disabled','true');
            // console.log('true',852);
            break;
        }else{
          $('#checkout_button').removeAttr('disabled');
            // console.log('false',852);
        }
    }
  }

  handleScroll = (event) => {
    var ele1 = document.getElementById('table');
      // console.log(ele1,ele1.length);
        if(ele1 !== null && ele1 !== undefined){
          $(window).scroll(() => {
            try{
              var initial_height_of_table  = $('#table').offset().top;
              if(initial_height_of_table !== undefined){
              var scroll_top_value = $(window).scrollTop();
                // var height_of_the_table  = $('#table')[0].scrollHeight;
                var height_of_the_table  = $('#left_div')[0].scrollHeight -100;
                // var height_of_the_table  = $('.cart-buttons').offset().top;
                var scroll_stop_value = document.body.offsetHeight - parseInt($('#table').offset().top + height_of_the_table);
                var new_height = document.body.offsetHeight - $('.footer-light')[0].scrollHeight;
                // console.log(scroll_top_value,height_of_the_table,927);
                if(scroll_top_value > height_of_the_table){
                  // console.log($('#table').offset().top,$(window).scrollTop(),$('#left_div')[0].scrollHeight,927);
                    // if(scroll_top_value >= new_height){
                    $('#right_div').css({
                        position: 'absolute',
                        // top:height_of_the_table+'px',
                        top:parseInt(height_of_the_table+100)+'px',
                        right: '0px'
                    });
                }else{
                    $('#right_div').css({
                        position: 'fixed',
                        right: '0px',
                        top:'unset',
                    });
                }
              }
            }catch(err){
              console.error(err)
            }
          })
        }
  }


  activateLoader = () => {
    var getAllElement = document.getElementsByClassName('common_class_for_spin')
    var i;
    if(getAllElement.length > 0){
      // console.log('if',930)
      for(i=0;i<getAllElement.length;i++){
        getAllElement[i].classList.remove('d-none')
      }
    }
  }

  deactivateLoader = () => {
    var getAllElement = document.getElementsByClassName('common_class_for_spin')
    var i;
    if(getAllElement.length > 0){
      for(i=0;i<getAllElement.length;i++){
        getAllElement[i].classList.add('d-none')
      }
    }
  }

  render() {
    // console.log(this.state.noShippinCost,'render');
    const InputProps = {
      required: true,
    };
    const { cartItems, symbol,shipMethod } = this.state;
    const position_of_price_for_web = {
      position:'fixed',
      right:'0px'
    }
    const posiiton_of_price_for_mobile = {
      position:'relative',
      right:'unset'
    }
    const borderColor = {
      border: '2px solid #ff9944'
    }
    const HRLine = ({color}) => (
      <hr
          style={
            {
              color: color,
              backgroundColor: color,
              height: 1,
              marginTop:0,
              marginBottom:0,
            }
          }
      />
    )
    
    // console.log('render',this.props);
    // const shipMethod = [
    //   { value: "air", label: "Air Express", country: "india" },
    //   { value: "sea_surface", label: "Ocean Express", country: "india" },
    //   { value: "surface", label: "Surface", country: "india" },
    // ];
    let ColoredLine = ({ id }) => (
        <div class="spinner-border spinner-border-sm common_class_for_spin d-none" id={id} role="status" style={{color:'#f1aa61'}}>
        <span class="sr-only">Loading...</span>
        </div>
    );
    return (
      <div>
        {/*SEO Support*/}
        <Helmet>
          <title>Cart</title>
          <meta name="description" content="Cart on Beldara.com" />
        </Helmet>

        <div
          id="toast_message"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="toast toast_pull_right fade hide"
        >
          <div className="toast-body">
            <i className="fas fa-check"></i> Product Added To Cart
          </div>
        </div>
        {/*SEO Support End */}

        <Breadcrumb title={"Cart"} />
        {this.state.isPageLoaded == 0 ? (
          <LoadingComponent />
        ) : cartItems && cartItems.length > 0 ? (
          <section className="cart-section section-b-space">
            <div className="container-fluid">
              <div className="row">
                <div id="left_div" className="col-sm-12 col-md-9">
                  <h5 className="h6 mx-5">PRODUCT INFO</h5>
                  <table  id="table" className="table cart-table table-responsive-xs" style={{tableLayout:'fixed'}}>
                    {/* <thead>
                      <tr className="table-head">
                        <th scope="col">image</th>
                        <th scope="col">product name</th>
                        <th scope="col">price</th>
                        <th scope="col">quantity</th>
                        <th scope="col">total</th>
                        <th scope="col">action</th>
                      </tr>
                    </thead> */}

                    {cartItems.map((eachcartitem, index) => {
                      if (
                        eachcartitem.name != "" &&
                        eachcartitem.name !== undefined
                      ) {
                        let item = eachcartitem;

                        return (
                          <tbody key={index}>
                            <tr className={isMobile ? 'd-flex' : ''}>
                              <td className={isMobile ? 'd-block' : ''}>
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
                                {
                                  item.offer_stock == 0 
                                  ? (
                                    <div className="text-danger">OUT OF STOCK</div>
                                  )
                                  : ''
                                }
                              </td>
                              <td className={isMobile ? 'd-block' : ''} colSpan="2">
                                <div
                                  className="mobile-cart-content row mouse_pointer"
                                  onClick={this.deleteCartitem.bind(this, item)}
                                >
                                  <i className="fa fa-trash text-danger ml-auto"></i>
                                </div>
                                <a
                                  className="my-2 d-block"
                                  target="_blank"
                                  href={`${process.env.PUBLIC_URL}/product/${item.url}.html`}
                                >
                                  {item.name}
                                </a>
                                <a className="my-2 d-block" href="./cart.html">{item.company}</a>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) && !isMobile ? (
                                  <h4 class="my-2">
                                    <span className="count">
                                          <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                                              <span class="sr-only">Loading...</span>
                                            </div>
                                            {
                                                symbol == 'INR'
                                                  ? <i className="fa fa-inr"></i>
                                                  : <i className="fa fa-usd"></i>
                                              } 
                                            {new Intl.NumberFormat().format(item.eachprice)}/{item.unit}
                                    </span>
                                  </h4>
                                ) : (
                                  ""
                                )}
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
                                              onClick={this.decreaseOneQty.bind(
                                                this,
                                                item.productid,
                                                item.cartitemid,
                                                item.qty,
                                                item.quantity,
                                                symbol,
                                                this.state.inrValue,
                                                this.state.usdValue,
                                                item.eachprice,
                                                item.offer_price,
                                                item.offer_from_date,
                                                item.offer_to_date,
                                                item.offer_min_qty,
                                                item.offer_mrp_price,
                                                item.offer_currency,
                                                item.offer_unit,
                                                item.offer_stock
                                              )}
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
                                              onClick={this.increaseOneQty.bind(
                                                this,
                                                item.productid,
                                                item.cartitemid,
                                                item.qty,
                                                symbol,
                                                this.state.inrValue,
                                                this.state.usdValue,
                                                item.eachprice,
                                                item.offer_price,
                                                item.offer_from_date,
                                                item.offer_to_date,
                                                item.offer_min_qty,
                                                item.offer_mrp_price,
                                                item.offer_currency,
                                                item.offer_unit,
                                                item.offer_stock
                                              )}
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
                                      <span className="count">
                                          <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                                              <span class="sr-only">Loading...</span>
                                            </div>
                                            {
                                                symbol == 'INR'
                                                  ? <i className="fa fa-inr"></i>
                                                  : <i className="fa fa-usd"></i>
                                              } 
                                            {new Intl.NumberFormat().format(item.eachprice)}/{item.unit}
                                      </span>
                                      </small>
                                      <div className="text-dark">
                                        <small className="text-dark">
                                          <b>
                                            Total Price: 
                                            <span className="count">
                                                <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                                                    <span class="sr-only">Loading...</span>
                                                  </div>
                                                  {
                                                      symbol == 'INR'
                                                        ? <i className="fa fa-inr"></i>
                                                        : <i className="fa fa-usd"></i>
                                                    } 
                                                  {" "}
                                                  {new Intl.NumberFormat().format(item.totalprice)}{" "}
                                            </span>
                                            {/* {symbol} */}
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
                              {/* <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <h4>
                                    {symbol} {item.eachprice}
                                  </h4>
                                ) : (
                                  ""
                                )}
                              </td> */}
                              <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <div>
                                      <div className="qty-box align-items-center">
                                      <div className="input-group">
                                        <span className="input-group-prepend">
                                          <button
                                            type="button"
                                            className="btn quantity-left-minus"
                                            onClick={this.decreaseOneQty.bind(
                                              this,
                                              item.productid,
                                              item.cartitemid,
                                              item.qty,
                                              item.quantity,
                                              symbol,
                                              this.state.inrValue,
                                              this.state.usdValue,
                                              item.eachprice,
                                                  item.offer_price,
                                                  item.offer_from_date,
                                                  item.offer_to_date,
                                                  item.offer_min_qty,
                                                  item.offer_mrp_price,
                                                  item.offer_currency,
                                                  item.offer_unit,
                                                  item.offer_stock
                                            )}
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
                                            onClick={this.increaseOneQty.bind(
                                              this,
                                              item.productid,
                                              item.cartitemid,
                                              item.qty,
                                              symbol,
                                              this.state.inrValue,
                                              this.state.usdValue,
                                              item.eachprice,
                                              item.offer_price,
                                              item.offer_from_date,
                                              item.offer_to_date,
                                              item.offer_min_qty,
                                              item.offer_mrp_price,
                                              item.offer_currency,
                                              item.offer_unit,
                                              item.offer_stock
                                            )}
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
                                      {/* <ColoredLine id={item.cartitemid} /> */}
                                      <div class="spinner-border spinner-border-sm common_class_for_spin d-none" id={item.cartitemid} role="status" style={{color:'#f1aa61'}}>
                                        <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                          {this.state.validation  ? <div className="text-danger d-none common_validate_class" id={`validate_`+item.cartitemid}>{this.state.validation_text}</div> : ''}
                                  </div>
                                ) : (
                                  <div className=" text-danger">
                                    OUT OF STOCK
                                  </div>
                                )}
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <h4 className="td-color my-2">
                                    {/* {symbol}  */}
                                    {
                                                symbol == 'INR'
                                                  ? <i className="fa fa-inr"></i>
                                                  : <i className="fa fa-usd"></i>
                                    } 
                                    {new Intl.NumberFormat().format(item.totalprice)}
                                  </h4>
                                ) : (
                                  ""
                                )}
                              </td>
                              {/* <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <h4 className="td-color">
                                    {symbol} {item.totalprice}
                                  </h4>
                                ) : (
                                  ""
                                )}
                              </td> */}
                              <td>
                                <span
                                  className="mouse_pointer"
                                  onClick={this.deleteCartitem.bind(this, item)}
                                >
                                  <i className="fa fa-trash text-danger"></i>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        );
                      }
                    })}
                  </table>
                  {/* <div className="d-flex align-items-center">
                    <div className="text-right w-50 mr-5">
                      Total Product Cost :
                    </div>
                    <div className="text-left h6">
                      {symbol} {this.state.totalProductCost}
                    </div>
                  </div> */}
                  <React.Fragment>
                    {Object.keys(this.state.shippingCharges).map(
                      (eachcountry, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="row my-3 align-items-center">
                              <div className={`col-md-3`}>
                                Shipping from{" "}
                                {
                                  this.state.shippingCharges[eachcountry]
                                    .country
                                }
                                :{" "}
                              </div>
                              <div
                                //style={{ width: "40%" }}
                                className="col-md-6"
                              >
                                {this.state.shippingCountryName ? (
                                  this.state.shippingCountryName.toLowerCase() ==
                                  this.state.shippingCharges[
                                    eachcountry
                                  ].country.toLowerCase() ? (
                                    <Select
                                      id={
                                        this.state.shippingCharges[eachcountry]
                                          .country
                                      }
                                      isOptionSelected="true"
                                      options={this.shipDetMethod(
                                        shipMethod,
                                        1,
                                        1
                                      )}
                                      defaultValue={this.shipDetMethod(
                                        shipMethod,
                                        1,
                                        2
                                      )}
                                      onChange={(e) => {
                                        this.handleShipping(
                                          e,
                                          this.state.shippingCharges[
                                            eachcountry
                                          ].country
                                        );
                                      }}
                                    />
                                  ) : (
                                    <Select
                                      id={
                                        this.state.shippingCharges[eachcountry]
                                          .country
                                      }
                                      isOptionSelected="true"
                                      options={this.shipDetMethod(
                                        shipMethod,
                                        2,
                                        1
                                      )}
                                      defaultValue={this.shipDetMethod(
                                        shipMethod,
                                        1,
                                        2
                                      )}
                                      onChange={(e) => {
                                        this.handleShipping(
                                          e,
                                          this.state.shippingCharges[
                                            eachcountry
                                          ].country
                                        );
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
                                    onChange={(e) => {
                                      this.handleShipping(
                                        e,
                                        this.state.shippingCharges[eachcountry]
                                          .country
                                      );
                                    }}
                                  />
                                )}
                              </div>
                              <div className="col-md-3">
                                {/* <div className="text-right w-50 mr-5">
                                  Shipping Cost From{" "}
                                  {
                                    this.state.shippingCharges[eachcountry]
                                      .country
                                  }
                                  :
                                </div> */}
                                {/* {
                                parseInt(this.state.isShippingCountry) ==
                                parseInt(1) ? (
                                  (parseFloat(
                                    this.state.shippingCharges[eachcountry]
                                      .shippingCost
                                  ) > parseFloat(0)) || this.state.noShippinCost? ( */}
                                  {
                                this.state.noShippinCost? (
                                    <div className="mx-2 h6">
                                      {" "}
                                      <span className="count">
                                          <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                                              <span class="sr-only">Loading...</span>
                                            </div>
                                            {symbol == 'INR' ? <i className="fa fa-inr"></i>: <i className="fa fa-usd"></i>}
                                        {" " +
                                        new Intl.NumberFormat().format(this.state.shippingCharges[eachcountry]
                                          .shippingCost)}{" "}
                                    </span>
                                      
                                    </div>
                                  ) : (
                                    <div className="text-left">
                                      {" "}
                                      Please select another Shipping Method / QTY
                                      to Continue{" "}
                                    </div>
                                  )
                                // ) : (
                                //   <div className="text-left">
                                //     {" "}
                                //     Select Shipping Country to check Shipping Cost{" "}
                                //   </div>
                                // )
                                }
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      }
                    )}
                    {/* <div className="d-flex align-items-center">
                      <div className="text-right w-50 mr-5">Total Price :</div>

                      {parseInt(this.state.isShippingCountry) == parseInt(1) ? (
                        parseFloat(this.state.totalShippingCost) >
                        parseFloat(0) ? (
                          <div className="text-left h6">
                            {symbol + " " + this.state.totalCartValue}{" "}
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
                    </div> */}
                  </React.Fragment>
                </div>
                <div id="right_div" className="col-md-3 col-sm-12" style={!isMobile ? position_of_price_for_web : posiiton_of_price_for_mobile}>
                        <div className="row col-md-12 px-0 justify-content-center my-2 mx-1" style={borderColor}>
                             ORDER SUMMARY
                        </div>
                        <div className="row col-md-12 px-0 mx-1" style={{backgroundColor:'#f5f5f5'}}>
                            {/* <div className="row"> */}
                                {/* <div className="col-md-12 py-1"> */}
                                {/* </div> */}
                            {/* </div> */}
                            <div className="col-md-12 py-1">
                                <div className="justify-content-around">
                                    <div className="float-left">
                                        Sub-Total
                                    </div>
                                    <div className="float-right">
                                    <span className="count">
                                          <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                                              <span class="sr-only">Loading...</span>
                                            </div>
                                              {
                                                symbol == 'INR'
                                                  ? <i className="fa fa-inr"></i>
                                                  : <i className="fa fa-usd"></i>
                                              } 
                                              {new Intl.NumberFormat().format(this.state.totalProductCost)}
                                    </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 py-1">
                                <div className="justify-content-around">
                                    <div className="float-left">
                                        Shipping Charge
                                    </div>
                                    <div className="float-right">
                                    <span className="count">
                                          <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                                              <span class="sr-only">Loading...</span>
                                            </div>
                                            {
                                                symbol == 'INR'
                                                  ? <i className="fa fa-inr"></i>
                                                    : <i className="fa fa-usd"></i>
                                            } 
                                            {new Intl.NumberFormat().format(this.state.totalShippingCost)} 
                                    </span>
                                        
                                    </div>
                                </div>        
                            </div>
                            {/* <div className="col-md-12">
                            {this.state.cartSmallDetails.wallet != "" &&
                              this.state.cartSmallDetails.wallett != "null" &&
                              this.state.cartSmallDetails.wallet !== null &&
                              parseInt(this.state.cartSmallDetails.wallet) > 0 ? 
                                (this.state.symbol == 'USD')
                                ?
                                <div className="row align-items-center 1 ml-4">
                                  <div className="form-group">
                                    <input
                                      class="form-check-input"
                                      type="checkbox"
                                      name="wallet_amount_check"
                                      id="wallet_amount_check"
                                      onChange={this.handleChange}
                                    />
                                    <label
                                      class="form-check-label"
                                      for="wallet_amount_check"
                                    >
                                      {`Use wallet Amount ( `}{this.state.symbol == 'INR' ? <i className="fa fa-inr"></i> : <i className="fa fa-usd"></i>} {`${parseFloat(this.state.cartSmallDetails.wallet).toFixed(2)})`}
                                    </label>
                                  </div>
                                </div>
                                : (this.state.symbol == 'INR') ?
                                <div className="row align-items-center 2 ml-4">
                                  <div className="form-group">
                                    <input
                                      class="form-check-input"
                                      type="checkbox"
                                      name="wallet_amount_check"
                                      id="wallet_amount_check"
                                      onChange={this.handleChange}
                                    />
                                    <label
                                      class="form-check-label"
                                      for="wallet_amount_check"
                                    >
                                      {`Use wallet Amount ( `}{this.state.symbol == 'INR' ? <i className="fa fa-inr"></i> : <i className="fa fa-usd"></i>} {`${parseFloat(this.state.cartSmallDetails.wallet).toFixed(2)})`}
                                    </label>
                                  </div>
                                </div>
                              : ''
                              : '' 
                              }
                            </div> */}
                            <div className="col-md-12 py-1">
                              <HRLine color='#0e0e0e'/>
                                <div className="justify-content-around">
                                    <div className="float-left">
                                        Total Amount
                                    </div>
                                    <div className="float-right">
                                    <span className="count">
                                          <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                                              <span class="sr-only">Loading...</span>
                                            </div>
                                            {
                                              symbol == 'INR'
                                                ? <i className="fa fa-inr"></i>
                                                  : <i className="fa fa-usd"></i>
                                              } 
                                            {new Intl.NumberFormat().format(this.state.totalCartValue)} 
                                    </span>
                                        
                                    </div>
                                </div>        
                            </div>
                            <div className="col-md-12 py-1 text-center">
                                <button
                                    onClick={this.goToOrder}
                                    className="btn btn-solid mouse_pointer"
                                    id="checkout_button"
                                >
                                    PLACE ORDER
                                </button>
                            </div>
                        </div>
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
                  {/* <button
                    onClick={this.goToOrder}
                    className="btn btn-solid mouse_pointer"
                    id="checkout_button"
                  >
                    check out
                  </button> */}
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

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, {
  removeFromCart,
  incrementQty,
  decrementQty,
  changeQty,
})(cartComponent);
