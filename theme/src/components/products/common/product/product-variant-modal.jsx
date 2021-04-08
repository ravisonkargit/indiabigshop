import React, { Component } from "react";
import ls from "local-storage";
import { setCookie, getCookie } from "../../../../functions";
import Modal from "react-responsive-modal";
import { isMobile } from "react-device-detect";
import $ from "jquery";
import * as constantType from "../../../../constants/variable";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import "./product.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Axios from "axios";
import { imgUrl, apiUrl } from "../../../../constants/variable";

class ProductVariantModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      priceArray: null,
      variation: null,
      sizes: null,
      reload: 0,
      filterSize: null,
      // quantity:0,
      currency: "INR",
      country_to: 91,
      moq_qty: 0,
      shipping_charge: 120,
      validate:false,
      validate_text:'Please select quantity',
      country_code:'in',
      type:0
    };
    this.plusQty = this.plusQty.bind(this);
    this.minusQty = this.minusQty.bind(this);
    this.changeQty = this.changeQty.bind(this);
    this.changesize = this.changesize.bind(this);
    this.checkoutProcedure = this.checkoutProcedure.bind(this);
  }
  async componentDidMount() {
    // console.log("componentDidMount",this.props);
    this.setInitialPrice();
    // this.changesize(this.props.varData.variation[0]);
    this.filterSize();
  }
  setInitialPrice = async () => {
    var multi_array = [];
    if(this.state.priceArray !== null){
      this.state.priceArray.map((eachvalue, keys) => {
        console.log("productarray",this.props.varData.productarray);
        var product_data = this.props.varData.productarray[eachvalue.id];
        if(product_data != undefined){
          
          var disc = product_data.disscount_info[0].discount;
          //console.log("dicount",disc,"currencyValue",this.props.currencyValue[0]['INR']);
          
        }        
      //   var disco = product_data.disscount_info[0];
      //  console.log("disscount_info",disco);
        //console.log("discount",disc,"currencyValue",this.props.currencyValue[0]['INR']);
        var objects = {
          id: eachvalue.id,
          quantity: eachvalue.quantity,
          selling_price: parseFloat(eachvalue.selling_price),
          mrp: parseFloat(eachvalue.mrp),
          calcprice: getCookie('currency') == 'INR' ? parseFloat(eachvalue.selling_price) - (parseFloat(eachvalue.selling_price)*disc/100 ): parseFloat(eachvalue.selling_price)/this.props.currencyValue[0]['INR'],
          selling_price_usd: parseFloat(eachvalue.selling_price)/this.props.currencyValue[0]['INR']
        };
        multi_array[eachvalue.id] = objects;
      });
      //console.log("---------------------priceArray if--------------",this.state.priceArray);
    }else{
      this.props.varData.variation.map((eachvalue, keys) => {
        var product_data = this.props.varData.productarray[eachvalue.product_id];
        // console.log(product_data.disscount_info);
        var objects = {
          id: eachvalue.product_id,
          quantity: 0,
          selling_price: parseFloat(eachvalue.selling_price),
          mrp: parseFloat(eachvalue.mrp),
          calcprice: getCookie('currency') == 'INR' ? parseFloat(eachvalue.selling_price) : parseFloat(eachvalue.selling_price)/this.props.currencyValue[0]['INR'],
          selling_price_usd: parseFloat(eachvalue.selling_price)/this.props.currencyValue[0]['INR']
        };
        multi_array[eachvalue.product_id] = objects;
      });
      //console.log("---------------------priceArray else--------------",this.state.priceArray);
    }
    await this.setState({
      priceArray: multi_array,
      variation: this.props.varData.variation,
      currency: getCookie("currency"),
      country_to: getCookie("countryid"),
      moq_qty: parseInt(this.props.varData.parentproductarray.qty),
      validate_text:`Select quantity (MOQ ${parseInt(this.props.varData.parentproductarray.qty)} ${this.props.varData.parentproductarray.unit}) to Proceed`
    });
    //console.log("---------------------priceArray--------------",this.state.priceArray);
  };
  async componentDidUpdate(nextProps) {
    // console.log(nextProps);
    if (this.state.priceArray !== null && this.state.reload == 0) {
      this.calculateHolePrice(this.state.priceArray);
      this.setState({ reload: 1 });
    }
    if (
      this.props.varData.allowVariantPopup !==
      nextProps.varData.allowVariantPopup
    ) {
      // console.log('changed');
      this.setInitialPrice()
      if (this.props.varData.variation[0].variation2 != '' && this.props.varData.variation[0].variation2 != null){
        this.changesize(this.props.varData.variation[0].variation2);
      }
      await this.setcurrency();
      this.calculateHolePrice(this.state.priceArray);
      // this.setInitialPrice();
    }
    // console.log(nextProps,this.props);
  }
  plusQty = async (product_id) => {
    console.log("------------------test----------------------",product_id);
    var product_data = this.props.varData.productarray[product_id];
    var new_array = this.state.priceArray;
    var objects = {
      id: product_id,
      quantity: parseInt(
        parseInt(this.state.priceArray[product_id].quantity) + 1
      ),
      selling_price: this.state.priceArray[product_id].selling_price,
      mrp: this.state.priceArray[product_id].mrp,
      selling_price_usd: parseFloat(this.state.priceArray[product_id].selling_price)/this.props.currencyValue[0]['INR']
    };
    new_array[product_id] = objects;
    this.setState({
      priceArray: new_array,
    });
    this.calculateHolePrice(new_array);
  };
  setcurrency = () => {
    this.setState({
      currency:getCookie('currency'),
      country_to:getCookie('countryid'),
      country_code:getCookie('country_code')
    })
  }
  minusQty = async (product_id) => {
    var product_data = this.props.varData.productarray[product_id];
    if (this.state.priceArray[product_id].quantity > 0) {
      var new_array = this.state.priceArray;
      var objects = {
        id: product_id,
        quantity: parseInt(
          parseInt(this.state.priceArray[product_id].quantity) - 1
        ),
        selling_price: this.state.priceArray[product_id].selling_price,
        mrp: this.state.priceArray[product_id].mrp,
        calcprice: this.state.priceArray[product_id].calcprice,
        selling_price_usd: parseFloat(this.state.priceArray[product_id].selling_price)/this.props.currencyValue[0]['INR']
      };
      new_array[product_id] = objects;
      this.setState({
        priceArray: new_array,
      });
      this.calculateHolePrice(new_array);
    }
  };
  changeQty = async (product_id,e) => {
    //console.log("------------------123--------------",product_id);
    var product_data = this.props.varData.productarray[product_id];
    var new_quantity = e.target.value !== '' && e.target.value >= 0 ? e.target.value : 0;
    // console.log(new_quantity);
    if (new_quantity >= 0 && e.target.value !== undefined) {
      var new_array = this.state.priceArray;
      var objects = {
        id: product_id,
        quantity: new_quantity,
        selling_price: this.state.priceArray[product_id].selling_price,
        mrp: this.state.priceArray[product_id].mrp,
        calcprice: this.state.priceArray[product_id].calcprice,
        selling_price_usd: parseFloat(this.state.priceArray[product_id].selling_price)/this.props.currencyValue[0]['INR']
      };
      new_array[product_id] = objects;
      this.setState({
        priceArray: new_array,
      });
      this.calculateHolePrice(new_array);
    }
  };
  changesize = (arr) => {
    // console.log(arr,73);
    $(".all_prod").addClass("d-none");
    $(".com-val")
      .addClass("border")
      .removeClass("selectvariant");
    $("." + arr).removeClass("d-none");
    $("#" + arr).toggleClass("border selectvariant");
  };
  //   filter_array_by_size = (size) => {
  //    var new_data =  this.props.varData.variation.filter((value)=>{
  //         if(value.variation2 == size) return value
  //    });
  // //    console.log(new_data);
  //    return new_data;
  //   }
  calculateHolePrice = async (totalprice) => {
    var new_total_price = 0;
    var total_quantity = 0;
    var newPricearray = totalprice;
    var type = 0;
    totalprice.map(
      (value, index) => {
        var quantity = value.quantity;
        var selling_price = this.state.currency == 'INR' ? value.selling_price : value.selling_price_usd;
        // console.log(selling_price,'selling_price',this.state.currency);
        if (quantity > 0) {
          type += 1;
          var range_array = this.props.varData.productarray[value.id]
            .disscount_info;
          
          if (range_array !== null) {
            // console.log('start')
            var i;
            for (i = 0; i < range_array.length; i++) {
              //console.log("------------------123--------------",quantity,range_array[i].from_qty,range_array[i].to_qty);
              // console.log('start for',quantity)
              if (
                parseInt(quantity) >= parseInt(range_array[i].from_qty) &&
                parseInt(quantity) <= parseInt(range_array[i].to_qty)
              ) {
                
                // if(this.state.currency == 'INR'){
                 console.log("------------------123--------------",range_array[i].discount);
                  var sellingprice = parseFloat(
                    parseFloat(selling_price) -
                      parseFloat(selling_price) *
                        parseFloat(range_array[i].discount / 100)
                  );
                
                  
                // }else{
                //   var sellingprice = parseFloat(
                //     parseFloat(selling_price) -
                //       parseFloat(selling_price) *
                //         parseFloat(range_array[i].discount / 100)
                //   );
                // }
                
                // console.log(
                //   "for if",
                //   sellingprice,
                //   parseInt(sellingprice) * parseInt(quantity),
                //   range_array[i].from_qty,
                //   range_array
                // );
                new_total_price =
                  new_total_price + sellingprice * parseInt(quantity);
                total_quantity += parseInt(quantity);
                var objects = {
                  id: value.id,
                  quantity: quantity,
                  selling_price: value.selling_price,
                  mrp: value.mrp,
                  calcprice: sellingprice,
                  selling_price_usd: value.selling_price_usd
                };
                newPricearray[value.id] = objects;
                break;
              } else if (i == parseInt(range_array.length - 1)) {
                //console.log("-------------else if--------------");
                // if(i == parseInt(range_array.length-1)){

                  var sellingprice = parseFloat(
                    parseFloat(selling_price) -
                      parseFloat(selling_price) *
                        parseFloat(range_array[i].discount / 100)
                  );

                //var sellingprice = parseFloat(selling_price);
                // console.log(
                //   "for else",
                //   sellingprice,
                //   parseInt(sellingprice) * parseInt(quantity),
                //   range_array[i].from_qty,
                //   range_array
                // );
                new_total_price =
                  new_total_price + sellingprice * parseInt(quantity);
                total_quantity += parseInt(quantity);
                var objects = {
                  id: value.id,
                  quantity: quantity,
                  selling_price: value.selling_price,
                  mrp: value.mrp,
                  calcprice: sellingprice,
                  selling_price_usd: value.selling_price_usd
                };
                newPricearray[value.id] = objects;
                // }
              }
            }
          } else {
            //console.log("-------------else--------------");
            var sellingprice = parseFloat(selling_price);
            // console.log(
            //   "no range",
            //   sellingprice,
            //   parseInt(sellingprice) * parseInt(quantity)
            // );
            new_total_price += sellingprice * parseInt(quantity);
            total_quantity += parseInt(quantity);
            var objects = {
              id: value.id,
              quantity: quantity,
              selling_price: value.selling_price,
              mrp: value.mrp,
              calcprice: parseFloat(sellingprice),
              selling_price_usd: value.selling_price_usd
            };
            newPricearray[value.id] = objects;
          }
        }
        // console.log(new_total_price, "loop");
      },
      () => {
        // console.log(new_total_price, "inside callback");
      }
    );
    this.setState({
      totalPrice: new_total_price,
      total_quantity: total_quantity,
      priceArray: newPricearray,
      validate: total_quantity >= this.state.moq_qty ? true : false,
      type:type
    });
    // console.log(new_total_price, newPricearray, "after loop");
  };
  filterSize = () => {
    var arr = [];
    this.props.varData.variation.map((vals, keys) => {
      arr.push(vals.variation2);
    });
    var filteredArray = arr.filter(function(item, pos) {
      // return arr.indexOf(item) && item != null && item != '' == pos;
      if (item != null && item != '' && arr.indexOf(item) == pos) return item
    });
    this.setState({
      filterSize: filteredArray,
    });
    // console.log( filteredArray,322,'product-variant-modal' );
  };
  checkoutProcedure = async () => {
    if (this.state.total_quantity >= this.state.moq_qty) {
      var ele = document.getElementById('proceed_id');
      ele.setAttribute('disabled','true');
      var new_array = [];
      this.state.priceArray.map((val,keys)=>{
        new_array.push(val);
      })
    //  console.log('valid qty',new_array);
      // return false;
      Axios.post(
        `${apiUrl}cart_procedure_for_variant_products.php`,
        {
          sellerid:ls.get('log_id'),
          security_token:'',
          plateform_type:'',
          currency:this.state.currency,
          country_to:getCookie('countryid'),
          parent_product_id:this.props.varData.parentproductarray.id,
          product_array:new_array,
          visitor_id:getCookie('mhinpbnb'),
          amount:this.state.totalPrice
        },
        {headers:{"Content-Type":"multipart/form-data"}}
      ).then(async (response) =>{
        ele.removeAttribute('disabled','true');
          // console.log(response);
          if(response.data.statusId == "1"){
              //window.location.href="/cart.html";
              this.props.history.push({
                // pathname: "/cart.html",
                //pathname: "/start-order/"+ Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8) +".html",
                pathname: "/start-order.html",
                state: {
                 totalCartValue: this.state.totalCartValue,
                 totalProductCost: parseFloat(this.state.totalProductCost).toFixed(
                   2
                 ),
                 totalShippingCost: this.state.totalShippingCost,
                 finalShippingCost: this.state.totalShippingCost,
                 cartItems: this.state.cartItems,
                 countryName: this.state.shippingCountryName,
                 symbol: this.state.symbol,
                 cartid: this.state.cartid,
                 //pixeldata: pixeldata,
                 shippingCharges: this.state.shippingCharges,
                 inrValue: this.state.inrValue,
                 totalCartStaticValue: this.state.totalCartStaticValue,
                 //cashback_amount_inr: cashback_amount_inr,
                 //cashback_amount_usd: cashback_amount_usd,
                 txn_type: this.state.txn_type,
                },
               });
          }else{
            $('#error_label').removeClass('d-none');
          }
      })
    } else {
      //console.log('invalid qty')
    }
  };

  render() {
    // console.log(this.state, "render");
    const { translate } = this.props;
    return (
      <div>
        {this.state.variation !== null && this.state.priceArray !== null ? (
          <Modal
            open={this.props.varData.allowVariantPopup}
            onClose={() => ""}
            center
            className="cart-modal"
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content min-modal-size">
                <div className="modal-header">
                <h5 className="modal-title">{`${this.props.varData.parentproductarray.name.substring(0,60)}... (Min.Order: ${this.props.varData.parentproductarray.qty}/${this.props.varData.parentproductarray.unit})`}</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={this.props.closemodal}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body modal1">
                  <div className="container-fluid p-0">
                    <div className="row mx-2 my-2">
                      {
                        this.state.filterSize != null && this.state.filterSize != '' && this.state.filterSize.length > 0
                        ?
                        <div className="col-md-12 d-flex p-0 m-0">
                          <div className="col-md-1 m-0 p-0">Size:</div>
                          <div className="col-md-11 m-0 p-0">
                            {
                            this.state.filterSize.map((val, index) => {
                              return (
                                <span
                                  id={val}
                                  class="col-md-1 border mx-1 mouse_pointer com-val"
                                  onClick={this.changesize.bind(this, val)}
                                >
                                  {val}
                                </span>
                              );
                            })
                          }
                          </div>
                      </div>
                      : ''
                      }
                      
                      {/* <div className="col-md-12 d-flex p-0 m-0 "> */}
                        {/* <div className="row"> */}

                        
                        {/* <div className="col-md-1 m-0 p-0">Color:</div> */}
                        <div className="col-md-12 m-0 p-0">
                        <div class="d-flex justify-content-center">
                          <table className="my-2">
                            {/* {console.log("----------------1-----------------",this.state.variation)} */}
                            {this.state.variation.map((value, key) => {
                              return (
                                <React.Fragment>
                                  {
                                    value.is_delete == 0
                                    ?
                                    <tr
                                    className={`my-2 mx-2 ${value.variation2} all_prod hoverprice`}
                                  >
                                    <td style={{width: "1px"}}>
                                      {value.variation1}
                                    </td>
                                    <td>
                                      <span
                                        className={`mx-2 mouse_pointer ${
                                          this.props.prodId == value.product_id
                                            ? "borderImg"
                                            : "border"
                                        }`}
                                      >
                                        <img
                                          style={{
                                            width: "38px",
                                            height: "50px",
                                          }}
                                          src={`https://img.beldara.com/product_images/${value.main_img}`}
                                        />
                                      </span>
                                    </td>
                                    <td>
                                      {
                                        this.state.currency == 'INR'
                                        ? <i class="fa fa-inr" aria-hidden="true"></i>
                                        : <i class="fa fa-usd" aria-hidden="true"></i>
                                      }{" "}
                                      {
                                       
                                        parseFloat(this.state.priceArray[value.product_id][
                                          "calcprice"
                                        ]).toFixed(2)
                                      }
                                      {
                                        console.log("~~~~~~~",value.product_id,"----",this.state.priceArray[value.product_id])
                                        
                                      }
                                      {
                                        console.log("00000...........",parseFloat(this.state.priceArray[value.product_id][
                                          "calcprice"
                                        ]).toFixed(2))
                                      }
                                    </td>
                                    <td>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td>
                                              <div className="qty-box">
                                                <div className="input-group">
                                                  <span className="input-group-prepend">
                                                    <button
                                                      type="button"
                                                      className="btn quantity-left-minus"
                                                      onClick={this.minusQty.bind(
                                                        this,
                                                        value.product_id
                                                      )}
                                                      data-type="minus"
                                                      data-field=""
                                                    >
                                                      <i className="fa fa-minus" />
                                                    </button>
                                                  </span>
                                                  <NumberFormat
                                                    format="####"
                                                    name="quantity"
                                                    value={
                                                      this.state.priceArray[
                                                        value.product_id
                                                      ]["quantity"]
                                                    }
                                                    onChange={this.changeQty.bind(
                                                      this,
                                                      value.product_id
                                                    )}
                                                    className="form-control input-number"
                                                  />
                                                  {/* <input type="text" name="quantity" value={this.state.quantity} onChange={this.changeQty}  /> */}
                                                  <span className="input-group-prepend">
                                                    <button
                                                      type="button"
                                                      className="btn quantity-right-plus"
                                                      onClick={this.plusQty.bind(
                                                        this,
                                                        value.product_id
                                                      )}
                                                      data-type="plus"
                                                      data-field=""
                                                    >
                                                      <i className="fa fa-plus" />
                                                    </button>
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  :''
                                  }
                                </React.Fragment>
                              );
                            })}
                          </table>
                          </div>
                        </div>
                        {/* </div>
                        <div className="row"> */}
                        <div className="col-md-12 d-block m-0 p-0">
                          <div id="error_label" className="custom-border text-center mb-2 d-none">
                            <i
                                        class="fa fa-exclamation-circle mr-2"
                                        aria-hidden="true"
                                      ></i>Something went wrong please try again later</div>
                          <div className="hoverprice py-2 px-2">
                            <div className="justify-content-between d-flex">
                              <div className="">
                                {this.state.total_quantity}{" "}
                                {this.props.varData.parentproductarray.unit}
                              </div>
                              <div className="">
                              {
                                      this.state.currency == 'INR'
                                      ? <i class="fa fa-inr" aria-hidden="true"></i>
                                      : <i class="fa fa-usd" aria-hidden="true"></i>
                              }{" "}
                                 {parseFloat(this.state.totalPrice).toFixed(2)}
                              </div>
                            </div>
                            {/* <div className="justify-content-between d-flex">
                              <div className="">Shipping Charges</div>
                              <div className="">
                                {this.state.currency}{" "}
                                {this.state.shipping_charge}
                              </div>
                            </div> */}
                          </div>
                          <div className="d-flex justify-content-end py-2 px-2">
                                {this.state.type} type
                          </div>
                          <div className="d-flex flex-row-reverse">
                            {
                              !this.state.validate
                              ? 
                              <OverlayTrigger
                                  // key="top"
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`proceed`}>
                                      <i
                                        class="fa fa-exclamation-circle mr-2"
                                        aria-hidden="true"
                                      ></i>
                                      {this.state.validate_text}
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    class="btn btn-solid my-2 ml-2"
                                    onClick={this.checkoutProcedure}
                                  >
                                    {" "}
                                    Proceed{" "}
                                  </button>
                                </OverlayTrigger>
                              :
                                  <button
                                    id="proceed_id"
                                    class="btn btn-solid my-2 ml-2"
                                    onClick={this.checkoutProcedure}
                                  >
                                    {" "}
                                    Proceed{" "}
                                  </button>
                            }
                            
                          </div>
                        </div>
                        {/* </div> */}
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        ) : (
          ""
        )}
      </div>
    );
  }
}

// export default ProductVariantModal;
const mapStateToProps = (state) => ({
     currencyValue: state.currencyValue.currencyValue,
     languageMaster: state.languageMaster
});
export default withRouter(
  withTranslate(connect(mapStateToProps)(ProductVariantModal))
);
