var router = require('express').Router()
const Razorpay = require("razorpay")
var conn = require("../../db/index.js");
var deviceType = require('device');
var mydevice = deviceType();
var device = mydevice.type
var {dateTime,nextMonthDateTime} = require('../../common/constants').data
var {beldaraDb} = require('../../db/constants.js').dbName;
var formidable = require('formidable');
var fs = require('fs');
const cryptoRandomString = require('crypto-random-string');


router.post('/fileUpload',(req,res) => {
    // console.log(req)
    var form = new formidable.IncomingForm();
     
    form.parse(req, function (err, fields, files) {
        // Read the file
        // console.log(fields,'from form')
        fs.readFile(files.inputFile.path, function (err, data) {
            // console.log(data)
            // if (err) throw err;
            // console.log('File read!');

            // Write the file
            let newPath = cryptoRandomString({length: 10})+"-"+fields.frmmsg+'-'+files.inputFile.name
            fs.writeFile('theme/build/assets/post_req/'+newPath, data, function (err) {
                if (err) throw err;
                let imgData = {
                    frmmsg: fields.frmmsg,
                    tomsg: fields.tomsg,
                    file: 'https://beldara.com/assets/post_req/'+newPath,
                    sysdate: dateTime
                }
                
                let sql = `insert into beldara_main.tbl_message set ?`
                conn.query(sql,imgData,(err,result)=>{
                    if(err) throw err;
                    // res.send('https://beldara.com/assets/post_req/'+files.inputFile.name).status(200)
                })
            
                res.write('https://beldara.com/assets/post_req/'+newPath);
                res.end();
                // console.log('File written!');
            });

            // // Delete the file
            // fs.unlink(oldpath, function (err) {
            //     if (err) throw err;
            //     console.log('File deleted!');
            // });
        });
    })
})
module.exports = router
