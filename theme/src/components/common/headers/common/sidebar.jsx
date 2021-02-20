import React, { Component, lazy } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import "smartmenus";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../../../actions";
import store from "../../../../store";
import ls from "local-storage";
import { SellerUrl, MsgUrl } from "../../../../constants/ActionTypes";
import { getCookie, setCookie } from "../../../../functions";
import { isMobile, isAndroid } from "react-device-detect";
import Categoryli from "./categoryli";
import Categoryli1 from "./categoryli1";
class SideBar extends Component {
  // componentWillMount() {

  // }
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // console.log(this.props,22);
    store.dispatch(getAllCategories());
    document
      .getElementById("catData")
      .addEventListener("mouseout", this.onMouseOut, true);
    document
      .getElementById("catData")
      .addEventListener("mouseover", this.onMouseOver, true);
  }

  componentDidUpdate() {
    $(function() {
      $("#sub-menu").smartmenus({
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8,
      });
    });
  }

  componentWillUnmount() {
    document
      .getElementById("catData")
      .removeEventListener("mouseout", this.onMouseOut, true);
    document
      .getElementById("catData")
      .addEventListener("mouseover", this.onMouseOver, true);
  }

  onMouseOut = (event) => {
    var e = event.toElement || event.relatedTarget;
    try {
      //    console.log(e);
      if (!$(e).hasClass("has-submenu")) {
        $("#categoriesData").addClass("d-none");
      }
    } catch (err) {
      console.error(err);
    }

    // alert('MouseOut');
    // handle mouse event here!
  };

  onMouseOver = (event) => {
    var e = event.toElement || event.relatedTarget;
    try {
      $("#categoriesData").removeClass("d-none");
    } catch (err) {
      console.error(err);
    }

    // alert('MouseOut');
    // handle mouse event here!
  };

  // addeventOnmenu = (event) => {
  //     console.log(event,'47');
  // }

  // componentWillReceiveProps(){
  //   console.log('componentWillReceiveProps in sidebar');
  // }

  closeNav = (e) => {
    e.preventDefault();
    if ($("#categoriesData").hasClass("d-none")) {
      var closemyslide = document.getElementById("mySidenav");
      if (closemyslide) closemyslide.classList.remove("open-side");
    } else {
      $("#categoriesData").toggleClass("d-none");
    }
  };
  showCat = (e) => {
    e.preventDefault();
    // console.log('working...');
    $("#categoriesData").toggleClass("d-none");
    // $('#categoriesData').removeClass('d-none');
  };

  render() {
    // console.log(this.props,'sidear called');
    var LogId = isNaN(ls.get("log_id"));
    const ColoredLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 2,
          marginTop: 0,
          marginBottom: 0,
          width: 240,
        }}
      />
    );
    var scrollAuto = {
      overflowY: "scroll",
    };
    // console.log(this.props.categories,118);
    return (
      <div id="mySidenav" className="sidenav">
        <a href="#" className="sidebar-overlay" onClick={this.closeNav}></a>
        <nav>
          <div onClick={this.closeNav}>
            <div className="sidebar-back text-left">
              <i className="fa fa-angle-left pr-2" aria-hidden="true"></i> Back
            </div>
          </div>
          {/*Vertical Menu*/}
          {this.props.categories ? (
            <ul id="sub-menu" className="sm pixelstrap sm-vertical">
              <li>
                {ls.get("log_id") === null ||
                ls.get("log_id") == "" ||
                ls.get("log_id") == "null" ? (
                  <a href={`${SellerUrl}/login.html`} data-lng="en">
                    {" "}
                    <img
                      src="https://img.beldara.com/assets/images/user_icon1.png"
                      alt="login with beldara"
                    />{" "}
                    Login
                  </a>
                ) : (
                  <a>Welcome {this.props.user.user.name},</a>
                )}
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a
                  id="catData"
                  className="catData"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  <img
                    src="https://img.beldara.com/assets/images/category_image1.png"
                    alt="Category Image"
                  />{" "}
                  category
                </a>
                {/* <ul className="mega-menu clothing-menu"> */}
                <span className="d-none has-submenu" id="categoriesData">
                  {Object.entries(this.props.categories)
                    .slice(0, 12)
                    .map(([key, value], index) =>
                      value.url !== undefined || value.url !== null ? (
                        <React.Fragment>
                          {index == "0" ? (
                            <span className={`h5 ${index} mx-4 has-submenu`}>
                              Top Categories
                            </span>
                          ) : (
                            ""
                          )}
                          <li key={key}>
                            {isMobile ? (
                              <a href="#">{key}</a>
                            ) : (
                              <a
                                href={`${
                                  process.env.PUBLIC_URL
                                }/cat/${value.url.toLowerCase()}.html`}
                                target="_blank"
                              >
                                {key}
                              </a>
                            )}

                            <ul className="mega-menu clothing-menu">
                              <li>
                                <div className="row m-0">
                                  <div className="col-xl-4">
                                    <div className="link-section">
                                      <h5>
                                        <Link
                                          to={`${
                                            process.env.PUBLIC_URL
                                          }/cat/${value.url.toLowerCase()}.html`}
                                          target="_blank"
                                        >
                                          {key}
                                        </Link>
                                      </h5>
                                      {Object.keys(value.name) != "" ? (
                                        <li
                                          className={!isMobile ? "d-flex" : ""}
                                        >
                                          <Categoryli categories={value} />
                                          <Categoryli1 categories={value} />
                                        </li>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </li>
                          {index == "5" ? (
                            <>
                              <ColoredLine color="#0a0909cc" />
                              <span className="h5 mx-4 has-submenu">
                                Other categories
                              </span>
                            </>
                          ) : (
                            ""
                          )}
                        </React.Fragment>
                      ) : (
                        ""
                      )
                    )}
                </span>
                {/* </ul> */}
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/post-requirement.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/paper_plan1.png"
                    alt="Post requirement on beldara"
                  />{" "}
                  Post Requirement
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/auction.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/auction_icon1.png"
                    alt="Auction on beldara"
                  />{" "}
                  AUCTION
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                {ls.get("log_id") === null ||
                ls.get("log_id") == "" ||
                ls.get("log_id") == "null" ? (
                  <a
                    href={`${SellerUrl}/login.html?url=https://msg.beldara.com`}
                    data-lng="en"
                  >
                    <img
                      src="https://img.beldara.com/assets/images/chat_icon1.png"
                      alt="chat on beldara"
                    />{" "}
                    Chat Now
                  </a>
                ) : (
                  <a href={`${MsgUrl}`} data-lng="en">
                    <img
                      src="https://img.beldara.com/assets/images/chat_icon1.png"
                      alt="chat on beldara"
                    />{" "}
                    Chat Now
                  </a>
                )}
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/cart.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/cart_icon1.png"
                    alt="cart on beldara"
                  />{" "}
                  My Cart
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/offers.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/offer_icon1.png"
                    alt="offers on beldara"
                  />{" "}
                  Offers
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/bpp.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/brand_icon1.png"
                    alt="BPP product on beldara"
                  />{" "}
                  PRODUCT PROMOTION
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/trade-show.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/brand_icon1.png"
                    alt="trade show product on beldara"
                  />{" "}
                  Trade Show
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/membership.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/membership_icon1.png"
                    alt="Membership on beldara"
                  />{" "}
                  MEMBERSHIP
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              {isMobile ? (
                isAndroid ? (
                  <li>
                    <a href="http://b4b.in/normal?id=0">
                      <img
                        src="https://img.beldara.com/assets/images/mobile_icon_android1.png"
                        alt="beldara android app"
                      />{" "}
                      OPEN IN APP
                    </a>
                    <ColoredLine color="#f1aa61" />
                  </li>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <li>
                <a className="d-flex">
                  <img
                    src="https://img.beldara.com/assets/images/phone_icon1.png"
                    alt="phone on beldara"
                  />
                  {isMobile ? (
                    this.props.changeCountry != "" &&
                    this.props.changeCountry != "null" &&
                    this.props.changeCountry !== null ? (
                      this.props.changeCountry == "in" ? (
                        <a href="tel:+91-9555788833">+91-9555788833</a>
                      ) : (
                        <a href="tel:+1-9132890433">+1-913-289-0433</a>
                      )
                    ) : getCookie("country_code") == "in" ? (
                      <a href="tel:+91-9555788833">+91-9555788833</a>
                    ) : (
                      <a href="tel:+1-9132890433">+1-913-289-0433</a>
                    )
                  ) : this.props.changeCountry != "" &&
                    this.props.changeCountry != "null" &&
                    this.props.changeCountry !== null ? (
                    this.props.changeCountry == "in" ? (
                      " +91-9555788833"
                    ) : (
                      " +1-913-289-0433"
                    )
                  ) : getCookie("country_code") == "in" ? (
                    "+91-9555788833"
                  ) : (
                    "+1-913-289-0433"
                  )}
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
              <li>
                <a href={`${process.env.PUBLIC_URL}/about.html`}>
                  <img
                    src="https://img.beldara.com/assets/images/about_icon1.png"
                    alt="About on beldara"
                  />{" "}
                  About Us
                </a>
                <ColoredLine color="#f1aa61" />
              </li>
            </ul>
          ) : (
            ""
          )}
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.categories;
};

export default connect(mapStateToProps)(SideBar);
