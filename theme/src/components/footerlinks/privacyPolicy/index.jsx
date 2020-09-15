import React, { Component } from "react";
import Breadcrumb from "../../common/breadcrumb";
import axios from 'axios'
import { connect } from "react-redux";


var  langDomain, domain_language_code, hostname;
// var language = "English";
class PrivacyPolicy extends Component {
  constructor() {
    super()
    this.state = {
      data:''
    }
  }
  async componentWillMount() {
    hostname = window.location.hostname;
    // if (hostname === undefined || hostname == '')
    // hostname = "german.beldara.com";
    langDomain = hostname.split("beldara.com")[0];
    langDomain = langDomain.replace(".", "");
    this.props.languageMaster.forEach(element => {
      if (element.main_language.toLowerCase() == langDomain.toLowerCase())
        domain_language_code = element.code;
    }, this);
    if (domain_language_code !== "" && domain_language_code !== undefined) {
      await axios
        .post(
          "https://api.beldara.com/common/static_page.php",
          { security_token: "", plateform_type: "", langCode: domain_language_code,pageid:'4' },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      .then(response => {
          this.setState({
            data: response.data.result
          })
        
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    } else {
      await axios
        .post(
          "https://api.beldara.com/common/static_page.php",
          { security_token: "", plateform_type: "", langCode: 'en',pageid:'4' },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      .then(response => {
          this.setState({
            data: response.data.result
          })
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
    
  }
  render() {
    const { head,content } = this.state.data
    return (
      <div>
        {/* <Breadcrumb title={"Privacy Policy"} metaTitle={title} metaDesc={desc1} /> */}
        <Breadcrumb title={'Privacy Policy'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title}/>

        <section className="faq-section section-b-space">
          <div className="container">
            <div className="row">
              <div className="col-12  mb--sm">
                <div className="card">
                  <div className="card-header">
                    <h2>{head}</h2>
                  </div>
                  <div className="input-layout1 card-body post-ad-page"  dangerouslySetInnerHTML={{__html: content}}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}


const mapStateToProps = state => ({
   languageMaster: state.languageMaster.languageMaster,
});

export default 
  connect(
    mapStateToProps
  )(PrivacyPolicy)
;

// export default PrivacyPolicy;
