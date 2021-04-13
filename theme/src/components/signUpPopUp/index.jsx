import React, { Component } from "react";
import "./signUpPopUp.css";
import Axios from "axios";
import Modal from "react-responsive-modal";
import { footer_signupModal, otp_submit } from "../../functions";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import $ from "jquery";
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
// import FbLogin from "../common/fbLogin";
// import LoginGoogle from "../common/googleLogin";

function getSuggestionValue(suggestion) {
  return `${suggestion.name}~${suggestion.id}`;
}

function renderSuggestion(suggestion, { query }) {
  const matches = AutosuggestHighlightMatch(suggestion.name, query);
  const parts = AutosuggestHighlightParse(suggestion.name, matches);

  return (
  <span>
      {parts.map((part, index) => {
      const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

      return (
          <span className={className} key={index}>
          {part.text}
          </span>
      );
      })}
  </span>
  );
}

// signup
var type, number, isoValue, dialCode, country, countryName,data_suggestion,productid;
var dummy = "";
class SignUpPopUp extends Component {
  constructor(props) {
    super(props);
//
    this.state  = {
      suggestions: [],
      value: '',
      id:null
    }
    const InputProps = {
      required: "true",
      placeholder: "Enter your mobile",
      name: "mobile"
    };
  }

  signupPopUp = async e => {
    e.preventDefault()
    $("#empty_category").addClass('d-none');
    $("#empty_usertype").addClass('d-none');
    var userType = $('input[name=UserType]:checked').val();
    if(userType != '' && userType != null){
      if(!isNaN(this.state.id)){
        if (type) {
          await footer_signupModal(number, isoValue, dialCode, countryName, this.state.id, e);
        } else {
          $("#errFooterSignUp").css({ display: "block" }).text("Enter Valid Number");
          // $("#error_text").text("Enter Valid Number");
        }
      }else{
        $("#empty_category").removeClass('d-none');
      }
    }else{
      $("#empty_usertype").removeClass('d-none');
    }
  };

  otp_check = async e => {
    const checkotp = await otp_submit(dummy, e);
    this.props.footerData(checkotp);
  };

  onChange = (err, no, data) => {
    type = err;
    number = no;
    isoValue = data.iso2;
    dialCode = data.dialCode;
    countryName = data.name.replace(/ *\([^)]*\) */g, "");
  };

  Manufacturer = () => {
    $("#ManufacturerDiv").removeClass('d-none');
  }

  Removemanufacturer = () =>{
    $('#ManufacturerType').prop('checked', false);
    $("#ManufacturerDiv").addClass('d-none');
  }

  onChangedropdown = (event, { newValue, newId, method }) => {
    var split_value = newValue.split('~');
    this.setState({
        value: split_value[0],
        productid:'',
        id: parseInt(split_value[1])
    });
    // console.log(this.state,96);
    // console.log(newValue,typeof newValue,1004,split_value,this.state,split_value[1],1012);
  };
  onSuggestionsFetchRequested = ({ value }) => {
    let userData = {
        term: value
    }
    productid = '';
    userData = JSON.stringify(userData)
    let formData = new FormData()
    formData.append('term', userData)
    // console.log(formData,value);
    Axios.post("https://api.indiabigshop.com/common/get_categories.php", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
            // console.log(response);
            let data = response.data.result.map(result => {
                return {
                    name: `${result.name}`,
                    id:`${result.id}`
                };
            });

            data_suggestion = response.data.result.map(result => {
                return {
                    name: `${result.name}`,
                    id: `${result.id}`
                };
            });
            this.setState({
                suggestions: data
            });
        })
        .catch(error => {
            const result = error.response;
            return Promise.reject(result);
        });
 
    };
    onSuggestionsClearRequested = () => {
      this.setState({
          suggestions: [],
      });
  };

  render() {
    const { value, suggestions} = this.state;
        const InputProps = {
            placeholder: '',
            value,
            data:'s',
            onChange: this.onChangedropdown,
            name: "category_name",
            id: "category_name",
            required:true
        };
    return (
      <Modal
        open={this.props.signup.signup}
        onClose={() => ""}
        center
        className="cart-modal"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Sign Up </h3>
              <button
                type="button"
                className="close"
                onClick={this.props.closeModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-body modal1">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12">
                    <div className="modal-bg addtocart">
                      <div className="modal-body">
                        <form
                          action=""
                          id="first_tab"
                          onSubmit={this.signupPopUp}
                        >
                          <div className="col-md-12">
                            <div
                              className="alert alert-danger"
                              id="errFooterSignUp"
                            >
                              <a
                                href="#"
                                className="close"
                                id="error_text"
                                data-dismiss="alert"
                                aria-label="close"
                              >
                                &times;
                              </a>
                            </div>

                            <div class="alert alert-warning d-none" role="alert" id="empty_category">
                              Please select valid business category
                            </div>

                            <div class="alert alert-warning d-none" role="alert" id="empty_usertype">
                              Please select user type seller,buyer or both
                            </div>

                            <div class="form-check form-check-inline">
                            <div className="text-left">I am a :</div>&nbsp;&nbsp;&nbsp;
                              <input class="form-check-input" type="radio" name="UserType" id="seller" value="seller" onClick={this.Manufacturer}/>
                              <label class="form-check-label" for="seller">Seller</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="radio" name="UserType" id="buyer" value="buyer" onClick={this.Removemanufacturer} />
                              <label class="form-check-label" for="buyer">Buyer</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="radio" name="UserType" id="both" value="both" onClick={this.Manufacturer}/>
                              <label class="form-check-label" for="both">Both</label>
                            </div>

                            <div class="form-check my-2 d-none" id="ManufacturerDiv">
                              <input class="form-check-input" type="checkbox" id="ManufacturerType" />
                              <label class="form-check-label" for="defaultCheck1">
                                Are you manufacture ?
                              </label>
                            </div>

                            <div className="has-float-label my-3">
                              <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                inputProps={InputProps}
                                className="form-control"
                                id="category_name"
                                style={{width:'100%'}}
                              />
                              <label htmlFor="universalEmail">
                                  Primary Business Category
                              </label>
                            </div>

                            <div className="has-float-label my-3">
                              <input
                                type="email"
                                maxLength="60"
                                className="form-control"
                                id="universalEmail"
                                placeholder=""
                                required
                                autoFocus
                                autoComplete="off"
                              />
                              <label htmlFor="universalEmail">
                                Enter your Email
                              </label>
                            </div>

                            <div className="has-float-label my-3">
                              <IntlTelInput
                                containerClassName="intl-tel-input"
                                inputClassName="form-control"
                                fieldId="mobile"
                                geoIpLookup="true"
                                fieldId="mobilenumber"
                                fieldName="mobilenumber"
                                onkeypress={this.isNumberKey}
                                onPhoneNumberChange={this.onChange}
                                onPhoneNumberBlur={this.change}
                                defaultCountry={`${
                                  country ? country.toLowerCase() : "in"
                                }`}
                                defaultValue={number}
                                telInputProps={this.InputProps}
                              />
                              <label htmlFor="universalEmail">
                                Enter your Mobile
                              </label>
                            </div>
                          </div>

                          
                        <div className="clearfix"></div>
                      
                          <div className="col-md-12 col-sm-12 col-xs-12 text-center form-group">
                            <button type="submit" className="btn btn-warning" id="submit_button">
                            <div class="spinner-border text-dark d-none" id="submit_success_spinner" role="status" style={{width: "1rem",height: "1rem"}}>
                                <span class="sr-only">Loading...</span>
                            </div>&nbsp;
                              Sign Up
                            </button>
                          </div>
                       
                        {/* <div class="row text-center border-top border-bottom py-3">
                          <div class="col-md-6 col-sm-12" >
                            <FbLogin/>
                          </div>
                          <div class="col-md-2 col-sm-12" > 
                            -- OR -- 
                          </div>
                          <div class="col-md-4 col-sm-12" >
                            <LoginGoogle/>
                          </div>
                        </div> */}
                        </form>
                        <form
                          action=""
                          id="second_tab"
                          onSubmit={this.otp_check}
                        >
                          <div className="col-md-12">
                           
                              <h5>Thank you for signing up!</h5>
                              <div className="">
                              Verification code has been sent to your email/ mobile, please enter the same here to complete the signup.
                              </div>
                            
                            <div
                              className="alert alert-danger"
                              id="errOtpSignUp"
                            ></div>

                            <div className="has-float-label my-3">
                              <input
                                type="tel"
                                maxLength="4"
                                className="form-control"
                                id="universalOtp"
                                placeholder=" "
                                required
                                autoFocus
                                autoComplete="off"
                              />
                              <label htmlFor="universalOtp">
                                Enter your OTP
                              </label>
                            </div>

                            <div className="has-float-label my-3">
                              <input
                                type="password"
                                minLength="6"
                                maxLength="30"
                                className="form-control"
                                id="universalPass"
                                placeholder=" "
                                required
                                autoComplete="off"
                              />
                              <label htmlFor="universalPass">
                                Create your Password
                              </label>
                            </div>

                            
                              <div className="col-md-12 col-sm-12 col-xs-12 text-center form-group">
                                <button
                                  type="submit"
                                  className="btn btn-warning"
                                >
                                  Confirm OTP
                                </button>
                              </div>
                            
                          </div>
                        </form>

                        <div className="text-center page-header">
                          <label className="container-checkbox">
                            {" "}
                            By signing up, you agree to our{" "}
                            <u className="text-success modhover">
                              <a href="https://beldara.com/terms-and-condition.html">
                                Terms of Use
                              </a>
                            </u>{" "}
                            and{" "}
                            <u className="text-success modhover">
                              <a href="https://beldara.com/privacy-policy.html">
                                Privacy Policy.
                              </a>
                            </u>
                          </label>
                        </div>
                        <div className="form-group text-center list-inline">
                          <span>Already have an account? </span>
                          <span
                            className="text-success loginModal"
                            onClick={this.props.openLoginModal}
                          >
                            <u>Log In</u>
                          </span>
                        </div>
                        <div className="clearfix"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
export default SignUpPopUp;
