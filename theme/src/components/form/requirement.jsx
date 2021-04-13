import React, { Component } from 'react'
import { Redirect } from 'react-router';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import './requirement.css';
import Select from 'react-select';
import { connect } from 'react-redux'
import ls from 'local-storage'
import $ from 'jquery'
// import { colourOptions, groupedOptions } from '../data';
import {getAllUnits, getLoggedIn} from '../../actions'
import axios from 'axios';
import store from '../../store';
import { ApiUrl,ImgUrl } from '../../constants/ActionTypes';
import ThankYou from '../common/thankYou';
import { withTranslate } from 'react-redux-multilingual';
import {setCookie, getCookie} from '../../functions';
 

var type,number,isoValue,dialCode,countryName,unit;
class Requirement extends Component {
    constructor(props){
        super(props);
        this.state = { value: '',otp:'', result:0 , error:0};
     }
    componentWillMount() {
        store.dispatch(getAllUnits())
    }

    handleChange = selectedOption => {
        unit = selectedOption.label;
    };
    onChange = (err, no, data) => {

        type = err
        number = no
        isoValue = data.iso2
        dialCode = data.dialCode
        countryName = data.name.replace(/ *\([^)]*\) */g, "")
    }

    otpForLogin = (e) => { 
         $("#sms_spinner").removeClass('d-none');
         $("#msgError").addClass('d-none');
         $("#msgError").empty();
         var email = $("#buyer_email").val()
         const mobile = $("#buyer_mobile").val()
        if(email != '' ||  mobile != ''){
            try{
                axios.post(
                    "https://api.indiabigshop.com/common/checkout-with-otp.php",
                    {
                        type: "OTP",
                        userName:'',
                        mobile:mobile,
                        email:email,
                        countryid:dialCode,
                        countryName:this.state.countryName
                    },
                    { headers: { "Content-Type": "multipart/form-data" } }
                ).then(response => {
                    console.log(response.data,63);
                    if (response.data.statusId == 1){
                        if(response.data.result.user == 'new_user'){
                            if(getCookie('refid') != 'null' && getCookie('refid') !== null && getCookie('refid') != ''){
                                axios.post(`${ImgUrl}/beta_api/manage_ref_log.php`,
                            {
                                "sellerid":response.data.result.sellerid,
                                "referersellerid":getCookie('refid'),
                                "device":"web"
                            },
                            {headers: {'Content-Type': 'multipart/form-data'}}
                            )
                            .then(async result => {
                                // console.log(result,334,'functions');
                            }).catch(data => {
                                
                            })
                            }
                        }
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
           $("#msgError").append('Please enter mobile no. or email').removeClass('d-none');
           $("#sms_spinner").addClass('d-none');
        }
    }
   
    reqFormSubmit = (e) => {
        e.preventDefault()
        $('#loading').removeClass('d-none');
        $('#no_loading').removeClass('d-none').addClass('d-none');
        $('#no_loading_btn').attr('disabled','');
        var email = $("#buyer_email").val()
        const mobile = $("#buyer_mobile").val()
        const qty = $("#qty").val()
        const prodName = $("#prodName").val()
        const reqDetail = $("#reqDetail").val()
        const password = $("#buyer_password").val()
        try {
            if (!type) {
                this.setState({ error: true, msg: 'Mobile is invalid' })
                return 
            }
            axios.post(`${ApiUrl}/common/contact_supplier.php`,
                {
                    email: email,
                    mobile: number,
                    qty: qty,
                    unit: unit,
                    prodName: prodName,
                    reqDetail: reqDetail,
                    country: isoValue.toUpperCase,
                    countryid: dialCode,
                    country_name: countryName,
                    currentUrl: window.location.pathname,
                    prodId: this.props.product.id,
                    type:1,
                    sellerid:ls.get('sellerid'),
                    visitorid: getCookie('mhinpbnb'),
                    source: getCookie('source'),
                    target: getCookie('target'),
                    campaign: getCookie('cname'),
                    security_token: '', plateform_type: '',
                    password:password
                },
                { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(async response => {

                    this.allow_submit()

                    // console.log(response);
                if (response.data.status === 'Success') {
                    
                    if (response.data.message == 1 || response.data.message == '1') {
                        await setCookie('mhinpbn', response.data.result, '365');
                        this.setState({
                            result: 1,
                            otp: 0
                        })
                    } else if (response.data.statusId == 1) {
                        await setCookie('mhinpbn', response.data.message, '365');
                        this.setState({
                            result: 1,
                            otp: 1
                        })
                    }else{
                        this.setState({
                            error: 1
                        })
                    }
                    await store.dispatch(getLoggedIn())
                }
                else {
                    if(response.data.statusId == 0){
                        $("#msgError").append('Please enter correct password or otp').removeClass('d-none');
                        console.log(false)
                        this.allow_submit()
                    }
                }
            })
            .catch(error => {
                this.allow_submit()
                const result = error.response;
                return Promise.reject(result);
            });
        }
        catch (e) {
            this.allow_submit()
        }
    }

    allow_submit = () => {
        $('#no_loading').removeClass('d-none');
        $('#loading').removeClass('d-none').addClass('d-none');
        $('#no_loading_btn').removeAttr('disabled');
    }

    render() {
        
        const { name, unit } = this.props.product;
        const { translate } = this.props  
        const { mobile, company, email, country,password } = this.props.user.user
        const InputProps = {
            required: true,
            placeholder: "Enter your mobile",
            name: "mobile",
            type: 'tel'
             
        }
        return (
            <div key={this.props.product.id}>
                {
                    this.state.result == 1 ?
                       <Redirect to={{ pathname: '/additional_data_req.html', state: { otp: this.state.otp, type: 1, error:0, otpCheck:1 }}}/>
                    : ''
                }

                {/* {
                    this.state.result == 1 ?
                       <Redirect to={{ pathname: '/thankYou.html', state: { otp: this.state.otp, type: 1, error:0, otpCheck:1 }}}/>
                    : ''
                } */}
                <form className="theme-form mt-0" onSubmit={this.reqFormSubmit}>
                    <div className="form-row">
                        <div className="col-md-12 my-2">
                        {
                            this.state.error == 1 ?
                            <div className="alert alert-danger">Something went wrong please try again later.</div >
                            : ''
                        }
                            <div class="alert alert-success d-none" id="msgSuccess" role="alert">
                                OTP is sent to your email and mobile number. Please check and enter the OTP.
                            </div>
                            <div class="alert alert-warning d-none" id="msgError" role="alert"></div>
                            <div className="has-float-label">
                                <IntlTelInput
                                    containerClassName="intl-tel-input"
                                    inputClassName="form-control"
                                    fieldId="buyer_mobile"
                                    geoIpLookup="true"
                                    numberType="MOBILE"
                                    autoPlaceholder="true"
                                    onPhoneNumberChange={this.onChange}
                                    onPhoneNumberBlur={this.change}
                                    defaultCountry={`${getCookie('country_code') ? (getCookie('country_code').toLowerCase()): 'in'}`}
                                    defaultValue={mobile}
                                    numberType="MOBILE"
                                    telInputProps={InputProps}
                                    
                                    // value={this.state.value}
                                    
                                />
                                <label htmlFor="mobile">{translate('Mobile')}</label>
                            </div>
                                {/* <input type="text"  className="form-control" id="name" placeholder="Enter Your name" required /> */}
                        </div>
                        <div className="col-md-12 my-2">
                            <div className="has-float-label">
                                <input id="buyer_email" type="email" placeholder=" " className="form-control" defaultValue={email} required/>
                                <label htmlFor="buyer_email">{translate('Enter your email')}</label>
                            </div>
                        </div>
                        {!(ls.get('sellerid')) &&
                            <>
                            <div className="col-md-8 my-2">
                                <div className="has-float-label">
                                    <input id="buyer_password" type="password" placeholder=" " className="form-control" defaultValue={password} required/>
                                    <label htmlFor="buyer_password">{'Enter password or otp'}</label>
                                </div>
                            </div>

                            <div className="col-md-4 my-2">
                                <button id="no_loading_btn" class="btn btn-primary" type="button" onClick={this.otpForLogin} style={{padding: "-1px 14px !important",border: "2px solid #ff9944",backgroundColor:"#ff9944"}}>   
                                <div class="spinner-border text-light d-none" role="status" id="sms_spinner" style={{width: '1rem',height: '1rem'}}></div>&nbsp;GET OTP&nbsp;
                                </button>
                            </div>
                            </>
                        }

                        <div className="col-md-6 my-2">
                            <div className="has-float-label ">
                                <input id="qty" type="tel" placeholder=" " className="form-control" required/>
                                <label htmlFor="qty">{translate('Quantity')}</label>
                            </div>
                        </div>
                        <div className="col-md-6 my-2">
                            {unit ?
                                <Select
                                    placeholder={translate('Select Unit')}
                                    isOptionSelected='true'
                                    isDisabled
                                    options={this.props.data.units}
                                    onChange={this.handleChange}
                                    // defaultValue={options.value}
                                    defaultInputValue={unit}
                                // formatGroupLabel={formatGroupLabel} 
                                />
                                :
                                <Select
                                    placeholder={translate('Select Unit')}
                                    isOptionSelected='true'
                                    options={this.props.data.units}
                                    onChange={this.handleChange}
                                    defaultInputValue={unit}
                                />
                            }
                        </div>
                        <div className="col-md-12 my-2">
                            <div className="has-float-label ">
                                <input type="text" className="form-control" id="prodName" placeholder=" " defaultValue={`${name}`} required />
                                <label htmlFor="prodName">{translate('Product name')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 my-2">
                            <div className="has-float-label">
                                <textarea className="form-control" placeholder=" " id="reqDetail" rows="4" defaultValue={`Hi,I am interested your ${name},Please give me your best quotation.`}></textarea>
                                <label htmlFor="reqDetail">{translate('Requirement details')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-1">

                            <button id="no_loading_btn" className="btn btn-solid" type="submit">
                                <i id="no_loading" className="fa fa-paper-plane mr-2"></i>
                                <div id="loading" className="spinner-border d-none mr-2" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                {translate('Submit requirement')} 
                            </button>
                        </div>
                        <div className="col-md-12 my-2">
                            <div className={`alert alert-danger ${this.state.error ? '' : 'd-none'}`}>{this.state.msg}</div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return  {
        data: state.units,
        user:state.user
   }   
       
}

export default withTranslate(connect(mapStateToProps)(Requirement));

// export default Requirement;