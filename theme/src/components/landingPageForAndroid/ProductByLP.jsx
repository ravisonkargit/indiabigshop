import React, { Component,Suspense,lazy } from 'react'
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
import { getProductsByLP, getAllCurrencyValue } from '../../actions'
// import ProductListItem from '../collection/common/product-list-item';
import store from '../../store';
import LoadingComponent from '../products/common/loading-bar';
import LazyLoad from 'react-lazy-load';
const ProductListItem = lazy(()=>import('../collection/common/product-list-item-app'))
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
class ProductByLP extends Component {
    constructor (props) {
        super (props)
        this.state = { limit: 100, hasMoreItems: true, products: [], activePage: 15,isFetching:0 };
        
    }

    // UNSAFE_componentWillMount = async (nextProps) => {
    //     await store.dispatch(getProductsByLP(this.props.cat_id))
    // }
    componentDidMount() {
        store.dispatch(getProductsByLP(this.props.cat_id,'1',''))
        // store.dispatch(getAllCurrencyValue())
    }

    // componentDidMount = async (nextProps) => {
    //     await store.dispatch(getProductsByLP(this.props.cat_id))

    // }

    componentDidUpdate() {
        window.scrollTo(1,0)
    }

    checkImage(setClass){
        showImageOnlyIfExist(setClass);
    }

    render() {
        const { products, addToCart, symbol, addToWishlist, addToCompare, totalCount } = this.props;
        // Array.prototype.push.apply(this.state.products,this.props.products)
        return (
            <div>
                
                <div className="product-wrapper-grid">
                    <div className="">
                        
                        {this.props.products ?
                            <React.Fragment>
                                <div className="row">
                                <Suspense fallback={<LoadingComponent />}>

                                    { products.map((product, index) =>
                                        product &&
                                        (product.name) &&
                                            // <div className='col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1' key={index}>
                                            <div className='col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-1' key={index}>
                                                
                                        <ProductListItem 
                                            product={product} symbol={symbol}
                                            checkImage={this.checkImage} 
                                                        
                                        />
                                                   

                                    </div>
                                        )
                                    }
                                </Suspense>

                                </div>
                            </React.Fragment>
                            :
                            <div className="row">
                                <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                    <h3>Sorry! Couldn't find the product you were looking For!!!    </h3>
                                    <p>Please check if you have misspelt something or try searching with other words.</p>
                                    <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid">continue shopping</Link>
                                </div>
                            </div>
                            }
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state,ownProps) => ({
    products: state.productsByLP.productsByLP,
    cat_id1:ownProps.cat_id,
    perPage:'50',
    // products: getVisibleproducts(state.data, state.filters),
    symbol: state.data.symbol,
    currencyValue: state.currencyValue.currencyValue
})

export default connect(
    mapStateToProps
)(ProductByLP)  