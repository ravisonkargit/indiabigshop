import React, {Component} from 'react';
import Breadcrumb from "./breadcrumb";
import $ from "jquery";
import axios from 'axios';
import ls from 'local-storage';
import {isNumberKey} from '../../functions';
import { Redirect } from 'react-router-dom';
import {ApiUrl,SellerUrl, Url} from '../../constants/ActionTypes';
import { imgUrl } from '../../constants/variable';
import Tracking from '../analytics';

class ThankYou extends Component {
    constructor(){
        super();
        this.state = {
            type: 1, // type = 1 is for request, 0 is for lead bought, 2 is for payment
            otp: 1,  // By default it is considered as otp is verified
            otpCheck: 1, // By default otp should not be verified 
            error: 0,
            wrongOtp:0,
            order_code:'',
        }
    }

    async componentDidMount(){
        let search = window.location.search;
        // console.log(window.location.host);
        let params = new URLSearchParams(search);
        console.log('else');
        if(params.get('od') !== undefined){
            await this.setState({
                order_code:params.get('od')
            })
        }
        if (params.get('o')) {
            console.log('ooooooo');

            await this.setState({
                otp: params.get('o'),
                type: params.get('type'),
                otpCheck: params.get('v'),
                error: params.get('e'),
                wrongOtp: params.get('e'),
            })
        } else {
            console.log('else');
            try{
                await this.setState({
                    otp: this.props.location.state.otp,
                    type: this.props.location.state.type,
                    error: this.props.location.state.error,
                    otpCheck: this.props.location.state.otpCheck
                })
            }
            catch(e){
                console.log(`Could not load File: ${e}`);
                // this.setState({
                //     error: 1
                // })
            }
        }
    }

    // checkNumber =(e) =>{
    //     console.log(e);

    //     // if(isNumberKey(e))
    //     this.setState({value: e.target.value})
        
    // }

    checkOtp = (event) =>{
        $('#submit_otp').text('Please wait...');
        event.preventDefault();
        const otp = $('#otp').val();
        const plateform_type = '';
        const sellerid = ls.get('sellerid');
        try {
            axios.post(`${ApiUrl}/common/otp_verify.php`,{otp:otp, plateform_type:plateform_type, sellerid:sellerid, type:'otp_verify_thank'}, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                $('#submit_otp').text('Submit');
                // console.log(response.data) 
                if (response.data.message == 1){
                    this.setState({
                        otp: 1
                    })
                }else{
                    this.setState({
                        wrongOtp: 1
                    })
                }
            })
            .catch(error => {
            const result = error.response;
            
            });
            
            } catch (e){
            console.log(`😱 Axios request failed: ${e}`);
            }
        
    }

    render (){
        return (
            <div >
            { this.state.error == 0 ?
            <React.Fragment>
                <Breadcrumb title={'Thank You'} />
                    <div className="container">
                        <div className="row justify-content-md-center my-4 text-left ">
                            <div className="col-md-8 col-12 col-sm-12">
                                
                                    { (this.state.type == 0) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Your Payment is successful</h3>
                                            <div className='text-muted'>You have successfully bought this lead. We have sent to confirmation on your registered email <i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> To See more detail about this lead go to <a  href={`${SellerUrl}/my-inquiries.html`}>My Inquiries</a> </div>
                                            <a className="btn btn-success" href={`${SellerUrl}/my-inquiries.html`}>View my Inquiries</a>
                                            </div>
                                        : (this.state.type == 1)?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <Tracking type="1" />
                                            <h3>Your Request is submitted succesfully</h3>
                                            <div className='text-muted '>We have processed your request on product(s) we will help you to reach out to many verified Sellers <i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> You can search more products depending upon your needs. To see more details please go to <a href={`${SellerUrl}/my-requirements.html`}>My Requirements</a> </div>
                                            <a className="btn btn-success" href={`${SellerUrl}/my-requirements.html`}>View my requirements</a>
                                            </div>
                                            :
                                        (this.state.type == 3) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Your Request is submitted succesfully</h3>
                                            <div className='text-muted '>We will go through your request and our team will reach out to you in sometime. <i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> You can view all our tickets in <a href={`${SellerUrl}/support-ticket.html`}>View support ticket</a> </div>
                                            <a className="btn btn-success" href={`${SellerUrl}/support-ticket.html`}>View support ticket</a>
                                            </div>
                                        :(this.state.type == 5) ?
                                        <div className="alert alert-danger p-5 shadow-sm rounded">
                                            <h3>Your Payment is unsuccesful!</h3>
                                            <div className='text-muted '>We could not process your payment. Please try again later.<i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> If you facing any issues please raise a ticket and our team will reach out to you. <a href={`${SellerUrl}/support-ticket.html`}>Support ticket</a> </div>
                                            <a className="btn btn-success" href={`${SellerUrl}/support-ticket.html`}>Raise a ticket</a>
                                            </div>
                                        :(this.state.type == 6) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Thank you!</h3>
                                            <div className='text-muted '>Your feedback is recorded successfully.<i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> Have more requirements, please <a href={`${Url}/post-requirement.html`}>post your requirement</a>. </div>
                                            <a className="btn btn-success" href={`${Url}/post-requirement.html`}>Post Your Requirement</a>
                                            </div>
                                        :(this.state.type == 7) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Thank you!</h3>
                                            <div className='text-muted '>Your feedback is recorded successfully.<i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> Have more products to sell, please list your products. </div>
                                            <a className="btn btn-success" href={`${SellerUrl}/add-product.html`}>Add Products</a>
                                            </div>                                            
                                        :(this.state.type == 2) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Your Payment is succesful!</h3>
                                            <div className='text-muted '>We have sent to confirmation on your registered email.<i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> If you are facing any issues please raise a ticket and our team will reach out to you. <a href={`${SellerUrl}/support-ticket.html`}>Support ticket</a> </div>
                                            <div className="justify-content-around">
                                                <a className="btn btn-success float-left" href={`${SellerUrl}/support-ticket.html`}>Raise a ticket</a>
                                                <a className="btn btn-md float-right text-white" href={`${SellerUrl}/my_purchase.html?order=${this.state.order_code}`} target="_blank" style={{backgroundColor:'#f5821e'}}>Go to order</a>
                                            </div>
                                            </div>
                                        :(this.state.type == 8) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Thank you!</h3>
                                            <div className='text-muted '> Your request is recorded successfully. <i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> Our Team will get back to you soon! </div>
                                        </div>   
                                        :(this.state.type == 9) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Thank you!</h3>
                                            <div className='text-muted '> Your request is recorded successfully. <i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> Our Team will get back to you soon! You can find your auction <a href="/auction.html">here</a></div>
                                        </div>   
                                        :(this.state.type == 10) ?
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Thank you!</h3>
                                            <div className='text-muted '> Your request is recorded successfully. <i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> Your Auction will be available <a href="/auction.html">here</a> as soon as it gets approved.</div>
                                        </div>   
                                        :
                                        <div className="alert alert-success p-5 shadow-sm rounded">
                                            <h3>Your Payment is successful</h3>
                                            <div className='text-muted '>You have succesfully purchase Package. We have sent to confirmation on your registered email <i className="far fa-smile ml-1"></i> </div>
                                            <div className='text-muted '> You will find all you need to increase your bussiness in your <a  href={`${SellerUrl}`}>Dashboard</a></div>
                                            <a className="btn btn-success" href={`${SellerUrl}`}>Go To Dashboard</a>
                                        </div>
                                    }

                    { this.state.otp == 0 ?
                    <React.Fragment>
                        { this.state.otpCheck == 1 ?
                        <div className="alert alert-warning p-md-5 p-sm-3 shadow-sm rounded">
                        <h5 className="alert-heading">
                          <i className="fa fa-check-circle" ></i> You're One step away 
                        </h5>
                        <div className='text-muted font-weight-light'>We have processed your request on product(s).Before that you need to verfiy your requirement.   </div>
                        <div className='text-muted font-weight-light'>We have sent OTP mobile/email,Please enter OTP below.   </div>
            
                        <br />
                        <div className="container p-0">
                            <form id="info_form" onSubmit={this.checkOtp}>
                                {/* <div className="form-label-group col-12 col-md-5 p-1">
                                    <input
                                        type="tel"
                                        placeholder="Enter your otp" 
                                        name="otp"
                                        className="form-control d-block" 
                                        onKeyPress={this.checkNumber} 
                                        maxlength="4" 
                                        id="otp" pattern=".{4}"  
                                        title="Only 4 digit number"
                                        value={this.state.value} 
                                        
                                    />
                                    <label for="otp">Enter OTP here</label>
                                </div> */}
                                {this.state.wrongOtp == 1 ?
                                <div className="col-12 col-md-8 text-center">
                                    <div className="alert alert-danger">Please enter correct Otp to proceed</div>
                                </div>
                                : ''}
                                <div className="col-md-4 col-sm-6">
                                <div className="has-float-label my-3">
                                    <input
                                            type="tel"
                                            value={this.state.value} 
                                            maxLength="60"
                                            pattern=".{4}"  
                                            className="form-control"
                                            onKeyPress={this.checkNumber} 
                                            maxlength="4" 
                                            placeholder=" "  
                                            required 
                                            autoFocus 
                                            autoComplete="off"
                                            id="otp"
                                    />
                                    <label htmlFor="otp">
                                    Enter OTP
                                    </label>
                                </div>
                                </div>
                                <div className="col-12 col-md-5">
                                    <button id="submit_otp" className="btn btn-warning px-3">Submit</button>
                                </div>
                                
                              </form>
                          </div>
                      </div>
                        : 
                        ''
                        }
                    </React.Fragment>
                    : ''   }
                                
                                </div>
                                <div className="col-4 d-none d-sm-none d-md-block">
                                    <a href="https://limray.com">
                                        <img src={`${imgUrl}/images/limrayad1.png`} alt="Limray Beldara.com" >

                                        </img>
                                    </a>

                                    <a href="https://worksena.com">
                                        <img src={`${imgUrl}/images/worksenaad.png`} alt="Worksena Beldara.com" >

                                        </img>
                                    </a>
                                </div>
                        </div>
                    </div>
                
                
               
                
                </React.Fragment>
                    :
                    <div></div>
            // <Redirect to={'/'}  />   
            }
            </div>
                            
        )
    }
}



export default ThankYou;