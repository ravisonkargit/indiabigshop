import React, { Component } from "react";
import store from "../../store";
import { getLogOut } from "../../actions";
import { connect } from "react-redux";

class LogOut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logout: 0
        }
    }
    UNSAFE_componentWillMount() {
        store.dispatch(getLogOut())    
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log('log out UNSAFE_componentWillReceiveProps', nextProps)
    }
    render() {
        return (
        < div className="text-center" >
            We are Logging You Out! Hold Down a Moment.
        </div >
        )
    }
}

const mapStateToProps = (state) => {
    return state;
 }

export default connect(
    mapStateToProps
)(LogOut)