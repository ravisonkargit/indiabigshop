import React, { Component } from 'react';
import Modal from "react-responsive-modal";
import { getCookie } from "../../functions";
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class PopUpNotPaid extends Component{

    constructor(props){
        super(props)
        this.subscribe = this.subscribe.bind(this)
    }

    componentDidMount(){
        console.log(this.props)
    }

    componentDidUpdate(){
        console.log(this.props)
    }

    subscribe(){
        window.location.href = '/membership.html'
    }

    render() {
        const { translate } = this.props;
        return (
          <Modal
            open={this.props.isPopUpNotPaid}
            onClose={() => ""}
            center
            className="cart-modal"
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title"> Subscribe To Prime Membership  </h3>
                  <button
                    type="button"
                    className="close"
                    onClick={this.props.closeModalPaid}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body modal1">
                  <div className="container-fluid p-0">
                    <div className="row">
                      <div className="col-12">
                        <div className="modal-bg addtocart">
                          <div className="modal-body">
                           
                            { getCookie('currency') == 'USD' ?
                            this.props.sameReqData.r_text_usd
                            :
                            this.props.sameReqData.r_text_inr
                            }

                            <span 
                            className="w-100 p_4 btn btn-solid mouse_pointer d-inline" 
                            onClick={this.subscribe}>
                                {translate('Subscribe Now')}
                            </span>
    
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </Modal>
        );
      }

}

export default withTranslate(PopUpNotPaid);