import React, { Component, lazy } from 'react'
import $ from 'jquery';
import ReactPixel from "react-facebook-pixel";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import ls from 'local-storage'
import axios from 'axios'
import { getCookie, captureEvent, showToast } from '../../functions';
import Link from 'react-router-dom/Link';
import { imgUrl } from '../../constants/variable';
import '../collection/common/product.css';
import { withRouter } from "react-router-dom";
import { withTranslate } from 'react-redux-multilingual'
import Breadcrumb from '../common/breadcrumb';
import LoadingComponent from '../products/common/loading-bar';

const PriceCalc = lazy(() => import('../collection/common/priceCalc'))

class wishlists extends Component {
    constructor(props){
        super(props);
        this.state = {
            layoutColumns: 3,
            catBanner: '',
            catName: '',
            catDesc:'',
            imgExist:1,
            wishlist: [],
            symbol: getCookie('currency') ? getCookie('currency') : 'INR',
            inrValue: 70,
            isPageLoaded: 0
        }
    }
    
    componentDidMount(nextProps) {
      // FB
      const advancedMatching = { em: "support@beldara.com" };
      const options = {
        autoConfig: true, // set pixel's autoConfig
        debug: false // enable logs
      };
      ReactPixel.init("432219770935494", advancedMatching, options);
      ReactPixel.init("2231476330510319", advancedMatching, options);
  
      var toast = $('#toast_message').detach();
      $(toast).insertAfter('.breadcrumb-section');

  }

    LayoutViewClicked(colums) {
        this.setState({
            layoutColumns:colums
        })
    }
    // componentWillMount() {
        
    // }

    validate = async (id, productid, qty, amount, currency, eachunit, wishlistid) => {
      let amt = 0;
      let eamt = 0;
      if (currency != 'USD' && getCookie('currency') == 'USD'){
        amt = amount / this.state.inrValue
        eamt = eachunit / this.state.inrValue
      }else if (currency == 'USD' && getCookie('currency') != 'USD'){
        amt = amount * this.state.inrValue
        eamt = eachunit * this.state.inrValue
      }else{
        amt = amount
        eamt = eachunit
      }

      captureEvent( "wishlist", id, productid, 'click', ls.get("sellerid"), getCookie("mhinpbnb") );
      if (id == 'cart')
      this.createCart(productid, qty, amt, this.state.symbol, eamt, wishlistid, currency)
      else if (id == 'remove'){
        this.removeWishlist(productid, wishlistid)
        showToast('Product Removed from Wishlist', '1')
        $('#'+wishlistid).hide('slow');
      }
    };

    
  
    event_ask_for_price = (id, productid) => {
      captureEvent( "wishlist", id, productid, 'click', ls.get("sellerid"), getCookie("mhinpbnb") );
    }
     
    removeWishlist = (productid, wishlistid) => {
      axios.post(
        "https://api.indiabigshop.com/common/delete_wishlist.php",
        {
          security_token: "",
          plateform_type: "",
          productid: productid,
          visitorid: getCookie('mhinpbnb'),
          sellerid: ls.get('sellerid'),
          wishlistid: wishlistid
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      ).then(response => {
   
      })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
  
    createCart = (productid, qty, amount, currency, eachunit, wishlistid, product_currency) => {
      axios.post(
        "https://api.indiabigshop.com/common/convert_wishlist_to_cart.php",
        {
          security_token: "",
          plateform_type: "",
          wishlistid: wishlistid,
          productid: productid,
          qty: qty,
          type: 1,
          currency: currency,
          eachprice: eachunit,
          totalprice: amount,
          inrValue: this.state.inrValue,
          visitorid: getCookie('mhinpbnb'),
          sellerid: ls.get('sellerid')
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      ).then(response => {
   
      ls.get("sellerid") ?
          this.goToStartOrder(productid, qty, amount, currency, eachunit, wishlistid, product_currency)
          :
          this.goToLogin(productid, qty, amount, currency, eachunit, wishlistid, product_currency)
      })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
  
    goToLogin = (pid, qty, amount, currency, each_product_price, wishlistid, product_currency) => {
      
        if (product_currency != 'USD'){
          each_product_price = parseFloat(each_product_price) / this.state.inrValue
        }else{
          each_product_price = parseFloat(each_product_price)
        }

      each_product_price = each_product_price.toFixed();
  
      ReactPixel.trackCustom( 'AddToCart', {
        content_ids: [pid],
        content_type: 'product',
        value: each_product_price,
        currency: 'USD'
      } )
  
      this.props.history.push({
        pathname: "/register.html",
        state: {
          pid: pid, 
          qty: qty,
          amount: amount,
          currency : currency,
          each_product_price: each_product_price, 
          wishlistid: wishlistid, 
          product_currency: product_currency,
          inrValue: this.state.inrValue
        }
      })
  
    
    }
  
    goToStartOrder = async (pid, qty, amount, product_currency, each_product_price, wishlistid, currency) => {
      
      if (product_currency == 'INR' || product_currency == '' || product_currency === undefined)
        each_product_price = parseFloat(each_product_price) / this.state.inrValue;
  
      each_product_price = parseFloat(each_product_price).toFixed();
  
      ReactPixel.trackCustom( 'AddToCart', {
        content_ids: [pid],
        content_type: 'product',
        value: each_product_price,
        currency: 'USD'
      })
      
      // this.props.history.push({
      //   pathname: "/cart.html"
      // })
      window.location.href = '/cart.html'
    };

    imgError = () => {
        this.setState({
            imgExist: 0
        })
    }

    componentDidUpdate = async (nextProps) => { 
      //console.log(this.state.symbol , getCookie('currency'))
      if (this.state.symbol != getCookie('currency'))
        await this.setState({
          symbol: getCookie('currency') ? getCookie('currency') : 'INR'
        })

      try{
        if (nextProps.currencyValue[0].INR != this.state.inrValue)
          {
            await this.setState({
              inrValue: nextProps.currencyValue[0].INR
            })
          }
        }catch(e){
          await this.setState({
            inrValue: 70
          })
        }
        if (this.state.wishlist.length == 0){
          try {
            axios.post("https://api.indiabigshop.com/common/fetch_wishlist.php",{visitorid:getCookie('mhinpbnb'),sellerid:ls.get('sellerid'),security_token:'',plateform_type:''}, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(async response => {
                this.setState({
                    wishlist: response.data.result.wishlist,
                    isPageLoaded: 1
                })
            })
            .catch(error => {
              this.setState({
                isPageLoaded: 1
            })
                const result = error.response;
                return Promise.reject(result);
            });
        } catch (e){
            console.log(`😱 Axios request failed: ${e}`);
        }
        }
    }

    deadEnd = () => {
      
    }

    finalCost = async (Cost) => {
      await this.setState({
         price: Cost
       })
     }

    render() {
      const {symbol} = this.state;
      const { translate } = this.props;
        // console.log(this.props)
        return (
            <React.Fragment>
              <div id="toast_message" role="alert" aria-live="assertive" aria-atomic="true" className="toast toast_pull_right fade hide">
                  <div className="toast-body">
                    <i className="fas fa-check"></i> Product Added To Cart
                  </div>
                </div>
                <div className="breadcrumb-section py-1">
                <Helmet>
                <title>{`Wishlist on Beldara.com`} </title>
                <meta
                  name="description"
                  content={`Wishlist on Beldara.com`}
                />
                <meta name="keyword" content={`Wishlist on Beldara.com`} />

                <meta
                  property="og:title"
                  content={`Wishlist on Beldara.com`}
                />
                <meta property="og:url" content={window.location.pathname} />
                <meta
                  property="og:description"
                  content={`Wishlist on Beldara.com`}
                    />
                <meta
                  name="twitter:title"
                  property="og:title"
                  itemprop="name"
                  content={`Wishlist on Beldara.com`}
                />
                <meta
                  name="twitter:description"
                  property="og:description"
                  itemprop="description"
                  content={`Wishlist on Beldara.com`}
                />
              </Helmet>
              <Breadcrumb title={"Wishlist"} />
              </div>
                {/*Section Start*/}
                <section className="section-b-space py-0">
                    <div className="collection-wrapper">
                        <div className="container">
                            <div className="row">
                              <div className="col-sm-12">
                                  
                                <div className="collection-product-wrapper">
                              <div className="product-wrapper-grid">
                    <div className="">
                    {this.state.isPageLoaded == 0 ?
                    <LoadingComponent />
                    : this.state.wishlist ?
                        this.state.wishlist.length > 0 ?
                            <React.Fragment>
                                 <div className="row">
                                        {this.state.wishlist.map((product, index) => {
                                          if (
                                            product.name != "" &&
                                            product.name !== undefined
                                          ) {
                                            
                    
                                            return (
                                              <div id={product.wishlistid} className="col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1" key={index}>

                                <div className="product-box ">

                        <div className="d-flex img-wrapper justify-content-center">
                            <div className="front d-flex imgWrapper">
                            <a className="d-flex align-items-center justify-content-center" href={`${process.env.PUBLIC_URL}/product/${product.url}.html`}>
                           
                                <img src={`${imgUrl}/product_images_thumb/`+product.img}
                                    alt={`${product.name} beldara.com`}
                                    className="img-fluid prodImg"
                                    id={product.id}
                                    onError={this.checkImageExist}
                                />

                                </a>
                            </div>
                        </div>
                        <div className="product_info">
                            <div>
                                <Link to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url)}.html`}>
                                    <div className="text-truncate font-weight-bolder text-dark">{product.name}</div>
                                </Link>
                        {
                             (product.company) ?
                                <div className="text-truncate font-weight-lighter"><small>{product.company}</small></div> : ''
                        }
                        {
                            parseFloat(product.price)  ? 
                            <PriceCalc productCost={this.deadEnd} finalCost={this.finalCost} symbol={product.currency} start_price={product.price} end_price={product.priceto} price_us={product.price_us} price_in={product.price_in} />: <b>Ask For Price</b>
                        }
                        
                        {
                            (product.qty) ?
                            <div>{`${translate('MOQ')} : ${product.qty} - ${product.unit}`}</div>
                            :<div>{`${translate('MOQ')} : 1 unit`}</div>
                            }
                             {/* <React.Fragment> */}
                            {/* <div id={`btn_${product.id}`} className="text-center">
                                    <div id={`div_${product.id}`} className="btn btn-solid">
                                        
                                    </div>
                                </div> */}
                                {/* </React.Fragment> */}
                                </div>
                                </div>
                  {product.price && parseFloat(product.price) > parseFloat(0) ?
                                <div id={`btn_${product.id}`} className="d-flex justify-content-between text-center">
                                    
                                  <span className="mouse_pointer btn btn-solid my-2" id={product.id} onClick={() => this.validate('cart', product.id, product.qty, ( parseFloat(product.price) *  parseInt(product.qty) ), product.currency, product.price, product.wishlistid )}>
                                      Add To Cart
                                  </span>
                                  <span className="mouse_pointer btn btn-solid my-2" id={product.id} onClick={() => this.validate('remove', product.id, product.qty, ( parseFloat(product.price) *  parseInt(product.qty) ), product.currency, product.price, product.wishlistid)}>
                                      Remove
                                  </span>
                                    
                                </div>
                                
                                :
                                <div id={`btn_${product.id}`} className="d-flex justify-content-between text-center">
                                    
                                  <Link onClick={() => this.event_ask_for_price('ask_for_price' , product.id)} id="ask_for_price" className="btn btn-solid my-2" clickevent="Ask_for_price" to={{pathname: "/post-requirement.html", state:product }} > Contact Supplier </Link>
                                  <span className="mouse_pointer btn btn-solid my-2" id={product.id} onClick={() => this.validate('remove', product.id, product.qty, ( parseFloat(product.price) *  parseInt(product.qty) ), product.currency, product.price, product.wishlistid)}>
                                      Remove
                                  </span>
                                    
                                </div>
                            }
                                
                            
                       
                    </div>
                            </div>
                                            );
                                          }
                                        })}                                        
                                </div> 
                            </React.Fragment>
                            :
                            <div className="row">
                                <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                    <h3>Empty Wishlist!!!    </h3>
                                    <p>Please add some products to your wishlist.</p>
                                    <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid">Add Product To Wishlist</Link>
                                </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                    <h3>Empty Wishlist!!!    </h3>
                                    <p>Please add some products to your wishlist.</p>
                                    <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid">Add Product To Wishlist</Link>
                                </div>
                            </div>
                            }
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

// const mapStateToProps = (state) => ({
//     wishlist : state.data.wishlist,
// })

// export default connect(
//     mapStateToProps
// )(wishlists)

const mapStateToProps = (state) => ({
  symbol: state.data.symbol,
  currencyValue: state.currencyValue.currencyValue,
  user: state.user
})
export default withRouter(withTranslate(connect(mapStateToProps)(wishlists)));