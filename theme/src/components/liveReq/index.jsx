import React, { Component } from "react";
import "./liveReq.css";
import $ from "jquery";
import { getCookie, setCookie, captureEvent } from "../../functions";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { connect } from 'react-redux';
import ls from 'local-storage';
import axios from "axios";
import { ApiUrl,ImgUrl } from "../../constants/ActionTypes";
import IntlTelInput from 'react-intl-tel-input';
import {getUpdateUser} from "../../actions";
import store from "../../store";
var data = [];
class LiveReq extends Component {
 constructor(props) {
 super(props);
 this.state = {
 price: 0,
 currency: "",
 quantity: '',
 unit: '',
 reqRemark: '',
 catid: '',
 specList: [],
 label1: '',
 label2: '',
 label3: '',
 label4: '',
 label5: '',
 label6: '',
 label7: '',
 slectedSpecs : [],
 mintime: 12,
 maxtime: 72,
 auction_end_date: 72,
 number_error: false,
 brid: '',
 askOtp: false,
 askAuctionInit: '',
 totalPrice: 0,
 minPrice: 1,
 minPriceError: false,
 minAmount: 1,
 prodCurrency: '',
 hasUnit: 0,
 startPrice: this.props.price ? this.props.price.start_price ? this.props.price.start_price > 0 ? this.props.price.start_price : 1 : 1 : 1
 };
 // console.log(this.props.price)
 this.selectUnit = this.selectUnit.bind(this);
 this.intersted = this.intersted.bind(this);
 this.notIntersted = this.notIntersted.bind(this);
 this.submitAddress = this.submitAddress.bind(this);
 this.buyerNotInterested = this.buyerNotInterested.bind(this);
 this.loadRFG = this.loadRFG.bind(this)
 this.askAuctionPopUp = this.askAuctionPopUp.bind(this)
 this.priceEntered = this.priceEntered.bind(this)
 this.specSelect = this.specSelect.bind(this)
 this.checkContact = this.checkContact.bind(this)
 this.selectCurrency = this.selectCurrency.bind(this)
 }


 setStateFromInput = async event => {

 var obj = {};
 obj[event.target.name] = event.target.value;
 await this.setState(obj);
 var temp_total = this.state.quantity * this.state.price;
 
 var min_valid_price = parseFloat(parseFloat(this.state.minPrice)/100) * parseFloat(this.state.startPrice)

 if (getCookie('currency') != 'USD' && this.state.prodCurrency == 'USD'){
 min_valid_price = min_valid_price * 71;
 }
 else if (getCookie('currency') == 'USD' && this.state.prodCurrency != 'USD'){
 min_valid_price = min_valid_price / 71;
 }
 min_valid_price = min_valid_price.toFixed(2);
 this.setState({
 minAmount: min_valid_price
 })
 if ( parseFloat(min_valid_price) > parseFloat(this.state.price) ){
 if (this.state.minPriceError !== false)
 this.setState({
 minPriceError: false
 })
 }else{
 if (this.state.minPriceError !== true)
 this.setState({
 minPriceError: true
 })
 }
 this.setState({
 totalPrice: temp_total.toFixed(2)
 })
};

UNSAFE_componentWillReceiveProps = async (nextProps) => {
//  console.log('UNSAFE_componentWillReceiveProps 1: ', nextProps.showAuctionPop, this.props.askAuction, this.props.showAuctionPop , this.state.askAuctionInit, nextProps)
 if (nextProps.showAuctionPop ===true ) {
 await this.setState({
 askAuctionInit: nextProps.showAuctionPop
 })
 this.intersted();
 // this.hideModal("snackbar");
 // this.showModal("snackbar");
 // this.loadRFG();
 }else{
 if ( ( this.props.askAuction=== true || this.props.askAuction === false ) && ( this.props.askAuction !== this.state.askAuctionInit ) ){
 this.setState({
 askAuctionInit: this.props.askAuction
 }, () => this.askAuctionPopUp())
 }else{
 this.askAuctionPopUp()
 }
 }

 if (this.props.price) {
 if (this.state.unit != this.props.price.unit){
 await this.setState({
 unit: this.props.price.unit && this.props.price.unit!='' ? this.props.price.unit : 'Units',
 hasUnit: this.props.price.unit && this.props.price.unit!='' ? 1 : 0
 } )
 }else if(this.state.unit === '' || this.state.unit === undefined){
 await this.setState({
 unit: 'Units',
 hasUnit: 0
 })
 }
 }else{
 await this.setState({
 unit: 'Units',
 hasUnit : 0
 })
 }
}

 askAuctionPopUp(){
//  console.log('askAuctionPopUp: ', this.props.showAuctionPop , this.state.askAuctionInit)
 var wantAuction = getCookie('wantAuction');
 var doNotWantProductAuction = getCookie('wantAuction_'+this.props.price.id);
 if (this.state.askAuctionInit===false){
 this.showModal('snackbar');
 this.hideModal('askAuction');
 $('.rfq').addClass('d-none');
 }else{
 if (wantAuction){
 if (wantAuction == 0){
 $('.rfq').removeClass('d-none');
 }else{
 if (doNotWantProductAuction && doNotWantProductAuction != ''){
 if ( doNotWantProductAuction == 0)
 $('.rfq').removeClass('d-none');
 else
 this.showModal('askAuction'); 
 }else{
 this.showModal('askAuction'); 
 }
 
 }
 }else{
 //this.showModal('askAuction');
 }
 }

 }

 componentDidMount = async () => {
 

 if (this.props.price.currency){

 this.setState({
 prodCurrency: this.props.price.currency
 })
 }

 this.askAuctionPopUp()
 
 this.setState({
 currency:
 getCookie("currency") && getCookie("currency") != ""
 ? getCookie("currency")
 : "INR"
 });
 //var x = document.getElementById("askAuction");
 // x.className = "show p-1";
 //x.classList.add("show");
 // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

 await axios
 .post(
 `${ApiUrl}/common/auction_creator.php`,
 { security_token: "", plateform_type: "", sellerid: ls.get('sellerid'), type: 1, pid: this.props.price.id },
 { headers: { "Content-Type": "multipart/form-data" } }
 )
 .then(response => {
 
 this.setState({
 specList: response.data.result[1],
 label1: response.data.result[0].label1,
 label2: response.data.result[0].label2,
 label3: response.data.result[0].label3,
 label4: response.data.result[0].label4,
 label5: response.data.result[0].label5,
 label6: response.data.result[0].label6,
 label7: response.data.result[0].label7,
 mintime: response.data.result[2].mintime,
 maxtime: response.data.result[2].maxtime,
 minPrice: response.data.result[2].minprice
 })
 if (response.data.result[2].mintime < parseInt(1) ){
 this.setState({
 auction_end_date: response.data.result[2].maxtime
 })
 }
 // this.setState({
 // data: response.data.result
 // })
 })
 .catch(error => {
 const result = error.response;
 return Promise.reject(result);
 });

 };

 onChange = (err, no, data) => {
 
 this.setState({
 number_error : err,
 mobile: no,
 isoValue : data.iso2,
 dialCode : data.dialCode,
 countryName : data.name.replace(/ *\([^)]*\) */g, "")
 })
}

 priceEntered(id){
 $('#not_loading').removeClass('d-none').addClass('d-none');
 $('#btn_loading').attr('disabled','');
 $('#loading').removeClass('d-none');
 $('.price_error').addClass('d-none').text('');

 if (this.state.minPriceError){
 captureEvent( "product", "auction", '{"price":"' +
 JSON.stringify(this.state.price) +
 '", "currency":"' +
 this.state.currency +
 '", "qty":"' +
 this.state.quantity +
 '", "unit":"' +
 this.state.unit +
 '", "auction_duration":"' +
 this.state.auction_end_date +
 '"}', "success", ls.get("sellerid"), getCookie("mhinpbnb")
 );
 if (this.state.mintime > 0){
 if ( parseInt($('#auction_end_date').val()) >= this.state.mintime && parseInt($('#auction_end_date').val()) <= this.state.maxtime){
 this.setState({
 auction_end_date: $('#auction_end_date').val()
 })
 
 this.goToSpecTab();

 }else{
 $('.price_error').removeClass('d-none').text('Auction duration should be between min: '+this.state.mintime+' and max: '+this.state.maxtime);
 this.loaders();
 }
 }else{
 this.goToSpecTab();
 }
 }else{
 $('.price_error').removeClass('d-none').text('Please enter min amount of '+this.state.minAmount);
 this.loaders();
 }
 
 };

 goToSpecTab = () => {
 if (this.state.price && this.state.quantity && this.state.unit && this.state.price > 0 && this.state.quantity > 0 && this.state.totalPrice > 0){
 // $("#snackbar").css({ bottom: "51%" });
 this.hideModal("snackbar");
 this.showModal("snackbar2");
 $('.price_error').addClass('d-none').text('');
 this.loaders();
 }else{
 $('.price_error').removeClass('d-none').text('Please Enter Valid Details');
 this.loaders();
 }
 }

 

loaders = () => {
 $('#not_loading').removeClass('d-none');
 $('#loading').removeClass('d-none').addClass('d-none');
 $('#btn_loading').removeAttr('disabled');
}

 loadRFG(){
 if (!$('.snackbar').hasClass('.d-none')){
 this.showModal('snackbar');
 $('.rfq').addClass('d-none');
 }
 };

 notIntersted(id){
 captureEvent( "product", "auction", 'interested', "No", ls.get("sellerid"), getCookie("mhinpbnb") );

 this.hideModal(id);
 $(".rfq").removeClass("d-none");
 this.props.undoCallAuction()
 };

 buyerNotInterested(id){
 this.props.undoCallAuction()
 this.notIntersted(id);
 if ($('#do_not_ask').val()){
 captureEvent( "product", "auction", this.props.price.id, "Do Not Show", ls.get("sellerid"), getCookie("mhinpbnb")
 );
 setCookie('wantAuction', 0, 1);
 }else{
 captureEvent( "product", "auction", this.props.price.id, "Not Interested", ls.get("sellerid"), getCookie("mhinpbnb")
 );
 }
 setCookie('wantAuction_'+this.props.price.id, 0 , 1);
 }

 intersted(){

 captureEvent( "product", "auction", this.props.price.id, "Interested", ls.get("sellerid"), getCookie("mhinpbnb")
 );
 this.hideModal("askAuction");
 this.showModal("snackbar");
 $(".rfq").addClass("d-none");
 };

 showModal = nameOfClass => {
 var x = document.getElementById(nameOfClass);
 x.classList.add("show");
 };

 hideModal = nameOfClass => {
 var x = document.getElementById(nameOfClass);
 x.classList.remove("show");
 };

 selectCurrency(val){
 this.setState({
 currency: val
 });
 };

 selectUnit(val){
 this.setState({
 unit: val
 });
 };

 specSelect(val){
 var specSelected = this.state.slectedSpecs;
 specSelected.indexOf(val) === -1 ? specSelected.push(val) : specSelected.splice(specSelected.indexOf(val), 1);
 this.setState({
 slectedSpecs: specSelected
 })

 }

 specSubmit = () => {

 this.iniLoader('snackbar2');

 if ( ls.get('sellerid') ){
 this.submitReqData();
 }else{
 this.hideModal("snackbar2");
 this.showModal("snackbar_user");
 $('.spec_error').addClass('d-none').text('');
 this.loadersSubmit('snackbar2');
 }
 }

 checkContact(){

 this.iniLoader('snackbar_user');
 var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 if (re.test(this.state.email) && this.state.number_error)
 this.submitReqData()
 else{
 $('.submit_error').removeClass('d-none').text('Please Enter valid contact details');
 this.loadersSubmit('snackbar_user');
 }
 }

 loadersSubmit = (id) => {
 $('#'+id).find('#not_loading').removeClass('d-none');
 $('#'+id).find('#loading').removeClass('d-none').addClass('d-none');
 $('#'+id).find('#btn_loading').removeAttr('disabled');
 }

 iniLoader = (id) => {
 $('#'+id).find('#not_loading').removeClass('d-none').addClass('d-none');
 $('#'+id).find('#btn_loading').attr('disabled','');
 $('#'+id).find('#loading').removeClass('d-none');
 $('#'+id).find('.submit_error').addClass('d-none').text('');
 }

 submitReqData = () => {
 
 this.iniLoader('snackbar2');
 this.iniLoader('snackbar_user');

 try {
 axios.post(`${ApiUrl}/common/create_auction.php`,{plateform_type:'', security_token:'', 
 sellerid:ls.get('sellerid'), 
 price:this.state.price, 
 currency: this.state.currency, 
 email:this.state.email, 
 mobile: this.state.mobile, 
 qty: this.state.quantity, 
 unit: this.state.unit, 
 remark: this.state.reqRemark ,
 prodId: this.props.price.id,
 countryid: getCookie('countryid'),
 country: getCookie('country_code'),
 country_name: getCookie('country_name'),
 visitorid: getCookie('mhinpbnb'),
 currentUrl: window.location.href,
 slectedSpecs: this.state.slectedSpecs,
 auction_end_time: this.state.auction_end_date,
 campaign: getCookie('cname'),
 target: getCookie('target'),
 source: getCookie('source')
 }, {headers: {'Content-Type': 'multipart/form-data'}})
 .then(async response => {
 if (response.data.statusId == 1){
// console.log(response.data,438);
if(response.data.result.user == 'new_user'){
    // console.log('new_user',440);
    if(getCookie('refid') != '' && getCookie('refid') != 'null' && getCookie('refid') !== null){
        axios.post(`${ImgUrl}/beta_api/manage_ref_log.php`,
        {
            "sellerid":response.data.result.sellerid,
            "referersellerid":getCookie('refid'),
            "device":"web"
        },
        {headers: {'Content-Type': 'multipart/form-data'}}
        )
        .then(async result => {
            // console.log(result,451);
        }).catch(data => {
            
        })
    }
}
 if (response.data.result){
 if (response.data.result[0]){
 await this.setState({
 brid: response.data.result[0]
 })
 }
 if (parseInt(response.data.result['otp_verify']) != 1){
 await this.setState({
 askOtp: true
 })
 }
 }


 if (!ls.get('sellerid') || ls.get('sellerid') == ''){
 if (response.data.result.sellerid && response.data.result.sellerid != '')
 // setCookie('mhinpbn', response.data.result.sellerid)
 store.dispatch(getUpdateUser(response.data.result.sellerid))
 }

 $('#snackbar2').find('.submit_error').addClass('d-none').text('');
 $('#snackbar_user').find('.submit_error').addClass('d-none').text('');
 this.hideModal('snackbar_user');
 this.hideModal('snackbar2');
 
 this.loadersSubmit('snackbar2');
 this.loadersSubmit('snackbar_user');
 this.showModal('snackbar_address');
 
 }else{
    //  console.log(response.data.result,487,response.data.result,typeof response.data.result);
     if(typeof response.data.result === 'object' && response.data.result.error_msg != ''){
        $('#snackbar2').find('.submit_error').removeClass('d-none').text(response.data.result.error_msg);
        $('#snackbar_user').find('.submit_error').removeClass('d-none').text(response.data.result.error_msg);
     }else{
        $('#snackbar2').find('.submit_error').removeClass('d-none').text('Something went wrong Please try again.');
        $('#snackbar_user').find('.submit_error').removeClass('d-none').text('Something went wrong Please try again.');
     }
 
 this.loadersSubmit('snackbar2');
 this.loadersSubmit('snackbar_user');
 }
 })
 .catch(error => {
 const result = error.response;
 $('#snackbar2').find('.submit_error').removeClass('d-none').text('Something went wrong Please try again.');
 $('#snackbar_user').find('.submit_error').removeClass('d-none').text('Something went wrong Please try again.');
 this.loadersSubmit('snackbar2');
 this.loadersSubmit('snackbar_user');
 });
 
 } catch (e){
 $('#snackbar2').find('.submit_error').removeClass('d-none').text('Something went wrong Please try again.');
 $('#snackbar_user').find('.submit_error').removeClass('d-none').text('Something went wrong Please try again.');
 this.loadersSubmit('snackbar2');
 this.loadersSubmit('snackbar_user');
 console.log(`😱 Axios request failed: ${e}`);
 }

 }

 submitAddress(){

 this.iniLoader('snackbar_address');

 if (this.state.address!='' && this.state.address &&
 this.state.state!='' && this.state.state &&
 this.state.city!='' && this.state.city &&
 this.state.pincode!='' && this.state.pincode
 ) {
 try {
 axios.post(`${ApiUrl}/common/shipping_address.php`,{plateform_type:'', security_token:'', 
 sellerid:ls.get('sellerid'), 
 city:this.state.city, 
 state: this.state.state, 
 address:this.state.address, 
 pincode: this.state.pincode, 
 askOtp: this.state.askOtp,
 brid: this.state.brid, 
 otp: this.state.otp,
 country_name: getCookie('country_name'),
 countryid: getCookie('countryid'),
 visitorid: getCookie('mhinpbnb')
 }, {headers: {'Content-Type': 'multipart/form-data'}})
 .then(response => {
 if (response.data.statusId == 1){
 setCookie('mhinpbn', ls.get('sellerid'))
 //this.loaders();
 this.loadersSubmit('snackbar_address');
 this.hideModal('snackbar_address');
 this.showModal('snackbar_ty');
 
 }else if (response.data.message){
 $('.address_error').removeClass('d-none').text(response.data.message);
 this.loadersSubmit('snackbar_address');
 }else{
 $('.address_error').removeClass('d-none').text('Something went wrong Please try again.');
 this.loadersSubmit('snackbar_address');
 }
 })
 .catch(error => {
 const result = error.response;
 $('.address_error').removeClass('d-none').text('Something went wrong Please try again.');
 this.loadersSubmit('snackbar_address');
 });
 
 } catch (e){
 $('.address_error').removeClass('d-none').text('Something went wrong Please try again.');
 this.loadersSubmit('snackbar_address');
 console.log(`😱 Axios request failed: ${e}`);
 }
 }else{
 $('.address_error').removeClass('d-none').text('please enter valid address');
 this.loadersSubmit('snackbar_address');
 }
 }

 render() {
    //  console.log(this.props.price,this.props.price.sellerid,568,ls.get('log_id'),568);
 const {translate} = this.props;

 const InputProps = {
 required: true
 };

 return (
 <React.Fragment >
 <div id="snackbarWrapper">
 {
    ( ls.get('log_id') !== null && ls.get('log_id') != '') 
    ? 
    (this.props.price.sellerid != ls.get('log_id'))
    ? ''
    // <div
    //     className="rfq p-2 text-center mouse_pointer 1"
    //     onClick={this.loadRFG.bind(this)}
    //     >
    //     E-Auction
    // </div>
    : ''
    : 
    // <div
    //     className="rfq p-2 text-center mouse_pointer 2"
    //     onClick={this.loadRFG.bind(this)}
    //     >
    //     E-Auction
    // </div>
    ''
 }

 <div id="askAuction" className="p-1">
 <div className="p-2">
 {this.state.label1}
 </div>

 <div className="p-1 d-flex justify-content-center">
 <div
 className="btn btn-solid mouse_pointer"
 onClick={this.intersted.bind(this)}
 >
 Yes
 </div>
 <div
 className="btn btn-solid ml-1 mouse_pointer"
 onClick={this.buyerNotInterested.bind(this,'askAuction')}
 >
 No
 </div>
 </div>

 <div className="p-1 dont_ask_wrapper d-flex justify-content-center" >
 <ul>
 <li>
 <div className="radio-option dont_ask" >
 <input className="mr-2" type="checkbox" name={`do_not_ask`} id={`do_not_ask`} onClick={this.DoNotShow} />
 <label htmlFor={`do_not_ask`}>Do Not Ask Again</label>
 </div>
 </li>
 </ul>
 </div>
 
 </div>

 <div id="snackbar" className="p-1">
 <div className="d-flex">
 <div className="p-2">
 {this.state.label2}
 </div>
 <span className="mouse_pointer" onClick={this.notIntersted.bind(this,'snackbar')}>
 X
 </span>
 </div>
 <div className="p-1 d-flex">
 <div className="dropdown">
 <a
 className="btn btn-secondary dropdown-toggle"
 href={() => null}
 role="button"
 id="dropdownMenuLink"
 data-toggle="dropdown"
 aria-haspopup="true"
 aria-expanded="false"
 >
 {this.state.currency}
 </a>
 <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
 <span
 className="dropdown-item"
 onClick={this.selectCurrency.bind(this,"INR")}
 >
 INR
 </span>
 <span
 className="dropdown-item"
 onClick={this.selectCurrency.bind(this,"USD")}
 >
 USD
 </span>
 </div>
 </div>
 
 <div className="has-float-label w-90 h_100">
 <input
 type="tel"
 name="price"
 id="price"
 placeholder=" "
 value={this.state.price}
 onChange={this.setStateFromInput}
 className="form-control h_100"
 maxLength="10"
 />
 <label className="text-dark" htmlFor="price">{`${translate("Price")} / ${this.state.unit} `}</label>
 </div>
 </div>
 <div className="p-1 d-flex">

 <div className="dropdown">
 <a
 className={ this.state.hasUnit == 1 ? "btn btn-secondary dropdown-toggle disabled" : "btn btn-secondary dropdown-toggle" }
 href={() => null}
 role="button"
 id="dropdownMenuLink"
 data-toggle="dropdown"
 aria-haspopup="true"
 aria-expanded="false"
 >
 {/* {console.log('unit',this.state.unit)} */}
 {this.state.unit}
 </a>
 <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
 {this.props.data.units?
 this.props.data.units.map( (val, index) => 
 <span
 className="dropdown-item"
 key={index}
 onClick={this.selectUnit.bind(this,val.label)}
 >
 {val.label}
 </span>)
 : ''}
 </div>
 </div>

 <div className="has-float-label w-90 h_100">
 <input
 id="quantity"
 type="tel"
 placeholder=" "
 name="quantity"
 value={this.state.quantity}
 onChange={this.setStateFromInput}
 maxLength="10"
 className="form-control h_100"
 required
 />
 <label className="text-dark" htmlFor="quantity">{translate("Quantity")}</label>
 </div>

 
 
 </div>
 { this.state.totalPrice > 0 ? <div className="totalPrice small" >Total Price: {this.state.currency} {this.state.totalPrice}</div> : "" }

 {/* <div className="has-float-label w-90 h_100">
 <input type="tel" min="12" max="72" name="aution_end_date" id="aution_end_date" className="" />
 <label className="text-dark" htmlFor="aution_end_date">{`${translate("Auction Duration")} (in hours)`}</label>
 </div> */}

 {this.state.mintime > 0? 
 <div className="w-90 h_100">
 <div >{`${translate("Auction Duration")} (in hours)`}</div>
 <input type="tel" min="12" max="72" name="auction_end_date" id="auction_end_date" className="" />
 </div>
 : '' 
 }

 
 <div className="col-12 my-1 card-text text-right mt-4">
 <div className="price_error text-left small alert alert-danger d-none" >Please fill all the details to continue!</div>
 <button id="btn_loading" className="btn btn-solid" onClick={this.priceEntered.bind(this,"price")}>
 <div id="loading" className=" spinner-border d-none" role="status">
 <span className="sr-only">Loading...</span>
 </div>
 <div id="not_loading">Next</div>
 </button> 
 </div>
 </div>
 {/* <i
 className="fa fa-arrow-right right_pointer_price ml-4 lh-35 mouse_pointer"
 onClick={() => this.priceEntered("price")}
 ></i> */} 
 
 {/* <div className="p-1 text-right">
 {console.log(this.props.price)}
 {this.props.price?
 this.props.price.map( val => 
 <span className="badge badge-light mouse_pointer mx-1" onClick={() => this.priceSelected("price",val.currency+ ' '+val.eachunit)}> {val.currency+ ' '+val.eachunit }</span> 
 
 )
 : '' }
 </div> */}
 

 <div id="snackbar2" className="p-1">

 <div className="d-flex">
 <div className="p-2 text-left">
 {/* What is the base price, would you like to initiate competative
 option? */}
 {this.state.label3}
 </div>
 <span className="mouse_pointer" onClick={this.notIntersted.bind(this,'snackbar2')}>
 X
 </span>
 </div>

 <div className="text-left">
 <ul>
 
 {this.state.specList && this.state.specList.length>0?
 Object.keys(this.state.specList).map((val, index) => 

 <li key={index}>
 <div className="radio-option specsList">
 <input className="mr-2" type="checkbox" name={`specs${index}`} id={`specs${index}`} onClick={this.specSelect.bind(this,this.state.specList[index].id)} />
 <label htmlFor={`specs${index}`}>{this.state.specList[index].specs}</label>
 </div>
 </li>
 
 ): ''}
 </ul>
 </div>
 <div className="border-top text-left p-2">{this.state.label4}</div>
 <div className="has-float-label m-1">
 <textarea
 type="text"
 name="reqRemark"
 id="reqRemark"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 >
 </textarea>
 <label className="text-dark" htmlFor="reqRemark">
 {"Remark"}
 </label>
 </div>
 <div className="col-12 my-1 card-text text-right">
 <div className="spec_error text-left small alert alert-danger d-none" >Please fill remark to continue!</div>
 <div className="submit_error text-left small alert alert-danger d-none" >Please fill all the details to continue!</div>
 <button id="btn_loading" className="btn btn-solid" onClick={this.specSubmit}>
 <div id="loading" className=" spinner-border d-none" role="status">
 <span className="sr-only">Loading...</span>
 </div>
 <div id="not_loading">
 Continue
 </div>
 </button> 
 </div>
 </div>
 

 <div id="snackbar_user" className="p-1">
 <div className="d-flex">
 <div className="p-2">
 {this.state.label5}
 </div>
 <span className="mouse_pointer" onClick={this.notIntersted.bind(this,'snackbar_user')}>
 X
 </span>
 </div>
 <div className="has-float-label m-1">
 {/* <input
 type="tel"
 name="mobile"
 id="mobile"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 /> */}
 <IntlTelInput
 containerClassName="intl-tel-input"
 inputClassName="form-control"
 fieldId="mobile"
 geoIpLookup="true"
 numberType="MOBILE"
 autoPlaceholder="true"
 onPhoneNumberChange={this.onChange}
 onPhoneNumberBlur={this.onChange}
 defaultCountry={`${getCookie('country_code') ? (getCookie('country_code').toLowerCase()): 'in'}`}
 // defaultValue={mobile}
 numberType="MOBILE"
 telInputProps={InputProps}
 // value={this.state.value}
 
 />
 <label className="text-dark" htmlFor="mobile">
 {"Mobile Number"}
 </label>
 </div>
 <div className="has-float-label m-1">
 <input
 type="email"
 name="email"
 id="email"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 />
 <label className="text-dark" htmlFor="email">
 {"Email"}
 </label>
 </div>

 <div className="col-12 my-1 card-text text-right">
 <div className="submit_error text-left small alert alert-danger d-none" >Please fill all the details to continue!</div>
 <button id="btn_loading" className="btn btn-solid" onClick={this.checkContact.bind(this)}>
 <div id="loading" className=" spinner-border d-none" role="status">
 <span className="sr-only">Loading...</span>
 </div>
 <div id="not_loading">Submit</div>
 </button> 
 </div>

 </div>



 <div id="snackbar_address" className="p-1">
 <div className="d-flex">
 <div className="p-2">
 {this.state.label6}
 </div>
 <span className="mouse_pointer" onClick={this.notIntersted.bind(this,'snackbar_address')}>
 X
 </span>
 </div>
 { this.state.askOtp?
 <React.Fragment>
 <div> We have sent you otp on your email / mobile. </div>
 
 <div className="has-float-label m-1">
 <input
 type="password"
 name="otp"
 id="otp"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 />
 <label className="text-dark" htmlFor="otp">
 {"Otp or Password"}
 </label>
 </div>
 </React.Fragment>
 : ''}

 <div className="has-float-label m-1">
 <input
 type="text"
 name="address"
 id="address"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 />
 <label className="text-dark" htmlFor="address">
 {"Address"}
 </label>
 </div>
 <div className="has-float-label m-1">
 <input
 type="text"
 name="city"
 id="city"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 />
 <label className="text-dark" htmlFor="city">
 {"City"}
 </label>
 </div>
 <div className="has-float-label m-1">
 <input
 type="text"
 name="state"
 id="state"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 />
 <label className="text-dark" htmlFor="state">
 {"State"}
 </label>
 </div>
 <div className="has-float-label m-1">
 <input
 type="text"
 name="pincode"
 id="pincode"
 placeholder=" "
 onChange={this.setStateFromInput}
 className="form-control input-number"
 />
 <label className="text-dark" htmlFor="pincode">
 {"Pincode"}
 </label>
 </div>

 <div className="col-12 my-1 card-text text-right">
 <div className="address_error text-left small alert alert-danger d-none" >Please fill all the details to continue!</div>
 <button id="btn_loading" className="btn btn-solid" onClick={this.submitAddress.bind(this)}>
 <div id="loading" className=" spinner-border d-none" role="status">
 <span className="sr-only">Loading...</span>
 </div>
 <div id="not_loading">Submit</div>
 </button> 
 </div>

 </div>



 <div id="snackbar_ty" className="thank_you_auction_submit p-1 alert alert-success">
 <div className="d-flex">
 <div className="p-2" dangerouslySetInnerHTML={{ __html:this.state.label7}}>
 
 </div>
 
 <span className="mouse_pointer" onClick={this.notIntersted.bind(this,'snackbar_ty')}>
 X
 </span>
 </div>
 {this.state.brid && this.state.brid != ''?
 <div> 
 #{this.state.brid} is your Auction Number.
 </div>
 : ''}
 </div>
 

 {/* <div id="snackbar">By When do you what this to get delivered?</div>
 <input type="date" name="date" id="date" />

 <div id="snackbar">Provide your mobile and email so that we can connect you to our suppliers.</div>
 <input type="mobile" name="mobile" id="mobile" />
 <input type="email" name="email" id="email" /> */}
 </div>
 </React.Fragment >
 );
 }
}

const mapStateToProps = (state) => {
 return {
 data: state.units,
 languageMaster: state.languageMaster.languageMaster,
 user:state.user
 } 
 
}

export default withTranslate(connect(mapStateToProps)(LiveReq));