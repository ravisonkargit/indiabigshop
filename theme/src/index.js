import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual'
 
import store from './store';
import asyncComponent from './AsyncComponent'
import axios from 'axios'
import {localhost} from '../src/constants/variable'
import Layout from './components/app'
// import Dashboard from './components/pages/dashboard';

var translations, langDomain
(async () => {
 
    langDomain = window.location.hostname.split("beldara.com")[0];
    langDomain = langDomain.replace(".", "");
//${localhost}
    // await axios.get(`https://uat.beldara.com/translations/english`,{headers:{'Content-Type':'application/json'}})
    // .then(async resp=>{
    //     translations = await resp.data
    //     // console.log(translations)
    // })

switch(langDomain){
    case 'hindi':
        await import('./constants/hindi.translations').then(async module =>{
            // await this.setState(async () => {
            //     translations : await module.default
            // })
            translations = await module.default
        })
    break;
    case 'german':
        await import('./constants/german_translations').then(async module =>{
            // await this.setState(async () => {
            //     translations : await module.default
            // })
            translations = await module.default
        })    

    break;
    case 'russian':
        await import('./constants/russian.translations').then(async module =>{
            // await this.setState(async () => {
            //     translations : await module.default
            // })
            translations = await module.default
        })
    break;
    case 'chinese':
        await import('./constants/chinese.translations').then(async module =>{
            // await this.setState(async () => {
            //     translations : await module.default
            // })
            translations = await module.default
        })
    break;
    case 'arabic':
        await import('./constants/arabic.translations').then(async module =>{
            // await this.setState(async () => {
            //     translations : await module.default
            // })
            translations = await module.default
        })
    break;
    default:
        
        await import('./constants/translations').then(async module =>{
            // await this.setState(async () => {
            //     translations : await module.default
            // })
            translations = await module.default
        })
    break;
}


 var url_path_cat, url_path_supplier, url_path_bpp;

 if (window.location.pathname.indexOf('/cat/') != -1)
 url_path_cat = window.location.pathname.split('/cat/')[1].split('.html')[0].split('/');
 else if (window.location.pathname.indexOf('/supplier/') != -1)
 url_path_supplier = window.location.pathname.split('/supplier/')[1].split('.html')[0].split('/');
 else if (window.location.pathname.indexOf('/bpp/') != -1)
 url_path_bpp = window.location.pathname.split('/bpp/')[1].split('.html')[0].split('/');

 const ColumnLeft = asyncComponent(() =>
 import('./components/products/column-left').then(module => module.default)
 )
 const ColumnLeftNew = asyncComponent(() =>
 import('./components/products/column-left-new').then(module => module.default)
 )
 const postRequirement = asyncComponent(() =>
 import('./components/form/post-requirement').then(module => module.default)
 )
 const Pets = asyncComponent(() =>
 import('./components/layouts/pets/main').then(module => module.default)
 )
 const StoreFront = asyncComponent(() =>
 import('./components/storeFront').then(module => module.default)
 )
 const BuyLead = asyncComponent(() =>
 import('./components/buyLead').then(module => module.default)
 )
 const Category = asyncComponent(() =>
 import('./components/category').then(module => module.default)
 )
 const Supplier = asyncComponent(() =>
 import('./components/supplier').then(module => module.default)
 )
 const WriteReview = asyncComponent(() =>
 import('./components/products/common/product/WriteReview').then(module => module.default)
 )
 const Search = asyncComponent(() =>
 import('./components/search').then(module => module.default)
 )
 const landingPage = asyncComponent(() =>
 import('./components/landingPage').then(module => module.default)
 )
 

 const offers = asyncComponent(() =>
 import('./components/offers').then(module => module.default)
 )
 const Membership = asyncComponent(() =>
 import('./components/membership').then(module => module.default)
 )

 const FlashMembership = asyncComponent(() =>
 import('./components/membership/flash-membership-offer').then(module => module.default)
 )

const Membership_Monthly = asyncComponent(() =>
import('./components/membership/membership_monthly').then(module => module.default)
)

 const About = asyncComponent(() =>
 import('./components/footerlinks/about').then(module => module.default)
 )
 const Career = asyncComponent(() =>
 import('./components/footerlinks/career').then(module => module.default)
 )
 const Faq = asyncComponent(() =>
 import('./components/footerlinks/faq').then(module => module.default)
 )
 const FaqBuyer = asyncComponent(() =>
 import('./components/footerlinks/faq/faq_buyer').then(module => module.default)
 )
 const TermCondition = asyncComponent(() =>
 import('./components/footerlinks/termCondition').then(module => module.default)
 )
 const PrivacyPolicy = asyncComponent(() =>
 import('./components/footerlinks/privacyPolicy').then(module => module.default)
 )
 const Media = asyncComponent(() =>
 import('./components/footerlinks/mediaRelease').then(module => module.default)
 )
 const SellFast = asyncComponent(() =>
 import('./components/footerlinks/sellFast').then(module => module.default)
 )
 const BuyOnBeldara = asyncComponent(() =>
 import('./components/footerlinks/buyOnBeldara').then(module => module.default)
 )
 const ProductListingGuidelines = asyncComponent(() =>
 import('./components/footerlinks/ProductListingGuidelines').then(module => module.default)
 ) 
 const BeldaraPolicies = asyncComponent(() =>
 import('./components/footerlinks/BeldaraPolicies').then(module => module.default)
 ) 
 const BeldaraWarehouse = asyncComponent(() =>
 import('./components/footerlinks/BeldaraWarehouse').then(module => module.default)
 ) 
 const BeldaraFirst = asyncComponent(() =>
 import('./components/footerlinks/beldaraFirst').then(module => module.default)
 )
 const BannerAds = asyncComponent(() =>
 import('./components/footerlinks/bannerAds').then(module => module.default)
 )
 const PromoteBusiness = asyncComponent(() =>
 import('./components/footerlinks/promoteBusiness').then(module => module.default)
 )
 const SafeOnBeldara = asyncComponent(() =>
 import('./components/footerlinks/safeOnBeldara').then(module => module.default)
 )
 const ProductListingGuide = asyncComponent(() =>
 import('./components/footerlinks/productListingGuide').then(module => module.default)
 )
 const Contact = asyncComponent(() =>
 import('./components/footerlinks/contact').then(module => module.default)
 )
 const productPolicy = asyncComponent(() =>
 import('./components/footerlinks/productPolicy').then(module => module.default)
 )
 const BeldaraLogisticServices = asyncComponent(() =>
 import('./components/footerlinks/beldaraLogisticServices').then(module => module.default)
 )
 const ThankYou = asyncComponent(() =>
 import('./components/common/thankYou').then(module => module.default)
 )
 const startOrder = asyncComponent(() =>
 import('./components/order/start-order').then(module => module.default)
 )


 const startOrderTest = asyncComponent(() =>
 import('./components/order/start-order-test').then(module => module.default)
 )

 const cartComponent = asyncComponent(() =>
 import('./components/cart').then(module => module.default)
 )

 const cartTestComponent = asyncComponent(() =>
 import('./components/cart/cart-test').then(module => module.default)
 )
 // const Test = asyncComponent(() =>
 // import('./test').then(module => module.default)
 // )
 const logOut = asyncComponent(() =>
 import('./components/logOut').then(module => module.default)
 )

 const Login = asyncComponent(() =>
 import('./components/common/login').then(module => module.default)
 )

 const Register = asyncComponent(() =>
 import('./components/common/register').then(module => module.default)
 )

 const landingPageForAndroid = asyncComponent(() =>
 import('./components/landingPageForAndroid').then(module => module.default)
 )

 const landingOfferPageForAndroid = asyncComponent(() =>
 import('./components/landingOfferPageForAndroid').then(module => module.default)
 )

 const landingNewArrivalForApp = asyncComponent(() =>
 import('./components/landingNewArrivalForApp').then(module => module.default)
 )

 const landingOfferPageForWeb = asyncComponent(() =>
 import('./components/landingOfferPageForAndroid/offerPageForWeb').then(module => module.default)
 )

 const wishlist = asyncComponent(() =>
 import('./components/wishlists').then(module => module.default)
 )

 const reqFeedback = asyncComponent(() =>
 import('./components/feedback').then(module => module.default)
 )
 const reqFeedbackComment = asyncComponent(() =>
 import('./components/feedback/comment').then(module => module.default)
 )

 const partnerWithUs = asyncComponent(() =>
 import('./components/partner').then(module => module.default)
 )

 const checkOut = asyncComponent(() =>
 import('./components/checkout').then(module => module.default)
 )

 const Test = asyncComponent(() =>
 import('./components/test/test').then(module => module.default)
 )

 const additonalDataReq = asyncComponent(() =>
 import('./components/additionalDataReq').then(module => module.default)
 )

 const brandPromo = asyncComponent(() =>
 import('./components/bpp').then(module => module.default)
 )

 const referEarn = asyncComponent(() =>
 import('./components/referEarn').then(module => module.default)
 ) 

 const wallet = asyncComponent(() => 
 import('./components/wallet').then(module => module.default)
 )

 // const LeadBid = asyncComponent(() =>
 // import('./components/leadBid').then(module => module.default)
 // )

 const auction = asyncComponent(() =>
 import('./components/auction').then(module => module.default)
 )

 const auctionDetail = asyncComponent(() =>
 import('./components/auction/auctionDetail.jsx').then(module => module.default)
 )

 const activityDetails = asyncComponent(() =>
 import('./components/activity').then(module => module.default)
 )

 const activity = asyncComponent(() =>
 import('./components/activity/activity').then(module => module.default)
 )

 const infoAuction = asyncComponent(() =>
 import('./components/auction/infoAuction').then(module => module.default)
 )

 const auctionRelated = asyncComponent(() =>
 import('./components/auction/auctionRelated.jsx').then(module => module.default)
 )
 const ProcessTranscation = asyncComponent(() =>
 import('./components/razorpayForm/processtranscation.jsx').then(module => module.default)
 )

 const startShopping = asyncComponent(() =>
 import('./components/startShopping').then(module => module.default)
 )


 const feedbackQuestion = asyncComponent(() =>
 import('./components/feedbackQuestion').then(module => module.default)
 )

 const Mobile = asyncComponent(() =>
 import('./components/mobile').then(module => module.default)
 )

 const ReturnPolicy = asyncComponent(() =>
 import('./components/footerlinks/returnPolicy').then(module => module.default)
 )

 const myOrder = asyncComponent(() =>
 import('./components/myOrder').then(module => module.default)
 )

 const ViewImage = asyncComponent(() =>
 import('./components/products/view-product-image').then(module => module.default)
 )
 

 class Root extends React.Component {
 render() {

 var langDomain;
 var hostname = window.location.hostname;
 // if (hostname === undefined || hostname == '') 
 // hostname = 'hindi.beldara.com';
 langDomain = hostname.split('beldara.com')[0];
 langDomain = langDomain.replace(".", "");
 // store.dispatch(getAllLanguages(langDomain))
 // store.dispatch(getAllTM());
 return (

 <Provider store={store}>
 {

 <IntlProvider translations={translations} locale='en'>
 {/* <Helmet>
 <title>{metaTitle}</title>
 <meta name="description" content={metaDesc} />
 <meta name="keywords" content={metaKeyword} />
 </Helmet> */}
 <BrowserRouter basename={'/'} >
 <ScrollContext>
 <Switch>
 <Route exact path={`${process.env.PUBLIC_URL}/`} component={Pets} />
 <Route exact path={`${process.env.PUBLIC_URL}/login.html`} component={Login} />
 <Route exact path={`${process.env.PUBLIC_URL}/register.html`} component={Register} />
 <Route path={`${process.env.PUBLIC_URL}/lp-app/:id`} component={landingPageForAndroid} />
 <Route path={`${process.env.PUBLIC_URL}/lp_app/:id`} component={landingPageForAndroid} /> 
 <Route path={`${process.env.PUBLIC_URL}/app-terms-and-condition.html`} component={TermCondition} /> 
 <Route path={`${process.env.PUBLIC_URL}/app-policies.html`} component={BeldaraPolicies} />
 <Route path={`${process.env.PUBLIC_URL}/lp-offer-app/:id`} component={landingOfferPageForAndroid} />
 <Route path={`${process.env.PUBLIC_URL}/app-terms-and-condition.html`} component={TermCondition} />
 <Route path={`${process.env.PUBLIC_URL}/beldara-first-app.html`} component={BeldaraFirst} />

 <Route path={`${process.env.PUBLIC_URL}/lp-arrival/:type/:id`} component={landingNewArrivalForApp} />

 <Route path={`${process.env.PUBLIC_URL}/return-policy-app.html`} component={ReturnPolicy} />
 <Route path={`${process.env.PUBLIC_URL}/my-order-app-:id.html`} component={myOrder} />
 <Layout>

 <Route path={`${process.env.PUBLIC_URL}/store/:id.html`} component={StoreFront} />

 <Route path={`${process.env.PUBLIC_URL}/product/:id`} component={ColumnLeftNew} />
 <Route path={`${process.env.PUBLIC_URL}/view-image.html`} component={ViewImage} />
 {/* <Route path={`${process.env.PUBLIC_URL}/product-test/:id`} component={ColumnLeft} /> */}

 <Route path={`${process.env.PUBLIC_URL}/search`} component={Search} />

 <Route path={`${process.env.PUBLIC_URL}/rating/:id`} component={WriteReview} /> 




 {url_path_cat ?
 (url_path_cat[3]) ?
 <Route path={`${process.env.PUBLIC_URL}/cat/:id/:id/:id/:id`} component={Category} />
 : (url_path_cat[2]) ?
 <Route path={`${process.env.PUBLIC_URL}/cat/:id/:id/:id`} component={Category} />
 : (url_path_cat[1]) ?
 <Route path={`${process.env.PUBLIC_URL}/cat/:id/:id`} component={Category} />
 : (url_path_cat[0]) ?
 <Route path={`${process.env.PUBLIC_URL}/cat/:id`} component={Category} />
 : ""
 : ""
 }


 {url_path_supplier ?
 (url_path_supplier[3]) ?
 <Route path={`${process.env.PUBLIC_URL}/supplier/:id/:id/:id/:id`} component={Supplier} />
 : (url_path_supplier[2]) ?
 <Route path={`${process.env.PUBLIC_URL}/supplier/:id/:id/:id`} component={Supplier} />
 : (url_path_supplier[1]) ?
 <Route path={`${process.env.PUBLIC_URL}/supplier/:id/:id`} component={Supplier} />
 : (url_path_supplier[0]) ?
 <Route path={`${process.env.PUBLIC_URL}/supplier/:id`} component={Supplier} />
 : ""
 : ""
 }

 {/* { url_path_bpp?
 (url_path_bpp[3])?
 <Route exact path={`${process.env.PUBLIC_URL}/bpp/:id/:id/:id/:id`} component={brandPromo} />
 : (url_path_bpp[2])?
 <Route exact path={`${process.env.PUBLIC_URL}/bpp/:id/:id/:id`} component={brandPromo}/> 
 : (url_path_bpp[1])?
 <Route exact path={`${process.env.PUBLIC_URL}/bpp/:id/:id`} component={brandPromo}/> 
 : (url_path_bpp[0])?
 <Route exact path={`${process.env.PUBLIC_URL}/bpp/:id`} component={brandPromo}/>
 : ""
 : ""
 } */}


 <Route path={`${process.env.PUBLIC_URL}/bpp(/)?(:id)?(.html)?`} component={brandPromo} />

 <Route path={`${process.env.PUBLIC_URL}/Logout.html`} component={logOut} />


 <Route path={`${process.env.PUBLIC_URL}/lp/:id`} component={landingPage} />
 <Route path={`${process.env.PUBLIC_URL}/lp-offer/:id`} component={landingOfferPageForWeb} />



 <Route path={`${process.env.PUBLIC_URL}/offers.html`} component={offers} />


 <Route path={`${process.env.PUBLIC_URL}/membership.html`} component={Membership} />

 <Route path={`${process.env.PUBLIC_URL}/membership-monthly.html`} component={Membership_Monthly} />
 <Route path={`${process.env.PUBLIC_URL}/flash-membership.html`} component={FlashMembership} />
 <Route path={`${process.env.PUBLIC_URL}/refer-and-earn.html`} component={referEarn}/>
 {/* <Route path={`${process.env.PUBLIC_URL}/wallet.html`} component={wallet}/> */}

 <Route path={`${process.env.PUBLIC_URL}/about.html`} component={About} />
 <Route path={`${process.env.PUBLIC_URL}/career.html`} component={Career} />
 <Route path={`${process.env.PUBLIC_URL}/faq.html`} component={Faq} />
 <Route path={`${process.env.PUBLIC_URL}/faq_buyer.html`} component={FaqBuyer} />
 <Route path={`${process.env.PUBLIC_URL}/terms-and-condition.html`} component={TermCondition} />
 <Route path={`${process.env.PUBLIC_URL}/privacy-policy.html`} component={PrivacyPolicy} />
 <Route path={`${process.env.PUBLIC_URL}/media-release.html`} component={Media} />
 <Route path={`${process.env.PUBLIC_URL}/how-to-sell-fast.html`} component={SellFast} />
 <Route path={`${process.env.PUBLIC_URL}/product-listing-guidelines.html`} component={ProductListingGuidelines} />
 <Route path={`${process.env.PUBLIC_URL}/policies.html`} component={BeldaraPolicies} />
 <Route path={`${process.env.PUBLIC_URL}/warehouse-services.html`} component={BeldaraWarehouse} />
 <Route path={`${process.env.PUBLIC_URL}/beldara-first.html`} component={BeldaraFirst} />
 <Route path={`${process.env.PUBLIC_URL}/buy-now-on-beldara.html`} component={BuyOnBeldara} />
 <Route path={`${process.env.PUBLIC_URL}/banner-ads.html`} component={BannerAds} />
 <Route path={`${process.env.PUBLIC_URL}/promot-your-business.html`} component={PromoteBusiness} />
 <Route path={`${process.env.PUBLIC_URL}/stay-safe-on-beldara.html`} component={SafeOnBeldara} />
 <Route path={`${process.env.PUBLIC_URL}/product-listing-guideline.html`} component={ProductListingGuide} />
 <Route path={`${process.env.PUBLIC_URL}/product-listing-policy.html`} component={productPolicy} />
 <Route path={`${process.env.PUBLIC_URL}/beldara-logistics-services.html`} component={BeldaraLogisticServices} />
 <Route path={`${process.env.PUBLIC_URL}/thankyou.html`} component={ThankYou} />
 <Route path={`${process.env.PUBLIC_URL}/buy-leads.html`} component={BuyLead} />
 <Route path={`${process.env.PUBLIC_URL}/start-order/:id`} component={startOrder} />
 {/* <Route path={`${process.env.PUBLIC_URL}/start-order-test/:id`} component={startOrderTest} /> */}
 <Route path={`${process.env.PUBLIC_URL}/cart.html`} component={cartComponent} />
 <Route path={`${process.env.PUBLIC_URL}/cart-test.html`} component={cartTestComponent} />
 <Route path={`${process.env.PUBLIC_URL}/wishlist.html`} component={wishlist} />


 <Route path={`${process.env.PUBLIC_URL}/contact.html`} component={Contact} /> 
 <Route path={`${process.env.PUBLIC_URL}/post-requirement.html`} component={postRequirement} /> 
 {/* <Route path={`${process.env.PUBLIC_URL}/test.html`} component={Test} /> */}

 <Route path={`${process.env.PUBLIC_URL}/requirement_feedback.html`} component={reqFeedback} />
 <Route path={`${process.env.PUBLIC_URL}/requirement_comment.html`} component={reqFeedbackComment} />
 <Route path={`${process.env.PUBLIC_URL}/partner-with-us.html`} component={partnerWithUs} />
 <Route path={`${process.env.PUBLIC_URL}/check_out.html`} component={checkOut} />
 <Route path={`${process.env.PUBLIC_URL}/additional_data_req.html`} component={additonalDataReq} />


 <Route path={`${process.env.PUBLIC_URL}/auction(/)?(:id)?(.html)?`} component={auction} />
 <Route path={`${process.env.PUBLIC_URL}/auction-detail(/)?(:id)?(.html)?`} component={auctionDetail} />

 <Route exact path={`${process.env.PUBLIC_URL}/trade-show/:id`} component={activityDetails} />
 <Route path={`${process.env.PUBLIC_URL}/trade-show.html`} component={activity} />
 <Route exact path={`${process.env.PUBLIC_URL}/trade-show`} component={activity} />
 <Route path={`${process.env.PUBLIC_URL}/create-e-auction-online-on-beldara.html`} component={infoAuction} />
 <Route path={`${process.env.PUBLIC_URL}/auction-related/:id.html`} component={auctionRelated} />
 {/* <Route path={`${process.env.PUBLIC_URL}/dashboard`} component={Dashboard} /> */}
 <Route path={`${process.env.PUBLIC_URL}/cashback-offer.html`} component={startShopping} />
 <Route path={`${process.env.PUBLIC_URL}/processtranscation(/)?(:id)?`} component = {ProcessTranscation}/>
 <Route path={`${process.env.PUBLIC_URL}/test.html`} component={Test} />
 <Route path={`${process.env.PUBLIC_URL}/download-app.html`} component={Mobile} />
 <Route path={`${process.env.PUBLIC_URL}/return-policy.html`} component={ReturnPolicy} />
 
 <Route path={`${process.env.PUBLIC_URL}/my-order.html`} component={myOrder} />

 <Route path={`${process.env.PUBLIC_URL}/feedback/:categoryname-:id.html`} component={feedbackQuestion} />
 </Layout>
 </Switch>
 </ScrollContext>
 </BrowserRouter>
 </IntlProvider>

 }
 </Provider>
 );
 }
 }

 ReactDOM.render(<Root />, document.getElementById('root'));

})()