import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import ls from "local-storage";
import RazorpayForm from "../razorpayForm/razorpayForm";
import $ from 'jquery'
import './start-order.css'
import { ApiUrl } from "../../constants/ActionTypes";
import Paytm from "../payment-gateway/paytm";
import { captureEvent, getCookie } from "../../functions";
import { priceConversion, minTresholdBarrier } from "../../services";
import IntlTelInput from 'react-intl-tel-input';
import ReactPixel from "react-facebook-pixel";
import '../../index.scss'
import 'react-intl-tel-input/dist/main.css';
// import {
//   getCartTotal,
//   getShippingCost,
//   getTotalCartValue,
//   getTotalShippingCost
// } from "../../services";
// import {
//   removeFromCart,
//   incrementQty,
//   decrementQty,
//   changeQty,
//   getCart,
//   updateCart,
//   getAllCountry,
//   receiveGetCart,
//   receiveCart
// } from "../../actions";
// import store from "../../store";

var complete_address = '';
var cashback_value = 0;
var txn_type = '';
class StartOrder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      moqErr: false,
      first_name: "",
      last_name: "",
      phone: "",
      email: props.user.email,
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark:'',
      express: 'air',
      shippingCountry: 93,
      totalShipmentCost: 200, 
      addNotValid: 0,
      shippingFrom: '1',
      link: `${ApiUrl}/common/product_purchased.php`,
      // link: `${ApiUrl}/common/product_purchased_kau.php`,
      checked:'razorpay',
      key: 0,
      totalCartValue: 0,
      totalProductCost: 0,
      totalShippingCost: 0,
      finalShippingCost: 0,
      symbol: 'USD',
      cartitems: [],
      totalqty: 0,
      inrValue: 70,
      buyer_country: "",
      buyer_country_id: "",
      buyer_country_name: "",
      render_static_val : 0,
      cart_id:0,
      price_check:false,
      price_check_text:''
    };
    this.validator = new SimpleReactValidator();
  }

  setStateFromInput = async event => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    await this.setState(obj);
    complete_address = ''
    if (this.state.address)
      complete_address=this.state.address
    if (this.state.landmark)
      complete_address+=' '+this.state.landmark
    if (this.state.city)
      complete_address+=' '+this.state.city
    if (this.state.state)
      complete_address+=' '+this.state.state
    if (this.state.pincode)
      complete_address+=' '+this.state.pincode

    captureEvent('start_order', 'address', complete_address, 'address', ls.get('sellerid'), getCookie('mhinpbnb'))
  };

  orderSubmit = async (e) => {
    this.setState({
      addNotValid: 0
    })
    e.preventDefault();

    if (this.validator.allValid()) {
    $('#price_validating_start').removeClass('d-none');
      // console.log('valid');
      $(".chkValidate").select().css({border:'none'})
        axios.post(
        "https://api.indiabigshop.com/common/upd_add_buyer.php",
        {
          security_token: "",
          plateform_type: "",
          sellerid: ls.get('sellerid'),
          address: this.state.address,
          city: this.state.city,
          zipcode: this.state.pincode,
          landmark: this.state.landmark,
          state: this.state.state
          
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      ).then(async response => {
        // console.log(this.state.totalProductCost,this.state.symbol,this.state.cartId,129);
        axios.post(
          `${ApiUrl}/common/check_product_cost.php`,
          {security_token:'',plateform_type:'',total_product_cost:this.state.totalProductCost,currency:this.state.symbol,cart_id:this.state.cartId},
          { headers: { "Content-Type": "multipart/form-data" } }
        ).then(response => {
          // console.log(response.data.result[0].status,129);
          if (response.data.result[0].status == 'true'){
            $('#price_validating_start').addClass('d-none');
            let product_currency = this.state.symbol
            let total_price = this.state.totalCartValue;
            if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
            total_price = parseFloat(total_price) / this.state.inr;
            total_price = parseFloat(total_price).toFixed(2);
            // console.log(this.props.location.state.pixeldata,product_currency,total_price,'127');
            ReactPixel.trackCustom( 'Purchase', {
              contents: this.props.location.state.pixeldata,
              content_type: 'product',
              value: total_price,
              currency: 'USD'
            })
            
        // return response.data.result; 
        if (this.state.checked === 'razorpay') {
          $(".razorpay-payment-button").click();
          
        }
        else {
          // document.Paytm.submit()
          
          $(".paytmBtn").click()
          
        }
          }else{
          $('#price_validating_start').addClass('d-none');
          $('#price_validating_end').removeClass('d-none');
          var inter = setInterval(() => {
            window.location.href="/cart.html"
            clearInterval(inter)
          },5000)
            // console.log('error occurred: '+response.data.result[0].status);
          }
          // return 
        }).catch(error => {
          console.log(error,192);
          const result = error.response;
          return Promise.reject(result);
        });
            
      })
      .catch(error => {
        const result = error.response;
        // console.log(result,149,error);
        return Promise.reject(result);
      });
    } else {
      // console.log('invalid');
      this.setState({
        addNotValid: 1
      })
      $(".chkValidate").click()
      $(".chkValidate").css({ border: '1px solid red' })
      this.validator.showMessages();
      // rerender to show messages for the first time
      this.forceUpdate();
    }
    let status;
    if (this.state.addNotValid == 0)
      status = 'not valid';
    else
      status = 'valid';
    
      captureEvent('start_order', status, complete_address, 'check_out', ls.get('sellerid'), getCookie('mhinpbnb'))


  };


  checkProductPrice = () => {
    axios.post(
      `${ApiUrl}/common/check_product_cost.php`,
      {security_token:'',plateform_type:'',total_product_cost:this.state.totalProductCost,currency:this.state.symbol,cart_id:this.state.cartId},
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(response => {
      // console.log(response.data,183,this.state.totalProductCost,this.state.cartId,this.state.symbol);
      return response.data.result[0].status;
      // return 
    }).catch(error => {
      console.log(error,192);
      const result = error.response;
      return Promise.reject(result);
    });
  }

  changeMethod(method) {
    this.setState({ checked: method })
    captureEvent('start_order', 'change_payment_method', method, 'change_payment_method', ls.get('sellerid'), getCookie('mhinpbnb'))
  }

  componentDidMount = async () =>  {
    console.log(this.props,'render');
    this.updateCart();
    // if(this.props.location.state.cashback_amount_inr > 0){
    //   if(this.props.currency == 'INR'){
    //     txn_type = 'debit';
    //     cashback_value = this.props.location.state.cashback_amount_inr;
    //   }else{
    //     txn_type = 'debit';
    //     cashback_value = this.props.location.state.cashback_amount_usd;
    //   }
    // }
    // else{
    //     txn_type = 'credit';
    //     cashback_value = 0;
    // }
    
    // console.log(this.state,186);
    const advancedMatching = { em: "support@beldara.com" };
    const options = {
      autoConfig: true, // set pixel's autoConfig
      debug: false // enable logs
    };
    ReactPixel.init("432219770935494", advancedMatching, options);
    ReactPixel.init("2231476330510319", advancedMatching, options);
    ReactPixel.pageView();
    await this.setState({
      countryName : getCookie('country_name')
    })
  }

  componentWillReceiveProps = async (nextProps) => {
    // console.log(this.state.countryid,this.state.symbol,getCookie('country_code'),getCookie('currency'));
    if(this.state.countryid != getCookie('country_code')){
      $('.common_class_for_spin').removeClass('d-none');
      // console.log('country changed',this.state.shippingCountry,getCookie('countryid'),92);
      axios.post(
        `${ApiUrl}/common/update_country_cart.php`,
        {sellerid:ls.get('log_id'),plateform_type:'',security_token:'',visitor_id:getCookie('mhinpbnb'),currency:getCookie('currency'),country_code:getCookie('country_code'),country_to:getCookie('countryid'),txn_type:this.props.location.state.txn_type},
        {
          headers:{
            "content-type":"multipart/form-data"
          }
        }
      ).then(async response =>{
        if(response.data.statusId == '1'){
          await this.setState({
            totalCartValue: parseFloat(response.data.result.cartamount.totalPrice),
              totalProductCost: parseFloat(response.data.result.cartamount.basePrice).toFixed(2),
              finalShippingCost: parseFloat(response.data.result.cartamount.finalShippingCost),
              totalShippingCost: parseFloat(response.data.result.cartamount.finalShippingCost),
              inrValue: parseFloat(this.props.location.state.inrValue),
              symbol: this.props.currency,
              totalCartStaticValue: parseFloat(response.data.result.cartamount.totalCartStaticValue),
              cashback_amount_inr: parseFloat(response.data.result.cartamount.wallet),
              cashback_amount_usd : parseFloat(response.data.result.cartamount.wallet),
              cartId:response.data.result.cartamount.cartID,
              countryid:getCookie('country_code'),
              cashback_value:parseFloat(response.data.result.cartamount.totalCartStaticValue) - parseFloat(response.data.result.cartamount.totalPrice),
              txn_type:this.props.location.state.txn_type,
          })
        $('.common_class_for_spin').addClass('d-none');
          // console.log(response.data.result,128);
        }else{
        $('.common_class_for_spin').addClass('d-none');
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
    $('.common_class_for_spin').removeClass('d-none');
    axios.post(
      `${ApiUrl}/common/update_currency_cart.php`,
      {sellerid:ls.get('log_id'),plateform_type:'',security_token:'',visitor_id:getCookie('mhinpbnb'),symbol:getCookie('currency'),txn_type:this.props.location.state.txn_type},
      {
        headers:{
          "content-type":"multipart/form-data"
        }
      }
    ).then(async response =>{
      if(response.data.statusId == '1'){
        await this.setState({
          totalCartValue: parseFloat(response.data.result.cartamount.totalPrice),
            totalProductCost: parseFloat(response.data.result.cartamount.basePrice).toFixed(2),
            finalShippingCost: parseFloat(response.data.result.cartamount.finalShippingCost),
            totalShippingCost: parseFloat(response.data.result.cartamount.finalShippingCost),
            inrValue: parseFloat(this.props.location.state.inrValue),
            symbol: this.props.currency,
            totalCartStaticValue: parseFloat(response.data.result.cartamount.totalCartStaticValue),
            cashback_amount_inr: parseFloat(response.data.result.cartamount.wallet),
            cashback_amount_usd : parseFloat(response.data.result.cartamount.wallet),
            cartId:response.data.result.cartamount.cartID,
            countryid:getCookie('country_code'),
            cashback_value:parseFloat(response.data.result.cartamount.totalCartStaticValue) - parseFloat(response.data.result.cartamount.totalPrice),
            txn_type:this.props.location.state.txn_type,
        })
      $('.common_class_for_spin').addClass('d-none');
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

    // console.log(nextProps,204);
    let inrValue, usdValue;
    await this.setState({
      countryName : getCookie('country_name')
    })

    if (this.state.buyer_country != getCookie('country_code') && this.state.buyer_country_id != getCookie('countryid') && this.state.buyer_country_name != getCookie('country_name') ) {
      await this.setState({
        buyer_country: getCookie('country_code'),
        buyer_country_id: getCookie('countryid'),
        buyer_country_name: getCookie('country_name'),
      })
    }

    if (this.props.user.sellerid !== undefined && this.props.user.sellerid != '')
      await this.setState({
        key: 1
      })
    
      await this.setState({
        symbol: nextProps.currency
      })

      if(this.state.cashback_value > 0){
          txn_type = 'debit';
          cashback_value = this.props.location.state.cashback_amount_inr;
        }
      else{
          txn_type = 'credit';
          cashback_value = 0;
      }
  }

  updateCart = async ()  => {
    axios.post(
      `${ApiUrl}/common/receive_cart.php`,
      {sellerid:ls.get('log_id'),plateform_type:'',security_token:'',visitor_id:getCookie('mhinpbnb'),symbol:getCookie('currency'),country_code:getCookie('country_code'),txn_type:this.props.location.state.txn_type},
      {
        headers:{
          "content-type":"multipart/form-data"
        }
      }
    ).then(async response =>{
      if(response.data.statusId == '1'){
        await this.setState({
            totalCartValue: parseFloat(response.data.result.cartamount.totalPrice),
            totalProductCost: parseFloat(response.data.result.cartamount.basePrice).toFixed(2),
            finalShippingCost: parseFloat(response.data.result.cartamount.finalShippingCost),
            totalShippingCost: parseFloat(response.data.result.cartamount.finalShippingCost),
            inrValue: parseFloat(this.props.location.state.inrValue),
            symbol: this.props.currency,
            totalCartStaticValue: parseFloat(response.data.result.cartamount.totalCartStaticValue),
            cashback_amount_inr: parseFloat(response.data.result.cartamount.wallet),
            cashback_amount_usd : parseFloat(response.data.result.cartamount.wallet),
            cartId:response.data.result.cartamount.cartID,
            countryid:getCookie('country_code'),
            cashback_value:parseFloat(response.data.result.cartamount.totalCartStaticValue) - parseFloat(response.data.result.cartamount.totalPrice),
            txn_type:this.props.location.state.txn_type,
        })
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
    if(this.state.cashback_value > 0){
      txn_type = 'debit';
      cashback_value = this.props.location.state.cashback_amount_inr;
    }
    else{
      txn_type = 'credit';
      cashback_value = 0;
    }
  }

  render() {
    // console.log('render',this.state);
    const { cartItems, cartid } = this.props.location.state;
    const { totalCartValue, totalProductCost, finalShippingCost , countryName,totalCartStaticValue,cashback_amount_inr,cashback_amount_usd,cashback_value} = this.state;
    let { name, email, mobile, sellerid  , country_name, countryid } = this.props.user
    const { currency } = this.props
    const InputProps = {
      required:true
    }
    
    return (
      <div id={this.state.key}>
        <ul className="container progress-tracker progress-tracker--text progress-tracker--center">
          <li className="progress-step is-complete">
            <span className="progress-marker">1</span>
            <span className="progress-text">
              <h4 className="progress-title">Place Order</h4>
            </span>
          </li>
          <li className="progress-step is-active">
            <span className="progress-marker">2</span>
            <span className="progress-text">
              <h4 className="progress-title">Delivery & Payment</h4>
            </span>
          </li>
          <li className="progress-step">
            <span className="progress-marker">3</span>
            <span className="progress-text">
              <h4 className="progress-title">Confirm Receipt</h4>
            </span>
          </li>
        </ul>
        <div className="container">
          <div class="card-text text-right mb-5">
            <button className="btn btn-solid" id={cartItems.cartitemid} onClick={this.orderSubmit}>
              CONTINUE
            </button>  
          </div>
          <form className="">

              <div className="border-bottom mt-4">
              <span className="h6">Total Price : 
                <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
                </span>
              {currency}{' '}{totalCartValue}</span>
            </div>
              
            <div className="card mt-4">
              <div className="card-header text-dark py-1">
                <i className="fa fa-dolly" />
                Shipping Details
              </div>
              <div className="card-body py-1">
                <div className="detail-section">
                  <table className="w-100">
                    <tbody>
                      <tr className="mt-2">
                        Shipping To: {countryName}
                        </tr>
                      <tr className="mt-2">
                        <td>Shipping Address:</td>
                        <td>
                          <a
                            href="3"
                            data-toggle="collapse"
                            href="#collapseExample"
                            role="button"
                            aria-expanded="true"
                            aria-controls="collapseExample"
                            onClick={e => e.preventDefault()}
                            className="chkValidate"
                          >
                            Add a address +
                          </a>
                          <div className="collapse show" id="collapseExample">
                            <div className="card-body px-0 py-1 mt-3">
                              <div className="has-float-label">
                                <input
                                  id="address"
                                  type="text"
                                  placeholder=" "
                                  name="address"
                                  className="form-control"
                                  onChange={this.setStateFromInput}
                                />
                                <label htmlFor="address">{"address"}</label>
                                {this.validator.message(
                                  "address",
                                  this.state.address,
                                  `required|string`
                                )}
                              </div>
                              <div className="has-float-label">
                                <input
                                  id="landmark"
                                  type="text"
                                  placeholder=" "
                                  name="landmark"
                                  className="form-control"
                                  onChange={this.setStateFromInput}
                                />
                                <label htmlFor="landmark">{"landmark"}</label>
                                {this.validator.message(
                                  "landmark",
                                  this.state.address,
                                  `required|string`
                                )}
                              </div>

                              <div className="has-float-label">
                                <input
                                  id="city"
                                  type="text"
                                  name="city"
                                  placeholder=" "
                                  className="form-control"
                                  onChange={this.setStateFromInput}
                                />
                                <label htmlFor="city">{"City"}</label>
                                {this.validator.message(
                                  "city",
                                  this.state.city,
                                  `required|string`
                                )}
                              </div>

                              <div className="has-float-label">
                                <input
                                  id="state"
                                  type="text"
                                  placeholder=" "
                                  className="form-control"
                                  name="state"
                                  onChange={this.setStateFromInput}
                                />
                                <label htmlFor="state">{"state"}</label>
                                {this.validator.message(
                                  "state",
                                  this.state.state,
                                  `required|string`
                                )}
                              </div>

                              <div className="has-float-label">
   
                                <NumberFormat
                                  id="pincode"
                                  name="pincode"
                                  placeholder=" "
                                  className="form-control input-number"
                                  onChange={this.setStateFromInput}
                                />

                                <label htmlFor="pincode">
                                  {"Zip Code / Postal Code"}
                                </label>
                                {this.validator.message(
                                  "pincode",
                                  this.state.pincode,
                                  `required|numeric`
                                )}
                              </div>
                           
                                
                             
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                    </tbody>
                  </table>
                  
                      <div className="mt-2">
                        <div>Estimated Lead Time: </div>
                          <div>
                            Ship within 2 - 7 business days after supplier receiving payment.
                        </div>
                    </div>
                  
                </div>
              </div>
              <div className="card-footer text-right">
                Total Shipping Fee :
                <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
                </span>
                {currency}{' '}{finalShippingCost}
                {/* <PriceCalc
                  symbol={currency}
                  start_price={totalShippingCost}
                  end_price=""
                  key={"index"}
                /> */}
              </div>
            </div>
            <div className="card mt-4">
              <div className="card-header text-dark py-1">
                <i className="fa fa-dolly" />
                Payment Method
              </div>
              <div className="card-body py-1">
              <div className="payment-box">
                  <div className="upper-box">
                      <div className="payment-options">
                          <ul>
                              <li>
                                  <div className="radio-option stripe">
                                      <input type="radio" name="payment-group" method="razorpay" id="payment-2" defaultChecked={true} onClick={()=>this.changeMethod('razorpay')} />
                                      <label htmlFor="payment-2">Pay using Credit / Debit Card</label>
                                  </div>
                              </li>
                              { currency == 'INR' ?
                              <li>
                                  <div className="radio-option paypal ">
                                      <input type="radio" name="payment-group" method="paytm" id="payment-1"  onClick={()=>this.changeMethod('paytm')}/>
                                          <label htmlFor="payment-1">Pay using Paytm</label>
                                  </div>
                              </li>
                              : ''}
                          </ul>
                      </div>
                  </div>
                  
              </div>
                
              </div>
            
                </div>
            {(cashback_value > 0)
            ?
            <div className="card-text card-body text-right ">
            <div className="">
              Total Price of Products :
              <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
              </span>
               {currency} {' '} {totalProductCost}
            </div>
            <div className="">
              <b>+</b>   Total Shipping Fee :
              <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
              </span>
              {currency}{' '}{finalShippingCost}
              <br/>
              <b>-</b>
                 Wallet Amount :
                 <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
                </span>
                 {currency}   {parseFloat(cashback_value).toFixed(2)}
              {/* <PriceCalc
                symbol={currency}
                start_price={totalShippingCost}
                end_price=""
                key={"index"}
              /> */}
            </div>
            <hr className=""/>
            <div className="">  
              Total Cost :
              <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
              </span>
              {currency}{' '}{totalCartValue}
            </div>
          </div>
            : 
            <div className="card-text card-body text-right ">
            <div className="">
              Total Price of Products : 
              <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
              </span>
              {currency} {' '} {totalProductCost}
            </div>
            <div className="">
              <b>+</b>   Total Shipping Fee :
              <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
              </span>
              {currency}{' '}{finalShippingCost}
              {/* <PriceCalc
                symbol={currency}
                start_price={totalShippingCost}
                end_price=""
                key={"index"}
              /> */}
            </div>
            <hr className=""/>
            <div className="">  
              Total Cost :
              <span className="count">
                    <div class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none" role="status" style={{color:'#f1aa61'}}>
                      <span class="sr-only">Loading...</span>
                   </div>
              </span>
              {currency}{' '}{totalCartValue}
            </div>
            <div className="d-none text-danger" id="price_validating_start">
            Validating your cart. Please wait for a moment....
            </div>
            <div className="d-none text-danger" id="price_validating_end">
              we are redirecting to your cart kindly visit and checkout or <a href="/cart.html">click here</a>
            </div>
          </div>
            }
            <div className="card-text text-right ">
            { this.state.addNotValid?
              <div className="alert col-sm-12 col-md-4 ml-auto text-center alert-danger">
                  Please Enter Valid address
              </div>
              : ''
              }
              <button className="btn btn-solid  mb-5" id={cartItems.cartitemid} onClick={this.orderSubmit}>
                CONTINUE
              </button>          
              {/* <RazorpayForm totalCost={totalCartValue} name={name} email={email} mobile={mobile}
                id={'productOrder'} sellerid={sellerid} currency={currency} amount={totalCartValue}
                page={''} type={''} event={'Product-Order'} className={'productOrder'} method="POST"
                action={this.state.link} isLoggedIn={this.isLoggedIn} item={cartItems}
                value={"cartid=" + cartid + ",amount=" + totalCartValue + ",sellerid=" + ls.get('sellerid') + ",mainurl=" + window.location.hostname + ",currency=" + currency + ",shipping_cost=" + this.state.finalShippingCost + ",email=" + email+", address="+this.state.address+", landmark="+this.state.landmark+", state="+this.state.state+", pincode="+this.state.pincode+", city="+this.state.city+", countryName="+countryName} 
              /> */}
              <RazorpayForm totalCost={totalCartValue} name={name} email={email} mobile={mobile}
                id={'productOrder'} sellerid={sellerid} currency={currency} amount={totalCartValue}
                page={''} type={''} event={'Product-Order'} className={'productOrder'} method="POST"
                action={this.state.link} isLoggedIn={this.isLoggedIn} item={cartItems}
                value={"cartid=" + cartid + ",amount=" + totalCartValue + ",sellerid=" + ls.get('sellerid') + ",mainurl=" + window.location.hostname + ",currency=" + currency + ",shipping_cost=" + this.state.finalShippingCost + ",email=" + email+", address="+this.state.address+", landmark="+this.state.landmark+", state="+this.state.state+", pincode="+this.state.pincode+", city="+this.state.city+", countryName="+countryName+", txn_type="+this.state.txn_type+" ,cashback_value="+cashback_value} 
              />
              <Paytm user={this.props.user} amount={totalCartValue} totalShipmentCost={finalShippingCost} countryName={countryName}
              address={this.state.address} landmark={this.state.landmark} state={this.state.state} pincode={this.state.pincode} city={this.state.city}
                cartid={cartid} complete_address={complete_address}  sellerid={sellerid} buyerid={sellerid}
                item={cartItems} txn_type={this.state.txn_type} cashback_value={cashback_value}
               /> 
              
            </div>
            
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    countries: state.data.countries,
    user: state.user.user,
    currency: state.data.symbol,
    totalCost: state.data.totalCost,
    orderProps: state
  };
};


export default connect(mapStateToProps)(StartOrder);
// export default StartOrder;
