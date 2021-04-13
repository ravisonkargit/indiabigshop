
import React, {Component} from 'react';
import Breadcrumb from "../../common/breadcrumb";
import MediaRelease from "./mediaRelease";
import Mediapr from "./mediapr";
import "./media.css";
import axios from 'axios';
import { connect } from 'react-redux';

import MediaScreenshot from "./mediaScreenshot";
import MediaScreenshotwithoutlink from "./mediaScreenshotwithoutlink";

var langDomain, domain_language_code;
class Media extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mediareleaseview: 0,
            data: ''
        }
        
    }
    
    async componentWillMount() {
        var hostname = window.location.hostname;
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
              "https://api.indiabigshop.com/common/static_page.php",
              { security_token: "", plateform_type: "", langCode: domain_language_code,pageid:'32790' },
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
              "https://api.indiabigshop.com/common/static_page.php",
              { security_token: "", plateform_type: "", langCode: 'en',pageid:'32790' },
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

      

  selectMedia = (e) => {
    let nav_link = document.getElementsByClassName('nav-link');
          this.setState({
            mediareleaseview: e.target.id
          })
    if (this.state.mediareleaseview == 0) {
            nav_link[1].classList.add('active');
            nav_link[0].classList.remove('active');
    } else {
            nav_link[0].classList.add('active');
            nav_link[1].classList.remove('active');
          }
      }
    render() {  
      let compo;
      if (this.state.mediareleaseview == 0) {
        compo = <MediaRelease />;
      } else {
        compo = <Mediapr />
      }
        return (
            <div>
                <Breadcrumb title={'Media Release'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title}/>
                
                    <section className="faq-section section-b-space">
                    <div className="breadcrumb bg-white">
                <img src={`${process.env.PUBLIC_URL}/assets/images/new-announcement-banner.jpg`} alt="newsroom Beldara" className="w-100" />
            </div>
            <div className="d-flex justify-content-center media_tab">
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item">
                        <span className="nav-link active nav-link-custom iphone5SE cursor font-nav" id="0" onClick={this.selectMedia}>Press Release</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link nav-link-custom iphone5SE cursor font-nav" id="1" onClick={this.selectMedia}>Tv Ad</span>
                    </li>

                </ul>
            </div>
            <div className="container">
                <div className="row">
                    {compo}
                </div>

                {/* <div className="">
                  <MediaScreenshot />
                </div>

                <div className="">
                  <MediaScreenshotwithoutlink />
                </div> */}
            </div>
                </section>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    languageMaster: state.languageMaster.languageMaster
 });

export default connect(mapStateToProps)(Media);