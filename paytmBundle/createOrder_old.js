const https = require('https');

/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./paytm/checksum');
const paytm_config = require('./paytm/paytm_config').paytm_config;
const router = require('express').Router()

// https.createServer(function (req, res) {
router.post('/', (request, res) => {
    /* initialize an object with request parameters */

    subscriptionDetail = {
        orderId : ''+request.body.orderId,
        subcriptionid: request.body.subcriptionid,
        cb: 'http://localhost:5000/paytm/paymentInitiated',
        amountType : 'FIX',
        transactionAmt: ''+request.body.transactionAmt,
        transactionCurrency: request.body.currency ? request.body.currency : 'INR',
        subscriptionEnableRetry: 1,
        email : request.body.email,
        mobile : request.body.mobile,
        custId : ''+request.body.custId,
		//custId: '8745812',
		paymentMode : request.body.paymentMode,
		expDate : "2021-02-21"
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
		"ORDER_ID" : subscriptionDetail.orderId,

		/* unique id that belongs to your customer */
		"CUST_ID" : subscriptionDetail.custId,

		/* customer's mobile number */
		"MOBILE_NO" : subscriptionDetail.mobile,

		/* customer's email */
		"EMAIL" : subscriptionDetail.email,

		/**
		* Amount in INR that is to be charged upfront at the time of creating subscription
		* this should be numeric with optionally having two decimal points
		*/
		"TXN_AMOUNT" : subscriptionDetail.transactionAmt,

		/* this is unique subscription id that belongs to your customer's subscription service */
		"SUBS_SERVICE_ID" : subscriptionDetail.subcriptionid,

		/* enter subscription amount type here, possible value is either FIX or VARIABLE */
		"SUBS_AMOUNT_TYPE" : subscriptionDetail.amountType,

		/* enter maximum renewal amount that can be charged for this subscription */
		"SUBS_MAX_AMOUNT" : subscriptionDetail.transactionAmt,

		/* enter subscription frequency here */
		"SUBS_FREQUENCY" : "1",

		/* enter subscription frequency unit here */
		"SUBS_FREQUENCY_UNIT" : "MONTH",

		/* enter subscription enable retry value here, possible value is either 1 or 0 */
		"SUBS_ENABLE_RETRY" : "1",

		/* enter subscription expiry date here in YYYY-MM-DD format */
		"SUBS_EXPIRY_DATE" : subscriptionDetail.expDate,

		/**
		Represents if add money is allowed at the time of subscription or not.
		Possible Values are:
		Y : In case of insufficient balance in wallet, renewal transaction will fail
		N : In case of insufficient balance in wallet, add money from users saved card will be attempted
		*/
		"SUBS_PPI_ONLY" : "Y",

		/* payment mode that is to be charged on renewal, possible value are: "CC" : "DC" */
		"SUBS_PAYMENT_MODE" : subscriptionDetail.paymentMode,

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
		var url = "https://securegw-stage.paytm.in/order/process";

		/* for Production */
		// var url = "https://securegw.paytm.in/order/process";

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
		res.write('<script type="text/javascript">');
		res.write('document.paytm_form.submit();');
		res.write('</script>');
		res.write('</body>');
		res.write('</html>');
		res.end();
	});

// }).listen(3000);
});

module.exports = router;