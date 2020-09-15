
import React, {Component} from 'react';
import StarReview from './rating';
import ls from "local-storage";
import { withRouter } from "react-router-dom";  
import LoginPopUp from "../../loginPopUp";  
import SignUpPopUp from "../../signUpPopUp";

function getEmail(email){
  if (email && email!==undefined)
    return email.replace( email.substring(2,6), "XXXXX" );
  else
    return '';
}



class CustomerReview extends Component {
    constructor(props){
        super(props)
        this.state = {
            productid: 0,
            review: this.props.review,
            signup: false,
            login: false,
            readonly: true,
            reload: false,
            reviewCount: this.props.reviewCount
        }

    }

    componentWillReceiveProps(){
      if (this.props.review != 0 && this.props.review != null)
        this.setState({
          review: this.props.review
        })
    }

    footerData = data => {
        if (data.modalChange)
          this.setState({
            signup: data.modal,
            login: data.modal
          });
          
        this.setState({
          reload: data.reload
        });
        let thisEle = this;
        let interSet = setInterval(function(){
          if(ls.get('sellerid')){
            clearInterval(interSet);
            thisEle.goToNextPage()
          }
        },500);
    
        // if (data.reload.paymentModal)
        // $('.razorpay-payment-button').click();
      };
      closeModal = () => {
        this.setState({
          login: false,
          signup: false
        });
      };
    
      openSignUpModal = () => {
        this.setState({
          signup: true,
          login: false
        });
      };
    
      openLoginModal = () => {
        this.setState({
          signup: false,
          login: true
        });
      };

    pushNextPage = () => {
        if (ls.get('sellerid'))
            this.goToNextPage()
        else
            this.openLoginModal()    
        
      }

      goToNextPage = () => {
        this.props.history.push({
            pathname: this.props.page,
            state: { item: this.props.item }
        })
      }

      dataFromRating(){
        
      }

    render() {
        const item = this.props.item;
        return (
          <React.Fragment key={this.props.key}>
            <div  id="customerReviewWrapper" className="border-bottom border-top">
                
                <div className="row justify-content-center">
                    {/* className="col-6 col-md-6 col-sm-12" */}
                    <div className="col-6">
                        <div className="writeReview my-3">
                            <h5>Review this product</h5>
                            <p>Share your thoughts with other customers</p>
                            <span className="btn btn-solid" onClick={this.pushNextPage}>Write a Review</span>
                        </div>
                    
                        <div >
                            <h4> Customer Review </h4>
                            { (this.state.review.length != 0 && this.state.review)?
                                this.state.review.map((ratings,index) => (
                                <div className="border-bottom border-top" key={index}>
                                  <div className="small">{getEmail(ratings.email)}</div>
                                    <h3>{ratings.subject}</h3>
                                    {/* <div className="small">{ratings.email.replace( ratings.email.substring(2,6), "XXXXX" )}</div> */}
                                    
                                    {ratings.star_no?
                                    <StarReview page={`${process.env.PUBLIC_URL}/rating/${item.url}.html`} dataFromRating={this.dataFromRating} ratingStar={ratings.star_no} item={item} average={false} readonly={true} />
                                    : '' }
                                    <p>{ratings.review}</p>
                                </div>
                            ),this)
                            : 'No Review(s) Yet'}
                        </div>
                    </div>
                </div>
                <LoginPopUp
                    footerData={this.footerData}
                    login={this.state}
                    openSignUpModal={this.openSignUpModal}
                    closeModal={this.closeModal}
                />
                <SignUpPopUp
                    footerData={this.footerData}
                    signup={this.state}
                    openLoginModal={this.openLoginModal}
                    closeModal={this.closeModal}
                />
            </div>
            </React.Fragment>
        )
    }
}

export default withRouter(CustomerReview);
