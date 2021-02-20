import React, {Component} from 'react';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate'; 
import $ from 'jquery';
import {getSearchResults} from '../../../actions'
// import {getSearchResults, addToCart, addToWishlist, addToCompare } from '../../../actions'
import {getSearchProducts} from '../../../services';
import ProductListItem from "./product-list-item";
import { withTranslate } from 'react-redux-multilingual'
import LoadingComponent from '../../products/common/loading-bar';

function showImageOnlyIfExist(ele){
    $('#'+ele).parent().closest('.col-grid-box').addClass('d-none');
}

class ProductListing extends Component {

    constructor (props) {
        super(props)
        let search = window.location.search;
        var params = new URLSearchParams(search);

        
        this.state = { 
            limit: 50,
             hasMoreItems: true,
             products:[],
             pageCount:0,
            isPageLoaded: 0,
            query : params.get("q"),
            pageNo: parseInt(params.get('page')) > 0 ? parseInt(params.get('page')) : 0,
            offset: 1,
            totalProduct: 1,
            totalCount: 0
            };
    }

    componentDidMount() {

        this.setState((prevState, props) => {
            return {offset: (prevState.pageNo * props.perPage)}
        }, () => {
            
            this.props.getSearchResults(this.state.offset,this.props.perPage)
            .then(res => {
                if (this.state.isPageLoaded == 0 && res[0][0]) {
                    this.setState({
                    isPageLoaded: 1,
                    products: res[0][0],
                    totalCount: res[0][1],
                    pageCount : Math.ceil( parseInt(res[0][1]) / parseInt(this.props.perPage))
                    }, () => {
                        // console.log(this.state.products)
                    });
                }
            })

        })
        
        // this.fetchMoreItems();
    }
    

    // UNSAFE_componentWillMount() {
    //     console.log('UNSAFE_componentWillMount')
    //     this.props.getSearchResults(this.state.offset,this.props.perPage)
    //     .then(res => {
    //         if (this.state.isPageLoaded == 0) {
    //             this.setState({
    //               isPageLoaded: 1
    //             });
    //           }
    //     })
    //     // this.fetchMoreItems();
    // }

    // fetchMoreItems = () => {
    //     if (this.props.perPage >= this.props.totalCount) {
    //         this.setState({ hasMoreItems: false });
    //         return;
    //     }
    //     // a fake async api call
    //     setTimeout(() => {
    //         if (this.props.perPage <= this.props.totalCount){
    //             // this.props.getSearchResults(this.state.limit)
    //             this.props.getSearchResults(this.state.offset,this.props.perPage)
    //             // console.log(this.props.products)
    //         }
    //         this.setState({
    //             limit: this.state.limit + 50
    //         });
    //     }, 1000);
        
    // }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     console.log('UNSAFE_componentWillReceiveProps', nextProps, nextProps.totalCount, this.props.perPage)
    //     if(nextProps.totalCount){
    //         this.setState({
    //             pageCount: Math.ceil(nextProps.totalCount/ this.props.perPage)
    //         });
    //     }
    // }

    // handlePageClick = data => {
    //     let selected = data.selected;
    //     let offset = Math.ceil(selected * this.props.perPage);
    //     this.setState({ offset: offset }, () => {
    //         // this.fetchMoreItems()
    //         this.props.getSearchResults(this.state.offset, this.props.perPage)
    //         const x = $(".product-filter-content")[0].scrollHeight
    //         window.scroll({top: -x, left: 0, behavior: 'smooth' })
    //     });
        
    // };

    handlePageClick = data => {
        console.log('handlePageClick', this.state.pageNo ,data.selected)
        if (this.state.pageNo != data.selected){
            let selected = data.selected;
            
            window.location.href = window.location.pathname+'?q='+this.state.query+'&page='+selected;
        }
    };

    checkImage = (setClass) => {
        showImageOnlyIfExist(setClass);
    }

    render (){
        // console.log('render',132);
        //const { products, addToCart, symbol, addToWishlist, addToCompare, totalCount, callstate ,translate } = this.props;
        const {  symbol ,translate } = this.props;
        return (
            <div className="col-12 p-0">
                <div className="product-wrapper-grid">
                    <div className="container-fluid p-0">
                        {this.state.isPageLoaded <= 0?(
                            <LoadingComponent />
                        )
                        :
                        this.state.totalCount > 0 && this.state.products ?
                            <React.Fragment>
                                <div className="row">
                                    { //this.props.products.slice(0, this.state.limit).map((product, index) =>
                                    this.state.products.slice(0, this.state.limit).map((product, index) =>
                                        <div className={`${this.props.colSize===3?'col-6 col-xl-3 col-md-6 col-xs-6 col-grid-box px-0 px-sm-0 px-md-1':'col-lg-'+this.props.colSize+'col-sm-6 col-xs-6 px-0 px-sm-0 px-md-1 col-grid-box'}`} key={index}>
                                            <ProductListItem product={product} symbol={symbol}
                                                checkImage={this.checkImage} 
                                                // onAddToCompareClicked={() => addToCompare(product)}
                                                // onAddToWishlistClicked={() => addToWishlist(product)}
                                                // onAddToCartClicked={addToCart} 
                                                key={index}
                                                
                                                />
                                        </div>)
                                    }
                                    
                                </div>
                                <div className="mouse_pointer row justify-content-md-center small">
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
                            </React.Fragment>
                            :
                            <div className="row">
                                <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                    <h3>{translate('Sorry! Couldnt find the product you were looking For!!!')}    </h3>
                                    <p>{translate('Please check if you have misspelt something or try searching with other words')}.</p>
                                    <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid">{translate('Continue shopping')}</Link>
                                </div>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    // products: getSearchProducts(state.data, state.filters),
    // totalCount: state.data.totalCount,
    perPage:'51',
    // products: getVisibleproducts(state.data, state.filters),
    symbol: state.data.symbol,
    hole_data: state
})

export default withTranslate(connect(
    mapStateToProps, {getSearchResults}
)(ProductListing))