const https = require('https');
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const router = require('express').Router()
const checksum_lib = require('./paytm/checksum');
const paytm_config = require('./paytm/paytm_config').paytm_config;

router.post('/', (request, res) => {
/* initialize an object */
var paytmParams = {};

/* body parameters */
paytmParams.body = {

    /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
    "mid" : paytm_config.MID,

    /* Enter your order id which needs to be check status for */
    "orderId" : request.body.orderid,
};

/**
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
    checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), paytm_config.MERCHANT_KEY, function(err, checksum){

        if (err){
            res.status(400).send({'status':'failure'})
        }else{
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
                path: '/merchant-status/api/v1/getPaymentStatus',
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
                    res.status(200).send(response)
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        }
    })

});

module.exports = router;