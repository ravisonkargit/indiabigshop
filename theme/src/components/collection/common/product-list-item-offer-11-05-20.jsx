import React, { Component, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { imgUrl } from "../../../constants/variable";
import { withRouter } from "react-router-dom";
// import ReactImageFallback from "react-image-fallback";
import { withTranslate } from "react-redux-multilingual";
// import PriceCalc from './priceCalc';
import "./product.css";
import LazyLoad from "react-lazy-load";
import { forceCheck } from "react-lazy-load";
import ReactPixel from "react-facebook-pixel";
import $ from "jquery";
import TagManager from "react-gtm-module";
import ls from "local-storage";
import { captureEvent, getCookie } from "../../../functions";
import axios from "axios";
import { connect } from "react-redux";
// import './imageloader.css'
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
const PriceCalc = lazy(() => import("./priceCalc"));
const PriceCalcOffer = lazy(() => import("./priceCalcOffer"));

// const ImageLoader = lazy(() => import('./ImageLoader.js'))

class ProductListItemOffer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      stock: "InStock",
      quantity: 1,
      image: "",
      inrValue: 70,
      price: 0,
    };

    this.deadEnd = this.deadEnd.bind(this);
    this.finalCost = this.finalCost.bind(this);
    this.createCart = this.createCart.bind(this);
    this.checkImageExist = this.checkImageExist.bind(this);
    this.validate = this.validate.bind(this);
    this.goToExpressCheckout = this.goToExpressCheckout.bind(this);
    this.event_ask_for_price = this.event_ask_for_price.bind(this);
  }

  async goToExpressCheckout(pid, qty, product_currency, sellerid) {
    var each_product_price = this.state.price;
    if (
      product_currency == "INR" ||
      product_currency == "" ||
      product_currency === undefined
    )
      each_product_price = parseFloat(each_product_price) / 70;

    each_product_price = each_product_price.toFixed();

    ReactPixel.trackCustom("AddToCart", {
      content_ids: [pid],
      content_type: "product",
      value: this.state.price,
      currency: "USD",
    });

    this.props.history.push({
      pathname: "/check_out.html",
      state: {
        totalprice: this.state.price,
        currency: this.props.symbol,
        product_seller: sellerid,
        product_currency: product_currency,
        prod_id: pid,
        qty: qty,
      },
    });
  }

  onClickHandle(img) {
    this.setState({ image: img });
  }
  checkImageExist(event) {
    try {
      this.props.checkImage(event.target.id);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  componentDidMount(nextProps) {
    // FB
    const advancedMatching = { em: "support@beldara.com" };
    const options = {
      autoConfig: true, // set pixel's autoConfig
      debug: false, // enable logs
    };
    ReactPixel.init("432219770935494", advancedMatching, options);
    ReactPixel.init("2231476330510319", advancedMatching, options);

    var toast = $("#toast_message").detach();
    $(toast).insertAfter(".breadcrumb-section");
  }

  validate(
    id,
    productid,
    qty,
    amount,
    currency,
    eachunit,
    product_currency,
    product_sellerid
  ) {
    captureEvent(
      "Product",
      id,
      productid,
      "click",
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
    this.createCart(
      productid,
      qty,
      amount,
      currency,
      eachunit,
      product_currency,
      product_sellerid
    );
  }

  event_ask_for_price(id, productid) {
    captureEvent(
      "Product",
      id,
      productid,
      "click",
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
  }

  createCart(
    productid,
    qty,
    amount,
    currency,
    eachunit,
    product_currency,
    product_sellerid
  ) {
    axios
      .post(
        "https://api.beldara.com/common/add_to_create_cart.php",
        {
          security_token: "",
          plateform_type: "",
          productid: productid,
          qty: qty,
          amount: this.state.price,
          currency: currency,
          visitorid: getCookie("mhinpbnb"),
          sellerid: ls.get("sellerid"),
          country_to: getCookie("countryid"),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        this.goToExpressCheckout(
          productid,
          qty,
          product_currency,
          product_sellerid
        );
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  }

  componentDidUpdate = async (nextProps) => {
    try {
      if (nextProps.currencyValue[0].INR != this.state.inrValue) {
        await this.setState({
          inrValue: nextProps.currencyValue[0].INR,
        });
      }
    } catch (e) {
      await this.setState({
        inrValue: 70,
      });
    }
  };

  async finalCost(Cost, qty) {
    var tprice = 0;
    tprice = Cost * qty;
    tprice = tprice.toFixed(2);
    await this.setState({
      price: tprice,
    });
  }

  deadEnd() {}

  render() {
    const { product, symbol, translate } = this.props;
    console.log(product,'product',this.state.price);
    return (
      <React.Fragment>
        {/* <div id="toast_message" role="alert" aria-live="assertive" aria-atomic="true" className="toast toast_pull_right fade hide">
        <div className="toast-body">
          <i className="fas fa-check"></i> Product Added To Wishlist
                      </div>
      </div> */}

        <div className="product-box bg-light ">
          <div className="d-flex img-wrapper justify-content-center">
            <div className="front d-flex imgWrapper">
              {/* <Link className="d-flex align-items-center justify-content-center" to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url)}.html`}> */}
              <a
                className="d-flex align-items-center justify-content-center"
                href={`${process.env.PUBLIC_URL}/product/${product.url}.html`}
              >
                {product.brand_promo == 1 && (
                  <span className="bpp_badge badge badge-warning"> BPP </span>
                )}
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
                  data-src={
                    product.variants
                      ? this.state.image
                        ? this.state.image
                        : product.variants[0].images
                      : `${imgUrl}/product_images_thumb/` + product.img
                  }
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
              <Link
                to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(
                  product.url
                )}.html`}
              >
                <div className="text-truncate font-weight-bolder text-dark">
                  {product.name}
                </div>
              </Link>
              {product.company && (
                <div className="text-truncate font-weight-lighter">
                  <small>{product.company}</small>
                </div>
              )}
              {product.start_price ? (
                <div className="">
                  <div className="d-flex">
                    {/* <del>{product.currancy+` `+product.mrp_price}</del> */}
                    <del>
                      <PriceCalc
                        currencyValue={this.props.currencyValue}
                        productCost={this.deadEnd}
                        finalCost={this.finalCost}
                        minqty={product.min_qty}
                        symbol={product.currancy}
                        start_price={product.start_price}
                        // end_price={product.end_price}
                        price_us={product.price_us}
                        price_in={product.price_in}
                      />
                    </del>
                  </div>
                  <b>
                    <PriceCalcOffer
                      currencyValue={this.props.currencyValue}
                      productCost={this.deadEnd}
                      finalCost={this.finalCost}
                      minqty={product.min_qty}
                      symbol={product.currancy}
                      start_price={product.start_price}
                      // end_price={product.end_price}
                      price_us={product.price_us}
                      price_in={product.price_in}
                      mrp_price={product.mrp_price}
                      price_offer={product.price_offer}
                    />
                    {/* {product.currancy+` `+product.price_offer} */}
                  </b>
                </div>
              ) : (
                <b>Ask For Price</b>
              )}
              {product.min_qty ? (
                <div className="small">{`${translate("MOQ")} : ${
                  product.min_qty
                } - ${product.offer_unit}`}</div>
              ) : (
                <div className="small">{`${translate("MOQ")} : 1 unit`}</div>
              )}
              {product.offer_stock ? (
                <div className="small">{`${translate("Stock")} : ${
                  product.offer_stock
                } - ${product.offer_unit}`}</div>
              ) : (
                <div className="small">{`${translate("Stock")} : 1 unit`}</div>
              )}
            </div>
          </div>
          <div className="row mb-2 mx-0 my-4">
            {product.start_price &&
            parseFloat(product.start_price) > parseFloat(0) ? (
              <React.Fragment>
                <div
                  id={`btn_${product.id}`}
                  className=" col-7 col-md-7 col-sm-7 text-left py-2 px-1"
                >
                  <div
                    className="mouse_pointer btn btn_Pro  btn-orange"
                    id={product.id}
                    onClick={this.validate.bind(
                      this,
                      "buyBtn",
                      product.id,
                      product.min_qty,
                      parseFloat(product.price_offer) * parseInt(product.qty),
                      this.props.symbol,
                      product.price_offer,
                      product.currency,
                      product.sellerid
                    )}
                  >
                    Buy Now
                  </div>
                </div>
                {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
                <div className="col-5  text-center col-md-5 col-sm-5 py-2 px-1">
                  <div id={`div_${product.id}`}>
                    <Link
                      onClick={this.event_ask_for_price.bind(
                        this,
                        "go_to_auction",
                        product.id
                      )}
                      id="go_to_auction"
                      className="btn btn_Pro btn-orange"
                      clickevent="go_to_auction"
                      to={{
                        pathname: `/product/${product.url}.html`,
                        state: { product, askAuctionInit: false },
                      }}
                    >
                      {" "}
                      e-Auction{" "}
                    </Link>
                  </div>
                </div>
                {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div
                  id={`btn_${product.id}`}
                  className="col-7 text-left col-md-7 col-sm-7 py-2 px-1"
                >
                  <div className="text-left">
                    <Link
                      onClick={this.event_ask_for_price.bind(
                        this,
                        "ask_for_price",
                        product.id
                      )}
                      id="ask_for_price"
                      className="btn btn_Pro btn-orange"
                      clickevent="Ask_for_price"
                      to={{
                        pathname: "/post-requirement.html",
                        state: product,
                      }}
                    >
                      {" "}
                      Contact Supplier{" "}
                    </Link>
                  </div>
                </div>
                {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
                <div className="col-5 text-center col-md-5 col-sm-5 py-2 px-1">
                  <div id={`div_${product.id}`}>
                    <Link
                      onClick={this.event_ask_for_price.bind(
                        this,
                        "go_to_auction",
                        product.id
                      )}
                      id="go_to_auction"
                      className="btn btn_Pro btn-orange"
                      clickevent="go_to_auction"
                      to={{
                        pathname: `/product/${product.url}.html`,
                        state: { product, askAuctionInit: false },
                      }}
                    >
                      {" "}
                      e-Auction{" "}
                    </Link>
                  </div>
                </div>
                {/* <div className="col-1 col-md-1 d-none d-md-block d-sm-none"></div> */}
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  symbol: state.data.symbol,
  currencyValue: state.currencyValue.currencyValue,
  user: state.user,
});
export default withRouter(
  withTranslate(connect(mapStateToProps)(ProductListItemOffer))
);

// export default withRouter(withTranslate(ProductListItem));
