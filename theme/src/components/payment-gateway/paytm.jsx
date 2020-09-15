import React, { Component } from 'react'
import { imgUrl } from '../../constants/variable';

class Paytm extends Component {
    
render() {
    const { user,amount,prod_id,eachunit,qty, sellerid ,buyerid, totalShipmentCost, countryName, address, landmark, state, pincode, city, cartid, shipping_charge,cashback_value,txn_type} = this.props;
    if (user)
        var email = user.email;
    else
        var email = '';
    var oid = sellerid+'_'+email+'_ORDERSP'+Math.floor(Math.random() * 100000000) ;
    var invoiceid = 'invp_'+Math.floor(Math.random() * 100000000) ;
    // var custid = 'CUST_'+Math.floor(Math.random() * 100000000)+"_"+cartid ;
    var custid = 'CUST_'+Math.floor(Math.random() * 100000000)+"_"+cartid+"_"+cashback_value+"_"+txn_type;

return (
<React.Fragment>
{/* <center>
<h1>Please do not refresh this page...</h1>
</center> */}
<form method="post" action={`${imgUrl}/paytmtest/web/Paytm_Web_Sample_Kit_PHP-master/PaytmKit/pgRedirect.php`} name="paytm">
{/* <table border="1">
<tbody> */}

<input type="hidden" id="MID" name="MID" value="Beldar02827113089473" />
<input type="hidden" id="WEBSITE" name="WEBSITE" value="WEBPROD" />
<input type="hidden" id="ORDER_ID" name="ORDER_ID" value={oid} />
<input type="hidden" id="CUST_ID" name="CUST_ID" value={custid} />
{/* <input type="hidden" id="MOBILE_NO" name="MOBILE_NO" value={user.mobile} /> */}
{/* sss */}
{/* <input type="hidden" id="EMAIL" name="EMAIL" value={user.email} /> */}
<input type="hidden" id="INDUSTRY_TYPE_ID" name="INDUSTRY_TYPE_ID" value="Retail104" />
<input type="hidden" id="CHANNEL_ID" name="CHANNEL_ID" value="WEB" /> 
<input type="hidden" id="TXN_AMOUNT" name="TXN_AMOUNT" value={amount} />
{/* <input type="hidden" id="price" name="price" value="" /> */}

<input type="hidden" id="amount" name="amount" value={amount} />
<input type="hidden" id="currency" name="currency" value="INR" />
<input type="hidden" id="prod_id" name="prod_id" value={cartid} />
<input type="hidden" id="cartid" name="cartid" value={cartid} />
<input type="hidden" id="eachunit" name="eachunit" value={eachunit} />
<input type="hidden" id="qty" name="qty" value={qty} />
<input type="hidden" id="sellerid" name="sellerid" value={sellerid} />
<input type="hidden" id="buyerid" name="buyerid" value={buyerid} />
<input type="hidden" id="totalShipmentCost" name="totalShipmentCost" value={totalShipmentCost} />
<input type="hidden" id="invoice_id" name="invoice_id" value={invoiceid} />
<input type="hidden" id="PAYMENT_TYPE" name="PAYMENT_TYPE" value="paytm" />
{/* <input type="hidden" id="CALLBACK_URL" name="CALLBACK_URL" value={`${imgUrl}/api/common/product_purchase_paytm.php`} /> */}
<input type="hidden" id="CALLBACK_URL" name="CALLBACK_URL" value={`${imgUrl}/api/common/product_purchase_paytm.php`} />
<input type="hidden" id="countryName" name="countryName" value={countryName} />
<input type="hidden" id="address" name="address" value={address} />
<input type="hidden" id="landmark" name="landmark" value={landmark} />
<input type="hidden" id="qstatety" name="state" value={state} />
<input type="hidden" id="pincode" name="pincode" value={pincode} />
<input type="hidden" id="city" name="city" value={city} />
<input type="hidden" id="cartid" name="cartid" value={cartid} />
<input type="hidden" id="shipping_charge" name="shipping_charge" value={shipping_charge} />
<input type="hidden" id="cashback_value" name="cashback_value" value={cashback_value} />
<input type="hidden" id="txn_type" name="txn_type" value={txn_type} />


{/* <input type="hidden" name="CHECKSUMHASH" value="GENERATED_CHECKSUM_VALUE" />

<input type="hidden" id="amount" name="amount" value="10" />
<input type="hidden" id="currency" name="currency" value="INR" />
<input type="hidden" id="prod_id" name="prod_id" value="17899465" />
<input type="hidden" id="eachunit" name="eachunit" value="1" />
<input type="hidden" id="qty" name="qty" value="10" />
<input type="hidden" id="sellerid" name="sellerid" value="4449192" />
<input type="hidden" id="buyerid" name="buyerid" value="4449192" />
<input type="hidden" id="PAYMENT_TYPE" name="PAYMENT_TYPE" value="paytm" />
<input type="hidden" id="CALLBACK_URL" name="CALLBACK_URL" value="https://img.beldara.com/api/common/product_purchase_paytm.php" /> 
<input type="hidden" id="totalShipmentCost" name="totalShipmentCost" value="2" />
<input type="hidden" id="invoice_id" name="invoice_id" value="invp_123123123" />*/}

{/* </tbody>
</table> */}
<input type="submit" className="paytmBtn d-none" value="CheckOut"/>
</form>
</React.Fragment>
)
}
}

export default Paytm;