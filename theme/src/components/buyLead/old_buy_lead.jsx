import React, {Component} from 'react';
import $ from "jquery";
import ls from 'local-storage';
import { Redirect } from 'react-router-dom';
import Breadcrumb from '../common/breadcrumb';
import { connect } from 'react-redux';
import { getAllBuyLead } from '../../actions';
import './buyLead.css';
import SignUpPopUp from '../signUpPopUp';
import LoginPopUp from '../loginPopUp';
import ReactPaginate from 'react-paginate';
import RazorpayForm from '../razorpayForm';
import { withTranslate } from 'react-redux-multilingual'
import store from '../../store';
import axios from 'axios';

var sellerid = ls.get('sellerid');
var lead_amount_inr = '299';
var lead_amount_usd = '5';
var pageNo = parseInt(1);
var pageCount = 0;
var domain = '';
class BuyLead extends Component {
    constructor(props){
        super(props);
        
        this.state = { 
            id:'pay',
            page:0,
            signup : false,
            login : false,
            reload: 0,
            limit: 20,
            pageCount:0 ,
            from:0,
            totalCount: 100,
            link: '/thankyou.html',
            amount: 299,
            currency: 'INR',
            name: 'jeera',
            number:123,
            brid:0,
            email: 'jeera-dono',
            value: "sellerid=4449192, buyername=NA, mode=2, brid=111, amount=299, currency=INR",
            thankyou:0,
            data: ''
        };
    }

    footerData = (data) => {
        if (data.modalChange)
            this.setState({
                signup : data.modal,
                login : data.modal
            })

        this.setState({
            reload: data.reload
        })

        if (data.reload.paymentModal)
            $('.razorpay-payment-button').click();
    };

    validate = (brid) => {
        this.setState({
            brid: brid,
        })
        sellerid ?
        $('.razorpay-payment-button').click()
        : this.setState({
            login: true,
        })
    }

    closeModal = () =>{
        this.setState({
            login: false,
            signup: false,
        })
    }

    openSignUpModal = () =>{
        this.setState({ 
            signup: true,
            login: false,
        });
    }

    openLoginModal = () =>{
        this.setState({ 
            signup: false,
            login: true,
        });
    }

    handlePageClick = data => {
        let selected = data.selected;
        // console.log(this.state.reload);
        // pageNo = selected
        // this.setState({
        //     page:selected
        // });
        window.location.href = '/buy-leads.html?page='+selected;
        
    };

    async componentWillMount(){

        var hostname = window.location.hostname;
        // if (hostname === undefined || hostname == '')
        // hostname = "german.beldara.com";
        let domain_language_code = '';
        let langDomain = hostname.split("beldara.com")[0];
        langDomain = langDomain.replace(".", "");
        this.props.languageMaster.languageMaster.forEach(element => {
          if (element.main_language.toLowerCase() == langDomain.toLowerCase())
            domain_language_code = element.code;
        }, this);
        if (domain_language_code !== "" && domain_language_code !== undefined) {
          await axios
            .post(
              "https://api.indiabigshop.com/common/static_page.php",
              { security_token: "", plateform_type: "", langCode: domain_language_code,pageid:'16' },
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
        } else {
          await axios
            .post(
              "https://api.indiabigshop.com/common/static_page.php",
              { security_token: "", plateform_type: "", langCode: 'en',pageid:'16' },
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

        let search = window.location.search;
        let params = new URLSearchParams(search);
        let currentpage = 0;
        pageNo = parseInt(params.get('page')) + parseInt(1);
        console.log('this is page',pageNo);
        // console.log('pageNo: '+ parseInt(pageNo));
        if (params.get('page') !== undefined && params.get('page') != '')
            currentpage = params.get('page') *this.state.limit;

        // this.props.getAllBuyLead(currentpage, this.state.limit);
        store.dispatch(getAllBuyLead(currentpage, this.state.limit))
        domain = window.location.hostname;
        if (this.props.data.symbol == 'USD')
        {
        this.setState({
        currency: this.props.data.symbol,
        amount: lead_amount_usd
        })
        }else{
        this.setState({
        currency: this.props.data.symbol,
        amount: lead_amount_inr
        })
        }
    }

    componentWillReceiveProps = (nextProps) => {
       pageCount = Math.ceil(nextProps.buyLead.buyLead.count/ this.state.limit)
    }
    render (){
        const { translate } = this.props;
        return (
            <div >
                <input type="hidden" value={sellerid} name="sellerid" />
                <input type="hidden" value={lead_amount_inr} name="lead_amount_inr" />
                <input type="hidden" value={lead_amount_usd} name="lead_amount_usd" />

                {/* {this.state.reload == 1?
                    <Redirect to={`/buy-leads.html?page=${pageNo}`} />
            :''} */}
            <RazorpayForm id={this.state.id} action={this.state.link} amount={this.state.amount} currency={this.state.currency} name={this.state.name} mobile={this.state.number} email={this.state.email} value={`sellerid=`+ls.get('sellerid')+`, buyername=NA, mode=2, brid=`+this.state.brid+`, amount=`+this.state.amount+`, currency=`+this.state.currency+`, mainurl=`+domain} />

            <Breadcrumb title={'Buy Leads'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title}/>
            <div className="container">
                <div className="row">
                {
                    this.props.buyLead.buyLead.leads.map(item =>
                        
                        <div key={item.brid} className="col-md-6 col-sm-12 my-2">
                            
                        <div className="border border-dark p-2  h-100">
                                <div id={item.buyerid} className="card_lead" >
                                    <div className="">
                                        <div className="lead_name form-inline">
                                            <div className="text-truncate">
                                                {item.keyword}
                                            </div>
                                        </div>

                                        <div className="lead_detail text-truncate" >
                                           { item.keyword !== undefined && item.keyword != '' ?
                                           <React.Fragment>
                                                <div>Buyer is Looking for <b>{item.keyword}</b></div>
                                                { item.keyword !== undefined && item.keyword != '' ?
                                                <div>Supplier : <b>{item.supplier_from}</b></div>
                                                :''}
                                            </React.Fragment>
                                                : ''
                                                }
                                        </div>

                                        <div className='text-muted text-truncate comment small'>
                                        { item.remark !== undefined && item.remark != '' ?
                                           <React.Fragment>
                                                <div><i className="fa fa-comment"></i> <b>{item.remark}</b></div>
                                                { item.qty !== undefined && item.qty != '' ?
                                                <div><b>Requirement:</b> {item.qty}</div>
                                                :''}
                                                { item.qty !== undefined && item.qty != '' ?
                                                <div><b>{item.unit}</b> </div>
                                                :''}
                                            </React.Fragment>
                                                : ''
                                                }
                                        </div>
                                    </div>
                                    <div className='d-flex'>

                                    { item.post_req_img !== undefined && item.post_req_img != '' ?
                                    <React.Fragment>
                                        <div className='img_lead_product'><img className="lead_img" src={item.post_req_img} /></div>
                                    </React.Fragment>
                                        : ''
                                        }
                                        <div className="ml-auto">
                                            <span className="btn btn-solid get_lead"
                                                  onClick={() => this.validate(item.brid)}>{translate('Get Lead')}</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="small d-flex">
                                    <div className="p-2">
                                    { item.location !== undefined && item.location != '' ?
                                    <React.Fragment><i className="fa fa-map-marker"></i> {item.location} </React.Fragment>
                                        : ''
                                        }
                                    </div>
                                    <div className="p-2">
                                    { item.sysdate !== undefined && item.sysdate != '' ?
                                    <React.Fragment><i className="fa fa-calendar"></i> {item.sysdate} </React.Fragment>
                                        : ''
                                        }
                                    </div>
                                </div>

                            </div>
                            </div>  
                            
                    )
                }
                </div>
                <div className="row justify-content-md-center">
                    <ReactPaginate
                        initialPage={pageNo}
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
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
            </div>  
            </div>             
        )
    }
}


// const mapStateToProps = (state) => ({
//      count : state.buyLead.buyLead.count,
//     buyLead: state.buyLead.buyLead.leads,
//     languageMaster: state.languageMaster.languageMaster,
//      data:state.data
// });

const mapStateToProps = (state) => {
     return state;
};

export default withTranslate(connect(mapStateToProps)(BuyLead));
// export default BuyLead;
