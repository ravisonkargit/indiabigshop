var router = require('express').Router()
const Razorpay = require("razorpay")
var conn = require("../../db/index.js");
var deviceType = require('device');
var mydevice = deviceType();
var device = mydevice.type
var {dateTime,nextMonthDateTime,nextYearDateTime} = require('../../common/constants').data
var {beldaraDb} = require('../../db/constants.js').dbName;
let subscription_amount = 99900;
////Create Subscription razorpay
var plan_id,package_id,key_id,key_secret,instance,nachProcedure,nach;
function getRzrDetail(req) {
    // || req.headers.host === 'localhost:5000'
    if(req.headers.host === 'uat.beldara.com' || req.headers.host === 'localhost:5000') {
        key_id = 'rzp_test_7vcRhUW0TOK8JG';
        key_secret = '5kGrEuZLoBUvXwW0tnJlpxwI'
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
    console.log('req', req.body)
    getRzrDetail(req)
    let ip = getClientAddress(req)
    
    let sellerid = req.body.sellerid
    // console.log(sellerid)
    let sql = `call ${beldaraDb}.get_customerid('${sellerid}')`
    conn.query(sql,(err,result)=>{
        if(err) res.status(400).send(err)
        // res.status(200).send(result[0])
        console.log(result)
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
                console.log('already')
                instance.customers.create({name, email, contact,fail_existing:0})
                .then(response=>{
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
                console.log(response)
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
    console.log(auth_type)
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
    // instance.orders.create({amount,currency,method,payment_capture,customer_id,receipt})
    instance.orders.create({amount,currency,method,payment_capture,customer_id,token,receipt})
    .then(response => {
        console.log('order created',response)
        let sql = `call ${beldaraDb}.createOrder('${sellerid}','${response.id}','authorised','razorpay','authenticate','${ip}','${customer_id}','${device}','${package_id}','${currency}','${method}','1')`
        conn.query(sql,(err,result)=>{
            // if(err) res.status(400).send(err)
            if(err) throw err
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
router.post('/fetchToken',(req,res)=>{
    console.log(req.body.payment_id)
    instance.payments.fetch(req.body.payment_id)
    .then(response=>{
        res.status(200).send(response)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
})
//CreateOrder Charge 
router.post('/createOrderCharge',(req,res)=>{
    let ip = getClientAddress(req)
    // console.log(req.body.payment_id)
    // let subscription_amount 
    let amount = subscription_amount
    let sellerid = req.body.sellerid
    let currency = 'INR'
    let receipt = 'Payment';
    let customer_id = req.body.customerid;
    let method = req.body.method;
    let payment_capture = 1
    instance.orders.create({amount, currency, receipt, payment_capture})
    .then(response => {
        let order_id = response.id
        let sql = `call ${beldaraDb}.createOrder('${sellerid}','${response.id}','created','razorpay','member','${ip}','${customer_id}','${device}','${package_id}','${currency}','${method}','0')`
        conn.query(sql,(err,result)=>{
            if(err) throw err
        })
        
        
        instance.payments.fetch(req.body.payment_id)
        .then(response=>{
            let tokenOrder = {
                token: response.token_id,
                order: order_id,
                amount: subscription_amount
            }
            res.status(200).send(tokenOrder)
        })
        .catch(err=>{
            res.status(400).send(err)
        })
         
    })
})
module.exports = router
