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
import { priceConversion } from "../../services";
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
var totalPriceOfProducts;
var complete_address = '';
var delivery_contact = '';
var type,number,isoValue,dialCode,countryName,unit;
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
      checked:'razorpay',
      key: 0,
      totalCartValue: 0,
      totalProductCost: 0,
      totalShippingCost: 0,
      symbol: 'USD',
      cartitems: [],
      totalqty: 0,
      inrValue: 0,
      min_qty_free_usd: 25,
      min_qty_free: 25,
      min_qty_std_usd: 7,
      min_qty_std: 7,
      min_qty_express: 5,
      min_qty_express_usd: 5,
      shipping_method: 'standard',
      buyer_country: "",
      buyer_country_id: "",
      buyer_country_name: ""
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

  orderSubmit = e => {
    this.setState({
      addNotValid: 0
    })
    e.preventDefault();

    if (this.validator.allValid()) {
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
      ).then(response => {
        
            let product_currency = this.state.symbol
            let total_price = this.state.totalCartValue;
            if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
            total_price = parseFloat(total_price) / 70;
        
        total_price = total_price.toFixed();
        
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
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
    } else {
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

  changeMethod(method) {
    this.setState({ checked: method })
    captureEvent('start_order', 'change_payment_method', method, 'change_payment_method', ls.get('sellerid'), getCookie('mhinpbnb'))
  }

  componentDidMount = async () =>  {
    await this.setState({
      totalCartValue: parseFloat(this.props.location.state.totalCartValue),
      totalProductCost: parseFloat(this.props.location.state.totalProductCost),
      totalShippingCost: parseFloat(this.props.location.state.totalShippingCost),
      inrValue: parseFloat(this.props.location.state.inrValue),
      symbol: this.props.currency,
      buyer_country: this.props.location.state.buyer_country,
      buyer_country_id: this.props.location.state.buyer_country_id,
      buyer_country_name: this.props.location.state.buyer_country_name
    })


    this.cal_min_free_qty()
    
    let totalquantity = parseFloat(0);
    if (this.props.location.state.cartItems)
      Object.keys(this.props.location.state.cartItems).forEach((val, ind) => { 
        totalquantity+= parseFloat(this.props.location.state.cartItems[val].qty)
      })

    await this.setState({
      totalqty: totalquantity
    })
     
    if (this.state.buyer_country.toLowerCase() == 'us') {
      this.calc_shipping_cost(this.state.totalqty)
      this.shipping_method_changed('standard')
    } else if ((this.state.buyer_country === undefined || this.state.buyer_country == '') && getCookie('country_code').toLowerCase() == 'us' ){
      this.calc_shipping_cost(this.state.totalqty)
      this.shipping_method_changed('standard')
    }

    const advancedMatching = { em: "support@beldara.com" };
    const options = {
      autoConfig: true, // set pixel's autoConfig
      debug: false // enable logs
    };
    ReactPixel.init("432219770935494", advancedMatching, options);
    ReactPixel.init("2231476330510319", advancedMatching, options);
    ReactPixel.pageView();
    
  }

  cal_min_free_qty = async()=> {
    if (this.state.symbol == 'USD') {
      await this.setState({
        min_qty_free: this.state.min_qty_free_usd,
        min_qty_std: this.state.min_qty_std_usd,
        min_qty_express: this.state.min_qty_express_usd
      })
    } else {
      await this.setState({
        min_qty_free: (this.state.min_qty_free_usd * this.state.inrValue),
        min_qty_std: (this.state.min_qty_std_usd * this.state.inrValue),
        min_qty_express: (this.state.min_qty_express_usd * this.state.inrValue)
      })
    }
  }

  calc_shipping_cost = async () => {

    this.shippingCost()
    await this.setState({
      totalCartValue: parseFloat(this.state.totalShippingCost) + parseFloat(this.state.totalProductCost)
    })
  }

  shippingCost = async () => {

    let tempcost = 0;
    if (this.state.shipping_method == 'express') {
      if (this.state.symbol == 'USD') { 
          tempcost = 5;
      } else {
          tempcost = 5 * parseFloat(this.state.inrValue);
      }
    } else if (parseInt(this.state.totalProductCost) >= parseInt(this.state.min_qty_free)) {
      tempcost = 0;
    }else{
      if (this.state.symbol == 'USD') { 
        tempcost = 7;
      } else {
          tempcost = 7 * parseFloat(this.state.inrValue);
      }
    }

    await this.setState({
      totalShippingCost: parseFloat(tempcost)
    })
  }

  shipping_method_changed = async (id) => {
    $('input[id$="_delivery"]').prop('checked', false);
    $('#'+id+'_delivery').prop('checked', true);
    await this.setState({
      shipping_method : id
    })
    this.calc_shipping_cost(this.state.totalqty)
  }

  componentWillReceiveProps = async (nextProps) => {
    let inrValue, usdValue;
    
    try {
      if (nextProps.currencyValue[0].INR)
        inrValue = nextProps.currencyValue[0].INR;
      else
        inrValue = 70;
    } catch (e) {
        inrValue = 70;
    }
    
    try {
      if (nextProps.currencyValue[0].USD)
        usdValue = nextProps.currencyValue[0].USD;
      else
      usdValue = 1;
    } catch (e) {
        usdValue = 1
    }

    

    captureEvent('start_order', 'change_currency', nextProps.currency, 'change_currency', ls.get('sellerid'), getCookie('mhinpbnb'))

      priceConversion(this.state.totalCartValue, this.state.symbol, inrValue, usdValue, nextProps.currency).then(async (val) => {
        this.setState({
          totalCartValue: parseFloat(val)
        })
      });

      priceConversion(this.state.totalProductCost, this.state.symbol, inrValue, usdValue, nextProps.currency).then(async (val) => { 
        this.setState({
          totalProductCost: parseFloat(val)
        })
      });

      priceConversion(this.state.totalShippingCost, this.state.symbol, inrValue, usdValue, nextProps.currency).then(async (val) => {
        this.setState({
          totalShippingCost: parseFloat(val)
        })
      });

    if (this.props.user.sellerid !== undefined && this.props.user.sellerid != '')
      await this.setState({
        key: 1
      })
    
      await this.setState({
        symbol: nextProps.currency
      })
    
      this.cal_min_free_qty()
  }

  render() {
    const { cartItems, cartid, countryName } = this.props.location.state;
    const { totalCartValue, totalProductCost, totalShippingCost } = this.state;
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
            { this.state.buyer_country.toLowerCase() != "us" ?
              <div className="border-bottom mt-4">
              <span className="h6">Total Price : {currency}{' '}{totalCartValue}</span>
            </div>
              : ( (this.state.buyer_country == '' || this.state.buyer_country === undefined ) && getCookie('country_code').toLowerCase() != 'us') ?
              <div className="border-bottom mt-4">
                <span className="h6">Total Price : {currency}{' '}{totalCartValue}</span>
              </div>
                : ''
            }
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
                  {(this.state.buyer_country.toLowerCase() == 'us') ?
                    <div>
                    <div className="radio-option stripe">
                    <input id="express_delivery" type="radio" method="express" name="express_delivery" onClick={() => this.shipping_method_changed('express') }  /> Express delivery in 2 Day(s)
                        <label className="d-block" htmlFor="express_delivery">- Shipping charge {this.state.symbol} {this.state.min_qty_express} applicable</label>
                    </div>

                    <div className="radio-option paypal ">
                    <input id="standard_delivery" type="radio" method="standard" name="standard_delivery" defaultChecked={true} onClick={() => this.shipping_method_changed('standard') }  /> Standard delivery in 5 - 7 Day(s)
                            <label className="d-block" htmlFor="standard_delivery">- Free Delivery on order of {this.state.symbol} {this.state.min_qty_free} and above</label>
                            <label className="d-block" htmlFor="standard_delivery">- Shipping charge of {this.state.symbol} {this.state.min_qty_std} for order less than {this.state.symbol} {this.state.min_qty_free}.</label>
                    </div>
                </div>
                   
                      :( (this.state.buyer_country == '' || this.state.buyer_country === undefined ) && getCookie('country_code').toLowerCase() == 'us') ?  
                        
                      <div>
                    <div className="radio-option stripe">
                    <input id="express_delivery" type="radio" method="express" name="express_delivery" onClick={() => this.shipping_method_changed('express') }  /> Express delivery in 2 Day(s)
                        <label className="d-block" htmlFor="express_delivery">- Shipping charge {this.state.symbol} {this.state.min_qty_express} applicable</label>
                    </div>

                    <div className="radio-option paypal ">
                    <input id="standard_delivery" type="radio" method="standard" name="standard_delivery" defaultChecked={true} onClick={() => this.shipping_method_changed('standard') }  /> Standard delivery in 5 - 7 Day(s)
                            <label className="d-block" htmlFor="standard_delivery">- Free Delivery on order of {this.state.symbol} {this.state.min_qty_free} and above</label>
                            <label className="d-block" htmlFor="standard_delivery">- Shipping charge of {this.state.symbol} {this.state.min_qty_std} for order less than {this.state.symbol} {this.state.min_qty_free}.</label>
                    </div>
                </div>
                    
                      :
                      <div className="mt-2">
                        <div>Estimated Lead Time: </div>
                          <div>
                            Ship within 2 - 7 business days after supplier receiving payment.
                        </div>
                    </div>
                    }
                </div>
              </div>
              <div className="card-footer text-right">
                Total Shipping Fee :{currency}{' '}{totalShippingCost}
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
            <div className="card-text card-body text-right ">
              <div className="">
                Total Price of Products : {currency} {' '} {totalProductCost}
              </div>
              <div className="">
                <b>+</b>   Total Shipping Fee :{currency}{' '}{totalShippingCost}
                {/* <PriceCalc
                  symbol={currency}
                  start_price={totalShippingCost}
                  end_price=""
                  key={"index"}
                /> */}
              </div>
              <hr className=""/>
              <div className="">  
                Total Cost :{currency}{' '}{totalCartValue}
              </div>
            </div>
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
              <RazorpayForm totalCost={totalCartValue} name={name} email={email} mobile={mobile}
                id={'productOrder'} sellerid={sellerid} currency={currency} amount={totalCartValue}
                page={''} type={''} event={'Product-Order'} className={'productOrder'} method="POST"
                action={this.state.link} isLoggedIn={this.isLoggedIn} item={cartItems}
                value={"cartid=" + cartid + ",amount=" + totalCartValue + ",sellerid=" + ls.get('sellerid') + ",mainurl=" + window.location.hostname + ",currency=" + currency + ",shipping_cost=" + this.state.totalShipmentCost + ",email=" + email+", address="+this.state.address+", landmark="+this.state.landmark+", state="+this.state.state+", pincode="+this.state.pincode+", city="+this.state.city+", countryName="+countryName} 
              />
              <Paytm user={this.props.user} amount={totalCartValue} totalShipmentCost={totalShippingCost} countryName={countryName}
              address={this.state.address} landmark={this.state.landmark} state={this.state.state} pincode={this.state.pincode} city={this.state.city}
                cartid={cartid} complete_address={complete_address}  sellerid={sellerid} buyerid={sellerid}
                item={cartItems}
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
