const https = require('https');
const checksum_lib = require("./paytm/checksum");
const paytm_config = require("./paytm/paytm_config").paytm_config;
var commonResult = require("../common/constants");
var commonDatafunc = require("../common/function");
var dbconn = require("../db/index.js");
var {beldaraDb} = require('../db/constants.js').dbName;
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./checksum');

/* initialize an object */
var paytmParams = {};

/* body parameters */
paytmParams.body = {

    /* for subscription the value is NATIVE_SUBSCRIPTION */
    "requestType" : "NATIVE_SUBSCRIPTION",

    /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
    "mid" : paytm_config.MID,

    /* Enter your unique order id */
    "orderId" : "0011",

    /* Enter subscription id for renewal */
    "subscriptionId" : "SUBS_0011",

    /* Order Transaction Amount here */
    "txnAmount" : {

        /* Transaction Amount Value */
        "value" : 1,

        /* Transaction Amount Currency */
        "currency" : "INR",
    },
};

/**
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), paytm_config.MID, function(err, checksum){

    /* head parameters */
    paytmParams.head = {
        
        /* put generated checksum value here */
        "signature"	: checksum
    };

    /* prepare JSON string for request */
    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/subscription/renew?mid=YOUR_MID_HERE&orderId=YOUR_ORDER_ID',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
});