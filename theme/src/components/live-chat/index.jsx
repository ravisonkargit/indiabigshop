import React, { Component } from "react";
import "./live-chat.css";
import { imgUrl } from "../../constants/variable";
import $ from "jquery";
import moment from "moment";
import Message from "./Message";
import io from "socket.io-client";
import ls from "local-storage";
import { withTranslate } from "react-redux-multilingual";
import IntlTelInput from "react-intl-tel-input";
import Axios from "axios";
import { ApiUrl } from "../../constants/ActionTypes";
import { setCookie, getCookie } from "../../functions";
import { connect } from "react-redux";
import 'react-intl-tel-input/dist/main.css';

const MY_USER_ID = "apple";
var type, number, isoValue, dialCode, countryName, unit;
class LiveChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          author: "orange",
          id: "1",
          message: "How may we help you ?"
        }
      ],
      value: "",
      sellerid: ls.get("sellerid"),
      chatTab: true,
      msgCount: 0
    };
    var typing = false;
    var timeout = undefined;
    if (window.location.hostname === "localhost") {
      //Localhost
      this.socket = io(`http://${window.location.hostname}:5000`);
    } else {
       //Live Server Connection
      this.socket = io(`${window.location.protocol}//${window.location.hostname}`, { transport: ["websocket"] });
      // this.socket = io(`https://beldara.com`, { transport: ["websocket"] });
    }
    this.socket.on("chat message", function (msg) {
      addMessage(msg);
    });
    var addMessage = msg => {
      var x = document.getElementById("myAudio");
      var arr = "";
      var newArray = this.state.messages.slice();
        if (ls.get("sellerid") === msg[2]) {
          
        arr = {
          id: this.state.messages.count + 1,
          author: "apple",
          message: msg[0][1],
          timestamp: new Date().getTime()
        };
        newArray.push(arr);
        } else if (msg[1] === ls.get("sellerid")) {
            if (this.state.chatTab) {
                this.setState({
                  msgCount: this.state.msgCount + 1
                });
              }
        x.play();
        arr = {
          id: this.state.messages.count + 1,
          author: "orange",
          message: msg[0][1],
          timestamp: new Date().getTime()
        };
        newArray.push(arr);
      }
      this.setState(prevState => {
        return {
          ...prevState,
          messages: newArray,
          value: ""
        };
      });
    };

    // Online Check

    var client = ls.get("sellerid");

    // this.socket.on('login', function(client) {
    //   $("#"+client).find(".onlineCheck").css({"display":"block"})
    //   // console.log(client+' Connected');
    // });
    // this.socket.on('disconnect', function(client) {
    //   $("#"+client).find(".onlineCheck").css({"display":"none"})
    //   // console.log(client+' Disconnected');
    // });
    var checkUserOnline = client => {
      this.socket.emit("login", { userId: client });
    };
    setInterval(function() {
      checkUserOnline(client);
    }, 5000);

    //User Typing
    this.socket.on("UserTyping", function(msg) {
      userTyping(msg);
    });
    function timeoutFunction() {
      typing = false;
      $(".userType").text("");
    }

    var userTyping = msg => {
      const frmmsg = msg[1];
      const tomsg = msg[0];

      let cnd = "";
      let company = "";

      company = "Our agent";
      cnd = "7340477";
      if (ls.get("sellerid") === frmmsg || frmmsg === cnd) {
        if (tomsg === ls.get("sellerid")) {
          if (typing === false) {
            typing = true;
            $(".userType").text(company + " is typing...");
            timeout = setTimeout(timeoutFunction, 1000);
          } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 1000);
          }
        }
        cnd = "";
      }
    };
  }

  handleClickChat = e => {
    if (e.target.className === "chat-open-icon d-block") {
      $(".chat-close-icon")
        .css({ opacity: "1" })
        .addClass("d-block")
        .removeClass("d-none");
      $(".chat-open-icon")
        .css({ opacity: "0" })
        .addClass("d-none")
        .removeClass("d-block");
      $(".chat-window").css({opacity:'1'})
        .addClass("d-block")
        .removeClass("d-none");
      $(".chat-user-input--text").focus();
      this.setState({
        chatTab: false,
        msgCount: 0
      });
    } else {
      $(".chat-open-icon")
        .css({ opacity: "1" })
        .addClass("d-block")
        .removeClass("d-none");
      $(".chat-close-icon")
        .css({ opacity: "0" })
        .addClass("d-none")
        .removeClass("d-block");
      $(".chat-window").css({opacity:'0'})
        .addClass("d-none")
        .removeClass("d-block");
      this.setState({
        chatTab: true
      });
      $(".chat-user-input--text").focusout();
    }
  };
  renderMessages() {
    let i = 0;
    let messageCount = this.state.messages.length;
    let messages = [];

    while (i < messageCount) {
      let previous = this.state.messages[i - 1];
      let current = this.state.messages[i];
      let next = this.state.messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

      messages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return messages;
  }
  msgSubmit = e => {
    e.preventDefault();
    Axios.post(
      `${ApiUrl}/common/new_seller.php`,
      {
        sellerid: ls.get("sellerid"),
        security_token: "",
        plateform_type: "",
        type: "chat"
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(async response => {
      this.socket.emit("chat message", [
        this.state.value,
        "7340477",
        this.state.sellerid,
        this.props.langCode,
        "en"
      ]);
      this.setState({
        value: ""
      });
    });

    // console.log(e.target.querySelector('#m').value)
    // e.target.querySelector('#m').value='';

    // this.setState({value: ''});
    return false;
  };
  onChangeMobile = (err, no, data) => {
    type = err;
    number = no;
    isoValue = data.iso2;
    dialCode = data.dialCode;
    countryName = data.name.replace(/ *\([^)]*\) */g, "");
  };
  chatSubmit = e => {
    e.preventDefault();
    const target = e.target;
    const email = target.email.value;
    const name = target.name.value;
    Axios.post(
      `${ApiUrl}/common/new_seller.php`,
      {
        email: email,
        mobile: number,
        name: name,
        country: isoValue.toUpperCase,
        countryid: dialCode,
        country_name: countryName,
        currentUrl: window.location.pathname,
        security_token: "",
        plateform_type: "",
        type: "new_seller"
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(async response => {
      // console.log(response);
      this.setState({
        sellerid: response.data.result.sellerid,
        name: response.data.result.name
      });
      setCookie("mhinpbn", response.data.result.sellerid, "365");
      ls.set("sellerid", response.data.result.sellerid);
    });
  };
  render() {
    const { translate } = this.props;
    const InputProps = {
      required: true,
      placeholder: "Enter your mobile",
      name: "mobile",
      type: "tel"
    };

    return (
      <div>
        {/* <div className="sc-launcher"></div> */}
        <div className="chat-launcher d-none d-md-block" onClick={this.handleClickChat}>
          <img
            src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUxpcf///////////////////////////////////////////////////////3EAnbYAAAAOdFJOUwADZ66SoQjEhnS7/gsNGQL7+wAAAKtJREFUKM+F01sOhCAQRNESFV/I/pc70Og0YJfyJbmHhBAbGGYHstw8IPV4EOGOmERYIhGpxyUAJxHSz/xlC+1FxE64qB1yj1ZID7oXsel+63ovnj2JXUXue+hvrcLugL+EdG+9XBG8X+Kl34J3YM1g/egvIvdx5EK691RIz78YEXdnQrst6m6JqemXmNo+D/WJNAyVePZWWL0WdlfB+l+UAQQReaAc65DB/wGsZgzLN0IQWAAAAABJRU5ErkJggg==`}
            className="chat-close-icon"
          />
          <img
            src={`${imgUrl}/images/logo-no-bg.7718b3e3.svg`}
            className="chat-open-icon d-block"
            />
                {/* <i className="fa fa-comments chat-open-icon d-block"></i> */}
                <div className="msgCount rounded-circle text-white px-1">
                    {this.state.msgCount!=0 ? this.state.msgCount : '' }
                </div>
                {/* <img src={`${imgUrl}/images/We-are-here-W.png`} style={{position:'absolute'}} className="d-none"/> */}
        </div>
        <div className="chat-window d-none">
          <div className="chat-header">
            Live Support <span className="badge badge-success ml-auto">Active</span>
          </div>
          <div className="chat-message-list px-3">
            {this.state.sellerid ? (
              this.renderMessages()
            ) : (
              <div className="border border-1">
                <div
                  className="alert alert-success text-white"
                  style={{ backgroundColor: "#ff9944" }}
                >
                  Please fill out the form below and we wil get back to  as
                  soon as possible.
                </div>
                <form onSubmit={this.chatSubmit}>
                  <div className="col-md-12 my-2">
                    <div className="has-float-label">
                      <input
                        id="name"
                        type="name"
                        placeholder=" "
                        name="name"
                        className="form-control"
                        required
                      />
                      <label htmlFor="name">{translate("Name")}</label>
                    </div>
                  </div>
                  <div className="col-md-12 my-2">
                    <div className="has-float-label ">
                      <input
                        id="email"
                        type="email"
                        placeholder=" "
                        name="email"
                        className="form-control"
                        required
                      />
                      <label htmlFor="email">
                        {translate("Enter your email")}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12 my-2">
                    <div className="has-float-label">
                      <IntlTelInput
                        containerClassName="intl-tel-input"
                        inputClassName="form-control"
                        fieldId="mobile"
                        geoIpLookup="true"
                        numberType="MOBILE"
                        autoPlaceholder="true" 
                        onPhoneNumberChange={this.onChangeMobile}
                        onPhoneNumberBlur={this.change}
                        defaultCountry={`${getCookie('country_code') ? (getCookie('country_code').toLowerCase()): 'in'}`}
                        // defaultCountry={`${
                        //   country ? country.toLowerCase() : "in"
                        // }`}
                        // defaultValue={mobile}
                        numberType="MOBILE"
                        telInputProps={InputProps}

                        // value={this.state.value}
                      />
                      <label htmlFor="mobile">{translate("Mobile")}</label>
                    </div>
                  </div>

                  <div className="col-md-12 my-2 text-center">
                    <button className="btn btn-solid">Start Chat</button>
                  </div>
                </form>
              </div>
            )}
          </div>
          {this.state.sellerid ? (
            <React.Fragment>
              <div
                className="userType"
                style={{ position: "absolute", bottom: "10%" }}
              />
              <form className="chat-user-input" onSubmit={this.msgSubmit}>
                <input
                  type="text"
                  role="button"
                  tabIndex="0"
                  value={this.state.value}
                  contentEditable="true"
                  placeholder="Write a reply..."
                  className="chat-user-input--text"
                  onChange={event => {
                    this.setState({ value: event.target.value });
                    this.socket.emit("UserTyping", [
                      "7340477",
                      ls.get("sellerid")
                    ]);
                  }}
                />
              </form>
            </React.Fragment>
          ) : (
            ""
          )}
        </div>
        <div className="container d-none">
          <audio id="myAudio">
            <source src="assets/audio/stairs.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    langCode: state.Intl.locale
  };
};
export default withTranslate(connect(mapStateToProps)(LiveChat));
