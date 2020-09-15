
import React, {Component} from 'react';
import { Redirect } from 'react-router'
import Breadcrumb from "../../common/breadcrumb";
import $ from "jquery";
import axios from 'axios';
import ls from 'local-storage';
import {ApiUrl} from '../../../constants/ActionTypes';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import {send_otp, isNumberKey, setCookie} from '../../../functions';
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux';

var type, number, isoValue, dialCode, country, countryName;
class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result:0,
            verify:0,
            data:''
        }
        const InputProps = {
            required: "true",
            placeholder: "Enter your mobile",
            name:"mobile"
            }
    }

    handleSubmit = (event) => {
        $('#error').addClass('d-none');
        event.preventDefault();

        const name = $('#name').val();
        
        const email = $('#email').val();
        // const mobile = $('#mobile').val();
        const subject = $('#subject').val();
        const comment = $('#comment').val();
        const plateform_type = 'web';
        const sellerid = ls.get('sellerid');

        if (name === undefined || name == '')
        {
            $('#error').removeClass('d-none');
            return false;
        }
        // if (mobile === undefined || mobile == '')
        // {
        //     $('#error').removeClass('d-none');
        //     return false;
        // }
        if (subject === undefined || subject == '')
        {
            $('#error').removeClass('d-none');
            return false;
        }
        if (comment === undefined || comment == '')
        {
            $('#error').removeClass('d-none');
            return false;
        }
        if (email === undefined || email == '')
        {
            $('#error').removeClass('d-none');
            return false;
        }

        if (type){
            
            try {
                axios.post(`${ApiUrl}/common/contactUs.php`,{name:name,email:email,subject:subject,msg:comment,plateform_type:plateform_type, sellerid:sellerid, mobile:number ,country:isoValue ,countryid: dialCode, country_name:countryName}, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(async response => {
                    this.setState({
                        result : response.data.result.result,
                        //verify: response.data.result.verified
                        verify: 1
                    });
                     
                    sellerid = response.data.result.sellerid
                    await setCookie('mhinpbn', sellerid, '365');
                    // if (response.data.result.verify == 0) {
                    //     send_otp(email, number, sellerid)
                    // }
                })
                .catch(error => {
                const result = error.response;
                
                });
                
            } catch (e){
            console.log(`😱 Axios request failed: ${e}`);
            }
        }else{
            $('#error').removeClass('d-none');
            return false;
        }
    }

    async componentWillMount() {
        var hostname = window.location.hostname;
        // if (hostname === undefined || hostname == '')
        // hostname = "german.beldara.com";
        let domain_language_code;
        let langDomain = hostname.split("beldara.com")[0];
        langDomain = langDomain.replace(".", "");
        this.props.languageMaster.forEach(element => {
          if (element.main_language.toLowerCase() == langDomain.toLowerCase())
            domain_language_code = element.code;
        }, this);
        if (domain_language_code !== "" && domain_language_code !== undefined) {
          await axios
            .post(
              "https://api.beldara.com/common/static_page.php",
              { security_token: "", plateform_type: "", langCode: domain_language_code,pageid:'32789' },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
              .then(response => {
                 
              this.setState({
                data: response.data.result
              })
            })
            .catch(error => {
              const result = error.response;
              return Promise.reject(result);
            });
        } else {
          await axios
            .post(
              "https://api.beldara.com/common/static_page.php",
              { security_token: "", plateform_type: "", langCode: 'en',pageid:'32789' },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
              .then(response => {
               
              this.setState({
                data: response.data.result
              })
            })
            .catch(error => {
              const result = error.response;
              return Promise.reject(result);
            });
        }
        
    }

    onChange = (err,no,data,e) => {
        type = err
        number = no
        isoValue = data.iso2
        dialCode = data.dialCode
        countryName = data.name.replace(/ *\([^)]*\) */g, "")
        }

        componentDidMount(){
            // $('#mobile').keyup(function(e){
            //     var charCode = (e.which) ? e.which : e.keyCode;
            //     if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            //         return false;
            //     return true;
            // })

            //document.getElementById('mobile').addEventListener('onkeyup',function(){isNumberKey()}, true)
        }
    

    
    render() {  
        const { translate} = this.props;
        return (
            <div>
                            
                
                {this.state.result == 1 ?
                   <Redirect to={{ pathname: '/thankYou.html', state: { otp: this.state.verify, type: 3, error:0, otpCheck:1 }}}/>
                : ''}

                <Breadcrumb title={'Contact us'} />
                <section className="bg-white contact-page section-b-space">
                    <div className="container">
                        <div className="row section-b-space">
                            
                            <div className="col-lg-12">
                                <div className="contact-right">
                                    <ul>
                                        <li>
                                            <div className="contact-icon">
                                                <img src={`${process.env.PUBLIC_URL}/assets/images/icon/phone.png`} alt="Generic placeholder image" />
                                                    <h6>{translate('Contact Us')}</h6>
                                            </div>

                                            <div className="media-body">
                                                <p>+91 9667682100</p> 
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-icon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                <h6>Address</h6>
                                            </div>
                                            <div className="media-body">
                                                <p>5014-5015-5016,1 Aerocity, Andheri - Kurla Rd Safed Pool Shivaji Nagar, Jarimari, Saki Naka, Mumbai, Maharashtra - 400072, INDIA</p>
                                                <p>163 E, Nelson Circle, Olathe, Kansas, 66061, USA</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-icon">
                                                <img src={`${process.env.PUBLIC_URL}/assets/images/icon/email.png`} alt="Generic placeholder image" />
                                                    <h6>Address</h6>
                                            </div>
                                            <div className="media-body">
                                                <p>support@beldara.com</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div id='error' className=" col-12 alert alert-danger d-none">
                                {translate('Please enter valid data to continue')}
                                </div>
                                <form className="theme-form" onSubmit={this.handleSubmit}>
                                    <div className="form-row">
                                        <div className="has-float-label col-md-6">
                                            
                                            <input type="text" className="form-control" id="name"
                                                   placeholder=" " required="" />
                                            <label htmlFor="name">{translate('Name')}</label>
                                        </div>

                                        <div className="has-float-label col-md-6">
                                            
                                            <input type="email" className="form-control" id="email" placeholder=" " autoComplete="off"
                                                   required="" />
                                            <label htmlFor="email">{translate('Enter your email')}</label>
                                        </div>

                                        <div className="has-float-label col-md-6">
                                            
                                                <IntlTelInput
                                                    containerClassName="intl-tel-input"
                                                    inputClassName="form-control"
                                                    geoIpLookup="true"
                                                    fieldId="mobile"
                                                    fieldName="mobile"
                                                    numberType="MOBILE"
                                                    onPhoneNumberChange={this.onChange}
                                                    onPhoneNumberBlur={this.change}
                                                    defaultCountry={`${country ? (country.toLowerCase()): 'in'}`}
                                                    defaultValue={number}
                                                    telInputProps={this.InputProps}
                                                />

                                            <label htmlFor="mobile">{translate('Mobile')}</label>


                                        </div>
                                        <div className="has-float-label col-md-6 mt-4 mt-xs-4 mt-sm-4 mt-md-0">
                                            
                                            <input type="text" className="form-control" id="subject"
                                                   placeholder=" " autoComplete="off"
                                                   required="" />
                                            <label htmlFor="subject">{translate('Subject')}</label>
                                        </div>
                                        
                                        <div className="has-float-label col-md-12">
                                            
                                            <textarea className="form-control" placeholder=" "
                                                      id="comment" rows="6" autoComplete="off"
                                                      required=""></textarea>
                                            <label htmlFor="comment">{translate('Write Your Message')}</label>          
                                        </div>
                                        <div className="col-md-12">
                                            <button className="btn btn-solid" type="submit">{translate('Submit ')}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    languageMaster: state.languageMaster.languageMaster
 });

export default withTranslate(connect(mapStateToProps)(Contact));