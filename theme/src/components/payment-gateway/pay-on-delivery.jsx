import React, { Component } from "react";
import $ from "jquery";

class PayOnDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const data = this.props;
    return (
        <form onSubmit={this.paymentRequest} key={this.props.currency} id={this.props.id} page={this.props.page} type={this.props.type} amount={this.props.amount} event={this.props.event} className={this.props.id} action={this.props.action} method="POST">
        <input type="hidden" value={this.props.value}  name="hidden" />
        <input type="submit" className="payondeliver d-none" />
        </form>
    );
  }
}

export default PayOnDelivery;
