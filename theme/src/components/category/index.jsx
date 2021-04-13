import React, { Component } from 'react'
import { connect } from "react-redux";

import Breadcrumb from '../common/breadcrumb';
import ProductByCategory from './product-by-category';
import FilterBar from "../collection/common/filter-bar"
import ls from 'local-storage'
import axios from 'axios'
import { Helmet } from 'react-helmet';
import Link from 'react-router-dom/Link';
import { withTranslate } from 'react-redux-multilingual';


var url_path;
class Supplier extends Component {
    constructor(){
        super();
        url_path = window.location.pathname.split('/cat/')[1].split('.html')[0].split('/');
    }
    state = {
        layoutColumns: 3,
        query: '',
        catBanner: '',
        catName: '',
        catDesc:'',
        catBannerExist: 1
    }

    LayoutViewClicked(colums) {
        this.setState({
            layoutColumns:colums
        })
    }
    componentDidMount() {
        try {
            

            let query = window.location.pathname.split('/').pop().replace('.html', '');
            axios.post("https://api.indiabigshop.com/common/cat_detail.php",{url:query,sellerid:ls.get('sellerid'),security_token:'',plateform_type:''}, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                // return response.data.result;
                this.setState({
                    catBanner: response.data.result.bimg,
                    catName: response.data.result.name,
                    catDesc: response.data.result.desc1,
                    catTitle: response.data.result.cat_title,
                    metaDesc:response.data.result.metaDescrip,
                    metaKeyword:response.data.result.imgKeyword
                })
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);
            });

        } catch (e){
            console.log(`😱 Axios request failed: ${e}`);
        }
    }

    imgError = () => {
        this.setState({
            catBannerExist: 0
        })
    }
    
    render() {
        const {translate} = this.props;
        return (
            <React.Fragment>
               
                {/* <Breadcrumb title={this} metaTitle={this.state.metaTitle} metaDesc={this.state.metaDesc}/> */}
                
                <div className="breadcrumb-section py-1">
                        {/* <Helmet>
                            <title>{`${this.state.catTitle} on beldara.com`}   </title>
                            <meta name="description" content={`${this.state.metaDesc}`} />
                            <meta name="keyword" content={`${this.state.metaKeyword} | beldara.com`} />
                        </Helmet> */}
                        <div className="container">
                        <div className="row">
                            
                            <div className="col-md-12">
                            <div className="page-title"> 
                            <nav aria-label="breadcrumb" className="theme-breadcrumb">
                                <ol className="breadcrumb">
                                <li className="breadcrumb-item small">
                                    <Link to={`${process.env.PUBLIC_URL}`}>
                                        {translate("Home")}
                                    </Link>
                                </li>
                                {url_path[0] ? (
                                    <li className="breadcrumb-item small" aria-current="page">
                                        { url_path[1] ?
                                        <Link to={`${process.env.PUBLIC_URL}/cat/${url_path[0]}.html`} target="_blank">
                                            {url_path[0]}
                                        </Link>
                                        : url_path[0]
                                        }
                                    </li>
                                ) : ""}
                                {url_path[1] ? (
                                    <li className="breadcrumb-item small" aria-current="page">
                                        { url_path[2] ?
                                        <Link to={`${process.env.PUBLIC_URL}/cat/${url_path[0]}/${url_path[1]}.html`} target="_blank">
                                            {url_path[1]}
                                        </Link>
                                        : url_path[1]
                                        }
                                    </li>
                                ) : ""}
                                {url_path[2] ? (
                                    <li className="breadcrumb-item small" aria-current="page">
                                    {/* <Link to={`${process.env.PUBLIC_URL}/cat/${url_path[0]}/${url_path[1]}/${url_path[2]}.html`} target="_blank"> */}
                                       {url_path[2]}
                                    {/* </Link> */}
                                    </li>
                                ) : 
                                    ""
                                }
                                {/* <li className="breadcrumb-item active small" aria-current="page">
                                    {this.state.catName}
                                </li> */}
                                </ol>
                            </nav>
                            </div></div>
                            {/* <div className="col-md-6">
                            <div className="page-title">
                                <h2>{this.state.catName}</h2>
                            </div>
                            </div> */}
                        </div>
                        </div>
                    </div>

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
                                                    <div className="top-banner-wrapper text-center">
                                                        {this.state.catBannerExist == 1 ?
                                                            <a href="javascript:void(0)" onClick={() => ''}>
                                                                <img src={`${this.state.catBanner}`}
                                                                className="img-fluid" 
                                                                alt={this.state.catName}
                                                                onError={this.imgError}
                                                                 />
                                                            </a>
                                                            : ''}
                                                        
                                                        <div className="top-banner-content small-section text-left">
                                                            <h4>{this.state.catName}</h4>
                                                            {/* <h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5> */}
                                                            {/* <p>{this.state.catDesc!='.' &&  this.state.catDesc!='' ? this.state.catDesc : ''} </p> */}
                                                        </div>
                                                    </div>
                                                    <div className="collection-product-wrapper">
                                                        

                                                        {/* <div className="product-wrapper-grid">
                                                            <div className="">
                                                                <div className=""> */}
                                                                    <ProductByCategory colSize={this.state.layoutColumns} product={this.state.query}/>
                                                                {/* </div>
                                                            </div>
                                                        </div> */}
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

const mapStateToProps = (state) => ({
    categoryBanner : state.data.categoryBanner
})

export default withTranslate( connect(
    mapStateToProps
)(Supplier))

// export default Category