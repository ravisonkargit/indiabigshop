
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from "../../common/breadcrumb";
import $ from 'jquery';
import axios from 'axios';
import { connect } from "react-redux";


class Faq extends Component {
    constructor() {
        super();
        this.state = {
          data: ""
        };
    }
    
    async componentWillMount() {
        var hostname = window.location.hostname;
        // if (hostname === undefined || hostname == '')
        // hostname = "german.beldara.com";
        let langDomain = hostname.split("beldara.com")[0];
        let domain_language_code = '';
        langDomain = langDomain.replace(".", "");
        this.props.languageMaster.forEach(element => {
          if (element.main_language.toLowerCase() == langDomain.toLowerCase())
            domain_language_code = element.code;
        }, this);
        if (domain_language_code !== "" && domain_language_code !== undefined) {
          await axios
            .post(
              "https://api.indiabigshop.com/common/static_page.php",
              {
                security_token: "",
                plateform_type: "",
                langCode: domain_language_code,
                pageid: "11"
              },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
              this.setState({
                data: response.data.result
              });
            })
            .catch(error => {
              const result = error.response;
              return Promise.reject(result);
            });
        } else {
          await axios
            .post(
              "https://api.indiabigshop.com/common/static_page.php",
              {
                security_token: "",
                plateform_type: "",
                langCode: "en",
                pageid: "11"
              },
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then(response => {
              this.setState({
                data: response.data.result
              });
            })
            .catch(error => {
              const result = error.response;
              return Promise.reject(result);
            });
        }
      }
    submit(e){
    }
    render() {  
        const { head, content } = this.state.data;
        return (
            <div>
                <Breadcrumb title={'FAQ'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title}/>
                
                
            <section className="faq-section section-b-space">
                    <div className="container">
                    <div className="card-header"> 
                    <h2>{head}</h2>
                  </div>
                  <div
                    className="input-layout1 card-body post-ad-page"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                  <div className="d-flex justify-content-end mr-4" style={{marginBottom: "10px"}}>
                    <a type="button" href="https://bo.beldara.com/policies/Beldara%20Policy.pdf" class="btn btn-solid" target="_blank">
                      Download
                    </a>
                  </div>
                    </div>
                </section>




            </div>
        );
    }
}


const mapStateToProps = state => ({
    languageMaster: state.languageMaster.languageMaster
  });
  
export default connect(mapStateToProps)(Faq);