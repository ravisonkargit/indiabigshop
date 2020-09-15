import React, { Component } from "react";
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
  domainName;

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
      packageName1: "Diamond",
      packageName2: "Platinum",
      packageName3: "Gold",
      validity1: 12,
      validity2: 12,
      validity3: 12,
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
      ispremium: 0,
      signup: false,
      login: false,
      reload: 0,
      discount: 0,
      packageType: 0
    };
    result_from_package = "Failure";
    count = 0;
    domainName = window.location.hostname;
  }

  footerData = data => {
    if (data.modalChange)
      this.setState({
        signup: data.modal,
        login: data.modal
      });

    this.setState({
      reload: data.reload
    });

    if (data.reload.paymentModal) $(".razorpay-payment-button").click();
  };

  closeModal = () => {
    this.setState({
      login: false,
      signup: false
    });
  };

  openSignUpModal = () => {
    this.setState({
      signup: true,
      login: false
    });
  };

  openLoginModal = () => {
    this.setState({
      signup: false,
      login: true
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
        "https://api.beldara.com/common/static_page.php",
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
        "https://api.beldara.com/common/static_page.php",
        {
          security_token: "",
          plateform_type: "",
          langCode: "en",
          pageid: "15"
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
        .then(response => {
          // console.log('else');
          // console.log(response);
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
      //  console.log(premium);
      if (premium.message != 0 && premium.statusId != 0) {
        StoreUrl = premium.result[0].url;
        paymentDate = premium.result[0].payment_date;
        packageAmount = premium.result[0].amount;
        packageId = premium.result[0].package_id;
        invoiceId = premium.result[0].invoice_id;
        packageName = premium.result[0].pckg_name;
        receiptPath = premium.result[0].receipt_path;
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
      result_from_package = package_detail.result;
      // static way to set state
      if (currency == "INR") {
        this.setState({
          amount1: package_detail.data[2].amount,
          amount2: package_detail.data[1].amount,
          amount3: package_detail.data[0].amount,
          validity1: package_detail.data[2].validity,
          validity2: package_detail.data[1].validity,
          validity3: package_detail.data[0].validity,
          packageName1: package_detail.data[2].pckg_name,
          packageName2: package_detail.data[1].pckg_name,
          packageName3: package_detail.data[0].pckg_name,
          packageid1: package_detail.data[2].id,
          packageid2: package_detail.data[1].id,
          packageid3: package_detail.data[0].id
        });
      } else {
        this.setState({
          amount1: package_detail.data[5].amount,
          amount2: package_detail.data[4].amount,
          amount3: package_detail.data[3].amount,
          validity1: package_detail.data[5].validity,
          validity2: package_detail.data[4].validity,
          validity3: package_detail.data[3].validity,
          packageName1: package_detail.data[5].pckg_name,
          packageName2: package_detail.data[4].pckg_name,
          packageName3: package_detail.data[3].pckg_name,
          packageid1: package_detail.data[5].id,
          packageid2: package_detail.data[4].id,
          packageid3: package_detail.data[3].id
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
            validity1: package_detail.data[2].validity,
            validity2: package_detail.data[1].validity,
            validity3: package_detail.data[0].validity,
            packageName1: package_detail.data[2].pckg_name,
            packageName2: package_detail.data[1].pckg_name,
            packageName3: package_detail.data[0].pckg_name,
            packageid1: package_detail.data[2].id,
            packageid2: package_detail.data[1].id,
            packageid3: package_detail.data[0].id
          });
        } else {
          this.setState({
            amount1: package_detail.data[5].amount,
            amount2: package_detail.data[4].amount,
            amount3: package_detail.data[3].amount,
            validity1: package_detail.data[5].validity,
            validity2: package_detail.data[4].validity,
            validity3: package_detail.data[3].validity,
            packageName1: package_detail.data[5].pckg_name,
            packageName2: package_detail.data[4].pckg_name,
            packageName3: package_detail.data[3].pckg_name,
            packageid1: package_detail.data[5].id,
            packageid2: package_detail.data[4].id,
            packageid3: package_detail.data[3].id
          });
        }

        // for (const [key, value] of Object.entries(package_detail.data)){
        // if (value.currency == currency){
        // count++;
        // this.setState({
        // [`amount${count}`]:package_detail.data[key].amount,
        // [`validity${count}`]:package_detail.data[key].validity
        // }).bind(this);
        // console.log([`amount${count}`]);
        // console.log(this.state);
        // console.log(this.state.amount1);
        // }
        // }
      }
    }
  }

  isLoggedIn() { }



  render() {
    // console.log(translate('Choose your perfect plan'));
    const { translate } = this.props;

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
              <div className="col-xl-12 center-page">
                <div className="text-center">
                  <h4 className="mt-3">
                    {translate("Choose Your Perfect Plan")}
                  </h4>
                  <p>{currency}</p>

                  <div className="tab mb-3">
                    <button className={`btn ${this.state.packageType === 0 ? 'btn-primary' : 'btn-light'}`} onClick={() => this.setState({ packageType: 0 })}>Annual Package</button>
                    <button className={`btn ${this.state.packageType === 1 ? 'btn-primary' : 'btn-light'}`} onClick={() => this.setState({ packageType: 1 })}>Monthly Package</button>
                  </div>
                </div>
                {

                  result_from_package.toLowerCase() == "success" ? (
                    <div className="row m-t-50">
                      {
                        this.state.packageType === 0 ?
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
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate("Free Unlimited Business")}
                                  </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>25{" "}
                                    {translate("Product Promo Branding")}
                                  </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate("Company Logo")}
                                  </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate("Exclusive URL")}(Eg.
                                    Whopper.beldara.com)
                              </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate("Sub Account (different login id)")}
                                  </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate(
                                      "Product Performance Report (Click/ Views/ Area/ Suggestions)"
                                    )}
                                  </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate("Chat to Buyer")}
                                  </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate("Higher Visibility")}
                                  </li>
                                  <li className="d-block mb-1">
                                    <i className="fa fa-check text-success">&nbsp;</i>
                                    {translate("Chat to Live Buyer")}
                                  </li>
                                  <li className="d-block mb-1">
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
                          :
                          <React.Fragment>
                            <div className="container">
                              <div class="row justify-content-md-center">
                                <div class="col col-lg-4">
                                <div class="card" >
                                  <div class="card-body">
                                    <h3 class="card-title text-dark">Monthly Subscription</h3>
                                    <p class="card-text">
                                    With every deal, you pay a small transaction fee (which varies with the category of your business). For a seamless and safe experience, Beldara will act as a link between sellers and buyers. 
                                    </p>
                                    <p class="card-text">
                                      Starting from :
                                    <p><small><h5>{currency}</h5></small> <h3> 999 only</h3></p>
                                    </p>
                                    <p className="justify-content-center text-center">
                                      <button className="btn btn-primary">
                                        Choose Monthly Subscription
                                      </button>
                                    </p>
                                  </div>
                                  <ul class="list-group list-group-flush border-none">
                                    <p>Features:</p>
                                    <li class="list-group-item border-0">You will have unlimited product listing.</li>
                                    <li class="list-group-item border-0">Your online store will be displayed in 127 countries</li>
                                    <li class="list-group-item border-0">You will have offline and online support helpline</li>
                                    <li class="list-group-item border-0">You will receive a detailed product performance report</li>
                                    <li class="list-group-item border-0">You can converse with prospective customers in real-time.</li>
                                  </ul>
                                  
                                </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
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
                    <img src={`${ImgUrl}/stores/images/${packageName}.png`} />
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
                    <b>{translate("Payment Date")}:</b> {paymentDate}
                  </div>
                  {/* <div> <b>Valid Till:</b> {validity}</div> */}
                  <div>
                    {" "}
                    <b>{translate("Payment Done")}:</b>{" "}
                    <span className="text-success">{packageAmount}</span>
                  </div>
                </div>
                <div className="col-6 text-left">
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
                </div>
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
