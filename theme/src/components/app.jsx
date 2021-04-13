import React, {Component,Suspense,lazy} from 'react';
import { withTranslate } from 'react-redux-multilingual'

// import '../index.scss';
// import translations from '../constants/translations'

// Custom Components
// import HeaderOne from './common/headers/header-one';
// import HeaderTwo from './common/headers/header-two';
// import HeaderThree from './common/headers/header-three';


// import FooterOne from "./common/footers/footer-one";
// import FooterTwo from "./common/footers/footer-two";
// import FooterThree from "./common/footers/footer-three";

// // ThemeSettings
// import ThemeSettings from "./common/theme-settings"

// //Get Local storage
// import ls from 'local-storage'
// import { LoadingBar } from 'react-redux-loading-bar';

//Functions 
import asyncComponent from '../AsyncComponent'
import LoadingComponent from './products/common/loading-bar';

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(function(registration) {
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function(err) {
        console.log("Service worker registration failed, error:", err);
      });
  }


  // const HeaderThree = lazy(()=>import('./common/headers/header-three'))

const HeaderThree = asyncComponent(() =>
    import('./common/headers/header-three').then(module => module.default)
)
const FooterOne = lazy(()=>import('./common/footers/footer-one'))

class App extends Component {
   
    render() {
        return (
            <div>

                {HeaderThree?<HeaderThree logoName={'logo/ibs.png'} />:''}
                <Suspense fallback={<LoadingComponent />}>
                  {this.props.children}
                </Suspense>
                <Suspense fallback={''}>
                <FooterOne logoName={'logo/ibs.png'}/>
                </Suspense>
            </div>
        );
    }
}


export default withTranslate(App);
