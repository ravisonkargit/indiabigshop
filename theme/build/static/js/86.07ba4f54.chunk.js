(window.webpackJsonp=window.webpackJsonp||[]).push([[86],{151:function(e,t,a){"use strict";var n=a(19),r=a(20),o=a(22),l=a(21),i=a(23),s=a(1),c=a.n(s),u=a(153),m=a(17),d=a(152),p=function(e){function t(){return Object(n.a)(this,t),Object(o.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props,t=e.title,a=(e.parent,e.translate),n=e.metaTitle,r=e.metaDesc,o=e.metaKeyword;return c.a.createElement("div",{className:"breadcrumb-section py-1"},c.a.createElement(d.Helmet,null,c.a.createElement("title",null,n),c.a.createElement("meta",{name:"description",content:r}),c.a.createElement("meta",{name:"keyword",content:o})),c.a.createElement("div",{className:"container"},c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col-md-6"},c.a.createElement("div",{className:"page-title"},c.a.createElement("h2",null,a(t)))),c.a.createElement("div",{className:"col-md-6"},c.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},c.a.createElement("ol",{className:"breadcrumb"},c.a.createElement("li",{className:"breadcrumb-item"},c.a.createElement(u.a,{to:"".concat("")},a("Home")))))))))}}]),t}(s.Component);t.a=Object(m.withTranslate)(p)},153:function(e,t,a){"use strict";var n=a(1),r=a.n(n),o=a(5),l=a.n(o),i=a(14),s=a.n(i),c=a(46),u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e};function m(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}var d=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},p=function(e){function t(){var a,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var r=arguments.length,o=Array(r),l=0;l<r;l++)o[l]=arguments[l];return a=n=m(this,e.call.apply(e,[this].concat(o))),n.handleClick=function(e){if(n.props.onClick&&n.props.onClick(e),!e.defaultPrevented&&0===e.button&&!n.props.target&&!d(e)){e.preventDefault();var t=n.context.router.history,a=n.props,r=a.replace,o=a.to;r?t.replace(o):t.push(o)}},m(n,a)}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),a=e.innerRef,n=function(e,t){var a={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(a[n]=e[n]);return a}(e,["replace","to","innerRef"]);s()(this.context.router,"You should not use <Link> outside a <Router>"),s()(void 0!==t,'You must specify the "to" property');var o=this.context.router.history,l="string"===typeof t?Object(c.createLocation)(t,null,null,o.location):t,i=o.createHref(l);return r.a.createElement("a",u({},n,{onClick:this.handleClick,href:i,ref:a}))},t}(r.a.Component);p.propTypes={onClick:l.a.func,target:l.a.string,replace:l.a.bool,to:l.a.oneOfType([l.a.string,l.a.object]).isRequired,innerRef:l.a.oneOfType([l.a.string,l.a.func])},p.defaultProps={replace:!1},p.contextTypes={router:l.a.shape({history:l.a.shape({push:l.a.func.isRequired,replace:l.a.func.isRequired,createHref:l.a.func.isRequired}).isRequired}).isRequired},t.a=p},771:function(e,t,a){"use strict";a.r(t);var n,r,o=a(2),l=a.n(o),i=a(7),s=a(19),c=a(20),u=a(22),m=a(21),d=a(23),p=a(1),h=a.n(p),y=a(151),b=a(6),f=a.n(b),E=a(29),v=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(u.a)(this,Object(m.a)(t).call(this))).state={data:""},e}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentWillMount",value:function(){var e=Object(i.a)(l.a.mark(function e(){var t,a=this;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=window.location.hostname,n=(n=t.split("beldara.com")[0]).replace(".",""),this.props.languageMaster.forEach(function(e){e.main_language.toLowerCase()==n.toLowerCase()&&(r=e.code)},this),""===r||void 0===r){e.next=9;break}return e.next=7,f.a.post("https://api.indiabigshop.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:r,pageid:"32812"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){a.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 7:e.next=11;break;case 9:return e.next=11,f.a.post("https://api.indiabigshop.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:"en",pageid:"32812"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){a.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 11:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.data,t=e.title,a=e.head,n=(e.content,e.desc1),r=e.keyword;return h.a.createElement("div",null,"/app-policies.html"!==this.props.location.pathname?h.a.createElement(y.a,{title:"Privacy Policies",metaTitle:t,metaDesc:n,metaKeyword:r}):"",h.a.createElement("section",{className:"faq-section section-b-space"},h.a.createElement("div",{className:"container"},h.a.createElement("div",{className:"row"},h.a.createElement("div",{className:"col-12  mb--sm"},h.a.createElement("div",{className:"card"},h.a.createElement("div",{className:"card-header"},h.a.createElement("h2",null,a)),h.a.createElement("div",{className:"container"},h.a.createElement("p",null,"\u201cIndiabigshop.com\u201d is a trademark of PMK E-commerce Pvt Ltd.",h.a.createElement("br",null),h.a.createElement("br",null)," (\u201cCompany\u201d), a company incorporated under the Companies Act, with its registered and corporate office at Mumbai 400072, in the course of its business.",h.a.createElement("br",null),h.a.createElement("br",null),h.a.createElement("br",null),h.a.createElement("br",null),"The domain name Indiabigshop.com is owned by the Company.",h.a.createElement("br",null),h.a.createElement("br",null),"The Company respects your privacy and values the trust you place in it. ",h.a.createElement("br",null),h.a.createElement("br",null),"Set out below is the Company\u2019s \u2018Privacy Policy which details how information relating to you is collected, used, and disclosed.",h.a.createElement("br",null),h.a.createElement("br",null),"Customers are advised to read and understand our Privacy Policy carefully, as by accessing the website/app you agree to be bound by the terms and conditions of the Privacy Policy and consent to the collection, storage, and use of information relating to you as provided herein.",h.a.createElement("br",null),h.a.createElement("br",null),"If you do not agree with the terms and conditions of our Privacy Policy, including the manner of collection or use of your information, please do not use or access the website/app.",h.a.createElement("br",null),h.a.createElement("br",null),"Our Privacy Policy is incorporated into the Terms and Conditions of Use of the website/app and is subject to change from time to time without notice.",h.a.createElement("br",null),h.a.createElement("br",null)," It is strongly recommended that you periodically review our Privacy Policy as posted on the App/Web.",h.a.createElement("br",null),h.a.createElement("br",null),"Should you have any clarifications regarding this Privacy Policy, please do not hesitate to contact us at support@Indiabigshop.com."),h.a.createElement("h4",null,"The collection, Storage and Use of Information Related to You"),h.a.createElement("p",null,"The collection, Storage and Use of Information Related to You We may automatically track certain information about you based upon your behavior on the website.",h.a.createElement("br",null),h.a.createElement("br",null)," We use this information to do internal research on our users\u2019 demographics, interests, and behavior to better understand, protect and serve our users.",h.a.createElement("br",null),h.a.createElement("br",null)," This information is compiled and analyzed on an aggregated basis.",h.a.createElement("br",null)," ",h.a.createElement("br",null),"This information may include the URL that you just came from (whether this URL is on the website or not), which URL you next go to (whether this URL is on the website or not), your computer browser information, your IP address, and other information associated with your interaction with the website.",h.a.createElement("br",null),h.a.createElement("br",null)," We may also share your Mobile IP/Device IP with a third party(ies) and to the best of our knowledge, be-life, and representations given to us by these third party(ies) this information is not stored by them.",h.a.createElement("br",null),h.a.createElement("br",null),"We also collect and store personal information provided by you from time to time on the website/app. ",h.a.createElement("br",null),h.a.createElement("br",null),"We only collect and use such information from you that we consider necessary for achieving a seamless, efficient, and safe experience, customized to your needs",h.a.createElement("br",null),h.a.createElement("br",null)," including: To enable the provision of services opted for by you; To communicate necessary account and product/service related information from time to time; To allow you to receive quality customer care services; To undertake necessary fraud and money laundering prevention checks, and comply with the highest security standards; To comply with applicable laws, rules, and regulations; and To provide you with information and offers on products and services, on updates, on promotions, on related, affiliated, or associated service providers and partners, that we believe would be of interest to you.",h.a.createElement("br",null),h.a.createElement("br",null)),h.a.createElement("br",null),h.a.createElement("p",null,"Where any service requested by you involves a third party, such information as is reasonably necessary by the Company to carry out your service request may be shared with such third party.",h.a.createElement("br",null),h.a.createElement("br",null),"We also do use your contact information to send you offers based on your interests and prior activity.",h.a.createElement("br",null),h.a.createElement("br",null),"The Company may also use contact information internally to direct its efforts for product improvement, to contact you as a survey respondent, to notify you if you win any contest; and to send you promotional materials from its contest sponsors or advertisers.",h.a.createElement("br",null),h.a.createElement("br",null),h.a.createElement("br",null),h.a.createElement("br",null),"Contacts Permissions: If you allow Indiabigshop.com to access your contacts (including contact number, email id, etc.), it enables Indiabigshop.com to subscribe you and your contacts to Indiabigshop.com promotional emails, messages, ongoing offers, etc., and through this permission, you and your contacts will be able to access a variety of social features such as inviting your friends to try our app, send across referral links to your friends, etc. We may also use this information to make recommendations for the grocery items you placed.",h.a.createElement("br",null),h.a.createElement("br",null)," This information will be synced from your phone and stored on our servers.",h.a.createElement("br",null),h.a.createElement("br",null),"Further, you may from time to time choose to provide payment-related financial information (credit card, debit card, bank account details, billing address, etc.) on the website. We are committed to keeping all such sensitive data/information safe at all times and ensure that such data/information is only transacted over a secure website [of approved payment gateways which are digitally encrypted], and provide the highest possible degree of care available under the technology presently in use.",h.a.createElement("br",null),h.a.createElement("br",null),"The Company will not use your financial information for any purpose other than to complete a transaction with you.",h.a.createElement("br",null),h.a.createElement("br",null),"To the extent possible, we provide you the option of not divulging any specific information that you wish for us not to collect, store or use.",h.a.createElement("br",null),h.a.createElement("br",null)," You may also choose not to use a particular service or feature on the website/application, and opt-out of any non-essential communications from the Company.",h.a.createElement("br",null),h.a.createElement("br",null),"Further, transacting over the internet has inherent risks which can only be avoided by you following security practices yourself, such as not revealing account/login-related information to any other person and informing our customer care team about any suspicious activity or where your account has/may have been compromised.",h.a.createElement("br",null),h.a.createElement("br",null),"The company uses data collection devices such as \u201ccookies\u201d on certain pages of the website to help analyze our web page flow, measure promotional effectiveness, and promote trust and safety.",h.a.createElement("br",null),h.a.createElement("br",null)," \u201cCookies\u201d are small files placed on your hard drive that assist us in providing our services.",h.a.createElement("br",null),h.a.createElement("br",null)," The company offers certain features that are only available through the use of a \u201ccookie\u201d.",h.a.createElement("br",null),h.a.createElement("br",null),"The Company also uses cookies to allow you to enter your password less frequently during a session.",h.a.createElement("br",null),h.a.createElement("br",null)," Cookies can also help the Company provide information that is targeted to your interests.",h.a.createElement("br",null),h.a.createElement("br",null)," Most cookies are \u201csession cookies,\u201d meaning that they are automatically deleted from your hard drive at the end of a session.",h.a.createElement("br",null),h.a.createElement("br",null)," You are always free to decline our cookies if your browser permits, although in that case, you may not be able to use certain features on the website and you may be required to re-enter your password more frequently during a session.",h.a.createElement("br",null),h.a.createElement("br",null),"Additionally, you may encounter \u201ccookies\u201d or other similar devices on certain pages of the website that are placed by third parties.",h.a.createElement("br",null),h.a.createElement("br",null)," The Company does not control the use of cookies by third parties.",h.a.createElement("br",null),h.a.createElement("br",null),"If you send the Company personal correspondence, such as emails or letters, or if other users or third parties send us correspondence about your activities on the website, the Company may collect such information into a file specific to you.",h.a.createElement("br",null),h.a.createElement("br",null),"The Company does not retain any information collected for any longer than is reasonably considered necessary by us, or such period as may be required by applicable laws.",h.a.createElement("br",null),h.a.createElement("br",null)," The Company may be required to disclose any information that is lawfully sought from it by a judicial or other competent body under applicable laws.",h.a.createElement("br",null),h.a.createElement("br",null),"The website may contain links to other websites.",h.a.createElement("br",null),h.a.createElement("br",null)," We are not responsible for the privacy practices of such websites which we do not manage and control.",h.a.createElement("br",null),h.a.createElement("br",null)))))))))}}]),t}(p.Component);t.default=Object(E.connect)(function(e){return{languageMaster:e.languageMaster.languageMaster}})(v)}}]);
//# sourceMappingURL=86.07ba4f54.chunk.js.map