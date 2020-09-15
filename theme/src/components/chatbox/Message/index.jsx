import React, { Component } from 'react';
import moment from 'moment';
import './Message.css';

var date1;
export default class Message extends Component {
  componentDidMount(){
    console.log('componentdidmount called in Message',8);
    var message_scroll = document.getElementById('message').scrollHeight;
    document.getElementById('message').scrollTop = message_scroll;
  }
  timeZone(time) {
    if(time) {
      date1 = new Date(time);
      const lTimeDiff = date1.getTimezoneOffset()
      date1.setMinutes(date1.getMinutes()-lTimeDiff);
      var time = new Date(date1);
    }
    else {
      time = new Date().getTime()
    }
    return time;
  }
  render() {
    const {
      data,
      isMine,
      startsSequence,
      endsSequence,
      showTimestamp
    } = this.props;
    console.log(data,showTimestamp,'render',32);
    const friendlyTimestamp = moment(this.timeZone(data.timestamp)).format('LLLL');
    console.log(friendlyTimestamp);
    const urlCheck = /(https?:\/\/[^\s]+)/g;
    return (
      <React.Fragment>
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
            <div className="timestamp">
              { friendlyTimestamp }
            </div>
        }

        <div className="bubble-container">
          <div className="bubble" title={friendlyTimestamp}>
          { urlCheck.test(data.message) ? <a href={data.message} target="_blank" className={`${isMine ? 'text-white' : 'text-primary'} `}>{data.message}</a> : data.message }
          <br />
            {data.img===undefined || data.img===null ? ' ' : 
            <React.Fragment>
              <a href={data.prod_url} target="_blank">
                <img src={data.img_path+data.img} alt={data.name} width='100px' height='100px'/>
              </a>
              {
                data.prod_start_order_url===undefined || data.prod_start_order_url===null ? ' ' :
                <div className="">
                  <a className="startOrdBtn" href={data.prod_start_order_url} target="_blank">Start Order</a>
                </div>
              }
              
            </React.Fragment>
            }
          </div>
        </div>
      </div>
        
      </React.Fragment>
    );
  }
}