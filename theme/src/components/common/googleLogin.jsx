import React, {Component} from 'react';
import GoogleLogin from 'react-google-login';
import store from '../../store';
import { getUserRegister } from '../../actions';

class LoginGoogle extends Component {
    render() {
        const responseGoogle = (response) => {
            
            let data = response.profileObj;
            store.dispatch(getUserRegister( data.email, data.familyName, data.givenName, data.name, data.imageUrl, data.id ) )
          }
           return (
                <GoogleLogin
                    clientId="944225435259-h1an8i6aifqh00nqc5bgslo0egmo9jtl.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
           )
       }
   }
   
   export default LoginGoogle