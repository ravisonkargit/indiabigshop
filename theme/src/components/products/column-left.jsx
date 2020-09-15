import React, { Component,Suspense,lazy } from "react";
import Slider from "react-slick";
import "../common/index.scss";
import { connect } from "react-redux";

// import custom Components
//import RelatedProduct from "../common/related-product";
import Details from "./common/product/details";
import Price from "./common/product/price";
import DetailsTopTabs from "./common/details-top-tabs";
import {
  getSingleProduct,
  addToCart,
  addToCartUnsafe,
  addToWishlist,
  getRelatedProducts
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
import OfferTimer from './common/product/offer-timer';
import { getRelatedItems } from "../../services";
import {offerExist} from '../../functions/index';
 

// import RatingChart from '../collection/common/ratingChart';

// import { getSingleItem, getRelatedItems } from '../../services';

//
function getFileName(url) {
  var index = url.lastIndexOf("/") + 1;
  var filenameWithExtension = url.substr(index);
  var filename = filenameWithExtension.split(".")[0];
  filename = filename.replace(/(#|\?).*?$/, "");
  return filename;
}
var isFetching=0
var get_offer_condition = false;
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
      isFetching:false
    };
   
  }

  UNSAFE_componentWillMount() {
  
    // console.log('product: UNSAFE_componentWillMount')
    if (window.innerWidth > 576) {
      this.setState({ vertical: true });
    } else {
      this.setState({ vertical: false });
    }
  }

  getReview = async getReview => {
    try {
      if (getReview.item.id) {
        await axios
          .post(
            `${ApiUrl}/common/show_review.php`,
            {
              sellerid: ls.get("sellerid"),
              productid: getReview.item.id,
              plateform_type: "",
              security_token: ""
            },
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then(async response => {
            if (response.data.statusId == 1 && response.data.result.review) {
              await this.setState({
                review: response.data.result.review,
                reviewCount: response.data.result.review.length,
                reviewRead: 1
              });
              let avgRatingTemp = 0.0;
              response.data.result.review.forEach(item => {
                avgRatingTemp += parseFloat(item.star_no);
              });
              avgRatingTemp = this.round_to_precision(
                avgRatingTemp / response.data.result.review.length,
                0.5
              );
              await this.setState({
                avgRating: avgRatingTemp
              });
            } else {
              await this.setState({
                review: [1],
                reviewCount: 0,
                avgRating: 0
              });
            }
          })
          .catch(error => {
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
      await this.setState({
        nav1: this.slider1,
        nav2: this.slider2
      });
    }
  };



  UNSAFE_componentWillReceiveProps = async nextProps => {
    // console.log('product: UNSAFE_componentWillReceiveProps')
    if (nextProps.item) {
      isFetching = 1;
    } else {
      isFetching = 0;
    }

  if (this.props.item && nextProps.item) {
    if (this.props.item.id != nextProps.item.id) {

      

      this.setState({
        RelatedProduct: null
      });
      import("../common/related-product").then(module => {
        this.setState({
          RelatedProduct: module.default
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

  componentDidMount = async nextProps => {

    
      // console.log(this.props.item,nextProps)
    // this.props.mixpanel.track('product_detail');
    import("../common/related-product").then(module => {
      this.setState({
        RelatedProduct: module.default
      });
    });

    if (this.props.item && nextProps) {
      await this.getReview(nextProps);
      this.setState({ loadSmallImage: 1 });
      this.setSlider();

    } else {
      await this.getReview(this.props);
      this.setState({ loadSmallImage: 1 });
      this.setSlider();

    }
    if (this.slider1 !== undefined && this.slider1 != "")
      this.setState({
        nav1: this.slider1,
        nav2: this.slider2
      });
  const query = getFileName(window.location.pathname)
            .split("/")
            .pop()
            .replace(".html", "");
  const val = query.split("-").splice(-1)[0];
  // console.log(val,241);
  await store.dispatch(getSingleProduct(val));
  await store.dispatch(getRelatedProducts(val))
  };

  



  UNSAFE_componentWillUpdate = async (nextProps) => {
    // console.log('UNSAFE_componentWillUpdate',this.props.item,isFetching);
    const query = getFileName(window.location.pathname)
            .split("/")
            .pop()
            .replace(".html", "");
    const val = query.split("-").splice(-1)[0];
    if ((this.props.item === null || this.props.item === undefined) && isFetching === 0) {
          isFetching = 1;
          store.dispatch(getSingleProduct(val));
        }
  }

  render() {
    const {
      symbol,
      item,
      addToCart,
      addToCartUnsafe,
      addToWishlist,
      translate
    } = this.props;
    // console.log(this.props,261,'column-left');

    const { RelatedProduct } = this.state;
    var products = {
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: true,
      fade: true
    };
    var productsnav = {
      slidesToShow: 6,
      swipeToSlide: true,
      arrows: false,
      dots: false,
      focusOnSelect: true
    };

    const offer_tag = {
      width:'6rem',
      zIndex:'11111',
      position:'absolute',
      webkitTransform: 'rotate(-45deg)',
      left:'-11px',
    };
    if(this.props.item !== null){
      var find_offer = offerExist(this.props.item.offer_from_date,this.props.item.offer_to_date);

      find_offer.then((result)=> {
        get_offer_condition = result;
      })
    }
    // console.log('render',13,this.props.item,get_offer_condition);
    
    return (
      <div>
        {item ? (
          <React.Fragment>
            {/* <Breadcrumb title={' Product / ' + item.name} metaTitle={`${item.name} | beldara.com`} metaDesc={`${item.name} | beldara.com`} metaKeyword={`${item.name} | beldara.com`}/> */}

            <div className="breadcrumb-section py-1">
           
              <Helmet>
                {/* <title>
                  {`${item.name} manufacturers wholesalers suppliers on beldara.com`}
                </title>
                <meta
                  name="description"
                  content={`${item.name} manufacturers wholesaler suppliers importers exporters on global b2b marketplace beldara.com`}
                />
                <meta
                  name="keyword"
                  content={`${item.name} manufacturers, ${item.name} wholesalers,  ${item.name} suppliers, manufacturers, suppliers, importers, exporters`}
                /> */}
                <meta
                  property="og:type"
                  content="product"
                />
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
                    {
                      (get_offer_condition)
                      ? <div className="badge badge-danger text-wrap my-1 p-3" style={offer_tag}>
                          {item.offer_percent} % Offer
                        </div>
                      : ''
                    }
                      <Slider
                        {...products}
                        asNavFor={this.state.nav2}
                        ref={slider => (this.slider1 = slider)}
                        className="product-right-slick"
                      >
                        {
                          <div key={item.img}>
                            <img
                              src={imgUrl + `/product_images/` + item.img}
                              className="img-fluid image_zoom_cls-0"
                              alt={item.img}
                              style={{ margin: "0 auto", height: "400px" }}
                            />
                          </div>
                        }
                        {item.other_images.map((vari, index) =>
                          vari ? (
                            <div key={index}>
                              <img
                                src={imgUrl + `/product_images/` + vari}
                                className="img-fluid image_zoom_cls-0"
                                alt={vari}
                                style={{ margin: "0 auto", height: "400px" }}
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
                          navOne={this.state.nav1}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <Details
                      reviewCount={this.state.reviewCount}
                      dataFromRating={this.dataFromRating}
                      avgRating={this.state.avgRating}
                      item={item}
                      addToWishlistClicked={addToWishlist}
                    />
                    <Price
                      symbol={symbol}
                      item={item}
                      navOne={this.state.nav1}
                      addToCartClicked={addToCart}
                      BuynowClicked={addToCartUnsafe}
                    />
                  </div>
                </div>
              </div>
            </section>
            {/*Section End*/}

            {/* <RatingChart /> */}

            <section className="tab-product m-0">
              <div className="container">
                <div className="row">
                  <div className="col-sm-12 col-lg-12">
                    <DetailsTopTabs item={item} />
                  </div>
                </div>
              </div>
            </section>

            
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
  console.log(511,productId,url);
  try {
    if (state.singleProduct.product.url === productId) {
      return {
        item: state.singleProduct.product,
        symbol: state.data.symbol
      };
    } else if (
      state.data.products.find(el => el.url == productId) !== undefined
    ) {
      return {
        item: state.data.products.find(el => el.url == productId),
        symbol: state.data.symbol
      };
    } else if (
      state.data.searchProducts.find(el => el.url == productId) !== undefined
    ) {
      return {
        item: state.data.searchProducts.find(el => el.url == productId),
        symbol: state.data.symbol
      };
    } else if (
      state.data.productsByCategory.find(el => el.url == productId) !==
      undefined
    ) {
      return {
        item: state.data.productsByCategory.find(el => el.url == productId),
        symbol: state.data.symbol
      };
    } else if (
      state.store.products.find(el => el.url == productId) !== undefined
    ) {
      return {
        item: state.store.products.find(el => el.url == productId),
        symbol: state.data.symbol
      };
    } else if (
      state.data.relatedProducts.find(el => el.url == productId) !== undefined
    ) {
      return {
        item: state.data.relatedProducts.find(el => el.url == productId),
        symbol: state.data.symbol
      };
    } else {
      return {
        item: null
      };
    }
  } catch (e) {
    // console.log(e)
  }
};

export default withTranslate(
  connect(
    mapStateToProps,
    { addToCart, addToCartUnsafe, addToWishlist,getSingleProduct }
  )(ColumnLeft)
);
