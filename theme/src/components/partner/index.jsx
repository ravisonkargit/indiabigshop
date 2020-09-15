import React, { Component } from 'react'
import { connect } from 'react-redux';
import Select from "react-select";
import SimpleReactValidator from 'simple-react-validator';
import IntlTelInput from 'react-intl-tel-input';
import { getCookie } from '../../functions';
import { getAllCountry } from '../../actions';
import store from '../../store';
import ls from "local-storage";
import $ from 'jquery';
import { apiUrl } from '../../constants/variable';
import axios from 'axios';
import './partner.css';
class Partner extends Component {

    constructor(props){
        super(props)

        this.state = {
            country : getCookie('country_name'),
            selectedOption: '',
            option: [
                {value: '1', label : 'Marketing ad agencies'},
                {value: '2', label : 'Content marketing partners'},
                {value: '3', label : 'Logistic partners'},
                {value: '4', label : 'Tradeshows partners'},
                {value: '5', label : 'Newsletter promotion'},
                {value: '6', label : 'Link and banner exchange'},
                {value: '7', label : 'Other'}
            ],
            number_error: false,
            dialCode : '',
            countryName : '',
            isoValue : ''
        }

        this.validator = new SimpleReactValidator();

        store.dispatch(getAllCountry());
    }

    onChange = (err, no, data) => {
        
        this.setState({
            number_error : err,
            phone: no,
            isoValue : data.iso2,
            dialCode : data.dialCode,
            countryName : data.name.replace(/ *\([^)]*\) */g, "")
        })
        
        // type = err
        // number = no
        // isoValue = data.iso2
        // dialCode = data.dialCode
        // countryName = data.name.replace(/ *\([^)]*\) */g, "")
    }

    setStateFromInput = async event => {
        var obj = {};
        obj[event.target.name] = event.target.value;
        await this.setState(obj);
      };

      handleCountry = async (val) => {
          await this.setState({
            country: val.label
          })
      }

      changeOption = async (val) => {
          await this.setState({
            selectedOption: val.label
          })
      }

      continueComment  = () => {
        $('#not_loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').attr('disabled','');
        $('#loading').removeClass('d-none');
        $('.partner_error').addClass('d-none').text('');
        if (this.validator.allValid() && this.state.number_error) {
        axios.post(`${apiUrl}/get_partner_details.php`,
        {
            security_token: "",
            plateform_type: "",
            option: this.state.selectedOption,
            country: this.state.country,
            phone: this.state.phone,
            email: this.state.email,
            name: this.state.name,
            subject: this.state.subject,
            message: this.state.message,
            company: this.state.company,
            countryid :this.state.isoValue,
            country_code : this.state.dialCode,
            country_name : this.state.countryName,
            sellerid: ls.get('mhinpbn')
        },
        { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
            $('.partner_error').addClass('d-none').text('');
            this.loaders()
            this.props.history.push({
                pathname: "/thankYou.html",
                state: {
                mode: 1,
                type: 8,
                otpCheck: 0,
                error: 0
                }
            });
        })
        .catch(error => {
            $('.partner_error').removeClass('d-none').text('Something Went Wrong Please try again later!');
            this.loaders()
        
            const result = error.response;
            return Promise.reject(result);
        });
    }else{
        this.validator.showMessages();
        this.loaders()
        $('.partner_error').removeClass('d-none').text('Please fill valid details to continue!');
    }

    }

    loaders = () => {
        $('#not_loading').removeClass('d-none');
        $('#loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').removeAttr('disabled');
    }

    render() {

        const InputProps = {
            required: true
          };

          const defaultCountry = [
            {
              value: getCookie('countryid'),
              label: getCookie('country_name').toUpperCase()
            }
          ];

        return (
            <div className="container">
                <div className="row">

                    <div className="col-12 my-1 card-text text-right">
                        <div className="partner_error alert alert-danger d-none" >Please fill all the details to continue!</div>
                        <button id="btn_loading" className="btn btn-solid" onClick={this.continueComment}>
                            <div id="loading" className=" spinner-border d-none" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div id="not_loading">Continue</div>
                        </button>  
                    </div>

                    <div className="col-12 my-3">
                        <div className="h5">We provide major support to our partners. Join Beldara global B2B marketplace to generate more sales.</div>
                    </div>

                    <div className="form-group col-md-6 col-sm-12 col-12 mb-2">
                            
                            <Select
                                isOptionSelected="true"
                                options={this.state.option}
                                onChange={this.changeOption}
                                headingProps={InputProps}
                                placeholder={"Please Select"}
                            />
                          
                        {this.validator.message('country', this.state.selectedOption, 'required')}
                    </div>

                    <div className="form-group col-md-6 col-sm-12 col-12 mb-2">
                        
                        
                        {this.props.countries ? 
                            defaultCountry?
                            (
                                <Select
                                isOptionSelected="true"
                                options={this.props.countries}
                                onChange={this.handleCountry}
                                headingProps={InputProps}
                                defaultValue={defaultCountry}
                                // placeholder={"Select Country"}
                                //defaultValue={''}
                                />
                            ) : (
                                <Select
                                isOptionSelected="true"
                                options={this.props.countries}
                                onChange={this.handleCountry}
                                headingProps={InputProps}
                                placeholder={"Select Country"}
                                //defaultValue={''}
                                />
                            ) : ''}
                        {this.validator.message('country', this.state.country, 'required')}
                    </div>

                    <div className="col-md-6 col-sm-12 col-12 mb-2">
                        <div className="has-float-label">
                            <input id="subject" name="subject" placeholder=" " className="form-control input-number" onChange={this.setStateFromInput} />
                            <label htmlFor="subject"> {"Subject"} </label>
                            { this.validator.message( "subject", this.state.subject, `required|string` )}
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12 col-12 mb-2">
                        <div className="has-float-label">
                            <input id="name" name="name" placeholder=" " className="form-control input-number" onChange={this.setStateFromInput} />
                            <label htmlFor="name"> {"Your Name"} </label>
                            { this.validator.message( "name", this.state.name, `required|string` )}
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12 col-12 mb-2">
                        <div className="has-float-label">
                            <input id="email" name="email" placeholder=" " className="form-control input-number" onChange={this.setStateFromInput} />
                            <label htmlFor="email"> {"Your Email"} </label>
                            { this.validator.message( "email", this.state.email, `required|email` )}
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12 col-12 mb-2">
                        <div className="has-float-label">
                            <IntlTelInput
                                containerClassName="intl-tel-input"
                                inputClassName="form-control"
                                fieldId="phone"
                                geoIpLookup="true"
                                numberType="MOBILE"
                                autoPlaceholder="true"
                                onPhoneNumberChange={this.onChange}
                                onPhoneNumberBlur={this.onChange}
                                defaultCountry={`${getCookie('country_code') ? (getCookie('country_code').toLowerCase()): 'in'}`}
                                // defaultValue={mobile}
                                numberType="MOBILE"
                                telInputProps={InputProps}
                                // value={this.state.value}
                                
                            />
                            {/* <input id="phone" name="phone" placeholder=" " className="form-control input-number" onChange={this.setStateFromInput} /> */}
                            <label htmlFor="phone"> {"Your Phone"} </label>
                            { this.validator.message( "phone", this.state.phone, `required|string` )}
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12 col-12 mb-2">
                        <div className="has-float-label">
                            <input id="company" name="company" placeholder=" " className="form-control input-number" onChange={this.setStateFromInput} />
                            <label htmlFor="company"> {"Company Name"} </label>
                            { this.validator.message( "company", this.state.company, `required|string` )}
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12 col-12 mb-2">
                        <div className="has-float-label">
                            <input id="message" name="message" placeholder=" " className="form-control input-number" onChange={this.setStateFromInput} />
                            <label htmlFor="message"> {"Your Message"} </label>
                            { this.validator.message( "message", this.state.message, `required|string` )}
                        </div>
                    </div>

                    <div className="col-md-12 mb-2 text-center my-4">
                        <img className="partner w-100" src={`${process.env.PUBLIC_URL}/assets/images/Partnership_with_Beldara.png`}  alt="partner beldara.com"/>
                    </div>

                    <div className="col-12 my-1 card-text text-right">
                        <div className="partner_error alert alert-danger d-none" >Please fill all the details to continue!</div>
                        <button id="btn_loading" className="btn btn-solid" onClick={this.continueComment}>
                            <div id="loading" className=" spinner-border d-none" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div id="not_loading">Continue</div>
                        </button>  
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
     symbol: state.data.symbol,
     currencyValue: state.currencyValue.currencyValue,
     countries: state.data.countries,
     user: state.user.user
})

export default connect(
    mapStateToProps
)(Partner)

