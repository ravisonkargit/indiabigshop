const express = require("express");
var router = require('express').Router()
 
 
let landingPage = require('./landingPage')
// let auctionRouter = require("./auction/index.js");
// let shippingRouter = require("./shipping/index.js");
let membership = require('./membership')
let emandate = require('./membership/emandate')
let chat = require('./chat')

router.use('/landingPage', landingPage)

// router.use('/auction',auctionRouter);
// router.use('/shipping',shippingRouter);
router.use('/membership', membership)
router.use('/membership/emandate', emandate)
router.use('/chat', chat)
module.exports = router