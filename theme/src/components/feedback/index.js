import React, { Component } from 'react'
import $ from 'jquery';
import ls from "local-storage";
import { ApiUrl } from '../../constants/ActionTypes';
import axios from 'axios';
import { withRouter } from 'react-router'
import './feedback.css';
var finalLead = [];
var finalbrid = [];
var brid;
class reqFeedback extends Component {
    constructor(props){
        super(props)
        this.state ={
            mode : 0,
            type : 0,
            listOfLead: []
        }
    }
    componentDidMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        brid = params.get('brid');
        var type = params.get('type');
        var mode = params.get('mode');
        if (mode && mode != ''){
            this.setState({
                mode: mode
            })
        }

        if (type && type != ''){
            this.setState({
                type: type
            })
        }
        if (ls.get('sellerid') && (mode == '1' || mode == '3' || mode == '2') ){
            axios.post(`${ApiUrl}/common/get_req_contact.php`,
            {
                security_token: "",
                plateform_type: "",
                sellerid: ls.get('sellerid'),
                brid: brid,
                type: type // 1 = ask for seller and 2 = buyer
            },
            { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(async response =>  {
                var name;
               
                if (response.data.statusId == 1){
                    console.log(response.data,52);
                    await this.setState({
                        listOfLead  : response.data.result
                    })
                    if (mode == '2'){
                        finalLead.push(this.state.listOfLead[0].leadid)
                        this.props.history.push({
                            pathname: "/requirement_comment.html",
                            state: {
                            mode: mode,
                            type: type,
                            brid: brid,
                            finalLead : finalLead,
                            finalbrid : brid
                            }
                        });
                    }
                }
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);
            });
        }
        // console.log(this.state,62,this.state.listOfLead);

        
    }

    leadSelected = (val, br_id) => {
        if (this.state.type == 2){
            $('#'+val).toggleClass('bg_gray');
            var idx = $.inArray(br_id, finalLead);
            if (idx == -1) {
                finalLead.push(val);
                finalbrid.push(br_id)
            } else {
                finalLead.splice(idx, 1);
                finalbrid.splice(idx, 1);
            }
        }else if (this.state.type == 1){
            if (this.state.mode == 1){
                $('.contact_list li').removeClass('bg_gray');
                $('#'+val).addClass('bg_gray');
                finalLead[0] = val;
                // console.log(finalLead,95);
            } else if (this.state.mode == 3){
                $('#'+val).toggleClass('bg_gray');
                var idx = $.inArray(val, finalLead);
                if (idx == -1) {
                    finalLead.push(val);
                } else {
                    finalLead.splice(idx, 1);
                }
            }
        }
    }

    continueComment  = () => {
        $('#not_loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').attr('disabled','');
        $('#loading').removeClass('d-none');
        $('#select_none').removeClass('d-none').addClass('d-none');
        // console.log('continueComment',finalLead,113);
        if (finalLead.length > 0){

            axios.post(`${ApiUrl}/common/capture_feedback.php`,
            {
                security_token: "",
                plateform_type: "",
                sellerid: ls.get('sellerid'),
                mode: this.state.mode, 
                brid: brid,
                type: this.state.type, // 1 = ask for seller and 2 = buyer
                finalLead: finalLead,
                finalbrid: finalbrid
            },
            { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
                
                this.loaders()
                
                if (response.data.statusId == 1){
                    
                    this.props.history.push({
                        pathname: "/requirement_comment.html",
                        state: {
                        mode: this.state.mode,
                        type: this.state.type,
                        brid: brid,
                        finalLead: finalLead,
                        finalbrid: finalbrid
                        }
                    });
                }else{
                    
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
            $('#select_none').removeClass('d-none').text('Please Select Any One To Continue.');
        }
    }

    loaders = () => {
        $('#not_loading').removeClass('d-none');
        $('#loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').removeAttr('disabled');
    }

    render() {
        const {listOfLead} = this.state;
        return (
            <div className="container-fluid bg_gray">
                <div className="row">
                    <div className="col-12">
                        <div className="container bg-light my-3 w-75">
                            <div className="row">
                                <div className="col-12">
                                    { this.state.mode == 1 && this.state.type == 1?
                                        <div className="my-3 h6">Please select from the option with whom you closed the deal.</div>
                                    :  this.state.mode == 3 && this.state.type == 1?
                                        <div className="my-3 h6">Please select the requirement which you've completed.</div>
                                    :  this.state.mode == 1 && this.state.type == 2?
                                        <div className="my-3 h6">Please select from the option with whom you closed the deal.</div>
                                    :  this.state.mode == 3 && this.state.type == 2?
                                        <div className="my-3 h6">Please select the requirement which you've completed.</div>
                                    :  ''
                                    }
                                    <div className="contact_list_wrapper">
                                        <ul className="list-group list-group-flush contact_list">
                                            {listOfLead.length > 0 ?
                                                this.state.type == '1' 
                                                ? listOfLead.map((val, index) => 
                                                    <li key={index} className="list-group-item mouse_pointer" id={val.leadid} onClick={() => this.leadSelected(val.leadid, val.brid)}>{val.name}</li>
                                                    )  
                                                : listOfLead.map((val, index) => 
                                                    <li key={index} className="list-group-item mouse_pointer" id={val.leadid} onClick={() => this.leadSelected(val.leadid, val.brid)}>{val.buyer_name}</li>
                                                    )
                                            
                                            : ''}
                                        </ul>
                                    </div>
                                    <div className="my-3 card-text text-right mb-5">
                                        <div id="select_none" className="d-none alert alert-danger"> Select atleast one to continue </div>
                                        <button id="btn_loading" className="btn btn-solid" onClick={this.continueComment}>
                                            <div id="loading" className=" spinner-border d-none" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <div id="not_loading">CONTINUE</div>
                                        </button>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(reqFeedback);