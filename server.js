const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
var dbconn = require("./db/index.js");
const axios = require("axios");
var FormData = require("form-data");
var qs = require("qs");
var fs = require("fs");
const bodyParser = require("body-parser");
const compression = require('compression')
var { beldaraDb } = require("./db/constants.js").dbName;
// let client = require('./redis')

let api = require('./api')
let paytm = require('./paytmBundle');
let translations = require('./translations')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = require("http").Server(app);

// Get client IP address from request object ----------------------
getClientAddress = function (req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0]
    || req.connection.remoteAddress;
};

app.get('/', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Beldara.com | B2B for Wholesale and Retail in India');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B for Wholesale and Retail in India');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/Beldara-logo_13_08_2020.jpg');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/product/*', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var url = '';
    if (pathUrl.indexOf('.html') != -1) {
      url = pathUrl.replace('/product/', '').split('.html')[0];
    } else {
      url = pathUrl.replace('/product/', '').replace('.html', '');
    }
    var query = "select name, desc1, main_img,keyword from beldara_main.tbl_seller_products where url = '" + url + "' limit 1";
    dbconn.query(query, (err, res) => {
      if (err) {
        data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
        data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
        data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
        data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
        data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
        result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
        result = data.replace(/\!doctype/g, '!DOCTYPE');
        response.send(result);
      } else {
        if (res[0]) {
          keyword = res[0].name;
          var prod_desc = res[0].desc1;
          prod_img = res[0].main_img;
          var prod_keyword  = res[0].keyword;
          if(prod_keyword == 'null' || prod_keyword == ''){
            prod_keyword = 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India';
          }
          if(prod_desc !== 'null' && prod_desc != '' && prod_desc !== null){
            prod_desc  = prod_desc.replace(/<[^>]+>/g, '');
          }
          data = data.replace(/\$OG_TITLE/g, keyword + ' on beldara.com');
          data = data.replace(/\$OG_DESCRIPTION/g, prod_desc + ' on beldara.com');
          data = data.replace(/\$OG_KEYWORD/g , prod_keyword + ' on beldara.com');
          data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/product_images/' + prod_img);
          // data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
          data = data.replace(/\$OG_META_TITLE/g, keyword + ' on beldara.com');
          result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
          result = data.replace(/\!doctype/g, '!DOCTYPE');
          response.send(result);
        } else {
          data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
          data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
          data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
          data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
          data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
          result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
          result = data.replace(/\!doctype/g, '!DOCTYPE');
          response.send(result);
        }
      }
    })
  })
})

// app.get('/cat/*', function(request, response) {
//   var pathUrl = request.originalUrl;
//   const filePath = path.resolve(__dirname, 'theme','build', 'index.html');
// fs.readFile(filePath, 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }
//   var url = '';
//   if ( pathUrl.indexOf('.html') != -1  ){
//     url = pathUrl.replace('/cat/','').split('.html')[0];
//   }else{
//     url = pathUrl.replace('/cat/','').replace('.html','');
//   }

//   if (url !== undefined && url!==null && url !=''){
//     var url1 = url.split('/')
//     url = url1.pop()
//   }

//   var query = "call beldara_main.get_category_seo('"+url+"')";
//   dbconn.query(query, (err, res) => {
   
//     if (err){
//       data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
//       data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
//       data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
//       data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
//       data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
//       result = data.replace(/\$OG_URL/g, 'https://beldara.com/'+pathUrl);
//       response.send(result);
//     }else{
//       if (res[0] && res[0][0] ){
//         keyword = res[0][0].metaDescrip ? res[0][0].metaDescrip : '';
//         var cat_title = await res[0][0].category_title? res[0][0].category_title : '';
//         var cat_prod_keyword = res[0][0].category_keyword ? res[0][0].category_keyword : 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India';
//         data = data.replace(/\$OG_TITLE/g, cat_title+' on beldara.com');
//         data = data.replace(/\$OG_DESCRIPTION/g, keyword+' on beldara.com');
//         data = data.replace(/\$OG_KEYWORD/g , cat_prod_keyword + 'on beldara.com');
//         data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
//         // data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
//        data = data.replace(/\$OG_META_TITLE/g, cat_title + 'on beldara.com');
//         result = data.replace(/\$OG_URL/g, 'https://beldara.com/'+pathUrl);
//         response.send(result);
//       }else{
//         data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
//         data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
//         data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
//         data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
//         data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
//         result = data.replace(/\$OG_URL/g, 'https://beldara.com/'+pathUrl);
//         response.send(result);
//       }
//     }
//   })
// })
// })

app.get('/lp/*', function (request, response) {
  // console.log('landing page called on server side',159);
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var url = '';
    if (pathUrl.indexOf('.html') != -1) {
      url = pathUrl.replace('/lp/', '');
    } else {
      url = pathUrl.replace('/lp/', '');
    }
    var query = "select page_name,keyword,url,desc1,page_img from beldara_main.tbl_landing_page where url = '" + url + "' limit 1";
    dbconn.query(query, (err, res) => {
      if (err) {
        data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
        data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
        data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
        data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
        data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
        result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
        response.send(result);
      } else {
        if (res[0]) {
          keyword = res[0].page_name;
          var prod_desc = res[0].desc1;
          prod_img = res[0].page_img ? 'https://img.beldara.com/page_thumb/' + res[0].page_img : 'https://img.beldara.com/images/beldara_logo_new.png';
          var prod_keyword  = res[0].keyword;
          if(prod_keyword == 'null' || prod_keyword == ''){
            prod_keyword = 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India';
          }
          if(prod_desc !== 'null' && prod_desc != '' && prod_desc !== null){
            prod_desc  = prod_desc.replace(/<[^>]+>/g, '');
          }
          data = data.replace(/\$OG_TITLE/g, keyword + ' on beldara.com');
          data = data.replace(/\$OG_DESCRIPTION/g, prod_desc + ' on beldara.com');
          data = data.replace(/\$OG_KEYWORD/g , prod_keyword + ' on beldara.com');
          data = data.replace(/\$OG_IMAGE/g, prod_img);
          data = data.replace(/\$OG_META_TITLE/g, keyword + ' on beldara.com');
          result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
          result = data.replace(/\!doctype/g, '!DOCTYPE');
          response.send(result);
        } else {
          data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
          data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
          data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
          data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
          data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
          result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
          result = data.replace(/\!doctype/g, '!DOCTYPE');
          response.send(result);
        }
      }
    })
  })
})


app.get('/trade-show/*', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8',  function (err, data) {
    if (err) {
      return console.log(err);
    }
    var get_path,id,type;
    get_path = pathUrl.split('/trade-show/').pop().replace('.html', '');
    id = get_path.split('-').pop();
    type = 'activity_details';
    try{
      var queryed = "select id, ifnull(event_name,'') as event_name, ifnull(event_date,'') as event_date, ifnull(event_location,'') as event_location,ifnull(event_city,'') as event_city,ifnull(event_country,'') as event_country, ifnull(website_link,'') as website_link, ifnull(contact_person,'') as contact_person, ifnull(contact_number,'') as contact_number, ifnull(user_button,'') as user_button, ifnull(user_link,'') as user_link, ifnull(contact_email,'') as contact_email, ifnull(small_image,'') as small_image, ifnull(start_date,'') as start_date, ifnull(end_date,'') as end_date, ifnull(description,'') as description,(CASE WHEN (`larg_image1` !='' AND `larg_image1` IS NOT NULL) THEN concat('https://img.beldara.com/create_event/',larg_image1) ELSE 'https://img.beldara.com/images/beldara_logo_new.png' END) AS `page_img` from beldara_main.tbl_event_master where id='" + id + "' limit 1";
       dbconn.query(queryed,(err, res) => {
          if(err){
            data = data.replace(/\$OG_TITLE/g, err+'global Business trade shows fairs business exhibition | Beldara.com');
            data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara - international b2b business trade shows, International Trade Fairs, Mega Trade Fair, exhibitions, B2B Trade Shows, industrial trade expo and events highly successful all over the world');
            data = data.replace(/\$OG_KEYWORD/g , 'International trade fair, trade show, mega trade fair, international trade expo, industrial expo, B2b trade shows, international trade, shows,trade events, global trade fairs');
            data = data.replace(/\$OG_META_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
            data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
            result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
            result = data.replace(/\!doctype/g, '!DOCTYPE');
            response.send(result);
          }else{
               if(res[0]){
                      var keyword = res[0].event_name;
                      var prod_desc = res[0].description;
                      var prod_keyword = '';
                      var prod_keyword  = res[0].event_name + ',' + res[0].event_date + ',' + res[0].event_location + ',' + res[0].event_city + ',' + res[0].event_country;
                      if(prod_keyword == 'null' || prod_keyword == ''){
                        prod_keyword = 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India';
                      }
                      if(prod_desc !== 'null' && prod_desc != '' && prod_desc !== null){
                        prod_desc  = prod_desc.replace(/<[^>]+>/g, '');
                      }
                      // prod_desc  = prod_desc.replace(/<[^>]+>/g, '');
                      data = data.replace(/\$OG_TITLE/g,  keyword + ' on beldara.com');
                      data = data.replace(/\$OG_DESCRIPTION/g, prod_desc + ' on beldara.com');
                      data = data.replace(/\$OG_KEYWORD/g , prod_keyword + ' on beldara.com');
                      data = data.replace(/\$OG_IMAGE/g, res[0].page_img);
                      data = data.replace(/\$OG_META_TITLE/g, keyword + ' on beldara.com');
                      result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
                      result = data.replace(/\!doctype/g, '!DOCTYPE');
                      response.send(result);
                  } else {
                      data = data.replace(/\$OG_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
                      data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara - international b2b business trade shows, International Trade Fairs, Mega Trade Fair, exhibitions, B2B Trade Shows, industrial trade expo and events highly successful all over the world');
                      data = data.replace(/\$OG_KEYWORD/g , 'International trade fair, trade show, mega trade fair, international trade expo, industrial expo, B2b trade shows, international trade, shows,trade events, global trade fairs');
                      data = data.replace(/\$OG_META_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
                      data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
                      result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
                      result = data.replace(/\!doctype/g, '!DOCTYPE');
                      response.send(result);
                  }
          }
      });
    }
    catch(err){
      data = data.replace(/\$OG_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
      data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara - international b2b business trade shows, International Trade Fairs, Mega Trade Fair, exhibitions, B2B Trade Shows, industrial trade expo and events highly successful all over the world');
      data = data.replace(/\$OG_KEYWORD/g , 'International trade fair, trade show, mega trade fair, international trade expo, industrial expo, B2b trade shows, international trade, shows,trade events, global trade fairs');
      data = data.replace(/\$OG_META_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
      data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
      result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
      result = data.replace(/\!doctype/g, '!DOCTYPE');
      response.send(result);
      console.log(err);
    }
  })
})


app.get('/trade-show.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara - international b2b business trade shows, International Trade Fairs, Mega Trade Fair, exhibitions, B2B Trade Shows, industrial trade expo and events highly successful all over the world');
    data = data.replace(/\$OG_KEYWORD/g , 'International trade fair, trade show, mega trade fair, international trade expo, industrial expo, B2b trade shows, international trade, shows,trade events, global trade fairs');
    data = data.replace(/\$OG_META_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

// app.get('/membership.html', function (request, response) {
//   var pathUrl = request.originalUrl;
//   const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

//   fs.readFile(filePath, 'utf8', function (err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     data = data.replace(/\$OG_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
//     data = data.replace(/\$OG_DESCRIPTION/g, 'Start your online journey through Beldara B2B marketplace with paid membership service.');
//     data = data.replace(/\$OG_KEYWORD/g , 'Beldara Paid Membership, Paid Member, Beldara Paid Service, Beladara Subscription service, Paid service on Beldara, Beldara Packages, Beldara Subscription Package, Beldara Registration fee');
//     data = data.replace(/\$OG_META_TITLE/g, 'global Business trade shows fairs business exhibition | Beldara.com');
//     data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
//     result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
//     response.send(result);
//   })
// })

app.get('/membership.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Paid Membership : Beldara.com');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Start your online journey through Beldara B2B marketplace with paid membership service.');
    data = data.replace(/\$OG_KEYWORD/g , 'Beldara Paid Membership  , paid membership, Membership fees for india supplier and Manufacturers, Beldara Subscription Package,Beladara Subscription service');
    data = data.replace(/\$OG_META_TITLE/g, 'Paid Membership : Beldara.com');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/post-requirement.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Post Requirement | Beldara.com ');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Post your requiremt to get connected with Verified Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally.');
    data = data.replace(/\$OG_KEYWORD/g , 'Post Requirement, b2b marketplace, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India.');
    data = data.replace(/\$OG_META_TITLE/g, 'Post Requirement | Beldara.com ');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})


app.get('/create-e-auction-online-on-beldara.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Beldara - Product eAuction | eAuction | Online Auction');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Learn how to create beldara product eAuction, Get best Deals with Sellers and Buy in wholesale rate Join Beldara.com ');
    data = data.replace(/\$OG_KEYWORD/g , 'creation auctions, auction, eAuction, buy product, online auction sites, online auction websites, bidding sites in india, bidding websites, eAuctions, auctions india, bid and win, online shopping india, online shopping sites in india.');
    data = data.replace(/\$OG_META_TITLE/g, 'Beldara - Product eAuction | eAuction | Online Auction');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/about.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'About Us | Beldara - B2B Marketplace');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'About Us | Beldara - B2B Marketplace');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/buy-now-on-beldara.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Buy now on beldara.com');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara is a B2B Marketplace designed specifically for small & medium businesses in India. It brings traders, wholesalers, retailers and manufacturers in India to one single platform to connect. Get real insights, live trends, and great B2B trade features.');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'Buy now on beldara.com');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/promot-your-business.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'How to promote your Business on Beldara.com');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara gives an opportunity and the right approach to set marketplace goals.');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'How to promote your Business on Beldara.com');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/beldara-logistics-services.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Logistic services');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com provide two amazing SCM services, Beldara Express and Beldara Ocean to ensure that your products reach the customers on time.');
    data = data.replace(/\$OG_KEYWORD/g , 'Beldara Logistics, Logistics delivery, Beldara Express, Beldara package delivery, Package delivery, Deliver for Beldara, Timely Delivery');
    data = data.replace(/\$OG_META_TITLE/g, 'Logistic services');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/partner-with-us.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Partner with us - beldara.com');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com provides major support to our partners. Join Beldara global B2B marketplace to connect with the right audience and generate more sales.');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'Partner with us - beldara.com');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/how-to-sell-fast.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'How to sell fast on Beldara.com.');
    data = data.replace(/\$OG_DESCRIPTION/g, 'How to sell products on Beldara, Learn more from our experts.');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'How to sell fast on Beldara.com.');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/stay-safe-on-beldara.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Stay Safe On Beldara.com');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com strive to make payments as safe as possible and to make the entire payment process easier, we have launched our own payment platform, BeldaraPay.');
    data = data.replace(/\$OG_KEYWORD/g , 'Payment Security, Data Safety Guarantee, Preventing Frauds, secure & safe payment, beldara pay');
    data = data.replace(/\$OG_META_TITLE/g, 'Stay Safe On Beldara.com');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    response.send(result);
  })
})

app.get('/auction.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Buy Leads online | Beldara.com');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Buy leads online from  Best Buyers to increase your business performance Join With beldara to buy b2b leads now');
    data = data.replace(/\$OG_KEYWORD/g , 'lead generation websites for sale,buy leads online,buy business leads, buy sales leads,buy b2b leads, companies that buy leads buy ecommerce leads, lead generation company for sale');
    data = data.replace(/\$OG_META_TITLE/g, 'Buy Leads online | Beldara.com');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

app.get('/contact.html', function (request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'Contact Us | Beldara - B2B Marketplace');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'Contact Us | Beldara - B2B Marketplace');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
})

// app.get('/', function (request, response) {
//   var pathUrl = request.originalUrl;
//   const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

//   fs.readFile(filePath, 'utf8', function (err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
//     data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
//     data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
//     result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
//     response.send(result);
//   })
// })

// app.get('/product/*', function (request, response) {
//   var pathUrl = request.originalUrl;
//   const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');
//   fs.readFile(filePath, 'utf8', function (err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     var url = '';
//     if (pathUrl.indexOf('.html') != -1) {
//       url = pathUrl.replace('/product/', '').split('.html')[0];
//     } else {
//       url = pathUrl.replace('/product/', '').replace('.html', '');
//     }
//     var query = "select name, desc1, main_img from beldara_main.tbl_seller_products where url = '" + url + "' limit 1";
//     dbconn.query(query, (err, res) => {
//       if (err) {
//         data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
//         data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
//         data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
//         result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
//         response.send(result);
//       } else {
//         if (res[0]) {
//           keyword = res[0].name;
//           var prod_desc = res[0].desc1;
//           prod_img = res[0].main_img;
//           prod_desc  = prod_desc.replace(/<[^>]+>/g, '');

//           data = data.replace(/\$OG_TITLE/g, keyword + ' on beldara.com');
//           data = data.replace(/\$OG_DESCRIPTION/g, prod_desc + ' on beldara.com');
//           data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/product_images/' + prod_img);
//           result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
//           response.send(result);
//         } else {
//           data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
//           data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
//           data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
//           result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
//           response.send(result);
//         }
//       }
//     })
//   })
// })

app.get('/cat/*', function(request, response) {
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme','build', 'index.html');
fs.readFile(filePath, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var url = '';
  if ( pathUrl.indexOf('.html') != -1  ){
    url = pathUrl.replace('/cat/','').split('.html')[0];
  }else{
    url = pathUrl.replace('/cat/','').replace('.html','');
  }

  if (url !== undefined && url!==null && url !=''){
    var url1 = url.split('/')
    url = url1.pop()
  }

  var query = "call beldara_main.get_category_seo('"+url+"')";
  dbconn.query(query, (err, res) => {
   
    if (err){
      data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
      data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
      data = data.replace(/\$OG_KEYWORD/g,'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally')
      data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
      data = data.replace(/\$OG_META_TITLE/g,'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers')
      result = data.replace(/\$OG_URL/g, 'https://beldara.com/'+pathUrl);
      result = data.replace(/\!doctype/g, '!DOCTYPE');
      response.send(result);
    }else{
      if (res[0] && res[0][0] ){
        keyword = res[0][0].metaDescrip ? res[0][0].metaDescrip : '';
        var cat_title = res[0][0].category_title? res[0][0].category_title : '';
        data = data.replace(/\$OG_TITLE/g, cat_title+' on beldara.com');
        data = data.replace(/\$OG_DESCRIPTION/g, keyword+' on beldara.com');
        data = data.replace(/\$OG_KEYWORD/g,keyword+' on beldara.com')
        data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
        data = data.replace(/\$OG_META_TITLE/g,cat_title+' on beldara.com')
        result = data.replace(/\$OG_URL/g, 'https://beldara.com/'+pathUrl);
        result = data.replace(/\!doctype/g, '!DOCTYPE');
        response.send(result);
      }else{
        data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
        data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
        data = data.replace(/\$OG_KEYWORD/g,'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally')
        data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
        data = data.replace(/\$OG_META_TITLE/g,'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers')
        result = data.replace(/\$OG_URL/g, 'https://beldara.com/'+pathUrl);
        result = data.replace(/\!doctype/g, '!DOCTYPE');
        response.send(result);
      }
    }
  })
})
})

app.use(compression())
app.use(express.static(path.resolve(__dirname, 'theme', 'build')));

app.get('*', function (request, response) {
  console.log('---*---')
  var pathUrl = request.originalUrl;
  const filePath = path.resolve(__dirname, 'theme', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    // data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
    // data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
    // data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    // result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    data = data.replace(/\$OG_TITLE/g, 'Beldara.com Trusted online B2B Marketplace for Buyer & Sellers');
    data = data.replace(/\$OG_DESCRIPTION/g, 'Beldara.com is an online business to business(B2B) marketplace for Manufacturers, wholesalers, Exporter, Importer to sell or buy in wholesale globally');
    data = data.replace(/\$OG_KEYWORD/g , 'b2b marketplace, b2b portal, b2b portal india, b2b portals worldwide, wholesale, manufacturers, wholesaler, exporters list, importers list, importers in India');
    data = data.replace(/\$OG_META_TITLE/g, 'Beldara.com | B2B Marketplace');
    data = data.replace(/\$OG_IMAGE/g, 'https://img.beldara.com/images/beldara_logo_new.png');
    result = data.replace(/\$OG_URL/g, 'https://beldara.com/' + pathUrl);
    result = data.replace(/\!doctype/g, '!DOCTYPE');
    response.send(result);
  })
  //response.sendFile(filePath);
});


//Allow Cors
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://165.22.216.247");
  // res.setHeader("Access-Control-Allow-Origin", "https://chat.beldara.com");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.header("Access-Control-Allow-Credentials",true);
  // res.header("Access-Control-Allow-Methods","GET, POST, OPTIONS")
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());

// we will use port 8000 for our app
const port = "5000";
server.listen(port, () => console.log(`connected to port ${port}`));

app.use('/api',api)
app.use('/translations',translations)
app.use('/paytm',paytm);

const io = require("socket.io")(server, { origins: "*:*" });

//Chat
var users = [];
io.on("connection", function (socket) {
  //ONLINE CHECK
  socket.on("login", function (data) {
    users[socket.id] = data.userId;
    // console.log('user ' + users[socket.id] + ' connected');
    io.emit("login", users[socket.id]);
  });
  socket.on("disconnect", function () {
    // console.log('user ' + users[socket.id] + ' disconnected');
    io.emit("disconnect", users[socket.id]);
  });

  //Pass Language
  socket.on("PassLang", function (typing) {
    // console.log(typing);
    io.emit("PassLang", typing);
  });

  //Refresh Conversations
  socket.on("conversationRefresh", function (typing) {
    // console.log(typing);
    io.emit("conversationRefresh", typing);
  });

  //User Typing
  socket.on("UserTyping", function (typing) {
    // console.log(typing);
    io.emit("UserTyping", typing);
  });

  //Requirement Based Chat Send Message
  //User send message
  socket.on("requirement-send-msg", function (values) {
    console.log(values)
    io.emit("requirement-send-msg", values);
    // var message,tomsg,frmmsg,to_lng,frm_lng,userData;
    //
    //   userData = {
    //     buyerid: values.buyerid,
    //     sellerid: values.sellerid,
    //     brid:values.brid,
    //     id:values.id,
    //     msg:values.msg,
    //     frmmsg: values.frmmsg,
    //     status: values.status,
    //     date: values.date,
    //     ftime: values.ftime,
    //     action: values.action,
    //     action: values.action,
    //     plateform_type: values.plateform_type,
    //     security_token: values.security_token,
    //     upload_file:values.image
    //   };
    //
    // userData = JSON.stringify(userData);
    // // console.log(userData)
    // let formData = new FormData();
    // formData.append("data", userData);
    // // console.log(formData)
    //
    // axios
    //     .post("https://img.beldara.com/beta_api/MyInquire_response.php", userData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data"
    //       }
    //     })
    //     .then(res => {
    //       // console.log(res.data.result)
    //       io.emit("requirement-send-msg", values);
    //     })
    //     .catch(err => console.log(err));
  });
  socket.on("send-quot", function (data) {
    // console.log(data)
    // var message,tomsg,frmmsg,to_lng,frm_lng,userData;
    //
    // userData = {
    //   buyerid: values.buyerid,
    //   sellerid: values.sellerid,
    //   brid:values.brid,
    //   id:values.id,
    //   msg:values.msg,
    //   frmmsg: values.frmmsg,
    //   status: values.status,
    //   date: values.date,
    //   ftime: values.ftime,
    //   action: values.action,
    //   action: values.action,
    //   plateform_type: values.plateform_type,
    //   security_token: values.security_token,
    // };
    socket.emit('send-quot', { image: true, data: data });
  })
  //Chat Support 
  socket.on("chat-support", function (data) {
    // console.log(data)
    socket.emit("chat-support", data);
  })
  socket.on("chat-message-prod", function (data) {
    // console.log(data)
    io.emit("chat-message-prod", data);
  })
  //User send Generic message
  socket.on("chat message", function (msg) {
    // console.log(msg)
    if(msg[1]  == '7340477'){
      fromsupportMsg = {
        textmsg : 'We are temporarily suspending our services due to this lockdown.Your needs remains our priority. We will get as soon as possible.',
        frommsg : '7340477',
        tomsg : msg[2]
      }
    }
    else if(msg[1]  == '8741249') {
      fromsupportMsg = {
        textmsg : 'We are temporarily suspending our services due to this lockdown.Your needs remains our priority. We will get as soon as possible.',
        frommsg : '8741249',
        tomsg : msg[2]
      }
    }
    else {
      fromsupportMsg = {
        textmsg : '',
        frommsg : '',
        tomsg : ''
      }
    }
    var message, tomsg, frmmsg, to_lng, frm_lng, userData, file;
    if (msg.length > 0) {
      message = msg[0];
      tomsg = msg[1];
      frmmsg = msg[2];
      to_lng = msg[3];
      frm_lng = msg[4];
      file = msg[5]
      userData = {
        msg: message,
        tomsg: tomsg,
        frmmsg: frmmsg,
        type: "msg_insert",
        to_lng: to_lng,
        frm_lng: frm_lng,
        supportMsg : fromsupportMsg
      };

    }
    else {
      userData = {
        msg: msg.message,
        tomsg: msg.tomsg,
        frmmsg: msg.frmmsg,
        type: "msg_insert",
        to_lng: msg.to_lng,
        frm_lng: msg.frm_lng,
        supportMsg : fromsupportMsg
      };
      tomsg = msg.tomsg;
      frmmsg = msg.frmmsg;
    }
    // console.log(tomsg,frmmsg,727);
      msg = [[userData.msg, userData.msg], tomsg, frmmsg, file];
      io.emit("chat message", msg);
   
    userData = JSON.stringify(userData);
    // console.log(userData)
    let formData = new FormData();
    formData.append("data", userData);
    // console.log(formData)
    if (!file) {
      axios
        .post("https://img.beldara.com/chat-api/msg_insert_test.php", userData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          // console.log(res.data);
          io.emit('refresh-conversations', [tomsg, frmmsg])
          io.emit('support-msg',res.data);
          // msg = [res.data.result, tomsg, frmmsg];
          // io.emit("chat message", msg);
          // console.log(formData)
        })
        .catch(err => console.log(err));
    }
  });


});
