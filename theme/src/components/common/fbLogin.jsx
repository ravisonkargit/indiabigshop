import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import store from '../../store';
import { getUserRegister } from '../../actions';

class FbLogin extends Component {
    render() {

          const responseFacebook = (response) => {
            console.log(response , response.profileObj)
            let data = response.profileObj;
            store.dispatch(getUserRegister( data.email, data.familyName, data.givenName, data.name, data.imageUrl, data.id ) )
          }
           return (
                <FacebookLogin
                appId="320699958615619"
                autoLoad={false}
                callback={responseFacebook}
                //cssClass = "kep-login-facebook metro p-2 mr-4"
                render={renderProps => (
                <button onClick={renderProps.onClick}>Facebook Login</button>
                    )}
                    />
           )
       }
   }
   
   export default FbLogin