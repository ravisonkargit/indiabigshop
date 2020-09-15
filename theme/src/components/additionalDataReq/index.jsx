import React, { Component } from 'react'
import $ from 'jquery';
import ls from "local-storage";
import '../feedback/feedback.css';
import axios from 'axios';
import { ApiUrl } from '../../constants/ActionTypes';
var req = 'Monthly';
var loc = 'Any';
var purpose = 'Resale';
var supplier = 'Any';
export default class index extends Component {

constructor(props){
    super(props)
    this.state = {
        otp: this.props.location.state.otp,
        type: this.props.location.state.type,
        error: this.props.location.state.error,
        otpCheck: this.props.location.state.otpCheck
    }
}

    location = (e, val) => {
        const id = e.target.id
        $('.supplier_loc li').removeClass('bg_gray');
        if (loc == val){
            loc = ''
        }else{
            $('#'+id).addClass('bg_gray');
            loc = val;
        }
    }

    requirement = (e, val) => {
        const id = e.target.id
        $('.repeat_req li').removeClass('bg_gray');
        if (req == val){
            req = ''
        }else{
            $('#'+id).addClass('bg_gray');
            req = val;
        }
    }

    purpose = (e, val) => {
        const id = e.target.id;

        $('.purpose li').removeClass('bg_gray');
        if (purpose == val){
            purpose = ''
        }else{
            $('#'+id).addClass('bg_gray');
            purpose = val;
        }
    
    }

    supplier = (e, val) => {
        const id = e.target.id
        
        $('.preferred_sup li').removeClass('bg_gray');
        if (supplier == val){
            supplier = ''
        }else{
            $('#'+id).addClass('bg_gray');
            supplier = val;
        }

    }

    continueComment  = () => {
        $('#not_loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').attr('disabled','');
        $('#loading').removeClass('d-none');
        
        axios.post(`${ApiUrl}/common/add_additional_req_data.php`,
        {
            security_token: "",
            plateform_type: "",
            sellerid: ls.get('sellerid'),
            req: req,
            loc: loc,
            purpose: purpose,
            supplier: supplier,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
            
            this.loaders()
            this.props.history.push({
                pathname: "/thankYou.html",
                state: {
                mode: this.state.otp,
                type: this.state.type,
                otpCheck: this.state.otpCheck,
                error: this.state.error
                }
            });
        })
        .catch(error => {
            this.loaders()
        
            const result = error.response;
            return Promise.reject(result);
        });

    }

    loaders = () => {
        $('#not_loading').removeClass('d-none');
        $('#loading').removeClass('d-none').addClass('d-none');
        $('#btn_loading').removeAttr('disabled');
    }

    render() {
        return (
            <div className="container-fluid bg_gray">
                <div className="row">
                <div className="col-12 alert alert-success text-center p-2 mb-1">
                    Thank You! Your Request is submitted successfully. Please provide (optional) additional information for your requirement to help us serve you better.
                </div>
                    <div className="col-12">
                        <div className="container w-75">
                            <div className="row">
                            
                                {/* <div className="col-12"> */}
                                    
                                    <div className="col-md-5 bg-light col-sm-12 contact_list_wrapper mt-2 px-1">
                                        <div className="mt-2">Repeat Requirement: (select any one)</div>
                                        <ul className="list-group list-group-flush contact_list repeat_req my-1" >
                                            <li className="list-group-item mouse_pointer p-1" id={'One_Time'} onClick={(e) => this.requirement(e,'One Time')}>{'One Time'}</li>
                                            <li className="list-group-item mouse_pointer bg_gray p-1" id={'Monthly'} onClick={(e) => this.requirement(e,'Monthly')}>{'Monthly'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Weekly'} onClick={(e) => this.requirement(e,'Weekly')}>{'Weekly'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Quarterly'} onClick={(e) => this.requirement(e,'Quarterly')}>{'Quarterly'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Year'} onClick={(e) => this.requirement(e,'Year')}>{'Year'}</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="col-md-1 d-md-block d-sm-none col-sm-0"></div>

                                    <div className=" col-md-5  bg-light  col-sm-12 contact_list_wrapper mt-2 px-1">
                                        <div className="mt-2">Supplier Location: (select any one)</div>
                                        <ul className="list-group list-group-flush contact_list supplier_loc my-1">
                                            <li className="list-group-item mouse_pointer bg_gray p-1" id={'Any'} onClick={(e) => this.location(e,'Any')}>{'Any'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Within_City'} onClick={(e) => this.location(e,'Within City')}>{'Within City'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Within_State'} onClick={(e) => this.location(e,'Within State')}>{'Within State'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Within_Country'} onClick={(e) => this.location(e,'Within Country')}>{'Within Country'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Global'} onClick={(e) => this.location(e,'Global')}>{'Global'}</li>
                                        </ul>
                                    </div>

                                    <div className="col-md-1 d-md-block d-sm-none col-sm-0"></div>

                                    <div className="col-md-5 bg-light  col-sm-12 contact_list_wrapper mt-2 px-1">
                                        <div className="mt-2">Preferred Supplier: (select any one)</div> 
                                        <ul className="list-group list-group-flush contact_list preferred_sup my-1">
                                            <li className="list-group-item mouse_pointer bg_gray p-1" id={'Any'} onClick={(e) => this.supplier(e,'Any')}>{'Any'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Exporter'} onClick={(e) => this.supplier(e,'Exporter')}>{'Exporter'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Manufacturer'} onClick={(e) => this.supplier(e,'Manufacturer')}>{'Manufacturer'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Distributor'} onClick={(e) => this.supplier(e,'Distributor')}>{'Distributor'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Wholesaler'} onClick={(e) => this.supplier(e,'Wholesaler')}>{'Wholesaler'}</li>
                                            <li className="list-group-item mouse_pointer p-1" id={'Other'} onClick={(e) => this.supplier(e,'Other')}>{'Other'}</li>
                                        </ul>
                                    </div>

                                    <div className="col-md-1 d-md-block d-sm-none col-sm-0"></div>

                                    <div className="col-md-5 bg-light  col-sm-12 contact_list_wrapper mt-2 px-1">
                                        <div className="mt-2">Purpose: (select any one)</div> 
                                        <ul className="list-group list-group-flush contact_list purpose my-1">
                                            <li className="list-group-item mouse_pointer p-1" id={'Personal'} onClick={(e) => this.purpose(e,'Personal')}>{'Personal (Self)'}</li>
                                            <li className="list-group-item mouse_pointer bg_gray p-1" id={'Resale'} onClick={(e) => this.purpose(e,'Resale')}>{'Resale (Business Purpose)'}</li>
                                        </ul>
                                    </div>

                                    <div className="col-md-1 d-md-block d-sm-none col-sm-0"></div>

                                    <div className="col-12 my-1 card-text text-right">

                                        <button id="btn_loading" className="btn btn-solid" onClick={this.continueComment}>
                                            <div id="loading" className=" spinner-border d-none" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <div id="not_loading">Continue / Skip</div>
                                        </button>  
                                    </div>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
