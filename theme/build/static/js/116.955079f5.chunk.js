(window.webpackJsonp=window.webpackJsonp||[]).push([[116],{787:function(e,t,a){"use strict";a.r(t);var n=a(2),c=a.n(n),r=a(7),s=a(19),i=a(20),l=a(22),o=a(21),m=a(23),d=a(1),u=a.n(d),p=a(29),h=(a(152),a(10),a(6)),v=a.n(h),E=a(4),f=(a(45),a(16)),N=a(26),w=Object(E.a)(function(){return Promise.all([a.e(12),a.e(15)]).then(a.bind(null,398)).then(function(e){return e.default})}),y=function(e){function t(){var e,a;Object(s.a)(this,t);for(var n=arguments.length,c=new Array(n),r=0;r<n;r++)c[r]=arguments[r];return(a=Object(l.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(c)))).state={layoutColumns:3,query:"",catBanner:"",catName:"",catDesc:"",imgExist:1},a.imgError=function(){a.setState({imgExist:0})},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"LayoutViewClicked",value:function(e){this.setState({layoutColumns:e})}},{key:"componentDidMount",value:function(){var e=this;try{var t=window.location.pathname.split("-").pop().split(".");v.a.post("https://api.indiabigshop.com/common/get_new_arrival.php",{type:this.props.match.params.type,cat_id:t[0],security_token:"",plateform_type:""},{headers:{"Content-Type":"multipart/form-data"}}).then(function(){var t=Object(r.a)(c.a.mark(function t(a){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.setState({catBanner:a.data.result.page_img,catName:a.data.result.page_name,catDesc:a.data.result.desc1,cat_id:a.data.result.cat_id,keyword:a.data.result.keyword});case 2:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()).catch(function(e){var t=e.response;return Promise.reject(t)}),console.log(this.state.cat_id)}catch(a){console.log("\ud83d\ude31 Axios request failed: ".concat(a))}f.a.dispatch(Object(N.p)())}},{key:"render",value:function(){return u.a.createElement(u.a.Fragment,null,u.a.createElement("section",{className:"section-b-space py-0"},u.a.createElement("div",{className:"collection-wrapper"},u.a.createElement("div",{className:"container"},u.a.createElement("div",{className:"row"},u.a.createElement("div",{className:"collection-content col"},u.a.createElement("div",{className:"page-main-content"},u.a.createElement("div",{className:"container-fluid"},u.a.createElement("div",{className:"row"},u.a.createElement("div",{className:"col-sm-12"},u.a.createElement("div",{className:"top-banner-wrapper text-center"},1==this.state.imgExist?u.a.createElement("img",{src:"".concat(this.state.catBanner),className:"img-fluid",alt:this.state.catName,onError:this.imgError}):"",u.a.createElement("div",{className:"top-banner-content small-section text-left"},u.a.createElement("h4",null,this.state.catName))),u.a.createElement("div",{className:"collection-product-wrapper"},u.a.createElement("div",{id:"toast_message",role:"alert","aria-live":"assertive","aria-atomic":"true",className:"toast toast_pull_right fade hide"},u.a.createElement("div",{className:"toast-body"},u.a.createElement("i",{className:"fas fa-check"})," Product Added To Wishlist")),u.a.createElement("div",{className:"product-wrapper-grid"},u.a.createElement("div",{className:"container p-0"},u.a.createElement("div",{className:"row"},u.a.createElement("div",{className:"col-12 p-0"},this.state.cat_id?u.a.createElement(w,{colSize:this.state.layoutColumns,cat_id:this.state.cat_id}):"")))))))))))))))}}]),t}(d.Component);t.default=Object(p.connect)(function(e){return{Banner:e.data.categoryBanner}})(y)}}]);
//# sourceMappingURL=116.955079f5.chunk.js.map