var router = require('express').Router();
var conn = require("../../db/index.js");
var { apiResult} = require("../../common/constants.js").data;
var {beldaraDb} = require('../../db/constants.js').dbName;

router.post('/getExpressShipping',(req,result)=>{
    var sellercountryid = req.body.sellercountryid ? req.body.sellercountryid : 91;
    var countryid = req.body.countryid ? req.body.countryid : 91;
    var amount = req.body.amount ? req.body.amount : 1;
    var method = req.body.method ? req.body.method : 'air';
    var qty = req.body.qty ? req.body.qty : 1;
    var currency = req.body.currency ? req.body.currency : 'INR';
    var shippingData;
    if (method == '' || method === null || method === undefined)
     method = 'air';

    var prod_id = req.body.prod_id;
    try{
        if (prod_id && prod_id !='' && prod_id!==undefined && prod_id!== null){
    conn.query(`call ${beldaraDb}.expressShippingCost(${sellercountryid}, ${countryid}, ${amount}, ${prod_id}, ${qty}, '${currency}')`,(err, res, fields)=>{
        if (err){
            apiResult.message = 'Something went wrong';
            console.log('shipping crashed');
            throw err;
        }else{
            try{
            shippingData = res[0][0]['r_'+method];
            }catch(err){
                shippingData = 5;
            }
            if (shippingData < 5 && currency == 'USD')
                shippingData = 5;
            else if (shippingData < 40 )
                shippingData = 40;

            apiResult.result = { shippingCost: shippingData};
            apiResult.statusId = 1;
            apiResult.status = 'Success';
            apiResult.message = 'Success';
        }

            result.json(apiResult)
    })
}else{
    result.json(apiResult)
}
}catch(err){
    console.log('shipping crashed');
    apiResult.message = 'Something went wrong';
    res.json(apiResult)
}
    
})

module.exports = router;