import React, {Component} from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import {addToCart, addToWishlist, addToCompare, getRelatedProducts} from "../../actions";
import ProductListItem from '../collection/common/product-list-item';
// import ProductListItemNew from '../collection/common/product-list-item-new';
import store from '../../store';
import { withTranslate } from 'react-redux-multilingual'
import Axios from 'axios';
import * as types from '../../constants/variable';
import { getCookie } from '../../functions';
import LoadingComponent from "../products/common/loading-bar";

function showImageOnlyIfExist(ele){
    $('#'+ele).closest('.col-grid-box').addClass('d-none');
}

class RelatedProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items:null
        }
    }
    async componentWillMount() {
        await store.dispatch(getRelatedProducts(this.props.product.id))
        // this.getRelProducts();
    }
    async componentWillReceiveProps(){
        await this.setState({items:null})
        // this.getRelProducts();
    }
    getRelProducts = async () => {
        Axios.post(
            `${types.apiUrl}get_related_prod1_new.php`,
            {prod_id:this.props.product.id,country_code:getCookie('country_code'),currency:getCookie('currency'),security_token:'',plateform_type:''},
            {
                headers:{
                    "content-type":"multipart/form-data"
                }
            }
        ).then(async response => {
            if(response.data.statusId == '1'){
                await this.setState({
                    items:response.data.result
                })
                console.log(response.data,40);
            }
        }).catch(error => {
            console.log('error:'+error,40);
        })
    } 
    // async componentDidUpdate(prevProps, prevState) {
    //     
    //     // if (this.props.product.id === prevState.relatedId)
    //     // {
    //         // this.setState({
    //         //     relatedId:this.props.product.id
    //         // })
    //     // }
        
    // }
    // async componentWillReceiveProps(nextProps,prevProps) {
    //     if (nextProps.product.id !== prevProps.product.id)
    //         await store.dispatch(getRelatedProducts(this.props.product.id))
            
    // }
    checkImage = (setClass) => {
        showImageOnlyIfExist(setClass);
    }

    render() {
        const {items, symbol, addToCart, addToWishlist, addToCompare,translate} = this.props;
        // const {items} = this.state;
        //
        return (
            <section className="section-b-space">
                <div className="container">
                    <div className="row">
                        <div className="col-12 product-related">
                            <h2>{translate('RELATED PRODUCTS')}</h2>
                        </div>
                    </div>
                    <div className="row search-product">
                        { items != null ?
                        items.slice(0,20).map((product, index ) =>
                            (product)?
                            <div key={index} className="col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1" key={index}>
                                    <ProductListItem product={product}
                                        checkImage={this.checkImage}
                                    />
                                    {/* <ProductListItemNew product={product}
                                        checkImage={this.checkImage}
                                    /> */}
                            </div>
                            : ''
                            )
                         : <LoadingComponent />   
                        }
                    </div>
                </div>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        // items: getRelatedItems(state.data.products,'Livestock & Agriculture'),
        items: state.data.relatedProducts,
        symbol: state.data.symbol,
        hole_data : state
    }
}

export default withTranslate(connect(mapStateToProps, {addToCart, addToWishlist, addToCompare})(RelatedProduct));
