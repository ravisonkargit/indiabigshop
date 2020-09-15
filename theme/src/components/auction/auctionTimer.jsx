import React, { Component } from 'react'

class AuctionTimer extends Component {
    constructor(props){
        super(props);
        this.state = {
            timerdate: '',
            hasAuctionEnded: false,
            brid: '',
            curtime: ''
        }
    }
    componentDidMount = async ()  => {
        this.props.reqData(this.props.brid, true);
        if (this.props.brid){
            await this.setState({
                brid: this.props.brid
            })
        }

        if (this.props.req.curtime){
            await this.setState({
                curtime: this.props.req.curtime
            })
            // console.log('curtime: ',this.state.curtime);
        }

            // Set the date we're counting down to
        var auctionDate = this.props.auctionDate;
        var countDownDate1 = new Date(auctionDate);
        var countDownDate = countDownDate1.getTime();

        var now = new Date(this.props.req.curtime).getTime();
        //var countDownDate = auctionDate;
        var result = auctionDate;
        var ele = this;
        // Update the count down every 1 second
        var counter = 1;
        var x = setInterval(function () {
            
            // Get today's date and time
            // var now = new Date().getTime();
            // alert(now)
            // Find the distance between now and the count down date
            var distance = countDownDate - now - (counter * 1000);
            
            // alert(now)
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
            //alert('days: '+days+' hours '+hours+'minutes: '+minutes+' seconds '+seconds)
            //console.log(countDownDate , now , distance, days, hours, minutes, seconds);
            // Output the result in an element with id="demo"
            // document.getElementById("Timer").innerHTML = days + "day " + hours + "h "
            //     + minutes + "m " + seconds + "s ";
            if (days == 0 || days == '0'){
                result = hours + "h " + minutes + "m " + seconds + "s ";
            }else{
                result = days + "day " + hours + "h " + minutes + "m " + seconds + "s ";
            }
            // If the count down is over, write some text
           
            if (distance <= 0) {   
                result = "Auction Closed";
                ele.setState({
                    timerdate : result,
                    hasAuctionEnded: true
                })
                ele.props.reqData(ele.state.brid, false);
                clearInterval(x);
            }else{
                ele.setState({
                    timerdate : result
                })
            }
            counter++;
        }, 1000);

        
    }

    render() {
        return (
            <React.Fragment>
                {this.state.hasAuctionEnded? '':
                <div>Auction will end by:</div>
                }
                <div className="h5"> {this.state.timerdate? this.state.timerdate : '' } </div>
            </React.Fragment>
        )
    }
}

export default AuctionTimer;