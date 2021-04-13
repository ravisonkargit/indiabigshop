import React, { Component } from 'react'
import { ImgUrl } from "../../constants/ActionTypes";
import Breadcrumb from '../common/breadcrumb';
import axios from 'axios';
import $ from 'jquery';
import './auction.css';
import { withRouter } from "react-router-dom";

class infoAuction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount = async () => {
        
        await axios
            .post(
                "https://api.indiabigshop.com/common/static_seo.php",
                { security_token: "", plateform_type: "", langCode: 'en', pageid: '44' },
                { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
                this.setState({
                    data: response.data.result
                })
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);
            });        
    }

    askToSearch = () => {
        if (window.innerWidth <1200){
            
            $('.mobile-search').find('div').find('.fa-search').click();
            
            var pholder = setInterval(function name(params) {
                $('.react-autosuggest__input').attr('placeholder','Search product to auction');
                clearInterval(pholder);
            }, 1000);

            var cholder = setInterval(function name(params) {
                $('.react-autosuggest__input').attr('placeholder','What are you looking for...');
                clearInterval(cholder);
            }, 8000);

        }else{
            $("html, body").animate({ scrollTop: 0 }, "fast");
            $('.light-box-auction-step').removeClass('d-none');
            $('.form_search').css('box-shadow','0 1px 15px 5px #00aeee');
            $('.react-autosuggest__input').attr('placeholder','Search product to auction').focus();
            
        }

    }

    removeSearch = () => {
        //$('.mobile-search').find('div').find('.fa-search').click();

        $('.light-box-auction-step').addClass('d-none');
        $('.form_search').css('box-shadow','');
        $('.react-autosuggest__input').attr('placeholder','What are you looking for...').blur();
    }


    goToBid = () => {
        this.props.history.push({
            pathname: "/auction.html",
          })
     }

    render() {
        return (
            <React.Fragment>
                <div className="d-none light-box-auction-step" onClick={() => this.removeSearch()}></div>
                <Breadcrumb title={'E-Auction'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title} />
            
            <div className="container">
                <div className="row">
                    {/* <div className="col-md-6 col-12 col-sm-12 " >
                        
                    </div> */}
                    <div className="col-md-12 col-12 text-right" >
                        <div onClick={() => this.goToBid() }  className="text text-info mouse_pointer"><i class="fa fa-arrow-left"></i> Running Bids</div>
                    </div>
                    <div className="col-md-12">
                        
                        <img onClick={() => this.askToSearch() } className="img-fluid mouse_pointer" src={`${ImgUrl }/advt_banner/Auction-banner.jpg`} alt="auction on beldara.com" />
                        
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 text-center my-2">
                        <div onClick={() => this.askToSearch() }  className="btn btn-solid mouse_pointer">Create E-Auction</div>
                    </div>
                    <div className="col-md-12">
                        <div className="h5 mt-2" >
                            Steps to create Beldara E-Auction
                        </div>
                        <div className="my-2" >
                            Beldara Auction feature is an aid to buyers who want the product at a certain price and would like to offer it as if a seller can provide that product at that market price.
                        </div>
                        <div className="my-2" >
                            Similarly, Beldara would like to provide a fair opportunity to all the sellers as well who are looking for the buyers to sell their product at or below the baseline price declared by the buyer.
                        </div>
                        <div className="my-2" >
                            It is beneficial for both sellers and buyers. The process increases transparency with a smooth workflow of buyer inquiry. Beldara intended to match sellers with the requirement of buyers.
                        </div>
                        <div className="h5 mt-1" >
                            The steps to create E-Auction as follows:
                        </div>
                        <div className="" >
                            <ol>
                                <li className="my-2">
                                    1. Search the product for which you would like to bid. A buyer who requires the product sample or wants to buy only a few pieces can directly purchase the product by clicking on "BUY NOW" or "request sample". Show interest in the product by clicking the ‘E-Auction’ button appearing on the right side of the page.
                                </li>
                                <li className="my-2">
                                    2. Set your price, unit (quantity) & the auction duration. All these 3 options are very essential in the bidding process & need to be filled correctly to get the precise result.
                                </li>
                                <li className="my-2">
                                    3. Choose any specifications like Product Customization, Logo Customization or International Packing. If you have any additional remarks or specification you can mention that too.
                                </li>
                                <li className="my-2">
                                    4. Adding address is going to help in logistics or shipping cost calculations. The best price offered by Beldara Express which is going to make the work more easy and online.
                                </li>
                                <li className="my-2">
                                    5. Now it's a seller turn to bid & provide the product at the market rate. A buyer can track the seller bidding on the Beldara auction page by clicking on the option 'see details'.
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div className="col-md-12 text-center">
                        <div onClick={() => this.askToSearch() }  className="btn btn-solid mb-2 mouse_pointer">Get Started</div>
                    </div>
                </div>
            </div>
            </React.Fragment>
        )
    }
}


export default withRouter(infoAuction);