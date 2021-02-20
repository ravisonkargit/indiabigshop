import React, { Component, Suspense } from "react";
import "./login.css";
import $ from "jquery";
import axios from "axios";
import ls from "local-storage";
import SimpleReactValidator from "simple-react-validator";
import { setCookie, getCookie, captureEvent } from "../../functions";
import store from "../../store";
import { getLoggedIn } from "../../actions";
import IntlTelInput from "react-intl-tel-input";
import { Redirect } from "react-router";
import "react-intl-tel-input/dist/main.css";
import { CentralUrl } from "../../constants/ActionTypes";
import { withRouter } from "react-router-dom";

var type, number, isoValue, dialCode, countryName, c;

class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      pass: null,
      mobile: null,
      country: null,
      name: null,
      result: 0,
      otp: null,
      sellerid: getCookie("mhinpbn"),
      type: 0,
      link: "",
      totalCartValue: "",
      totalProductCost: "",
      totalShippingCost: "",
      finalShippingCost: "",
      cartItems: "",
      countryName: "",
      symbol: "",
      cartid: "",
      pixeldata: "",
      shippingCharges: "",
      inrValue: "",
      time: {},
      seconds: 0,
      DispalySkipResend: true,
      timer: 0,
    };
    //this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.validator = new SimpleReactValidator();
  }

  onChange = (err, no, data) => {
    type = err;
    number = no;
    isoValue = data.iso2;
    dialCode = data.dialCode;
    countryName = data.name.replace(/ *\([^)]*\) */g, "");
  };

  setStateFromInput = async (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    await this.setState(obj);
  };

  componentDidMount = async () => {
    // console.log(this.props,'render');
    if (this.props.location.state.type) {
      await this.setState({
        type: this.props.location.state.type,
      });
    }

    if (this.props.location.state.link)
      await this.setState({
        link: this.props.location.state.link,
      });

    if (this.props.location.state.totalCartValue)
      await this.setState({
        totalCartValue: this.props.location.state.totalCartValue,
      });

    if (this.props.location.state.totalProductCost)
      await this.setState({
        totalProductCost: this.props.location.state.totalProductCost,
      });

    if (this.props.location.state.totalShippingCost)
      await this.setState({
        totalShippingCost: this.props.location.state.totalShippingCost,
      });

    if (this.props.location.state.finalShippingCost)
      await this.setState({
        finalShippingCost: this.props.location.state.finalShippingCost,
      });

    if (this.props.location.state.cartItems)
      await this.setState({
        cartItems: this.props.location.state.cartItems,
      });

    if (this.props.location.state.countryName)
      await this.setState({
        countryName: this.props.location.state.countryName,
      });

    if (this.props.location.state.symbol)
      await this.setState({
        symbol: this.props.location.state.symbol,
      });

    if (this.props.location.state.cartid)
      await this.setState({
        cartid: this.props.location.state.cartid,
      });

    if (this.props.location.state.pixeldata)
      await this.setState({
        pixeldata: this.props.location.state.pixeldata,
      });

    if (this.props.location.state.shippingCharges)
      await this.setState({
        shippingCharges: this.props.location.state.shippingCharges,
      });

    if (this.props.location.state.inrValue)
      await this.setState({
        inrValue: this.props.location.state.inrValue,
      });

    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  };

  ResendOtp = () => {
    $(".error")
      .addClass("d-none")
      .removeClass("d-block alert alert-danger");
    $(".resendBtn")
      .val("Submit")
      .prop("disabled", true);
    axios
      .post(
        "https://api.beldara.com/common/sign_up.php",
        {
          security_token: "",
          plateform_type: "",
          email: this.state.email,
          pass: this.state.pass,
          name: this.state.name,
          mobile: number,
          type: "resendOtp",
          country: isoValue,
          countryid: dialCode,
          country_name: countryName,
          currentUrl: window.location.pathname,
          visitorid: getCookie("mhinpbnb"),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        if (response.data.status === "Failed") {
          $(".error")
            .html(response.data.message)
            .addClass("d-block alert alert-danger")
            .removeClass("d-none");
          $(".resendBtn")
            .val("Submit")
            .prop("disabled", false);
        } else {
          $(".resendBtn")
            .val("Submit")
            .prop("disabled", false);
          this.startTimer();
        }
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  };

  loginSubmit = (e) => {
    e.preventDefault();
    // console.log('loginSubmit0',140);
    $(".error")
      .addClass("d-none")
      .removeClass("d-block alert alert-danger");
    if (this.validator.allValid()) {
      // $(".regBtn").val('Please wait...').prop('disabled', true);

      // $(".chkValidate").select().css({border:'none'})

      // console.log('loginSubmit1',140);
      axios
        .post(
          "https://api.beldara.com/common/sign_up.php",
          {
            security_token: "",
            plateform_type: "",
            email: this.state.email,
            pass: this.state.pass,
            name: this.state.name,
            mobile: number,
            type: "signup",
            country: isoValue.toUpperCase(),
            countryid: dialCode,
            country_name: countryName,
            currentUrl: window.location.pathname,
            visitorid: getCookie("mhinpbnb"),
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          //   response.data.result;

          if (response.data.status === "Failed") {
            //console.log(response.data)

            $(".error")
              .html(response.data.message)
              .addClass("d-block alert alert-danger")
              .removeClass("d-none");
          } else {
            // pass data to central
            // axios
            //   .post(
            //     `${CentralUrl}/bbapi/common_leads.php`,
            //     {
            //       lead_id: response.data.result.sellerid, //PrimaryID of your table
            //       name: this.state.name, //FullName
            //       mobile: number,
            //       email: this.state.email,
            //       company: "", //Company Name if any
            //       countryid: isoValue, //Country ID if not pass 0
            //       device: "Web", //Android,iOS,Web
            //       project_source: "1", //1- Beldara, 2 Limrat Advt, 3 Limray Publisher
            //       source: getCookie("source"), //Medium from which lead is generated
            //     },
            //     { headers: { "Content-Type": "multipart/form-data" } }
            //   )
            //   .then(async (result) => {})
            //   .catch((data) => {});

            // axios.post("https://api.beldara.com/common/map_cart.php",{
            //     security_token: "",
            //     plateform_type: "",
            //     sellerid: response.data.result.sellerid,
            //     visitorid: response.data.result.visitorid,
            //     old_visitorid: getCookie('mhinpbnb')
            //   },
            //   { headers: { "Content-Type": "multipart/form-data" } }
            // ).then(response => {
            //     // setCookie('mhinpbn', response.data.result.sellerid, '365')
            //     // store.dispatch(getLoggedIn())
            this.setState({
              result: 1,
            });
            //     // window.location.href = '/cart.html'
            // }).catch(error => {
            //     // setCookie('mhinpbn', response.data.result.sellerid, '365')
            //     // store.dispatch(getLoggedIn())
            //     this.setState({
            //         result:1
            //     })
            //     // window.location.href = '/cart.html'
            //   const result = error.response;
            //   return Promise.reject(result);
            // });
            this.startTimer();
          }
          $(".regBtn")
            .val("Submit")
            .prop("disabled", false);
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    } else {
      this.setState({
        addNotValid: 1,
      });
      $(".chkValidate").click();
      $(".chkValidate").css({ border: "1px solid red" });
      this.validator.showMessages();
      // rerender to show messages for the first time
      this.forceUpdate();
      $(".regBtn")
        .val("Please wait...")
        .prop("disabled", false);
    }
  };

  skipOtp = () => {
    captureEvent(
      "register",
      "register",
      "otp_skip",
      "map_cart",
      ls.get("sellerid"),
      getCookie("mhinpbnb")
    );
    //window.location.href = '/cart.html'
    //window.location.href = this.state.link
    this.redirect_to_start_order();
  };

  otpSubmit = (e) => {
    e.preventDefault();
    $(".errOtp")
      .addClass("d-none")
      .removeClass("d-block alert alert-danger");
    if (this.validator.allValid()) {
      axios
        .post(
          "https://api.beldara.com/common/otp_verify.php",
          {
            security_token: "",
            plateform_type: "",
            otp: this.state.otp,
            mobile: number,
            email: this.state.email,
            //sellerid:ls.get('sellerid'),
            type: "otp_verify_email_new",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          if (response.data.status === "Failed") {
            $(".errOtp")
              .html(response.data.message)
              .addClass("d-block alert alert-danger")
              .removeClass("d-none");
          } else {
            setCookie("mhinpbn", response.data.result, "365");
            store.dispatch(getLoggedIn());
            this.setState({
              result: 1,
            });
            captureEvent(
              "register",
              "register",
              "correct_otp",
              "map_cart",
              ls.get("sellerid"),
              getCookie("mhinpbnb")
            );
            $(".errOtp")
              .addClass("d-none")
              .removeClass("d-block alert alert-danger");
            //window.location.href = this.state.link
            this.redirect_to_start_order();
          }
        });
    } else {
      this.setState({
        addNotValid: 1,
      });
      $(".chkValidate").click();
      $(".chkValidate").css({ border: "1px solid red" });
      this.validator.showMessages();
      // rerender to show messages for the first time
      this.forceUpdate();
    }
  };

  redirect_to_start_order = () => {
    this.props.history.push({
      pathname: this.state.link,
      state: {
        totalCartValue: this.state.totalCartValue,
        totalProductCost: this.state.totalProductCost,
        totalShippingCost: this.state.totalShippingCost,
        finalShippingCost: this.state.finalShippingCost,
        cartItems: this.state.cartItems,
        countryName: this.state.shippingCountryName,
        symbol: this.state.symbol,
        cartid: this.state.cartid,
        pixeldata: this.state.pixeldata,
        shippingCharges: this.state.shippingCharges,
        inrValue: this.state.inrValue,
        link: this.state.link,
      },
    });
    //console.log('----------state---------',this.state,this.state.pathname)
  };

  gotoLogin = () => {
    this.props.history.push({
      pathname: "/login.html",
      state: {
        totalCartValue: this.state.totalCartValue,
        totalProductCost: this.state.totalProductCost,
        totalShippingCost: this.state.totalShippingCost,
        finalShippingCost: this.state.finalShippingCost,
        cartItems: this.state.cartItems,
        countryName: this.state.shippingCountryName,
        symbol: this.state.symbol,
        cartid: this.state.cartid,
        pixeldata: this.state.pixeldata,
        shippingCharges: this.state.shippingCharges,
        inrValue: this.state.inrValue,
        link: this.state.link,
      },
    });
  };

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  startTimer() {
    this.setState({
      seconds: 30,
      timer: 0,
    });
    if (this.state.timer == 0 && this.state.seconds > 0) {
      this.state.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.state.timer);
      this.setState({
        DispalySkipResend: true,
      });
    }
  }
  render() {
    const { mobile, company, email, country } = this.state;

    const InputProps = {
      required: true,
      placeholder: "Enter your mobile",
      name: "mobile",
      type: "tel",
    };

    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    c = url.searchParams.get("url");
    // console.log(c);
    if (!c) {
      c = "";
    }

    return (
      <React.Fragment>
        {this.state.sellerid ? (
          <Redirect to={{ pathname: "/" + c, state: {} }} />
        ) : (
          ""
        )}
        <div className="body">
          <div className="form-signin">
            <div className="text-center mb-4">
              <img
                className="mb-4"
                src="/assets/images/icon/logo/beldara_logo.png"
                alt="Beldara.com"
                width="172"
                height="50"
              />
            </div>
            {this.state.result === 0 ? (
              <form onSubmit={this.loginSubmit}>
                <p className="error d-none"></p>
                <div className="form-label-group">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Full name"
                    required=""
                    autoComplete="off"
                    name="name"
                    onChange={this.setStateFromInput}
                  />
                  <label htmlFor="name">Full Name</label>
                  {this.validator.message(
                    "Name",
                    this.state.name,
                    `required|text`
                  )}
                </div>
                <div className="form-label-group">
                  <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    placeholder="Email address"
                    required=""
                    autoComplete="off"
                    name="email"
                    onChange={this.setStateFromInput}
                  />
                  <label htmlFor="inputEmail">Email address</label>
                  {this.validator.message(
                    "email",
                    this.state.email,
                    `required|email`
                  )}
                </div>
                <div className="has-float-label form-group">
                  <IntlTelInput
                    containerClassName="intl-tel-input"
                    inputClassName="form-control"
                    fieldId="buyer_mobile"
                    geoIpLookup="true"
                    numberType="MOBILE"
                    autoPlaceholder="true"
                    onPhoneNumberChange={this.onChange}
                    onPhoneNumberBlur={this.onChange}
                    defaultCountry={`${
                      getCookie("country_code")
                        ? getCookie("country_code").toLowerCase()
                        : "in"
                    }`}
                    // defaultValue={mobile}
                    numberType="MOBILE"
                    telInputProps={InputProps}
                    // value={this.state.value}
                  />
                  {/* <input type="tel" id="mobile" className="form-control" placeholder="Mobile" required="" autoComplete="off" name="mobile" onChange={this.setStateFromInput} /> */}
                  <label htmlFor="mobile">Mobile</label>
                  {/* {this.validator.message(
                                  "mobile",
                                  this.state.mobile,
                                  `required|integer`
                                )} */}
                </div>
                <div className="form-label-group">
                  <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Create your Password"
                    autoComplete="off"
                    required=""
                    name="pass"
                    onChange={this.setStateFromInput}
                  />
                  <label htmlFor="inputPassword">Create your Password</label>
                  {this.validator.message(
                    "Password",
                    this.state.pass,
                    `required|string|min:6`
                  )}
                </div>
                <p className="text-dark">
                  <i className="fa fa-info rounded"></i>{" "}
                  <small>We will send you a text to verify your phone. </small>
                </p>
                <div className="form-group text-center">
                  <button
                    className="btn btn-lg btn-primary btn-block text-capitalize regBtn"
                    style={{
                      backgroundColor: "#f5821f",
                      border: "1px solid #f5821f",
                    }}
                    type="submit"
                  >
                    Create my account
                  </button>
                </div>

                <div className="a-divider a-divider-break">
                  <h5>Already have Beldara account?</h5>
                </div>
                <p>
                  <div className="form-group text-center">
                    {/* <a className="btn btn-lg btn-primary btn-block text-capitalize" href="/login.html" style={{backgroundColor:'#00aeef',border:'1px solid #00aeef'}} type="">Sign In</a> */}
                    <span
                      className="btn btn-lg btn-primary btn-block text-capitalize mouse_pointer"
                      onClick={() => this.gotoLogin()}
                      style={{
                        backgroundColor: "#00aeef",
                        border: "1px solid #00aeef",
                      }}
                      type=""
                    >
                      Sign In
                    </span>
                  </div>
                </p>
                <p className="mt-5 text-center">
                  © 2019, Beldara.com, All rights reserved.
                </p>
              </form>
            ) : (
              <React.Fragment>
                <Suspense fallback={"Loading"}>
                  <p className="text-center text-dark">
                    <h3 className="text-dark">Thank you for signing up!</h3>
                    Verification code has been sent to your mobile no. email,{" "}
                    {this.state.email}, please enter the same here to complete
                    the signup.
                  </p>
                  <p className="errOtp d-none"></p>
                  <form onSubmit={this.otpSubmit}>
                    <div className="form-label-group">
                      <input
                        type="number"
                        id="otp"
                        className="form-control"
                        placeholder="Enter your OTP"
                        required=""
                        autoComplete="off"
                        name="otp"
                        onChange={this.setStateFromInput}
                      />
                      <label htmlFor="otp">Enter your OTP</label>
                      {this.validator.message(
                        "otp",
                        this.state.otp,
                        `required|text|min:4|max:4`
                      )}
                    </div>
                    
                    <div className="form-group">
                      <div className="d-flex justify-content-center">
                        Remaining Time : 00:{this.state.time.s}
                      </div>
                      <div className="form-group text-center">
                        <button
                          className="btn btn-lg btn-primary rounded-1  text-capitalize mr-1 form-control"
                          style={{
                            backgroundColor: "#f5821f",
                            border: "1px solid #f5821f",
                            marginTop: "10px",
                          }}
                          type="submit"
                        >
                          Enter OTP
                        </button>
                      </div>
                      <div className="d-flex justify-content-end">
                        {this.state.DispalySkipResend ? (
                          <>
                            <button
                              className="btn btn-link rounded-1  text-capitalize mr-1 resendBtn"
                              type="button"
                              onClick={this.ResendOtp}
                            >
                              Resend OTP
                            </button>
                            {/* <button
                              className="btn btn-link rounded-1  text-capitalize mr-1 resendBtn"
                              type="button"
                              onClick={this.skipOtp}
                            >
                              Skip
                            </button> */}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </form>
                </Suspense>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Register);
