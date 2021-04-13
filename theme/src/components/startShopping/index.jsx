import React, { Component } from 'react';
import '../common/index.scss';
import Slider from 'react-slick';
import { withTranslate } from 'react-redux-multilingual';
import { activity } from "../../functions";
import $ from 'jquery';
import ls from 'local-storage';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Breadcrumb from "../common/breadcrumb";
var url_path = '',value,sellerIDE;

function checkUserActivity(sellerIDE) {
    try {
        axios
            .post(
                "https://api.indiabigshop.com/common/user_check_activity.php",
                { buyerid: sellerIDE},
                { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
                window.location.href = response.data.result
            })
            .catch(error => {
                console.log(error);
                const result = error.response;
                return Promise.reject(result);
            });
    } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
    }
}

class Continue extends Component{
    constructor(){
        super();
        this.state = {
            value:''
        }
    }

    componentDidMount = async () => {
        try {
            await axios
                .post(
                    "https://api.indiabigshop.com/common/static_seo.php",
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
    }

    render() {
        var settings = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 100
        };
        return (
            <div>
                <Breadcrumb title={'offers'} />
                <div className="container">
                <div className="row">
                        <div class="col-md-12 col-sm-12 my-2">
                            <div class="justify-content-between">
                            {
                                ls.get("sellerid") ? <a type="button" class="" onClick={() => checkUserActivity(ls.get("sellerid"))}><img src="https://img.beldara.com/images/StartShopping/start_shopping_banner.jpg" className="githubIcon w-100" style={{paddingLeft: '20px',paddingRight: '20px'}}/></a>
                                : <a type="button" class="" href="/post-requirement.html"><img src="https://img.beldara.com/images/StartShopping/start_shopping_banner.jpg" className="githubIcon w-100" style={{paddingLeft: '20px',paddingRight: '20px'}}/></a>
                            }
                            </div> 
                        </div>
                    </div>
                    <div className="row">
                        <div class="col-md-12 col-sm-12 my-2">
                            <div class="justify-content-between">
                                <img src="https://img.beldara.com/images/StartShopping/start_shopping.jpg" className="githubIcon w-100" style={{paddingLeft: '20px',paddingRight: '20px'}}/>
                            </div> 
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-lg-12 justify-content-between text-center">
                        {
                            ls.get("sellerid") ? <a type="button" class="btn btn-solid" onClick={() => checkUserActivity(ls.get("sellerid"))}>Start Shopping</a>
                            : <a type="button" class="btn btn-solid" href="/post-requirement.html">Start Shopping</a>
                        }
                        </div>
                    </div>
                    <div className="row"></div>
                </div>
            </div>
        )
    }
}
export default withTranslate((Continue));