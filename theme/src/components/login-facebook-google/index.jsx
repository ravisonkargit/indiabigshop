import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// import './loginPopUp.css';
// import Modal from 'react-responsive-modal';
// import { SellerUrl} from '../../constants/ActionTypes'
// import {footer_loginModal} from '../../functions';
// import { getLoggedIn } from '../../actions'
// import store from '../../store';
// import { connect } from 'react-redux'
import GoogleLogin from 'react-google-login';

class GoogleFacebookLogin extends Component {
    render() {
        const responseGoogle = (response) => {
            console.log(response)
          }
           return (
               <div>
                    <GoogleLogin
                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
               </div>
           )
       }
   }
   
   export default GoogleFacebookLogin