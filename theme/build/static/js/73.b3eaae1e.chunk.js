(window.webpackJsonp=window.webpackJsonp||[]).push([[73],{151:function(e,t,a){"use strict";var n=a(19),r=a(20),c=a(22),o=a(21),i=a(23),s=a(1),l=a.n(s),u=a(153),p=a(17),m=a(152),d=function(e){function t(){return Object(n.a)(this,t),Object(c.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props,t=e.title,a=e.parent,n=e.translate,r=e.metaTitle,c=e.metaDesc,o=e.metaKeyword;return l.a.createElement("div",{className:"breadcrumb-section py-1"},l.a.createElement(m.Helmet,null,l.a.createElement("title",null,r),l.a.createElement("meta",{name:"description",content:c}),l.a.createElement("meta",{name:"keyword",content:o})),l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col-md-6"},l.a.createElement("div",{className:"page-title"},l.a.createElement("h2",null,n(t)))),l.a.createElement("div",{className:"col-md-6"},l.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},l.a.createElement("ol",{className:"breadcrumb"},l.a.createElement("li",{className:"breadcrumb-item"},l.a.createElement(u.a,{to:"".concat("")},n("Home"))),a?l.a.createElement("li",{className:"breadcrumb-item","aria-current":"page"},n(a)):"",l.a.createElement("li",{className:"breadcrumb-item active","aria-current":"page"},n(t))))))))}}]),t}(s.Component);t.a=Object(p.withTranslate)(d)},153:function(e,t,a){"use strict";var n=a(1),r=a.n(n),c=a(5),o=a.n(c),i=a(14),s=a.n(i),l=a(46),u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e};function p(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}var m=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},d=function(e){function t(){var a,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var r=arguments.length,c=Array(r),o=0;o<r;o++)c[o]=arguments[o];return a=n=p(this,e.call.apply(e,[this].concat(c))),n.handleClick=function(e){if(n.props.onClick&&n.props.onClick(e),!e.defaultPrevented&&0===e.button&&!n.props.target&&!m(e)){e.preventDefault();var t=n.context.router.history,a=n.props,r=a.replace,c=a.to;r?t.replace(c):t.push(c)}},p(n,a)}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),a=e.innerRef,n=function(e,t){var a={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(a[n]=e[n]);return a}(e,["replace","to","innerRef"]);s()(this.context.router,"You should not use <Link> outside a <Router>"),s()(void 0!==t,'You must specify the "to" property');var c=this.context.router.history,o="string"===typeof t?Object(l.createLocation)(t,null,null,c.location):t,i=c.createHref(o);return r.a.createElement("a",u({},n,{onClick:this.handleClick,href:i,ref:a}))},t}(r.a.Component);d.propTypes={onClick:o.a.func,target:o.a.string,replace:o.a.bool,to:o.a.oneOfType([o.a.string,o.a.object]).isRequired,innerRef:o.a.oneOfType([o.a.string,o.a.func])},d.defaultProps={replace:!1},d.contextTypes={router:o.a.shape({history:o.a.shape({push:o.a.func.isRequired,replace:o.a.func.isRequired,createHref:o.a.func.isRequired}).isRequired}).isRequired},t.a=d},523:function(e,t,a){},767:function(e,t,a){"use strict";a.r(t);var n,r,c=a(2),o=a.n(c),i=a(7),s=a(19),l=a(20),u=a(22),p=a(21),m=a(23),d=a(1),f=a.n(d),h=a(151),b=a(6),y=a.n(b),v=a(29),E=(a(523),function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(u.a)(this,Object(p.a)(t).call(this))).state={data:""},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentWillMount",value:function(){var e=Object(i.a)(o.a.mark(function e(){var t,a=this;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=window.location.hostname,n=(n=t.split("beldara.com")[0]).replace(".",""),this.props.languageMaster.forEach(function(e){e.main_language.toLowerCase()==n.toLowerCase()&&(r=e.code)},this),""===r||void 0===r){e.next=9;break}return e.next=7,y.a.post("https://api.beldara.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:r,pageid:"5"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){a.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 7:e.next=11;break;case 9:return e.next=11,y.a.post("https://api.beldara.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:"en",pageid:"5"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){a.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 11:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.data,t=e.head,a=e.content;return f.a.createElement("div",null,"/app-terms-and-condition.html"!==this.props.location.pathname?f.a.createElement(h.a,{title:"Terms & Conditions",metaDesc:this.state.data.desc1,metaKeyword:this.state.data.keyword,metaTitle:this.state.data.title}):"",f.a.createElement("section",{className:"faq-section section-b-space"},f.a.createElement("div",{className:"container"},f.a.createElement("div",{className:"row"},f.a.createElement("div",{className:"col-12  mb--sm"},f.a.createElement("div",{className:"card"},f.a.createElement("div",{className:"card-header"},f.a.createElement("h2",null,t)),f.a.createElement("div",{className:"input-layout1 card-body post-ad-page",dangerouslySetInnerHTML:{__html:a}})))))))}}]),t}(d.Component));t.default=Object(v.connect)(function(e){return{languageMaster:e.languageMaster.languageMaster}})(E)}}]);
//# sourceMappingURL=73.b3eaae1e.chunk.js.map