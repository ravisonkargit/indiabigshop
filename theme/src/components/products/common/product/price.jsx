import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Slider from 'react-slick';
import Requirement from '../../../form/requirement';
import {imageExists, getCookie} from '../../../../functions'
import store from '../../../../store';
import { getStoreFront,getAllBanners } from '../../../../actions';
import { withTranslate } from 'react-redux-multilingual'
import { imgUrl } from '../../../../constants/variable';


class Price extends Component {

    constructor (props) {
        super (props)
        this.state = {
            quantity:1,
            stock: 'InStock',
            nav3: null,
            buyer_country : '',
            buyer_country_id : '',
            buyer_country_name : ''

        }
    }

    componentDidMount() {
        this.setState({
            nav3: this.slider3
        });
    }

    minusQty = () => {
        if(this.state.quantity > 1) {
            this.setState({stock: 'InStock'})
            this.setState({quantity: this.state.quantity - 1})
        }
    }

    plusQty = () => {
        if(this.props.item.stock >= this.state.quantity) {
            this.setState({quantity: this.state.quantity+1})
        }else{
            this.setState({stock: 'Out of Stock !'})
        }
    }
    changeQty = (e) => {
        this.setState({ quantity: parseInt(e.target.value) })
    }

    componentWillUpdate(nextProps) {
        try {
            if (nextProps.user.user.countryid != this.state.country_id) {
                this.setState({
                    buyer_country: nextProps.user.user.country,
                    buyer_country_id: nextProps.user.user.countryid,
                    buyer_country_name:  nextProps.user.user.country_name
                })
            }
        }catch (e) {
                
        }
    }

    render (){
        const { symbol, item, addToCartClicked, BuynowClicked, translate } = this.props
        const {buyer_country_id, buyer_country, buyer_country_name} = this.props
        var colorsnav = {
            slidesToShow: 6,
            swipeToSlide:true,
            arrows: false,
            dots: false,
            focusOnSelect: true
        };
        
        return (
            <div className="col-lg-4">
                {/* { ( (item.beldara_prime==0 || item.beldara_prime==null) && ((buyer_country_id.toLowerCase() != '91' && buyer_country_id.toLowerCase() != '1')  || ( (buyer_country_id == '' || buyer_country_id === undefined || buyer_country_id === null) && getCookie('country_code').toLowerCase() != 'us' && getCookie('country_code').toLowerCase() != 'in' ) )) ? */}
                <div className="text-center">POST YOUR REQUIREMENT</div>
                <div className="product-right product-form-box shadow rounded border-0 ">
                    
                    {/* <h4>
                        <span>{item.name}</span>
                    </h4> */}
                    <h4>{item.surl ?
                        <a style={{color:'orange'}} href={`${process.env.PUBLIC_URL}/store/${item.surl}.html`}>
                            {item.logo != '' && item.logo ?
                                <span><img src={`${item.logo}`} onError={(e) => { e.target.onerror = null; e.target.src = `${imgUrl + '/images/company-default-logo.png'}` }} style={{ width: '60px', height: '60px', border: '1px solid' }} className="shadow-sm rounded-circle" /></span>
                                : ''
                            }
                            {item.company}

                        </a>
                        : <div style={{ color: 'orange' }} >{item.company}</div>}</h4>
                    
                    <div className="d-flex justify-content-center">
                    {item.beldara_prime == '1'  ?
                        <span className="mr-2"><img style={{maxWidth:'100px'}} src={`${imgUrl}/images/ship_by_bd_prime.png`} /></span>
                                : ''
                            }
                    {/* <ul className="color-variant"> */}
                        {/* <Slider {...colorsnav} asNavFor={this.props.navOne} ref={slider => (this.slider1 = slider)} className="color-variant"> */}
                            {/* {item.variants.map((vari, i) => {
                                return <li className={vari.color} key={i} title={vari.color}></li>
                            })} */}
                        {/* </Slider> */}
                    {/* </ul> */}
                    <span className="product-title mr-2">{ item.country_flag ? <img  src={`${item.country_flag}`} style={{ width: '25px', height: '25px', border: '1px solid' }} onError={(e)=>{e.target.onerror = null; e.target.className="d-none"}} className="shadow-sm rounded-circle mr-2" alt={'beldara.com'}/> :'' }{item.country}</span>
                    {item.otp_verify == '1' ?
                        <span className="product-title"><span className="badge badge-pill badge-success p-1"><i className="fa fa-check mr-1"></i>
                            {translate('Verified Supplier')}
                        </span></span>
                            : ''}
                        </div>
                    {/* <div className="product-buttons border-product mt-1">
                        <h6 className=""><small><button className="btn btn-solid">Contact Supplier</button></small></h6>
                    </div> */}
                    {/* <div className="product-description border-product">
                        <h6 className="product-title">Time Reminder</h6>
                        <div className="timer">
                            <p id="demo">
                                <span>25
                                    <span className="padding-l">:</span>
                                    <span className="timer-cal">Days</span>
                                </span>
                                <span>22
                                    <span className="padding-l">:</span>
                                    <span className="timer-cal">Hrs</span>
                                </span>
                                <span>13
                                    <span className="padding-l">:</span>
                                    <span className="timer-cal">Min</span>
                                </span>
                                <span>57
                                    <span className="timer-cal">Sec</span>
                                </span>
                            </p>
                        </div>
                    </div> */}
                    <div className="product-description border-product mt-2">
                        {/* <h6 className="product-title size-text">select size
                            <span><a href="" data-toggle="modal"
                                     data-target="#sizemodal">size chart</a></span></h6>
                        <div className="modal fade" id="sizemodal" tabIndex="-1"
                             role="dialog" aria-labelledby="exampleModalLabel"
                             aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered"
                                 role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"
                                            id="exampleModalLabel">Sheer Straight
                                            Kurta</h5>
                                        <button type="button" className="close"
                                                data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <img crossOrigin="anonymous" src={`${process.env.PUBLIC_URL}/assets/images/size-chart.jpg`}
                                             alt="" className="img-fluid"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="size-box">
                            <ul>
                                {/* {item.size.map((size, i) => {
                                    return <li key={i}><a href="#">{size}</a></li>
                                })} */}
                            {/* </ul>
                        </div>
                        <span>{this.state.stock}</span>
                        <h6 className="product-title">quantity</h6>
                        <div className="qty-box">
                            <div className="input-group">
                                  <span className="input-group-prepend">
                                    <button type="button" className="btn quantity-left-minus" onClick={this.minusQty} data-type="minus" data-field="">
                                     <i className="fa fa-angle-left"></i>
                                    </button>
                                  </span>
                                <input type="text" name="quantity" value={this.state.quantity} onChange={this.changeQty} className="form-control input-number" />
                                <span className="input-group-prepend">
                                <button type="button" className="btn quantity-right-plus" onClick={this.plusQty} data-type="plus" data-field="">
                                <i className="fa fa-angle-right"></i>
                                </button>
                               </span>
                            </div>
                        </div> */}
                        <Requirement product={item} />
                        
                    </div>
                    
                </div>
                {/* : 
                <div className="">
                    <ul class="list-group rounded shadow-sm">
                            {item.storename ?
                                <li class="list-group-item">Sold By : {item.surl ?
                                    <a style={{ color: 'orange' }} href={`${process.env.PUBLIC_URL}/store/${item.surl}.html`}> {item.storename} <i className="fa fa-external-link-square-alt ml-1"></i> </a> : <span style={{color:"orange"}}>{item.storename}</span>}
                        
                        <h6 className="product-title">
                            <span className="badge badge-pill badge-success p-1">
                                <i className="fa fa-check mr-1"></i>
                                {translate('Prime Supplier')}
                            </span>
                        </h6>
                        </li> :'' }
                        <li class="list-group-item">{`Ship By : `}<img src={`${imgUrl}/images/ship_by_bd_prime.png`} /></li>
                        <li class="list-group-item">{`Ship From : KS,USA`}</li>
                        
                    </ul>    
                </div>
                } */}
            
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return state;
  };
  
  export default withTranslate(
    connect(
      mapStateToProps
    )(Price)
  );