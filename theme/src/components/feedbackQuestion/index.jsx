import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import $ from 'jquery';
import ls from 'local-storage';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Breadcrumb from "../common/breadcrumb";
import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import { FeedbackQuestions,getCookie } from "../../functions";
import { ApiUrl } from '../../constants/ActionTypes';
import { Redirect } from 'react-router-dom'
import { exists } from 'fs';
import {isMobile} from 'react-device-detect';

var url_path = '',qPara;
var url_origin = '';
url_origin = window.location.origin;

class FeedbackQuestion extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            count: 1,
            valID:'',
            rating: 0
        }
        this.feedbackSubmit = this.feedbackSubmit.bind(this);
    }

    feedbackSubmit(event) {
        $('#save_button').prop('disabled', true);
        $("#msg").addClass('d-none');
        $("#error_msg").addClass('d-none');
        $("#spinnerID").removeClass('d-none');
        event.preventDefault();
        const data = new FormData(event.target);
        try {
                axios({
                    method: 'post',
                    url: `${ApiUrl}/common/save_feedback_questions.php`,
                    data: data,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                })
                .then(async response => {
                    if(response.data.statusId=='1' && response.data.result == true){
                        $("#msg").removeClass('d-none');
                        $("#spinnerID").addClass('d-none');
                        $('#save_button').prop('disabled', false);
                        setTimeout(function(){window.location.href = url_origin}, 2000);
                    }else{
                        $("#error_msg").removeClass('d-none');
                        $("#spinnerID").addClass('d-none');
                        $('#save_button').prop('disabled', false);
                        setTimeout(function(){window.location.href = url_origin}, 2000);
                    }
                })
                .catch(error => {
                    $('#save_button').prop('disabled', false);
                    const result = error.response;
                    return Promise.reject(result);
                });
        } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
        }

    }
    componentDidMount = async () => {
        try {
            await axios
                .post(
                    "https://api.beldara.com/common/static_seo.php",
                    { security_token: "", plateform_type: "", langCode: "en", pageid: '46' },
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(response => {
                    this.setState({
                        catTitle: response.data.result.title + ' ' + url_path,
                        metaDesc: response.data.result.desc1 + ' ' + url_path,
                        metaKeyword: response.data.result.keyword + ' ' + url_path
                    })
                })
                .catch(error => {
                    const result = error.response;
                    return Promise.reject(result);
                });
        } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
        }

        FeedbackQuestions(this.props.match.params.id).then( res => {
            try{
                if(res != null || res != ''){
                    if(res.statusId==1 || res.statusId=="1"){
                        this.setState({
                            data: res.result
                        });
                    }
                }
            }catch(e){
                console.log(`😱 Axios request failed: ${e}`);
            }
        })   
    }

    render() {
        const { rating } = this.state;
        return (
            <div>
                <Breadcrumb title={'Feedback'} />
                <div className="container">
                    <br></br>
                    <>
                    {(isMobile) ?
                        this.state.data != null && this.state.data != '' ?
                        <div class="card" style={{borderColor: '#fb9944'}}>
                        <div class="card-body">
                        <form onSubmit={this.feedbackSubmit}>
                        <div className="row">
                            <div class="col col-md-12">
                                <div class="alert alert-success text-center d-none" id="msg" role="alert">
                                    Thanks a lot to let us know how everything worked out for you. Your feedback really means a lot to us.
                                </div>
                                <div class="alert alert-warning text-center d-none" id="error_msg" role="alert">
                                    Something went wrong please try again later.
                                </div>
                            </div> 
                        </div>

                        <div className="row text-center">
                            <div className="col col-lg-12">
                                <h5><b>Beldara would love to hear from you.</b></h5>
                            </div>
                        </div>

                        <div className="row text-center">
                            <div className="col col-lg-12">
                                <h5>Please take a moment to share your feedback. Your thoughts will help us to enhance your Beldara experience.</h5>
                            </div>
                        </div>

                        <div className="row">
                            
                                    <div class="col col-lg-12">
                                        <div class="form-inline d-flex justify-content-center">
                                            <div class="form-group" style={{marginBottom: '-1rem'}}>
                                                <h5>Stars:-</h5>
                                            </div>

                                            <div class="form-group w-1 p-1" style={{marginBottom: '-1rem'}}>
                                                <h5>1. Poor</h5>
                                            </div>

                                            <div class="form-group w-1 p-1" style={{marginBottom: '-1rem'}}>
                                                <h5>2. Fair</h5>
                                            </div>

                                            <div class="form-group w-1 p-1" style={{marginBottom: '-1rem'}}>
                                                <h5>3. Good</h5>
                                            </div>

                                            <div class="form-group w-1 p-1" style={{marginBottom: '1rem'}}>
                                                <h5>4. Very good</h5>
                                            </div>

                                            <div class="form-group w-1 p-1" style={{marginBottom: '1rem'}}>
                                                <h5>5. Excellent</h5>
                                            </div>
                                        </div>
                                    </div>
                            
                        </div>
                        
                        {this.state.data != null && this.state.data != ''?
                            this.state.data.map((item, index) =>
                            <>  
                                <div className="row">
                                    <div class="col col-lg-12">
                                    <h5>{item.questions}</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <input id="sellerid" type="hidden" name="sellerid" value={getCookie('mhinpbn')}/>
                                    <input id="catid" type="hidden" name="catid" value={this.props.match.params.id}/>
                                    <div class="col col-lg-12">
                                        {item.question_type == '5 Star' ?
                                            <h5><StarRatingComponent 
                                            name={item.id}
                                            starCount={5}
                                            value={(this.state[`star${item.id}`]) ? this.state[`star${item.id}`] :rating}
                                            onStarClick={(nextValue, prevValue, name) => {
                                                this.setState({[`star${item.id}`]: nextValue});
                                              }}
                                        /> </h5>
                                        :
                                        <div className="has-float-label m-1">
                                            <textarea
                                            type="text"
                                            name={item.id}
                                            id={item.id}
                                            placeholder=" "
                                            className="form-control"
                                            />
                                            <label className="text-dark" htmlFor={item.id}>
                                            {"Enter feedback"}
                                            </label>
                                        </div>
                                        }   
                                    </div>
                                </div>     
                            </>
                            ) 
                        : ''}
                         <br></br>
                         <div className="row">
                            {this.state.data != null && this.state.data != ''?
                                <div className="col col-lg-12 text-center">
                                    <button class="btn btn-solid" id="save_button"><div class="spinner-border text-light d-none" id="spinnerID" style={{width: '1rem', height: '1rem'}} role="status"><span class="sr-only">Loading...</span></div>&nbsp;Submit</button>
                                </div>
                             :''}
                         </div>  
                         </form>
                         </div>
                         </div>
                        :''
                    :
                    this.state.data != null && this.state.data != '' ?
                    <div class="card" style={{borderColor: '#fb9944'}}>
                    <div class="card-body">
                    <form onSubmit={this.feedbackSubmit}>
                    <div className="row">
                        <div class="col col-md-3"></div> 
                        <div class="col col-md-6">
                            <div class="alert alert-success text-center d-none" id="msg" role="alert">
                                Thanks a lot to let us know how everything worked out for you. Your feedback really means a lot to us.
                            </div>
                            <div class="alert alert-warning text-center d-none" id="error_msg" role="alert">
                                Something went wrong please try again later.
                            </div>
                        </div> 
                        <div class="col col-md-3"></div> 
                    </div>

                    <div className="row text-center">
                        <div className="col col-lg-1"></div>
                        <div className="col col-lg-11">
                            <h5><b>Beldara would love to hear from you.</b></h5>
                        </div>
                        <div className="col col-lg-1"></div>
                        <div className="col col-lg-11">
                            <h5>Please take a moment to share your feedback. Your thoughts will help us to enhance your Beldara experience.</h5>
                        </div>
                    </div>

                    <div className="row">
                        <div class="col col-md-2"></div> 
                            <div class="col col-md-9">
                                <div class="form-inline d-flex justify-content-center">
                    
                                    <div class="form-group w-5 p-3">
                                        <h5>Stars:-</h5>
                                    </div>

                                    <div class="form-group w-5 p-3">
                                        <h5>1. Poor</h5>
                                    </div>

                                    <div class="form-group w-5 p-3">
                                        <h5>2. Fair</h5>
                                    </div>

                                    <div class="form-group w-5 p-3">
                                        <h5>3. Good</h5>
                                    </div>

                                    <div class="form-group w-5 p-3">
                                        <h5>4. Very good</h5>
                                    </div>

                                    <div class="form-group w-5 p-3">
                                        <h5>5. Excellent</h5>
                                    </div>

                                </div>
                            </div>
                        <div class="col col-md-1"></div> 
                    </div>
                    
                    {this.state.data != null && this.state.data != ''?
                        this.state.data.map((item, index) =>
                        <>  
                            <div className="row">
                                <div class="col col-md-2"></div> 
                                <div class="col col-md-5">
                                <h5>{item.questions}</h5>
                                </div>
                                <input id="sellerid" type="hidden" name="sellerid" value={getCookie('mhinpbn')}/>
                                <input id="catid" type="hidden" name="catid" value={this.props.match.params.id}/>
                                <div class="col col-md-4">
                                    {item.question_type == '5 Star' ?
                                        <h5><StarRatingComponent 
                                        name={item.id}
                                        starCount={5}
                                        value={(this.state[`star${item.id}`]) ? this.state[`star${item.id}`] :rating}
                                        onStarClick={(nextValue, prevValue, name) => {
                                            this.setState({[`star${item.id}`]: nextValue});
                                          }}
                                    /> </h5>
                                    :
                                    <div className="has-float-label m-1">
                                        <textarea
                                        type="text"
                                        name={item.id}
                                        id={item.id}
                                        placeholder=" "
                                        className="form-control"
                                        />
                                        <label className="text-dark" htmlFor={item.id}>
                                        {"Enter feedback"}
                                        </label>
                                    </div>
                                    }   
                                </div>
                                <div class="col col-md-1">
                                    
                                </div>
                            </div>     
                        </>
                        ) 
                    : ''}
                     <br></br>
                     <div className="row">
                        {this.state.data != null && this.state.data != ''?
                            <div className="col col-lg-12 text-center">
                                <button class="btn btn-solid" id="save_button"><div class="spinner-border text-light d-none" id="spinnerID" style={{width: '1rem', height: '1rem'}} role="status"><span class="sr-only">Loading...</span></div>&nbsp;Submit</button>
                            </div>
                         :''}
                     </div>  
                     </form>
                     </div>
                     </div>
                      : ''}
                    {/* } */}
                    </>
                    <br></br>     
                </div>
            </div>
        )
    }
}
export default withTranslate((FeedbackQuestion));