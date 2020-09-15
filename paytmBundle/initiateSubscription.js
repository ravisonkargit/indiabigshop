const https = require('https');
var dbconn = require("../db/index.js");
var router = require('express').Router()
var {beldaraDb} = require('../db/constants.js').dbName;
var commonResult = require('../common/constants');

/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/

const checksum_lib = require('./paytm/checksum');
const paytm_config = require('./paytm/paytm_config').paytm_config;

router.post('/initiateSubscription', (request, res) => {
    var orderid = '',subscriptionDetail = {};
    // console.log('result', request)
    if (request.body.sellerid){
        var query = `call ${beldaraDb}.initiateSubscription_test("${request.body.sellerid}","${request.body.currency}")`;
         dbconn.query(query, async (err, result) => {
            //  console.log(result)

            if (err) {
                res.status(500).send(err)
            }
            else if(result[0][0].status == 'failed'){
                var statusResult = commonResult.data.apiResultSuccess;
                statusResult.message = result[0][0].error_msg;
                var orderPayload = {
                    orderId : result[0][0].orderid,
                    subcriptionid: result[0][0].subscriptionId,
                    transactionAmt: result[0][0].subscriptionAmount,
                    transactionCurrency: result[0][0].currency,
                    email : result[0][0].email,
                    mobile : result[0][0].mobile,
                    custId : result[0][0].sellerid
                    }
                statusResult.result = orderPayload;
                // console.log(statusResult,'else');
                // return statusResult;
                res.status(200).send(statusResult);

            }
            else if(result[0][0].status == 'success'){

                // orderid = 'ord_asd';
                subscriptionDetail = {
                    orderId : result[0][0].orderid,
                    // orderId: 1002,
                    cb: '/subscription/purchase',
                    amountType : 'FIX',
                    transactionAmt: result[0][0].subscriptionAmount,
                    transactionCurrency: request.body.currency ? request.body.currency : 'INR',
                    subscriptionEnableRetry: 1,
                    subscriptionFrequency : 1,
                    subscriptionFrequencyUnit : 'MONTH',
                    custId : request.body.sellerid
                }

                /* initialize an object */
                var paytmParams = {};

                /* body parameters */
                paytmParams.body = {

                    /* for subscription the value is NATIVE_SUBSCRIPTION */
                    "requestType" : "NATIVE_SUBSCRIPTION",

                    /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                    "mid" : paytm_config.MID,

                    /* Find your Website Name in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                    "websiteName" : paytm_config.WEBSITE,

                    /* Enter your unique order id */
                    "orderId" : subscriptionDetail.orderId,

                    /* on completion of transaction, we will send you the response on this URL */
                    "callbackUrl" : subscriptionDetail.cb,

                    /* enter subscription amount type here, possible value is either FIX or VARIABLE */
                    "subscriptionAmountType" : subscriptionDetail.amountType,

                    /* enter subscription frequency here */
                    "subscriptionFrequency" : subscriptionDetail.subscriptionFrequency,

                    /* enter subscription frequency unit here */
                    "subscriptionFrequencyUnit" : subscriptionDetail.subscriptionFrequencyUnit,

                    /* enter subscription expiry date here in YYYY-MM-DD format */
                    "subscriptionExpiryDate" : "2021-03-30",

                    /* enter subscription enable retry value here, possible value is either 1 or 0 */
                    "subscriptionEnableRetry" : subscriptionDetail.subscriptionEnableRetry,

                    /* Order Transaction Amount here */
                    "txnAmount" : {

                        /* Transaction Amount Value */
                        "value" : subscriptionDetail.transactionAmt,

                        /* Transaction Amount Currency */
                        "currency" : subscriptionDetail.transactionCurrency
                    },

                    /* Customer Infomation here */
                    "userInfo" : {

                        /* unique id that belongs to your customer */
                        "custId" : subscriptionDetail.custId,
                    },
                };
                /**
                * Generate checksum by parameters we have in body
                * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                */


                checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), paytm_config.MERCHANT_KEY, function(err, checksum){
                    // console.log('checksum', checksum)
                    /* head parameters */
                    paytmParams.head = {
                        
                        /* put generated checksum value here */
                        "signature" : checksum
                    };

                    /* prepare JSON string for request */
                    var post_data = JSON.stringify(paytmParams);
                    // console.log(paytm_config,subscriptionDetail)
                    var options = {

                        /* for Staging */
                        hostname: 'securegw-stage.paytm.in',

                        /* for Production */
                        // hostname: 'securegw.paytm.in',

                        port: 443,
                        path: `/subscription/create?mid=${paytm_config.MID}&orderId=${subscriptionDetail.orderId}`,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': post_data.length
                        }
                    };

                    // Set up the request
                    var response = "";
                    var post_req = https.request(options, function(post_res, resp) {
                        post_res.on('data', function (chunk) {
                            response += chunk;
                        });

                        post_res.on('end', function(){
                            console.log('Response: ',JSON.parse(response));
                            var responseData = JSON.parse(response);
                            if(responseData.body.resultInfo.resultStatus == 'S'){
                                var new_query = `call ${beldaraDb}.updateSubscription("${result[0][0].orderid}","${responseData.body.txnToken}","${responseData.body.subscriptionId}")`;
                                 dbconn.query(new_query,async (err,resp) => {
                                     if(err){
                                        var statusResult = commonResult.data.apiResult;
                                        statusResult.result = responseData.body.resultInfo.resultMsg;
                                        res.status(400).send(statusResult);
                                     }else{
                                        //  console.log(resp);
                                    var statusResult = commonResult.data.apiResultSuccess;
                                    statusResult.message = resp[0][0].error_msg;
                                    var orderPayload = {
                                        orderId : result[0][0].orderid,
                                        subcriptionid: responseData.body.subscriptionId,
                                        transactionAmt: result[0][0].subscriptionAmount,
                                        transactionCurrency: request.body.currency,
                                        email : resp[0][0].email,
                                        mobile : resp[0][0].mobile,
                                        custId : resp[0][0].sellerid
                                        }
                                    statusResult.result = orderPayload;
                                    // console.log(statusResult,'else');
                                    // return statusResult;
                                    res.status(200).send(statusResult);
                                     } 
                                    
                                 })
                                // console.log(responseData.body.resultInfo.resultMsg);
                            }else{
                                    var statusResult = commonResult.data.apiResult;
                                        statusResult.result = responseData.body.resultInfo.resultMsg;
                                        //console.log(commonResult.data.apiResult);
                                        res.status(200).send(statusResult);
                                // console.log(responseData.body.resultInfo.resultMsg);
                            }
                            // if(resp)
                            //res.status(200).send(responseData)
                        });
                    });

                    // console.log('post_data: ',post_data)
                    // //post the data
                    post_req.write(post_data);
                    post_req.end();

                    
                });
                
            }
        })
    }
    


});

module.exports = router;