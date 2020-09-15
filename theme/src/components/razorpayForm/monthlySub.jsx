import React, { Component } from 'react';
import $ from 'jquery'
import { connect } from 'react-redux';
import axios from 'axios';
import ls from "local-storage";
import { localhost } from '../../constants/variable';
import { ImgUrl, ApiUrl } from '../../constants/ActionTypes';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from "react-router-dom";

var sellerid, currency;
class MonthlySub extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currency: ''
        }
        this.openCheckout = this.openCheckout.bind(this);
        this.processTranscation = this.processTranscation.bind(this);
    }
    componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }
    openCheckout() {
        if (this.props.readTnc === false)
            this.props.readTncThenBuy()
        else {
            let sellerid = ls.get('sellerid')
            let package_id = this.props.package_id
            
            if (ls.get('sellerid')) {
                if (this.props.currency === 'INR') {
                    currency = this.props.currency;
                }
                else {
                    currency = this.props.currency;
                }
                let passData = {
                    currency: currency,
                    sellerid: ls.get('sellerid'),
                    amount: this.props.amount
                }
                axios.post(
                    `${localhost}/api/membership/createSubscription`,
                    passData
                )
                .then(async response => {
                    if (response.status === 201) {
                        window.location.reload()
                    }
                    console.log(response)
                    let data = response.data
                    let mobile = this.props.user.mobile
                    let email = await this.props.user.email
                    let name = this.props.user.name
                    let options = {
                        "key": data.key_id,
                        "subscription_id": data.subscription_id,
                        "name": "Beldara.com",
                        "description": "Beldara Monthly Subscription",
                        "image": "https://img.beldara.com/images/BelDara-logo.png",
                        "handler": function (response) {
                            console.log(response)
                            let passData = {
                                payment_id: response.razorpay_payment_id,
                                subscription_id: response.razorpay_subscription_id,
                                package_id: package_id,
                                sellerid: localStorage.getItem('sellerid')
                            }
                            axios.post(
                                `${localhost}/api/membership/successSubscription`,
                                passData
                            ).then(async response => {
                                console.log(response)
                                axios.post(
                                    `${ApiUrl}/common/send_invoice.php`,
                                    passData, { headers: { "Content-Type": "multipart/form-data" } }
                                ).then(async response => {
                                    // if(response.data) {}
                                    window.location.reload()
                                    console.log(response)
                                })
                                .catch(error => {
                                    const result = error.response;
                                    return Promise.reject(result);
                                })
                            })
                            .catch(error => {
                                const result = error.response;
                                return Promise.reject(result);
                            })
                        },
                        "prefill": {
                            "name": name,
                            "email": email,
                            "mobile": mobile
                        },
                        "theme": {
                            "color": "#F37254"
                        }
                    };
                    let rzp = new window.Razorpay(options);
                    rzp.open();
                })
                .catch(error => {
                    console.log('error', error)
                    const result = error.response;
                    return Promise.reject(result);
                });

            }
            else {
                this.props.openLoginModal()
            }
        }
    }
    processTranscation(){
        if (this.props.readTnc === false)
            return this.props.readTncThenBuy()
            console.log('monthly sub', ls.get('sellerid'))
            if (ls.get('sellerid')){
        let passData = {
            name: this.props.user.name,
            email: this.props.user.email,
            mobile: this.props.user.mobile,
            sellerid: ls.get('sellerid') ? JSON.parse(ls.get('sellerid')) : ls.get('sellerid')
        }
       
        axios.post(
            `${localhost}/api/membership/emandate/createCustomerId`,
            passData,
            {headers:{'Content-Type':'application/json'}}
        )
        .then(async response => {
            console.log(response)
            // this.props.history.push('/processtranscation');
            window.location.href = '/processtranscation' + '/'+response.data.id;
            // this.props.history.push({
            //     pathname: '/processtranscation' + '/'+response.data.id,
            // });
            // let data = {
            //     currency: this.props.currency,
            //     amount: this.props.amount,
            //     customer_id: response.data.id
            // }
            // axios.post(
            //     `${localhost}/api/membership/createOrder`,
            //     data,{headers:{'Content-Type':'application/json'}}
            // )
            // .then(async response => {
            //     console.log(response)
            // })
            // .catch(error => {
            //     const result = error.response;
            //     return Promise.reject(result);
            // });

        }) 
        .catch(error => {
            const result = error.response;
            return Promise.reject(result);
        });
    }else {
        this.props.openLoginModal()
    }
    }
    

    render() {
        console.log(this.props)
        return (
            <div className="justify-content-center text-center">
                {
                    // this.state.redProTrans && 
                    // <Redirect to="/processTranscation"
                }
                {/* <button className="btn getLogin" onClick={this.openCheckout} id="monthly-subs">
                    Choose Monthly Subscription
                </button> */}
                <button className="btn getLogin" onClick={this.processTranscation} id="monthly-subs">
                    Choose Monthly Subscription
                </button>
                {/* <Link to='/login' params={{ type: "order" }}>
                    <button className="btn getLogin" id="monthly-subs">
                        Choose Monthly Subscription
                    </button>
                </Link> */}
                {/* <div id="monthly"></div> */}

            </div>
        )
    }
}

const mapStateToProps = state => ({
    currency: state.data.symbol,
    user: state.user.user
});

export default withRouter(connect(mapStateToProps)(MonthlySub));