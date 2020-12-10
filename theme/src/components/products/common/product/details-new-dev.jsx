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
import { getCookie, captureEvent, setCookie } from "../../../../functions";
import { imgUrl, apiUrl, betaApi } from "../../../../constants/variable";
// import StarReview from "./rating";
import StarReview from "../../../collection/common/rating";
import axios from "axios";
import { getAllCurrencyValue, getChatWithSupplier } from "../../../../actions";
import ReactPixel from "react-facebook-pixel";
import $ from "jquery";
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

  if (dataCond == 1 && (item.offer_stock > 0 || item.offer_stock == null)) {
    return (
      <React.Fragment>
        <div>
          {/* <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Add To Cart </button>  */}
          {deliverable ? (
            <button
              className="btn btn-solid my-2 ml-2 "
              onClick={ele.validate}
              id="expressCheckOut"
              clickevent="Express_checkout"
            >
              {" "}
              Buy Now{" "}
            </button>
          ) : (
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
                className="btn btn-solid my-2 ml-2 "
                onClick={ele.validate}
                id="expressCheckOut"
                clickevent="Express_checkout"
              >
                {" "}
                Buy Now{" "}
              </button>
            </OverlayTrigger>
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
    return (
      <React.Fragment>
        <Link
          onClick={() => ele.event_ask_for_price("ask_for_price")}
          id="ask_for_price"
          className="btn btn-solid my-2"
          clickevent="Ask_for_price"
          to={{ pathname: "/post-requirement.html", state: item }}
        >
          Contact Supplier
        </Link>
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
      // price_array: []
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
        this.offerExist(
          this.props.item.offer_from_date,
          this.props.item.offer_to_date
        ) &&
        parseInt(this.state.quantity - 1) <
          parseInt(this.props.item.offer_min_qty)
      ) {
        // await this.setState({
        //   qtyerror:true
        // })
      } else {
        if (
          this.state.quantity > 0 &&
          this.state.quantity > this.state.min_qty
        ) {
          // this.setState({stock: 'InStock'})
          await this.setState({
            quantity: this.state.quantity - 1,
            qtyerror: false,
          });
          this.CartCalc();
          this.getProdDetails(
            this.state.currencySymbol,
            this.state.country_code
          );
        } else {
          await this.setState({
            moqErr: true,
          });
        }
      }
    }
  };

  plusQty = async () => {
    if (this.props.item.offer_stock != 0) {
      if (
        this.offerExist(
          this.props.item.offer_from_date,
          this.props.item.offer_to_date
        ) &&
        parseInt(this.state.quantity + 1) >
          parseInt(this.props.item.offer_stock)
      ) {
        await this.setState({
          qtyerror: true,
        });
      } else {
        await this.setState({ quantity: this.state.quantity + 1 });
        if (this.state.quantity >= this.props.item.qty) {
          await this.setState({
            moqErr: false,
            qtyerror: false,
          });
        }
        this.CartCalc();
        this.getProdDetails(this.state.currencySymbol, this.state.country_code);
      }
    }
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
      console.log("changeQty", cqty);
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
    // console.log('componentDidMount', nextProps, this.props)
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

    const tagManagerArgs = {
      gtmId: "GTM-5HBBK96", //gtmId: 'UA-57225000-1',
      // dataLayerName: "GTM-5HBBK96",
      events: {
        send_to: "AW-724875220/AfpTCL3st7ABENTv0tkC", //send_to: 'AW-803807171/IHhPCKqLwYgBEMO_pP8C',
        value: this.state.price,
        currency: "USD",
        aw_remarketing_only: true,
      },
    };
    TagManager.initialize(tagManagerArgs);
    var pincode = getCookie("pincode");
    if (pincode !== "" && pincode !== null) {
      this.checkZipCode(pincode);
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
    if (
      this.state.currencySymbol != nextProps.symbol ||
      this.state.country_code != getCookie("country_code")
    ) {
      this.getProdDetails(getCookie("currency"), getCookie("country_code"));
    }

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
    let id = e.target.id;

    if (
      this.state.quantity >= this.props.item.qty &&
      this.state.quantity > 0 &&
      this.state.pincodeDeliverable
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
    axios
      .post(
        "https://api.beldara.com/common/create_cart_test.php",
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
        // if (!this.state.moqErr) {
        //   id == 'expressCheckOut' ?
        //   this.goToExpressCheckout()
        //   : ls.get("sellerid") ?
        //   this.goToStartOrder()
        //    :
        //    this.goToLogin(id)

        // }

        if (!this.state.moqErr) {
          id == "expressCheckOut"
            ? this.goToStartOrder()
            : // this.goToExpressCheckout()
              this.goToStartOrder();
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

    this.props.history.push({
      pathname: "/cart.html",
    });
  };

  create_wishlist = (e) => {
    axios
      .post(
        "https://api.beldara.com/common/create_wishlist.php",
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
        `${apiUrl}get_products_details_test.php`,
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
      var pincode = document.getElementById("pincode").value;
    }
    if (pincode == "") {
      ele.classList.remove("d-none");
    } else {
      // console.log(this.props.item.id,877);
      axios
        .post(
          `${imgUrl}/beta_api/validate-pincode-deliverable.php`,
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

    return (
      <div className="col-lg-8">
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

        <div className="product-right product-description-box">
          {/* <h5> {item_name ? item_name.replace(/[^a-zA-Z ]/g, "") : ""} </h5> */}
          <h5> {item_name ? item_name : ""} </h5>
          <div className="d-flex align-items-center mt-2 border-bottom">
            <div className="">
              Sold by:{" "}
              {this.props.item.surl !== undefined &&
              this.props.item.surl != "" ? (
                <a
                  className="h6"
                  href={`/store/${this.props.item.surl}.html`}
                  target="_blank"
                >
                  {item.company}
                  {item.country !== null && item.country !== undefined
                    ? "/" + item.country
                    : ""}
                </a>
              ) : (
                <span className="h6">
                  {item.company}
                  {item.country !== null && item.country !== undefined
                    ? "/" + item.country
                    : ""}
                </span>
              )}
            </div>
            <div className="mx-3">
              {this.props.item.company && this.props.item.is_active == "1" ? (
                <ReactCSSTransitionGroup
                  transitionName="example"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={600}
                >
                  <div
                    className="py-1"
                    style={{ color: "#ff9944", cursor: "pointer" }}
                    onClick={this.chatBtn}
                    id="chatBtn"
                  >
                    <i className="fa fa-comments mr-1" /> Chat with supplier
                  </div>
                </ReactCSSTransitionGroup>
              ) : (
                ""
              )}
            </div>
          </div>
          <a onClick={this.ScrollTospec} className="mouse_pointer text-primary">
            Show description/specification
          </a>
          {this.props.reviewCount && this.props.reviewCount > 0 ? (
            <React.Fragment>
              <div className="d-flex mt-2">
                <span>Product Rating ({this.props.reviewCount})</span>
                <StarReview
                  dataFromRating={this.props.dataFromRating}
                  page={`${process.env.PUBLIC_URL}/rating/${item.url}.html`}
                  avgRating={this.props.avgRating}
                  item={item}
                  average={true}
                  readonly={true}
                />
              </div>
            </React.Fragment>
          ) : (
            ""
          )}
          <div className="row mt-2 align-items-center border-bottom">
            <div className="col-lg-6">
              {item.price.length > 0 ? (
                <div className="timer border-product w-100 p-0 m-auto text-center">
                  <div id="demo" className=" py-2 ">
                    {item.offer_price !== null &&
                    item.offer_mrp_price !== null &&
                    item.offer_from_date !== null &&
                    item.offer_to_date !== null &&
                    this.offerExist(
                      item.offer_from_date,
                      item.offer_to_date
                    ) ? (
                      <div class="mx-auto">
                        <div className="time-cal">
                          <del className="d-flex justify-content-center">
                            MRP:<div>&nbsp;</div>
                            {this.state.mrp_price > 0
                              ? `${this.state.currency} ${this.state.mrp_price} ${item.offer_unit}`
                              : ""}
                          </del>
                          <div className="d-flex justify-content-center">
                            Offer:<div>&nbsp;</div>
                            {this.state.offer_price > 0
                              ? `${this.state.currency} ${this.state.offer_price} ${item.offer_unit}`
                              : "Ask for price"}
                          </div>
                        </div>
                        <div className="time-cal">
                          {item.offer_stock > 0 ? (
                            `Instock: ${item.offer_stock} ${item.offer_unit}`
                          ) : (
                            <div className="d-flex justify-content-center text-danger">
                              OUT OF STOCK
                            </div>
                          )}
                        </div>
                      </div>
                    ) : this.state.price_array != undefined ? (
                      this.state.price_array.map((vari, index) => (
                        <React.Fragment key={index}>
                          <span>
                            <div class="timer-cal">{`${vari.rangestart}-${vari.rangeend} ${this.state.unit}`}</div>
                            <div class="timer-cal">
                              <div>
                                <div
                                  class={`font-weight-bold ${vari.eachunit}`}
                                >
                                  {vari.eachunit > 0
                                    ? `${
                                        vari.currency
                                      }-${new Intl.NumberFormat().format(
                                        vari.eachunit
                                      )}`
                                    : "Ask for price"}
                                  {}
                                </div>
                              </div>
                            </div>
                          </span>
                          {/* </div> */}
                          {/* </span> */}
                        </React.Fragment>
                      ))
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-lg-6" id="pincodemodule">
              {!this.state.pincodeValidate ? (
                <>
                  <form className="d-flex align-items-center mb-2">
                    <div className="justify-content-center">
                      <img
                        className="imglocation"
                        src="https://img.beldara.com/images/location_marker.png"
                        alt="location"
                      />
                    </div>
                    <div className="has-float-label col-sm-11 col-xs-11 col-md-11">
                      <NumberFormat
                        id="pincode"
                        name="pincode"
                        placeholder=" "
                        className="form-control input-number"
                        value={this.state.pincode}
                        onChange={this.ChangePincode.bind(this)}
                        onKeyPress={this.allowPincode.bind(this)}
                      />
                      <label htmlFor="pincode" className="mx-2">
                        {"Enter Pincode"}
                      </label>
                      {this.validator.message(
                        "pincode",
                        this.state.pincode,
                        `required|numeric`
                      )}
                    </div>
                    <div className="col-sm-1 col-md-1 col-sx-1 p-0 adjust-content">
                      <span
                        className="p-text-color mouse_pointer"
                        onClick={this.checkZipCode.bind(this, null)}
                      >
                        CHECK
                      </span>
                    </div>
                  </form>
                  <p id="error_pincode" className="text-danger d-none">
                    Please enter valid pincode
                  </p>
                </>
              ) : (
                <>
                  <div className="row">
                    {/* <div className="col-md-12"> */}
                    <div className="col-md-9 col-sm-9 col-sm-9 p-0">
                      {/* <div className="justify-content-center"> */}
                      <img
                        className="imglocation"
                        src="https://img.beldara.com/images/location_marker.png"
                        alt="location"
                      />
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
                    <div className="col-md-1 col-sm-1 col-sm-1 m-0 p-0">
                      <span
                        className="p-text-color change-pincode-button p-1 mouse_pointer"
                        onClick={this.checkPincodeAgain}
                      >
                        CHANGE
                      </span>
                    </div>
                    {/* </div> */}
                  </div>
                  {this.state.pincodeDeliverable ? (
                    <div className="row">
                      <div className="col-sm-12 col-xs-12 col-md-12 px-1 m-0 d-flex align-items-center">
                        <p>
                          Shipping To:{" "}
                          <strong>{this.state.pincodeTitle}</strong>
                        </p>
                      </div>
                      {this.state.pincodeMsg.map((value, index) => (
                        <React.Fragment>
                          <div className="col-sm-12 col-xs-12 col-md-12 px-1 m-0 d-flex align-items-center">
                            <i className="success-mark">
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
                </>
              )}
            </div>
          </div>
          <div id="hide_general" className="row mt-2 align-items-center mx-1">
            <div className="col-lg-4">
              {/* {(item.price.length > 0 && (item.beldara_prime == 1 || ((this.state.buyer_country.toLowerCase() != 'us' && this.state.buyer_country_id != '1' && this.state.buyer_country.toLowerCase() != 'in' && this.state.buyer_country_id != '91') || ( (this.state.buyer_country_id.toLowerCase() == '' || this.state.buyer_country_id.toLowerCase() === undefined || this.state.buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase()!='in' && getCookie('country_code').toLowerCase()!='us' )) ) )? ( */}
              {Array.isArray(item.price) && item.price.length > 0 ? (
                <div className="single-product-tables detail-section py-2">
                  <table>
                    <tbody>
                      <tr>
                        <td>{translate("Price")}:</td>
                        <td>
                          <div className="qty-box">
                            <div className="input-group">
                              <span className="input-group-prepend">
                                <button
                                  type="button"
                                  className="btn quantity-left-minus"
                                  onClick={this.minusQty}
                                  data-type="minus"
                                  data-field=""
                                >
                                  <i className="fa fa-minus" />
                                </button>
                              </span>
                              <NumberFormat
                                name="quantity"
                                value={this.state.quantity}
                                onChange={this.changeQty}
                                className="form-control input-number"
                              />
                              {/* <input type="text" name="quantity" value={this.state.quantity} onChange={this.changeQty}  /> */}
                              <span className="input-group-prepend">
                                <button
                                  type="button"
                                  className="btn quantity-right-plus"
                                  onClick={this.plusQty}
                                  data-type="plus"
                                  data-field=""
                                >
                                  <i className="fa fa-plus" />
                                </button>
                              </span>
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
              <div className="text-center">
              {this.state.product_mrp !== null &&
              this.state.selling_price !== null ? (
                <div className="row">
                  <div className="col font-weight-bold">
                    {this.state.currency}{" "}
                    {new Intl.NumberFormat().format(this.state.eachunit)} /{" "}
                    {item.unit}
                  </div>
                </div>
              ):('')}
              </div>
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

          <div className="d-flex align-items-end">
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
          <div className="row d-flex justify-content-end align-items-center mt-2" style={{marginLeft: "10px"}}>
            {/* <div>
              Shipping Charges:{` `}
              {this.state.currency} {this.state.shipping_cost}
            </div> */}
            {this.state.gst_val != null ? (
              <div
                id="prices_cards"
                className="bg-grey float-left col-sm-5 text-center productBorder"
              >
                <div className="row justify-content-between mx-2">
                  <div className="float-left">Price of items</div>
                  <div className="float-right">
                    {this.state.currency}{" "}
                    {/* {parseFloat(
                      parseFloat(this.state.price) -
                        parseFloat(this.state.gst_cal)
                    ).toFixed(2)} */}
                    {new Intl.NumberFormat().format(
                      parseFloat(
                        parseFloat(this.state.price) -
                          parseFloat(this.state.gst_cal)
                      ).toFixed(2)
                    )}
                  </div>
                </div>
                <div className="row justify-content-between mx-1">
                  <div className="float-left">GST @ {this.state.gst_val}%</div>
                  <div className="float-right">
                    {this.state.currency}{" "}
                    {new Intl.NumberFormat().format(
                      parseFloat(this.state.gst_cal).toFixed(2)
                    )}
                  </div>
                </div>
                <HRLine color="#0e0e0e" />
                <div className="row justify-content-between mx-1">
                  <div className="float-left">Final Price</div>
                  <div className="float-right">
                    {this.state.currency}{" "}
                    {new Intl.NumberFormat().format(
                      parseFloat(this.state.price).toFixed(2)
                    )}
                    {/* {parseFloat(this.state.price).toFixed(2)} */}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          <div className="float-right col-sm-2"></div>

          {this.state.product_mrp !== null &&
            this.state.selling_price !== null ? (
              <div
                id="prices_cards"
                className="bg-grey float-left col-sm-5 text-center productBorder"
              >
                <div className="row justify-content-between mx-2">
                <div className="row">
                  <div className="col">
                    MRP {this.state.currency}{" "}
                    {new Intl.NumberFormat().format(this.state.product_mrp)}
                  </div>
                </div>
                  
                </div>
                <HRLine color="#0e0e0e" />
                <div className="row justify-content-between mx-1">
                  
                <div className="row">
                  <div className="col">
                    Retail Margin:{" "}
                    {/* {parseFloat(
                    (parseFloat(this.state.product_mrp) -
                      parseFloat(this.state.selling_price)) /
                      (parseFloat(this.state.product_mrp) * 0.01).toFixed(2)
                  ).toFixed(2)} */}
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
              </div>
            ) : (
              ""
            )}

            
          
          </div>
          <ProductVariation
            getProdDetl={this.getProdDetails}
            prodId={item.id}
            variation={this.state.variation}
            disptach_product={this.props.dispatch_variant_products}
            deliverable={this.state.pincodeDeliverable}
            pincode={this.state.pincode}
            product_mrp={this.state.product_mrp}
            selling_price={this.state.selling_price}
            prodData={item}
          />
          <div
            className="d-flex justify-content-left align-items-center"
            id="general_products_event"
            style={{marginLeft: "85px"}}
          >
            {this.props.item.is_active == "1" ? (
              priceCond(
                item,
                this,
                this.state.pincodeDeliverable,
                this.state.pincode
              )
            ) : (
              <div className="p-0 mx-2 dangerBorder">
                <h5 className="text-danger px-1">Product Unavailable</h5>
              </div>
            )}
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
          <div className="col-sm-12 col-lg-12">
            <DetailsTopTabs item={item} />
          </div>
          <LiveReq
            price={item}
            askAuction={this.state.askAuctionInit}
            shouldReload={this.state.shouldReload}
            showAuctionPop={this.state.showAuctionPop}
            undoCallAuction={this.undoCallAuction}
          />
          <div className="border-product d-none">
            <h6 className="product-title">{translate("Share It")}</h6>
            <div className="product-icon">
              <ul className="product-social">
                <li>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="nofollow"
                  >
                    <i className="fa fa-facebook" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://plus.google.com/discover"
                    target="_blank"
                    rel="nofollow"
                  >
                    <i className="fa fa-google-plus" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/" target="_blank" rel="nofollow">
                    <i className="fa fa-twitter" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="nofollow"
                  >
                    <i className="fa fa-instagram" />
                  </a>
                </li>
              </ul>
              {/* <button className="wishlist-btn" onClick={() => addToWishlistClicked(item)}>
                                    <i className="fa fa-heart"></i><span className="title-font">Add To WishList</span>
                                </button> */}
            </div>
          </div>
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
  withTranslate(connect(mapStateToProps, { getAllCurrencyValue })(Details))
);
