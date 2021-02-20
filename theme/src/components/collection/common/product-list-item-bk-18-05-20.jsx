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
// import './imageloader.css'
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
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
    this.createCart(productid, qty, amount, currency, eachunit , product_currency, product_sellerid)

  };

  event_ask_for_price(id, productid){
    captureEvent("Product", id, productid, 'click', ls.get("sellerid"), getCookie("mhinpbnb"));
  }

  createCart(productid, qty, amount, currency, eachunit, product_currency, product_sellerid){
    axios.post(
      "https://api.beldara.com/common/add_to_create_cart.php",
      {
        security_token: "",
        plateform_type: "",
        productid: productid,
        qty: qty,
        amount: this.state.price,
        currency: currency,
        visitorid: getCookie('mhinpbnb'),
        sellerid: ls.get('sellerid'),
        country_to:getCookie("countryid")
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(response => {
      this.goToExpressCheckout(productid, qty, product_currency, product_sellerid)
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

  deadEnd(){
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


  render() {
    const { product, symbol, translate } = this.props;
    // console.log('render',229);
    return (<React.Fragment>
      {/* <div id="toast_message" role="alert" aria-live="assertive" aria-atomic="true" className="toast toast_pull_right fade hide">
        <div className="toast-body">
          <i className="fas fa-check"></i> Product Added To Wishlist
                      </div>
      </div> */}


      <div className="product-box bg-light ">
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
              (product.start_price) ?
                <PriceCalc currencyValue={this.props.currencyValue} productCost={this.deadEnd} finalCost={this.finalCost} minqty={product.qty} symbol={product.currency} start_price={product.start_price} end_price={product.end_price} price_us={product.price_us} price_in={product.price_in} country_code={getCookie('country_code')} /> : <b>Ask For Price</b>
            }
            {
              (product.qty) ?
                <div className="small">{`${translate('MOQ')} : ${product.qty} - ${product.unit}`}</div>
                : <div className="small">{`${translate('MOQ')} : 1 unit`}</div>
            }


          </div>
        </div>
        <div className="row mb-2 mx-0">
          {product.start_price && parseFloat(product.start_price) > parseFloat(0) ?
            <React.Fragment>
              <div id={`btn_${product.id}`} className=" col-7 col-md-7 col-sm-7 text-left py-2 px-1">
                <div className="mouse_pointer btn btn_Pro  btn-orange" id={product.id} onClick={this.validate.bind(this,'buyBtn', product.id, product.qty, (parseFloat(product.start_price) * parseInt(product.qty)), this.props.symbol, product.start_price, product.currency, product.sellerid)}>
                  Buy Now
                </div>
              </div>
              {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
              <div className="col-5  text-center col-md-5 col-sm-5 py-2 px-1">
                <div id={`div_${product.id}`}>
                  <Link onClick={this.event_ask_for_price.bind(this,'go_to_auction', product.id)} id="go_to_auction" className="btn btn_Pro btn-orange" clickevent="go_to_auction" to={{ pathname: `/product/${product.url}.html`, state: { product, askAuctionInit: false } }} > e-Auction </Link>
                </div>
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