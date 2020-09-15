import React, { Component } from "react";
import $ from "jquery";
import ls from "local-storage";
import { withTranslate } from "react-redux-multilingual";
import { withRouter } from "react-router-dom";
import Breadcrumb from "../../../common/breadcrumb";
import Rating from 'react-rating';
// import "./ratingStyle.css";
import axios from "axios"; 
import { ApiUrl } from "../../../../constants/ActionTypes";
import { imgUrl } from "../../../../constants/variable";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
var rating;
class WriteReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
        initialRating: 0,
        reviewSubmitted: 0,
        name: '',
        url: '',
        productid: '',
        img: ''
    }
  }

  updateReview = (value) => {
      if (Math.round(value) > 1)
        value = value.replace("0","");

      this.setState({
        initialRating: value
      })
      rating = value;
  }
    
    componentDidMount = async () => {
        var hostname = window.location.pathname;
        let productUrl = hostname.split("/rating/")[1];
        productUrl = productUrl.split(".html")[0];
        let id_temp = productUrl.split("-");
        let id = id_temp[id_temp.length - 1]
      
        try {
            if (this.props.location.state) {
               
                await this.setState({
                    name: this.props.location.state.item.name,
                    url: this.props.location.state.item.url,
                    productid: this.props.location.state.item.id,
                    img: this.props.location.state.item.img
                })
            } else {
               
                axios.post(
                    "https://api.beldara.com/common/fetch_single_prod.php",
                    {
                      security_token: "",
                      plateform_type: "",
                      url: id
                    },
                    { headers: { "Content-Type": "multipart/form-data" } }
                  )
                    .then(async response => { 
                        
                        await this.setState({
                            name: response.data.result.name,
                            url: response.data.result.url,
                            productid: response.data.result.id,
                            img: response.data.result.img
                        })
                        
                    })
                    .catch(error => {
                      const result = error.response;
                      return Promise.reject(result);
                    });

            }
        } catch (e) {
           
            axios.post(
                "https://api.beldara.com/common/fetch_single_prod.php",
                {
                  security_token: "",
                  plateform_type: "",
                  url: id
                },
                { headers: { "Content-Type": "multipart/form-data" } }
              )
                .then(async response => { 
                    
                    await this.setState({
                        name: response.data.result.name,
                        url: response.data.result.url,
                        productid: response.data.result.id,
                        img: response.data.result.img
                    })
                    
                })
                .catch(error => {
                  const result = error.response;
                  return Promise.reject(result);
                });
        }
    }

  handleSubmit = (event) => {
    $('#error').addClass('d-none');
    event.preventDefault();
    const review = $('#review').val();
    const subject = $('#subject').val();
     if (review && rating && subject){
        
        try {
            axios.post(`${ApiUrl}/common/add_review.php`,{sellerid: ls.get('sellerid'), productid:this.state.productid, rating:rating, subject:subject, plateform_type:'', security_token: '', review: review}, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(async response => { 
                this.setState({
                    reviewSubmitted : response.data.statusId
                });
            })
            .catch(error => {
            const result = error.response;
            
            });
            
        } catch (e){
        console.log(`😱 Axios request failed: ${e}`);
        }
    }else{
        $('#error').removeClass('d-none');
        return false;
    }
}

  render() {
      const { translate } = this.props;
      const { name, url, img } = this.state;
    return (
        
        // <Link to={`${process.env.PUBLIC_URL}/productRating`} ></Link>
        <div className="container">
           
           <div className="breadcrumb-section py-1">   
                        <Helmet>
                            <title>{`${name} on beldara.com`}   </title>
                            <meta name="description" content={`${name} on beldara.com`} />
                            <meta name="keyword" content={`${name} on beldara.com`} />
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
                               
                                <li className="breadcrumb-item small text-truncate" aria-current="page">
                                    <Link target="_blank" to={`${process.env.PUBLIC_URL}/product/${url}.html`}>
                                        {name}
                                    </Link>
                                </li>
                                
                                
                                <li className="breadcrumb-item active small d-none" aria-current="page">
                                Review
                                </li>
                                </ol>
                            </nav>
                            
                            </div>
                            </div>
                            {/* <div className="col-md-6">
                           </div> */}
                        </div>
                        </div>
                    </div>

            {/* <Breadcrumb title={'Review'}  metaTitle={`${location.state.item.name} | beldara.com`} metaDesc={`${location.state.item.name} | beldara.com`} metaKeyword={`${location.state.item.name} | beldara.com`}/> */}
            
            <div className="row justify-content-center">
        <div className="col-md-6"> 

            

            {this.state.reviewSubmitted == '1' ?
            <div className="alert alert-success">
                <h3>Review submitted - Thank you!</h3> <div>We’re processing your review. This may take several days, so we appreciate your patience. We’ll notify you when this is complete.</div>
            </div>
            :
            <React.Fragment>
            <div id="error" className="alert alert-danger d-none">
                Please enter Valid Information to continue
            </div>

            <form className="theme-form" onSubmit={this.handleSubmit}>
            <h4>Creating Review</h4>
            <div className="d-flex border-top"> 
                <img src={`${imgUrl}/product_images_small/${img}`} /> 
                <h5 className="ml-5">{name} </h5>
            </div>
                <div className="form-row">
                    <div className="col-md-12 my-3">
                        <span>Write A Review</span>
                        <div className="text-warning userRating" onClick={this.getRating}>
                            <Rating 
                                initialRating = {this.state.initialRating}
                                start = '0'
                                stop = '5'
                                step = '1'
                                fractions = '2'
                                emptySymbol={['fa fa-star-o fa-2x medium', 'fa fa-star-o fa-2x medium',
                                'fa fa-star-o fa-2x medium', 'fa fa-star-o fa-2x medium',
                                'fa fa-star-o fa-2x medium']}
                                fullSymbol={['fa fa-star fa-2x medium', 'fa fa-star fa-2x medium',
                                'fa fa-star fa-2x medium', 'fa fa-star fa-2x medium',
                                'fa fa-star fa-2x medium']}
                                onChange = {this.updateReview}
                            />
                        </div>

                    </div>

                    <div className="has-float-label col-md-12 my-3">
                        
                        <input type="text" className="form-control" id="subject"
                                placeholder=" " autoComplete="off"
                                required="" />
                        <label htmlFor="subject">{translate('Subject')}</label>
                    </div>
                    
                    <div className="has-float-label col-md-12 my-3">
                        
                        <textarea className="form-control" placeholder=" "
                                    id="review" rows="6" autoComplete="off"
                                    required=""></textarea>
                        <label htmlFor="review">{translate('Write Your Message')}</label>          
                    </div>
                    <div className="col-md-12">
                        <button className="btn btn-solid" type="submit">{translate('Submit ')}</button>
                    </div>
                </div>
            </form>
            
            </React.Fragment>
            }
        </div>
    </div>
    
    </div>
    );
  }
}

export default withRouter(withTranslate(WriteReview));


