import React, { Component } from 'react';
import { auctionlist } from "../../functions";
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import Breadcrumb from '../common/breadcrumb';
import axios from 'axios';
import $ from "jquery";
import ls from 'local-storage';
import SignUpPopUp from '../signUpPopUp';
import LoginPopUp from '../loginPopUp';
import ReactPaginate from 'react-paginate';
import AuctionTimer from './auctionTimer';
import AcceptBid from './acceptBid';
import { ImgUrl } from "../../constants/ActionTypes";
import { withRouter, Link } from "react-router-dom";
import './auction.css';
import LoadingComponent from '../products/common/loading-bar';
import CategoryComponent from '../common/categoryComponent';
import { Helmet } from 'react-helmet';
import { connect } from "react-redux";


var url_path = '';

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
            signup : false,
            login : false,
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
            cat_title : '',
            metaDescrip : '',
            imgKeyword : ''
        };
    }

    

    handlePageClick = data => {
        if (this.state.pageNo != data.selected){
            let selected = data.selected;
            window.location.href = window.location.pathname+'?page='+selected;
        }
    };

    bidSubmitted = (brid) => {
        this.setState({
            signup : false,
            login : false,
            getBid: false,
            bidSubmit: true,
            bidBrid: brid

        }, () => {
            // this.props.history.push({
            //     pathname: `/auction-related/${this.state.brid}.html`,
            //     state: {
            //         brid: this.state.brid
            //     }
            // })
            window.location.href = `/auction-related/${this.state.brid}.html?q=s`;
        })
    }
    footerData = (data) => {
        console.log('footerData: ',data)
        // this.setState({
        //     signup : data.modal,
        //     login : data.modal
        // })
        if (data.success){
            this.setState({
                signup : false,
                login : false,
                getBid: true
            })
        }
    };

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

    closeModal = () =>{
        this.setState({
            login: false,
            signup: false,
            getBid: false
        })
    }

    openSignUpModal = () =>{
        this.setState({ 
            signup: true,
            login: false,
            getBid: false
        });
    }

    openLoginModal = () =>{
        this.setState({ 
            signup: false,
            login: true,
            getBid: false
        });
    }

    componentDidMount = async () => {

        try{
            url_path = window.location.pathname.split('/auction/')[1].split('.html')[0].split('/');
        }catch(e){

        }

        var auctioncat = window.location.pathname;
        var auctioncatarray = auctioncat.split('auction/');
        var auction_cat = '';
        var auction_parent_cat = '';
        var len = 0;
        if (auctioncatarray[1]){
            var link_array = auctioncatarray[1].replace('.html','').split('-');
            len = link_array.length;
            auction_parent_cat = link_array[len-1];
            auction_cat = link_array[len-2];
            if (auction_cat){
                await this.setState({
                    catid: auction_cat,
                    parentid: auction_parent_cat
                })
            }
        }

        

        if (this.state.parentid == 0)
        await axios
            .post(
                "https://api.indiabigshop.com/common/static_seo.php",
                { security_token: "", plateform_type: "", langCode: 'en', pageid: '44' },
                { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
                this.setState({
                    // data: response.data.result
                    cat_title : response.data.result.title,
                    metaDescrip : response.data.result.desc1,
                    imgKeyword : response.data.result.keyword
                })
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);  
            });

        else{
            axios.post("https://api.indiabigshop.com/common/cat_detail.php",{catid:this.state.catid, parentid:this.state.parentid, sellerid:ls.get('sellerid'),security_token:'',plateform_type:''}, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    // return response.data.result;
                    this.setState({
                        // data: response.data.result
                        cat_title : response.data.result.cat_title,
                        metaDescrip : response.data.result.metaDescrip,
                        imgKeyword : response.data.result.imgKeyword
                    })
                })
                .catch(error => {
                    const result = error.response;
                    return Promise.reject(result);
                });
        }    

        await auctionlist(this.state.pageNo, this.state.parentid , this.state.catid).then(async res =>
            await this.setState({
                auctiondata: res.result,
                isAuctionReceived:1,
                totalAuction: res.message,
                pageCount : Math.ceil( parseInt(res.message) / 20)
            }));
    }

    

    reqData = (brid, isAuctioned) => {
        if (isAuctioned){
            $('#'+brid).removeClass('d-none');
        }else{
            $('#'+brid).addClass('d-none');
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

    // goToAuctionInfo = () => {
    //     this.props.history.push({
    //         pathname: '/create-e-auction-online-on-beldara.html',
    //     })
    //  }

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
        $('.light-box-auction-step').addClass('d-none');
        $('.form_search').css('box-shadow','');
        $('.react-autosuggest__input').attr('placeholder','What are you looking for...').blur();
    }

    changeArrow = (event) => {
        console.log('changeArrow', event)
        if (event.id == 'down'){
            $('.catLabelBtn').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
            $('.catLabelBtn').attr('id','up');
        }
        else{
            $('.catLabelBtn').find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            $('.catLabelBtn').attr('id','down');
        }
    }

    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <div className="d-none light-box-auction-step" onClick={() => this.removeSearch()}></div>

                <div className="breadcrumb-section py-1">
                        {/* <Helmet>
                            <title>{`${this.state.cat_title} auction on bedara`}   </title>
                            <meta name="description" content={`${this.state.metaDescrip} auction on bedara`} />
                            <meta name="keyword" content={` ${this.state.imgKeyword} auction on bedara`} />
                        </Helmet> */}
                        <div className="container">   
                        <div className="row">
                            
                            <div className="col-md-12">
                            <div className="page-title"> 
                            <nav aria-label="breadcrumb" className="theme-breadcrumb">
                                <ol className="breadcrumb">
                                <li className="breadcrumb-item small">
                                    <Link to={`${process.env.PUBLIC_URL}`}>
                                        {translate("Auction List")}
                                    </Link>
                                </li>
                                {url_path[0] ? (
                                    <li className="breadcrumb-item small" aria-current="page">
                                        { url_path[1] ?
                                        <Link to={`${process.env.PUBLIC_URL}/bpp/${url_path[0]}.html`} target="_blank">
                                            {url_path[0].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") }
                                        </Link>
                                        : url_path[0].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ")
                                        }
                                    </li>
                                ) : ""}
                                {url_path[1] ? (
                                    <li className="breadcrumb-item small" aria-current="page">
                                        { url_path[2] ?
                                        <Link to={`${process.env.PUBLIC_URL}/bpp/${url_path[0]}/${url_path[1]}.html`} target="_blank">
                                            {url_path[1].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") }
                                        </Link>
                                        : url_path[1].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") 
                                        }
                                    </li>
                                ) : ""}
                                {url_path[2] ? (
                                    <li className="breadcrumb-item small" aria-current="page">
                                       {url_path[2].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") }
                                    </li>
                                ) : 
                                    ""
                                }
                                </ol>
                            </nav>
                            </div></div>
                        </div>
                        </div>
                    </div>

                {/* <Breadcrumb title={'Auction List'} metaDesc={`${this.state.data.desc1} auction on bedara`} metaKeyword={` ${this.state.data.keyword} auction on bedara`} metaTitle={`${this.state.data.title} auction on bedara`} /> */}
                <div className="container">
                    
                    {this.state.bidSubmit?
                    <div className="alert alert-success"> You have successfully placed bid. Please keep a close watch on auction and check your position. </div>
                    : ''}
                    <div className="row">
                    
                        <div className="col-12 col-sm-12 col-md-12 text-center">
                            <div className="h5"> Search desired product for competitive price, create online auction</div>
                            <div onClick={this.askToSearch} className="btn btn-solid mouse_pointer">
                                Start Your e-Auction
                            </div>
                        </div>
                        <hr/>
                            <div className="mt-1 mb-1 py-2 border-top border-bottom h5 col-12">
                                <i className="fa fa-gavel text-info ml-2"></i> Running Bids
                            </div>
                        <hr/>

                        <div className="row w-100 m-auto">
                            <div className="col-md-3 d-none d-md-block d-sm-none">
                                <CategoryComponent  type={this.state} />
                            </div>
                            <div className="col-md-9 col-sm-12 col-12">
                                <div className="row">
                        { this.state.isAuctionReceived == 1 ?
                       this.state.auctiondata != null && this.state.auctiondata != ''
                       ?
                       <React.Fragment>
                           <div className="col-md-6 col-sm-12 my-2 d-block d-md-none d-sm-block text-right">
                             <div className="accordion" id="categoryList">
                                <div className="card">
                                    <div className="card-header" id="catLabel">
                                        <h2 className="mb-0">
                                            <button id="down" className="btn btn-link catLabelBtn" onClick={(e) => this.changeArrow(e)} type="button" data-toggle="collapse" data-target="#categorylistLabel" aria-expanded="true" aria-controls="categorylistLabel">
                                                Top Categories <i className="ml-2 fa fa-chevron-down"></i>
                                            </button>
                                        </h2>
                                    </div>

                                    <div id="categorylistLabel" className="collapse" aria-labelledby="headingOne" data-parent="#categoryList">
                                        <div className="card-body text-left">
                                            <CategoryComponent type={this.state}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.auctiondata.map((item, index ) =>
                            (item)?
                            
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
                                                                    {/* {item.remark !== undefined && item.remark != '' ?
                                                                     */}
                                                                        <div className="">
                                                                            <div className="text-dark text-truncate">Product: {item.prod_name}</div>
                                                                            <div><b>Base Price:</b> {item.currency+' '+item.price}</div>
                                                                            {item.qty !== undefined && item.qty != '' ?
                                                                                <div><b>Quantity: </b>{item.qty}</div>
                                                                                : ''}
                                                                            <div><b>Unit: </b>{item.unit}</div>
                                                                            <div><b>Total Price: </b><div>{item.currency} {item.total}</div></div>
                                                                            {item.remark &&
                                                                            <div class="text-dark text-truncate"><b>Remark: </b>{item.remark}</div>
                                                                            }
                                                                        </div>
                                                                            
                                                                        {/* : ''
                                                                    } */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                                
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            
                                            <div className="col-12 col-md-5 col-sm-12">
                                                <div class="row">
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
                            :''
                            ) }</React.Fragment> :
                            
                            <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                <h3>{translate('Sorry! Could not find the Auction you were looking For!!!')}</h3>
                                <p>{translate('You can start an auction by searching product')}.</p>
                                <div onClick={this.askToSearch} className="btn btn-solid mouse_pointer">
                                    {translate('Search Product Now!')}
                                </div>

                                {/* <Link to={{pathname: `/create-e-auction-online-on-beldara.html`, state:{isStartSearch: true} }} className="btn btn-solid">{translate('Search Product Now!')}</Link> */}
                            </div>
                            
                        : <LoadingComponent /> }


                            </div>
                        </div>
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
                    <LoginPopUp footerData={this.footerData} login={this.state} openSignUpModal={this.openSignUpModal} closeModal={this.closeModal} />
                    <SignUpPopUp footerData={this.footerData} signup={this.state} openLoginModal={this.openLoginModal} closeModal={this.closeModal} />
                    <AcceptBid bidSubmitted={this.bidSubmitted} getBid={this.state} openSignUpModal={this.openSignUpModal} closeModal={this.closeModal} user={this.props.user} />
                </div>
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
