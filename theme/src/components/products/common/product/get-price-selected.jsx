import React, { Component } from "react";
import PriceCalc from "../../../collection/common/priceCalc";
import PriceCalcOffer from "../../../collection/common/priceCalcOffer";

class GetPriceSelected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0
    }
    // console.log(props.price)
  }

  finalCost = () => {
    
  }

  finalCost = async (Cost) => {
    // console.log('Cost',Cost,179,'getPriceSelected');
    await this.setState({
       price: Cost
     })
   }
   
  CalcOfferPrice = (offer_price,qty,stock,min_qty,offer_date,to_date) => {
    if(this.offerExist(offer_date,to_date)){
       if(qty <= parseInt(stock) && qty >= parseInt(min_qty)){
            return parseInt(qty) * parseFloat(offer_price);
        }else{
            return null;
        }
    }else{
      return null;
    }
    
  } 

  offerExist = (from_date,to_date) => {
    if(from_date !== undefined && from_date !== null && from_date !== '' && to_date !== undefined && to_date !== null && to_date !== ''){
      let dateObj = new Date();
    let month = dateObj.getMonth()+1;
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let todayDate = year + '-' + month + '-' + day;
    // let todayDate = '2021-5-8';


    //Generate an array where the first element is the year, second is month and third is day
    var splitFrom = from_date.split('-');
    var splitTo = to_date.split('-');
    var splitToday = todayDate.split('-');

    //Create a date object from the arrays
    var newFrom = splitFrom[1]+ "," + splitFrom[2] + "," + splitFrom[0];
    var newTo = splitTo[1]+ "," + splitTo[2] + "," + splitTo[0];
    var newToday = splitToday[1]+ "," + splitToday[2] + "," + splitToday[0];

    newFrom = newFrom.toString();
    newTo = newTo.toString();
    newToday = newToday.toString();

    var fromDate = Date.parse(newFrom);
    var toDate = Date.parse(newTo);
    var todayDates = Date.parse(newToday);

    // console.log(splitFrom,splitTo,splitToday,'array',fromDate,toDate,todayDates,'days',newFrom,newTo,newToday);
    if(todayDates >= fromDate){
        if(toDate >= todayDates){
          return true;
        }else{
          return false;
        }
    }else{
      return false;
    }
    }else{
      return false;
    }
  }

  // componentWillReceiveProps(nextProps) {
  //     console.log(nextProps)
  // }
  render() {
    const { product, qty } = this.props;
    // console.log(this.props,'getPriceSelected',179);
    return (
      <div>
        {product.price.length > 0
          ? product.price.map((vari, index) =>
              vari.rangestart <= qty && vari.rangeend >= qty ? (
                <div key={index} className="border-product">
                  <span>
                    <div className="timer-cal">
                      {`${qty}${" "}${product.unit}  is selected`}
                    </div>
                    {/* <div className="timer-cal">{`${vari.currency}-${vari.eachunit}`}</div> */}
                    <div className="timer-cal">
                      {/* <PriceCalc
                      productCost={this.props.productCost}
                      finalCost={this.finalCost}
                        symbol={vari.currency}
                        start_price={vari.eachunit * qty}
                        end_price=""
                        price_in={product.price_in}
                        price_us={product.price_us}
                      /> */}
                      <PriceCalcOffer
                        productCost={this.props.productCost}
                        finalCost={this.finalCost}
                        symbol={vari.currency}
                        start_price={vari.eachunit * qty}
                        end_price=""
                        price_in={product.price_in}
                        price_us={product.price_us}
                        mrp_price={product.offer_mrp_price} 
                        price_offer={this.CalcOfferPrice(product.offer_price,qty,product.offer_stock,product.offer_min_qty,product.offer_from_date,product.offer_to_date)}
                      />
                    </div>
                  </span>
                </div>
              ) : vari.rangestart <= qty && vari.rangeend <= qty ? (
                product.price.length === index + 1 ? (
                  <div key={index} className="border-product">
                    <span>
                      <div className="timer-cal">
                        {`${qty}${" "}${product.unit}  is selected`}
                      </div>
                      {/* <div className="timer-cal">{`${vari.currency}-${vari.eachunit}`}</div> */}
                      <div className="timer-cal">
                        <PriceCalc
                        detailCost={this.detailCost}
                          symbol={vari.currency}
                          start_price={vari.eachunit * qty}
                          end_price=""
                          price_in={product.price_in}
                          price_us={product.price_us}
                        />
                      </div>
                    </span>
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )
            )
          : ""}
      </div>
    );
  }
}

export default GetPriceSelected;
