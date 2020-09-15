import React, { Component } from "react";
// import "./signUpPopUp.css";
import Modal from "react-responsive-modal";
import { footer_signupModal } from "../../functions";
import "react-intl-tel-input/dist/main.css";
import ls from "local-storage";
import $ from 'jquery';
import { apiUrl } from '../../constants/variable';
import axios from "axios";

// signup
var type, number, isoValue, dialCode, country, countryName;
class AcceptBid extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bid: "",
        remark: '',
        brid: '',
        unit: '',
        qty: ''
    }
  }

  componentDidUpdate = async () => {
    if (this.state.brid != this.props.getBid.bridBid){
      await this.setState({
        brid: this.props.getBid.bridBid
      })
    }
    if (this.state.unit != this.props.getBid.unit){
      await this.setState({
        unit: this.props.getBid.unit
      })
    }
    if (this.state.qty != this.props.getBid.qty){
      await this.setState({
        qty: this.props.getBid.qty
      })
    }
  }

  signupPopUp = async e => {
    e.preventDefault()
    
    if (type) {
      await footer_signupModal(number, isoValue, dialCode, countryName, e);
    } else {
      $("#errFooterSignUp").css({ display: "block" }).text("Enter Valid Number");
      // $("#error_text").text("Enter Valid Number");
    }
  };

  onChange = (err, no, data) => {
    type = err;
    number = no;
    isoValue = data.iso2;
    dialCode = data.dialCode;
    countryName = data.name.replace(/ *\([^)]*\) */g, "");
  };

  setStateFromInput = async event => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    await this.setState(obj);

    if (this.state.qty > 0 && this.state.bid > 0){
      const total_amount = this.state.qty * this.state.bid
    await this.setState({
      total: total_amount.toFixed(2)
    })
  }

};

  placeBid = () => {
    $('#not_loading').removeClass('d-none').addClass('d-none');
    $('#btn_loading').attr('disabled','');
    $('#loading').removeClass('d-none');
    $('.bid_error').addClass('d-none').text('');

    if (this.state.bid && this.state.remark && this.state.bid !='' && parseFloat(this.state.bid) > parseFloat(0) && this.state.remark != '') {
    axios.post(`${apiUrl}/create_bid.php`,
    {
        security_token: "",
        plateform_type: "",
        price: this.state.bid,
        remark: this.state.remark,
        sellerid: ls.get('sellerid'),
        brid: this.state.brid
    },
    { headers: { "Content-Type": "multipart/form-data" } }
    )
    .then(response => {
        if (response.data.statusId == 1){
          $('.bid_error').addClass('d-none').text('');
          this.loaders()
          this.props.bidSubmitted(this.state.brid)
        }else{
          $('.bid_error').removeClass('d-none').text('Something Went Wrong Please try again later!');
          this.loaders()
        }
    })
    .catch(error => {
        $('.bid_error').removeClass('d-none').text('Something Went Wrong Please try again later!');
        this.loaders()
    
        const result = error.response;
        return Promise.reject(result);
    });
}else{
    this.loaders()
    $('.bid_error').removeClass('d-none').text('Please fill valid details to submit Bid!');
}

}

loaders = () => {
    $('#not_loading').removeClass('d-none');
    $('#loading').removeClass('d-none').addClass('d-none');
    $('#btn_loading').removeAttr('disabled');
}

  render() {
    return (
      <Modal
        open={this.props.getBid.getBid}
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
              <h3 className="modal-title"> Enter Competitive Bid: </h3>
              <button
                type="button"
                className="close"
                onClick={this.props.closeModal}
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
                        {/* <form
                          action=""
                          id="first_tab"
                          onSubmit={this.signupPopUp}
                        > */}
                        
                          <div className="col-md-12">
                            <div
                              className="alert alert-danger"
                              id="errFooterSignUp"
                            >
                              <a
                                href="#"
                                className="close"
                                id="error_text"
                                data-dismiss="alert"
                                aria-label="close"
                              >
                                &times;
                              </a>
                            </div>
                            <div>
                              
                              
                              <div className="has-float-label my-3">
                                <input
                                  type="tel"
                                  className="form-control"
                                  id="bid"
                                  name = "bid"
                                  placeholder=" "
                                  value={this.state.bid}
                                  required
                                  autoFocus
                                  autoComplete="off"
                                  onChange={this.setStateFromInput}
                                />
                                <label htmlFor="bid">
                                  Bid Amount 
                                  { this.props.getBid.unit && this.props.getBid.unit !=''?
                                    ' / ' + this.props.getBid.unit
                                    :''
                                  }
                                  { this.props.getBid.currency && this.props.getBid.currency !=''?
                                    '(in '+ this.props.getBid.currency + ' ) '
                                    :''
                                  }
                                </label>
                              </div>
                            </div>

                            <div>
                              {
                                this.state.total > 0?
                                <div  className="small text-dark">
                                  
                                    Total: {this.props.getBid.currency? this.props.getBid.currency : ''}  {this.state.total}
                                    
                                </div>
                                : ''
                              }
                            </div>
                            

                            <div className="has-float-label my-3">
                              <textarea type="text" id="remark" 
                              onChange={this.setStateFromInput}
                            //   onClick={(value) => this.remarkEntered(value)}
                               name="remark" placeholder=" " className="form-control" required autoComplete="off"></textarea>
                              <label htmlFor="remark">
                                Remark
                              </label>
                            </div>
                          </div>

                          
                        <div className="clearfix"></div>
                      
                          {/* <div className="col-md-12 col-sm-12 col-xs-12 text-center form-group">
                            <button onClick={() => this.placeBid()} className="btn btn-warning">
                              Submit
                            </button>
                          </div> */}

                          <div className="col-12 my-1 card-text text-right">
                            <div className="bid_error alert alert-danger d-none" >Please fill all valid details to submit Bid!</div>
                            <button onClick={() => this.placeBid()} id="btn_loading" className="btn btn-solid">
                                <div id="loading" className=" spinner-border d-none" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div id="not_loading">Submit Bid</div>
                            </button>  
                        </div>
                       
                        {/* </form> */}
                        
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
    );
  }
}
export default AcceptBid;
