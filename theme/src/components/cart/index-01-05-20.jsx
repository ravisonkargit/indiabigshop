import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ls from "local-storage";
import Breadcrumb from "../common/breadcrumb";
import {
  getCartTotal,
  getShippingCost,
  getTotalCartValue,
  getTotalShippingCost,
  getFinalShippingCost,
} from "../../services";
import {
  removeFromCart,
  incrementQty,
  decrementQty,
  changeQty,
  getCart,
  updateCart,
  getAllCountry,
  receiveGetCart,
  receiveCart,
} from "../../actions";
import store from "../../store";
import { imgUrl } from "../../constants/variable";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import * as types from "../../constants/ActionTypes";
import $ from "jquery";
import { captureEvent, getCookie, showToast } from "../../functions";
import LoadingComponent from "../products/common/loading-bar";
var cartData;
var countryOfSeller = [];
var tshipcost = 0;
var tproductcost = 0;
var tcartcost = 0;
var defaultCountry = [];
class cartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCartValue: 0,
      totalProductCost: 0,
      totalShippingCost: 0,
      cartItems: null,
      symbol: "INR",
      usdValue: 1,
      inrValue: 70,
      update: 0,
      shippingCharges: [],
      // shippingCountry: 93,
      // shippingCountryName: 'Afghanistan',
      express: "air",
      simProduct: "",
      shippingNotAvailable: 0,
      shippingDetails: [],
      reloadAgain: 0,
      isShippingCountry: 0,
      isPageLoaded: 0,
      cartid: "",
      minShippingCostINR: 40,
      minShippingCostUSD: 5,
      minShippingCost: 40,
      finalShippingCost: 0,
      shouldUpdate: 1,
      wallet_amount: 0.0,
      select_wallet_amount_option: false,
      wallet_used: 0,
      totalCartStaticValue: 0,
      render_total_static: 0,
      wallet_usd_amount: 0,
      vaidation : false,
      validation_text : 'shopping amount must be greater than wallet amount'
    };

    this.decreaseOneQty = this.decreaseOneQty.bind(this);
    this.increaseOneQty = this.increaseOneQty.bind(this);
    this.deleteCartitem = this.deleteCartitem.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // is logged in then get cart products
    //if (ls.get('sellerid')) {
    //  console.log('componentDidMount',this.state);
    try {
      store
        .dispatch(
          getCart(
            ls.get("sellerid"),
            getCookie("mhinpbnb"),
            this.props.data.symbol
          )
        )
        .then((response) => {
          if (response)
            store.dispatch(
              receiveGetCart(
                response,
                this.props.data.symbol,
                this.state.inrValue
              )
            );

          if (this.state.isPageLoaded == 0) {
            this.setState({
              isPageLoaded: 1,
            });
          }
        });
    } catch (e) {
      console.log("not found");
    }
    //}
    store.dispatch(getAllCountry());

    var toast = $("#toast_message").detach();
    $(toast).insertAfter(".breadcrumb-section");
    axios
      .post(
        `${types.ApiUrl}/common/get_wallet_amount.php`,
        {
          sellerid: ls.get("log_id"),
          txn_event: "product_purchased",
          security_token: "",
          plateform_type: "",
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
          var new_generated_value = res.data.result[0].r_total_amount/this.state.inrValue;
        this.setState({
           wallet_amount:parseInt(res.data.result[0].r_total_amount),
           wallet_usd_amount : parseFloat(new_generated_value).toFixed(2),
          // wallet_usd_amount : 5
          // wallet_amount: 40,
        });
        // console.log(res,99,this.state.wallet_amount);
      })
      .catch((err) => {
        console.log("error ocurred", err);
      });
  }

  handleChange = async (e) => {
    //  console.log(this.state,117);
      
    //  console.log(new_valuable_amount,this.state.wallet_amount,153);
    if (this.state.render_total_static == 0) {
      //  console.log('if condition in handleChange');
      this.setState({
        totalCartStaticValue: this.state.totalCartValue,
        render_total_static: 1,
      });
      if(this.state.symbol == 'USD'){
        var new_valuable_amount = this.state.wallet_amount/this.state.inrValue;
        this.setState({
            wallet_usd_amount : new_valuable_amount
        })
     }
    }
    if (
      $("#wallet_amount_check").prop("checked") == true &&
      this.state.wallet_used === 0
    ) {
      this.setState({
        select_wallet_amount_option: true,
        wallet_used: 1,
      });
      if(this.state.render_total_static == 0){
        if(this.state.symbol == 'USD'){
          if(new_valuable_amount > 0 && this.state.totalProductCost > new_valuable_amount){
            var new_amount = 
            parseFloat(this.state.totalCartValue - new_valuable_amount).toFixed(2)
          }else if(new_valuable_amount > 0 && this.state.totalProductCost < new_valuable_amount){
            var amount_to_be_cut = this.state.totalProductCost/2;
            var new_amount = 
            parseFloat(this.state.totalCartValue - amount_to_be_cut).toFixed(2)
          }
            // var new_amount = 
            //      parseFloat(this.state.totalCartValue - new_valuable_amount).toFixed(2)
           }else{
             if(this.state.wallet_amount > 0 &&  this.state.totalProductCost > this.state.wallet_amount){
              var new_amount = parseFloat(
                this.state.totalCartValue - this.state.wallet_amount
              ).toFixed(2);
             }else if(this.state.wallet_amount > 0 &&  this.state.totalProductCost < this.state.wallet_amount){
               var new_amount_to_cut = this.state.totalProductCost/2;
              var new_amount = parseFloat(
                this.state.totalCartValue - new_amount_to_cut
              ).toFixed(2);
             }
           
           }
      }else{
        if(this.state.symbol == 'USD'){
          if(this.state.wallet_usd_amount > 0 && this.state.totalProductCost > this.state.wallet_usd_amount){
            var new_amount = 
            parseFloat(this.state.totalCartValue - this.state.wallet_usd_amount).toFixed(2)
          }else if(this.state.wallet_usd_amount > 0 && this.state.totalProductCost < this.state.wallet_usd_amount){
            var amount_to_be_cut = this.state.totalProductCost/2;
            var new_amount = 
            parseFloat(this.state.totalCartValue - amount_to_be_cut).toFixed(2)
          }
            // var new_amount = 
            //      parseFloat(this.state.totalCartValue - new_valuable_amount).toFixed(2)
           }else{
             if(this.state.wallet_amount > 0 &&  this.state.totalProductCost > this.state.wallet_amount){
              var new_amount = parseFloat(
                this.state.totalCartValue - this.state.wallet_amount
              ).toFixed(2);
             }else if(this.state.wallet_amount > 0 &&  this.state.totalProductCost < this.state.wallet_amount){
               var new_amount_to_cut = this.state.totalProductCost/2;
              var new_amount = parseFloat(
                this.state.totalCartValue - new_amount_to_cut
              ).toFixed(2);
             }
           
           }
        // if(this.state.symbol == 'USD'){
        //     var new_amount = 
        //          parseFloat(this.state.totalCartValue - this.state.wallet_usd_amount).toFixed(2)
        //    }else{
        //     var new_amount = parseFloat(
        //          this.state.totalCartValue - this.state.wallet_amount
        //        ).toFixed(2);
        //    }
      }
    //   console.log(new_valuable_amount,new_amount,165,this.state.totalCartValue,this.state.wallet_amount,this.state.wallet_usd_amount);
      if (new_amount > 0) {
        await this.setState({
          totalCartValue: new_amount,
          // validation : false
        });
      }else{
        this.setState({
          // validation : true
        })
      }
    } else {
      this.setState({
        select_wallet_amount_option: false,
        shouldUpdate: 1,
        wallet_used: 0,
        totalCartValue: this.state.totalCartStaticValue,
        // validation : false
      });
    }
  };
//   componentWillReceiveProps(nextProps){
//     console.log(this.state,188);
//   }
  componentDidUpdate(nextProps) {
    //  console.log(this.state,136);
    // set inr value w.r.t usd
    try {
      if (
        this.state.inrValue != this.props.currencyValue.currencyValue[0].INR &&
        parseFloat(this.props.currencyValue.currencyValue[0].INR) >
          parseFloat(0)
      ) {
        this.setState({
          inrValue: this.props.currencyValue.currencyValue[0].INR,
        });
      }
    } catch (e) {
      this.setState({
        inrValue: 70,
      });
    }

    try {
      // if currency is changed then update cart
      if (
        this.props.data.symbol != this.state.symbol &&
        this.state.symbol !== undefined
      ) {
        //  console.log('change currency',this.props.data.symbol , this.state.symbol ,nextProps.data)
        store.dispatch(
          updateCart(
            this.props.data.symbol,
            this.state.inrValue,
            this.state.usdValue
          )
        );
        this.setState({
          symbol: this.props.data.symbol,
        });
      }

      // if country is changed then set country to state
      if (
        getCookie("countryid") &&
        getCookie("countryid") != this.state.shippingCountry
      ) {
        this.setState(
          {
            shippingCountry: getCookie("countryid"),
            shippingCountryName: getCookie("country_name"),
          },
          () => this.handleCountry()
        );
      }
    } catch (e) {
      console.log("can not set country");
    }

    // get cart data from store
    let temp = 0;
    if (ls.get("sellerid") && this.props.cartList.cart) {
      if (this.props.cartList.cart.length == 0) {
        //  console.log('dispatch getCart')
        store
          .dispatch(getCart(ls.get("sellerid"), this.props.data.symbol))
          .then((response) => {
            if (response)
              store.dispatch(receiveCart(response, this.props.data.symbol));

            if (this.state.isPageLoaded == 0) {
              this.setState({
                isPageLoaded: 1,
              });
            }
          });
      } else {
        if (this.state.isPageLoaded == 0) {
          this.setState({
            isPageLoaded: 1,
          });
        }
      }
    }

    if (this.props.cartList.cart) {
      if (this.props.cartList.cart.length > 0) {
        $(".cart_badge").text(this.props.cartList.cart.length);
        if (this.state.reloadAgain == 0) {
          this.setState({
            reloadAgain: 1,
          });

          // nextProps.cartList.cart.forEach( (res, ind) => {
          // let productid = res.productid;
          // let qty = res.qty;
          // let symbol = this.props.data.symbol;
          // let inrValue, usdValue
          // store.dispatch({
          // type: types.CHANGE_QTY,
          // productid,
          // qty,
          // symbol,
          // inrValue,
          // usdValue
          // });
          // });
        }
      }
    }

    //update cartitems with cart data

    //  console.log('cartitems latest', this.props.cartList.cart, nextProps.cartList.cart, this.state.cartItems, cartData)
    if (
      (JSON.stringify(this.props.cartList.cart) !==
        JSON.stringify(this.state.cartItems) ||
        this.state.shouldUpdate == 1) &&
      this.props.cartList.cart &&
      this.props.cartList.cart !== undefined
    ) {
      //cartData = [...this.props.cartList.cart];
      //  console.log('inside', nextProps.cartList.cart)
      this.setState(
        {
          cartItems: [...this.props.cartList.cart],
          symbol: this.props.data.symbol,
          shouldUpdate: 0,
        },
        () => {
          console.log("cart set");
          this.setCost();
        }
      );

      let countryToCheck, countryid;
      countryOfSeller = [];
      this.props.cartList.cart.forEach((eachcartitem, index) => {
        this.setState({
          cartid: eachcartitem.cartid,
        });
        if (eachcartitem.name != "" && eachcartitem.name !== undefined) {
          {
            eachcartitem.sellerCountry
              ? (countryToCheck = eachcartitem.sellerCountry)
              : (countryToCheck = "india");
          }

          {
            eachcartitem.countryid
              ? (countryid = eachcartitem.countryid)
              : (countryid = 91);
          }
          console.log(countryOfSeller[countryToCheck],countryOfSeller,408);
          if (!countryOfSeller[countryToCheck]) {
            countryOfSeller[countryToCheck] = {
              country: countryToCheck,
              shippingCost: 0,
              finalShippingCost: 0,
              countryid: countryid,
              weight: parseFloat(0),
              express: this.state.express,
            };
          }

          if (
            eachcartitem.weight !== undefined &&
            eachcartitem.weight != null &&
            eachcartitem.weight != "" &&
            parseFloat(eachcartitem.weight) > parseFloat(0.0)
          ) {
            countryOfSeller[countryToCheck]["weight"] =
              parseFloat(countryOfSeller[countryToCheck]["weight"]) +
              parseFloat(eachcartitem.weight) * eachcartitem.qty;
          } else {
            countryOfSeller[countryToCheck]["weight"] =
              parseFloat(countryOfSeller[countryToCheck]["weight"]) +
              eachcartitem.qty;
          }
        }
      });

      this.setState(
        {
          shippingCharges: countryOfSeller,
        },
        () => {
          //  console.log('shippingCharges', this.state.shippingCharges)
        }
      );
    }

    try {
      getCartTotal(this.props.cartList.cart).then(async (val) => {
        if (this.state.totalProductCost != val) {
          //  console.log('getCartTotal')
          await this.setState(
            {
              totalProductCost: val,
            },
            () => this.handleShipping()
          );
        }
        //console.log('outside getCartTotal')
        //this.handleShipping();
      });
    } catch (e) {
      console.log("get cart total");
    }
    // this.handleCountry()

    let calcitem = [];
    if (
      (parseFloat(this.state.totalShippingCost) > parseFloat(0.0) ||
        parseFloat(this.state.totalProductCost) > parseFloat(0.0)) &&
      parseFloat(this.state.totalCartValue) > parseFloat(0.0)
    ) {
      if (
        parseFloat(this.state.totalShippingCost) != parseFloat(tshipcost) ||
        parseFloat(this.state.totalProductCost) != parseFloat(tproductcost) ||
        parseFloat(this.state.totalCartValue) != parseFloat(tcartcost)
      ) {
        tshipcost = this.state.totalShippingCost;
        tproductcost = this.state.totalProductCost;
        tcartcost = this.state.totalCartValue;

        this.update_total_price_cart(
          tshipcost,
          tproductcost,
          tcartcost,
          this.state.symbol,
          this.state.cartItems
        );

        captureEvent(
          "cart",
          "cart_loaded",
          "cart_loaded",
          "success",
          ls.get("sellerid"),
          getCookie("mhinpbnb")
        );
      }
    }
  }

  setCost = () => {
    if (this.state.symbol == "USD") {
      if (this.state.minShippingCost !== this.state.minShippingCostUSD)
        this.setState({
          minShippingCost: this.state.minShippingCostUSD,
        });
    } else {
      if (this.state.minShippingCost !== this.state.minShippingCostINR)
        this.setState({
          minShippingCost: this.state.minShippingCostINR,
        });
    }
  };

  goToOrder = () => {
    if (
      parseFloat(this.state.totalShippingCost) > parseFloat(0) &&
      parseFloat(this.state.totalProductCost) > parseFloat(0) &&
      parseFloat(this.state.totalCartValue) > parseFloat(0)
    ) {
      captureEvent(
        "cart",
        "check_out",
        '{"cart":"' +
          JSON.stringify(this.state.cartItems) +
          '", "totalShippingCost":"' +
          this.state.totalShippingCost +
          '", "totalCartValue":"' +
          this.state.totalCartValue +
          '", "totalProductCost":"' +
          this.state.totalProductCost +
          '", "symbol":"' +
          this.state.symbol +
          '"}',
        "success",
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      var pixeldata = [];
      this.state.cartItems.forEach((val, i) => {
        if (i == 0) pixeldata = [{ id: val.productid, quantity: val.qty }];
        else
          pixeldata = [...pixeldata, { id: val.productid, quantity: val.qty }];
      });
      if($("#wallet_amount_check").prop("checked") == true){
            var cashback_amount = this.state.totalCartStaticValue - this.state.totalCartValue;
          if(this.state.symbol == 'USD'){
              var cashback_amount_usd = cashback_amount;
              var cashback_amount_inr = cashback_amount*this.state.inrValue;
              // var cashback_amount_inr = this.state.totalProductCost*this.state.inrValue;
          }else{
              var cashback_amount_inr = cashback_amount;
              var cashback_amount_usd = cashback_amount/this.state.inrValue;
          }
          

      }else{
        var cashback_amount_inr = 0;
        var cashback_amount_usd = 0;
      }
      // console.log(cashback_amount,cashback_amount_usd,cashback_amount_inr);
      if (ls.get("sellerid")) {
        this.props.history.push({
          pathname:
            "/start-order/" +
            ls.get("sellerid") +
            "_" +
            parseInt(this.state.totalCartValue) +
            ".html",
          state: {
            totalCartValue: this.state.totalCartValue,
            totalProductCost: parseFloat(this.state.totalProductCost).toFixed(2),
            totalShippingCost: this.state.totalShippingCost,
            finalShippingCost: this.state.finalShippingCost,
            cartItems: this.state.cartItems,
            countryName: this.state.shippingCountryName,
            symbol: this.state.symbol,
            cartid: this.state.cartid,
            pixeldata: pixeldata,
            shippingCharges: this.state.shippingCharges,
            inrValue: this.state.inrValue,
            totalCartStaticValue: this.state.totalCartStaticValue,
            cashback_amount_inr : cashback_amount_inr,
            cashback_amount_usd : cashback_amount_usd
          },
        });
      } else {
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
            cartid: this.state.cartid,
            pixeldata: pixeldata,
            shippingCharges: this.state.shippingCharges,
            inrValue: this.state.inrValue,
            link:
              "/start-order/" +
              Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 8) +
              ".html",
          },
        });
      }
      this.setState({
        shippingNotAvailable: 0,
      });
    } else {
      captureEvent(
        "cart",
        "check_out",
        '{"cart":"' +
          JSON.stringify(this.state.cartItems) +
          '", "totalShippingCost":"' +
          this.state.totalShippingCost +
          '", "totalCartValue":"' +
          this.state.totalCartValue +
          '", "totalProductCost":"' +
          this.state.totalProductCost +
          '", "symbol":"' +
          this.state.symbol +
          '"}',
        "failure",
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      this.setState({
        shippingNotAvailable: 1,
      });
    }
  };

  deleteCartitem(item) {
    //  console.log('deleteCartitem');
    if (window.confirm("Do you want to delete this item from your cart?")) {
      this.props.removeFromCart(item.cartitemid);
      showToast("Product Removed from Cart", "1");
      if (this.state.cartItems.length == 1) {
        this.update_total_price_cart(
          0,
          0,
          0,
          this.state.symbol,
          this.state.cartItems
        );
      }

      captureEvent(
        "cart",
        "delete_cart_item",
        item.productid,
        this.state.cartItems.length - 1,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
    }
  }

  // Handle Shipping Country
  handleCountry = async (e) => {
    //  console.log('handleCountry');
    if (e) {
      await this.setState({
        shippingCountry: e.value,
        shippingCountryName: e.label,
      });

      captureEvent(
        "cart",
        "country_change",
        this.state.shippingCountryName,
        this.state.express,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
    } else {
      this.calc_all_cost(
        this.state.cartItems,
        this.state.shippingDetails,
        this.state.shippingCharges,
        this.state.shippingCountry,
        this.state.symbol,
        this.state.inrValue,
        this.state.usdValue,
        this.state.totalProductCost
      );
    }

    try {
      axios
        .post(
          "https://api.indiabigshop.com/common/calculate_country_wise_price.php",
          {
            security_token: "",
            plateform_type: "",
            sellerid: ls.get("sellerid"),
            country_to: this.state.shippingCountry,
            express: this.state.express,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          this.setState({
            shippingDetails: response.data,
            isShippingCountry: response.data.statusId,
          });

          this.calc_all_cost(
            this.state.cartItems,
            response.data,
            this.state.shippingCharges,
            this.state.shippingCountry,
            this.state.symbol,
            this.state.inrValue,
            this.state.usdValue,
            this.state.totalProductCost
          );
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    } catch (e) {
      console.log(" calc");
    }
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

  calc_all_cost = async (
    cartData,
    shippingDetails,
    shippingCharges,
    shippingCountry,
    symbol,
    inrValue,
    usdValue
  ) => {
    var cartItems = { ...cartData };
    //  console.log('calc_all_cost', cartItems);
    if (
      cartItems !== undefined &&
      cartItems !== null &&
      cartItems &&
      cartItems !== ""
    ) {
      //  console.log('inside calc_all_cost', cartItems, shippingDetails, shippingCharges);
      try {
        getShippingCost(
          cartItems,
          shippingDetails,
          shippingCharges,
          shippingCountry,
          symbol,
          inrValue,
          usdValue
        ).then(async (val) => {
          //  console.log('shipping cost', val)
          await this.setState({
            shippingCharges: val,
          });
        });

        if (Object.keys(shippingCharges).length > 0) {
          getTotalShippingCost(shippingCharges, symbol).then(async (val) => {
            await this.setState({
              totalShippingCost: val,
            });
            var new_wallet_amount_in_dy_currency = (this.state.symbol == 'INR') ? this.state.wallet_amount : this.state.wallet_usd_amount; 
            getTotalCartValue(
              this.state.totalShippingCost,
              this.state.totalProductCost,
              new_wallet_amount_in_dy_currency,
              this.state.select_wallet_amount_option
            ).then(async (val) => {
              var new_val =
                parseFloat(this.state.totalShippingCost) +
                parseFloat(this.state.totalProductCost);
                // console.log(new_val,721);
              await this.setState({
                totalCartValue: val,
                totalCartStaticValue: parseFloat(new_val).toFixed(2),
              });
            });
          });

          getFinalShippingCost(shippingCharges, symbol).then(async (val) => {
            await this.setState({
              finalShippingCost: val,
            });
            //  console.log(val, shippingCharges, this.state.finalShippingCost)
          });
        } else {
          await this.setState({
            totalShippingCost: 0,
            totalCartValue: 0,
          });
        }
      } catch (e) {
        console.log("calc");
      }
    }
  };

  decreaseOneQty(pid, cid, qty, quantity, symbol, inr, usd, eachprice) {
    //  console.log('decreaseOneQty', qty, quantity)
    // var product_price = parseFloat(this.state.totalProductCost/qty).toFixed(2);
    if (qty > 1 && qty > quantity) {
      --qty;
      // var new_static_value = parseInt(this.state.totalProductCost) - parseInt(eachprice);
      // var new_static_value = (parseInt(this.state.totalProductCost) - parseInt(eachprice));
      //  console.log(new_static_value,this.state.totalShippingCost,this.state.totalProductCost,qty,593);
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
      this.props.changeQty(pid, cid, qty, symbol, inr, usd);
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
    }
  }

  increaseOneQty(pid, cid, qty, symbol, inr, usd, eachprice) {
    //  console.log(pid, cid, qty, symbol, inr, usd);
    //  var product_price = parseFloat(this.state.totalProductCost/qty).toFixed(2);
    ++qty;
    //  var new_static_value = parseFloat(product_price * qty) + this.state.totalShippingCost;
    // var new_static_value = parseInt(this.state.totalProductCost) + parseInt(eachprice);
    // var new_static_value = parseInt(this.state.totalProductCost) + parseInt(eachprice);
    // console.log(this.state.totalProductCost , eachprice , this.state.totalShippingCost , new_static_value, qty , eachprice,629);
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
    this.props.changeQty(pid, cid, qty, symbol, inr, usd);
    this.setState({
      shouldUpdate: 1,
      //  totalCartStaticValue:new_static_value
    });
  }

  update_total_price_cart(
    totalShippingCost,
    totalProductCost,
    totalCartValue,
    symbol,
    cartItems
  ) {
    //  console.log('update_total_price_cart');
    try {
      axios
        .post(
          "https://api.indiabigshop.com/common/update_total_price_cart.php",
          {
            security_token: "",
            plateform_type: "",
            sellerid: ls.get("sellerid"),
            visitorid: getCookie("mhinpbnb"),
            totalShippingCost: totalShippingCost,
            totalProductCost: parseFloat(totalProductCost).toFixed(2),
            totalCartValue: totalCartValue,
            symbol: symbol,
            cartitem: cartItems,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {})
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    } catch (e) {
      console.log("total price");
    }
  }

  //Handle Express
  handleShipping = async (e, country) => {
    //  console.log('handleShipping')
    if (e) {
      await this.setState({
        express: e.value,
      });
      captureEvent(
        "cart",
        "shipping_method_change",
        this.state.express,
        this.state.shippingCountryName,
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
      let changeInShippingCharge = this.state.shippingCharges;
      Object.keys(changeInShippingCharge).forEach((key, index) => {
        if (country == key) {
          changeInShippingCharge[key].express = e.value;
        }
      });
      this.setState({
        shippingCharges: changeInShippingCharge,
      });
      axios
        .post(
          "https://api.indiabigshop.com/common/calculate_country_wise_price.php",
          {
            security_token: "",
            plateform_type: "",
            sellerid: ls.get("sellerid"),
            country_to: this.state.shippingCountry,
            express: this.state.express,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          this.setState({
            shippingDetails: response.data,
            isShippingCountry: response.data.statusId,
          });

          this.calc_all_cost(
            this.state.cartItems,
            this.state.shippingDetails,
            this.state.shippingCharges,
            this.state.shippingCountry,
            this.state.symbol,
            this.state.inrValue,
            this.state.usdValue,
            this.state.totalProductCost
          );
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    } else {
      this.calc_all_cost(
        this.state.cartItems,
        this.state.shippingDetails,
        this.state.shippingCharges,
        this.state.shippingCountry,
        this.state.symbol,
        this.state.inrValue,
        this.state.usdValue,
        this.state.totalProductCost
      );
    }
  };

  shipDetMethod(shipMethod, startcnt, endcnt, type) {
    let showmethod = [...shipMethod];
    //  console.log('shipDetMethod: ',shipMethod, startcnt, endcnt, type, showmethod)

    let temp1 = showmethod.splice(startcnt, endcnt);
    return showmethod;
  }

  render() {
     console.log('render',this.state);
    const InputProps = {
      required: true,
    };
    const { cartItems, symbol } = this.state;
    const shipMethod = [
      { value: "air", label: "Air Express", country: "india" },
      { value: "sea_surface", label: "Ocean Express", country: "india" },
      { value: "surface", label: "Surface", country: "india" },
    ];
    return (
      <div>
        {/*SEO Support*/}
        <Helmet>
          <title>Cart</title>
          <meta name="description" content="Cart on Beldara.com" />
        </Helmet>

        <div
          id="toast_message"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="toast toast_pull_right fade hide"
        >
          <div className="toast-body">
            <i className="fas fa-check"></i> Product Added To Cart
          </div>
        </div>
        {/*SEO Support End */}

        <Breadcrumb title={"Cart"} />
        {this.state.isPageLoaded == 0 ? (
          <LoadingComponent />
        ) : cartItems && cartItems.length > 0 ? (
          <section className="cart-section section-b-space">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <table className="table cart-table table-responsive-xs">
                    <thead>
                      <tr className="table-head">
                        <th scope="col">image</th>
                        <th scope="col">product name</th>
                        <th scope="col">price</th>
                        <th scope="col">quantity</th>
                        <th scope="col">total</th>
                        <th scope="col">action</th>
                      </tr>
                    </thead>

                    {cartItems.map((eachcartitem, index) => {
                      if (
                        eachcartitem.name != "" &&
                        eachcartitem.name !== undefined
                      ) {
                        let item = eachcartitem;

                        return (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <a
                                  target="_blank"
                                  href={`${process.env.PUBLIC_URL}/product/${item.url}.html`}
                                >
                                  <img
                                    src={`${imgUrl}/product_images_thumb/${item.img}`}
                                    alt={`${item.name} on Beldara.com`}
                                  />
                                </a>

                                <div className="text-dark">
                                  {" "}
                                  Seller from{" "}
                                  <span className="h5 text-dark text-capitalize">
                                    {item.sellerCountry
                                      ? item.sellerCountry
                                      : "India"}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div
                                  className="mobile-cart-content row mouse_pointer"
                                  onClick={this.deleteCartitem.bind(this, item)}
                                >
                                  <i className="fa fa-times text-danger ml-auto"></i>
                                </div>
                                <a
                                  target="_blank"
                                  href={`${process.env.PUBLIC_URL}/product/${item.url}.html`}
                                >
                                  {item.name}
                                </a>

                                <div className="mobile-cart-content row">
                                  {parseFloat(item.eachprice) >
                                  parseFloat(0.0) ? (
                                    <div className="col-xs-12">
                                      <div className="qty-box border-right border-light">
                                        <div className="input-group">
                                          <span className="input-group-prepend">
                                            <button
                                              type="button"
                                              className="btn quantity-left-minus"
                                              onClick={this.decreaseOneQty.bind(
                                                this,
                                                item.productid,
                                                item.cartitemid,
                                                item.qty,
                                                item.quantity,
                                                symbol,
                                                this.state.inrValue,
                                                this.state.usdValue,
                                                item.eachprice
                                              )}
                                              data-type="minus"
                                              data-field=""
                                            >
                                              <i className="fa fa-minus"></i>
                                            </button>
                                          </span>
                                          <input
                                            type="text"
                                            name="quantity"
                                            value={item.qty}
                                            readOnly={true}
                                            className="form-control input-number"
                                          />

                                          <span className="input-group-prepend">
                                            <button
                                              className="btn quantity-right-plus"
                                              onClick={this.increaseOneQty.bind(
                                                this,
                                                item.productid,
                                                item.cartitemid,
                                                item.qty,
                                                symbol,
                                                this.state.inrValue,
                                                this.state.usdValue,
                                                item.eachprice
                                              )}
                                              data-type="plus"
                                              disabled={
                                                item.qty >= item.stock
                                                  ? true
                                                  : false
                                              }
                                            >
                                              <i className="fa fa-plus"></i>
                                            </button>
                                          </span>
                                        </div>
                                      </div>

                                      <small className="text-dark">
                                        Each Price: {symbol} {item.eachprice}
                                      </small>
                                      <div className="text-dark">
                                        <small className="text-dark">
                                          <b>
                                            Total Price: {symbol}{" "}
                                            {item.totalprice}{" "}
                                          </b>
                                        </small>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className=" text-danger">
                                      OUT OF STOCK
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <h4>
                                    {symbol} {item.eachprice}
                                  </h4>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <div className="qty-box">
                                    <div className="input-group">
                                      <span className="input-group-prepend">
                                        <button
                                          type="button"
                                          className="btn quantity-left-minus"
                                          onClick={this.decreaseOneQty.bind(
                                            this,
                                            item.productid,
                                            item.cartitemid,
                                            item.qty,
                                            item.quantity,
                                            symbol,
                                            this.state.inrValue,
                                            this.state.usdValue,
                                            item.eachprice
                                          )}
                                          data-type="minus"
                                          data-field=""
                                        >
                                          <i className="fa fa-minus"></i>
                                        </button>
                                      </span>
                                      <input
                                        type="text"
                                        name="quantity"
                                        value={item.qty}
                                        readOnly={true}
                                        className="form-control input-number"
                                      />

                                      <span className="input-group-prepend">
                                        <button
                                          className="btn quantity-right-plus"
                                          onClick={this.increaseOneQty.bind(
                                            this,
                                            item.productid,
                                            item.cartitemid,
                                            item.qty,
                                            symbol,
                                            this.state.inrValue,
                                            this.state.usdValue,
                                            item.eachprice
                                          )}
                                          data-type="plus"
                                          disabled={
                                            item.qty >= item.stock
                                              ? true
                                              : false
                                          }
                                        >
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className=" text-danger">
                                    OUT OF STOCK
                                  </div>
                                )}
                              </td>
                              <td>
                                {parseFloat(item.eachprice) >
                                parseFloat(0.0) ? (
                                  <h4 className="td-color">
                                    {symbol} {item.totalprice}
                                  </h4>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                <span
                                  className="mouse_pointer"
                                  onClick={this.deleteCartitem.bind(this, item)}
                                >
                                  <i className="fa fa-times text-danger"></i>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        );
                      }
                    })}
                  </table>

                  <div className="d-flex align-items-center">
                    <div className="text-right w-50 mr-5">
                      Total Product Cost :
                    </div>
                    <div className="text-left h6">
                      {symbol} {this.state.totalProductCost}
                    </div>
                  </div>

                  <React.Fragment>
                    {Object.keys(this.state.shippingCharges).map(
                      (eachcountry, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="d-flex justify-content-left align-items-center my-3">
                              <div className="text-right mr-5 w-50 ">
                                Shipping from{" "}
                                {
                                  this.state.shippingCharges[eachcountry]
                                    .country
                                }
                                :
                              </div>
                              <div
                                style={{ width: "40%" }}
                                className="text-left"
                              >
                                {this.state.shippingCountryName ? (
                                  this.state.shippingCountryName.toLowerCase() ==
                                  this.state.shippingCharges[
                                    eachcountry
                                  ].country.toLowerCase() ? (
                                    <Select
                                      id={
                                        this.state.shippingCharges[eachcountry]
                                          .country
                                      }
                                      isOptionSelected="true"
                                      options={this.shipDetMethod(
                                        shipMethod,
                                        1,
                                        1
                                      )}
                                      defaultValue={this.shipDetMethod(
                                        shipMethod,
                                        1,
                                        2
                                      )}
                                      onChange={(e) => {
                                        this.handleShipping(
                                          e,
                                          this.state.shippingCharges[
                                            eachcountry
                                          ].country
                                        );
                                      }}
                                    />
                                  ) : (
                                    <Select
                                      id={
                                        this.state.shippingCharges[eachcountry]
                                          .country
                                      }
                                      isOptionSelected="true"
                                      options={this.shipDetMethod(
                                        shipMethod,
                                        2,
                                        1
                                      )}
                                      defaultValue={this.shipDetMethod(
                                        shipMethod,
                                        1,
                                        2
                                      )}
                                      onChange={(e) => {
                                        this.handleShipping(
                                          e,
                                          this.state.shippingCharges[
                                            eachcountry
                                          ].country
                                        );
                                      }}
                                    />
                                  )
                                ) : (
                                  <Select
                                    id={
                                      this.state.shippingCharges[eachcountry]
                                        .country
                                    }
                                    isOptionSelected="true"
                                    options={shipMethod}
                                    defaultValue={shipMethod[0]}
                                    onChange={(e) => {
                                      this.handleShipping(
                                        e,
                                        this.state.shippingCharges[eachcountry]
                                          .country
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="text-right w-50 mr-5">
                                Shipping Cost From{" "}
                                {
                                  this.state.shippingCharges[eachcountry]
                                    .country
                                }
                                :
                              </div>

                              {parseInt(this.state.isShippingCountry) ==
                              parseInt(1) ? (
                                parseFloat(
                                  this.state.shippingCharges[eachcountry]
                                    .shippingCost
                                ) > parseFloat(0) ? (
                                  <div className="text-left h6">
                                    {" "}
                                    {symbol +
                                      " " +
                                      this.state.shippingCharges[eachcountry]
                                        .shippingCost}{" "}
                                  </div>
                                ) : (
                                  <div className="text-left">
                                    {" "}
                                    Please select another Shipping Method / QTY
                                    to Continue{" "}
                                  </div>
                                )
                              ) : (
                                <div className="text-left">
                                  {" "}
                                  Select Shipping Country to check Shipping Cost{" "}
                                </div>
                              )}
                            </div>
                          </React.Fragment>
                        );
                      }
                    )}
                    {/* {this.state.totalShippingCost > parseFloat(0) ?
 <div className="d-flex align-items-center">
 <div className="text-right w-50 mr-5">Total Shipping Cost (min {symbol + ' '+this.state.minShippingCost}):</div> 
 <div className="text-left h6"> {symbol + ' ' + this.state.totalShippingCost}</div>
 </div>
 : ''} */}
                    {/* <div className="d-flex align-items-center"> */}
                    {/* {this.state.validation ?
                      <div className="d-flex align-items-center">
                      <div className="text-right w-50 mr-5">
                        
                      </div>
                      <div className="text-left h6">
                       {this.state.validation_text}
                      </div>
                    </div>
                    : ''
                    } */}
                    {this.state.wallet_amount != "" &&
                    this.state.wallet_amount != "null" &&
                    this.state.wallet_amount !== null &&
                    this.state.wallet_amount != "0.00" ? 
                      // (this.state.symbol == 'USD' && this.state.totalCartValue > this.state.wallet_usd_amount)
                      (this.state.symbol == 'USD')
                      ?
                      <div className="d-flex align-items-center 1">
                        <div class="text-right w-50 mr-5">
                        </div>
                        <div className="text-left h6">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="wallet_amount_check"
                            id="wallet_amount_check"
                            onChange={this.handleChange}
                          />
                          <label
                            class="form-check-label"
                            for="wallet_amount_check"
                          >
                            {`Use wallet Amount ( ${this.state.symbol} ${parseFloat(this.state.wallet_usd_amount).toFixed(2)})`}
                          </label>
                        </div>
                      </div>
                      // : (this.state.symbol == 'INR' && this.state.totalCartValue > this.state.wallet_amount) ?
                      : (this.state.symbol == 'INR') ?
                      <div className="d-flex align-items-center 2">
                        <div class="text-right w-50 mr-5">
                        </div>
                        <div className="text-left h6">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="wallet_amount_check"
                            id="wallet_amount_check"
                            onChange={this.handleChange}
                          />
                          <label
                            class="form-check-label"
                            for="wallet_amount_check"
                          >
                            {`Use wallet Amount ( ${this.state.symbol} ${parseFloat(this.state.wallet_amount).toFixed(2)})`}
                          </label>
                        </div>
                      </div>
                     : ''
                    : '' 
                    }
                    {/* </div> */}
                    <div className="d-flex align-items-center">
                      <div className="text-right w-50 mr-5">Total Price :</div>

                      {parseInt(this.state.isShippingCountry) == parseInt(1) ? (
                        parseFloat(this.state.totalShippingCost) >
                        parseFloat(0) ? (
                          <div className="text-left h6">
                            {symbol + " " + this.state.totalCartValue}{" "}
                          </div>
                        ) : (
                          <div className="text-left">
                            {" "}
                            Please select another Shipping Method / QTY to
                            Continue{" "}
                          </div>
                        )
                      ) : (
                        <div className="text-left">
                          {" "}
                          Select Shipping Country to check Total Cost{" "}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                </div>
              </div>
              <div className="row cart-buttons">
                <div className="col-6">
                  <Link to={process.env.PUBLIC_URL} className="btn btn-solid">
                    continue shopping
                  </Link>
                </div>
                <div className="col-6">
                  {this.state.shippingNotAvailable == 1 ? (
                    <div className="text text-danger">
                      Please select Shipping Country and method to proceed
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={this.goToOrder}
                    className="btn btn-solid mouse_pointer"
                  >
                    check out
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="cart-section section-b-space">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }
}
// const mapStateToProps = (state) => ( console.log('map state to props',state.cartList.cart), {
// cartItems: state.cartList.cart,
// symbol: state.data.symbol,
// // getCartTotal(state.cartList.cart).then(val => {
// // total = val
// // })
// // getCartTotal(state.cartList.cart).then((val) => { return val})
// })

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, {
  removeFromCart,
  incrementQty,
  decrementQty,
  changeQty,
})(cartComponent);
