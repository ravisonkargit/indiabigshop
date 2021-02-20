import React, { Component } from 'react'
import * as types from '../../constants/ActionTypes'
import ls from 'local-storage'
import {setCookie, getCookie} from '../../functions'
import $ from 'jquery'
import * as constantType from '../../constants/variable'
import { withTranslate } from 'react-redux-multilingual'
import Modal from 'react-responsive-modal'
import { isMobile } from "react-device-detect"


class index extends Component {
    constructor(props){
        super(props);
        this.state = {
            // isInterested:false
        }
        this.allowPopuptoOpen = this.allowPopuptoOpen.bind(this)
    }
    componentDidMount = async () => {
        // console.log('componentWillReceiveProps')
    }
    componentWillReceiveProps(){
    }
    componentDidUpdate(){
    }
    allowPopuptoOpen = () => {
        import('../firebase/cloud-messaging').then(module => {
            this.props.closemodal()
        })
    }
    render() {

        return (
            <div>
                <Modal open={this.props.open.allowNotifcationPopup} onClose={() => ''} center className="cart-modal">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body modal1">
                                    <div className="container-fluid p-0">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="modal-bg addtocart">
                                                <div className="modal-body justify-content-center text-center">
                                                <h3>Get update about latest offers</h3>
                                                            <h6>Allow push notification to remain updated with lattest offers</h6>
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex justify-content-start">
                                                                    <button onClick={this.props.closemodal} className="btn btn-secondary" style={{padding: "10px 10px 10px 10px",borderRadius: "4px"}}>Not Now</button>
                                                                </div>
                                                                <div className="d-flex justify-content-end">
                                                                    <button onClick={this.allowPopuptoOpen} className="btn btn-solid">I'm intersted</button>
                                                                </div>
                                                            </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                </Modal>
            </div>
        )
    }
}
// export default index;
export default index;



/* <h3>Get updates about Fresh designs</h3>
                                                            <h6>Allow push notifications to remain updated with latest designs</h6>
                                                            <div className="justify-content-around">
                                                                <div className="foat-left">
                                                                    <button className="btn btn-secondary">Not Now</button>
                                                                </div>
                                                                <div className="foat-right">
                                                                    <button className="btn btn-solid">I'm intersted</button>
                                                                </div>
                                                            </div> */