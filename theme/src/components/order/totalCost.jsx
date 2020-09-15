
import React, {Component} from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { getAllCurrencyValue,getTotalCost } from '../../actions';
// import { getTotalCost } from '../../services';
var start_price, end_price, symbol,ship_symbol='INR',ship_cost,totalCost;
class TotalCost extends Component {
    constructor(props){
        super(props)
        this.state = {
            start_price: null,
            one_time:true
        }
        // this.getPrice = this.props.getPrice.bind(this)
        
       
        // var getPrice1 = (start_price) => {
        //     this.props.getPrice(start_price).bind(start_price)
        // }
    }
    componentWillMount(){
        // getAllCurrencyValue();
        store.dispatch(getAllCurrencyValue())
    }
   
    componentWillReceiveProps(nextProps) {
        if ((nextProps.prod_symbol == 'INR' || nextProps.prod_symbol == '' || nextProps.prod_symbol === undefined) && nextProps.data.symbol == 'USD') {
            start_price = nextProps.prod_price / nextProps.currencyValue.currencyValue[0].INR;
            // end_price = nextProps.end_price / nextProps.currencyValue.currencyValue[0].INR;
            symbol = "USD";
        } else if (nextProps.prod_symbol == 'USD' && nextProps.data.symbol == 'INR') {
            start_price = nextProps.prod_price * nextProps.currencyValue.currencyValue[0].INR;
            // end_price = nextProps.end_price * nextProps.currencyValue.currencyValue[0].INR;
            symbol = "INR";
        } else if (nextProps.prod_symbol === nextProps.data.symbol) {
            start_price = nextProps.prod_price  ;
            // end_price = nextProps.end_price  ;
            symbol = nextProps.data.symbol;
        }
        else {
            start_price = nextProps.prod_price;
            // end_price = nextProps.end_price;
            symbol = "INR";
        }
        if (nextProps.data.symbol == 'USD') {
            ship_cost = nextProps.ship_cost / nextProps.currencyValue.currencyValue[0].INR;
        }
        else {
            ship_cost = nextProps.ship_cost;
        }
        start_price = Math.round(start_price * 100) / 100;
        ship_cost = Math.round(ship_cost * 100) / 100;
        // this.getPrice1(start_price)
        totalCost = parseFloat(start_price + ship_cost)
        // this.props.totalCost.bind(this, totalCost)
        if (nextProps.totalCost !== totalCost && !isNaN(nextProps.totalCost)) {
            store.dispatch(getTotalCost(totalCost))
            this.setState({
                one_time:false
            })
        }

        totalCost = totalCost.toFixed(2)
    }
    // componentDidMount() {
    //     store.dispatch(getTotalCost(totalCost))
    // }
    render() {
     
        return (
            <React.Fragment >
                <h4> {start_price !== 0 ? symbol + ' ' + totalCost : 'Ask for price'} </h4>
                
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return state;
}
export default connect(mapStateToProps,{getAllCurrencyValue})(TotalCost);
