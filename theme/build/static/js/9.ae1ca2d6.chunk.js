(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{192:function(e,t,a){},222:function(e,t,a){"use strict";a.r(t);var r=a(2),c=a.n(r),n=a(7),o=a(19),i=a(20),s=a(22),l=a(21),u=a(23),d=a(47),p=a(1),m=a.n(p),f=a(153),_=a(45),b=a(146),h=a(17),y=(a(192),a(162),a(160)),v=a.n(y),E=a(8),g=a.n(E),k=(a(170),a(10)),O=a.n(k),x=a(9),j=a(6),C=a.n(j),w=a(29),N=a(26),A=a(16),I=(a(178),a(197),Object(p.lazy)(function(){return a.e(14).then(a.bind(null,198))})),q=Object(p.lazy)(function(){return a.e(7).then(a.bind(null,194))}),P=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(s.a)(this,Object(l.a)(t).call(this,e))).componentDidUpdate=function(){var e=Object(n.a)(c.a.mark(function e(t){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,t.currencyValue[0].INR==a.state.inrValue){e.next=4;break}return e.next=4,a.setState({inrValue:t.currencyValue[0].INR});case 4:e.next=10;break;case 6:return e.prev=6,e.t0=e.catch(0),e.next=10,a.setState({inrValue:70});case 10:case"end":return e.stop()}},e,null,[[0,6]])}));return function(t){return e.apply(this,arguments)}}(),a.CalcOfferPrice=function(e,t,r,c,n,o){return a.offerExist(n,o)&&t<=parseInt(r)&&t>=parseInt(c)?parseFloat(e):null},a.offerExist=function(e,t){if(void 0!==e&&null!==e&&""!==e&&void 0!==t&&null!==t&&""!==t){var a=new Date,r=a.getMonth()+1,c=a.getDate(),n=a.getFullYear()+"-"+r+"-"+c,o=e.split("-"),i=t.split("-"),s=n.split("-"),l=o[1]+","+o[2]+","+o[0],u=i[1]+","+i[2]+","+i[0],d=s[1]+","+s[2]+","+s[0];l=l.toString(),u=u.toString(),d=d.toString();var p=Date.parse(l),m=Date.parse(u),f=Date.parse(d);return f>=p&&m>=f}return!1},a.state={open:!1,stock:"InStock",quantity:1,image:"",inrValue:70,price:0},a.deadEnd=a.deadEnd.bind(Object(d.a)(Object(d.a)(a))),a.finalCost=a.finalCost.bind(Object(d.a)(Object(d.a)(a))),a.createCart=a.createCart.bind(Object(d.a)(Object(d.a)(a))),a.checkImageExist=a.checkImageExist.bind(Object(d.a)(Object(d.a)(a))),a.validate=a.validate.bind(Object(d.a)(Object(d.a)(a))),a.goToExpressCheckout=a.goToExpressCheckout.bind(Object(d.a)(Object(d.a)(a))),a.event_ask_for_price=a.event_ask_for_price.bind(Object(d.a)(Object(d.a)(a))),a.chatBtn=a.chatBtn.bind(Object(d.a)(Object(d.a)(a))),a}return Object(u.a)(t,e),Object(i.a)(t,[{key:"goToExpressCheckout",value:function(){var e=Object(n.a)(c.a.mark(function e(t,a,r,n){var o;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:o=this.state.price,"INR"!=r&&""!=r&&void 0!==r||(o=parseFloat(o)/70),o=o.toFixed(),v.a.trackCustom("AddToCart",{content_ids:[t],content_type:"product",value:this.state.price,currency:"USD"}),this.props.history.push({pathname:"/check_out.html",state:{totalprice:this.state.price,currency:this.props.symbol,product_seller:n,product_currency:r,prod_id:t,qty:a}});case 5:case"end":return e.stop()}},e,this)}));return function(t,a,r,c){return e.apply(this,arguments)}}()},{key:"onClickHandle",value:function(e){this.setState({image:e})}},{key:"checkImageExist",value:function(e){try{this.props.checkImage(e.target.id)}catch(t){console.log("error: ",t)}}},{key:"componentDidMount",value:function(e){var t={em:"support@beldara.com"},a={autoConfig:!0,debug:!1};v.a.init("432219770935494",t,a),v.a.init("2231476330510319",t,a);var r=g()("#toast_message").detach();g()(r).insertAfter(".breadcrumb-section")}},{key:"validate",value:function(e,t,a,r,c,n,o,i){Object(x.l)("Product",e,t,"click",O.a.get("sellerid"),Object(x.s)("mhinpbnb")),g()("#btn_"+t).css("opacity","0.6"),this.createCart(t,a,r,c,n,o,i)}},{key:"event_ask_for_price",value:function(e,t){Object(x.l)("Product",e,t,"click",O.a.get("sellerid"),Object(x.s)("mhinpbnb"))}},{key:"createCart",value:function(e,t,a,r,c,n,o){C.a.post("https://api.beldara.com/common/add_to_create_cart.php",{security_token:"",plateform_type:"",productid:e,qty:t,amount:a,currency:r,visitorid:Object(x.s)("mhinpbnb"),sellerid:O.a.get("sellerid"),country_to:Object(x.s)("countryid"),pincode:Object(x.s)("pincode")},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){window.location.href="/cart.html"}).catch(function(e){var t=e.response;return Promise.reject(t)})}},{key:"finalCost",value:function(){var e=Object(n.a)(c.a.mark(function e(t,a){var r;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=0,r=(r=t*a).toFixed(2),e.next=5,this.setState({price:r});case 5:case"end":return e.stop()}},e,this)}));return function(t,a){return e.apply(this,arguments)}}()},{key:"deadEnd",value:function(e){}},{key:"chatBtn",value:function(e){var t={sellerid:e.sellerid,chatWithSupplier:!0,company:e.company,item:e};A.a.dispatch(Object(N.A)(t))}},{key:"render",value:function(){var e=this.props,t=e.product,a=(e.symbol,e.translate);return m.a.createElement(m.a.Fragment,null,m.a.createElement("div",{className:"product-box bg-light "},this.offerExist(t.offer_from_date,t.offer_to_date)&&null!==t.offer_percent&&"0"!==t.offer_percent?m.a.createElement("div",{className:"badge badge-danger text-wrap my-1 p-3",style:{width:"6rem",zIndex:"1",position:"absolute",webkitTransform:"rotate(-45deg)",left:"-11px"}},t.offer_percent," % Offer"):"",m.a.createElement("div",{className:"d-flex img-wrapper justify-content-center"},m.a.createElement("div",{className:"front d-flex imgWrapper"},m.a.createElement("a",{className:"d-flex align-items-center justify-content-center",href:"".concat("","/product/").concat(t.url,".html")},1==t.brand_promo&&m.a.createElement("span",{className:"bpp_badge badge badge-warning"}," BPP "),m.a.createElement("img",{"data-sizes":"auto",src:"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==","data-src":t.variants?this.state.image?this.state.image:t.variants[0].images:"".concat(_.c,"/product_images_thumb/")+t.img,alt:"".concat(t.name," beldara.com"),className:"img-fluid prodImg lazyload ",id:t.id,onError:this.checkImageExist})))),m.a.createElement("div",{className:"product_info"},m.a.createElement("div",null,m.a.createElement(f.a,{to:"".concat("","/product/").concat(encodeURIComponent(t.url),".html")},m.a.createElement("div",{className:"text-truncate font-weight-bolder text-dark"},t.name)),t.company&&m.a.createElement("div",{className:"text-truncate font-weight-lighter"},m.a.createElement("small",null,t.company)),this.offerExist(t.offer_from_date,t.offer_to_date)?m.a.createElement("div",null,m.a.createElement("span",{className:"d-flex"},m.a.createElement("del",{className:"mr-1"},m.a.createElement(I,{productCost:this.deadEnd,finalCost:this.finalCost,symbol:t.currency,start_price:t.start_price,end_price:"",price_in:t.price_in,price_us:t.price_us,mrp_price:t.offer_mrp_price,price_offer:this.CalcOfferPrice(t.mrp_price,t.offer_min_qty,t.offer_stock,t.offer_min_qty,t.offer_from_date,t.offer_to_date),country_code:Object(x.s)("country_code")})),m.a.createElement(I,{productCost:this.deadEnd,finalCost:this.finalCost,symbol:t.currency,start_price:t.offer_price,end_price:"",price_in:t.price_in,price_us:t.price_us,mrp_price:t.offer_mrp_price,price_offer:this.CalcOfferPrice(t.offer_price,t.offer_min_qty,t.offer_stock,t.offer_min_qty,t.offer_from_date,t.offer_to_date),country_code:Object(x.s)("country_code")})),t.qty?m.a.createElement("div",{className:"small"},"".concat(a("MOQ")," : ").concat(t.offer_min_qty," - ").concat(t.unit)):""):this.offerExist(t.offer_from_date,t.offer_to_date)?"":m.a.createElement("div",null,t.start_price&&null===this.CalcOfferPrice(t.offer_price,t.qty,t.offer_stock,t.offer_min_qty,t.offer_from_date,t.offer_to_date)?m.a.createElement(q,{currencyValue:this.props.currencyValue,productCost:this.deadEnd,finalCost:this.finalCost,minqty:t.qty,symbol:t.currency,start_price:t.start_price,end_price:t.end_price,price_us:t.price_us,price_in:t.price_in,country_code:Object(x.s)("country_code")}):m.a.createElement("b",null,"Ask For Price"),t.qty?m.a.createElement("div",{className:"small"},"".concat(a("MOQ")," : ").concat(t.qty," - ").concat(t.unit)):""))),m.a.createElement("div",{className:"row mb-2 mx-0"},t.start_price&&parseFloat(t.start_price)>parseFloat(0)&&!this.offerExist(t.offer_from_date,t.offer_to_date)?m.a.createElement(m.a.Fragment,null,m.a.createElement("div",{id:"btn_".concat(t.id),className:" col-12 col-md-12 col-sm-12 text-center py-2 px-1 buy1"},m.a.createElement("div",{className:"mouse_pointer btn btn_Pro  btn-orange",id:t.id,onClick:this.validate.bind(this,"buyBtn",t.id,t.qty,parseFloat(t.start_price)*parseInt(t.qty),this.props.symbol,t.start_price,t.currency,t.sellerid)},"Buy Now"))):this.offerExist(t.offer_from_date,t.offer_to_date)&&t.offer_stock>0?m.a.createElement(m.a.Fragment,null,m.a.createElement("div",{id:"btn_".concat(t.id),className:" col-6 col-md-6 col-sm-6 text-left py-2 px-1 buy2"},m.a.createElement("div",{className:"mouse_pointer btn btn_Pro  btn-orange",id:t.id,onClick:this.validate.bind(this,"buyBtn",t.id,t.offer_min_qty,parseInt(this.state.price)*parseInt(t.offer_min_qty),this.props.symbol,t.start_price,t.currency,t.sellerid)},"Buy Now")),m.a.createElement("div",{className:"col-6  text-center col-md-6 col-sm-6 py-2 px-1"},t.sellerid!=O.a.get("log_id")?m.a.createElement("div",{className:"mouse_pointer btn btn_Pro  btn-orange",onClick:this.chatBtn.bind(this,t)},"Chat Now"):"")):m.a.createElement(m.a.Fragment,null,m.a.createElement("div",{id:"btn_".concat(t.id),className:"col-12 text-center col-md-12 col-sm-12 py-2 px-1"},m.a.createElement("div",{className:"text-center"},m.a.createElement(f.a,{onClick:this.event_ask_for_price.bind(this,"ask_for_price",t.id),id:"ask_for_price",className:"btn btn_Pro btn-orange",clickevent:"Ask_for_price",to:{pathname:"/post-requirement.html",state:t}}," Contact Supplier ")))))))}}]),t}(p.Component);t.default=Object(b.a)(Object(h.withTranslate)(Object(w.connect)(function(e){return{symbol:e.data.symbol,currencyValue:e.currencyValue.currencyValue,user:e.user,hole_data:e}})(P)))},810:function(e,t,a){"use strict";a.r(t);var r=a(11),c=a(2),n=a.n(c),o=a(7),i=a(19),s=a(20),l=a(22),u=a(21),d=a(23),p=a(1),m=a.n(p),f=a(29),_=a(8),b=a.n(_),h=a(26),y=a(222),v=a(16),E=a(17),g=a(6),k=a.n(g),O=a(45),x=a(9),j=a(48);var C=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).getRelProducts=Object(o.a)(n.a.mark(function e(){return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:k.a.post("".concat(O.a,"get_related_prod1_new.php"),{prod_id:a.props.product.id,country_code:Object(x.s)("country_code"),currency:Object(x.s)("currency"),security_token:"",plateform_type:""},{headers:{"content-type":"multipart/form-data"}}).then(function(){var e=Object(o.a)(n.a.mark(function e(t){return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("1"!=t.data.statusId){e.next=4;break}return e.next=3,a.setState({items:t.data.result});case 3:console.log(t.data,40);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){console.log("error:"+e,40)});case 1:case"end":return e.stop()}},e)})),a.checkImage=function(e){var t;t=e,b()("#"+t).closest(".col-grid-box").addClass("d-none")},a.state={items:null},a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){var e=Object(o.a)(n.a.mark(function e(){return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v.a.dispatch(Object(h.G)(this.props.product.id));case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentWillReceiveProps",value:function(){var e=Object(o.a)(n.a.mark(function e(){return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.setState({items:null});case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.props,a=t.items,c=(t.symbol,t.addToCart,t.addToWishlist,t.addToCompare,t.translate);return m.a.createElement("section",{className:"section-b-space"},m.a.createElement("div",{className:"container"},m.a.createElement("div",{className:"row"},m.a.createElement("div",{className:"col-12 product-related"},m.a.createElement("h2",null,c("RELATED PRODUCTS")))),m.a.createElement("div",{className:"row search-product"},null!=a?a.slice(0,20).map(function(t,a){return t?m.a.createElement("div",Object(r.a)({key:a,className:"col-6 col-lg-3 col-xl-3 col-md-4 col-xs-6 col-sm-6 col-grid-box px-0 px-sm-0 px-md-1"},"key",a),m.a.createElement(y.default,{product:t,checkImage:e.checkImage})):""}):m.a.createElement(j.a,null))))}}]),t}(p.Component);t.default=Object(E.withTranslate)(Object(f.connect)(function(e){return{items:e.data.relatedProducts,symbol:e.data.symbol,hole_data:e}},{addToCart:h.a,addToWishlist:h.d,addToCompare:h.c})(C))}}]);
//# sourceMappingURL=9.ae1ca2d6.chunk.js.map