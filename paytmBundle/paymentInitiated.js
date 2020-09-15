const https = require("https");
var formidable = require("formidable");
const checksum_lib = require("./paytm/checksum");
const paytm_config = require("./paytm/paytm_config").paytm_config;
var commonResult = require("../common/constants");
var commonDatafunc = require("../common/function");
var dbconn = require("../db/index.js");
var { beldaraDb } = require("../db/constants.js").dbName;
// commonDatafunc.data.paymentInitiator('4449192','I');
/**
 * import checksum generation utility
 * You can get this utility from https://developer.paytm.com/docs/checksum/
 */
const router = require("express").Router();
// console.log('test');
// https.createServer(function (req, res) {
router.post("/", (request, res) => {
  console.log(request.body, 18, "paymentinitiated");
  /* initialize an object with request parameters */
  // var form = new formidable.IncomingForm();

  // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.

  // form.parse(request, function (err, fields, files) {
  // Read the file
  // console.log(fields.SUBS_ID);
  if (request.body === undefined && request.body === "") {
    // console.log('if',24);
    res.status(404).send(commonResult.data.apiResult);
  } else {
    // console.log('else',27);

    // console.log('else',fields);
    if (
      request.body.RESPCODE === "01" &&
      request.body.STATUS === "TXN_SUCCESS"
    ) {
      // console.log(request.body.STATUS,31);
      /**
       * import checksum generation utility
       */
      // console.log('else if',fields);
      var paytmChecksum = "";

      /**
       * Create an Object from the parameters received in POST
       * received_data should contains all data received in POST
       */
      var paytmParams = {};
      for (var key in request.body) {
        // console.log(key,fields);
        if (key == "CHECKSUMHASH") {
          paytmChecksum = request.body[key];
          // console.log(paytmChecksum);
        } else {
          paytmParams[key] = request.body[key];
          // console.log(paytmParams);
        }
      }

      /**
       * Verify checksum
       * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
       */
      // console.log('test',58);
      var isValidChecksum = checksum_lib.verifychecksum(
        paytmParams,
        paytm_config.MERCHANT_KEY,
        paytmChecksum
      );
      console.log(isValidChecksum, 71, "paymentinitiated");
      if (isValidChecksum) {
        console.log("checksum validateed");
        var paytmParams = {};

        /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
        paytmParams["MID"] = paytm_config.MID;

        /* Enter your order id which needs to be check status for */
        paytmParams["ORDERID"] = request.body.ORDERID;
        // console.log(paytmParams)
        // res.status(200).send(request.body);
        /**
         * Generate checksum by parameters we have
         * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
         */
        checksum_lib.genchecksum(
          paytmParams,
          paytm_config.MERCHANT_KEY,
          function(err, checksum) {
            /* put generated checksum value here */
            paytmParams["CHECKSUMHASH"] = checksum;

            /* prepare JSON string for request */
            var post_data = JSON.stringify(paytmParams);

            var options = {
              /* for Staging */
              // hostname: "securegw-stage.paytm.in",

              /* for Production */
              hostname: 'securegw.paytm.in',

              port: 443,
              path: "/order/status",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": post_data.length
              }
            };

            // Set up the request
            var response = "";
            var post_req = https.request(options, function(post_res) {
              post_res.on("data", function(chunk) {
                response += chunk;
              });

              post_res.on("end", function() {
                response = JSON.parse(response);
                var json_data = JSON.stringify(request.body);
                console.log(response,response.STATUS,response.RESPCODE,typeof(response),123);
                if (
                  response.STATUS == "TXN_SUCCESS" &&
                  response.RESPCODE == "01"
                ) {
                  console.log("dara dara daa", 113);
                  //   var datatoDump = {
                  // orderid: request.body.ORDERID,
                  // orderid:,
                  // json_data: request.body,
                  // status: request.body.STATUS,
                  // token_id: request.body.TXNID
                  //   };
                  // console.log('Response: ', response,datatoDump);
                  //  var return_result_data  = await commonDatafunc.data.paymentInitiator(datatoDump);
                  var query = `call ${beldaraDb}.payment_transaction_deatil("${request.body.ORDERID}",'${json_data}',"${request.body.STATUS}","${request.body.TXNID}")`;
                  dbconn.query(query, async (err, result) => {
                    if (err) {
                      var send_res_data = commonResult.data.apiResultFailed;
                      res.status(500).send(send_res_data);
                      //   console.log(err,13);
                      //   return  commonResult.data.apiResultFailed;
                    } else {
                      var parameters_to_send = {
                        orderid:response.ORDERID
                      };
                      var post_data = JSON.stringify(parameters_to_send);
                      console.log(parameters_to_send, 274);
                      var options = {
                        hostname: "api.beldara.com",
                        port: 443,
                        path: `/common/send_invoice_test1.php`,
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Content-Length": post_data.length
                        }
                      };
                      var response = "";
                      var post_req = https.request(options, function(post_res) {
                        post_res.on("data", function(chunk) {
                          response += chunk;
                        });
                        post_res.on("end", function() {
                            console.log(response)
                        });
                    });
                    post_req.write(post_data);
                    post_req.end();
                      var send_res_data = commonResult.data.apiResultSuccess;
                      send_res_data.message = result[0][0].error_msg;
                      res.writeHead(301, {
                        Location:
                          commonResult.data.hostname + "/thankyou.html?type=11&o=0&e=0"
                      });
                      res.end();
                    }
                  });
                } else {
                  console.log("else", 125);
                  var query = `call ${beldaraDb}.payment_transaction_deatil("${request.body.ORDERID}",'${json_data}',"${request.body.STATUS}","${request.body.TXNID}")`;
                  dbconn.query(query, async (err, result) => {
                    if (err) {
                      var send_res_data = commonResult.data.apiResultFailed;
                      res.status(500).send(send_res_data);
                    } else {
                      res.status(404).send(commonResult.data.apiResult);
                    }
                  });
                }
              });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
            console.log("Checksum Matched");
          }
        );
      } else {
        console.log("Checksum Mismatched");
      }
      // res.status(200).send(request.body);
    } else {
      var json_data = JSON.stringify(request.body);
      // console.log('else else',66);
      var query = `call ${beldaraDb}.payment_transaction_deatil("${request.body.ORDERID}",'${json_data}',"${request.body.STATUS}","${request.body.TXNID}")`;
      dbconn.query(query, async (err, result) => {
        if (err) {
          var send_res_data = commonResult.data.apiResultFailed;
          res.status(500).send(send_res_data);
          //   console.log(err,13);
          //   return  commonResult.data.apiResultFailed;
        } else {
          //   console.log(result[0][0],16);
          var send_res_data = commonResult.data.apiResult;
          // send_res_data.message = result[0][0].error_msg;
          res.status(500).send(send_res_data);
        }
      });
    }
  }
  // })
  // res.status(200).send(request.body);
});

module.exports = router;
