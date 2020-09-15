const https = require('https');
var commonResult = require('../common/constants');
var dbconn = require("../db/index.js");
var {beldaraDb} = require('../db/constants.js').dbName;
var dateObj = new Date();
var current_date = dateObj.getFullYear()+'-'+parseInt(dateObj.getMonth()+1)+'-'+dateObj.getDate();
var expiry_date = parseInt(dateObj.getFullYear()+1)+'-'+parseInt(dateObj.getMonth()+1)+'-'+dateObj.getDate();

/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./paytm/checksum');
const paytm_config = require('./paytm/paytm_config').paytm_config;
const router = require('express').Router()

// https.createServer(function (req, res) {
router.post('/', (request, res) => {
    // console.log(request.body)
    /* initialize an object with request parameters */
    if(request.body.sellerid){
        var query = `call ${beldaraDb}.initiateSubscription_test("${request.body.sellerid}","${request.body.currency}")`;
         dbconn.query(query, async (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).send(commonResult.data.apiResult);
            }else if(result[0][0].status == 'success'){
                subscriptionDetail = {
                    orderId : ''+result[0][0].orderid,
                    subcriptionid: result[0][0].subscription_id,
                    cb: commonResult.data.localhost_url+'paymentInitiated',
                    // cb:'https://seller.beldara.com/paytm_response.php',
                    amountType : 'FIX',
                    // transactionAmt: ''+result[0][0].subscriptionAmount,
                    transactionAmt: ''+1,
                    transactionCurrency: request.body.currency ? request.body.currency : 'INR',
                    subscriptionEnableRetry: 1,
                    custId : ''+result[0][0].customer_id,
                    expDate : expiry_date,
                    startDate: current_date,
                    graceDays: "0"
                }
                var paytmParams = {
            
                    /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                    "MID" : paytm_config.MID,
            
                    /* this will be SUBSCRIBE */
                    "REQUEST_TYPE" : "SUBSCRIBE",
            
                    /* Find your WEBSITE in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                    "WEBSITE" : paytm_config.WEBSITE,
            
                    /* Find your INDUSTRY_TYPE_ID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                    "INDUSTRY_TYPE_ID" : paytm_config.INDUSTRY_TYPE_ID,
            
                    /* WEB for website and WAP for Mobile-websites or App */
                    "CHANNEL_ID" : paytm_config.CHANNEL_ID,
            
                    /* Enter your unique order id */
                    "ORDER_ID" : ''+result[0][0].orderid, //subscriptionDetail.orderId,
            
                    /* unique id that belongs to your customer */
                    "CUST_ID" : ''+result[0][0].customer_id, //subscriptionDetail.custId,
            
                    /* customer's mobile number */
                    //"MOBILE_NO" : subscriptionDetail.mobile,
            
                    /* customer's email */
                    //"EMAIL" : subscriptionDetail.email,
            
                    /**
                    * Amount in INR that is to be charged upfront at the time of creating subscription
                    * this should be numeric with optionally having two decimal points
                    */
                    "TXN_AMOUNT" : subscriptionDetail.transactionAmt,
            
                    /* this is unique subscription id that belongs to your customer's subscription service */
                    "SUBS_SERVICE_ID" : ''+result[0][0].subscription_id, //subscriptionDetail.subcriptionid,
            
                    /* enter subscription amount type here, possible value is either FIX or VARIABLE */
                    "SUBS_AMOUNT_TYPE" : subscriptionDetail.amountType,
            
                    /* enter maximum renewal amount that can be charged for this subscription */
                    //"SUBS_MAX_AMOUNT" : subscriptionDetail.maxAmt,
            
                    /* enter subscription frequency here */
                    "SUBS_FREQUENCY" : "1",
            
                    /* enter subscription frequency unit here */
                    //"SUBS_FREQUENCY_UNIT" : "MONTH",
                    "SUBS_FREQUENCY_UNIT" : "DAY",
                    /* enter subscription enable retry value here, possible value is either 1 or 0 */
                    "SUBS_ENABLE_RETRY" : "1",
            
                    /* enter subscription expiry date here in YYYY-MM-DD format */
                    "SUBS_EXPIRY_DATE" : subscriptionDetail.expDate,
                    // "SUBS_EXPIRY_DATE" : "2021-02-28",

                    "SUBS_GRACE_DAYS" : subscriptionDetail.graceDays,
                    "SUBS_START_DATE" : subscriptionDetail.startDate,
                    // "SUBS_START_DATE" : "2020-02-28",
                    /**
                    Represents if add money is allowed at the time of subscription or not.
                    Possible Values are:
                    Y : In case of insufficient balance in wallet, renewal transaction will fail
                    N : In case of insufficient balance in wallet, add money from users saved card will be attempted
                    */
                    // "SUBS_PPI_ONLY" : "Y",
                    "SUBS_PPI_ONLY" : "",
                    /* payment mode that is to be charged on renewal, possible value are: "CC" : "DC" */
                    // "SUBS_PAYMENT_MODE" : subscriptionDetail.paymentMode,
            
                    /* on completion of transaction, we will send you the response on this URL */
                    "CALLBACK_URL" : subscriptionDetail.cb,
                };
            
                /**
                * Generate checksum for parameters we have
                * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                */
                checksum_lib.genchecksum(paytmParams, paytm_config.MERCHANT_KEY, function(err, checksum){
                    console.log(paytmParams, checksum)
                    /* for Staging */
                    //var url = `https://securegw-stage.paytm.in/order/pay?mid=${paytm_config.MID}&orderId=${subscriptionDetail.orderId}`;
            
                    /* for Production */
                    var url = "https://securegw.paytm.in/order/process";
                    // var url = "https://securegw-stage.paytm.in/order/process";
            
                    /* Prepare HTML Form and Submit to Paytm */
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<html>');
                    res.write('<head>');
                    res.write('<title>Merchant Checkout Page</title>');
                    res.write('</head>');
                    res.write('<body>');
                    res.write('<center><h1>Please do not refresh this page...</h1></center>');
            
                    res.write('<form method="post" action="' + url + '" name="paytm_form">');
                    for(var x in paytmParams){
                        res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
                    }
                    res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
                    res.write('</form>');
            
                    // res.write('<form method="post" action="' + url + '" name="paytm_form">');
                    // for(var x in paytmParams){
                    //  res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
                    // }
                    // res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
                    // res.write('</form>');
            
            
                    res.write('<script type="text/javascript">');
                    res.write('document.paytm_form.submit();');
                    res.write('</script>');
                    res.write('</body>');
                    res.write('</html>');
                    res.end();
                });
            }
         })
    }else{
        res.status(400).send(commonResult.data.apiResult);
    }
    

// }).listen(3000);
});

module.exports = router;
