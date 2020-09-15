import React, { Component } from 'react'
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ls from "local-storage";
import * as variable from "../../constants/variable";
import axios from "axios";
import Select from "react-select";
import * as types from "../../constants/ActionTypes";
import { isMobile } from "react-device-detect";
import $ from "jquery";
import { captureEvent, getCookie, showToast } from "../../functions";
import LoadingComponent from "../products/common/loading-bar";

class index extends Component {
    
    render() {
        const backgroundImagestyle = {
            backgroundImage:`url('https://img.beldara.com/images/mobile_background_image.jpg')`,
            backgroundRepeat:'no-repeat',
            backgroundSize:'cover'
        }
        const div_style={
            height:'-webkit-fill-available'
        } 
        const calcFont = {
            fontSize:'3.0rem'
        }
        return (
            <div>
                <div className="container-fluid" style={backgroundImagestyle}>
                {/* <img src="https://img.beldara.com/images/mobile_background_image.jpg" style={{visibility:'hidden'}} /> */}
                    <div className="row align-items-center px-5" style={div_style}>
                        <div className="col-md-8">
                            <h2 className="text-white text-capitalize h3">Take your business on the go</h2>
                            <h2 className="text-white text-capitalize" style={calcFont}> with the Beldara.com App</h2>
                            <div className="d-flex col-md-3 justify-content-aroud my-5">
                                <div className="float-left mr-5">
                                    <a href="https://apps.apple.com/us/app/beldara-b2b-marketplace/id1455069486?ls=1" target="_blank"><img src="https://img.beldara.com/images/ios_mobile_logo.png"/></a>
                                </div>
                                <div className="float-right mr-5">
                                    <a href="https://play.google.com/store/apps/details?id=app.beldara.com" target="_blank"><img src="https://img.beldara.com/images/android_mobile_logo.png"/></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default index
