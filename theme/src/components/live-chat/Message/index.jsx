import React, { Component } from 'react';
import moment from 'moment';
import './Message.css';

export default class Message extends Component {
  render() {
    const {
      data,
      isMine,
      startsSequence,
      endsSequence,
      showTimestamp
    } = this.props;
    const friendlyTimestamp = moment(data.timestamp).format('LLLL');
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
            { data.message }<br />
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