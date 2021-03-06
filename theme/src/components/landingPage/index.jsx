import React, { Component } from 'react'
import { connect } from "react-redux";

import { Helmet } from "react-helmet";

// import ProductByLP from './ProductByLP';
import ls from 'local-storage'
import axios from 'axios'
import asyncComponent from '../../AsyncComponent'
import { localhost } from '../../constants/variable';
import store from '../../store';
import { getAllCurrencyValue } from '../../actions';
// import('./ProductByLP').then(async module =>{
//     // await this.setState(async () => {
//     //     translations : await module.default
//     // })
//     const ProductByLP = await module.default
// })
function getFileName(url) {
      var index = url.lastIndexOf("/") + 1;
      var filenameWithExtension = url.substr(index);
      var filename = filenameWithExtension.split(".")[0];
      filename = filename.replace(/(#|\?).*?$/, "");
      return filename;
  }
const ProductByLP = asyncComponent(() =>
    import('./ProductByLP').then(module => module.default)
)

class LandingPage extends Component {

    state = {
        layoutColumns: 3,
        query: '',
        catBanner: '',
        catName: '',
        catDesc:'',
        imgExist:1,
        datatype:'',
    }

    LayoutViewClicked(colums) {
        this.setState({
            layoutColumns:colums
        })
    }
    componentDidMount() {
        try {
            var query='';
            const query1 = getFileName(window.location.pathname)
                            .split("/")
                            .pop()
                            .replace(".html", "");
            const val = query1.split("-").splice(-1)[0];
            if(isNaN(val)){
                var query = window.location.pathname.split('/').pop();
                axios.post("https://api.beldara.com/common/get_lp_detail.php",{url:query,sellerid:ls.get('sellerid'),security_token:'',plateform_type:''}, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(async response => {
                    //result.
                    await this.setState({
                        catBanner: response.data.result.page_img,
                        catName: response.data.result.page_name,
                        catDesc: response.data.result.desc1,
                        cat_id: response.data.result.cat_id,
                        keyword: response.data.result.keyword,
                        is_search_by_keyword: response.data.result.is_search_by_keyword,
                        type:'1',
                    })

                })
                .catch(error => {
                    const result = error.response;
                    return Promise.reject(result);
                });
            }else{
                var query = window.location.pathname.split('/').pop().replace(".html", "");
                var x = query.slice(0, query.length - 3);
                //console.log(300,x);
                var search = window.location.search;
                var params = new URLSearchParams(search);
                var foo = params.get('type');
                this.setState({
                    cat_id: val,
                    catName: x,
                    type:'2',
                    datatype:foo,
                })
            } 
        } catch (e){
            console.log(`😱 Axios request failed: ${e}`);
        }
        store.dispatch(getAllCurrencyValue())
    }
    imgError = () => {
        this.setState({
            imgExist: 0
        })
    }

    render() {
        // console.log(this.props)
        return (
            <React.Fragment>
                {/* <Helmet>
                <title>{`${this.state.catName}`} </title>
                <meta
                  name="description"
                  content={`${this.state.catDesc}`}
                />
                <meta name="keyword" content={`${this.state.keyword}`} />

                <meta
                  property="og:title"
                  content={`${this.state.catName}`}
                />
                <meta property="og:url" content={window.location.pathname} />
                <meta
                  property="og:description"
                  content={`${this.state.catDesc}`}
                    />
                    {this.state.imgExist == 1? 
                        <meta
                        property="og:image"
                        content={`${this.state.catBanner}`}
                    />
                    : ''}
                <meta
                  name="twitter:title"
                  property="og:title"
                  itemprop="name"
                  content={`${this.state.catName}`}
                />
                <meta
                  name="twitter:description"
                  property="og:description"
                  itemprop="description"
                  content={`${this.state.catDesc}`}
                />
              </Helmet> */}
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
                                                        {this.state.imgExist == 1? 
                                                            // <a href="#"> 
                                                                <img src={`${this.state.catBanner}`}
                                                                className="img-fluid" 
                                                                alt={this.state.catName}
                                                                onError={this.imgError} />
                                                            // </a>
                                                            : ''}
                                                        
                                                        <div className="top-banner-content small-section text-left">
                                                            <h4>{this.state.catName}</h4>
                                                            {/* <h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5> */}
                                                            {/* <p>{this.state.catDesc!='.' &&  this.state.catDesc!='' ? this.state.catDesc : ''} </p> */}
                                                        </div>
                                                    </div>
                                                    <div className="collection-product-wrapper">
                                                        
                                                    <div id="toast_message" role="alert" aria-live="assertive" aria-atomic="true" className="toast toast_pull_right fade hide">
                                                        <div className="toast-body">
                                                        <i className="fas fa-check"></i> Product Added To Wishlist
                                                                    </div>
                                                    </div>
                                                        <div className="product-wrapper-grid">
                                                            <div className="container p-0">
                                                                <div className="row">
                                                                    <div className="col-12 p-0">
                                                                        {this.state.cat_id ?
                                                                            <ProductByLP
                                                                                colSize={this.state.layoutColumns} cat_id={this.state.cat_id} type={this.state.type} datatype={this.state.datatype}  is_search_by_keyword={this.state.is_search_by_keyword}/>
                                                                        : ''}
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
                    </div>
                </section>
                {/*Section End*/}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    Banner : state.data.categoryBanner,
})

export default connect(
    mapStateToProps
)(LandingPage)

// export default Category

