
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var nextYear = (today.getFullYear()+1)+'-'+(today.getMonth()+1)+'-'+today.getDate();
var nextMonth = today.getFullYear()+'-'+(today.getMonth()+2)+'-'+today.getDate()
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
exports.data = {
    localhost_url:'http://localhost:5000/paytm/',
    hostname:'https://localhost:3000',
   dateTime: date+' '+time,
   nextMonthDateTime: nextMonth+' '+time,
   nextYearDateTime: nextYear+' '+time,
   minAuctionPercent: 70,
    apiResult : {
        message: 'Not Found',
        result: 'Not Found',
        status: 'Failure',
        statusId: 0
    },
    apiResultSuccess : {
        message: 'success',
        result: 'success',
        status: 'success',
        statusId: 1
    },
    apiResultFailed : {
        message: 'failed',
        result: 'database connection failed',
        status: 'failed',
        statusId: 0
    },
    razorpay_uat : {
        key_id : 'rzp_test_7vcRhUW0TOK8JG',
        key_secret : '5kGrEuZLoBUvXwW0tnJlpxwI'
    },
    razorpay_live : {
        key_id : 'rzp_live_UnQoaSSQXm7UJw',
        key_secret :  'w1DIBo3VJEr6j3pqc1ud7rMW'
    }
}
