import React, { Component } from 'react';
import '../common/index.scss';
import Slider from 'react-slick';
import { withTranslate } from 'react-redux-multilingual';
import { activity } from "../../functions";
import $ from 'jquery';
import ls from 'local-storage';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Breadcrumb from "../common/breadcrumb";
var url_path = '';
var type = 'activity_details';

var mobile = '';
var email = '';
var get_path = '';
var get_id = '';
var id = '';
class Activity extends Component {
    constructor() {
        super();
        if (window.location.pathname.indexOf('/trade-show/') == -1) {
        } else {
            try {
                get_path = window.location.pathname.split('/trade-show/').pop().replace('.html', '');
                id = get_path.split('-').pop();
            } catch (e) {

            }
        }
        this.state = {
            activity: [],
            activityImg: [],
            mobile: [],
            email: [],
            catTitle: '',
            metaDesc: '',
            metaKeyword: ''
        }
    }

    componentDidMount = async () => {
        try {
            url_path = window.location.pathname.split('/trade-show/')[1].split('.html')[0].replace(new RegExp('-', 'g'), ' ');
        } catch (e) {

        }
        try {
            await axios
                .post(
                    "https://api.beldara.com/common/static_seo.php",
                    { security_token: "", plateform_type: "", langCode: "en", pageid: '45' },
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(response => {
                    this.setState({
                        catTitle: response.data.result.title + ' ' + url_path,
                        metaDesc: response.data.result.desc1 + ' ' + url_path,
                        metaKeyword: response.data.result.keyword + ' ' + url_path
                    })
                })
                .catch(error => {
                    const result = error.response;
                    return Promise.reject(result);
                });
        } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
        }

        await activity(id, type).then(async res => {
            try {
                if (res != null || res != '') {
                    if (res.statusId == 1 || res.statusId == "1") {
                        await this.setState({
                            activity: res.result[0][0],
                            activityImg: res.result[1][0],
                            mobile: res.result[0][0]['contact_number'].split(','),
                            email: res.result[0][0]['contact_email'].split(',')
                        });
                    }
                }
            } catch (e) {
                console.log(`😱 Axios request failed: ${e}`);
            }
        })

    }
    render() {
        var settings = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 100
        };
        // console.log(this.state.activityImg,'render');
        return (
            <div>
                <Breadcrumb title={'trade show / workshop'} />
                    {(window.location.pathname == '/trade-show/6th-oman-plast-2020--sultanate-of-oman-muscat-13.html') ?
                        <Helmet
                            script={[{
                                type: 'application/ld+json',
                                innerHTML: `window.yourObject = {"@context": "https://schema.org","@type": "Event","name": "6th OMAN PLAST 2020","description": "6th OMAN PLAST 2020 is an exclusive International Plastics, Rubber, Petrochemicals, Chemicals, Fertilizers, Plastics Recycling, Printing and Packaging Industry Exhibition & Conference being held now on an annual basis. The objective of this prestigious exhibition is to display and demonstrate the products and services pertaining to this industry to the fast developing market of the Sultanate of Oman and GCC Countries while further encouraging developing trade links between Oman and the rest of the world.","image": "https://img.beldara.com/create_event/QEBJPK61T-Oman-Banner.jpg","startDate": "2020-03-23","endDate": "2020-03-25","location": {"@type": "Place","name": "Oman Convention & Exhibition Centre,","address": {"@type": "PostalAddress","streetAddress": "","addressLocality": "Muscat","postalCode": "112","addressCountry": "SA"}}}`
                            }]}
                        >
                            {/* <title>{`${this.state.catTitle} on beldara.com`}   </title>
                            <meta name="description" content={`${this.state.metaDesc}`} />
                            <meta name="keyword" content={`${this.state.metaKeyword} | beldara.com`} /> */}

                        </Helmet>
                        :
                        <Helmet>
                            {/* <title>{`${this.state.catTitle} on beldara.com`}   </title>
                            <meta name="description" content={`${this.state.metaDesc}`} />
                            <meta name="keyword" content={`${this.state.metaKeyword} | beldara.com`} /> */}
                        </Helmet>
                    }
                <div className="container ">
                    <div className="row">
                        <div className="col-md-12">
                            <section className="p-0 small-slider">
                                {this.state.activityImg != null && this.state.activityImg != ''
                                    ?
                                    <Slider {...settings} className="slide-1 home-slider">
                                        {
                                            Object.keys(this.state.activityImg).map((item, index) =>
                                                this.state.activityImg[item] != null && this.state.activityImg[item] != '' ?
                                                    <div key={index} className={`home lazyload`} style={{ backgroundImage: `url(${this.state.activityImg[item]})` }}>
                                                        <img src={`${this.state.activityImg[item]}`} style={{width: "100%"}}/>
                                                    </div>
                                                    : ''
                                            )
                                        }
                                    </Slider>
                                    : ''}
                            </section>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="my-2">
                                <div className=""><b>Event Name: </b>{this.state.activity['event_name']}</div>
                            </div>
                            <div className="my-2">
                                <div className="">Date: {this.state.activity['event_date']}</div>
                            </div>
                            <div className="my-2">
                                <div className="">Location: {this.state.activity['event_location']}</div>
                            </div>
                            <div className="my-2">
                                <div className="">Region: {this.state.activity['event_country']}, {this.state.activity['event_city']}</div>
                            </div>
                            <div className="text-break my-4">
                                <span dangerouslySetInnerHTML={{ __html: this.state.activity['description'] }}></span>
                            </div>
                            <div className="my-2">
                                <div className="">Website: <a href={this.state.activity['website_link']} target="_blank">{this.state.activity['website_link']}</a></div>
                            </div>
                            <div className="my-2">
                                <div className="">Contact: {this.state.activity['contact_person']}</div>
                            </div>
                            <div className="my-2">
                                {this.state.mobile != null && this.state.mobile != '' ?
                                    this.state.mobile.map((item, index) => index > 0 ?
                                        <React.Fragment key={index}>, <span className=""> <a href={"tel:" + item}>{item}</a></span></React.Fragment>
                                        : <span key={index} className="">Mobile no: <a href={"tel:" + item}>{item}</a></span>
                                    )
                                    : ''
                                }
                            </div>
                            <div className="my-2">
                                {this.state.email != null && this.state.email != '' ?
                                    this.state.email.map((item, index) => index > 0 ?
                                        <React.Fragment key={index}>, <span><a href={"mailto:" + item}>{item}</a></span></React.Fragment>
                                        : <span key={index}>Email: <a href={"mailto:" + item}>{item}</a></span>
                                    )
                                    : ''
                                }
                            </div>
                            <div className="my-2">
                                <div className=""><center><a href={this.state.activity['user_link']} target="_blank">{this.state.activity['user_button']}</a></center></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslate((Activity));
