import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ls from "local-storage"; 
import store from "../../../../store";
import { getUpdateUser, getAllCurrencyValue } from "../../../../actions";
import { changeCurrency } from "../../../../actions";
import { IntlActions, withTranslate } from "react-redux-multilingual";
import { sellerUrl } from "../../../../constants/variable";
import  Location  from "./geolocation";
import { getCookie, setCookie } from "../../../../functions";
import CountrySelector from "../../countrySelector";
import {isMobile} from 'react-device-detect';


var sellerid, langDomain, domain_language_code, hostname, country_name;
var language = "English";
class TopBarDark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "en",
      changeLanguageOnReload: 1,
      cartCount:0,
      askCountry: false,
      country_code: '',
      forceAsk: false,
      sellonbeldara: ''
    };
    sellerid = ls.get("sellerid");
    var hostname = window.location.hostname;
    // if (hostname === undefined || hostname == '')
    // hostname = "hindi.beldara.com";
    langDomain = hostname.split("beldara.com")[0];
    langDomain = langDomain.replace(".", "");
    //store.dispatch(getUpdateUser(sellerid));
    store.dispatch(getAllCurrencyValue())
  }

 

  async UNSAFE_componentWillMount() {
    if (this.state.changeLanguageOnReload == 1) {
      this.props.languageMaster.forEach(element => {
        if (element.main_language.toLowerCase() == langDomain.toLowerCase())
          domain_language_code = element.code;
      }, this);
      if (domain_language_code !== "" && domain_language_code !== undefined) {
        store.dispatch(IntlActions.setLocale(domain_language_code));
        // await store.dispatch(getAllBanners(domain_language_code))
      } else {
        store.dispatch(IntlActions.setLocale("en"));
        // await store.dispatch(getAllBanners("en"))
      }
      this.setState({
        changeLanguageOnReload: 0
      });
    }
  }

  componentDidMount = async () => {
    // console.log(this.props,60);
    if ( getCookie('currency') === undefined || getCookie('currency') == '' ){
      setCookie('currency','INR', 365);
    }

    if (getCookie('country_code') === undefined || getCookie('country_code') == '') {
      this.select_country(true, false)
    } else {
      await this.setState({
        askCountry: false,
        country_code: getCookie('country_code')
      })
    }
  }

  select_country = async (ask, force) => {

      await this.setState({
        askCountry: ask,
        forceAsk: force
      })
  }

  closeModal = async () => {
    await this.setState({
      askCountry: false,
      forceAsk: false
    })
  };
  
  currencyChanger(curr) {
    setCookie('currency',curr, 365);
    const resultOfCurrencyChanger = this.props.changeCurrency(curr);
  }

  UNSAFE_componentWillReceiveProps = async (nextProps) => {
  //  console.log('UNSAFE_componentWillReceiveProps called',95);
   this.props.changeCountryCode(getCookie('country_code'));
    if (this.state.sellonbeldara != '/business-listing.html' && (!ls.get('sellerid') || ls.get('sellerid')=='')){
      this.setState({
        sellonbeldara: '/business-listing.html'
      })
    }

    if (((getCookie('country_code') === undefined || getCookie('country_code') == '') && !this.state.askCountry)) {
      this.select_country(true, false)
    }
    
    if ( this.state.country_code != getCookie('country_code')) {
      this.setState({
        country_code: getCookie('country_code')
      })
    }

    if (country_name===undefined || country_name=='' || country_name != getCookie('country_name')){
      country_name = getCookie('country_name')
    }
    if (nextProps.cartList) {
      // console.log('next',124);
      this.setState({
        // cartCount: Object.keys(nextProps.cartList).length
        cartCount:nextProps.cartList
      })
    } else { 
      // console.log('no receive',124);
      this.setState({
        cartCount: 0
      })
    }
  }

  countrySelectorData = (data) => {
    this.setState({
      country_code: data,
      forceAsk: false
    })
    if (data) {
      if (data.toLowerCase() == 'in') {
        setCookie('currency', 'INR', 365)
        store.dispatch(changeCurrency('INR'))
      } else {
        setCookie('currency', 'USD', 365)
        store.dispatch(changeCurrency('USD'))
      }
    }

  }

  dataFromLocation = (code, country_name) => {

    this.setState({
      country_code: code,
      country_name: country_name,
      forceAsk: false
    })

    if (code) {
      if (code.toLowerCase() == 'in') {
        setCookie('currency', 'INR')
        store.dispatch(changeCurrency('INR'))
      }else {
        setCookie('currency', 'USD')
        store.dispatch(changeCurrency('USD'))
      }
      }
  }
  truncateText(Text){
    // if(Text.length > 5){
    //   return Text.substring(0,5) + '..';
    // }else{
    //   return Text
    // }
    if(Text.indexOf(' ') >= 0){
      var first_str = Text.split(' ')[0];
      // console.log(Text,first_str,Text.indexOf(' '),171,'truncateText');
        if(first_str.length > 10){
          return first_str.substring(0,10) + '..';
        }else{
          return first_str;
        }
    }else{
      if(Text.length > 10){
        return Text.substring(0,10) + '..';
      }else{
        return Text;
      }
    }
  }

  render() {
    // console.log(this.props,165);
    const { translate } = this.props;
    return (
      <div className="top-header top-header-dark3">
        <CountrySelector
          countrySelectorData={this.countrySelectorData}
          askCountry={this.state.askCountry}
          forceAsk={this.state.forceAsk}
          closeModal = {this.closeModal}
        />

        <input type="hidden" name="mobileh" id="mobileh" className="d-none" /> 
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="header-contact">
                <ul>
                  {/* <li>
                    <Link
                      to={`${process.env.PUBLIC_URL}/membership.html`}
                      className="text-white"
                    >
                      {translate("Membership ")}
                    </Link>
                  </li> */}
                  <li>
                    <a
                     href={`${sellerUrl+""+this.state.sellonbeldara}`}
                      className="text-white"
                    >
                      {translate("Sell On Beldara")}
                    </a>
                  </li>
                  {/* <li className="text-white">
                    {getCookie('country_code').toLowerCase() == 'in' || getCookie('country_code') == '' ?
                      <React.Fragment>
                        <i className="fa fa-phone text-white" aria-hidden="true" />
                        {translate("For Support")}: +91-9667682100
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <i className="fa fa-phone text-white" aria-hidden="true" />
                        {translate("For Support")}: +1-913-289-0433
                      </React.Fragment>
                        }
                  </li> */}
                  <li className="text-white">
                      {!isMobile ? <a href="/download-app.html" className="h6 text-white">Get App</a> : ''}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 text-right d-flex m-0">
              <ul className="header-dropdown">
                  {/* <li className="mobile-wishlist wishlist">
                    <a href="/wishlist.html" className="text-white">
                    <i className="text-white fa fa-heart"></i> Wishlist 
                    { (ls.get('sellerid'))?
                    <span className="badge wishlist_badge badge-info">{this.state.wishlistCount}</span>
                    :''}
                    </a>
                  </li> */}
                  <li className="mobile-wishlist cart">
                    <a href="/cart.html" className="text-white">
                    <i className="text-white fa fa-shopping-cart"></i> Cart 
                    {/* { (ls.get('sellerid'))? */}
                    <span className="badge cart_badge badge-info">
                      {/* {this.state.cartCount} */}
                      {this.props.cartList}
                      </span>
                    {/* :''} */}
                    </a>
                  </li>
                <li className="onhover-dropdown mobile-account text-white language">
                  <i className="text-white fa fa-language" aria-hidden="true" />

                  {this.props.languageMaster.forEach(item => {
                    if (
                      domain_language_code != "" &&
                      domain_language_code !== undefined
                    ) {
                      if (item.code == domain_language_code) {
                        language = item.language;
                      }
                    } else if (item.code == this.props.user.user.language) {
                      language = item.language;
                    }
                  }, this)}
                  {language}
                  <ul className="onhover-show-div">
                    {this.props.languageMaster.map(item => (
                      <li key={item.id}>
                        {/* <span onClick={this.changeLanguage} data-lng={item.code} >{item.language}</span> */}
                        <a
                          href={item.url + window.location.pathname}
                          //onClick={this.changeLanguage}
                          data-lng={item.code}
                        >
                          <small>{item.language}</small>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>  
                {/* currency */}

                { this.state.country_code ?
                  <li onClick={() => this.select_country(true, true)} className="onhover-dropdown mobile-account country text-white">
                    <i className="d-sm-block d-md-none d-block text-uppercase">{ this.state.country_code }</i>
                  <span className="text-uppercase">{ this.state.country_code }</span>
                </li>
                :''}

                <li className="onhover-dropdown mobile-account currency  text-white">
                  <i className="text-white fa fa-money" aria-hidden="true" />
                  <span className="currencyActive">{this.props.data.symbol}</span>
                  <ul className="onhover-show-div">
                    <li>
                      <span
                        onClick={() => this.currencyChanger("INR")}
                        data-currency="INR"
                      >
                        <small>Rupee (INR)</small>
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => this.currencyChanger("USD")}
                        data-currency="USD"
                      >
                       <small> US Dollar (USD)</small>
                      </span>
                    </li>
                  </ul>
                </li>
                {country_name? '':
               
                <Location dataFromLocation={this.dataFromLocation} />
                    }
                <li className="onhover-dropdown mobile-account text-white myAccount">
                  <i className="fa fa-user text-white" aria-hidden="true" />
                  {this.props.user.user.name
                    ? <span className="text-truncate">{this.truncateText(this.props.user.user.name)}</span>
                    : translate("My Account")}
                  {this.props.user.user.name ? (
                    <ul className="onhover-show-div">
                      <li>
                        <a
                          href="https://seller.beldara.com"
                          data-lng="en"
                         
                        >
                          <small>{translate("My dashboard")}</small>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/wishlist.html"
                          data-lng="en"
                        >
                          <small>{translate("Wishlist")}</small>
                          {/* <small>Wishlist</small> */}
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://msg.beldara.com"
                          data-lng="es"
                         
                        >
                          <small>{translate("Message Center")}</small>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/logout.html"
                          data-lng="es"
                        >
                          <small>{translate("Logout")}</small>
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul className="onhover-show-div">
                      <li>
                        <a
                          href="https://seller.beldara.com/login.html"
                          data-lng="en"
                          target="_blank"
                        >
                          <small>{translate("Login")}</small>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://seller.beldara.com/business-listing.html"
                          data-lng="es"
                          target="_blank"
                        >
                          <small>{translate("Sell On Beldara")}</small>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/wishlist.html"
                          data-lng="en"
                        >
                          <small>{translate("Wishlist")}</small>
                          {/* <small>Wishlist</small> */}
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// const mapStateToProps = (state) => ({
//     user : state.user,
//     lang : state.language
// })

const mapStateToProps = state => ({
  user: state.user,
  data: state.data,
  // cartList: state.cartList.cart
  cartList : state.cartLength.cartLength.count
  //languageMaster: state.languageMaster.languageMaster,
});

export default withTranslate(
  connect(
    mapStateToProps,
    { getUpdateUser, changeCurrency }
  )(TopBarDark)
);

// export default TopBarDark; //
