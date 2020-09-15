import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import { Link } from "react-router-dom";
import ls from "local-storage";
import { SellerUrl, MsgUrl, ImgUrl,ApiUrl } from "../../constants/ActionTypes";
import { getCookie } from "../../functions";
import axios from "axios";
import { isMobile } from "react-device-detect";
import Table from 'react-bootstrap/Table'
import Breadcrumb from "../common/breadcrumb";


class index extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderagain: false,
            data : null
        }
    }
    componentDidMount(){
        console.log('componentdidmount called');
        if(ls.get('log_id') !== null && ls.get('log_id') != 'null' && ls.get('log_id') != ''){
        console.log('componentdidmount inside if condition',ls.get('log_id'));
            axios.post(
                `${ApiUrl}/common/get_wallet_history.php`,
                {sellerid:ls.get('log_id'),security_token:'',plateform_type:''},
                {
                    headers : {
                        "content-type":"multipart/form-data"
                    }
                }
            ).then(res => {
                this.setState({
                    data : res.data.result
                })
                console.log(res.data,32,'test',this.state);
            }).catch(err => {
                console.log(err,'err',36);
            })
        }
    }
    getDate(val){
        var date_test = new Date(val);
        console.log(date_test,date_test.getFullYear());
        // return date_test('')
        return date_test.getFullYear() + "/" + parseInt(date_test.getMonth() + 1) + "/" + date_test.getDate();
      }
    render() {
        console.log(this.state.data,44);
        return (
            <div>
                <Breadcrumb title={'Wallet'} />
                <div className="container">
                    <div className="row my-3">
                    {
                            (this.state.data !== null && this.state.data != 'null')
                            ?
                            <Table striped bordered hover  size={isMobile ? `sm` : ``}>
                            <thead>
                            <tr>
                                <th>Txn No</th>
                                <th>Amount</th>
                                <th>Txn Event</th>
                                <th>Txn status</th>
                                <th>Payment Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.data.map((item,key) =>
                                <tr>
                                <td>{item.id}</td>
                                <td>{item.amount}</td>
                                <td>{item.event}</td>
                                <td>{item.transactiontype}</td>
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
                                <th>Txn status</th>
                                <th>Payment Date</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="text-center" colspan="5">No Record Found</td>
                                </tr>
                            </tbody>
                            </Table>
                            // <img src={`${ImgUrl}/assets/images/wallet_icon.png`} alt="wallet on beldara"/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default index;
