(window.webpackJsonp=window.webpackJsonp||[]).push([[74,111],{151:function(e,t,a){"use strict";var r=a(19),c=a(20),s=a(22),n=a(21),l=a(23),o=a(1),i=a.n(o),m=a(153),u=a(17),d=a(152),p=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(n.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props,t=e.title,a=(e.parent,e.translate),r=e.metaTitle,c=e.metaDesc,s=e.metaKeyword;return i.a.createElement("div",{className:"breadcrumb-section py-1"},i.a.createElement(d.Helmet,null,i.a.createElement("title",null,r),i.a.createElement("meta",{name:"description",content:c}),i.a.createElement("meta",{name:"keyword",content:s})),i.a.createElement("div",{className:"container"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-6"},i.a.createElement("div",{className:"page-title"},i.a.createElement("h2",null,a(t)))),i.a.createElement("div",{className:"col-md-6"},i.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},i.a.createElement("ol",{className:"breadcrumb"},i.a.createElement("li",{className:"breadcrumb-item"},i.a.createElement(m.a,{to:"".concat("")},a("Home")))))))))}}]),t}(o.Component);t.a=Object(u.withTranslate)(p)},153:function(e,t,a){"use strict";var r=a(1),c=a.n(r),s=a(5),n=a.n(s),l=a(14),o=a.n(l),i=a(46),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e};function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}var d=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},p=function(e){function t(){var a,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var c=arguments.length,s=Array(c),n=0;n<c;n++)s[n]=arguments[n];return a=r=u(this,e.call.apply(e,[this].concat(s))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!d(e)){e.preventDefault();var t=r.context.router.history,a=r.props,c=a.replace,s=a.to;c?t.replace(s):t.push(s)}},u(r,a)}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),a=e.innerRef,r=function(e,t){var a={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(a[r]=e[r]);return a}(e,["replace","to","innerRef"]);o()(this.context.router,"You should not use <Link> outside a <Router>"),o()(void 0!==t,'You must specify the "to" property');var s=this.context.router.history,n="string"===typeof t?Object(i.createLocation)(t,null,null,s.location):t,l=s.createHref(n);return c.a.createElement("a",m({},r,{onClick:this.handleClick,href:l,ref:a}))},t}(c.a.Component);p.propTypes={onClick:n.a.func,target:n.a.string,replace:n.a.bool,to:n.a.oneOfType([n.a.string,n.a.object]).isRequired,innerRef:n.a.oneOfType([n.a.string,n.a.func])},p.defaultProps={replace:!1},p.contextTypes={router:n.a.shape({history:n.a.shape({push:n.a.func.isRequired,replace:n.a.func.isRequired,createHref:n.a.func.isRequired}).isRequired}).isRequired},t.a=p},248:function(e,t,a){"use strict";a.r(t);var r=a(19),c=a(20),s=a(22),n=a(21),l=a(23),o=a(1),i=a.n(o),m=a(170),u=a.n(m),d=a(160),p=a.n(d),h=a(249),f=a(8),y=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(n.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=Object(f.s)("country_code");if(-1==navigator.userAgent.indexOf("Speed Insights")){if("1"==this.props.type){u.a.initialize({gtmId:"GTM-5HBBK96",events:{send_to:"AW-803807171"}})}else{if(-1!=window.location.href.indexOf("/auction-related/")){u.a.initialize({gtmId:"GTM-K3NHFD2",events:{send_to:"AW-803807171/WJMKCJvOm8ABEMO_pP8C"}})}u.a.initialize({gtmId:"GTM-5HBBK96",events:{send_to:"AW-803807171/IHhPCKqLwYgBEMO_pP8C",value:"replace with value",items:[{id:"replace with value",location_id:"replace with value",google_business_vertical:"retail"}]}})}var t={em:"support@beldara.com"},a={autoConfig:!0,debug:!1};Object(f.s)("country_code")&&void 0!==Object(f.s)("country_code")&&null!==Object(f.s)("country_code")&&(e=Object(f.s)("country_code")),p.a.init("2231476330510319",t,a),"in"==e.toLowerCase()?p.a.init("432564874336633",t,a):p.a.init("432219770935494",t,a),p.a.pageView(),h.a.initialize("UA-57225000-1"),h.a.pageview(window.location.pathname+window.location.search)}}},{key:"render",value:function(){return i.a.createElement("div",null)}}]),t}(o.Component);t.default=y},266:function(e,t,a){"use strict";a.r(t);var r=a(2),c=a.n(r),s=a(7),n=a(19),l=a(20),o=a(22),i=a(21),m=a(23),u=a(1),d=a.n(u),p=a(151),h=a(9),f=a.n(h),y=a(6),E=a.n(y),v=a(10),b=a.n(v),N=(a(8),a(0)),g=a(45),w=a(248),k=function(e){function t(){var e;return Object(n.a)(this,t),(e=Object(o.a)(this,Object(i.a)(t).call(this))).checkOtp=function(t){f()("#submit_otp").text("Please wait..."),t.preventDefault();var a=f()("#otp").val(),r=b.a.get("sellerid");try{E.a.post("".concat(N.d,"/common/otp_verify.php"),{otp:a,plateform_type:"",sellerid:r,type:"otp_verify_thank"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(t){f()("#submit_otp").text("Submit"),1==t.data.message?e.setState({otp:1}):e.setState({wrongOtp:1})}).catch(function(e){e.response})}catch(c){console.log("\ud83d\ude31 Axios request failed: ".concat(c))}},e.state={type:1,otp:1,otpCheck:1,error:0,wrongOtp:0,order_code:""},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=Object(s.a)(c.a.mark(function e(){var t,a;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=window.location.search,a=new URLSearchParams(t),console.log("else"),void 0===a.get("od")){e.next=6;break}return e.next=6,this.setState({order_code:a.get("od")});case 6:if(!a.get("o")){e.next=12;break}return console.log("ooooooo"),e.next=10,this.setState({otp:a.get("o"),type:a.get("type"),otpCheck:a.get("v"),error:a.get("e"),wrongOtp:a.get("e")});case 10:e.next=21;break;case 12:return console.log("else"),e.prev=13,e.next=16,this.setState({otp:this.props.location.state.otp,type:this.props.location.state.type,error:this.props.location.state.error,otpCheck:this.props.location.state.otpCheck});case 16:e.next=21;break;case 18:e.prev=18,e.t0=e.catch(13),console.log("Could not load File: ".concat(e.t0));case 21:case"end":return e.stop()}},e,this,[[13,18]])}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return d.a.createElement("div",null,0==this.state.error?d.a.createElement(d.a.Fragment,null,d.a.createElement(p.a,{title:"Thank You"}),d.a.createElement("div",{className:"container"},d.a.createElement("div",{className:"row justify-content-md-center my-4 text-left "},d.a.createElement("div",{className:"col-md-8 col-12 col-sm-12"},0==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Your Payment is successful"),d.a.createElement("div",{className:"text-muted"},"You have successfully bought this lead. We have sent to confirmation on your registered email ",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," To See more detail about this lead go to ",d.a.createElement("a",{href:"".concat(N.cb,"/my-inquiries.html")},"My Inquiries")," "),d.a.createElement("a",{className:"btn btn-success",href:"".concat(N.cb,"/my-inquiries.html")},"View my Inquiries")):1==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement(w.default,{type:"1"}),d.a.createElement("h3",null,"Your Request is submitted succesfully"),d.a.createElement("div",{className:"text-muted "},"We have processed your request on product(s) we will help you to reach out to many verified Sellers ",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," You can search more products depending upon your needs. To see more details please go to ",d.a.createElement("a",{href:"".concat(N.cb,"/my-requirements.html")},"My Requirements")," "),d.a.createElement("a",{className:"btn btn-success",href:"".concat(N.cb,"/my-requirements.html")},"View my requirements")):3==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Your Request is submitted succesfully"),d.a.createElement("div",{className:"text-muted "},"We will go through your request and our team will reach out to you in sometime. ",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," You can view all our tickets in ",d.a.createElement("a",{href:"".concat(N.cb,"/support-ticket.html")},"View support ticket")," "),d.a.createElement("a",{className:"btn btn-success",href:"".concat(N.cb,"/support-ticket.html")},"View support ticket")):5==this.state.type?d.a.createElement("div",{className:"alert alert-danger p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Your Payment is unsuccesful!"),d.a.createElement("div",{className:"text-muted "},"We could not process your payment. Please try again later.",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," If you facing any issues please raise a ticket and our team will reach out to you. ",d.a.createElement("a",{href:"".concat(N.cb,"/support-ticket.html")},"Support ticket")," "),d.a.createElement("a",{className:"btn btn-success",href:"".concat(N.cb,"/support-ticket.html")},"Raise a ticket")):6==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Thank you!"),d.a.createElement("div",{className:"text-muted "},"Your feedback is recorded successfully.",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," Have more requirements, please ",d.a.createElement("a",{href:"".concat(N.fb,"/post-requirement.html")},"post your requirement"),". "),d.a.createElement("a",{className:"btn btn-success",href:"".concat(N.fb,"/post-requirement.html")},"Post Your Requirement")):7==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Thank you!"),d.a.createElement("div",{className:"text-muted "},"Your feedback is recorded successfully.",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," Have more products to sell, please list your products. "),d.a.createElement("a",{className:"btn btn-success",href:"".concat(N.cb,"/add-product.html")},"Add Products")):2==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Your Payment is succesful!"),d.a.createElement("div",{className:"text-muted "},"We have sent to confirmation on your registered email.",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," If you are facing any issues please raise a ticket and our team will reach out to you. ",d.a.createElement("a",{href:"".concat(N.cb,"/support-ticket.html")},"Support ticket")," "),d.a.createElement("div",{className:"justify-content-around"},d.a.createElement("a",{className:"btn btn-success float-left",href:"".concat(N.cb,"/support-ticket.html")},"Raise a ticket"),d.a.createElement("a",{className:"btn btn-md float-right text-white",href:"".concat(N.cb,"/my_purchase.html?order=").concat(this.state.order_code),target:"_blank",style:{backgroundColor:"#f5821e"}},"Go to order"))):8==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Thank you!"),d.a.createElement("div",{className:"text-muted "}," Your request is recorded successfully. ",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," Our Team will get back to you soon! ")):9==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Thank you!"),d.a.createElement("div",{className:"text-muted "}," Your request is recorded successfully. ",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," Our Team will get back to you soon! You can find your auction ",d.a.createElement("a",{href:"/auction.html"},"here"))):10==this.state.type?d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Thank you!"),d.a.createElement("div",{className:"text-muted "}," Your request is recorded successfully. ",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," Your Auction will be available ",d.a.createElement("a",{href:"/auction.html"},"here")," as soon as it gets approved.")):d.a.createElement("div",{className:"alert alert-success p-5 shadow-sm rounded"},d.a.createElement("h3",null,"Your Payment is successful"),d.a.createElement("div",{className:"text-muted "},"You have succesfully purchase Package. We have sent to confirmation on your registered email ",d.a.createElement("i",{className:"far fa-smile ml-1"})," "),d.a.createElement("div",{className:"text-muted "}," You will find all you need to increase your bussiness in your ",d.a.createElement("a",{href:"".concat(N.cb)},"Dashboard")),d.a.createElement("a",{className:"btn btn-success",href:"".concat(N.cb)},"Go To Dashboard")),0==this.state.otp?d.a.createElement(d.a.Fragment,null,1==this.state.otpCheck?d.a.createElement("div",{className:"alert alert-warning p-md-5 p-sm-3 shadow-sm rounded"},d.a.createElement("h5",{className:"alert-heading"},d.a.createElement("i",{className:"fa fa-check-circle"})," You're One step away"),d.a.createElement("div",{className:"text-muted font-weight-light"},"We have processed your request on product(s).Before that you need to verfiy your requirement.   "),d.a.createElement("div",{className:"text-muted font-weight-light"},"We have sent OTP mobile/email,Please enter OTP below.   "),d.a.createElement("br",null),d.a.createElement("div",{className:"container p-0"},d.a.createElement("form",{id:"info_form",onSubmit:this.checkOtp},1==this.state.wrongOtp?d.a.createElement("div",{className:"col-12 col-md-8 text-center"},d.a.createElement("div",{className:"alert alert-danger"},"Please enter correct Otp to proceed")):"",d.a.createElement("div",{className:"col-md-4 col-sm-6"},d.a.createElement("div",{className:"has-float-label my-3"},d.a.createElement("input",{type:"tel",value:this.state.value,maxLength:"60",pattern:".{4}",className:"form-control",onKeyPress:this.checkNumber,maxlength:"4",placeholder:" ",required:!0,autoFocus:!0,autoComplete:"off",id:"otp"}),d.a.createElement("label",{htmlFor:"otp"},"Enter OTP"))),d.a.createElement("div",{className:"col-12 col-md-5"},d.a.createElement("button",{id:"submit_otp",className:"btn btn-warning px-3"},"Submit"))))):""):""),d.a.createElement("div",{className:"col-4 d-none d-sm-none d-md-block"},d.a.createElement("a",{href:"https://limray.com"},d.a.createElement("img",{src:"".concat(g.c,"/images/limrayad1.png"),alt:"Limray Beldara.com"})),d.a.createElement("a",{href:"https://worksena.com"},d.a.createElement("img",{src:"".concat(g.c,"/images/worksenaad.png"),alt:"Worksena Beldara.com"})))))):d.a.createElement("div",null))}}]),t}(u.Component);t.default=k}}]);
//# sourceMappingURL=74.bacffd92.chunk.js.map