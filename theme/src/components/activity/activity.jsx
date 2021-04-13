import React, { Component } from 'react';
import Breadcrumb from "../common/breadcrumb";
import { activitylist } from "../../functions";
import axios from 'axios';
import { Helmet } from 'react-helmet';
var type = 'activity';
class Activitylist extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            catTitle: '',
            metaDesc: '',
            metaKeyword: '',
            statusId:''
        }
    }

    componentDidMount = async () => {
        try{
            await axios
            .post(
              "https://api.indiabigshop.com/common/static_seo.php",
              { security_token: "", plateform_type: "", langCode: "en",pageid:'45' },
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

         await activitylist(type).then(async res => {
            try{
                if(res != null || res != ''){
                    if(res.statusId==1 || res.statusId=="1"){
                        await this.setState({
                            data: res.result[0]
                        });
                    }
                }
            }catch(e){
                console.log(`😱 Axios request failed: ${e}`);
            }
        })      
    }
    render(){
        return(
            <div>
                <Breadcrumb title={'trade show / workshop'}/>
                <Helmet
                script={[{ 
                    type: 'application/ld+json', 
                    innerHTML: `window.yourObject = {"@context": "http://www.schema.org","@type": "Event","name": "New York Build","url": "https://beldara.com/trade-show/new-york-build-usa-new-york-16.html","description": "New York Build is the largest and market-leading construction show for New York. Since its launch 4 years ago, New York Build has steadily built up a loyal following of construction industry leaders, drawing in attendees because of its unique focus on New York and the surrounding Tri-State region, its first-class content, free to attend AIA CES approved workshops, entertainment and multiple networking events. New York Build is the largest construction & design show in New York, is officially supported by the Governor of New York and  is FREE to attend. New York Build features: 20,000+ registered attendees, 250+ exhibitors, 230+ speakers, AIA CES approved workshops, entertainment & business networking. NETWORK WITH 20,000+ ATTENDEES FROM CONTRACTORS, ARCHITECTS, ENGINEERS, DEVELOPERS, GOVERNMENT, INVESTORS AND REAL ESTATE.","location": {"@type": "Place","name": "JAVITS CENTER, NEW YORK, USA","address": {"@type": "PostalAddress""addressLocality": "NEW YORK","addressRegion": "NEW YORK","postalCode": "10001","addressCountry": "NEW YORK"}}}` 
                }]} >
                        {/* <title>{`${this.state.catTitle} on beldara.com`}   </title>
                        <meta name="description" content={`${this.state.metaDesc}`} />
                        <meta name="keyword" content={`${this.state.metaKeyword} | beldara.com`} /> */}
                </Helmet>
                <div className="container">
                    <div className="row">
                    {this.state.data != null && this.state.data != ''?
                        this.state.data.map((item, index) =>
                            item.image != null && item.image != ''?
                            <div key={index} class="col-md-4 col-sm-12 my-2">
                                <div className="card h-100">
                                <div class="card-body d-flex flex-column justify-content-between">
                                <div class="">
                                <a href={`/trade-show/`+item.event_name.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.event_country.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.event_city.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.id+`.html`} target="_blank">
                                <img src={item.image} className="githubIcon w-100"/>
                                </a>
                                <a href={`/trade-show/`+item.event_name.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.event_country.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.event_city.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.id+`.html`} target="_blank"><div className=""><b>{item.event_name}</b></div></a>
                                <div className="">Address: {item.event_location}</div>
                                <div className="">Date: {item.event_date}</div>
                                </div>
                                <div class="justify-content-center d-flex"><a class="btn btn-solid" href={`/trade-show/`+item.event_name.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.event_country.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.event_city.toLowerCase().replace(new RegExp(' ','g'),'-')+`-`+item.id+`.html`} role="button" target="_blank">More Details</a></div>
                                </div>
                                </div>
                            </div>
                            :'' 
                        )       
                    : ''}    
                </div>
            </div>
            </div> 
        )
    }
}
export default Activitylist;
