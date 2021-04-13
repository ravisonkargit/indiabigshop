import React, { Component, Suspense, lazy } from "react";
import { Link, NavLink } from "react-router-dom";
import { IntlActions } from "react-redux-multilingual";
import { withTranslate } from "react-redux-multilingual";
import store from "../../../store";
import { connect } from "react-redux";
import asyncComponent from "../../../AsyncComponent";
import {
  changeCurrency,
  getAllLanguages,
  getUpdateUser,
  getChatWithSupplier,
  getCartLength,
} from "../../../actions";
import { getCookie, setCookie } from "../../../functions";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import "./autosuggest.css";
import "./new_common.css";
import axios from "axios";
import ls from "local-storage";
import { ApiUrl } from "../../../constants/ActionTypes";
import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";
import Category from "./common/category";
// import './common/category.css'

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

var domain = window.location.hostname;
var lang = domain.split(".beldara.com")[0];

function getSuggestionValue(suggestion) {
  // console.log(suggestion);
  return suggestion;
  // return suggestion.name;
}

function renderSuggestion(suggestion, { query }) {
  console.log(suggestion ,"jhbfjhbfhjvb")
  console.log(suggestion)
  const matches = AutosuggestHighlightMatch
    ? AutosuggestHighlightMatch(suggestion.name, query)
    : "";
  const parts = AutosuggestHighlightParse
    ? AutosuggestHighlightParse(suggestion.name, matches)
    : "";
  // console.log(suggestion,parts);
  console.log(matches)
  return (
    <span>
      {parts.map((part, index) => {
        const className = part.highlight
          ? "react-autosuggest__suggestion-match"
          : null;
        const newClass = suggestion.type == 1 ? "text-danger" : "text-dark";
        return (
          <span className={`${className}`} key={index}>
            {part.text }
          </span>
        );
      })}
      {suggestion.type == 1 ? (
        <>
          <h6>In Seller</h6>
        </>
      ) : (
        ""
      )}
    </span>
  );
}
var cname, target, source, mhinpbnb, url, productid, whole_url, cat, uri;

const Autosuggest = asyncComponent(() =>
  import("react-autosuggest").then((module) => module.default)
);

const LogoImage = asyncComponent(() =>
  import("./common/logo").then((module) => module.default)
);

const TopBarDark = lazy(() => import("./common/topbar-dark"));
const SideBar = lazy(() => import("./common/sidebar"));
class HeaderThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      query: "",
      data: [],
      filteredData: [],
      value: "",
      suggestions: [],
      languages: [],
      changeCountry: "",
    };
    // this.myRef = React.createRef();
    this.textInput = React.createRef();
    this.openSearch = this.openSearch.bind(this);
    this.changeCountryCode = this.changeCountryCode.bind(this);
    let search = window.location.search;
    let params = new URLSearchParams(search);

    this.textInput = null;
    this.setTextInputRef = (element) => {
      this.textInput = element;
    };
    this.focusTextInput = () => {
      console.log(this.textInput, 84);
      if (this.textInput) this.textInput.focus();
    };

    // let mbo
    // if (params.get('mbo')) {
    //   mbo = params.get('mbo')
    //   setCookie('internal', '1',1)
    // } else if (params.get('mb')) {
    //   mbo = params.get('mb')
    //   setCookie('internal', '0', 1)
    // }
    // if (mbo) {
    //     mbo = mbo.split("-")[0];
    //     if (getCookie('mhinpbn') != mbo) {
    //       setCookie('mhinpbn', mbo, 365)
    //       store.dispatch(getUpdateUser(mbo))
    //     }
    // }

    let mbo;
    if (params.get("mb")) {
      mbo = params.get("mb");
      setCookie("internal", "0", 1);
    }
    if (mbo) {
      mbo = mbo.split("-")[0];
      if (getCookie("mhinpbn") != mbo) {
        setCookie("mhinpbn", mbo, 365);
        store.dispatch(getUpdateUser(mbo));
      }
    }

    cname = params.get("utm_campaign")
      ? params.get("utm_campaign")
      : params.get("campaign");
    target = params.get("utm_target")
      ? params.get("utm_target")
      : params.get("target");
    source = params.get("utm_source")
      ? params.get("utm_source")
      : params.get("source");

    if (
      source !== undefined &&
      source != "" &&
      source !== null &&
      source != "null"
    ) {
      setCookie("source", source, 30);
    }
    if (
      cname !== undefined &&
      cname != "" &&
      cname !== null &&
      cname != "null"
    ) {
      setCookie("cname", cname, 30);
    }
    if (
      target !== undefined &&
      target != "" &&
      target !== null &&
      target != "null"
    ) {
      setCookie("target", target, 30);
    }

    const country = params.get("country");
    if (country) {
      if (country.toLowerCase() == "us" || country.toLowerCase() == "usa") {
        setCookie("country_name", "United States of America", "365");
        setCookie("country_code", "US", "365");
        setCookie("countryid", "1", "365");
        setCookie("currency", "USD", "365");
        store.dispatch(changeCurrency("USD"));
      } else if (country.toLowerCase() == "in") {
        setCookie("country_name", "INDIA", "365");
        setCookie("country_code", "IN", "365");
        setCookie("countryid", "91", "365");
        setCookie("currency", "INR", "365");
        store.dispatch(changeCurrency("INR"));
      }
    }
  }

  onChange = (event, { newValue, method }) => {
    //console.log(typeof newValue);
    if (typeof newValue == "string") {
      // console.log(newValue.name)
      this.setState({
        value: newValue,
      });
      // console.log(newValue)
      if (event.button === 0) {
        // console.log(newValue.split(" ").join("+"))
        // window.location.href='/search?q='+newValue.split(" ").join("+")
      }
    } else if (typeof newValue == "object") {
      //  console.log(newValue,newValue.name);
      this.setState({
        value: newValue.name,
      });
      // console.log(newValue)
      if (event.button === 0) {
        // console.log(newValue.split(" ").join("+"))
        if (newValue.type == 0) {
          window.location.href =
            "/search?q=" + newValue.name.split(" ").join("+");
        } else if (
          newValue.type == 1 &&
          newValue.url != "null" &&
          newValue.url != ""
        ) {
          window.location.href = newValue.url;
        }
      }
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    let userData = {
      term: value,
    };
    userData = JSON.stringify(userData);
    let formData = new FormData();
    formData.append("data", userData);
    axios
      .post(
        "https://api.indiabigshop.com/common/search_universal_new.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        let data = response.data.result.map((result) => {
          return {
            name: `${result.name}`,
            type: `${result.type}`,
            url: `${result.url}`,
          };
        });
        this.setState({
          suggestions: data,
          // suggestions: getSuggestions(value)
        });
        console.log(this.state.suggestions, "uugug")

      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  /*=====================
         Pre loader
         ==========================*/
  componentDidMount() {
    store.dispatch(getAllLanguages());
    store.dispatch(getChatWithSupplier(false));
    // store.dispatch(getCartLength(ls.get('log_id'),getCookie('mhinpbnb')));
    this.focusTextInput();
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (number >= 300) {
      if (window.innerWidth < 576) {
        document.getElementById("sticky").classList.remove("fixed");
      } else document.getElementById("sticky").classList.add("fixed");
    } else {
      document.getElementById("sticky").classList.remove("fixed");
    }
  };

  changeLanguage(lang) {
    store.dispatch(IntlActions.setLocale(lang));
  }

  openNav = (e) => {
    e.preventDefault();
    var openmyslide = document.getElementById("mySidenav");
    if (openmyslide) {
      openmyslide.classList.add("open-side");
    }
  };
  openSearch() {
    document.getElementById("search-overlay").style.display = "block";
    this.focusTextInput();
    document.getElementById("search_query").focus();
  }

  closeSearch() {
    document.getElementById("search-overlay").style.display = "none";
  }
  changeCountryCode(val) {
    // console.log(val,229);
    this.setState({
      changeCountry: val,
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const { translate } = this.props;
    const btnsolidmb = {
      borderRadius: "4px",
      color: "#ffffff",
      letterSpacing: "0.05em",
      border: "2px solid #ff9944",
      borderRadius: "0.3rem",
      backgroundImage: "linear-gradient(30deg, #ff9944 50%, transparent 50%)",
      backgroundSize: "540px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "0",
      transition: "background 300ms ease-in-out",
      fontSize: "9px",
      lineHeight: "20px",
      textTransform: "uppercase",
      fontWeight: "700",
      padding: "0.200rem .27rem",
    };
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: translate("What are you looking for") + "...",
      value,
      onChange: this.onChange,
      name: "q",
      ref: this.setTextInputRef,
      id: "search_query",
    };
    // console.log(window.location.href,262,window.location);
    return (
      <div>
        <Helmet
          script={[
            {
              type: "application/ld+json",
              innerHTML: `window.yourObject = {"@context": "https://schema.org","@type": "WebSite","url": "https://www.beldara.com/","potentialAction": {"@type": "SearchAction","target": "https://beldara.com/search?q={search_term_string}","query-input": "required name=search_term_string"}};`,
            },
          ]}
        ></Helmet>
        <Helmet
          script={[
            {
              type: "application/ld+json",
              innerHTML: `{ "@context": "https://schema.org","@type": "Organization","name": "Beldara","legalName" : "Beldara.com","url": "https://beldara.com/","logo": "https://img.beldara.com/assets/images/beldaraLogo.png","foundingDate": "2014","founders": [{"@type": "Person","name": "Pradeep Khandekar"},{"@type": "Person","name": ""} ],"address": {"@type": "PostalAddress","streetAddress": "5014-5015-5016,1 Aerocity, Andheri - Kurla Rd Safed Pool Shivaji Nagar, Jarimari","addressLocality": "Saki Naka","addressRegion": "Mumbai","postalCode": "400072","addressCountry": "India"},"contactPoint": {"@type": "ContactPoint","contactType": "customer support","telephone": "[+91 9667682100]","Mobile": "[+1 (913) 289-0433]","email": "support@beldara.com"},"sameAs": [ "https://www.facebook.com/beldara/","https://www.instagram.com/beldaraonline/","https://in.linkedin.com/company/beldara","https://in.pinterest.com/beldaraecom/","https://twitter.com/Beldara_India"]};`,
            },
          ]}
        ></Helmet>
        {/* <!-- Hotjar Tracking Code for https://beldara.com --> */}
        <Helmet
          script={[
            {
              //type: "application/ld+json",
              innerHTML: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:2269125,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
            },
          ]}
        ></Helmet>

        {/* {(window.location.origin == 'https://en.beldara.com') ?
          <Helmet script={[{
            innerHTML: `(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:1726599,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
          }]}>
          </Helmet>
          :
          ''
        } */}
        {/* <header id="sticky" className="sticky header-2 header-6"> */}
        <header id="sticky" className="sticky">
          <div className="mobile-fix-option" />
          {/*Top Header Component*/}
          {/* <Suspense fallback={""}>
            {TopBarDark ? (
              <TopBarDark
                languageMaster={this.props.languageMaster}
                changeCountryCode={this.changeCountryCode}
                user={this.props.user}
              />
            ) : (
              ""
            )}
          </Suspense> */}
          {/* <TopBarDark /> */}
          {/* <Category/> */}
          <div className="container">
            {/* {(this.props.user.user && (window.location.href == "http://localhost:3000/" || window.location.href == "http://localhost:3000" || window.location.href == "https://uat.beldara.com/" || window.location.href == "http://uat.beldara.com" || window.location.href == "https://beldara.com/" || window.location.href == "http://beldara.com") && !isMobile) 
                    ? 
                       ((this.props.user.user.user_type == 'seller' || this.props.user.user.user_type == 'both') && (this.props.user.user.package_id == '0' || this.props.user.user.package_id == 'null')) 
                        ? 
                          <div className="row text-center">
                            <div className="col-lg-12">
                              <span>Sell more online!
                                    Now become a paid member & get connected with potential buyers.<a href="/membership.html"> Upgrade now </a></span>
                            </div>
                          </div>
                              : ''
                              : '' } */}
            <div className="row">
              <div className="col-sm-12">
                <div className="main-menu border-section border-top-0">
                  <div className="menu-left">
                    <div className={isMobile ? "navbar" : "addnewnavbar"}>
                      {/*Sidebar Component*/}
                      <a href="#" onClick={this.openNav} className="text-dark">
                        <div className="bar-style">
                          {" "}
                          <i
                            className="fa fa-bars sidebar-bar"
                            aria-hidden="true"
                          />
                        </div>
                      </a>
                      <Suspense fallback={""}>
                        {SideBar ? (
                          <SideBar
                            changeCountry={this.state.changeCountry}
                            user={this.props.user}
                          />
                        ) : (
                          ""
                        )}
                      </Suspense>
                    </div>
                    <div
                      className={`brand-logo layout2-logo ${
                        isMobile ? `ml-2` : ``
                      }`}
                    >
                      <LogoImage logo={this.props.logoName} />
                    </div>
                    {!isMobile ? (
                      <div className={`addnewnavbar`}>
                        <a href="#" className="text-dark">
                          <div className="bar-style">
                            {" "}
                            {/* <h4 id="main_cat_to_hover" className="main_cat_to_hover">Categories <i className="fa fa-caret-down" style={{fontSize:'15px'}}></i></h4> */}
                            <Category />
                          </div>
                        </a>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <form className="form_search" action="search" role="form">
                      {Autosuggest ? (
                        <Autosuggest
                          suggestions={suggestions}
                          onSuggestionsFetchRequested={
                            this.onSuggestionsFetchRequested
                          }
                          onSuggestionsClearRequested={
                            this.onSuggestionsClearRequested
                          }
                          getSuggestionValue={getSuggestionValue}
                          renderSuggestion={renderSuggestion}
                          inputProps={inputProps}
                          className="form_search x1"
                        />
                      ) : (
                        ""
                      )}
               
                      <button type="submit" className="btn-search">
                        <i className="fa fa-search" />
                      </button>
                    </form>
                    {/* {!isMobile ? <a href="/download-app.html" className="mx-3 h6"><img src="https://img.beldara.com/assets/images/mobile_icon_android1.png" /> Get App</a> : ''} */}
                  </div>

                  <span className="px-3 py-2 rounded" style={{backgroundColor:"#ff9944"}}>   
                    <a href={"/start-order.html"} className="text-dark">
                {/* <a href={"/start-order/"+ Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8) +".html"} className="text-white"> */}
                  {/* <a href="/cart.html" className="text-white"> */}
                    <i className="text-dark fa fa-shopping-cart"></i> Cart
                    {/* { (ls.get('sellerid'))? */}
                    <span className="badge cart_badge badge-info">
                      {/* {this.state.cartCount} */}
                      {this.props.cartList}
                    </span>
                    {/* :''} */}
                  </a></span>
                  <span>
                  <ul>
                <li className="onhover-dropdown mobile-account text-dark myAccount px-4 py-2 rounded" style={{backgroundColor:"#ff9944"}}>
                  <i className="fa fa-user text-dark" aria-hidden="true" />
                  {this.props.user.user.name ? (
                    <span className="text-truncate">
                      {this.props.user.user.name}
                    </span>
                  ) : (
                    translate("My Account")
                  )}
                  {this.props.user.user.name ? (
                    <ul className="onhover-show-div">
                      <li>
                        <a href="https://seller.indiabigshop.com" data-lng="en">
                          <small>{translate("My dashboard")}</small>
                        </a>
                      </li>
                      <li>
                        <a href="/wishlist.html" data-lng="en">
                          <small>{translate("Wishlist")}</small>
                          {/* <small>Wishlist</small> */}
                        </a>
                      </li>
                      <li>
                        <a href="https://msg.indiabigshop.com" data-lng="es">
                          <small>{translate("Message Center")}</small>
                        </a>
                      </li>
                      <li>
                        <a href="/logout.html" data-lng="es">
                          <small>{translate("Logout")}</small>
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul className="onhover-show-div">
                      <li>
                        <a
                          href="https://seller.indiabigshop.com/login.html"
                          data-lng="en"
                          target="_blank"
                        >
                          <small>{translate("Login")}</small>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://seller.indiabigshop.com/business-listing.html"
                          data-lng="es"
                          target="_blank"
                        >
                          <small>{translate("Sell On IndiaBigShop")}</small>
                        </a>
                      </li>
                      <li>
                        <a href="/wishlist.html" data-lng="en">
                          <small>{translate("Wishlist")}</small>
                          {/* <small>Wishlist</small> */}
                        </a>
                      </li>
                    </ul>
                  )}
                </li></ul>
                </span>
                </div>
              </div>
            </div>
            {this.props.user.user &&
            (window.location.href == "http://localhost:3000/" ||
              window.location.href == "http://localhost:3000" ||
              window.location.href == "https://uat.beldara.com/" ||
              window.location.href == "http://uat.beldara.com" ||
              window.location.href == "https://beldara.com/" ||
              window.location.href == "http://beldara.com") &&
            isMobile ? (
              (this.props.user.user.user_type == "seller" ||
                this.props.user.user.user_type == "both") &&
              (this.props.user.user.package_id == "0" ||
                this.props.user.user.package_id == "null") ? (
                <div className="row text-center">
                  <div className="col-lg-12">
                    <span>
                      Sell more online! Now become a paid member & get connected
                      with potential buyers.
                      <a href="/membership.html"> Upgrade now</a>
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
        </header>

        <div id="search-overlay" className="search-overlay">
          <div>
            <span
              className="closebtn mr-1"
              onClick={this.closeSearch}
              title="Close Overlay"
            >
              ×
            </span>
            <div className="overlay-content">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <form action="search" role="form">
                      <div className="form-group w-100">
                        {Autosuggest ? (
                          <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={
                              this.onSuggestionsFetchRequested
                            }
                            onSuggestionsClearRequested={
                              this.onSuggestionsClearRequested
                            }
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            className="form-control x2"
                            id="exampleInputPassword1"
                            type="search"
                            placeholder="What are you looking for..."
                            // ref={this.textInput}
                          />
                        ) : (
                          ""
                        )}
                        {/* <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Search a Product" ref={this.textInput}/> */}
                      </div>
                      <button type="submit" className="btn btn-primary">
                        <i className="fa fa-search" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  languageMaster: state.languageMaster.languageMaster,
  user: state.user,
  cartList: state.cartLength.cartLength.count,
});

export default withTranslate(connect(mapStateToProps)(HeaderThree));
