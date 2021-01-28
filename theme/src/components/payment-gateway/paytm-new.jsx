import React, { Component } from 'react'
import { imgUrl } from '../../constants/variable';

class Paytm extends Component {
    
render() {
    // console.log(this.props);
    const redirect_domain = window.location.host;
    const { user,amount,sellerid,order_id,order_code,has_coupon,discounted_amount,discount_code,isToken} = this.props;
    if (user)
        var email = user.email;
    else
        var email = '';
     
    // if(has_coupon == 1){
        // var custid = `CUST_${sellerid}_${has_coupon}_${discount_code}_${discounted_amount}`;
        // var oid = `ORD_${order_id}_${order_code}_${has_coupon}_${discount_code}`;
    // }else{
        // var custid = `CUST_${sellerid}_${has_coupon}_NA_${discounted_amount}`;
        // var oid = `ORD_${order_id}_${order_code}_0_NA`;
    // }    

    // var custid = `CUST_${sellerid}_${Math.floor(1000 + Math.random() * 9000)}`;
    // var oid = `ORD_${order_code}_${Math.floor(1000 + Math.random() * 9000)}`;
    var custid = sellerid;
    var oid = `${order_id}_${sellerid}_${Math.floor(0 + Math.random() * 999)}_Web`;

return (
<React.Fragment>
<form method="post" action={`${imgUrl}/paytmtest/web/Paytm_Web_Sample_Kit_PHP-master/PaytmKit/pgRedirect.php`} name="paytm">
{/* <table border="1">
<tbody> */}

<input type="hidden" id="MID" name="MID" value="Beldar02827113089473" />
<input type="hidden" id="WEBSITE" name="WEBSITE" value="WEBPROD" />
<input type="hidden" id="ORDER_ID" name="ORDER_ID" value={oid} />
<input type="hidden" id="isToken" name="isToken" value={isToken} />
<input type="hidden" id="CUST_ID" name="CUST_ID" value={custid} />
<input type="hidden" id="INDUSTRY_TYPE_ID" name="INDUSTRY_TYPE_ID" value="Retail104" />
<input type="hidden" id="CHANNEL_ID" name="CHANNEL_ID" value="WEB" /> 
<input type="hidden" id="TXN_AMOUNT" name="TXN_AMOUNT" value={amount} />
{/* <input type="hidden" id="price" name="price" value="" /> */}
<input type="hidden" id="CALLBACK_URL" name="CALLBACK_URL" value={`${imgUrl}/beta_api/payment_confm_web.php`} />
<input type="hidden" id="payment_type" name="payment_type" value="1"/>
<input type="hidden" id="test" name="test" value="1"/>
<input type="hidden" id="orderid" name="orderid" value={order_id}/>
<input type="hidden" id="order_code" name="order_code" value={order_code}/>
<input type="hidden" id="has_coupon" name="has_coupon" value={has_coupon}/>
<input type="hidden" id="full_payment" name="full_payment" value={1} />
<input type="hidden" id="discounted_amount" name="discounted_amount" value={discounted_amount}/>
<input type="hidden" id="dicsounted_code" name="discounted_code" value={discount_code}/>
<input type="hidden" id="additional_detail_id" name="additional_detail_id" value={0}/>
<input type="hidden" id="redirect_domain" name="redirect_domain" value={redirect_domain}/>

{/* </tbody>
</table> */}
<input type="submit" className="paytmBtn d-none" value="CheckOut"/>
</form>
</React.Fragment>
)
}
}

export default Paytm;