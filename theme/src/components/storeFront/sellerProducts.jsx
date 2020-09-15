import React, { Component } from 'react'
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getSearchResultsByCategory, addToCart, addToWishlist, addToCompare } from '../../actions'
import { getProductsByCategory } from '../../services';
import ProductListItem from '../collection/common/product-list-item';
import ReactPaginate from 'react-paginate';
import $ from 'jquery'
var query;

function showImageOnlyIfExist(ele){
    $('#'+ele).closest('.col-grid-box').addClass('d-none');
}

function getFileName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0]; 
    filename = filename.replace(/(#|\?).*?$/, "");
    return filename;                                   
}

class sellerProducts extends Component {
    constructor (props) {
        super (props)
        this.state = { limit: 100, hasMoreItems: true,products:[],activePage: 15 };
    }
    componentWillMount() {
        query = getFileName(window.location.pathname).split('/').pop().replace('.html', '');
        // this.props.getSearchResultsByCategory('0', query); 
        this.props.getSearchResultsByCategory(this.state.offset, this.props.perPage,query);
        // this.fetchMoreItems()
    }
    fetchMoreItems = () => {
        if (this.state.limit >= this.props.totalCount) {
            this.setState({ hasMoreItems: false });
            return;
        }
        // a fake async api call
        setTimeout(() => {
            if (this.state.limit <= this.props.totalCount){
                this.props.getSearchResultsByCategory(this.state.limit, query)
                Array.prototype.push.apply(this.state.products,this.props.products)
            }
            this.setState({
                limit: this.state.limit + 100
            });
        }, 2000);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.totalCount){
            this.setState({
                pageCount: Math.ceil(nextProps.totalCount/ this.props.perPage)
            });
        //    this.setState({entities:nextProps.entities})
        }
     
    }
    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.props.perPage);
        
        this.setState({ offset: offset }, () => {
            this.props.getSearchResultsByCategory(this.state.offset, this.props.perPage, query)
            const x = $(".product-filter-content")[0].scrollHeight
            window.scroll({top: x, left: 0, behavior: 'smooth' })
        });
    };

    checkImage = (setClass) => {
        showImageOnlyIfExist(setClass);
    }
    render() {
        const { products, addToCart, symbol, addToWishlist, addToCompare, totalCount } = this.props;
        // Array.prototype.push.apply(this.state.products,this.props.products)
        return (
            <div>
                <div className="product-wrapper-grid">
                    <div className="container-fluid">
                        {totalCount > 0 ?
                            <InfiniteScroll
                                dataLength={this.state.limit} //This is important field to render the next data
                                // next={this.fetchMoreItems}
                                hasMore={this.state.hasMoreItems}
                                // loader={<div className="loading-cls"></div>}
                                endMessage={
                                    <p className="seen-cls seen-it-cls">
                                        <b>Yay! You have seen it all</b>
                                    </p>
                                }
                            >
                                <div className="row">
                                    { this.props.products.slice(0, this.state.limit).map((product, index) =>
                                        <div className='col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1' key={index}>
                                            <ProductListItem product={product} symbol={symbol}
                                                checkImage={this.checkImage} 
                                                onAddToCompareClicked={() => addToCompare(product)}
                                                onAddToWishlistClicked={() => addToWishlist(product)}
                                                onAddToCartClicked={addToCart} key={index}/>
                                        </div>)
                                    }
                                </div>
                                <div className="row justify-content-md-center">
                                    <ReactPaginate
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
                            </InfiniteScroll>
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
const mapStateToProps = (state) => ({
    products: state.data.sellerProducts,
    // totalCount: state.data.totalCount,
    // categoryBanner: state.data.categoryBanner,
    // perPage:'50',
    // products: getVisibleproducts(state.data, state.filters),
    symbol: state.data.symbol,
})

export default connect(
    mapStateToProps
)(sellerProducts)