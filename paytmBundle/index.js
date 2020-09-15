// var server = require('./server');
// var router = require('./router');
// server.start(router.route);


const route = require('express').Router()
const paytmRouter = require('./router')
// var paytmRouter = require('./paytmBundle/router');
const iniSubscription = require('./initiateSubscription');
const fetchPayment = require('./fetchPayment');
const checkPaymentStatus = require('./checkPaymentStatus');
const renewSubscription = require('./renewSubscription');
const newMandateForm = require('./newMandateForm');
const fetchSubscriptionStatus = require('./fetchSubscriptionStatus');
const transactionStatus = require('./transactionStatus');
const createOrder = require('./createOrder');
const paymentInitiated = require('./paymentInitiated');
// const Renewalapi = requires('./renewal');


// route.use('/checksum',paytmRouter)
route.use('/subscription',iniSubscription)
route.use('/fetchPayment',fetchPayment)
route.use('/checkPaymentStatus',checkPaymentStatus)
route.use('/renewSubscription',renewSubscription)
route.use('/newMandateForm',newMandateForm)
route.use('/fetchSubscriptionStatus',fetchSubscriptionStatus)
route.use('/transactionStatus',transactionStatus)
route.use('/createOrder',createOrder)
route.use('/paymentInitiated',paymentInitiated)
// route.use()
route.use('/renewSubscription',renewSubscription)


module.exports = route;
