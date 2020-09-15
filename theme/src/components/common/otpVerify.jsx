import React, {Component} from 'react';
import $ from "jquery";
import axios from 'axios';
import ls from 'local-storage';


class OtpVerify extends Component {
    constructor(props){
        super(props);
        this.checkOtp = this.checkOtp.bind(this);
        this.state = {
            type: 2,
            otp: 1,
            otpCheck: 1,
            otpResult: 1
        }
    }

    checkOtp(event) {

        event.preventDefault();
        const otp = $('#otp').val();
        const plateform_type = 'web';
        const sellerid = ls.get('sellerid');

        try {
            axios.post("https://api.beldara.com/common/signupOtp.php",{otp:otp, plateform_type:plateform_type, sellerid:sellerid}, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
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
            <div>
            
                    <div className="container">
                    { this.state.otp == 0 ?
                        <div className="row">
                            <div className="col-12 alert alert-success otp_verification">
                                <h2>Please enter Otp to continue</h2>
                                <div className="form-label-group">
                                    <form onSubmit={this.checkOtp}>
                                        <input className='form-control' name='otp' id='otp' required></input>
                                    </form>
                                </div>
                            </div>
                        </div>
                : ''   }
                        <div className="row">
                            <div className="col-12 alert alert-success thank_you">
                               
                                { this.state.type == 0 ?
                                    <h2>Your Request is submitted succesfully</h2>
                               :
                                    <h2>Your Payment is successful</h2>

                                }
                                <div>
                                    <span className="btn btn-outline-primary">Go To Dashboard</span>
                                </div>
                            </div>
                        </div>
                    </div>
               
            </div>
        )
    }
}



export default OtpVerify;
