import React, { Component } from 'react'

import '../common/index.scss';
import Breadcrumb from "../common/breadcrumb";
// import custom Components
import ProductListing from '../collection/common/product-listing'
// import FilterBar from "../common/filter-bar";
// import FilterBar from "../collection/common/filter-bar";
// import store from '../../store';
// import translations from './constants/translations'
// import { getSearchResults } from '../../actions'


class Search extends Component {
    state = {
        layoutColumns: 3,
        query:''
    }

    LayoutViewClicked(colums) {
        this.setState({
            layoutColumns:colums
        })
    }
    
    componentDidMount() {
        window.scrollTo(1,0)
    }

    render() {
        // store.dispatch(getSearchProducts());
        return (
            
            <React.Fragment>
                <Breadcrumb title={'Search results'} metaTitle={'Search for what you looking for... | beldara.com'} metaDesc={'Searching'}/>
                
                {/*Section Start*/}
                <section className="section-b-space py-0">
                    <div className="collection-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="collection-content col">
                                    <div className="page-main-content">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                   
                                                    <div className="collection-product-wrapper product-filter-content">
                                                        

                                                        <div className="product-wrapper-grid">
                                                            <div className="container-fluid p-0">
                                                                <div className="row ">
                                                                    <ProductListing colSize={this.state.layoutColumns} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Section End*/}
            </React.Fragment>
        )
    }
}

export default Search;