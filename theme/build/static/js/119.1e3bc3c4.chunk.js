(window.webpackJsonp=window.webpackJsonp||[]).push([[119],{757:function(e,t,a){"use strict";a.r(t);var c=a(2),n=a.n(c),r=a(7),s=a(19),i=a(20),l=a(22),o=a(21),m=a(23),p=a(1),d=a.n(p),u=a(29),h=(a(152),a(10)),y=a.n(h),v=a(6),w=a.n(v),f=a(4),E=(a(45),a(16)),N=a(26);var _=Object(f.a)(function(){return Promise.all([a.e(19),a.e(23)]).then(a.bind(null,456)).then(function(e){return e.default})}),g=function(e){function t(){var e,a;Object(s.a)(this,t);for(var c=arguments.length,n=new Array(c),r=0;r<c;r++)n[r]=arguments[r];return(a=Object(l.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(n)))).state={layoutColumns:3,query:"",catBanner:"",catName:"",catDesc:"",imgExist:1,datatype:""},a.imgError=function(){a.setState({imgExist:0})},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"LayoutViewClicked",value:function(e){this.setState({layoutColumns:e})}},{key:"componentDidMount",value:function(){var e=this;try{var t="",a=function(e){var t=e.lastIndexOf("/")+1,a=e.substr(t).split(".")[0];return a=a.replace(/(#|\?).*?$/,"")}(window.location.pathname).split("/").pop().replace(".html","").split("-").splice(-1)[0];if(isNaN(a)){t=window.location.pathname.split("/").pop();w.a.post("https://api.indiabigshop.com/common/get_lp_detail.php",{url:t,sellerid:y.a.get("sellerid"),security_token:"",plateform_type:""},{headers:{"Content-Type":"multipart/form-data"}}).then(function(){var t=Object(r.a)(n.a.mark(function t(a){return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.setState({catBanner:a.data.result.page_img,catName:a.data.result.page_name,catDesc:a.data.result.desc1,cat_id:a.data.result.cat_id,keyword:a.data.result.keyword,is_search_by_keyword:a.data.result.is_search_by_keyword,type:"1"});case 2:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()).catch(function(e){var t=e.response;return Promise.reject(t)})}else{var c=(t=window.location.pathname.split("/").pop().replace(".html","")).slice(0,t.length-3),s=window.location.search,i=new URLSearchParams(s).get("type");this.setState({cat_id:a,catName:c,type:"2",datatype:i})}}catch(l){console.log("\ud83d\ude31 Axios request failed: ".concat(l))}E.a.dispatch(Object(N.p)())}},{key:"render",value:function(){return d.a.createElement(d.a.Fragment,null,d.a.createElement("section",{className:"section-b-space py-0"},d.a.createElement("div",{className:"collection-wrapper"},d.a.createElement("div",{className:"container"},d.a.createElement("div",{className:"row"},d.a.createElement("div",{className:"collection-content col"},d.a.createElement("div",{className:"page-main-content"},d.a.createElement("div",{className:"container-fluid"},d.a.createElement("div",{className:"row"},d.a.createElement("div",{className:"col-sm-12"},d.a.createElement("div",{className:"top-banner-wrapper text-center"},1==this.state.imgExist?d.a.createElement("img",{src:"".concat(this.state.catBanner),className:"img-fluid",alt:this.state.catName,onError:this.imgError}):"",d.a.createElement("div",{className:"top-banner-content small-section text-left"},d.a.createElement("h4",null,this.state.catName.split("/").pop().replace("-21","")))),d.a.createElement("div",{className:"collection-product-wrapper"},d.a.createElement("div",{id:"toast_message",role:"alert","aria-live":"assertive","aria-atomic":"true",className:"toast toast_pull_right fade hide"},d.a.createElement("div",{className:"toast-body"},d.a.createElement("i",{className:"fas fa-check"})," Product Added To Wishlist")),d.a.createElement("div",{className:"product-wrapper-grid"},d.a.createElement("div",{className:"container p-0"},d.a.createElement("div",{className:"row"},d.a.createElement("div",{className:"col-12 p-0"},this.state.cat_id?d.a.createElement(_,{colSize:this.state.layoutColumns,cat_id:this.state.cat_id,type:this.state.type,datatype:this.state.datatype,is_search_by_keyword:this.state.is_search_by_keyword}):"")))))))))))))))}}]),t}(p.Component);t.default=Object(u.connect)(function(e){return{Banner:e.data.categoryBanner}})(g)}}]);
//# sourceMappingURL=119.1e3bc3c4.chunk.js.map