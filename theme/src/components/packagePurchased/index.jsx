import React, {Component} from 'react';
import Breadcrumb from '../common/breadcrumb';
import { connect } from 'react-redux';
import './packagePurchase.css';

class Membership extends Component {
    constructor(props){
        super(props)
        let search = window.location.search;
        let params = new URLSearchParams(search);
        // lclick = params.get('lclick');
        // mkey = params.get('mkey');
        // mailid = params.get('mailid');
        // skey = params.get('skey');
        // smsid = params.get('smsid');
        // p3 = params.get('p3');
    }

    render (){
        return (
            <React.Fragment>
                <Breadcrumb title={'Thank You'} />
            
        <div class="container mt-1">
            
        <div class="row justify-content-md-center my-4 text-left ">
            <div class="col-md-8 col-12">
            <div class="alert alert-success p-5 shadow-sm rounded">
                <h5 class="alert-heading">
                <i class="fa fa-check-circle" ></i> Payment is Successful
                </h5>
                <div class='text-muted font-weight-light'>Yor Payment for Package/ Activation is successful!</div>
            </div>
            </div>
        </div>
        </div>

    </React.Fragment>

)
}
}

const mapStateToProps = (state) => {
    // console.log(state);
    return state;
}

export default connect(mapStateToProps)(Membership);