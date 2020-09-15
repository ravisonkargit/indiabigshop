import React, { Component } from 'react'
import Modal from 'react-responsive-modal';
import { ApiUrl } from "../../constants/ActionTypes";
import Autosuggest from 'react-autosuggest';
import Axios from "axios";
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import $ from "jquery";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { isMobile } from 'react-device-detect';
import ls from "local-storage";
import { apiUrl } from '../../constants/variable';
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
var type, number, isoValue, dialCode, country, countryName,data_suggestion,productid;
class index extends Component {
    constructor(props){
        super(props);
        this.state = {
            suggestions: [],
            value: '',
            id:null
        }
        this.addNewUser = this.addNewUser.bind(this);
    }
    onChange = (err, no, data) => {
        type = err;
        number = no;
        isoValue = data.iso2;
        dialCode = data.dialCode;
        countryName = data.name.replace(/ *\([^)]*\) */g, "");
      };
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
      addNewUser = async e => {
        //   console.log('working..');
        e.preventDefault();
        $('.validation_field').addClass('d-none');
        $("#submit_success_spinner").removeClass('d-none');
        $("#submit_button").attr('disabled',true);
        $("#errOtpSignUp").css({'display':'none'}).text('');
        // $("#empty_category").addClass('d-none');
        // $("#empty_usertype").addClass('d-none');
        // console.log(userType,67,isoValue, dialCode, country, countryName,'+'+dialCode+'-'+$('#mobilenumber').val());
        isoValue = isoValue.toUpperCase();        
        var userType = $('input[name=UserType]:checked').val();
        if(userType != '' && userType != null){
          if(!isNaN(this.state.id)){
            if (type) {
                var user_name = $('#user_name').val();
                var user_email = $('#user_email').val();
                var mobile = $('#mobilenumber').val();
                var main_cat = this.state.id;
                var manufacturer_type = ($("#ManufacturerType").prop('checked') == true) ? '1' : '0';
                mobile = '+'+dialCode+'-'+mobile;
                if(user_email != ''){
                    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email)){
                        Axios.post(`${ApiUrl}/common/add_new_user.php`, {name:user_name,mobile:mobile,email:user_email,refer_sellerid:ls.get('log_id'),user_type:userType,rtype:manufacturer_type,main_cat:this.state.id,security_token:'',plateform_type:(isMobile) ? 'Mobile' : 'Desktop',country:isoValue,countryid:dialCode}, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(response => {
                            // console.log(response);
                            if(response.data.statusId == '1'){
                                $('#add_user_success').html('User invited successfully').removeClass('d-none');
                                var inter = setInterval(() => {
                                    window.location.reload();
                                    clearInterval(inter);
                                },1000);
                            }else{
                                $("#submit_button").attr('disabled',false);
                                $("#submit_success_spinner").addClass('d-none');
                                $('#add_user_error').html(response.data.result.error_msg).removeClass('d-none');
                            }
                        })
                        .catch(error => {
                            $('#add_user_error').html('Something went wrong please try again').removeClass('d-none');
                            $("#submit_button").attr('disabled',false);
                            $("#submit_success_spinner").addClass('d-none');
                            const result = error.response;
                            return Promise.reject(result);
                        });
                    }else{
                        $("#submit_button").attr('disabled',false);
                        $("#submit_success_spinner").addClass('d-none');
                        $('.validation_field').addClass('d-none');
                        $('#add_user_error').html('please enter valid email').removeClass('d-none');
                    }
                }else{
                    Axios.post(`${ApiUrl}/common/add_new_user.php`, {name:user_name,mobile:mobile,email:user_email,refer_sellerid:ls.get('log_id'),user_type:userType,rtype:manufacturer_type,main_cat:this.state.id,security_token:'',plateform_type:(isMobile) ? 'Mobile' : 'Desktop',country:isoValue,countryid:dialCode}, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(response => {
                        // console.log(response);
                        if(response.data.statusId == '1'){
                            $('#add_user_success').html('User invited successfully').removeClass('d-none');
                            var inter = setInterval(() => {
                                window.location.reload();
                                clearInterval(inter);
                            },1000);
                        }else{
                            $("#submit_button").attr('disabled',false);
                            $("#submit_success_spinner").addClass('d-none');
                            $('#add_user_error').html(response.data.result.error_msg).removeClass('d-none');
                        }
                    })
                    .catch(error => {
                        $("#submit_button").attr('disabled',false);
                        $("#submit_success_spinner").addClass('d-none');
                        $('#add_user_error').html('Something went wrong please try again').removeClass('d-none');
                        const result = error.response;
                        return Promise.reject(result);
                    });
                }
                
                
            } else {
                $("#submit_button").attr('disabled',false);
                $("#submit_success_spinner").addClass('d-none');
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
      onSuggestionsFetchRequested = ({ value }) => {
        let userData = {
            term: value
        }
        productid = '';
        userData = JSON.stringify(userData)
        let formData = new FormData()
        formData.append('term', userData)
        // console.log(formData,value);
        Axios.post(`${ApiUrl}/common/get_categories.php`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
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
      Manufacturer = () => {
        $("#ManufacturerDiv").removeClass('d-none');
      }
    
      Removemanufacturer = () =>{
        $('#ManufacturerType').prop('checked', false);
        $("#ManufacturerDiv").addClass('d-none');
      }
    
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
            <div>
                <Modal open={this.props.adduser.adduser} onClose={() => ''} center className="">
            
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title pr-2">Invite via phone number</h3>
                    <button type="button" className="close" onClick={this.props.closeModal}>&times;</button>
                </div>
                    <div className="modal-body modal1">
                        <div className="container-fluid p-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className="modal-bg addtocart">
                                    <div className="modal-body">
                                        <div class="alert alert-warning d-none validation_field" role="alert" id="empty_category">
                                            Please select valid business category
                                        </div>  

                                        <div class="alert alert-warning d-none validation_field" role="alert" id="empty_usertype">
                                            Please select user type seller,buyer or both
                                        </div>
                                    <form className="" method="post" action="" onSubmit={this.addNewUser}>
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
                                        <div className="alert alert-danger alert-dismissible d-none validation_field" id="errFooterLogIn">
                                            <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                        </div>
                                        <div className="col-md-12">
                                        <div class="alert alert-warning d-none validation_field" id="add_user_error" role="alert"></div>
                                        <div class="alert alert-success d-none validation_field" id="add_user_success" role="alert"></div>
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
                                                Enter  Mobile
                                            </label>
                                        </div>
                                        <div className="has-float-label my-3">
                                                <input
                                                    type="text"
                                                    maxLength="60"
                                                    className="form-control"
                                                    placeholder=" " 
                                                    id="user_name"
                                                    required
                                                />
                                                <label htmlFor="user_name">
                                                    Enter Full Name
                                                </label>
                                        </div>
                                        <div className="has-float-label my-3">
                                                <input
                                                    type="text"
                                                    maxLength="60"
                                                    className="form-control"
                                                    placeholder=" "
                                                    id="user_email"
                                                    required
                                                />
                                                <label htmlFor="user_email">
                                                    Enter Email Address
                                                </label>
                                        </div>
                                            <div class="form-check form-check-inline">
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
                                            
                                            
                                            <div className="row">
                                                <div className="form-group text-danger col-6 pr-0">
                                                    <button type="submit" className="btn btn-warning ">Invite</button>
                                                </div>
                                                <div className="form-group text-right text-primary col-9">
                                                <div class="spinner-grow text-success d-none" role="status" id="otp_spinner" style={{width: '1rem',height: '1rem'}}>
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Modal>
            </div>
        )
    }
}
export default index;
