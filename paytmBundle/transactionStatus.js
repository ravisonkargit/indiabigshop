const https = require('https');
var router = require('express').Router()
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./paytm/checksum');
const paytm_config = require('./paytm/paytm_config').paytm_config;
/* initialize an object */
router.post('/', (request, res) => {
var paytmParams = {};

/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
paytmParams["MID"] = paytm_config.MID;

/* Enter your order id which needs to be check status for */
paytmParams["ORDERID"] = request.body.orderid;
console.log(request.body.orderid)

/**
* Generate checksum by parameters we have
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
checksum_lib.genchecksum(paytmParams, paytm_config.MERCHANT_KEY, function(err, checksum){

    /* put generated checksum value here */
    paytmParams["CHECKSUMHASH"] = checksum;

    /* prepare JSON string for request */
    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/order/status',
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
});

});

module.exports = router;