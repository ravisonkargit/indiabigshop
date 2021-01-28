(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{151:function(e,t,a){"use strict";var n=a(19),r=a(20),c=a(22),l=a(21),i=a(23),s=a(1),o=a.n(s),m=a(153),d=a(17),u=a(152),p=function(e){function t(){return Object(n.a)(this,t),Object(c.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props,t=e.title,a=e.parent,n=e.translate,r=e.metaTitle,c=e.metaDesc,l=e.metaKeyword;return o.a.createElement("div",{className:"breadcrumb-section py-1"},o.a.createElement(u.Helmet,null,o.a.createElement("title",null,r),o.a.createElement("meta",{name:"description",content:c}),o.a.createElement("meta",{name:"keyword",content:l})),o.a.createElement("div",{className:"container"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-6"},o.a.createElement("div",{className:"page-title"},o.a.createElement("h2",null,n(t)))),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},o.a.createElement("ol",{className:"breadcrumb"},o.a.createElement("li",{className:"breadcrumb-item"},o.a.createElement(m.a,{to:"".concat("")},n("Home"))),a?o.a.createElement("li",{className:"breadcrumb-item","aria-current":"page"},n(a)):"",o.a.createElement("li",{className:"breadcrumb-item active","aria-current":"page"},n(t))))))))}}]),t}(s.Component);t.a=Object(d.withTranslate)(p)},153:function(e,t,a){"use strict";var n=a(1),r=a.n(n),c=a(5),l=a.n(c),i=a(14),s=a.n(i),o=a(46),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e};function d(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}var u=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},p=function(e){function t(){var a,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var r=arguments.length,c=Array(r),l=0;l<r;l++)c[l]=arguments[l];return a=n=d(this,e.call.apply(e,[this].concat(c))),n.handleClick=function(e){if(n.props.onClick&&n.props.onClick(e),!e.defaultPrevented&&0===e.button&&!n.props.target&&!u(e)){e.preventDefault();var t=n.context.router.history,a=n.props,r=a.replace,c=a.to;r?t.replace(c):t.push(c)}},d(n,a)}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),a=e.innerRef,n=function(e,t){var a={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(a[n]=e[n]);return a}(e,["replace","to","innerRef"]);s()(this.context.router,"You should not use <Link> outside a <Router>"),s()(void 0!==t,'You must specify the "to" property');var c=this.context.router.history,l="string"===typeof t?Object(o.createLocation)(t,null,null,c.location):t,i=c.createHref(l);return r.a.createElement("a",m({},n,{onClick:this.handleClick,href:i,ref:a}))},t}(r.a.Component);p.propTypes={onClick:l.a.func,target:l.a.string,replace:l.a.bool,to:l.a.oneOfType([l.a.string,l.a.object]).isRequired,innerRef:l.a.oneOfType([l.a.string,l.a.func])},p.defaultProps={replace:!1},p.contextTypes={router:l.a.shape({history:l.a.shape({push:l.a.func.isRequired,replace:l.a.func.isRequired,createHref:l.a.func.isRequired}).isRequired}).isRequired},t.a=p},373:function(e,t,a){},822:function(e,t,a){"use strict";a.r(t);var n,r,c=a(2),l=a.n(c),i=a(7),s=a(19),o=a(20),m=a(22),d=a(21),u=a(23),p=a(1),f=a.n(p),v=a(151),h=(a(373),a(26)),b=a(29),g=a(45),y=a(161),E=function(e){function t(){return Object(s.a)(this,t),Object(m.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){this.props.getAllMediaRelease()}},{key:"render",value:function(){return f.a.createElement("div",{className:"row py-5"},this.props.mediaRelease.map(function(e){return 0==e.isDelete?f.a.createElement("div",{key:e.id,className:"col-md-3 my-2"},f.a.createElement("a",{href:e.link,rel:"nofollow",target:"_blank"},y.isMobile?f.a.createElement("div",{className:"card media_wrapper_mobile"},f.a.createElement("div",{className:"card-body d-flex justify-content-center align-items-center p-0"},f.a.createElement("img",{className:"media_img img-class1",src:"".concat(g.c,"/press/").concat(e.img),alt:e.alt}))):f.a.createElement("div",{className:"card media_wrapper"},f.a.createElement("div",{className:"card-body d-flex justify-content-center align-items-center p-0"},f.a.createElement("img",{className:"media_img img-class1",src:"".concat(g.c,"/press/").concat(e.img),alt:e.alt}))))):""}))}}]),t}(p.Component),w=Object(b.connect)(function(e){return e.mediaRelease},{getAllMediaRelease:h.t})(E),N=a(8),j=a.n(N),k=function(e){function t(){var e,a;Object(s.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(m.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(r)))).videoLoader=function(e,t){var a=e.target.id;j()(".modal-title").html("On Channel "+j()("#"+a).attr("data-channel")),j()("#video").attr("src",j()("#"+a).attr("data-video")+"?autoplay=1&amp;modestbranding=1&amp;showinfo=0")},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){this.props.getAllMediapr()}},{key:"componentDidMount",value:function(){console.log("componentDidMount"),j()("#closed").click(function(){j()("#video").attr("src","")})}},{key:"render",value:function(){var e=this;return f.a.createElement("div",{className:"row"},this.props.mediapr.map(function(t){return f.a.createElement("div",{key:t.id,className:"col-lg-4 col-sm-6 mb-4"},f.a.createElement("div",{className:"card shadow border-0 h-100"},f.a.createElement("img",{"data-toggle":"modal",id:"media_ad".concat(t.id),onClick:function(t){return e.videoLoader(t,e)},"data-target":"#exampleModalCenter","data-channel":t.channel,"data-video":t.videofile,src:g.c+"/press/"+t.imagefile,alt:t.title,className:"videoWrapper img-fluid card-img-top cursor img-class w-100"}),f.a.createElement("div",{className:"card-body"},f.a.createElement("a",{className:"text-dark cursor","data-toggle":"modal","data-target":"#exampleModalCenter","data-channel":t.channel,"data-video":t.videofile},t.channel),f.a.createElement("h5",{className:"my-2"},f.a.createElement("a",{className:"text-dark cursor","data-toggle":"modal","data-target":"#exampleModalCenter","data-channel":t.channel,"data-video":t.videofile},t.title)),f.a.createElement("p",{className:"text-gray-500 text-sm my-3"},f.a.createElement("i",{className:"far fa-clock mr-2"}),t.date),f.a.createElement("p",{className:"my-2 text-muted text-sm"},t.description))))}),f.a.createElement("div",{className:"modal fade",id:"exampleModalCenter",tabIndex:"-1",role:"dialog","aria-labelledby":"exampleModalCenterTitle","aria-hidden":"true"},f.a.createElement("div",{className:"modal-dialog modal-lg modal-dialog-centered m-auto",role:"document"},f.a.createElement("div",{className:"modal-content"},f.a.createElement("div",{className:"modal-header"},f.a.createElement("h5",{className:"modal-title",id:"exampleModalCenterTitle"},"Modal title"),f.a.createElement("button",{id:"closed",type:"button",className:"close","data-dismiss":"modal","aria-label":"Close"},f.a.createElement("span",{"aria-hidden":"true"},"\xd7"))),f.a.createElement("div",{className:"modal-body"},f.a.createElement("div",{id:"iframe_wrapper",className:"embed-responsive embed-responsive-16by9"},f.a.createElement("iframe",{className:"embed-responsive-item onload",src:"",id:"video",allowscriptaccess:"always",allow:"autoplay"},f.a.createElement("img",{id:"iframe_before_load",src:"".concat(g.c,"/images/iframe_loader.gif")}))))))))}}]),t}(p.Component),O=Object(b.connect)(function(e){return e.mediapr},{getAllMediapr:h.u})(k),x=a(6),M=a.n(x),C=a(9),_="MediaReleaseScreenShort",R=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).componentDidMount=Object(i.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(C.s)(_).then(function(){var e=Object(i.a)(l.a.mark(function e(t){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,null==t||""==t){e.next=5;break}if(1!=t.statusId&&"1"!=t.statusId){e.next=5;break}return e.next=5,a.setState({data:t.result[0]});case 5:e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log("\ud83d\ude31 Axios request failed: ".concat(e.t0));case 10:case"end":return e.stop()}},e,null,[[0,7]])}));return function(t){return e.apply(this,arguments)}}());case 2:case"end":return e.stop()}},e)})),a.state={data:[],statusId:""},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){this.props.getAllMediaRelease()}},{key:"render",value:function(){return f.a.createElement("div",{className:"row py-2"},this.state.data&&this.state.data.map(function(e){return""!=e.img&&null!=e.img?f.a.createElement("div",{key:e.id,className:"col-md-12 my-2"},f.a.createElement("a",{href:e.link,rel:"nofollow",target:"_blank"},f.a.createElement("div",{className:"card media_wrapper1"},f.a.createElement("div",{className:"card-body d-flex justify-content-center align-items-center p-0"},f.a.createElement("img",{className:"media_img img-class2 w-100 h-100",src:e.img,alt:e.alt}))))):""}))}}]),t}(p.Component),S=(Object(b.connect)(function(e){return e.MediaScreenshot},{getAllMediaRelease:h.t})(R),"MediaReleaseScreenShort"),T=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).componentDidMount=Object(i.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(C.s)(S).then(function(){var e=Object(i.a)(l.a.mark(function e(t){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,null==t||""==t){e.next=5;break}if(1!=t.statusId&&"1"!=t.statusId){e.next=5;break}return e.next=5,a.setState({data:t.result[1]});case 5:e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log("\ud83d\ude31 Axios request failed: ".concat(e.t0));case 10:case"end":return e.stop()}},e,null,[[0,7]])}));return function(t){return e.apply(this,arguments)}}());case 2:case"end":return e.stop()}},e)})),a.state={data:[],statusId:""},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){this.props.getAllMediaRelease()}},{key:"render",value:function(){return f.a.createElement("div",{className:"row py-2"},this.state.data&&this.state.data.map(function(e){return""!=e.img&&null!=e.img?f.a.createElement("div",{key:e.id,className:"col-md-12 my-2"},f.a.createElement("div",{className:"card media_wrapper1"},f.a.createElement("div",{className:"card-body d-flex justify-content-center align-items-center p-0"},f.a.createElement("img",{className:"media_img img-class2 w-100 h-100",src:e.img,alt:e.alt})))):""}))}}]),t}(p.Component),A=(Object(b.connect)(function(e){return e.MediaScreenshotwithoutlink},{getAllMediaRelease:h.t})(T),function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).selectMedia=function(e){var t=document.getElementsByClassName("nav-link");a.setState({mediareleaseview:e.target.id}),0==a.state.mediareleaseview?(t[1].classList.add("active"),t[0].classList.remove("active")):(t[0].classList.add("active"),t[1].classList.remove("active"))},a.state={mediareleaseview:0,data:""},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){var e=Object(i.a)(l.a.mark(function e(){var t,a=this;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=window.location.hostname,n=(n=t.split("beldara.com")[0]).replace(".",""),this.props.languageMaster.forEach(function(e){e.main_language.toLowerCase()==n.toLowerCase()&&(r=e.code)},this),""===r||void 0===r){e.next=9;break}return e.next=7,M.a.post("https://api.beldara.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:r,pageid:"32790"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){a.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 7:e.next=11;break;case 9:return e.next=11,M.a.post("https://api.beldara.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:"en",pageid:"32790"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){a.setState({data:e.data.result})}).catch(function(e){var t=e.response;return Promise.reject(t)});case 11:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e;return e=0==this.state.mediareleaseview?f.a.createElement(w,null):f.a.createElement(O,null),f.a.createElement("div",null,f.a.createElement(v.a,{title:"Media Release",metaDesc:this.state.data.desc1,metaKeyword:this.state.data.keyword,metaTitle:this.state.data.title}),f.a.createElement("section",{className:"faq-section section-b-space"},f.a.createElement("div",{className:"breadcrumb bg-white"},f.a.createElement("img",{src:"".concat("","/assets/images/new-announcement-banner.jpg"),alt:"newsroom Beldara",className:"w-100"})),f.a.createElement("div",{className:"d-flex justify-content-center media_tab"},f.a.createElement("ul",{className:"nav nav-pills mb-3",id:"pills-tab",role:"tablist"},f.a.createElement("li",{className:"nav-item"},f.a.createElement("span",{className:"nav-link active nav-link-custom iphone5SE cursor font-nav",id:"0",onClick:this.selectMedia},"Press Release")),f.a.createElement("li",{className:"nav-item"},f.a.createElement("span",{className:"nav-link nav-link-custom iphone5SE cursor font-nav",id:"1",onClick:this.selectMedia},"Tv Ad")))),f.a.createElement("div",{className:"container"},f.a.createElement("div",{className:"row"},e))))}}]),t}(p.Component));t.default=Object(b.connect)(function(e){return{languageMaster:e.languageMaster.languageMaster}})(A)}}]);
//# sourceMappingURL=71.3129db97.chunk.js.map