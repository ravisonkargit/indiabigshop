import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import ReactTooltip from "react-tooltip";
import Facebook from "react-sharingbuttons/dist/buttons/Facebook";
import Twitter from "react-sharingbuttons/dist/buttons/Twitter";
import "react-sharingbuttons/dist/main.css";
import { isMobile } from "react-device-detect";

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onlinestep1: true,
      onlinestep2: false,
      step1: false,
    };
    this.validator = new SimpleReactValidator();
  }

  render() {
    const url = "https://beldara.com" + this.props.url.pathname;
    const shareText = "Beldara.com";
    return (
      <React.Fragment>
        <a
          data-for="soclose"
          data-tip="1"
          style={{ color: "rgb(255, 153, 68)" }}
        >
          <i class="fa fa-share-alt" aria-hidden="true"></i> Share
        </a>
        <ReactTooltip
          id="soclose"
          getContent={(dataTip) => (
            <div>
              {isMobile ? (
                <a
                  target="_blank"
                  href={
                    "https://api.whatsapp.com/send?text=" +
                    this.props.productName +
                    " Link " +
                    this.props.url
                  }
                  rel="nofollow"
                  style={{ marginLeft: "13px" }}
                >
                  <button
                    type="button"
                    class="btn btn-primary text-capitalize"
                    style={{
                      color: "#FFFFFF",
                      backgroundColor: "#4FCE5D",
                      borderRadius: "5px",
                      padding: "3px 3px 3px 3px",
                    }}
                  >
                    &nbsp;&nbsp;
                    <i
                      class="fa fa-whatsapp"
                      aria-hidden="true"
                      style={{ color: "#FFFFFF" }}
                    ></i>
                    &nbsp;&nbsp;Whatsapp&nbsp;&nbsp;
                  </button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </a>
              ) : (
                <a
                  target="_blank"
                  href={
                    "https://web.whatsapp.com/send?text=" +
                    this.props.productName +
                    " Link " +
                    this.props.url
                  }
                  rel="nofollow"
                  style={{ marginLeft: "13px" }}
                >
                  <button
                    type="button"
                    class="btn btn-primary text-capitalize"
                    style={{
                      color: "#FFFFFF",
                      backgroundColor: "#4FCE5D",
                      borderRadius: "5px",
                      padding: "3px 3px 3px 3px",
                    }}
                  >
                    &nbsp;&nbsp;
                    <i
                      class="fa fa-whatsapp"
                      aria-hidden="true"
                      style={{ color: "#FFFFFF" }}
                    ></i>
                    &nbsp;&nbsp;Whatsapp&nbsp;&nbsp;
                  </button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </a>
              )}
              {/* <a
                target="_blank"
                href={
                  "https://web.whatsapp.com/send?text=" +
                  this.props.productName +
                  " Link " +
                  this.props.url
                }
                rel="nofollow"
                style={{ marginLeft: "13px" }}
              >
                <button
                  type="button"
                  class="btn btn-primary text-capitalize"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#4FCE5D",
                    borderRadius: "5px",
                    padding: "3px 3px 3px 3px",
                  }}
                >
                  &nbsp;&nbsp;
                  <i
                    class="fa fa-whatsapp"
                    aria-hidden="true"
                    style={{ color: "#FFFFFF" }}
                  ></i>
                  &nbsp;&nbsp;Whatsapp&nbsp;&nbsp;
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;
              </a> */}
              <br></br>
              &nbsp;&nbsp;
              <Facebook url={url} />
              {/* <br></br> */}
              {/* <a
                target="_blank"
                href="https://in.linkedin.com/company/beldara"
                style={{ marginLeft: "13px" }}
                rel="nofollow"
              >
                <button
                  type="button"
                  class="btn btn-primary text-capitalize"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#1377B8",
                    borderRadius: "5px",
                    padding: "3px 3px 3px 3px",
                  }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <i class="fa fa-linkedin" style={{ color: "#FFFFFF" }}></i>
                  &nbsp;&nbsp;LinkedIn&nbsp;&nbsp;&nbsp;&nbsp;
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;
              </a> */}
              {/* <br></br> */}
              <div style={{ marginLeft: "13px", padding: "1px -15px 1px 5px" }}>
                <Twitter url={url} shareText={shareText} />
              </div>
              {/* <a
                target="_blank"
                href="https://twitter.com/beldaraonline"
                rel="nofollow"
              >
                <i
                  class="fa fa-twitter"
                  aria-hidden="true"
                  style={{ color: "#00acee" }}
                ></i>
              </a> */}
            </div>
          )}
          effect="solid"
          delayHide={300}
          delayShow={300}
          delayUpdate={300}
          place={"right"}
          border={true}
          type={"light"}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default withTranslate(connect(mapStateToProps)(Share));