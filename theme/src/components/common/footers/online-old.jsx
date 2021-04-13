import React, { Component, Suspense, lazy } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import $ from "jquery";
import ls from "local-storage";
import axios from "axios";
import IntlTelInput from "react-intl-tel-input";
import { getCookie, setCookie } from "../../../functions";
import { isMobile, isAndroid } from "react-device-detect";
const ChatBox = lazy(() => import("../../live-chat/chatbox"));
var type, number, isoValue, dialCode, countryName;
class Online extends Component {
 constructor(props) {
 super(props);
 this.state = {
 onlinestep1: true,
 onlinestep2: false,
 step1: false,
 };
 this.validator = new SimpleReactValidator();
 }

 ChatHere = async () => {
 this.setState({
 onlinestep1: false,
 onlinestep2: true,
 step1: true,
 });
 };

 setStateFromInput = async (event) => {
 var obj = {};
 obj[event.target.name] = event.target.value;
 await this.setState(obj);
 };

 onChange = (err, no, data) => {
 type = err;
 number = no;
 this.setState({
 contact: number,
 contactError: type,
 isoValue: data.iso2,
 });
 isoValue = data.iso2;
 dialCode = data.dialCode;
 countryName = data.name.replace(/ *\([^)]*\) */g, "");
 };

 contactSubmit = (e) => {
 e.preventDefault();
 $("#submit_success_spinner").removeClass("d-none");
 $("#msg").empty();
 $("#msg").addClass("d-none");
 if (this.validator.allValid()) {
 if (type) {
 axios
 .post(
 "https://api.indiabigshop.com/common/call_back_request.php",
 {
 security_token: "",
 plateform_type: "",
 type: "CallBackRequest",
 sellerid: ls.get("sellerid"),
 mobileNo: this.state.contact,
 country_code: this.state.isoValue,
 },
 { headers: { "Content-Type": "multipart/form-data" } }
 )
 .then((response) => {
 if (response.data.status === "Failed") {
 $("#msg")
 .addClass("alert alert-danger")
 .removeClass("d-none");
 $("#msg").append("something went wrong please try again later.");
 $("#submit_success_spinner").addClass("d-none");
 setTimeout(function() {
 $("#msg").empty();
 $("#msg").addClass("d-none");
 $("#contact").val("");
 $("#collapseThree").removeClass("show");
 $("#collapseOne").removeClass("show");
 }, 3000);
 } else {
 $("#msg")
 .addClass("alert alert-success")
 .removeClass("d-none");
 $("#msg").append(
 "Your request is submitted. We will call you shortly."
 );
 $("#submit_success_spinner").addClass("d-none");
 setTimeout(function() {
 $("#msg").empty();
 $("#msg").addClass("d-none");
 $("#contact").val("");
 $("#collapseThree").removeClass("show");
 $("#collapseOne").removeClass("show");
 }, 3000);
 }
 })
 .catch((error) => {
 const result = error.response;
 return Promise.reject(result);
 });
 } else {
 $("#msg")
 .addClass("alert alert-info")
 .removeClass("d-none");
 $("#msg").append("Please enter valid number.");
 $("#submit_success_spinner").addClass("d-none");
 }
 } else {
 $("#msg")
 .addClass("alert alert-info")
 .removeClass("d-none");
 $("#msg").append("Enter your contact number.");
 $("#submit_success_spinner").addClass("d-none");
 setTimeout(function() {
 $("#msg").empty();
 $("#msg").addClass("d-none");
 $("#contact").val("");
 $("#collapseThree").removeClass("show");
 $("#collapseOne").removeClass("show");
 }, 3000);
 }
 };

 render() {
 const InputPropsMobile = {
 required: true,
 placeholder: "Please enter your contact number.",
 name: "mobile",
 type: "tel",
 };
 return (
 <div>
 {this.state.onlinestep1 ? (
 <React.Fragment>
 {isMobile ? (
 
 <div
 className="accordion pull-right"
 id="accordionExample"
 style={{
 //width: "100%",
 //marginLeft: "960px",
 bottom: "60px",
 position: "fixed",
 overflowY: "scroll",
 overflowX: "hidden",
 }}
 >
 <div className="card">
 <div
 className="card-header"
 id="headingOne"
 data-toggle="collapse"
 data-target="#collapseOne"
 aria-expanded="true"
 aria-controls="collapseOne"
 style={{ backgroundColor: "#FB9944", padding: "3px" }}
 >
 <h2 className="mb-0 justify-content-end">
 <button
 className="btn btn-link"
 type="button"
 style={{ color: "#fff" }}
 >
 Online
 </button>
 {/* <i class="fa fa-comment" aria-hidden="true" style={{ color: "#fff" }}></i> */}
 </h2>
 </div>

 <div
 id="collapseOne"
 className="collapse"
 aria-labelledby="headingOne"
 data-parent="#accordionExample"
 >
 <div className="card-body">
 <div
 className="alert alert-success"
 role="alert"
 style={{ backgroundColor: "#FB9944" }}
 >
 Please tell us your preferred way to connect. Use
 whatsapp to get fast response.
 </div>
 <div id="accordion">
 <div className="card">
 <div
 className="card-header chatn"
 id="headingOne"
 data-toggle="collapse"
 data-target="#collapseOne1"
 aria-expanded="true"
 aria-controls="collapseOne"
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button
 className="btn btn-link"
 style={{ width: "100%;" }}
 >
 <i
 className="fa fa-whatsapp"
 aria-hidden="true"
 style={{ color: "green" }}
 ></i>{" "}
 WhatsApp
 </button>
 </h5>
 </div>

 <div
 id="collapseOne1"
 className="collapse"
 aria-labelledby="headingOne"
 data-parent="#accordion"
 >
 <div className="card-body">
 <div className="text-center">
 <i
 className="fa fa-comments-o"
 aria-hidden="true"
 ></i>{" "}
 <a
 href="
 https://web.whatsapp.com/send?phone=+1-913-289-0433&text=Hi,%20I%20was%20looking%20on%20your%20website"
 target="_blank"
 >
 Chat on Whatsapp Web
 </a>
 <br></br>
 </div>
 <div className="text-center">Or</div>
 <div className="text-center">
 Whatsapp on +1-913-289-0433
 </div>
 </div>
 </div>
 </div>
 <div className="card">
 <div
 className="card-header"
 id="headingTwo"
 data-toggle="collapse"
 data-target="#collapseTwo"
 aria-expanded="false"
 aria-controls="collapseTwo"
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button className="btn btn-link collapsed">
 <i className="fa fa-phone" aria-hidden="true"></i>{" "}
 Call Us
 </button>
 </h5>
 </div>
 <div
 id="collapseTwo"
 className="collapse"
 aria-labelledby="headingTwo"
 data-parent="#accordion"
 >
 <div className="card-body">
 <div className="text-center">
 {getCookie("country_code") == "in" ||
 getCookie("country_code") == "IN"
 ? "Call us on +91-9667682100"
 : "Call us on +1-913-289-0433"}
 </div>
 </div>
 </div>
 </div>
 <div className="card">
 <div
 className="card-header"
 id="headingThree"
 data-toggle="collapse"
 data-target="#collapseThree"
 aria-expanded="false"
 aria-controls="collapseThree"
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button className="btn btn-link collapsed">
 <i className="fa fa-user" aria-hidden="true"></i>{" "}
 Call Back Request
 </button>
 </h5>
 </div>
 <div
 id="collapseThree"
 className="collapse"
 aria-labelledby="headingThree"
 data-parent="#accordion"
 >
 <div className="card-body" style={{height: "170px", overflowY: "auto"}}>
 <div className="text-center">
 We shall call you shortly.
 </div>
 <br></br>
 <div
 className="alert alert-info d-none"
 role="alert"
 id="msg"
 ></div>
 <form
 className="form-signin"
 onSubmit={this.contactSubmit}
 >
 <div className="has-float-label ">
 <IntlTelInput
 containerClassName="intl-tel-input"
 inputClassName="form-control"
 fieldId="contact"
 geoIpLookup="true"
 numberType="MOBILE"
 autoPlaceholder="true"
 onPhoneNumberChange={this.onChange}
 onPhoneNumberBlur={this.change}
 defaultCountry={`${
 getCookie("country_code")
 ? getCookie(
 "country_code"
 ).toLowerCase()
 : "in"
 }`}
 numberType="MOBILE"
 telInputProps={InputPropsMobile}
 />
 <label htmlFor="contact">
 {"Please enter your contact number."}
 </label>
 </div>

 <br></br>
 <div className="text-center">
 <button className="btn btn-solid" type="submit">
 <div
 className="spinner-border text-dark d-none"
 id="submit_success_spinner"
 role="status"
 style={{ width: "1rem", height: "1rem" }}
 >
 <span className="sr-only">Loading...</span>
 </div>
 &nbsp; Submit
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>

 <div className="card">
 <div
 className="card-header"
 id="headingfour"
 onClick={this.ChatHere}
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button className="btn btn-link">
 <i
 className="fa fa-comments"
 aria-hidden="true"
 ></i>{" "}
 Chat Now
 </button>
 </h5>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div
 className="accordion"
 id="accordionExample"
 style={{
 width: "25%",
 marginLeft: "960px",
 bottom: "0px",
 position: "fixed",
 overflowY: "scroll",
 overflowX: "hidden",
 }}
 >
 <div className="card">
 <div
 className="card-header"
 id="headingOne"
 data-toggle="collapse"
 data-target="#collapseOne"
 aria-expanded="true"
 aria-controls="collapseOne"
 style={{ backgroundColor: "#FB9944", padding: "3px" }}
 >
 <h2 className="mb-0">
 <button
 className="btn btn-link"
 type="button"
 style={{ color: "#fff" }}
 >
 Online
 </button>
 </h2>
 </div>

 <div
 id="collapseOne"
 className="collapse"
 aria-labelledby="headingOne"
 data-parent="#accordionExample"
 >
 <div className="card-body" style={{height: "40px"}}>
 <div
 className="alert alert-success"
 role="alert"
 style={{ backgroundColor: "#FB9944" }}
 >
 Please tell us your preferred way to connect. Use
 whatsapp to get fast response.
 </div>
 <div id="accordion">
 <div className="card">
 <div
 className="card-header chatn"
 id="headingOne"
 data-toggle="collapse"
 data-target="#collapseOne1"
 aria-expanded="true"
 aria-controls="collapseOne"
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button
 className="btn btn-link"
 style={{ width: "100%" }}
 >
 <i
 className="fa fa-whatsapp"
 aria-hidden="true"
 style={{ color: "green" }}
 ></i>{" "}
 WhatsApp
 </button>
 </h5>
 </div>

 <div
 id="collapseOne1"
 className="collapse"
 aria-labelledby="headingOne"
 data-parent="#accordion"
 >
 <div className="card-body">
 <div className="text-center">
 <i
 className="fa fa-comments-o"
 aria-hidden="true"
 ></i>{" "}
 <a
 href="
 https://web.whatsapp.com/send?phone=+1-913-289-0433&text=Hi,%20I%20was%20looking%20on%20your%20website"
 target="_blank"
 >
 Chat on Whatsapp Web
 </a>
 <br></br>
 </div>
 <div className="text-center">Or</div>
 <div className="text-center">
 Whatsapp on +1-913-289-0433
 </div>
 </div>
 </div>
 </div>
 <div className="card">
 <div
 className="card-header"
 id="headingTwo"
 data-toggle="collapse"
 data-target="#collapseTwo"
 aria-expanded="false"
 aria-controls="collapseTwo"
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button className="btn btn-link collapsed">
 <i className="fa fa-phone" aria-hidden="true"></i>{" "}
 Call Us
 </button>
 </h5>
 </div>
 <div
 id="collapseTwo"
 className="collapse"
 aria-labelledby="headingTwo"
 data-parent="#accordion"
 >
 <div className="card-body">
 <div className="text-center">
 {getCookie("country_code") == "in" ||
 getCookie("country_code") == "IN"
 ? "Call us on +91-9667682100"
 : "Call us on +1-913-289-0433"}
 </div>
 </div>
 </div>
 </div>
 <div className="card">
 <div
 className="card-header"
 id="headingThree"
 data-toggle="collapse"
 data-target="#collapseThree"
 aria-expanded="false"
 aria-controls="collapseThree"
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button className="btn btn-link collapsed">
 <i className="fa fa-user" aria-hidden="true"></i>{" "}
 Call Back Request
 </button>
 </h5>
 </div>
 <div
 id="collapseThree"
 className="collapse"
 aria-labelledby="headingThree"
 data-parent="#accordion"
 >
 <div className="card-body" style={{height: "148px",overflowY: "auto"}}>
 <div className="text-center">
 We shall call you shortly.
 </div>
 <br></br>
 <div
 className="alert alert-info d-none"
 role="alert"
 id="msg"
 ></div>
 <form
 className="form-signin"
 onSubmit={this.contactSubmit}
 >
 <div className="has-float-label ">
 <IntlTelInput
 containerClassName="intl-tel-input"
 inputClassName="form-control"
 fieldId="contact"
 geoIpLookup="true"
 numberType="MOBILE"
 autoPlaceholder="true"
 onPhoneNumberChange={this.onChange}
 onPhoneNumberBlur={this.change}
 defaultCountry={`${
 getCookie("country_code")
 ? getCookie(
 "country_code"
 ).toLowerCase()
 : "in"
 }`}
 numberType="MOBILE"
 telInputProps={InputPropsMobile}
 />
 <label htmlFor="contact">
 {"Please enter your contact number."}
 </label>
 </div>

 <br></br>
 <div className="text-center">
 <button className="btn btn-solid" type="submit">
 <div
 className="spinner-border text-dark d-none"
 id="submit_success_spinner"
 role="status"
 style={{ width: "1rem", height: "1rem" }}
 >
 <span className="sr-only">Loading...</span>
 </div>
 &nbsp; Submit
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>

 <div className="card">
 <div
 className="card-header"
 id="headingfour"
 onClick={this.ChatHere}
 style={{ padding: "3px" }}
 >
 <h5 className="mb-0">
 <button className="btn btn-link">
 <i
 className="fa fa-comments"
 aria-hidden="true"
 ></i>{" "}
 Chat Now
 </button>
 </h5>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}
 </React.Fragment>
 ) : (
 <Suspense loading={""}>
 <ChatBox
 chatWithSupplier={
 this.props.chat.chatToSeller.length > 0
 ? this.props.chat.chatToSeller
 : false
 }
 />
 </Suspense>
 )}
 </div>
 );
 }
}

const mapStateToProps = (state) => {
 return state;
};

export default withTranslate(connect(mapStateToProps)(Online));