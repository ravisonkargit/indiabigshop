import React, { Component } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import $ from 'jquery';
import { getTrendingCollection } from "../../../services";
import { Product4 } from "../../../services/script";
import {
  addToCart,
  addToWishlist,
  addToCompare,
  getAllProducts,
  getRecommendedProducts,
  getRecentSearch,
  getWholesaleDay
} from "../../../actions";
import ProductItem from "../pets/product-item";
import { imageExists } from "../../../functions";
import LazyLoad from "react-lazy-load";
import store from "../../../store";
import axios from 'axios'

class HomeCategoryProduct extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [],
      is_runable: 0
    }
  }

  componentDidMount(){
      if(this.props.type=='top_product'){
        try {
            axios
            .post(
              "https://api.beldara.com/common/get_prod_by_lp.php",
              { security_token: "", plateform_type: "",from:0,size:10, cat_id: this.props.cat_id },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
                this.setState({
                    items:response.data.result
                })
            })
            .catch(error => {
              const result = error.response;
              return Promise.reject(result);
            });
         }
         catch(e) {
    
         }
      }
     
  }
  
  UNSAFE_componentWillUpdate = async (nextProps) => {
    const {items, restProps} = nextProps;
    var checker = 1;
    if (this.state.items !== undefined && this.state.items !== null){
      if (this.state.items.length > 0){
        checker = 0;
      }
    }
    if (checker == 1 ){
      if (this.props.type == "top_product" && items !== undefined && items !== null){
        if (items.length > 0){
          await this.setState({
            items: items
          })
        }
      }else if (this.props.type == "recommended_product" && restProps.recommendedProduct.product !== undefined && restProps.recommendedProduct.product !== null){
        if (restProps.recommendedProduct.product.length > 0){  
          await this.setState({
            items: restProps.recommendedProduct.product
          })
        }
      }else if (this.props.type == "recent_search" && restProps.recentSearch.product !== undefined && restProps.recentSearch.product !== null){
        if (restProps.recentSearch.product.length > 0){  
          await this.setState({
            items: restProps.recentSearch.product
          })
        }
      }else if (this.props.type == "wholesale_day" && restProps.wholesaleDay.product !== undefined && restProps.wholesaleDay.product !== null){
        if (restProps.wholesaleDay.product.length > 0){  
          await this.setState({
            items: restProps.wholesaleDay.product
          })
        }
      }
      if (this.state.items.length > 3 && this.state.is_runable == 0) {
        await this.setState({
          is_runable: 1
        })

        this.props.action(this.state.is_runable, this.props.type)
      }
    }
    
  }

  componentDidUpdate(){
    var ele = document.getElementsByClassName('slick-arrow')

    for (var i = 0; i < ele.length; i++) {
      ele[i].removeEventListener('click', this.getProductForScroll);
    }

    for (var i = 0; i < ele.length; i++) {
      ele[i].addEventListener('click', this.getProductForScroll);
    }

    //$('.slick-arrow').click(function(){ console.log('slick-arrow'); window.scrollBy(0,-1); window.scrollBy(0,1);  })
  }

  getProductForScroll = () => {
    window.scrollBy(0,-1); window.scrollBy(0,1);
  }

  render() {
    // const {items, symbol, addToCart, addToWishlist, addToCompare, title, subtitle} = this.props;
    const {
      symbol,
      addToCart,
      addToWishlist,
      addToCompare,
      title,
      subtitle
    } = this.props;

    const { items } = this.state;

    

    var settings = {
      centerMode: false,
      infinite: false,
      centerPadding: "0px",
      speed: 150,
      dots: false,
      slidesToShow: 4,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    

    return (
      <div id={this.props.id} key={this.props.id}>
       
        {/*Paragraph*/}
        <section className="j-box pets-box ratio_square" style={{paddingTop:'10px !important'}}>
          <div className="container">
            <div className="row">
              <div className="col">
                
                {items ? (
                  <Slider
                    {...settings}
                    className="product-4 product-m slide-6 home-slider"
                  >
                    {items.slice(0, 10).map((product, index) => (
                      <div key={index}>
                        <LazyLoad
                          debounce={false}
                          offsetVertical={500}
                        >
                          <ProductItem
                            product={product}
                            symbol={symbol}
                            key={index}
                            onAddToCompareClicked={() => addToCompare(product)}
                            onAddToWishlistClicked={() =>
                              addToWishlist(product)
                            }
                            onAddToCartClicked={() => addToCart(product, 1)}
                          />
                        </LazyLoad>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  items: state.data.products,
  symbol: state.data.symbol,
  restProps: state
});

export default connect(
  mapStateToProps,
  { addToCart, addToWishlist, addToCompare }
)(HomeCategoryProduct);
