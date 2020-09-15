import React, { Component } from 'react'
import $ from 'jquery'

export default class ConversationListItem extends Component {
    constructor() {
        super()
        this.state = {
            incWidth: 0
        }
    }
     
    render() {
        const { name, key, photo, text, cnt } = this.props.data
        // console.log(this.props.data)
        return (
            
                <React.Fragment>
                    
                    <li className={`media cnt ${this.props.active === key ? 'worksn_active' : ''}`} id={key} onClick={this.props.openMsg.bind(this, name, key, photo ? photo : 'https://img.beldara.com/images/User_Avatarpng.png')}>
                        {/* <img src={`${picture}`} className="mr-3 align-self-center cntImg" alt={name} /> */}
                        <div className="imgContain">
                            <img src={`${photo ? photo : 'https://img.beldara.com/images/User_Avatarpng.png'}`} className="mr-3 align-self-center cntImg rounded-circle" alt={`${name}`} onError={(e) => { e.target.onerror = null; e.target.src = "https://img.beldara.com/images/User_Avatarpng.png" }} />
                            <div className="onlineCheck">

                            </div>
                        </div>
                        <div className="media-body text-truncate">
                            <h6 className="m-0 text-truncate cntName">{name}</h6>
                            <div className="cntTxt">{text}</div>
                        </div>
                        <span className={`cntShow rounded text-right`} >
                            <div className='badge badge-success' style={{ display: cnt === '0' ? 'none' : '' }}>{cnt}</div>
                        </span>
                    </li>
                </React.Fragment>
             
        )
    }
}
