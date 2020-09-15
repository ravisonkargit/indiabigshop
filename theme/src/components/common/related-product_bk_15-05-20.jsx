import React, {Component} from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import {addToCart, addToWishlist, addToCompare, getRelatedProducts} from "../../actions";
import ProductListItem from '../collection/common/product-list-item';
import store from '../../store';
import { withTranslate } from 'react-redux-multilingual'

function showImageOnlyIfExist(ele){
    $('#'+ele).closest('.col-grid-box').addClass('d-none');
}

class RelatedProduct extends Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     relatedId: ''
        // }
    }
    async componentWillMount() {
        await store.dispatch(getRelatedProducts(this.props.product.id))
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
                       
                        { items &&
                        items.slice(0,20).map((product, index ) =>
                            (product)?
                            
                            <div key={index} className="col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1" key={index}>
                                    <ProductListItem product={product}
                                        checkImage={this.checkImage}
                                    />
                                {/* <ProductItem product={product} symbol={symbol}
                                             onAddToCompareClicked={() => addToCompare(product)}
                                             onAddToWishlistClicked={() => addToWishlist(product)}
                                             onAddToCartClicked={() => addToCart(product, 1)} key={index} /> */
                                    }
                            </div>
                            :''
                            )
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
        symbol: state.data.symbol
    }
}

export default withTranslate(connect(mapStateToProps, {addToCart, addToWishlist, addToCompare})(RelatedProduct));
