
import React, {Component} from 'react';
import { getAllCareers } from '../../../actions';
import { connect } from 'react-redux';
import Breadcrumb from "../../common/breadcrumb";

import "./career.css";
import axios from 'axios';
var langDomain, domain_language_code;
class Career extends Component {
    constructor() {
        super()
        this.state = {
          data:'',
          careersData:''
        }
      }


    async componentWillMount() {
        this.props.getAllCareers();
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
              { security_token: "", plateform_type: "", langCode: domain_language_code,pageid:'2' },
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
              { security_token: "", plateform_type: "", langCode: 'en',pageid:'2' },
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

        await axios
            .post(
              "https://api.indiabigshop.com/common/career.php",
              { security_token: "", plateform_type: ""},
              { headers: { "Content-Type": "multipart/form-data" } }
            )
              .then(response => {
               
              this.setState({
                careersData: response.data.result
              })
              //console.log("-----------carree-------------",this.state.careers);
            })
            .catch(error => {
              const result = error.response;
              return Promise.reject(result);
        });
        
    }

    
    render() {
        
        return (
            <div>
                <Breadcrumb title={'Career'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title}/>
                
                <section className="about-page  section-b-space">
            <div className="container ">
                <div className="row">
                    <div className="col-12">
                        <div className="card-box">
                            <div className="card mt-2">
                                <img className="career_header"
                                      alt="job opening on beldara.com" 
                                      src={`${process.env.PUBLIC_URL}/assets/images/beldara-job-opening.jpeg`}
                                       />
                            </div>
                        </div>
                    <div className="card-box">
                    <div >Interested Candidate can reach out to us at hr@beldara.com</div>
                            {
                                (this.state.careersData)?
                                this.state.careersData.map(item =>
                                    <div className="card mt-2" key={item.id} >
                                        <div className="card-header text-capitalize">
                                            <h5>Job Position : {item.post} </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="">
                                                    <div className="card-title"> {item.exp} </div>
                                                    <div className="card-text"> {item.edu} </div>
                                            </div>
                                           
                                            <div className="card-text mt-5">
                                                <span  dangerouslySetInnerHTML={{__html: item.jd}}></span>
                                            </div>
                                           
                                        </div>
                                    </div>
                                )
                                    : ''
                                }
    
                        </div>
                        
                    </div>
                    
                </div>
            </div>
            </section>
            </div>
        );
    }
}



// const mapStateToProps = (state) => {
//     return {
//         languageMaster: state.languageMaster.languageMaster,
//         careers: state.careers 
//     } 
// }

const mapStateToProps = state => ({
    languageMaster: state.languageMaster.languageMaster,
    careers: state.careers.careers
 });

export default connect(mapStateToProps,{getAllCareers})(Career);
// export default About;