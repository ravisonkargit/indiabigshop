import React, {Component} from 'react';
import {Helmet} from 'react-helmet'
import { connect } from 'react-redux';
import ReactPixel from "react-facebook-pixel";
import SimpleReactValidator from 'simple-react-validator';
import '../order/start-order.css'
import store from "../../store";
import ls from "local-storage";
import Breadcrumb from "../common/breadcrumb";
import { ApiUrl, Url } from '../../constants/ActionTypes';
import axios from 'axios';
import { priceConversion } from '../../services';
import { getCookie, captureEvent, setCookie } from '../../functions';
import RazorpayForm from '../razorpayForm';
import Paytm from '../payment-gateway/paytm';
import $ from 'jquery';
import { getLoggedIn, getAllCountry } from '../../actions';
import Select from "react-select";
import { apiUrl } from '../../constants/variable';

class checkOut extends Component {

    constructor (props) {
        super (props)

        this.state = {
            payment:'razorpay',
            checked: 'razorpay',
            first_name:'',
            phone:'',
            email:'',
            country:'',
            address:'',
            city:'',
            state:'',
            pincode:'',
            create_account: '',
            totalProductPrice: 0,
            shippingCost: 0,
            OGshippingCost: 0,
            total: 0,
            currency: 'INR',
            OGcurrency: 'INR',
            product_sellerid: '',
            OGprice: '',
            complete_address: '',
            product_currency: '',
            inrValue: 70,
            usdValue: 1,
            link: `${apiUrl}product_purchased_express.php`,
            prod_id: '',
            method: 'air',
            qty: 1
        }

        this.validator = new SimpleReactValidator();
        this.handleShipping = this.handleShipping.bind(this);
        this.getExpressShippingDetail = this.getExpressShippingDetail.bind(this);
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

    handleShipping(event){
        this.setState({
            method: event.value
        },this.getExpressShippingDetail() )
      };

    setStateFromInput = async event => {
        var obj = {};
        obj[event.target.name] = event.target.value;
        await this.setState(obj);
        this.setState({
            complete_address: this.state.address + " " + this.state.city + " " + this.state.pincode + " " + this.state.state + " " + this.state.country
        })
    
        captureEvent('express_checkout', 'address', this.state.complete_address, 'address', ls.get('sellerid'), getCookie('mhinpbnb'))
      };

    changeMethod(method) {
        this.setState({ checked: method })
        captureEvent('express_checkout', 'change_payment_method', method, 'change_payment_method', ls.get('sellerid'), getCookie('mhinpbnb'))
      }

    componentDidUpdate = async (nextProps) => {
        const {totalProductPrice, shippingCost, currency, inrValue, usdValue, symbol} = this.state;
        if (this.props.symbol != this.state.symbol && this.state.symbol!== undefined){
            this.get_updated_price(this.state.OGprice, this.state.currency, this.state.inrValue, this.state.usdValue, this.props.symbol)
            
            await this.setState({
                symbol: this.props.symbol
            })
            
        }
    }

    get_updated_price(OGprice, currency, inrValue, usdValue, symbol){
     
        priceConversion(OGprice, currency, inrValue, usdValue, symbol).then(
            async result => {
           
                await this.setState({
                    totalProductPrice: parseFloat(result)
                })
                
                priceConversion(this.state.OGshippingCost, currency, this.state.inrValue, this.state.usdValue, symbol).then(
                    async result => {
                        
                        if (symbol == 'USD'){
                            result = result >= 5 ? result: 5;
                        }else{
                            result = result >= 40 ? result: 40;
                        }
                        await this.setState({
                            shippingCost: result
                        })
                        var tempTotal = parseFloat(this.state.totalProductPrice) + parseFloat(result);
                        tempTotal = tempTotal.toFixed(2)
                        await this.setState({
                            total: tempTotal
                        })
                    }
                    
                )
            }
        )
    }
    
    componentDidMount = async() => {

        if (this.props.currencyValue){
            try{
                await this.setState({
                    inrValue: this.props.currencyValue[0].INR
                })
            }catch(e){
                await this.setState({
                    inrValue: 71
                })
            }
        }
      
        if (this.props.location.state !== undefined && this.props.location.state !== null && this.props.location.state !== ''){
            await this.setState({
                totalProductPrice: this.props.location.state.totalprice,
                total: this.props.location.state.totalprice,
                product_sellerid: this.props.location.state.product_seller,
                currency: this.props.location.state.currency,
                symbol: this.props.location.state.currency,
                OGprice: this.props.location.state.totalprice,
                product_currency: this.props.location.state.product_currency,
                prod_id: this.props.location.state.prod_id,
                qty: this.props.location.state.qty,
            }, this.getExpressShippingDetail() )
            //this.get_updated_price(this.state.OGprice, this.state.product_currency, this.state.inrValue, this.state.usdValue, this.state.symbol)
        }else
            this.getExpressShippingDetail()

        this.setState({
            total: parseFloat(this.state.totalProductPrice) + parseFloat(this.state.shippingCost)
        })

        await this.setState({
            first_name: this.props.user.name,
            phone: this.props.user.mobile,
            email: this.props.user.email,
            country: this.props.user.country_name,
        })

        store.dispatch(getAllCountry());
    }
//axios.post(`${Url}/api/shipping/getExpressShipping`,
    getExpressShippingDetail(){
        try {
            // axios.post(`http://localhost:5000/api/shipping/getExpressShipping`,
            axios.post(`${apiUrl}expressShippingCost.php`,
                {
                    sellerid:this.state.product_sellerid,
                    method: this.state.method,
                    amount: this.state.totalProductPrice,
                    prod_id: this.state.prod_id,
                    qty: this.state.qty,
                    countryid:getCookie('countryid'),
                    sellercountryid:ls.get('sellerid'),
                    currency:getCookie('currency'),
                    buyerid:ls.get('sellerid'),
                    visitorid:getCookie('mhinpbnb'),
                    security_token: '',
                    plateform_type: ''
                },
                { headers: { "Content-Type": "multipart/form-data" } })
                .then(response => {
                   
                    var tempTotal = parseFloat(this.state.totalProductPrice) + parseFloat(response.data.result.shippingCost);
                    tempTotal = tempTotal.toFixed(2)
                    this.setState({
                        shippingCost: response.data.result.shippingCost,
                        OGshippingCost: response.data.result.OGshippingCost,
                        total: tempTotal
                    })
                    
            })
            .catch(error => {
               
                const result = error.response;
                return Promise.reject(result);
            });
        }
        catch (e) {
            console.log('something went wrong')
        }
    }

    get_payment = () => {
        $(".chkValidate").select().css({border:'none'})
        axios.post(
        "https://api.beldara.com/common/upd_add_buyer.php",
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
        
            // let product_currency = this.state.symbol
            // let total_price = this.state.totalCartValue;
            // console.log('response 0', this.state.checked)
            // if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
            // total_price = parseFloat(total_price) / this.state.inr;
        
            // total_price = total_price.toFixed();
            // console.log('response 1', this.state.checked)
            // ReactPixel.trackCustom( 'Purchase', {
            //   contents: this.props.location.state.pixeldata,
            //   content_type: 'product',
            //   value: total_price,
            //   currency: 'USD'
            // })
        // return response.data.result; 
        if (this.state.checked == 'razorpay') {
            // axios.post(
            //     `${localhost}/api/membership/successSubscription`,
            //     passData
            // ).then(async response=> {
            //     console.log(response)
                
            // })
            // .catch(error => {
            //     const result = error.response;
            //     return Promise.reject(result);
            // })
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
    }

    orderSubmit = e => {
        this.setState({
          addNotValid: 0
        })
        e.preventDefault();
        if (this.validator.allValid()) {
            $(".chkValidate").select().css({border:'none'})         
            if (ls.get('sellerid') && ls.get('sellerid') != ''){
                this.get_payment()
            }else{
                axios.post(
                "https://api.beldara.com/common/check_and_reg.php",
                {
                security_token: "",
                plateform_type: "",
                address: this.state.address,
                city: this.state.city,
                zipcode: this.state.pincode,
                mobile: this.state.phone,
                email: this.state.email,
                first_name: this.state.first_name,
                state: this.state.state,
                visitorid:getCookie('mhinpbnb')
                
                },
                { headers: { "Content-Type": "multipart/form-data" } }
            ).then(response => {
                if (response.data.statusId == 1){
                    setCookie('mhinpbn', response.data.result.sellerid, '365')

                    axios.post("https://api.beldara.com/common/map_cart.php",{
                    security_token: "",
                    plateform_type: "",
                    sellerid: response.data.result.sellerid,
                    visitorid: response.data.result.visitorid,
                    old_visitorid: getCookie('mhinpbnb')
                  },
                  { headers: { "Content-Type": "multipart/form-data" } }
                ).then(response => {
                    
                }).catch(error => {
                    
                });

                    store.dispatch(getLoggedIn())
                    this.get_payment()
                }
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);
            });
        }

          
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
        
          captureEvent('express_checkout', status, this.state.complete_address, 'check_out', ls.get('sellerid'), getCookie('mhinpbnb'))

      };

      handleCountry = async e => {
        if (e) {
            await this.setState({
                country: e.label
            });
        }
    }

    render (){
        const shipMethod = [
            { value: "air", label: "Air Express", country: "india" },
            { value: "sea_surface", label: "Ocean Express", country: "india" },
            { value: "surface", label: "Surface", country: "india" }
          ];

        const {cartItems, symbol} = this.props;
        const { total, totalProductPrice, shippingCost, email, country, phone, city, state, pincode, address, sellerid, product_sellerid, first_name, landmark, complete_address} = this.state;

        const  defaultCountry = [
            {
              value: getCookie('countryid'),
              label: getCookie('country_name') && getCookie('country_name').toUpperCase()
            }
          ];

        const onCancel = (data) => {
            console.log('The payment was cancelled!', data);
        }

        const onError = (err) => {
            console.log("Error!", err);
        }

        const client = {
            // sandbox:    'AZ4S98zFa01vym7NVeo_qthZyOnBhtNvQDsjhaZSMH-2_Y9IAJFbSD3HPueErYqN8Sa8WYRbjP7wWtd_',
            // production: 'AZ4S98zFa01vym7NVeo_qthZyOnBhtNvQDsjhaZSMH-2_Y9IAJFbSD3HPueErYqN8Sa8WYRbjP7wWtd_',
        }

        const InputProps = {
            required: true
          };

        return (
            <div>

                {/*SEO Support*/}
                <Helmet>
                    <title> CheckOut Page </title>
                    <meta name="description" content="Check out" />
                </Helmet>
                {/*SEO Support End */}

                <Breadcrumb  title={'Checkout'}/>

                <section className="section-b-space">
                    <div className="container padding-cls">
                        <div className="checkout-page">
                            <div className="checkout-form">
                                <form>
                                    <div className="checkout row">
                                        <div className="col-lg-6 col-sm-12 col-xs-12">
                                            <div className="checkout-title mb-1">
                                                <h3>Billing / Shipping Details</h3>
                                            </div>
                                            <div className="row check-out">
                                                <div className="has-float-label col-md-12 col-sm-12 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" id="first_name" placeholder=" "  name="first_name" value={this.state.first_name} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="first_name">{"First Name"}</label>
                                                    {this.validator.message('first_name', this.state.first_name, 'required|string')}
                                                </div>

                                                <div className="has-float-label col-md-6 col-sm-6 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" name="phone" id="phone"  placeholder=" " value={this.state.phone} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="phone">{"Phone"}</label>
                                                    {this.validator.message('phone', this.state.phone, 'required|phone')}
                                                </div>

                                                <div className="has-float-label col-md-6 col-sm-6 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" id="email" name="email" placeholder=" "  value={this.state.email} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="email">{"Email Address"}</label>
                                                    {this.validator.message('email', this.state.email, 'required|email')}
                                                </div>

                                            
                                                <div className="form-group col-md-12 col-sm-12 col-xs-12 mb-2">
                                                    {/* <div className="field-label mb-1">Country</div> */}
                                                    
                                                    {this.props.countries ? 
                                                    defaultCountry?
                                                    (
                                                        <Select
                                                        isOptionSelected="true"
                                                        options={this.props.countries}
                                                        onChange={this.handleCountry}
                                                        headingProps={InputProps}
                                                        defaultValue={defaultCountry}
                                                        // placeholder={"Select Country"}
                                                        //defaultValue={''}
                                                        />
                                                    ) : (
                                                        <Select
                                                        isOptionSelected="true"
                                                        options={this.props.countries}
                                                        onChange={this.handleCountry}
                                                        headingProps={InputProps}
                                                        placeholder={"Select Country"}
                                                        // defaultValue={this.props.data.countries[0]}
                                                        //defaultValue={''}
                                                        />
                                                    ) : ''}
                                                    {/* {this.validator.message('country', this.state.country, 'required')} */}
                                                </div>
                                                {/* <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div className="field-label">Country</div>
                                                    <select name="country" value={this.state.country} onChange={this.setStateFromInput}>
                                                        <option>India</option>
                                                        <option>South Africa</option>
                                                        <option>United State</option>
                                                        <option>Australia</option>
                                                    </select>
                                                    {this.validator.message('country', this.state.country, 'required')}
                                                </div> */}

                                                <div className="has-float-label col-md-12 col-sm-12 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" id="address" placeholder=" " name="address" value={this.state.address} onChange={this.setStateFromInput} placeholder=" " />
                                                    <label className="ml-3" htmlFor="address">{"Address"}</label>
                                                    {this.validator.message('address', this.state.address, 'required|min:20|max:120')}
                                                </div>
                                                <div className="has-float-label col-md-12 col-sm-12 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" id="city" placeholder=" " name="city" value={this.state.city} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="city">{"Town/City"}</label>
                                                    {this.validator.message('city', this.state.city, 'required|string')}
                                                </div>
                                                <div className="has-float-label col-md-6 col-sm-6 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" id="state" placeholder=" " name="state" value={this.state.state} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="state">{"State / County"}</label>
                                                    {this.validator.message('state', this.state.state, 'required|string')}
                                                </div>
                                                <div className="has-float-label col-md-6 col-sm-6 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" id="pincode" placeholder=" " name="pincode" value={this.state.spincode} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="pincode">{"Postal Code"}</label>
                                                    {this.validator.message('pincode', this.state.pincode, 'required|integer')}
                                                </div>
                                                <div className="col-lg-6 col-sm-12 col-xs-12">
                                                    <div className="h5"> Shipping Method: </div>
                                                </div>
                                                <div className="has-float-label col-md-12 col-sm-12 col-xs-12 mb-2">
                                                    <Select
                                                        id="shippingMethod"
                                                        isOptionSelected="true"
                                                        options={this.shipDetMethod(shipMethod,1,1)}
                                                        defaultValue={
                                                        this.shipDetMethod(shipMethod, 1, 1)[0]
                                                        }
                                                        onChange={this.handleShipping}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-12 col-xs-12 p-5">
                                            <div className="checkout-details p-3">
                                                <div className="order-box mb-2">
                                                    <div className="title-box pb-2 mb-2">
                                                        <div>Shopping Bag Details</div>
                                                    </div>
                                                    <ul className="qty">
                                                         {/* {cartItems.map((item, index) => {
                                                            return <li key={index}>{item.name} × {item.qty} <span>{symbol} {item.sum}</span></li> })
                                                        }  */}
                                                    </ul>
                                                    <ul className="sub-total mb-2">
                                                    <li>Total Product Cost: <span className="count">{symbol} {totalProductPrice}</span></li>
                                                        <li>Shipping Cost: <span className="count">{symbol} {this.state.shippingCost}</span>
                                                            {/* <div className="shipping">
                                                                <div className="shopping-option">
                                                                    <input type="checkbox" name="free-shipping" id="free-shipping" />
                                                                        <label htmlFor="free-shipping">Free Shipping</label>
                                                                </div>
                                                                <div className="shopping-option">
                                                                    <input type="checkbox" name="local-pickup" id="local-pickup" />
                                                                        <label htmlFor="local-pickup">Local Pickup</label>
                                                                </div>
                                                            </div> */}
                                                        </li>
                                                        
                                                    </ul>

                                                    <ul className="total mb-2">
                                                        <li>Total <span className="count">{symbol} {total}</span></li>
                                                    </ul>
                                                </div>

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
                                                            {/* { symbol == 'INR' ?
                                                            <li>
                                                                <div className="radio-option paypal ">
                                                                    <input type="radio" name="payment-group" method="paytm" id="payment-1"  onClick={()=>this.changeMethod('paytm')}/>
                                                                        <label htmlFor="payment-1">Pay using Paytm</label>
                                                                </div>
                                                            </li>
                                                            : ''} */}
                                                        </ul>
                                                    </div>
                                                </div>
                                                
                                            </div>

                                                    <button className="btn btn-solid" onClick={this.orderSubmit}>
                                                        CONTINUE
                                                    </button>          
                                                    <RazorpayForm totalCost={total} name={first_name} email={email} mobile={phone}
                                                        id={'productOrder'} sellerid={ls.get('sellerid')} currency={symbol} amount={total}
                                                        page={''} type={''} event={'Product-Order'} className={'productOrder'} method="POST"
                                                        action={this.state.link} isLoggedIn={this.isLoggedIn} item={cartItems}
                                                        value={"cart=0||amount=" + total + "||sellerid=" + ls.get('sellerid') + "||mainurl=" + window.location.hostname + "||currency=" + symbol + "||shipping_cost=" + shippingCost + "||email=" + email+"||address="+address+"||landmark="+landmark+"||state="+state+"||pincode="+pincode+"||city="+city+"||countryName="+country+"||first_name="+this.state.first_name+"||prod_id="+this.state.prod_id+"||shippingMethod="+this.state.method} 
                                                    />
                                                    <Paytm user={this.props.user} amount={total} totalShipmentCost={shippingCost} countryName={country}
                                                    address={address} landmark={landmark} state={state} pincode={pincode} city={city}
                                                         complete_address={complete_address}  sellerid={product_sellerid} buyerid={sellerid}
                                                        item={cartItems}
                                                    /> 
                                                    
                                                    {/* {(total !== 0)?
                                                    <div className="text-right">
                                                        {(this.state.payment === 'stripe')? <button type="button" className="btn-solid btn" onClick={() => this.StripeClick()} >Place Order</button>:
                                                         <PaypalExpressBtn env={'sandbox'} client={client} currency={'USD'} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel} />}
                                                    </div>
                                                    : ''} */}
                                                </div>
                                            </div>
                                    </div>
                                    <div >
                                        <button className="btn btn-solid" onClick={this.orderSubmit}>
                                            CONTINUE
                                        </button>  
                                    </div> 
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    // cartItems: state.cartList.cart,
     symbol: state.data.symbol,
     currencyValue: state.currencyValue.currencyValue,
     countries: state.data.countries,
     user: state.user.user
    // total: getCartTotal(state.cartList.cart)
})

export default connect(
    mapStateToProps
)(checkOut)