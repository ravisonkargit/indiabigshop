import React, { Component, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { imgUrl } from '../../../constants/variable';
import { withRouter } from "react-router-dom";
// import ReactImageFallback from "react-image-fallback";
import { withTranslate } from 'react-redux-multilingual'
// import PriceCalc from './priceCalc';
import './product.css';
import LazyLoad from 'react-lazy-load';
import { forceCheck } from 'react-lazy-load';
import ReactPixel from "react-facebook-pixel";
import $ from 'jquery';
import TagManager from "react-gtm-module";
import ls from "local-storage";
import { captureEvent, getCookie } from '../../../functions';
import axios from "axios";
import { connect } from "react-redux";
import {getChatWithSupplier} from '../../../actions/index';
import store from '../../../store';
// import './imageloader.css'
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
const PriceCalcOffer = lazy(() => import('./priceCalcOffer'))
const PriceCalc = lazy(() => import('./priceCalc'))
// const ImageLoader = lazy(() => import('./ImageLoader.js'))

class ProductListItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      stock: 'InStock',
      quantity: 1,
      image: '',
      inrValue: 70,
      price: 0
    }

    this.deadEnd = this.deadEnd.bind(this)
    this.finalCost = this.finalCost.bind(this)
    this.createCart = this.createCart.bind(this)
    this.checkImageExist = this.checkImageExist.bind(this)
    this.validate = this.validate.bind(this)
    this.goToExpressCheckout = this.goToExpressCheckout.bind(this)
    this.event_ask_for_price = this.event_ask_for_price.bind(this)
    this.chatBtn = this.chatBtn.bind(this);
  }

  async goToExpressCheckout(pid, qty, product_currency, sellerid){
    var each_product_price = this.state.price;
    if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
      each_product_price = parseFloat(each_product_price) / 70;

    each_product_price = each_product_price.toFixed();

    ReactPixel.trackCustom('AddToCart', {
      content_ids: [pid],
      content_type: 'product',
      value: this.state.price,
      currency: 'USD'
    })

    this.props.history.push({
      pathname: "/check_out.html",
      state: {
        totalprice: this.state.price,
        currency: this.props.symbol,
        product_seller: sellerid,
        product_currency: product_currency,
        prod_id: pid,
        qty: qty
      }
    })

  };

  onClickHandle(img) {
    this.setState({ image: img });
  }
  checkImageExist(event){
    try {
      this.props.checkImage(event.target.id);
    } catch (error) {
      console.log('error: ', error)
    }
  }

  componentDidMount(nextProps) {
    // FB
    const advancedMatching = { em: "support@beldara.com" };
    const options = {
      autoConfig: true, // set pixel's autoConfig
      debug: false // enable logs
    };
    ReactPixel.init("432219770935494", advancedMatching, options);
    ReactPixel.init("2231476330510319", advancedMatching, options);

    var toast = $('#toast_message').detach();
    $(toast).insertAfter('.breadcrumb-section');
  }

  validate(id, productid, qty, amount, currency, eachunit, product_currency, product_sellerid){
    captureEvent("Product", id, productid, 'click', ls.get("sellerid"), getCookie("mhinpbnb"));
    $('#btn_'+productid).css('opacity','0.6');
    // console.log(id, productid, qty, amount, currency, eachunit, product_currency, product_sellerid,'validate');
    this.createCart(productid, qty, amount, currency, eachunit , product_currency, product_sellerid)

  };

  event_ask_for_price(id, productid){
    captureEvent("Product", id, productid, 'click', ls.get("sellerid"), getCookie("mhinpbnb"));
  }

  createCart(productid, qty, amount, currency, eachunit, product_currency, product_sellerid){
    axios.post(
      "https://api.beldara.com/common/create_cart_test.php",
      {
        security_token: "",
        plateform_type: "",
        productid: productid,
        qty: qty,
        amount: amount,
        // amount: this.state.price,
        currency: currency,
        visitorid: getCookie('mhinpbnb'),
        sellerid: ls.get('sellerid'),
        country_to:getCookie("countryid"),
        pincode:getCookie('pincode')
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(response => {
      // this.goToExpressCheckout(productid, qty, product_currency, product_sellerid)
      window.location.href="/cart.html";
    })
      .catch(error => {
        const result = error.response;
        return Promise.reject(result);
      });
  }

  componentDidUpdate = async (nextProps) => {
    try {
      if (nextProps.currencyValue[0].INR != this.state.inrValue) {
        await this.setState({
          inrValue: nextProps.currencyValue[0].INR
        })
      }
    } catch (e) {
      await this.setState({
        inrValue: 70
      })
    }
  }

  async finalCost(Cost, qty){
    var tprice = 0;
    tprice = Cost * qty;
    tprice = tprice.toFixed(2);
    await this.setState({
      price: tprice
    })
  }

  deadEnd(value){
    
  }

  // goToLogin = (pid, qty, amount, product_currency, each_product_price) => {


  //   if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
  //     each_product_price = parseFloat(each_product_price) / this.state.inrValue;

  //   each_product_price = each_product_price.toFixed();

  //   ReactPixel.trackCustom('AddToCart', {
  //     content_ids: [pid],
  //     content_type: 'product',
  //     value: each_product_price,
  //     currency: 'USD'
  //   })

  //   this.props.history.push({
  //     pathname: "/register.html"
  //   })


  // }

  // goToStartOrder = async (pid, qty, amount, product_currency, each_product_price) => {

  //   if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
  //     each_product_price = parseFloat(each_product_price) / this.state.inrValue;

  //   each_product_price = parseFloat(each_product_price).toFixed();

  //   ReactPixel.trackCustom('AddToCart', {
  //     content_ids: [pid],
  //     content_type: 'product',
  //     value: each_product_price,
  //     currency: 'USD'
  //   })

  //   this.props.history.push({
  //     pathname: "/cart.html"
  //   })

  // };

  // create_wishlist = (productid, qty, amount, currency, eachunit) => {
  //   axios.post(
  //     "https://api.beldara.com/common/create_wishlist.php",
  //     {
  //       security_token: "", plateform_type: "",
  //       productid: productid,
  //       qty: qty,
  //       amount: this.state.price,
  //       currency: currency,
  //       visitorid: getCookie('mhinpbnb'),
  //       sellerid: ls.get('sellerid')
  //     },
  //     { headers: { "Content-Type": "multipart/form-data" } }
  //   ).then(response => {

  //     this.showToast(response.data)

  //   })
  //     .catch(error => {
  //       const result = error.response;
  //       return Promise.reject(result);
  //     });
  // }


  CalcOfferPrice = (offer_price,qty,stock,min_qty,offer_date,to_date) => {
    // console.log(offer_price,qty,stock,min_qty,offer_date,to_date,'call',230);
    if(this.offerExist(offer_date,to_date)){
      // console.log('inside if',230);
       if(qty <= parseInt(stock) && qty >= parseInt(min_qty)){
            // return parseInt(qty) * parseFloat(offer_price);
            return parseFloat(offer_price);
        }else{
            return null;
        }
    }else{
      // console.log('inside else 230');
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

  chatBtn(product_details){
    let statePass = {
      sellerid:product_details.sellerid,
      chatWithSupplier:true,
      company:product_details.company,
      item:product_details,
    } 
    store.dispatch(getChatWithSupplier(statePass))
  }

  render() {
    const { product, symbol, translate } = this.props;
    const offer_tag = {
      width:'6rem',
      zIndex:'1',
      position:'absolute',
      webkitTransform: 'rotate(-45deg)',
      left:'-11px',
    };
    // console.log('render',this.props.product);
    return (<React.Fragment>
      {/* <div id="toast_message" role="alert" aria-live="assertive" aria-atomic="true" className="toast toast_pull_right fade hide">
        <div className="toast-body">
          <i className="fas fa-check"></i> Product Added To Wishlist
                      </div>
      </div> */}


      <div className="product-box bg-light ">
        {
          (this.offerExist(product.offer_from_date,product.offer_to_date) && product.offer_percent !== null && product.offer_percent !== '0')
          ? <div className="badge badge-danger text-wrap my-1 p-3" style={offer_tag}>
                  {product.offer_percent} % Offer
            </div>
          : ''
        }
        <div className="d-flex img-wrapper justify-content-center">
          <div className="front d-flex imgWrapper">
            {/* <Link className="d-flex align-items-center justify-content-center" to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url)}.html`}> */}
            <a className="d-flex align-items-center justify-content-center" href={`${process.env.PUBLIC_URL}/product/${product.url}.html`}>

              {product.brand_promo == 1 &&
                <span className="bpp_badge badge badge-warning" > BPP </span>
              }
              {/* <ImageLoader
                src={product.variants ?
                  this.state.image ? this.state.image : product.variants[0].images
                  : `${imgUrl}/product_images_thumb/`+product.img} //this is the only compulsory prop
                alt={`${product.name} beldara.com`}
                id={product.id}
              /> */}


              {/* <div className="image loading"> */}
                <img
                  data-sizes="auto"
                  src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                  data-src={product.variants ?
                    this.state.image ? this.state.image : product.variants[0].images
                    : `${imgUrl}/product_images_thumb/` + product.img}
                  //fallbackImage={`${imgUrl+'/images/default.jpg'}`}
                  //initialImage={`${imgUrl+'/images/ajax-loader.gif'}`}
                  alt={`${product.name} beldara.com`}
                  // className={}
                  className="img-fluid prodImg lazyload "
                  id={product.id}
                  onError={this.checkImageExist}
                // onError={this.props.checkImage(product.id)}
                />
              {/* </div> */}
            </a>
          </div>
        </div>
        <div className="product_info">
          <div>

            <Link to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url)}.html`}>
              <div className="text-truncate font-weight-bolder text-dark">{product.name}</div>
            </Link>
            {
              (product.company) &&
                <div className="text-truncate font-weight-lighter"><small>{product.company}</small></div>
            }
            {
              // (this.CalcOfferPrice(product.offer_price,product.qty,product.offer_stock,product.offer_min_qty,product.offer_from_date,product.offer_to_date) !== null)
              (this.offerExist(product.offer_from_date,product.offer_to_date))
              ?
              <div> 
              <span className="d-flex">
                <del className="mr-1">
                {/* <PriceCalc currencyValue={this.props.currencyValue} productCost={this.deadEnd} finalCost={this.finalCost} minqty={product.qty} symbol={product.currency} start_price={product.start_price} end_price={product.end_price} price_us={product.price_us} price_in={product.price_in} country_code={getCookie('country_code')} /> */}
                <PriceCalcOffer
                        productCost={this.deadEnd}
                        finalCost={this.finalCost}
                        symbol={product.currency}
                        start_price={product.start_price}
                        end_price=""
                        price_in={product.price_in}
                        price_us={product.price_us}
                        mrp_price={product.offer_mrp_price} 
                        price_offer={this.CalcOfferPrice(product.mrp_price,product.offer_min_qty,product.offer_stock,product.offer_min_qty,product.offer_from_date,product.offer_to_date)}
                        country_code={getCookie('country_code')}
                      />
              </del>
                    <PriceCalcOffer
                        productCost={this.deadEnd}
                        finalCost={this.finalCost}
                        symbol={product.currency}
                        start_price={product.offer_price}
                        end_price=""
                        price_in={product.price_in}
                        price_us={product.price_us}
                        mrp_price={product.offer_mrp_price} 
                        price_offer={this.CalcOfferPrice(product.offer_price,product.offer_min_qty,product.offer_stock,product.offer_min_qty,product.offer_from_date,product.offer_to_date)}
                        country_code={getCookie('country_code')}
                      />
              </span>
              {
              (product.qty) ?
                <div className="small">{`${translate('MOQ')} : ${product.offer_min_qty} - ${product.unit}`}</div>
                : ''
               }
               {/* {
              (product.offer_stock > 0 || product.offer_stock === null) ?
                <div className="small">{`${translate('Stock')} : ${product.offer_stock} - ${product.unit}`}</div>
                : <div className="small text-danger">OUT OF STOCK</div>
               } */}
              </div>
              :(!this.offerExist(product.offer_from_date,product.offer_to_date))
              ?
              <div>
                {(product.start_price && this.CalcOfferPrice(product.offer_price,product.qty,product.offer_stock,product.offer_min_qty,product.offer_from_date,product.offer_to_date) === null) ?
                <PriceCalc currencyValue={this.props.currencyValue} productCost={this.deadEnd} finalCost={this.finalCost} minqty={product.qty} symbol={product.currency} start_price={product.start_price} end_price={product.end_price} price_us={product.price_us} price_in={product.price_in} country_code={getCookie('country_code')} />
                 : <b>Ask For Price</b>}
                 {
              (product.qty) ?
                <div className="small">{`${translate('MOQ')} : ${product.qty} - ${product.unit}`}</div>
                : ''
            }
              </div>
               : ''  
            }
            {/* {
              (product.qty) ?
                <div className="small">{`${translate('MOQ')} : ${product.qty} - ${product.unit}`}</div>
                : <div className="small">{`${translate('MOQ')} : 1 unit`}</div>
            } */}
          </div>
        </div>
        <div className="row mb-2 mx-0">
          {product.start_price && parseFloat(product.start_price) > parseFloat(0) && !this.offerExist(product.offer_from_date,product.offer_to_date) ?
            <React.Fragment>
              <div id={`btn_${product.id}`} className=" col-6 col-md-6 col-sm-6 text-left py-2 px-1 buy1">
                <div className="mouse_pointer btn btn_Pro  btn-orange" id={product.id} onClick={this.validate.bind(this,'buyBtn', product.id, product.qty, (parseFloat(product.start_price) * parseInt(product.qty)), this.props.symbol, product.start_price, product.currency, product.sellerid)}>
                  Buy Now
                </div>
                {/* <img className="mouse_pointer" src="https://img.beldara.com/images/buy_now_btn.png" id={product.id} onClick={this.validate.bind(this,'buyBtn', product.id, product.qty, (parseFloat(product.start_price) * parseInt(product.qty)), this.props.symbol, product.start_price, product.currency, product.sellerid)}/> */}
              </div>
              {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
              <div className="col-6  text-center col-md-6 col-sm-6 py-2 px-1">
                <div id={`div_${product.id}`}>
                  <Link onClick={this.event_ask_for_price.bind(this,'go_to_auction', product.id)} id="go_to_auction" className="btn btn_Pro btn-orange" clickevent="go_to_auction" to={{ pathname: `/product/${product.url}.html`, state: { product, askAuctionInit: false } }} > e-Auction </Link>
                </div>
              </div>
              {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
            </React.Fragment>
            : (this.offerExist(product.offer_from_date,product.offer_to_date) && product.offer_stock > 0)
            ? 
            <React.Fragment>
              <div id={`btn_${product.id}`} className=" col-6 col-md-6 col-sm-6 text-left py-2 px-1 buy2">
                <div className="mouse_pointer btn btn_Pro  btn-orange" id={product.id} onClick={this.validate.bind(this,'buyBtn', product.id, product.offer_min_qty,(parseInt(this.state.price) * parseInt(product.offer_min_qty)), this.props.symbol, product.start_price, product.currency, product.sellerid)}>
                  Buy Now
                </div>
                {/* <img className="mouse_pointer" src="https://img.beldara.com/images/buy_now_btn.png" id={product.id} onClick={this.validate.bind(this,'buyBtn', product.id, product.offer_min_qty,(parseInt(this.state.price) * parseInt(product.offer_min_qty)), this.props.symbol, product.start_price, product.currency, product.sellerid)}/> */}
              </div>
              {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
              <div className="col-6  text-center col-md-6 col-sm-6 py-2 px-1">
                {/* <div id={`div_${product.id}`}> */}
                  {/* <Link onClick={this.event_ask_for_price.bind(this,'go_to_auction', product.id)} id="go_to_auction" className="btn btn_Pro btn-orange" clickevent="go_to_auction" to={{ pathname: `/product/${product.url}.html`, state: { product, askAuctionInit: false } }} > e-Auction </Link> */}
                {/* </div> */}
                {
                      product.sellerid != ls.get('log_id')
                      ? 
                      <div
                        className="mouse_pointer btn btn_Pro  btn-orange"
                        onClick={this.chatBtn.bind(this,product)}>
                        Chat Now
                      </div>
                      // <img className="mouse_pointer" src="https://img.beldara.com/images/chat_now_btn.png" onClick={this.chatBtn.bind(this,product)}/>
                      : ''
                }
              </div>
              {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
            </React.Fragment>
            :
            <React.Fragment>
              <div id={`btn_${product.id}`} className="col-7 text-left col-md-7 col-sm-7 py-2 px-1">
                <div className="text-left">
                  <Link onClick={this.event_ask_for_price.bind(this,'ask_for_price', product.id)} id="ask_for_price" className="btn btn_Pro btn-orange" clickevent="Ask_for_price" to={{ pathname: "/post-requirement.html", state: product }} > Contact Supplier </Link>
                </div>
              </div>
              {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
              <div className="col-5 text-center col-md-5 col-sm-5 py-2 px-1">
                <div id={`div_${product.id}`}>
                  <Link onClick={this.event_ask_for_price.bind(this,'go_to_auction', product.id)} id="go_to_auction" className="btn btn_Pro btn-orange" clickevent="go_to_auction" to={{ pathname: `/product/${product.url}.html`, state: { product, askAuctionInit: false } }} > e-Auction </Link>
                </div>
              </div>
              {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
            </React.Fragment>
          }
        </div>
      </div>
    </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  symbol: state.data.symbol,
  currencyValue: state.currencyValue.currencyValue,
  user: state.user,
  hole_data: state
})
export default withRouter(withTranslate(connect(mapStateToProps)(ProductListItem)));

// export default withRouter(withTranslate(ProductListItem));