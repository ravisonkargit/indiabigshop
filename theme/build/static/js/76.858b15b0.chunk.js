(window.webpackJsonp=window.webpackJsonp||[]).push([[76],{151:function(e,a,t){"use strict";var l=t(19),n=t(20),r=t(22),c=t(21),s=t(23),o=t(1),i=t.n(o),m=t(153),d=t(17),u=t(152),p=function(e){function a(){return Object(l.a)(this,a),Object(r.a)(this,Object(c.a)(a).apply(this,arguments))}return Object(s.a)(a,e),Object(n.a)(a,[{key:"render",value:function(){var e=this.props,a=e.title,t=(e.parent,e.translate),l=e.metaTitle,n=e.metaDesc,r=e.metaKeyword;return i.a.createElement("div",{className:"breadcrumb-section py-1"},i.a.createElement(u.Helmet,null,i.a.createElement("title",null,l),i.a.createElement("meta",{name:"description",content:n}),i.a.createElement("meta",{name:"keyword",content:r})),i.a.createElement("div",{className:"container"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-6"},i.a.createElement("div",{className:"page-title"},i.a.createElement("h2",null,t(a)))),i.a.createElement("div",{className:"col-md-6"},i.a.createElement("nav",{"aria-label":"breadcrumb",className:"theme-breadcrumb"},i.a.createElement("ol",{className:"breadcrumb"},i.a.createElement("li",{className:"breadcrumb-item"},i.a.createElement(m.a,{to:"".concat("")},t("Home")))))))))}}]),a}(o.Component);a.a=Object(d.withTranslate)(p)},570:function(e,a,t){},832:function(e,a,t){"use strict";t.r(a);var l,n,r=t(2),c=t.n(r),s=t(7),o=t(19),i=t(20),m=t(22),d=t(21),u=t(23),p=t(1),E=t.n(p),b=t(9),_=t.n(b),h=t(151),y=t(6),f=t.n(y),v=t(29),N=t(45),g=t(161),w=t(311),k=t(8),x=(t(565),t(567)),T=(t(570),t(10)),C=t.n(T),S=function(e){function a(){return Object(o.a)(this,a),Object(m.a)(this,Object(d.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(i.a)(a,[{key:"render",value:function(){console.log(this.props);var e=this.props,a=e.user,t=e.amount,l=e.sellerid,n=e.order_id,r=e.order_code,c=e.has_coupon,s=e.discounted_amount,o=e.discount_code,i=e.full_payment,m=e.payment_type,d=e.additional_detail_id;if(a)a.email;else;var u="CUST_".concat(l,"_").concat(Math.floor(1e3+9e3*Math.random())),p="ORD_".concat(r,"_").concat(Math.floor(1e3+9e3*Math.random())),b=window.location.host;return E.a.createElement(E.a.Fragment,null,E.a.createElement("form",{method:"post",action:"".concat(N.c,"/paytmtest/web/Paytm_Web_Sample_Kit_PHP-master/PaytmKit/pgRedirect.php"),name:"paytm"},E.a.createElement("input",{type:"hidden",id:"MID",name:"MID",value:"Beldar02827113089473"}),E.a.createElement("input",{type:"hidden",id:"WEBSITE",name:"WEBSITE",value:"WEBPROD"}),E.a.createElement("input",{type:"hidden",id:"ORDER_ID",name:"ORDER_ID",value:p}),E.a.createElement("input",{type:"hidden",id:"CUST_ID",name:"CUST_ID",value:u}),E.a.createElement("input",{type:"hidden",id:"INDUSTRY_TYPE_ID",name:"INDUSTRY_TYPE_ID",value:"Retail104"}),E.a.createElement("input",{type:"hidden",id:"CHANNEL_ID",name:"CHANNEL_ID",value:"WEB"}),E.a.createElement("input",{type:"hidden",id:"TXN_AMOUNT",name:"TXN_AMOUNT",value:t}),E.a.createElement("input",{type:"hidden",id:"CALLBACK_URL",name:"CALLBACK_URL",value:"".concat(N.c,"/beta_api/payment_confm_web.php")}),E.a.createElement("input",{type:"hidden",id:"payment_type",name:"payment_type",value:m}),E.a.createElement("input",{type:"hidden",id:"test",name:"test",value:"1"}),E.a.createElement("input",{type:"hidden",id:"orderid",name:"orderid",value:n}),E.a.createElement("input",{type:"hidden",id:"order_code",name:"order_code",value:r}),E.a.createElement("input",{type:"hidden",id:"has_coupon",name:"has_coupon",value:c}),E.a.createElement("input",{type:"hidden",id:"full_payment",name:"full_payment",value:i}),E.a.createElement("input",{type:"hidden",id:"discounted_amount",name:"discounted_amount",value:s}),E.a.createElement("input",{type:"hidden",id:"dicsounted_code",name:"discounted_code",value:o}),E.a.createElement("input",{type:"hidden",id:"additional_detail_id",name:"additional_detail_id",value:d}),E.a.createElement("input",{type:"hidden",id:"redirect_domain",name:"redirect_domain",value:b}),E.a.createElement("input",{type:"submit",className:"paytmBtn d-none",value:"CheckOut"})))}}]),a}(p.Component),A=t(415),I=(t(0),function(e){function a(e){var t;return Object(o.a)(this,a),(t=Object(m.a)(this,Object(d.a)(a).call(this,e))).handleClick=function(){var e=Object(s.a)(c.a.mark(function e(a){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.setState({user:"",order_id:a.order_id,order_code:a.order_code,buyerid:a.buyerid,sellerid:a.sellerid,amount:a.amount,discount_code:"NA",discounted_amount:a.discounted_amount,has_coupon:"0",full_payment:a.full_payment,payment_type:a.payment_type,additional_detail_id:a.additional_detail_id});case 2:t.changeMethod("paytm");case 3:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),t.getUploadFileData=function(){var e=Object(s.a)(c.a.mark(function e(a){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.setState({b_order_code:a.b_order_code,b_amount_total:a.b_amount_total,b_order_id:a.b_order_id,b_sellerid:a.b_sellerid,openTransferModal:!t.state.openTransferModal});case 2:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),t.UploadFileTrasfer=function(){_()("#msg_").empty(),_()("#msg_").addClass("d-none");var e=_()("#transaction_no").val(),a=_()("#transaction_file").val(),l=_()("#transaction_file")[0].files[0],n=new FormData;if(n.append("main_img",l),n.append("paymentidbytt",""),n.append("order_code",t.state.b_order_code),n.append("buyeremail",""),n.append("amount",t.state.b_amount_total),n.append("amount_paid",t.state.b_amount_total),n.append("name",""),n.append("account","beldara"),n.append("orderid",t.state.b_order_id),n.append("amountbytt",1),n.append("partial",0),n.append("pay_pending",""),n.append("mode",2),n.append("sellerid",t.state.b_sellerid),n.append("transaction_no",e),""!=e)if(""!=a){_()("#UploadFileTrasfer_").attr("disabled",!0);try{f()({method:"post",url:"https://api.indiabigshop.com/common/upload_purchased_receipt.php",data:n,config:{headers:{"Content-Type":"multipart/form-data"}}}).then(function(e){_()("#msg_").removeClass("d-none").append("File uploaded successfully."),_()("#UploadFileTrasfer_").attr("disabled",!1),setTimeout(function(){window.location.reload()},2e3)}).catch(function(e){_()("#msg_").removeClass("d-none").append("Something went wrong. Please try again."),_()("#UploadFileTrasfer_").attr("disabled",!1),console.error(e)})}catch(r){console.error(r),_()("#submit_order_receipt").removeAttr("disabled")}}else _()("#msg_").removeClass("d-none").append("Please upload transaction file");else _()("#msg_").removeClass("d-none").append("Please enter transaction number")},t.OpenPopup=function(){t.setState({isOpenPopup:!t.state.isOpenPopup})},t.state={data:"",dataMyOrder:[],detailsorder:[],sellerWiseData:[],seller_id:C.a.get("sellerid"),getpath:t.props.location.pathname.split("."),chkpath:t.props.location.pathname,country_name:Object(k.s)("country_name"),user:"",order_id:"0",order_code:"0",buyerid:"0",sellerid:"0",amount:"0",discount_code:"NA",discounted_amount:"0",has_coupon:"0",full_payment:"0",payment_type:"0",additional_detail_id:"0",openTransferModal:!1,b_order_code:"0",b_amount_total:"0",b_sellerid:"0",count:"0",count1:"0"},t}return Object(u.a)(a,e),Object(i.a)(a,[{key:"componentWillMount",value:function(){var e=Object(s.a)(c.a.mark(function e(){var a,t=this;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(this.getBankDetails(),this.GetMyOrder(),a=window.location.hostname,l=(l=a.split("beldara.com")[0]).replace(".",""),this.props.languageMaster.forEach(function(e){e.main_language.toLowerCase()==l.toLowerCase()&&(n=e.code)},this),""===n||void 0===n){e.next=11;break}return e.next=9,f.a.post("https://api.indiabigshop.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:n,pageid:"5"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){t.setState({data:e.data.result})}).catch(function(e){var a=e.response;return Promise.reject(a)});case 9:e.next=13;break;case 11:return e.next=13,f.a.post("https://api.indiabigshop.com/common/static_page.php",{security_token:"",plateform_type:"",langCode:"en",pageid:"5"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){t.setState({data:e.data.result})}).catch(function(e){var a=e.response;return Promise.reject(a)});case 13:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(){var e=Object(s.a)(c.a.mark(function e(){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()},{key:"getBankDetails",value:function(){var e=this;try{f.a.post("https://api.indiabigshop.com/common/get_company_bank_details.php",{type:""},{headers:{"Content-Type":"multipart/form-data"}}).then(function(a){null!=a.data.result&&e.setState({acc_number:a.data.result[0].acc_number,bank_swift_code:a.data.result[0].bank_swift_code,beneficiary_address:a.data.result[0].beneficiary_address,beneficiary_bank:a.data.result[0].beneficiary_bank,name:a.data.result[0].name})}).catch(function(e){var a=e.response;return Promise.reject(a)})}catch(a){console.log("\ud83d\ude31 Axios request failed: ".concat(a))}}},{key:"GetMyOrder",value:function(){var e=this;if("/my-order.html"!=this.state.chkpath)if(null!=this.state.getpath[0].split("-")[3]||""!=this.state.getpath[0].split("-")[3])try{f.a.post("https://api.indiabigshop.com/common/get_my_order.php",{buyerid:this.state.getpath[0].split("-")[3],count:"0"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(a){null!=a.data.result.order&&null!=a.data.result.detailsorder&&null!=a.data.result.sellerWiseData?e.setState({dataMyOrder:a.data.result.order,detailsorder:a.data.result.detailsorder,sellerWiseData:a.data.result.sellerWiseData}):e.setState({dataNotFound:"1"})}).catch(function(e){var a=e.response;return Promise.reject(a)})}catch(a){console.log("\ud83d\ude31 Axios request failed: ".concat(a))}else this.setState({dataNotFound:"1"});else if(null!=this.state.seller_id||""!=this.state.seller_id)try{f.a.post("https://api.indiabigshop.com/common/get_my_order.php",{buyerid:this.state.seller_id,count:"0"},{headers:{"Content-Type":"multipart/form-data"}}).then(function(a){null!=a.data.result.order&&null!=a.data.result.detailsorder&&null!=a.data.result.sellerWiseData?e.setState({dataMyOrder:a.data.result.order,detailsorder:a.data.result.detailsorder,sellerWiseData:a.data.result.sellerWiseData}):e.setState({dataNotFound:"1"})}).catch(function(e){var a=e.response;return Promise.reject(a)})}catch(a){console.log("\ud83d\ude31 Axios request failed: ".concat(a))}else this.setState({dataNotFound:"1"})}},{key:"changeMethod",value:function(e){this.setState({checked:e}),Object(k.l)("shipment","order",e,"shipment",C.a.get("sellerid"),Object(k.s)("mhinpbnb")),_()(".paytmBtn").click()}},{key:"executeOnClick",value:function(e){console.log(e)}},{key:"render",value:function(){var e=this,a=function(e){var a=e.color;return E.a.createElement("hr",{style:{color:a,backgroundColor:a,height:1,marginTop:0,marginBottom:0}})};return E.a.createElement("div",null,"/my-order.html"==this.props.location.pathname?E.a.createElement(h.a,{title:"My Order",metaDesc:this.state.data.desc1,metaKeyword:this.state.data.keyword,metaTitle:this.state.data.title}):"",E.a.createElement("div",{className:"container"},"1"!=this.state.dataNotFound?E.a.createElement("div",null,E.a.createElement("br",null),this.state.dataMyOrder.map(function(t,l){return E.a.createElement(E.a.Fragment,null,g.isMobile?E.a.createElement("div",{className:"row p-3 mb-2 bg-light text-dark"},E.a.createElement("div",{className:"col-sm-4"},E.a.createElement("strong",null,"Order ID : ")," ",E.a.createElement("label",null,"#"+t.id+"-"+t.order_code)),E.a.createElement("div",{className:"col-sm-2"},E.a.createElement("strong",null,"Ship To : "),E.a.createElement("label",null,t.delivery_address.substring(0,10)),E.a.createElement("a",{"data-for":"soclose"+t.id,"data-tip":"1"},"...",E.a.createElement("i",{className:"fa fa-chevron-down","aria-hidden":"true"})),E.a.createElement("div",null,E.a.createElement(w.a,{id:"soclose"+t.id,getContent:function(e){return E.a.createElement("div",{style:{width:"284px"}},E.a.createElement("label",null,t.delivery_address))},effect:"solid",delayHide:300,delayShow:300,delayUpdate:300,place:"bottom",border:!0,type:"light",style:{width:"25%;"}}))),E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",null,"Total Amount : "),E.a.createElement("a",{"data-for":"totalAmt"+t.id,"data-tip":"1"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.totalAmt)),"\xa0\xa0",E.a.createElement("i",{className:"fa fa-chevron-down","aria-hidden":"true"})),E.a.createElement(w.a,{id:"totalAmt"+t.id,getContent:function(e){return E.a.createElement("div",{style:{width:"250px"}},E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col text-left"},E.a.createElement("strong",null,"Subtotal")),E.a.createElement("div",{className:"col"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.amount))),E.a.createElement("br",null)),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col text-left"},E.a.createElement("strong",null,"Shipping Charges")),E.a.createElement("div",{className:"col"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.shipping_charge)))),E.a.createElement("hr",null),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col text-left"},E.a.createElement("strong",null,"Grand Total")),E.a.createElement("div",{className:"col"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.totalAmt)))))},effect:"solid",delayHide:300,delayShow:300,delayUpdate:300,place:"bottom",border:!0,type:"light",style:{width:"25%;"}})),E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",null,"Placed : ")," ",E.a.createElement("label",null,t.placed),"0"==t.toad_payment_done?"0"==t.payment_done?E.a.createElement("li",null,E.a.createElement("div",{className:"radio-option paypal "},E.a.createElement("br",null),E.a.createElement("button",{type:"button",name:"payment-group",method:"paytm",id:"payment-1",className:"btn btn-solid",onClick:e.handleClick.bind(null,{user:"",order_id:t.id,order_code:t.order_code,buyerid:t.buyerid,sellerid:t.sellerid,amount:t.totalAmt,discount_code:"NA",discounted_amount:t.totalAmt,has_coupon:"0",full_payment:"1",payment_type:"1",additional_detail_id:"0"})},"Pay ",E.a.createElement("i",{className:"fa fa-inr"})," ",t.totalAmt," Now")),E.a.createElement("div",{style:{marginTop:"13px"}},"0"==t.SellerWisePaymentId||""!=t.SellerWisePaymentId&&null!=t.SellerWisePaymentId?E.a.createElement("button",{className:"btn btn-solid"},"Pending For Approval"):E.a.createElement("button",{className:"btn btn-solid",onClick:e.getUploadFileData.bind(null,{b_order_code:t.order_code,b_amount_total:t.totalAmt,b_sellerid:t.sellerid,b_order_id:t.id})},"transfer to account"))):E.a.createElement("li",null,E.a.createElement("div",{className:"payment_done"},E.a.createElement("button",{type:"button",name:"payment_done",method:"payment_done",id:"payment_done",className:"btn btn-solid"},"Payment done"))):"")):E.a.createElement("div",null,E.a.createElement("div",{className:"row p-3 mb-2 bg-light text-dark"},E.a.createElement("div",{className:"col-sm-4"},E.a.createElement("strong",null,"Order ID : ")," ",E.a.createElement("label",null,"#"+t.id+"-"+t.order_code)),E.a.createElement("div",{className:"col-sm-2"},E.a.createElement("strong",null,"Ship To : "),E.a.createElement("label",null,t.delivery_address.substring(0,8)),E.a.createElement("a",{"data-for":"soclose"+t.id,"data-tip":"1"},"...",E.a.createElement("i",{className:"fa fa-chevron-down","aria-hidden":"true"})),E.a.createElement("div",null,E.a.createElement(w.a,{id:"soclose"+t.id,getContent:function(e){return E.a.createElement("div",{style:{width:"250px"}},E.a.createElement("label",null,t.delivery_address))},effect:"solid",delayHide:300,delayShow:300,delayUpdate:300,place:"bottom",border:!0,type:"light",style:{width:"25px"}}))),E.a.createElement("div",{className:"col-sm-3 text-right "},E.a.createElement("strong",null,"Total Amount : "),E.a.createElement("a",{"data-for":"totalAmt"+t.id,"data-tip":"1"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.totalAmt)),"\xa0\xa0",E.a.createElement("i",{className:"fa fa-chevron-down","aria-hidden":"true"})),E.a.createElement(w.a,{id:"totalAmt"+t.id,getContent:function(e){return E.a.createElement("div",{style:{width:"250px"}},E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-lg-7 text-left"},E.a.createElement("strong",null,"Subtotal")),E.a.createElement("div",{className:"col-md-5"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.amount))),E.a.createElement("br",null)),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-lg-7 text-left"},E.a.createElement("strong",null,"Shipping Charges")),E.a.createElement("div",{className:"col-md-5"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.shipping_charge)))),E.a.createElement("hr",null),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-lg-7 text-left"},E.a.createElement("strong",null,"Grand Total")),E.a.createElement("div",{className:"col-md-5"},E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(t.totalAmt)))))},effect:"solid",delayHide:300,delayShow:300,delayUpdate:300,place:"bottom",border:!0,type:"light",style:{width:"25%;"}}),E.a.createElement("br",null),"0"==t.toad_payment_done&&"0"==t.payment_done?E.a.createElement("li",null,E.a.createElement("div",{className:"radio-option paypal "},E.a.createElement("br",null),E.a.createElement("button",{type:"button",name:"payment-group",method:"paytm",id:"payment-1",className:"btn btn-solid",onClick:e.handleClick.bind(null,{user:"",order_id:t.id,order_code:t.order_code,buyerid:t.buyerid,sellerid:t.sellerid,amount:t.totalAmt,discount_code:"NA",discounted_amount:t.totalAmt,has_coupon:"0",full_payment:"1",payment_type:"1",additional_detail_id:"0"})},"Pay ",E.a.createElement("i",{className:"fa fa-inr"})," ",t.totalAmt," Now"))):""),E.a.createElement("div",{className:"col-sm-3 text-right"},E.a.createElement("strong",null,"Placed : ")," ",E.a.createElement("label",null,t.placed),E.a.createElement("br",null),"0"==t.toad_payment_done?"0"==t.payment_done?E.a.createElement("li",null,E.a.createElement("div",{style:{marginTop:"13px"}},"0"==t.SellerWisePaymentId||""!=t.SellerWisePaymentId&&null!=t.SellerWisePaymentId?E.a.createElement("button",{className:"btn btn-solid"},"Pending For Approval"):E.a.createElement("button",{className:"btn btn-solid",onClick:e.getUploadFileData.bind(null,{b_order_code:t.order_code,b_amount_total:t.totalAmt,b_sellerid:t.sellerid,b_order_id:t.id})},"transfer to account"))):E.a.createElement("li",null,E.a.createElement("div",{className:"payment_done"},E.a.createElement("button",{type:"button",name:"payment_done",method:"payment_done",id:"payment_done",className:"btn btn-solid"},"Payment done"))):""))),e.state.sellerWiseData.map(function(a,l){return t.id==a.id?E.a.createElement("div",null,E.a.createElement("div",{className:"card"},E.a.createElement("div",{className:"card-body"},g.isMobile?E.a.createElement("div",null,E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",{style:{backgroundColor:"#FB9944"},className:"p-2 mb-1 text-white"},"SHIPMENT ",a.row_number," of"," ",a.shipment),E.a.createElement("br",null)),E.a.createElement("div",{className:"col-sm-3",style:{marginTop:"12px"}},E.a.createElement("strong",null,"Tracking No : "),E.a.createElement("label",null,"#"+a.trakingId)),E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",null,"Seller Name : "),E.a.createElement("lable",null,a.seller_name)),E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",null,"Courier Name : "),a.logistic_vendor?a.logistic_vendor:"Not Assigned")),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-lg-12"},E.a.createElement("strong",null,"Status - ")," ",E.a.createElement("label",null,a.current_order_status),E.a.createElement("div",{style:{marginLeft:"13px",marginTop:"-21px"}},E.a.createElement("progress",{id:"progressbar",value:a.status,max:"100",style:{width:"136px",marginBottom:"-11px",marginLeft:"-16px"}}),E.a.createElement("div",null,E.a.createElement("lable",null,"Placed : ",a.placed_date)),E.a.createElement("br",null),E.a.createElement("div",null,E.a.createElement("lable",null,"Packed : ",a.packed_date)),E.a.createElement("br",null),E.a.createElement("div",null,E.a.createElement("lable",null,"Shipped : ",a.shipped_date)),E.a.createElement("br",null),E.a.createElement("div",null,E.a.createElement("lable",null,"Deliverd : ",a.delivered_date)),E.a.createElement("br",null),a.airway_bill_no&&"0"!=a.airway_bill_no?"Delhivery"==a.logistic_vendor?E.a.createElement("a",{className:"btn btn-solid",target:"_blank",href:"https://www.delhivery.com/track/package/"+a.airway_bill_no},"Track"):E.a.createElement("a",{className:"btn btn-solid",target:"_blank",href:"https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber="+a.airway_bill_no+"&cntry_code=in&locale=en_US"},"Track"):"")))):E.a.createElement("div",null,E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",{style:{backgroundColor:"#FB9944"},className:"p-2 mb-1 text-white"},"SHIPMENT ",a.row_number," of"," ",a.shipment)),E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",null,"Tracking No : "),E.a.createElement("label",null,"#"+a.trakingId)),E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("strong",null,"Seller Name : "),E.a.createElement("lable",null,a.seller_name)),E.a.createElement("div",{className:"col-sm-3 text-right"},E.a.createElement("strong",null,"Courier Name : "),a.logistic_vendor?a.logistic_vendor:"Not Assigned")),E.a.createElement("br",null),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-lg-10"},E.a.createElement(x.ProgressBar,{percent:a.status,filledBackground:"linear-gradient(to right, #FB9944, #FB9944)"},E.a.createElement(x.Step,null,function(e){var a=e.accomplished,t=e.index;return E.a.createElement("div",{className:"indexedStep ".concat(a?"accomplished":null)},t+1)}),E.a.createElement(x.Step,null,function(e){var a=e.accomplished,t=e.index;return E.a.createElement("div",{className:"indexedStep ".concat(a?"accomplished":null)},t+1)}),E.a.createElement(x.Step,null,function(e){var a=e.accomplished,t=e.index;return E.a.createElement("div",{className:"indexedStep ".concat(a?"accomplished":null)},t+1)}),E.a.createElement(x.Step,null,function(e){var a=e.accomplished,t=e.index;return E.a.createElement("div",{className:"indexedStep ".concat(a?"accomplished":null)},t+1)})),E.a.createElement("br",null)),E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-sm-3 text-center"},E.a.createElement("lable",null,"Placed : ",a.placed_date)),E.a.createElement("div",{className:"col-sm-3 text-center"},E.a.createElement("lable",null,"Packed : ",a.packed_date)),E.a.createElement("div",{className:"col-sm-3 text-center"},E.a.createElement("lable",null,"Shipped : ",a.shipped_date)),E.a.createElement("div",{className:"col-sm-3 text-center"},E.a.createElement("lable",null,"Deliverd : ",a.delivered_date))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-lg-12"},E.a.createElement("strong",null,"Status - ")," ",E.a.createElement("lable",null,a.current_order_status)),E.a.createElement("div",{className:"col-lg-12"},a.airway_bill_no&&"0"!=a.airway_bill_no?"Delhivery"==a.logistic_vendor?E.a.createElement("a",{className:"btn btn-solid",target:"_blank",href:"https://www.delhivery.com/track/package/"+a.airway_bill_no},"Track"):E.a.createElement("a",{className:"btn btn-solid",target:"_blank",href:"https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber="+a.airway_bill_no+"&cntry_code=in&locale=en_US"},"Track"):""))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-lg-12"},E.a.createElement("br",null),E.a.createElement("table",{id:"table",className:"table cart-table table-responsive-xs",style:{tableLayout:"fixed"}},E.a.createElement("tbody",null,e.state.detailsorder.map(function(e,l){return a.id==e.orderid&&a.sellerid==e.sellerid?E.a.createElement("tr",{className:g.isMobile?"d-flex":""},E.a.createElement("td",{className:"p-3 mb-2 bg-light text-dark"},E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-3"},E.a.createElement("a",{target:"_blank",href:"".concat("","/product/").concat(e.url,".html")},E.a.createElement("img",{src:"".concat(N.c,"/product_images_thumb/").concat(e.productImg),alt:"on Beldara.com",style:{height:"90px"}}))),E.a.createElement("div",{className:"col-md-9"},E.a.createElement("div",null,E.a.createElement("strong",null,"Product Name :")," ",E.a.createElement("a",{target:"_blank",href:"".concat("","/product/").concat(e.url,".html")},E.a.createElement("lable",null,e.name))),E.a.createElement("div",null,E.a.createElement("strong",null,"Qty :")," ",E.a.createElement("lable",null,e.qty," ",e.unit)),E.a.createElement("div",null,E.a.createElement("strong",null,"Amount :")," ",E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(e.price))),E.a.createElement("div",null,E.a.createElement("strong",null,"Total Amount :")," ",E.a.createElement("lable",null,"INR"==t.currancy?E.a.createElement("i",{className:"fa fa-inr"}):E.a.createElement("i",{className:"fa fa-usd"}),Intl.NumberFormat().format(e.amount))),"1"==e.iscancled?E.a.createElement("div",{className:"text-right",style:{color:"red"}},"Product Cancelled"):"")))):""}))))),E.a.createElement("div",{className:"row"},g.isMobile?E.a.createElement("div",null,E.a.createElement("div",{className:"col-lg-12 text-left"},"0"==a.payment_done?E.a.createElement("li",null,E.a.createElement("div",{className:"radio-option paypal"},E.a.createElement("button",{type:"button",name:"payment-group",method:"paytm",id:"payment-1",className:"btn btn-solid",onClick:e.handleClick.bind(null,{user:"",order_id:a.id,order_code:a.order_code,buyerid:a.buyerid,sellerid:a.sellerid,amount:a.totalAmt,discount_code:"NA",discounted_amount:a.totalAmt,has_coupon:"0",full_payment:"0",payment_type:"2",additional_detail_id:a.additional_detail_id})},"Pay ",E.a.createElement("i",{className:"fa fa-inr"}),a.totalAmt," Now"))):E.a.createElement("li",null,E.a.createElement("div",{className:"payment_done"},E.a.createElement("button",{type:"button",name:"payment_done",method:"payment_done",id:"payment_done",className:"btn btn-solid"},"Payment done")))),E.a.createElement("br",null),E.a.createElement("div",{className:"col-lg-12 text-left"},"0"==a.payment_done?a.SellerWisePaymentId!=a.sellerid?E.a.createElement("button",{className:"btn btn-solid",onClick:e.getUploadFileData.bind(null,{b_order_code:a.order_code,b_amount_total:a.totalAmt,b_sellerid:a.sellerid,b_order_id:a.id})},"transfer to account"):E.a.createElement("button",{className:"btn btn-solid"},"Pending For Approval"):"")):E.a.createElement("div",{className:"col text-right"},"0"==a.payment_done?E.a.createElement("li",null,E.a.createElement("div",{className:"radio-option paypal"},E.a.createElement("button",{type:"button",name:"payment-group",method:"paytm",id:"payment-1",className:"btn btn-solid",onClick:e.handleClick.bind(null,{user:"",order_id:a.id,order_code:a.order_code,buyerid:a.buyerid,sellerid:a.sellerid,amount:a.totalAmt,discount_code:"NA",discounted_amount:a.totalAmt,has_coupon:"0",full_payment:"0",payment_type:"2",additional_detail_id:a.additional_detail_id})},"Pay ",E.a.createElement("i",{className:"fa fa-inr"}),a.totalAmt," Now"),"\xa0\xa0",a.SellerWisePaymentId!=a.sellerid?E.a.createElement("button",{className:"btn btn-solid",onClick:e.getUploadFileData.bind(null,{b_order_code:a.order_code,b_amount_total:a.totalAmt,b_sellerid:a.sellerid,b_order_id:a.id})},"transfer to account"):E.a.createElement("button",{className:"btn btn-solid"},"Pending For Approval"))):E.a.createElement("li",null,E.a.createElement("div",{className:"payment_done"},E.a.createElement("button",{type:"button",name:"payment_done",method:"payment_done",id:"payment_done",className:"btn btn-solid"},"Payment done"))))))),E.a.createElement("br",null)):""}),E.a.createElement("br",null),E.a.createElement(a,{color:"#0e0e0e"}),E.a.createElement("br",null))}),E.a.createElement("br",null),E.a.createElement(S,{user:this.state.user,order_id:this.state.order_id,order_code:this.state.order_code,buyerid:this.state.buyerid,sellerid:this.state.buyerid,amount:this.state.amount,discount_code:this.state.discount_code,discounted_amount:this.state.discounted_amount,has_coupon:this.state.has_coupon,full_payment:this.state.full_payment,payment_type:this.state.payment_type,additional_detail_id:this.state.additional_detail_id})):E.a.createElement("div",null,E.a.createElement("br",null),E.a.createElement("div",{class:"col-sm-12 empty-cart-cls text-center"},E.a.createElement("img",{src:"/assets/images/icon-empty-cart.png",class:"img-fluid mb-4",alt:""}),E.a.createElement("h3",null,E.a.createElement("strong",null,"No orders found")))),this.state.openTransferModal&&(g.isMobile?E.a.createElement(A.a,{show:this.state.openTransferModal,style:{left:"0%",top:"12%"}},E.a.createElement(A.a.Header,null,E.a.createElement(A.a.Title,null),E.a.createElement("div",{class:"col-12"},E.a.createElement("h5",{className:"text-left"},E.a.createElement("strong",null,"Transfer To Account")))),E.a.createElement(A.a.Body,null,E.a.createElement("br",null),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-lg-10"},E.a.createElement("div",{class:"alert alert-info d-none msg_",id:"msg_",role:"alert"})),E.a.createElement("div",{className:"col-sm-1"})),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col text-center"},E.a.createElement("strong",null,"Name : "),E.a.createElement("label",null,this.state.name))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col"},"\xa0\xa0\xa0\xa0\xa0\xa0",E.a.createElement("strong",null,"Bank Name : "),E.a.createElement("label",null,this.state.beneficiary_bank)),E.a.createElement("div",{className:"col left-right"},E.a.createElement("strong",null,"Branch Name : "),E.a.createElement("label",null,this.state.beneficiary_address))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col"},"\xa0\xa0\xa0\xa0\xa0\xa0",E.a.createElement("strong",null,"Account No. : "),E.a.createElement("label",null,"\xa0\xa0\xa0\xa0\xa0\xa0",this.state.acc_number)),E.a.createElement("div",{className:"col left-right"},E.a.createElement("strong",null,"IFCI Code : "),E.a.createElement("label",null,this.state.bank_swift_code))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-lg-10"},E.a.createElement("div",{class:"has-float-label "},E.a.createElement("input",{id:"transaction_no",type:"text",placeholder:" ",name:"transaction_no",class:"form-control"}),E.a.createElement("label",{for:"transaction_no"},"Please enter transaction number"))),E.a.createElement("div",{className:"col-sm-1"})),E.a.createElement("br",null),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-lg-10"},E.a.createElement("div",{class:"has-float-label "},E.a.createElement("input",{id:"transaction_file",type:"file",placeholder:" ",name:"transaction_file",class:"form-control"}),E.a.createElement("label",{for:"transaction_file"},"Please upload transaction file"))),E.a.createElement("div",{className:"col-sm-1"})),E.a.createElement("br",null)),E.a.createElement(A.a.Footer,{className:"text-right"},E.a.createElement("div",{class:"col-12"},E.a.createElement("button",{className:"btn btn-solid",onClick:function(){return e.setState({openTransferModal:!e.state.openTransferModal})}},"Cancel"),"\xa0\xa0",E.a.createElement("button",{id:"UploadFileTrasfer_",className:"btn btn-solid",onClick:this.UploadFileTrasfer},"Submit")))):E.a.createElement(A.a,{show:this.state.openTransferModal,style:{left:"32%",top:"25%"}},E.a.createElement(A.a.Header,null,E.a.createElement(A.a.Title,null),E.a.createElement("div",{class:"col-12"},E.a.createElement("h5",{className:"text-left"},E.a.createElement("strong",null,"Transfer To Account")))),E.a.createElement(A.a.Body,null,E.a.createElement("br",null),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-lg-10"},E.a.createElement("div",{class:"alert alert-info d-none msg_",id:"msg_",role:"alert"})),E.a.createElement("div",{className:"col-sm-1"})),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col text-center"},E.a.createElement("strong",null,"Name : "),E.a.createElement("label",null,this.state.name))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col"},"\xa0\xa0\xa0\xa0\xa0\xa0",E.a.createElement("strong",null,"Bank Name : "),E.a.createElement("label",null,this.state.beneficiary_bank)),E.a.createElement("div",{className:"col left-right"},E.a.createElement("strong",null,"Branch Name : "),E.a.createElement("label",null,this.state.beneficiary_address))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col"},"\xa0\xa0\xa0\xa0\xa0\xa0",E.a.createElement("strong",null,"Account No. : "),E.a.createElement("label",null,this.state.acc_number)),E.a.createElement("div",{className:"col left-right"},E.a.createElement("strong",null,"IFCI Code : "),E.a.createElement("label",null,this.state.bank_swift_code))),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-lg-10"},E.a.createElement("div",{class:"has-float-label "},E.a.createElement("input",{id:"transaction_no",type:"number",placeholder:" ",name:"transaction_no",class:"form-control"}),E.a.createElement("label",{for:"transaction_no"},"Please enter transaction number"))),E.a.createElement("div",{className:"col-sm-1"})),E.a.createElement("br",null),E.a.createElement("div",{className:"row"},E.a.createElement("div",{className:"col-sm-1"}),E.a.createElement("div",{className:"col-lg-10"},E.a.createElement("div",{class:"has-float-label "},E.a.createElement("input",{id:"transaction_file",type:"file",placeholder:" ",name:"transaction_file",class:"form-control"}),E.a.createElement("label",{for:"transaction_file"},"Please upload transaction file"))),E.a.createElement("div",{className:"col-sm-1"})),E.a.createElement("br",null)),E.a.createElement(A.a.Footer,{className:"text-right"},E.a.createElement("div",{class:"col-12"},E.a.createElement("button",{className:"btn btn-solid",onClick:function(){return e.setState({openTransferModal:!e.state.openTransferModal})}},"Cancel"),"\xa0\xa0",E.a.createElement("button",{id:"UploadFileTrasfer_",className:"btn btn-solid",onClick:this.UploadFileTrasfer},"Submit")))))))}}]),a}(p.Component));a.default=Object(v.connect)(function(e){return{languageMaster:e.languageMaster.languageMaster}})(I)}}]);
//# sourceMappingURL=76.858b15b0.chunk.js.map