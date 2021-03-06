import React, {Component} from 'react';
import $ from 'jquery'
var sellerid;
var razorpaykey = '';
class RazorpayForm extends Component {

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        this.createFrom(nextProps)
    }
    componentDidMount() {
        this.createFrom(this.props)
    }
    createFrom = (allProps) => {
        const currentdomain = window.location.hostname;
         if (currentdomain === 'uat.beldara.com' || currentdomain === 'localhost'){
            razorpaykey = "rzp_live_YHQFULPoYEUSnY";
         }else{
            razorpaykey = "rzp_live_YHQFULPoYEUSnY";
         }

        // console.log('allprops: ',allProps)
        sellerid = allProps.sellerid;
        $('#'+allProps.id).children(':not([name="hidden"])').remove()
        const script = document.createElement("script");
    
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.setAttribute("data-key", razorpaykey);
        if (parseInt(allProps.discount) > 0){
            script.setAttribute("data-amount",  parseInt(parseInt(allProps.amount) - ((parseInt(allProps.discount) / parseInt(100)) * parseInt(allProps.amount))) * 100);
        }else{
            script.setAttribute("data-amount", (allProps.amount * 100).toFixed(2));
        }
        script.setAttribute("data-currency", allProps.currency);
        script.setAttribute("data-buttontext", allProps.buttonName);
        script.setAttribute("data-name", "Beldara.com");
        script.setAttribute("data-description", "Beldara Purchase");
        script.setAttribute("data-image", "https://img.beldara.com/images/BelDara-logo.png");
        script.setAttribute("data-prefill.name", allProps.name);
        script.setAttribute("data-prefill.contact", allProps.mobile);
        script.setAttribute("data-prefill.email", allProps.email);
        script.setAttribute("data-theme-color", "#5d6dc3");
        script.async = true;
        document.getElementById(allProps.id).appendChild(script);
    }

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
        if (sellerid == ''){
            this.props.isLoggedIn();
            return false;
        }else
            return true;
      }

    render (){
        return (
            <form onSubmit={this.paymentRequest} key={this.props.currency} id={this.props.id} page={this.props.page} type={this.props.type} discount={this.props.discount} amount={this.props.amount} event={this.props.event} className={this.props.id} action={this.props.action} method="POST">
                <input type="hidden" value={this.props.value}  name="hidden" />
            </form>
)
}
}

export default RazorpayForm;