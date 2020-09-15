import React, { Component,Suspense,lazy } from 'react'
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
import { getProductsByLP, getAllCurrencyValue } from '../../actions'
// import ProductListItem from '../collection/common/product-list-item';
import store from '../../store';
import LoadingComponent from '../products/common/loading-bar';
import LazyLoad from 'react-lazy-load';
import axios from "axios";
import * as types from "../../constants/ActionTypes";
import { lstat } from 'fs';
import ls from "local-storage";
import { getCookie } from '../../functions';
const ProductListItem = lazy(()=>import('../collection/common/product-list-item-offer'))
var query;

function getFileName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0]; 
    filename = filename.replace(/(#|\?).*?$/, "");
    return filename;                                   
} 

function showImageOnlyIfExist(ele){
    // $('#'+ele).closest('.col-grid-box').addClass('d-none');
}
var isFetching=0
class ProductByOffer extends Component {
    constructor (props) {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        super (props)
        this.state = { limit: 100, hasMoreItems: true, products: [], activePage: 15,isFetching:0 ,products:[],loaded:false,offset:1,totalCount:0,page:parseInt(params.get('page')) > 0 ? parseInt(params.get('page')) : 0};
    }

    // UNSAFE_componentWillMount = async (nextProps) => {
    //     await store.dispatch(getProductsByLP(this.props.cat_id))
    // }
    async componentDidMount() {
        // store.dispatch(getProductsByLP(this.props.cat_id))
        this.getProductData();
        // store.dispatch(getAllCurrencyValue())
    }

    getProductData = async () => {
       
        // var offset = params.get('page'); 
        // console.log(params.get('page'),47);
        axios.post(
            `${types.ApiUrl}/common/get_prod_by_offer.php`,
            {plateform_type:"",security_token:"",sellerid:ls.get('log_id'),currency:getCookie('currency'),country_code:getCookie('country_code'),country_to:getCookie('countryid'),offset:this.state.page},
            {
                headers:{
                    "content-type":"multipart/form-data"
                }
            }
            ).then(async res => {
                // console.log(res,48);
                if(res.data.statusId == 1){
                    await this.setState({
                        products : res.data.result,
                        loaded:true
                    })
                }else{

                }
            }).catch(error =>{
                console.log(error,56);
            })
    }

    // componentDidMount = async (nextProps) => {
    //     await store.dispatch(getProductsByLP(this.props.cat_id))

    // }

    async componentDidUpdate() {
        // this.getProductData();
        window.scrollTo(1,0)
    }

    async componentWillReceiveProps(){
        // console.log('componentWillReceiveProps','ProductByOffer');
        this.getProductData();
    }
    checkImage(setClass){
        showImageOnlyIfExist(setClass);
    }

    render() {
        const { products, addToCart, symbol, addToWishlist, addToCompare, totalCount } = this.state;
        // console.log(this.state.products.length,'render');
        // Array.prototype.push.apply(this.state.products,this.props.products)
        return (
            <div>
                
                <div className="product-wrapper-grid">
                    <div className="">
                                {
                                    (!this.state.loaded)
                                    ? 
                                        <div className="" id="loader-gif">
                                            <LoadingComponent />
                                        </div>
                                    :(this.state.products && this.state.products.length > 0)
                                        ?
                                        <React.Fragment>
                                        <div className="row">
                                            {/* <Suspense fallback={<LoadingComponent />}> */}
        
                                                { products.map((product, index) =>
                                                    product &&
                                                    (product.name) &&
                                                        // <div className='col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1' key={index}>
                                                        <div className='col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-1' key={index}>
                                                            
                                                    <ProductListItem 
                                                        product={product} symbol={this.props.data.symbol}
                                                        checkImage={this.checkImage} 
                                                                    
                                                    />
                                                            
        
                                                </div>
                                                    )
                                                }
                                            {/* </Suspense> */}
                                        </div>
                                        </React.Fragment>
                                    :       
                                        <div className="row">
                                            <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                                <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                                <h3>Sorry! No Offer Products found!!!    </h3>
                                                <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid">continue shopping</Link>
                                            </div>
                                        </div>
                                
                                }
                        {/* {this.state.products && this.state.products.length > 0 ?
                            
                            :
                            
                            } */}
                    </div>
                </div>
            </div>
        )
    }
}
// const mapStateToProps = (state,ownProps) => ({
//     perPage:'50',
//     symbol: state.data.symbol,
//     currencyValue: state.currencyValue.currencyValue,
// })

const mapStateToProps = state => {
    return state;
   };

export default connect(
    mapStateToProps
)(ProductByOffer)  