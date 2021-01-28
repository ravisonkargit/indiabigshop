import React, { Component } from "react";
import Modal from "react-responsive-modal";
import SmallImages from "./common/product/small-image";
import { imgUrl } from "../../constants/variable";
import Slider from "react-slick";
//import "./view-product-images.css";

class ViewProductImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //open: false,
    };
  }

  render() {
    const { item,productsnav,slider1 } = this.props;
    return (
      <>
        <div>
          <Modal
            open={this.props.varData.open}
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
                  <h3 className="modal-title">images</h3>
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
                      <div>
                        {
                          <div key={item.img}>
                            <img
                              src={imgUrl + `/product_images/` + item.img}
                              className="img-fluid image_zoom_cls-0"
                              alt={item.img}
                              style={{ margin: "0 auto", height: "400px" }}
                            />
                          </div>
                        }
                      </div>
                      <div>
                        {this.props.loadSmallImage == 1 ? (
                          <SmallImages
                            item={item}
                            settings={productsnav}
                            navOne={this.slider1}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

export default ViewProductImages;
