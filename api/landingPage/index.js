var router = require('express').Router()
var conn = require("../../db/index.js");
let client = require('../../redis')
var {beldaraDb} = require('../../db/constants.js').dbName;
let axios = require('axios')
let setProductFunc = require('../productProvider');
 
//Fetch Landing page Api
router.post('/getLpDetail',(req,res) => {
    let url = req.body.url
   
    // client.hmget('lp','spices-wholesalers-manufacturers-exporters.html' , function(err,obj){
    //     console.log('first',err, obj, obj[0])
    //     if (!obj[0]){
    //         console.log('insdie')
    //     }
    //      client.hdel('lp','spices-wholesalers-manufacturers-exporters.html')
    //     if(!obj){
    //         client.hmset('lp','spices-wholesalers-manufacturers-exporters' ,'335860,334112,333879,334108,335813,333878,336198,334154,334152,331108,331061,335865,335863,331763,331302,322359,322356,322354,322003,321994,322000,321998,322002,322006,322010,322005,322776,322774,322789,322358,322786,322355,322788,322357', function(err,obj){
    //             console.log(err, obj)
    //             if (obj){
    //                 client.hmget('lp','spices-wholesalers-manufacturers-exporters' , function(err,obj){
    //                     console.log(err,obj)
    //                 })
    //             }
    //         })
    //     }
    // })

    //client.hdel('lp','spices-wholesalers-manufacturers-exporters.html')

    client.hmget('lp',url , function(err,obj){
        if(err) res.status(400).send(err)
        if(!obj[0]){
            let sql = `select id,page_name,TRIM(BOTH ',' from cat_id) as cat_id,concat('https://img.beldara.com/page_thumb/',page_img) as page_img ,desc1, keyword from ${beldaraDb}.tbl_landing_page where url='${url}'`
            conn.query(sql,(err,result)=>{
                if(err) res.status(400).send(err)
                if(result[0]){
                    var separator = ",";
                    var productid = result[0].cat_id.split(separator);
    
                    for(var i = 0 ; i < productid.length ; i++) {
                        if(productid[i] == '') {
                            productid.splice(i, 1);
                            i--;  
                        }
                    }
                    result[0].cat_id = productid.join();
                    let data =  JSON.stringify(result[0])
                    client.hmset('lp',url,
                    data
                    ,function(err,reply){
                        if(err)
                        res.status(400).send(err)
                        // res.send(reply)
                    })
                }
                res.status(200).send(result[0])

            })
        }
        else {
            var result = JSON.parse(obj[0])
            res.status(200).send(result)
        }
    })
})

router.post('/getLpProduct',(req,res) => {
    let cat_id = req.body.cat_id
    var separator = ",";
    var productid = cat_id.split(separator);
    for(var i = 0 ; i < productid.length ; i++) {

        if(productid[i] == '') {
            productid.splice(i, 1);
            i--;  
        }
        productid[i] = parseInt(productid[i]);
    }
    cat_id = productid.join();
    //client.hdel('product',productid)
    client.hmget('product', productid , function(err,obj){
        if(err) res.status(400).send(err)
        if (!obj[0]){

            axios.post("https://api.indiabigshop.com/common/get_prod_by_lp.php",
            { security_token: "", plateform_type: "", cat_id: cat_id },
            { headers: { "Content-Type": "application/json" } }
            )
            .then(response => {
            if (response.data.result){
                response.data.result.forEach(element => {
                    setProductFunc.setProduct(element.id, element)
                });
                res.status(200).send(response.data.result)
            }else{
                res.status(400).send(response.data)
            }
            })
            .catch(error => {
                const result = error.response;
                res.status(400).send(result)
                return Promise.reject(result);
            });
            
            //res.status(200).send(response.data)

            // let sql = `select * from ${beldaraDb}.tbl_seller_products where id in(${cat_id})`;
            // conn.query(sql,(err,result)=>{
            //     result.forEach(element => {
            //         setProductFunc.setProduct(element.id, element)
            //     });
            // })
            //res.status(200).send(result)
        }
        else {
            obj.forEach((element, index) => {
                obj[index] = JSON.parse(element)
            });
            // console.log('coming from redis')
            res.status(200).send(obj)
            // client.del(obj)
        }
    })    
})


router.post('/addCache/lpDetail',(req,res)=>{
    // let url = req.body
    console.log(req.body)
    // client.hmset(url,[
        
    // ])
})
module.exports = router