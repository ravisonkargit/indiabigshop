"use strict";
var router = require('express').Router()
var paytm_config = require('./paytm/paytm_config').paytm_config;
var paytm_checksum = require('./paytm/checksum');
var querystring = require('querystring');

router.post('/generate_checksum', (request, res) => {
    if(request.method == 'POST'){
        var paramarray = {};
            paramarray['MID'] = paytm_config.MID; //Provided by Paytm
            paramarray['ORDER_ID'] = 'ORDER00001'; //unique OrderId for every request
            paramarray['CUST_ID'] = 'CUST0001';  // unique customer identifier 
            paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
            paramarray['CHANNEL_ID'] = paytm_config.CHANNEL_ID; //Provided by Paytm
            paramarray['TXN_AMOUNT'] = '1.00'; // transaction amount
            paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
            paramarray['CALLBACK_URL'] = 'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp';//Provided by Paytm
            paramarray['EMAIL'] = 'abc@gmail.com'; // customer email id
            paramarray['MOBILE_NO'] = '9999999999'; // customer 10 digit mobile no.
                paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
                    console.log('Checksum: ', checksum, "\n");
                    response.writeHead(200, {'Content-type' : 'text/json','Cache-Control': 'no-cache'});
                    response.write(JSON.stringify(checksum));
                    response.end();
                });
        }else{
            response.writeHead(200, {'Content-type' : 'text/json'});
            response.end();
        }
})

router.post('/verify_checksum', (request, res) => {
    if(request.method == 'POST'){
        var fullBody = '';
        request.on('data', function(chunk) {
            fullBody += chunk.toString();
        });
        request.on('end', function() {
            var decodedBody = querystring.parse(fullBody);
            
            console.log(decodedBody);

            // get received checksum
            var checksum = decodedBody.CHECKSUMHASH;

            // remove this from body, will be passed to function as separate argument
            delete decodedBody.CHECKSUMHASH;

            response.writeHead(200, {'Content-type' : 'text/html','Cache-Control': 'no-cache'});
            if(paytm_checksum.verifychecksum(decodedBody, paytm_config.MERCHANT_KEY, checksum)) {
                console.log("Checksum Verification => true");
                response.write("Checksum Verification => true");
            }else{
                console.log("Checksum Verification => false");
                response.write("Checksum Verification => false");
            }
             // if checksum is validated Kindly verify the amount and status 
             // if transaction is successful 
            // kindly call Paytm Transaction Status API and verify the transaction amount and status.
            // If everything is fine then mark that transaction as successful into your DB.			
            
            response.end();
        });
    }else{
        response.writeHead(200, {'Content-type' : 'text/json'});
        response.end();
    }
})



function htmlEscape(str) {
  return String(str)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}
exports.route = route;
