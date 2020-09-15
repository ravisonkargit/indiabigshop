import React, { Component } from 'react';
import { auctionRelated, checkSellerPackage, getCookie } from "../../functions";
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import axios from 'axios';
import $ from "jquery";
import ls from 'local-storage';
import ReactPaginate from 'react-paginate';
import AuctionTimer from './auctionTimer';
import AcceptBid from './acceptBid';
import { ImgUrl } from "../../constants/ActionTypes";
import { withRouter, Link } from "react-router-dom";
import './auction.css';
import LoadingComponent from '../products/common/loading-bar';
import { Helmet } from 'react-helmet';
import PopUpNotPaid from './popUpNotPaid'
import { getChatWithSupplier } from '../../actions';
import store from '../../store';
import { connect } from "react-redux";

var url_path = '';
var qPara;
class auction extends Component {
    constructor(props) {
        super(props);

        let search = window.location.search;
        var params = new URLSearchParams(search);

        this.state = {
            isAuctionReceived: 0,
            pageUrl: '/auction',
            data: '',
            auctiondata: [],
            signup: false,
            login: false,
            updateComp: 0,
            getBid: false,
            bidSubmit: false,
            bridBid: '',
            currency: '',
            curtime: '',
            pageNo: parseInt(params.get('page')) > 0 ? parseInt(params.get('page')) : 0,
            pageCount: 1,
            totalAuction: 1,
            type: 1,
            catid: 0,
            parentid: 0,
            cat_title: '',
            metaDescrip: '',
            imgKeyword: '',
            textForUSDPackageSeller: '',
            textForINRPackageSeller:'',
            isPackage: 0,
            sameReqData:[],
            isPopUpNotPaid: false,
            r_text: ''
        };

        this.closeModalPaid = this.closeModalPaid.bind(this)
        this.chatToSeller = this.chatToSeller.bind(this)
        this.goToBid = this.goToBid.bind(this)
    }

    goToBid(){
        this.props.history.push({
            pathname: "/auction.html",
          })
     }



    handlePageClick = data => {
        if (this.state.pageNo != data.selected) {
            let selected = data.selected;
            window.location.href = window.location.pathname + '?page=' + selected;
        }
    };

    bidSubmitted = (brid) => {
        this.setState({
            signup: false,
            login: false,
            getBid: false,
            bidSubmit: true,
            bidBrid: brid

        }, () => {
            window.location.href = `/auction-related/${this.state.brid}.html?q=s`;
        })
    }

    footerData = (data) => {
        if (data.success) {
            this.setState({
                signup: false,
                login: false,
                getBid: true
            })
        }
    };

    chatnow = (buyerid, name) => {
        if (this.state.isPackage == 1){
            this.chatToSeller(buyerid, name)
        }else{
            this.setState({
                isPopUpNotPaid: true
            })
        }

    }

    closeModalPaid(){
        this.setState({
            isPopUpNotPaid: false
        })
    }

    validate = (item) => {

        this.setState({
            brid: item.brid,
            bridBid: item.brid,
            currency: item.currency,
            unit: item.unit,
            qty: item.qty
        })
        ls.get('sellerid') ?
            this.setState({
                getBid: true,
                signup: false
            })
            : this.setState({
                signup: true,
                getBid: false
            })
    }

    closeModal = () => {
        this.setState({
            login: false,
            signup: false,
            getBid: false
        })
    }

    openSignUpModal = () => {
        this.setState({
            signup: true,
            login: false,
            getBid: false
        });
    }

    openLoginModal = () => {
        this.setState({
            signup: false,
            login: true,
            getBid: false
        });
    }

    componentDidMount = async () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);

        if (params.get('q')) {
            qPara = params.get('q');
        }
        try {
            url_path = window.location.pathname.split('/auction-related/')[1].split('.html')[0];
        } catch (e) {

        }
        if (this.props.location.state) {
            if (this.props.location.state.brid) {
                this.setState({
                    bidBrid: this.props.location.state.brid
                })
            } else if (url_path) {
                this.setState({
                    bidBrid: url_path
                })
            }
        } else if (url_path) {
            this.setState({
                bidBrid: url_path
            })
        }
        await axios
            .post(
                "https://api.beldara.com/common/static_seo.php",
                { security_token: "", plateform_type: "", langCode: 'en', pageid: '44' },
                { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
                this.setState({
                    cat_title: response.data.result.title,
                    metaDescrip: response.data.result.desc1,
                    imgKeyword: response.data.result.keyword
                })
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);
            });

          
        await auctionRelated(this.state.pageNo, this.state.bidBrid).then(async res => {
            await this.setState({
                auctiondata: res.result,
                isAuctionReceived: 1,
                totalAuction: res.message,
                pageCount: Math.ceil(parseInt(res.message) / 20)
            })
        }
        );

        await checkSellerPackage(ls.get('sellerid'), this.state.bidBrid).then(async res => {
            await this.setState({
                textForUSDPackageSeller: res.result.data.usdText ? res.result.data.usdText: '',
                textForINRPackageSeller: res.result.data.inrText ? res.result.data.inrText : '',
                sameReqData: res.result.data,
                r_text: res.result.data.r_text.replace('{brid}',this.state.bidBrid) ,
                isPackage: res.result.data.r_status == '1' ? 1 : 0
            })
        }
        );

    }

    reqData = (brid, isAuctioned) => {
        if (isAuctioned) {
            $('#' + brid).removeClass('d-none');
        } else {
            $('#' + brid).addClass('d-none');
        }
    }

    seeDetails = (item) => {
        this.props.history.push({
            pathname: `/auction-detail/${item.prod_url}-${item.brid}.html`,
            state: {
                brid: item.brid
            }
        })
    }

    askToSearch = () => {
        if (window.innerWidth < 1200) {

            $('.mobile-search').find('div').find('.fa-search').click();

            var pholder = setInterval(function name(params) {
                $('.react-autosuggest__input').attr('placeholder', 'Search product to auction');
                clearInterval(pholder);
            }, 1000);

            var cholder = setInterval(function name(params) {
                $('.react-autosuggest__input').attr('placeholder', 'What are you looking for...');
                clearInterval(cholder);
            }, 8000);

        } else {
            $("html, body").animate({ scrollTop: 0 }, "fast");
            $('.light-box-auction-step').removeClass('d-none');
            $('.form_search').css('box-shadow', '0 1px 15px 5px #00aeee');
            $('.react-autosuggest__input').attr('placeholder', 'Search product to auction').focus();

        }

    }

    removeSearch = () => {
        $('.light-box-auction-step').addClass('d-none');
        $('.form_search').css('box-shadow', '');
        $('.react-autosuggest__input').attr('placeholder', 'What are you looking for...').blur();
    }

    changeArrow = (event) => {
        if (event.id == 'down') {
            $('.catLabelBtn').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
            $('.catLabelBtn').attr('id', 'up');
        }
        else {
            $('.catLabelBtn').find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            $('.catLabelBtn').attr('id', 'down');
        }
    }

    chatToSeller(buyerid, name){
        let statePass = {
            sellerid:buyerid,
            chatWithSupplier:true,
            company: name
        } 
        store.dispatch(getChatWithSupplier(statePass))
    }

    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <div className="d-none light-box-auction-step" onClick={() => this.removeSearch()}></div>

                <div className="breadcrumb-section py-1">
                    <Helmet>
                        <title>{`${this.state.cat_title} auction on bedara`}   </title>
                        <meta name="description" content={`${this.state.metaDescrip} auction on bedara`} />
                        <meta name="keyword" content={` ${this.state.imgKeyword} auction on bedara`} />
                    </Helmet>
                    <div className="container">
                        <div className="row">

                            <div className="col-md-12">
                                <div className="page-title">
                                    <nav aria-label="breadcrumb" className="theme-breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item small">
                                             Suggested E-Auction
                                            </li>
                                        </ol>
                                    </nav>
                                </div></div>
                        </div>
                    </div>
            </div>

                {/* <Breadcrumb title={'Auction List'} metaDesc={`${this.state.data.desc1} auction on bedara`} metaKeyword={` ${this.state.data.keyword} auction on bedara`} metaTitle={`${this.state.data.title} auction on bedara`} /> */}
                <div className="container">
                <div className="col-md-12 col-12 text-right" >
                        <div onClick={this.goToBid.bind(this) }  className="text text-info mouse_pointer"><i class="fa fa-arrow-left"></i> Running Bids</div>
                    </div>
                    { (this.state.bidSubmit || qPara) &&
                    <React.Fragment>
                    {(this.state.r_text !='' && this.state.r_text) &&
                    <div className="alert alert-success">
                        { this.state.isPackage == 0?
                         this.state.r_text
                        : this.state.r_text +" "+this.state.textForUSDPackageSeller }
                        
                     </div>
                    
                        }
                        {this.props.user 
                              ? 
                              ((this.props.user.user_type == 'seller' || this.props.user.user_type == 'both') && (this.props.user.package_id == '0' || this.props.user.package_id == 'null')) 
                              ? 
                              <div className="text-dark text-center">
                                  <span>Mostly buyers interested to deal with verified sellers.
Now become a premium member to win the trust of online buyers.<a href="/membership.html"> Upgrade now </a></span>
                              </div>
                              : ''
                              : '' }
                         { Object.keys(this.state.sameReqData).length > 0 &&
                        <div className="border border-dark m-auto mw_500 p-2 h-100">
                                <div className='row'>
                                    <div className='col-12 col-md-7 col-sm-12'>
                                        <div className='row'>
                                            <div className='col-4 col-md-4 col-sm-4'>
                                                {this.state.sameReqData.main_img !== undefined && this.state.sameReqData.main_img != '' && this.state.sameReqData.main_img != null ?
                                                    <Link to={`/product/${this.state.sameReqData.prod_url}.html`} target="_blank">
                                                        <div className='img_lead_product'>
                                                            <img className="lead_img" src={`${ImgUrl}/product_images_small/${this.state.sameReqData.main_img}`} onError={() => $(this).addClass('d-none')} />
                                                        </div>
                                                    </Link>
                                                    : ''
                                                }
                                            </div>
                                            <div className="col-8 col-md-8 col-sm-8">
                                                <div id={this.state.sameReqData.buyerid} className="card_lead" >
                                                    <div className="">
                                                        <div className='text-muted text-truncate comment small max_width_250'>

                                                            <div className="">
                                                                <div className="text-dark text-truncate">Product: {this.state.sameReqData.prod_name}</div>
                                                                <div><b>Price:</b> {this.state.sameReqData.currency + ' ' + this.state.sameReqData.price}</div>
                                                                {this.state.sameReqData.qty !== undefined && this.state.sameReqData.qty != '' ?
                                                                    <div><b>Quantity: </b>{this.state.sameReqData.qty}</div>
                                                                    : ''}
                                                                <div><b>Unit: </b>{this.state.sameReqData.unit}</div>
                                                                <div className="text-dark text-truncate"><b>Remark: </b>{this.state.sameReqData.remark}</div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-12 col-md-5 col-sm-12">
                                        <div className="row">
                                            <div className="col-6 col-md-12 col-sm-6 pr-0" >
                                                <AuctionTimer reqData={this.reqData} req={this.state.sameReqData} auctionDate={this.state.sameReqData.auction_end_time} brid={this.state.sameReqData.brid} />
                                            </div>
                                            <div className="col-6 col-md-12 col-sm-6 w_100">
                                                {this.state.sameReqData.buyerid == ls.get('sellerid') ?
                                                    <div className="h5 text-orange"> Your Auction </div>
                                                    :
                                                    <span className="w-100 p_4 btn btn-solid get_lead mouse_pointer d-none" id={this.state.sameReqData.brid} onClick={() =>this.chatnow(this.state.sameReqData.buyerid, this.state.sameReqData.buyername)}>{translate('Chat Now')}</span>
                                                }

                                                <span className="w-100 mt-2 p_4 btn btn-solid get_lead mouse_pointer" onClick={() => this.seeDetails(this.state.sameReqData)}>{translate('See Details')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="brid_no ml-1">#{this.state.sameReqData.brid}</div>
                                <div className="small d-flex">
                                    <div className="p-2">
                                        {this.state.sameReqData.sysdate !== undefined && this.state.sameReqData.sysdate != '' ?
                                            <React.Fragment><i className="fa fa-calendar"></i> {this.state.sameReqData.sysdate} UTC</React.Fragment>
                                            : ''
                                        }
                                    </div>
                                </div>

                            </div>
                    
                                    }


                    </React.Fragment>
                    }
                        
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 text-center">
                            <div className="h5"> Search desired product for competitive price, create online auction</div>
                            <div onClick={this.askToSearch} className="btn btn-solid mouse_pointer">
                                Start Your e-Auction
                            </div>
                        </div>
                        <hr />
                        <div className="mt-1 mb-1 py-2 border-top border-bottom h5 col-12">
                            <i className="fa fa-gavel text-info ml-2"></i> Suggested E-Auction
                            </div>
                        <hr />

                        <div className="row">
                            {this.state.isAuctionReceived == 1 ?
                                this.state.auctiondata != null && this.state.auctiondata != ''
                                    ?
                                    <React.Fragment>
                                        {this.state.auctiondata.map((item, index) =>
                                            (item) ?

                                                <div key={item.brid} className="col-md-6 col-sm-12 my-2">
                                                    <div className="border border-dark d-flex flex-column justify-content-between p-2  h-100">
                                                        <div className='row'>
                                                            <div className='col-12 col-md-7 col-sm-12'>
                                                                <div className='row'>
                                                                    <div className='col-4 col-md-4 col-sm-4'>
                                                                        {item.main_img !== undefined && item.main_img != '' && item.main_img != null ?
                                                                            <Link to={`/product/${item.prod_url}.html`} target="_blank">
                                                                                <div className='img_lead_product'>
                                                                                    <img className="lead_img" src={`${ImgUrl}/product_images_small/${item.main_img}`} onError={() => $(this).addClass('d-none')} />
                                                                                </div>
                                                                            </Link>
                                                                            : ''
                                                                        }
                                                                    </div>
                                                                    <div className="col-8 col-md-8 col-sm-8">
                                                                        <div id={item.buyerid} className="card_lead" >
                                                                            <div className="">
                                                                                <div className='text-muted text-truncate comment small max_width_250'>

                                                                                    <div className="">
                                                                                        <div className="text-dark text-truncate">Product: {item.prod_name}</div>
                                                                                        <div><b>Price:</b> {item.currency + ' ' + item.price}</div>
                                                                                        {item.qty !== undefined && item.qty != '' ?
                                                                                            <div><b>Quantity: </b>{item.qty}</div>
                                                                                            : ''}
                                                                                        <div><b>Unit: </b>{item.unit}</div>
                                                                                        <div><b>Remark: </b>{item.remark}</div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-5 col-sm-12">
                                                                <div className="row">
                                                                    <div className="col-6 col-md-12 col-sm-6 pr-0" >
                                                                        <AuctionTimer reqData={this.reqData} req={item} auctionDate={item.auction_end_time} brid={item.brid} />
                                                                    </div>
                                                                    <div className="col-6 col-md-12 col-sm-6 w_100">
                                                                        {item.buyerid == ls.get('sellerid') ?
                                                                            <div className="h5 text-orange"> Your Auction </div>
                                                                            :
                                                                            <span className="w-100 p_4 btn btn-solid get_lead mouse_pointer d-none" id={item.brid} onClick={() => this.validate(item)}>{translate('Bid Now')}</span>
                                                                        }

                                                                        <span className="w-100 mt-2 p_4 btn btn-solid get_lead mouse_pointer" onClick={() => this.seeDetails(item)}>{translate('See Details')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="brid_no ml-1">#{item.brid}</div>
                                                        <div className="small d-flex">
                                                            <div className="p-2">
                                                                {item.sysdate !== undefined && item.sysdate != '' ?
                                                                    <React.Fragment><i className="fa fa-calendar"></i> {item.sysdate} UTC</React.Fragment>
                                                                    : ''
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                : ''
                                        )}</React.Fragment> :

                                    <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                        <h3>{translate('Sorry! Could not find the Auction you were looking For!!!')}</h3>
                                        <p>{translate('You can start an auction by searching product')}.</p>
                                        <div onClick={this.askToSearch} className="btn btn-solid mouse_pointer">
                                            {translate('Search Product Now!')}
                                        </div>

                                        {/* <Link to={{pathname: `/create-e-auction-online-on-beldara.html`, state:{isStartSearch: true} }} className="btn btn-solid">{translate('Search Product Now!')}</Link> */}
                                    </div>

                                : <LoadingComponent />}

                        </div>

                    </div>
                    <div className="row justify-content-md-center">
                        <ReactPaginate
                            initialPage={this.state.pageNo}
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination my-5'}
                            subContainerClassName={'pages pagination'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            pageClassName={'page-item'}
                            activeClassName={'active'}
                        />
                    </div>
                    <AcceptBid bidSubmitted={this.bidSubmitted} getBid={this.state} openSignUpModal={this.openSignUpModal} closeModal={this.closeModal} />
                </div>
                <PopUpNotPaid  isPopUpNotPaid={this.state.isPopUpNotPaid} closeModalPaid={this.closeModalPaid} sameReqData={this.state.sameReqData}/>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return state.user
};

export default connect(
    mapStateToProps

)(withTranslate(auction));
// export default withRouter(withTranslate(auction));
