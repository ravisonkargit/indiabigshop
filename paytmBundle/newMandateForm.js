const https = require('https');
const router = require('express').Router()
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./paytm/checksum');
const paytm_config = require('./paytm/paytm_config').paytm_config;

router.post('/', (request, res) => {
    console.log(request.body)
/* initialize an object */
var paytmParams = {};

/* body parameters */
paytmParams.body = {

    /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
    "mid" : paytm_config.MID,

    /* Enter subscription id for which mandate form needs to be download */
    "subscriptionId" : request.body.subscriptionId,
};


/**
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
console.log('paytmParams', paytmParams)
checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), paytm_config.MERCHANT_KEY, function(err, checksum){
    console.log('mandate checksum', checksum)
    /* head parameters */
    paytmParams.head = {

        /* This will be AES */
        "tokenType" : "AES",

        /* put generated checksum value here */
        "signature" : checksum
    };

    /* prepare JSON string for request */
    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/subscription/paper/mandate/downloadUrl',
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
    post_req.write(request);
    post_req.end();
})

});

module.exports = router;