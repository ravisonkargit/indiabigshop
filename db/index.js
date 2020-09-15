var mysql = require('mysql');
var mainDb = 'beldara_main';
var conn = mysql.createConnection({
    host: 'beldara-kgroup.cx7shlv0nd7g.ap-south-1.rds.amazonaws.com',
    user: 'kgroup',
    password: 'akatsuki'
});
conn.connect((err,result) => {
    if(!err) {
        console.log('Database Connected')
    }else{
        console.log('Database not Connected', err)
    }
});

module.exports = conn;