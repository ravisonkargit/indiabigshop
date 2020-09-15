import React, { Component } from 'react';
import { auctionDetail, getCookie } from "../../functions";
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import Breadcrumb from '../common/breadcrumb';
import axios from 'axios';
import $ from "jquery";
import ls from 'local-storage';
import SignUpPopUp from '../signUpPopUp';
import LoginPopUp from '../loginPopUp';
import AuctionTimer from './auctionTimer';
import AcceptBid from './acceptBid';
import { Url, ImgUrl } from "../../constants/ActionTypes";
import { withRouter } from "react-router-dom";
import './auction.css';
import { sellerUrl } from '../../constants/variable';
import store from '../../store';
import { getChatWithSupplier } from '../../actions';

var pageNo = parseInt(0);
var pageCount = 0;

class auction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            auctiondata: [],
            auctionlist: [],
            signup : false,
            login : false,
            updateComp: 0,
            getBid: false,
            bidSubmit: false,
            bidBrid: '',
            currency: '',
            specDetail: [],
            selfPos: ''
        };
        this.chatToSeller = this.chatToSeller.bind(this)
        this.goToBid = this.goToBid.bind(this)
    }

    goToBid(){
        this.props.history.push({
            pathname: "/auction.html",
          })
     }

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
        console.log('footerData: ',data, data.modal, data.success)
        
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

        // this.setState({
        //     reload: data.reload
        // })

        // if (data.paymentModal)
        //     $('.razorpay-payment-button').click();
    };

    validate = (brid, currency) => {
        this.setState({
            brid: brid,
            bridBid: brid,
            currency: currency
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
            let search = window.location.search;
            let params = new URLSearchParams(search);
            var reqid = params.get('brid');

            try{
            var req_url = window.location.pathname.split('/auction-detail/')[1].replace(".html","").split('-').pop();
            }catch(e){
                
            }
            var br_id = '';
            
            if (this.props.location.state && this.props.location.state!=''){
                if (this.props.location.state.brid && this.props.location.state.brid!=''){
                    br_id = this.props.location.state.brid
                }
            }
            if ((!br_id || br_id=='') && req_url != '' && req_url){
                br_id = req_url ? req_url : ''
            }

            if (!br_id || br_id==''){
                br_id = reqid ? reqid : ''
            }

        await auctionDetail(br_id, ls.get('sellerid')).then(async res =>{
            

            await this.setState({
                auctiondata: res[0],
                auctionlist: res[1],
                brid: br_id,
                data: res[0][0].prod_name
            })

            if (res[2]['pos']){
                await this.setState({
                    selfPos: res[2]['pos']
                })
            }

            if (res[3]){
                await this.setState({
                    specDetail: res[3]
                })
            }
         }
        );
            
        
    }

    reqData = (brid, isAuctioned) => {
        if (isAuctioned){
            $('#'+brid).removeClass('d-none');
        }else{
            $('#'+brid).addClass('d-none');
        }
    }

    seeDetails = (brid) => {
        this.props.history.push({
            history: 'auction_detail.html',
            state: {
                brid: brid
            }
        })
    }
    chatToSeller(sellerid,company){
        let statePass = {
            sellerid:sellerid,
            chatWithSupplier:true,
            company:company
        } 
        store.dispatch(getChatWithSupplier(statePass))
    }
    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <Breadcrumb title={'Auction Detail'} metaDesc={this.state.data} metaKeyword={this.state.data} metaTitle={this.state.data} />
                <div className="container">
                    
                    {this.state.bidSubmit?
                    <div className="alert alert-success"> You have successfully placed bid. Please keep a close watch on auction and check your position. </div>
                    : ''}
                    <div className="row">

                    <div className="col-md-12 col-12 text-right" >
                        <div onClick={this.goToBid.bind(this) }  className="text text-info mouse_pointer"><i class="fa fa-arrow-left"></i> Running Bids</div>
                    </div>
                        
                        {this.state.auctiondata ?
                            this.state.auctiondata.map((item,index)  =>
                                <div key={index} className="col-md-12 col-sm-12 my-2">
                                    <div className="border border-dark  p-2  h-100">

                                        <div className=''>
                                            <div className="row ml-3">
                                                #{this.state.brid}
                                            </div>
                                            <div className='row'>
                                                <div className='col-12 col-md-3 col-sm-12 pr-0 text-center'>
                                                    {item.main_img !== undefined && item.main_img != '' && item.main_img != null ?
                                                        
                                                        <div className='img_lead_product'>
                                                            <a href={`${Url}/product/${item.url}.html`} target="_blank">
                                                                <img className="lead_img" src={`${ImgUrl}/product_images_thumb/${item.main_img}`} onError={() => $(this).addClass('d-none')} />
                                                            </a>
                                                        </div>
                                                        : ''
                                                    }
                                                </div>
                                                <div className="col-1 col-md-1 d-sm-none d-md-block">
                                                    </div>
                                                <div className="col-12 col-md-8 col-sm-12">
                                                    <div id={item.buyerid} className="card_lead" >
                                                        <div className="">
                                                            <div className='text-muted text-truncate comment'>
                                                                {/* {item.remark !== undefined && item.remark != '' ? */}
                                                                   
                                                                    <div className="">
                                                                        <h5 className="text-dark text-wrap">Product: {item.prod_name}</h5>
                                                                        <div><b>Base Price: </b>{item.currency} {item.price}</div>
                                                                        {item.qty !== undefined && item.qty != '' ?
                                                                            <div><b>Quantity: </b>{item.qty}</div>
                                                                            : ''}
                                                                        <div><b>Unit: </b>{item.unit}</div>
                                                                        <div><b>Total Price: </b>{item.currency} {item.total_price}</div>
                                                                        
                                                                        { item.remark &&
                                                                        <div className="text-dark text-wrap"><b>Remark: </b>{item.remark}</div>
                                                                        }
                                                                        {this.state.specDetail.length> 0?
                                                                            this.state.specDetail.map( (val, index) =>
                                                                                <div key={index}><b>Specification: </b>{val.specs}</div>
                                                                            )
                                                                        : ''}
                                                                    </div>
                                                                        
                                                                    {/* : ''
                                                                } */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6 col-md-6 col-sm-6">
                                                {this.state.selfPos && parseInt(this.state.selfPos) > 0 ?
                                                <div>
                                                    Your Rank #{this.state.selfPos}
                                                </div>
                                                : ''}
                                                </div>
                                                <div className="col-6 col-md-6 col-sm-6">
                                                    <div className="d-flex align-items-center justify-content-center ">
                                                        <div>
                                                            <AuctionTimer reqData={this.reqData} req={item} auctionDate={item.auction_end_time} brid={item.brid} />
                                                            
                                                                {item.buyerid == ls.get('sellerid') ?
                                                                <div>
                                                                    <span className="h5 text-orange"> Your Auction </span>
                                                                </div>
                                                                : <div className="w_100">
                                                                    <span className="w-100 p_4 btn btn-solid get_lead mouse_pointer d-none" id={item.brid} onClick={() => this.validate(item.brid, item.currency)}>{translate('Bid Now')}</span> 
                                                                    </div>
                                                                    }
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        

                                    </div>
                                </div>

                            )
                            : ''}

                            {
                                this.state.auctionlist?
                                
                                    this.state.auctionlist.length > 0 ?
                                        <div className="col-md-12 col-sm-12 my-5">
                                            Top 5 Bidder:
                                    <div className="d-flex flex-column justify-content-between p-2  h-100">
                                    
                                        <ul className="list-group">
                                        <li className="d-sm-none d-none d-md-block list-group-item">
                                            <div className="row"> 
                                                <div className=" col-sm-12 col-md-1"> 
                                                    Pos.
                                                </div>

                                                <div className=" col-sm-12 col-md-3"> 
                                                    Name
                                                </div>

                                                <div className=" col-sm-12 col-md-3"> 
                                                    Price
                                                </div>

                                                <div className="  col-sm-12 col-md-2"> 
                                                    PO
                                                </div>

                                                <div className="col-sm-12 col-md-3"> 
                                                    Chat
                                                </div>
                                            </div>
                                           
                                        </li>
                                            {this.state.auctionlist.map( (val, index) => 
                                                <li key={index} className="list-group-item">

                                                <div className="row  "> 
                                                    <div className="col-2 col-sm-2 col-md-1"> 
                                                        {index+1}
                                                    </div>

                                                    <div className="col-10 col-sm-10 col-md-3"> 
                                                        {val.sellerid?
                                                        val.sellerid == ls.get('sellerid') ?
                                                        <div className="H5">{'You'}</div>
                                                        :<React.Fragment>
                                                        {
                                                        val.buyerid == ls.get('sellerid') ?
                                                        val.name && val.name !=''?
                                                            val.name
                                                        : val.email && val.email!=''? 
                                                            val.email.replace(val.email.substring(3,10), 'XXXXXXX')
                                                            :''
                                                        : 
                                                        val.sellerid + '-' + parseInt(index+1)
                                                        }
                                                        </React.Fragment> 
                                                        : ''
                                                        }
                                                    </div>

                                                    

                                                    <div className=" col-12 col-sm-12 col-md-3"> 

                                                    {val.buyerid == ls.get('sellerid')?
                                                    <span>
                                                        Price: {val.currency} {val.price}
                                                    </span>
                                                    : ''
                                                    }
                                                    
                                                    </div>

                                                    <div className=" col-6 col-sm-6 col-md-2"> 
                                                    {val.buyerid == ls.get('sellerid')?
                                                        <a href={`${sellerUrl}/purchase-order.php?brid=${val.brid}&sellerid=${val.sellerid}&buyerid=${val.buyerid}`} className={`btn btn-solid`}>
                                                            Raise PO
                                                        </a>
                                                    : ''
                                                    }
                                                    </div>

                                                    
                                                    <div className="col-6  col-sm-6 col-md-3"> 
                                                    {val.buyerid == ls.get('sellerid')?
                                                        <button  onClick={this.chatToSeller.bind(this,val.sellerid,val.name)} className={`btn btn-solid`}>
                                                            Chat Now
                                                        </button>
                                                    : ''
                                                    }
                                                    </div>
                                                </div>

                                                    {/* {val.sellerid?
                                                    val.sellerid == ls.get('sellerid') ?
                                                    <div className="H5">{index+1} {' - '} {'You'}</div>
                                                    :<React.Fragment>
                                                    {index+1} {' - '}{
                                                    val.name && val.name !=''?
                                                        val.name
                                                    : val.email && val.email!=''? 
                                                        val.email.replace(val.email.substring(3,10), 'XXXXXXX')
                                                        :''
                                                    }
                                                    </React.Fragment> 
                                                    : ''
                                                    } */}

                                                    {/* {val.buyerid == ls.get('sellerid')?
                                                    <React.Fragment>
                                                        <span>
                                                            Price: {val.currency} {val.price}
                                                        </span>
                                                        <a href={`${sellerUrl}/purchase-order.php?brid=${val.brid}&sellerid=${val.sellerid}&buyerid=${val.buyerid}`} className={`btn btn-solid`}>
                                                            Raise PO
                                                        </a>
                                                    </React.Fragment>
                                                    : ''
                                                    } */}


                                                    </li>
                                                )
                                            }
                                            
                                        </ul>

                                        {this.state.selfPos && parseInt(this.state.selfPos) > 5 ?
                                        <div className="" >
                                            <ul className="list-group h5">
                                                {this.state.selfPos} {' - You'}
                                            </ul>
                                        </div>
                                        : ''}
                                    </div>
                                </div>
                                :''
                            :''
                            }
                    </div>
                    
                    <LoginPopUp footerData={this.footerData} login={this.state} openSignUpModal={this.openSignUpModal} closeModal={this.closeModal} />
                    <SignUpPopUp footerData={this.footerData} signup={this.state} openLoginModal={this.openLoginModal} closeModal={this.closeModal} />
                    <AcceptBid bidSubmitted={this.bidSubmitted} getBid={this.state} openSignUpModal={this.openSignUpModal} closeModal={this.closeModal} />
                </div>
            </React.Fragment>
        );
    }
}

export default withTranslate(withRouter(auction));