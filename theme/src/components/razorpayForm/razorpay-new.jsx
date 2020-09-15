import React, {Component} from 'react';
import $ from 'jquery'
var sellerid;
var razorpaykey = '';
class RazorpayForm extends Component { 
     componentWillReceiveProps(nextProps) {
         sellerid = nextProps.sellerid;
         const currentdomain = window.location.hostname;

         if (currentdomain === 'uat.beldara.com' || currentdomain === 'localhost'){
            razorpaykey = "rzp_test_8PjcTCtvKLpR6g";
         }else{
            razorpaykey = "rzp_live_YHQFULPoYEUSnY";
         }

         try{
            if (nextProps.amount !== this.props.totalCost || nextProps.email !== this.props.email || nextProps.mobile !== this.props.mobile) {
                $("#productOrder").children(':not([name="hidden"])').remove()
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.setAttribute("data-key", razorpaykey);
                script.setAttribute("data-amount", nextProps.amount *100);
                script.setAttribute("data-currency", nextProps.currency);
                script.setAttribute("data-buttontext", "Pay Now");
                script.setAttribute("data-name", "Beldara.com");
                script.setAttribute("data-description", "Beldara Purchase");
                script.setAttribute("data-image", "https://img.beldara.com/images/BelDara-logo.png");
                script.setAttribute("data-prefill.name", nextProps.name);
                script.setAttribute("data-prefill.contact", nextProps.mobile);
                script.setAttribute("data-prefill.email", nextProps.email);
                script.setAttribute("data-theme-color", "#5d6dc3");
                script.async = true;
                document.getElementById(nextProps.id).appendChild(script);
            }
         }catch(error){
             console.error(error);
         }
        

        // var ele = document.getElementsByClassName("razorpay-payment-button");  
        // console.log(ele);
        // var elelength = ele.length;
        //var gridButtonItems = [].slice.call(ele); 
        // var gridButtonItems = ;
        // console.log(gridButtonItems);
        // [...ele.slice(0, elelength-1)].forEach(function (item, idx) {
        //     console.log(item);
        //     item.addEventListener('click', function () {
        //         console.log(sellerid);
        //         if (sellerid == ''){
        //             console.log('deepakva');
        //             this.props.loggedIn();
        //             return false;
        //         }else
        //             return true;
        //     });
        // });

        
       
    }

    // componentDidUpdate(){
    //     $(".razorpay-payment-button").each(function (val,i) {
    //         console.log(val);
    //         val.addEventListener("click", function(){
    //             console.log('clicked');
              
    //        });
    //    });
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
            <form onSubmit={this.paymentRequest} key={this.props.currency} id={this.props.id} page={this.props.page} type={this.props.type} amount={this.props.amount} event={this.props.event} className={this.props.id} action={this.props.action} method="POST">
                <input type="hidden" value={this.props.value}  name="hidden" />
            </form>
)
}
}

export default RazorpayForm;