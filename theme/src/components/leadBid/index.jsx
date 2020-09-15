import React, { Component } from 'react'
import axios from "axios";
import ls from "local-storage";
import { ImgUrl,ApiUrl } from '../../constants/ActionTypes';

class LeadBid extends Component {

    constructor(props){
        super(props)
        this.state = {
            tlead : [],
            myReq: []
        }
    }

    componentDidMount(){
        axios.post(`${ApiUrl}/common/get_lead_auction.php`,
            {
                sellerid: ls.get('sellerid'), //user sellerid (buyer)
                security_token: "",
                plateform_type: ""
            }, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(async result => {
                
                if (result.data.statusId == '1'){
                    this.setState({
                        tlead : result.data.result.leads,
                        myReq : result.data.result.myReq
                    })
                }
            }).catch(data => {
                
            })
    }

    seeMyReq = () => {
        console.log('my req');
    }

    render() {
        return (
            <div>
                {this.state.myReq?
                this.state.myReq.length > 0 ?
                    <div className="alert alert-success" >
                        Your request is being auctioned
                        <div className="btn btn-solid" onClick={ () => this.seeMyReq()}> View Details </div>
                    </div>
                    :''
                :''}
                <ul className="list-group list-group-flush contact_list">
                    {this.state.tlead?
                    this.state.tlead.length > 0 ?
                    this.state.tlead.map((val, index) => 
                        <li key={index} className="list-group-item mouse_pointer" id={val.leadid} onClick={() => this.leadSelected(val.leadid, val.brid)}>
                            <div className=" d-flex">
                                <div className="" >
                                    <img src={`${ImgUrl}/product_images_small/${val.main_img}`} />
                                </div>
                                <div className="">
                                    <div className="">
                                        {val.name}
                                    </div>
                                    <div className="">
                                        {val.price}
                                    </div>
                                    <div className="">
                                        {val.qty}
                                    </div>
                                </div><div className="">
                                    <button className="btn btn-solid"> Bid </button>
                                </div>
                            </div>
                        </li>
                    ): ''
                    : ''}
                </ul>
            </div>
        )
    }
}

export default LeadBid;