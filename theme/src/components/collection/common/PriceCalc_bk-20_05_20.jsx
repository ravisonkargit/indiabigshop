
import React, {Component} from 'react';
import { connect } from 'react-redux';
import {getAllCurrencyValue} from '../../../actions';
import { getCookie } from '../../../functions';
var start_price, end_price, symbol;
class PriceCalc extends Component {

    constructor(props){
        super(props)
        this.state = {
            start_price : '',
            end_price : '',
            symbol : ''
        }
    }

    // UNSAFE_componentWillMount(){
    //     this.props.getAllCurrencyValue();
    // }

    componentDidMount(){
        this.getPrice(this.props)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if (nextProps.data.symbol !== this.props.data.symbol)
        if (nextProps.data.symbol !== this.props.data.symbol || nextProps.start_price !== this.props.start_price){
            this.getPrice(nextProps)
        }
        if(this.props.country_code != getCookie('country_code')){
            this.getPrice(nextProps)
        }
    }

    getPrice(nextProps){
        let price_in, price_us, inrValue;
        var minqty;
        try{
            {nextProps.minqty === undefined || isNaN(nextProps.minqty) || nextProps.minqty == null || nextProps.minqty == 0 || nextProps.minqty == '0'?
                minqty = 1
                :minqty = nextProps.minqty }
        }catch(e){
            minqty = 1
        } 
        try{
            {nextProps.price_in === undefined || isNaN(nextProps.price_in) || nextProps.price_in == null?
                price_in = 0
                :price_in = nextProps.price_in }
        }catch(e){
            price_in = 0
        } 
        try{ 
        {nextProps.price_us === undefined || isNaN(nextProps.price_us) || nextProps.price_us == null?
            price_us = 0
            :price_us = nextProps.price_us }
        }catch(e){
            price_us = 0
        }  
        try{    
        {nextProps.currencyValue.currencyValue[0].INR === undefined || isNaN(nextProps.currencyValue.currencyValue[0].INR) || nextProps.currencyValue.currencyValue[0].INR == null?
            inrValue = 1
            :inrValue = nextProps.currencyValue.currencyValue[0].INR }    
        }catch(e){
            inrValue = 1
        }    

        try{    
        {nextProps.start_price === undefined || isNaN(nextProps.start_price) || nextProps.start_price === null?
            start_price = 0
            :start_price = nextProps.start_price }    
        }catch(e){
            start_price = 0
        } 

        try{    
            {nextProps.end_price === undefined || isNaN(nextProps.end_price) || nextProps.end_price === null || parseFloat(nextProps.end_price) < parseFloat(0) ?
                end_price = 0
                :end_price = nextProps.end_price }    
            }catch(e){
                end_price = 0
            } 
            
        let country_code = getCookie('country_code');
    
        try{
            if ((nextProps.symbol == 'INR' || nextProps.symbol == '' || nextProps.symbol == null || nextProps.symbol === undefined) && nextProps.data.symbol == 'USD') {
                start_price = parseFloat(start_price / inrValue);
                end_price = parseFloat(end_price / inrValue);
                symbol = "USD";
            } else if (nextProps.symbol == 'USD' && nextProps.data.symbol == 'INR') {
                start_price = parseFloat(start_price * inrValue);
                end_price = parseFloat(end_price * inrValue);
                symbol = "INR";
            } else if (nextProps.symbol === nextProps.data.symbol) {
                start_price = parseFloat(start_price ) ;
                end_price = parseFloat(end_price ) ;
                symbol = nextProps.data.symbol;
            } else {
                start_price = parseFloat( nextProps.start_price );
                end_price = parseFloat( nextProps.end_price );
                symbol = "INR";
            }
            
            if (country_code == '' || country_code.toLowerCase() == 'in'){
                start_price = parseFloat( start_price + ((price_in/100) * start_price))
                end_price = parseFloat(end_price + ((price_in/100) * end_price))
            }

            if ( country_code.toLowerCase() == 'us'){
                start_price = parseFloat(start_price + ((price_us/100) * start_price))
                end_price = parseFloat(end_price + ((price_us/100) * end_price))
            }
            start_price = Math.round(start_price * 100) / 100;
            end_price = Math.round(end_price * 100) / 100;
        }catch(e){
            start_price = 'Ask For Price';
            end_price = '';
            symbol = '';
        }

        start_price = start_price.toFixed(2)
        end_price = end_price.toFixed(2)

        if (start_price === undefined || isNaN(start_price) || start_price === null)
        start_price = 0.00

        if (end_price === undefined || isNaN(end_price) || end_price === null)
            end_price = 0.00

        try{
            this.props.finalCost(start_price, minqty);
        }catch(e){

        }

        this.setState({
            start_price : start_price,
            end_price : end_price,
            symbol : symbol
        })

    }

    prodCost = (start_price) => {
        try{
        this.props.productCost(start_price);
        }catch(e){
            
        }
    }

    render() {
        // console.log('render',151);
        const {start_price, symbol, end_price} = this.state;
        return (
            <React.Fragment>
                <div>
                    {start_price !== undefined && start_price != 'undefined' ?
                    ( parseFloat(start_price) > parseFloat(end_price) && parseFloat(end_price) > parseFloat(0) )?
                            <div className="font-weight-bold small"> {parseFloat(end_price) !== 0.00 ? symbol + ' ' + end_price : 'Ask for price'} {start_price ? '-' + start_price : ''}</div>
                    :( parseFloat(end_price) >  parseFloat(0))?
                            <div className="font-weight-bold small"> { parseFloat(start_price) !== 0.00 ? symbol + ' ' + start_price : 'Ask for price'} {end_price ? '-' + end_price : ''}</div>
                    : <div className="font-weight-bold"> {parseFloat(start_price) !== 0.00 ? <React.Fragment> {this.prodCost(start_price)} {symbol + ' ' + start_price} </React.Fragment>: 'Ask for price'}</div>
                    :''}
                </div>
                </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return state;
}
export default connect(mapStateToProps,{getAllCurrencyValue})(PriceCalc);
