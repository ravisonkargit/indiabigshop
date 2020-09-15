import React, { Component } from 'react';
import axios from "axios";
import { ApiUrl,ImgUrl } from "../../constants/ActionTypes";

class Test extends Component {
    componentDidMount(){
        console.log('componentdidmount called');
        axios.post('https://beldara.com/api/membership/emandate/createOrderCharge',
        {token_id:'token_EbZrgqADsNSOlL'},
        {
            headers :{
                "Content-Type":"application/json"
            }
          }
        ).then(
            res =>{
                console.log(res.data);
            }
        )
    }
    render() {
        return (
            <div>
                <h1>Test</h1>
            </div>
        )
    }
}
export default Test
