var router = require('express').Router()
let client = require('../../redis');

const setProduct = function(id, product){
    var productdata;
    if(!id || id == ''){
        id = product.id 
    }
    
    if (id)
        {
            productdata = '';
             productdata = JSON.stringify(product);
            client.hmset('product',id, productdata , function(err,obj){   

            })
        }
   }  
   
   
module.exports = {
    setProduct
}   