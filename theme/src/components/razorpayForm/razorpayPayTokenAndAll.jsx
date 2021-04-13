import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
var sellerid;
var razorpaykey = "";
class RazorpayForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      razorpayorderid: "",
    };
  }
  componentWillReceiveProps(nextProps) {
    //this.generaterozorordertid();
    this.createFrom(nextProps);
  }
  componentDidMount() {
    //this.generaterozorordertid();
    this.createFrom(this.props);
  }

//   generaterozorordertid = () => {
//     axios
//       .post(
//         `https://api.beldara.com/common/generate_order_id_razor_pay.php`,
//         {
//           amount: this.props.amount * 100,
//           currency: this.props.currency,
//           orderid: this.props.order_id,
//         },
//         { headers: { "Content-Type": "multipart/form-data" } }
//       )
//       .then((response) => {
//         if (response.data.statusId == "1") {
//           this.setState({
//             razorpayorderid: response.data.result.id,
//           });
//           console.log(
//             "-------------1----------------",
//             response.data.result.id
//           );

//           console.log(
//             "-------------1111----------------",
//             this.state.razorpayorderid
//           );
//         } else {
//           console.log("-------------2----------------", response.data.statusId);
//         }
//       })
//       .catch((error) => {
//         console.log("-------------12----------------", error);
//         const result = error.response;
//         return Promise.reject(result);
//       });
//     console.log(
//       "-------------2success----------------",
//       this.state.razorpayorderid
//     );
//   };

  createFrom = (allProps) => {
    axios
      .post(
        `https://api.indiabigshop.com/common/generate_order_id_razor_pay.php`,
        {
          amount: allProps.amount,
          currency: this.props.currency,
          orderid: this.props.order_id,
          note_key:this.props.order_id,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        if (response.data.statusId == "1") {
          this.setState({
            razorpayorderid: response.data.result.id,
          });
          const currentdomain = window.location.hostname;
          if (
            currentdomain === "uat.beldara.com" ||
            currentdomain === "localhost"
          ) {
            razorpaykey = "rzp_live_YHQFULPoYEUSnY";
          } else {
            razorpaykey = "rzp_live_YHQFULPoYEUSnY";
          }

          console.log("allprops: ", allProps);
          sellerid = allProps.sellerid;
          $("#" + allProps.id)
            .children(':not([name="hidden"])')
            .remove();
          const script = document.createElement("script");

          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.setAttribute("data-key", razorpaykey);
          script.setAttribute(
            "data-amount",
            (allProps.amount * 100).toFixed(2)
          );
          script.setAttribute("data-currency", allProps.currency);
          script.setAttribute("data-buttontext", allProps.buttonName);
          script.setAttribute("data-order_id", this.state.razorpayorderid);
          script.setAttribute("data-name", "Beldara.com");
          script.setAttribute("data-description", "Beldara Purchase");
          script.setAttribute(
            "data-image",
            "https://img.beldara.com/images/BelDara-logo.png"
          );
          script.setAttribute("data-prefill.name", allProps.name);
          script.setAttribute("data-prefill.contact", allProps.mobile);
          script.setAttribute("data-prefill.email", allProps.email);
          script.setAttribute("note_key", allProps.order_id);
          script.setAttribute("data-theme-color", "#5d6dc3");
          script.async = true;
          document.getElementById(allProps.id).appendChild(script);
        } else {
          console.log("-------------2----------------", response.data.statusId);
        }
      })
      .catch((error) => {
        console.log("-------------12----------------", error);
        const result = error.response;
        return Promise.reject(result);
      });
  };

  // shouldComponentUpdate(nextProps, nextState){
  //     // console.log(nextProps, this.props )
  //     if(nextProps.sellerid != this.props.sellerid || nextProps.amount != this.props.amount
  //         || nextProps.discount != this.props.discount || nextProps.currency != this.props.currency || nextProps.name != this.props.name
  //         || nextProps.mobile != this.props.mobile || nextProps.email != this.props.email){
  //             // console.log('true')
  //             return true;
  //         }else{
  //             // console.log('else')
  //             return false;
  //         }
  // }

  paymentRequest = (e) => {
    e.preventDefault();
    if (sellerid == "") {
      this.props.isLoggedIn();
      return false;
    } else return true;
  };

  render() {
    return (
      <form
        onSubmit={this.paymentRequest}
        key={this.props.currency}
        id={this.props.id}
        page={this.props.page}
        type={this.props.type}
        discount={this.props.discount}
        amount={this.props.amount}
        event={this.props.event}
        className={this.props.id}
        action={this.props.action}
        method="POST"
      >
        <input type="hidden" value={this.props.value} name="hidden" />
      </form>
    );
  }
}

export default RazorpayForm;
