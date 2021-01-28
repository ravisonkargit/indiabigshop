import React, { Component, Suspense, lazy } from "react";
import Slider from "react-slick";
import "../common/index.scss";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import "./view-product-images.css";

// import custom Components
//import RelatedProduct from "../common/related-product";
import Details from "./common/product/details-new";
import Price from "./common/product/price";
import DetailsTopTabs from "./common/details-top-tabs";
import {
  getSingleProduct,
  addToCart,
  addToCartUnsafe,
  addToWishlist,
  getRelatedProducts,
} from "../../actions";
import SmallImages from "./common/product/small-image";
import store from "../../store";
import { imgUrl } from "../../constants/variable";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
import CustomerReview from "../collection/common/customerReview";
import axios from "axios";
import { ApiUrl } from "../../constants/ActionTypes";
import ls from "local-storage";
import LoadingComponent from "./common/loading-bar";
import OfferTimer from "./common/product/offer-timer";
import { getRelatedItems } from "../../services";
import { offerExist } from "../../functions/index";
import "./common/product/product.css";
import { getCookie, captureEvent } from "../../functions";
//import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
//import { InnerImageZoom }  from "react-inner-image-zoom";

// import RatingChart from '../collection/common/ratingChart';

// import { getSingleItem, getRelatedItems } from '../../services';

//
function getFileName(url) {
  if (is_variant && prod_variant_url !== null) {
    return prod_variant_url;
  } else {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0];
    filename = filename.replace(/(#|\?).*?$/, "");
    return filename;
  }
}
var isFetching = 0;
var get_offer_condition = false;
var is_variant = false;
var prod_variant_url = null;
class ColumnLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      vertical: true,
      review: [1],
      reviewCount: 0,
      reviewRead: 0,
      loadSmallImage: 0,
      avgRating: 0,
      RelatedProduct: null,
      isFetched: false,
      isFetching: false,
      buyer_country_id: "",
      is_variant: false,
      prod_url: "",
      open: false,
      ids: "",
    };
    this.onOpenModal = this.onOpenModal.bind(this);
  }

  UNSAFE_componentWillMount() {
    // console.log('product: UNSAFE_componentWillMount')
    if (window.innerWidth > 576) {
      this.setState({ vertical: true });
    } else {
      this.setState({ vertical: false });
    }
  }

  getReview = async (getReview) => {
    try {
      if (getReview.item.id) {
        await axios
          .post(
            `${ApiUrl}/common/show_review.php`,
            {
              sellerid: ls.get("sellerid"),
              productid: getReview.item.id,
              plateform_type: "",
              security_token: "",
            },
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then(async (response) => {
            if (response.data.statusId == 1 && response.data.result.review) {
              await this.setState({
                review: response.data.result.review,
                reviewCount: response.data.result.review.length,
                reviewRead: 1,
              });
              let avgRatingTemp = 0.0;
              response.data.result.review.forEach((item) => {
                avgRatingTemp += parseFloat(item.star_no);
              });
              avgRatingTemp = this.round_to_precision(
                avgRatingTemp / response.data.result.review.length,
                0.5
              );
              await this.setState({
                avgRating: avgRatingTemp,
              });
            } else {
              await this.setState({
                review: [1],
                reviewCount: 0,
                avgRating: 0,
              });
            }
          })
          .catch((error) => {
            const result = error.response;
          });
      }
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  round_to_precision = (x, precision) => {
    var y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
  };

  getProductUrl(purl) {
    let purl_data = purl.split("@")[0];
    return purl_data;
  }

  getProductLevel(plevel) {
    let plevel_data = plevel.split("@")[1];
    return plevel_data;
  }

  scrollElement = () => {
    document
      .getElementsByClassName("section-b-space")[0]
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  };

  dataFromRating = () => {
    this.scrollElement();
  };

  setSlider = async () => {
    if (!this.state.nav1) {
      // console.log('called',this.slider1.innerSlider,this.slider2);
      await this.setState({
        nav1: this.slider1,
        nav2: this.slider2,
      });
    }
  };

  UNSAFE_componentWillReceiveProps = async (nextProps) => {
    // console.log('UNSAFE_componentWillReceiveProps',183,'outside',this.props,nextProps);
    // console.log('product: UNSAFE_componentWillReceiveProps')
    if (nextProps.item) {
      isFetching = 1;
    } else {
      isFetching = 0;
    }

    if (this.props.item && nextProps.item) {
      if (this.props.item.id != nextProps.item.id) {
        // console.log('UNSAFE_componentWillReceiveProps',183);

        this.setState({
          RelatedProduct: null,
        });
        import("../common/related-product").then((module) => {
          this.setState({
            RelatedProduct: module.default,
          });
        });

        if (nextProps.item) {
          await this.getReview(nextProps);
          this.setState({ loadSmallImage: 1 });
          this.setSlider();
        } else if (this.props.item) {
          await this.getReview(this.props);
          this.setState({ loadSmallImage: 1 });
          this.setSlider();
        }
      }
    } else {
      if (nextProps.item) {
        await this.getReview(nextProps);
        this.setState({ loadSmallImage: 1 });
        this.setSlider();
      } else if (this.props.item) {
        await this.getReview(this.props);
        this.setState({ loadSmallImage: 1 });
        this.setSlider();
      }
    }
  };

  componentDidMount = async (nextProps) => {
    // console.log('componentDidMoun called');
    // console.log(this.props.item,nextProps)
    // this.props.mixpanel.track('product_detail');
    import("../common/related-product").then((module) => {
      this.setState({
        RelatedProduct: module.default,
        buyer_country_id: getCookie("countryid"),
      });
    });

    if (this.props.item && nextProps) {
      // console.log(0,'slider');
      await this.getReview(nextProps);
      this.setState({ loadSmallImage: 1 });
      this.setSlider();
    } else {
      // console.log(1,'slider');
      await this.getReview(this.props);
      this.setState({ loadSmallImage: 1 });
      this.setSlider();
    }
    if (this.slider1 !== undefined && this.slider1 != "")
      this.setState({
        nav1: this.slider1,
        nav2: this.slider2,
      });
    const query = getFileName(window.location.pathname)
      .split("/")
      .pop()
      .replace(".html", "");
    const val = query.split("-").splice(-1)[0];
    // console.log(val,241);
    await store.dispatch(getSingleProduct(val));
    await store.dispatch(getRelatedProducts(val));
  };

  dispatch_variant_products = async (prod_id, prod_url) => {
    // console.log('function called',prod_id,prod_url);
    is_variant = true;
    prod_variant_url = prod_url;
    await this.setState({ is_variant: true, prod_url: prod_url });
    await store.dispatch(getSingleProduct(prod_id));
  };

  UNSAFE_componentWillUpdate = async (nextProps) => {
    // console.log('UNSAFE_componentWillUpdate',this.props.item,isFetching);
    if (this.state.buyer_country_id != getCookie("countryid")) {
      this.setState({ buyer_country_id: getCookie("countryid") });
      // console.log('changed');
    }
    const query = getFileName(window.location.pathname)
      .split("/")
      .pop()
      .replace(".html", "");
    const val = query.split("-").splice(-1)[0];
    if (
      (this.props.item === null || this.props.item === undefined) &&
      isFetching === 0 &&
      !this.state.is_variant
    ) {
      isFetching = 1;
      await store.dispatch(getSingleProduct(val));
    }
  };

  onOpenModal = (e) => {
    this.setState({
      open: true,
    });
  };

  getImage = (e) => {
    this.setState({
      ids: e.target.id,
      activeIndex: e.target.id,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    //console.log('----------222',this.slider1);
    const {
      symbol,
      item,
      addToCart,
      addToCartUnsafe,
      addToWishlist,
      translate,
    } = this.props;
    // console.log(this.props,261,'column-left','render');

    const { RelatedProduct } = this.state;
    var products = {
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: true,
      fade: true,
    };
    var productsnav = {
      slidesToShow: 6,
      swipeToSlide: true,
      arrows: false,
      dots: false,
      focusOnSelect: true,
    };

    const offer_tag = {
      width: "6rem",
      zIndex: "11111",
      position: "absolute",
      webkitTransform: "rotate(-45deg)",
      left: "-11px",
    };
    if (this.props.item !== null && this.props.item !== undefined) {
      // console.log(this.props.item);
      var find_offer = offerExist(
        this.props.item.offer_from_date,
        this.props.item.offer_to_date
      );

      find_offer.then((result) => {
        get_offer_condition = result;
      });
    }
    //console.log('render',item,this.props);

    return (
      <div>
        {item ? (
          <React.Fragment>
            {/* <Breadcrumb title={' Product / ' + item.name} metaTitle={`${item.name} | beldara.com`} metaDesc={`${item.name} | beldara.com`} metaKeyword={`${item.name} | beldara.com`}/> */}

            <div className="breadcrumb-section py-1">
              <Helmet>
                <meta property="og:type" content="product" />
                <meta property="product:brand" content="Beldara" />

                <meta property="product:availability" content="in stock" />

                <meta property="product:condition" content="new" />

                <meta
                  property="product:price:amount"
                  content={`${item.start_price}`}
                />

                <meta
                  property="product:price:currency"
                  content={`${item.currency}`}
                />

                <meta
                  property="product:retailer_item_id"
                  content={`${item.id}`}
                />
              </Helmet>
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="page-title">
                      <nav aria-label="breadcrumb" className="theme-breadcrumb">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item small">
                            <Link to={`${process.env.PUBLIC_URL}`}>
                              {translate("Home")}
                            </Link>
                          </li>
                          {item.level1 ? (
                            <li
                              className="breadcrumb-item small"
                              aria-current="page"
                            >
                              <Link
                                to={`${
                                  process.env.PUBLIC_URL
                                }/cat/${this.getProductUrl(item.level1)}.html`}
                                target="_blank"
                              >
                                {this.getProductLevel(item.level1)}
                              </Link>
                            </li>
                          ) : (
                            ""
                          )}
                          {item.level2 ? (
                            <li
                              className="breadcrumb-item small"
                              aria-current="page"
                            >
                              <Link
                                target="_blank"
                                to={`${
                                  process.env.PUBLIC_URL
                                }/cat/${this.getProductUrl(
                                  item.level1
                                )}/${this.getProductUrl(item.level2)}.html`}
                              >
                                {this.getProductLevel(item.level2)}
                              </Link>
                            </li>
                          ) : (
                            ""
                          )}
                          {item.level3 ? (
                            <li
                              className="breadcrumb-item small"
                              aria-current="page"
                            >
                              <Link
                                target="_blank"
                                to={`${
                                  process.env.PUBLIC_URL
                                }/cat/${this.getProductUrl(
                                  item.level1
                                )}/${this.getProductUrl(
                                  item.level2
                                )}/${this.getProductUrl(item.level3)}.html`}
                              >
                                {this.getProductLevel(item.level3)}
                              </Link>
                            </li>
                          ) : (
                            ""
                          )}
                          <li
                            className="breadcrumb-item active small d-none"
                            aria-current="page"
                          >
                            {item.name}
                          </li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*Section Start*/}
            <section>
              <div className="collection-wrapper">
                <div className="container">
                  <div className="row justify-content-center">
                    {/* <OfferTimer offer_from_date={item.offer_from_date} offer_to_date={item.offer_to_date}/> */}
                  </div>
                  <div className="row">
                    <div className="col-lg-4 product-thumbnail">
                      {get_offer_condition ? (
                        <div
                          className="badge badge-danger text-wrap my-1 p-3"
                          style={offer_tag}
                        >
                          {item.offer_percent} % Offer
                        </div>
                      ) : (
                        ""
                      )}
                      <Slider
                        {...products}
                        asNavFor={this.state.nav2}
                        ref={(slider) => (this.slider1 = slider)}
                        className="product-right-slick"
                      >
                        {
                          <div key={item.img}>
                            <img
                              src={imgUrl + `/product_images/` + item.img}
                              className="img-fluid image_zoom_cls-0 mouse_pointer"
                              alt={item.img}
                              style={{ margin: "0 auto", height: "400px" }}
                              onClick={this.onOpenModal}
                            />
                          </div>
                        }
                        {item.other_images.map((vari, index) =>
                          vari ? (
                            <div key={index}>
                              <img
                                src={imgUrl + `/product_images/` + vari}
                                className="img-fluid image_zoom_cls-0 mouse_pointer"
                                alt={vari}
                                id={index}
                                style={{ margin: "0 auto", height: "400px" }}
                                onClick={this.onOpenModal}
                              />
                            </div>
                          ) : (
                            ""
                          )
                        )}
                      </Slider>
                      {this.state.loadSmallImage == 1 ? (
                        <SmallImages
                          item={item}
                          settings={productsnav}
                          navOne={this.slider1}
                        />
                      ) : (
                        ""
                      )}
                      <>
                        <div>
                          <Modal
                            open={this.state.open}
                            onClose={() => ""}
                            center
                            className="cart-modal"
                          >
                            <div
                              className="modal-dialog modal-xl modal-dialog-centered modal-dialog-centered-1"
                              role="document"
                            >
                              <div className="modal-content min-modal-size modal-content-1">
                                <div className="modal-header modal-header-1">
                                  <h5 className="modal-title modal-title-1">{item.name}</h5>
                                  <button
                                    type="button"
                                    className="close"
                                    onClick={this.onCloseModal}
                                  >
                                    &times;
                                  </button>
                                </div>
                                <div className="modal-body modal1">
                                  <div className="container-fluid p-0">
                                    {/* <div className="row mx-2 my-2"> */}
                                    <div className="d-flex justify-content-end">
                                      {item.other_images.length > 0 ? (
                                        item.other_images.map((vari, index) =>
                                          vari ? (
                                            <div key={index}>
                                              <img
                                                src={
                                                  imgUrl +
                                                  `/product_images/` +
                                                  vari
                                                }
                                                alt={vari}
                                                id={index}
                                                style={{
                                                  margin: "0 auto",
                                                  height: "40px",
                                                  width: "54.09px",
                                                }}
                                                //className="img-thumbnail mr-1"
                                                className={`img-thumbnail mr-1 ${
                                                  index ==
                                                  this.state.activeIndex
                                                    ? "active-1"
                                                    : "inactive"
                                                }`}
                                                onClick={this.getImage}
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        )
                                      ) : (
                                        <div key={item.img}>
                                          <img
                                            src={
                                              imgUrl +
                                              `/product_images/` +
                                              item.img
                                            }
                                            alt={item.img}
                                            id={item.img}
                                            style={{
                                              margin: "0 auto",
                                              height: "40px",
                                              width: "54.09px",
                                            }}
                                            //className="img-thumbnail mr-1"
                                            className="img-thumbnail mr-1 active-1"
                                          />
                                        </div>
                                      )}
                                    </div>
                                    {/* </div>
                                    <div className="row mx-2 my-2"> */}
                                    <div className="d-flex justify-content-center">
                                      {item.other_images.length > 0 ? (
                                        item.other_images.map((vari, index) =>
                                          vari && index == this.state.ids ? (
                                            <div
                                              key={index}
                                              className="img-wrapper"
                                            >
                                              <img
                                                src={
                                                  imgUrl +
                                                  `/product_images/` +
                                                  vari
                                                }
                                                alt={vari}
                                                id={index}
                                                style={{
                                                  margin: "0 auto",
                                                  width: "340px",
                                                  height: "350px",
                                                }}
                                                className="mr-2 mr-2 hover-zoom"
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        )
                                      ) : (
                                        <div
                                          key={item.img}
                                          className="img-wrapper"
                                        >
                                          <img
                                            src={
                                              imgUrl +
                                              `/product_images/` +
                                              item.img
                                            }
                                            alt={item.img}
                                            id="0"
                                            style={{
                                              margin: "0 auto",
                                              width: "340px",
                                              height: "350px",
                                            }}
                                            className="mr-2 mr-2 hover-zoom"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* </div> */}
                          </Modal>
                        </div>
                      </>
                      <div className="border-top single-product-tables border-product detail-section pb-0 my-2">
                        <table>
                          <tbody>
                            <tr>
                              <td>{translate("Free Sample")}:</td>
                              <td>
                                {item.free_sample == "0" ? "On Demand" : "Yes"}
                              </td>
                            </tr>
                            <tr>
                              <td>{translate("Avalibility")}:</td>
                              <td>InStock</td>
                            </tr>
                            {parseFloat(item.weight) > parseFloat(0) ? (
                              <tr>
                                <td>{translate("Weight")}:</td>
                                <td>
                                  {item.weight} {item.available_stock_unit}
                                </td>
                              </tr>
                            ) : (
                              ""
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="">
                        <img
                          src={`${imgUrl}/images/payment-protection-icon.png`}
                          style={{ width: "40px" }}
                        />
                        <small style={{ color: "#ff9944" }}>
                          Beldara Pay helps keep your transactions secure
                        </small>
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
                            <div className="card py-0 border shadow-none">
                              <div
                                className="card-header py-0"
                                id="headingThree"
                              >
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
                                      style={{ fontSize: "30px" }}
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
                            <div className="card py-0 border shadow-none">
                              <div
                                className="card-header py-0"
                                id="headingfour"
                              >
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
                                  <div>
                                    {" "}
                                    - Return with in 10 days of delivery
                                  </div>
                                  <div>
                                    {" "}
                                    - Return pickup time with in 72 hours hours
                                    return booking
                                  </div>
                                  <div>
                                    {" "}
                                    - Get money refunded with in 48 hours if
                                    pickup
                                  </div>
                                  <div>
                                    <a
                                      target="blank"
                                      href="/return-policy.html"
                                    >
                                      {" "}
                                      View all{" "}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                              <div
                                className="card-header py-0"
                                id="headingThree"
                              >
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
                                      style={{ fontSize: "30px" }}
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
                            <div className="card py-0 border shadow-none">
                              <div
                                className="card-header py-0"
                                id="headingfour"
                              >
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
                                  <div>
                                    {" "}
                                    - Return with in 10 days of delivery
                                  </div>
                                  <div>
                                    {" "}
                                    - Return pickup time with in 72 hours hours
                                    return booking
                                  </div>
                                  <div>
                                    {" "}
                                    - Get money refunded with in 48 hours if
                                    pickup
                                  </div>
                                  <div>
                                    <a
                                      target="blank"
                                      href="/return-policy.html"
                                    >
                                      {" "}
                                      View all{" "}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                        <div className="border-product">
                          <h6 className="product-title">
                            {translate("100% SECURE PAYMENT")}
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
                      </div>
                    </div>
                    <Details
                      reviewCount={this.state.reviewCount}
                      dataFromRating={this.dataFromRating}
                      avgRating={this.state.avgRating}
                      item={item}
                      addToWishlistClicked={addToWishlist}
                      dispatch_variant_products={this.dispatch_variant_products}
                    />
                    {/* <Price
                      symbol={symbol}
                      item={item}
                      navOne={this.state.nav1}
                      addToCartClicked={addToCart}
                      BuynowClicked={addToCartUnsafe}
                    /> */}
                  </div>
                </div>
              </div>
            </section>
            {/*Section End*/}

            {/* <RatingChart /> */}

            {/* <section className="tab-product m-0">
              <div className="container">
                <div className="row">
                  <div className="col-sm-12 col-lg-12">
                    <DetailsTopTabs item={item} />
                  </div>
                </div>
              </div>
            </section> */}

            {RelatedProduct ? (
              <RelatedProduct product={item} />
            ) : (
              <LoadingComponent />
            )}

            <CustomerReview
              key={this.state.reviewRead}
              item={item}
              review={this.state.review}
              page={`${process.env.PUBLIC_URL}/rating/${item.url}.html`}
            />
          </React.Fragment>
        ) : (
          // ""
          <LoadingComponent />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let url = ownProps.match.params.id;
  let productId = getFileName(url);
  //  console.log(state.singleProduct,511,productId,is_variant,prod_variant_url);
  try {
    if (state.singleProduct.product.url === productId.toLowerCase()) {
      return {
        item: state.singleProduct.product,
        symbol: state.data.symbol,
      };
    } else if (
      state.data.products.find((el) => el.url == productId.toLowerCase()) !==
      undefined
    ) {
      return {
        item: state.data.products.find(
          (el) => el.url == productId.toLowerCase()
        ),
        symbol: state.data.symbol,
      };
    } else if (
      state.data.searchProducts.find(
        (el) => el.url == productId.toLowerCase()
      ) !== undefined
    ) {
      return {
        item: state.data.searchProducts.find(
          (el) => el.url == productId.toLowerCase()
        ),
        symbol: state.data.symbol,
      };
    } else if (
      state.data.productsByCategory.find(
        (el) => el.url == productId.toLowerCase()
      ) !== undefined
    ) {
      return {
        item: state.data.productsByCategory.find(
          (el) => el.url == productId.toLowerCase()
        ),
        symbol: state.data.symbol,
      };
    } else if (
      state.store.products.find((el) => el.url == productId.toLowerCase()) !==
      undefined
    ) {
      return {
        item: state.store.products.find(
          (el) => el.url == productId.toLowerCase()
        ),
        symbol: state.data.symbol,
      };
    } else if (
      state.data.relatedProducts.find(
        (el) => el.url == productId.toLowerCase()
      ) !== undefined
    ) {
      return {
        item: state.data.relatedProducts.find(
          (el) => el.url == productId.toLowerCase()
        ),
        symbol: state.data.symbol,
      };
    } else {
      return {
        item: null,
      };
    }
  } catch (e) {
    // console.log(e)
  }
};

export default withTranslate(
  connect(mapStateToProps, {
    addToCart,
    addToCartUnsafe,
    addToWishlist,
    getSingleProduct,
  })(ColumnLeft)
);
