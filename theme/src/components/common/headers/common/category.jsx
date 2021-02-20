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
import "./category.css";

export class Category extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // document.getElementById("main_cat_to_hover").addEventListener('mouseout',this.onMouseOut,true);
    // document.getElementById("main_cat_to_hover").addEventListener('mouseover',this.onMouseOver,true);
  }
  componentWillUnmount() {
    // document.getElementById("main_cat_to_hover").removeEventListener('mouseout',this.onMouseOut,true);
    // document.getElementById("main_cat_to_hover").addEventListener('mouseover',this.onMouseOver,true);
  }

  onMouseOut = (event) => {
    var e = event.toElement || event.relatedTarget;
    try {
      console.log(e, e.parentNode);
      if ($(e.parentNode).hasClass("addnewnavbar")) {
        return false;
        // console.log('if');
      }
      $("#main_categories").addClass("d-none");
    } catch (err) {
      console.error(err);
    }
  };

  onMouseOver = (event) => {
    var e = event.toElement || event.relatedTarget;
    try {
      $("#main_categories").removeClass("d-none");
    } catch (err) {
      console.error(err);
    }
  };
  render() {
    return (
      <div id="root_category">
        <h4 id="main_cat_to_hover" className="main_cat_to_hover hoverclass">
          Categories{" "}
          <i
            className="arrow"
            style={{ fontSize: "15px", margin: "3px 2px" }}
          ></i>
        </h4>
        <h6 style={{ opacity: "0" }} className="hoverclass"></h6>
        <span className="hoverclass" id="main_categories">
          {Object.entries(this.props.categories)
            .slice(0, 12)
            .map(([key, value], index) =>
              value.url !== undefined || value.url !== null ? (
                <React.Fragment>
                  {index == "0" ? (
                    <span
                      className={`h5 ${index} mx-1 has-submenu text-capitalize text-center`}
                      style={{ paddingTop: "8px" }}
                    >
                      TOP CATEGORIES
                    </span>
                  ) : (
                    ""
                  )}
                  <li key={key} className="submenu">
                    <a
                      href={`${
                        process.env.PUBLIC_URL
                      }/cat/${value.url.toLowerCase()}.html`}
                      target="_blank"
                    >
                      {key}
                      <i className="arrow-down float-right mt-2"></i>
                    </a>
                    <ul className="mega-menu clothing-menu">
                      <li>
                        <div className="row m-0">
                          <div className="link-section">
                            <h5 className="text-center">
                              <Link
                                to={`${
                                  process.env.PUBLIC_URL
                                }/cat/${value.url.toLowerCase(0)}.html`}
                                target="_blank"
                                className="subheadcat"
                              >
                                {key}
                              </Link>
                            </h5>
                            {Object.keys(value.name) != "" ? (
                              <li className={!isMobile ? "d-flex" : ""}>
                                <Categoryli categories={value} />
                                <Categoryli1 categories={value} />
                              </li>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  {index == "4" ? (
                    <>
                      <span
                        className="h5 mx-1 has-submenu text-capitalize text-center"
                        style={{ paddingTop: "8px" }}
                      >
                        OTHER CATEGORIES
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.categories;
};

export default connect(mapStateToProps)(Category);
