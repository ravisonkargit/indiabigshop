var router = require('express').Router()
var conn = require("../../db/index.js");
var deviceType = require('device');
var mydevice = deviceType();
var device = mydevice.type
var {razorpay_live,razorpay_uat} = require('../../common/constants').data
var {beldaraDb} = require('../../db/constants.js').dbName;



router.post('/',(req,res) => {
    let sql = `call ${beldaraDb}.fetchTodaysubscription()`
    conn.query(sql,(err,result)=>{
        if(err){
            res.send(err).status(200)
        }else{
            console.log(result.data,15);
        }
    })
    res.send(result.data).status(200)
})
module.exports = router
