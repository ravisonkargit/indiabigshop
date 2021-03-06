import React, { Component } from "react";
import { connect } from "react-redux";
import "../common/index.scss";
import Slider from "react-slick";
import $ from "jquery";
import {
  getSellerProducts,
  getSellerCategoryWiseProducts,
} from "../../functions";
import axios from "axios";
import { Link } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
// import ProductItem from '../layouts/common/product-item';
import ProductListItem from "../collection/common/product-list-item";
import ReactImageFallback from "react-image-fallback";
import { Helmet } from "react-helmet";
import ReactPaginate from "react-paginate";
import { imgUrl } from "../../constants/variable";
import LoadingComponent from "../products/common/loading-bar";
import { getCookie } from "../../functions/index";
import CategoryComponent from "../common/getStoreCategoryComponent";
import { isMobile } from "react-device-detect";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function showImageOnlyIfExist(ele) {
  $("#" + ele)
    .closest(".col-grid-box")
    .addClass("d-none");
}
var url1 = window.location.href.split("/");
var url = url1[4].split(".");
var cat_id = url1[5];
// var cat_id2 = cat_id1.split("?");
// var cat_id = cat_id2[0];
class StoreFront extends Component {
  constructor(props) {
    super(props);

    let search = window.location.search;
    var params = new URLSearchParams(search);
    this.state = {
      pageUrl: "/store/" + url[0],
      sellerDetail: "",
      sellerProducts: "",
      runnable: 0,
      pageNo:
        parseInt(params.get("page")) > 0 ? parseInt(params.get("page")) : 0,
      pageCount: 1,
      isProductReceived: 0,
      sellerData: "",
      currency: "INR",
      country_code: "IN",
      productNotFound: false,
    };
  }

  changeArrow = (event) => {
    if (event.id == "down") {
      $(".catLabelBtn")
        .find("i")
        .removeClass("fa-chevron-down")
        .addClass("fa-chevron-up");
      $(".catLabelBtn").attr("id", "up");
    } else {
      $(".catLabelBtn")
        .find("i")
        .removeClass("fa-chevron-up")
        .addClass("fa-chevron-down");
      $(".catLabelBtn").attr("id", "down");
    }
  };

  handlePageClick = (data) => {
    if (this.state.pageNo != data.selected) {
      let selected = data.selected;
      window.location.href = window.location.pathname + "?page=" + selected;
    }
  };

  // handlePageClick = data => {
  //   let selected = data.selected;
  //   let offset = Math.ceil(selected * this.props.perPage);
  //   this.setState({ offset: offset }, () => {
  //     // this.fetchMoreItems()
  //     store.dispatch(getSellerProducts(this.state.sellerDetail.sellerid, this.state.offset, this.props.perPage));
  //     const x = $(".media")[0].scrollHeight
  //     window.scroll({ top: x, left: 0, behavior: 'smooth' })
  //   });
  // }

  checkImage = (setClass) => {
    showImageOnlyIfExist(setClass);
  };

  componentDidMount = async () => {
    await axios
      .post(
        "https://api.beldara.com/common/SFData.php",
        {
          security_token: "",
          plateform_type: "",
          surl: this.props.match.params.id,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        this.setState({
          sellerDetail: response.data.result,
          runnable: response.data.statusId,
          currency: getCookie("currency"),
          country_code: getCookie("country_code"),
          // totalCount:response.data.result.totalcount
        });
      })
      .catch((error) => {});

    if (parseInt(cat_id) > 0) {
      await getSellerCategoryWiseProducts(
        this.state.sellerDetail.sellerid,
        cat_id,
        this.state.pageNo
      ).then(async (res) => {
        if (res)
          this.setState({
            totalCount: res.count,
            isProductReceived: 1,
            products: res.products,
            pageCount: Math.ceil(parseInt(res.count) / 20),
          });
      });
    } else {
      await getSellerProducts(
        this.state.sellerDetail.sellerid,
        this.state.pageNo
      ).then(async (res) => {
        if (res)
          this.setState({
            totalCount: res.count,
            isProductReceived: 1,
            products: res.products,
            pageCount: Math.ceil(parseInt(res.count) / 20),
          });
      });
    }

    if (
      this.state.products == null ||
      this.state.products == undefined ||
      this.state.products == "" ||
      this.state.products == "0"
    ) {
      {
        setTimeout(() => {
          this.setState({
            productNotFound: true,
          });
        }, 10000);
      }
    }
    axios
      .post(
        `${imgUrl}/beta_api/get_seller_info_listing.php`,
        {
          security_token: "",
          plateform_type: "web",
          sellerid: this.state.sellerDetail.sellerid,
          currency: getCookie("currency"),
          countrycode: getCookie("country_code").toUpperCase(),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        if (response.data.statusId == 1) {
          this.setState({
            sellerData: response.data.result[0],
          });
        } else {
          this.setState({ sellerData: null });
        }
      })
      .catch((error) => {
        console.error(error, 11);
      });
  };

  checkImage = (setClass) => {
    showImageOnlyIfExist(setClass);
  };

  render() {
    var settings = {
      dots: true,
      //vertical: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    };
    const { symbol } = this.props.symbol;
    const { translate } = this.props;
    return (
      <React.Fragment>
        {this.state.runnable == 1 ? (
          <React.Fragment>
            {this.state.sellerDetail.company ? (
              <Helmet>
                <title>
                  {this.state.sellerDetail.company} on Beldara.com worlds
                  largest B2B marketplace
                </title>
                <meta
                  name="description"
                  content={
                    this.state.sellerDetail.company +
                    " on Beldara.com worlds largest B2B marketplace"
                  }
                />
                <meta
                  name="keyword"
                  content={
                    this.state.sellerDetail.company +
                    " on Beldara.com worlds largest B2B marketplace"
                  }
                />
              </Helmet>
            ) : (
              <Helmet>
                <title>Beldara.com worlds largest B2B marketplace</title>
                <meta
                  name="description"
                  content="Beldara.com worlds largest B2B marketplace"
                />
                <meta
                  name="keyword"
                  content="Beldara.com worlds largest B2B marketplace"
                />
              </Helmet>
            )}

            {/*Section Start*/}

            <section className="section-b-space py-0">
              <div className="collection-wrapper">
                <div className="container">
                  <div className="row">
                    <div className="collection-content col">
                      <div className="page-main-content">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-sm-12 d-none">
                              <div className="top-banner-wrapper text-center">
                                {this.state.sellerDetail.banner.length > 0 ? (
                                  <Slider className="slide-1 home-slider">
                                    {this.state.sellerDetail.banner
                                      ? this.state.sellerDetail.banner.map(
                                          (item) => (
                                            // (imageExists(item.image) && item.image!==undefined) ?
                                            <div key={item}>
                                              <div className="home lazyload">
                                                <img
                                                  style={{ maxHeight: "400px" }}
                                                  src={item}
                                                  alt={item}
                                                />
                                              </div>
                                            </div>
                                          )
                                        )
                                      : ""}
                                  </Slider>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="col-sm-4 my-3">
                              <div className="media">
                                <ReactImageFallback
                                  src={
                                    this.state.sellerDetail.logo
                                      ? this.state.sellerDetail.logo
                                      : ""
                                  }
                                  // src={`${imgUrl+'/images/ajax-loader.gif'}`}
                                  fallbackImage={`${imgUrl +
                                    "/images/company-default-logo.png"}`}
                                  initialImage={`${imgUrl +
                                    "/images/ajax-loader.gif"}`}
                                  className="align-self-center mr-3"
                                  alt={
                                    this.state.sellerDetail.company
                                      ? this.state.sellerDetail.company
                                      : ""
                                  }
                                  style={{ width: "100px" }}
                                />
                                {/* <img src={logo} className="align-self-center mr-3" alt={company} style={{ width:'100px'}} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgUrl+'/images/company-default-logo.png'}`}}/> */}
                                <div className="media-body">
                                  <h5 className="mt-0">
                                    {this.state.sellerDetail.company
                                      ? this.state.sellerDetail.company
                                      : ""}
                                    {this.state.sellerDetail.otp_verify ===
                                    "1" ? (
                                      <span className="badge badge-success ml-2 shadow">
                                        {" "}
                                        <i className="fa fa-check-circle "></i>
                                        {translate("Verified Supplier")}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </h5>
                                  {/* <p>
                                    {this.state.sellerDetail.area
                                      ? this.state.sellerDetail.area
                                      : ""}
                                    {this.state.sellerDetail.city
                                      ? "," + this.state.sellerDetail.city
                                      : ""}
                                    {this.state.sellerDetail.country_name
                                      ? "," +
                                        this.state.sellerDetail.country_name
                                      : ""}
                                  </p> */}
                                  <h6 className="m-0">
                                    Price Range:{" "}
                                    {this.state.sellerData ? (
                                      <strong>
                                        <i
                                          className={
                                            this.state.currency == "INR"
                                              ? "fa fa-inr"
                                              : "fa fa-usd"
                                          }
                                        ></i>{" "}
                                        {this.state.sellerData.min_price}-
                                        <i
                                          className={
                                            this.state.currency == "INR"
                                              ? "fa fa-inr"
                                              : "fa fa-usd"
                                          }
                                        ></i>{" "}
                                        {this.state.sellerData.max_price}
                                      </strong>
                                    ) : (
                                      ""
                                    )}
                                  </h6>
                                  <h6 className="m-0">
                                    Min Order Value:{" "}
                                    {this.state.sellerData != "" &&
                                    this.state.sellerData !== null &&
                                    this.state.sellerData.seller_moq != "" &&
                                    this.state.sellerData.seller_moq != null
                                      ? this.state.sellerData.seller_moq
                                      : "NA"}
                                  </h6>
                                  <h6 className="m-0">
                                    City :{" "}
                                    {this.state.sellerData != "" &&
                                    this.state.sellerData !== null &&
                                    this.state.sellerData.city != "" &&
                                    this.state.sellerData.city != null
                                      ? this.state.sellerData.city
                                      : "NA"}
                                  </h6>
                                  <Link
                                    to={`${process.env.PUBLIC_URL}/post-requirement.html`}
                                    className="btn btn-solid"
                                  >
                                    <i className="fa fa-paper-plane mr-1"></i>
                                    {translate("Contact supplier")}
                                  </Link>
                                </div>
                              </div>
                            </div>
                            {isMobile ? (
                              ""
                            ) : (
                              <div
                                className="col-sm-8 container"
                                style={{ height: "200px", marginTop: "15px" }}
                              >
                                {this.state.sellerDetail.banner.length > 0 ? (
                                  <div className="">
                                    <Slider {...settings} className="">
                                      {this.state.sellerDetail.banner
                                        ? this.state.sellerDetail.banner.map(
                                            (item) => (
                                              <div>
                                                {item.link !== "" &&
                                                item.link !== null &&
                                                item.link !== "0" ? (
                                                  <a href={item.link} target="_blank">
                                                    <img
                                                      style={{
                                                        width: "710px",
                                                        height: "197px",
                                                      }}
                                                      src={item.bimg}
                                                      alt={item.alt_track}
                                                    />
                                                  </a>
                                                ) : (
                                                  <img
                                                    style={{
                                                      width: "710px",
                                                      height: "197px",
                                                    }}
                                                    src={item.bimg}
                                                    alt={item.alt_track}
                                                  />
                                                )}
                                              </div>
                                            )
                                          )
                                        : ""}
                                    </Slider>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}

                            {/* ------------ product lenth ----------------- */}
                            <div className="col-sm-12 my-2">
                              <div className="row">
                                <div className="col-sm-12 my-2">
                                  <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                      <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                      >
                                        {translate("PRODUCTS")}{" "}
                                      </li>
                                    </ol>
                                  </nav>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-sm-3">
                                  <CategoryComponent
                                    type={this.state}
                                    cat_id={cat_id}
                                  />
                                </div>
                                <div className="col-sm-9 my-2">
                                  <div className="product-wrapper-grid row">
                                    <div className="container-fluid">
                                      {/* <div className="row"> */}
                                      {/* <ProductItem product={this.state.sellerProducts} /> */}
                                      {this.state.products ? (
                                        <div className="row">
                                          {this.state.products.map(
                                            (item, index) => (
                                              <div
                                                className="col-6 col-lg-4 col-xl-4 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1"
                                                key={index}
                                              >
                                                <ProductListItem
                                                  checkImage={this.checkImage}
                                                  product={item}
                                                  symbol={symbol}
                                                  key={index}
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <>
                                          {this.state.productNotFound ? (
                                            <div className="row text-center">
                                              <div className="col-12">
                                                <img
                                                  src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`}
                                                  className="img-fluid"
                                                />
                                                <h3>
                                                  Sorry! No Category Products
                                                  found!!!{" "}
                                                </h3>
                                                {/* <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid">continue shopping</Link> */}
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              style={{
                                                position: "absolute",
                                                left: "40%",
                                                top: "2%",
                                                transform:
                                                  "translate(-50%, -50%)",
                                              }}
                                            >
                                              <Loader
                                                type="Puff"
                                                color="#FB9944"
                                                height={100}
                                                width={100}
                                              />
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {/* </div> */}
                                      <div className="row justify-content-md-center">
                                        {this.state.products ? (
                                          this.state.pageCount > 1 ? (
                                            <ReactPaginate
                                              initialPage={this.state.pageNo}
                                              previousLabel={"previous"}
                                              nextLabel={"next"}
                                              breakLabel={"..."}
                                              breakClassName={"break-me"}
                                              pageCount={this.state.pageCount}
                                              marginPagesDisplayed={2}
                                              pageRangeDisplayed={3}
                                              onPageChange={
                                                this.handlePageClick
                                              }
                                              containerClassName={
                                                "pagination my-5"
                                              }
                                              subContainerClassName={
                                                "pages pagination"
                                              }
                                              pageLinkClassName={"page-link"}
                                              previousClassName={"page-item"}
                                              previousLinkClassName={
                                                "page-link"
                                              }
                                              nextClassName={"page-item"}
                                              nextLinkClassName={"page-link"}
                                              pageClassName={"page-item"}
                                              activeClassName={"active"}
                                            />
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {this.state.sellerDetail.about ? (
                              <div className="col-sm-12 my-2">
                                <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb">
                                    <li
                                      className="breadcrumb-item active"
                                      aria-current="page"
                                    >
                                      {translate("ABOUT")}
                                    </li>
                                  </ol>
                                </nav>

                                <div
                                  className="col-sm-12"
                                  dangerouslySetInnerHTML={{
                                    __html: this.state.sellerDetail.about,
                                  }}
                                ></div>
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="col-sm-12 my-2">
                              {this.state.sellerDetail.certificate ? (
                                <React.Fragment>
                                  <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                      <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                      >
                                        {translate("Certificates")}
                                      </li>
                                    </ol>
                                  </nav>
                                  <div className="col-sm-12">
                                    <div className="row">
                                      {this.state.sellerDetail.certificate.map(
                                        (item, index) => (
                                          <div
                                            className="product-box col-12 col-md-3"
                                            key={item}
                                          >
                                            <div className="img-wrapper">
                                              <div className="front">
                                                {/* <Link to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url)}.html`}> */}
                                                <img
                                                  src={item}
                                                  className="img-fluid"
                                                  alt={`${item}`}
                                                  style={{
                                                    width: "200px",
                                                    height: "200px",
                                                  }}
                                                />
                                                {/* </Link> */}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </React.Fragment>
                              ) : (
                                <LoadingComponent />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        ) : (
          <LoadingComponent />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  //sellerDetail: state.store.data,
  // products: state.store.products.products,
  // totalCount:state.store.products.count,
  // //products: getSearchProducts(state.store.products, state.filters),
  perPage: "20",
  symbol: state.data.symbol,
});

export default withTranslate(connect(mapStateToProps)(StoreFront));

// export default StoreFront;
