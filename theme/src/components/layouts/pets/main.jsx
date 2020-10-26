import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import "../../common/index.scss";
import Slider from "react-slick";
import { withTranslate } from "react-redux-multilingual";
import $ from "jquery";
// Import custom components
// import Collection from "./collection"
import LogoBlock from "../common/logo-block";
// import BlogSection from "../common/blogsection";
import HeaderThree from "../../common/headers/header-three";
import ls from "local-storage";

import {
  getAllBanners,
  getAllLP,
  getAllBrands,
  addToCart,
  addToWishlist,
  addToCompare,
  getAllTM,
  getAllProducts,
  clearState,
} from "../../../actions";
// import { getBanners} from '../../../services'
import LazyLoad from "react-lazy-load";
// import ReqCollection from '../common/reqCollection';
import store from "../../../store";
import axios from "axios";
import { imgUrl } from "../../../constants/variable";
import { isMobile, isAndroid } from "react-device-detect";
import Modal from "react-bootstrap/Modal";
import {
  setCookie,
  getCookie,
  UpdateCategoryDashboard,
} from "../../../functions";
import "./mainpage.css";

import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import Axios from "axios";

//axios
// import FooterOne from '../../common/footers/footer-one';
//Translate
var langDomain, domain_language_code, data_suggestion, productid, inter;
const Collection = lazy(() => import("./collection"));
const BlogSection = lazy(() => import("../common/blogsection"));
const FooterOne = lazy(() => import("../../common/footers/footer-one"));
const ShippingDetails = lazy(() => import("../../shippingDetails"));
const HomeCategoryProduct = lazy(() =>
  import("../common/home-category-product")
);
const PostRequirementModal = lazy(() => import("../../postRequirement"));

const AllowNotifcationPopup = lazy(() =>
  import("../../common/notification-popup")
);

function getSuggestionValue(suggestion) {
  return `${suggestion.name}~${suggestion.id}`;
}

function renderSuggestion(suggestion, { query }) {
  const matches = AutosuggestHighlightMatch(suggestion.name, query);
  const parts = AutosuggestHighlightParse(suggestion.name, matches);

  return (
    <span>
      {parts.map((part, index) => {
        const className = part.highlight
          ? "react-autosuggest__suggestion-match"
          : null;

        return (
          <span className={className} key={index}>
            {part.text}
          </span>
        );
      })}
    </span>
  );
}

class Pets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // banners:[],
      languages: [],
      topProducts: [],
      recommended_product: "",
      top_product: "",
      recent_search: "",
      isAndroidAppOpen: false,

      SellerFlowOpen: false,
      suggestions: [],
      value: "",
      id: null,
      openPostRequirementModal: false,
      allowNotifcationPopup: false,
    };
    // this.getBanners = this.getBanners.bind(this);
    // Translate from English (default) to Spanish (specified)
    // const foo = translate('Hello world', 'es');
    // console.log(foo)
    var hostname = window.location.hostname;
    // if (hostname === undefined || hostname == '')
    // hostname = "hindi.beldara.com";
    langDomain = hostname.split("beldara.com")[0];
    langDomain = langDomain.replace(".", "");
    store.dispatch(clearState());
  }

  getAction = (is_runable, componentClass) => {
    if (is_runable == 0) {
      $("." + componentClass)
        .removeClass("d-none")
        .addClass("d-none");
    } else {
      $("." + componentClass).removeClass("d-none");
      if (componentClass == "recent_search" && this.state.recent_search == "") {
        this.setState({
          recent_search: componentClass,
        });
      } else if (
        componentClass == "recommended_product" &&
        this.state.recommended_product == ""
      ) {
        this.setState({
          recommended_product: componentClass,
        });
      } else if (
        componentClass == "top_product" &&
        this.state.top_product == ""
      ) {
        this.setState({
          top_product: componentClass,
        });
      }
    }
  };

  componentDidMount() {
    this.checkUSer();
    this.DeviceInfo();
    //this.DeviceInfo();
    store.dispatch(getAllLP());
    store.dispatch(getAllBrands());
    store.dispatch(getAllTM());
    this.props.languageMaster.forEach((element) => {
      if (element.main_language.toLowerCase() == langDomain.toLowerCase())
        domain_language_code = element.code;
    }, this);
    if (domain_language_code !== "" && domain_language_code !== undefined) {
      store.dispatch(getAllBanners(domain_language_code));
    } else {
      store.dispatch(getAllBanners("en"));
    }
    try {
      let query = "mens-wear-clothing-accessorie-manufacturers.html"
        .split("/")
        .pop();
      axios
        .post(
          "https://api.beldara.com/common/get_lp_detail.php",
          {
            url: query,
            sellerid: ls.get("sellerid"),
            security_token: "",
            plateform_type: "",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(async (response) => {
          await this.setState({
            catBanner: response.data.result.page_img,
            catName: response.data.result.page_name,
            catDesc: response.data.result.desc1,
            cat_id: response.data.result.cat_id,
            keyword: response.data.result.keyword,
          });
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });

      // console.log(this.state.cat_id)
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
    this.SellerFlow();
    // this.showPostRequirementPopup();
  }

  componentWillMount() {
    window.addEventListener("load", this.showPostRequirementPopup);
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.showPostRequirementPopup);
  }

  // DeviceInfo = () => {
  // if (isMobile) {
  // this.OpenAndroidApp();
  // }else{
  //
  // }
  // }

  // OpenAndroidApp = () => {
  // this.setState({
  // isAndroidAppOpen: !this.state.isAndroidAppOpen
  // })
  // }

  askToSearch = () => {
    if (window.innerWidth < 1200) {
      $(".mobile-search")
        .find("div")
        .find(".fa-search")
        .click();

      var pholder = setInterval(function name(params) {
        $(".react-autosuggest__input")
          .attr("placeholder", "Search product to auction")
          .focus();
        clearInterval(pholder);
      }, 1000);

      var cholder = setInterval(function name(params) {
        $(".react-autosuggest__input")
          .attr("placeholder", "What are you looking for...")
          .blur();
        clearInterval(cholder);
      }, 8000);
    } else {
      $("html, body").animate({ scrollTop: 0 }, "fast");
      $(".light-box-auction-step").removeClass("d-none");
      $(".form_search").css("box-shadow", "0 1px 15px 5px #00aeee");
      $(".react-autosuggest__input")
        .attr("placeholder", "Search product to auction")
        .focus();
    }
  };

  componentDidUpdate() {
    // console.log('main , componentDidUpdate', this.props)
  }

  removeSearch = () => {
    //$('.mobile-search').find('div').find('.fa-search').click();
    $(".react-autosuggest__input").removeAttr("placeholder");
    $(".light-box-auction-step").addClass("d-none");
    $(".form_search").css("box-shadow", "");
    $(".react-autosuggest__input")
      .attr("placeholder", "What are you looking for...")
      .blur();
  };

  checkUSer = () => {
    if (getCookie("chk_user") != "1") {
      if (getCookie("mhinpbn")) {
        try {
          axios
            .post(
              "https://api.beldara.com/common/check_user.php",
              { type: "chk_user", sellerid: getCookie("mhinpbn") },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(async (response) => {
              //console.log("-- check user --",response.data.result);
              await setCookie("chk_user", "1", "365");
            })
            .catch((error) => {
              const result = error.response;
              return Promise.reject(result);
            });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }
      }
    }
  };
  DeviceInfo = () => {
    if (isMobile) {
      if (isAndroid) {
        let newDate = new Date();
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let TodayDate = date + "/" + month + "/" + year;

        let SetDate = getCookie("TodayDate");
        if (SetDate != "") {
          if (SetDate == TodayDate) {
            this.OpenAndroidApp();
          } else {
            setCookie("TodayDate", TodayDate, "1");
            setCookie("MobileAppPopup", 1, "1");
            this.OpenAndroidApp();
          }
        } else {
          setCookie("TodayDate", TodayDate, "1");
          setCookie("MobileAppPopup", 1, "1");
          this.OpenAndroidApp();
        }
      } else {
      }
    } else {
    }
  };

  OpenAndroidApp = () => {
    let SetMobileAppPopup = getCookie("MobileAppPopup");
    if (SetMobileAppPopup == "1") {
      setCookie("MobileAppPopup", 2, "1");
      this.setState({
        isAndroidAppOpen: !this.state.isAndroidAppOpen,
      });
    } else if (SetMobileAppPopup == "2") {
      setCookie("MobileAppPopup", 3, "1");
      this.setState({
        isAndroidAppOpen: !this.state.isAndroidAppOpen,
      });
    }
  };

  SellerFlow = () => {
    if (getCookie("mhinpbn")) {
      let newDate = new Date();
      let date = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let TodayFlowDate = date + "/" + month + "/" + year;

      let SetFlowDate = getCookie("TodayFlowDate");
      let sellerid = getCookie("mhinpbn");
      if (SetFlowDate != TodayFlowDate) {
        setCookie("TodayFlowDate", TodayFlowDate, "1");
        try {
          axios
            .post(
              "https://api.beldara.com/common/check_user_type.php",
              { type: "chk_user", sellerid: getCookie("mhinpbn") },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(async (response) => {
              if (response.data.result[0].id == "1") {
                window.open(
                  "https://seller.beldara.com/potential-buyer.php",
                  "_blank"
                );
                setCookie("mhinpbn", getCookie("mhinpbn"), "365");
              } else if (response.data.result[0].id == "2") {
                this.setState({
                  SellerFlowOpen: true,
                });
              }
            })
            .catch((error) => {
              const result = error.response;
              return Promise.reject(result);
            });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }
      }
    }
  };

  onChangedropdown1 = (event, { newValue, newId, method }) => {
    var split_value = newValue.split("~");
    this.setState({
      value: split_value[0],
      productid: "",
      id: parseInt(split_value[1]),
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    let userData = {
      term: value,
    };
    productid = "";
    userData = JSON.stringify(userData);
    let formData = new FormData();
    formData.append("term", userData);
    // console.log(formData,value);
    Axios.post("https://api.beldara.com/common/get_categories.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // console.log(response);
        let data = response.data.result.map((result) => {
          return {
            name: `${result.name}`,
            id: `${result.id}`,
          };
        });

        data_suggestion = response.data.result.map((result) => {
          return {
            name: `${result.name}`,
            id: `${result.id}`,
          };
        });
        this.setState({
          suggestions: data,
        });
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

  updateCategory = async (e) => {
    e.preventDefault();
    $("#spinnerID").removeClass("d-none");
    if (this.state.id) {
      await UpdateCategoryDashboard(
        getCookie("mhinpbn"),
        this.state.id,
        e
      ).then((res) => {
        try {
          if (res == true) {
            $("#m_success").removeClass("d-none");
            $("#spinnerID").addClass("d-none");
            setTimeout(() => {
              this.setState({ SellerFlowOpen: !this.state.SellerFlowOpen });
              window.open(
                "https://seller.beldara.com/potential-buyer.php",
                "_blank"
              );
              setCookie("mhinpbn", getCookie("mhinpbn"), "365");
            }, 2000);
          } else {
            $("#err").removeClass("d-none");
            $("#spinnerID").addClass("d-none");
            setTimeout(() => {
              this.setState({ SellerFlowOpen: !this.state.SellerFlowOpen });
            }, 2000);
          }
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }
      });
    } else {
      $("#spinnerID").addClass("d-none");
      $("#err_cate").removeClass("d-none");
    }
  };
  //Opening Signup modal
  openSignUpModal = () => {
    this.setState({
      signup: true,
      login: false,
    });
  };
  //Opening Login modal
  openPostRequirementModal = () => {
    this.setState({
      openPostRequirementModal: true,
    });
  };
  // Close Modal
  closePostRequirementModal = () => {
    setCookie("postPopup", "1", "1");
    this.setState({
      openPostRequirementModal: false,
    });
    this.notifcationPopup();
  };
  // open notification modal
  openNotificationModal = () => {
    this.setState({
      allowNotifcationPopup: true,
    });
  };
  // close notification modal
  closeNotificationModal = () => {
    setCookie("NotiPopup", "1", "1");
    this.setState({
      allowNotifcationPopup: false,
    });
  };

  showPostRequirementPopup = async () => {
    console.log("page loaded", 473);
    var current_date = new Date();
    var current_day = current_date.getDate();
    var current_month = current_date.getMonth() + 1;
    var current_year = current_date.getFullYear();
    var current_format_date =
      current_day + "/" + current_month + "/" + current_year;
    var check_cookie_with_this_date = getCookie("current_date");
    if (check_cookie_with_this_date == current_format_date) {
    } else {
      setCookie("current_date", current_format_date, "1");
      setCookie("postPopup", "0", "1");
    }
    if (getCookie("postPopup") == "0") {
      // window.addEventListener('load', function () {
      // console.log('page loaded',473);
      inter = setInterval(() => {
        if (
          getCookie("country_code") != "" &&
          getCookie("countryid") != "" &&
          getCookie("country_code") != null &&
          getCookie("countryid") != null
        ) {
          // this.setState({
          //   openPostRequirementModal:true
          // })
          this.notifcationPopup();
          clearInterval(inter);
        }
      }, 10000);
      // }.bind(this));
    } else if (getCookie("postPopup") == "1") {
      // console.log('notifcationPopup called',473);
      // this.notifcationPopup()
    }
  };

  notifcationPopup = async () => {
    var current_date = new Date();
    var current_day = current_date.getDate();
    var current_month = current_date.getMonth() + 1;
    var current_year = current_date.getFullYear();
    var current_format_date =
      current_day + "/" + current_month + "/" + current_year;
    var check_cookie_with_this_date = getCookie("current_date_for_noti");
    if (check_cookie_with_this_date == current_format_date) {
    } else {
      setCookie("current_date_for_noti", current_format_date, "1");
      setCookie("NotiPopup", "0", "1");
    }
    if (getCookie("NotiPopup") == "0") {
      this.setState({
        allowNotifcationPopup: true,
      });
    }
  };

  render() {
    var settings = {
      dots: true,
      infinite: true,
      autoplay: true,
      speed: 100,
    };

    const { banners, brands } = this.props.banners;
    const { translate } = this.props;
    const { recent_search, top_product, recommended_product } = this.state;

    const { value, suggestions } = this.state;
    const InputProps = {
      placeholder: "",
      value,
      data: "s",
      onChange: this.onChangedropdown1,
      name: "category_name",
      id: "category_name",
      required: true,
    };

    return (
      <div>
        <HeaderThree logoName={"logo/beldara_logo.png"} />

        <div className="">
          <div
            className="d-none light-box-auction-step"
            onClick={() => this.removeSearch()}
          ></div>
          <section className="p-0 small-slider">
            <Slider {...settings} className="slide-1 home-slider">
              {banners.slice(0, 11).map((item) => (
                <div key={item.title}>
                  {item.link != "" ? (
                    <a href={item.link} target={"_blank"}>
                      <div
                        className="home lazyload"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                    </a>
                  ) : (
                    <div
                      className="home lazyload"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                  )}
                </div>
              ))}
            </Slider>
          </section>

          {/*Buy Lead & Post Req*/}
          <div className="container">
            <div className="row mt-2 mb-2 ">
              <a
                href="/auction.html"
                className="col-6 border border-danger card flex-md-row shadow-none px-2"
              >
                <i className="fa fa-gavel text-danger flex-auto align-self-center d-none d-lg-block"></i>
                <div className="card-body d-flex flex-column align-items-start justify-content-center p-1">
                  <div className="d-inline-block text-danger font-weight-light">
                    {translate("Lead Auction")}
                  </div>
                </div>
              </a>
              <a
                href="/post-requirement.html"
                className="col-6 border border-danger card flex-md-row shadow-none px-2"
              >
                <i className="fa fa-bullhorn text-danger fa-lg card-img-right flex-auto align-self-center d-none d-lg-block"></i>
                {/* <i className="fa fa-bullhorn text-danger fa-lg card-img-right flex-auto align-self-center d-none d-lg-block"></i> */}
                <div className="card-body d-flex flex-column align-items-start justify-content-center p-1">
                  <div className="d-inline-block text-danger font-weight-light">
                    {translate("Post Requirement")}
                  </div>
                </div>
              </a>
              <div className="clearfix"></div>
            </div>
          </div>
          {/*Buy Lead & Post Req*/}

          {/*Landing Page Top New*/}
          <section className="pt-2 banner-6 ratio2_1">
            <div className="container">
              <div className="row partition3">
                <div className="col-md-4 mt-2">
                  <a href={"/auction.html"}>
                    <div className="collection-banner p-left">
                      <div className="img-part">
                        <img
                          src={`${imgUrl}/images/lpnew/start_bidding.jpg`}
                          className="img-fluid blur-up lazyload bg-img"
                          alt={"Beldara E-auction"}
                        />
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-4 mt-2">
                  <a href={"/bpp.html"}>
                    <div className="collection-banner p-left">
                      <div className="img-part">
                        <img
                          src={`${imgUrl}/images/lpnew/Sponsered_Products.png`}
                          className="img-fluid blur-up lazyload bg-img"
                          alt={"Beldara Bran Promo Product"}
                        />
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-4 mt-2">
                  <a href={"/trade-show.html"}>
                    <div className="collection-banner p-left">
                      <div className="img-part">
                        <img
                          src={`${imgUrl}/images/lpnew/EXIBITION_Final.jpg`}
                          className="img-fluid blur-up lazyload bg-img"
                          alt={"Trade Show beldara"}
                        />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/*Banner Section End Top New*/}

          {/*Landing Page*/}
          <section className="pt-2 banner-6 ratio2_1">
            <div className="container">
              <div className="row partition3">
                {this.props.lp.lp.slice(0, 6).map((item) => (
                  <div className="col-md-4 mt-2" key={item.page_name}>
                    {/* <a href={"/lp/" + item.url}> */}
                    <a href={"/lp/" + item.url.toLowerCase()}>
                      <div className="collection-banner p-left">
                        <div className="img-part">
                          <img
                            src={`${item.thumb_img}`}
                            className="img-fluid blur-up lazyload bg-img"
                            alt={item.alt_title}
                          />
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/*Banner Section End*/}

          {/* {View Products} */}

          {/*Product Section*/}
          {/* <Collection type={'pets'} title="TOP Products" subtitle="Special Offer"/> */}

          <div className="christmas_offer">
            <div className="container">
              <div className="row" style={{ marginTop: "20px" }}>
                <div
                  className="home-category-header"
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    marginTop: "14px",
                  }}
                >
                  <h4 style={{ fontSize: "26px", float: "left" }}>
                    Handmade Gifts
                  </h4>
                  <span
                    className="home-category-info-header-line"
                    style={{
                      display: "block",
                      marginTop: "12px",
                      fontSize: "100%",
                      border: "3px solid #DCDEE3",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  ></span>
                </div>
                <div
                  className=""
                  style={{
                    width: "100%",
                    // height: '320px',
                    backgroundColor: "#fbf8f8",
                    border: "1px solid #eee",
                  }}
                >
                  {this.props.lp.lp.slice(6, 7).map((item, index) => (
                    <React.Fragment key={index}>
                      <div
                        className="home-category-info-banner d-none d-sm-block"
                        style={{
                          float: "left",
                          width: "20%",
                          maxWidth: "300px",
                          backgroundColor: "#eee",
                          height: "100%",
                          boxShadow: "#eeeeee 6px 0px 22px 11px",
                        }}
                      >
                        <a href={"/lp/" + item.url}>
                          <img
                            src={`${item.thumb_img}`}
                            className="img-fluid blur-up lazyload bg-img"
                            alt={item.thumb_img}
                            style={{ height: "100%" }}
                          />
                        </a>
                      </div>
                      <div className="home-category-info-detail">
                        <Suspense fallback={"Loading"}>
                          <HomeCategoryProduct
                            action={this.getAction}
                            cat_id={item.cat_id}
                            id={top_product}
                            type={"top_product"}
                            title={translate("TOP Products")}
                            subtitle={translate("Special Offer")}
                          />
                        </Suspense>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <img
              className="img-fluid mt-2 mouse_pointer"
              onClick={() => this.askToSearch()}
              src={`${imgUrl}/advt_banner/Beldara_E-auction-get-your-products-at-your-desired_price.png`}
              alt="Beldara E-auction get your products at your desired price"
            />
          </div>

          <div className="christmas_offer">
            <div className="container">
              <div className="row" style={{ marginTop: "20px" }}>
                <div
                  className="home-category-header"
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    marginTop: "14px",
                  }}
                >
                  <h4 style={{ fontSize: "26px", float: "left" }}>
                    Explore Men's Clothing
                  </h4>
                  <span
                    className="home-category-info-header-line"
                    style={{
                      display: "block",
                      marginTop: "12px",
                      fontSize: "100%",
                      border: "3px solid #DCDEE3",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  ></span>
                </div>
                <div
                  className=""
                  style={{
                    width: "100%",
                    // height: '320px',
                    backgroundColor: "#fbf8f8",
                    border: "1px solid #eee",
                  }}
                >
                  {this.props.lp.lp.slice(7, 8).map((item, index) => (
                    <React.Fragment key={index}>
                      <div
                        className="home-category-info-banner d-none d-sm-block"
                        style={{
                          float: "left",
                          width: "20%",
                          maxWidth: "300px",
                          backgroundColor: "#eee",
                          height: "100%",
                          boxShadow: "#eeeeee 6px 0px 22px 11px",
                        }}
                      >
                        <a href={"/lp/" + item.url}>
                          <img
                            src={`${item.thumb_img}`}
                            className="img-fluid blur-up lazyload bg-img"
                            alt={item.thumb_img}
                            style={{ height: "100%" }}
                          />
                          {/* <div className="contain-banner banner-3">
 <div>
 <h2>Clothes</h2>
 </div>
 </div> */}
                        </a>
                      </div>
                      <div className="home-category-info-detail">
                        <Suspense fallback={"Loading"}>
                          <HomeCategoryProduct
                            action={this.getAction}
                            cat_id={item.cat_id}
                            id={top_product}
                            type={"top_product"}
                            title={translate("TOP Products")}
                            subtitle={translate("Special Offer")}
                          />
                        </Suspense>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* post requirement model */}
          {/* <ReqCollection /> */}

          <div className="top_product d-none">
            <Suspense fallback={"Loading"}>
              <Collection
                action={this.getAction}
                id={top_product}
                type={"top_product"}
                title={translate("TOP Products")}
                subtitle={translate("Special Offer")}
              />
            </Suspense>
          </div>

          <div className="recommended_product d-none">
            <Suspense fallback={"Loading"}>
              <Collection
                action={this.getAction}
                id={recommended_product}
                type={"recommended_product"}
                title={"Recommended Product"}
              />
            </Suspense>
          </div>

          <div className="recent_search d-none">
            <Suspense fallback={"Loading"}>
              <Collection
                action={this.getAction}
                id={recent_search}
                type={"recent_search"}
                title={"Recent Search"}
              />
            </Suspense>
          </div>

          {/* <div className="wholesale_day">
 <Suspense fallback={'Loading'}>
 <Collection action={this.getAction} id="wholesale_day" type={'wholesale_day'} title={"Wholesale of The Day"}/>
 </Suspense>
 </div> */}
          {/*Product Section End*/}

          {/*Parallax banner*/}
          {
            // this.props.lp.lp[10].page_img !== undefined?
            // <section className="p-0 pet-parallax">
            // <div className="full-banner parallax parallax-banner19 text-center p-center" style={{backgroundImage:`url(${this.props.lp.lp[10].page_img})`}}>
            // <div className="container">
            // <div className="row">
            // <div className="col">
            // <div className="banner-contain">
            // <h4>{this.props.lp.lp[10].img_title}</h4>
            // {/* <h3>get upto 70% off</h3> */}
            // <p>{this.props.lp.lp[10].desc1}</p>
            // <a href="#" className="btn btn-solid black-btn" tabIndex="0">shop now</a>
            // </div>
            // </div>
            // </div>
            // </div>
            // {/* <div className="pet-decor">
            // <img src={`${process.env.PUBLIC_URL}/assets/images/dog.png`} alt="" className="img-fluid blur-up lazyload" />
            // </div> */}
            // </div>
            // </section>
            // :''
          }

          {/*Parallax banner end*/}

          {/*Product Slider*/}
          {/* <Collection type={'pets'} title="SAVE AND EXTRA" /> */}
          {/*Product Slider End*/}

          {/* Blog Section Section*/}
          {/* <LazyLoad debounce={false} offsetVertical={500}>
            <div className="container mt-5">
              <div className="row">
                <div className="col">
                  <div className="title1 title5">
                    <h4>{translate("Recent story")}</h4>
                    <h2 className="title-inner1">
                      {translate("What dear customer said about us")}
                    </h2>
                    <hr role="tournament6" />
                  </div>
                </div>
              </div>
            </div>
          </LazyLoad> */}
          {/* <section className="section-b-space p-t-0 ratio2_3">
            <Suspense fallback={""}>
              <BlogSection tm={this.props.tm} />
            </Suspense>
          </section> */}

          {/* Blog Section End*/}

          {/*Logo Block section*/}
          {/* <Collection /> */}
          <LazyLoad debounce={false} offsetVertical={500}>
            <LogoBlock
              type={"pets"}
              title={translate("Our suppliers")}
              subtitle={translate("TOP PROMOTIONAL BRANDS")}
              brands={brands}
            />
          </LazyLoad>
          {/*Logo Block section end*/}

          {/*Shopping Details section*/}
          <Suspense fallback={""}>
            <ShippingDetails title={translate("Our Features")} />
          </Suspense>
          {/*Shopping Details section end*/}

          {/* <ThemeSettings/> */}
          <Suspense fallback={""}>
            <FooterOne logoName={"logo/BelDara-logo.png"} />
          </Suspense>
        </div>
        {this.state.isAndroidAppOpen && (
          <Modal show={this.state.isAndroidAppOpen}>
            <Modal.Header>
              <Modal.Title></Modal.Title>
              <div class="col-12">
                <h5 className="text-center">Continue in Beldara.com App</h5>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div class="col-12">
                <h5
                  className="text-center"
                  style={{ marginTop: "1%", color: "" }}
                >
                  Open
                </h5>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-end">
              <div class="col-12">
                <h5
                  className="text-center"
                  onClick={() =>
                    this.setState({
                      isAndroidAppOpen: !this.state.isAndroidAppOpen,
                    })
                  }
                >
                  Cancel
                </h5>
              </div>
            </Modal.Footer>
          </Modal>
        )}
        {this.state.isAndroidAppOpen && (
          <Modal show={this.state.isAndroidAppOpen}>
            <Modal.Header>
              <Modal.Title></Modal.Title>
              <div class="col-12">
                <h5 className="text-center">Continue in Beldara.com App</h5>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div class="col-12">
                <a href="http://b4b.in/normal?id=0">
                  <h5
                    className="text-center"
                    style={{ marginTop: "1%", color: "#fb9944" }}
                  >
                    Open
                  </h5>
                </a>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-end">
              <div class="col-12">
                <h5
                  className="text-center"
                  style={{ color: "#24adee" }}
                  onClick={() =>
                    this.setState({
                      isAndroidAppOpen: !this.state.isAndroidAppOpen,
                    })
                  }
                >
                  Cancel
                </h5>
              </div>
            </Modal.Footer>
          </Modal>
        )}

        {isMobile
          ? this.state.SellerFlowOpen && (
              <Modal show={this.state.SellerFlowOpen} style={{ left: "0%" }}>
                <Modal.Header>
                  <Modal.Title></Modal.Title>
                  <div class="col-12">
                    <h5 className="text-center" style={{ color: "#24ADEE" }}>
                      Update your primary business category
                    </h5>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <form
                    action=""
                    id="cat_update"
                    onSubmit={this.updateCategory}
                  >
                    <div class="col-12">
                      <div
                        class="alert alert-warning d-none text-center"
                        role="alert"
                        id="err"
                      >
                        Something went wrong please try again later.
                      </div>
                    </div>

                    <div class="col-12">
                      <div
                        class="alert alert-warning d-none text-center"
                        role="alert"
                        id="err_cate"
                      >
                        Please select proper category.
                      </div>
                    </div>

                    <div class="col-12">
                      <div
                        class="alert alert-success d-none text-center"
                        role="alert"
                        id="m_success"
                      >
                        Category updated successfully.
                      </div>
                    </div>

                    <div class="col-12">
                      <div className="has-float-label my-3">
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
                          inputProps={InputProps}
                          className="form-control"
                          id="category_name"
                          style={{ width: "100%" }}
                        />
                        <label htmlFor="universalEmail">
                          Enter Your Primary Business Category
                        </label>
                      </div>
                    </div>
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-solid"
                        type="submit"
                        id="catogory_update"
                      >
                        <div
                          class="spinner-border d-none"
                          id="spinnerID"
                          style={{ width: "1rem", height: "1rem" }}
                        ></div>
                        &nbsp;Update
                      </button>
                    </div>
                    <br></br>
                  </form>
                </Modal.Body>
              </Modal>
            )
          : this.state.SellerFlowOpen && (
              <Modal show={this.state.SellerFlowOpen} style={{ left: "30%" }}>
                <Modal.Header>
                  <Modal.Title></Modal.Title>
                  <div class="col-12">
                    <h5 className="text-center" style={{ color: "#24ADEE" }}>
                      Update your primary business category
                    </h5>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <form
                    action=""
                    id="cat_update"
                    onSubmit={this.updateCategory}
                  >
                    <div class="col-12">
                      <div
                        class="alert alert-warning d-none text-center"
                        role="alert"
                        id="err"
                      >
                        Something went wrong please try again later.
                      </div>
                    </div>

                    <div class="col-12">
                      <div
                        class="alert alert-warning d-none text-center"
                        role="alert"
                        id="err_cate"
                      >
                        Please select proper category.
                      </div>
                    </div>

                    <div class="col-12">
                      <div
                        class="alert alert-success d-none text-center"
                        role="alert"
                        id="m_success"
                      >
                        Category updated successfully.
                      </div>
                    </div>

                    <div class="col-12">
                      <div className="has-float-label my-3">
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
                          inputProps={InputProps}
                          className="form-control"
                          id="category_name"
                          style={{ width: "100%" }}
                        />
                        <label htmlFor="universalEmail">
                          Enter Your Primary Business Category
                        </label>
                      </div>
                    </div>
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-solid"
                        type="submit"
                        id="catogory_update"
                      >
                        <div
                          class="spinner-border d-none"
                          id="spinnerID"
                          style={{ width: "1rem", height: "1rem" }}
                        ></div>
                        &nbsp; Update
                      </button>
                    </div>
                    <br></br>
                  </form>
                </Modal.Body>
              </Modal>
            )}
        <Suspense fallback={"Loading"}>
          <PostRequirementModal
            openmodal={this.openPostRequirementModal}
            closemodal={this.closePostRequirementModal}
            open={this.state}
          />
        </Suspense>
        <Suspense fallback={"Loading"}>
          <AllowNotifcationPopup
            openmodal={this.openNotificationModal}
            closemodal={this.closeNotificationModal}
            open={this.state}
          />
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  banners: state.banners,
  lp: state.lp,
  tm: state.tm,
  languageMaster: state.languageMaster.languageMaster,
});

export default withTranslate(
  connect(mapStateToProps, { addToCart, addToWishlist, addToCompare })(Pets)
);
// export default Pets;
