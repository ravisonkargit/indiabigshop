import React, { Component } from 'react'
import axios from 'axios';
import { ApiUrl } from '../../constants/ActionTypes';
import ls from "local-storage";
import $ from 'jquery';
import { withTranslate } from "react-redux-multilingual";
import './feedback.css';

var brid;
var finalLead = [];
var finalbrid = [];
class reqFeedbackComment extends Component {

    constructor(props){
        super(props)
        this.state ={
            mode : 0,
            type : 0
        }
    }

    componentDidMount = async () => {
        // console.log(this.props,23);
        if (this.props.location.state){
            await this.setState({
                mode: parseFloat(this.props.location.state.mode),
                type: parseFloat(this.props.location.state.type)
            })
            if (this.props.location.state.brid)
                brid = this.props.location.state.brid

            if (this.props.location.state.finalLead)
                finalLead = this.props.location.state.finalLead

            if (this.props.location.state.finalbrid)
                finalbrid = this.props.location.state.finalbrid
                
        }

        let search = window.location.search;
        let params = new URLSearchParams(search);
        
        if (params.get('brid') && params.get('brid') != '')
            brid = params.get('brid');

        var type = params.get('type');
        var mode = params.get('mode');

        if (mode && mode != ''){
            await this.setState({
                mode: mode
            })
        }

        if (type && type != ''){
            await this.setState({
                type: type
            })
        }

        
    }

    submitComment = () => {
        
        $('#not_loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').attr('disabled','');
        $('#loading').removeClass('d-none');
        $('#select_none').addClass('d-none');
        let comment_feedback = $('#reqComment').val();

        if (comment_feedback && comment_feedback != '' && comment_feedback !== undefined && comment_feedback !== null){
            
            axios.post(`${ApiUrl}/common/capture_comments.php`,
            {
                security_token: "",
                plateform_type: "",
                sellerid: ls.get('sellerid'),
                mode: this.state.mode, 
                brid: brid,
                type: this.state.type, // 1 = ask for seller and 2 = buyer
                finalLead: finalLead,
                finalbrid: finalbrid,
                comments:comment_feedback
            },
            { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
                this.loaders()
                // console.log(response.data,89);
                if (response.data.statusId == 1){
                    $('#select_none').removeClass('d-none').addClass('d-none');
                    this.props.history.push({
                        pathname: "/thankyou.html",
                        state: {
                        type: 5+parseInt(this.state.type),
                        otp: 1,
                        otpCheck: 1,
                        error: 0
                        }
                    });
                    
                }else{
                    this.loaders()
                    $('#select_none').removeClass('d-none').text('Something Went Wrong! Please try again.');
                }
            })
            .catch(error => {
                this.loaders()
                $('#select_none').removeClass('d-none').text('Something Went Wrong! Please try again.');
                const result = error.response;
                return Promise.reject(result);
            });
        }else{
            this.loaders()
            $('#select_none').removeClass('d-none').text('Please Enter Comments To Continue');
        }
    }

    loaders = () => {
        $('#not_loading').removeClass('d-none');
        $('#loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').removeAttr('disabled');
    }


//     this.state.mode == '1' && this.state.type == '1' ?
//     <div>Thanks for choosing your option. Let us know about your business deal.</div>
// : this.state.mode == '3' && this.state.type == '1' ?
//     <div>Thanks for choosing your option. Let us know about your business deal.</div>
// :this.state.mode == '1' && this.state.type == '2' ?
//     <div>Thanks for choosing your option. Let us know about your business deal.</div>
// : this.state.mode == '3' && this.state.type == '2' ?
//     <div>Thanks for choosing your option. Let us know about your business deal.</div>
// :

    render() {
        const {translate} = this.props;
        return (
            <div className="container-fluid bg_gray">
                <div className="row  d-flex justify-content-center">
                    <div className="col-12 col-sm-12 col-md-6 bg-light mt-3 mb-3">
                        { this.state.mode == '2'?
                            <div className="my-3 h6">We understand your feeling. Let us know what went wrong so to serve you better from the next time.</div>
                        : <div className="my-3 h6">Thanks for choosing your option. Let us know about your business deal.</div>}
                        
                        <div className="has-float-label mt-3">
                            <textarea className="form-control" placeholder=" " name="reqComment" id="reqComment" rows="4" defaultValue={``} required></textarea>
                            <label htmlFor="reqComment">{`${translate('Write Your Feedback here')}...`}</label>
                        </div>

                        <div className="my-3 card-text text-right mb-5">
                        <span id="select_none" className="d-none"> Select atleast one to continue </span>
                            <button id="btn_loading" className="btn btn-solid" onClick={this.submitComment}>
                                <div id="loading" className="spinner-border d-none" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div id="not_loading">CONTINUE</div>
                            </button>  
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslate(reqFeedbackComment);