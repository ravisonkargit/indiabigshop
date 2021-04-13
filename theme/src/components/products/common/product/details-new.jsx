import React, { Component, lazy, Suspense } from "react";
import ls from "local-storage";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
import PriceCalc from "../../../collection/common/priceCalc";
import PriceCalcOffer from "../../../collection/common/priceCalcOffer";
import SimpleReactValidator from "simple-react-validator";
import NumberFormat from "react-number-format";
import GetPriceSelected from "./get-price-selected";
import LoginPopUp from "../../../loginPopUp";
import SignUpPopUp from "../../../signUpPopUp";
import { withRouter } from "react-router-dom";
import {
  getCookie,
  captureEvent,
  setCookie,
  NotifyMeFunction,
} from "../../../../functions";
import { imgUrl, apiUrl, betaApi } from "../../../../constants/variable";
// import StarReview from "./rating";
import StarReview from "../../../collection/common/rating";
import axios from "axios";
import {
  getAllCurrencyValue,
  getChatWithSupplier,
  getCartLength,
  getUpdateUser,
} from "../../../../actions";
import ReactPixel from "react-facebook-pixel";
import $, { get } from "jquery";
import ReactCSSTransitionGroup from "react-addons-css-transition-group"; // ES6
import TagManager from "react-gtm-module";
// import ReactGA from 'react-ga';
import LiveReq from "../../../liveReq";
import store from "../../../../store";
import OfferTimer from "./offer-timer";
import DetailsTopTabs from "../details-top-tab-test";
import "./product.css";
import ProductVariation from "./product-variation";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { isMobile } from "react-device-detect";
import ReactTooltip from "react-tooltip";
import { showToast } from "../../../../functions";

const ChatBox = lazy(() => import("../../../live-chat/chatbox"));

// import "./ratingStyle.css";

var id, realPath;
// var priceCond = 0;
var price,
  eachunit = 0;
var currency = "INR";
function priceCond(item, ele, deliverable, pincode) {
  // console.log(deliverable,44);
  let dataCond = 0;
  if (item.price && item.price !== undefined && item.price.length > 0) {
    item.price.some((eachPrice) => {
      if (parseFloat(eachPrice.eachunit) > parseFloat(0)) {
        dataCond = 1;
      } else {
        dataCond = 0;
      }
    });
  }

  if (
    dataCond == 1 &&
    (item.offer_stock > 0 || item.offer_stock == null) &&
    item.available_stock > 0
  ) {
    return (
      <React.Fragment>
        <div>
          {/* <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Add To Cart </button>  */}
          {deliverable ? (
            <div>
              <div>
                <div
                  className="d-sm-none mobile-fix-option p-0"
                  style={{
                    position: "fixed",
                    bottom: "0px",
                    left: "0px",
                    right: "0",
                    zIndex: "9999",
                  }}
                >
                  <div className="col-xs-12">
                    <div className="d-flex">
                      <button
                        className="btn btn-solid w-50 text-center"
                        onClick={ele.validate}
                        id="addToCart"
                      >
                        <i class="fa fa-shopping-cart pr-2"></i>Add to cart
                      </button>
                      <button
                        className="btn w-50 text-center "
                        onClick={ele.validate}
                        id="expressCheckOut"
                        style={{
                          backgroundColor: "#00adee",
                          color: "white",
                          height: "60px",
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-none d-sm-block">
                <button
                  className="btn btn-solid mr-2"
                  onClick={ele.validate}
                  id="addToCart"
                >
                  Add to cart
                </button>
                <button
                  className="btn btn-solid my-2"
                  onClick={ele.validate}
                  id="expressCheckOut"
                  clickevent="Express_checkout"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ) : getCookie("country_name") === "India" ||
            getCookie("country_name") === "india" ? (
            <div>
              <div>
                <div className="row mobile-fix-option">
                  <div
                    className="d-sm-none mobile-fix-option"
                    style={{
                      position: "fixed",
                      bottom: "0px",
                      left: "0px",
                      right: "0",
                      zIndex: "9999",
                    }}
                  >
                    <div className="col-xs-12">
                      <div className="d-flex">
                        <button
                          className="btn btn-solid w-50 p-2"
                          onClick={ele.validate}
                          id="addToCart"
                        >
                          {" "}
                          Add to cart
                        </button>
                        <OverlayTrigger
                          // key="top"
                          placement="top"
                          overlay={
                            <Tooltip id={`buy_now`}>
                              <i
                                class="fa fa-exclamation-circle mr-2"
                                aria-hidden="true"
                              ></i>
                              {pincode != "" && pincode !== undefined
                                ? "Information not found for entered pincode"
                                : " Please enter pincode"}
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn w-50"
                            onClick={ele.validate}
                            id="expressCheckOut"
                            style={{ backgroundColor: "#00adee" }}
                          >
                            Buy Now
                          </button>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-none d-sm-block">
                  <button
                    className="btn btn-solid mr-3"
                    onClick={ele.validate}
                    id="addToCart"
                  >
                    Add to cart
                  </button>
                  <OverlayTrigger
                    // key="top"
                    placement="top"
                    overlay={
                      <Tooltip id={`buy_now`}>
                        <i
                          class="fa fa-exclamation-circle mr-2"
                          aria-hidden="true"
                        ></i>
                        {pincode != "" && pincode !== undefined
                          ? "Information not found for entered pincode"
                          : " Please enter pincode"}
                      </Tooltip>
                    }
                  >
                    <button
                      className="btn btn-solid my-2"
                      onClick={ele.validate}
                      id="expressCheckOut"
                      clickevent="Express_checkout"
                    >
                      {" "}
                      Buy Now{" "}
                    </button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="row mobile-fix-option">
                <div
                  className="d-sm-none mobile-fix-option"
                  style={{
                    position: "fixed",
                    bottom: "0px",
                    left: "0px",
                    right: "0",
                    zIndex: "9999",
                  }}
                >
                  <div className="col-xs-12">
                    <div className="d-flex">
                      <button
                        className="btn btn-solid w-50 p-2"
                        onClick={ele.validate}
                        id="addToCart"
                      >
                        {" "}
                        <i class="fa fa-shopping-cart pr-2"></i>Add to cart
                      </button>
                      <button
                        className="btn w-50"
                        onClick={ele.validate}
                        id="expressCheckOut"
                        style={{ backgroundColor: "#00adee" }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-none d-sm-block">
                <button
                  className="btn btn-solid"
                  onClick={ele.validate}
                  id="addToCart"
                  clickevent="Express_checkout"
                >
                  Add to cart{" "}
                </button>
                <button
                  className="btn btn-solid "
                  onClick={ele.validate}
                  id="expressCheckOut"
                  clickevent="Express_checkout"
                >
                  {" "}
                  Buy Now{" "}
                </button>
              </div>
            </div>
          )}
          {/* <button
            className="btn btn-solid my-2 ml-2 "
            onClick={ele.validate}
            id="expressCheckOut"
            clickevent="Express_checkout"
          >
            {" "}
            Buy Now{" "}
          </button> */}
        </div>
        <div>
          {/* <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Add To Cart </button>  */}
          {item.sellerid != ls.get("log_id") && item.offer_stock == null ? (
            // <button
            //   className="btn btn-solid my-2 ml-2 "
            //   onClick={ele.callAuction}
            //   id="e_auction"
            //   clickevent="e_auction"
            // >
            //   {" "}
            //   E-Auction{" "}
            // </button>
            ""
          ) : item.offer_stock > 0 ? (
            <button
              className="btn btn-solid my-2 ml-2 "
              onClick={ele.chatBtn}
              clickevent="e_auction"
            >
              {" "}
              Chat Now{" "}
            </button>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  } else {
    if (dataCond == 0) {
      return (
        <React.Fragment>
          <div>
            <Link
              onClick={() => ele.event_ask_for_price("ask_for_price")}
              id="ask_for_price"
              className="btn btn-solid my-2"
              clickevent="Ask_for_price"

              to={{ pathname: "/post-requirement.html", state: item }}
            >
              Contact Supplier
            </Link>
          </div>
          <div>
            {/* <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Add To Cart </button>  */}
            {/* {item.sellerid != ls.get("log_id") ? (
              <button
                className="btn btn-solid my-2 ml-2 "
                onClick={ele.callAuction}
                id="e_auction"
                clickevent="e_auction"
              >
                {" "}
                E-Auction{" "}
              </button>
            ) : (
              ""
            )} */}
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <div>
          <div
            className="d-flex justify-content-between mb-3"
            style={{ marginLeft: "10px" }}
          >
            <div className="p-0 mr-1 productBorder d-none d-sm-block">
              <h5 className="p-text-color px-1" style={{ marginTop: "5px" }}>
                Out Of Stock
              </h5>
            </div>
            {/* <div className="dangerBorder mr-1">
            <h5 className="text-danger px-1" style={{ marginTop: "5px" }}>
              Out Of Stock
            </h5>
          </div> */}

            <div className="mr-1 d-none d-sm-block">
              <button
                className="btn btn-solid mr-1"
                onClick={ele.NotifyMe}
                id="expressCheckOut"
                clickevent="Express_checkout"
              >
                {" "}
                Notify Me{" "}
              </button>
            </div>
          </div>
          <div
            className="d-sm-none mobile-fix-option"
            style={{
              position: "fixed",
              bottom: "0px",
              left: "0px",
              right: "0",
              zIndex: "9999",
            }}
          >
            <div className="col-xs-12">
              <div className="d-flex">
                <button
                  className="productBorder btn w-50 p-text-color"
                  style={{
                    height: "60px",
                    backgroundColor: "white",
                    color: "#00adee",
                  }}
                >
                  Out Of Stock
                </button>
                <button
                  className="btn btn-solid w-50"
                  onClick={ele.NotifyMe}
                  id="expressCheckOut"
                >
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: parseInt(props.item.qty),
      signup: false,
      login: false,
      moqErr: false,
      initialRating: 4,
      buyer_country: "",
      buyer_country_id: "",
      buyer_country_code: "",
      currency: "INR",
      inrValue: 70,
      product_seller: "",
      price: 0,
      eprice: 0,
      askAuctionInit: "",
      showAuctionPop: false,
      fromChatWithSupplier: false,
      shouldReload: false,
      qtyerror: false,
      currencySymbol: "",
      variation: "",
      pincodeValidate: false,
      pincodeDeliverable: false,
      pincodeLocation: "",
      pincodeMsg: null,
      pincodeTitle: "",
      min_qty: parseInt(props.item.qty),
      min_qty_error: false,
      // price_array: [],
      msgNotifyME: false,
      NotifyMessage: "",
      ogtitle: true,
    };
    this.validator = new SimpleReactValidator();
    this.openPrcieCard = this.openPrcieCard.bind(this);
    this.ScrollTospec = this.ScrollTospec.bind(this);
    this.checkZipCode = this.checkZipCode.bind(this);
    this.checkPincodeAgain = this.checkPincodeAgain.bind(this);
    // this.setState({quantity: parseInt(this.props.item.qty)})
  }

  UNSAFE_componentWillMount() {
    //Set State Of Quantity
    if (
      this.props.item.offer_min_qty !== undefined &&
      this.props.item.offer_min_qty !== null &&
      this.props.item.offer_min_qty !== ""
    ) {
      this.setState({ quantity: parseInt(this.props.item.offer_min_qty) });
    } else {
      this.setState({
        quantity: parseInt(this.props.item.qty),
        min_qty: parseInt(this.props.item.qty),
      });
    }
  }

  minusQty = async () => {
    if (this.props.item.offer_stock != 0) {
      if (
        this.state.quantity <= this.props.item.available_stock &&
        this.state.quantity !== 1
      ) {
        await this.setState({
          quantity: this.state.quantity - 1,
          qtyerror: false,
        });
        this.getProdDetails(
                  this.state.currencySymbol,
                  this.state.country_code
                );
      }
      
    }

    //   if (
    //     this.offerExist(
    //       this.props.item.offer_from_date,
    //       this.props.item.offer_to_date
    //     ) &&
    //     parseInt(this.state.quantity - 1) <
    //       parseInt(this.props.item.offer_min_qty)
    //   ) {
    //     // await this.setState({
    //     //   qtyerror:true
    //     // })
    //   } else {
    //     if (
    //       this.state.quantity > 0 &&
    //       this.state.quantity > this.state.min_qty
    //     ) {
    //       // this.setState({stock: 'InStock'})
    //       await this.setState({
    //         quantity: this.state.quantity - 1,
    //         qtyerror: false,
    //       });
    //       this.CartCalc();
    //       this.getProdDetails(
    //         this.state.currencySymbol,
    //         this.state.country_code
    //       );
    //     } else {
    //       await this.setState({
    //         moqErr: true,
    //       });
    //     }
    //   }
    // }
  };

  plusQty = async () => {
    if (this.props.item.offer_stock != 0) {
      if (this.state.quantity < this.props.item.available_stock) {
        await this.setState({
          quantity: this.state.quantity + 1,
          qtyerror: false,
        });
        this.getProdDetails(this.state.currencySymbol, this.state.country_code);
      }
  
    }

    // if (this.props.item.offer_stock != 0) {
    //   if (
    //     this.offerExist(
    //       this.props.item.offer_from_date,
    //       this.props.item.offer_to_date
    //     ) &&
    //     parseInt(this.state.quantity + 1) >
    //       parseInt(this.props.item.offer_stock)
    //   ) {
    //     await this.setState({
    //       qtyerror: true,
    //     });
    //   } else {
    //     await this.setState({ quantity: this.state.quantity + 1 });
    //     if (this.state.quantity >= this.props.item.qty) {
    //       await this.setState({
    //         moqErr: false,
    //         qtyerror: false,
    //       });
    //     }
    //     this.CartCalc();
    //     this.getProdDetails(this.state.currencySymbol, this.state.country_code);
    //   }
    // }
    // if(this.props.item.stock >= this.state.quantity) {

    // }else{
    // this.setState({stock: 'Out of Stock !'})
    // }
  };
  changeQty = async (e) => {
    // if(this.props.item.offer_stock == 0)
    // return false;

    // if(this.props.item.offer_stock !=  0){
    var cqty = parseInt(e.target.value);
    if (
      this.offerExist(
        this.props.item.offer_from_date,
        this.props.item.offer_to_date
      ) &&
      cqty > parseInt(this.props.item.offer_stock)
    ) {
      await this.setState({
        qtyerror: true,
      });
    } else {
      await this.setState({
        quantity: cqty,
      });
      //console.log("changeQty", cqty,this.state.min_qty,this.state.quantity);
      if (cqty >= this.state.min_qty) {
        await this.setState({ quantity: cqty, qtyerror: false });

        if (cqty >= this.props.item.qty) {
          await this.setState({
            moqErr: false,
          });
        }
        this.CartCalc();
        this.getProdDetails(this.state.currencySymbol, this.state.country_code);
      } else {
        await this.setState({
          moqErr: true,
        });
      }
    }
    // }
  };

  CartCalc = async () => {
    await this.setState({
      buyer_country: getCookie("country_name"),
      buyer_country_id: getCookie("countryid"),
      buyer_country_code: getCookie("country"),
      //price: this.state.eprice * this.state.quantity
    });

    const { price_in, price_us, qty } = this.props.item;
    const start_price = parseFloat(this.props.item.start_price);
    const { currencyValue, symbol } = this.props;

    let country_code = getCookie("country_code");
  };

  finalCost = async (Cost, qty) => {};

  productCost = async (Cost) => {
    //  console.log('Cost',Cost,179);
    await this.setState({
      price: Cost,
    });
  };

  NotifyMe = () => {
    if (ls.get("sellerid")) {
      NotifyMeFunction(
        ls.get("sellerid"),
        this.props.item.id,
        getCookie("mhinpbnb")
      ).then(async (res) => {
        try {
          if (res != null || res != "") {
            if (res.statusId == 1 || res.statusId == "1") {
              this.setState({
                msgNotifyME: true,
                NotifyMessage:
                  "Oh, it's great you've shown interest in the most demanding product. Unfortunately, it is out of stock. Beldara will notify you once it is in stock.",
              });
              setTimeout(() => {
                this.setState({ msgNotifyME: false, NotifyMessage: "" });
              }, 6000);
            } else {
              this.setState({
                msgNotifyME: true,
                NotifyMessage: "Something went wrong please try again!",
              });
              setTimeout(() => {
                this.setState({ msgNotifyME: false, NotifyMessage: "" });
              }, 6000);
            }
          }
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }
      });
    } else {
      NotifyMeFunction(
        ls.get("sellerid"),
        this.props.item.id,
        getCookie("mhinpbnb")
      ).then(async (res) => {
        try {
          if (res != null || res != "") {
            if (res.statusId == 1 || res.statusId == "1") {
              this.setState({
                msgNotifyME: true,
                NotifyMessage:
                  "Oh, it's great you've shown interest in the most demanding product. Unfortunately, it is out of stock. Please login so that Beldara can notify you once it is in stock.  ",
              });
              setTimeout(() => {
                this.setState({ msgNotifyME: false, NotifyMessage: "" });
              }, 6000);
            } else {
              this.setState({
                msgNotifyME: true,
                NotifyMessage: "Something went wrong please try again!",
              });
              setTimeout(() => {
                this.setState({ msgNotifyME: false, NotifyMessage: "" });
              }, 6000);
            }
          }
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }
      });
    }
  };

  componentDidMount = async (nextProps) => {
    this.getProdDetails(getCookie("currency"), getCookie("country_code"));
    let search = window.location.search;
    realPath = search.split("beldara.com")[1];
    if (this.props.location.state) {
      if (
        this.props.location.state.askAuctionInit === true ||
        this.props.location.state.askAuctionInit === false
      ) {
        await this.setState({
          askAuctionInit: this.props.location.state.askAuctionInit,
        });
      } else {
        await this.setState({
          askAuctionInit: true,
        });
      }
    } else {
      await this.setState({
        askAuctionInit: true,
      });
    }
    this.loadedproduct();
    const advancedMatching = { em: "support@beldara.com" };
    const options = {
      autoConfig: true, // set pixel's autoConfig
      debug: false, // enable logs
    };
    ReactPixel.init("432219770935494", advancedMatching, options);
    ReactPixel.init("2231476330510319", advancedMatching, options);
    ReactPixel.pageView();

    var toast = $("#toast_message").detach();
    $(toast).insertAfter(".breadcrumb-section");

    // const tagManagerArgs = {
    //   gtmId: "GTM-5HBBK96", //gtmId: 'UA-57225000-1',
    //   // dataLayerName: "GTM-5HBBK96",
    //   events: {
    //     //send_to: "AW-724875220/AfpTCL3st7ABENTv0tkC",
    //     send_to: 'AW-803807171/IHhPCKqLwYgBEMO_pP8C',
    //     value: this.state.eachunit,
    //     currency: "INR",
    //     aw_remarketing_only: true,
    //   },
    // };
    // TagManager.initialize(tagManagerArgs);
    console.log("kjn");
    var pincode = getCookie("pincode");
    if (pincode !== "" && pincode !== null) {
      console.log("kj");
      this.checkZipCode(pincode);
    }
    if (this.props.item.qty == null) {
      this.setState({
        quantity: 1,
      });
    }
  };

  callAuction = async () => {
    // console.log('state: ', this.state.showAuctionPop)

    await this.setState({
      showAuctionPop: true,
      shouldReload: true,
    });
    // console.log('callAuction', this.state.showAuctionPop)
  };

  undoCallAuction = async () => {
    await this.setState({
      showAuctionPop: false,
      shouldReload: false,
    });
  };

  componentDidUpdate = async (nextProps) => {
    // console.log('componentDidUpdate',280,this.state.currency,nextProps.symbol,this.state.country_code,);
    let search = window.location.search;
    realPath = search.split("beldara.com")[1];
    if (this.props.location.state) {
      if (
        this.props.location.state.askAuctionInit === true ||
        this.props.location.state.askAuctionInit === false
      ) {
        if (
          this.state.askAuctionInit !== this.props.location.state.askAuctionInit
        ) {
          this.setState({
            askAuctionInit: this.props.location.state.askAuctionInit,
          });
        }
      } else {
        if (this.state.askAuctionInit !== true) {
          this.setState({
            askAuctionInit: true,
          });
        }
      }
    }
    // if (
    //   this.state.currencySymbol != nextProps.symbol ||
    //   this.state.country_code != getCookie("country_code")
    // ) {
    //   this.getProdDetails(getCookie("currency"), getCookie("country_code"));
    // }

    const { buyer_country, buyer_country_id, buyer_country_code } = this.state;
    try {
      currency = getCookie("currency") ? getCookie("currency") : "INR";

      if (
        buyer_country != getCookie("country_name") ||
        buyer_country_id != getCookie("countryid") ||
        buyer_country_code != getCookie("country") ||
        this.state.currency != currency
      ) {
        await this.setState({
          buyer_country: getCookie("country_name"),
          buyer_country_id: getCookie("countryid"),
          buyer_country_code: getCookie("country"),
          currency: currency,
        });
      }
    } catch (e) {}

    try {
      if (nextProps.currencyValue[0].INR != this.state.inrValue) {
        await this.setState({
          inrValue: nextProps.currencyValue[0].INR,
        });
      }
    } catch (e) {
      if (this.state.inrValue != 70)
        await this.setState({
          inrValue: 70,
        });
    }
    if (this.state.ogtitle == true && this.state.eachunit != undefined) {
      const tagManagerArgs = {
        gtmId: "GTM-5HBBK96", //gtmId: 'UA-57225000-1',
        // dataLayerName: "GTM-5HBBK96",
        events: {
          //send_to: "AW-724875220/AfpTCL3st7ABENTv0tkC",
          send_to: "AW-803807171/IHhPCKqLwYgBEMO_pP8C",
          id: this.props.item.id,
          value: this.state.eachunit,
          currency: this.state.currency,
          aw_remarketing_only: true,
          location_id: getCookie("country_name"),
          google_business_vertical: "retail",
        },
      };
      TagManager.initialize(tagManagerArgs);
      this.setState({
        ogtitle: false,
      });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('UNSAFE_componentWillReceiveProps', nextProps, this.props)
    this.loadedproduct();
  }

  loadedproduct = () => {
    this.CartCalc();
  };

  //Check Login
  validate = async (e) => {
    if (ls.get("sellerid")){
      
    let id = e.target.id;
    if (
      this.state.quantity >= this.props.item.qty &&
      this.state.quantity > 0
    ) {
      await this.setState({
        moqErr: false,
      });
      //this.captureEvent(id)
      captureEvent(
        "Product",
        id,
        this.props.item.id,
        "click",
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      //console.log('validate', ls.get("sellerid"))
      this.createCart(id);
    } else {
      // await this.setState({
      //   moqErr: true,
      // });
      captureEvent(
        "Product",
        id,
        this.props.item.id,
        "click",
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      //this.captureEvent(id)
    }
    }
    else{
      this.props.history.push({
        pathname: "/register.html",
        state: {
          totalCartValue: this.state.totalCartValue,
          totalProductCost: parseFloat(this.state.totalProductCost).toFixed(2),
          totalShippingCost: this.state.totalShippingCost,
          finalShippingCost: this.state.finalShippingCost,
          cartItems: this.state.cartItems,
          countryName: this.state.shippingCountryName,
          symbol: this.state.symbol,
          cartId: this.state.cartid,
          //pixeldata: pixeldata,
          shippingCharges: this.state.shippingCharges,
          inrValue: this.state.inrValue,
          // link:
          //   "/start-order/" +
          //   Math.random()
          //     .toString(36)
          //     .replace(/[^a-z]+/g, "")
          //     .substr(0, 8) +
          //   ".html",
          link: "/start-order.html",
        },
      });
    }



  };

  event_ask_for_price = (id) => {
    captureEvent(
      "Product",
      id,
      this.props.item.id,
      "click",
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
  };

  createCart = (id) => {
    console.log(
      this.props.item.id,
      this.state.quantity,
      this.state.price,
      getCookie("mhinpbnb")
    );
    axios
      .post(
        "https://api.indiabigshop.com/common/add_to_cart.php",
        {
          security_token: "",
          plateform_type: "",
          productid: this.props.item.id,
          qty: this.state.quantity,
          amount: this.state.price,
          currency: this.state.currency,
          visitorid: getCookie("mhinpbnb"),
          sellerid: ls.get("sellerid"),
          country_to: getCookie("countryid"),
          pincode: getCookie("pincode"),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        console.log(response);
        if (id == "addToCart") {
          store.dispatch(
            getCartLength(ls.get("log_id"), getCookie("mhinpbnb"))
          );
          showToast("Product added to cart", "1");
        }
        // if (!this.state.moqErr) {
        //   console.log("newwwwwwwww");
        //   id == "expressCheckOut"
        //     ? this.goToExpressCheckout()
        //     : ls.get("sellerid")
        //     ? this.goToStartOrder()
        //     : this.goToLogin(id);
        // }
        if (!this.state.moqErr) {
          if (id == "expressCheckOut") {
            id == "expressCheckOut"
              ? this.goToStartOrder()
              : // this.goToExpressCheckout()
                this.goToStartOrder();
          }
        }
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  };

  goToLogin = (id) => {
    let pid = this.props.item.id;
    let product_currency = this.props.symbol;
    let each_product_price = this.state.price;
    if (
      product_currency == "INR" ||
      product_currency == "" ||
      product_currency === undefined
    )
      each_product_price =
        parseFloat(each_product_price) / parseFloat(this.state.inrValue);

    each_product_price = each_product_price.toFixed();

    ReactPixel.trackCustom("AddToCart", {
      content_ids: [pid],
      content_type: "product",
      value: each_product_price,
      currency: "USD",
    });

    // this.props.history.push({
    //   pathname: "/register.html",
    //   state: {page:id}
    // })
  };

  goToExpressCheckout = async () => {
    let pid = this.props.item.id;
    let product_currency = this.props.symbol;
    var each_product_price = this.state.price;
    if (
      product_currency == "INR" ||
      product_currency == "" ||
      product_currency === undefined
    )
      each_product_price = parseFloat(each_product_price) / 70;

    // each_product_price = each_product_price.toFixed(2);

    ReactPixel.trackCustom("AddToCart", {
      content_ids: [pid],
      content_type: "product",
      value: each_product_price,
      currency: "USD",
    });

    this.props.history.push({
      pathname: "/check_out.html",
      state: {
        totalprice: this.state.price,
        qty: this.state.quantity,
        currency: this.props.symbol,
        product_seller: this.props.item.sellerid,
        product_currency: this.props.item.currency,
        prod_id: this.props.item.id,
      },
    });
  };

  goToStartOrder = async () => {
    let pid = this.props.item.id;
    let product_currency = this.props.symbol;
    let each_product_price = this.state.price;
    if (
      product_currency == "INR" ||
      product_currency == "" ||
      product_currency === undefined
    )
      each_product_price = parseFloat(each_product_price) / 70;

    each_product_price = parseFloat(each_product_price).toFixed(2);

    ReactPixel.trackCustom("AddToCart", {
      content_ids: [pid],
      content_type: "product",
      value: each_product_price,
      currency: "USD",
    });
    store.dispatch(getCartLength(ls.get("log_id"), getCookie("mhinpbnb")));
    this.props.history.push({
      pathname: "/cart.html",
      pathname: "/start-order.html",

      state: {
        totalCartValue: this.state.totalCartValue,
        totalProductCost: parseFloat(this.state.totalProductCost).toFixed(2),
        totalShippingCost: this.state.totalShippingCost,
        finalShippingCost: this.state.totalShippingCost,
        cartItems: this.state.cartItems,
        countryName: this.state.shippingCountryName,
        symbol: this.state.symbol,
        cartid: this.state.cartid,
        //pixeldata: pixeldata,
        shippingCharges: this.state.shippingCharges,
        inrValue: this.state.inrValue,
        totalCartStaticValue: this.state.totalCartStaticValue,
        //cashback_amount_inr: cashback_amount_inr,
        //cashback_amount_usd: cashback_amount_usd,
        txn_type: this.state.txn_type,
      },
    });
  };

  create_wishlist = (e) => {
    axios
      .post(
        "https://api.indiabigshop.com/common/create_wishlist.php",
        {
          security_token: "",
          plateform_type: "",
          productid: this.props.item.id,
          qty: this.state.quantity,
          amount: this.state.price,
          currency: this.state.currency,
          eachunit: eachunit,
          visitorid: getCookie("mhinpbnb"),
          sellerid: ls.get("sellerid"),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        //toast.success("Item Added to Wishlist");
        this.showToast(response.data);

        // if (response.statusId == '1')
        //   toast.success("Item Added to Wishlist");
        // else
        //   toast.success("Item Added to Wishlist");
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  };

  showToast(data) {
    $("#toast_message")
      .removeClass("hide")
      .addClass("show");
    if (data.statusId == "1")
      $(".toast-body")
        .removeClass("bg-success bg-danger")
        .addClass("bg-success")
        .html(
          '<span class="text-light"><i class="fa fa-check text-light"></i> ' +
            data.result +
            "</span>"
        );
    else
      $(".toast-body")
        .removeClass("bg-success bg-danger")
        .addClass("bg-danger")
        .html(
          '<span class="text-light"><i class="fa fa-times text-light"></i> ' +
            data.result +
            "</span>"
        );

    var clearint = setInterval(function() {
      $("#toast_message")
        .removeClass("show")
        .addClass("hide");
      clearInterval(clearint);
    }, 3000);
  }

  // closeToast() {
  //   $("#toast_message").removeClass('show').addClass('hide')
  // }

  closeModal = () => {
    this.setState({
      login: false,
      signup: false,
    });
  };

  openSignUpModal = () => {
    this.setState({
      signup: true,
      login: false,
    });
  };

  openLoginModal = () => {
    this.setState({
      signup: false,
      login: true,
    });
  };

  //Chat Check Open
  chatBtn = () => {
    // e.preventDefault()
    id = "chatBtn";
    // ls.get("sellerid")
    //   ?
    //   window.location.assign('https://msg.beldara.com?ssid='+this.props.item.id)
    // :
    // // this.setState({
    // //   login: true
    // // });
    // // this.scrollcntList()
    // let statePass = {
    //   // sellerid:sellerid,
    //   chatWithSupplier:true
    //   // company:company
    // }
    let statePass = {
      sellerid: this.props.item.sellerid,
      chatWithSupplier: true,
      company: this.props.item.company,
      item: this.props.item,
    };
    // console.log(statePass,640);
    store.dispatch(getChatWithSupplier(statePass));
    // this.setState({
    //   fromChatWithSupplier:true
    // })
  };
  CalcOfferPrice = (
    offer_price,
    qty,
    stock,
    min_qty,
    offer_date,
    to_date,
    start_range,
    end_range
  ) => {
    // console.log(offer_price,qty,stock,min_qty,offer_date,to_date,start_range,end_range,602);
    if (this.offerExist(offer_date, to_date)) {
      // console.log('if',602)
      //  if(qty <= parseInt(stock) && qty >= parseInt(min_qty)){
      if (
        parseInt(start_range) > parseInt(min_qty) &&
        parseInt(end_range) <= parseInt(stock)
      ) {
        return parseInt(qty) * parseFloat(offer_price);
      } else {
        // console.log('if else',602)
        return null;
      }
    } else {
      // console.log('else',602)
      return null;
    }
  };

  offerExist = (from_date, to_date) => {
    if (
      from_date !== undefined &&
      from_date !== null &&
      from_date !== "" &&
      to_date !== undefined &&
      to_date !== null &&
      to_date !== ""
    ) {
      let dateObj = new Date();
      let month = dateObj.getMonth() + 1;
      let day = dateObj.getDate();
      let year = dateObj.getFullYear();
      let todayDate = year + "-" + month + "-" + day;
      // let todayDate = '2021-5-8';

      //Generate an array where the first element is the year, second is month and third is day
      var splitFrom = from_date.split("-");
      var splitTo = to_date.split("-");
      var splitToday = todayDate.split("-");

      //Create a date object from the arrays
      var newFrom = splitFrom[1] + "," + splitFrom[2] + "," + splitFrom[0];
      var newTo = splitTo[1] + "," + splitTo[2] + "," + splitTo[0];
      var newToday = splitToday[1] + "," + splitToday[2] + "," + splitToday[0];

      newFrom = newFrom.toString();
      newTo = newTo.toString();
      newToday = newToday.toString();

      var fromDate = Date.parse(newFrom);
      var toDate = Date.parse(newTo);
      var todayDates = Date.parse(newToday);

      // console.log(splitFrom,splitTo,splitToday,'array',fromDate,toDate,todayDates,'days',newFrom,newTo,newToday);
      if (todayDates >= fromDate) {
        if (toDate >= todayDates) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  getProdDetails = async (
    currency,
    country_code,
    qty = null,
    productid = null
  ) => {
    console.log("jshbcsdjhcbsdjhdbcdjbdcdchsbcdshgcbvdh")
    if (country_code != "in") {
      $("#pincodemodule").addClass("d-none");
    } else {
      $("#pincodemodule").removeClass("d-none");
    }
    // console.log(currency,country_code,qty,productid);
    $(".common_class_for_spin").removeClass("d-none");
    axios
      .post(
        // `${apiUrl}get_product_details.php`,
        // common/product-details.php
        `${apiUrl}get_seller_product_detail.php`,
        {
          security_token: "",
          plateform_type: "",
          productid: productid == null ? this.props.item.id : productid,
          qty: qty == null ? this.state.quantity : qty,
          sellerid: ls.get("sellerid"),
          currency: currency,
          country_code: country_code,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(async (response) => {
        // console.log(response.data,700);
        console.log(response);
        if (response.data.statusId == "1") {
          // console.log('inside if',response.data.result[0].variation,700);
          await this.setState({
            price: response.data.result[0].totalprice,
            eachunit: response.data.result[0].eachprice,
            currency: currency,
            country_code: country_code,
            mrp_price: response.data.result[0].mrp_price,
            offer_price: response.data.result[0].eachprice,
            currencySymbol: currency,
            unit: response.data.result[0].unit,
            price_array: response.data.result[0].price_array,
            shipping_cost: response.data.result[0].shipping_cost,
            gst_val: response.data.result[0].gst_val,
            gst_in: response.data.result[0].gst_in,
            gst_cal: response.data.result[0].gst_cal,
            product_mrp: response.data.result[0].product_mrp,
            selling_price: response.data.result[0].selling_price,
            variation: response.data.result[0].variation,
            shipping_charge: response.data.result[0].shipping_charge,
            // pincodeDeliverable: country_code != 'in' ? true : false
          });
          if (country_code !== "in") {
            await this.setState({ pincodeDeliverable: true });
          }
          $(".common_class_for_spin").addClass("d-none");
        } else {
          // console.log('inside else',700);
        }
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  };

  ScrollTospec = async () => {
    var x = $("#prodDetailSpec").offset().top;
    window.scroll({
      top: x - 126,
      behavior: "smooth",
      block: "start",
    });
  };

  openPrcieCard = () => {
    var ele = document.getElementById("prices_cards");
    ele.classList.toggle("d-none");
  };

  checkPincodeAgain = () => {
    this.setState({ pincodeValidate: false });
  };

  checkZipCode = (pincodeAvail = null, e) => {
    // console.log(pincodeAvail,e,877);
    var ele = document.getElementById("error_pincode");
    ele.classList.add("d-none");
    if (pincodeAvail !== null) {
      // console.log('if',877);
      var pincode = pincodeAvail;
    } else {
      // console.log('if',877);
      var pincode = this.state.pincode;
    }
    if (pincode == "") {
      ele.classList.remove("d-none");
    } else {
      // console.log(this.props.item.id,877);
      axios
        .post(
          `https://img.beldara.com/beta_api/validate-pincode-deliverable.php`,
          {
            pincode: pincode,
            productid: this.props.item.id,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then((res) => {
          // console.log(res.data);
          if (res.data.statusId == 1) {
            setCookie("pincode", pincode, "1");
            // console.log(res.data.result,'if');
            var response = res.data.result[0];
            // console.log(response);
            this.setState({
              pincodeValidate: true,
              pincodeDeliverable: true,
              pincode: pincode,
              pincodeTitle: response.title,
              pincodeMsg: response.message,
            });
          } else {
            this.setState({
              pincodeValidate: true,
              pincodeDeliverable: false,
              pincode: pincode,
              pincodeTitle: res.data.message,
            });
            // console.log(res.data.result,'else');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  ChangePincode = (e) => {
    var value = e.target.value;
    // console.log(value);
    this.setState({ pincode: value });
  };

  allowPincode = (e) => {
    var value = e.target.value;
    // console.log(value.length);
    if (value.length >= 5) {
      this.setState({ pincode: value.substring(0, 5) });
    }
  };

  render() {
    // console.log('render',this.state.eachunit);
    const { item, BuynowClicked, translate } = this.props;
    const item_name = item.name;
    const HRLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 1,
          marginTop: 0,
          marginBottom: 0,
        }}
      />
    );
    console.log(this.props.item);
    return (
      <>
        <div className="col-lg-5 border-right">
          <div
            id="toast_message"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="toast toast_pull_right fade hide"
          >
            <div className="toast-body">
              <i className="fas fa-check"></i> Product Added To Wishlist
            </div>
          </div>
          {/* new */}
          <div>
            <div className="d-none d-sm-block">
              <div className="sticky-top bg-white" style={{ zIndex: "0" }}>
                <h5 className="text-dark">
                  <strong>{this.props.item.name}</strong>
                </h5>
              </div>
              <div className="product-right product-description-box">
                {/* <h5> {item_name ? item_name.replace(/[^a-zA-Z ]/g, "") : ""} </h5> */}
                <div className="d-flex align-items-center">
                  {this.props.item.company ? (
                    <>
                      <p
                        className=""
                        style={{
                          fontSize: "16px",
                          letterSpacing: "0px",
                          color: "black",
                          fontWeight: "600",
                          marginRight: "5px",
                        }}
                      >
                        Brand:{" "}
                        {this.props.item.surl !== undefined &&
                        this.props.item.surl != "" ? (
                          <a
                            className="h6"
                            href={`/store/${this.props.item.surl}.html`}
                            target="_blank"
                            style={{
                              fontSize: "16px",
                              letterSpacing: "0px",
                              color: "#40c2f2",
                              fontWeight: "500",
                            }}
                          >
                            {item.brand}
                            {item.country !== null && item.country !== undefined
                              ? "/" + item.country
                              : ""}
                          </a>
                        ) : (
                          <span
                            className="h6"
                            fontSize={{ fontWeigh: "500px" }}
                          >
                            {item.brand}
                            {item.country !== null && item.country !== undefined
                              ? "/" + item.country
                              : ""}
                          </span>
                        )}
                      </p>
                      {/* <div>
                        {this.props.item.company &&
                        this.props.item.is_active == "1" ? (
                          <ReactCSSTransitionGroup
                            transitionName="example"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={600}
                          >
                            <span
                              className="py-1"
                              style={{
                                color: "#ff9944",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "500",
                              }}
                              onClick={this.chatBtn}
                              id="chatBtn"
                            >
                              <i className="fa fa-comments" /> Chat with
                              supplier
                            </span>
                          </ReactCSSTransitionGroup>
                        ) : (
                          ""
                        )}
                      </div> */}
                    </>
                  ) : (
                    ""
                  )}
                </div>

                {/* old */}
                {/* <a
              onClick={this.ScrollTospec}
              className="mouse_pointer text-primary"
            >
              Show description/specification
            </a> */}
              </div>
            </div>
            <div
                className="row d-flex justify-content-start mt-1 mb-1"
              >
                {/* <div>
              Shipping Charges:{` `}
              {this.state.currency} {this.state.shipping_cost}
            </div> */}
                
                  <div
                    id="prices_cards"
                    className="bg-grey float-left col-sm-12"
                    style={{ padding: "10px" }}
                  >
                    <table class="table table-sm table-borderless mb-0">
                      <tr>
                        <th>Weight  {this.props.item.weight} {""}{" "}
                       {this.props.item.available_stock_unit}</th>
                        <td className="text-right">
                        {this.props.item.weight_desc} {""}{" "}
                    
                        </td>
                        {/* </tr>
                      <tr>
                        <th>Tax @ {this.state.gst_val}%</th>
                        <td>-</td>
                        <td className="text-right">
                          {this.state.currency}{" "}
                          {new Intl.NumberFormat().format(
                            parseFloat(this.state.gst_cal).toFixed(2)
                          )}
                        </td>
                      </tr>
                      <tr style={{ borderTop: "2px solid" }}>
                        <th>Final Price</th>
                        <td>-</td>
                        <td className="text-right">
                          {/* {parseFloat(
                      parseFloat(this.state.price) -
                        parseFloat(this.state.gst_cal)
                    ).toFixed(2)} */}
                        {/* </tr>{this.state.currency}{" "} */}
                        {/* </table> {new Intl.NumberFormat().format( */}
                        {/* parseFloat(this.state.price).toFixed(2) */}
                        {/* /)} */}
                        {/* </td> */}
                      </tr>
                    </table>
                  </div>
              </div>

            {/* <React.Fragment>
              <div
                className="d-flex mt-1 d-none d-sm-block"
                style={{
                  fontSize: "16px",
                  letterSpacing: "0px",
                  fontWeight: "600",
                }}
              >
                <span className="mr-2 d-none d-sm-inline-block">
                  Product Rating: ({this.props.reviewCount})
                </span>
                <span className="d-none d-sm-inline-block">
                  <StarReview
                    dataFromRating={this.props.dataFromRating}
                    page={`${process.env.PUBLIC_URL}/rating/${item.url}.html`}
                    avgRating={this.props.avgRating}
                    item={item}
                    average={true}
                    readonly={true}
                  />
                </span>
              </div>
            </React.Fragment> */}
            <div className="row mt-2 align-items-center mx-3 mb-3 d-block d-sm-none">
              <div>
                {/* {(item.price.length > 0 && (item.beldara_prime == 1 || ((this.state.buyer_country.toLowerCase() != 'us' && this.state.buyer_country_id != '1' && this.state.buyer_country.toLowerCase() != 'in' && this.state.buyer_country_id != '91') || ( (this.state.buyer_country_id.toLowerCase() == '' || this.state.buyer_country_id.toLowerCase() === undefined || this.state.buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase()!='in' && getCookie('country_code').toLowerCase()!='us' )) ) )? ( */}
                {Array.isArray(item.price) && item.price.length > 0 ? (
                  <div className="single-product-tables detail-section py-2">
                    <table>
                      <tbody>
                        <tr>
                          <td>{translate("Quantity")}:</td>
                          <td className="rounded">
                            <div style={{ borderRadius: "5px" }}>
                              <div className="qty-box ml-1">
                                <div className="input-group">
                                  <span className="input-group-prepend">
                                    <button
                                      type="button"
                                      className="btn quantity-left-minus"
                                      onClick={this.minusQty}
                                      data-type="minus"
                                      data-field=""
                                      style={{
                                        borderTopLeftRadius: "12px",
                                        borderBottomLeftRadius: "12px",
                                        border: "1px solid #ef7b00",
                                      }}
                                    >
                                      <i className="fa fa-minus" />
                                    </button>
                                  </span>
                                  <NumberFormat
                                    format="####"
                                    name="quantity"
                                    value={this.state.quantity}
                                    onChange={this.changeQty}
                                    className="form-control input-number"
                                    style={{
                                      borderTop: "1px solid #ef7b00",
                                      borderBottom: "1px solid #ef7b00",
                                    }}
                                  />
                                  {/* <input type="text" name="quantity" value={this.state.quantity} onChange={this.changeQty}  /> */}
                                  <span
                                    className="input-group-prepend"
                                    style={{ marginRight: "-32px" }}
                                  >
                                    <button
                                      type="button"
                                      className="btn quantity-right-plus"
                                      onClick={this.plusQty}
                                      data-type="plus"
                                      data-field=""
                                      style={{
                                        borderTopRightRadius: "12px",
                                        borderBottomRightRadius: "12px",
                                        border: "1px solid #ef7b00",
                                        zIndex: 0,
                                      }}
                                    >
                                      <i className="fa fa-plus" />
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        {/* <tr>   
                    <td><a href="javascript:void(0)" className="text-solid"><small> <i className="fa fa-paper-plane mr-1"></i>Calculate Shipment Cost </small></a></td>
                  </tr> */}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {/* <div className="col-lg-4">
              <div className="font-weight-bold">
                {this.state.currency}{" "}
                {new Intl.NumberFormat().format(this.state.eachunit)} /{" "}
                {item.unit}
              </div>
            </div> */}
              {/* {this.state.gst_val != null ? (
              <div className="col-lg-4">
                <span className="h6 mouse_pointer" onClick={this.openPrcieCard}>
                  {this.state.gst_val}% GST + GST Charges
                </span>
              </div>
            ) : (
              ""
            )} */}
            </div>
            <div className="d-flex align-items-end d-block d-sm-none">
              <div className="px-1">
                {this.state.qtyerror ? (
                  <div className="text-danger">
                    {item.offer_stock == 0
                      ? `OUT OF STOCK`
                      : `only ${item.offer_stock} stock left!`}
                  </div>
                ) : (
                  // :(this.state.min_qty_error)?(
                  //   <div className="text-danger">
                  //        {`MOQ ${this.state.min_qty} ${this.state.unit}`}
                  //   </div>
                  // )
                  ""
                )}
                <div
                  className={`alert alert-danger ${
                    this.state.moqErr ? "d-block" : "d-none"
                  }`}
                >
                  <i className="fa fa-info-circle mr-1" /> Order must be greater
                  than MOQ {item.qty} {item.unit}
                </div>

                {/* {( this.state.quantity && (item.beldara_prime == 1 || ((this.state.buyer_country.toLowerCase() != 'us' && this.state.buyer_country_id != '1' && this.state.buyer_country.toLowerCase() != 'in' && this.state.buyer_country_id != '91') || ( (this.state.buyer_country_id.toLowerCase() == '' || this.state.buyer_country_id.toLowerCase() === undefined || this.state.buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase()!='in' && getCookie('country_code').toLowerCase()!='us' )) ) ) ? (
                <GetPriceSelected product={item} qty={this.state.quantity} />
              ) : (
                ""
                )} */}

                {/* {this.state.quantity ? (
                // <GetPriceSelected productCost={this.productCost}
                // finalCost={this.finalCost} product={item} qty={this.state.quantity} />
                <div className="border-product text-center border-0 ">
                  <span>
                    <div class="timer-cal">
                      {this.state.quantity} {this.state.unit} is selected
                    </div>
                    <div class="timer-cal">
                      <div>
                        <div class="font-weight-bold">
                          {this.state.price > 0 ? (
                            <>
                              <div
                                class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                                role="status"
                                style={{ color: "#f1aa61" }}
                              >
                                <span class="sr-only">Loading...</span>
                              </div>
                              {this.state.currency} {this.state.price}
                            </>
                          ) : (
                            "Ask for price"
                          )}
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              ) : (
                ""
              )} */}
                {/* <OfferTimer
                offer_from_date={item.offer_from_date}
                offer_to_date={item.offer_to_date}
              /> */}
              </div>
            </div>
            <div>
              <div
                className="row d-flex justify-content-start mt-1 mb-1"
                style={{ marginLeft: "1px", marginRight: "1px" }}
              >
                {/* <div>
              Shipping Charges:{` `}
              {this.state.currency} {this.state.shipping_cost}
            </div> */}
                {this.state.gst_val != null ? (
                  <div
                    id="prices_cards"
                    className="bg-grey float-left col-sm-12  productBorder"
                    style={{ padding: "10px" }}
                  >
                    <table class="table table-sm table-borderless mb-0">
                      <tr>
                        <th>Price of items</th>
                        <td className="text-right">
                        {this.state.price}
                        </td>
                        {/* </tr>
                      <tr>
                        <th>Tax @ {this.state.gst_val}%</th>
                        <td>-</td>
                        <td className="text-right">
                          {this.state.currency}{" "}
                          {new Intl.NumberFormat().format(
                            parseFloat(this.state.gst_cal).toFixed(2)
                          )}
                        </td>
                      </tr>
                      <tr style={{ borderTop: "2px solid" }}>
                        <th>Final Price</th>
                        <td>-</td>
                        <td className="text-right">
                          {/* {parseFloat(
                      parseFloat(this.state.price) -
                        parseFloat(this.state.gst_cal)
                    ).toFixed(2)} */}
                        {/* </tr>{this.state.currency}{" "} */}
                        {/* </table> {new Intl.NumberFormat().format( */}
                        {/* parseFloat(this.state.price).toFixed(2) */}
                        {/* /)} */}
                        {/* </td> */}
                      </tr>
                    </table>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                {this.state.product_mrp !== null &&
                this.state.selling_price !== null ? (
                  <>
                    <div
                      id="prices_cards"
                      className="bg-grey  text-center productBorder"
                      style={{ padding: "16px" }}
                    >
                      <div className="row justify-content-between mx-1 mb-2">
                        <div>
                          <th>Available in stock</th>
                        </div>
                        <div className="float-right">
                          {this.props.item.available_stock}
                        </div>
                      </div>
                      {/* 
                      <HRLine color="#0e0e0e" />
                      <div className="row justify-content-between mx-1 mt-1">
                        <div>
                          <th>Retail Margin</th>
                        </div>
                        {/* {parseFloat(
                            (parseFloat(this.state.product_mrp) -
                            parseFloat(this.state.selling_price)) /
                            (parseFloat(this.state.product_mrp) * 0.01).toFixed(2)
                            ).toFixed(2)} */}
                      {/* <div style={{ marginRight: "51px" }}>-</div> */}
                      {/* <div className="float-right"> */}
                      {/* {" "} */}
                      {/* {parseFloat( */}
                      {/* ((parseFloat(this.state.product_mrp) - */}
                      {/* parseFloat(this.state.selling_price)) / */}
                      {/* parseFloat(this.state.product_mrp)) * */}
                      {/* 100 */}
                      {/* ).toFixed(2)} */}
                      {/* % */}
                      {/* </div> */}
                      {/* </div> */}
                    </div>
                    <div className="mt-3 pl-3 d-none ">
                      {this.state.variation ? (
                        this.state.shipping_charge == "0" ? (
                          <>
                            <span
                              data-tip
                              data-for="ToolTip"
                              className="mouse_pointer shippingBeldaraFirst"
                            >
                              Free&nbsp;Shipping
                            </span>
                            <div>
                              <ReactTooltip
                                id="ToolTip"
                                type="warning"
                                effect="solid"
                              >
                                <span>{item.shipping_content}</span>
                              </ReactTooltip>
                            </div>
                          </>
                        ) : (
                          <span
                            data-tip
                            data-for="ToolTip"
                            className="mouse_pointer shippingBeldaraFirst mt-3"
                            style={{ fontSize: "13px" }}
                          >
                            Shipping&nbsp;{this.state.currency}
                            &nbsp;{this.state.shipping_charge}&nbsp;For&nbsp;
                            {this.state.quantity}&nbsp;/&nbsp;{item.unit}
                          </span>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* <React.Fragment>
              <div
                className="d-flex mt-2 d-block d-sm-none"
                style={{
                  fontSize: "16px",
                  letterSpacing: "0px",
                  fontWeight: "600",
                }}
              >
                <span className="mr-2">
                  Product Rating: ({this.props.reviewCount})
                </span>
                <StarReview
                  dataFromRating={this.props.dataFromRating}
                  page={`${process.env.PUBLIC_URL}/rating/${item.url}.html`}
                  avgRating={this.props.avgRating}
                  item={item}
                  average={true}
                  readonly={true}
                />
              </div>
            </React.Fragment> */}
            <div
              className="single-product-tables border-product detail-section pb-0 my-2 p-3 mt-3 d-block d-sm-none"
              style={{
                border: "dotted 1px",
                borderRadius: "5px",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td>{translate("Free Sample")}:</td>
                    <td>
                      <strong>
                        {this.props.item.free_sample == "0"
                          ? "On Demand"
                          : "Yes"}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{translate("Avalibility")}:</td>
                    <td>
                      <strong>
                        {" "}
                        {this.props.item.available_stock !== "0" &&
                        this.props.item.available_stock > 0
                          ? "InStock"
                          : "Out Of Stock"}
                      </strong>
                    </td>
                  </tr>
                  {parseFloat(this.props.item.weight) > parseFloat(0) ? (
                    <tr>
                      <td>{translate("Weight")}:</td>
                      <td>
                        <strong>
                          {" "}
                          {this.props.item.weight}{" "}
                          {this.props.item.available_stock_unit}
                        </strong>
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
            {/* <ProductVariation
              getProdDetl={this.getProdDetails}
              prodId={item.id}
              variation={this.state.variation}
              disptach_product={this.props.dispatch_variant_products}
              deliverable={this.state.pincodeDeliverable}
              pincode={this.state.pincode}
              product_mrp={this.state.product_mrp}
              selling_price={this.state.selling_price}
              prodData={item}
            /> */}
            {/* <div>
              <div className="mt-2 row mb-3 col-sm-12 d-none" >
                <div>
                  <span class="fa-stack">
                    <i
                      class="fa fa-certificate fa-3x mr-1"
                      style={{ color: "#ff9944" }}
                    />
                      <i class=" fa-stack-1x fa-inverse">%</i>
                  </span>
                  <span class="fa-stack fa-1x mr-1">
                    <i
                      class="fa fa-certificate fa-stack-2x"
                      style={{ color: "#ff9944" }}  
                    ></i>
                    <i class="fa-stack-1x fa-inverse">%</i>
                  </span>
                </div>
                <div className="mt-1">
                  <strong>Save extra with offers</strong>
                </div>
              </div>
              <div style={{ border: "dashed 1px" }}>
                <div className="p-3">
                  <p className="mb-3">
                    <span style={{ color: "#ff9944" }}>
                      <strong>Cashback:</strong>
                    </span>
                    <span style={{ fontSize: "500", color: "black" }}>
                      {" "}
                      5% cashback with Beldara ICICI credit card
                    </span>
                  </p>
                  <p>
                    <span style={{ color: "#ff9944" }}>
                      <strong>Cashback:</strong>
                    </span>
                    <span style={{ fontSize: "500", color: "black" }}>
                      {" "}
                      5% instant offer with HDFC credit card
                    </span>
                  </p>
                </div>
              </div>
            </div> */}

            <div className="border-product d-none">
              <h3>
                <div className="product-buttons">
                  {/* <a className="btn btn-solid" onClick={() => addToCartClicked(item, this.state.quantity)}>Contact Supplier</a> */}
                  <Link
                    to={`${process.env.PUBLIC_URL}/checkout`}
                    className="btn btn-solid"
                    onClick={() => BuynowClicked(item, this.state.quantity)}
                  >
                    Start Order
                  </Link>
                </div>
              </h3>
            </div>
            {/* "col-sm-12 col-lg-12" */}
            <div>
              <DetailsTopTabs item={item} />
            </div>
            <LiveReq
              price={item}
              askAuction={this.state.askAuctionInit}
              shouldReload={this.state.shouldReload}
              showAuctionPop={this.state.showAuctionPop}
              undoCallAuction={this.undoCallAuction}
            />
          </div>
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
          {/* {Chat} */}
          <Suspense loading={""}>
            <ChatBox
              product={item}
              chatToSeller={
                this.props.chatToSeller ? this.props.chatToSeller : false
              }
            />
          </Suspense>
        </div>
        <div className="col-lg-3">
          <div className="mb-2 d-none">
            <div className="row">
              <h5 className="product-title mx-3 mt-1">
                <strong>Share with:</strong>
              </h5>
              <div className="product-icon">
                <ul className="product-social">
                  <li
                    className="rounded-circle bg-white mr-3 shadow"
                    style={{ width: "30px", height: "30px" }}
                  >
                    <div className="text-center mt-1 logo">
                      <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="nofollow"
                      >
                        <i
                          className="fa fa-facebook "
                          style={{ color: "#ff9944", fontSize: "20px" }}
                        />
                      </a>
                    </div>
                  </li>
                  <li
                    className="rounded-circle bg-white mr-3 shadow"
                    style={{ width: "30px", height: "30px" }}
                  >
                    <div className="text-center mt-1">
                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="nofollow"
                      >
                        <i
                          className="fa fa-instagram"
                          style={{ color: "#ff9944", fontSize: "20px" }}
                        />
                      </a>
                    </div>
                  </li>
                  <li
                    className="rounded-circle bg-white shadow"
                    style={{ width: "30px", height: "30px" }}
                  >
                    <div className="text-center mt-1">
                      <a
                        href="https://twitter.com/"
                        target="_blank"
                        rel="nofollow"
                      >
                        <i
                          className="fa fa-twitter"
                          style={{ color: "#ff9944", fontSize: "20px" }}
                        />
                      </a>
                    </div>
                  </li>
                  {/* <li className="rounded-circle bg-dark" style={{width:"40px",height:"40px"}}>
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="nofollow"
                    >
                      <i className="fa fa-instagram" />
                    </a>
                  </li> */}
                </ul>
                {/* <button className="wishlist-btn" onClick={() => addToWishlistClicked(item)}>
                                    <i className="fa fa-heart"></i><span className="title-font">Add To WishList</span>
                                </button> */}
              </div>
            </div>
          </div>
          <div className="row mt-2 align-items-center mx-1 mb-3 d-sm-block d-none">
            <div>
              {/* {(item.price.length > 0 && (item.beldara_prime == 1 || ((this.state.buyer_country.toLowerCase() != 'us' && this.state.buyer_country_id != '1' && this.state.buyer_country.toLowerCase() != 'in' && this.state.buyer_country_id != '91') || ( (this.state.buyer_country_id.toLowerCase() == '' || this.state.buyer_country_id.toLowerCase() === undefined || this.state.buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase()!='in' && getCookie('country_code').toLowerCase()!='us' )) ) )? ( */}
              {Array.isArray(item.price) && item.price.length > 0 ? (
                <div className="single-product-tables detail-section py-2">
                  <table>
                    <tbody>
                      <tr>
                        <td>{translate("Quantity")}:</td>
                        <td className="rounded">
                          <div style={{ borderRadius: "5px" }}>
                            <div className="qty-box ml-1">
                              <div
                                className="input-group"
                                style={{ marginLeft: "-54px" }}
                              >
                                <span className="input-group-prepend">
                                  <button
                                    type="button"
                                    className="btn quantity-left-minus"
                                    onClick={this.minusQty}
                                    data-type="minus"
                                    data-field=""
                                    style={{
                                      borderTopLeftRadius: "12px",
                                      borderBottomLeftRadius: "12px",
                                      border: "1px solid #ef7b00",
                                    }}
                                  >
                                    <i className="fa fa-minus" />
                                  </button>
                                </span>
                                <NumberFormat
                                  format="####"
                                  name="quantity"
                                  value={this.state.quantity}
                                  onChange={this.changeQty}
                                  className="form-control input-number"
                                  style={{
                                    borderTop: "1px solid #ef7b00",
                                    borderBottom: "1px solid #ef7b00",
                                  }}
                                />
                                {/* <input type="text" name="quantity" value={this.state.quantity} onChange={this.changeQty}  /> */}
                                <span
                                  className="input-group-prepend"
                                  style={{ marginRight: "-32px" }}
                                >
                                  <button
                                    type="button"
                                    className="btn quantity-right-plus"
                                    onClick={this.plusQty}
                                    data-type="plus"
                                    data-field=""
                                    style={{
                                      borderTopRightRadius: "12px",
                                      borderBottomRightRadius: "12px",
                                      border: "1px solid #ef7b00",
                                    }}
                                  >
                                    <i className="fa fa-plus" />
                                  </button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {/* <tr>   
                    <td><a href="javascript:void(0)" className="text-solid"><small> <i className="fa fa-paper-plane mr-1"></i>Calculate Shipment Cost </small></a></td>
                  </tr> */}
                    </tbody>
                  </table>
                </div>
              ) : (
                ""
              )}
            </div>
            {/* <div className="col-lg-4">
              <div className="font-weight-bold">
                {this.state.currency}{" "}
                {new Intl.NumberFormat().format(this.state.eachunit)} /{" "}
                {item.unit}
              </div>
            </div> */}
            {/* {this.state.gst_val != null ? (
              <div className="col-lg-4">
                <span className="h6 mouse_pointer" onClick={this.openPrcieCard}>
                  {this.state.gst_val}% GST + GST Charges
                </span>
              </div>
            ) : (
              ""
            )} */}
          </div>
          <div className="d-flex align-items-end d-sm-block d-none">
            <div className="px-1">
              {this.state.qtyerror ? (
                <div className="text-danger">
                  {item.offer_stock == 0
                    ? `OUT OF STOCK`
                    : `only ${item.offer_stock} stock left!`}
                </div>
              ) : (
                // :(this.state.min_qty_error)?(
                //   <div className="text-danger">
                //        {`MOQ ${this.state.min_qty} ${this.state.unit}`}
                //   </div>
                // )
                ""
              )}
              <div
                className={`alert alert-danger ${
                  this.state.moqErr ? "d-block" : "d-none"
                }`}
              >
                <i className="fa fa-info-circle mr-1" /> Order must be greater
                than MOQ {item.qty} {item.unit}
              </div>

              {/* {( this.state.quantity && (item.beldara_prime == 1 || ((this.state.buyer_country.toLowerCase() != 'us' && this.state.buyer_country_id != '1' && this.state.buyer_country.toLowerCase() != 'in' && this.state.buyer_country_id != '91') || ( (this.state.buyer_country_id.toLowerCase() == '' || this.state.buyer_country_id.toLowerCase() === undefined || this.state.buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase()!='in' && getCookie('country_code').toLowerCase()!='us' )) ) ) ? (
                <GetPriceSelected product={item} qty={this.state.quantity} />
              ) : (
                ""
                )} */}

              {/* {this.state.quantity ? (
                // <GetPriceSelected productCost={this.productCost}
                // finalCost={this.finalCost} product={item} qty={this.state.quantity} />
                <div className="border-product text-center border-0 ">
                  <span>
                    <div class="timer-cal">
                      {this.state.quantity} {this.state.unit} is selected
                    </div>
                    <div class="timer-cal">
                      <div>
                        <div class="font-weight-bold">
                          {this.state.price > 0 ? (
                            <>
                              <div
                                class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                                role="status"
                                style={{ color: "#f1aa61" }}
                              >
                                <span class="sr-only">Loading...</span>
                              </div>
                              {this.state.currency} {this.state.price}
                            </>
                          ) : (
                            "Ask for price"
                          )}
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              ) : (
                ""
              )} */}
              {/* <OfferTimer
                offer_from_date={item.offer_from_date}
                offer_to_date={item.offer_to_date}
              /> */}
            </div>
          </div>
          {this.state.msgNotifyME ? (
            <div
              className="alert alert-info toast_pull_right-1"
              role="alert"
              id="msgNotifyME"
            >
              {this.state.NotifyMessage}
            </div>
          ) : (
            ""
          )}
          <div className="mb-3">
            {this.props.item.is_active == "1" ? (
              <div>
                {priceCond(
                  item,
                  this,
                  this.state.pincodeDeliverable,
                  this.state.pincode
                )}
              </div>
            ) : (
              <>
                <div className="p-0 mx-2 productBorder">
                  <h5
                    className="p-text-color px-1"
                    style={{ marginTop: "4px" }}
                  >
                    Product Unavailable
                  </h5>
                </div>
                <div
                  className="d-sm-none p-0"
                  style={{
                    position: "fixed",
                    bottom: "0px",
                    left: "0px",
                    right: "0",
                    zIndex: "9999",
                  }}
                >
                  {" "}
                  <button
                    className="btn btn-solid px-1 w-100"
                    style={{ backgroundSize: "781" }}
                  >
                    Product Unavailable
                  </button>
                </div>
              </>
            )}

            {/* {(item.available_stock !== "0" && item.available_stock > 0) ||
              item.offer_stock > 0 ||
              item.offer_stock == null ? (
                this.props.item.is_active == "1" ? (
                  <div style={{ marginLeft: "100px" }}>
                    {priceCond(
                      item,
                      this,
                      this.state.pincodeDeliverable,
                      this.state.pincode
                    )}
                  </div>
                ) : (
                  <div className="dangerBorder" style={{ marginLeft: "80px" }}>
                    <h5 className="text-danger px-1">Product Unavailable</h5>
                  </div>
                )
              ) : (
                <div
                  className="d-flex justify-content-between"
                  style={{ marginLeft: "46px" }}
                >
                  <div className="dangerBorder mr-1">
                    <h5
                      className="text-danger mr-1 px-1"
                      style={{ borderRadius: "4px", marginTop: "6px" }}
                    >
                      Out Of Stock
                    </h5>
                  </div>
                  <div className="mr-1">
                    <button
                      className="btn btn-solid mr-1"
                      onClick={this.NotifyMe}
                      id="expressCheckOut"
                      clickevent="Express_checkout"
                    >
                      {" "}
                      Notify Me{" "}
                    </button>
                  </div>
                </div>
              )} */}
            {/* {this.state.product_mrp !== null &&
            this.state.selling_price !== null ? (
              <div className="col-sm-9 col-md-9">
                <div className="row">
                  <div className="col font-weight-bold">
                    {this.state.currency}{" "}
                    {new Intl.NumberFormat().format(this.state.eachunit)} /{" "}
                    {item.unit}
                  </div>
                  <div className="col">
                    MRP {this.state.currency}{" "}
                    {new Intl.NumberFormat().format(this.state.product_mrp)}
                  </div>
                  <div className="col">
                    Retail Margin:{" "}
                    {parseFloat(
                      ((parseFloat(this.state.product_mrp) -
                        parseFloat(this.state.selling_price)) /
                        parseFloat(this.state.product_mrp)) *
                        100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              </div>
            ) : (
              ""
            )} */}
            {/* <button className="btn btn-solid ml-2 my-2" onClick={this.create_wishlist} id="wishlist_product" clickevent="add_to_wishlist"> Wishlist </button> */}
          </div>
          <div className="border-product mb-3">
            <h6 className="product-title text-dark">
              <strong>{translate("100% SECURE PAYMENT")}</strong>
            </h6>
            <div className="payment-card-bottom">
              <ul>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/icon/visa.png`}
                      alt="beldara.com"
                      className="mr-3"
                    />
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/icon/mastercard.png`}
                      alt="beldara.com"
                      className="mr-3"
                    />
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/icon/paypal.png`}
                      alt="beldara.com"
                      className="mr-3"
                    />
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/icon/american-express.png`}
                      alt="beldara.com"
                      className="mr-3"
                    />
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/icon/discover.png`}
                      alt="beldara.com"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div id="pincodemodule" className="row">
            <>
              <form className="d-flex align-items-center mb-2 mt-2">
                {/* <div className="justify-content-center">
                    <img
                      className="imglocation"
                      src="https://img.beldara.com/images/location_marker.png"
                      alt="location"
                    />has-label-float 
                  </div> */}
                <div className="has-float-label col-sm-8 col-xs-8 col-md-8">
                  <NumberFormat
                    id="pincode"
                    name="pincode"
                    placeholder="pincode"
                    className={`banner form-control input-number rounded`}
                    value={this.state.pincode}
                    onChange={this.ChangePincode.bind(this)}
                    onKeyPress={this.allowPincode.bind(this)}
                  />
                  {/* <label htmlFor="pincode" className="mx-2">
                      {"Enter Pincode"}
                    </label> */}
                  {this.validator.message(
                    "pincode",
                    this.state.pincode,
                    `required|numeric`
                  )}
                </div>
                <div>
                  {!this.state.pincodeValidate ? (
                    <span
                      className="mouse_pointer btn btn-solid"
                      onClick={this.checkZipCode.bind(this, null)}
                    >
                      CHECK
                    </span>
                  ) : (
                    <div className="col-md-1 col-sm-1 col-sm-1">
                      <span
                        className="change-pincode-button p-1 mouse_pointer btn btn-solid"
                        onClick={this.checkPincodeAgain}
                      >
                        CHANGE
                      </span>
                    </div>
                  )}
                </div>
              </form>
              <p id="error_pincode" className="text-danger d-none">
                Please enter valid pincode
              </p>
            </>
            {this.state.pincodeValidate ? (
              <>
                <div className="mx-3">
                  <div className="row">
                    {/* <div className="col-md-12"> */}
                    <div className="col-md-9 col-sm-9 col-sm-9 mt-3 justify-content-center">
                      {/* <div className="justify-content-center"> */}
                      {/* <img
                      className="imglocation"
                      src="https://img.beldara.com/images/location_marker.png"
                      alt="location"
                    /> */}
                      <span>
                        <strong>
                          DELIVERY OPTIONS FOR{" "}
                          <span className="p-text-color">
                            {this.state.pincode}
                          </span>
                        </strong>
                      </span>
                      {/* </div> */}
                    </div>
                    {/* </div> */}
                  </div>
                  {this.state.pincodeDeliverable ? (
                    <div className="row">
                      <div className="col-sm-12 col-xs-12 col-md-12 mt-3 d-flex align-items-center">
                        <p>
                          Shipping To:{" "}
                          <strong>{this.state.pincodeTitle}</strong>
                        </p>
                      </div>
                      {this.state.pincodeMsg.map((value, index) => (
                        <React.Fragment>
                          <div className="col-sm-12 col-xs-12 col-md-12 d-flex align-items-center">
                            <i
                              className="success-mark"
                              style={{ marginBottom: "13px" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 18.35"
                              >
                                <title>checkmark</title>
                                <path
                                  d="M21.13 0L8.48 12.65 2.87 7.04 0 9.91l7.53 7.53 1 .91.95-.91L24 2.87z"
                                  fill="#4fcc71"
                                ></path>
                              </svg>
                            </i>
                            <p className="mx-1">{value}</p>
                          </div>
                        </React.Fragment>
                      ))}
                      {/* <div className="col-sm-12 col-xs-12 col-md-12 px-1 m-0 d-flex align-items-center">
                                  <i class="success-mark"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18.35"><title>checkmark</title><path d="M21.13 0L8.48 12.65 2.87 7.04 0 9.91l7.53 7.53 1 .91.95-.91L24 2.87z" fill="#4fcc71"></path></svg></i>
                                  <p className="mx-1">Information not found for entered pincode</p>
                                </div> */}
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-sm-12 col-xs-12 col-md-12 p-0 m-0 d-flex align-items-center">
                        <i class="cross-mark p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <title>cross</title>
                            <path
                              d="M3 0L0 3l9 9-9 9 3 3 9-9 9 9 3-3-9-9 9-9-3-3-9 9z"
                              fill="#fc0006"
                            ></path>
                          </svg>
                        </i>
                        <p>{this.state.pincodeTitle}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="accordion" id="accordionExample">
            {/* Surface Or Ocean*/}
            {this.state.buyer_country_id == item.countryid ||
            (parseInt(this.state.buyer_country_id) == 91 &&
              (item.countryid == "" ||
                item.countryid === undefined ||
                item.countryid === null)) ? (
              <React.Fragment>
                {/* <div className="card py-0 border  shadow-none">
                              <div className="card-header py-0" id="headingTwo">
                                <h2 className="mb-0">
                                  <button
                                    className="btn btn-link collapsed"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                  >
                                    <img
                                      src={`${imgUrl}/images/beldara-express.png`}
                                      className="mr-1"
                                      style={{ width: "40px" }}
                                    />{" "}
                                    Delivery within 2-5 days
                                  </button>
                                </h2>
                              </div>
                              <div
                                id="collapseTwo"
                                className="collapse"
                                aria-labelledby="headingTwo"
                                data-parent="#accordionExample"
                              >
                                <div className="card-body">
                                  <div> - Delivery within 2-5 days</div>
                                  <div> - Get your own logistics team</div>
                                  <div> - Make deliveries via air shipments</div>
                                  <div> - Complete logistics support</div>
                                  <div> - handling the tedious custom clearance</div>
                                  <div> - Access to a shipping expert</div>
                                </div>
                              </div>
                            </div> */}
                {/* <div className="py-0  shadow-none mt-3">
                  <div className="py-0" id="headingThree">
                    <h2 className="mb-0">
                      <button
                        className="btn  collapsed"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        <i
                          style={{ fontSize: "30px", color: "#ff9944" }}
                          className="fa fa-truck mr-3"
                          aria-hidden="true"
                        ></i>
                        Delivery within 7 days
                      </button>
                    </h2>
                  </div>
                  <div
                    id="collapseThree"
                    className="collapse"
                    aria-labelledby="headingThree"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <div> - Delivery within 7 days</div>
                      <div> - Complete logistics support</div>
                    </div>
                  </div>
                </div>
                <div className="py-0 shadow-none">
                  <div className="py-0" id="headingfour">
                    <h2 className="mb-0">
                      <button
                        className="btn collapsed"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapsefour"
                        aria-expanded="false"
                        aria-controls="collapsefour"
                      >
                        <i
                          style={{ fontSize: "30px", color: "#ff9944" }}
                          className="fa fa-undo mr-3"
                          aria-hidden="true"
                        ></i>
                        Return Policy
                      </button>
                    </h2>
                  </div>
                  <div
                    id="collapsefour"
                    className="collapse"
                    aria-labelledby="headingfour"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <div> - Return with in 10 days of delivery</div>
                      <div>
                        {" "}
                        - Return pickup time with in 72 hours hours return
                        booking
                      </div>
                      <div>
                        {" "}
                        - Get money refunded with in 48 hours if pickup
                      </div>
                      <div>
                        <a target="blank" href="/return-policy.html">
                          {" "}
                          View all{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div> */}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* <div className="card py-0 border  shadow-none">
                              <div className="card-header py-0" id="headingTwo">
                                <h2 className="mb-0">
                                  <button
                                    className="btn btn-link collapsed"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                  >
                                    <img
                                      src={`${imgUrl}/images/beldara-express.png`}
                                      className="mr-1"
                                      style={{ width: "40px" }}
                                    />{" "}
                                    Delivery within 4-8 days
                                  </button>
                                </h2>
                              </div>
                              <div
                                id="collapseTwo"
                                className="collapse"
                                aria-labelledby="headingTwo"
                                data-parent="#accordionExample"
                              >
                                <div className="card-body">
                                  <div> - Delivery within 4-8 days</div>
                                  <div> - Get your own logistics team</div>
                                  <div> - Make deliveries via air shipments</div>
                                  <div> - Complete logistics support</div>
                                  <div> - handling the tedious custom clearance</div>
                                  <div> - Access to a shipping expert</div>
                                </div>
                              </div>
                            </div> */}
                {/* <div className="card py-0 border shadow-none">
                              <div className="card-header py-0" id="headingThree">
                                <h2 className="mb-0">
                                  <button
                                    className="btn btn-link collapsed"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseThree"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                  >
                                    <img
                                      src={`${imgUrl}/images/beldara-ocean.png`}
                                      className="mr-1"
                                      style={{ width: "40px" }}
                                    />{" "}
                                    Delivery within 45-60 days
                                  </button>
                                </h2>
                              </div>
                              <div
                                id="collapseThree"
                                className="collapse"
                                aria-labelledby="headingThree"
                                data-parent="#accordionExample"
                              >
                                <div className="card-body">
                                  <div> - Delivery within 45-60 days</div>
                                  <div> - Provision of sea shipments</div>
                                  <div> - Complete logistics support</div>
                                  <div> - Handling the tedious custom clearance</div>
                                </div>
                              </div>
                            </div> */}
                <div className="card py-0 border shadow-none">
                  <div className="card-header py-0" id="headingThree">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link collapsed"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        <i
                          style={{ fontSize: "20px" }}
                          className="fa fa-truck mr-3"
                          aria-hidden="true"
                        ></i>
                        Delivery in 6 hours
                      </button>
                    </h2>
                  </div>
                  <div
                    id="collapseThree"
                    className="collapse"
                    aria-labelledby="headingThree"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <div> - Delivery in 6 business hours</div>
                      <div> - Easy return and refund</div>
                      <div> - 24 X 7 Support</div>
                    </div>
                  </div>
                </div>
                <div className="card py-0 border shadow-none">
                  <div className="card-header py-0" id="headingfour">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link collapsed"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapsefour"
                        aria-expanded="false"
                        aria-controls="collapsefour"
                      >
                        <i
                          style={{ fontSize: "30px" }}
                          className="fa fa-undo mr-3"
                          aria-hidden="true"
                        ></i>
                        Return Policy
                      </button>
                    </h2>
                  </div>
                  <div
                    id="collapsefour"
                    className="collapse"
                    aria-labelledby="headingfour"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <div> - Return with in 1 days of delivery</div>
                      <div>
                        {" "}
                        - Return pickup time with in 48 hours hours return
                        booking
                      </div>
                      <div>
                        {" "}
                        - Get money refunded with in 48 hours if pickup
                      </div>
                      <div>
                        <a target="blank" href="/return-policy.html">
                          {" "}
                          View all{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div>
            {/* <div
              className="d-sm-none row"
              style={{
                position: "fixed",
                bottom: "0px",
                left: "0px",
                right: "0",
                zIndex: "9999",
                height: "60px",
              }}
            >
              <button className="btn btn-solid w-50">Add to cart</button>
              <button className="btn btn-solid w-50">Buy Now</button>
            </div> */}
          </div>
          {/* <div className="row ">
            <div
              className="d-block d-sm-none d-flex"
              style={{
                position: "fixed",
                bottom: "0px",
                left: "0px",
                right: "0",
                zIndex: "9999",
                height:"60px"
              }}
            >
              <button className="btn btn-solid w-50">Out of Stock</button>
              <button className="btn btn-solid w-50">Notify Me</button>
            </div>
          </div> */}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  symbol: state.data.symbol,
  currencyValue: state.currencyValue.currencyValue,
  user: state.user,
  chatToSeller: state.chatToSeller,
  holeData: state,
});
export default withRouter(
  withTranslate(
    connect(mapStateToProps, {
      getAllCurrencyValue,
      getCartLength,
      getUpdateUser,
    })(Details)
  )
);
