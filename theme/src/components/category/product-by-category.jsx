import React, { Component,lazy } from 'react'
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
// import {getSearchResultsByCategory, addToCart, addToWishlist, addToCompare } from '../../actions'
import {getSearchResultsByCategory } from '../../actions'
import { getProductsByCategory } from '../../services';
// import ProductListItem from '../collection/common/product-list-item';
import ReactPaginate from 'react-paginate';
import $ from 'jquery'
import { withTranslate } from 'react-redux-multilingual'
import LoadingComponent from '../products/common/loading-bar';

const ProductListItem = lazy(()=>import('../collection/common/product-list-item'))

var query;
var imgWrapper = '';
function getFileName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0]; 
    filename = filename.replace(/(#|\?).*?$/, "");
    return filename;                                   
}

function showImageOnlyIfExist(ele){
    $('#'+ele).closest('.col-grid-box').addClass('d-none');
}

class ProductByCategory extends Component {
    constructor (props) {
        super (props)

        let search = window.location.search;
        var params = new URLSearchParams(search);

        this.state = { 
            limit: 100, 
            hasMoreItems: true,
            products:[],
            activePage: 15,
            pageNo: parseInt(params.get('page')) > 0 ? parseInt(params.get('page')) : 0,
            offset: 1,
            totalProduct: 1,
            perPage: 50,
            isPageLoaded: 0,
            totalCount: 0
         };
    }

    componentDidMount() {

        this.setState((prevState, props) => {
            return {offset: (prevState.pageNo * prevState.perPage)}
        }, () => {
            //this.props.getSearchResults(this.state.offset,this.props.perPage)

            query = getFileName(window.location.pathname).split('/').pop().replace('.html', '');
            this.props.getSearchResultsByCategory(this.state.offset, this.state.perPage,query)
            .then(res => {
                console.log(res);
                if (this.state.isPageLoaded == 0) {
                    this.setState({
                    isPageLoaded: 1,
                    products: res,
                    totalCount: res,
                    pageCount : Math.ceil( parseInt(res) / parseInt(this.state.perPage))
                    });
                }
            })

        })
        
        // this.fetchMoreItems();
    }

    handlePageClick = data => {
        if (this.state.pageNo != data.selected){
            let selected = data.selected;
            window.location.href = window.location.pathname+'?page='+selected;
        }
    };

    // componentWillMount() {
    //     query = getFileName(window.location.pathname).split('/').pop().replace('.html', '');
    //     // this.props.getSearchResultsByCategory('0', query); 
    //     this.props.getSearchResultsByCategory(this.state.offset, this.props.perPage,query);
    //     // this.fetchMoreItems()
    // }
    // fetchMoreItems = () => {
    //     if (this.state.limit >= this.props.totalCount) {
    //         this.setState({ hasMoreItems: false });
    //         return;
    //     }
    //     // a fake async api call
    //     setTimeout(() => {
    //         if (this.state.limit <= this.props.totalCount){
    //             this.props.getSearchResultsByCategory(this.state.limit, query)
    //             Array.prototype.push.apply(this.state.products,this.props.products)
    //         }
    //         this.setState({
    //             limit: this.state.limit + 100
    //         });
    //     }, 2000);
    // }
    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.totalCount){
    //         this.setState({
    //             pageCount: Math.ceil(nextProps.totalCount/ this.props.perPage)
    //         });
    //     //    this.setState({entities:nextProps.entities})
    //     }
     
    // }
    // handlePageClick = data => {
    //     let selected = data.selected;
    //     let offset = Math.ceil(selected * this.props.perPage);
        
    //     this.setState({ offset: offset }, () => {
    //         this.props.getSearchResultsByCategory(this.state.offset, this.props.perPage, query)
    //         const x = $(".product-box")[0].scrollHeight
    //         window.scroll({top: x, left: 0, behavior: 'smooth' })
    //     });
    // };

    
    checkImage = (setClass) => {
        showImageOnlyIfExist(setClass);
    }
    render() {
        // const { products, symbol, addToCart, addToWishlist, addToCompare, totalCount,translate } = this.props;
        const { products, symbol,translate } = this.props;
        // Array.prototype.push.apply(this.state.products,this.props.products)
        return (
            <div>
                <div className="product-wrapper-grid">
                    <div className="container-fluid p-0">
                    {this.state.isPageLoaded <= 0?(
                            <LoadingComponent />
                        )
                        :
                        this.state.totalCount > 0 ?
                            <React.Fragment>
                                <div className="row">
                                    { this.state.products.slice(0, this.state.limit).map((product, index) =>
                                        <div className='col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1' key={index}>
                                        <ProductListItem checkImage={this.checkImage} 
                                                        product={product} 
                                                        symbol={symbol}
                                                        //  onAddToCompareClicked={() => addToCompare(product)}
                                                        //  onAddToWishlistClicked={() => addToWishlist(product)}
                                                        //  onAddToCartClicked={addToCart} 
                                                         />
                                        </div>
                                        )
                                    }
                                </div>
                                <div className=" mouse_pointer row justify-content-md-center small">
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
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" alt="Beldara.com No Category" />
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
    // products: getProductsByCategory(state.data, state.filters),
    // totalCount: state.data.totalCount,
    categoryBanner: state.data.categoryBanner,
    // perPage:'50',
    // products: getVisibleproducts(state.data, state.filters),
    symbol: state.data.symbol,
})

export default withTranslate(connect(
    mapStateToProps, {getSearchResultsByCategory
        // ,addToCart, addToWishlist, addToCompare
    }
)(ProductByCategory))