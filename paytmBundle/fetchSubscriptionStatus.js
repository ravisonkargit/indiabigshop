const https = require('https');

const checksum_lib = require('./paytm/checksum');
const paytm_config = require('./paytm/paytm_config').paytm_config;
const router = require('express').Router()
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/

router.post('/', (request, res) => {
/* initialize an object */
var paytmParams = {};

/* body parameters */
paytmParams.body = {

	/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
	"mid" : paytm_config.MID,

	/* Enter subscription id for whose status needs to be fetched */
	"subsId" : request.body.subscriptionid,

	/* Enter customer id, this should be the same that you used while creating subscription */
	"custId" : request.body.custid,
};

/**
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
console.log('paytmParams', paytmParams)
    checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), paytm_config.MERCHANT_KEY, function(err, checksum){

        /* head parameters */
        paytmParams.head = {

            /* This will be either AES or SSO */
            "tokenType"	: "AES",

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
            path: '/subscription/checkStatus',
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
    })

});

module.exports = router;