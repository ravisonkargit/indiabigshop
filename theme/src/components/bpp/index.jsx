import React, { Component } from 'react'
import { brandpromotion, brandpromotionall } from "../../functions";
import ProductListItem from '../collection/common/product-list-item';
import { withTranslate } from 'react-redux-multilingual';
import $ from 'jquery';
import LoadingComponent from '../products/common/loading-bar';
import Link from 'react-router-dom/Link';
import ReactPaginate from 'react-paginate';
import ls from 'local-storage';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import CategoryComponent from '../common/categoryComponent';

function showImageOnlyIfExist(ele){
    $('#'+ele).closest('.col-grid-box').addClass('d-none');
}
var url_path = '';
var brand_cat = '';
class Brandpromo extends Component{
    constructor(){
        super();

        let search = window.location.search;
        var params = new URLSearchParams(search);

        if (window.location.pathname.indexOf('/bpp/') == -1 ){

        }else{
        try{
            url_path = window.location.pathname.split('/bpp/')[1].split('.html')[0].split('/');
            brand_cat = window.location.pathname.split('/').pop().replace('.html', '');
        }catch(e){

        }
    }
        this.state = {
            productName :'',
            pageUrl: '/bpp',
            isProductReceived: 0,
            catBanner: '',
            catName: '',
            catDesc: '',
            catTitle: '',
            metaDesc: '',
            metaKeyword: '',
            pageNo: parseInt(params.get('page')) > 0 ? parseInt(params.get('page')) : 0,
            pageCount: 1,
            totalBpp: 1,
            type: 2,
            catid: 0,
            parentid: 0

        };
    };

    handlePageClick = data => {
        if (this.state.pageNo != data.selected){
            let selected = data.selected;
            window.location.href = window.location.pathname+'?page='+selected;
        }
        
    };

    changeArrow = (event) => {
        
        if (event.id == 'down'){
            $('.catLabelBtn').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
            $('.catLabelBtn').attr('id','up');
        }
        else{
            $('.catLabelBtn').find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            $('.catLabelBtn').attr('id','down');
        }
    }

    componentDidMount = async () => {

        var bppcat = window.location.pathname;
        var bppcatarray = bppcat.split('bpp/');
        var bpp_cat = '';
        var bpp_parent_cat = '';
        var len = 0;
        if (bppcatarray[1]){
            var link_array = bppcatarray[1].replace('.html','').split('-');
            len = link_array.length;
            bpp_parent_cat = link_array[len-1];
            bpp_cat = link_array[len-2];
            if (bpp_cat){
                await this.setState({
                    catid: bpp_cat,
                    parentid: bpp_parent_cat
                })
            }
        }

        if(brand_cat == ''){
            await brandpromotionall(this.state.pageNo, this.state.parentid, this.state.catid).then( async res =>
                await this.setState({
                    productName:res.result,
                    isProductReceived:1,
                    totalBpp: res.message,
                    pageCount : Math.ceil( parseInt(res.message) / 20)
                }));
                
                try{
                    await axios
                    .post(
                      "https://api.indiabigshop.com/common/static_seo.php",
                      { security_token: "", plateform_type: "", langCode: "en",pageid:'43' },
                      { headers: { "Content-Type": "multipart/form-data" } }
                    )
                  .then(response => {
                      this.setState({
                        catTitle: response.data.result.title,
                        metaDesc:response.data.result.desc1,
                        metaKeyword:response.data.result.keyword
                      })
                    })
                    .catch(error => {
                      const result = error.response;
                      return Promise.reject(result);
                    });
                }catch(e){
                    console.log(`😱 Axios request failed: ${e}`);
                }
        }else{
        await brandpromotion(brand_cat, this.state.pageNo, this.state.parentid, this.state.catid).then( async res =>
            await this.setState({
                productName:res.result,
                isProductReceived: 1,
                totalBpp: res.message,
                pageCount : Math.ceil( parseInt(res.message) / 20)
            }))

            try {
            
                axios.post("https://api.indiabigshop.com/common/cat_detail.php",{catid:this.state.catid, parentid:this.state.parentid, sellerid:ls.get('sellerid'),security_token:'',plateform_type:''}, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    // return response.data.result;
                    this.setState({
                        catBanner: response.data.result.bimg,
                        catName: response.data.result.name  ,
                        catDesc: response.data.result.desc1  ,
                        catTitle: response.data.result.cat_title  ,
                        metaDesc:response.data.result.metaDescrip ,
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
            
    }

    checkImage = (setClass) => {
        showImageOnlyIfExist(setClass);
    }

    render() {
        const {translate} = this.props;
        //
        return (
            <React.Fragment>
                <div className="breadcrumb-section py-1">
                    <Helmet>
                        <title>{`${this.state.catTitle} product on beldara.com`}   </title>
                        <meta name="description" content={`${this.state.metaDesc} product on beldara.com`} />
                        <meta name="keyword" content={`${this.state.metaKeyword} product on beldara.com`} />
                    </Helmet>
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
                                    <Link to={`${process.env.PUBLIC_URL}/bpp/${url_path[0]}.html`} target="_blank">
                                        {url_path[0].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") }
                                    </Link>
                                    : url_path[0].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ")
                                    }
                                </li>
                            ) : ""}
                            {url_path[1] ? (
                                <li className="breadcrumb-item small" aria-current="page">
                                    { url_path[2] ?
                                    <Link to={`${process.env.PUBLIC_URL}/bpp/${url_path[0]}/${url_path[1]}.html`} target="_blank">
                                        {url_path[1].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") }
                                    </Link>
                                    : url_path[1].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") 
                                    }
                                </li>
                            ) : ""}
                            {url_path[2] ? (
                                <li className="breadcrumb-item small" aria-current="page">
                                    {url_path[2].toUpperCase().split('ON-BELDARA')[0].replace(new RegExp("-","g"), " ") }
                                </li>
                            ) : 
                                ""
                            }
                            </ol>
                        </nav>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <section className="section-b-space">

                <div className="container">
                    <div className="row">
                        <div className="col-12 product-related">
                            <h4>{translate('BRAND PRODUCTS')}</h4>
                        </div>
                    </div>
                    <div className="row search-product">
                    {/* <div className="row"> */}
                        <div className="col-md-3 d-none d-md-block d-sm-none">
                            {console.log('desktop')}
                            <CategoryComponent  type={this.state} />
                        </div>
                        <div className="col-md-9 col-sm-12 col-12">
                            <div className="row">
                        { this.state.isProductReceived == 1 ? 
                       this.state.productName != null && this.state.productName != ''
                       ?
                       <React.Fragment>
                           <div className="col-md-6 col-sm-12 my-2 d-block d-md-none d-sm-block text-right">
                             <div className="accordion" id="categoryList">
                                <div className="card">
                                    <div className="card-header" id="catLabel">
                                        <h2 className="mb-0">
                                            <button id="down" className="btn btn-link catLabelBtn" onClick={(e) => this.changeArrow(e)} type="button" data-toggle="collapse" data-target="#categorylistLabel" aria-expanded="true" aria-controls="categorylistLabel">
                                                Top Categories <i className="ml-2 fa fa-chevron-down"></i>
                                            </button>
                                        </h2>
                                    </div>

                                    <div id="categorylistLabel" className="collapse" aria-labelledby="headingOne" data-parent="#categoryList">
                                        <div className="card-body text-left">
                                        {console.log('mobile')}
                                            <CategoryComponent type={this.state}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.productName.slice(0,20).map((product, index ) =>
                            (product)?
                            <div key={index} className="col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1" key={index}>
                                
                                <ProductListItem product={product}
                                    checkImage={this.checkImage}
                                />
                            </div>
                            :''
                            )}  </React.Fragment>:
                            
                            <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                <h3>{translate('Sorry! Couldnt find the product you were looking For!!!')}    </h3>
                                <p>{translate('Please check if you have misspelt something or try searching with other words')}.</p>
                                <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid">{translate('Continue shopping')}</Link>
                            </div>
                    : <LoadingComponent />
                    }
                    </div>
                        </div>
                        </div>

                    <div className="row justify-content-md-center">
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
                </div>
            </section>
            </React.Fragment>
        )
    }

}

export default withTranslate(Brandpromo);