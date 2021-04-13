import React, { Component, Suspense, lazy } from "react";
import $ from "jquery";
import SignUpPopUp from "../signUpPopUp";
import LoginPopUp from "../loginPopUp";
import Breadcrumb from "../common/breadcrumb";
import RazorpayForm from "../razorpayForm";
import { getAllPackage, checkPremium } from "../../functions";
import { connect } from "react-redux";
import ls from "local-storage";
import { ImgUrl, ApiUrl, SellerUrl, Url } from "../../constants/ActionTypes";
import "./membership.css";
import "./seller-style.css";
import { withTranslate } from "react-redux-multilingual";
import axios from "axios";
import Slider from "react-slick";
import { Slider3 } from "../../services/script"
import { localhost } from "../../constants/variable";
import {isMobile} from 'react-device-detect';

const MonthlySub = lazy(() => import('../razorpayForm/monthlySub'))
var sellerid = ls.get("sellerid");

var email,
 mobile,
 name,
 currency,
 result_from_package,
 package_detail,
 count,
 previousCurrency,
 StoreUrl,
 paymentDate,
 packageAmount,
 packageId,
 invoiceId,
 packageName,
 receiptPath,
 domainName,
 currencyOfPay, subscription_id,subscription_status,order_id;
function DiscountCalc(props) {
 return (
 <div>

 <div>
 <del className="text-white">

 {props.currency == "INR" ? (
 <i className="fa fa-inr mr-1"></i>
 ) : (
 <i className="fa fa-usd mr-1"></i>
 )}

 {parseInt(props.amount)}
 </del>
 </div>
 <div>
 {props.currency == "INR" ? (
 <i className="fa fa-inr mr-1"></i>
 ) : (
 <i className="fa fa-usd mr-1"></i>
 )}
 {parseInt(parseInt(props.amount) - ((parseInt(props.discount) / parseInt(100)) * parseInt(props.amount)))}
 </div>
 </div>
 )
}


class Membership extends Component {
 constructor(props) {
 super(props);
 this.state = {
 amount1: 999,
 amount2: 9999,
 amount3: 99999,
 amount4: '',
 packageName1: "Diamond",
 packageName2: "Platinum",
 packageName3: "Gold",
 packageName4: '',
 validity1: 12,
 validity2: 12,
 validity3: 12,
 validity4: '',
 formid1: "lead_payment1",
 formid2: "lead_payment2",
 formid3: "lead_payment3",
 type: "lead_payment1",
 event: "lead_payment2",
 page: "lead_payment3",
 link: `${ApiUrl}/common/package_purchased.php`,
 packageid1: 1,
 packageid2: 2,
 packageid3: 3,
 packageid4: '',
 ispremium: 0,
 signup: false,
 login: false,
 reload: 0,
 discount: 0,
 packageType: 1,
 subscription_id: null,
 cancelModal: false,
 readTnc:false,
 tncerror: 0
 };
 result_from_package = "Failure";
 count = 0;
 domainName = window.location.hostname;

 this.readTncThenBuy = this.readTncThenBuy.bind(this)
 this.selectedTnc = this.selectedTnc.bind(this)
 this.openLoginModal = this.openLoginModal.bind(this)

 
 }

 selectedTnc = async () => {
 await this.setState({
 readTnc : !this.state.readTnc
 });
 }

  footerData = data => {
    // console.log('footerData called',this.state,data);
    if (data.modalChange)
      this.setState({
        signup: data.modal,
        login: data.modal
      }, ()=>{
        if(ls.get('sellerid')){
          //document.getElementById('monthly-subs').click()
          // if (data.reload.paymentModal) 
            // $(".razorpay-payment-button").click()
        }
      }
    );

    this.setState({
      reload: data.reload
    });

    // document.getElementById('monthly-subs').click()
    // if (data.reload.paymentModal) $(".razorpay-payment-button").click();
  };

 closeModal = () => {
 this.setState({
 login: false,
 signup: false
 });
 };

 readTncThenBuy = () => {
 this.setState({
 tncerror: 1
 })
 }

 openSignUpModal = () => {
 this.setState({
 signup: true,
 login: false
 });
 };

 openLoginModal(e){ 
  //  console.log(e.target,168);
  var element_id = $(e.target).attr('data-id');
  // console.log(e,element_id,170);
 this.setState({
 signup: false,
 login: true,
 element:element_id
 });
 };

 async componentWillMount() {
 // meta tag needful

 let hostname = window.location.hostname;
 let domain_language_code = "";
 // if (hostname === undefined || hostname == '')
 //hostname = "beldara.com";
 let langDomain = hostname.split("beldara.com")[0];
 langDomain = langDomain.replace(".", "");
 this.props.languageMaster.languageMaster.forEach(element => {
 if (element.main_language.toLowerCase() == langDomain.toLowerCase())
 domain_language_code = element.code;
 }, this);
 // console.log(domain_language_code);
 if (domain_language_code !== "" && domain_language_code !== undefined) {
 await axios.post(
 "https://api.indiabigshop.com/common/static_page.php",
 {
 security_token: "",
 plateform_type: "",
 langCode: domain_language_code,
 pageid: "15"
 },
 { headers: { "Content-Type": "multipart/form-data" } }
 )
 .then(response => {
 // console.log('if');
 // console.log(response);
 this.setState({
 data: response.data.result
 });
 })
 .catch(error => {
 const result = error.response;
 return Promise.reject(result);
 });
 } else {
 await axios.post(
 "https://api.indiabigshop.com/common/static_page.php",
 {
 security_token: "",
 plateform_type: "",
 langCode: "en",
 pageid: "15"
 },
 { headers: { "Content-Type": "multipart/form-data" } }
 )
 .then(response => {
 this.setState({
 data: response.data.result
 });
 })
 .catch(error => {
 const result = error.response;
 return Promise.reject(result);
 });
 }

 // membership needful

 if (ls.get("sellerid")) {
 const premium = await checkPremium(ls.get("sellerid"));
 // console.log(premium);
 if (premium.message != 0 && premium.statusId != 0) {
 StoreUrl = premium.result[0].url;
 paymentDate = premium.result[0].payment_date;
 packageAmount = premium.result[0].amount;
 packageId = premium.result[0].package_id;
 invoiceId = premium.result[0].invoice_id;
 packageName = premium.result[0].pckg_name;
 receiptPath = premium.result[0].receipt_path;
 currencyOfPay = premium.result[0].currency;
 subscription_id = premium.result[0].subscription_id;
 subscription_status = premium.result[0].subscription_status;
 order_id = premium.result[0].order_id;
 this.setState({
 ispremium: 1
 });
 } else {
 this.setState({
 ispremium: 0
 });
 }
 } else
 this.setState({
 ispremium: 0
 });

 currency = this.props.data.symbol;
 previousCurrency = this.props.data.symbol;
 name = this.props.user.user.name;
 mobile = this.props.user.user.mobile;
 email = this.props.user.user.email;
 package_detail = await getAllPackage(currency);
 if (package_detail.result.toLowerCase() == "success") {
   if(package_detail.data[0].discount != '0.00' && package_detail.data[0].discount != 'null' && package_detail.data[0].discount != ''){
     this.setState({
      discount:package_detail.data[0].discount
     })
   }
 result_from_package = package_detail.result;
//  console.log(result_from_package)

 // static way to set state
 if (currency == "INR") {
 this.setState({
 amount1: package_detail.data[2].amount,
 amount2: package_detail.data[1].amount,
 amount3: package_detail.data[0].amount,
 amount4: package_detail.data[6].amount,
// amount4: "2950",
 validity1: package_detail.data[2].validity,
 validity2: package_detail.data[1].validity,
 validity3: package_detail.data[0].validity,
 validity4: package_detail.data[6].validity,
 packageName1: package_detail.data[2].pckg_name,
 packageName2: package_detail.data[1].pckg_name,
 packageName3: package_detail.data[0].pckg_name,
 packageName4: package_detail.data[6].pckg_name,
 packageid1: package_detail.data[2].id,
 packageid2: package_detail.data[1].id,
 packageid3: package_detail.data[0].id,
 packageid4: package_detail.data[6].id
 });
 } else {
 this.setState({
 amount1: package_detail.data[5].amount,
 amount2: package_detail.data[4].amount,
 amount3: package_detail.data[3].amount,
 amount4: package_detail.data[7].amount,
// amount4: "39.99",
 validity1: package_detail.data[5].validity,
 validity2: package_detail.data[4].validity,
 validity3: package_detail.data[3].validity,
 validity4: package_detail.data[7].validity,
 packageName1: package_detail.data[5].pckg_name,
 packageName2: package_detail.data[4].pckg_name,
 packageName3: package_detail.data[3].pckg_name,
 packageName4: package_detail.data[7].pckg_name,
 packageid1: package_detail.data[5].id,
 packageid2: package_detail.data[4].id,
 packageid3: package_detail.data[3].id,
 packageid4: package_detail.data[7].id
 });
 }

 // dynamic way to set state
 // for (const [key, value] of Object.entries(package_detail.data)){
 // if (value.currency == currency){
 // count++;
 // this.setState({
 // ['amount'+count]:package_detail.data[key].amount,
 // ['validity'+count]:package_detail.data[key].validity
 // })

 // }
 // console.log(this.state);
 // }
 }
 }
 

 componentDidUpdate(previousProps) {
 currency = this.props.data.symbol;
 if (previousProps.data.symbol != currency) {
 name = this.props.user.user.name;
 mobile = this.props.user.user.mobile;
 email = this.props.user.user.email;
 if (package_detail) {
 count = 0;

 if (currency == "INR") {
 this.setState({
 amount1: package_detail.data[2].amount,
 amount2: package_detail.data[1].amount,
 amount3: package_detail.data[0].amount,
 amount4: package_detail.data[6].amount,
// amount4: "2950",
 validity1: package_detail.data[2].validity,
 validity2: package_detail.data[1].validity,
 validity3: package_detail.data[0].validity,
 validity4: package_detail.data[6].validity,
 packageName1: package_detail.data[2].pckg_name,
 packageName2: package_detail.data[1].pckg_name,
 packageName3: package_detail.data[0].pckg_name,
 packageName4: package_detail.data[6].pckg_name,
 packageid1: package_detail.data[2].id,
 packageid2: package_detail.data[1].id,
 packageid3: package_detail.data[0].id,
 packageid4: package_detail.data[6].id
 });
 } else {
 this.setState({
 amount1: package_detail.data[5].amount,
 amount2: package_detail.data[4].amount,
 amount3: package_detail.data[3].amount,
 amount4: package_detail.data[7].amount,
// amount4: "39.99",
 validity1: package_detail.data[5].validity,
 validity2: package_detail.data[4].validity,
 validity3: package_detail.data[3].validity,
 validity4: package_detail.data[7].validity,
 packageName1: package_detail.data[5].pckg_name,
 packageName2: package_detail.data[4].pckg_name,
 packageName3: package_detail.data[3].pckg_name,
 packageName4: package_detail.data[7].pckg_name,
 packageid1: package_detail.data[5].id,
 packageid2: package_detail.data[4].id,
 packageid3: package_detail.data[3].id,
 packageid4: package_detail.data[7].id
 });
 }
 window.location.reload();
 }
 }
 }

 isLoggedIn() { }

 getMembership(e) {
 e.preventDefault()
//  console.log(1111)
 var target = e.target
 // var atLeastOneIsChecked = $('#checkArray:checkbox:checked').length > 0;
 var atLeastOneIsChecked = $('input[name="chk[]"]:checked').length > 0;
//  console.log(atLeastOneIsChecked)
 
 // if (window.confirm("are you sure want to unsubscribe ?")) {
 let data = {
 sellerid: JSON.parse(localStorage.getItem('sellerid')),
 subscription_id: subscription_id,
 remark: target.remark.value,
 checked: atLeastOneIsChecked,
 email: this.props.user.user.email,
 order_id: order_id
 }
 axios.post(`${ImgUrl}/api/common/cancel_subscription.php`, data, { headers: { "content-type": "multipart/form-data" } })
 .then(async response => {
//  console.log(response)
 if (response.status === 200) {
 window.location.reload()
 }
 })
 .catch(error => {
 const result = error.response;
 return Promise.reject(result);
 })
 // } else {
 // return;
 // }
 }
 render() {
  //  console.log(this.state.formid1,name,email,mobile,sellerid,currency,this.state.amount1,this.state.discount,this.state.page,this.state.type,this.state.event,this.state.id,this.state.link,this.isLoggedIn);
 const { translate } = this.props;
 const settings = {
 dots: true,
 infinite: true,
 speed: 100,
 slidesToShow: 1,
 slidesToScroll: 1
 };
 return (
 <React.Fragment>
 <Breadcrumb
 title={"Membership "}
 metaKeyword={`Membership,gold,sales boost,seller,sell,supplier`}
 metaTitle={`Beldara.com-Membership`}
 metaDesc={`Get a membership with beldara.com and expand your business and boost your sales.`}
 />

 {this.state.ispremium == 0 ? (
 <div className="container">

 {/* <div className="alert alert-success text-center">
 Navratri Special Offer 10% off on all membership packages 🎉 🎉 🎉 🎉
 </div> */}
 <div className="row">
    <div className="col-md-12">
     
        
        {/* {(isMobile) ?
         <section className="p-0 small-slider">
        <Slider {...settings} className="slide-1 home-slider">
          <div class="mob">
          <img className="img-fluid" src="https://img.beldara.com/advt_banner/Reach-millions-of-b2b-buyers-globally_mob2.jpg"/>
          </div>
          </Slider>
          </section>
        :
        <section className="p-0 small-slider">
        <Slider {...settings} className="slide-1 home-slider">
        <div className="home lazyload" style={{ backgroundImage: `url(https://img.beldara.com/advt_banner/Reach-millions-of-b2b-buyers-globally.jpg)`,height:'100px' }}>
        </div>
        </Slider>
        </section>
        }           */} 
        
     
    </div>
  </div>
 <div className="row">
 <div className="col-xl-12 center-page">
 <div className="text-center">
 <h4 className="mt-3">
 {translate("Choose Your Perfect Plan")}
 </h4>
 <p>{currency}</p>

 {/* <div className="tab mb-3">
 <button className={`btn ${this.state.packageType === 0 ? 'btn-solid' : 'btn-light'}`} onClick={() => this.setState({ packageType: 0 })}>Monthly Package</button>
 <button className={`btn ${this.state.packageType === 1 ? 'btn-solid' : 'btn-light'}`} onClick={() => this.setState({ packageType: 1 })}>Annual Package</button>
 </div> */}
 </div>
 {

 result_from_package.toLowerCase() == "success" ? (
 <div className="row m-t-50">
 {
 this.state.packageType === 1 ?
 <React.Fragment>
 <article className="pricing-column col-md-4">
 <div className="inner-box card-box">
 <div className="plan-header text-center">
 <h3 className="plan-title">
 {translate("GOLD PACKAGE")}
 </h3>
 <h2 className="plan-price">

 {this.state.discount > 0 ?
 <DiscountCalc currency={currency} amount={this.state.amount1} discount={this.state.discount} /> :
 this.state.amount1
 }
 </h2>
 <div className="plan-duration">
 {this.state.validity1} {translate("Month")}
 </div>
 </div>
 <ul className="plan-stats list-unstyled text-center">
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Unlimited Product Listing")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>5{" "}
 {translate("Product Promo Branding")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Exclusive URL")}(Eg.
 Whopper.beldara.com)
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Sub Account (different login id)")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate(
 "Product Performance Report (Click/ Views)"
 )}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Chat to Buyer")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Higher Visibility")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>3
 <sup>rd</sup>
 {translate("Priority Promotion")}
 </li>
 </ul>

 <div className="text-center mb-2">
 {ls.get("sellerid") ? (
 <RazorpayForm
 name={name}
 email={email}
 mobile={mobile}
 id={this.state.formid1}
 sellerid={sellerid}
 currency={currency}
 amount={this.state.amount1}
 discount={this.state.discount}
 page={this.state.page}
 type={this.state.type}
 event={this.state.event}
 className={this.state.id}
 method="POST"
 action={this.state.link}
 isLoggedIn={this.isLoggedIn}
 value={
 "pckgid=" +
 this.state.packageid1 +
 ",amount=" +
 this.state.amount1 +
 ",sellerid=" +
 ls.get("sellerid") +
 ",mainurl=" +
 domainName +
 ",discount=" +
 this.state.discount
 }
 test={1}
 />
 ) : (
 <span
 className="getLogin"
 onClick={this.openLoginModal}
 >
 {" "}
 {translate("Pay Now")}
 </span>
 )}
 </div>
 </div>
 </article>
 <article className="pricing-column col-md-4">
 <div className="inner-box card-box">
 <div className="ribbon-pricing">
 <span>{translate("POPULAR")}</span>
 </div>
 <div className="plan-header text-center">
 <h3 className="plan-title">
 {translate("PLATINUM PACKAGE")}
 </h3>
 <h2 className="plan-price">

 {this.state.discount > 0 ?
 <DiscountCalc currency={currency} amount={this.state.amount2} discount={this.state.discount} /> :
 this.state.amount2
 }
 </h2>
 <div className="plan-duration">
 {this.state.validity2} {translate("Month")}
 </div>
 </div>
 <ul className="plan-stats list-unstyled text-center">
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Unlimited Product Listing")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>10{" "}
 {translate("Product Promo Branding")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Exclusive URL")}(Eg.
 Whopper.beldara.com)
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Sub Account (different login id)")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate(
 "Product Performance Report (Click/ Views)"
 )}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Chat to Buyer")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Higher Visibility")}
 </li>
 <li className="d-block">
 <i className="fa fa-check text-success">&nbsp;</i>2
 <sup>nd</sup>
 {translate("Priority Promotion")}
 </li>
 </ul>

 <div className="text-center mb-2">
 {ls.get("sellerid") ? (
 <RazorpayForm
 name={name}
 email={email}
 mobile={mobile}
 id={this.state.formid2}
 currency={currency}
 sellerid={sellerid}
 amount={this.state.amount2}
 discount={this.state.discount}
 page={this.state.page}
 type={this.state.type}
 event={this.state.event}
 className={this.state.id}
 method="POST"
 action={this.state.link}
 isLoggedIn={this.isLoggedIn}
 value={
 "pckgid=" +
 this.state.packageid2 +
 ",amount=" +
 this.state.amount2 +
 ",sellerid=" +
 ls.get("sellerid") +
 ",mainurl=" +
 domainName +
 ",discount=" +
 this.state.discount
 }
 />
 ) : (
 <span
 className="getLogin" data-id="lead_payment2" 
 onClick={this.openLoginModal}
 >
 {" "}
 {translate("Pay Now")}
 </span>
 )}
 </div>
 </div>
 </article>
 <article className="pricing-column col-md-4">
 <div className="inner-box card-box">
 <div className="plan-header text-center">
 <h3 className="plan-title">
 {translate("DIAMOND PACKAGE")}
 </h3>
 <h2 className="plan-price">

 {this.state.discount > 0 ?
 <DiscountCalc currency={currency} amount={this.state.amount3} discount={this.state.discount} /> :
 this.state.amount3
 }
 </h2>
 <div className="plan-duration">
 {this.state.validity3} {translate("Month")}
 </div>
 </div>
 <ul className="plan-stats list-unstyled text-center">
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Unlimited Product Listing")}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>25{" "}
 {translate("Product Promo Branding")}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Company Logo")}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Exclusive URL")}(Eg.
 Whopper.beldara.com)
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Sub Account (different login id)")}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate(
 "Product Performance Report (Click/ Views/ Area/ Suggestions)"
 )}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Chat to Buyer")}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Higher Visibility")}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>
 {translate("Chat to Live Buyer")}
 </li>
 <li className="d-block mb-2">
 <i className="fa fa-check text-success">&nbsp;</i>1
 <sup>st</sup>
 {translate("Priority Promotion")}
 </li>
 </ul>

                                <div className="text-center mb-2">
                                  {ls.get("sellerid") ? (
                                    <RazorpayForm
                                      name={name}
                                      email={email}
                                      mobile={mobile}
                                      id={this.state.formid3}
                                      currency={currency}
                                      sellerid={sellerid}
                                      amount={this.state.amount3}
                                      discount={this.state.discount}
                                      page={this.state.page}
                                      type={this.state.type}
                                      event={this.state.event}
                                      className={this.state.id}
                                      method="POST"
                                      action={this.state.link}
                                      isLoggedIn={this.isLoggedIn}
                                      value={
                                        "pckgid=" +
                                        this.state.packageid3 +
                                        ",amount=" +
                                        this.state.amount3 +
                                        ",sellerid=" +
                                        ls.get("sellerid") +
                                        ",mainurl=" +
                                        domainName +
                                        ",discount=" +
                                        this.state.discount
                                      }
                                    />
                                  ) : (
                                      <span
                                        className="getLogin"
                                        onClick={this.openLoginModal}
                                      >
                                        {translate("Pay Now")}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </article>
                          </React.Fragment>
                          : ''
//                           <React.Fragment>
//                             <div className="container">
//                               <div className="row justify-content-md-center mb-3">
//                                 <div className="col col-lg-7 p-0 border border-1 bg-white">
//                                   <div className="card p-2" >
//                                     <div className="card-body pricing-column">
//                                       <h3 className="card-title text-white plan-header ">Monthly Subscription</h3>
//                                       <p className="card-text text-dark">
//                                         With every deal, you pay a small transaction fee (which varies with the category of your business). For a seamless and safe experience, Beldara will act as a link between sellers and buyers.
//                                       </p>
//                                       <div className="card-text">
//                                         Starting from :
//                                         <small><h5>{currency}</h5></small> <h3> {this.state.amount4} only</h3><small>(additional 5% on every transaction applied.*)</small>
//                                       </div>
//                                       <div className="radio-option text-center">
//                                         <input type="checkbox" name="payment-group" id="tnc" onClick={this.selectedTnc.bind(this)} />
//                                         <label htmlFor="tnc">By Subscribing, you agree to our
//                                           <u className="text-success modhover">
//                                             <a target="_blank" href="https://beldara.com/terms-and-condition.html">
//                                               Terms of Use 
//                                             </a>
//                                           </u>
//                                           and 
//                                           <u className="text-success modhover">
//                                             <a target="_blank" href="https://beldara.com/privacy-policy.html">
//                                                Privacy Policy.
//                                             </a>
//                                           </u></label>
//                                     </div>
//                                       <MonthlySub openLoginModal={this.openLoginModal} currency={currency} amount={this.state.amount4} package_id={this.state.packageid4} readTncThenBuy={this.readTncThenBuy} readTnc={this.state.readTnc} />
                                     
//                                      {this.state.tncerror == 1 &&
//                                       <div className="alert alert-danger"> Please select terms and condition option to proceed </div>
//                                       }
                                     
//                                       <p className="mt-4 text-dark">
//                                         When you can shell out upwards of 20K-50K INR for a shop/office, 999 INR (16.99 USD) is but a small price to pay for a global, online store that’s open 24/7.
//                                       </p>
//                                       <u>Features:</u>
//                                       <ul className="container">
//                                         <li className="p-1 border-0" style={{ display: 'list-item' }}>You will have unlimited product listing.</li>
//                                         <li className="p-1 border-0" style={{ display: 'list-item' }}>Your online store will be displayed in 127 countries</li>
//                                         <li className="p-1 border-0" style={{ display: 'list-item' }}>You will have offline and online support helpline</li>
//                                         <li className="p-1 border-0" style={{ display: 'list-item' }}>You will receive a detailed product performance report</li>
//                                         <li className="p-1 border-0" style={{ display: 'list-item' }}>You can converse with prospective customers in real-time.</li>
//                                       </ul>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="col-12 col-lg-5 p-0 border border-1 bg-white">
//                                   <div className="card p-4" style={{ boxShadow: 'none' }}>
//                                     <div className="card-body text-center">
//                                       <h3 className="card-title text-center">Reviews from around the world</h3>
//                                       {/* <p className="card-text">
//                                         What people say about us?
//                                       </p> */}
//                                       <div className="card-text">
//                                         <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
//                                           <ol className="carousel-indicators d-none">
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active" style={{ background: '#ccc' }}></li>
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="1" style={{ background: '#ccc' }}></li>
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="2" style={{ background: '#ccc' }}></li>
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="3" style={{ background: '#ccc' }}></li>
//                                           </ol>
//                                           <div className="carousel-inner">

//  <div className="carousel-item " style={{ background: '#fff', height: '300px' }}>
//  Being fairly new to the world of e-selling, I was a bit hesitant at first, and wasn’t sure which membership plan to choose. After some thought and discussion with the Beldara support staff, I decided to go for the Monthly Membership Plan, and I’m glad I did. It gave me a chance to explore my options and how to go about setting up my online store and work out the kinks. If you’re unsure which plan to choose, go for this one, guys! You won’t regret it, I promise! There are many features, and you have more flexibility as well with this option.
//  <p className="text-right">- Ms. Sandra Dwyer (Fresno, CA)</p>
//  </div>
//  <div className="carousel-item active" style={{ background: '#fff', height: '300px' }}>
//  Monthly plans are short and sweet, and give me the freedom to grow my new business. All the privileges in one small package!
//  <p className="text-right">- Mr. Dineshbhai Shah (Ahmedadbad, GJ)
//  </p>

//  </div>
//  <div className="carousel-item " style={{ background: '#fff', height: '300px' }}>
//  Hi all! I am Shirodkar and I have a family business of dry fruits. Somebody said to try selling online, there is good business here. So, I came to Beldara.com and took the monthly plan. I am very happy with this plan. It has been very helpful for my business. Actually a good start…. Good plans, good service! Will recommend to one and all.
//  <p className="text-right">- Mr. Shirodkar (Nagpur, MH)</p>

//  </div>
//  <div className="carousel-item " style={{ background: '#fff', height: '300px' }}>
//  This is a 5 star plan. Go for it. Don’t think too much. Nice benefits and good helpline staff.
//  <p className="text-right">- Mr. Vinayak Kanaskar (Aurangabad, MH)
//  </p>

//  </div>
//  </div>
//  <a className="carousel-control-prev d-none" href="#carouselExampleIndicators" role="button" data-slide="prev">
//  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//  <span className="sr-only">Previous</span>
//  </a>
//  <a className="carousel-control-next d-none" href="#carouselExampleIndicators" role="button" data-slide="next">
//  <span className="carousel-control-next-icon" aria-hidden="true"></span>
//  <span className="sr-only">Next</span>
//  </a>
//  </div>
//  </div>
//  </div>

//  </div>
//  </div>
//  </div>
//  </div>
//  <div className="container">
//  <div className="row">
//  <div className="col-md-12">

//  </div>
//  </div>
//  </div>
//  </React.Fragment>
 }


 <LoginPopUp
 footerData={this.footerData}
 login={this.state}
 openSignUpModal={this.openSignUpModal}
 closeModal={this.closeModal}
 />
 <SignUpPopUp
 footerData={this.footerData}
 signup={this.state}
 openLoginModal={this.openLoginModal}
 closeModal={this.closeModal}
 />
 </div>
 ) : (
 "Page is loading and packages will appear in a moment. If packages does not comes up, please reload the page"
 )
 }
 </div>
 </div>
 </div>
 ) : (
 <div className="jumbotron">
 <div className="row">
 {packageName ? (
 <div className="text-dark col-12 text-center">
 {subscription_id ? '' : <img src={`${ImgUrl}/stores/images/${packageName}.png`} />}
 <div className="h4">
 {packageName} {translate("Membership")}
 </div>
 </div>
 ) : (
 ""
 )}
 {StoreUrl ? (
 <div className="text-dark col-12 text-center">
 <a href={`${StoreUrl}.beldara.com`}>
 <img
 src={`${ImgUrl}/images/My Storefront.png`}
 alt={`StoreFront Beldara.com`}
 />
 </a>
 </div>
 ) : packageId <= 10 ? (
 <div className="text-dark col-12 text-center">
 <a href={`${SellerUrl}/store_create.html`}>
 {translate("Configure your Store")}
 </a>
 </div>
 ) : (
 ""
 )}

 <div className="col-6 text-left">
 <div>
 {" "}
 <b>{translate("Invoice Number")}:</b> {invoiceId}
 </div>
 <div>
 {" "}
 <b>{translate("Payment Date")}:</b> {paymentDate} UTC
 </div>
 {/* <div> <b>Valid Till:</b> {validity}</div> */}
 <div>
 {" "}
 <b>{translate("Payment Done")}:</b>{" "}
 <span className="text-success">{currencyOfPay} {packageAmount}</span>
 </div>
 <div className="">
 {
 subscription_status !== 'cancelling' &&
 subscription_id &&
 <u className="" style={{ cursor: 'pointer' }} onClick={() => this.setState({
 cancelModal: !this.state.cancelModal
 })} >Deactivate my account? </u> 
 
 }
 </div>

                </div>
                <div className="col-6 text-left">
                  { receiptPath &&
                  <div id="addis">
                    <a
                      target="_blank"
                      className="align_center"
                      href={`${ImgUrl}/${receiptPath}`}
                      download
                    >
                      <div className="text-center">
                        <img
                          className="reciept_img"
                          src={`${ImgUrl}/images/pdf.png`}
                        />
                      </div>
                      <div className="text-center">
                        <b>{translate("Receipt")}</b>
                      </div>
                    </a>
                  </div>
                  }
                </div>
                {
                  subscription_status === 'cancelling' &&
                      <div className="alert alert-warning">
                        Your request is pending for account deactivation.
                      </div>
                }
                {
                
                  this.state.cancelModal &&
                  <div className="col-12">
                    <div className="card">
                      <form className="" onSubmit={this.getMembership.bind(this)}>

 <div className="card-body">
 <fieldset id="checkArray">
 Reasons :
 <div className="form-check">
 <input
 className="form-check-input"
 type="checkbox"
 value="not Satisfied"
 name="chk[]"
 id="defaultCheck1"
 />
 <label className="form-check-label " for="defaultCheck1">
 I am not satisfied with Beldara.com
 </label>
 </div>
 <div className="form-check">
 <input
 className="form-check-input"
 type="checkbox"
 value="not interested"
 id="defaultCheck2"
 name="chk[]"
 />
 <label className="form-check-label " for="defaultCheck2">
 I am not interested now.
 </label>
 </div>
 
 </fieldset>
 <div className="">
 Remark:
 <textarea className="form-control" placeholder="Remark" name="remark"></textarea>
 </div>
 </div>
 <div className="card-footer">
 <button className="btn btn-danger" type="submit">
 Deactivate now
 </button>
 </div>
 </form>

 </div>
 </div>
 }

 </div>
 </div>
 )}
 </React.Fragment>
 );
 }
}

const mapStateToProps = state => {
 return state;
};

// export default connect(mapStateToProps)(Membership);
export default withTranslate(connect(mapStateToProps)(Membership));
