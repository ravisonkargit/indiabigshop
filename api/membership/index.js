var router = require('express').Router()
const Razorpay = require("razorpay")
var conn = require("../../db/index.js");
var deviceType = require('device');
var mydevice = deviceType();
var device = mydevice.type
var {dateTime,nextMonthDateTime} = require('../../common/constants').data
var {beldaraDb} = require('../../db/constants.js').dbName;


////Create Subscription razorpay
var plan_id,package_id,key_id,key_secret,instance;
function getRzrDetail(req) {
    if(req.headers.host === 'uat.beldara.com' || req.headers.host ==='localhost:5000') {
        // test
        key_id = 'rzp_test_8PjcTCtvKLpR6g';
        key_secret = 'iT3Kbi2BbMbNtWVKChKryzFc'


        //live
        // key_id =  'rzp_live_YHQFULPoYEUSnY'
        // key_secret=  'XsONOqa4lOlj8cXVtxcEEjdg'
    }
    else {
        key_id =  'rzp_live_YHQFULPoYEUSnY'
        key_secret=  'XsONOqa4lOlj8cXVtxcEEjdg'
    }
    instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret
    })
} 


//Create subscription
router.post('/createSubscription',(req,res) => {
    getRzrDetail(req)

    let ip = getClientAddress(req)
    let sellerid = JSON.parse(req.body.sellerid)
    var amount
    let currency = req.body.currency
    if(currency==='INR') {
        // amount = 999;
        amount = 2950;

    }
    else {
        // amount = 16.99;
        amount = 39.99;
    }
  
    if(req.headers.host === 'uat.beldara.com' || req.headers.host ==='localhost:5000') {
        if(req.body.currency==='INR'){
           // live one for test purpose 
        //    plan_id = 'plan_EbVpDUHqZgNi2k';

           //test one for test purpose
           plan_id = 'plan_EQo9xJh6OMhKjg';


           package_id = '27'
        }
        else {
            // console.log('uat and usd',49);
            //test
            // plan_id = 'plan_E9u3kD9qk3nptf';
            //plan_id = 'plan_EQoFNriIfUYMe8';

            //live
            plan_id = 'plan_EQmvvLGRYQWpyD';
            package_id = '28'
        }
    }else{
        if(req.body.currency==='INR'){
            // plan_id = 'plan_E8gh6FSie59Ksu';
            plan_id = 'plan_EQmv09i2B20jzk';
            package_id = '27'
        }
        else {
            // plan_id = 'plan_E8ghZYoRO5T5Tw';
            plan_id = 'plan_EQmvvLGRYQWpyD';
            package_id = '28'
        }
    }
    let params = {
        "plan_id": plan_id,
        "total_count":12,
        // "total_count":6,
        // "quantity": 1,
        // "order_id":"order_EAChpMom7rafv7",
        "customer_notify":1,
    }
    let sql = `call ${beldaraDb}.create_subscription('${sellerid}','${package_id}','${ip}','${device}','${amount}','${currency}')`
    conn.query(sql,(err,result)=>{
        if(err) res.status(400).send(err)
        console.log(result)
        if(result[0][0].p_subcription_id) {
            console.log('inside result',83);
            if(result[0][0].status === 201) 
                res.status(201).send('Already purchase for this plan')
            else {
                let data = {
                    key_id: key_id,
                    subscription_id: result[0][0].p_subcription_id
                }
                res.send(data).status(200)
            }
        }
        else {
            console.log('else condition',95);
            // console.log(result)
            instance.subscriptions.create(params).then(response => {
                console.log(response)
                let data = {
                    sellerid: JSON.parse(req.body.sellerid),
                    subscription_id: response.id,
                    package_id: package_id,
                    device: device,
                    currency: req.body.currency,
                    payment_status: 'issued',
                    ip: ip,
                    payment_mode: 'member',
                    payment_provider: 'razorpay',
                    tran_type: 'package',
                    amount: amount,
                    sysdate: new Date(),
                    subscription_status: 'issued',
                    customerid: response.customer_id
                }
                let sql = `insert into beldara_main.tbl_order set ?`
                conn.query(sql,data,(err,result)=>{
                    if(err) throw err;
                    let data = {
                        key_id: key_id,
                        subscription_id: response.id
                    }
                    res.send(data).status(200)
                })
            })
            .catch(err=>{
                console.log(err,126)
                res.status(400).send(err)
            }) 
        }
    })
    // let sql = `select subscription_id,id,complete from ${beldaraDb}.tbl_order where sellerid=${req.body.sellerid} and package_id=${package_id} and subscription_id is not null and subscription_status!='cancelled'`;
    // conn.query(sql,(err,result)=>{
    //     if(err) throw err
    //     if(result!='') {
    //         if(result[0].complete === 1) {
    //             console.log(result,'SSSSSS')
    //             res.status(201).send('Already Purchase a membership plan')
    //         }
    //         else {
    //             let sql = `update ${beldaraDb}.tbl_order set device='${device}',amount='${req.body.amount}',sysdate=now(),tran_type='package',payment_provider='razorpay',payment_mode='member',currency='${req.body.currency}',payment_status='attempted',ip='${ip}' where id=${result[0].id}`
    //             conn.query(sql,(err,response)=>{
    //                 if(err) throw err;
    //                 res.send(result[0].subscription_id).status(200)
    //             })
    //         }
    //     }
    //     else {
    //         instance.subscriptions.create(params).then(response => {
    //             console.log(response)
    //             let data = {
    //                 sellerid: JSON.parse(req.body.sellerid),
    //                 subscription_id: response.id,
    //                 package_id: package_id,
    //                 device: device,
    //                 currency: req.body.currency,
    //                 payment_status: 'issued',
    //                 ip: ip,
    //                 payment_mode: 'member',
    //                 payment_provider: 'razorpay',
    //                 tran_type: 'package',
    //                 amount: req.body.amount,
    //                 sysdate: new Date()
    //             }
    //             let sql = `insert into beldara_main.tbl_order set ?`
    //             conn.query(sql,data,(err,result)=>{
    //                 if(err) throw err;
    //                 res.send(response.id).status(200)
    //             })
    //         })
    //     }
    // })
})

//Success subscription
router.post('/successSubscription',(req,res) => {
    let ip = getClientAddress(req)
    getRzrDetail(req)
    let frm_date = dateTime
    let to_date = nextMonthDateTime
    let subscription_id = req.body.subscription_id
    let sellerid = JSON.parse(req.body.sellerid)
    let sql = `call ${beldaraDb}.success_subscription('${sellerid}','${req.body.package_id}','${req.body.payment_id}','${subscription_id}','${frm_date}','${to_date}','${ip}')`
    conn.query(sql,(err,result)=>{
        if(err) throw err;
            res.send(result).status(200)
    })
})

//Cancel Subscription
router.post('/cancelSubscription',(req,res) => {
    let ip = getClientAddress(req)
    getRzrDetail(req)
    let frm_date = dateTime
    let to_date = nextMonthDateTime
    let sellerid = JSON.parse(req.body.sellerid)
    let subscription_id = req.body.subscription_id
    let sql = `select * from ${beldaraDb}.tbl_order where sellerid='${sellerid}' and subscription_id='${subscription_id}'`
    conn.query(sql,(err,result)=>{
        if(err) throw err;
        if(result!='') {
            instance.subscriptions.fetch(subscription_id).then(response => {
                if(response.status !== 'cancelled')
                    instance.subscriptions.cancel(response.id,10)
                    let sql = `call ${beldaraDb}.cancel_subscription('${sellerid}','${subscription_id}')`
                    conn.query(sql,(err,result)=>{
                        if(err) throw err;
                        console.log(result)
                    })
                res.send(response).status(200)
            })
        }
        else {
            res.status(201).send(result)
        }
        // let sellerid = JSON.parse(req.body.sellerid)
        // let sql = `update beldara_main.tbl_seller_registration set package_id='${req.body.package_id}' where sellerid='${sellerid}'`
        // conn.query(sql,(err,result)=>{
        //     if(err) throw err;
        //     let sql = `call beldara_main.sellermaster('${sellerid}','','${req.body.package_id}','${ip}','1','${frm_date}','${to_date}')`
        //     conn.query(sql,(err,result)=>{
        //         if(err) throw err;
        //         res.send(result).status(200)
        //     })
        //     // res.send(result).status(200)
        // })
        
    })
})

//Create Customer 
router.post('/createCustomerId',(req,res) => {
    getRzrDetail(req)
    let ip = getClientAddress(req)
    let name = req.body.name
    let email = req.body.email
    let contact = req.body.mobile
    let sellerid = req.body.sellerid
    console.log(sellerid)
    let sql = `call ${beldaraDb}.get_customerid('${sellerid}')`
    conn.query(sql,(err,result)=>{
        if(err) res.status(400).send(err)
        // res.status(200).send(result[0])
        if(result){
            let customerid = result[0][0].device_type
            console.log(customerid)
            instance.customers.fetch(customerid)
            .then(response=>{
                res.status(200).send(response)
            })
            .catch(err=>{
                instance.customers.create({name, email, contact})
                .then(response=>{
                    let sql = `call update_customerid('${sellerid}','${response.id}')`
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
            // console.log(111)
            instance.customers.create({name, email, contact})
            .then(response=>{
                let sql = `call update_customerid('${sellerid}','${response.id}')`
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
    console.log(req.body,304);
    let name = req.body.name
    let email = req.body.email
    let contact = req.body.mobile
    let sellerid = req.body.sellerid
    let amount = req.body.amount
    let currency = req.body.currency
    let customer_id = req.body.customerid
    let accNo = req.body.accNo
    let ifsc = req.body.ifsc
    let benefName = req.body.benefName
    let accType = req.body.accType
    let paymentMethod = req.body.paymentMethod
    let auth_type = req.body.auth_type
    let payment_capture = 1
    let receipt = 'asdasdasd'
    let token = { 
        auth_type: auth_type,
        bank_account: {
            account_number: accNo,
            ifsc_code: ifsc,
            beneficiary_name: benefName,
            account_type: accType
        },
        "nach":{
            "form_reference1":"Recurring Payment for Gaurav Kumar",
            "form_reference2":"Method Paper NACH"
        }
    }
    // instance.orders.create({amount,currency,paymentMethod,payment_capture,customer_id,token,receipt})
    instance.orders.create(req.body)
    .then(response=>{
        res.status(200).send(response)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
    // instance.customers.fetch('cust_ECYTxY2XNzjY2w')
    // .then(response=>{
    //     res.status(200).send(response)
    // })
    // .catch(err=>{
    //     res.status(400).send(err)
    // })
})


module.exports = router