var router = require('express').Router()
const Razorpay = require("razorpay")
var conn = require("../../db/index.js");
var deviceType = require('device');
var mydevice = deviceType();
var device = mydevice.type
var {dateTime,nextMonthDateTime,nextYearDateTime} = require('../../common/constants').data
var {beldaraDb} = require('../../db/constants.js').dbName;
let subscription_amount = 295000;
const https = require('https');
////Create Subscription razorpay
var plan_id,package_id,key_id,key_secret,instance,nachProcedure,nach;
function getRzrDetail(req) {
    // || req.headers.host === 'localhost:5000'
    if(req.headers.host === 'uat.beldara.com' || req.headers.host === 'localhost:5000') {
        // for uat
        key_id = 'rzp_test_7vcRhUW0TOK8JG';
        key_secret = '5kGrEuZLoBUvXwW0tnJlpxwI'

        // this is live
        // key_id =  'rzp_live_UnQoaSSQXm7UJw'
        // key_secret=  'w1DIBo3VJEr6j3pqc1ud7rMW'
    } 
    else {
        key_id =  'rzp_live_UnQoaSSQXm7UJw'
        key_secret=  'w1DIBo3VJEr6j3pqc1ud7rMW'
    }
    instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret
    })
} 

 
//Create Customer 
router.post('/createCustomerId',(req,res) => {
    // console.log('req', req.body)
    getRzrDetail(req)
    let ip = getClientAddress(req)
    
    let sellerid = req.body.sellerid
    // console.log(sellerid)
    let sql = `call ${beldaraDb}.get_customerid('${sellerid}')`
    conn.query(sql,(err,result)=>{
        if(err) res.status(400).send(err)
        // res.status(200).send(result[0])
        console.log(result,46)
        if(result[0][0].device_type){
            let customerid = result[0][0].device_type
            let name = result[0][0].name
            let email = result[0][0].email
            let contact = result[0][0].mobile
            // console.log(customerid)
            instance.customers.fetch(customerid)
            .then(response=>{
                res.status(200).send(response)
            })
            .catch(err=>{
                instance.customers.create({name, email, contact,fail_existing:0})
                .then(response=>{
                console.log('already',60,response);
                    let sql = `call ${beldaraDb}.update_customerid('${sellerid}','${response.id}')`
                    conn.query(sql,(err,result)=>{
                        if(err) res.status(400).send(err)
                        res.status(200).send(response)
                    })      
                })
                .catch(err=>{
                    res.status(400).send(err)
                })
            })
        }
        else {

            let name = result[0][0].name
            let email = result[0][0].email
            let contact = result[0][0].mobile
            // console.log(111)
            instance.customers.create({name, email, contact,fail_existing:0})
            .then(response=>{
                console.log(response,80,'else');
                let sql = `call ${beldaraDb}.update_customerid('${sellerid}','${response.id}')`
                conn.query(sql,(err,result)=>{
                    if(err) res.status(400).send(err)
                    res.status(200).send(response)
                })     
            })
            .catch(err=>{
                console.log(err)
                res.status(400).send(err)
            })
        }
    })
    // instance.customers.create({name, email, contact})
    // .then(response=>{
        
    //     res.status(200).send(response)
    // })
    // .catch(err=>{
    //     res.status(400).send(err)
    // })
    // instance.customers.fetch('cust_ECYTxY2XNzjY2w')
    // .then(response=>{
    //     res.status(200).send(response)
    // })
    // .catch(err=>{
    //     res.status(400).send(err)
    // })
})


//Create Customer 
router.post('/createOrder',(req,res) => {
    getRzrDetail(req)
    let ip = getClientAddress(req)
    let name = req.body.name
    let email = req.body.email
    let contact = req.body.mobile
    let amount = "0";
    let sellerid = req.body.sellerid
    let currency = req.body.currency
    if(currency == 'INR'){
      package_id = 29;
    }else{
      package_id = 30;
    }
    let customer_id = req.body.customerid
    let accNo = req.body.accNo
    let ifsc = req.body.ifsc
    let benefName = req.body.benefName
    let accType = req.body.accType.toLowerCase()
    let method = req.body.paymentMethod
    let auth_type = req.body.auth_type
    let payment_capture = 1
    let receipt = 'monthly subscription'
    let first_payment_amount = "100"
    let dateInt = Date.parse(nextMonthDateTime);
    const dates = new Date(nextYearDateTime).getTime()
    // alert(d); //this is in milliseconds
    // console.log(auth_type,134);
    if(auth_type==='physical') {
       nachProcedure =  {"nach":{"form_reference1":"Recurring Payment for "+name,"form_reference2":"Method Paper NACH "+name,"description":"Paper NACH " }}
       nach = nachProcedure.nach
    }
    else {
        nachProcedure = {}
        nach = {}
    }

    // bank_account: {
    //     account_number: accNo,
    //     ifsc_code: ifsc,
    //     beneficiary_name: benefName,
    //     account_type: accType
    // }
    // ,

    let token = { 
        first_payment_amount: first_payment_amount,
        auth_type: auth_type,
        max_amount: "9999900",
        expire_at: "2147483647",
        nach
    }
    console.log(amount,currency,method,payment_capture,customer_id,token,receipt,159);
    // instance.orders.create({amount,currency,method,payment_capture,customer_id,receipt})
    instance.orders.create({amount,currency,method,payment_capture,customer_id,token,receipt})
    // instance.orders.create({amount,currency,receipt,payment_capture})
    .then(response => {
        // console.log('order created',response,162)
        let sql = `call ${beldaraDb}.createOrder('${sellerid}','${response.id}','authorised','razorpay','authenticate','${ip}','${customer_id}','${device}','${package_id}','${currency}','${method}','1')`
        conn.query(sql,(err,result)=>{
            // if(err) res.status(400).send(err)
            if(err) {
              console.log(err);
              res.status(400).send(err)
            }
            let data = {
                key_id: key_id,
                order_id: response.id,
                customerid: customer_id,
                response: response
            }
            res.status(200).send(data)
        })
        
    })
    .catch(err=>{
        // console.log(err)
        res.status(400).send(err)
    })
    // instance.orders.create(req.body)
    // .then(response=>{
    //     res.status(200).send(response)
    // })
    // .catch(err=>{
    //     res.status(400).send(err)
    // })
    // instance.customers.fetch('cust_ECYTxY2XNzjY2w')
    // .then(response=>{
    //     res.status(200).send(response)
    // })
    // .catch(err=>{
    //     res.status(400).send(err)
    // })
})


//FetchToken 
// router.post('/fetchToken',(req,res)=>{
//     // console.log(req,202);
//     console.log(req.body.payment_id,200,req.body)
//     instance.payments.fetch(req.body.payment_id)
//     .then(response=>{
//         res.status(200).send(response)
//     })
//     .catch(err=>{
//         res.status(400).send(err)
//     })
// })
router.post("/fetchToken", (req, res) => {
    getRzrDetail(req);
    const sellerid = req.body.sellerid;
    const orderid = req.body.order_id;
    instance.payments
      .fetch(req.body.payment_id)
      .then(response => {
        let sql = `call ${beldaraDb}.captureToken('${sellerid}','${response.token_id}','${orderid}')`;
        conn.query(sql, (err, result) => {
          // if(err) res.status(400).send(err)
          res.status(200).send(response);
        });
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });
//CreateOrder Charge 
// router.post('/createOrderCharge',(req,res)=>{
//     let ip = getClientAddress(req)
//     // console.log(req.body.payment_id)
//     // let subscription_amount 
//     let amount = subscription_amount
//     let sellerid = req.body.sellerid
//     let currency = 'INR'
//     let receipt = 'Payment';
//     let customer_id = req.body.customerid;
//     let method = req.body.method;
//     let payment_capture = 1
//     instance.orders.create({amount, currency, receipt, payment_capture})
//     .then(response => {
//         let order_id = response.id
//         let sql = `call ${beldaraDb}.createOrder('${sellerid}','${response.id}','created','razorpay','member','${ip}','${customer_id}','${device}','${package_id}','${currency}','${method}','0')`
//         conn.query(sql,(err,result)=>{
//             if(err) throw err
//         })
        
        
//         instance.payments.fetch(req.body.payment_id)
//         .then(response=>{
//             let tokenOrder = {
//                 token: response.token_id,
//                 order: order_id,
//                 amount: subscription_amount
//             }
//             res.status(200).send(tokenOrder)
//         })
//         .catch(err=>{
//             res.status(400).send(err)
//         })
         
//     })
// })
router.post("/createOrderCharge", (req, res) => {
  getRzrDetail(req);
  let ip = getClientAddress(req);
  let token_id = req.body.token_id;
  console.log(req.body,token_id,235);
  // console.log(req.body)
  let sql = `call ${beldaraDb}.getMembershipDetail('${token_id}')`;
  conn.query(sql, (err, result) => {
    if (err) res.status(400).send(err);
    else {
      console.log(result[0][0], 222, typeof result);
      // let amount = req.body.amount
      // let sellerid = req.body.sellerid
      let amount = 29500;
      let sellerid = result[0][0].sellerid;
      let currency = "INR";
      let receipt = "Payment";
      let customer_id = result[0][0].device_type;
      let payment_capture = 1;
      let method = "Razorpay";
      console.log(amount,252);
    //   return false;
      instance.orders
        .create({ amount, currency, receipt, payment_capture })
        .then(response => {
          console.log(response, 232);
          res.status(200).send(response);
          let order_id = response.id;
          let sql = `call ${beldaraDb}.createNewRecurringOrder('${sellerid}','${response.id}','created','razorpay','member','${ip}','${customer_id}','${device}','${package_id}','${currency}','${method}','0','${token_id}')`;
          conn.query(sql, (err, result) => {
            if (err) {
            } else {
              let tokenOrder = {
                token: token_id,
                order: order_id,
                amount: subscription_amount
              };
              var parameters_to_send = {
                sellerid: sellerid,
                currency: currency,
                customerid: customer_id,
                orderid: order_id,
                tokenid: token_id,
                amount: 29500,
                url:req.headers.host
              };
              var post_data = JSON.stringify(parameters_to_send);
              console.log(parameters_to_send, 274);
              var options = {
                hostname: "api.indiabigshop.com",
                port: 443,
                path: `/common/captureRecurringPayment.php`,
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Content-Length": post_data.length
                }
              };

              var response = "";
            //   var post_req = https.request(options, function(post_res, resp) {
            //     post_res.on("data", function(chunk) {
            //       response += chunk;
            //     });
            //     console.log(293);
            //     post_res.on("end", function() {
            //         response = JSON.parse(response);
            //         console.log(response,296,resp);
            //       res
            //         .status(200)
            //         .send(tokenOrder)
            //         .catch(err => {
            //           res.status(400).send(err);
            //         });
            //     });
            //   });
            var post_req = https.request(options, function(post_res) {
                post_res.on("data", function(chunk) {
                  response += chunk;
                });
                post_res.on("end", function() {
                    // response = JSON.parse(response);
                    console.log(response)
                });
            });
            post_req.write(post_data);
            post_req.end();    
            }
          });
          // let tokenOrder = {
          //     token: token_id,
          //     order: order_id,
          //     amount: subscription_amount
          // }
          // res.status(200).send(tokenOrder)
          // // instance.payments.fetch(req.body.payment_id)
          // // .then(response=>{
          // //     let tokenOrder = {
          // //         token: response.token_id,
          // //         order: order_id,
          // //         amount: subscription_amount
          // //     }

          // // })
          // .catch(err=>{
          //     res.status(400).send(err)
          // })
          // let
        });
    }
  });
});
module.exports = router
