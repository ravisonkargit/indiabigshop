import React, { Component } from "react";
import { imgUrl } from "../../constants/variable";

class Myorderpaytm extends Component {
  render() {
    console.log(this.props);
    const {
      user,
      amount,
      sellerid,
      order_id,
      order_code,
      has_coupon,
      discounted_amount,
      discount_code,
      full_payment,
      payment_type,
      additional_detail_id,
    } = this.props;
    if (user) var email = user.email;
    else var email = "";
    var custid = `CUST_${sellerid}_${Math.floor(1000 + Math.random() * 9000)}`;
    var oid = `ORD_${order_code}_${Math.floor(1000 + Math.random() * 9000)}`;
    const redirect_domain = window.location.host;

    return (
      <React.Fragment>
        <form
          method="post"
          action={`${imgUrl}/paytmtest/web/Paytm_Web_Sample_Kit_PHP-master/PaytmKit/pgRedirect.php`}
          name="paytm"
        >
          <input
            type="hidden"
            id="MID"
            name="MID"
            value="Beldar02827113089473"
          />
          <input type="hidden" id="WEBSITE" name="WEBSITE" value="WEBPROD" />
          <input type="hidden" id="ORDER_ID" name="ORDER_ID" value={oid} />
          <input type="hidden" id="CUST_ID" name="CUST_ID" value={custid} />
          <input
            type="hidden"
            id="INDUSTRY_TYPE_ID"
            name="INDUSTRY_TYPE_ID"
            value="Retail104"
          />
          <input type="hidden" id="CHANNEL_ID" name="CHANNEL_ID" value="WEB" />
          <input
            type="hidden"
            id="TXN_AMOUNT"
            name="TXN_AMOUNT"
            value={amount}
          />
          <input
            type="hidden"
            id="CALLBACK_URL"
            name="CALLBACK_URL"
            value={`${imgUrl}/beta_api/payment_confm_web.php`}
          />
          <input
            type="hidden"
            id="payment_type"
            name="payment_type"
            value={payment_type}
          />
          <input type="hidden" id="test" name="test" value="1" />
          <input type="hidden" id="orderid" name="orderid" value={order_id} />
          <input
            type="hidden"
            id="order_code"
            name="order_code"
            value={order_code}
          />
          <input
            type="hidden"
            id="has_coupon"
            name="has_coupon"
            value={has_coupon}
          />
          <input
            type="hidden"
            id="full_payment"
            name="full_payment"
            value={full_payment}
          />
          <input
            type="hidden"
            id="discounted_amount"
            name="discounted_amount"
            value={discounted_amount}
          />
          <input
            type="hidden"
            id="dicsounted_code"
            name="discounted_code"
            value={discount_code}
          />
          <input
            type="hidden"
            id="additional_detail_id"
            name="additional_detail_id"
            value={additional_detail_id}
          />

          <input
            type="hidden"
            id="redirect_domain"
            name="redirect_domain"
            value={redirect_domain}
          />

          <input type="submit" className="paytmBtn d-none" value="CheckOut" />
        </form>
      </React.Fragment>
    );
  }
}

export default Myorderpaytm;