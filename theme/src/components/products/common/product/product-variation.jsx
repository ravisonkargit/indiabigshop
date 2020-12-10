import React, { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import { connect } from "react-redux";
import { imgUrl, apiUrl } from "../../../../constants/variable";
import $ from "jquery";
import Select from "react-select";
import "./product.css";
import { getCookie, captureEvent } from "../../../../functions";
import store from "../../../../store";
import { getSingleProduct } from "../../../../actions";
import ProductVariantModal from './product-variant-modal';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

var sizedropDown = [];
class ProductVariation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variation: null,
      colour: null,
      productarray: [],
      currentselectedProduct: null,
      err: false,
      validator: "",
      selectedLabel: null,
      allowVariantPopup:false,
      filterSize:null,
      filteredArray:null
    };
    this.chooseproduct = this.chooseproduct.bind(this);
    this.changesize = this.changesize.bind(this);
  }
  componentDidMount() {
    // console.log("componentDidMount called", this.props.prodId);
    this.getProdData(this.props.prodId);
  }
  getProdData = async (prod_id) => {
    axios
      .post(
        `${apiUrl}get_all_product_variants.php`,
        {
          security_token: "",
          plateform_type: "",
          productid: prod_id,
          sellerid: ls.get("sellerid"),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(async (response) => {
        // console.log(response.data, 700);
        if (response.data.statusId == "1") {
          if (response.data.result.is_parent == "1") {
            var child_product_id =
              response.data.result["child_access_products"];
            // console.log(child_product_id, 49);
            // console.log(response.data.result['child_products'][response.data.result['child_access_products']['id']],response.data.result['child_products'][response.data.result['child_access_products']);
            this.props.disptach_product(
              response.data.result["child_products"][child_product_id]["id"],
              response.data.result["child_products"][child_product_id]["url"]
            );
          } else {
            await this.setState({
              productarray: response.data.result["child_products"],
              variation: response.data.result["parent_products"]["variation"],
              parentproductarray:response.data.result["parent_products"],
              current_product_id:response.data.result["child_access_products"]
            });
            response.data.result["parent_products"]["variation"].filter(
              (variants) => {
                if (variants.product_id == this.props.prodId) {
                  var selectedlabel = [
                    {
                      value: variants.variation2,
                      label: variants.variation2,
                    },
                  ];
                  this.setState({
                    colour: variants.variation1,
                    currentselectedProduct: variants,
                    selectedLabel: selectedlabel,
                    current_product_id:variants.product_id
                  });
                }
              }
            );
            // sizedropDown = response.data.result["parent_products"][
            //   "variation"
            // ].map(function(elem) {
            //   return {
            //     label: elem.variation2,
            //     value: elem.variation2,
            //   };
            // });
            this.filterSize()
          }
          // console.log('inside if',700,sizedropDown,this.state);
        } else {
          // console.log('inside else',700);
        }
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  };
  filterSize = () => {
    var arr = [];
    var arr1 = [];
    this.state.variation.map((vals, keys) => {
      arr.push(vals.variation2);
    });
    var filteredArray = arr.filter(function(item, pos) {
      // console.log(arr.indexOf(item),item,pos,117);
      if (item != null && item != '' && arr.indexOf(item) == pos) return item
      // return arr.indexOf(item) && item != null && item != '' == pos;
    });
    // console.log(arr,116);
    filteredArray.map((val,i)=>{arr1.push({'label':val,'value':val})})
    this.setState({
      filterSize: arr1,
      filteredArray:filteredArray
    });
    // console.log(arr1,118);
    // console.log( filteredArray,119);
  };
  // componentWillReceiveProps() {}
  componentDidUpdate() {
    if (this.state.variation !== null) {
      $('#general_products_event').removeClass('d-flex').addClass('d-none')
      $('#hide_general').addClass('d-none');
    }
  }
  chooseproduct(product_details,current_colour) {
    var new_data = this.state.productarray[product_details];
    this.setState({current_product_id:product_details,colour:current_colour});
    this.props.disptach_product(product_details, new_data.url);
  }
  changesize = async (e) => {
    // console.log(e);
    if (this.state.currentselectedProduct !== null) {
      if (this.state.currentselectedProduct.variation2 == e.value) {
        // console.log('available');
        this.setState({
          err: false,
          validator: "",
        });
      } else {
        this.setState({
          err: true,
          validator: "Product is not available",
        });
        // console.log('not available');
      }
    } else {
      this.setState({
        err: false,
        validator: "",
      });
      // console.log('No product selected');
    }
  };
  // open modal
  openAllowVariantPopupModal = () => {
    // console.log(this.props);
    if(this.props.deliverable){
      this.setState({
        allowVariantPopup:true
      });
    }
  }
  // close  modal
  closeAllowVariantPopupModal = () => {
      this.setState({
        allowVariantPopup:false
      });    
  }
  render() {
    // console.log(this.state, "render");
    const InputProps = {
      required: true,
    };
    // const  defaultVal = [
    //   {
    //     value: this.state.currentselectedProduct.variation2,
    //     label: this.state.currentselectedProduct.variation2
    //   }
    // ];
    // console.log('render',this.state.variation);
    return (
      <div className="row mx-2 my-2">
        {this.state.variation !== null ? (
          <React.Fragment>
            {this.state.colour !== null && this.state.variation[0].color == '1'? (
              <div className="col-md-12">colour: {this.state.colour}</div>
            ) : (
              ""
            )}
            <div className="col-md-12 d-flex my-2">
              {this.state.variation !== null &&
              this.state.variation !== undefined &&
              this.state.variation !== ""
                ? this.state.variation.map((index, key) => {
                    return (
                      <React.Fragment>
                        {
                          this.state.variation[0].color == '1'
                          ?
                          <span
                            className={`mx-2 mouse_pointer ${
                              this.props.prodId == index.product_id
                                ? "borderImg"
                                : "border"
                            }`}
                          >
                            <img
                              style={{ width: "38px", height: "50px" }}
                              src={`https://img.beldara.com/product_images/${index.main_img}`}
                              onClick={this.chooseproduct.bind(
                                this,
                                index.product_id,
                                index.variation1
                              )}
                            />
                          </span>
                          : ''
                        }
                      </React.Fragment>
                    );
                  })
                : ""}
            </div>
            <div className="col-md-12 d-flex align-items-center">
              <div className="col-md-2 my-2">
                {this.state.variation !== null &&
                this.state.selectedLabel !== null && this.state.filterSize !== null && this.state.filterSize.length > 0 ? (
                  <Select
                    isOptionSelected="true"
                    options={this.state.filterSize}
                    onChange={this.changesize}
                    headingProps={InputProps}
                    placeholder={"Size"}
                    defaultValue={this.state.selectedLabel}
                  />
                ) : (
                  ""
                )}
              </div>
              {this.state.err ? (
                <div className="text-dark">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>{" "}
                  {this.state.validator}
                </div>
              ) : (
                ""
              )}
            </div>
            <div
              class="d-flex justify-content-left align-items-center"
              id=""
            >
              {
                this.props.deliverable && this.props.prodData.is_active == '1'
                ?
                <div>
                  <button
                    class="btn btn-solid my-2 ml-2 "
                    id="expressCheckOut"
                    clickevent="Express_checkout"
                    onClick={this.openAllowVariantPopupModal}
                  >
                    {" "}
                    Buy Now{" "}
                  </button>
                </div>
                : (this.props.prodData.is_active == '1')
                ?
                <OverlayTrigger
                  // key="top"
                  placement="top"
                  overlay={
                    <Tooltip id={`buy_now`}>
                      <i
                        class="fa fa-exclamation-circle mr-2"
                        aria-hidden="true"
                      ></i>
                      {this.props.pincode != '' &&  this.props.pincode !== undefined ? 'Information not found for entered pincode' : 'Please enter pincode'}
                    </Tooltip>
                  }
                >
                  <div>
                  <button
                    class="btn btn-solid my-2 ml-2 "
                    id="expressCheckOut"
                    clickevent="Express_checkout"
                    onClick={this.openAllowVariantPopupModal}
                  >
                    {" "}
                    Buy Now{" "}
                  </button>
                </div>
                </OverlayTrigger>
                :""
              }

              {
                 this.props.prodData.is_active != '1'
                 ? 
                    <>
                      <div className="p-0 mx-2 productBorder">
                        <h5 className="p-text-color px-1">Product Unavailable</h5>
                      </div>
                    </>
                 : ''
              }
              
              {/* <div>
                <button
                  class="btn btn-solid my-2 ml-2 "
                  id="e_auction"
                  clickevent="e_auction"
                >
                  {" "}
                  E-Auction{" "}
                </button>
              </div> */}

              {/* below retailer margin code */}
                {/* {parseFloat(
                    (parseFloat(this.state.product_mrp) -
                      parseFloat(this.state.selling_price)) /
                      (parseFloat(this.state.product_mrp) * 0.01).toFixed(2)
                  ).toFixed(2)} */}   
                             
              {/* {this.props.product_mrp !== null &&
              this.props.selling_price !== null ? (
              <div className="p-0 mx-2">
                <div>
                  MRP {this.state.currency}{" "}
                  {new Intl.NumberFormat().format(this.props.product_mrp)}
                </div>
                <div>
                  Retail Margin:{" "}
                  {parseFloat(((parseFloat(this.props.product_mrp)-parseFloat(this.props.selling_price))/parseFloat(this.props.product_mrp))*100).toFixed(2)}
                  %
                </div>
              </div>
            ) : (
              ""
            )} */}
            </div>
            <ProductVariantModal varData={this.state} openmodal={this.openAllowVariantPopupModal} closemodal={this.closeAllowVariantPopupModal}/>
          </React.Fragment>
        ) : (
          
          ""
        )}
      </div>
    );
  }
}

export default ProductVariation;
