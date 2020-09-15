import React, { Component } from "react";
import { geolocated, geoPropTypes } from "react-geolocated";
import  wc from "which-country";
import { setCookie, getCookie } from "../../../../functions";
import axios from "axios";
import { ApiUrl } from "../../../../constants/ActionTypes";
import store from "../../../../store";
import { changeCurrency } from "../../../../actions";

class Location extends Component {
    constructor(props){
        super(props)
        this.state = {
            render: 0
        }
    }
    async componentWillReceiveProps(){
        if (!this.props.isGeolocationEnabled){
            await this.setState({
                render: 1
            })

        }

        if(this.props.coords){
            
            let country_name = getCookie('country_name');
            
            if (country_name===undefined || country_name==''){
                let country_name = wc([this.props.coords.longitude, this.props.coords.latitude]);
                
                
                try {
                    return await axios.post(`${ApiUrl}/common/get_country_alpha3.php`,{security_token: '', plateform_type: '', sellerid:'', code3:country_name}, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => {
                        
                        setCookie('country_code', response.data.result.code2, '365');
                        setCookie('country_name', response.data.result.country, '365');
                        
                        if (response.data.result.code2.toLowerCase() == 'in' || response.data.result.code2 == '') {
                            store.dispatch(changeCurrency('INR'))
                        } else {
                            store.dispatch(changeCurrency('USD'))
                        }
                        this.props.dataFromLocation(response.data.result.code2, response.data.result.country)

                        //store.dispatch(changeCurrency(response.data.result.currency))
                        return response.data;
                    })
                    .catch(error => {
                        const result = error;
                    });
                    
                } catch (e){
                console.log(`😱 Axios request failed: ${e}`);
                }
                setCookie('country_name', country_name, '365');
            }
        }

    }

  render() {
      return(
          <React.Fragment key={this.state.render}>

        </React.Fragment>
      )
    // return !this.props.isGeolocationAvailable
    // ? <div>Your browser does not support Geolocation</div>
    // : !this.props.isGeolocationEnabled
    //   ? <div>Geolocation is not enabled</div>
    //   : this.props.coords
    //     ? <table>
    //       <tbody>
    //         <tr><td>latitude</td><td>{this.props.coords.latitude}</td></tr>
    //         <tr><td>longitude</td><td>{this.props.coords.longitude}</td></tr>
    //         <tr><td>country</td><td>{wc([this.props.coords.longitude, this.props.coords.latitude])}</td></tr>
    //         <tr><td>altitude</td><td>{this.props.coords.altitude}</td></tr>
    //         <tr><td>heading</td><td>{this.props.coords.heading}</td></tr>
    //         <tr><td>speed</td><td>{this.props.coords.speed}</td></tr>
    //       </tbody>
    //     </table>
    //     : <div>Getting the location data&hellip; </div>;
  }
}

Location.propTypes = Object.assign({}, Location.propTypes, geoPropTypes);
// Using ES6 object spread syntax
Location.propTypes = { ...Location.propTypes, ...geoPropTypes };

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Location)