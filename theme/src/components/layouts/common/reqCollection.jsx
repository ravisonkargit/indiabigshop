import React, { Component } from 'react';
import { imgUrl } from '../../../constants/variable';
import  ReqComponent  from '../../form';
import { getCookie} from '../../../functions';
import $ from 'jquery';
import IntlTelInput from 'react-intl-tel-input';
import { withTranslate } from 'react-redux-multilingual'
import './main.css';

class ReqCollection extends Component {
    render() {
        const {translate} = this.props;
        const InputProps = {
            required: true,
            placeholder: "Enter your mobile",
            name: "mobile",
            type: 'tel'
             
        }
        return (
            <div className="container">
                    <div className="row">
                        <div className="col-7 col-md-7 col-sm-1 d-none d-md-block d-sm-none">
                            <img className="img-fluid mt-2 mouse_pointer" src={`${imgUrl}/advt_banner/Product_requirements_beldarab2b.png`} alt="Product Requirements Beldarab2b" />
                        </div>

                        <div className="col-5 col-md-5 col-sm-12">
                            <div className="d-flex align-items-center h-100">
                                <div className="reqModule">
                                    <ReqComponent />
                                </div>
                                <div className="my-2 reqMain">
                                    
                                        <div className="has-float-label my-2">
                                            <input id="buyer_email" type="email" placeholder=" " className="form-control"  required/>
                                            <label htmlFor="buyer_email">{translate('Enter your email')}</label>
                                        </div>
                                        <div className="has-float-label my-2">
                                            <IntlTelInput
                                                containerClassName="intl-tel-input"
                                                inputClassName="form-control"
                                                fieldId="buyer_mobile"
                                                geoIpLookup="true"
                                                numberType="MOBILE"
                                                autoPlaceholder="true"
                                                onPhoneNumberChange={this.onChange}
                                                onPhoneNumberBlur={this.change}
                                                defaultCountry={`${getCookie('country_code') ? (getCookie('country_code').toLowerCase()): 'in'}`}
                                                numberType="MOBILE"
                                                telInputProps={InputProps}
                                                
                                                // value={this.state.value}
                                                
                                            />
                                            <label htmlFor="mobile">{translate('Mobile')}</label>
                                    </div>
                                        {/* <input type="text"  className="form-control" id="name" placeholder="Enter Your name" required /> */}
                                </div>  
                            </div>  
                        </div>
                    </div>
                </div>
        )
    }
}


export default withTranslate(ReqCollection);