(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{398:function(e,t,a){"use strict";a.r(t);var c=a(19),n=a(20),o=a(22),r=a(21),l=a(23),s=a(1),i=a.n(s),u=a(29),m=a(153),d=a(26),p=a(16),h=a(48),b=(a(162),Object(s.lazy)(function(){return Promise.all([a.e(3),a.e(58),a.e(84)]).then(a.bind(null,741))}));var y=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(r.a)(t).call(this,e))).state={limit:100,hasMoreItems:!0,products:[],activePage:15,isFetching:0},a}return Object(l.a)(t,e),Object(n.a)(t,[{key:"componentDidMount",value:function(){p.a.dispatch(Object(d.D)(this.props.cat_id,"1",""))}},{key:"componentDidUpdate",value:function(){window.scrollTo(1,0)}},{key:"checkImage",value:function(e){}},{key:"render",value:function(){var e=this,t=this.props,a=t.products,c=(t.addToCart,t.symbol);t.addToWishlist,t.addToCompare,t.totalCount;return i.a.createElement("div",null,i.a.createElement("div",{className:"product-wrapper-grid"},i.a.createElement("div",{className:""},this.props.products?i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"row"},i.a.createElement(s.Suspense,{fallback:i.a.createElement(h.a,null)},a.map(function(t,a){return t&&t.name&&i.a.createElement("div",{className:"col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-1",key:a},i.a.createElement(b,{product:t,symbol:c,checkImage:e.checkImage}))})))):i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-sm-12 text-center section-b-space mt-5 no-found"},i.a.createElement("img",{src:"".concat("","/assets/images/empty-search.jpg"),className:"img-fluid mb-4"}),i.a.createElement("h3",null,"Sorry! Couldn't find the product you were looking For!!!    "),i.a.createElement("p",null,"Please check if you have misspelt something or try searching with other words."),i.a.createElement(m.a,{to:"".concat("","/"),className:"btn btn-solid"},"continue shopping"))))))}}]),t}(s.Component);t.default=Object(u.connect)(function(e,t){return{products:e.productsByLP.productsByLP,cat_id1:t.cat_id,perPage:"50",symbol:e.data.symbol,currencyValue:e.currencyValue.currencyValue}})(y)}}]);
//# sourceMappingURL=15.4ff47e9a.chunk.js.map