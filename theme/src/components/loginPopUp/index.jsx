import React, {Component} from 'react';
import './loginPopUp.css';
import Modal from 'react-responsive-modal';
import { SellerUrl} from '../../constants/ActionTypes'
import {footer_loginModal,SendotpForLogin} from '../../functions';
import FbLogin from '../common/fbLogin';
import LoginGoogle from '../common/googleLogin';
import $ from "jquery";
var signupdata, path;
class LoginPopUp extends Component {
   //login
    // async loginPopUp(login,e){
    //     footer_loginModal(login,e);
    //     //signupdata = await footer_loginModal(login,e)
    //     // this.props.footerData(signupdata);
    // }
    
    constructor(props){
        super(props);
        path = '/forgot-password.html';
        let temp_path = window.location.href;
        temp_path = temp_path.split('beldara.com')[1];
        if (temp_path !== undefined && temp_path!=''){
            if (temp_path.trim() != '' && temp_path !== undefined)
                path+='?link='+temp_path;
            }
            this.otpForLogin = this.otpForLogin.bind(this);
    }
  
        
    loginPopUp = async (e) => {
        $("#otp_err").addClass('d-none');
        $("#otp_success").addClass('d-none');
        await footer_loginModal(this.props.login,e)
            .then(result => {
                this.props.footerData(result)
            }
        );
    }

    otpForLogin = async () => {
        $("#otp_spinner").removeClass('d-none');
        $("#otp_err").addClass('d-none');
        $("#otp_success").addClass('d-none');
        $("#otp_err").empty();
        $("#otp_success").empty();
        var username = $("#loginEmail").val();
        if(username != ''){
            await SendotpForLogin(username)
                .then(result => {
                    if(result == true){
                        $("#otp_success").append('OTP is sent to your email and mobile number. Please check and enter the OTP.').removeClass('d-none');
                        $("#otp_spinner").addClass('d-none');
                    }else{
                        $("#otp_err").append('Your email or mobile no. not exists for OTP Please Sign Up.').removeClass('d-none');
                        $("#otp_spinner").addClass('d-none');
                    }
                }
            );
        }else{
            $("#otp_err").append('Please enter valid your email or mobile no for OTP.').removeClass('d-none');
            $("#otp_spinner").addClass('d-none');
        }
    }

    render (){
        return (
            // <Modal open={this.props.login.login} onClose={!this.props.login.login} center className="cart-modal">
            <Modal open={this.props.login.login} onClose={() => ''} center className="cart-modal">
            
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title pr-2">Login</h3>

                    <h3 className="modal-title border-left pl-2"> <span className="text-success text-underline footer_signupModal signupModal" onClick={this.props.openSignUpModal}><u>Free Sign Up</u></span></h3>

                    <button type="button" className="close" onClick={this.props.closeModal}>&times;</button>
                </div>
                    <div className="modal-body modal1">
                        <div className="container-fluid p-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className="modal-bg addtocart">
                                    {/* <div className="modal-header">
                                        <h3 className="modal-title">Login</h3> onSubmit={() =>this.loginPopUp(this.props.login)}
                                        <button type="button" className="close" onClick={this.props.closeModal}>&times;</button>
                                    </div> */}
                                    <div className="modal-body">
                                    <form className="" method="post" action="" onSubmit={this.loginPopUp}>
                                        <div className="alert alert-danger alert-dismissible d-none" id="errFooterLogIn">
                                            <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                        </div>
                                        <div className="col-md-12">
                                        <div class="alert alert-warning d-none" id="otp_err" role="alert"></div>
                                        <div class="alert alert-success d-none" id="otp_success" role="alert"></div>
                                            <div className="has-float-label my-3">
                                                <input
                                                    type="text"
                                                    maxLength="60"
                                                    className="form-control"
                                                    placeholder=" "  required autoFocus autoComplete="off"
                                                    id="loginEmail"
                                                />
                                                <label htmlFor="loginEmail">
                                                    Enter your Email or Mobile No.
                                                </label>
                                            </div>

                                            <div className="has-float-label my-3">
                                                <input
                                                    type="password"
                                                    maxLength="30"
                                                    className="form-control"
                                                    placeholder=" "  required autoComplete="off" id="loginPass"
                                                />
                                                <label htmlFor="loginPass">
                                                    Enter your Password or OTP
                                                </label>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="form-group text-left text-danger col-3">
                                                    <button type="submit" className="btn btn-warning ">Login</button>
                                                </div>
                                                <div className="form-group text-right text-primary col-9">
                                                <div class="spinner-grow text-success d-none" role="status" id="otp_spinner" style={{width: '1rem',height: '1rem'}}>
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                    {/* <a onClick={this.otpForLogin}>Get OTP</a>  */}
                                                    <button type="button" onClick={this.otpForLogin} class="btn btn-link">Get OTP</button>or  <a target="_blank" href={`${SellerUrl+path}`}>Forgot Password?</a>
                                                </div>
                                            </div>
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
                                        <div className="text-center page-header">
                                        <label className="container-checkbox"> By signing up, you agree to our <u className="text-success modhover">
                                      <a href="https://beldara.com/terms-and-condition.html">Terms of Use</a>
                                      </u> and <u className="text-success modhover">
                                          <a href="https://beldara.com/privacy-policy.html">Privacy Policy.</a>
                                          </u>
                                    </label>
                                        </div>
                                        <div className="form-group text-center list-inline">
                                        <span>Don't have an account? </span><span className="text-success text-underline signupModal" onClick={this.props.openSignUpModal}><u>Sign Up</u></span>
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


        )

        }
}

export default LoginPopUp
