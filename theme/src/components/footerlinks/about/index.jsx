import React, { Component } from 'react';

import Breadcrumb from "../../common/breadcrumb";
import { getAllLangContent } from '../../../actions';
import { connect } from 'react-redux';

import "./about.css";
import axios from 'axios';

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        }
    }
    tabChange(e) {

        var src = document.getElementById('myVideo').getAttribute('src');
        var allow = document.getElementById('myVideo').getAttribute('allow');
        allow = allow.replace(" autoplay;", "");
        src = src.replace("&autoplay=1", "");
        document.getElementById('myVideo').setAttribute('allow', allow);
        document.getElementById('myVideo').removeAttribute('autoplay');
        document.getElementById('myVideo').setAttribute('src', src);

        let id = e.target.id;
        let classtab = document.getElementsByClassName('nav-link-custom');
        for (let j = 0; j < classtab.length; j++) {
            classtab[j].classList.remove('active');
        }
        document.getElementById(id).classList.add('active');

        let tab_control = document.getElementById(id).getAttribute('aria-controls');

        let classarray = document.getElementsByClassName('all_pills');
        for (let i = 0; i < classarray.length; i++) {
            classarray[i].classList.remove('d-none');
            classarray[i].classList.add('d-none');
        }
        document.getElementById(tab_control).classList.remove("d-none");
    }

    async componentWillMount() {
        this.props.getAllLangContent('about', 'en');
        var hostname = window.location.hostname;
        // if (hostname === undefined || hostname == '')
        // hostname = "german.beldara.com";
        let domain_language_code;
        let langDomain = hostname.split("beldara.com")[0];
        langDomain = langDomain.replace(".", "");
        this.props.languageMaster.forEach(element => {
            if (element.main_language.toLowerCase() == langDomain.toLowerCase())
                domain_language_code = element.code;
        }, this);
        if (domain_language_code !== "" && domain_language_code !== undefined) {
            await axios
                .post(
                    "https://api.beldara.com/common/static_page.php",
                    { security_token: "", plateform_type: "", langCode: domain_language_code, pageid: '1' },
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(response => {
                    console.log(response);
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
                    { security_token: "", plateform_type: "", langCode: 'en', pageid: '1' },
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(response => {
                    console.log(response);
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

        return (
            <div>
                <Breadcrumb title={'About US'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} />

                <section className="about-page  section-b-space">
                    {/* <div dangerouslySetInnerHTML={{ __html: this.props.langContent.langContent[0].messages[0].content }} className="">

                    </div> */}

                    <div className="container">
                        <div className="row">
                            <div className="col-md-offset-1 col-md-8 nopadding about_header_wrapper">
                                <h2 className="responsive about_header1">Global B2B marketplace that enables businesses to</h2>
                                <h1 className="responsive about_header2">SELL INTERNATIONALLY</h1>
                            </div>
                            <div className="col-md-4 nopadding">
                                <img className="banner_image banner_image img-fluid" src={`${process.env.PUBLIC_URL}/assets/images/main_banner_image.png`} alt="beldara.com" about="beldara" />
                            </div>
                            <div className="col-12 d-flex justify-content-center about_tab" >
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active nav-link-custom iphone5SE" id="pills-about-tab" aria-controls="pills-about" onClick={this.tabChange} >About</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-custom iphone5SE" id="pills-vision-tab" aria-controls="pills-vision" onClick={this.tabChange} >Our Vision</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-custom iphone5SE" id="pills-have-tab" aria-controls="pills-have" onClick={this.tabChange} >What we have</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-custom iphone5SE" id="pills-value-tab" aria-controls="pills-value" onClick={this.tabChange} >Our Values</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-custom iphone5SE" id="pills-choose-tab" aria-controls="pills-choose" onClick={this.tabChange} >Why Choose Us?</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-custom iphone5SE" id="pills-leadership-tab" aria-controls="pills-leadership" onClick={this.tabChange} >Leadership</a>
                                    </li>
                                </ul>
                            </div>





                            <div className="container-fluid">
                                <div className="row">
                                    <div class="col-lg-12 col-sm-12">

                                        <div className="tab-content" id="pills-tabContent">
                                            <div className="all_pills" id="pills-about" aria-labelledby="pills-about-tab">
                                                <div className="row py-4">
                                                    <div className="col-md-6 col-12">
                                                        <div className="h4 mt-2 para-text">Company Overview</div>
                                                        <div className="card-body">
                                                            <span className="para-text para d-line">
                                                                Beldara is a global B2B marketplace that enables businesses to sell internationally by enhancing their marketing efforts, sales processes and improving efficiencies. Beldara.com run by PMK ecommerce Pvt Ltd, offers top of the line technology infrastructure to help your business reach new levels of success along with providing innovative marketing tools that help you to reach the right customers at the right time and place..<br />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12 p-0">
                                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/siOSoh8J5uk?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1&rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="" autoPlay="on" className="videoPlay" id="myVideo" allowscriptaccess="always"></iframe>
                                                    </div>
                                                </div>
                                                <div className="row vision_body">
                                                    <div className="col-lg-6">
                                                        <img className="img-fluid" src={`${process.env.PUBLIC_URL}/assets/images/map.jpg`} alt="about us beldara.com" />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="h4 mt-2 para-text paraheading p_16_0">Connect Buyers and suppliers from different nations</div>
                                                        <span className="para-text para">As a global B2B marketplace, we aim to connect buyers and suppliers from different nations or even continents to ensure that they kick off import and export according to their needs. As engaging with users is essential for the success of any business, We offer access to the latest technology tools that help you to connect with thousands of customers and go beyond the geographical boundaries. </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="card-body">
                                                        <span className="para-text para">The essence of our business is to help consumers, brands, retailers, merchants, other businesses, strategic alliance partners and third-party service providers to reach new levels of success every day and be happy with every transaction done at Beldara.com.<br /></span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="card-body">
                                                        <span className="para-text para d-line">Currently, we have 30 plus categories, but we expect to take beyond the century mark someday. To acheive that, all our team members are working hard day after day. as we understand the importance of key players at the global levels, we have found scores of buyers and trusted sellers in prominent countries like India, China and the US.</span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="card-body">
                                                        <span className="para-text para">The success of our B2B marketplace depends on the level of customer service we provide. Hence, everyone from an executive working for Beldara to the CEO is eager to help the clients attain satisfaction. We are a Global B2B marketplace that actually cares about customer satisfaction and happiness rather than just the numbers!</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-none all_pills" id="pills-vision" aria-labelledby="pills-vision-tab">
                                                <div className="row  py-4">

                                                    <p className="para vision_header">Beldara hopes to be the Largest Global B2B marketplace that is admired for its honesty and loved for the quality of products/services rendered. </p>

                                                </div>
                                                <div className="row py-4">

                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/man-standing-back-cave.jpg`} alt="beldara" />

                                                </div>

                                                <div className="py-5">
                                                    <div className="row vision_body">

                                                        <div className="col-md-4 pt-5">
                                                            <img className="pt-5 " src={`${process.env.PUBLIC_URL}/assets/images/box png.png`} alt="beldara" />
                                                        </div>
                                                        <div className="col-md-4 pt-5">
                                                            <div className="row my-4">
                                                                <div className="col-md-2 responsivediv-md-2">
                                                                    <img className="responsiveimg-md-2 img-class" src={`${process.env.PUBLIC_URL}/assets/images/strong interaction.png`} alt="beldara.com" />
                                                                </div>
                                                                <div className="col-md-10 no-padding responsivediv-md-10">
                                                                    <span className="vision_span_header">Strong Interactions</span>
                                                                    <p className="para responsivepara">We help millions of buyers and sellers to interact everyday as interaction can be stepping stone of satisfaction. </p>
                                                                </div>
                                                            </div>
                                                            <div className="row my-4">
                                                                <div className="col-md-2 responsivediv-md-2">
                                                                    <img className="responsiveimg-md-2 img-class" src={`${process.env.PUBLIC_URL}/assets/images/developing strong bonding.png`} alt="beldara.com" />
                                                                </div>
                                                                <div className="col-md-10 no-padding responsivediv-md-10">
                                                                    <span className="vision_span_header">Developing Strong Bonds</span>
                                                                    <p className="para responsivepara">Everyone from our buyers to sellers and employees to stakeholders is always in the loop on what we are planning to do in the future. We don't leave anyone out!</p>
                                                                </div>
                                                            </div>
                                                            <div className="row my-4">
                                                                <div className="col-md-2 responsivediv-md-2">
                                                                    <img className="responsiveimg-md-2 img-class" src={`${process.env.PUBLIC_URL}/assets/images/global market place.png`} alt="beldara.com" />
                                                                </div>
                                                                <div className="col-md-10 no-padding responsivediv-md-10">
                                                                    <span className="vision_span_header">Outliving Other Global<br /><span >Marketplaces</span></span>
                                                                    <p className="para" >Our mission is to last for more than a century and serve customers by fulfilling their business expectations. Operating for 100 years is just one of the milestones, with a goal to acheive a series of magnificient milestones that we have set our eyes on</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 pt-5">
                                                            <div className="row my-4">
                                                                <div className="col-md-2 responsivediv-md-2">
                                                                    <img className="responsiveimg-md-2 img-class" src={`${process.env.PUBLIC_URL}/assets/images/leverage technology.png`} alt="beldara.com" />
                                                                </div>
                                                                <div className="col-md-10 no-padding responsivediv-md-10">
                                                                    <span className="vision_span_header">Leveraging Technology</span>
                                                                    <p className="para" >Our team makes the use of the latest technologies like analytics tools to map buyer's expectations and guide sellers to meet the same.</p>
                                                                </div>
                                                            </div>
                                                            <div className="row my-4">
                                                                <div className="col-md-2 responsivediv-md-2">
                                                                    <img className="responsiveimg-md-2 img-class" src={`${process.env.PUBLIC_URL}/assets/images/expand your business.png`} alt="beldara.com" />
                                                                </div>
                                                                <div className="col-md-10 no-padding responsivediv-md-10">
                                                                    <span className="vision_span_header">Expanding Our Reach</span>
                                                                    <p className="para" >The team of Beldara.com will always launch new categories and offer innovative products to ensure that buyers and sellers don’t need any other excuse to visit us than just wondering “what’s new at Beldara.com today.”</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-none all_pills" id="pills-have" aria-labelledby="pills-have-tab">
                                                <div className="container py-5 none">
                                                    <div className="row ml-3 none">
                                                        <div className="col-md-5 box-icon none onlypadding buyer_seller_card">
                                                            <div className="text-center">
                                                                <img className="width_100" src={`${process.env.PUBLIC_URL}/assets/images/buyer and supplier icon.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="row pb-4 none">
                                                                <div className="col-md-9 linear-gradient py-2 text-center none">
                                                                    <span className="none pl_116" >BUYERS</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-center py-3">
                                                                <button type="button" className="btn box-button px-3 py-2">
                                                                    <a className="atag" href="/post-requirement.html">I am Buyer</a>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5 offset-md-1 box-icon none onlypadding buyer_seller_card buyer_seller_card">
                                                            <div className="text-center">
                                                                <img className="width_100" src={`${process.env.PUBLIC_URL}/assets/images/buyer and supplier icon.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="row pb-4 none">
                                                                <div className="col-md-9 linear-gradient py-2 text-center">
                                                                    <span className="none pl_116">SUPPLIERS</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-center py-3">
                                                                <button type="button" className="btn box-button px-3 py-2">
                                                                    <a className="atag" href="https://seller.beldara.com/business-listing.html">I am Seller</a>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="container mx-5 none">
                                                    <div className="row py-5 ml-3 none">
                                                        <div className="col-md-5 py-5 ml-5 no-padding none">
                                                            <div className="row px-3 py-5 buyer_info_bc">
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/buyer connect supplier.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="buyer_font_text" >Buyers can get in touch with suppliers and manufacturers in a cost-effective manner</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/buyer acces information.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="buyer_font_text" >Buyers can access complete information about the suppliers and manufacturers they are trusting</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/industrail .png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="buyer_font_text">Buyers also get access to industry-specific details of all industries listed on the website.</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5 offset-md-1 py-5 no-padding">
                                                            <div className="row px-3 py-5 buyer_info_bc">
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/product marketing.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="para" >Suppliers can get complete support in marketing their products and services</p>
                                                                        </div>
                                                                    </div>
                                                                    <span>  </span>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/visibility.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="para">Suppliers can gain visibility across different parts of the world as Beldara has global reach</p>
                                                                        </div>
                                                                    </div>
                                                                    <span>  </span>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/noticed score.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="para">Suppliers can get noticed by scores of buyers who visit Beldar.com regularly</p>
                                                                        </div>
                                                                    </div>
                                                                    <span>  </span>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/inquire.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="para">Suppliers also get genuine trade inquiries from legit buyers</p>
                                                                        </div>
                                                                    </div>
                                                                    <span>  </span>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/listing.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="para">Suppliers can list their products or services in any category they want</p>
                                                                        </div>
                                                                    </div>
                                                                    <span>  </span>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="w-100" src={`${process.env.PUBLIC_URL}/assets/images/supplier-get-live.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="para">Suppliers can get live view of his buyers</p>
                                                                        </div>
                                                                    </div>
                                                                    <span>  </span>
                                                                </div>
                                                                <div className="pb-5">
                                                                    <div className="row">
                                                                        <div className="col-md-2 no-padding">
                                                                            <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/listing.png`} alt="beldara.com" />
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <p className="para"> Suppliers can communicate with buyers with local languages</p>
                                                                        </div>
                                                                    </div>
                                                                    <span>  </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-none all_pills" id="pills-choose" aria-labelledby="pills-choose-tab">

                                            <div className="row my-5 vision_body">
                                                <div className="col-md-4 no-padding">
                                                    <img class=" " src={`${process.env.PUBLIC_URL}/assets/images/image-for-why-to-select-beldara.jpg`} alt="beldara" />
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="mt-5">
                                                        <h1 className="c_fs_47">Choosing Beldara is a wise decision</h1>
                                                        <h3 className="c_fs_32">as B2B marketplace for trading</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row py-5 vision_body">
                                                <div className="col-md-6">
                                                    <div className="pb-5">
                                                        <div className="row">
                                                            <div className="col-md-2 no-padding">
                                                                <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/no-boundaries.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="col-md-10">
                                                                <h5 className="ffh_c">No Boundaries</h5>
                                                                <p className="para">When you trust us, you will have the opportunity to buy and sell goods & services not only within Indian boundaries but across the globe too. </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row">
                                                            <div className="col-md-2 no-padding">
                                                                <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/customer-king.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="col-md-10">
                                                                <h5 className="ffh_c">Customer is King</h5>
                                                                <p className="para">As one of our services, we have the option of holding the payments made by the customers until the customers receive the shipment. Once a customer is happy, the payment is released. </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row">
                                                            <div className="col-md-2 no-padding">
                                                                <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/talented-team.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="col-md-10">
                                                                <h5 className="ffh_c">Talented Team</h5>
                                                                <p className="para">Our highly qualified, skilled, educated and enthusiastic team ensures that you get professional services that help you to grow your business and take it to the next level.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row">
                                                            <div className="col-md-2 no-padding">
                                                                <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/accurate-lead-status.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="col-md-10">
                                                                <h5 className="ffh_c">Accurate Lead Status</h5>
                                                                <p className="para">Beldara.com also helps you to track customer leads to your products to ensure you know buyer’s likes and dislikes, response to particular products, etc. You are also free to create customer lead status as per your preferences to ensure it supports your workflow. </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row">
                                                            <div className="col-md-2 no-padding">
                                                                <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/multi-languages-chat-features.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="col-md-10">
                                                                <h5 className="ffh_c">Multi-Language Chat Features</h5>
                                                                <p className="para">Beldara.com supports multi-language chat features between buyers and sellers. The chat can be accessed via any device, be it a tablet or a smartphone. The chat also supports offline messaging. </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row">
                                                            <div className="col-md-2 no-padding">
                                                                <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/sponsored-product.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="col-md-10">
                                                                <h5 className="ffh_c">Sponsored Products</h5>
                                                                <p className="para">In case you want to boost the visibility of a specific listing on Beldara.com, your preferred B2B marketplace, you can sponsor the products and get them more visibility on the search results and product detail pages. It is a sure shot way of increasing visibility and driving sales numbers.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="pb-5">
                                                        <div className="row">
                                                            <div className="col-md-2 no-padding">
                                                                <img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/superior-security.png`} alt="beldara.com" />
                                                            </div>
                                                            <div className="col-md-10">
                                                                <h5 className="ffh_c">Superior Security</h5>
                                                                <p className="para">The security we offer is world class. All the international transactions are done in a 100 percent secure environment that includes the use of top of the line SSL technology.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row"><div className="col-md-2 no-padding"><img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/laudable-logistics.png`} alt="beldara.com" /></div><div className="col-md-10"><h5 className="ffh_c">Laudable Logistics</h5><p className="para">As a leading B2B marketplace, at Beldara we understand the importance of right logistics. Therefore, we have partnered with multiple logistics providers to cater to the shipment handling of the products offered. We help in ensuring hassle-free delivery of all shipments across the world.  </p></div></div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row"><div className="col-md-2 no-padding"><img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/superior-security.png`} alt="beldara.com" /></div><div className="col-md-10"><h5 className="ffh_c">Wider Visibility</h5><p className="para">We ensure that you make the most of our global B2B marketplace by getting exposure to clients from all over the world. We promote your products and services constantly to help you get a step closer to the buyers. Every manufacturer and seller can access technology trends, market research, and infrastructure needed to connect with buyers from different backgrounds and nations.</p></div></div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row"><div className="col-md-2 no-padding"><img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/superior-security.png`} alt="beldara.com" /></div><div className="col-md-10"><h5 className="ffh_c">Easy to Manage Employee Sub Accounts</h5><p className="para">In case you don’t want to manage your account at Beldara.com yourself, you can get access to 6 employee sub-accounts that can be used by everyone from the sales in-charge or your company to the digital marketing manager. These accounts can be used to manage sales, generate reports, answer buyer inquiries, keep an eye on feedback, customize the store and meet customer expectations in every way. </p></div></div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row"><div className="col-md-2 no-padding"><img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/superior-security.png`} alt="beldara.com" /></div><div className="col-md-10"><h5 className="ffh_c">Efficient Email and SMS Campaigns</h5><p className="para">Beldara.com is among the few global B2B marketplaces that allow you to make use of effective email and SMS campaigns for various aims like increasing sales, boosting brand awareness, promoting new products or services, increasing client engagement, gathering feedback and much more. </p></div></div>
                                                    </div>
                                                    <div className="pb-5">
                                                        <div className="row"><div className="col-md-2 no-padding"><img className="width_50" src={`${process.env.PUBLIC_URL}/assets/images/superior-security.png`} alt="beldara.com" /></div><div className="col-md-10"><h5 className="ffh_c">Special Offers</h5><p className="para">Manufacturers and suppliers can create special offers on the products to boost seasonal or festive sales. You can do it easily at Beldara.com, a global B2B marketplace by choosing the type of promotion you need to create and sharing details of the offer to catch customers’ eyes.</p></div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-none all_pills" id="pills-value" aria-labelledby="pills-value-tab">
                                            <div className="py-5">
                                                <div className="row vision_body" >
                                                    <div className="col-md-1 text-center">
                                                        <h1 className="c_106">1</h1>
                                                    </div>
                                                    <div className="col-md-8 py-2">
                                                        <h5 className="c_ffh_22">Customers Are a Priority</h5>
                                                        <p className="para">Beldara.com has become a leading B2B marketplace because it always puts the customers, buyers, sellers, and manufacturers first and caters to all their needs at all times. </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-1 text-center">
                                                        <h1 className="c_106">2</h1>
                                                    </div>
                                                    <div className="col-md-8 pt-3">
                                                        <h5 className="c_ffh_22">Teamwork Builds Trust</h5>
                                                        <p className="para">Beldara.com promotes teamwork because it can let ordinary people achieve extraordinary levels of success time and again. Working in teams also builds trust and remove the barriers of race, age or gender!</p>
                                                    </div>
                                                </div>
                                                <div className="row vision_body" >
                                                    <div className="col-md-1 text-center">
                                                        <h1 className="c_106">3</h1>
                                                    </div>
                                                    <div className="col-md-8 pt-3">
                                                        <h5 className="c_ffh_22">Change is Vital</h5>
                                                        <p className="para">At Beldara.com, change is encouraged and appreciated. We keep up with the global e-commerce trends and constantly learn to enhance ourselves as a leading Global B2B marketplace. </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-1">
                                                        <h1 className="c_106">4</h1>
                                                    </div>
                                                    <div className="col-md-8 pt-3">
                                                        <h5 className="c_ffh_22">Integrity Can’t be Ignored</h5>
                                                        <p className="para">Anyone who is associated with Beldara has the highest possible levels of honesty and integrity. We never lie, cheat or follow any unethical business practices.  </p>
                                                    </div>
                                                </div>
                                                <div className="row vision_body" >
                                                    <div className="col-md-1">
                                                        <h1 className="c_106">5</h1>
                                                    </div>
                                                    <div className="col-md-8 pt-3">
                                                        <h5 className="c_ffh_22">Passion Makes Perfect</h5>
                                                        <p className="para">Each person associated with Beldara has a passion for what he or she is doing. This passion drives our people to strive for excellence every day and deliver exceptional results!</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-1">
                                                        <h1 className="c_106">6</h1>
                                                    </div>
                                                    <div className="col-md-8 pt-3">
                                                        <h5 className="c_ffh_22">Commitment is Crucial</h5>
                                                        <p className="para">All the people associated with Beldara, a leading B2B marketplace are committed to keeping the customer happy. They are rewarded for their enthusiasm if they go the extra mile for the customers!</p>
                                                    </div>
                                                </div>
                                                <div className="row vision_body" >
                                                    <div className="col-md-1">
                                                        <h1 className="c_106">7</h1>
                                                    </div>
                                                    <div className="col-md-8 pt-3">
                                                        <h5 className="c_ffh_22">Empowerment is Essential </h5>
                                                        <p className="para">We empower our employees to assist customers in the best possible manner. We also empower suppliers to spread their wings and encourage buyers to settle for nothing but the best! </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-none all_pills" id="pills-leadership" aria-labelledby="pills-leadership-tab">

                                            <div id="summary">
                                                <div className="row vision_body">
                                                    <div className="col-md-5">
                                                        <img src={`${process.env.PUBLIC_URL}/assets/images/leader-ship.jpg`} alt="beldara.com" />
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="mt-5">
                                                            <h1 className="c_fs_32">We have a team of dynamic, charismatic</h1>
                                                            <h1 className="c_fs_32">intelligent and smart people</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="container mt-5">
                                                    <h3 className="c_23;">Highly preferred global B2B marketplace. Here you can have a look at the people who hold the credit of our success and are leading us to be better every day!</h3>
                                                </div>
                                                {/* pradeep k */}
                                                <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/pradeep-sir-image-for--leadership-page.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Pradeep Khandekar</b></h5>
                                                            <h6 className="c_gray desig"><b>Founder of Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary" id="summary">
                                                            <span className=" to_ell" id="collapseSummary"><p className="para" >Mr. Pradeep Khandekar is the first generation entrepreneur who started Beldara.com, a B2B Marketplace in the year 2018. Before Beldara’s inception, Mr. Khandekar has headed multiple roles in various sectors such as Information Technology, E-commerce, and Construction across India and overseas. He was a CTO at Rupee Boss.com, Vice President Engineering at Nykaa.com, Assistant General Manager at BookMyShow.com and UFO Movies India Ltd.</p>
                                                                <p className="para">He has a clear vision to see Beldara.com amongst the largest Indian company in the world by 2022 and to create value in its services. He is a thought leader who believes in ‘speak less, action more’ and chooses to live by this credo.</p>
                                                                {/* <p className="para">Pradeep is a true leader who initiates every change at Beldara.com thanks to his thorough knowledge and understanding of the e-commerce world!</p> */}
                                                            </span>


                                                        </div>

                                                    </div>
                                                </div>

                                                {/* vinod singh */}
                                                <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/vinod-singh.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Vinod Singh</b></h5>
                                                            <h6 className="c_gray desig"><b>Co-Founder at Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary">
                                                            <span className=" to_ell" id="vinod-singh" >
                                                                <p className="para" >Mr. Vinod Singh joined Beldara as a member of the founding team. He looks after company business Demotics and Global expansion closely focusing on strategic investments.</p>
                                                                <p className="para">He is an elite Business Financial Professional with over 14 years of Senior Management experience with extensive understanding of global businesses across Retail Industry, Investment Banking, Telecom, FMCG segment, Agro Machinery, Hospitality, & Real Estate space.</p>
                                                                <p className="para">He has initiated and led many strategic business initiatives which has contributed towards the growth and sustainability of all the companies where he has been associated in the past.</p>
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/krishna-sir.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Krishna Sawant</b></h5>
                                                            <h6 className="c_gray desig"><b>COO at Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary">
                                                            <span className=" to_ell" id="krishna-sawant" >
                                                                <p className="para" >Mr. Krishna Sawant joined Beldara as a member of the founding team. Since then, among the multiple roles he has been performing, he spearheads the day to day operations at Beldara.com by developing operations strategy and setting targets, providing training to ground crew. He also closely looks after the Beldara App performance and Beldara Logistics Operations.</p>
                                                                <p className="para" >With over 14 years of work experience in Entertainment, E-commerce and Technology, his core expertise lies in Web Design & Development, Marketing and Operations. Prior to his current position, he was associated with Sarathi Software Pvt. Ltd, UFO Movies, Valuable Technologies and, Rhythm Tech.</p>
                                                                <p className="para" >He is great visualizer, loves to experiment with new initiatives and innovations.</p>
                                                            </span>

                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/bijal-mam.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Bijal Shah</b></h5>
                                                            <h6 className="c_gray desig"><b>Head of  Finance and Account at Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary">
                                                            <span className=" to_ell" id="bijal-shah" >
                                                                <p className="para" >Ms. Bijal Shah is the Additional Director - Accounts & HR at Beldara.com. Over the years Ms. Bijal has worked in start-ups and fast paced organizations.</p>
                                                                <p className="para" >At Beldara.com, she plays a very critical role in building and transforming the organization and scaling the people function. Proficient in Finance and Accounts, have gained intricate knowledge of statuary compliance, audit, taxation budgeting and costing.</p>
                                                                <p className="para" >She holds a Bachelor’s degree in Commerce from Mumbai University.</p>
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>


                                                 {/* kaustubh kale */}

                                                 <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/kaustubh-kale.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Kaustubhi Kale</b></h5>
                                                            <h6 className="c_gray desig"><b>Senior Manager – Marketing</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary" id="summary">
                                                            <span className=" to_ell" id="collapseSummary">
                                                                <p className="para" >Ms. Kaustubhi Kale is a Branding and Communication professional with over 10 years of experience spanning Corporate Communications, Marketing Communications, B2B & B2C Brand Communication.</p>
                                                                <p className="para" >She has been fortunate to have been affiliated with mid-sized organizations extending towards Entertainment, Web, Advertising, Technology, Education, Food & Hospitality, Mobile App and Real Estate Sector.</p>
                                                                <p className="para" >Kaustubhi holds a Master’s Degree in Marketing Management from Welingkar Institute and a Postgraduate Degree in Public Relations from EMDI Institute, Mumbai.</p>
                                                            </span>
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* Sejal Malviya */}

                                                <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/sejal-malviya.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Sejal Malviya</b></h5>
                                                            <h6 className="c_gray desig"><b>PR- Manager at Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary" id="summary">
                                                            <span className=" to_ell" id="collapseSummary">
                                                                <p className="para" >Ms. Sejal Malviya is the PR Manager at Beldara.com. She graduated in Journalism and Mass Communication from Jagran Lakecity University of Bhopal. Before joining Beldara in 2019, she reported for India TV in the entertainment streaming industry in the Mumbai branch.</p>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                

                                                <div className="row my-5 vision_body">
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/sachin.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Sachin Shelke</b></h5>
                                                            <h6 className="c_gray desig"><b>Head of Purchase at Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary">
                                                            <span className="collapse to_ell" id="sachin-shelke" style={{ height: '88px; !important' }}>
                                                                <p className="para" >Mr. Sachin Baban Shelke heads the Legal and Sales Division at Beldara.com. He is an experienced Sales and Merchandising professional with diverse experience across a broad range of Online Retail, Category Management, Channel Sales & Distribution, Retail and Enterprise Sales. </p>
                                                                <p className="para" >Proficient in analysing market trends to provide critical inputs for business development initiatives and formulation of selling strategies. He has a strong people management skills and exceptionally well-organized. 
He holds a Bachelor’s degree in Commerce and a Master’s Degree in Bachelor of Laws from Mumbai University.</p>
                                                            </span>
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* sanjay */}

                                                <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/sanjay_profile_pic.jpg`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>Sanjay Deorukhkar</b></h5>
                                                            <h6 className="c_gray desig"><b>AVP – Logistics at Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary" id="summary">
                                                            <span className=" to_ell" id="collapseSummary">
                                                                <p className="para" >Mr. Sanjay Deorukhkar is the Senior most person with over 19 years of experience in Logistics. He holds a Bachelor of Business Administration (BBA) degree in Logistics. He is a versatile Logistics professional capable of managing every aspect of the supply chain.</p>
                                                            </span>
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* nahiyan */}

                                                <div className="row my-5 vision_body" >
                                                    <div className=" p_100 row ml-2 mr-2">
                                                        <div className="col-md-3 text-center">
                                                            <img className="img-leaderdship" src={`${process.env.PUBLIC_URL}/assets/images/nahiyan_profile_pic.png`} alt="beldara.com" />
                                                            <h5 className="c_gray"><b>AL Nahiyan Gangani</b></h5>
                                                            <h6 className="c_gray desig"><b>AVP Business Development at Beldara.com</b></h6>
                                                        </div>
                                                        <div className="col-md-9 summary" id="summary">
                                                            <span className=" to_ell" id="collapseSummary">
                                                                <p className="para" >Al Nahiyan leads business development at Beldara.com in India. Part of India business operations, he is leading channel strategies, ecommerce ecosystem development working with many local partners, local government and local trade associations and chambers. He has over 14 years of experience out of which over 8 years he was associated with Alibaba.com heading business development for India.</p>
                                                            </span>


                                                        </div>

                                                    </div>
                                                </div>


                                               

                                                <div className="card my-5">
                                                    <img className="card-img-top" src={`${process.env.PUBLIC_URL}/assets/images/without-strip-tech-team-images.jpg`} alt="tech Energy" />
                                                    <div className="card-body">
                                                        <p className="card-text para">In today's world technology bring immense changes in terms of communication. It became possible because of smartphones and social media sites. Beldara has a very energetic tech team. It is quite tough to have such an enthusiast team for whom work comes at first place and Beldara is proud to have them. Beldara is led by positive and good soul team members. Every team in business has its importance but technology is the backbone of every business. The B2B marketplace is incomplete without the technology team like a plant without roots.</p>
                                                    </div>
                                                </div>
                                                <div className="card" >
                                                    <img className="card-img-top" src={`${process.env.PUBLIC_URL}/assets/images/without-strip-e-commerce--team.jpg`} alt="Fuel Energy" />
                                                    <div className="card-body">
                                                        <p className="card-text para">The eCommerce team is the heart of any B2B marketplace company. Similarly, Beldara gets fuel from its eCommerce team. The fuel team knows very well how to generate sales through the internet to grow the business widely. There is always a pressure of maintaining an image although for Beldara it's not a matter of concern because it has an erudite fuel team. Beldara has the diligent and intellectual team in the eCommerce department.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-layout1 gradient-padding post-ad-page">
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        )
    }
}

const mapStateToProps = state => ({
    languageMaster: state.languageMaster.languageMaster
});
export default connect(mapStateToProps, { getAllLangContent })(About);
//export default About;
