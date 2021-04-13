import React, { Component } from "react";
import $ from "jquery";
import Breadcrumb from "../common/breadcrumb";
import axios from "axios";
import { connect } from "react-redux";
import { imgUrl } from "../../constants/variable";
import { isMobile } from "react-device-detect";
import ReactTooltip from "react-tooltip";
import { getCookie } from "../../functions";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import "./myOrder.css";
import { captureEvent } from "../../functions";
import ls from "local-storage";
import Paytm from "../payment-gateway/myorderpaytm";
import Modal from "react-bootstrap/Modal";
import { ApiUrl } from "../../constants/ActionTypes";

var langDomain, domain_language_code;
class myOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      dataMyOrder: [],
      detailsorder: [],
      sellerWiseData: [],
      seller_id: ls.get("sellerid"),
      getpath: this.props.location.pathname.split("."),
      chkpath: this.props.location.pathname,
      country_name: getCookie("country_name"),
      user: "",
      order_id: "0",
      order_code: "0",
      buyerid: "0",
      sellerid: "0",
      amount: "0",
      discount_code: "NA",
      discounted_amount: "0",
      has_coupon: "0",
      full_payment: "0",
      payment_type: "0",
      additional_detail_id: "0",
      openTransferModal: false,
      b_order_code: "0",
      b_amount_total: "0",
      b_sellerid: "0",
      count: "0",
      count1: "0",
    };
  }

  async componentWillMount() {
    this.getBankDetails();
    this.GetMyOrder();
    var hostname = window.location.hostname;
    langDomain = hostname.split("beldara.com")[0];
    langDomain = langDomain.replace(".", "");
    this.props.languageMaster.forEach((element) => {
      if (element.main_language.toLowerCase() == langDomain.toLowerCase())
        domain_language_code = element.code;
    }, this);
    if (domain_language_code !== "" && domain_language_code !== undefined) {
      await axios
        .post(
          "https://api.indiabigshop.com/common/static_page.php",
          {
            security_token: "",
            plateform_type: "",
            langCode: domain_language_code,
            pageid: "5",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          this.setState({
            data: response.data.result,
          });
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    } else {
      await axios
        .post(
          "https://api.indiabigshop.com/common/static_page.php",
          {
            security_token: "",
            plateform_type: "",
            langCode: "en",
            pageid: "5",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          this.setState({
            data: response.data.result,
          });
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
  }

  async componentDidUpdate() {
    //this.GetMyOrder();
  }

  getBankDetails() {
    try {
      axios
        .post(
          "https://api.indiabigshop.com/common/get_company_bank_details.php",
          {
            type: "",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          if (response.data.result != null) {
            this.setState({
              acc_number: response.data.result[0].acc_number,
              bank_swift_code: response.data.result[0].bank_swift_code,
              beneficiary_address: response.data.result[0].beneficiary_address,
              beneficiary_bank: response.data.result[0].beneficiary_bank,
              name: response.data.result[0].name,
            });
          } else {
          }
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  // fetchMoreDataDemo = (e) => {
  //   this.setState({
  //     count: this.state.count + 1,
  //   });
  //   console.log("----------------count--------------", this.state.count);
  // };

  // fetchMoreData = (e) => {
  //   if (this.state.chkpath != "/my-order.html") {
  //     if (
  //       this.state.getpath[0].split("-")[3] != null ||
  //       this.state.getpath[0].split("-")[3] != ""
  //     ) {
  //       try {
  //         axios
  //           .post(
  //             "https://api.beldara.com/common/get_my_order.php",
  //             {
  //               buyerid: this.state.getpath[0].split("-")[3],
  //               count: "5",
  //             },
  //             { headers: { "Content-Type": "multipart/form-data" } }
  //           )
  //           .then((response) => {
  //             if (
  //               response.data.result.order != null &&
  //               response.data.result.detailsorder != null &&
  //               response.data.result.sellerWiseData != null
  //             ) {
  //               this.setState({
  //                 dataMyOrder: response.data.result.order,
  //                 detailsorder: response.data.result.detailsorder,
  //                 sellerWiseData: response.data.result.sellerWiseData,
  //               });
  //             } else {
  //               this.setState({
  //                 dataNotFound: "1",
  //               });
  //             }
  //           })
  //           .catch((error) => {
  //             const result = error.response;
  //             return Promise.reject(result);
  //           });
  //       } catch (e) {
  //         console.log(`😱 Axios request failed: ${e}`);
  //       }
  //     } else {
  //       this.setState({
  //         dataNotFound: "1",
  //       });
  //     }
  //   } else {
  //     if (this.state.seller_id != null || this.state.seller_id != "") {
  //       try {
  //         axios
  //           .post(
  //             "https://api.beldara.com/common/get_my_order.php",
  //             {
  //               buyerid: this.state.seller_id,
  //               count: "5",
  //             },
  //             { headers: { "Content-Type": "multipart/form-data" } }
  //           )
  //           .then((response) => {
  //             if (
  //               response.data.result.order != null &&
  //               response.data.result.detailsorder != null &&
  //               response.data.result.sellerWiseData != null
  //             ) {
  //               this.setState({
  //                 dataMyOrder: response.data.result.order,
  //                 detailsorder: response.data.result.detailsorder,
  //                 sellerWiseData: response.data.result.sellerWiseData,
  //               });
  //             } else {
  //               this.setState({
  //                 dataNotFound: "1",
  //               });
  //             }
  //           })
  //           .catch((error) => {
  //             const result = error.response;
  //             return Promise.reject(result);
  //           });
  //       } catch (e) {
  //         console.log(`😱 Axios request failed: ${e}`);
  //       }
  //     } else {
  //       this.setState({
  //         dataNotFound: "1",
  //       });
  //     }
  //   }
  // };

  GetMyOrder() {
    //4449181
    //8774859

    if (this.state.chkpath != "/my-order.html") {
      if (
        this.state.getpath[0].split("-")[3] != null ||
        this.state.getpath[0].split("-")[3] != ""
      ) {
        try {
          axios
            .post(
              "https://api.indiabigshop.com/common/get_my_order.php",
              {
                buyerid: this.state.getpath[0].split("-")[3],
                count: "0",
              },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then((response) => {
              if (
                response.data.result.order != null &&
                response.data.result.detailsorder != null &&
                response.data.result.sellerWiseData != null
              ) {
                // console.log("----------1------------", response);
                this.setState({
                  dataMyOrder: response.data.result.order,
                  detailsorder: response.data.result.detailsorder,
                  sellerWiseData: response.data.result.sellerWiseData,
                });
                // console.log(
                //   "----------2 dataMyOrder ------------",
                //   this.state.dataMyOrder
                // );
                // console.log(
                //   "----------3 detailsorder------------",
                //   this.state.detailsorder
                // );
                // console.log(
                //   "----------4 sellerWiseData------------",
                //   this.state.sellerWiseData
                // );
              } else {
                this.setState({
                  dataNotFound: "1",
                });
                //console.log("----------5------------", this.state.dataNotFound);
              }
            })
            .catch((error) => {
              const result = error.response;
              return Promise.reject(result);
            });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }
      } else {
        this.setState({
          dataNotFound: "1",
        });
      }
    } else {
      if (this.state.seller_id != null || this.state.seller_id != "") {
        try {
          axios
            .post(
              "https://api.indiabigshop.com/common/get_my_order.php",
              {
                buyerid: this.state.seller_id,
                count: "0",
              },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then((response) => {
              if (
                response.data.result.order != null &&
                response.data.result.detailsorder != null &&
                response.data.result.sellerWiseData != null
              ) {
                //console.log("----------1------------", response);
                this.setState({
                  dataMyOrder: response.data.result.order,
                  detailsorder: response.data.result.detailsorder,
                  sellerWiseData: response.data.result.sellerWiseData,
                });
                // console.log(
                //   "----------2 dataMyOrder ------------",
                //   this.state.dataMyOrder
                // );
                // console.log(
                //   "----------3 detailsorder------------",
                //   this.state.detailsorder
                // );
                // console.log(
                //   "----------4 sellerWiseData------------",
                //   this.state.sellerWiseData
                // );
              } else {
                this.setState({
                  dataNotFound: "1",
                });
              }
              //console.log("----------5------------", this.state.dataNotFound);
            })
            .catch((error) => {
              const result = error.response;
              return Promise.reject(result);
            });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }
      } else {
        this.setState({
          dataNotFound: "1",
        });
      }
    }
  }

  handleClick = async (data) => {
    //console.log("---------------handleClick------------------",data);
    await this.setState({
      user: "",
      order_id: data.order_id,
      order_code: data.order_code,
      buyerid: data.buyerid,
      sellerid: data.sellerid,
      amount: data.amount,
      discount_code: "NA",
      discounted_amount: data.discounted_amount,
      has_coupon: "0",
      full_payment: data.full_payment,
      payment_type: data.payment_type,
      additional_detail_id: data.additional_detail_id,
    });
    this.changeMethod("paytm");
  };

  getUploadFileData = async (data) => {
    await this.setState({
      b_order_code: data.b_order_code,
      b_amount_total: data.b_amount_total,
      b_order_id: data.b_order_id,
      b_sellerid: data.b_sellerid,
      openTransferModal: !this.state.openTransferModal,
    });
  };

  UploadFileTrasfer = () => {
    $("#msg_").empty();
    $("#msg_").addClass("d-none");
    var transaction_no = $("#transaction_no").val();
    var transaction_file = $("#transaction_file").val();

    var seller_invoice = $("#transaction_file")[0];
    var file_ = seller_invoice.files[0];

    var formdata = new FormData();
    formdata.append("main_img", file_);
    formdata.append("paymentidbytt", "");
    formdata.append("order_code", this.state.b_order_code);
    formdata.append("buyeremail", "");
    formdata.append("amount", this.state.b_amount_total);
    formdata.append("amount_paid", this.state.b_amount_total);
    formdata.append("name", "");
    formdata.append("account", "beldara");
    formdata.append("orderid", this.state.b_order_id);
    formdata.append("amountbytt", 1);
    formdata.append("partial", 0);
    formdata.append("pay_pending", "");
    formdata.append("mode", 2);
    formdata.append("sellerid", this.state.b_sellerid);
    formdata.append("transaction_no", transaction_no);

    if (transaction_no != "") {
      if (transaction_file != "") {
        $("#UploadFileTrasfer_").attr("disabled", true);
        try {
          axios({
            method: "post",
            url: "https://api.indiabigshop.com/common/upload_purchased_receipt.php",
            data: formdata,
            config: { headers: { "Content-Type": "multipart/form-data" } },
          })
            .then((response) => {
              // console.log("--------------------", response);
              $("#msg_")
                .removeClass("d-none")
                .append("File uploaded successfully.");
              $("#UploadFileTrasfer_").attr("disabled", false);
              setTimeout(function() {
                window.location.reload();
              }, 2000);
            })
            .catch((err) => {
              $("#msg_")
                .removeClass("d-none")
                .append("Something went wrong. Please try again.");
              $("#UploadFileTrasfer_").attr("disabled", false);
              console.error(err);
            });
        } catch (err) {
          console.error(err);
          $("#submit_order_receipt").removeAttr("disabled");
        }
      } else {
        $("#msg_")
          .removeClass("d-none")
          .append("Please upload transaction file");
      }
    } else {
      $("#msg_")
        .removeClass("d-none")
        .append("Please enter transaction number");
    }
  };

  changeMethod(method) {
    this.setState({ checked: method });
    captureEvent(
      "shipment",
      "order",
      method,
      "shipment",
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
    $(".paytmBtn").click();
  }

  executeOnClick(isExpanded) {
    console.log(isExpanded);
  }

  OpenPopup = () => {
    this.setState({
      isOpenPopup: !this.state.isOpenPopup,
    });
  };

  render() {
    const HRLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 1,
          marginTop: 0,
          marginBottom: 0,
        }}
      />
    );
    return (
      <div>
        {this.props.location.pathname == "/my-order.html" ? (
          <Breadcrumb
            title={"My Order"}
            metaDesc={this.state.data.desc1}
            metaKeyword={this.state.data.keyword}
            metaTitle={this.state.data.title}
          />
        ) : (
          ""
        )}
        <div className="container">
          {this.state.dataNotFound != "1" ? (
            <div>
              <br></br>
              {this.state.dataMyOrder.map((item, index) => {
                return (
                  <React.Fragment>
                    {isMobile ? (
                      <div className="row p-3 mb-2 bg-light text-dark">
                        <div className="col-sm-4">
                          <strong>Order ID : </strong>{" "}
                          <label>{"#" + item.id + "-" + item.order_code}</label>
                        </div>
                        <div className="col-sm-2">
                          <strong>Ship To : </strong>
                          <label>
                            {item.delivery_address.substring(0, 10)}
                          </label>
                          <a data-for={"soclose" + item.id} data-tip="1">
                            ...
                            <i
                              className="fa fa-chevron-down"
                              aria-hidden="true"
                            ></i>
                          </a>
                          <div>
                            {/* style={{ left: '14px !important',right: '14px !important'}} */}
                            <ReactTooltip
                              id={"soclose" + item.id}
                              getContent={(dataTip) => (
                                <div style={{ width: "284px" }}>
                                  <label>{item.delivery_address}</label>
                                </div>
                              )}
                              effect="solid"
                              delayHide={300}
                              delayShow={300}
                              delayUpdate={300}
                              place={"bottom"}
                              border={true}
                              type={"light"}
                              style={{ width: "25%;" }}
                            />
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <strong>Total Amount : </strong>
                          <a data-for={"totalAmt" + item.id} data-tip="1">
                            <lable>
                              {item.currancy == "INR" ? (
                                <i className="fa fa-inr"></i>
                              ) : (
                                <i className="fa fa-usd"></i>
                              )}
                              {Intl.NumberFormat().format(item.totalAmt)}
                            </lable>
                            &nbsp;&nbsp;
                            <i
                              className="fa fa-chevron-down"
                              aria-hidden="true"
                            ></i>
                          </a>

                          <ReactTooltip
                            id={"totalAmt" + item.id}
                            getContent={(dataTip) => (
                              <div style={{ width: "250px" }}>
                                <div className="row">
                                  <div className="col text-left">
                                    <strong>Subtotal</strong>
                                  </div>
                                  <div className="col">
                                    <lable>
                                      {item.currancy == "INR" ? (
                                        <i className="fa fa-inr"></i>
                                      ) : (
                                        <i className="fa fa-usd"></i>
                                      )}
                                      {Intl.NumberFormat().format(item.amount)}
                                    </lable>
                                  </div>
                                  <br></br>
                                </div>

                                <div className="row">
                                  <div className="col text-left">
                                    <strong>Shipping Charges</strong>
                                  </div>
                                  <div className="col">
                                    <lable>
                                      {item.currancy == "INR" ? (
                                        <i className="fa fa-inr"></i>
                                      ) : (
                                        <i className="fa fa-usd"></i>
                                      )}
                                      {Intl.NumberFormat().format(
                                        item.shipping_charge
                                      )}
                                    </lable>
                                  </div>
                                </div>
                                <hr></hr>

                                <div className="row">
                                  <div className="col text-left">
                                    <strong>Grand Total</strong>
                                  </div>
                                  <div className="col">
                                    <lable>
                                      {item.currancy == "INR" ? (
                                        <i className="fa fa-inr"></i>
                                      ) : (
                                        <i className="fa fa-usd"></i>
                                      )}
                                      {Intl.NumberFormat().format(
                                        item.totalAmt
                                      )}
                                    </lable>
                                  </div>
                                </div>
                              </div>
                            )}
                            effect="solid"
                            delayHide={300}
                            delayShow={300}
                            delayUpdate={300}
                            place={"bottom"}
                            border={true}
                            type={"light"}
                            style={{ width: "25%;" }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <strong>Placed : </strong>{" "}
                          <label>{item.placed}</label>
                          {item.toad_payment_done == "0" ?
                          item.payment_done == "0" ? (
                            <li>
                              <div className="radio-option paypal ">
                                <br></br>
                                <button
                                  type="button"
                                  name="payment-group"
                                  method="paytm"
                                  id="payment-1"
                                  className="btn btn-solid"
                                  onClick={this.handleClick.bind(null, {
                                    user: "",
                                    order_id: item.id,
                                    order_code: item.order_code,
                                    buyerid: item.buyerid,
                                    sellerid: item.sellerid,
                                    amount: item.totalAmt,
                                    discount_code: "NA",
                                    discounted_amount: item.totalAmt,
                                    has_coupon: "0",
                                    full_payment: "1",
                                    payment_type: "1",
                                    additional_detail_id: "0",
                                  })}
                                >
                                  Pay <i className="fa fa-inr"></i>{" "}
                                  {item.totalAmt} Now
                                </button>
                                {/* <br></br> */}
                              </div>
                              <div style={{ marginTop: "13px" }}>
                              {item.SellerWisePaymentId != "0" && (item.SellerWisePaymentId == '' || item.SellerWisePaymentId == null) ? (
                                <button
                                  className="btn btn-solid"
                                  onClick={this.getUploadFileData.bind(null, {
                                    b_order_code: item.order_code,
                                    b_amount_total: item.totalAmt,
                                    b_sellerid: item.sellerid,
                                    b_order_id: item.id,
                                  })}
                                >
                                  transfer to account
                                </button>
                                ) : (
                                  <button className="btn btn-solid">
                                    Pending For Approval
                                  </button>
                                )}
                              </div>
                            </li>
                          ) : (
                            <li>
                              <div className="payment_done">
                                <button
                                  type="button"
                                  name="payment_done"
                                  method="payment_done"
                                  id="payment_done"
                                  className="btn btn-solid"
                                >
                                  Payment done
                                </button>
                              </div>
                            </li>
                          ):''}
                        </div>
                      </div>
                    ) : (
                      // <div className="card">
                      //   <div className="card-body">
                      <div>
                        <div className="row p-3 mb-2 bg-light text-dark">
                          <div className="col-sm-4">
                            <strong>Order ID : </strong>{" "}
                            <label>
                              {"#" + item.id + "-" + item.order_code}
                            </label>
                          </div>
                          <div className="col-sm-2">
                            <strong>Ship To : </strong>
                            <label>
                              {item.delivery_address.substring(0, 8)}
                            </label>
                            <a data-for={"soclose" + item.id} data-tip="1">
                              ...
                              <i
                                className="fa fa-chevron-down"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <div>
                              {/* style={{ width: "250px !important" }} */}
                              <ReactTooltip
                                id={"soclose" + item.id}
                                getContent={(dataTip) => (
                                  <div style={{ width: "250px" }}>
                                    <label>{item.delivery_address}</label>
                                  </div>
                                )}
                                effect="solid"
                                delayHide={300}
                                delayShow={300}
                                delayUpdate={300}
                                place={"bottom"}
                                border={true}
                                type={"light"}
                                style={{ width: "25px" }}
                              />
                            </div>
                          </div>
                          <div className="col-sm-3 text-right ">
                            <strong>Total Amount : </strong>
                            <a data-for={"totalAmt" + item.id} data-tip="1">
                              <lable>
                                {item.currancy == "INR" ? (
                                  <i className="fa fa-inr"></i>
                                ) : (
                                  <i className="fa fa-usd"></i>
                                )}
                                {Intl.NumberFormat().format(item.totalAmt)}
                              </lable>
                              &nbsp;&nbsp;
                              <i
                                className="fa fa-chevron-down"
                                aria-hidden="true"
                              ></i>
                            </a>

                            <ReactTooltip
                              id={"totalAmt" + item.id}
                              getContent={(dataTip) => (
                                <div style={{ width: "250px" }}>
                                  <div className="row">
                                    <div className="col-lg-7 text-left">
                                      <strong>Subtotal</strong>
                                    </div>
                                    <div className="col-md-5">
                                      <lable>
                                        {item.currancy == "INR" ? (
                                          <i className="fa fa-inr"></i>
                                        ) : (
                                          <i className="fa fa-usd"></i>
                                        )}
                                        {Intl.NumberFormat().format(
                                          item.amount
                                        )}
                                      </lable>
                                    </div>
                                    <br></br>
                                  </div>

                                  <div className="row">
                                    <div className="col-lg-7 text-left">
                                      <strong>Shipping Charges</strong>
                                    </div>
                                    <div className="col-md-5">
                                      <lable>
                                        {item.currancy == "INR" ? (
                                          <i className="fa fa-inr"></i>
                                        ) : (
                                          <i className="fa fa-usd"></i>
                                        )}
                                        {Intl.NumberFormat().format(
                                          item.shipping_charge
                                        )}
                                      </lable>
                                    </div>
                                  </div>
                                  <hr></hr>

                                  <div className="row">
                                    <div className="col-lg-7 text-left">
                                      <strong>Grand Total</strong>
                                    </div>
                                    <div className="col-md-5">
                                      <lable>
                                        {item.currancy == "INR" ? (
                                          <i className="fa fa-inr"></i>
                                        ) : (
                                          <i className="fa fa-usd"></i>
                                        )}
                                        {Intl.NumberFormat().format(
                                          item.totalAmt
                                        )}
                                      </lable>
                                    </div>
                                  </div>
                                </div>
                              )}
                              effect="solid"
                              delayHide={300}
                              delayShow={300}
                              delayUpdate={300}
                              place={"bottom"}
                              border={true}
                              type={"light"}
                              style={{ width: "25%;" }}
                            />
                            <br></br>
                            {item.toad_payment_done == "0" ?
                            item.payment_done == "0" ? (
                              <li>
                                <div className="radio-option paypal ">
                                  <br></br>
                                  <button
                                    type="button"
                                    name="payment-group"
                                    method="paytm"
                                    id="payment-1"
                                    className="btn btn-solid"
                                    onClick={this.handleClick.bind(null, {
                                      user: "",
                                      order_id: item.id,
                                      order_code: item.order_code,
                                      buyerid: item.buyerid,
                                      sellerid: item.sellerid,
                                      amount: item.totalAmt,
                                      discount_code: "NA",
                                      discounted_amount: item.totalAmt,
                                      has_coupon: "0",
                                      full_payment: "1",
                                      payment_type: "1",
                                      additional_detail_id: "0",
                                    })}
                                  >
                                    Pay <i className="fa fa-inr"></i>{" "}
                                    {item.totalAmt} Now
                                  </button>
                                </div>
                              </li>
                            ) : (
                              ""
                            ):""}
                          </div>
                          <div className="col-sm-3 text-right">
                            <strong>Placed : </strong>{" "}
                            <label>{item.placed}</label>
                            <br></br>
                            {item.toad_payment_done == "0" ?
                            item.payment_done == "0" ? (
                              <li>
                                <div style={{ marginTop: "13px" }}>
                                {item.SellerWisePaymentId != "0" && (item.SellerWisePaymentId == '' || item.SellerWisePaymentId == null) ?  (
                                  <button
                                    className="btn btn-solid"
                                    onClick={this.getUploadFileData.bind(null, {
                                      b_order_code: item.order_code,
                                      b_amount_total: item.totalAmt,
                                      b_sellerid: item.sellerid,
                                      b_order_id: item.id,
                                    })}
                                  >
                                    transfer to account
                                  </button>
                                  ) : (
                                    <button className="btn btn-solid">
                                      Pending For Approval
                                    </button>
                                  )}
                                </div>
                              </li>
                            ) : (
                              <li>
                                <div className="payment_done">
                                  <button
                                    type="button"
                                    name="payment_done"
                                    method="payment_done"
                                    id="payment_done"
                                    className="btn btn-solid"
                                  >
                                    Payment done
                                  </button>
                                </div>
                              </li>
                            ):""}
                          </div>
                        </div>
                        {/* </div>
                      </div> */}
                      </div>
                    )}

                    {this.state.sellerWiseData.map((item3, index) => {
                      return item.id == item3.id ? (
                        <div>
                          {/* {console.log(
                            "---------2222---------",
                            item.id,
                            item3.id
                          )} */}
                          <div className="card">
                            <div className="card-body">
                              {isMobile ? (
                                <div>
                                  <div className="row">
                                    <div className="col-sm-3">
                                      <strong
                                        style={{ backgroundColor: "#FB9944" }}
                                        className="p-2 mb-1 text-white"
                                      >
                                        SHIPMENT {item3.row_number} of{" "}
                                        {item3.shipment}
                                      </strong>
                                      <br></br>
                                    </div>
                                    <div
                                      className="col-sm-3"
                                      style={{ marginTop: "12px" }}
                                    >
                                      <strong>Tracking No : </strong>
                                      <label>{"#" + item3.trakingId}</label>
                                    </div>

                                    <div className="col-sm-3">
                                      <strong>Seller Name : </strong>
                                      <lable>{item3.seller_name}</lable>
                                    </div>

                                    <div className="col-sm-3">
                                      <strong>Courier Name : </strong>
                                      {item3.logistic_vendor
                                        ? item3.logistic_vendor
                                        : "Not Assigned"}
                                    </div>
                                  </div>
                                  {/* <br></br> */}
                                  <div className="row">
                                    {/* <div className="col-sm-2"></div>
                                    <div className="col-lg-9"> */}
                                    {/* <progress id="progressbar" value="25" max="100"></progress> */}
                                    {/* <ProgressBar
                                        percent={item3.status}
                                        filledBackground="linear-gradient(to right, #FB9944, #FB9944)"
                                      >
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                      </ProgressBar> */}
                                    {/* <br></br> */}
                                    {/* </div> */}
                                    {/* <div className="col-sm-1">
                                     
                                    </div> */}
                                    <div className="col-lg-12">
                                      <strong>Status - </strong>{" "}
                                      <label>
                                        {item3.current_order_status}
                                      </label>
                                      <div
                                        style={{
                                          marginLeft: "13px",
                                          marginTop: "-21px",
                                        }}
                                      >
                                        <progress
                                          id="progressbar"
                                          value={item3.status}
                                          max="100"
                                          style={{
                                            width: "136px",
                                            marginBottom: "-11px",
                                            marginLeft: "-16px",
                                          }}
                                        ></progress>
                                        <div>
                                          <lable>
                                            Placed : {item3.placed_date}
                                          </lable>
                                        </div>
                                        <br></br>
                                        <div>
                                          <lable>
                                            Packed : {item3.packed_date}
                                          </lable>
                                        </div>
                                        <br></br>
                                        <div>
                                          <lable>
                                            Shipped : {item3.shipped_date}
                                          </lable>
                                        </div>
                                        <br></br>
                                        <div>
                                          <lable>
                                            Deliverd : {item3.delivered_date}
                                          </lable>
                                        </div>
                                        {/* </div> */}

                                        <br></br>
                                        {item3.airway_bill_no &&
                                        item3.airway_bill_no != "0" ? (
                                          item3.logistic_vendor ==
                                          "Delhivery" ? (
                                            <a
                                              className="btn btn-solid"
                                              target="_blank"
                                              href={
                                                "https://www.delhivery.com/track/package/" +
                                                item3.airway_bill_no
                                              }
                                            >
                                              Track
                                            </a>
                                          ) : (
                                            <a
                                              className="btn btn-solid"
                                              target="_blank"
                                              href={
                                                "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=" +
                                                item3.airway_bill_no +
                                                "&cntry_code=in&locale=en_US"
                                              }
                                            >
                                              Track
                                            </a>
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="row">
                                    <div className="col-sm-3">
                                      <strong
                                        style={{ backgroundColor: "#FB9944" }}
                                        className="p-2 mb-1 text-white"
                                      >
                                        SHIPMENT {item3.row_number} of{" "}
                                        {item3.shipment}
                                      </strong>
                                    </div>
                                    <div className="col-sm-3">
                                      <strong>Tracking No : </strong>
                                      <label>{"#" + item3.trakingId}</label>
                                    </div>

                                    <div className="col-sm-3">
                                      <strong>Seller Name : </strong>
                                      <lable>{item3.seller_name}</lable>
                                    </div>

                                    <div className="col-sm-3 text-right">
                                      <strong>Courier Name : </strong>
                                      {item3.logistic_vendor
                                        ? item3.logistic_vendor
                                        : "Not Assigned"}
                                    </div>
                                  </div>
                                  <br></br>
                                  <div className="row">
                                    <div className="col-sm-1"></div>
                                    <div className="col-lg-10">
                                      <ProgressBar
                                        percent={item3.status}
                                        filledBackground="linear-gradient(to right, #FB9944, #FB9944)"
                                      >
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                        <Step>
                                          {({ accomplished, index }) => (
                                            <div
                                              className={`indexedStep ${
                                                accomplished
                                                  ? "accomplished"
                                                  : null
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                        </Step>
                                      </ProgressBar>
                                      <br></br>
                                    </div>
                                    <div className="col-sm-1"></div>

                                    <div className="col-sm-3 text-center">
                                      <lable>
                                        Placed : {item3.placed_date}
                                      </lable>
                                    </div>
                                    <div className="col-sm-3 text-center">
                                      <lable>
                                        Packed : {item3.packed_date}
                                      </lable>
                                    </div>
                                    <div className="col-sm-3 text-center">
                                      <lable>
                                        Shipped : {item3.shipped_date}
                                      </lable>
                                    </div>
                                    <div className="col-sm-3 text-center">
                                      <lable>
                                        Deliverd : {item3.delivered_date}
                                      </lable>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-12">
                                      <strong>Status - </strong>{" "}
                                      <lable>
                                        {item3.current_order_status}
                                      </lable>
                                    </div>
                                    <div className="col-lg-12">
                                      {item3.airway_bill_no &&
                                      item3.airway_bill_no != "0" ? (
                                        item3.logistic_vendor == "Delhivery" ? (
                                          <a
                                            className="btn btn-solid"
                                            target="_blank"
                                            href={
                                              "https://www.delhivery.com/track/package/" +
                                              item3.airway_bill_no
                                            }
                                          >
                                            Track
                                          </a>
                                        ) : (
                                          <a
                                            className="btn btn-solid"
                                            target="_blank"
                                            href={
                                              "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=" +
                                              item3.airway_bill_no +
                                              "&cntry_code=in&locale=en_US"
                                            }
                                          >
                                            Track
                                          </a>
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="row">
                                <div className="col-lg-12">
                                  <br></br>
                                  <table
                                    id="table"
                                    className="table cart-table table-responsive-xs"
                                    style={{ tableLayout: "fixed" }}
                                  >
                                    <tbody>
                                      {this.state.detailsorder.map(
                                        (item1, index) => {
                                          return item3.id == item1.orderid &&
                                            item3.sellerid == item1.sellerid ? (
                                            <tr
                                              className={
                                                isMobile ? "d-flex" : ""
                                              }
                                            >
                                              <td className="p-3 mb-2 bg-light text-dark">
                                                <div className="row">
                                                  <div className="col-sm-3">
                                                    <a
                                                      target="_blank"
                                                      href={`${process.env.PUBLIC_URL}/product/${item1.url}.html`}
                                                    >
                                                      <img
                                                        src={`${imgUrl}/product_images_thumb/${item1.productImg}`}
                                                        alt="on Beldara.com"
                                                        style={{
                                                          height: "90px",
                                                        }}
                                                      />
                                                    </a>
                                                  </div>

                                                  <div className="col-md-9">
                                                    <div>
                                                      <strong>
                                                        Product Name :
                                                      </strong>{" "}
                                                      <a
                                                        target="_blank"
                                                        href={`${process.env.PUBLIC_URL}/product/${item1.url}.html`}
                                                      >
                                                        <lable>
                                                          {item1.name}
                                                        </lable>
                                                      </a>
                                                    </div>

                                                    <div>
                                                      <strong>Qty :</strong>{" "}
                                                      <lable>
                                                        {item1.qty} {item1.unit}
                                                      </lable>
                                                    </div>

                                                    <div>
                                                      <strong>Amount :</strong>{" "}
                                                      <lable>
                                                        {item.currancy ==
                                                        "INR" ? (
                                                          <i className="fa fa-inr"></i>
                                                        ) : (
                                                          <i className="fa fa-usd"></i>
                                                        )}
                                                        {Intl.NumberFormat().format(
                                                          item1.price
                                                        )}
                                                      </lable>
                                                    </div>

                                                    <div>
                                                      <strong>
                                                        Total Amount :
                                                      </strong>{" "}
                                                      <lable>
                                                        {item.currancy ==
                                                        "INR" ? (
                                                          <i className="fa fa-inr"></i>
                                                        ) : (
                                                          <i className="fa fa-usd"></i>
                                                        )}
                                                        {Intl.NumberFormat().format(
                                                          item1.amount
                                                        )}
                                                      </lable>
                                                    </div>

                                                    {item1.iscancled == "1" ? (
                                                      <div
                                                        className="text-right"
                                                        style={{ color: "red" }}
                                                      >
                                                        Product Cancelled
                                                      </div>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          ) : (
                                            ""
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="row">
                                {isMobile ? (
                                  <div>
                                    <div className="col-lg-12 text-left">
                                      {item3.payment_done == "0" ? (
                                        <li>
                                          <div className="radio-option paypal">
                                            <button
                                              type="button"
                                              name="payment-group"
                                              method="paytm"
                                              id="payment-1"
                                              className="btn btn-solid"
                                              onClick={this.handleClick.bind(
                                                null,
                                                {
                                                  user: "",
                                                  order_id: item3.id,
                                                  order_code: item3.order_code,
                                                  buyerid: item3.buyerid,
                                                  sellerid: item3.sellerid,
                                                  amount: item3.totalAmt,
                                                  discount_code: "NA",
                                                  discounted_amount:
                                                    item3.totalAmt,
                                                  has_coupon: "0",
                                                  full_payment: "0",
                                                  payment_type: "2",
                                                  additional_detail_id:
                                                    item3.additional_detail_id,
                                                }
                                              )}
                                            >
                                              Pay <i className="fa fa-inr"></i>
                                              {item3.totalAmt} Now
                                            </button>
                                          </div>
                                        </li>
                                      ) : (
                                        <li>
                                          <div className="payment_done">
                                            <button
                                              type="button"
                                              name="payment_done"
                                              method="payment_done"
                                              id="payment_done"
                                              className="btn btn-solid"
                                            >
                                              Payment done
                                            </button>
                                          </div>
                                        </li>
                                      )}
                                    </div>
                                    <br></br>
                                    <div className="col-lg-12 text-left">
                                      {item3.payment_done == "0" ? (
                                        item3.SellerWisePaymentId !=
                                        item3.sellerid ? (
                                          <button
                                            className="btn btn-solid"
                                            onClick={this.getUploadFileData.bind(
                                              null,
                                              {
                                                b_order_code: item3.order_code,
                                                b_amount_total: item3.totalAmt,
                                                b_sellerid: item3.sellerid,
                                                b_order_id: item3.id,
                                              }
                                            )}
                                          >
                                            transfer to account
                                          </button>
                                        ) : (
                                          <button className="btn btn-solid">
                                            Pending For Approval
                                          </button>
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="col text-right">
                                    {item3.payment_done == "0" ? (
                                      <li>
                                        <div className="radio-option paypal">
                                          <button
                                            type="button"
                                            name="payment-group"
                                            method="paytm"
                                            id="payment-1"
                                            className="btn btn-solid"
                                            onClick={this.handleClick.bind(
                                              null,
                                              {
                                                user: "",
                                                order_id: item3.id,
                                                order_code: item3.order_code,
                                                buyerid: item3.buyerid,
                                                sellerid: item3.sellerid,
                                                amount: item3.totalAmt,
                                                discount_code: "NA",
                                                discounted_amount:
                                                  item3.totalAmt,
                                                has_coupon: "0",
                                                full_payment: "0",
                                                payment_type: "2",
                                                additional_detail_id:
                                                  item3.additional_detail_id,
                                              }
                                            )}
                                          >
                                            Pay <i className="fa fa-inr"></i>
                                            {item3.totalAmt} Now
                                          </button>
                                          &nbsp;&nbsp;
                                          {item3.SellerWisePaymentId !=
                                          item3.sellerid ? (
                                            <button
                                              className="btn btn-solid"
                                              onClick={this.getUploadFileData.bind(
                                                null,
                                                {
                                                  b_order_code:
                                                    item3.order_code,
                                                  b_amount_total:
                                                    item3.totalAmt,
                                                  b_sellerid: item3.sellerid,
                                                  b_order_id: item3.id,
                                                }
                                              )}
                                            >
                                              transfer to account
                                            </button>
                                          ) : (
                                            <button className="btn btn-solid">
                                              Pending For Approval
                                            </button>
                                          )}
                                        </div>
                                      </li>
                                    ) : (
                                      <li>
                                        <div className="payment_done">
                                          <button
                                            type="button"
                                            name="payment_done"
                                            method="payment_done"
                                            id="payment_done"
                                            className="btn btn-solid"
                                          >
                                            Payment done
                                          </button>
                                        </div>
                                      </li>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <br></br>
                        </div>
                      ) : (
                        ""
                      );
                    })}
                    <br></br>
                    <HRLine color="#0e0e0e" />
                    <br></br>
                  </React.Fragment>
                );
              })}
              <br></br>
              {/* <button
                className="btn btn-solid"
                value="5"
                onClick={this.fetchMoreDataDemo}
              >
                View More
              </button> */}
              <Paytm
                user={this.state.user}
                order_id={this.state.order_id}
                order_code={this.state.order_code}
                buyerid={this.state.buyerid}
                sellerid={this.state.buyerid}
                amount={this.state.amount}
                discount_code={this.state.discount_code}
                discounted_amount={this.state.discounted_amount}
                has_coupon={this.state.has_coupon}
                full_payment={this.state.full_payment}
                payment_type={this.state.payment_type}
                additional_detail_id={this.state.additional_detail_id}
              />
            </div>
          ) : (
            <div>
              <br></br>
              <div class="col-sm-12 empty-cart-cls text-center">
                <img
                  src="/assets/images/icon-empty-cart.png"
                  class="img-fluid mb-4"
                  alt=""
                ></img>
                <h3>
                  <strong>No orders found</strong>
                </h3>
                {/* <h4>Explore more shortlist some items.</h4> */}
              </div>
            </div>
          )}
          {this.state.openTransferModal &&
            (isMobile ? (
              <Modal
                show={this.state.openTransferModal}
                style={{ left: "0%", top: "12%" }}
              >
                <Modal.Header>
                  <Modal.Title></Modal.Title>
                  <div class="col-12">
                    <h5 className="text-left">
                      <strong>Transfer To Account</strong>
                    </h5>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <br></br>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-lg-10">
                      <div
                        class="alert alert-info d-none msg_"
                        id="msg_"
                        role="alert"
                      ></div>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <div className="row">
                    <div className="col text-center">
                      <strong>Name : </strong>
                      <label>{this.state.name}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <strong>Bank Name : </strong>
                      <label>{this.state.beneficiary_bank}</label>
                    </div>
                    <div className="col left-right">
                      <strong>Branch Name : </strong>
                      <label>{this.state.beneficiary_address}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <strong>Account No. : </strong>
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {this.state.acc_number}
                      </label>
                    </div>
                    <div className="col left-right">
                      <strong>IFCI Code : </strong>
                      <label>{this.state.bank_swift_code}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-lg-10">
                      <div class="has-float-label ">
                        <input
                          id="transaction_no"
                          type="text"
                          placeholder=" "
                          name="transaction_no"
                          class="form-control"
                        />
                        <label for="transaction_no">
                          Please enter transaction number
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-lg-10">
                      <div class="has-float-label ">
                        <input
                          id="transaction_file"
                          type="file"
                          placeholder=" "
                          name="transaction_file"
                          class="form-control"
                        />
                        <label for="transaction_file">
                          Please upload transaction file
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <br></br>
                </Modal.Body>
                <Modal.Footer className="text-right">
                  <div class="col-12">
                    <button
                      className="btn btn-solid"
                      onClick={() =>
                        this.setState({
                          openTransferModal: !this.state.openTransferModal,
                        })
                      }
                    >
                      Cancel
                    </button>
                    &nbsp;&nbsp;
                    <button
                      id="UploadFileTrasfer_"
                      className="btn btn-solid"
                      onClick={this.UploadFileTrasfer}
                    >
                      Submit
                    </button>
                  </div>
                </Modal.Footer>
              </Modal>
            ) : (
              <Modal
                show={this.state.openTransferModal}
                style={{ left: "32%", top: "25%" }}
              >
                <Modal.Header>
                  <Modal.Title></Modal.Title>
                  <div class="col-12">
                    <h5 className="text-left">
                      <strong>Transfer To Account</strong>
                    </h5>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <br></br>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-lg-10">
                      <div
                        class="alert alert-info d-none msg_"
                        id="msg_"
                        role="alert"
                      ></div>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <div className="row">
                    <div className="col text-center">
                      <strong>Name : </strong>
                      <label>{this.state.name}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <strong>Bank Name : </strong>
                      <label>{this.state.beneficiary_bank}</label>
                    </div>
                    <div className="col left-right">
                      <strong>Branch Name : </strong>
                      <label>{this.state.beneficiary_address}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <strong>Account No. : </strong>
                      <label>{this.state.acc_number}</label>
                    </div>
                    <div className="col left-right">
                      <strong>IFCI Code : </strong>
                      <label>{this.state.bank_swift_code}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-lg-10">
                      <div class="has-float-label ">
                        <input
                          id="transaction_no"
                          type="number"
                          placeholder=" "
                          name="transaction_no"
                          class="form-control"
                        />
                        <label for="transaction_no">
                          Please enter transaction number
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-lg-10">
                      <div class="has-float-label ">
                        <input
                          id="transaction_file"
                          type="file"
                          placeholder=" "
                          name="transaction_file"
                          class="form-control"
                        />
                        <label for="transaction_file">
                          Please upload transaction file
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <br></br>
                </Modal.Body>
                <Modal.Footer className="text-right">
                  <div class="col-12">
                    <button
                      className="btn btn-solid"
                      onClick={() =>
                        this.setState({
                          openTransferModal: !this.state.openTransferModal,
                        })
                      }
                    >
                      Cancel
                    </button>
                    &nbsp;&nbsp;
                    <button
                      id="UploadFileTrasfer_"
                      className="btn btn-solid"
                      onClick={this.UploadFileTrasfer}
                    >
                      Submit
                    </button>
                  </div>
                </Modal.Footer>
              </Modal>
            ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  languageMaster: state.languageMaster.languageMaster,
});

export default connect(mapStateToProps)(myOrder);