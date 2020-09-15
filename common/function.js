var dbconn = require("../db/index.js");
// var router = require('express').Router()
var {beldaraDb} = require('../db/constants.js').dbName;
var commonResult = require('../common/constants');
var return_resp = '';
 const paymentInitiator = async (res,err) => {
    // console.log(res);
    var json_data = JSON.stringify(res.json_data);
    // console.log(json_data);
    var query = `call ${beldaraDb}.payment_transaction_deatil("${res.orderid}",'${json_data}',"${res.status}","${res.token_id}")`;
    var response =  await dbconn.query(query);
   return response;
}
exports.data = {
     paymentInitiator
}



// dbconn.query(query, async (err, result) => {
//     // console.log(result);
//     if(err){
//         console.log(err,13);
//         return  commonResult.data.apiResultFailed;
//     }else{
//         console.log(result[0][0],16);
//         return  result[0][0];
//     }
// })