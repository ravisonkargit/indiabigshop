import React, { Component,lazy,Suspense } from "react";
import ls from "local-storage";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
import PriceCalc from "../../../collection/common/priceCalc";
import PriceCalcOffer from "../../../collection/common/priceCalcOffer";
import NumberFormat from "react-number-format";
import GetPriceSelected from "./get-price-selected";
import LoginPopUp from "../../../loginPopUp";
import SignUpPopUp from "../../../signUpPopUp";
import { withRouter } from "react-router-dom";
import { getCookie, captureEvent } from "../../../../functions";
import { imgUrl } from "../../../../constants/variable";
// import StarReview from "./rating";
import StarReview from "../../../collection/common/rating";
import axios from "axios";
import { getAllCurrencyValue,getChatWithSupplier } from '../../../../actions';
import ReactPixel from "react-facebook-pixel";
import $ from 'jquery';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import TagManager from "react-gtm-module";
// import ReactGA from 'react-ga';
import LiveReq from "../../../liveReq";
import store from '../../../../store';

const ChatBox = lazy(()=>import("../../../live-chat/chatbox")) ;

// import "./ratingStyle.css";

var id, realPath;
// var priceCond = 0;
var price, eachunit = 0;
var currency = 'INR';
function priceCond(item, ele){
  let dataCond = 0;
  if (item.price && item.price !== undefined && item.price.length > 0){
    item.price.some(eachPrice => {
      if ( parseFloat(eachPrice.eachunit) > parseFloat(0) ){
        dataCond = 1;
      }else{
        dataCond = 0;
      }
    })
  }
  // console.log(item.beldara_prime)
  
  // if (dataCond == 1 && (item.beldara_prime == 1 || (getCookie('country_code').toLowerCase()=='in' || getCookie('country_code')=='') ) ){
  //   return ( <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Buy Now </button> );
  // }else{
  //   return ( <Link onClick={() => ele.event_ask_for_price('ask_for_price')} id="ask_for_price" className="btn btn-solid my-2" clickevent="Ask_for_price" to={{pathname: "/post-requirement.html", state:item }} > Contact Supplier </Link> );
  // }

  if (dataCond == 1){
    return ( 
      <React.Fragment>
      <div>
        {/* <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Add To Cart </button>  */}
        <button className="btn btn-solid my-2 ml-2 " onClick={ele.validate} id="expressCheckOut" clickevent="Express_checkout"> Buy Now </button> 
      </div>
      <div>
        {/* <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Add To Cart </button>  */}
        {item.sellerid != ls.get('log_id') 
        ? <button className="btn btn-solid my-2 ml-2 " onClick={ele.callAuction} id="e_auction" clickevent="e_auction"> E-Auction </button> 
        : ''
        }
      </div>
      </React.Fragment>
    );
  }else{
    return ( 
      <React.Fragment>
        <Link onClick={() => ele.event_ask_for_price('ask_for_price')} id="ask_for_price" className="btn btn-solid my-2" clickevent="Ask_for_price" to={{pathname: "/post-requirement.html", state:item }} >
          Contact Supplier 
        </Link> 
        <div>
        {/* <button className="btn btn-solid my-2" onClick={ele.validate} id="buyBtn" clickevent="Buy_Now"> Add To Cart </button>  */}
        {
        item.sellerid != ls.get('log_id')
        ? <button className="btn btn-solid my-2 ml-2 " onClick={ele.callAuction} id="e_auction" clickevent="e_auction"> E-Auction </button> 
        : ''
        }
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
      buyer_country: '',
      buyer_country_id: '',
      buyer_country_code: '',
      currency: 'INR',
      inrValue: 70,
      product_seller: '',
      price: 0,
      eprice: 0,
      askAuctionInit: '',
      showAuctionPop: false,
      fromChatWithSupplier:false,
      shouldReload: false,
      qtyerror:false
    };
    // this.setState({quantity: parseInt(this.props.item.qty)})
  }

 
  
  UNSAFE_componentWillMount() {
    //Set State Of Quantity
    this.setState({ quantity: parseInt(this.props.item.qty) });
  }


  minusQty = async () => {
    if (this.state.quantity > 0) {
      // this.setState({stock: 'InStock'}) 
      await this.setState({ quantity: this.state.quantity - 1 });
    }
    this.CartCalc();
  };

  plusQty = async () => {
    // if(this.props.item.stock >= this.state.quantity) {     
    await this.setState({ quantity: this.state.quantity + 1 });
    if (this.state.quantity >= this.props.item.qty) {
      await this.setState({
        moqErr: false
      });
    }
    this.CartCalc();
    // }else{
    // this.setState({stock: 'Out of Stock !'})
    // }
  };
  changeQty = async (e) => {
    
    var cqty = parseInt(e.target.value);
    console.log('changeQty', cqty)
    await this.setState({ quantity: cqty })

    if (cqty >= this.props.item.qty) {
      await this.setState({
        moqErr: false
      });
    }
    this.CartCalc();
  };

  CartCalc = async () => {
    await this.setState({
      buyer_country: getCookie('country_name'),
      buyer_country_id: getCookie('countryid'),
      buyer_country_code: getCookie('country')
      //price: this.state.eprice * this.state.quantity
    })

    const { price_in, price_us, qty } = this.props.item
    const start_price = parseFloat(this.props.item.start_price)
    const { currencyValue, symbol } = this.props
    
    let country_code = getCookie('country_code');
  
  }

   finalCost = async (Cost, qty) => {
    
   }

   productCost = async (Cost) => {
    //  console.log('Cost',Cost,179);
    await this.setState({
       price: Cost
     })
  }

  componentDidMount = async (nextProps) => {
    
    let search = window.location.search;
    realPath = search.split('beldara.com')[1];
    if (this.props.location.state){
      if (this.props.location.state.askAuctionInit === true || this.props.location.state.askAuctionInit === false){
        await this.setState({
          askAuctionInit: this.props.location.state.askAuctionInit
        })
      }else{
        await this.setState({
          askAuctionInit: true
        })
      }
    }else{
      await this.setState({
        askAuctionInit: true
      })
    }


    // console.log('componentDidMount', nextProps, this.props)
    this.loadedproduct();
    const advancedMatching = { em: "support@beldara.com" };
    const options = {
      autoConfig: true, // set pixel's autoConfig
      debug: false // enable logs
    };
    ReactPixel.init("432219770935494", advancedMatching, options);
    ReactPixel.init("2231476330510319", advancedMatching, options);
    ReactPixel.pageView();

    var toast = $('#toast_message').detach();
    $(toast).insertAfter('.breadcrumb-section');

    const tagManagerArgs = {
      gtmId: "GTM-5HBBK96", //gtmId: 'UA-57225000-1',  
      // dataLayerName: "GTM-5HBBK96",
      events: {
        send_to: "AW-724875220/AfpTCL3st7ABENTv0tkC", //send_to: 'AW-803807171/IHhPCKqLwYgBEMO_pP8C',
        value: this.state.price,
        currency: 'USD',
        aw_remarketing_only: true
      }
    };
    TagManager.initialize(tagManagerArgs);


  }

  callAuction =  async () => {
    // console.log('state: ', this.state.showAuctionPop)
  
      
      await this.setState({
        showAuctionPop: true,
        shouldReload: true
      })
      // console.log('callAuction', this.state.showAuctionPop)
   
  }

  undoCallAuction =  async () => {
      await this.setState({
        showAuctionPop: false,
        shouldReload: false
      })
  }

  componentDidUpdate = async (nextProps) => {
    // console.log(' componentDidUpdate ', this.state.askAuctionInit, nextProps, this.props)
    let search = window.location.search;
    realPath = search.split('beldara.com')[1];
    if (this.props.location.state){
      
        if (this.props.location.state.askAuctionInit === true || this.props.location.state.askAuctionInit === false){
          if (this.state.askAuctionInit !== this.props.location.state.askAuctionInit){
            this.setState({
              askAuctionInit: this.props.location.state.askAuctionInit
            })
          }
        }else{
          if (this.state.askAuctionInit !== true){
            this.setState({
              askAuctionInit: true
            })
          }
        }
    }
    

    const {buyer_country, buyer_country_id, buyer_country_code} = this.state
    try {
      currency = getCookie('currency') ? getCookie('currency') : 'INR';

      if (buyer_country != getCookie('country_name') || buyer_country_id != getCookie('countryid') || buyer_country_code != getCookie('country') || this.state.currency != currency){
        await this.setState({
          buyer_country: getCookie('country_name'),
          buyer_country_id: getCookie('countryid'),
          buyer_country_code: getCookie('country'),
          currency: currency
        })
      }

    } catch (e) {
      
    }
   
    try{
      if (nextProps.currencyValue[0].INR != this.state.inrValue)
        {
          await this.setState({
            inrValue: nextProps.currencyValue[0].INR
          })
        }
      }catch(e){
        if (this.state.inrValue != 70)
          await this.setState({
            inrValue: 70
          })
      }

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('UNSAFE_componentWillReceiveProps', nextProps, this.props)
    this.loadedproduct();
  }

  loadedproduct = () => {
    this.CartCalc()
    // store.dispatch({
    //   type: 'product_details',
    //   payload: 'item',
    //   meta: {
    //     mixpanel: {
    //       event: 'Product Details',
    //       props: {
    //         id: 'test',
    //         name: 'test',
    //         price: 'test'
    //       }
    //     }
    //   }
    // })
  }

 

  // captureEvent = (id) => {

  //   axios.post(
  //     "https://api.beldara.com/common/capture_event.php",
  //     {
  //       security_token: "", plateform_type: "", page: 'Product', event: id, value: this.props.item.id, ctrl: 'click', sellerid: ls.get('sellerid'),
  //       visitorid: getCookie('mhinpbnb')
  //     },
  //     { headers: { "Content-Type": "multipart/form-data" } }
  //   )
  //     .then(response => {
  //       // console.log(response);
  //     })
  //     .catch(error => {
  //       const result = error.response;
  //       return Promise.reject(result);
  //     });
  // }

  //Check Login
  validate = async (e) => {
   
    let id = e.target.id

    if (this.state.quantity >= this.props.item.qty && this.state.quantity > 0) {
      await this.setState({
        moqErr: false
      });
      //this.captureEvent(id)
      captureEvent( "Product", id, this.props.item.id, 'click', ls.get("sellerid"), getCookie("mhinpbnb") );
      //console.log('validate', ls.get("sellerid"))
      this.createCart(id)
    } else {
      await this.setState({
        moqErr: true
      });
      captureEvent( "Product", id, this.props.item.id, 'click', ls.get("sellerid"), getCookie("mhinpbnb") );
      //this.captureEvent(id)
    }
    
  };

  event_ask_for_price = (id) => {
    captureEvent( "Product", id, this.props.item.id, 'click', ls.get("sellerid"), getCookie("mhinpbnb") );
  }
   

  createCart = (id) => {
    axios.post(
      "https://api.indiabigshop.com/common/create_cart.php",
      {
        security_token: "", plateform_type: "",
        productid: this.props.item.id,
        qty: this.state.quantity,
        amount: this.state.price,
        currency: this.state.currency,
        eachunit: eachunit,
        inrValue: this.state.inrValue,
        visitorid: getCookie('mhinpbnb'),
        sellerid: ls.get('sellerid')
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(response => {
 
      // if (!this.state.moqErr) {
      //   id == 'expressCheckOut' ?
      //   this.goToExpressCheckout()
      //   : ls.get("sellerid") ?
      //   this.goToStartOrder()
      //    :
      //    this.goToLogin(id)

      // }

      if (!this.state.moqErr) {
        id == 'expressCheckOut' ?
        this.goToExpressCheckout()
        : this.goToStartOrder()
      }
    })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  }

  goToLogin = (id) => {

    let pid = this.props.item.id
    let product_currency = this.props.symbol
    let each_product_price = this.state.price;
    if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
      each_product_price = parseFloat(each_product_price) / parseFloat(this.state.inrValue);

    each_product_price = each_product_price.toFixed();

    ReactPixel.trackCustom( 'AddToCart', {
      content_ids: [pid],
      content_type: 'product',
      value: each_product_price,
      currency: 'USD'
    } )

    // this.props.history.push({
    //   pathname: "/register.html",
    //   state: {page:id}
    // })

  
  }

  goToExpressCheckout = async () => {
    
    let pid = this.props.item.id
    let product_currency = this.props.symbol
    var each_product_price = this.state.price;
    if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
      each_product_price = parseFloat(each_product_price) / 70;

    // each_product_price = each_product_price.toFixed(2);

    ReactPixel.trackCustom( 'AddToCart', {
      content_ids: [pid],
      content_type: 'product',
      value: each_product_price,
      currency: 'USD'
    })
   
    this.props.history.push({
      pathname: "/check_out.html",
      state: {
        totalprice: this.state.price,
        qty: this.state.quantity,
        currency: this.props.symbol,
        product_seller: this.props.item.sellerid,
        product_currency: this.props.item.currency,
        prod_id: this.props.item.id
      }
    })

  };

  goToStartOrder = async () => {
    
    let pid = this.props.item.id
    let product_currency = this.props.symbol
    let each_product_price = this.state.price;
    if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
      each_product_price = parseFloat(each_product_price) / 70;

    each_product_price = each_product_price.toFixed();

    ReactPixel.trackCustom( 'AddToCart', {
      content_ids: [pid],
      content_type: 'product',
      value: each_product_price,
      currency: 'USD'
    })
    

    this.props.history.push({
      pathname: "/cart.html"
    })

  };

  create_wishlist = (e) => {
    axios.post(
      "https://api.indiabigshop.com/common/create_wishlist.php",
      {
        security_token: "", plateform_type: "",
        productid: this.props.item.id,
        qty: this.state.quantity,
        amount: this.state.price,
        currency: this.state.currency,
        eachunit: eachunit,
        visitorid: getCookie('mhinpbnb'),
        sellerid: ls.get('sellerid')
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(response => {
  
      //toast.success("Item Added to Wishlist");
      this.showToast(response.data)
      
      // if (response.statusId == '1')
      //   toast.success("Item Added to Wishlist");
      // else
      //   toast.success("Item Added to Wishlist");
    })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  }

  showToast(data) {
    $("#toast_message").removeClass('hide').addClass('show')
    if (data.statusId == '1')
      $('.toast-body').removeClass('bg-success bg-danger').addClass('bg-success').html('<span class="text-light"><i class="fa fa-check text-light"></i> ' + data.result + '</span>');
    else
      $('.toast-body').removeClass('bg-success bg-danger').addClass('bg-danger').html('<span class="text-light"><i class="fa fa-times text-light"></i> ' + data.result+ '</span>');
    
    var clearint = setInterval(function () { 
      $("#toast_message").removeClass('show').addClass('hide');
      clearInterval(clearint)
    },3000)
  }

  // closeToast() {
  //   $("#toast_message").removeClass('show').addClass('hide')
  // }

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

  
  
  //Chat Check Open 
  chatBtn = () => {
    // e.preventDefault()
    id = 'chatBtn'
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
      sellerid:this.props.item.sellerid,
      chatWithSupplier:true,
      company:this.props.item.company,
      item:this.props.item
    } 
    store.dispatch(getChatWithSupplier(statePass))
    // this.setState({
    //   fromChatWithSupplier:true
    // })
     

     
  }
  CalcOfferPrice = (offer_price,qty,stock,min_qty,offer_date,to_date,start_range,end_range) => {
    // console.log(offer_price,qty,stock,min_qty,offer_date,to_date,start_range,end_range,602);
    if(this.offerExist(offer_date,to_date)){
        // console.log('if',602)
      //  if(qty <= parseInt(stock) && qty >= parseInt(min_qty)){
        if(parseInt(start_range) > parseInt(min_qty)  && parseInt(end_range) <= parseInt(stock)){
            return parseInt(qty) * parseFloat(offer_price);
        }else{
          // console.log('if else',602)
            return null;
        }
    }else{
      // console.log('else',602)
      return null;
    }
    
  } 

  offerExist = (from_date,to_date) => {
    if(from_date !== undefined && from_date !== null && from_date !== '' && to_date !== undefined && to_date !== null && to_date !== ''){
      let dateObj = new Date();
    let month = dateObj.getMonth()+1;
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let todayDate = year + '-' + month + '-' + day;
    // let todayDate = '2021-5-8';


    //Generate an array where the first element is the year, second is month and third is day
    var splitFrom = from_date.split('-');
    var splitTo = to_date.split('-');
    var splitToday = todayDate.split('-');

    //Create a date object from the arrays
    var newFrom = splitFrom[1]+ "," + splitFrom[2] + "," + splitFrom[0];
    var newTo = splitTo[1]+ "," + splitTo[2] + "," + splitTo[0];
    var newToday = splitToday[1]+ "," + splitToday[2] + "," + splitToday[0];

    newFrom = newFrom.toString();
    newTo = newTo.toString();
    newToday = newToday.toString();

    var fromDate = Date.parse(newFrom);
    var toDate = Date.parse(newTo);
    var todayDates = Date.parse(newToday);

    // console.log(splitFrom,splitTo,splitToday,'array',fromDate,toDate,todayDates,'days',newFrom,newTo,newToday);
    if(todayDates >= fromDate){
        if(toDate >= todayDates){
          return true;
        }else{
          return false;
        }
    }else{
      return false;
    }
    }else{
      return false;
    }
  }

  render() {
    const {
      item,
      BuynowClicked,
      translate
    } = this.props;
    const item_name = item.name;

    return (
      <div className="col-lg-4">

          <div id="toast_message" role="alert" aria-live="assertive" aria-atomic="true" className="toast toast_pull_right fade hide">
            
            <div className="toast-body">
            <i className="fas fa-check"></i> Product Added To Wishlist
            </div>
          </div>
          
        <div className="product-right product-description-box">  
          <h5> {item_name ? item_name.replace(/[^a-zA-Z ]/g, "") : ''} </h5>
          <div className="d-flex">
            
            
            {this.props.reviewCount && this.props.reviewCount > 0 ?
            <React.Fragment>
              <StarReview dataFromRating={this.props.dataFromRating} page={`${process.env.PUBLIC_URL}/rating/${item.url}.html`} avgRating={this.props.avgRating} item={item} average={true} readonly={true} />
              <span>{this.props.reviewCount} Review(s)</span>
            </React.Fragment>
            :''}
          </div>
          {item.price.length > 0 ? (
            <div className="timer border-product w-100 p-0 m-auto text-center">
              <div id="demo" className=" py-2 ">
              {
                (item.offer_price !== null && item.offer_mrp_price !== null && item.offer_from_date !== null && item.offer_to_date !== null && this.offerExist(item.offer_from_date,item.offer_to_date))
                ? 
                <div class="w-50 mx-auto">
                  <div className="time-cal">
                      <del className="d-flex justify-content-center" >MRP:<div>&nbsp;</div><PriceCalc
                            productCost={this.deadEnd}
                            finalCost={this.finalCost}
                            minqty={1}
                            symbol={item.offer_currency}
                            start_price={item.offer_mrp_price}
                            end_price=""
                            price_in={item.price_in}
                            price_us={item.price_us}
                          />
                        </del>
                        <div className="d-flex justify-content-center">
                        Offer Price:<div>&nbsp;</div>  
                        <PriceCalcOffer
                              productCost={this.props.productCost}
                              finalCost={this.finalCost}
                              symbol={item.offer_currency}
                              start_price={item.offer_price}
                              end_price=""
                              price_in={item.price_in}
                              price_us={item.price_us}
                              mrp_price={item.offer_mrp_price} 
                              price_offer={item.offer_price}
                              />   
                        </div>
                  </div>
                  <div className="time-cal">
                      Instock: {item.offer_stock} {item.offer_unit}
                  </div>
                </div>
                : 
                item.price.map((vari, index) => (
                  <React.Fragment key={index}>
                    {/* {(vari.eachunit && parseInt(vari.eachunit) !== 0)?
                      (priceCond = 1) : ''
                    } */}
                    <span>
                      <div className="timer-cal">{`${vari.rangestart}-${
                        vari.rangeend
                      } ${item.unit}`}</div>
                      {/* <div className="timer-cal">{`${vari.currency}-${vari.eachunit}`}</div> */}
                      <div className="timer-cal">
                        {/* {
                          this.CalcOfferPrice(item.offer_price,this.state.quantity,item.offer_stock,item.offer_min_qty,item.offer_from_date,item.offer_to_date,vari.rangestart,vari.rangeend) == null
                          ?
                          <PriceCalc
                            productCost={this.deadEnd}
                            finalCost={this.finalCost}
                            minqty={vari.qty}
                            symbol={vari.currency}
                            start_price={vari.eachunit}
                            end_price=""
                            price_in={item.price_in}
                            price_us={item.price_us}
                          />
                          // ''
                          :
                          <div>
                            <del>
                              <PriceCalc
                                productCost={this.deadEnd}
                                finalCost={this.finalCost}
                                minqty={vari.qty}
                                symbol={vari.currency}
                                start_price={vari.eachunit}
                                end_price=""
                                price_in={item.price_in}
                                price_us={item.price_us}
                              />
                          </del>
                            <PriceCalcOffer
                              productCost={this.props.productCost}
                              finalCost={this.finalCost}
                              symbol={vari.currency}
                              start_price={vari.eachunit}
                              end_price=""
                              price_in={item.price_in}
                              price_us={item.price_us}
                              mrp_price={item.offer_mrp_price} 
                              price_offer={item.offer_price}
                            />
                          </div>
                        } */}
                        <PriceCalc
                        productCost={this.deadEnd}
                          finalCost={this.finalCost}
                          minqty={vari.qty}
                          symbol={vari.currency}
                          start_price={vari.eachunit}
                          end_price=""
                          price_in={item.price_in}
                          price_us={item.price_us}
                        />
                      </div>
                    </span>
                  </React.Fragment>
                ))
              }
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="border-product d-none">
            <h4>
              {/* <del>{symbol}{item.price}</del> */}
              {/* <span>{item.discount}% off</span> */}
            </h4>
            {/* <h3>{symbol} {(item.price)} </h3> */}
            {/* <h6 className="product-title">product details</h6> */}

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
          {
            this.props.item.company ?
            <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={600}>
              <div
            className="py-1 text-justify"
            style={{ color: "#ff9944",cursor:'pointer' }} onClick={this.chatBtn} id="chatBtn"
          >
            <i className="fa fa-comments mr-1" /> Chat with supplier
          </div>
            
          </ReactCSSTransitionGroup>
          
            :''
          }
          
           
          
        
          {/* {(item.price.length > 0 && (item.beldara_prime == 1 || ((this.state.buyer_country.toLowerCase() != 'us' && this.state.buyer_country_id != '1' && this.state.buyer_country.toLowerCase() != 'in' && this.state.buyer_country_id != '91') || ( (this.state.buyer_country_id.toLowerCase() == '' || this.state.buyer_country_id.toLowerCase() === undefined || this.state.buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase()!='in' && getCookie('country_code').toLowerCase()!='us' )) ) )? ( */}
            {(item.price.length > 0 )? (
            <div className="border-product single-product-tables detail-section py-2">
              <table>
                <tbody>
                  <tr>
                    <td>{translate("Quantity")}:</td>
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

          <div className="d-flex align-items-end justify-content-center">
            <div className="px-1">
            {/* {( this.state.quantity && (item.beldara_prime == 1 || ((this.state.buyer_country.toLowerCase() != 'us' && this.state.buyer_country_id != '1' && this.state.buyer_country.toLowerCase() != 'in' && this.state.buyer_country_id != '91') || ( (this.state.buyer_country_id.toLowerCase() == '' || this.state.buyer_country_id.toLowerCase() === undefined || this.state.buyer_country_id.toLowerCase() === null) && getCookie('country_code').toLowerCase()!='in' && getCookie('country_code').toLowerCase()!='us' )) ) ) ? (
                <GetPriceSelected product={item} qty={this.state.quantity} />
              ) : (
                ""
                )} */}
              
              {( this.state.quantity ) ? (
                <GetPriceSelected productCost={this.productCost}  
                finalCost={this.finalCost} product={item} qty={this.state.quantity} />
              ) : (
                ""
                )}
              
              <div className="d-flex">
              {priceCond(item, this)}
                {/* <button className="btn btn-solid ml-2 my-2" onClick={this.create_wishlist} id="wishlist_product" clickevent="add_to_wishlist"> Wishlist </button> */}
                </div>
            </div>
          </div>
            <LiveReq price={item} askAuction={this.state.askAuctionInit} shouldReload={this.state.shouldReload} showAuctionPop={this.state.showAuctionPop} undoCallAuction={this.undoCallAuction}/>
          <div
            className={`alert alert-danger ${
              this.state.moqErr ? "d-block" : "d-none"
            }`}
          >
            <i className="fa fa-info-circle mr-1" /> Order must be greater than
            MOQ {item.qty} {item.unit}
          </div>
          <div className="single-product-tables border-product detail-section pb-0">
            <table>
              <tbody>
                <tr>
                  <td>{translate("Free Sample")}:</td>
                  <td>{item.free_sample == "0" ? "On Demand" : "Yes"}</td>   
                </tr>
                <tr>
                  <td>{translate("Avalibility")}:</td>
                  <td>InStock</td>
                </tr>
                {parseFloat(item.weight) > parseFloat(0)?
                  <tr>
                    <td>{translate("Weight")}:</td>
                    <td>{item.weight} kilogram(s)</td>
                  </tr>
                : ''
                }
                
              </tbody>
            </table>
          </div>
          <div className="">
            <img src={`${imgUrl}/images/payment-protection-icon.png`} style={{ width: '40px' }} />
            <small style={{color:'#ff9944'}}>Beldara Pay helps keep your transactions secure</small>
          </div>
          <div className="accordion" id="accordionExample">
            {/* Surface Or Ocean*/}
            {(this.state.buyer_country_id == item.countryid || parseInt(this.state.buyer_country_id) == 91 && (item.countryid == '' || item.countryid === undefined || item.countryid === null ))?
            
            <React.Fragment>
            <div className="card py-0 border  shadow-none" >
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
          </div>
            <div className="card py-0 border shadow-none" >
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
                    <i style={{'fontSize':'30px'}} className="fa fa-truck mr-3" aria-hidden="true"></i>
                      Delivery within 4-7 days
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
                  <div> - Delivery within 4-7 days</div>
                  <div> - Complete logistics support</div>
                </div>
              </div>
                </div>
                </React.Fragment>
              :
              <React.Fragment>
            <div className="card py-0 border  shadow-none" >
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
          </div>
            <div className="card py-0 border shadow-none" >
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
                </div>
            </React.Fragment>
            }
        
                    
                    
        
          </div>
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
          <div className="border-product">
            <h6 className="product-title">
              {translate("100% SECURE PAYMENT")}
            </h6>
            <div className="payment-card-bottom">
              <ul>
                <li>
                  <a  onClick={(e)=>{e.preventDefault();}}>
                    <img
                      src={`${
                        process.env.PUBLIC_URL
                      }/assets/images/icon/visa.png`}
                      alt="beldara.com"
                    />
                  </a>
                </li>
                <li>
                  <a  onClick={(e)=>{e.preventDefault();}}>
                    <img
                      src={`${
                        process.env.PUBLIC_URL
                      }/assets/images/icon/mastercard.png`}
                      alt="beldara.com"
                    />
                  </a>
                </li>
                <li>
                  <a  onClick={(e)=>{e.preventDefault();}}>
                    <img
                      src={`${
                        process.env.PUBLIC_URL
                      }/assets/images/icon/paypal.png`}
                      alt="beldara.com"
                    />
                  </a>
                </li>
                <li>
                  <a  onClick={(e)=>{e.preventDefault();}}>
                    <img
                      src={`${
                        process.env.PUBLIC_URL
                      }/assets/images/icon/american-express.png`}
                      alt="beldara.com"
                    />
                  </a>
                </li>
                <li>
                  <a onClick={(e)=>{e.preventDefault();}}>
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
        <Suspense loading={''}>
          <ChatBox product={item} chatToSeller={this.props.chatToSeller ? this.props.chatToSeller : false}/>
        </Suspense>
      </div> 
    );
  }
}
const mapStateToProps = (state) => ({
  symbol: state.data.symbol,
  currencyValue: state.currencyValue.currencyValue,
  user: state.user,
  chatToSeller:state.chatToSeller
})
export default withRouter(withTranslate(connect(mapStateToProps ,{getAllCurrencyValue })(Details)));
