import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import ls from "local-storage";
// import RazorpayForm from "../razorpayForm/razorpayForm";
import RazorpayForm from "../razorpayForm/razorpay-new";
import $ from "jquery";
import "./start-order.css";
import { ApiUrl, ImgUrl } from "../../constants/ActionTypes";
import Paytm from "../payment-gateway/paytm";
import PayOnDelivery from "../payment-gateway/pay-on-delivery";
import { captureEvent, getCookie, setCookie } from "../../functions";
import { priceConversion, minTresholdBarrier } from "../../services";
import IntlTelInput from "react-intl-tel-input";
import ReactPixel from "react-facebook-pixel";
import "../../index.scss";
import "react-intl-tel-input/dist/main.css";
import index from "../adduser";
import { apiUrl, betaApi } from "../../constants/variable";
import Modal from "react-responsive-modal";
// import {
//   getCartTotal,
//   getShippingCost,
//   getTotalCartValue,
//   getTotalShippingCost
// } from "../../services";
// import {
//   removeFromCart,
//   incrementQty,
//   decrementQty,
//   changeQty,
//   getCart,
//   updateCart,
//   getAllCountry,
//   receiveGetCart,
//   receiveCart
// } from "../../actions";
// import store from "../../store";

var complete_address = "";
var cashback_value = 0;
var txn_type = "";
class StartOrderTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      checked: "razorpay",
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
      pay_link: `${ImgUrl}/beta_api/payment_confm.php`,
      gst_validated: false,
      gst_in:getCookie("gst_in") != "" && getCookie("gst_in") != null
      ? getCookie("gst_in")
      : "",
    };
    this.validator = new SimpleReactValidator();
    this.selectAddress = this.selectAddress.bind(this);
    this.emptyAddress = this.emptyAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.toggleDiv = this.toggleDiv.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitPaymentProcess = this.submitPaymentProcess.bind(this);
    this.checkGstCharacter = this.checkGstCharacter.bind(this);
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
    $(".unique_class").attr("disabled", "true");
    this.setState({
      addNotValid: 0,
    });
    e.preventDefault();

    if (this.validator.allValid()) {
      if(this.state.gst_in == '' || (this.state.gst_in != '' && this.state.gst_validated)){
        $("#price_validating_start").removeClass("d-none");
      console.log("valid");
      $(".chkValidate")
        .select()
        .css({ border: "none" });
      axios
        .post(
          "https://api.beldara.com/common/upd_add_buyer.php",
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
              this.updateAddress();
              if (response.data.result[0].status == "true") {
                axios
                  .post(
                    `${ImgUrl}/beta_api/validate-pincode-deliverable.php`,
                    {
                      pincode: this.state.pincode,
                      productid: "",
                    },
                    {
                      headers: { "Content-Type": "multipart/form-data" },
                    }
                  )
                  .then((res) => {
                    if (res.data.statusId == 1) {
                      console.log("pincode validated");
                      $("#price_validating_start").addClass("d-none");
                      let product_currency = this.state.symbol;
                      let total_price = this.state.totalCartValue;
                      if (
                        product_currency == "INR" ||
                        product_currency == "" ||
                        product_currency === undefined
                      )
                        total_price = parseFloat(total_price) / this.state.inr;
                      total_price = parseFloat(total_price).toFixed(2);
                      ReactPixel.trackCustom("Purchase", {
                        contents: this.props.location.state.pixeldata,
                        content_type: "product",
                        value: total_price,
                        currency: "USD",
                      });
                      axios
                        .post(
                          this.state.link,
                          {
                            cartid: this.props.location.state.cartid,
                            finalprice: this.state.totalCartValue,
                            sellerid: ls.get("sellerid"),
                            currency: this.state.currency,
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
                            gst_in:this.state.gst_in
                          },
                          {
                            headers: { "Content-Type": "multipart/form-data" },
                          }
                        )
                        .then((res) => {
                          $(".unique_class").removeAttr("disabled");
                          // console.log(res,'statusid');
                          if (res.data.message == 1) {
                            // console.log('inside if');
                            this.setState({
                              modalOpen: true,
                              order_code: res.data.result.order_code,
                              order_id: res.data.result.order_id,
                            });
                            // this.setState({order_code:res.data.result.order_code,order_id:res.data.result.order_id});
                          }
                        })
                        .catch((error) => {
                          $(".unique_class").removeAttr("disabled");
                          console.error(error);
                        });
                    } else {
                      // console.log('pincode invalid');
                      $("#price_validating_start").html(
                        '<i class="fa fa-exclamation-circle mx-1" aria-hidden="true"></i>' +
                          res.data.message
                      );
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                $(".unique_class").attr("disabled", "false");
                $("#price_validating_start").addClass("d-none");
                $("#price_validating_end").removeClass("d-none");
                var inter = setInterval(() => {
                  window.location.href = "/cart.html";
                  clearInterval(inter);
                }, 5000);
                // console.log('error occurred: '+response.data.result[0].status);
              }
              // return
            })
            .catch((error) => {
              console.log(error, 192);
              const result = error.response;
              return Promise.reject(result);
            });
        })
        .catch((error) => {
          const result = error.response;
          // console.log(result,149,error);
          return Promise.reject(result);
        });
      }else{
        $(".unique_class").removeAttr("disabled");
      }
    } else {
      // $('.unique_class').attr('disabled','false');
      $(".unique_class").removeAttr("disabled");
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
        console.log(error, 192);
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
    // window.removeEventListener('scroll', this.handleScroll);
    // console.log(this.props, "render");
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
            currency: getCookie("currency"),
            country_code: getCookie("country_code"),
            country_to: getCookie("countryid"),
            txn_type: this.props.location.state.txn_type,
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
              inrValue: parseFloat(this.props.location.state.inrValue),
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
              txn_type: this.props.location.state.txn_type,
              cartItems: response.data.result.cart,
            });
            $(".common_class_for_spin").addClass("d-none");
            // console.log(response.data.result,128);
          } else {
            $(".common_class_for_spin").addClass("d-none");
            console.log("error occured");
            await this.setState({
              cartItems: null,
            });
          }
        })
        .catch((error) => {
          console.log(error);
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
            symbol: getCookie("currency"),
            txn_type: this.props.location.state.txn_type,
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
              inrValue: parseFloat(this.props.location.state.inrValue),
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
              txn_type: this.props.location.state.txn_type,
              cartItems: response.data.result.cart,
            });
            $(".common_class_for_spin").addClass("d-none");
            // console.log(response.data.result,170);
          } else {
            console.log("error occured");
            await this.setState({
              cartItems: null,
              isPageLoaded: 1,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
  };

  updateCart = async () => {
    axios
      .post(
        `${ApiUrl}/common/receive_cart.php`,
        {
          sellerid: ls.get("log_id"),
          plateform_type: "",
          security_token: "",
          visitor_id: getCookie("mhinpbnb"),
          symbol: getCookie("currency"),
          country_code: getCookie("country_code"),
          txn_type: this.props.location.state.txn_type,
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
            inrValue: parseFloat(this.props.location.state.inrValue),
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
            txn_type: this.props.location.state.txn_type,
            cartItems: response.data.result.cart,
            delivery_address: response.data.result.address,
          });
          this.setDefaultAddress(response.data.result.address);
          // console.log(response.data.result,115);
        } else {
          console.log("error occured");
          await this.setState({
            cartItems: null,
            isPageLoaded: 1,
          });
        }
      })
      .catch((error) => {
        console.log(error);
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
            console.log("fail");
          }
        })
        .catch((error) => {
          console.log("error:" + error);
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
    try{
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
                console.log("success");
              } else {
                console.log("fail");
              }
            })
            .catch((error) => {
              console.log("error:" + error);
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
                console.log("success");
              } else {
                console.log("fail");
              }
            })
            .catch((error) => {
              console.log("error:" + error);
            });
        }
      }
    }catch(error){
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
    this.setState({ modalOpen: false });
    window.location.href =
      "/thankYou.html?type=2&o=1&v=1&e=0&i=&od=" + this.state.order_code;
  };

  submitPaymentProcess = () => {
    // this.setState({modalOpen:false});
    if (this.state.checked === "razorpay") {
      $(".razorpay-payment-button").click();
    } else if (this.state.checked === "paytm") {
      $(".paytmBtn").click();
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
      this.setState({gst_in:value,gst_validated:true})
    } else {
      this.setState({gst_in:value,gst_validated:false})
    }
  };

  render() {
    // console.log('render',this.state);
    const { cartItems, cartid } = this.props.location.state;
    const {
      totalCartValue,
      totalProductCost,
      finalShippingCost,
      countryName,
      totalCartStaticValue,
      cashback_amount_inr,
      cashback_amount_usd,
      cashback_value,
    } = this.state;
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
    return (
      <div id={this.state.key}>
        <div className="container">
          <div className="row col-md-12">
            <div className="col-md-7">
              <form className="">
                <div className="card mt-4">
                  <div className="card-header text-dark py-1">
                    <i className="fa fa-dolly" />
                    Shipping Details
                  </div>
                  <div className="card-body py-1">
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
                                              onChange={this.setStateFromInput}
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
                                              id="pincode"
                                              name="pincode"
                                              placeholder=" "
                                              className="form-control input-number"
                                              onChange={this.setStateFromInput}
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
                                              onChange={this.setStateFromInput}
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
                                              onChange={this.setStateFromInput}
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
                                              onChange={this.checkGstCharacter.bind(this, null)}
                                              value={this.state.gst_in}
                                            />
                                            <label htmlFor="gst_in">
                                              {"GST No. (optional)"}
                                            </label>
                                          </div>
                                          {this.state.gst_in != "" &&
                                          this.state.gst_in != null && !this.state.gst_validated ? (
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
                                          ) : (this.state.gst_in != "" &&
                                          this.state.gst_in != null && this.state.gst_validated)
                                          ?
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
                                              :''
                                          }
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
                      <div className="mt-2">
                        <div>Estimated Lead Time: </div>
                        <div>
                          Ship within 2 - 7 business days after supplier
                          receiving payment.
                        </div>
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
                    <span onClick={this.toggleDiv} className="mouse_pointer">
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
                id="cart_item_div"
                className={`row mx-0 border px-2 ${
                  this.state.cartItems.length >= 2 ? "overflowCartTwoItems" : ""
                }`}
              >
                {this.state.cartItems.length > 0 ? (
                  <React.Fragment>
                    {this.state.cartItems.map((val, index) => (
                      <div className="col-md-12 row mx-0 my-2 border bg-cart-color">
                        <div className="col-md-3 mx-2 my-2">
                          <img
                            className="w-100 h-100"
                            src={`https://img.beldara.com/product_images_thumb/${val.img}`}
                          />
                        </div>
                        <div className="col-md-8 my-2 align-items-center">
                          <div className="text-truncate">{val.name}</div>
                          <div className="text-truncate">{val.company}</div>
                          <hr />
                          <div className="d-flex justify-content-around">
                            <p className="text-left">
                              {val.qty} {val.unit}
                            </p>
                            <p className="text-right">
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
                                  currency == "INR" ? "fa fa-inr" : "fa fa-usd"
                                }
                              ></i>{" "}
                              {new Intl.NumberFormat().format(val.totalprice)}
                            </p>
                          </div>
                        </div>
                      </div>
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
              <div className="card-text text-right">
                {this.state.addNotValid ? (
                  <div className="alert col-sm-12 col-md-7 ml-auto text-center alert-danger">
                    Please Enter Valid address
                  </div>
                ) : (this.state.gst_in !== '' && !this.state.gst_validated)
                  ? 
                  <div className="alert col-sm-12 col-md-7 ml-auto text-center alert-danger">
                   Invalid GST
                  </div>
                  : ''
                }
                {this.state.checked == "razorpay" ||
                this.state.checked == "paytm" ? (
                  <button
                    className="btn btn-solid  mb-5 my-3 unique_class"
                    id={cartItems.cartitemid}
                    onClick={this.orderSubmit}
                  >
                    confirm order
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
                <Paytm
                  user={this.props.user}
                  amount={totalCartValue}
                  totalShipmentCost={finalShippingCost}
                  countryName={countryName}
                  address={this.state.address}
                  landmark={this.state.landmark}
                  state={this.state.state}
                  pincode={this.state.pincode}
                  city={this.state.city}
                  cartid={cartid}
                  complete_address={complete_address}
                  sellerid={sellerid}
                  buyerid={sellerid}
                  item={cartItems}
                  txn_type={this.state.txn_type}
                  cashback_value={cashback_value}
                />
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
                          <div className="d-flex justify-content-around">
                            <div>
                              <h6>Your order Id is {this.state.order_code}</h6>
                            </div>
                            <div>
                              <a
                                href={`/thankYou.html?type=2&o=1&v=1&e=0&i=&od=${this.state.order_code}`}
                                className="btn"
                                style={custom_button}
                              >
                                Go to my Order
                              </a>
                            </div>
                          </div>
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
                                      {currency == "INR" ? (
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
                                      )}
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
                          {this.state.checked == "razorpay" ||
                          this.state.checked == "paytm" ? (
                            <button
                              className="btn btn-solid  mb-5 my-3"
                              id={cartItems.cartitemid}
                              onClick={this.submitPaymentProcess}
                            >
                              <i
                                className={
                                  currency == "INR" ? "fa fa-inr" : "fa fa-usd"
                                }
                              ></i>{" "}
                              Pay{" "}
                              {new Intl.NumberFormat().format(totalCartValue)}{" "}
                              now
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
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
