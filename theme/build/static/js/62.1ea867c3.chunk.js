(window.webpackJsonp=window.webpackJsonp||[]).push([[62],{151:function(e,t,a){"use strict";var r=a(19),n=a(20),o=a(22),c=a(21),l=a(23),i=a(1),s=a.n(i),u=a(153),m=a(17),p=a(152),d=function(e){function t(){return Object(r.a)(this,t),Object(o.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(n.a)(t,[{key:"render",value:function(){var e=this.props,t=e.title,a=(e.parent,e.translate),r=e.metaTitle,n=e.metaDesc,o=e.metaKeyword;return s.a.createElement("div",{className:"breadcrumb-section py-1"},s.a.createElement(p.Helmet,null,s.a.createElement("title",null,r),s.a.createElement("meta",{name:"description",content:n}),s.a.createElement("meta",{name:"keyword",content:o})),s.a.createElement("div",{className:"container"},s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-6"},s.a.createElement("div",{className:"page-title"},s.a.createElement("h2",null,a(t)))),s.a.createElement("div",{className:"col-md-6"},s.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},s.a.createElement("ol",{className:"breadcrumb"},s.a.createElement("li",{className:"breadcrumb-item"},s.a.createElement(u.a,{to:"".concat("")},a("Home")))))))))}}]),t}(i.Component);t.a=Object(m.withTranslate)(d)},153:function(e,t,a){"use strict";var r=a(1),n=a.n(r),o=a(5),c=a.n(o),l=a(14),i=a.n(l),s=a(46),u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e};function m(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}var p=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},d=function(e){function t(){var a,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var n=arguments.length,o=Array(n),c=0;c<n;c++)o[c]=arguments[c];return a=r=m(this,e.call.apply(e,[this].concat(o))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!p(e)){e.preventDefault();var t=r.context.router.history,a=r.props,n=a.replace,o=a.to;n?t.replace(o):t.push(o)}},m(r,a)}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),a=e.innerRef,r=function(e,t){var a={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(a[r]=e[r]);return a}(e,["replace","to","innerRef"]);i()(this.context.router,"You should not use <Link> outside a <Router>"),i()(void 0!==t,'You must specify the "to" property');var o=this.context.router.history,c="string"===typeof t?Object(s.createLocation)(t,null,null,o.location):t,l=o.createHref(c);return n.a.createElement("a",u({},r,{onClick:this.handleClick,href:l,ref:a}))},t}(n.a.Component);d.propTypes={onClick:c.a.func,target:c.a.string,replace:c.a.bool,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired,innerRef:c.a.oneOfType([c.a.string,c.a.func])},d.defaultProps={replace:!1},d.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired,createHref:c.a.func.isRequired}).isRequired}).isRequired},t.a=d},154:function(e,t,a){},312:function(e,t,a){"use strict";var r=a(1),n=a.n(r),o=a(5),c=a.n(o),l=a(15),i=a.n(l),s=a(14),u=a.n(s),m=a(46),p=a(49),d=a.n(p),f={},h=0,b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return"/"===e?e:function(e){var t=e,a=f[t]||(f[t]={});if(a[e])return a[e];var r=d.a.compile(e);return h<1e4&&(a[e]=r,h++),r}(e)(t,{pretty:!0})},y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e};var v=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){u()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=Object(m.createLocation)(e.to),a=Object(m.createLocation)(this.props.to);Object(m.locationsAreEqual)(t,a)?i()(!1,"You tried to redirect to the same route you're currently on: \""+a.pathname+a.search+'"'):this.perform()},t.prototype.computeTo=function(e){var t=e.computedMatch,a=e.to;return t?"string"===typeof a?b(a,t.params):y({},a,{pathname:b(a.pathname,t.params)}):a},t.prototype.perform=function(){var e=this.context.router.history,t=this.props.push,a=this.computeTo(this.props);t?e.push(a):e.replace(a)},t.prototype.render=function(){return null},t}(n.a.Component);v.propTypes={computedMatch:c.a.object,push:c.a.bool,from:c.a.string,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired},v.defaultProps={push:!1},v.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired}).isRequired,staticContext:c.a.object}).isRequired};t.a=v},828:function(e,t,a){"use strict";a.r(t);var r=a(2),n=a.n(r),o=a(7);function c(e){throw new Error('"'+e+'" is read-only')}var l,i,s,u,m,p=a(19),d=a(20),f=a(22),h=a(21),b=a(23),y=a(1),v=a.n(y),E=a(312),g=a(151),N=a(9),j=a.n(N),w=a(6),O=a.n(w),C=a(10),k=a.n(C),x=a(0),R=a(163),T=a.n(R),P=(a(154),a(8)),q=a(17),S=a(29),_=function(e){function t(e){var a;Object(p.a)(this,t),(a=Object(f.a)(this,Object(h.a)(t).call(this,e))).handleSubmit=function(e){j()("#error").addClass("d-none"),e.preventDefault();var t=j()("#name").val(),r=j()("#email").val(),p=j()("#subject").val(),d=j()("#comment").val(),f=k.a.get("sellerid");if(void 0===t||""==t)return j()("#error").removeClass("d-none"),!1;if(void 0===p||""==p)return j()("#error").removeClass("d-none"),!1;if(void 0===d||""==d)return j()("#error").removeClass("d-none"),!1;if(void 0===r||""==r)return j()("#error").removeClass("d-none"),!1;if(!l)return j()("#error").removeClass("d-none"),!1;try{O.a.post("".concat(x.d,"/common/contactUs.php"),{name:t,email:r,subject:p,msg:d,plateform_type:"web",sellerid:f,mobile:i,country:s,countryid:u,country_name:m},{headers:{"Content-Type":"multipart/form-data"}}).then(function(){var e=Object(o.a)(n.a.mark(function e(t){return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a.setState({result:t.data.result.result,verify:1}),c("sellerid"),f=t.data.result.sellerid,e.next=4,Object(P.B)("mhinpbn",f,"365");case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){e.response})}catch(h){console.log("\ud83d\ude31 Axios request failed: ".concat(h))}},a.onChange=function(e,t,a,r){l=e,i=t,s=a.iso2,u=a.dialCode,m=a.name.replace(/ *\([^)]*\) */g,"")},a.state={result:0,verify:0,data:""};return a}return Object(b.a)(t,e),Object(d.a)(t,[{key:"componentWillMount",value:function(){var e=Object(o.a)(n.a.mark(function e(){var t,a,r,o=this;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=window.location.hostname,r=(r=t.split("beldara.com")[0]).replace(".",""),this.props.languageMaster.forEach(function(e){e.main_language.toLowerCase()==r.toLowerCase()&&(a=e.code)},this),""===a||void 0===a){e.next=9;break}return e.next=7,O.a.post("https://api.indiabigshop.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:a,pageid:"32789"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){o.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 7:e.next=11;break;case 9:return e.next=11,O.a.post("https://api.indiabigshop.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:"en",pageid:"32789"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){o.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 11:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props.translate;return v.a.createElement("div",null,1==this.state.result?v.a.createElement(E.a,{to:{pathname:"/thankYou.html",state:{otp:this.state.verify,type:3,error:0,otpCheck:1}}}):"",v.a.createElement(g.a,{title:"Contact us"}),v.a.createElement("section",{className:"bg-white contact-page section-b-space"},v.a.createElement("div",{className:"container"},v.a.createElement("div",{className:"row section-b-space"},v.a.createElement("div",{className:"col-lg-12"},v.a.createElement("div",{className:"contact-right"},v.a.createElement("ul",null,v.a.createElement("li",null,v.a.createElement("div",{className:"contact-icon"},v.a.createElement("img",{src:"".concat("","/assets/images/icon/phone.png"),alt:"Generic placeholder image"}),v.a.createElement("h6",null,e("Contact Us"))),v.a.createElement("div",{className:"media-body"},v.a.createElement("p",null,"+91 9555788833"))),v.a.createElement("li",null,v.a.createElement("div",{className:"contact-icon"},v.a.createElement("i",{className:"fa fa-map-marker","aria-hidden":"true"}),v.a.createElement("h6",null,"Address")),v.a.createElement("div",{className:"media-body"},v.a.createElement("p",null,"5014-5015-5016,1 Aerocity, Andheri - Kurla Rd Safed Pool Shivaji Nagar, Jarimari, Saki Naka, Mumbai, Maharashtra - 400072, INDIA"),v.a.createElement("p",null,"163 E, Nelson Circle, Olathe, Kansas, 66061, USA"))),v.a.createElement("li",null,v.a.createElement("div",{className:"contact-icon"},v.a.createElement("img",{src:"".concat("","/assets/images/icon/email.png"),alt:"Generic placeholder image"}),v.a.createElement("h6",null,"Address")),v.a.createElement("div",{className:"media-body"},v.a.createElement("p",null,"support@beldara.com"))))))),v.a.createElement("div",{className:"row"},v.a.createElement("div",{className:"col-sm-12"},v.a.createElement("div",{id:"error",className:" col-12 alert alert-danger d-none"},e("Please enter valid data to continue")),v.a.createElement("form",{className:"theme-form",onSubmit:this.handleSubmit},v.a.createElement("div",{className:"form-row"},v.a.createElement("div",{className:"has-float-label col-md-6"},v.a.createElement("input",{type:"text",className:"form-control",id:"name",placeholder:" ",required:""}),v.a.createElement("label",{htmlFor:"name"},e("Name"))),v.a.createElement("div",{className:"has-float-label col-md-6"},v.a.createElement("input",{type:"email",className:"form-control",id:"email",placeholder:" ",autoComplete:"off",required:""}),v.a.createElement("label",{htmlFor:"email"},e("Enter your email"))),v.a.createElement("div",{className:"has-float-label col-md-6"},v.a.createElement(T.a,{containerClassName:"intl-tel-input",inputClassName:"form-control",geoIpLookup:"true",fieldId:"mobile",fieldName:"mobile",numberType:"MOBILE",onPhoneNumberChange:this.onChange,onPhoneNumberBlur:this.change,defaultCountry:"".concat("in"),defaultValue:i,telInputProps:this.InputProps}),v.a.createElement("label",{htmlFor:"mobile"},e("Mobile"))),v.a.createElement("div",{className:"has-float-label col-md-6 mt-4 mt-xs-4 mt-sm-4 mt-md-0"},v.a.createElement("input",{type:"text",className:"form-control",id:"subject",placeholder:" ",autoComplete:"off",required:""}),v.a.createElement("label",{htmlFor:"subject"},e("Subject"))),v.a.createElement("div",{className:"has-float-label col-md-12"},v.a.createElement("textarea",{className:"form-control",placeholder:" ",id:"comment",rows:"6",autoComplete:"off",required:""}),v.a.createElement("label",{htmlFor:"comment"},e("Write Your Message"))),v.a.createElement("div",{className:"col-md-12"},v.a.createElement("button",{className:"btn btn-solid",type:"submit"},e("Submit "))))))))))}}]),t}(y.Component);t.default=Object(q.withTranslate)(Object(S.connect)(function(e){return{languageMaster:e.languageMaster.languageMaster}})(_))}}]);
//# sourceMappingURL=62.1ea867c3.chunk.js.map