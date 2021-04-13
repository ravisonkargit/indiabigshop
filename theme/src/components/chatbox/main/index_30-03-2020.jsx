import React, { Component, Suspense, lazy } from "react";
import $ from "jquery";
import "./index.css";
import Axios from "axios";
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import { imgUrl } from "../../../constants/variable";
import ConversationListItem from "../ConversationListItem";
import moment from "moment";
// import Message from '../Message'
import Messages from "../Message/messages";
import io from "socket.io-client";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from 'react-loader-spinner'
import { connect } from "react-redux";
import { getFileName, getCookie, setCookie } from "../../../functions";
import LoginPopUp from "../../loginPopUp";
import SignUpPopUp from "../../signUpPopUp";
import { ApiUrl } from "../../../constants/ActionTypes";
import store from "../../../store";
import { getUpdateUser } from "../../../actions";
import IntlTelInput from "react-intl-tel-input";
import { json } from "body-parser";
const Message = lazy(() => import("../Message"));
const MY_USER_ID = "apple";


function getSuggestionValue(suggestion) {
    // console.log(suggestion,29);
    // return JSON.stringify(suggestion);
    return `${suggestion.name}~${suggestion.id}`;
}

function renderSuggestion(suggestion, { query }) {
    // console.log(suggestion,query,34);
    const matches = AutosuggestHighlightMatch(suggestion.name, query);
    const parts = AutosuggestHighlightParse(suggestion.name, matches);

    return (
    <span>
        {parts.map((part, index) => {
        const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

        return (
            <span className={className} key={index}>
            {part.text}
            </span>
        );
        })}
    </span>
    );
}
// Imagine you have a list of languages that you'd like to autosuggest.
var data_suggestion,productid;
var type, number, isoValue, dialCode, countryName, unit,cat_id;
class Main extends Component {
    constructor() {
        super();
        this.state = {
            incWidth: 0,
            conversations: [],
            tomsg: null,
            messages: [],
            value: null,
            errmsgshow: false,
            hasMore: true,
            from: 0,
            size: 11,
            width: 0, height: 0,
            isLoading: false,
            totalUnreadCnt: null,
            notLoggedIn: localStorage.getItem('sellerid') ? false : true,
            sendToSeller: true,
            chatWithSupplier: false,
            contact: '',
            contactError: false,
            step1:true,
            step2:false,
            suggestions: [],
            value: '',
            productid: '',
            userType:'seller',
            validate:false,
            loginWithOtp:false
        };
        // this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        if (window.location.hostname === "localhost") {
            //Localhost
            this.socket = io("http://localhost:5000");
            // this.socket = io(`https://beldara.com`, {
            //     transport: ["websocket"]
            // });
            //  var socket = io('http://localhost:5000');
        } else {
            //Live Server Connection
            this.socket = io(`https://beldara.com`, {
                transport: ["websocket"]
            });
        }
        // this.socket = io(`http://chat.worksena.com`, { transport: ["websocket"] });
        /////Online Check For User
        var client = window.localStorage.getItem("log_id");
        console.log(client,'client',65);

        this.socket.on("login", function (client) {
            $("#" + client)
                .find(".onlineCheck")
                .css({ display: "block" });
            $("#window-" + client)
                .find(".activity")
                .css({ display: "block" });
            // console.log(client+' Connected');
        });
        this.socket.on("disconnect", function (client) {
            $("#" + client)
                .find(".onlineCheck")
                .css({ display: "none" });
            $("#window-" + client)
                .find(".activity")
                .css({ display: "none" });

            // console.log(client+' Disconnected');
        });
        if (getCookie('systemMsg') === null || getCookie('systemMsg') === undefined || getCookie('systemMsg') === '') {
            setCookie('systemMsg', 0, 1);
        }
        this.socket.on('img-submit', function (msg) {
            // console.log(msg)
            var ctx = document.getElementById('canvas').getContext('2d');
            if (msg.image) {
                // console.log(msg.image)
                var img = new Image();
                img.src = 'data:image/jpeg;base64,' + msg.buffer;
                // console.log(img)
                ctx.drawImage(img, 0, 0);
                ctx.drawImage(img, 0, 0);

            }
        })
        var checkUserOnline = client => {
            this.socket.emit("login", { userId: client });
        };
        setInterval(function () {
            checkUserOnline(client);
        }, 5000);

        //////Msg Insert
        console.log('insertCons')
        this.socket.on("chat message", function (msg) {
            console.log(msg);
            addMessage(msg);
        });

        var addMessage = msg => {
            console.log('adddmessage',msg);
            var arr = "";
            var newArray = this.state.messages.slice();
            var cnt = "";
            var messageBody = "";


            const lng_frm_msg = msg[0][0];
            const lng_to_msg = msg[0][1];
            const message = msg[0][1];
            const tomsg = msg[1];
            const frmmsg = msg[2];
            // // this.setState({messages: [...this.state.messages, data]});
            // console.log(this.state.messages);
            // // newArray.push(this.state.value);
            if (
                $(".conversation-list")
                    .find("[id='" + frmmsg + "']:not(.worksn_active)")
                    .find(".cntShow") &&
                tomsg === window.localStorage.getItem("log_id")
            ) {
                console.log('append1');
                // alert("Online");
                cnt = $(".conversation-list")
                    .find("[id='" + frmmsg + "']:not(.worksn_active)")
                    .find(".cntShow")
                    .text();
                //   console.log(cnt)

                if (cnt === undefined) {
                    cnt = 0;
                }
                cnt++;

                $(".conversation-list")
                    .find("[id='" + frmmsg + "']:not(.worksn_active)")
                    .find(".cntShow")
                    .html(cnt)
                    .addClass("badge badge-success");
                //   console.log(cnt,"frmmsg",frmmsg)
            }
            if (
                window.localStorage.getItem("log_id") === frmmsg ||
                frmmsg === this.state.toId
            ) {
                console.log('append2',this.state.toId);
                if (window.localStorage.getItem("log_id") === frmmsg) {
                console.log('append2 if condition');
                    arr = {
                        id: this.state.messages.count + 1,
                        author: "apple",
                        message: message,
                        timestamp: new Date().getTime()
                    };
                    if (newArray !== "") {
                        newArray.push(arr);
                    } else {
                        newArray = [arr];
                    }
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            messages: newArray,
                            value: ""
                        };
                    });
                    // console.log("From a buyer");
                } else if (
                    this.state.toId === tomsg ||
                    tomsg === window.localStorage.getItem("log_id")
                ) {
                console.log('append3');
                    // document.getElementById("myAudio").play();
                    // console.log("play");
                    arr = {
                        id: this.state.messages.count + 1,
                        author: "orange",
                        message: message,
                        timestamp: new Date().getTime()
                    };
                    if (newArray !== "") {
                        newArray.push(arr);
                    } else {
                        newArray = [arr];
                    }
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            messages: newArray
                        };
                    });
                    this.setState({ totalUnreadCnt: this.state.totalUnreadCnt + 1 })
                    // console.log("From a Seller");
                }
                // console.log(this.state.toId);

                if (
                    $("#window-" + this.state.toId)
                        .find(".activity")
                        .css("display") === "none"
                ) {
                console.log('append4',this.state.toId);
                    // console.log(this.state.toId);
                    let userData = {
                        sellerid: this.state.toId,
                        msg: message,
                        frmmsg: window.localStorage.getItem("log_id")
                    };
                    userData = JSON.stringify(userData);
                    let formData = new FormData();
                    formData.append("data", userData);
                    Axios.post(imgUrl + "/chat-api/send_reply_mail.php", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }).then(res => { });
                }
                // }
                // let userData = {
                //   sellerid:this.props.tomsg,msg:lng_to_msg,frmmsg:window.localStorage.getItem("sellerid")
                // }
                // console.log(userData)
                // this.socket.emit('refresh-conversations',[this.props.tomsg,lng_to_msg,window.localStorage.getItem("sellerid")])
                // this.setState({value: ''});
                $(".my-custom-scrollbar").scrollTop(
                    $(".my-custom-scrollbar")[0].scrollHeight
                );

                // messageBody = document.querySelector('.content');
                // messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight ;
            }
        };
        this.socket.on('refresh-conversations', async function (msg) {
            const tomsg = msg[0];
            const frmmsg = msg[1];
            console.log('ye bar')
            if (window.localStorage.getItem("log_id") === frmmsg || frmmsg === this.state.toId) {
                if (window.localStorage.getItem("log_id") === frmmsg) {
                    console.log('ekbar')
                    await this.getConversations()
                }
                else if (
                    this.state.toId === tomsg ||
                    tomsg === window.localStorage.getItem("log_id")
                ) {
                    console.log('do-bar',this.state.toId)
                    await this.getConversations()
                }

            }
            else if (
                $(".conversation-list")
                    .find("[id='" + frmmsg + "']:not(.worksn_active)")
                    .find(".cntShow") &&
                tomsg === window.localStorage.getItem("log_id")
            ) {
                console.log('three-bar')
                await this.getConversations()
                document.getElementById("myAudio").play();
                this.setState({
                    totalUnreadCnt: this.state.totalUnreadCnt + 1
                })
            }
        }.bind(this))
        this.socket.on('chat-message-prod', function (data) {
        })
    }

    componentDidMount() {
        if (localStorage.getItem('sellerid')) {
            console.log('Yaha Update')
            // this.getConversations(this.state.from, this.state.size);
        }
        else {
            this.setState({
                notLoggedIn: true
            })
        }
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        document.addEventListener('scroll', this.trackScrolling);
        document.addEventListener('scroll', this.scrollCalled);
        // if(this.props.chatWithSupplier) {
        //     if(localStorage.getItem('sellerid')) {
        //         console.log(this.props,'didmount')
        //         this.sendNotiToSeller()
        //         if(!this.state.sendToSeller) {
        //             this.openMsg(this.props.item.company,this.props.item.sellerid ? this.props.item.sellerid : '7340477')
        //         }
        //     }
        //     $(".cntList").slideToggle(300,'swing')
        // }

    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        document.addEventListener('scroll', this.trackScrolling);
        document.addEventListener('scroll', this.scrollCalled);

    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
        // console.log(this.state.width)
        // if (this.state.width <= 600 && this.state.width > 0) {
        //     if ($(".cntList").css('display') === 'none') {
        //         console.log(111)
        //         this.scrollcntList()
        //     }
        // }
        // else {
        //     $('.chatWindow').addClass('d-block').removeClass('d-none')
        // }

    }
    scrollcntList = async () => {
       
        // console.log('popup called',366);
        if(this.state.step1 === true && this.state.step2 === false && window.localStorage.getItem("log_id") != '' && window.localStorage.getItem("log_id") != 'null' && window.localStorage.getItem("log_id") !== null){
            // console.log('api called',this.state,window.localStorage.getItem("log_id"));
            try{
                await Axios.post(
                    ApiUrl + "/common/check_seller_type.php",
                    { sellerid: window.localStorage.getItem("log_id")},
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                ).then(async response => {
                    console.log(response);
                     if(response.data.status == 'Success' && response.data.result[0].main_cat !== null && response.data.result[0].main_cat != 0){
                         console.log(response.data.status,response.data.result[0].cat2,'if condition called')
                         this.setState({
                             step1:false,
                             step2:false
                         })
                         this.getConversations(this.state.from, this.state.size);
                    }else{
                        console.log('else is called in api response',response.data.result[0]);
                        this.setState({
                            step1:false,
                            step2:true,
                            userType:response.data.result[0].user_type
                        })  
                    }
                });
            }
            catch(err){
                console.log(err);
            }
           
        }
        if (this.state.width <= 600) {

            $(".chatTab").css('display', 'block')
            // $(".cntList").slideToggle(300, "swing");
            $(".cntList").slideDown(300, "swing");
            $('.cntList').css('display', 'block')
            window.history.pushState(null, "", window.location.href);
            window.onpopstate = function () {
                window.history.pushState(null, "", window.location.href);
            };
        } else {
            $(".cntList").slideToggle(300, "swing");
        }

    };
    isBottom(el) {
        return el.height() <= window.pageYOffset;
    }
    isTop(el) {
        return el.scrollTop() <= window.pageYOffset
    }
    trackScrolling = () => {
        const wrappedElement = $('#sticky');
        if (this.isBottom(wrappedElement)) {
            // console.log('header bottom reached');
            this.sendNotiToSeller()
            document.removeEventListener('scroll', this.trackScrolling);
        }

    };
   
    scrollCalled = () => {
        if (this.isTop($("header"))) {
            // console.log('header touched');
            if (getCookie('systemMsg') === '0') {
                // console.log(getCookie('systemMsg'))
                $('.systemMsg').addClass('d-block').removeClass('d-none')
                try {
                    document.getElementById("myAudio").play();
                } catch (e) {
                    console.log(e)
                }
            }

            document.removeEventListener('scroll', this.scrollCalled);
        }
    }
    getConversations = async (from, size) => {
        // console.log(from,size)
        this.setState({
            isLoading: true
        })
        await Axios.post(
            imgUrl + "/chat-api/get_contact_list_new.php",
            { sellerid: window.localStorage.getItem("sellerid"), from: from, size: size },
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(async response => {
            // console.log(response)
            this.setState({ isLoading: false })
            if (response.data.result) {
                await this.setState(prevState => {
                    let conversations = response.data.result.map(result => {
                        //   if(i===true){
                        //     i= false;
                        //     this.setState({ name:`${result.name}`,tomsg1:result.sellerid,to_lng1:result.to_lng})
                        //     this.setState({ active:result.sellerid });
                        //   }
                        return {
                            key: result.sellerid,
                            photo: result.picture,
                            name: `${result.name}`,
                            text: result.msg,
                            tomsg: result.sellerid,
                            cnt: result.cnt,
                            to_lng: result.to_lng
                        };
                    });
                    return { ...prevState, conversations };
                });
                // this.setState({ modalShow: false });
                this.setState({ errmsgshow: true });
            } else {
                // console.log(11);
                this.setState(prevState => {
                    let conversations = ["No chat found"];
                    return { ...prevState, conversations };
                });
                this.setState({ errmsgshow: false });
                // $('.myModal').modal("show")
            }
            // console.log(this.state.conversations);
        });
    };
    //Functionalities
    msgOver = async () => {
        if (this.state.width >= 600) {
            $(".scrollCnt").slideToggle(300, "swing");
        } else {
            $(".scrollCnt").slideDown(300, "swing");
            window.history.pushState(null, "", window.location.href);
            window.onpopstate = function () {
                window.history.pushState(null, "", window.location.href);
            };
        }
        if (this.state.incWidth === 0) {
            $(".msg-overlay-conversation-bubble").css({
                width: "336px",
                height: "400px"
            });
            // console.log(this.state.incWidth, "Open")
            this.setState({ incWidth: 1 });
            // await this.getMessages()
            // console.log(111)
            // $("#active-"+this.state.toId).css({display:'none'})
        } else {
            // console.log(this.state.incWidth, "CLose")

            this.setState({ incWidth: 0 });
            $(".msg-overlay-conversation-bubble").css({
                width: "200px",
                height: $(".msg-overlay-conversation-header").height() + 10
            });
            // $("#active-"+this.state.toId).css({display:'none'})
        }
    };
    openMsg = async (tomsg, toId, picture) => {
        // console.log(tomsg)
        // this.setState({incWidth:0})
        await this.setState({
            tomsg: tomsg,
            toId: toId,
            picture: picture,
            messages: []
        });
        if (this.state.active === toId) {
            this.setState({ active: toId });
        } else {
            this.setState({ active: toId });
        }
        $("#window-" + toId).show();

        $("#active-" + this.state.toId).css({ display: "none" });

        // console.log(this.state.tomsg, "Pass")
        // $(".msg-rooms").append('<div className="card chat-room small-chat wide msg-overlay-conversation-bubble" id="'+toId+'" style="width: 336px;"><div className="card-header white d-flex justify-content-between p-2 msg-overlay-conversation-header" id="toggle" style="background-color: rgb(15, 117, 204);"><div className="heading d-flex justify-content-start"><div className="profile-photo align-self-center"><span className="state"></span></div><div className="data"><p className="name mb-0 text-white"><strong>'+tomsg+'</strong></p></div></div><div className="icons grey-text text-white"><a id="closeMsgBtn" className="scrollCnt" style="display: inline;"><i className="fa fa-times mr-2"></i></a></div></div><div className="my-custom-scrollbar scrollCnt" id="message" style="display: block;"><div className="card-body p-3"><div className="media mb-1"><img className="d-flex rounded mr-2 cntImg align-self-center" src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="Generic placeholder image"><div className="media-body"><div className="my-0">Madhuri Agwan</div><div className="mb-0 text-muted" style="font-size: 12px;">Web Designer at MDBootstrap</div></div></div><hr className="my-2"><div className="message  start end"><div className="timestamp">Wednesday, November 6, 2019 7:27 PM</div><div className="bubble-container"><div className="bubble" title="Wednesday, November 6, 2019 7:27 PM">HOW are you?<br> </div></div></div><div className="message mine start "><div className="bubble-container"><div className="bubble" title="Wednesday, November 6, 2019 7:27 PM">HOW are you?<br> </div></div></div><div className="message mine  end"><div className="bubble-container"><div className="bubble" title="Wednesday, November 6, 2019 7:27 PM">Great!<br> </div></div></div><div className="chat-message"><div className="media mb-1"><img className="d-flex rounded mr-2 cntImg align-self-center" src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="Generic placeholder image"><div className="media-body"><div className="my-0">Madhuri Agwan</div><div className="mb-0 text-muted" style="font-size: 12px;">Web Designer at MDBootstrap</div></div></div><hr className="my-2"><div className="card bg-primary rounded w-75 float-right z-depth-0 mb-1"><div className="card-body p-2"><p className="card-text text-white msgTxt">Lorem ipsum dolor sit amet consectetur adipisicing elit voluptatem cum eum tempore.</p></div></div><div className="card bg-primary rounded w-50 float-right z-depth-0 mb-2"><div className="card-body p-2"><p className="card-text text-white msgTxt">Rem suscipit lorum repellendus ditiis?</p></div></div><div className="card bg-light rounded w-75 z-depth-0 mb-1 message-text"><div className="card-body p-2"><p className="card-text black-text msgTxt">Nostrum minima cupiditate assumenda, atque cumque hic voluptatibus at corporis maxime quam harum.</p></div></div><div className="d-flex justify-content-start"><div className="profile-photo message-photo"><img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="avatar" className="avatar rounded-circle mr-2 ml-0 cntImg"><span className="state"></span></div><div className="card bg-light rounded w-75 z-depth-0 mb-2"><div className="card-body p-2"><p className="card-text black-text msgTxt">Qui animi molestiae autem nihil optio recusandae nisi sit ab quo est.</p></div></div></div><div className="card bg-primary rounded w-75 float-right z-depth-0 mb-1 last"><div className="card-body p-2"><p className="card-text text-white msgTxt">Maxime nostrum ut blanditiis a quod quam, quidem deleniti?</p></div></div><div className="card bg-primary rounded w-75 float-right z-depth-0 mb-1 last"><div className="card-body p-2"><p className="card-text text-white msgTxt">Maxime nostrum ut blanditiis a quod quam, quidem deleniti?</p></div></div></div></div></div><div className="card-footer text-muted white pt-1 pb-2 px-3 scrollCnt" style="display: block;"><form className=""><input type="text" id="exampleForm2" className="form-control" placeholder="Type a message..." name="msg"><div className="d-none"><a><i className="fa fa-file-image mr-2"></i></a><a><i className="fa fa-laugh mr-2"></i></a><a><i className="fa fa-gamepad mr-2"></i></a><a><i className="fa fa-paperclip mr-2"></i></a><a><i className="fa fa-camera mr-2"></i></a></div><div className=""><button className="float-right py-0 mt-1 btn text-white" style="background-color: rgb(15, 117, 204);"><small>Send</small></button></div></form></div></div>')
        // console.log()

        await this.getMessages();
        // console.log(this.state.messages)
        // var msgs = this.renderMessages()
        // $(".msg-rooms").append(`<div className="card chat-room small-chat wide msg-overlay-conversation-bubble" id="myForm" style="width: 336px;"><div className="card-header white d-flex justify-content-between p-2 msg-overlay-conversation-header" id="toggle" style="background-color: rgb(15, 117, 204);"><div className="heading d-flex justify-content-start"><div className="profile-photo align-self-center"><span className="state"></span></div><div className="data"><p className="name mb-0 text-white"><strong>${tomsg}</strong></p></div></div><div className="icons grey-text text-white"><a id="closeMsgBtn" className="scrollCnt" style="display: inline;"><i className="fa fa-times mr-2"></i></a></div></div><div className="my-custom-scrollbar scrollCnt" id="message" style="display: block;"><div className="card-body p-3"><div className="media mb-1"><img className="d-flex rounded mr-2 cntImg align-self-center" src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="Generic placeholder image"><div className="media-body"><div className="my-0">${this.state.tomsg}</div><div className="mb-0 text-muted" style="font-size: 12px;">Web Designer at MDBootstrap</div></div></div><hr className="my-2"><div className="messageWindow">${journalEntries}</div></div></div><div className="card-footer text-muted white pt-1 pb-2 px-3 scrollCnt" style="display: block;"><form className=""><input type="text" id="exampleForm2" className="form-control" placeholder="Type a message..." name="msg"><div className="d-none"><a><i className="fa fa-file-image mr-2"></i></a><a><i className="fa fa-laugh mr-2"></i></a><a><i className="fa fa-gamepad mr-2"></i></a><a><i className="fa fa-paperclip mr-2"></i></a><a><i className="fa fa-camera mr-2"></i></a></div><div className=""><button className="float-right py-0 mt-1 btn text-white" style="background-color: rgb(15, 117, 204);"><small>Send</small></button></div></form></div></div>`)
        // console.log($('.messageWindow').length, msgs);
        // $('.messageWindow').html('<div>i am jeera'+msgs+'</div>');
        // $('.messageWindow').html(journalEntries);
        if (this.state.incWidth === 0) {
            await this.msgOver();
        }
        if (this.state.width <= 600) {
            // console.log(1)
            $('.chatWindow').addClass('d-none').removeClass('d-block')
            // $('.chatWindow').addClass('d-block').removeClass('d-none')
            if ($('.chatTab').css('display') === 'none') {
                $('.chatTab').addClass('d-block').removeClass('d-none')
            }

        }
        else {
            $('.chatWindow').addClass('d-block').removeClass('d-none')
        }
        // console.log($('.my-custom-scrollbar')[0].scrollHeight)
        // cnt = cnt + $('.my-custom-scrollbar')[0].scrollHeight
        // $('.my-custom-scrollbar').scrollTop(76);
        // $('.my-custom-scrollbar').scrollTop($('.my-custom-scrollbar')[0].scrollHeight);
        // console.log($('.my-custom-scrollbar')[0].scrollHeight)
        // $(".message").slideToggle(300,'swing')
    };
   
    onChange = (err, no, data) => {
        // console.log('number: ', err)
        type = err
        number = no
        this.setState({
            contact: number,
            contactError: type
        })
        isoValue = data.iso2
        dialCode = data.dialCode
        countryName = data.name.replace(/ *\([^)]*\) */g, "")
    }

    getMessages = () => {
        Axios.post(
            `${imgUrl}/chat-api/get_history_chat.php`,
            { tomsg: this.state.toId, frmmsg: window.localStorage.getItem("log_id") },
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(res => {
            if (res.data.status.toLowerCase() !== "Failed".toLowerCase()) {
                console.log(res.data,'ConversationListitem',531,this.prevState,this.state.toId);
                this.setState(prevState => {
                    return {
                        ...prevState,
                        messages: res.data.result
                    };
                });
            } else {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        messages: ""
                    };
                });
            }
            if (this.state.toId === '7340477') {
                console.log(this.state.toId,this.state.messages.slice())
                var newMessages = this.state.messages.slice()
                const arr = {
                    id: this.state.messages.count + 1,
                    author: "orange",
                    message: 'Welcome to Beldara.com, if you need help simply reply to this message, we are online and ready to help.',
                    timestamp: new Date().getTime()
                };
                if (newMessages !== "") {
                    // newMessages.push(arr);
                    // console.log(111)

                } else {
                    // console.log(111)
                    newMessages = [arr];
                }
                this.setState(prevState => {
                    return {
                        ...prevState,
                        messages: newMessages
                    };
                });

            }
            $(".my-custom-scrollbar").scrollTop(
                $(".my-custom-scrollbar")[0].scrollHeight
            );

            //   var messageBody = document.querySelector('.content');
            //   messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight ;
        });
    };
    fetchMoreData = () => {
        if (this.state.conversations.length >= 500) {
            this.setState({ hasMore: false });
            return;
        }
        this.setState({
            from: this.state.from + 5
        })
        // console.log(this.state.from)
        this.getConversations(this.state.from, this.state.size)
        // a fake async api call like which sends
        // 20 more records in .5 secs
        // setTimeout(() => {
        //   this.setState({
        //     items: this.state.items.concat(Array.from({ length: 20 }))
        //   });
        // }, 500);
    };
    sendNotiToSeller = async (nextProps) => {
        // console.log(nextProps)
        if (localStorage.getItem('sellerid') && window.location.pathname.split('/')[1] === 'product' && this.state.sendToSeller) {
            const buyerid = JSON.parse(localStorage.getItem('sellerid'))
            const state = localStorage.getItem("state")
            const user = JSON.parse(state)
            // console.log(this.props.item.sellerid)
            if (this.props.chatToSeller.chatWithSupplier) {
                // console.log(buyerid, this.props)
                await Axios.post(
                    `${imgUrl}/chat-api/msg_insert_into.php`,
                    {
                        frmmsg: buyerid, tomsg: this.props.chatToSeller.item.sellerid ? this.props.chatToSeller.item.sellerid : '7340477',
                        ssid: this.props.chatToSeller.item.id,
                        prod_name: this.props.chatToSeller.item.name,
                        prod_url: this.props.chatToSeller.item.url,
                        prod_image_url: this.props.chatToSeller.item.img,
                        is_watch: 0,
                        name: user.user.user.name,
                        type: 'toSeller'
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                ).then(async res => {
                    await this.getConversations()
                    this.openMsg(this.props.chatToSeller.item.company, this.props.chatToSeller.item.sellerid ? this.props.chatToSeller.item.sellerid : '7340477')
                });
                this.setState({
                    sendToSeller: false
                })
            }
            else {
                // console.log(this.props)

                await Axios.post(
                    `${imgUrl}/chat-api/send_noti_to_seller.php`,
                    {
                        sellerid: buyerid, sellerProduct: this.props.item.sellerid ? this.props.item.sellerid : '7340477',
                        productId: this.props.item.id,
                        prod_name: this.props.item.name,
                        prod_url: this.props.item.url,
                        prod_image_url: this.props.item.img,
                        name: user.user.user.name,
                        type: 'toSeller'
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                ).then(async res => {
                    await this.sendNotiToSupport()
                });
                this.setState({
                    sendToSeller: false
                })
            }
        }
        else if (this.props.chatToSeller && this.state.sendToSeller) {
            let buyerid = JSON.parse(localStorage.getItem('sellerid'))
            let state = localStorage.getItem("state")
            let user = JSON.parse(state)
            // console.log(this.props.chatToSeller,this.state.sendToSeller,'STATE')
            await Axios.post(
                `${imgUrl}/chat-api/msg_insert_into.php`,
                {
                    frmmsg: buyerid,
                    tomsg: this.props.chatToSeller.sellerid ? this.props.chatToSeller.sellerid : '7340477',
                    // ssid: this.props.chatToSeller.item.id,
                    // prod_name: this.props.chatToSeller.item.name,
                    // prod_url: this.props.chatToSeller.item.url,
                    // prod_image_url: this.props.chatToSeller.item.img,
                    is_watch: 0,
                    name: user.user.user.name,
                    type: 'toSeller'
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            ).then(async res => {
                await this.getConversations()
                this.openMsg(this.props.chatToSeller.company, this.props.chatToSeller.sellerid ? this.props.chatToSeller.sellerid : '7340477')
            });
            this.setState({
                sendToSeller: false
            })
        }
        else if (nextProps) {
            let buyerid = JSON.parse(localStorage.getItem('sellerid'))
            let state = localStorage.getItem("state")
            let user = JSON.parse(state)
            // console.log(nextProps.chatToSeller,this.state.sendToSeller,'NEW PROPS')
            await Axios.post(
                `${imgUrl}/chat-api/msg_insert_into.php`,
                {
                    frmmsg: buyerid,
                    tomsg: nextProps.chatToSeller.sellerid ? nextProps.chatToSeller.sellerid : '7340477',
                    ssid: nextProps.chatToSeller.id,
                    prod_name: nextProps.chatToSeller.name,
                    prod_url: nextProps.chatToSeller.url,
                    prod_image_url: nextProps.chatToSeller.img,
                    is_watch: 0,
                    name: user.user.user.name,
                    type: 'toSeller'
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            ).then(async res => {
                await this.getConversations()
                // this.openMsg(nextProps.chatToSeller.company, nextProps.chatToSeller.sellerid ? nextProps.chatToSeller.sellerid : '7340477')
            });
            this.setState({
                sendToSeller: false
            })
        }
        else {
            this.setState({
                notLoggedIn: true
            })
        }
    }
    sendNotiToSupport = () => {
        //Online nahi rehega toh wo bhi karna he


        //
        const buyerid = JSON.parse(localStorage.getItem('sellerid'))
        const product = {
            prod_name: this.props.item.name,
            prod_url: this.props.item.url,
            prod_id: this.props.item.id,
            prod_image_url: this.props.item.img
        }
        this.socket.emit('chat-message-prod', { buyerid, product, sellerProduct: this.props.item.sellerid, support: "7340477" });
        // this.socket.emit('chat-message-prod',[this.state.value,this.props.toId,window.localStorage.getItem("log_id")])
        // this.socket.emit('chat message',[productid,"7340477",buyerid])
        setTimeout(this.fwdToSupport, 2000);
    }
    fwdToSupport = () => {
        // this.socket.emit();
        const buyerid = JSON.parse(localStorage.getItem('sellerid'))
        // console.log(this.props)

        Axios.post(
            `${imgUrl}/chat-api/send_noti_to_seller.php`,
            {
                sellerid: buyerid, sellerProduct: this.props.item.sellerid ? this.props.item.sellerid : '7340477',
                productId: this.props.item.id, type: 'toSupport'
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(async res => {
            // this.socket.emit('chat-support',{ buyerid, productid, sellerProduct, productid });

            await this.getConversations()
            if (res.data.statusId === 1) {
                // $(".systemMsg").addClass('d-block').removeClass('d-none')
                // try {
                //     document.getElementById("myAudio").play();
                // } catch (e) {
                //     console.log(e)
                // }
                this.setState({
                    totalUnreadCnt: this.state.totalUnreadCnt + 1
                })
            }
        });
    }
    chatSupportOpen = () => {
        $(".systemMsg").addClass('d-none').removeClass('d-block');
        const systemMsg = getCookie('systemMsg')
        if (systemMsg === '0') {
            setCookie('systemMsg', 1, 1)
        }

        //Product View
        if (localStorage.getItem('sellerid')) {
            Axios.post(
                `${ApiUrl}/common/new_seller.php`,
                {
                    sellerid: localStorage.getItem("log_id"),
                    security_token: "",
                    plateform_type: "",
                    userType: this.state.userType,
                    type: "chat"
                },
                { headers: { "Content-Type": "multipart/form-data" } }
            ).then(async response => {
                this.getConversations()
                this.openMsg('Beldara Support', response.data.result)
            });

        }
        else {
            this.scrollcntList()
        }
    }
    /// Receive Props

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        // console.log(nextProps, 'Main')
        // if(this.props.chatWithSupplier) {
        //     if(localStorage.getItem('sellerid')) {
        //         console.log(this.props,'didmount')
        //         this.sendNotiToSeller()
        //         if(!this.state.sendToSeller) {
        //             this.openMsg(this.props.item.company,this.props.item.sellerid ? this.props.item.sellerid : '7340477')
        //         }
        //     }
        //     $(".cntList").slideToggle(300,'swing')
        // }
        // console.log(nextProps, '')
        if (nextProps.chatToSeller.chatWithSupplier && this.state.chatWithSupplier) {
            if (localStorage.getItem('sellerid')) {
                if (!this.state.sendToSeller) {
                    // console.log(nextProps, 'receiveprops')
                    let nxtprops = nextProps
                    this.sendNotiToSeller(nxtprops)
                    // this.openMsg(this.props.item.company, this.props.item.sellerid ? this.props.item.sellerid : '7340477')
                    this.openMsg(nextProps.chatToSeller.company, nextProps.chatToSeller.sellerid ? nextProps.chatToSeller.sellerid : '7340477')
                }
            }
            // $(".cntList").slideUp(300,'swing')
        }
    }
    componentDidUpdate(prevProps, nextProps) {
        // console.log(prevProps, 'Update', this.props)
        console.log(this.state,'componentdidupdate called',869);
        if(this.state.step2){
            console.log('if condition is called');

        }
        else
        if (this.props.chatToSeller.chatWithSupplier && !this.state.chatWithSupplier && !prevProps.chatToSeller.chatWithSupplier && this.state.step2 === false) {
            console.log('else is called');
            this.setState({
                chatWithSupplier: true
            })
            if (this.props.chatToSeller.chatWithSupplier) {
                if (localStorage.getItem('sellerid')) {
                    // console.log(this.props, 'didmount')
                    this.sendNotiToSeller()
                    if (!this.state.sendToSeller) {
                        this.openMsg(this.props.chatToSeller.company, this.props.chatToSeller.sellerid ? this.props.chatToSeller.sellerid : '7340477')
                    }
                }
                $(".cntList").slideToggle(300, 'swing')
            }
        }
        //  if(prevProps.chatWithSupplier) {
        //     if(localStorage.getItem('sellerid')) {
        //         console.log(prevProps,'didmount')
        //         this.sendNotiToSeller()
        //         if(!this.state.sendToSeller) {
        //             this.openMsg(this.props.item.company,this.props.item.sellerid ? this.props.item.sellerid : '7340477')
        //         }
        //     }
        //     $(".cntList").slideToggle(300,'swing')
        // }
    }
    ////Login /Sign up
    footerData = (data) => {
        if (data.modalChange)
            this.setState({
                signup: data.modal,
                login: data.modal
            })

        this.setState({
            reload: data.reload
        })
        // console.log(success)
        if (data.success) {
            localStorage.setItem('log_id', data.data.sellerid)
            this.setState({ notLoggedIn: false })
            // this.getConversations()
        }

    };

    closeModal = () => {
        this.setState({
            login: false,
            signup: false,
        })
    }

    openSignUpModal = () => {
        this.setState({
            signup: true,
            login: false,
        });
    }

    openLoginModal = () => {
        this.setState({
            signup: false,
            login: true,
        });
    }
   
    // chatSubmit = e => {
    //     $('.mobileErr').addClass('d-none');
    //     e.preventDefault();
    //     let search = window.location.search;
    //     let params = new URLSearchParams(search);
    //     $('.mobileErr').addClass('d-none');
    //     const target = e.target;
    //     const email = target.email.value;
    //     // const contact = target.contact.value;
    //     const name = target.name.value;
    //     const visitorid = getCookie('mhinpbnb')
    //     const cname = params.get('campaign')
    //     const target1 = params.get('target')
    //     const source = params.get('source')
    //     const userType = target.userType.value
    //     console.log(userType)
    //     // const contact = target.contact.value;
    //     Axios.post(
    //         `${ApiUrl}/common/new_seller.php`,
    //         {
    //             email: email,
    //             name: name,
    //             currentUrl: window.location.pathname,
    //             mobile: this.state.contact,
    //             security_token: "",
    //             plateform_type: "",
    //             visitorid: visitorid,
    //             cname: cname,
    //             source: source,
    //             target: target1,
    //             countryid: dialCode,
    //             country: isoValue,
    //             country_name: countryName,
    //             userType:userType,
    //             type: "new_seller"
    //         },
    //         { headers: { "Content-Type": "multipart/form-data" } }
    //     ).then(async response => {
    //         this.setState({
    //             sellerid: response.data.result.sellerid,
    //             name: response.data.result.name,
    //             userType: userType,
    //             step1:false,
    //             step2:true
    //         });
    //         localStorage.setItem('log_id', response.data.result.sellerid)
    //         this.setState({ notLoggedIn: false })
    //         setCookie("mhinpbn", response.data.result.sellerid, "365");
    //         localStorage.setItem("sellerid", response.data.result.sellerid);
    //         store.dispatch(getUpdateUser(response.data.result.sellerid));
    //         // if (!this.props.chatToSeller.chatWithSupplier) {
    //         //     this.chatSupportOpen()
    //         // }
    //         // this.sendNotiToSeller()
    //     });
    // };

    chatSubmit = e => {
        $('.mobileErr').addClass('d-none');
        $('#spinnerID').removeClass('d-none');
        e.preventDefault();
        let search = window.location.search;
        let params = new URLSearchParams(search);
        $('.mobileErr').addClass('d-none');
        const target = e.target;
        const email = target.email.value;
        // const contact = target.contact.value;
        const name = target.name.value;
        const visitorid = getCookie('mhinpbnb')
        const cname = params.get('campaign')
        const target1 = params.get('target')
        const source = params.get('source')
        const userType = target.userType.value
        console.log(userType)
        // const contact = target.contact.value;
        Axios.post(
            `${ApiUrl}/common/new_seller_demo.php`,
            {
                email: email,
                name: name,
                currentUrl: window.location.pathname,
                mobile: this.state.contact,
                security_token: "",
                plateform_type: "",
                visitorid: visitorid,
                cname: cname,
                source: source,
                target: target1,
                countryid: dialCode,
                country: isoValue,
                country_name: countryName,
                userType:userType,
                type: "new_seller"
            },
            { headers: { "Content-Type": "multipart/form-data" } }
        ).then(async response => {
            $('#spinnerID').addClass('d-none');
            this.setState({
                sellerid: response.data.result.sellerid,
                name: response.data.result.name,
                // userType: userType,
                // step1:false,
                // step2:true
            });
            localStorage.setItem('log_id', response.data.result.sellerid)
            this.setState({ notLoggedIn: false })
            // setCookie("mhinpbn", response.data.result.sellerid, "365");
            localStorage.setItem("sellerid", response.data.result.sellerid);
            store.dispatch(getUpdateUser(response.data.result.sellerid));
            try{
                await Axios.post(
                    ApiUrl + "/common/check_seller_type.php",
                    { sellerid: response.data.result.sellerid},
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                ).then(async response => {
                    console.log(response);
                     if(response.data.status == 'Success' && response.data.result[0].main_cat !== null && response.data.result[0].main_cat != 0){
                         console.log(response.data.status,response.data.result[0].cat2,'if condition called')
                         this.setState({
                             step1:false,
                             step2:false,
                             loginWithOtp:true
                         })
                         //this.getConversations(this.state.from, this.state.size);
                    }else{
                        console.log('else is called in api response',response.data.result[0]);
                        this.setState({
                            step1:false,
                            step2:true,
                            userType:response.data.result[0].user_type
                        })  
                    }
                });
            }
            catch(err){
                console.log(err);
            }
            // if (!this.props.chatToSeller.chatWithSupplier) {
            //     this.chatSupportOpen()
            // }
            // this.sendNotiToSeller()
        });
    };
   
    onChangedropdown = (event, { newValue, newId, method }) => {
        var split_value = newValue.split('~');
        this.setState({
            value: split_value[0],
            productid:'',
            id: parseInt(split_value[1])
        });
        // console.log(newValue,typeof newValue,1004,split_value,this.state,split_value[1],1012);
    };
    onSuggestionsFetchRequested = ({ value }) => {
        let userData = {
            term: value
        }
        productid = '';
        userData = JSON.stringify(userData)
        let formData = new FormData()
        formData.append('term', userData)
        // console.log(formData,value);
        Axios.post("https://api.indiabigshop.com/common/get_categories.php", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                // console.log(response);
                let data = response.data.result.map(result => {
                    return {
                        name: `${result.name}`,
                        id:`${result.id}`
                    };
                });

                data_suggestion = response.data.result.map(result => {
                    return {
                        name: `${result.name}`,
                        id: `${result.id}`
                    };
                });
                this.setState({
                    suggestions: data
                });
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);
            });
     
    };
    submitstep2 = e =>{
        $('#spinnerIDGO').removeClass('d-none');
        console.log('form submitted!....',this.state,typeof this.state.id,1048);
        e.preventDefault();
        // return false;
        this.setState({
            validate:false
        })
        var otppass = $('#otp').val();
        var maunfacturer_type = $('#manufacturer_yes').prop("checked") ? 1 : 0;
        console.log(maunfacturer_type,1084);
        if(otppass != '' || otppass != null){
            if(this.state.id != '' && this.state.value != '' && !isNaN(this.state.id)){
                try{
                    Axios.post(
                        ApiUrl + "/common/update_categories_seller_demo.php",
                        {  
                            sellerid: window.localStorage.getItem("log_id"),
                            categories_id:this.state.id,
                            rtype:maunfacturer_type,
                            pass:otppass
                    },
                        {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    ).then(async response => {
                        if(response.data.status == 'Success'){
                            $('#spinnerIDGO').addClass('d-none');
                            console.log(response,1096);
                            // localStorage.setItem('log_id', window.localStorage.getItem("log_id"))
                                // this.setState({ notLoggedIn: false })
                                // setCookie("mhinpbn", window.localStorage.getItem("log_id"), "365");
                                // localStorage.setItem("sellerid", window.localStorage.getItem("log_id"));
                                // store.dispatch(getUpdateUser(window.localStorage.getItem("log_id")));
                                setCookie("mhinpbn", window.localStorage.getItem("log_id"), "365");
                                if (!this.props.chatToSeller.chatWithSupplier) {
                                    this.chatSupportOpen()
                                }
                                this.sendNotiToSeller()
                                this.setState({
                                    step1:false,
                                    step2:false
                                })
                        }else{
                            $('#spinnerIDGO').addClass('d-none');
                            $('#errorMSG').removeClass('d-none');
                        }
                    });
                }catch(err){
                    console.log(err);
                }
            }
            else{
                console.log('else is called in api response',1135);
                this.setState({
                    validate:true
                })
            }
        }else{
            console.log('Please enter correct password');
        }
    };

    submitstep3 = e =>{
        $('#spinnerIDGO').removeClass('d-none');
        e.preventDefault();
        var otppass = $('#otp').val();
        if(otppass != '' || otppass != null){
        try{
            Axios.post(
                ApiUrl + "/common/validateChatOTP.php",
                {  
                    sellerid: window.localStorage.getItem("log_id"),
                    pass:otppass
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
                ).then(async response => {
                    if(response.data.status == 'Success'){
                        $('#spinnerIDGO').addClass('d-none');
                        setCookie("mhinpbn", window.localStorage.getItem("log_id"), "365");
                        if (!this.props.chatToSeller.chatWithSupplier) {
                            this.chatSupportOpen()
                        }
                        this.sendNotiToSeller()
                        this.setState({
                            step1:false,
                            step2:false
                        })
                        }else{
                            $('#spinnerIDGO').addClass('d-none');
                            $('#errorMSG').removeClass('d-none');
                        }
                    });
                }catch(err){
                    console.log(err);
                }
        }else{
            console.log('Please enter correct password');
        }
    };
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };
    render() {
        console.log(this.state.step1,this.state.step2,1039,this.state);
        const InputPropsMobile = {
            required: true,
            placeholder: "Enter your mobile",
            name: "mobile",
            type: 'tel'
        }
        const { value, suggestions} = this.state;
        const InputProps = {
            placeholder: 'Primary Business Category',
            value,
            data:'s',
            onChange: this.onChangedropdown,
            name: "category_name",
            id: "category_name",
            required:true
        };
        // console.log(this.props.chatToSeller)
        return (
            <React.Fragment>
                <div className="chat-launcher" onClick={this.scrollcntList}>
                    <img
                        src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUxpcf///////////////////////////////////////////////////////3EAnbYAAAAOdFJOUwADZ66SoQjEhnS7/gsNGQL7+wAAAKtJREFUKM+F01sOhCAQRNESFV/I/pc70Og0YJfyJbmHhBAbGGYHstw8IPV4EOGOmERYIhGpxyUAJxHSz/xlC+1FxE64qB1yj1ZID7oXsel+63ovnj2JXUXue+hvrcLugL+EdG+9XBG8X+Kl34J3YM1g/egvIvdx5EK691RIz78YEXdnQrst6m6JqemXmNo+D/WJNAyVePZWWL0WdlfB+l+UAQQReaAc65DB/wGsZgzLN0IQWAAAAABJRU5ErkJggg==`}
                        className="chat-close-icon"
                    />
                    <img
                        src={`${imgUrl}/images/logo-no-bg.7718b3e3.svg`}
                        className="chat-open-icon d-block"
                    />
                    <div className="msgCount rounded-circle text-white px-1">
                    </div>
                </div>
                <div className="systemMsg d-none">
                    <div className="close-right text-right cursor-pointer" style={{ cursor: 'pointer' }} >
                        <i className="fa fa-times" onClick={() => {
                            $(".systemMsg").addClass('d-none').removeClass('d-block');
                            setCookie('systemMsg', 1, 1)
                        }
                        }></i>
                    </div>
                    <div className="systemMsgTab" onClick={this.chatSupportOpen}
                        style={{ cursor: 'pointer' }}>
                        <img src="https://beldara.com/images/User_Avatarpng.png" width="20px" height="20px" className="col-auto" style={{
                            position: 'absolute',
                            left: '-42px'
                        }} />

                        <small>We are online, you can communicate with us for your sourcing needs &amp; to give a boost to your sales.</small>
                    </div>
                </div>
                <div className="chatTab shadow border-1">
                    <div className="chatWindow bg-white">

                        <div className="msgTab py-2" onClick={this.scrollcntList}>
                            Messenger {this.state.totalUnreadCnt > 0 ? <span style={{ backgroundColor: '#0060ee', color: '#fff', padding: '0px 5px 2px 5px', marginLeft: '5px' }} className="rounded-circle "><small>{this.state.totalUnreadCnt}</small></span> : ''}
                        </div>
                        <div className="msgTabResp py-2" >
                            <img src={`https://img.beldara.com/images/Left-Arrow.png`} width="20px" style={{ marginRight: '20px' }} onClick={() => {
                                $(".chatTab").css('display', 'none');
                                window.location.reload()
                            }} /> Messenger
                        </div>
                        <div className="cntList">
                            <ul className="list-unstyled mb-0 conversation-list">
                                {
                                    this.state.conversations.length > 0 && this.state.errmsgshow ?
                                        this.state.conversations.map(conversation => (
                                            <ConversationListItem
                                                key={conversation.tomsg}
                                                data={conversation}
                                                active={this.state.active}
                                                openMsg={this.openMsg}
                                                deviceWidth={this.state.width}
                                            />
                                        ))
                                        :
                                        this.state.errmsgshow === false && this.state.isLoading == false ?
                                            <div className="container">
                                                <div className="row align-items-center">
                                                    <div className="col">
                                                        {
                                                            this.state.notLoggedIn || this.state.step2 || this.state.step1 ?
                                                                <React.Fragment>
                                                                    <div className="row align-items-center" style={{ height: '100%' }}>

                                                                        <div className="card">

                                                                            <div className="card-body">
                                                                                {
                                                                                    <div className="row justify-content-center">
                                                                                        <div
                                                                                            className="alert alert-success text-white"
                                                                                            style={{ backgroundColor: "#ff9944" }}
                                                                                        >
                                                                                            Please fill out the form below and we will get back to you as
                                                                                            soon as possible.
                                                                                            </div>
                                                                                        <div className="container">
                                                                                            <div className="row">
                                                                                                {
                                                                                                    this.state.step1 ? (
                                                                                                        <form onSubmit={this.chatSubmit} className="col px-0">
                                                                                                        <div className="col-md-12 my-2 px-0">
                                                                                                            <div className="has-float-label">
                                                                                                                <input
                                                                                                                    id="name"
                                                                                                                    type="name"
                                                                                                                    placeholder=" "
                                                                                                                    name="name"
                                                                                                                    className="form-control"
                                                                                                                    required
                                                                                                                />
                                                                                                                <label htmlFor="name">{"Name"}</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-md-12 my-2 px-0">
                                                                                                            <div className="has-float-label ">
                                                                                                                <input
                                                                                                                    id="email"
                                                                                                                    type="email"
                                                                                                                    placeholder="Email"
                                                                                                                    name="email"
                                                                                                                    className="form-control"
                                                                                                                    required
                                                                                                                />
                                                                                                                <label htmlFor="email">
                                                                                                                    {"Enter your email"}
                                                                                                                </label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-md-12 my-2 px-0">
                                                                                                            <div className="has-float-label ">
                                                                                                                <IntlTelInput
                                                                                                                    containerClassName="intl-tel-input"
                                                                                                                    inputClassName="form-control"
                                                                                                                    fieldId="contact"
                                                                                                                    geoIpLookup="true"
                                                                                                                    numberType="MOBILE"
                                                                                                                    autoPlaceholder="true"
                                                                                                                    onPhoneNumberChange={this.onChange}
                                                                                                                    onPhoneNumberBlur={this.change}
                                                                                                                    defaultCountry={`${getCookie('country_code') ? (getCookie('country_code').toLowerCase()) : 'in'}`}
                                                                                                                    numberType="MOBILE"
                                                                                                                    telInputProps={InputPropsMobile}
                                                                                                                />
                                                                                                                <label htmlFor="contact">
                                                                                                                    {"Enter your Mobile"}
                                                                                                                </label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="alert alert-danger d-none mobileErr">
                                                                                                            Please enter Valid Number
                                                                                                        </div>
                                                                                                        <div className="form-group text-center">
                                                                                                            <div className="mb-1 text-left">I am a :</div>
                                                                                                            <div className="form-check form-check-inline">
                                                                                                                <input
                                                                                                                    className="form-check-input"
                                                                                                                    type="radio"
                                                                                                                    name="userType" value="seller"
                                                                                                                    id="seller" required
                                                                                                                />
                                                                                                                <label className="form-check-label" htmlFor="seller">
                                                                                                                    Seller
                                                                                                                </label>
                                                                                                            </div>
                                                                                                            <div className="form-check form-check-inline">
                                                                                                                <input
                                                                                                                    className="form-check-input"
                                                                                                                    type="radio"
                                                                                                                    name="userType" value="buyer"
                                                                                                                    id="buyer" required
                                                                                                                />
                                                                                                                <label className="form-check-label" htmlFor="buyer">
                                                                                                                    Buyer
                                                                                                                </label>
                                                                                                            </div>
                                                                                                            <div className="form-check form-check-inline">
                                                                                                                <input
                                                                                                                    className="form-check-input"
                                                                                                                    type="radio"
                                                                                                                    name="userType" value="both"
                                                                                                                    id="both" required
                                                                                                                />
                                                                                                                <label className="form-check-label" htmlFor="both">
                                                                                                                    Both
                                                                                                                </label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-md-12 my-2 text-center">
                                                                                                        <button className="btn btn-solid"><div class="spinner-border d-none" id="spinnerID" style={{width: '1rem',height: '1rem'}}></div>&nbsp;Start Chat</button>
                                                                                                        </div>
                                                                                                </form>
                                                                                                    )
                                                                                                : (this.state.step2) ? (
                                                                                                    <form onSubmit={this.submitstep2} className="col px-0">
                                                                                                        <div class="alert alert-info" role="alert">
                                                                                                            OTP is sent to your email or mobile number. Please check and enter the OTP.
                                                                                                        </div>
                                                                                                        <div class="alert alert-warning d-none" id="errorMSG" role="alert">
                                                                                                            Please enter correct password or OTP
                                                                                                        </div>
                                                                                                        <div className="col-md-12 my-2 px-0">
                                                                                                            <div className="has-float-label">
                                                                                                                <input
                                                                                                                    id="otp"
                                                                                                                    type="password"
                                                                                                                    placeholder=" "
                                                                                                                    name="otp"
                                                                                                                    className="form-control"
                                                                                                                    required
                                                                                                                />
                                                                                                                <label htmlFor="otp">{"Enter password or OTP"}</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {this.state.validate ?
                                                                                                        <div className="text-danger">Please select business category</div>
                                                                                                            :
                                                                                                        ''
                                                                                                        }
                                                                                                        <div className="col-md-12 my-2 px-0">
                                                                                                        <Autosuggest
                                                                                                            suggestions={suggestions}
                                                                                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                                                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                                                                            getSuggestionValue={getSuggestionValue}
                                                                                                            renderSuggestion={renderSuggestion}
                                                                                                            inputProps={InputProps}
                                                                                                            className="form-control"
                                                                                                            id="category_name"
                                                                                                            style={{width:'100%'}}
                                                                                                        />
                                                                                                        {/* <label htmlFor="category_name">{'Get business category'}</label> */}
                                                                                                        </div>
                                                                                                        <div className="col-md-12 my-2 px-0">
                                                                                                            {(this.state.userType == 'seller' || this.state.userType == 'both') ?
                                                                                                            <div className="form-group text-center">
                                                                                                            <div className="mx-4 mb-1 text-left">
                                                                                                            <input
                                                                                                                    className="form-check-input"
                                                                                                                    type="checkbox"
                                                                                                                    name="manufacturerType" value="1"
                                                                                                                    id="manufacturer_yes"
                                                                                                                />
                                                                                                                Are you manufacture ?
                                                                                                           
                                                                                                            </div>
                                                                                                        </div>
                                                                                                            :
                                                                                                            ''    
                                                                                                        }
                                                                                                        </div>
                                                                                                        <div className="col-md-12 my-2 text-center">
                                                                                                            <button className="btn btn-solid"><div class="spinner-border d-none" id="spinnerIDGO" style={{width: '1rem',height: '1rem'}}></div>&nbsp;Go</button>
                                                                                                        </div>
                                                                                                </form>
                                                                                                // ) : (this.state.loginWithOtp) ? (
                                                                                                //     <form onSubmit={this.submitstep3} className="col px-0">
                                                                                                //         <div class="alert alert-info" role="alert">
                                                                                                //             OTP is sent to your email or mobile number. Please check and enter the OTP.
                                                                                                //         </div>
                                                                                                //         <div class="alert alert-warning d-none" id="errorMSG" role="alert">
                                                                                                //             Please enter correct password or OTP
                                                                                                //         </div>
                                                                                                //         <div className="col-md-12 my-2 px-0">
                                                                                                //             <div className="has-float-label">
                                                                                                //                 <input
                                                                                                //                     id="otp"
                                                                                                //                     type="password"
                                                                                                //                     placeholder=" "
                                                                                                //                     name="otp"
                                                                                                //                     className="form-control"
                                                                                                //                     required
                                                                                                //                 />
                                                                                                //                 <label htmlFor="otp">{"Enter password or OTP"}</label>
                                                                                                //             </div>
                                                                                                //         </div>
                                                                                                //         <div className="col-md-12 my-2 text-center">
                                                                                                //             <button className="btn btn-solid"><div class="spinner-border d-none" id="spinnerIDGO" style={{width: '1rem',height: '1rem'}}></div>&nbsp;Go</button>
                                                                                                //         </div>
                                                                                                // </form>
                                                                                                // )
                                                                                                ):''
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                                : <div className="col-md-12 my-2 px-0">
                                                                    <br></br>
                                                                <form onSubmit={this.submitstep3} className="col px-0">
                                                                <div class="alert alert-info" role="alert">
                                                                    OTP is sent to your email or mobile number. Please check and enter the OTP.
                                                                </div>
                                                                <div class="alert alert-warning d-none" id="errorMSG" role="alert">
                                                                    Please enter correct password or OTP
                                                                </div>
                                                                <div className="col-md-12 my-2 px-0">
                                                                    <div className="has-float-label">
                                                                        <input
                                                                            id="otp"
                                                                            type="password"
                                                                            placeholder=" "
                                                                            name="otp"
                                                                            className="form-control"
                                                                            required
                                                                        />
                                                                        <label htmlFor="otp">{"Enter password or OTP"}</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12 my-2 text-center">
                                                                    <button className="btn btn-solid"><div class="spinner-border d-none" id="spinnerIDGO" style={{width: '1rem',height: '1rem'}}></div>&nbsp;Go</button>
                                                                </div>
                                                        </form>
                                                        </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            :
                                            <div className="container">
                                                <div className="row align-items-center" style={{ width: '100%', height: '100%', position: 'absolute', textAlign: 'center', justifyContent: 'center' }}>
                                                    <div className="col">
                                                        <Loader
                                                            type="Oval"
                                                            color="#f5821e"
                                                            height={100}
                                                            width={100}
                                                        // visible={this.state.isLoading} //3 secs

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                }
                            </ul>
                        </div>
                    </div>
                    <div className="row d-flex msg-rooms">
                        {this.state.tomsg ? (
                            <Suspense fallback={"Loading"}>
                                <Messages
                                    messages={this.state.messages}
                                    tomsg={this.state.tomsg}
                                    toId={this.state.toId}
                                    msgOver={this.msgOver}
                                    picture={this.state.picture}
                                    deviceWidth={this.state.width}
                                    deviceHeight={this.state.height}
                                />
                            </Suspense>
                        ) : (
                                ""
                            )}
                    </div>
                </div>

                <div className="container d-none">
                    <audio id="myAudio">
                        <source
                            src="https://msg.beldara.com/assets/audio/stairs.mp3"
                            type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </React.Fragment>
        );
    }
}


export default Main