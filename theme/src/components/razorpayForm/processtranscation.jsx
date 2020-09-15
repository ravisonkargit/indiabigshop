import React, { Component } from 'react'
import { Formik } from 'formik';
import '../common/login.css'
import axios from 'axios';
import { localhost, apiUrl } from '../../constants/variable';
import { ImgUrl, ApiUrl } from '../../constants/ActionTypes';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Select, { Option, ReactSelectProps } from 'react-select';
import * as Yup from 'yup';
import ls from "local-storage";
import $ from 'jquery'
import { getCookie } from '../../functions';

var sellerid, currency;
var method = 'emandate';
const options = [
 { value: 'Savings', label: 'Savings' },
 { value: 'Current', label: 'Current' }
 ];

class ProcessTranscation extends Component {
 constructor(props) {
 super(props)
 this.state = {
 currency: '',
 selectedOption: null,
 paymentGroup: 'razorpay',
 docContent: '',
 is_subscribed: false
 }
 this.checkout = this.checkout.bind(this)
 this.openCheckout = this.openCheckout.bind(this);
 this.netBankingSubmit = this.netBankingSubmit.bind(this);
 this.paytmPayment = this.paytmPayment.bind(this);
 
 }
 handleChange = selectedOption => {
 this.setState({ selectedOption });
 console.log(`Option selected:`, selectedOption);
 };
 componentDidMount() {
 const script = document.createElement("script");
 script.src = "https://checkout.razorpay.com/v1/checkout.js";
 script.async = true;
 document.body.appendChild(script);
//  this.setState({
//      is_subscribed:true
//  })
 }
 componentDidUpdate(){
     if(this.state.is_subscribed){
         var inter = setInterval(function(){
             window.location.href=window.location.origin;
             clearInterval(inter);
         },1000);
     }
 }
 checkout() {
 let options = {
 "key": "rzp_test_7vcRhUW0TOK8JG",
 "order_id": "order_ECfJKvlNOylRWE",
 "customer_id": "cust_ECfHSGMMIetkDf",
 "recurring": "1",
 "handler": function (response) {
 alert(response.razorpay_payment_id);
 alert(response.razorpay_order_id);
 alert(response.razorpay_signature);
 },
 "notes": {
 "note_key 1": "Beam me up Scotty",
 "note_key 2": "Tea. Earl Gray. Hot."
 },
 "theme": {
 "color": "#F37254"
 }
 };

 let rzp = new window.Razorpay(options);
 rzp.open();
 }
 openCheckout() {
 console.log('openCheckout: ', this.props,this.props.package_id,71);
 
 let sellerid = localStorage.getItem('sellerid')
 let package_id = this.props.package_id
 if (sellerid) {
 if (this.props.currency === 'INR') {
 currency = this.props.currency;
 }
 else {
 currency = this.props.currency;
 }
 let passData = {
 currency: currency,
 sellerid: localStorage.getItem('sellerid'),
 amount: this.props.amount
 }
 axios.post(
 `${localhost}/api/membership/createSubscription`,
 passData
 )
 .then(async response => {
 if (response.status === 201) {
 window.location.reload()
 }
 console.log(response,95)
 let data = response.data
 let mobile = this.props.user.mobile
 let email = await this.props.user.email
 let name = this.props.user.name
 let options = {
 "key": data.key_id,
 "subscription_id": data.subscription_id,
 "name": "Beldara.com",
 "description": "Beldara Monthly Subscription",
 "image": "https://img.beldara.com/images/BelDara-logo.png",
 "handler": function (response) {
 console.log(response)
 let passData = {
 payment_id: response.razorpay_payment_id,
 subscription_id: response.razorpay_subscription_id,
 package_id: package_id,
 sellerid: localStorage.getItem('sellerid')
 }
 axios.post(
 `${localhost}/api/membership/successSubscription`,
 passData
 ).then(async response => {
 console.log(response)
 axios.post(
 `${ApiUrl}/common/send_invoice.php`,
 passData, { headers: { "Content-Type": "multipart/form-data" } }
 ).then(async response => {
 // if(response.data) {}
 window.location.reload()
 console.log(response)
 })
 .catch(error => {
 window.location.reload()
 const result = error.response;
 return Promise.reject(result);
 })
 })
 .catch(error => {
 const result = error.response;
 return Promise.reject(result);
 })
 },
 "prefill": {
 "name": name,
 "email": email,
 "mobile": mobile
 },
 "theme": {
 "color": "#F37254"
 }
 };
 console.log(passData,options,147);
 let rzp = new window.Razorpay(options);
 rzp.open();
 })
 .catch(error => {
 const result = error.response;
 return Promise.reject(result);
 });

 }
 else {
 this.props.openLoginModal()
 }
 
 }

 paytmPayment(values,auth_type,paymentMethod){
 console.log(values, paymentMethod)
 let passData = {
 sellerid: JSON.parse(this.props.user.sellerid),
 currency: getCookie('currency') ? getCookie('currency') : 'INR'
 }

 axios.post(
 `${localhost}/paytm/subscription/initiateSubscription`,
 passData,{headers:{'Content-Type':'application/json'}}
 )
 .then(async result => {

 if (result.data.statusId == 1){
 const orderPayload = {
 orderId : result.data.result.orderId,
 subcriptionid: result.data.result.subcriptionid,
 cb: '/paymentInitiated',
 amountType : 'FIX',
 transactionAmt: result.data.result.transactionAmt,
 transactionCurrency: result.data.result.transactionCurrency,
 subscriptionEnableRetry: 1,
 email : result.data.result.email,
 mobile : result.data.result.mobile,
 custId : result.data.result.custId,
 paymentMode : 'CC' // CC or DC
 }

 axios.post(
 `${localhost}/paytm/createOrder`,
 orderPayload,{headers:{'Content-Type':'application/json'}}
 ).then( async response =>
 {
 console.log('createOrder: ',response.data)
 this.setState({
 docContent: response.data
 })
 }
 )

 }
 }
 )
 }

 //NeetBanking Form submit 
 netBankingSubmit(values,auth_type,paymentMethod) {
    // this.setState({
    //         is_subscribed :true
    //         })
 console.log(paymentMethod)
 $(".err").addClass('d-none').removeClass('d-block alert alert-danger')
 let package_id = this.props.package_id
 
 let passData = {
 sellerid: JSON.parse(this.props.user.sellerid),
 name: this.props.user.name ? this.props.user.name : 'Guest',
 email: this.props.user.email,
 mobile: this.props.user.mobile,
 benefName: values.benefName,
 accNo: values.accNo,
 ifsc: values.ifsc,
 accType: values.accType,
 currency: this.props.currency,
 package_id: package_id,
 customerid: window.location.pathname.split('/')[2],
 paymentMethod: paymentMethod,
 auth_type: auth_type
 }
 console.log(passData,228);
 axios.post(
 `${localhost}/api/membership/emandate/createOrder`,
 passData,{headers:{'Content-Type':'application/json'}}
 )
 .then(async response => {
 if(auth_type==='physical') {
 let prefilled_form_link = response.data.response.token.nach.prefilled_form
 window.open(prefilled_form_link)
 }
 console.log(response,235);

 // if (response.status === 201) {
 // window.location.reload()
 // }
 // console.log(response)
 // let data = response.data
 // let mobile = this.props.user.mobile
 // let email = await this.props.user.email
 // let name = this.props.user.name
 const {currency} = this.props
 var options = {
 "key": response.data.key_id,
 "order_id": response.data.order_id,
 "customer_id": response.data.customerid,
 "recurring": "1",
 "name": "Beldara.com",
 "description": "Beldara Monthly Subscription",
 "image": "https://img.beldara.com/images/BelDara-logo.png",
 "handler": function (res) {

 const passdata = {
 payment_id : res.razorpay_payment_id,
 order_id: response.data.order_id,
 sellerid : ls.get('sellerid')
 }

 axios.post(
 `${localhost}/api/membership/emandate/fetchToken`,
 passdata
 ).then(async result => {
 console.log('token', result,268,'inside fetchtoken api');
    this.setState({
        is_subscribed :true
    });
 // let sql = `call ${beldaraDb}.storeToken('${sellerid}','${response.id}','authorised','razorpay','authenticate','${ip}','${customer_id}','${device}','${package_id}','${currency}','${method}','1')`
 // conn.query(sql,(err,result)=>{
 // // if(err) res.status(400).send(err)
 // if(err) throw err
 // let data = {
 // key_id: key_id,
 // order_id: response.id,
 // customerid: customer_id,
 // response: response
 // }
 // res.status(200).send(data)
 // })

 })

 // console.log(res)
 // let passData = {
 // payment_id: res.razorpay_payment_id,
 // sellerid: JSON.parse(localStorage.getItem('sellerid')),
 // customerid: response.data.customerid,
 // method: method
 // }
 // axios.post(
 // `${localhost}/api/membership/emandate/createOrderCharge`,
 // passData
 // ).then(async result => {
 // let paymentDetail = {
 // tokenid: result.data.token,
 // orderid: result.data.order,
 // currency: currency,
 // sellerid: JSON.parse(localStorage.getItem('sellerid')),
 // customerid: response.data.customerid,
 // amount: result.data.amount,
 // url: window.location.hostname
 // }
 // console.log('before',paymentDetail)
 // axios.post(
 // `${apiUrl}captureRecurringPayment.php`,
 // paymentDetail,
 // // {headers:{'Content-Type':'multipart/form-data'}}
 // {headers:{'Content-Type':'application/json'}}
 // ).then(async result => {
 // window.location.href = 'https://beldara.com/membership.html'
 // // axios.post(
 // // `${ApiUrl}/common/send_invoice.php`,
 // // passData, { headers: { "Content-Type": "multipart/form-data" } }
 // // ).then(async response => {
 // // // if(response.data) {}
 // // window.location.reload()
 // // console.log(response)
 // // })
 // // .catch(error => {
 // // window.location.reload()
 // // const result = error.response;
 // // return Promise.reject(result);
 // // })
 // }).catch(error => {
 // // window.location.reload()
 // console.error(error)
 // const result = error.response;
 // return Promise.reject(result);
 // })
 // console.log('after',paymentDetail)
 // })
 // .catch(error => {
 // const result = error.response;
 // return Promise.reject(result);
 // })
 }.bind(this),
 "theme": {
 "color": "#F37254"
 }
 };
 let rzp = new window.Razorpay(options);
 await rzp.open();
 })
 .catch(error => {
 const result = error.response;
 console.log(result,error,358);
 if(result !== undefined){
 if(result.status===500) {
 if(result.data.error) {
 $(".err").addClass('d-block alert alert-danger').removeClass('d-none').text(result.data.error.description)
 setTimeout(function() { $(".err").addClass('d-none').removeClass('d-block alert alert-danger'); }, 5000);
 }
 }
 else if(result.status === 400) {
 if(result.data.error) {
 $(".err").addClass('d-block alert alert-danger').removeClass('d-none').text(result.data.error.description)
 setTimeout(function() { $(".err").addClass('d-none').removeClass('d-block alert alert-danger'); }, 5000);
 }
 }
 }
 
 // setInterval(() => {
 // alert(1);
 // }, 400);
 return Promise.reject(result);
 });
 }
 onSubNetbanking = (values)=>{
 if ( values == "paytm")
 this.paytmPayment(values,'netbanking',method)
 else
 this.netBankingSubmit(values,'netbanking',method)
 }
 render() {
    //  console.log(window.location);
 return (
 <React.Fragment>
 <div className="container py-5">
 <div className="row mb-1">
 <div className="col-lg-8 mx-auto text-left">
 <h4 className="display-4">Monthly Plan</h4>
 {this.state.is_subscribed
 ? <div className="justify-content-center text-center alert alert-success">Your subscription initiated successfully</div>
 : ''
}
 </div>
 </div>
 { this.state.docContent && this.state.docContent!=='' &&
 <div className="paytmdoc" dangerouslySetInnerHTML={{__html: this.state.docContent }} >

 </div>
 }
 <div className="row">
 <div className="col-lg-8 mx-auto p-0">
 <div className="card border-0 shadow-sm">
 <div className="card-header">
 <div className="col-12 mb-2">
 Select options to pay
 </div>
 <div className="bg-white shadow-sm pt-4 pl-2 pr-2 pb-2">
 <ul role="tablist" className="nav bg-light nav-pills rounded nav-fill mb-3">
 <li className="nav-item"> <a data-toggle="pill" href="#credit-card" className="nav-link active "> <i className="fa fa-credit-card mr-2"></i> Credit Card </a> </li>
 <li className="nav-item"> <a data-toggle="pill" href="#paypal" className="nav-link "> <i className="fa fa-money-check mr-2"></i> Netbanking </a> </li>
 {/* <li className="nav-item"> <a data-toggle="pill" href="#net-banking" className="nav-link "> <i className="fa fa-file mr-2"></i> Offline payment </a> </li> */}
 </ul>
 </div>
 <div className="tab-content">
 <div id="credit-card" className="tab-pane fade show active pt-3 text-center">
 <button className="btn getLogin btn-primary" id="monthly-subs" onClick={this.openCheckout}>
 Choose Monthly Subscription
 </button>
 </div>
 <div id="paypal" className="tab-pane fade pt-3">

 {/* mobile:Yup.number()
 .required('Required'),
 email:Yup.string().email()
 .required('Required'), */}

 <Formik
 initialValues={{ benefName: '', accNo: '',ifsc: '', accType: '',mobile:'',email:'', paymentGroup: 'razorpay' }}
 
 validationSchema={Yup.object({
 
 benefName: Yup.string()
 .required('Required'),
 accNo: Yup.string()
 .required('Required'),
 accType: Yup.string()
 .required('Required'),
 ifsc: Yup.string()
 .required('Required'),
 paymentGroup: Yup.string()
 .required('Required')
 })}
 onSubmit={(values, { setSubmitting }) => {
 // setTimeout(() => {
 // alert(JSON.stringify(values, null, 2));
 // setSubmitting(false);
 // }, 400);
 console.log('onSubmit: ',values)
 if ( values.paymentGroup == "paytm")
 this.paytmPayment(values,'netbanking',method)
 else
 this.netBankingSubmit(values,'netbanking',method)
 setSubmitting(false)
 }}
 >
 {({
 values,
 errors,
 touched,
 handleChange,
 handleBlur,
 handleSubmit,
 isSubmitting,
 setFieldValue
 /* and other goodies */
 }) => (
 <form onSubmit={handleSubmit}>
 <p className="error d-none"></p>
 <div className="form-label-group">
 <input
 type="text"
 name="benefName"
 id="benefName"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.benefName}
 className="form-control"
 placeholder="Account Holder name"
 />
 <label htmlFor="benefName">Account Holder name</label>
 {errors.benefName && touched.benefName && errors.benefName}
 </div>

 {/* <div className="form-label-group">
 <input
 type="text"
 name="email"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.email}
 className="form-control"
 placeholder="Email address"
 defaultValue={this.props.user.email}
 />
 <label htmlFor="name">Email address</label>
 {errors.email && touched.email && errors.email}
 </div>

 <div className="form-label-group">
 <input
 type="tel"
 name="mobile"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.mobile}
 className="form-control"
 placeholder="Mobile no."
 defaultValue={this.props.user.mobile}
 />
 <label htmlFor="name">Mobile no.</label>
 {errors.mobile && touched.mobile && errors.mobile}
 </div> */}

 <div className="form-label-group">
 <input
 type="text"
 name="accNo"
 id="accNo"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.accNo}
 className="form-control"
 placeholder="Bank Account number"
 />
 <label htmlFor="accNo">Bank Account number</label>
 {errors.accNo && touched.accNo && errors.accNo}
 </div>
 
 <div className="row">
 <div className="col">
 <div className="form-label-group ">
 <input
 type="text"
 name="ifsc"
 id="ifsc"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.ifsc}
 className="form-control"
 placeholder="IFSC Code"
 />
 <label htmlFor="ifsc">IFSC Code</label>
 {errors.ifsc && touched.ifsc && errors.ifsc}
 </div>
 </div>
 <div className="col">
 <div className="form-label-group ">
 <Select
 onBlur={handleBlur}
 // onChange={this.handleChange}
 onChange={option => {
 values.accType = option.value
 }}
 isSearchable={false}
 options={options}
 name={values.accType}
 value={options ? options.find(option => option.value === values.accType) : ''}
 placeholder={"Account Type"}
 />
 {errors.accType && touched.accType && errors.accType}
 </div>
 </div>
 </div>

 <div className="payment-options">
 <ul>
 <li className="d-block">
 <div className="radio-option razorpay">
 <input type="radio" name="paymentGroup" value="razorpay" method="razorpay" id="razorpay" onChange={handleChange} defaultChecked={true} />
 <label className="ml-2" htmlFor="razorpay">Pay using Credit / Debit Card</label>
 </div>
 </li>
 
 {/* <li className="d-block">
 <div className="radio-option paytm">
 <input type="radio" name="paymentGroup" value="paytm" method="paytm" id="paytm" onChange={handleChange} />
 <label className="ml-2" htmlFor="paytm">Pay using Paytm</label>
 </div>
 </li> */}
 
 </ul>
 </div>

 <button type="submit" className="btn btn-primary form-control" disabled={isSubmitting}>
 Submit
 </button>

 <div className="err d-none">
 </div>
 </form>
 )}
 </Formik>
 </div>
 {/* <div id="net-banking" className="tab-pane fade pt-3">
 <Formik
 initialValues={{ benefName: '', accNo: '',ifsc: '', accType: '' }}
 validationSchema={Yup.object({
 benefName: Yup.string()
 .required('Required'),
 accNo: Yup.string()
 .required('Required'),
 accType: Yup.string()
 .required('Required'),
 ifsc: Yup.string()
 .required('Required'),
 })}
 onSubmit={(values, { setSubmitting }) => {
 
 this.netBankingSubmit(values,'physical','nach')
 setSubmitting(false)
 }}
 >
 {({
 values,
 errors,
 touched,
 handleChange,
 handleBlur,
 handleSubmit,
 isSubmitting,
 setFieldValue
 }) => (
 <form onSubmit={handleSubmit}>
 <p className="error d-none"></p>
 <div className="form-label-group">
 <input
 type="benefName"
 name="benefName"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.benefName}
 className="form-control"
 placeholder="Bank owner name"
 />
 <label htmlFor="name">Bank owner name</label>
 {errors.benefName && touched.benefName && errors.benefName}
 </div>
 <div className="form-label-group">
 <input
 type="accNo"
 name="accNo"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.accNo}
 className="form-control"
 placeholder="Bank Account number"
 />
 <label htmlFor="inputPassword">Bank Account number</label>
 {errors.accNo && touched.accNo && errors.accNo}
 </div>
 
 <div className="row">
 <div className="col">
 <div className="form-label-group ">
 <input
 type="ifsc"
 name="ifsc"
 onChange={handleChange}
 onBlur={handleBlur}
 value={values.ifsc}
 className="form-control"
 placeholder="IFSC Code"
 />
 <label htmlFor="inputEmail">IFSC Code</label>
 {errors.ifsc && touched.ifsc && errors.ifsc}
 </div>
 </div>
 <div className="col">
 <div className="form-label-group ">
 <Select
 onBlur={handleBlur}
 onChange={option => {
 values.accType = option.value
 }}
 isSearchable={false}
 options={options}
 name={values.accType}
 value={options ? options.find(option => option.value === values.accType) : ''}
 placeholder={"Account Type"}
 />
 {errors.accType && touched.accType && errors.accType}
 </div>
 </div>
 </div>
 <button type="submit" className="btn btn-primary form-control" disabled={isSubmitting}>
 Submit
 </button>
 <div className="err d-none">
 </div>
 </form>
 )}
 </Formik>
 
 <p className="text-muted">Note: After clicking on the button, you will be directed to a secure gateway for payment. After completing the payment process, you will be redirected back to the website to view details of your order. </p>
 </div> */}
 </div>
 </div>
 </div>
 <div className="alert alert-light border-0 shadow-sm" style={{ background: '#00000008' }}>
 <i className="fa fa-check-circle mr-2 fa-lg text-success"></i> 100% Secure payments powered by Beldara
 </div>
 </div>
 </div>
 </div>
 </React.Fragment>
 )
 }
}

const mapToStateProps = state => ({
 currency: state.data.symbol,
 user: state.user.user
})

export default connect(mapToStateProps)(ProcessTranscation)