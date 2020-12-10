import React, { Component,Suspense,lazy } from "react";
import { Link } from "react-router-dom";
import ls from "local-storage";
import $ from "jquery";
import { SlideUpDown } from "../../../services/script";

import { withTranslate } from "react-redux-multilingual";
import { isEmail, subscribe,getCookie, setCookie } from "../../../functions";
import axios from 'axios'
import "./footer.css";

// To initialize allowed notification 
// import "../../firebase/cloud-messaging";

import LiveChat from "../../live-chat";
import store from "../../../store";
import { getLoggedIn, getCart,getCartLength } from "../../../actions";
import { ApiUrl } from "../../../constants/ActionTypes";
import { connect } from "react-redux";
const ChatBox = lazy(()=>import("../../live-chat/chatbox")) ;

var cname, target, source, mhinpbnb , url, productid,whole_url, cat, uri, mailid,send_source,sms_id,notification_id,referid; 

const LogoImage = lazy(()=>import('../headers/common/logo'))
const Online = lazy(()=>import("./online")) ;
class FooterOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValid: 1,
      messageList: [],  
      
      Tracking: null
      // askCountry: false
    };
    
    let search = window.location.search;
    let params = new URLSearchParams(search);
    referid = params.get('refid');
    if((getCookie('refid') === null || getCookie('refid') == 'null' ||  getCookie('refid') == '') && referid !== null && referid != ''){
      setCookie('refid',referid,'365');
    }
    cname = params.get('utm_campaign') ? params.get('utm_campaign') : params.get('campaign');
    target = params.get('utm_target') ? params.get('utm_target') : params.get('target');
    source = params.get('utm_source') ? params.get('utm_source') : params.get('source');
    send_source = params.get('send_source') ? params.get('send_source') : params.get('send_source');
    mailid = params.get('mailid');
    const m_central = params.get('m');
    const country = params.get('country');
    mhinpbnb = getCookie('mhinpbnb');
    cat = ls.get('q');
    url = window.location.pathname;
    productid = window.location.pathname;
    whole_url = window.location.href;
    if(send_source == 'notification'){
      notification_id = params.get('notification_id');
      axios
      .post(`${ApiUrl}/common/capture_notification_sms.php`,{send_source:send_source,security_token : '', plateform_type : '',notification_id:notification_id},{
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        console.log('notification api called successfully',55);
      })
      .catch(error => { 
        const result = error.response;
        return Promise.reject(result);
      });
    }
    else if(send_source == 'sms'){
      console.log(55,'api called in sms condition');
      sms_id = params.get('sms_id');
      axios
      .post(`${ApiUrl}/common/capture_notification_sms.php`,{send_source:send_source,security_token : '', plateform_type : '',sms_id:sms_id},{
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        console.log('sms api called successfully',70);
      })
      .catch(error => { 
        const result = error.response;
        return Promise.reject(result);
      });
    }else{
      
    }
    axios
      .post(`${ApiUrl}/common/capture_visitor.php`,{ m_central: m_central, sellerid: ls.get('sellerid'),security_token : '', plateform_type : '',mhinpbnb : mhinpbnb,url : url, productid:productid,whole_url:whole_url, cat:cat, uri:uri, cname:cname, target:target , source: source, mailid: mailid, country: getCookie('country_code') }, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        setCookie('mhinpbnb', response.data.result, '365');
      })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  }

  componentDidMount = async (nextProps) => {
    store.dispatch(getLoggedIn())
    // console.log('componentDidMount called');
    store.dispatch(getCartLength(ls.get('sellerid'),getCookie('mhinpbnb')));
    var contentwidth = window.innerWidth; 
    if (contentwidth < 750) {
      SlideUpDown("footer-title");
    } else {
      var elems = document.querySelectorAll(".footer-title");
      [].forEach.call(elems, function(elemt) {
        let el = elemt.nextElementSibling;
        el.style = "display: block";
      });
    }
    import('../../analytics').then(module => {
      this.setState({
        Tracking:module.default
      })
    })
    try {
      if (this.props.cartList.cart !== null && this.props.cartList.cart !== undefined) {
        if (this.props.cartList.cart.length == 0)
          store.dispatch(getCart(ls.get('sellerid'), getCookie('mhinpbnb') ,this.props.data.symbol))
      }
    } catch (e) {
      console.log('check cart: ',e)
    }

  }
  subscribeBtn = async e => {
    const email = $("#subsribeEmail").val();
    const isEmailValid = isEmail(email);
    if (isEmailValid) {
      const subscribeSeller = await subscribe(email, ls.get("sellerid"));
      if (subscribeSeller.statusId == 1)
        this.setState({
          emailValid: 3
        });
      else
        this.setState({
          emailValid: 2
        });
    } else {
      this.setState({
        emailValid: 0
      });
    }
  };

  
  render() {
    const { translate } = this.props;
    const {Tracking} = this.state
    // console.log(this.props.chat.chatToSeller.chatWithSupplier)
    return (
      <footer className="footer-light">

        <div className="light-layout">
          <div className="container">
            <section className="small-section border-section border-top-0">
              <div className="row">
                <div className="col-lg-6">
                  <div className="subscribe">
                    <div>
                      <h4>{translate("KNOW IT ALL FIRST")}</h4>
                      <p>
                        {translate(
                          "Never Miss Anything From Beldara By Signing Up To Our Newsletter"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <form className="form-inline subscribe-form">
                    {this.state.emailValid == 0 ? (
                      <div className="col-12 alert alert-danger">
                        Please enter valid Email
                      </div>
                    ) : this.state.emailValid == 2 ? (
                      <div className="col-12 alert alert-danger">
                        Something went wrong please try again
                      </div>
                    ) : this.state.emailValid == 3 ? (
                      <div className="col-12 alert alert-success">
                        You Have Subscribed Successfully!
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="form-group mx-sm-3">
                      <input
                        type="text"
                        className="form-control"
                        id="subsribeEmail"
                        placeholder={translate("Enter your email")}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-solid"
                      onClick={this.subscribeBtn}
                    >
                      {translate("Subscribe")}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
        <section className="section-b-space light-layout">
          <div className="container">
            <div className="row footer-theme partition-f">
              <div className="col-lg-4 col-md-6">
                <div className="footer-title footer-mobile-title">
                  <h4>{translate("Follow Us On")}</h4>
                </div>
                <div className="footer-contant">
                  <div className="footer-logo">
                    <Suspense fallback={''}>
                    <LogoImage logo={this.props.logoName} />
                    </Suspense>
                    
                  </div>
                  <ul>
                    <li>
                    {getCookie('country_code').toLowerCase() == 'in' || getCookie('country_code') == '' ?
                      <React.Fragment>
                        <i className="fa fa-phone mr-2" />
                      {translate("For Support")}: +91-9555788833
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <i className="fa fa-phone mr-2" />
                      {translate("For Support")}: +1-913-289-0433
                      </React.Fragment>
                        }
                    </li>
                  </ul>
       
                  <div className="footer-social">
                    <ul>
                      <li>
                        <a
                          target="_blank"
                          href="https://www.facebook.com/beldara"
                          rel="nofollow"
                        >
                          <i className="fa fa-facebook" aria-hidden="true" />
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          href="https://www.youtube.com/channel/UCntqaiLBDW1RgMIol6Pk34Q"
                          rel="nofollow"
                        >
                          <i className="fa fa-youtube" />
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          href="https://twitter.com/Beldara_India"
                          rel="nofollow"
                        >
                          <i className="fa fa-twitter" aria-hidden="true" />
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          href="https://www.instagram.com/beldaraonline/"
                          rel="nofollow"
                        >
                          <i className="fa fa-instagram" aria-hidden="true" />
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          href="https://in.pinterest.com/beldaraecom/"
                          rel="nofollow"
                        >
                          <i className="fa fa-pinterest" />
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          href="https://in.linkedin.com/company/beldara"
                          rel="nofollow"
                        >
                          <i className="fa fa-linkedin" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col offset-xl-1">
                <div className="sub-title">
                  <div className="footer-title">
                    <h4>{translate("How To Sell Fast")}</h4>
                  </div>
                  <div className="footer-contant">
                    <ul>
                      <li>
                        <Link
                          to={`/auction.html`}
                        >
                          {translate("Live E-Auction")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`${process.env.PUBLIC_URL}/how-to-sell-fast.html`}
                        >
                          {translate("How To Sell Fast")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`${
                            process.env.PUBLIC_URL
                          }/buy-now-on-beldara.html`}
                        >
                          {translate("Buy Now On Beldara")}
                        </Link>
                      </li>
                      <li>
                        <Link to={`${process.env.PUBLIC_URL}/membership.html`}>
                          {translate("Membership - B2B Marketing Plan")}
                        </Link>
                      </li>
                      <li>
                        <Link to={`${process.env.PUBLIC_URL}/banner-ads.html`}>
                          {translate("Banner Advertising")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`${
                            process.env.PUBLIC_URL
                          }/promot-your-business.html`}
                        >
                          {translate("Promote your business")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`${
                            process.env.PUBLIC_URL
                          }/beldara-logistics-services.html`}
                        >
                          {translate("Beldara Logistics Services")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/warehouse-services.html`}
                        >
                          {translate("Warehouse Services")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/trade-show.html`}
                        >
                          {translate("Trade Show")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* changed */}
              <div className="col">
                <div className="sub-title">
                  <div className="footer-title">
                    <h4>{translate("Help & support")}</h4>
                  </div>
                  <div className="footer-contant">
                    <ul>
                    <li>
                        <Link to={`${process.env.PUBLIC_URL}/contact.html`}>
                          {translate("Contact us")}
                        </Link>
                      </li>
                      <li>
                        <Link to={`${process.env.PUBLIC_URL}/partner-with-us.html`}>
                          {translate("Partner With Us")}
                        </Link>
                      </li>
                      <li>
                        <Link to={`${process.env.PUBLIC_URL}/faq.html`}>
                          {translate("FAQ")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`${process.env.PUBLIC_URL}/stay-safe-on-beldara.html`}
                        >
                          {translate("Stay Safe On Beldara")}
                        </Link>
                      </li>
                      
                      {/* <li >
                      <a target="_blank" rel="noopener noreferrer" className="mouse_pointer" href="https://img.beldara.com/about_img/Beldara-product-listing-guideline.pdf">{translate("Product Listings Guideline")}</a>
                      </li> */}
                      <li>
                        <Link
                          to={`${
                            process.env.PUBLIC_URL
                          }/product-listing-guidelines.html`}
                        >
                          {translate("Product Listings Guideline")}
                        </Link>
                      </li>
                      <li>
                        {/* <Link to= ></Link> */}
                        <a
                          href={`${process.env.PUBLIC_URL}/blog`}
                          target="_blank"
                        >
                          {translate("Blog")}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="sub-title">
                  <div className="footer-title">
                    <h4>{translate("About US")}</h4>
                  </div>
                  <div className="footer-contant">
                    {/* <ul className="contact-list"> */} 
                    <ul>
                      <li>
                        <a target="_blank" className="mouse_pointer" href={`http://khandekargroup.com/`}>
                          {'Khandekar Group'}
                        </a>
                      </li>
                      <li>
                        <Link to={`${process.env.PUBLIC_URL}/about.html`}>
                          {translate("About US")}
                        </Link>
                      </li>
                      <li>
                        <Link to={`${process.env.PUBLIC_URL}/career.html`}>
                          {translate("Career")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`${
                            process.env.PUBLIC_URL
                          }/terms-and-condition.html`}
                        >
                          {translate("Terms & Conditions")}
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          to={`${process.env.PUBLIC_URL}/privacy-policy.html`}
                        >
                          {translate("Privacy Policy")}
                        </Link>
                      </li> */}
                      <li>
                        <Link to={`${process.env.PUBLIC_URL}/Sitemap.html`}>
                          {translate("Sitemap")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`${process.env.PUBLIC_URL}/media-release.html`}
                        >
                          {translate("Media Release")}
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          to={`${process.env.PUBLIC_URL}/return-policy.html`}
                        >
                          {translate("Return Policy")}
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          to={`${
                            process.env.PUBLIC_URL
                          }/policies.html`}
                        >
                          {translate("Beldara Policies")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="sub-footer ">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-md-6 col-sm-12">
                <div className="footer-end">
                  <p>

                    <i className="fa fa-copyright" aria-hidden="true" /> 2018-2020
                    Beldara.com. {translate("All copyright reserved")}.
                  </p>
                </div>
              </div>
              <div className="col-xl-6 col-md-6 col-sm-12">
                <div className="payment-card-bottom d-none">
                  <ul>
                    <li>
                      <a href="#" className="visabg">
                        {/* <img src={`${process.env.PUBLIC_URL}/assets/images/icon/visa.png`} alt="beldara.com" /> */}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img
                          src={`${
                            process.env.PUBLIC_URL
                          }/assets/images/icon/mastercard.png`}
                          alt="beldara.com"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img
                          src={`${
                            process.env.PUBLIC_URL
                          }/assets/images/icon/paypal.png`}
                          alt="beldara.com"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img
                          src={`${
                            process.env.PUBLIC_URL
                          }/assets/images/icon/american-express.png`}
                          alt="beldara.com"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img
                          src={`${
                            process.env.PUBLIC_URL
                          }/assets/images/icon/discover.png`}
                          alt="beldara.com"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
   
        {/* <LiveChat /> */}
        {
          window.location.pathname.split('/')[1] !== 'product' ? 
          <Suspense loading={''}>
            {/* <ChatBox chatWithSupplier={this.props.chat.chatToSeller.length>0 ? this.props.chat.chatToSeller : false}/> */}
            <Online/> 
          </Suspense>
          : ''
        }
        {Tracking ? <Tracking /> : ''}

      </footer>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default withTranslate(connect(
  mapStateToProps
)(FooterOne))

//export default withTranslate(FooterOne);