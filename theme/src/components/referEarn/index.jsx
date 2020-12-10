import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import { Link } from "react-router-dom";
import store from "../../store";
import ls from "local-storage";
import { SellerUrl, MsgUrl, ImgUrl, ApiUrl } from "../../constants/ActionTypes";
import { getCookie, setCookie } from "../../functions";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import LoginPopUp from "../loginPopUp";
import SignUpPopUp from "../signUpPopUp";
import AddUser from "../adduser";
import axios from "axios";
import Slider from "react-slick";
import { isMobile } from "react-device-detect";
import copy from "copy-to-clipboard";
import Overlay from "react-bootstrap/Overlay";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table'

var generate_link_content_element,
  generate_link,
  copyText,
  whatsppShareMobilelink,
  share_link,
  whatsppShareWeblink,
  tooltipvalue,
  share_facebook_link
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      login: false,
      signup: false,
      adduser:false,
      renderagain: false,
      referral_content:''
    };
    this.submitReferNow = this.submitReferNow.bind(this);
    this.generateRefer = this.generateRefer.bind(this);
    this.copyLink = this.copyLink.bind(this);
    this.getDate = this.getDate.bind(this); 
    this.adduser = this.addUserPopup.bind(this);
  }
  componentDidMount() {
    // copy('Text');
    tooltipvalue = "click to copy";
    // this.copyLink()
    if (ls.get("log_id")) {
      share_link = "http://b4b.in/ref-refid=" + ls.get("log_id");
      generate_link_content_element = document.getElementById("set_on_link");
      generate_link_content_element.innerText = share_link;
      generate_link = document.getElementById("generate_link");
      generate_link.classList.remove("d-none");
      whatsppShareWeblink = `https://web.whatsapp.com/send?text=Get an exciting credit amount in your wallet. Just you need to follow these simple steps and enjoy your impressive credits exclusively on Beldara ${share_link}`;
      whatsppShareMobilelink = `whatsapp://send?text=Get an exciting credit amount in your wallet. Just you need to follow these simple steps and enjoy your impressive credits exclusively on Beldara ${share_link}`;
      share_facebook_link = `${share_link}`;
      this.setState({
        renderagain: true
      });
      axios.post(`${ImgUrl}/beta_api/beldara_package_purchased.php`,
        {sellerid:ls.get('log_id')},
        {
          headers :{
            "content-type":"multipart/form-data"
          }
        }
      ).then(res => {
        // console.log(res.data,67);
        if(res.data.statusId == '1'){
          this.setState({
            rewards : res.data.result
          })
        }
      }).catch(data => {
        console.log('error message:',data);          
      })
      this.getReferData();
    }
      axios.post(`${ImgUrl}/beta_api/referral_content.php`, '', {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => { 
        this.setState({
          images_web : res.data.result.images.images_web,
          images_mob : res.data.result.images.images_mob,
          steps : res.data.result.steps,
          main_title : res.data.result.main_title,
        })
    }).catch(data => {
      console.log('error message:',data);          
    });
  }
  generateRefer() {
    console.log("working...", "generateRefer");
    if (ls.get("log_id")) {
      this.submitReferNow();
    } else {
      this.setState({
        login: true
      });
    }
  }
  getReferData(){
    axios.post(`${ApiUrl}/common/get_referral_data.php`,
        {sellerid:ls.get('log_id'),security_token:'',plateform_type:''}, 
        {
          headers: {
              "Content-Type": "multipart/form-data"
          }
      }).then(res => { 
          // console.log(res.data.result,91);
          this.setState({
            referred_data : res.data.result
          })
      }).catch(data => {
        console.log('error message:',data);          
      });
  }
  footerData = data => {
    console.log("footerData");
    if (data.modalChange) {
      this.setState({
        signup: data.modal,
        login: data.modal
      });
    }

    if (data.success) {
      this.submitReferNow();
      this.getReferData();
    }

    this.setState({
      reload: data.reload
    });
  };
  //Opening Signup modal
  openSignUpModal = () => {
    this.setState({
      signup: true,
      login: false
    });
  };
  //Opening Login modal
  openLoginModal = () => {
    this.setState({
      signup: false,
      login: true
    });
  };
  // Close Modal
  closeModal = () => {
    this.setState({
      login: false,
      signup: false,
      adduser:false
    });
  };
  addUserPopup = () => {
    console.log('adduser called');
    this.setState({
      adduser:true
    })
  };
  submitReferNow() {
    // console.log("working", "submitReferNow");
    share_link = "http://b4b.in/ref-refid=" + ls.get("log_id");
    generate_link_content_element = document.getElementById("set_on_link");
    generate_link_content_element.innerText = share_link;
    generate_link = document.getElementById("generate_link");
    generate_link.classList.remove("d-none");
    whatsppShareWeblink = `https://web.whatsapp.com/send?text=Get an exciting credit amount in your wallet. Just you need to follow these simple steps and enjoy your impressive credits exclusively on Beldara ${share_link}`;
    whatsppShareMobilelink = `whatsapp://send?text=Get an exciting credit amount in your wallet. Just you need to follow these simple steps and enjoy your impressive credits exclusively on Beldara ${share_link}`;
    share_facebook_link = `${share_link}`;
    this.setState({
      renderagain: true
    });
  }
  copyLink() {
    tooltipvalue = "Copied!";
    copyText = document.getElementById("set_on_link").innerText;
    copy(copyText, {
      debug: true,
      message: "Press #{key} to copy"
    });
    this.setState({
      renderagain: true
    });
  }
  componentWillMount(){
    this.setState({
      height: window.innerHeight,
      width:  window.innerWidth
    });
  }
  getDate(val){
    var date_test = new Date(val);
    console.log(date_test,date_test.getFullYear());
    // return date_test('')
    return date_test.getFullYear() + "/" + parseInt(date_test.getMonth() + 1) + "/" + date_test.getDate();
  }
  render() {
    const {email,mobile,name,sellerid,user_type} = this.props.user.user;
    console.log(this.state,195);
    const settings = {
      dots: true,
      infinite: true,
      speed: 100,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    const sliderImage = {
      width: "1100px"
    };
    const iconstyle = {
      fontSize: "17px",
      cursor: "pointer"
    };
    const cursorpointer = {
      cursor: "pointer"
    }
    // var {images,main_title,steps} = this.state.referral_content;
    // console.log(this.state,162);
    return (
      <div className="container">
        <div className="row my-3">
          <Tabs defaultActiveKey="refer" id="tabs" className="container">
            <Tab eventKey="refer" title="REFER" className="container">
              <div className="row my-3">
                <div className="col-md-9">
                  {this.state.width < 415 ? (
                    <section className={`p-0 small-slider my-2 ${this.state.width}`}>
                      {/* <Slider {...settings} className="slide-1 home-slider">
                        <div class="mob">
                          <img
                            className="img-fluid w-100"
                            src={this.state.images_mob}
                          />
                        </div>
                      </Slider> */}
                      <img
                        className="img-fluid"
                        src={this.state.images_mob}
                      />
                    </section>
                  ) : (
                    <section className="p-0 small-slider my-2">
                      <img
                        src={this.state.images_web}
                        className="img-fluid w-100"
                        style={{ height: "243px" }}
                      />
                    </section>
                  )}
                  <Card className="text-center bg-white">
                    <Card.Header>Referral</Card.Header>
                    <Card.Body>
                  <Card.Title>{this.state.referral_content.main_title}</Card.Title>
                      <Card.Text>
                        <div id="generate_link" className="d-none">
                          <span id="set_on_link"></span>
                          <br/>
                          <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                              <Tooltip id={`copy`}>{`${tooltipvalue}`}</Tooltip>
                            }
                          >
                            <i
                              className="fa fa-copy text-primary"
                              onClick={this.copyLink}
                              style={iconstyle}
                            ></i>
                          </OverlayTrigger>{" "}
                          <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                              <Tooltip id={`whatsapp`}>
                                share on whatsapp
                              </Tooltip>
                            }
                          >
                            {isMobile ? (
                              <a
                                href={`${whatsppShareMobilelink}`}
                                data-action="share/whatsapp/share"
                              >
                                <img src={`${ImgUrl}/assets/images/whatsapp_icon.png`}/>
                              </a>
                            ) : (
                              <a
                                href={`${whatsppShareWeblink}`}
                                data-action="share/whatsapp/share"
                                target="_blank"
                              >
                                {/* <i
                                  class="fa fa-whatsapp mx-1 text-primary"
                                  style={iconstyle}
                                  aria-hidden="true"
                                ></i> */}
                                <img src={`${ImgUrl}/assets/images/whatsapp_icon.png`}/>
                              </a>
                            )}
                          </OverlayTrigger>
                          {""}
                          <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                              <Tooltip id={`facebok`}>share on facebook</Tooltip>
                            }
                          >
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${share_facebook_link}`}
                              target="_blank"
                            >
                              {/* <i
                                class="fa fa-facebook mx-1 text-primary"
                                style={iconstyle}
                                aria-hidden="true"
                              ></i> */}
                                <img style={{width:'15px'}} src={`${ImgUrl}/assets/images/facebook_icon.png`}/>
                            </a>
                          </OverlayTrigger>{" "}
                        </div>
                      </Card.Text>
                      {ls.get("log_id") != "null" &&
                      ls.get("log_id") !== null &&
                      ls.get("log_id") != "" ? (
                        <div>
                          <button
                          className="btn btn-solid my-2"
                          onClick={this.copyLink}
                        >{`${tooltipvalue}`}
                        </button>
                        <span> OR </span>
                        <button onClick={this.adduser} className="btn btn-solid my-2">Invite via phone number</button>
                        <div id="container" className="d-flex justify-content-center my-2" style={{ overflow: 'auto' }}>
                        {/* <Card style={{ width: '18rem' }}>
                          <ListGroup variant="flush">
                          <ListGroup.Item>Name : {name != '' ? name : user_type}</ListGroup.Item>
                          <ListGroup.Item>Email : {email}</ListGroup.Item>
                          <ListGroup.Item>Mobile: {mobile}</ListGroup.Item>
                          </ListGroup>
                        </Card> */}
                         
                        <Table bordered hover style={{width:'150px'}}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.referred_data && this.state.referred_data != '' && this.state.referred_data !== null
                            ? 
                            this.state.referred_data.map((datum,key)=>
                            <tr className={isMobile ? `text-break` : ``}>
                              <td>{datum.name}</td>
                              <td>{datum.email}</td>
                              <td>{datum.mobile}</td>
                              <td>{datum.status}</td>
                              <td>{this.getDate(datum.sysdate)}</td>
                            </tr>
                            )
                            : 
                            <tr>
                              <td colspan="5" className="text-center">{'No Record Found'}</td>
                            </tr>
                          }
                        </tbody>
                      </Table> 
                      </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-solid"
                          onClick={this.generateRefer}
                        >
                          Generate Referral Link
                        </button>
                      )}
                        
                    </Card.Body>
                    {/* <Card.Footer className="text-muted">2 days ago</Card.Footer> */}
                  </Card>
                  
                </div>
                <div className="col-3 d-none  d-sm-none d-md-block">
                  {/* <a href="https://loverlovely.com">
                    <img
                      src={`${ImgUrl}/images/loverlovelyad.png`}
                      alt="LoverLovely Beldara.com"
                      className="mb-2"
                    ></img>
                  </a> */}

                  <a href="https://limray.com">
                    <img
                      src={`${ImgUrl}/images/limrayad2.png`}
                      alt="Limray Beldara.com"
                    ></img>
                  </a>
                </div>
              </div>
            </Tab>
            <Tab eventKey="rewards" title="REWARDS" className="container">
              <div className="row my-3">
                <div class="col-md-9">
                {this.state.width <= '414' ? (
                    <section className="p-0 small-slider my-2">
                      {/* <Slider {...settings} className="slide-1 home-slider">
                        <div class="mob">
                          <img
                            className="img-fluid w-100"
                            src={this.state.images_mob}
                          />
                        </div>
                      </Slider> */}
                      <img
                        className="img-fluid w-100"
                        src={this.state.images_mob}
                      />
                    </section>
                  ) : (
                    <section className="p-0 small-slider my-2">
                      <img
                        src={this.state.images_web}
                        className="img-fluid w-100"
                        style={{ height: "243px" }}
                      />
                    </section>
                  )}
                  {this.state.rewards
                  ? 
                  this.state.width < 415 
                  ?
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Txn No</th>
                        <th>Amount</th>
                        <th>Txn Event</th>
                        <th>Payment Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.rewards.map((item,key) =>
                        <tr>
                          <td>{item.id}</td>
                          <td>{item.amount}</td>
                          <td>{item.event}</td>
                          <td>{this.getDate(item.sysdate)}</td>
                        </tr>
                        )
                      }
                    </tbody>
                  </Table> 
                  : 
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Txn No</th>
                        <th>Amount</th>
                        <th>Txn Event</th>
                        <th>Payment Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.rewards.map((item,key) =>
                        <tr>
                          <td>{item.id}</td>
                          <td>{item.amount}</td>
                          <td>{item.event}</td>
                          <td>{this.getDate(item.sysdate)}</td>
                        </tr>
                        )
                      }
                    </tbody>
                  </Table>
                  : 
                  // <Card className="text-center justify-content-center">
                  //   <Card.Header>Rewards</Card.Header>
                  //   <Card.Body>
                  //     <Card.Title>Get More Rewards</Card.Title>
                  //     <Card.Text>
                  //     No Rewards found 
                  //     </Card.Text>
                  //   </Card.Body>
                  //   {/* <Card.Footer className="text-muted">2 days ago</Card.Footer> */}
                  // </Card>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Txn No</th>
                        <th>Amount</th>
                        <th>Txn Event</th>
                        <th>Payment Date</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <td className="text-center" colspan="4">No Record Found</td>
                        </tr>
                    </tbody>
                  </Table>
                  }
                </div>
                <div className="col-3 d-none  d-sm-none d-md-block">
                  {/* <a href="https://loverlovely.com">
                    <img
                      src={`${ImgUrl}/images/loverlovelyad.png`}
                      alt="LoverLovely Beldara.com"
                      className="mb-2"
                    ></img>
                  </a> */}

                  <a href="https://limray.com">
                    <img
                      src={`${ImgUrl}/images/limrayad2.png`}
                      alt="Limray Beldara.com"
                    ></img>
                  </a>
                </div>
              </div>
            </Tab>
            <Tab eventKey="steps" title="STEPS" className="container">
              {/* <div className="row my-3">
                  <div className="col-md-12">
                  {isMobile ? (
                    <section className="p-0 small-slider my-2">
                      <Slider {...settings} className="slide-1 home-slider">
                        <div class="mob">
                          <img
                            className="img-fluid w-100"
                            src={this.state.images_mob}
                          />
                        </div>
                      </Slider>
                    </section>
                  ) : (
                    <section className="p-0 small-slider my-2">
                      <img
                        src={this.state.images_web}
                        className="img-fluid w-100"
                        style={{ height: "100px" }}
                      />
                    </section>
                  )}
                <Accordion defaultActiveKey="0">
                      {
                        this.state.steps
                         ? 
                          this.state.steps.map((item, key) =>
                          <Card>
                              <Accordion.Toggle as={Card.Header} eventKey={key}>
                              {`step ${parseInt(key+1)}`}
                              </Accordion.Toggle>
                              <Accordion.Collapse eventKey={key}>
                                <Card.Body>
                                  {item}
                                </Card.Body>
                              </Accordion.Collapse>
                          </Card>)
                     : ''}
                </Accordion>
                  </div>
              </div> */}
              <div className="row my-3">
                <div className="col-md-9">
                  {this.state.width <= '414' ? (
                    <section className="p-0 small-slider my-2">
                      {/* <Slider {...settings} className="slide-1 home-slider">
                        <div class="mob">
                          <img
                            className="img-fluid w-100"
                            src={this.state.images_mob}
                          />
                        </div>
                      </Slider> */}
                      <img
                        className="img-fluid w-100"
                        src={this.state.images_mob}
                      />
                    </section>
                  ) : (
                    <section className="p-0 small-slider my-2">
                      <img
                        src={this.state.images_web}
                        className="img-fluid w-100"
                        style={{ height: "243px" }}
                      />
                    </section>
                  )}
                  {/* { */}
                  <Card>
                    <Card.Header className="text-center">Steps</Card.Header>
                    <ListGroup variant="flush">
                    {
                      this.state.steps
                      ? 
                        this.state.steps.map((item, key) =>
                    <ListGroup.Item>{`Step ${(parseInt(key+1))}: ${item}`}</ListGroup.Item>
                        )
                  : ''}
                    </ListGroup>
                  </Card>
                    
                    {/* } */}
                    {/* <Accordion defaultActiveKey={0}> */}
                          {/* {
                            this.state.steps
                            ? 
                              this.state.steps.map((item, key) =>
                              <Card>
                                  <Accordion.Toggle as={Card.Header} eventKey={key} style={cursorpointer}>
                                  {`step ${parseInt(key+1)}`}
                                  </Accordion.Toggle>
                                  <Accordion.Collapse eventKey={key}>
                                    <Card.Body>
                                      {item}
                                    </Card.Body>
                                  </Accordion.Collapse>
                              </Card>)
                        : ''} */}
                    {/* </Accordion> */}
                </div>
                <div className="col-3 d-none  d-sm-none d-md-block">
                  {/* <a href="https://loverlovely.com">
                    <img
                      src={`${ImgUrl}/images/loverlovelyad.png`}
                      alt="LoverLovely Beldara.com"
                      className="mb-2"
                    ></img>
                  </a> */}

                  <a href="https://limray.com">
                    <img
                      src={`${ImgUrl}/images/limrayad2.png`}
                      alt="Limray Beldara.com"
                    ></img>
                  </a>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
        <LoginPopUp
          footerData={this.footerData}
          login={this.state}
          openSignUpModal={this.openSignUpModal}
          closeModal={this.closeModal}
        />
        <SignUpPopUp
          footerData={this.footerData}
          signup={this.state}
          openLoginModal={this.openLoginModal}
          closeModal={this.closeModal}
        />
        <AddUser
        adduser={this.state}
        closeModal={this.closeModal}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
});
// export default index;
export default connect(mapStateToProps)(index);
