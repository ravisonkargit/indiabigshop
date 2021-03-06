(window.webpackJsonp=window.webpackJsonp||[]).push([[77],{151:function(e,t,a){"use strict";var n=a(19),r=a(20),o=a(22),i=a(21),l=a(23),c=a(1),s=a.n(c),u=a(153),p=a(17),m=a(152),d=function(e){function t(){return Object(n.a)(this,t),Object(o.a)(this,Object(i.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props,t=e.title,a=e.parent,n=e.translate,r=e.metaTitle,o=e.metaDesc,i=e.metaKeyword;return s.a.createElement("div",{className:"breadcrumb-section py-1"},s.a.createElement(m.Helmet,null,s.a.createElement("title",null,r),s.a.createElement("meta",{name:"description",content:o}),s.a.createElement("meta",{name:"keyword",content:i})),s.a.createElement("div",{className:"container"},s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-6"},s.a.createElement("div",{className:"page-title"},s.a.createElement("h2",null,n(t)))),s.a.createElement("div",{className:"col-md-6"},s.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},s.a.createElement("ol",{className:"breadcrumb"},s.a.createElement("li",{className:"breadcrumb-item"},s.a.createElement(u.a,{to:"".concat("")},n("Home"))),a?s.a.createElement("li",{className:"breadcrumb-item","aria-current":"page"},n(a)):"",s.a.createElement("li",{className:"breadcrumb-item active","aria-current":"page"},n(t))))))))}}]),t}(c.Component);t.a=Object(p.withTranslate)(d)},153:function(e,t,a){"use strict";var n=a(1),r=a.n(n),o=a(5),i=a.n(o),l=a(14),c=a.n(l),s=a(46),u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e};function p(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}var m=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},d=function(e){function t(){var a,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var r=arguments.length,o=Array(r),i=0;i<r;i++)o[i]=arguments[i];return a=n=p(this,e.call.apply(e,[this].concat(o))),n.handleClick=function(e){if(n.props.onClick&&n.props.onClick(e),!e.defaultPrevented&&0===e.button&&!n.props.target&&!m(e)){e.preventDefault();var t=n.context.router.history,a=n.props,r=a.replace,o=a.to;r?t.replace(o):t.push(o)}},p(n,a)}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),a=e.innerRef,n=function(e,t){var a={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(a[n]=e[n]);return a}(e,["replace","to","innerRef"]);c()(this.context.router,"You should not use <Link> outside a <Router>"),c()(void 0!==t,'You must specify the "to" property');var o=this.context.router.history,i="string"===typeof t?Object(s.createLocation)(t,null,null,o.location):t,l=o.createHref(i);return r.a.createElement("a",u({},n,{onClick:this.handleClick,href:l,ref:a}))},t}(r.a.Component);d.propTypes={onClick:i.a.func,target:i.a.string,replace:i.a.bool,to:i.a.oneOfType([i.a.string,i.a.object]).isRequired,innerRef:i.a.oneOfType([i.a.string,i.a.func])},d.defaultProps={replace:!1},d.contextTypes={router:i.a.shape({history:i.a.shape({push:i.a.func.isRequired,replace:i.a.func.isRequired,createHref:i.a.func.isRequired}).isRequired}).isRequired},t.a=d},278:function(e,t,a){"use strict";var n=a(1),r=a.n(n);function o(e){return(o="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function c(e,t,a){return t&&l(e.prototype,t),a&&l(e,a),e}function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function p(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},n=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),n.forEach(function(t){s(e,t,a[t])})}return e}function m(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function y(e,t){return!t||"object"!==typeof t&&"function"!==typeof t?h(e):t}var b={display:"inline-block",borderRadius:"50%",border:"5px double white",width:30,height:30},v={empty:p({},b,{backgroundColor:"#ccc"}),full:p({},b,{backgroundColor:"black"}),placeholder:p({},b,{backgroundColor:"red"})},g=function(e){return r.a.isValidElement(e)?e:"object"===o(e)&&null!==e?r.a.createElement("span",{style:e}):"[object String]"===Object.prototype.toString.call(e)?r.a.createElement("span",{className:e}):void 0},E=function(e){function t(){return i(this,t),y(this,d(t).apply(this,arguments))}return m(t,r.a.PureComponent),c(t,[{key:"render",value:function(){var e,t=this.props,a=t.index,n=t.inactiveIcon,o=t.activeIcon,i=t.percent,l=t.direction,c=t.readonly,u=t.onClick,p=t.onMouseMove,m=g(n),d=g(o),f=(s(e={display:"inline-block",position:"absolute",overflow:"hidden",top:0},"rtl"===l?"right":"left",0),s(e,"width","".concat(i,"%")),e),h={cursor:c?"inherit":"pointer",display:"inline-block",position:"relative"};function y(e){p&&p(a,e)}function b(e){u&&(e.preventDefault(),u(a,e))}return r.a.createElement("span",{style:h,onClick:b,onMouseMove:y,onTouchMove:y,onTouchEnd:b},m,r.a.createElement("span",{style:f},d))}}]),t}(),w=function(e){function t(e){var a;return i(this,t),(a=y(this,d(t).call(this,e))).state={displayValue:a.props.value,interacting:!1},a.onMouseLeave=a.onMouseLeave.bind(h(h(a))),a.symbolMouseMove=a.symbolMouseMove.bind(h(h(a))),a.symbolClick=a.symbolClick.bind(h(h(a))),a}return m(t,r.a.PureComponent),c(t,[{key:"componentWillReceiveProps",value:function(e){var t=this.props.value!==e.value;this.setState(function(a){return{displayValue:t?e.value:a.displayValue}})}},{key:"componentDidUpdate",value:function(e,t){if(e.value===this.props.value)return t.interacting&&!this.state.interacting?this.props.onHover():void(this.state.interacting&&this.props.onHover(this.state.displayValue))}},{key:"symbolClick",value:function(e,t){var a=this.calculateDisplayValue(e,t);this.props.onClick(a,t)}},{key:"symbolMouseMove",value:function(e,t){var a=this.calculateDisplayValue(e,t);this.setState({interacting:!this.props.readonly,displayValue:a})}},{key:"onMouseLeave",value:function(){this.setState({displayValue:this.props.value,interacting:!1})}},{key:"calculateDisplayValue",value:function(e,t){var a=this.calculateHoverPercentage(t),n=Math.ceil(a%1*this.props.fractions)/this.props.fractions,r=Math.pow(10,3),o=e+(Math.floor(a)+Math.floor(n*r)/r);return o>0?o>this.props.totalSymbols?this.props.totalSymbols:o:1/this.props.fractions}},{key:"calculateHoverPercentage",value:function(e){var t=e.nativeEvent.type.indexOf("touch")>-1?e.nativeEvent.type.indexOf("touchend")>-1?e.changedTouches[0].clientX:e.touches[0].clientX:e.clientX,a=e.target.getBoundingClientRect(),n="rtl"===this.props.direction?a.right-t:t-a.left;return n<0?0:n/a.width}},{key:"render",value:function(){var e,t=this.props,a=t.readonly,n=t.quiet,o=t.totalSymbols,i=t.value,l=t.placeholderValue,c=t.direction,s=t.emptySymbol,m=t.fullSymbol,d=t.placeholderSymbol,f=t.className,h=t.id,y=t.style,b=t.tabIndex,v=this.state,g=v.displayValue,w=v.interacting,k=[],O=[].concat(s),j=[].concat(m),S=[].concat(d),C=0!==l&&0===i&&!w;e=C?l:n?i:g;for(var N=Math.floor(e),x=0;x<o;x++){var M=void 0;M=x-N<0?100:x-N===0?100*(e-x):0,k.push(r.a.createElement(E,u({key:x,index:x,readonly:a,inactiveIcon:O[x%O.length],activeIcon:C?S[x%j.length]:j[x%j.length],percent:M,direction:c},!a&&{onClick:this.symbolClick,onMouseMove:this.symbolMouseMove,onTouchMove:this.symbolMouseMove,onTouchEnd:this.symbolClick})))}return r.a.createElement("span",u({id:h,style:p({},y,{display:"inline-block",direction:c}),className:f,tabIndex:b,"aria-label":this.props["aria-label"]},!a&&{onMouseLeave:this.onMouseLeave}),k)}}]),t}();function k(){}k._name="react_rating_noop";var O=function(e){function t(e){var a;return i(this,t),(a=y(this,d(t).call(this,e))).state={value:e.initialRating},a.handleClick=a.handleClick.bind(h(h(a))),a.handleHover=a.handleHover.bind(h(h(a))),a}return m(t,r.a.PureComponent),c(t,[{key:"componentWillReceiveProps",value:function(e){this.setState({value:e.initialRating})}},{key:"handleClick",value:function(e,t){var a=this,n=this.translateDisplayValueToValue(e);this.props.onClick(n),this.state.value!==n&&this.setState({value:n},function(){return a.props.onChange(a.state.value)})}},{key:"handleHover",value:function(e){var t=void 0===e?e:this.translateDisplayValueToValue(e);this.props.onHover(t)}},{key:"translateDisplayValueToValue",value:function(e){var t=e*this.props.step+this.props.start;return t===this.props.start?t+1/this.props.fractions:t}},{key:"tranlateValueToDisplayValue",value:function(e){return void 0===e?0:(e-this.props.start)/this.props.step}},{key:"render",value:function(){var e=this.props,t=e.step,a=e.emptySymbol,n=e.fullSymbol,o=e.placeholderSymbol,i=e.readonly,l=e.quiet,c=e.fractions,s=e.direction,u=e.start,p=e.stop,m=e.id,d=e.className,f=e.style,h=e.tabIndex;return r.a.createElement(w,{id:m,style:f,className:d,tabIndex:h,"aria-label":this.props["aria-label"],totalSymbols:function(e,t,a){return Math.floor((t-e)/a)}(u,p,t),value:this.tranlateValueToDisplayValue(this.state.value),placeholderValue:this.tranlateValueToDisplayValue(this.props.placeholderRating),readonly:i,quiet:l,fractions:c,direction:s,emptySymbol:a,fullSymbol:n,placeholderSymbol:o,onClick:this.handleClick,onHover:this.handleHover})}}]),t}();O.defaultProps={start:0,stop:5,step:1,readonly:!1,quiet:!1,fractions:1,direction:"ltr",onHover:k,onClick:k,onChange:k,emptySymbol:v.empty,fullSymbol:v.full,placeholderSymbol:v.placeholder},t.a=O},756:function(e,t,a){"use strict";a.r(t);var n,r=a(2),o=a.n(r),i=a(7),l=a(19),c=a(20),s=a(22),u=a(21),p=a(23),m=a(1),d=a.n(m),f=a(8),h=a.n(f),y=a(10),b=a.n(y),v=a(17),g=a(146),E=(a(151),a(278)),w=a(6),k=a.n(w),O=a(0),j=a(45),S=a(152),C=a(153),N=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).updateReview=function(e){Math.round(e)>1&&(e=e.replace("0","")),a.setState({initialRating:e}),n=e},a.componentDidMount=Object(i.a)(o.a.mark(function e(){var t,n,r,l;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=window.location.pathname,n=(n=t.split("/rating/")[1]).split(".html")[0],r=n.split("-"),l=r[r.length-1],e.prev=5,!a.props.location.state){e.next=11;break}return e.next=9,a.setState({name:a.props.location.state.item.name,url:a.props.location.state.item.url,productid:a.props.location.state.item.id,img:a.props.location.state.item.img});case 9:e.next=12;break;case 11:k.a.post("https://api.beldara.com/common/fetch_single_prod.php",{security_token:"",plateform_type:"",url:l},{headers:{"Content-Type":"multipart/form-data"}}).then(function(){var e=Object(i.a)(o.a.mark(function e(t){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.setState({name:t.data.result.name,url:t.data.result.url,productid:t.data.result.id,img:t.data.result.img});case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){var t=e.response;return Promise.reject(t)});case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(5),k.a.post("https://api.beldara.com/common/fetch_single_prod.php",{security_token:"",plateform_type:"",url:l},{headers:{"Content-Type":"multipart/form-data"}}).then(function(){var e=Object(i.a)(o.a.mark(function e(t){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.setState({name:t.data.result.name,url:t.data.result.url,productid:t.data.result.id,img:t.data.result.img});case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){var t=e.response;return Promise.reject(t)});case 17:case"end":return e.stop()}},e,null,[[5,14]])})),a.handleSubmit=function(e){h()("#error").addClass("d-none"),e.preventDefault();var t=h()("#review").val(),r=h()("#subject").val();if(!(t&&n&&r))return h()("#error").removeClass("d-none"),!1;try{k.a.post("".concat(O.d,"/common/add_review.php"),{sellerid:b.a.get("sellerid"),productid:a.state.productid,rating:n,subject:r,plateform_type:"",security_token:"",review:t},{headers:{"Content-Type":"multipart/form-data"}}).then(function(){var e=Object(i.a)(o.a.mark(function e(t){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a.setState({reviewSubmitted:t.data.statusId});case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){e.response})}catch(l){console.log("\ud83d\ude31 Axios request failed: ".concat(l))}},a.state={initialRating:0,reviewSubmitted:0,name:"",url:"",productid:"",img:""},a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props.translate,t=this.state,a=t.name,n=t.url,r=t.img;return d.a.createElement("div",{className:"container"},d.a.createElement("div",{className:"breadcrumb-section py-1"},d.a.createElement(S.Helmet,null,d.a.createElement("title",null,"".concat(a," on beldara.com"),"   "),d.a.createElement("meta",{name:"description",content:"".concat(a," on beldara.com")}),d.a.createElement("meta",{name:"keyword",content:"".concat(a," on beldara.com")})),d.a.createElement("div",{className:"container"},d.a.createElement("div",{className:"row"},d.a.createElement("div",{className:"col-md-12"},d.a.createElement("div",{className:"page-title"},d.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},d.a.createElement("ol",{className:"breadcrumb"},d.a.createElement("li",{className:"breadcrumb-item small"},d.a.createElement(C.a,{to:"".concat("")},e("Home"))),d.a.createElement("li",{className:"breadcrumb-item small text-truncate","aria-current":"page"},d.a.createElement(C.a,{target:"_blank",to:"".concat("","/product/").concat(n,".html")},a)),d.a.createElement("li",{className:"breadcrumb-item active small d-none","aria-current":"page"},"Review")))))))),d.a.createElement("div",{className:"row justify-content-center"},d.a.createElement("div",{className:"col-md-6"},"1"==this.state.reviewSubmitted?d.a.createElement("div",{className:"alert alert-success"},d.a.createElement("h3",null,"Review submitted - Thank you!")," ",d.a.createElement("div",null,"We\u2019re processing your review. This may take several days, so we appreciate your patience. We\u2019ll notify you when this is complete.")):d.a.createElement(d.a.Fragment,null,d.a.createElement("div",{id:"error",className:"alert alert-danger d-none"},"Please enter Valid Information to continue"),d.a.createElement("form",{className:"theme-form",onSubmit:this.handleSubmit},d.a.createElement("h4",null,"Creating Review"),d.a.createElement("div",{className:"d-flex border-top"},d.a.createElement("img",{src:"".concat(j.c,"/product_images_small/").concat(r)}),d.a.createElement("h5",{className:"ml-5"},a," ")),d.a.createElement("div",{className:"form-row"},d.a.createElement("div",{className:"col-md-12 my-3"},d.a.createElement("span",null,"Write A Review"),d.a.createElement("div",{className:"text-warning userRating",onClick:this.getRating},d.a.createElement(E.a,{initialRating:this.state.initialRating,start:"0",stop:"5",step:"1",fractions:"2",emptySymbol:["fa fa-star-o fa-2x medium","fa fa-star-o fa-2x medium","fa fa-star-o fa-2x medium","fa fa-star-o fa-2x medium","fa fa-star-o fa-2x medium"],fullSymbol:["fa fa-star fa-2x medium","fa fa-star fa-2x medium","fa fa-star fa-2x medium","fa fa-star fa-2x medium","fa fa-star fa-2x medium"],onChange:this.updateReview}))),d.a.createElement("div",{className:"has-float-label col-md-12 my-3"},d.a.createElement("input",{type:"text",className:"form-control",id:"subject",placeholder:" ",autoComplete:"off",required:""}),d.a.createElement("label",{htmlFor:"subject"},e("Subject"))),d.a.createElement("div",{className:"has-float-label col-md-12 my-3"},d.a.createElement("textarea",{className:"form-control",placeholder:" ",id:"review",rows:"6",autoComplete:"off",required:""}),d.a.createElement("label",{htmlFor:"review"},e("Write Your Message"))),d.a.createElement("div",{className:"col-md-12"},d.a.createElement("button",{className:"btn btn-solid",type:"submit"},e("Submit ")))))))))}}]),t}(m.Component);t.default=Object(g.a)(Object(v.withTranslate)(N))}}]);
//# sourceMappingURL=77.57d780c0.chunk.js.map