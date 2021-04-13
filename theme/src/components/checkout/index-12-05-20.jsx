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
import IntlTelInput from "react-intl-tel-input";
var number,countryNameMobile,dialCode,type, isoValue,discount_value,cashback_value_generated,txn_type;
class checkOut extends Component {

    constructor (props) {
        super (props)

        this.state = {
            payment:'razorpay',
            checked: 'razorpay',
            first_name:'',
            otp: '',
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
            // link: `${apiUrl}product_purchase_express_demo.php`,
            prod_id: '',
            method: 'air',
            qty: 1,
            msgMobile: true,
            wallet_amount:0,
            wallet_usd_amount:0,
            render_static_reload:0, 
            totalStaticCartValue:0,
            select_wallet_amount_option: false,
        }
        this.validator = new SimpleReactValidator();
        this.handleShipping = this.handleShipping.bind(this);
        this.getExpressShippingDetail = this.getExpressShippingDetail.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange = async (e) => {
    if (this.state.render_total_static == 0) {
        this.setState({
          totalCartStaticValue: this.state.total,
          render_total_static: 1,
        });
        if(this.state.symbol == 'USD'){
          var new_valuable_amount = this.state.wallet_amount/this.state.inrValue;
          this.setState({
              wallet_usd_amount : new_valuable_amount
          })
       }
      }
      if (
        $("#wallet_amount_check").prop("checked") == true
      ) {
          this.setState({
            select_wallet_amount_option: true
          })
        if(this.state.render_total_static == 0){
          if(this.state.symbol == 'USD'){
            if(new_valuable_amount > 0 && this.state.totalProductPrice > new_valuable_amount){
              discount_value = new_valuable_amount;
              var new_amount = 
              parseFloat(this.state.totalProductPrice - new_valuable_amount).toFixed(2)
              console.log('on first render',new_amount,this.state.total,new_valuable_amount,parseFloat(this.state.totalProductPrice-new_valuable_amount),this.state.totalProductPrice);
            }else if(new_valuable_amount > 0 && this.state.totalProductPrice < new_valuable_amount){
              var amount_to_be_cut = this.state.totalProductPrice/2;
              discount_value = amount_to_be_cut;
              var new_amount = 
              parseFloat(this.state.totalProductPrice - amount_to_be_cut).toFixed(2)
              console.log('on first render but totalProductPrice is less than wallet_amount',new_amount,this.state.total,new_valuable_amount);
            }
             }else{
               if(this.state.wallet_amount > 0 &&  this.state.totalProductPrice > this.state.wallet_amount){
                discount_value = this.state.wallet_amount;
                var new_amount = parseFloat(
                  this.state.totalProductPrice - this.state.wallet_amount
                ).toFixed(2);
                console.log('on first render',new_amount,this.state.total,this.state.wallet_amount);
               }else if(this.state.wallet_amount > 0 &&  this.state.totalProductPrice < this.state.wallet_amount){
                 var new_amount_to_cut = this.state.totalProductPrice/2;
                discount_value = new_amount_to_cut;
                var new_amount = parseFloat(
                  this.state.totalProductPrice - new_amount_to_cut
                ).toFixed(2);
                console.log('on first render but totalProductPrice is less than wallet_amount',new_amount,this.state.total,this.state.wallet_amount);
               }
             
             }
        }else{
          if(this.state.symbol == 'USD'){
            if(this.state.wallet_usd_amount > 0 && this.state.totalProductPrice > this.state.wallet_usd_amount){
              var new_amount = 
              parseFloat(this.state.totalProductPrice - this.state.wallet_usd_amount).toFixed(2);
              discount_value = this.state.wallet_usd_amount;
              console.log('on again render',new_amount,this.state.total,this.state.wallet_usd_amount,parseFloat(this.state.totalProductPrice-this.state.wallet_usd_amount),this.state.totalProductPrice);
            }else if(this.state.wallet_usd_amount > 0 && this.state.totalProductPrice < this.state.wallet_usd_amount){
              var amount_to_be_cut = this.state.totalProductPrice/2;
              discount_value = amount_to_be_cut;
              var new_amount = 
              parseFloat(this.state.totalProductPrice - amount_to_be_cut).toFixed(2)
              console.log('on again render but totalProductPrice is less than wallet_amount',new_amount,this.state.total,this.state.wallet_usd_amount);
            }
             }else{
               if(this.state.wallet_amount > 0 &&  this.state.totalProductPrice > this.state.wallet_amount){
                var new_amount = parseFloat(
                  this.state.totalProductPrice - this.state.wallet_amount
                ).toFixed(2);
                discount_value = this.state.wallet_amount;
                console.log('on again render but totalProductPrice is greater then wallet_amount',new_amount,this.state.wallet_amount);
               }else if(this.state.wallet_amount > 0 &&  this.state.totalProductPrice < this.state.wallet_amount){
                 var new_amount_to_cut = this.state.totalProductPrice/2;
                discount_value = new_amount_to_cut;
                var new_amount = parseFloat(
                  this.state.totalProductPrice - new_amount_to_cut
                ).toFixed(2);
                console.log('on again render but totalProductPrice is less then wallet_amount',new_amount,this.state.wallet_amount);
               }
             }
        }
        if (new_amount > 0) {
            new_amount = parseFloat(new_amount) + parseFloat(this.state.shippingCost);
            console.log(discount_value,new_amount,150);
          await this.setState({
            total: parseFloat(new_amount).toFixed(2),
            discount_value:discount_value
          });
        }
      } else {
          console.log('unchecked',parseFloat(this.state.totalStaticCartValue).toFixed(2),135);
        await this.setState({
          total: parseFloat(this.state.totalStaticCartValue).toFixed(2),
          select_wallet_amount_option: false,
          discount_value : 0.00
        });
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
            console.log(this.props.symbol,this.state.currency,nextProps.symbol,203);
            this.get_updated_price(this.state.OGprice, this.state.currency, this.state.inrValue, this.state.usdValue, this.props.symbol)
            await this.setState({
                symbol: this.props.symbol,
            })
            console.log('componentDidUpdate',189);
        }
    }

    get_updated_price(OGprice, currency, inrValue, usdValue, symbol){
        priceConversion(OGprice, currency, inrValue, usdValue, symbol).then(
            async result => {
                
                await this.setState({
                    totalProductPrice: parseFloat(result)
                })
                // this.getProductPrice().then(
                    axios.post(`${apiUrl}expressShippingCost.php`,
                    {
                        sellerid:this.state.product_sellerid,
                        method: this.state.method,
                        amount: this.state.totalProductPrice,
                        prod_id: this.state.prod_id,
                        qty: this.state.qty,
                        countryid:getCookie('countryid'),
                        sellercountryid:ls.get('sellerid'),
                        // currency:getCookie('currency'),
                        currency:this.props.symbol,
                        buyerid:ls.get('sellerid'),
                        visitorid:getCookie('mhinpbnb'),
                        security_token: '',
                        plateform_type: ''
                    },
                    { headers: { "Content-Type": "multipart/form-data" } })
                    .then(async response => {
                        var result = response.data.result.shippingCost
                        console.log('result: '+result,222);
                        if (symbol == 'USD'){
                            result = result >= 5 ? result: 5;
                        }else{
                            result = result >= 40 ? result: 40;
                        }
                        await this.setState({
                            shippingCost: result
                        })
                        if(this.state.select_wallet_amount_option){
                            if(this.state.symbol == 'USD'){
                                if(this.state.totalProductPrice > this.state.wallet_usd_amount){
                                    discount_value = this.state.wallet_usd_amount;
                                    var new_amount = parseFloat(this.state.totalProductPrice - this.state.wallet_usd_amount);
                                    var tempTotal = parseFloat(new_amount) + parseFloat(result);
                                    tempTotal = tempTotal.toFixed(2);
                                    console.log(this.state.symbol,'inside price conversion totalProductPrice is greater than wallet_usd_amount',tempTotal);
                                }else if(this.state.totalProductPrice < this.state.wallet_usd_amount){
                                    var new_amount = this.state.totalProductPrice/2;
                                    discount_value = new_amount;
                                    var tempTotal = parseFloat(new_amount) + parseFloat(result);
                                    tempTotal = tempTotal.toFixed(2)
                                    console.log(this.state.symbol,'inside price conversion totalProductPrice is less than wallet_usd_amount',tempTotal);
                                }
                            }else{
                                if(this.state.totalProductPrice > this.state.wallet_amount){
                                    discount_value = this.state.wallet_amount;
                                    var new_amount = parseFloat(this.state.totalProductPrice - this.state.wallet_amount); 
                                    var tempTotal = parseFloat(new_amount) + parseFloat(result);
                                    tempTotal = tempTotal.toFixed(2);
                                    console.log(this.state.symbol,'inside price conversion totalProductPrice is greater than wallet_usd_amount',tempTotal);
                                }else if(this.state.totalProductPrice < this.state.wallet_amount){
                                    var new_amount = this.state.totalProductPrice/2;
                                    discount_value = new_amount;
                                    var tempTotal = parseFloat(new_amount) + parseFloat(result);
                                    tempTotal = tempTotal.toFixed(2);
                                    console.log(this.state.symbol,'inside price conversion totalProductPrice is less than wallet_usd_amount',tempTotal);
                                }
                                
                            }
                            
                        }else{
                            var tempTotal = parseFloat(this.state.totalProductPrice) + parseFloat(result);
                            tempTotal = tempTotal.toFixed(2)
                            discount_value = 0.00;
                        }
                        
                        var totalCartStaticval = parseFloat(this.state.totalProductPrice) + parseFloat(result);
                        totalCartStaticval = totalCartStaticval.toFixed(2)
                        await this.setState({
                            total: tempTotal,
                            totalStaticCartValue: totalCartStaticval,
                            discount_value:discount_value
                        })
                        console.log('1st to set total',139);
                })
                .catch(error => {
                    const result = error.response;
                    return Promise.reject(result);
                });
                // priceConversion(this.state.OGshippingCost, currency, this.state.inrValue, this.state.usdValue, symbol).then(
                //     async result => {
                //         console.log('result: '+result,222);
                //         if (symbol == 'USD'){
                //             result = result >= 5 ? result: 5;
                //         }else{
                //             result = result >= 40 ? result: 40;
                //         }
                //         await this.setState({
                //             shippingCost: result
                //         })
                //         if(this.state.select_wallet_amount_option){
                //             if(this.state.symbol == 'USD'){
                //                 if(this.state.totalProductPrice > this.state.wallet_usd_amount){
                //                     discount_value = this.state.wallet_usd_amount;
                //                     var new_amount = parseFloat(this.state.totalProductPrice - this.state.wallet_usd_amount);
                //                     var tempTotal = parseFloat(new_amount) + parseFloat(result);
                //                     tempTotal = tempTotal.toFixed(2);
                //                     console.log(this.state.symbol,'inside price conversion totalProductPrice is greater than wallet_usd_amount',tempTotal);
                //                 }else if(this.state.totalProductPrice < this.state.wallet_usd_amount){
                //                     var new_amount = this.state.totalProductPrice/2;
                //                     discount_value = new_amount;
                //                     var tempTotal = parseFloat(new_amount) + parseFloat(result);
                //                     tempTotal = tempTotal.toFixed(2)
                //                     console.log(this.state.symbol,'inside price conversion totalProductPrice is less than wallet_usd_amount',tempTotal);
                //                 }
                //             }else{
                //                 if(this.state.totalProductPrice > this.state.wallet_amount){
                //                     discount_value = this.state.wallet_amount;
                //                     var new_amount = parseFloat(this.state.totalProductPrice - this.state.wallet_amount); 
                //                     var tempTotal = parseFloat(new_amount) + parseFloat(result);
                //                     tempTotal = tempTotal.toFixed(2);
                //                     console.log(this.state.symbol,'inside price conversion totalProductPrice is greater than wallet_usd_amount',tempTotal);
                //                 }else if(this.state.totalProductPrice < this.state.wallet_amount){
                //                     var new_amount = this.state.totalProductPrice/2;
                //                     discount_value = new_amount;
                //                     var tempTotal = parseFloat(new_amount) + parseFloat(result);
                //                     tempTotal = tempTotal.toFixed(2);
                //                     console.log(this.state.symbol,'inside price conversion totalProductPrice is less than wallet_usd_amount',tempTotal);
                //                 }
                                
                //             }
                            
                //         }else{
                //             var tempTotal = parseFloat(this.state.totalProductPrice) + parseFloat(result);
                //             tempTotal = tempTotal.toFixed(2)
                //             discount_value = 0.00;
                //         }
                        
                //         var totalCartStaticval = parseFloat(this.state.totalProductPrice) + parseFloat(result);
                //         totalCartStaticval = totalCartStaticval.toFixed(2)
                //         await this.setState({
                //             total: tempTotal,
                //             totalStaticCartValue: totalCartStaticval,
                //             discount_value:discount_value
                //         })
                //         console.log('1st to set total',139);
                //     }
                    
                // )
            }
        )
    }

    
    componentDidMount = async() => {
        console.log(this.state,this.props,285);
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
            console.log('if in componentDidMount');
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
            console.log('2nd to set total',172,this.props);
            //this.get_updated_price(this.state.OGprice, this.state.product_currency, this.state.inrValue, this.state.usdValue, this.state.symbol)
        }else
            console.log('else in componentDidMount');
            this.getExpressShippingDetail()

        var totalCartStaticval = parseFloat(this.state.totalProductPrice) + parseFloat(this.state.shippingCost);
        totalCartStaticval = totalCartStaticval.toFixed(2)
        this.setState({
            total: parseFloat(this.state.totalProductPrice) + parseFloat(this.state.shippingCost),
            totalStaticCartValue : totalCartStaticval
        })
        console.log('3rd to set total',180);
        await this.setState({
            first_name: this.props.user.name,
            phone: this.props.user.mobile,
            email: this.props.user.email,
            country: this.props.user.country_name,
        })

        store.dispatch(getAllCountry());
        axios
      .post(
        `${ApiUrl}/common/get_wallet_amount.php`,
        {
          sellerid: ls.get("log_id"),
          txn_event: "product_purchased",
          security_token: "",
          plateform_type: "",
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
          var new_generated_value = res.data.result[0].r_total_amount/this.state.inrValue;
        this.setState({
           wallet_amount:parseInt(res.data.result[0].r_total_amount),
           wallet_usd_amount : parseFloat(new_generated_value).toFixed(2),
          // wallet_usd_amount : 5
          // wallet_amount: 40,
        });
        // console.log(res,99,this.state.wallet_amount);
      })
      .catch((err) => {
        console.log("error ocurred", err);
      });
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
                    // currency:getCookie('currency'),
                    currency:this.props.symbol,
                    buyerid:ls.get('sellerid'),
                    visitorid:getCookie('mhinpbnb'),
                    security_token: '',
                    plateform_type: ''
                },
                { headers: { "Content-Type": "multipart/form-data" } })
                .then(response => {
                    var tempTotal = parseFloat(this.state.totalProductPrice) + parseFloat(response.data.result.shippingCost);
                    tempTotal = tempTotal.toFixed(2)
                    var totalCartStaticval = parseFloat(this.state.totalProductPrice) + parseFloat(response.data.result.shippingCost);
                    totalCartStaticval = totalCartStaticval.toFixed(2)
                    this.setState({
                        shippingCost: response.data.result.shippingCost,
                        OGshippingCost: response.data.result.OGshippingCost,
                        total: tempTotal,
                        totalStaticCartValue : totalCartStaticval
                    })
                    console.log('set total in getExpressShippingDetail',247,'shippingCost: '+response.data.result.shippingCost,'OGshippingCost: '+response.data.result.OGshippingCost);
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

    otpForLogin = (e) => {
        $("#sms_spinner").removeClass('d-none');
        $("#msgError").addClass('d-none');
        $("#msgError").empty();
        e.preventDefault();
        if(this.state.type == true){
            this.setState({
                msgMobile:true
            })
            try{
                axios.post(
                    "https://api.indiabigshop.com/common/checkout-with-otp.php",
                    {
                        type: "OTP",
                        userName:this.state.first_name,
                        mobile:this.state.phone,
                        email:this.state.email,
                        countryid:this.state.dialCode,
                        countryName:this.state.countryNameMobile
                    },
                    { headers: { "Content-Type": "multipart/form-data" } }
                ).then(response => {
                    if (response.data.statusId == 1){
                        $("#sms_spinner").addClass('d-none');
                        $("#msgSuccess").removeClass('d-none');
                    }else{
                        $("#sms_spinner").addClass('d-none');
                        $("#msgError").append('Something went wrong please try again.').removeClass('d-none');
                    }
                })
                .catch(error => {
                    $("#sms_spinner").addClass('d-none');
                    const result = error.response;
                    return Promise.reject(result);
                });
            }catch(e){
                console.log(`😱 Axios request failed: ${e}`);
            }
        }else{
            this.setState({
                msgMobile:false
            })
            $("#sms_spinner").addClass('d-none');
        }
    }

    orderSubmit = e => {
        $("#msgError").addClass('d-none');
        $("#msgError").empty();
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
                "https://api.indiabigshop.com/common/check_and_reg.php",
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
                visitorid:getCookie('mhinpbnb'),
                pass: this.state.otp  
                },
                { headers: { "Content-Type": "multipart/form-data" } }
            ).then(response => {
                if (response.data.statusId == 1){
                    setCookie('mhinpbn', response.data.result.sellerid, '365')

                    axios.post("https://api.indiabigshop.com/common/map_cart.php",{
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
                }else{
                    $("#msgError").append('Please enter valid password or OTP.').removeClass('d-none');
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

    onChange = (err, no, data) => {
        type = err;
        number = no;
        isoValue = data.iso2;
        dialCode = data.dialCode;
        countryNameMobile = data.name.replace(/ *\([^)]*\) */g, ""); 
        this.setState({
            countryNameMobile:countryNameMobile,
            dialCode:dialCode,
            phone:number,
            isoValue:isoValue,
            type:type
        })
      };


      getProductPrice = () => {
            try {
                axios.post(`${apiUrl}expressShippingCost.php`,
                    {
                        sellerid:this.state.product_sellerid,
                        method: this.state.method,
                        amount: this.state.totalProductPrice,
                        prod_id: this.state.prod_id,
                        qty: this.state.qty,
                        countryid:getCookie('countryid'),
                        sellercountryid:ls.get('sellerid'),
                        // currency:getCookie('currency'),
                        currency:this.props.symbol,
                        buyerid:ls.get('sellerid'),
                        visitorid:getCookie('mhinpbnb'),
                        security_token: '',
                        plateform_type: ''
                    },
                    { headers: { "Content-Type": "multipart/form-data" } })
                    .then(response => {
                        console.log(response.data.result.shippingCost)
                        return response.data.result.shippingCost
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

    render (){
        console.log(this.state,'render');
        const shipMethod = [
            { value: "air", label: "Air Express", country: "india" },
            { value: "sea_surface", label: "Ocean Express", country: "india" },
            { value: "surface", label: "Surface", country: "india" }
          ];

        const {cartItems, symbol} = this.props;
        const { total, totalProductPrice, shippingCost, email, country, phone, city, state, pincode, address, sellerid, product_sellerid, first_name, landmark, complete_address ,otp} = this.state;

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
        txn_type = this.state.select_wallet_amount_option ? 'debit' : 'credit';
        cashback_value_generated = this.state.discount_value;
        const InputProps = {
            required: true
          };
        // console.log(txn_type,cashback_value_generated,649);
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
                                            <div class="alert alert-success d-none" id="msgSuccess" role="alert">
                                                OTP is sent to your email or mobile number. Please check and enter the OTP.
                                            </div>
                                            <div class="alert alert-warning d-none" id="msgError" role="alert">
                                            
                                            </div>
                                            <div className="row check-out">
                                                <div className="has-float-label col-md-12 col-sm-12 col-xs-12 mb-2">
                                                    <input className="form-control" type="text" id="first_name" placeholder=" "  name="first_name" value={this.state.first_name} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="first_name">{"First Name"}</label>
                                                    {this.validator.message('first_name', this.state.first_name, 'required|string')}
                                                </div>

                                                <div className="has-float-label col-md-6 col-sm-6 col-xs-12 mb-2">
                                                {(ls.get('sellerid') && ls.get('sellerid') != '') ? 
                                                    <>
                                                    <input className="form-control" type="text" name="phone" id="phone"  placeholder=" " value={this.state.phone} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="phone">{"Phone"}</label>
                                                    {this.validator.message('phone', this.state.phone, 'required|phone')}
                                                    </>
                                                    :
                                                    <> 
                                                    <IntlTelInput
                                                        containerClassName="intl-tel-input"
                                                        inputClassName="form-control"
                                                        fieldId="phone"
                                                        geoIpLookup="true"
                                                        fieldId="phone"
                                                        fieldName="phone"
                                                        onkeypress={this.isNumberKey}
                                                        onPhoneNumberChange={this.onChange}
                                                        onPhoneNumberBlur={this.change}
                                                        defaultCountry={`${
                                                        country ? country.toLowerCase() : "in"
                                                        }`}
                                                        defaultValue={number}
                                                        telInputProps={this.InputProps}
                                                    />
                                                    <label className="ml-3" htmlFor="phone">{"Mobile No."}</label>
                                                    {this.validator.message('Mobile no.', this.state.phone, 'required|phone')}
                                                    {this.state.msgMobile == true ? '': <span style={{color: 'red'}}>Please enter valied number</span>}
                                                    </>
                                                }
                                                </div>

                                                <div className="has-float-label col-md-6 col-sm-6 col-xs-12 mb-2">
                                                    <input className="form-control" type="email" id="email" name="email" placeholder=" "  value={this.state.email} onChange={this.setStateFromInput} />
                                                    <label className="ml-3" htmlFor="email">{"Email Address"}</label>
                                                    {this.validator.message('email', this.state.email, 'required|email')}
                                                </div>
                                                
                                                {(ls.get('sellerid') && ls.get('sellerid') != '') ? ''
                                                :
                                                    <>
                                                    <div className="has-float-label col-md-9 col-sm-9 col-xs-10 mb-2">
                                                        <input className="form-control" type="password" name="otp" id="otp"  placeholder=" " value={this.state.otp} onChange={this.setStateFromInput} />
                                                        <label className="ml-3" htmlFor="otp">{"Enter password or OTP"}</label>
                                                        {this.validator.message('otp', this.state.otp, 'required|numeric')}
                                                    </div>

                                                    <div className="has-float-label col-md-3 col-sm-3 col-xs-2 mb-2">
                                                        <button className="btn btn-sm btn-primary" onClick={this.otpForLogin} style={{padding: '11px 21px',backgroundColor: '#f5821e',borderColor: '#f5821e',borderRadius: '4px'}}>
                                                        <div class="spinner-border text-light d-none" role="status" id="sms_spinner" style={{width: '1rem',height: '1rem'}}><span class="sr-only">Loading...</span></div>GET OTP
                                                        </button>  
                                                    </div> 
                                                    </>
                                                }
                                            
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
                                                        {(this.state.discount_value > 0 && this.state.discount_value)
                                                        ? <li>Amount to Debit from wallet: <span className="count">{symbol} {this.state.discount_value}</span></li>
                                                        : ''
                                                        }
                                                        
                                                            {this.state.wallet_amount != "" &&
                                                                this.state.wallet_amount != "null" &&
                                                                this.state.wallet_amount !== null &&
                                                                this.state.wallet_amount != "0.00" ? 
                                                                (this.state.symbol == 'USD')
                                                                ?
                                                                    <li className="ml-3">
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
                                                                        {`Use wallet Amount ( ${this.state.symbol} ${parseFloat(this.state.wallet_usd_amount).toFixed(2)})`}
                                                                    </label>
                                                                    </li>
                                                                : (this.state.symbol == 'INR') ?
                                                                    <li className="ml-3">
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
                                                                        {`Use wallet Amount ( ${this.state.symbol} ${parseFloat(this.state.wallet_amount).toFixed(2)})`}
                                                                    </label>
                                                                    </li>
                                                                : ''
                                                                : '' 
                                                            }
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
                                                    {/* <RazorpayForm totalCost={total} name={first_name} email={email} mobile={phone}
                                                        id={'productOrder'} sellerid={ls.get('sellerid')} currency={symbol} amount={total}
                                                        page={''} type={''} event={'Product-Order'} className={'productOrder'} method="POST"
                                                        action={this.state.link} isLoggedIn={this.isLoggedIn} item={cartItems}
                                                        value={"cart=0||amount=" + total + "||sellerid=" + ls.get('sellerid') + "||mainurl=" + window.location.hostname + "||currency=" + symbol + "||shipping_cost=" + shippingCost + "||email=" + email+"||address="+address+"||landmark="+landmark+"||state="+state+"||pincode="+pincode+"||city="+city+"||countryName="+country+"||first_name="+this.state.first_name+"||prod_id="+this.state.prod_id+"||shippingMethod="+this.state.method} 
                                                    /> */}
                                                    <RazorpayForm totalCost={total} name={first_name} email={email} mobile={phone}
                                                        id={'productOrder'} sellerid={ls.get('sellerid')} currency={symbol} amount={total}
                                                        page={''} type={''} event={'Product-Order'} className={'productOrder'} method="POST"
                                                        action={this.state.link} isLoggedIn={this.isLoggedIn} item={cartItems}
                                                        value={"cart=0||amount=" + total + "||sellerid=" + ls.get('sellerid') + "||mainurl=" + window.location.hostname + "||currency=" + symbol + "||shipping_cost=" + shippingCost + "||email=" + email+"||address="+address+"||landmark="+landmark+"||state="+state+"||pincode="+pincode+"||city="+city+"||countryName="+country+"||first_name="+this.state.first_name+"||prod_id="+this.state.prod_id+"||shippingMethod="+this.state.method+"||txn_type="+txn_type+"||cashback_value="+cashback_value_generated} 
                                                    />
                                                    <Paytm user={this.props.user} amount={total} totalShipmentCost={shippingCost} countryName={country}
                                                    address={address} landmark={landmark} state={state} pincode={pincode} city={city}
                                                         complete_address={complete_address}  sellerid={product_sellerid} buyerid={sellerid}
                                                        item={cartItems} cashback_value={cashback_value_generated} txn_type={txn_type}
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