import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import ls from "local-storage";
import RazorpayForm from "../razorpayForm/razorpayPayTokenAndAll";
import $ from "jquery";
import "./start-order.css";
import { ApiUrl, ImgUrl, SellerUrl } from "../../constants/ActionTypes";
import Paytm from "../payment-gateway/paytm-new";
import PaytmToken from "../payment-gateway/paytm-new-token";
import PayOnDelivery from "../payment-gateway/pay-on-delivery";
import { captureEvent, getCookie, setCookie, showToast } from "../../functions";
import { priceConversion, minTresholdBarrier } from "../../services";
import IntlTelInput from "react-intl-tel-input";
import ReactPixel from "react-facebook-pixel";
import "../../index.scss";
import "react-intl-tel-input/dist/main.css";
import index from "../adduser";
import { apiUrl, betaApi, imgUrl } from "../../constants/variable";
import Modal from "react-responsive-modal";
import Table from "react-bootstrap/Table";
import { isMobile } from "react-device-detect";
import store from "../../store";

// import {
//   getCartTotal,
//   getShippingCost,
//   getTotalCartValue,
//   getTotalShippingCost
// } from "../../services";
import { getCartLength } from "../../actions";
// import store from "../../store";

var complete_address = "";
var cashback_value = 0;
var txn_type = "";
var amt_final = "";
var isToken_ = "";
var countryOfSeller = [];
var cartItems = "";
var cartid = "";

class StartOrderTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amt_final: "",
      isToken_: "",
      moqErr: false,
      first_name: "",
      last_name: "",
      phone: "",
      email: props.user.email,
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode:
        getCookie("pincode") != "" && getCookie("pincode") != null
          ? getCookie("pincode")
          : "",
      landmark: "",
      express: "air",
      shippingCountry: 93,
      totalShipmentCost: 200,
      addNotValid: 0,
      shippingFrom: "1",
      link: `${ApiUrl}/common/product_purchased.php`,
      // link: `${ApiUrl}/common/product_purchased_kau.php`,
      checked: "",
      key: 0,
      totalCartValue: 0,
      totalProductCost: 0,
      totalShippingCost: 0,
      finalShippingCost: 0,
      symbol: "USD",
      cartitems: [],
      totalqty: 0,
      inrValue: 70,
      buyer_country: "",
      buyer_country_id: "",
      buyer_country_name: "",
      render_static_val: 0,
      cart_id: 0,
      price_check: false,
      price_check_text: "",
      cartItems: "",
      delivery_address: "",
      selectedaddressId: "",
      toggled: false,
      modalOpen: false,
      order_code: "",
      order_id: "",
      // order_id:5411,
      // order_code:'GI111108108-8774947',
      pay_link: `${ImgUrl}/beta_api/payment_confm.php`,
      gst_validated: false,
      gst_in:
        getCookie("gst_in") != "" && getCookie("gst_in") != null
          ? getCookie("gst_in")
          : "",
      bank_details: null,
      coupon_val: "",
      coupon_code: "",
      validCoupon: false,
      razorpay_avail: false,
      is_freeze: 0,
      token_percent: "",
      token_amt: "",
      razorpay_token: "",
      finalAmt: "",
      formid1: "token_payment",
      formid2: "all_payment",
      paymentType: "",
      pincodelength: "6",
      usdValue: 1,
    };
    this.validator = new SimpleReactValidator();
    this.selectAddress = this.selectAddress.bind(this);
    this.emptyAddress = this.emptyAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.toggleDiv = this.toggleDiv.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitPaymentProcess = this.submitPaymentProcess.bind(this);
    this.submitPaymentProcessToken = this.submitPaymentProcessToken.bind(this);
    this.submitPaymentProcessRazorPay = this.submitPaymentProcessRazorPay.bind(
      this
    );
    this.checkGstCharacter = this.checkGstCharacter.bind(this);
    this.submitOnlineTransfer = this.submitOnlineTransfer.bind(this);
    this.openfileManager = this.openfileManager.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.checkCoupon = this.checkCoupon.bind(this);
    this.changeCouponValue = this.changeCouponValue.bind(this);
    this.removeCoupon = this.removeCoupon.bind(this);
    this.maxLengthCheck = this.maxLengthCheck.bind(this);
    this.deleteCartitem = this.deleteCartitem.bind(this);
    this.decreaseOneQty = this.decreaseOneQty.bind(this);
    this.increaseOneQty = this.increaseOneQty.bind(this);
  }

  setStateFromInput = async (event) => {
    var obj = {};
    obj[event.target.name] =
      event.target.value !== ""
        ? event.target.value.replace(/[,]*/g, "")
        : event.target.value;
    // obj[event.target.name] = event.target.value;
    await this.setState(obj);
    complete_address = "";
    if (this.state.address) complete_address = this.state.address;
    if (this.state.landmark) complete_address += " " + this.state.landmark;
    if (this.state.city) complete_address += " " + this.state.city;
    if (this.state.state) complete_address += " " + this.state.state;
    if (this.state.pincode) complete_address += " " + this.state.pincode;

    captureEvent(
      "start_order",
      "address",
      complete_address,
      "address",
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
  };

  // orderSubmit = async (e) => {
  //   this.setState({
  //     addNotValid: 0,
  //   });
  //   e.preventDefault();

  //   if (this.validator.allValid()) {
  //     $("#price_validating_start").removeClass("d-none");
  //     console.log("valid");
  //     $(".chkValidate")
  //       .select()
  //       .css({ border: "none" });
  //     axios
  //       .post(
  //         "https://api.beldara.com/common/upd_add_buyer.php",
  //         {
  //           security_token: "",
  //           plateform_type: "",
  //           sellerid: ls.get("sellerid"),
  //           address: this.state.address,
  //           city: this.state.city,
  //           zipcode: this.state.pincode,
  //           landmark: this.state.landmark,
  //           state: this.state.state,
  //         },
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       )
  //       .then(async (response) => {
  //         // console.log(this.state.totalProductCost,this.state.symbol,this.state.cartId,129);
  //         axios
  //           .post(
  //             `${ApiUrl}/common/check_product_cost.php`,
  //             {
  //               security_token: "",
  //               plateform_type: "",
  //               total_product_cost: this.state.totalProductCost,
  //               currency: this.state.symbol,
  //               cart_id: this.state.cartId,
  //             },
  //             { headers: { "Content-Type": "multipart/form-data" } }
  //           )
  //           .then((response) => {
  //             this.updateAddress();

  //             // console.log(response.data.result[0].status,129);
  //             if (response.data.result[0].status == "true") {
  //               if (getCookie("country_code") !== "in") {
  //                 $("#price_validating_start").addClass("d-none");
  //                 let product_currency = this.state.symbol;
  //                 let total_price = this.state.totalCartValue;
  //                 if (
  //                   product_currency == "INR" ||
  //                   product_currency == "" ||
  //                   product_currency === undefined
  //                 )
  //                   total_price = parseFloat(total_price) / this.state.inr;
  //                 total_price = parseFloat(total_price).toFixed(2);
  //                 ReactPixel.trackCustom("Purchase", {
  //                   contents: this.props.location.state.pixeldata,
  //                   content_type: "product",
  //                   value: total_price,
  //                   currency: "USD",
  //                 });

  //                 if (this.state.checked === "razorpay") {
  //                   $(".razorpay-payment-button").click();
  //                 } else if (this.state.checked === "paytm") {
  //                   $(".paytmBtn").click();
  //                 } else {
  //                   $(".payondeliver").click();
  //                 }
  //               } else {
  //                 axios
  //                   .post(
  //                     `${ImgUrl}/beta_api/validate-pincode-deliverable.php`,
  //                     {
  //                       pincode: this.state.pincode,
  //                       productid: "",
  //                     },
  //                     {
  //                       headers: { "Content-Type": "multipart/form-data" },
  //                     }
  //                   )
  //                   .then((res) => {
  //                     if (res.data.statusId == 1) {
  //                       console.log("pincode validated");
  //                       $("#price_validating_start").addClass("d-none");
  //                       let product_currency = this.state.symbol;
  //                       let total_price = this.state.totalCartValue;
  //                       if (
  //                         product_currency == "INR" ||
  //                         product_currency == "" ||
  //                         product_currency === undefined
  //                       )
  //                         total_price =
  //                           parseFloat(total_price) / this.state.inr;
  //                       total_price = parseFloat(total_price).toFixed(2);
  //                       ReactPixel.trackCustom("Purchase", {
  //                         contents: this.props.location.state.pixeldata,
  //                         content_type: "product",
  //                         value: total_price,
  //                         currency: "USD",
  //                       });

  //                       if (this.state.checked === "razorpay") {
  //                         $(".razorpay-payment-button").click();
  //                       } else if (this.state.checked === "paytm") {
  //                         $(".paytmBtn").click();
  //                       } else {
  //                         $(".payondeliver").click();
  //                       }
  //                     } else {
  //                       // console.log('pincode invalid');
  //                       $("#price_validating_start").html(
  //                         '<i class="fa fa-exclamation-circle mx-1" aria-hidden="true"></i>' +
  //                           res.data.message
  //                       );
  //                     }
  //                   })
  //                   .catch((error) => {
  //                     console.error(error);
  //                   });
  //               }
  //             } else {
  //               $("#price_validating_start").addClass("d-none");
  //               $("#price_validating_end").removeClass("d-none");
  //               var inter = setInterval(() => {
  //                 window.location.href = "/cart.html";
  //                 clearInterval(inter);
  //               }, 5000);
  //               // console.log('error occurred: '+response.data.result[0].status);
  //             }
  //             // return
  //           })
  //           .catch((error) => {
  //             console.log(error, 192);
  //             const result = error.response;
  //             return Promise.reject(result);
  //           });
  //       })
  //       .catch((error) => {
  //         const result = error.response;
  //         // console.log(result,149,error);
  //         return Promise.reject(result);
  //       });
  //   } else {
  //     // console.log('invalid');
  //     this.setState({
  //       addNotValid: 1,
  //     });
  //     $(".chkValidate").click();
  //     $(".chkValidate").css({ border: "1px solid red" });
  //     this.validator.showMessages();
  //     // rerender to show messages for the first time
  //     this.forceUpdate();
  //   }
  //   let status;
  //   if (this.state.addNotValid == 0) status = "not valid";
  //   else status = "valid";

  //   captureEvent(
  //     "start_order",
  //     status,
  //     complete_address,
  //     "check_out",
  //     ls.get("sellerid"),
  //     getCookie("mhinpbnb")
  //   );
  // };

  orderSubmit = async (e) => {
      console.log("hsbdcdhjbjhb")
      $(".unique_class").attr("disabled", "true");
      $("#confirm_order_sppinner").removeClass("d-none");
      this.setState({
        addNotValid: 0,
      });
      e.preventDefault();

      if (this.validator.allValid()) {
        console.log("jhsbcdajhcbdcjhdbcadjhcbdacjhadb")
        if (
          this.state.gst_in == "" ||
          (this.state.gst_in != "" && this.state.gst_validated)
        ) {
          console.log("jhbscdjhcbdhjb")
          $("#price_validating_start").removeClass("d-none");
          //  console.log("valid");
          $(".chkValidate")
            .select()
            .css({ border: "none" });
          axios
            .post(
              "https://api.indiabigshop.com/common/upd_add_buyer.php",
              {
                security_token: "",
                plateform_type: "",
                sellerid: ls.get("sellerid"),
                address: this.state.address,
                city: this.state.city,
                zipcode: this.state.pincode,
                landmark: this.state.landmark,
                state: this.state.state,
              },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(async (response) => {
              console.log(response)
              // console.log(this.state.totalProductCost,this.state.symbol,this.state.cartId,129);
              axios
                .post(
                  `${ApiUrl}/common/check_product_cost.php`,
                  {
                    security_token: "",
                    plateform_type: "",
                    total_product_cost: this.state.totalProductCost,
                    currency: this.state.symbol,
                    cart_id: this.state.cartId,
                  },
                  { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then((response) => {
                  console.log(response)
                  this.updateAddress();
                  if (response.data.status == "Success") {
                    console.log("hbdjhsdbs")
                    axios
                      .post(
                        `${ImgUrl}/beta_api/validate-pincode-deliverable-web.php`,
                        {
                          pincode: this.state.pincode,
                          productid: "",
                          country_name: getCookie("country_name"),
                        },
                        {
                          headers: { "Content-Type": "multipart/form-data" },
                        }
                      )
                      .then((res) => {
                        if (res.data.statusId == 1) {
                          console.log(this.state.link)
                          //  console.log("pincode validated");
                          $("#price_validating_start").addClass("d-none");
                          let product_currency = this.state.symbol;
                          let total_price = this.state.totalCartValue;
                          if (
                            product_currency == "INR" ||
                            product_currency == "" ||
                            product_currency === undefined
                          )
                            total_price =
                              parseFloat(total_price) / this.state.inr;
                          total_price = parseFloat(total_price).toFixed(2);
                          ReactPixel.trackCustom("Purchase", {
                            contents: this.props.location.state.pixeldata,
                            content_type: "product",
                            value: total_price,
                            currency: "USD",
                          });
                          console.log(this.state.link)
                          axios
                            .post(
                              this.state.link,
                              {
                                //cartid: this.props.location.state.cartid,
                                cartid: this.state.cartId,
                                finalprice: this.state.totalCartValue,
                                sellerid: ls.get("sellerid"),
                                currency: this.state.symbol,
                                fscharge_total: this.state.finalShippingCost,
                                recipient_email: this.props.user.email,
                                security_token: "",
                                plateform_type: "web",
                                address1: this.state.address,
                                landmark: this.state.landmark,
                                state: this.state.state,
                                pincode: this.state.pincode,
                                city: this.state.city,
                                country: this.state.countryName,
                                txn_type: this.state.txn_type,
                                payment_type: 1,
                                cashback_value: this.state.cashback_value,
                                gst_in: this.state.gst_in,
                                country_id: getCookie("countryid"),
                              },
                              {
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                },
                              }
                            )
                            .then((res) => {
                              console.log(res)
                              $(".unique_class").removeAttr("disabled");
                              //  console.log(res, "statusid");
                              if (res.data.message == 1) {
                                //console.log('inside if',res.data.result.min_payment_percent);
                                this.setState({
                                  modalOpen: true,
                                  order_code: res.data.result.order_code,
                                  order_id: res.data.result.order_id,
                                  bank_details: res.data.result.bank_info,
                                  paymentType: res.data.result.paymentType,
                                  checked:
                                    res.data.result.paymentType[0].paymentType,
                                  min_token_amount:
                                    res.data.result.min_token_amount,
                                  token_percent:
                                    res.data.result.min_payment_percent,
                                  // token_amt:
                                  //   (this.state.totalCartValue / 100) *
                                  //   res.data.result.min_payment_percent,
                                  token_amt:res.data.result.min_token_amount,
                                  razorpay_avail:
                                    parseInt(res.data.result.razorpay) == 1
                                      ? true
                                      : false,
                                });
                                if (
                                  this.state.totalCartValue >
                                  this.state.min_token_amount
                                ) {
                                  if (
                                    this.state.token_amt <=
                                    this.state.min_token_amount
                                  ) {
                                    this.setState({
                                      token_amt: this.state.min_token_amount,
                                    });
                                  } else {
                                    this.setState({
                                      token_amt: this.state.token_amt,
                                    });
                                  }
                                } else {
                                  this.setState({
                                    token_amt: this.state.totalCartValue,
                                  });
                                }
                                $("#confirm_order_sppinner").addClass("d-none");
                                // this.setState({order_code:res.data.result.order_code,order_id:res.data.result.order_id});
                              }
                            })
                            .catch((error) => {
                              $(".unique_class").removeAttr("disabled");
                              console.error(error);
                              $("#confirm_order_sppinner").addClass("d-none");
                            });
                        } else {
                          // console.log('pincode invalid');
                          $("#confirm_order_sppinner").addClass("d-none");
                          $(".unique_class").removeAttr("disabled");
                          $("#price_validating_start").html(
                            '<i class="fa fa-exclamation-circle mx-1" aria-hidden="true"></i>' +
                              res.data.message
                          );
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                        $("#confirm_order_sppinner").addClass("d-none");
                      });
                  } else {
                    $(".unique_class").attr("disabled", "false");
                    $("#confirm_order_sppinner").addClass("d-none");
                    $("#price_validating_start").addClass("d-none");
                    $("#price_validating_end").removeClass("d-none");
                   
                    // console.log('error occurred: '+response.data.result[0].status);
                  }
                  // return
                })
                .catch((error) => {
                  //  console.log(error, 192);
                  $("#confirm_order_sppinner").addClass("d-none");
                  const result = error.response;
                  return Promise.reject(result);
                });
            })
            .catch((error) => {
              const result = error.response;
              $("#confirm_order_sppinner").addClass("d-none");
              // console.log(result,149,error);
              return Promise.reject(result);
            });
        } else {
          $(".unique_class").removeAttr("disabled");
          $("#confirm_order_sppinner").addClass("d-none");
        }
      } else {
        // $('.unique_class').attr('disabled','false');
        $(".unique_class").removeAttr("disabled");
        $("#confirm_order_sppinner").addClass("d-none");
        // console.log('invalid');
        this.setState({
          addNotValid: 1,
        });
        $(".chkValidate").click();
        $(".chkValidate").css({ border: "1px solid red" });
        this.validator.showMessages();
        // rerender to show messages for the first time
        this.forceUpdate();
      }
      let status;
      if (this.state.addNotValid == 0) status = "not valid";
      else status = "valid";

      captureEvent(
        "start_order",
        status,
        complete_address,
        "check_out",
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
   
  };

  checkProductPrice = () => {
    axios
      .post(
        `${ApiUrl}/common/check_product_cost.php`,
        {
          security_token: "",
          plateform_type: "",
          total_product_cost: this.state.totalProductCost,
          currency: this.state.symbol,
          cart_id: this.state.cartId,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        // console.log(response.data,183,this.state.totalProductCost,this.state.cartId,this.state.symbol);
        return response.data.result[0].status;
        // return
      })
      .catch((error) => {
        //  console.log(error, 192);
        const result = error.response;
        return Promise.reject(result);
      });
  };

  changeMethod(method) {
    this.setState({ checked: method });
    captureEvent(
      "start_order",
      "change_payment_method",
      method,
      "change_payment_method",
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
  }

  componentDidMount = async () => {
    // console.log('componentDidMount Called',this.props);
    // window.removeEventListener('scroll', this.handleScroll);
    // console.log(this.props, "render");
    this.maxLengthCheck();
    this.updateCart();
    this.toggleDiv();
    // if(this.props.location.state.cashback_amount_inr > 0){
    //   if(this.props.currency == 'INR'){
    //     txn_type = 'debit';
    //     cashback_value = this.props.location.state.cashback_amount_inr;
    //   }else{
    //     txn_type = 'debit';
    //     cashback_value = this.props.location.state.cashback_amount_usd;
    //   }
    // }
    // else{
    //     txn_type = 'credit';
    //     cashback_value = 0;
    // }

    // console.log(this.state,186);
    const advancedMatching = { em: "support@beldara.com" };
    const options = {
      autoConfig: true, // set pixel's autoConfig
      debug: false, // enable logs
    };
    ReactPixel.init("432219770935494", advancedMatching, options);
    ReactPixel.init("2231476330510319", advancedMatching, options);
    ReactPixel.pageView();
    await this.setState({
      countryName: getCookie("country_name"),
    });
    var gst = getCookie("gst_in");
    if (gst !== "" && gst !== null) {
      this.checkGstCharacter(gst);
    }

    // axios
    //   .post(
    //     `${ApiUrl}/common/generate_order_id_razor_pay.php`,
    //     {
    //       amount: 1*100,
    //       currency: getCookie("currency"),
    //       orderid: this.state.order_id,
    //     },
    //     { headers: { "Content-Type": "multipart/form-data" } }
    //   )
    //   .then((response) => {
    //     if(response.data.statusId == '1'){
    //       this.setState({
    //         razorpayorderid : response.data.result.id
    //       })
    //     }else{
    //       console.log("-------------2----------------", response.data.statusId);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("-------------12----------------", error);
    //     const result = error.response;
    //     return Promise.reject(result);
    //   });
  };

  componentWillReceiveProps = async (nextProps) => {
    // console.log(this.state.countryid,this.state.symbol,getCookie('country_code'),getCookie('currency'));
    if (this.state.countryid != getCookie("country_code")) {
      $("#price_validating_start").addClass("d-none");
      $(".common_class_for_spin").removeClass("d-none");
      // console.log('country changed',this.state.shippingCountry,getCookie('countryid'),92);
      axios
        .post(
          `${ApiUrl}/common/update_country_cart.php`,
          {
            sellerid: ls.get("log_id"),
            plateform_type: "",
            security_token: "",
            visitor_id: getCookie("mhinpbnb"),
            currency: "INR",
            country_code: getCookie("country_code"),
            country_to: getCookie("countryid"),
            //txn_type: this.props.location.state.txn_type,
          },
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then(async (response) => {
          if (response.data.statusId == "1") {
            await this.setState({
              totalCartValue: parseFloat(
                response.data.result.cartamount.totalPrice
              ),
              totalProductCost: parseFloat(
                response.data.result.cartamount.basePrice
              ).toFixed(2),
              finalShippingCost: parseFloat(
                response.data.result.cartamount.finalShippingCost
              ),
              totalShippingCost: parseFloat(
                response.data.result.cartamount.finalShippingCost
              ),
              //inrValue: parseFloat(this.props.location.state.inrValue),
              symbol: this.props.currency,
              totalCartStaticValue: parseFloat(
                response.data.result.cartamount.totalCartStaticValue
              ),
              cashback_amount_inr: parseFloat(
                response.data.result.cartamount.wallet
              ),
              cashback_amount_usd: parseFloat(
                response.data.result.cartamount.wallet
              ),
              cartId: response.data.result.cartamount.cartID,
              countryid: getCookie("country_code"),
              cashback_value:
                parseFloat(
                  response.data.result.cartamount.totalCartStaticValue
                ) - parseFloat(response.data.result.cartamount.totalPrice),
              //txn_type: this.props.location.state.txn_type,
              cartItems: response.data.result.cart,
            });
            $(".common_class_for_spin").addClass("d-none");
          } else {
            $(".common_class_for_spin").addClass("d-none");
            //  console.log("error occured");
            await this.setState({
              cartItems: null,
            });
          }
        })
        .catch((error) => {
          //  console.log(error);
        });
    }

    if (this.state.symbol != getCookie("currency")) {
      $(".common_class_for_spin").removeClass("d-none");
      axios
        .post(
          `${ApiUrl}/common/update_currency_cart.php`,
          {
            sellerid: ls.get("log_id"),
            plateform_type: "",
            security_token: "",
            visitor_id: getCookie("mhinpbnb"),
            symbol: "INR",
            //txn_type: this.props.location.state.txn_type,
          },
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then(async (response) => {
          if (response.data.statusId == "1") {
            await this.setState({
              totalCartValue: parseFloat(
                response.data.result.cartamount.totalPrice
              ),
              totalProductCost: parseFloat(
                response.data.result.cartamount.basePrice
              ).toFixed(2),
              finalShippingCost: parseFloat(
                response.data.result.cartamount.finalShippingCost
              ),
              totalShippingCost: parseFloat(
                response.data.result.cartamount.finalShippingCost
              ),
              //inrValue: parseFloat(this.props.location.state.inrValue),
              symbol: this.props.currency,
              totalCartStaticValue: parseFloat(
                response.data.result.cartamount.totalCartStaticValue
              ),
              cashback_amount_inr: parseFloat(
                response.data.result.cartamount.wallet
              ),
              cashback_amount_usd: parseFloat(
                response.data.result.cartamount.wallet
              ),
              cartId: response.data.result.cartamount.cartID,
              countryid: getCookie("country_code"),
              cashback_value:
                parseFloat(
                  response.data.result.cartamount.totalCartStaticValue
                ) - parseFloat(response.data.result.cartamount.totalPrice),
              //txn_type: this.props.location.state.txn_type,
              cartItems: response.data.result.cart,
            });
            $(".common_class_for_spin").addClass("d-none");
            // console.log(response.data.result,170);
          } else {
            $(".common_class_for_spin").addClass("d-none");
            //  console.log("error occured");
            await this.setState({
              cartItems: null,
              isPageLoaded: 1,
            });
          }
        })
        .catch((error) => {
          //  console.log(error);
        });
    } else {
      $(".common_class_for_spin").addClass("d-none");
    }

    // console.log(nextProps,204);
    let inrValue, usdValue;
    await this.setState({
      countryName: getCookie("country_name"),
    });

    if (
      this.state.buyer_country != getCookie("country_code") &&
      this.state.buyer_country_id != getCookie("countryid") &&
      this.state.buyer_country_name != getCookie("country_name")
    ) {
      await this.setState({
        buyer_country: getCookie("country_code"),
        buyer_country_id: getCookie("countryid"),
        buyer_country_name: getCookie("country_name"),
      });
    }

    if (
      this.props.user.sellerid !== undefined &&
      this.props.user.sellerid != ""
    )
      await this.setState({
        key: 1,
      });

    await this.setState({
      symbol: nextProps.currency,
    });

    if (this.state.cashback_value > 0) {
      txn_type = "debit";
      cashback_value = this.props.location.state.cashback_amount_inr;
    } else {
      txn_type = "credit";
      cashback_value = 0;
    }
    //$(".common_class_for_spin").addClass("d-none");
  };

  updateCart = async () => {
    $(".common_class_for_spin").removeClass("d-none");
    console.log(getCookie("mhinpbnb"),"abshjbshjbsjhsbshjbsjhxb")
    axios
      .post(
        `${ApiUrl}/common/receive_cart.php`,
        {
          sellerid: ls.get("log_id"),
          plateform_type: "",
          security_token: "",
          visitor_id: getCookie("mhinpbnb"),
          symbol:"INR",
          country_code: getCookie("country_code"),
          //txn_type: this.props.location.state.txn_type,
        },
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then(async (response) => {

        console.log(response)
        if (response.data.statusId == "1") {
          console.log(response.data.result.cart.length)
          await this.setState({
            totalCartValue: parseFloat(
              response.data.result.cartamount.totalPrice
            ),
            totalProductCost: parseFloat(
              response.data.result.cartamount.basePrice
            ).toFixed(2),
            finalShippingCost: parseFloat(
              response.data.result.cartamount.finalShippingCost
            ),
            totalShippingCost: parseFloat(
              response.data.result.cartamount.finalShippingCost
            ),
            //inrValue: parseFloat(this.props.location.state.inrValue),
            symbol: this.props.currency,
            totalCartStaticValue: parseFloat(
              response.data.result.cartamount.totalCartStaticValue
            ),
            cashback_amount_inr: parseFloat(
              response.data.result.cartamount.wallet
            ),
            cashback_amount_usd: parseFloat(
              response.data.result.cartamount.wallet
            ),
            cartId: response.data.result.cartamount.cartID,
            countryid: getCookie("country_code"),
            cashback_value:
              parseFloat(response.data.result.cartamount.totalCartStaticValue) -
              parseFloat(response.data.result.cartamount.totalPrice),
            //txn_type: this.props.location.state.txn_type,
            cartItems: response.data.result.cart,
            delivery_address: response.data.result.address,
            cartmsg: response.data.result.cartmsg,
            checkoutmsg: response.data.result.checkoutmsg,
          });
          $(".common_class_for_spin").addClass("d-none");
          console.log(  
            "------------------------1-------------------------",
            this.state.totalCartValue
          );
          this.setDefaultAddress(response.data.result.address);
console.log(response.data.result.cartamount.finalShippingCost)
          // console.log(response.data.result,115);
        } else {
          // console.log("error occured");
          await this.setState({
            cartItems: null,
            isPageLoaded: 1,
          });
          $(".common_class_for_spin").addClass("d-none");
        }
      })
      .catch((error) => {
        //  console.log(error);
      });
    if (this.state.cashback_value > 0) {
      txn_type = "debit";
      cashback_value = this.props.location.state.cashback_amount_inr;
    } else {
      txn_type = "credit";
      cashback_value = 0;
    }
  };

  selectAddress = (e) => {
    // console.log('working...',e,'selectAddress');
    this.setState({
      address: e.address1,
      landmark: e.area,
      city: e.city,
      state: e.state,
      pincode: e.zipcode,
      selectedaddressId: e.id,
    });
  };

  deleteAddress = (e) => {
    if (window.confirm("Are you sure you want to delete this address")) {
      axios
        .post(
          `${betaApi}seller_shipping_address.php`,
          {
            // address:this.state.address,
            type: "delete",
            // countryid:getCookie('countryid'),
            // country:getCookie('country_name'),
            // area:this.state.landmark,
            // city:this.state.city,
            // state:this.state.state,
            // zipcode:this.state.pincode,
            security_token: "",
            plateform_type: "web",
            sellerid: ls.get("sellerid"),
            // isdefault:"1",
            // fromcart:"1",
            addr_id: e.id,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((res) => {
          // console.log(res);
          if (res.data.statusId == "1") {
            if (this.state.selectedaddressId == e.id) {
              document.getElementById("li_" + e.id).remove();
              this.setState({
                address: "",
                landmark: "",
                city: "",
                state: "",
                pincode: "",
                selectedaddressId: "",
              });
            } else {
              document.getElementById("li_" + e.id).remove();
            }
            // console.log('success');
          } else {
            //  console.log("fail");
          }
        })
        .catch((error) => {
          //  console.log("error:" + error);
        });
    }
    // console.log('working...',e,'deleteAddress');
  };

  setDefaultAddress = (addressArray) => {
    var count = addressArray.length;
    // console.log('setDefaultAddress',addressArray,count,566);
    var i = 0;
    if (count > 0) {
      // console.log('if',566);
      for (i = 0; i < count; i++) {
        // console.log(addressArray[i]['isdefault'],'setDefaultAddress',566);
        if (addressArray[i]["isdefault"] == 1) {
          // console.log('if')
          this.setState({
            address: addressArray[i]["address1"],
            landmark: addressArray[i]["area"],
            city: addressArray[i]["city"],
            state: addressArray[i]["state"],
            pincode: addressArray[i]["zipcode"],
            selectedaddressId: addressArray[i]["id"],
          });
          break;
        } else {
          // console.log('else');
        }
      }
    }
  };

  emptyAddress = (e) => {
    e.preventDefault();
    this.setState({
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      selectedaddressId: "",
    });
  };

  updateAddress = (e) => {
    // console.log('....working');
    try {
      if (document.getElementById("setdefault").checked) {
        if (
          this.state.selectedaddressId !== "" &&
          this.state.selectedaddressId !== null
        ) {
          axios
            .post(
              `${betaApi}seller_shipping_address.php`,
              {
                address: this.state.address,
                type: "update",
                countryid: getCookie("countryid"),
                country: getCookie("country_name"),
                area: this.state.landmark,
                city: this.state.city,
                state: this.state.state,
                zipcode: this.state.pincode,
                security_token: "",
                plateform_type: "web",
                sellerid: ls.get("sellerid"),
                isdefault: "1",
                fromcart: "1",
                addr_id: this.state.selectedaddressId,
                country_code: getCookie("country_code"),
              },
              // { headers: { "Content-Type": "application/json" } }
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then((res) => {
              // console.log(res);
              if (res.data.statusId == "1") {
                //  console.log("success");
              } else {
                //  console.log("fail");
              }
            })
            .catch((error) => {
              //  console.log("error:" + error);
            });
        } else {
          axios
            .post(
              `${betaApi}seller_shipping_address.php`,
              {
                address: this.state.address,
                type: "insert",
                countryid: getCookie("countryid"),
                country: getCookie("country_name"),
                area: this.state.landmark,
                city: this.state.city,
                state: this.state.state,
                zipcode: this.state.pincode,
                security_token: "",
                plateform_type: "web",
                sellerid: ls.get("sellerid"),
                isdefault: "1",
                fromcart: "1",
              },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then((res) => {
              // console.log(res);
              if (res.data.statusId == "1") {
                //  console.log("success");
              } else {
                //  console.log("fail");
              }
            })
            .catch((error) => {
              //  console.log("error:" + error);
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  toggleDiv = (e) => {
    // console.log('working...');
    $("#cart_item_div").slideToggle();
    var toggle_val = !this.state.toggled;
    this.setState({
      toggled: toggle_val,
    });
  };

  closeModal = () => {
    this.setState({ modalOpen: false, checked: "" });
    //window.location.href = `${SellerUrl}/my_purchase.html?order=${this.state.order_code}`;

    // window.open(
    //   `${SellerUrl}/my_purchase.html?order=${this.state.order_code}`,
    //   '_blank' // <- This is what makes it open in a new window.
    // );
  };

  //"/thankYou.html?type=2&o=1&v=1&e=0&i=&od=" + this.state.order_code;
  //`${SellerUrl}/my_purchase.html?order=${this.state.order_code}`

  submitPaymentProcess = () => {
    if (this.state.checked === "razorpay") {
      this.setState({
        razorpay_token: false,
      });
      //$(".razorpay-payment-button").click();
    } else if (this.state.checked === "paytm") {
      $(".paytmBtn").click();
    } else {
      $(".payondeliver").click();
    }
  };

  submitPaymentProcessRazorPay = () => {
    //$(".razorpay-payment-button").click();
    // if (this.state.checked === "razorpay") {
    //   $(".razorpay-payment-button").click();
    // } else if (this.state.checked === "paytm") {
    //   $(".paytmBtn").click();
    // } else {
    //   $(".payondeliver").click();
    // }
  };

  submitPaymentProcessToken = () => {
    if (this.state.checked === "razorpay") {
      this.setState({
        razorpay_token: true,
      });
      //$(".razorpay-payment-button").click();
    } else if (this.state.checked === "paytm") {
      $(".paytmBtnToken").click();
    } else {
      $(".payondeliver").click();
    }
  };

  redirectTothankyou = () => {
    // console.log('redirectTothankyou','redirect');
    window.location.href =
      "/thankYou.html?type=2&o=1&v=1&e=0&i=&od=" + this.state.order_code;
  };

  checkGstCharacter = (gst_in = null, e) => {
    if (gst_in !== null) {
      // console.log('if');
      var value = gst_in;
    } else {
      // console.log('else');
      var value = e.target.value;
    }
    // console.log(value);
    var regex = new RegExp(
      "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$"
    );
    var bol = regex.test(value);
    // console.log(bol);
    if (bol) {
      setCookie("gst_in", value, "1");
      this.setState({ gst_in: value, gst_validated: true });
    } else {
      this.setState({ gst_in: value, gst_validated: false });
    }
  };

  submitOnlineTransfer = (e) => {
    e.preventDefault();
    $("#error_upload_field")
      .addClass("d-none")
      .html("");
    //console.log('form submitted');
    var seller_invoice = $("#upload_receipt")[0];
    var seller_file = seller_invoice.files[0];
    // console.log(seller_invoice,seller_file);
    var reader = new FileReader();
    var files = seller_invoice.files[0];
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.pdf|.jpeg|.jpg|.png)$/;
    var path = document.getElementById("upload_receipt").value;
    var test_file = path.replace(/[^a-zA-Z ]/g, "");
    if (regex.test(test_file.toLowerCase())) {
      reader.onload = function(e) {
        $("#img_src").attr("src", e.target.result);
        $("#img_src").removeClass("d-none");
        $("#img_src").css({ width: "359px", height: "224px" });
        $("#close_img").removeClass("d-none");
      };
      reader.readAsDataURL(seller_invoice.files[0]);
    } else {
      $("#error_upload_field")
        .removeClass("d-none")
        .html("File type must be jpeg or jpg or png");
      document.getElementById("upload_receipt").value = "";
      //  console.log("others are not allowed");
    }
    // console.log(formData);
  };

  openfileManager = () => {
    $("#upload_receipt").click();
    // return false;
  };

  clearAll = () => {
    $("#img_src").attr("src", "");
    $("#img_src").addClass("d-none");
    $("#close_img").addClass("d-none");
    document.getElementById("upload_receipt").value = "";
  };

  submitForm = () => {
    $("#submit_order_receipt").attr("disabled", "true");
    $("#error_upload_field")
      .addClass("d-none")
      .html("");
    var formdata = new FormData();
    var seller_invoice = $("#upload_receipt")[0];
    var seller_file = seller_invoice.files[0];
    if (seller_file !== undefined) {
      formdata.append("main_img", seller_file);
      formdata.append("paymentidbytt", "");
      formdata.append("order_code", this.state.order_code);
      formdata.append("buyeremail", this.props.user.email);
      formdata.append("amount", this.state.totalCartValue);
      formdata.append("amount_paid", this.state.totalCartValue);
      formdata.append("name", this.props.user.name);
      formdata.append("account", "beldara");
      formdata.append("orderid", this.state.order_id);
      formdata.append("amountbytt", 1);
      formdata.append("order_code", this.state.order_code);
      formdata.append("partial", 0);
      formdata.append("pay_pending", "");
      formdata.append("mode", 2);
      try {
        axios({
          method: "post",
          url: `${apiUrl}upload_purchased_receipt.php`,
          data: formdata,
          config: { headers: { "Content-Type": "multipart/form-data" } },
        })
          .then((response) => {
            $("#submit_order_receipt").removeAttr("disabled");
            if (response.data.statusId == "1") {
              this.setState({ modalOpen: false });
              window.location.href =
                "/thankYou.html?type=2&o=1&v=1&e=0&i=&od=" +
                this.state.order_code;
            } else {
              this.setState({ modalOpen: false });
              window.location.href =
                "/thankYou.html?type=2&o=1&v=1&e=0&i=&od=" +
                this.state.order_code;
            }
          })
          .catch((err) => {
            $("#submit_order_receipt").removeAttr("disabled");
            console.error(err);
          });
      } catch (err) {
        console.error(err);
        $("#submit_order_receipt").removeAttr("disabled");
      }
    } else {
      $("#submit_order_receipt").removeAttr("disabled");
      $("#error_upload_field")
        .removeClass("d-none")
        .html("Please Upload File");
    }
  };

  checkCoupon = async () => {
    if (this.state.coupon_val !== "") {
      $("#err_coupon").addClass("d-none");
      $("#enter_coupon").addClass("d-none");
      await this.setState({ coupon_code: this.state.coupon_val, is_freeze: 1 });
      $("#validateCoupon").attr("readonly", true);
      axios
        .post(
          `${imgUrl}/beta_api/validate_coupon.php`,
          {
            orderid: this.state.order_id,
            coupon_code: this.state.coupon_val,
            security_token: "",
            plateform_type: "web",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          // console.log(response.data,parseFloat(response.data.result[0].order_amount),parseInt(response.data.result[0].order_amount));
          if (response.data.result[0].status == "1") {
            $("#err_coupon").addClass("d-none");
            this.setState({
              validCoupon: true,
              totalCartValue: parseFloat(response.data.result[0].order_amount),
            });
          } else {
            $("#err_coupon").removeClass("d-none");
            this.setState({
              validCoupon: false,
              totalCartValue: this.state.totalCartStaticValue,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      $("#enter_coupon").removeClass("d-none");
    }
  };

  changeCouponValue = (e) => {
    var value = e.target.value;
    if (value == "") {
      $("#err_coupon").addClass("d-none");
      $("#enter_coupon").addClass("d-none");
      this.setState({ coupon_code: "" });
    }
    // console.log(value);
    this.setState({
      coupon_val: value,
    });
  };

  removeCoupon = (e) => {
    this.setState({
      coupon_val: "",
      coupon_code: "",
      is_freeze: 0,
      totalCartValue: this.state.totalCartStaticValue,
      validCoupon: false,
      checked: "paytm",
    });
    $("#validateCoupon").removeAttr("readonly");
    $("#err_coupon").addClass("d-none");
    $("#enter_coupon").addClass("d-none");
    // console.log(e);
  };

  maxLengthCheck = (e) => {
    if (e == undefined) {
      this.setState({
        pincode: getCookie("pincode"),
        pincodelength: 6,
      });
    } else {
      this.setState({
        pincodelength: e.target.value.length + 1,
        pincode: e.target.value,
      });
    }
    console.log(
      "-------------------this.state.pincodelength---------------------",
      this.state.pincodelength
    );
    if (this.state.pincodelength == "6") {
      this.setState({
        state: "",
        city: "",
      });
      axios
        .post(
          `https://api.indiabigshop.com/get_pincode_details.php`,
          {
            pincode: this.state.pincode,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          if (response.data.result[0].msg == undefined) {
            $("#pincodeCheck").addClass("d-none");
            this.setState({
              state: response.data.result[0].statename,
              city: response.data.result[0].city,
            });
          } else {
            $("#pincodeCheck").removeClass("d-none");
            this.setState({
              state: "",
              city: "",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (this.state.pincodelength != "7") {
        this.setState({
          state: "",
          city: "",
        });
      }
      console.log("pincode format invalid");
    }
  };

  deleteCartitem = async (item) => {
    //  console.log('deleteCartitem',item,387,this.state.cartItems.length);
    if (window.confirm("Do you want to delete this item from your cart?")) {
      showToast("Product Removed from Cart", "1");
      // if (this.state.cartItems.length == 1) {
      axios
        .post(
          `https://api.indiabigshop.com/common/delete_cart_item_test.php`,
          {
            cartitemid: item.cartitemid,
            sellerid: ls.get("log_id"),
            plateform_type: "web",
            security_token: "",
            visitor_id: getCookie("mhinpbnb"),
            symbol: getCookie("currency"),
            txn_type: this.state.txn_type,
          },
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then(async (response) => {
          if (response.data.statusId == "1") {
            store.dispatch(
              getCartLength(ls.get("log_id"), getCookie("mhinpbnb"))
            );
            var shippingArray = await response.data.result.shippingcost;
            shippingArray.forEach((element) => {
              var country_name = element.country;
              countryOfSeller[country_name.toLowerCase()] = {
                country: country_name.toLowerCase(),
                shippingCost: element.shipping_charge,
                express: element.shipping_type,
                countryid: element.countryid,
              };
            });
            // console.log(countryOfSeller,shippingArray,411);
            await this.setState({
              cartItems: response.data.result.cart,
              isPageLoaded: 1,
              symbol: getCookie("currency"),
              totalProductCost: response.data.result.cartamount.basePrice,
              totalCartStaticValue:
                response.data.result.cartamount.totalCartStaticValue,
              totalCartValue: response.data.result.cartamount.totalPrice,
              shippingDetails: response.data.result.shippingcost,
              isShippingCountry: response.data.statusId,
              shippingCharges: countryOfSeller,
              shippingArray: shippingArray,
              totalShippingCost:
                response.data.result.cartamount.finalShippingCost,
              shippingCountry: getCookie("countryid"),
              shippingCountryName: getCookie("country_name"),
              finalShippingCost:
                response.data.result.shippingcost[0].shipping_charge,
            });
            this.check_product_available(response.data.result.cart);
            // console.log(response.data.result,426);
          } else {
            console.log("error occured");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // }

      captureEvent(
        "cart",
        "delete_cart_item",
        item.productid,
        this.state.cartItems.length - 1,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
    }
  };

  decreaseOneQty = async (
    pid,
    cid,
    qty,
    quantity,
    symbol,
    inr,
    usd,
    eachprice,
    offer_price,
    offer_from_date,
    offer_to_date,
    offer_min_qty,
    offer_mrp_price,
    offer_currency,
    offer_unit,
    offer_stock
  ) => {
    $(".common_class_for_spin").removeClass("d-none");
    //$('.common_class_for_spin').removeClass('d-none');
    if (offer_stock == 0) return false;

    $(".common_validate_class").addClass("d-none");
    var checkForOffer = await this.checkForDecreaseQty(
      qty,
      offer_from_date,
      offer_to_date,
      offer_min_qty,
      offer_stock,
      cid
    );
    if (checkForOffer) {
      if (qty > 1 && qty > quantity) {
        //$(".qtySppinner").addClass("d-none");
        --qty;
        captureEvent(
          "cart",
          "decrease_qty",
          '{"productid":"' +
            pid +
            '", "qty":"' +
            qty +
            '", "min_qty":"' +
            quantity +
            '", "symbol":"' +
            symbol +
            '"}',
          pid,
          ls.get("sellerid"),
          getCookie("mhinpbnb")
        );
        // this.props.changeQty(pid, cid, qty, symbol, inr, usd);
        axios
          .post(
            `https://api.indiabigshop.com/common/update-cart.php`,
            {
              security_token: "",
              plateform_type: "",
              cartitemid: cid,
              qty: qty,
              productid: pid,
              currency: getCookie("currency"),
              country_to: getCookie("countryid"),
              method: "air",
              country_code: getCookie("country_code"),
              visitor_id: getCookie("mhinpbnb"),
              sellerid: ls.get("log_id"),
              txn_type: this.state.txn_type,
            },
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then(async (response) => {
            if (response.data.statusId == "1") {
              $(".common_class_for_spin").addClass("d-none");
              //$('.common_class_for_spin').addClass('d-none');
              var shippingArray = await response.data.result.shippingcost;
              shippingArray.forEach((element) => {
                var country_name = element.country;
                countryOfSeller[country_name.toLowerCase()] = {
                  country: country_name.toLowerCase(),
                  shippingCost: element.shipping_charge,
                  express: element.shipping_type,
                  countryid: element.countryid,
                };
              });
              // console.log(countryOfSeller,shippingArray,286);
              await this.setState({
                cartItems: response.data.result.cart,
                isPageLoaded: 1, 
                symbol: getCookie("currency"),
                totalProductCost: response.data.result.cartamount.basePrice,
                totalCartStaticValue:
                  response.data.result.cartamount.totalCartStaticValue,
                totalCartValue: response.data.result.cartamount.totalPrice,
                shippingDetails: response.data.result.shippingcost,
                finalShippingCost:
                  response.data.result.shippingcost[0].shipping_charge,
                isShippingCountry: response.data.statusId,
                shippingCharges: countryOfSeller,
                shippingArray: shippingArray,
                totalShippingCost:
                  response.data.result.cartamount.finalShippingCost,
                cartSmallDetails: response.data.result.cartamount,
                shippingCountryName: getCookie("country_name"),
              });
              this.removeSpinner(cid);
              // console.log(response.data.result,300);
            } else {
              console.log("error occured", 302);
              $(".common_class_for_spin").addClass("d-none");
              $(".common_validate_class").addClass("d-none");
            }
          })
          .catch((error) => {
            const result = error.response;
            return Promise.reject(result);
          });
        this.setState({
          shouldUpdate: 1,
          //  totalCartStaticValue:new_static_value
        });
      } else {
        captureEvent(
          "cart",
          "decrease_qty",
          '{"productid":"' +
            pid +
            '", "qty":"' +
            qty +
            '", "min_qty":"' +
            quantity +
            '", "symbol":"' +
            symbol +
            '"}',
          pid,
          ls.get("sellerid"),
          getCookie("mhinpbnb")
        );
        $(".common_class_for_spin").addClass("d-none");
        //$(".qtySppinner").removeClass("d-none");
        //console.log("------------------1--------------", qty);
      }
    }
  };

  increaseOneQty = async (
    pid,
    cid,
    qty,
    symbol,
    inr,
    usd,
    eachprice,
    offer_price,
    offer_from_date,
    offer_to_date,
    offer_min_qty,
    offer_mrp_price,
    offer_currency,
    offer_unit,
    offer_stock,
    items
  ) => {
    console.log(pid,cid,qty,offer_price,offer_from_date,offer_to_date,offer_min_qty)
    $(".common_class_for_spin").removeClass("d-none");
    //$(".common_class_for_spin").removeClass('d-none');
    if (offer_stock == 0) return false;
    var checkForIncreaseQty = await this.checkForQty(
      qty,
      offer_from_date,
      offer_to_date,
      offer_min_qty,
      offer_stock,
      cid
    );
    if (checkForIncreaseQty) {
      ++qty;
      captureEvent(
        "cart",
        "increase_qty",
        '{"productid":"' +
          pid +
          '", "qty":"' +
          qty +
          '", "symbol":"' +
          symbol +
          '"}',
        pid,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      //productid, cartitemid, qty, symbol, inrValue, usdValue)
      axios
        .post(
          `https://api.indiabigshop.com/common/update-cart.php`,
          {
            security_token: "",
            plateform_type: "",
            cartitemid: cid,
            qty: qty,
            productid: pid,
            currency: getCookie("currency"),
            country_to: getCookie("countryid"),
            method: "air",
            country_code: getCookie("country_code"),
            visitor_id: getCookie("mhinpbnb"),
            sellerid: ls.get("log_id"),
            txn_type: this.state.txn_type,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(async (response) => {
          if (response.data.statusId == "1") {
            $(".common_class_for_spin").addClass("d-none");
            $(".common_validate_class").addClass("d-none");
            var shippingArray = await response.data.result.shippingcost;
            shippingArray.forEach((element) => {
              var country_name = element.country;
              countryOfSeller[country_name.toLowerCase()] = {
                country: country_name.toLowerCase(),
                shippingCost: element.shipping_charge,
                express: element.shipping_type,
                countryid: element.countryid,
              };
            });
            // console.log(countryOfSeller,shippingArray,286);
            await this.setState({
              cartItems: response.data.result.cart,
              isPageLoaded: 1,
              symbol: getCookie("currency"),
              totalProductCost: response.data.result.cartamount.basePrice,
              totalCartStaticValue:
                response.data.result.cartamount.totalCartStaticValue,
              totalCartValue: response.data.result.cartamount.totalPrice,
              shippingDetails: response.data.result.shippingcost,
              isShippingCountry: response.data.statusId,
              shippingCharges: countryOfSeller,
              shippingArray: shippingArray,
              totalShippingCost:
                response.data.result.cartamount.finalShippingCost,
              cartSmallDetails: response.data.result.cartamount,
              shippingCountryName: getCookie("country_name"),
              finalShippingCost:
                response.data.result.shippingcost[0].shipping_charge,
            });
            // console.log(response.data.result,300);
            this.removeSpinner(cid);
          } else {
            console.log("error occured", 302);
            $(".common_class_for_spin").addClass("d-none");
            $(".common_validate_class").addClass("d-none");
          }
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
      // this.props.changeQty(pid, cid, qty, symbol, inr, usd);
      this.setState({
        shouldUpdate: 1,
        //  totalCartStaticValue:new_static_value
      });
    }
  };

  checkForDecreaseQty = async (
    qty,
    offer_from_date,
    offer_to_date,
    offer_min_qty,
    offer_stock,
    cid
  ) => {
    // console.log(qty,offer_from_date,offer_to_date,offer_min_qty,offer_stock,'checkForDecreaseQty');
    if (
      this.offerExist(offer_from_date, offer_to_date) &&
      parseInt(qty) - 1 < offer_min_qty
    ) {
      $("#validate_" + cid).removeClass("d-none");
      this.setState({
        validation: true,
        validation_text: "Minimum Qty should be " + offer_min_qty,
      });
      // console.log('if','checkForDecreaseQty',this.state.validation_text,this.state.validation)
      return false;
    } else {
      // console.log('else','checkForDecreaseQty',this.state.validation_text,this.state.validation)
      this.setState({
        validation: false,
      });
      return true;
    }
  };

  checkForQty = async (
    qty,
    offer_from_date,
    offer_to_date,
    offer_min_qty,
    offer_stock,
    cid
  ) => {
    // console.log(qty,offer_stock,offer_from_date,offer_to_date,offer_min_qty,offer_stock,'checkForQty');
    if (
      this.offerExist(offer_from_date, offer_to_date) &&
      parseInt(qty) + 1 > offer_stock
    ) {
      $("#validate_" + cid)
        .removeClass("d-none")
        .html("Only " + offer_stock + " stock left !");
      this.setState({
        validation: true,
        // validation_text: 'Only '+ offer_stock +' stock left !'
      });
      // console.log('if','checkForQty',this.state.validation_text,this.state.validation)
      return false;
    } else {
      // console.log('else','checkForQty',this.state.validation_text,this.state.validation)
      this.setState({
        validation: false,
      });
      return true;
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

  render() {
    // console.log('render',this.state.checked);
    // const { cartItems, cartid } = this.props.location.state;
    const {
      totalCartValue,
      token_amt,
      totalProductCost,
      finalShippingCost,
      countryName,
      totalCartStaticValue, 
      cashback_amount_inr,
      cashback_amount_usd,
      cashback_value,
    } = this.state;
    console.log(this.state,finalShippingCost)
    let {
      name,
      email,
      mobile,
      sellerid,
      country_name,
      countryid,
    } = this.props.user;
    const { currency } = this.props;
    const InputProps = {
      required: true,
    };
    const custom_button = {
      backgroundColor: "#ff9944",
      color: "white",
    };
    // const ListItem = ({eachadress,onClick}) => {
    //   <li className="list-group-item border-0" id={eachadress.id}>
    //                 <div className="card mouse_pointer" style={{width:'7rem'}}>
    //                   <div className="card-body">
    //               <h5 className="card-title">{eachadress.name}</h5>
    //            <p className="card-text">{eachadress.address} {eachadress.area} {eachadress.zipcode} {eachadress.city} {eachadress.state} {eachadress.country_name}</p>
    //         </div>
    //     </div>
    //   </li>
    // }
    // const ListData = ({addressData,onClick}) => {
    //   <ul>
    //     {
    //       addressData.map((eachadress,key) =>
    //         <ListItem key={++key} onClick={onClick} eachadress={eachadress} />
    //       )
    //     }
    //   </ul>
    // }
    console.log(this.state.cartItems.length)
    return (
      <div>
        {this.state.cartItems.length>0?(
      <div id={this.state.key}>
        <div className="container">
          <div className="row col-md-12">
            <div className="col-md-7">
              <form className="">
                <div className="card mt-4 mouse_pointer">
                  <div
                    className="card-header text-dark py-1"
                    data-toggle="collapse"
                    data-target="#collapseShippingDetails"
                    aria-expanded="true"
                  >
                    <div className="d-flex justify-content-center">
                      <strong>
                        Shipping Details <i class="fa fa-caret-down ml-3"></i>
                      </strong>
                    </div>
                  </div>
                  <div class="collapse show" id="collapseShippingDetails">
                    <div className="card card-body py-1">
                      <div className="detail-section">
                        <div className="row">
                          <div className="col-md-12">
                            <table className="w-100">
                              <tbody>
                                <tr className="mt-2">
                                  Shipping To: {countryName}
                                </tr>
                                <tr className="mt-2">
                                  {/* <td>Shipping Address:</td> */}
                                  <td>
                                    <a
                                      href="3"
                                      //data-toggle="collapse"
                                      //href="#collapseExample"
                                      role="button"
                                      //aria-expanded="true"
                                      //aria-controls="collapseExample"
                                      onClick={this.emptyAddress}
                                      className="chkValidate"
                                    >
                                      New shipping address +
                                    </a>
                                    <div
                                      className="collapse show"
                                      id="collapseExample"
                                    >
                                      <div className="card-body px-0 py-1 mt-3">
                                        <div className="has-float-label">
                                          <input
                                            id="address"
                                            type="text"
                                            placeholder=" "
                                            name="address"
                                            className="form-control"
                                            onChange={this.setStateFromInput}
                                            value={this.state.address}
                                          />
                                          <label htmlFor="address">
                                            {"Address"}
                                          </label>
                                          {this.validator.message(
                                            "address",
                                            this.state.address,
                                            `required|string`
                                          )}
                                        </div>
                                        <div className="row my-2">
                                          <div className="col-md-6">
                                            <div className="has-float-label">
                                              <input
                                                id="landmark"
                                                type="text"
                                                placeholder=" "
                                                name="landmark"
                                                className="form-control"
                                                onChange={
                                                  this.setStateFromInput
                                                }
                                                value={this.state.landmark}
                                              />
                                              <label htmlFor="landmark">
                                                {"Landmark (optional)"}
                                              </label>
                                              {/* {this.validator.message(
                                              "landmark",
                                              this.state.landmark,
                                              `required|string`
                                            )} */}
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="has-float-label">
                                              <NumberFormat
                                                //format="######"
                                                id="pincode"
                                                maxLength="6"
                                                name="pincode"
                                                placeholder=" "
                                                className="form-control input-number"
                                                onKeyUp={this.maxLengthCheck}
                                                onChange={
                                                  this.setStateFromInput
                                                }
                                                value={this.state.pincode}
                                              />

                                              <label htmlFor="pincode">
                                                {"Zip Code / Postal Code"}
                                              </label>
                                              {this.validator.message(
                                                "pincode",
                                                this.state.pincode,
                                                `required|numeric`
                                              )}
                                            </div>
                                            <div
                                              className="d-none text-danger"
                                              id="pincodeCheck"
                                            >
                                              Pincode is not avalabile
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row my-2">
                                          <div className="col-md-6">
                                            <div className="has-float-label">
                                              <input
                                                id="city"
                                                type="text"
                                                name="city"
                                                placeholder=" "
                                                className="form-control"
                                                onChange={
                                                  this.setStateFromInput
                                                }
                                                value={this.state.city}
                                              />
                                              <label htmlFor="city">
                                                {"City"}
                                              </label>
                                              {this.validator.message(
                                                "city",
                                                this.state.city,
                                                `required|string`
                                              )}
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="has-float-label">
                                              <input
                                                id="state"
                                                type="text"
                                                placeholder=" "
                                                className="form-control"
                                                name="state"
                                                onChange={
                                                  this.setStateFromInput
                                                }
                                                value={this.state.state}
                                              />
                                              <label htmlFor="state">
                                                {"State"}
                                              </label>
                                              {this.validator.message(
                                                "state",
                                                this.state.state,
                                                `required|string`
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row my-2">
                                          <div className="col-md-6">
                                            <div className="has-float-label">
                                              <input
                                                id="gst_in"
                                                type="text"
                                                name="gst_in"
                                                placeholder=" "
                                                className="form-control"
                                                onChange={this.checkGstCharacter.bind(
                                                  this,
                                                  null
                                                )}
                                                value={this.state.gst_in}
                                              />
                                              <label htmlFor="gst_in">
                                                {"GST No. (optional)"}
                                              </label>
                                            </div>
                                            {this.state.gst_in != "" &&
                                            this.state.gst_in != null &&
                                            !this.state.gst_validated ? (
                                              <div class="d-flex align-items-center p-1">
                                                <i class="cross-mark">
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
                                                <span className="mx-1">
                                                  GST Invalid
                                                </span>
                                              </div>
                                            ) : this.state.gst_in != "" &&
                                              this.state.gst_in != null &&
                                              this.state.gst_validated ? (
                                              <div className="d-flex align-items-center p-1">
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
                                                <span className="mx-1">
                                                  GST Valid
                                                </span>
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {this.state.address !== "" &&
                          this.state.pincode !== "" &&
                          this.state.city !== "" &&
                          this.state.state !== "" &&
                          this.state.landmark !== "" ? (
                            <div className="col-md-12 justify-content-around">
                              <div className="float-left">
                                <input
                                  type="checkbox"
                                  name="setdefault"
                                  id="setdefault"
                                />
                                <label
                                  className="mouse_pointer ml-2"
                                  htmlFor="setdefault"
                                >
                                  {" "}
                                  Set to Default
                                </label>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {this.state.delivery_address !== null ? (
                            this.state.delivery_address.length > 0 ? (
                              <div
                                className={`col-md-12 ${
                                  this.state.delivery_address.length > 3
                                    ? "overflowAddress"
                                    : ""
                                }`}
                              >
                                <ul className="list-group list-group-horizontal-sm">
                                  <React.Fragment>
                                    {this.state.delivery_address.map(
                                      (eachadress, index) => (
                                        <li
                                          className="list-group-item border-0"
                                          key={index}
                                          style={{ width: "230px" }}
                                          id={`li_${eachadress.id}`}
                                        >
                                          <div className="justify-content-around">
                                            <div className="float-right adjustClose">
                                              <span
                                                className="mouse_pointer"
                                                onClick={this.deleteAddress.bind(
                                                  null,
                                                  eachadress
                                                )}
                                              >
                                                <i className="fa fa-trash"></i>
                                              </span>
                                            </div>
                                          </div>
                                          <div
                                            className="card mouse_pointer"
                                            id={eachadress.id}
                                            onClick={this.selectAddress.bind(
                                              null,
                                              eachadress
                                            )}
                                          >
                                            <div
                                              className={`card-body ${
                                                this.state.selectedaddressId ==
                                                eachadress.id
                                                  ? "selectedaddress"
                                                  : ""
                                              }`}
                                            >
                                              <h5 className="card-title">
                                                {eachadress.name}
                                              </h5>
                                              <p className="card-text p-0 m-0">
                                                {eachadress.address1}
                                              </p>
                                              <p className="card-text p-0 m-0 text-truncate">
                                                {eachadress.area}
                                              </p>
                                              <p className="card-text p-0 m-0 text-truncate">
                                                {eachadress.zipcode}{" "}
                                                {eachadress.city}
                                              </p>
                                              <p className="card-text p-0 m-0">
                                                {eachadress.state}{" "}
                                                {eachadress.country}
                                              </p>
                                            </div>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </React.Fragment>
                                </ul>
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                        {/* <div className="mt-2">
                        <div>Estimated Lead Time: </div>
                        <div>
                          Ship within 2 - 7 business days after supplier
                          receiving payment.
                        </div>
                      </div> */}
                      </div>
                    </div>
                  </div>
                  {/* <div className="card-footer text-right">
                    Total Shipping Fee :
                    <span className="count">
                      <div
                        class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                        role="status"
                        style={{ color: "#f1aa61" }}
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    </span>
                    {currency} {finalShippingCost}
                  </div> */}
                </div>

                {cashback_value > 0 ? (
                  <div className="card-text card-body text-right ">
                    {/* <div className="">
                      Total Price of Products :
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      {currency} {totalProductCost}
                    </div> */}
                    {/* <div className="">
                      <b>+</b> Total Shipping Fee :
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      {currency} {finalShippingCost}
                      <br />
                      <b>-</b>
                      Wallet Amount :
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      {currency} {parseFloat(cashback_value).toFixed(2)}
                    </div> */}
                    {/* <hr className="" /> */}
                    {/* <div className="">
                      Total Cost :
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      {currency} {totalCartValue}
                    </div> */}
                  </div>
                ) : (
                  <div className="card-text card-body text-right ">
                    {/* <div className="">
                      Total Price of Products :
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      {currency} {totalProductCost}
                    </div> */}
                    {/* <div className="">
                      <b>+</b> Total Shipping Fee :
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      {currency} {finalShippingCost}
                    </div> */}
                    {/* <hr className="" />
                    <div className="">
                      Total Cost :
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      {currency} {totalCartValue}
                    </div> */}
                    <div
                      className="d-none text-danger"
                      id="price_validating_start"
                    >
                      Validating your cart. Please wait for a moment....
                    </div>
                    <div
                      className="d-none text-danger"
                      id="price_validating_end"
                    >
                      we are redirecting to your cart kindly visit and checkout
                      or <a href="/cart.html">click here</a>
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="col-md-5">
              <div className="row border my-3 mx-0 justify-content-around py-2 px-0 bg-cart-color">
                <div className="text-left">
                  <span className="itemTextColor">
                    {this.state.cartItems.length} items on your cart
                  </span>
                </div>
                <div className="text-right">
                  {this.state.toggled ? (
                    // <span onClick={this.toggleDiv} className="mouse_pointer">
                    <span className="mouse_pointer">
                      DETAILS
                      <i className={`fa fa-caret-down ml-3 adjustFontIcon`}></i>
                    </span>
                  ) : (
                    <span className="ml-5">
                      <a href="/cart.html">EDIT</a>
                      <i
                        className={`mouse_pointer fa fa-caret-up ml-3 adjustFontIcon`}
                        onClick={this.toggleDiv}
                      ></i>
                    </span>
                  )}
                </div>
              </div>
              <div
                id="cart_item_div show"
                className={`row mx-0 border px-2 ${
                  this.state.cartItems.length >= 2 ? "overflowCartTwoItems" : ""
                }`}
              >
                {this.state.cartItems.length > 0 ? (
                  <React.Fragment>
                    {this.state.cartItems.map((val, index) => (
                      <>
                        <div className="col-md-12 row mx-0 my-2 border bg-cart-color col-xs-11">
                          <div className="col-md-3 mx-2 my-2">
                            <a href={`/product/${val.url}.html`} target="_blank">
                              <img
                                className="w-100 h-100"
                                src={`https://img.indiabigshop.com/product_images_thumb/${val.img}`}
                              />
                            </a>
                          </div>
                          <div className="col-md-8 my-2 align-items-center">
                            <div className="text-truncate">{val.name}</div>
                            <a href={`/store/${val.surl}.html`} target="_blank"><div className="text-truncate">{val.company}</div></a>
                            <hr />
                            <div className="d-flex justify-content-around">
                              <p className="text-left">
                                {val.qty} {val.unit}
                              </p>
                              <p className="text-right">
                                <div
                                  class="spinner-border text-dark qtySpinner d-none"
                                  role="status"
                                  style={{ width: "1rem", height: "1rem" }}
                                ></div>
                                &nbsp;
                                <span className="count">
                                  <div
                                    class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                                    role="status"
                                    style={{ color: "#f1aa61" }}
                                  >
                                    <span class="sr-only">Loading...</span>
                                  </div>
                                </span>
                                <i
                                  className={
                                    currency == "INR"
                                      ? "fa fa-inr"
                                      : "fa fa-usd"
                                  }
                                ></i>{" "}
                                {new Intl.NumberFormat().format(val.totalprice)}
                              </p>
                            </div>
                          </div>
                            <div className="d-none d-sm-block">
                              <span
                                class="mouse_pointer"
                                onClick={this.deleteCartitem.bind(this, val)}
                              >
                                <i class="fa fa-trash text-danger"></i>
                              </span>
                            </div>
                    

                          <div class="col-lg-12 my-2 align-items-center">
                            <div class="qty-box align-items-center">
                              <div class="input-group">
                                <span class="input-group-prepend">
                                  <button
                                    type="button"
                                    class="btn quantity-left-minus"
                                    onClick={this.decreaseOneQty.bind(
                                      this,
                                      val.productid,
                                      val.cartitemid,
                                      val.qty,
                                      val.quantity,
                                      getCookie("currency"),
                                      this.state.inrValue,
                                      this.state.usdValue,
                                      val.eachprice,
                                      val.offer_price,
                                      val.offer_from_date,
                                      val.offer_to_date,
                                      val.offer_min_qty,
                                      val.offer_mrp_price,
                                      val.offer_currency,
                                      val.offer_unit,
                                      val.offer_stock
                                    )}
                                    data-type="minus"
                                    data-field=""
                                  >
                                    <i class="fa fa-minus"></i>
                                  </button>
                                </span>
                                <input
                                  type="text"
                                  name="quantity"
                                  readonly=""
                                  class="form-control input-number"
                                  value={val.qty}
                                ></input>
                                <span class="input-group-prepend">
                                  <button
                                    class="btn quantity-right-plus"
                                    onClick={this.increaseOneQty.bind(
                                      this,
                                      val.productid,
                                      val.cartitemid,
                                      val.qty,
                                      getCookie("currency"),
                                      this.state.inrValue,
                                      this.state.usdValue,
                                      val.eachprice,
                                      val.offer_price,
                                      val.offer_from_date,
                                      val.offer_to_date,
                                      val.offer_min_qty,
                                      val.offer_mrp_price,
                                      val.offer_currency,
                                      val.offer_unit,
                                      val.offer_stock
                                    )}
                                    data-type="plus"
                                  >
                                    <i class="fa fa-plus"></i>
                                  </button>
                                </span>
                              </div>
                              <div class="px-1 mt-1">
                                <div class="alert alert-danger qtySppinner d-none">
                                  <i class="fa fa-info-circle mr-1"></i> Order
                                  must be greater than MOQ {val.qty} {val.unit}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </React.Fragment>
                ) : (
                  ""
                )}
              </div>
              <div className="row mx-0 border px-2 py-2 my-2 bg-cart-color">
                <div className="col-md-12 justify-content-around">
                  <div className="float-left">
                    <span>Sub Total:</span>
                  </div>
                  <div className="float-right">
                    <span className="count">
                      <div
                        class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                        role="status"
                        style={{ color: "#f1aa61" }}
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    </span>
                    <span>
                      <i
                        className={
                          currency == "INR" ? "fa fa-inr" : "fa fa-usd"
                        }
                      ></i>{" "}
                      {new Intl.NumberFormat().format(totalProductCost)}
                    </span>
                  </div>
                </div>
                <div className="col-md-12 justify-content-around">
                  <div className="float-left">
                    <span>Shipping Charge:</span>
                  </div>
                  <div className="float-right">
                    <span className="count">
                      <div
                        class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                        role="status"
                        style={{ color: "#f1aa61" }}
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    </span>
                    <span>
                      <i
                        className={
                          currency == "INR" ? "fa fa-inr" : "fa fa-usd"
                        }
                      ></i>{" "}
                      {new Intl.NumberFormat().format(finalShippingCost)}
                      {console.log(finalShippingCost)}
                    </span>
                  </div>
                </div>
                {cashback_value > 0 ? (
                  <div className="col-md-12 justify-content-around">
                    <div className="float-left">
                      <span>Wallet Amount:</span>
                    </div>
                    <div className="float-right">
                      <span className="count">
                        <div
                          class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                          role="status"
                          style={{ color: "#f1aa61" }}
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </span>
                      <span>
                        -{" "}
                        <i
                          className={
                            currency == "INR" ? "fa fa-inr" : "fa fa-usd"
                          }
                        ></i>{" "}
                        {parseFloat(cashback_value).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="col-md-12 justify-content-around">
                  <div className="float-left">
                    <span>Total:</span>
                  </div>
                  <div className="float-right">
                    <span className="count">
                      <div
                        class="spinner-border spinner-border-sm common_class_for_spin mr-1 d-none"
                        role="status"
                        style={{ color: "#f1aa61" }}
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    </span>
                    <span>
                      <i
                        className={
                          currency == "INR" ? "fa fa-inr" : "fa fa-usd"
                        }
                      ></i>{" "}
                      {new Intl.NumberFormat().format(totalCartValue)}
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="card mt-4">
                <div className="card-header text-dark py-1">
                  <i className="fa fa-dolly" />
                  Prefer Payment Method
                </div>
                <div className="card-body py-1">
                  <div className="payment-box">
                    <div className="upper-box">
                      <div className="payment-options">
                        <ul>
                          <li>
                            <div className="radio-option stripe">
                              <input
                                type="radio"
                                name="payment-group"
                                method="razorpay"
                                id="payment-2"
                                defaultChecked={true}
                                onClick={() => this.changeMethod("razorpay")}
                              />
                              <label htmlFor="payment-2">
                                Pay using Cards/Net Banking,/Wallet/UPI/QR
                              </label>
                            </div>
                          </li>
                          {currency == "INR" ? (
                            <li>
                              <div className="radio-option paypal ">
                                <input
                                  type="radio"
                                  name="payment-group"
                                  method="paytm"
                                  id="payment-1"
                                  onClick={() => this.changeMethod("paytm")}
                                />
                                <label htmlFor="payment-1">
                                  Pay using Paytm
                                </label>
                              </div>
                            </li>
                          ) : (
                            ""
                          )}
                          {getCookie("country_code") == "in" ? (
                            <li>
                              <div className="radio-option stripe">
                                <input
                                  type="radio"
                                  name="payment-group"
                                  method="payondelivery"
                                  id="payment-3"
                                  onClick={() =>
                                    this.changeMethod("payondelivery")
                                  }
                                />
                                <label htmlFor="payment-3">
                                  Pay on Delivery
                                </label>
                              </div>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div>
                <div>{this.state.checkoutmsg}</div>
              </div>
              <div className="card-text text-right">
                {this.state.addNotValid ? (
                  <div className="alert col-sm-12 col-md-7 ml-auto text-center alert-danger">
                    Please Enter Valid address
                  </div>
                ) : this.state.gst_in !== "" && !this.state.gst_validated ? (
                  <div className="alert col-sm-12 col-md-7 ml-auto text-center alert-danger">
                    Invalid GST
                  </div>
                ) : (
                  ""
                )}
                {this.state.checked == "razorpay" ||
                this.state.checked == "" ||
                this.state.checked == "paytm" ? (
                  <button
                    className="btn btn-solid  mb-5 my-3 unique_class"
                    id={cartItems.cartitemid}
                    onClick={this.orderSubmit}
                  >
                    <div
                      class="spinner-border text-dark d-none"
                      id="confirm_order_sppinner"
                      role="status"
                      style={{ width: "1rem", height: "1rem" }}
                    >
                      <span class="sr-only">Loading...</span>
                    </div>
                    &nbsp; confirm order
                  </button>
                ) : (
                  ""
                  // <button
                  //   className="btn btn-solid  mb-5 my-3"
                  //   id={cartItems.cartitemid}
                  //   onClick={this.orderSubmit}
                  // >
                  //   {"Place order"}
                  // </button>
                )}
                {/* <RazorpayForm
                  totalCost={totalCartValue}
                  name={name}
                  email={email}
                  mobile={mobile}
                  id={"productOrder"}
                  sellerid={sellerid}
                  currency={currency}
                  amount={totalCartValue}
                  page={""}
                  type={""}
                  event={"Product-Order"}
                  className={"productOrder"}
                  method="POST"
                  action={this.state.link}
                  isLoggedIn={this.isLoggedIn}
                  item={cartItems}
                  submit={true}
                  value={
                    "cartid=" +
                    cartid +
                    ",amount=" +
                    totalCartValue +
                    ",sellerid=" +
                    ls.get("sellerid") +
                    ",mainurl=" +
                    window.location.hostname +
                    ",currency=" +
                    currency +
                    ",shipping_cost=" +
                    this.state.finalShippingCost +
                    ",email=" +
                    email +
                    ", address=" +
                    this.state.address +
                    ", landmark=" +
                    this.state.landmark +
                    ", state=" +
                    this.state.state +
                    ", pincode=" +
                    this.state.pincode +
                    ", city=" +
                    this.state.city +
                    ", countryName=" +
                    countryName +
                    ", txn_type=" +
                    this.state.txn_type +
                    " ,cashback_value=" +
                    cashback_value +
                    ", payment_type=" +
                    0
                  }
                /> */}
                {/* {this.state.razorpay_token !== ""?  */}
                {/* {this.state.razorpay_token == true
                  ? (console.log(
                      "-----------razorpay_token true------------",
                      this.state.razorpay_token,
                      token_amt
                    ),
                    (
                      <RazorpayForm
                        totalCost={token_amt}
                        name={name}
                        email={email}
                        mobile={mobile}
                        id={"productOrder"}
                        sellerid={sellerid}
                        currency={currency}
                        amount={token_amt}
                        page={""}
                        type={""}
                        event={"Product-Order"}
                        className={"productOrder"}
                        method="POST"
                        action={this.state.pay_link}
                        isLoggedIn={this.isLoggedIn}
                        item={cartItems}
                        value={
                          "order_code=" +
                          this.state.order_code +
                          ",order_id=" +
                          this.state.order_id +
                          ",sellerid=" +
                          ls.get("sellerid") +
                          ",mainurl=" +
                          window.location.hostname +
                          ",plateform_type=" +
                          "web" +
                          ",security_token=" +
                          ""
                        }
                      />
                    ))
                  : (console.log(
                      "-----------razorpay_token flase------------",
                      this.state.razorpay_token,
                      totalCartValue
                    ),
                    (
                      <RazorpayForm
                        totalCost={totalCartValue}
                        name={name}
                        email={email}
                        mobile={mobile}
                        id={"productOrder"}
                        sellerid={sellerid}
                        currency={currency}
                        amount={totalCartValue}
                        page={""}
                        type={""}
                        event={"Product-Order"}
                        className={"productOrder"}
                        method="POST"
                        action={this.state.pay_link}
                        isLoggedIn={this.isLoggedIn}
                        item={cartItems}
                        value={
                          "order_code=" +
                          this.state.order_code +
                          ",order_id=" +
                          this.state.order_id +
                          ",sellerid=" +
                          ls.get("sellerid") +
                          ",mainurl=" +
                          window.location.hostname +
                          ",plateform_type=" +
                          "web" +
                          ",security_token=" +
                          ""
                        }
                      />
                    ))} */}
                {/* : ""} */}

                {/* <RazorpayForm
                  totalCost={totalCartValue}
                  name={name}
                  email={email}
                  mobile={mobile}
                  id={"all-amount"}
                  sellerid={sellerid}
                  currency={currency}
                  amount={totalCartValue}
                  page={""}
                  type={""}
                  event={"all-amount"}
                  className={"all-amount"}
                  method="POST"
                  action={this.state.pay_link}
                  isLoggedIn={this.isLoggedIn}
                  item={cartItems}
                  value={
                    "order_code=" +
                    this.state.order_code +
                    ",order_id=" +
                    this.state.order_id +
                    ",sellerid=" +
                    ls.get("sellerid") +
                    ",mainurl=" +
                    window.location.hostname +
                    ",plateform_type=" +
                    "web" +
                    ",security_token=" +
                    ""
                  }
                />


                <RazorpayForm
                  totalCost={token_amt}
                  name={name}
                  email={email}
                  mobile={mobile}
                  id={"token-amount"}
                  sellerid={sellerid}
                  currency={currency}
                  amount={token_amt}
                  page={""}
                  type={""}
                  event={"token-amount"}
                  className={"token-amount"}
                  method="POST"
                  action={this.state.pay_link}
                  isLoggedIn={this.isLoggedIn}
                  item={cartItems}
                  value={
                    "order_code=" +
                    this.state.order_code +
                    ",order_id=" +
                    this.state.order_id +
                    ",sellerid=" +
                    ls.get("sellerid") +
                    ",mainurl=" +
                    window.location.hostname +
                    ",plateform_type=" +
                    "web" +
                    ",security_token=" +
                    ""
                  }
                /> */}

                {/* <RazorpayForm
                  totalCost={totalCartValue}
                  name={name}
                  email={email}
                  mobile={mobile}
                  id={"productOrder"}
                  sellerid={sellerid}
                  currency={currency}
                  amount={totalCartValue}
                  page={""}
                  type={""}
                  event={"Product-Order"}
                  className={"productOrder"}
                  method="POST"
                  action={this.state.pay_link}
                  isLoggedIn={this.isLoggedIn}
                  item={cartItems}
                  value={
                    "order_code=" +
                    this.state.order_code +
                    ",order_id=" +
                    this.state.order_id +
                    ",sellerid=" +
                    ls.get("sellerid") +
                    ",mainurl=" +
                    window.location.hostname +
                    ",plateform_type=" +
                    "web" +
                    ",security_token=" +
                    ""
                  }
                /> */}

                <Paytm
                  user={this.props.user}
                  amount={totalCartValue}
                  sellerid={sellerid}
                  order_id={this.state.order_id}
                  order_code={this.state.order_code}
                  has_coupon={this.state.validCoupon ? 1 : 0}
                  discounted_amount={totalCartValue}
                  discount_code={this.state.coupon_code}
                  isToken="2"
                />

                <PaytmToken
                  user={this.props.user}
                  amount={token_amt}
                  sellerid={sellerid}
                  order_id={this.state.order_id}
                  order_code={this.state.order_code}
                  has_coupon={this.state.validCoupon ? 1 : 0}
                  discounted_amount={token_amt}
                  discount_code={this.state.coupon_code}
                  isToken="1"
                />
                {/* {this.state.payAmtType2 == 2 ?
                <Paytm
                    user={this.props.user}
                    amount={totalCartValue}
                    sellerid={sellerid}
                    order_id={this.state.order_id}
                    order_code={this.state.order_code}
                    has_coupon={this.state.validCoupon ? 1 : 0}
                    discounted_amount={totalCartValue}
                    discount_code={this.state.coupon_code}
                    isToken={this.state.payAmtType2}
                  />
                :''}
                {this.state.payAmtType1 == 1 ?
                  <Paytm
                  user={this.props.user}
                  amount={this.state.token_amt}
                  sellerid={sellerid}
                  order_id={this.state.order_id}
                  order_code={this.state.order_code}
                  has_coupon={this.state.validCoupon ? 1 : 0}
                  discounted_amount={this.state.token_amt}
                  discount_code={this.state.coupon_code}
                  isToken={this.state.payAmtType1}
              />
                :''} */}
                {/* <div className="mr-1 ml-3">{this.state.checkoutmsg}</div> */}
                <PayOnDelivery
                  totalCost={totalCartValue}
                  name={name}
                  email={email}
                  mobile={mobile}
                  id={"payondelivery"}
                  sellerid={sellerid}
                  currency={currency}
                  amount={totalCartValue}
                  page={""}
                  type={""}
                  event={"Product-Order"}
                  className={"productOrder"}
                  method="POST"
                  action={this.state.link}
                  isLoggedIn={this.isLoggedIn}
                  item={cartItems}
                  value={
                    "cartid=" +
                    cartid +
                    ",amount=" +
                    totalCartValue +
                    ",sellerid=" +
                    ls.get("sellerid") +
                    ",mainurl=" +
                    window.location.hostname +
                    ",currency=" +
                    currency +
                    ",shipping_cost=" +
                    this.state.finalShippingCost +
                    ",email=" +
                    email +
                    ", address=" +
                    this.state.address +
                    ", landmark=" +
                    this.state.landmark +
                    ", state=" +
                    this.state.state +
                    ", pincode=" +
                    this.state.pincode +
                    ", city=" +
                    this.state.city +
                    ", countryName=" +
                    countryName +
                    ", txn_type=" +
                    this.state.txn_type +
                    " ,cashback_value=" +
                    cashback_value +
                    ", payment_type=" +
                    1
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <Modal
          open={this.state.modalOpen}
          onClose={() => ""}
          center
          className="cart-modal"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Your Order is Confirmed</h3>
                <button
                  type="button"
                  className="close"
                  onClick={this.closeModal}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body modal1">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12">
                      <div className="modal-bg addtocart">
                        <div className="modal-body justify-content-center text-center">
                          <div className="d-flex my-2">
                            <div className="">
                              <div className="has-float-label">
                                <input
                                  id="validateCoupon"
                                  type="text"
                                  placeholder=" "
                                  name="validateCoupon"
                                  className="form-control"
                                  onChange={this.changeCouponValue}
                                  value={this.state.coupon_val}
                                  required="true"
                                />
                                <label htmlFor="validateCoupon">
                                  {"Coupon Code"}
                                </label>
                              </div>
                            </div>
                            <div className="mx-2">
                              {this.state.is_freeze == 0 ? (
                                <button
                                  className="btn"
                                  id="checkCoupon"
                                  onClick={this.checkCoupon}
                                  style={custom_button}
                                >
                                  Apply
                                </button>
                              ) : (
                                <button
                                  className="btn"
                                  id="removeCoupon"
                                  onClick={this.removeCoupon}
                                  style={custom_button}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          <div
                            className="err-bod font-icon my-2 d-none"
                            id="err_coupon"
                          >
                            <div>
                              <i
                                class="fa fa-exclamation-circle font-icon"
                                aria-hidden="true"
                              ></i>
                              <span className="mx-2">Invalid Coupon</span>
                            </div>
                          </div>
                          <div
                            className="err-bod font-icon my-2 d-none"
                            id="enter_coupon"
                          >
                            <div>
                              <i
                                class="fa fa-exclamation-circle font-icon"
                                aria-hidden="true"
                              ></i>
                              <span className="mx-2">Please Enter Coupon</span>
                            </div>
                          </div>
                          {this.state.coupon_code == "razorpay" ||
                          this.state.coupon_code == "paytm" ||
                          this.state.coupon_code == "" ? (
                            <div className="card mt-4">
                              <div className="card-header text-dark py-1">
                                <i className="fa fa-dolly" />
                                Preferred Payment Method
                              </div>
                              <div className="card-body py-1">
                                <div className="payment-box">
                                  <div className="upper-box">
                                    <div className="payment-options">
                                      <ul>
                                        {/* {(this.state.coupon_code ==
                                          "razorpay" ||
                                          this.state.coupon_code == "") &&
                                        this.state.razorpay_avail ? (
                                          <li>
                                            <div className="radio-option stripe">
                                              <input
                                                type="radio"
                                                name="payment-group"
                                                method="razorpay"
                                                id="payment-2"
                                                defaultChecked={true}
                                                onClick={() =>
                                                  this.changeMethod("razorpay")
                                                }
                                              />
                                              <label htmlFor="payment-2">
                                                Pay using Cards/Net
                                                Banking,/Wallet/UPI/QR
                                              </label>
                                            </div>
                                          </li>
                                        ) : (
                                          ""
                                        )} */}
                                        {(this.state.coupon_code == "paytm" ||
                                          this.state.coupon_code ==
                                            "razorpay" ||
                                          this.state.coupon_code == "") &&
                                        currency == "INR" ? (
                                          <>
                                            {this.state.paymentType !== "" &&
                                            this.state.paymentType !== null
                                              ? Object.keys(
                                                  this.state.paymentType
                                                ).map((item, index) => (
                                                  <li>
                                                    {this.state.paymentType[
                                                      item
                                                    ].checkedStatus == true
                                                      ? this.setState({
                                                          checked: this.state
                                                            .paymentType[item]
                                                            .paymentType,
                                                        })
                                                      : ""}
                                                    <div className="radio-option paypal">
                                                      <input
                                                        type="radio"
                                                        name="payment-group"
                                                        method={
                                                          this.state
                                                            .paymentType[item]
                                                            .paymentType
                                                        }
                                                        id={
                                                          this.state
                                                            .paymentType[item]
                                                            .paymentType
                                                        }
                                                        defaultChecked={
                                                          this.state
                                                            .paymentType[item]
                                                            .checkedStatus ==
                                                          "true"
                                                            ? true
                                                            : false
                                                        }
                                                        onClick={() =>
                                                          this.changeMethod(
                                                            this.state
                                                              .paymentType[item]
                                                              .paymentType
                                                          )
                                                        }
                                                      />
                                                      <label
                                                        htmlFor={
                                                          this.state
                                                            .paymentType[item]
                                                            .paymentType
                                                        }
                                                      >
                                                        {
                                                          this.state
                                                            .paymentType[item]
                                                            .text
                                                        }
                                                      </label>
                                                    </div>
                                                  </li>
                                                ))
                                              : ""}

                                            {/* <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  method="paytm"
                                                  id="payment-1"
                                                  defaultChecked={true}
                                                  onClick={() =>
                                                    this.changeMethod("paytm")
                                                  }
                                                />
                                                <label htmlFor="payment-1">
                                                  Use Paytm
                                                </label>
                                              </div>
                                            </li>
                                            <li>
                                              <div className="radio-option stripe">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  method="razorpay"
                                                  id="payment-2"
                                                  //defaultChecked={true}
                                                  onClick={() =>
                                                    this.changeMethod(
                                                      "razorpay"
                                                    )
                                                  }
                                                />
                                                <label htmlFor="payment-2">
                                                  Use Razorpay
                                                </label>
                                              </div>
                                            </li> */}
                                          </>
                                        ) : (
                                          <li>
                                            <div className="radio-option stripe">
                                              <input
                                                type="radio"
                                                name="payment-group"
                                                method="razorpay"
                                                id="payment-2"
                                                defaultChecked={true}
                                                onClick={() =>
                                                  this.changeMethod("razorpay")
                                                }
                                              />
                                              <label htmlFor="payment-2">
                                                Use Razorpay
                                              </label>
                                            </div>
                                          </li>
                                        )}
                                        {/* {currency == "INR" ? (
                                            <li>
                                            <div className="radio-option paypal ">
                                              <input
                                                type="radio"
                                                name="payment-group"
                                                method="paytm"
                                                id="payment-1"
                                                onClick={() =>
                                                  this.changeMethod("paytm")
                                                }
                                              />
                                              <label htmlFor="payment-1">
                                                Pay using Paytm
                                              </label>
                                            </div>
                                          </li>
                                        ) : (
                                          ""
                                        )} */}
                                        {/* {getCookie("country_code") == "in" ? (
                                        <li>
                                          <div className="radio-option stripe">
                                            <input
                                              type="radio"
                                              name="payment-group"
                                              method="payondelivery"
                                              id="payment-3"
                                              onClick={() =>
                                                this.changeMethod("payondelivery")
                                              }
                                            />
                                            <label htmlFor="payment-3">
                                              Pay on Delivery
                                            </label>
                                          </div>
                                        </li>
                                      ) : (
                                        ""
                                      )} */}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {this.state.coupon_code == "razorpay" ||
                          this.state.coupon_code == "paytm" ||
                          (this.state.coupon_code == "" &&
                            currency == "INR") ? (
                            <>
                              {this.state.checked == "razorpay" ? (
                                <>
                                  {isMobile ? (
                                    <div className="">
                                      {/* <RazorpayForm
                                        totalCost={token_amt}
                                        name={name}
                                        email={email}
                                        mobile={mobile}
                                        buttonName={
                                          "Pay Token Inr " + token_amt + " Now"
                                        }
                                        id={"token-amount"}
                                        sellerid={sellerid}
                                        currency={currency}
                                        amount={token_amt}
                                        page={""}
                                        type={""}
                                        event={"token-amount"}
                                        className={"token-amount"}
                                        method="POST"
                                        action={this.state.pay_link}
                                        isLoggedIn={this.isLoggedIn}
                                        item={cartItems}
                                        order_id={this.state.order_id}
                                        //razorpayorderid={this.state.razorpayorderid}
                                        value={
                                          "order_code=" +
                                          this.state.order_code +
                                          ",order_id=" +
                                          this.state.order_id +
                                          ",sellerid=" +
                                          ls.get("sellerid") +
                                          ",mainurl=" +
                                          window.location.hostname +
                                          ",plateform_type=" +
                                          "web" +
                                          ",security_token=" +
                                          "" +
                                          ",is_Token=" +
                                          "1" +
                                          ",amount=" +
                                          token_amt
                                        }
                                      /> */}

                                      <RazorpayForm
                                        totalCost={totalCartValue}
                                        name={name}
                                        email={email}
                                        mobile={mobile}
                                        buttonName={
                                          "Pay Inr " + totalCartValue + " Now"
                                        }
                                        id={"all-amount"}
                                        sellerid={sellerid}
                                        currency={currency}
                                        amount={totalCartValue}
                                        page={""}
                                        type={""}
                                        event={"all-amount"}
                                        className={"all-amount"}
                                        method="POST"
                                        action={this.state.pay_link}
                                        isLoggedIn={this.isLoggedIn}
                                        item={cartItems}
                                        order_id={this.state.order_id}
                                        //razorpayorderid={this.state.razorpayorderid}
                                        value={
                                          "order_code=" +
                                          this.state.order_code +
                                          ",order_id=" +
                                          this.state.order_id +
                                          ",sellerid=" +
                                          ls.get("sellerid") +
                                          ",mainurl=" +
                                          window.location.hostname +
                                          ",plateform_type=" +
                                          "web" +
                                          ",security_token=" +
                                          "" +
                                          ",is_Token=" +
                                          "0" +
                                          ",amount=" +
                                          totalCartValue
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <div className="d-flex justify-content-between">
                                      {/* <RazorpayForm
                                        totalCost={token_amt}
                                        name={name}
                                        email={email}
                                        mobile={mobile}
                                        buttonName={
                                          "Pay Token Inr " + token_amt + " Now"
                                        }
                                        id={"token-amount"}
                                        sellerid={sellerid}
                                        currency={currency}
                                        amount={token_amt}
                                        page={""}
                                        type={""}
                                        event={"token-amount"}
                                        className={"token-amount"}
                                        method="POST"
                                        action={this.state.pay_link}
                                        isLoggedIn={this.isLoggedIn}
                                        item={cartItems}
                                        order_id={this.state.order_id}
                                        //razorpayorderid={this.state.razorpayorderid}
                                        value={
                                          "order_code=" +
                                          this.state.order_code +
                                          ",order_id=" +
                                          this.state.order_id +
                                          ",sellerid=" +
                                          ls.get("sellerid") +
                                          ",mainurl=" +
                                          window.location.hostname +
                                          ",plateform_type=" +
                                          "web" +
                                          ",security_token=" +
                                          "" +
                                          ",is_Token=" +
                                          "1" +
                                          ",amount=" +
                                          token_amt
                                        }
                                      /> */}

                                      <RazorpayForm
                                        totalCost={totalCartValue}
                                        name={name}
                                        email={email}
                                        mobile={mobile}
                                        buttonName={
                                          "Pay Inr " + totalCartValue + " Now"
                                        }
                                        id={"all-amount"}
                                        sellerid={sellerid}
                                        currency={currency}
                                        amount={totalCartValue}
                                        page={""}
                                        type={""}
                                        event={"all-amount"}
                                        className={"all-amount"}
                                        method="POST"
                                        action={this.state.pay_link}
                                        isLoggedIn={this.isLoggedIn}
                                        item={cartItems}
                                        order_id={this.state.order_id}
                                        //razorpayorderid={this.state.razorpayorderid}
                                        value={
                                          "order_code=" +
                                          this.state.order_code +
                                          ",order_id=" +
                                          this.state.order_id +
                                          ",sellerid=" +
                                          ls.get("sellerid") +
                                          ",mainurl=" +
                                          window.location.hostname +
                                          ",plateform_type=" +
                                          "web" +
                                          ",security_token=" +
                                          "" +
                                          ",is_Token=" +
                                          "0" +
                                          ",amount=" +
                                          totalCartValue
                                        }
                                      />
                                    </div>
                                  )}
                                </>
                              ) : this.state.checked == "paytm" ? (
                                <>
                                  {/* <button
                                    className="btn btn-solid my-3 mr-2"
                                    id={cartItems.cartitemid}
                                    data-id="1"
                                    onClick={this.submitPaymentProcessToken}
                                  >
                                    <i
                                      className={
                                        currency == "INR"
                                          ? "fa fa-inr"
                                          : "fa fa-usd"
                                      }
                                    ></i>{" "}
                                    Pay Token{" "}
                                    {new Intl.NumberFormat().format(
                                      this.state.token_amt
                                    )}{" "}
                                    now
                                  </button> */}

                                  <button
                                    className="btn btn-solid my-3 mr-2"
                                    id={cartItems.cartitemid}
                                    data-id="2"
                                    onClick={this.submitPaymentProcess}
                                  >
                                    <i
                                      className={
                                        currency == "INR"
                                          ? "fa fa-inr"
                                          : "fa fa-usd"
                                      }
                                    ></i>{" "}
                                    Pay{" "}
                                    {new Intl.NumberFormat().format(
                                      totalCartValue
                                    )}{" "}
                                    now
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            <>
                              {currency == "INR" ? (
                                <>
                                  {this.state.checked == "razorpay" ? (
                                    <RazorpayForm
                                      totalCost={totalCartValue}
                                      name={name}
                                      email={email}
                                      mobile={mobile}
                                      buttonName={
                                        "Pay Inr " + totalCartValue + " Now"
                                      }
                                      id={"all-amount"}
                                      sellerid={sellerid}
                                      currency={currency}
                                      amount={totalCartValue}
                                      page={""}
                                      type={""}
                                      event={"all-amount"}
                                      className={"all-amount"}
                                      method="POST"
                                      action={this.state.pay_link}
                                      isLoggedIn={this.isLoggedIn}
                                      item={cartItems}
                                      order_id={this.state.order_id}
                                      //razorpayorderid={this.state.razorpayorderid}
                                      value={
                                        "order_code=" +
                                        this.state.order_code +
                                        ",order_id=" +
                                        this.state.order_id +
                                        ",sellerid=" +
                                        ls.get("sellerid") +
                                        ",mainurl=" +
                                        window.location.hostname +
                                        ",plateform_type=" +
                                        "web" +
                                        ",security_token=" +
                                        "" +
                                        ",is_Token=" +
                                        "0" +
                                        ",amount=" +
                                        totalCartValue
                                      }
                                    />
                                  ) : (
                                    <button
                                      className="btn btn-solid my-3 mr-2"
                                      id={cartItems.cartitemid}
                                      data-id="2"
                                      onClick={this.submitPaymentProcess}
                                    >
                                      <i
                                        className={
                                          currency == "INR"
                                            ? "fa fa-inr"
                                            : "fa fa-usd"
                                        }
                                      ></i>{" "}
                                      Pay{" "}
                                      {new Intl.NumberFormat().format(
                                        totalCartValue
                                      )}{" "}
                                      now
                                    </button>
                                  )}
                                </>
                              ) : (
                                <RazorpayForm
                                  totalCost={totalCartValue}
                                  name={name}
                                  email={email}
                                  mobile={mobile}
                                  buttonName={
                                    "Pay Usd " + totalCartValue + " Now"
                                  }
                                  id={"all-amount"}
                                  sellerid={sellerid}
                                  currency={currency}
                                  amount={totalCartValue}
                                  page={""}
                                  type={""}
                                  event={"all-amount"}
                                  className={"all-amount"}
                                  method="POST"
                                  action={this.state.pay_link}
                                  isLoggedIn={this.isLoggedIn}
                                  item={cartItems}
                                  order_id={this.state.order_id}
                                  //razorpayorderid={this.state.razorpayorderid}
                                  value={
                                    "order_code=" +
                                    this.state.order_code +
                                    ",order_id=" +
                                    this.state.order_id +
                                    ",sellerid=" +
                                    ls.get("sellerid") +
                                    ",mainurl=" +
                                    window.location.hostname +
                                    ",plateform_type=" +
                                    "web" +
                                    ",security_token=" +
                                    "" +
                                    ",is_Token=" +
                                    "0" +
                                    ",amount=" +
                                    totalCartValue
                                  }
                                />
                              )}
                            </>
                            // <button
                            //   className="btn btn-solid my-3 mr-2"
                            //   id={cartItems.cartitemid}
                            //   data-id="2"
                            //   onClick={this.submitPaymentProcessRazorPay}
                            // >
                            //   <i
                            //     className={
                            //       currency == "INR" ? "fa fa-inr" : "fa fa-usd"
                            //     }
                            //   ></i>{" "}
                            //   Pay{" "}
                            //   {new Intl.NumberFormat().format(totalCartValue)}{" "}
                            //   now
                            // </button>
                            // <button
                            //   className="btn btn-solid  mb-5 my-3"
                            //   id={cartItems.cartitemid}
                            //   onClick={this.orderSubmit}
                            // >
                            //   {"Place order"}
                            // </button>
                          )}
                          {this.state.bank_details !== null &&
                          (this.state.coupon_code == "beldara" ||
                            this.state.coupon_code == "") ? (
                            <>
                              {this.state.coupon_code == "" ? (
                                <span className="d-flex justify-content-center h6">
                                  OR
                                </span>
                              ) : (
                                ""
                              )}
                              <div className="card mt-4">
                                <div className="card-header text-dark py-1">
                                  <i className="fa fa-dolly" />
                                  NEFT/IMPS TRANSFER
                                </div>
                                <div className="card-body py-1">
                                  <div className="d-flex justify-content-between">
                                    <div>Account Name</div>
                                    <div>{this.state.bank_details.name}</div>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <div>Bank Name</div>
                                    <div>
                                      {this.state.bank_details.beneficiary_bank}
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <div>Account No</div>
                                    <div>
                                      {this.state.bank_details.acc_number}
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <div>Bank Branch</div>
                                    <div>
                                      {
                                        this.state.bank_details
                                          .beneficiary_address
                                      }
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <div>IFSC Code</div>
                                    <div>
                                      {this.state.bank_details.bank_swift_code}
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    className="d-none"
                                    name="upload_receipt"
                                    id="upload_receipt"
                                    onChange={this.submitOnlineTransfer}
                                    accept="image/x-png,image/gif,image/jpeg"
                                  />
                                  <div className="reverse-flow-flex">
                                    <button
                                      className="btn"
                                      style={custom_button}
                                      onClick={this.openfileManager}
                                    >
                                      Upload transaction receipt
                                    </button>
                                    <button
                                      className="btn mx-2"
                                      style={custom_button}
                                      id="submit_order_receipt"
                                      onClick={this.submitForm}
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="" id="preview_image">
                                <div className="flex-column align-items-end d-flex">
                                  <i
                                    id="close_img"
                                    onClick={this.clearAll}
                                    className="fa fa-close d-none mouse_pointer"
                                  ></i>
                                </div>
                                <img src="" className="d-none" id="img_src" />
                              </div>
                              <div className="d-flex align-items-end flex-column my-2">
                                <span
                                  className="text-danger d-none"
                                  id="error_upload_field"
                                >
                                  Please Upload File
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="d-flex justify-content-center">
                            <div>
                              <h6>Your order Id is {this.state.order_code}</h6>
                            </div>
                          </div>
                          <div className="d-flex justify-content-center">
                            <div>
                              <a
                                href={`${SellerUrl}/my_purchase.html?order=${this.state.order_code}`}
                                target="_blank"
                                className="btn"
                                style={custom_button}
                              >
                                Go to my Order
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>):(<section className="cart-section section-b-space">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div>
                    <div className="col-sm-12 empty-cart-cls text-center">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/icon-empty-cart.png`}
                        className="img-fluid mb-4"
                        alt=""
                      />
                      <h3>
                        <strong>Your Cart is Empty</strong>
                      </h3>
                      <h4>Explore more shortlist some items.</h4>
                      
                      <a href="https://indiabigshop.com"><button className="btn btn-solid">Continue shopping</button></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>)}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    countries: state.data.countries,
    user: state.user.user,
    currency: state.data.symbol,
    totalCost: state.data.totalCost,
    orderProps: state,
  };
};

export default connect(mapStateToProps)(StartOrderTest);
// export default StartOrder;
