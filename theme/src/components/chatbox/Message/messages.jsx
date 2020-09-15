import React, { Component } from 'react'
import $ from 'jquery'
import moment from 'moment';
import Message from './index'
import Compose from '../compose';
import io from 'socket.io-client';
import Axios from 'axios';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
const MY_USER_ID = 'apple';
export default class Messages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // incWidth: 0,
            // conversations: [],
            tomsg: null,
            messages: [],
            value:'',
        }
        if (window.location.hostname === 'localhost') {
            //Localhost
            this.socket = io('http://localhost:5000');
            //  var socket = io('http://localhost:5000');
        }
        else {
            //Live Server Connection
            this.socket = io(`https://beldara.com`, { transport: ["websocket"] });
        }
        // this.socket = io(`http://chat.worksena.com`, { transport: ["websocket"] });
        
        var typing = false;
        var timeout = undefined;
        this.handleChange = this.handleChange.bind(this);
        this.socket.on('UserTyping', function (msg) {
            // console.log('msg',msg)
            userTyping(msg);
        })

        function timeoutFunction() {
            typing = false;
            $(".userType").text('')
        }

        var userTyping = (msg) => {
            const frmmsg = msg[1];
            const tomsg = msg[0];
            let cnd = '';
            let company = '';
            // console.log('typing');
            company = msg[2]

            // company = this.props.tomsg;
            cnd = this.props.toId;
            // console.log('props',cnd,'frmmsg',frmmsg)

            if (window.localStorage.getItem("log_id") === frmmsg || frmmsg === cnd) {
                if (tomsg === window.localStorage.getItem("log_id")) {
                    if (typing === false) {
                        typing = true
                        $(".userType").text('typing...')
                        timeout = setTimeout(timeoutFunction, 1000);
                    } else {
                        clearTimeout(timeout);
                        timeout = setTimeout(timeoutFunction, 1000);
                    }
                }
                cnd = '';
            }
        }
        
    }

    handleChange(value) {
        this.setState({value: value});
        this.socket.emit('UserTyping',[this.props.toId,window.localStorage.getItem("log_id"),this.props.tomsg]);

      }
    renderMessages = () => {
        if (this.props.messages !== null) {

            let i = 0;
            let messageCount = this.props.messages.length;
            let messages = [];

            while (i < messageCount) {
                let previous = this.props.messages[i - 1];
                let current = this.props.messages[i];
                let next = this.props.messages[i + 1];
                let isMine = current.author === MY_USER_ID;
                let currentMoment = moment(current.timestamp);
                let prevBySameAuthor = false;
                let nextBySameAuthor = false;
                let startsSequence = true;
                let endsSequence = true;
                let showTimestamp = true;

                if (previous) {
                    let previousMoment = moment(previous.timestamp);
                    let previousDuration = moment.duration(currentMoment.diff(previousMoment));
                    prevBySameAuthor = previous.author === current.author;

                    if (prevBySameAuthor && previousDuration.as('hours') < 1) {
                        startsSequence = false;
                    }

                    if (previousDuration.as('hours') < 1) {
                        showTimestamp = false;
                    }
                }

                if (next) {
                    let nextMoment = moment(next.timestamp);
                    let nextDuration = moment.duration(nextMoment.diff(currentMoment));
                    nextBySameAuthor = next.author === current.author;

                    if (nextBySameAuthor && nextDuration.as('hours') < 1) {
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
            // console.log($('.my-custom-scrollbar')[0].scrollHeight)
            return messages;
        }

    }
    imgSubmit(e) {
        e.preventDefault();
        console.log(e.target.files[0])
        
        this.socket.emit('img-submit',[e.target.files[0],this.props.toId,window.localStorage.getItem("log_id")])
    }
    msgSubmit(e) {
        e.preventDefault();
        // const value = e.target.msg.value
        if(this.state.value==='') {
          return false
        }
        this.socket.emit('chat message',[this.state.value,this.props.toId,window.localStorage.getItem("log_id")])
        $(".exampleForm2").focus()
        // console.log(e.target.querySelector('#m').value)
        // e.target.querySelector('#m').value='';

        this.setState({value: ''});
        return false;
    }
    
    render() {
        
        return (
            <React.Fragment>
                <div className="card chat-room small-chat wide msg-overlay-conversation-bubble" id={`window-${this.props.toId}`} style={{border:'none'}}>
                    <div className="card-header white d-flex justify-content-between p-2 msg-overlay-conversation-header" onClick={this.props.msgOver} id="toggle" style={{ backgroundColor: '#f5821e' }}>
                        <div className="heading d-flex justify-content-start">
                            <div className="profile-photo align-self-center">
                                {/* <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="avatar" className="avatar rounded-circle mr-2 ml-0 cntImg align-self-center" /> */}
                                <span className="state"></span>
                            </div>
                            <div className="data">
                                <p className="name mb-0 text-white" style={{lineHeight: '13px'}}><strong>{this.props.tomsg}</strong></p>
                                <p className="activity mb-0 text-white" id={`active-${this.props.toId}`} style={{fontSize:'12px', lineHeight: '13px'}}>Active now</p>
                            </div>
                        </div>
                        <div className="icons grey-text text-white">
                            {/* <a className="feature text-white"><i className="fa fa-video mr-2 text-white bg-white"></i></a> */}
                            {/* <a className="feature"><i className="fa fa-phone mr-2"></i></a> */}
                            {/* <a className="feature"><i className="fa fa-cog mr-2"></i></a> */}
                            <a id="closeMsgBtn" onClick={() => {
                                $("#window-"+this.props.toId).hide();
                                if(this.props.deviceWidth<=600){
                                    $(".chatWindow").addClass('d-block').removeClass('d-none')
                                }
                            }} className="scrollCnt"><i className="fa fa-times mr-2"></i></a>
                        </div>
                    </div>
                    {/* <div className="messages"> */}
                    <div className="my-custom-scrollbar scrollCnt" id="message">
                        <div className="card-body p-3">
                            <div className="media mb-1">
                                <img className="d-flex rounded mr-2 cntImg align-self-center" src={`${this.props.picture}`} alt="Generic placeholder image" onError={(e)=>{e.target.onerror = null; e.target.src="https://img.beldara.com/images/User_Avatarpng.png"}}/>
                                <div className="media-body">
                                    <div className="my-0">{this.props.tomsg}</div>
                                    {/* <div className="mb-0 text-muted" style={{ fontSize: '12px' }}>Web Designer at MDBootstrap</div> */}
                                </div>
                            </div>
                            <hr className="my-2" />
                            {
                               this.props.messages.length>0 ?  this.renderMessages()
                               : <div style={{
                                position: 'absolute', left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)'
                                }}><Loader
                                    type="Puff"
                                    color="#00BFFF"
                                    height={100}
                                    width={100}
                                    /></div> 
                            }
                        </div>
                    </div>
                    <Compose value={this.state.value} msgSubmit={this.msgSubmit.bind(this)} handleChange={this.handleChange.bind(this)} tomsg={this.props.tomsg} imgSubmit={this.imgSubmit.bind(this)}/>
                    {/* </div> */}
                </div>
            </React.Fragment>
        )
    }
}
