import React, { Component } from "react";
import $ from "jquery";
import ls from "local-storage";
import { withTranslate } from "react-redux-multilingual";
import LoginPopUp from "../../loginPopUp";  
import SignUpPopUp from "../../signUpPopUp";
import { withRouter } from "react-router-dom";          
import Rating from 'react-rating';
import { Redirect } from 'react-router'
import "./ratingStyle.css";

class StarReview extends Component { 
  constructor(props) {
    super(props);
   
    this.state = {
      signup: false,
      login: false,
      moqErr: false,
      initialRating: 0,
      readonly: this.props.readonly
    };
  }

  componentDidMount = async () => {
    if (this.props.ratingStar)
      this.setState({initialRating: this.props.ratingStar})
  
    if (this.props.avgRating && this.props.average)
      this.setState({initialRating: this.props.avgRating})

  } 

  componentWillReceiveProps(nextProps){
    if (nextProps.avgRating != this.state.initialRating && this.props.average){
      this.setState({initialRating: nextProps.avgRating})
    }
   
  }

  footerData = data => {
    if (data.modalChange)
      this.setState({
        signup: data.modal,
        login: data.modal
      });
      this.pushNextPage()
    this.setState({
      reload: data.reload
    });

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

  getRating = () => {
    this.props.dataFromRating();
  
  };

  pushNextPage = () => {
    this.props.history.push({
      pathname:this.props.page,
      state: { item: this.props.item }
  })
  }

  render() {
    return (
        <React.Fragment>
          {this.state.readonly ?
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
                    readonly
                />
            </div>
            : 
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
              />
          </div>
      }

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
        </React.Fragment>
    );
  }
}

export default withRouter(withTranslate(StarReview));
