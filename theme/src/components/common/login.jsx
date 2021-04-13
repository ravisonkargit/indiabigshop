import React, { Component } from 'react'
import './login.css';
import $ from 'jquery'
import axios from "axios";
import ls from "local-storage";
import SimpleReactValidator from "simple-react-validator";
import { setCookie, getCookie, captureEvent, SendotpForLogin } from '../../functions';
import store from '../../store';
import { getLoggedIn } from '../../actions';
import { Redirect } from 'react-router';
import { withRouter } from "react-router-dom";

var c;
class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: null,
            pass:null,
            sellerid:getCookie('mhinpbn'),
            type: 0,
            link: '',
            totalCartValue: '',
            totalProductCost: '',
            totalShippingCost: '',
            finalShippingCost: '',
            cartItems: '',
            countryName: '',
            symbol: '',
            cartid: '',
            pixeldata: '',
            shippingCharges: '',
            inrValue: ''
        }
        this.validator = new SimpleReactValidator();
        this.otpForLogin = this.otpForLogin.bind(this);
    }

    otpForLogin = async () => {
        $("#otp_spinner").removeClass('d-none');
        $("#otp_err").addClass('d-none');
        $("#otp_success").addClass('d-none');
        $("#otp_err").empty();
        $("#otp_success").empty();
        var username = $("#inputEmail").val();
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

    componentDidMount = async () => {
      console.log(this.props,'render');
      if (this.props.location.state.type){
        await this.setState({
          type: this.props.location.state.type
        })
      }

      if (this.props.location.state.link)
        await this.setState({
          link: this.props.location.state.link
        })

      
      if (this.props.location.state.totalCartValue)
        await this.setState({
          totalCartValue: this.props.location.state.totalCartValue
        })

      if (this.props.location.state.totalProductCost)
        await this.setState({
          totalProductCost: this.props.location.state.totalProductCost
        })
      
      if (this.props.location.state.totalShippingCost)
        await this.setState({
          totalShippingCost: this.props.location.state.totalShippingCost
        })   

      if (this.props.location.state.finalShippingCost)
        await this.setState({
          finalShippingCost: this.props.location.state.finalShippingCost
        })  

      if (this.props.location.state.cartItems)
        await this.setState({
          cartItems: this.props.location.state.cartItems
        })  

      if (this.props.location.state.countryName)
        await this.setState({
          countryName: this.props.location.state.countryName
        })  

      if (this.props.location.state.symbol)
        await this.setState({
          symbol: this.props.location.state.symbol
        }) 

        if (this.props.location.state.cartid)
        await this.setState({
          cartid: this.props.location.state.cartid
        })   

        if (this.props.location.state.pixeldata)
        await this.setState({
          pixeldata: this.props.location.state.pixeldata
        }) 

        if (this.props.location.state.shippingCharges)
        await this.setState({
          shippingCharges: this.props.location.state.shippingCharges
        }) 

        if (this.props.location.state.inrValue)
        await this.setState({
          inrValue: this.props.location.state.inrValue
        }) 
    }

    setStateFromInput = async event => {
        var obj = {};
        obj[event.target.name] = event.target.value;
        await this.setState(obj);
    };
    loginSubmit = (e) => {
        e.preventDefault()
        $(".error").addClass('d-none').removeClass('d-block alert alert-danger')

        if (this.validator.allValid()) {
            // $(".chkValidate").select().css({border:'none'})
              axios.post(
              "https://api.indiabigshop.com/common/signin_demo.php",
              {
                security_token: "",
                plateform_type: "",
                email: this.state.email,
                pass: this.state.pass,
                type:"signin",
                visiterid:getCookie('mhinpbnb')
              },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
            //   response.data.result; 
              if (response.data.status === 'Failed') {
                //console.log(response.data)
                $(".error").html(response.data.message).addClass('d-block alert alert-danger').removeClass('d-none')
              }
              else {
                setCookie('mhinpbn', response.data.result.sellerid, '365')
                // axios.post("https://api.beldara.com/common/map_cart.php",{
                //       security_token: "",
                //       plateform_type: "",
                //       sellerid: response.data.result.sellerid,
                //       visitorid: response.data.result.visitorid,
                //       old_visitorid: getCookie('mhinpbnb')
                //     },
                //     { headers: { "Content-Type": "multipart/form-data" } }
                // ).then(response => {
                  
                  this.gotoCart()
                // }).catch(error => {
                //   this.gotoCart()
                //     const result = error.response;
                //     return Promise.reject(result);
                //   });
              }
            })
            .catch(error => {
              const result = error.response;
              return Promise.reject(result);
            });
          } else {
            this.setState({
              addNotValid: 1
            })
            $(".chkValidate").click()
            $(".chkValidate").css({ border: '1px solid red' })
            this.validator.showMessages();
            // rerender to show messages for the first time
            this.forceUpdate();
          }
    }

    gotoCart = () => {
      console.log('gotoCart ', this.state.link)
      captureEvent(
        "login",
        "login",
        'login',
        'map_cart',
        ls.get("sellerid"),
        getCookie("mhinpbnb")
      );
        
        store.dispatch(getLoggedIn())
        
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
            inrValue: this.state.inrValue
          }
        });

    }

    gotoRegister = () => {
      this.props.history.push({
        pathname: '/register.html',
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
          inrValue: this.state.inrValue
        }
      });
    }

    render() {
        var url_string = window.location.href; //window.location.href
        var url = new URL(url_string);
        c = url.searchParams.get("url");
        // console.log(c);
        if (!c) {
            c = ''
        }
        return (
            <React.Fragment>
                {
                  this.state.sellerid ? 
                      <Redirect to={{ pathname: '/'+c, state: {  }}}/>
                  : ''
                }
                <div className="body" >
                 <form className="form-signin" onSubmit={this.loginSubmit}>
                    <div className="text-center mb-4">
                        <img className="mb-4" src="/assets/images/icon/logo/beldara_logo.png" alt="Beldara.com" width="172" height="50" />
                    </div>
                    <p className="error d-none"></p>
                    <div class="alert alert-warning d-none" id="otp_err" role="alert"></div>
                    <div class="alert alert-success d-none" id="otp_success" role="alert"></div>
                    <div className="form-label-group">
                        <input type="text" id="inputEmail" className="form-control" placeholder="Email address" required="" autoComplete="off" name="email" onChange={this.setStateFromInput} />
                            <label for="inputEmail">Email address / Mobile</label>
                            {this.validator.message(
                                "email / mobile no.",
                                this.state.email,
                                `required|string`
                              )}
                    </div>

                    <div className="form-label-group">
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" autoComplete="off" required="" name="pass" onChange={this.setStateFromInput}/>
                            <label for="inputPassword">Password</label>
                            {this.validator.message(
                                  "Password",
                                  this.state.pass,
                                  `required|string`
                                )}
                                <button type="button" onClick={this.otpForLogin} class="btn btn-link" style={{marginLeft: '74%'}}>Get OTP</button>
                                <div class="spinner-grow text-success d-none" role="status" id="otp_spinner" style={{width: '1rem',height: '1rem',marginLeft: '83%'}}>
                                    <span class="sr-only">Loading...</span>
                                </div>
                        </div>
                    <div className="form-group text-center">
                        
                            <button className="btn btn-lg btn-primary btn-block text-capitalize" style={{ backgroundColor: '#f5821f', border: '1px solid #f5821f' }} type="submit">Sign in</button>
                            
                        </div>
                    <p className="text-dark">By continuing, you agree to Beldara's <a href="/t" target="_blank">Conditions of Use</a> and <a href="" target="_blank">Privacy Notice.</a> </p>
                    <div className="a-divider a-divider-break"><h5>New to Beldara?</h5></div>
                        <p>
                          <div className="form-group text-center">
                                {/* <a className="btn btn-lg btn-primary btn-block text-capitalize" href="/register.html" style={{backgroundColor:'#00aeef',border:'1px solid #00aeef'}} type="">Create your Beldara Account</a> */}
                                <span className="btn btn-lg btn-primary btn-block text-capitalize" onClick={() => this.gotoRegister()} style={{backgroundColor:'#00aeef',border:'1px solid #00aeef'}} type="">Create your Beldara Account</span>
                            </div> 
                        </p>
                        <p className="mt-5 text-center">
                            © 2019, Beldara.com, All rights reserved.
                        </p>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Login);