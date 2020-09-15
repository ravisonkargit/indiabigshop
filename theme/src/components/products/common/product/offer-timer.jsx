import React, { Component } from "react";
import $ from "jquery";
import { offerExist } from "../../../../functions/index";

var distance,currentDate,inter;
class offerTimer extends Component {
  componentDidMount() {
    // console.log("componentDidMount", 13,this.props);
    var offer_from_date = this.props.offer_from_date;
    var offer_to_date = this.props.offer_to_date;
    // clearInterval is used because when parents props render each time this function will called that will create multiple infinite function so it is mandatory to clear previous set interval function before it calls new one
    clearInterval(inter);
    this.calcalateTime(offer_from_date, offer_to_date);
  }
  calcalateTime = async (offer_from_date, offer_to_date) => {
    // offer_to_date = '2020-05-19'
    if (offerExist(offer_from_date, offer_to_date)) {
      // console.log('if',13);
      offer_to_date = offer_to_date + " 23:59:59";
      var expireddate = new Date(offer_to_date).getTime();
      inter = setInterval(() => {
        currentDate = new Date().getTime();
        distance = expireddate - currentDate;
        // console.log('setInterval',13,distance,offer_from_date, offer_to_date);
        if (distance > 0) {
        $('#parent_calc_row').removeClass('d-none');
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var secs = Math.floor((distance % (1000 * 60)) / 1000);
        //   console.log(
        //     distance,
        //     offer_from_date,
        //     offer_to_date,
        //     expireddate,
        //     currentDate,
        //     new Date().getDate(),
        //     13
        //   );
          $("#days").html(days);
          $("#hours").html(hours);
          $("#minutes").html(mins);
          $("#seconds").html(secs);
        }else{
          // console.log('else',13);
          if($('#parent_calc_row').hasClass('d-none')){
          // console.log('else if',13);
          }else{
            $('#parent_calc_row').addClass('d-none');
          // console.log('else else',13);
          }
            // $('#parent_calc_row').addClass('d-none');
        }
        // clearInterval(inter);
      }, 1000);
    } else {
      // console.log('else',13);
    }
  }
  render() {
    const style = {
      width:'80px'
    };
    return (
      <div className="row d-none justify-content-center" id="parent_calc_row">
          <div className="col-md-12 text-center">
            <span className="h6">Offer ends in </span>
          </div>
        <div className="text-center" style={style}>
          <h1 className="h5" id="days">
            00
          </h1>
          <span>DAYS</span>
        </div>
        <div className="text-center" style={style}>
          <h1 className="h5" id="hours">
            00
          </h1>
          <span>HOURS</span>
        </div>
        <div className="text-center" style={style}>
          <h1 className="h5" id="minutes">
            00
          </h1>
          <span>MINUTES</span>
        </div>
        <div className="text-center" style={style}>
          <h1 className="h5" id="seconds">
            00
          </h1>
          <span>SECONDS</span>
        </div>
      </div>
    );
  }
}

export default offerTimer;
