var router = require('express').Router();
var conn = require("../../db/index.js");
var {minAuctionPercent, apiResult} = require("../../common/constants.js").data;
var {beldaraDb} = require('../../db/constants.js').dbName;
router.post('/priceValidator',(req,res)=>{
    var prodid = req.body.prodid;
    var price = parseFloat(req.body.price);
    var qty = parseInt(req.body.qty);
    var currency = req.body.currency;
    var inrValue = 70;
    var totalprice = 1;

    try{
         if (prodid && prodid!='' && prodid!==undefined && prodid!==null){
    conn.query(`call ${beldaraDb}.validatePriceForAuction(${prodid}, ${price}, ${qty}, ${minAuctionPercent})`,(err, result,fields) => {
        if (err){
            apiResult.message = 'Something went wrong';
            console.log('auction crashed');
            throw err;
        }
        else{
            var eachprice, eachcurrency;
            try{
                eachprice = result[0][0].perprice;
                eachcurrency = result[0][0].prod_currency;
                inrValue = result[0][0].inr_value;
            }catch(err){
                eachprice = 1;
                eachcurrency = 'INR'
            }

            //totalprice = eachprice * qty;
            totalprice = eachprice;
            if (eachcurrency != 'USD' && currency == 'USD'){
                totalprice = totalprice / inrValue;
            }else if (eachcurrency == 'USD' && currency != 'USD'){
                totalprice = totalprice * inrValue;
            }

            totalprice = totalprice.toFixed(2);
            apiResult.result = totalprice;
            apiResult.statusId = 1;
            apiResult.status = 'success';
            apiResult.message = 'success';
        }

        res.json(apiResult)
    
    })
}else
res.json(apiResult)

}catch(err){
    console.log('auction crashed');
    apiResult.message = 'Something went wrong';
    res.json(apiResult)
}

    
    


})

module.exports = router;