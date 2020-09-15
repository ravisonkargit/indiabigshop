import React, { Component } from "react";
import TagManager from "react-gtm-module";
import ReactPixel from "react-facebook-pixel";
import ReactGA from 'react-ga';
// import { hotjar } from 'react-hotjar';
import { getCookie } from "../../functions";
// import LinkedInTag from 'react-linkedin-insight';

class Tracking extends Component {
  componentDidMount() {
    var country_code = getCookie('country_code');
    if(navigator.userAgent.indexOf("Speed Insights") == -1) { 

      //Google marketing tags

      if(this.props.type == '1'){
    
        const tagManagerArgs2 = {
          gtmId: "GTM-5HBBK96", //gtmId: 'UA-57225000-1',  
          // dataLayerName: "GTM-5HBBK96",
          events: {
            send_to: "AW-724875220"
          }
        };
        TagManager.initialize(tagManagerArgs2);
      }else{

        const tagManagerArgs = {
          gtmId: "GTM-K3NHFD2", //gtmId: 'UA-57225000-1',  
          // dataLayerName: "GTM-5HBBK96",
          events: {
            send_to: "803807171" //send_to: 'AW-803807171/IHhPCKqLwYgBEMO_pP8C'
          }
        };
        // TagManager.initialize(tagManagerArgs);    // on this line it enable hotjars

      if (window.location.href.indexOf('/auction-related/') != -1){
        const tagManagerArgsAuctionThanks = {
          gtmId: "GTM-K3NHFD2",   
          events: {
            send_to: "AW-803807171/WJMKCJvOm8ABEMO_pP8C" 
          }
        };
        TagManager.initialize(tagManagerArgsAuctionThanks);
      }

        const tagManagerArgs1 = {
          gtmId: "GTM-5HBBK96", //gtmId: 'UA-57225000-1',  
          // dataLayerName: "GTM-5HBBK96",
          events: {
            send_to: "AW-724875220", //send_to: 'AW-803807171/IHhPCKqLwYgBEMO_pP8C'
            value: 'replace with value',
          items: [{
            id: 'replace with value',
            location_id: 'replace with value',
            google_business_vertical: 'local'
          }, {
            id: 'replace with value',
            google_business_vertical: 'retail'
          }, {
            origin: 'replace with value',
            destination: 'replace with value',
            start_date: 'replace with value',
            end_date: 'replace with value',
            google_business_vertical: 'travel'
          }]
          }
        };

        TagManager.initialize(tagManagerArgs1);

      }

      
      // hotjar initializer
      // hotjar.initialize(1611878, 6);

      // const tagManagerArgs2 = {
      //   events: {
      //     send_to: "AW-803807171/2xpHCJrax7ABEMO_pP8C"
      //   }

      // };
      
      // TagManager.initialize(tagManagerArgs2);

      // const tagManagerArgs1 = {
      //   events: {
      //     send_to: "AW-724875220/_o0ECIbTs60BENTv0tkC"
      //   }

      // };
      
      // TagManager.initialize(tagManagerArgs1);

      //////FaceBook Pixel
      const advancedMatching = { em: "support@beldara.com" };
      const options = {
        autoConfig: true, // set pixel's autoConfig
        debug: false // enable logs
      };
      //ReactPixel.init("432219770935494", advancedMatching, options);
      if (getCookie('country_code') && getCookie('country_code') !== undefined && getCookie('country_code') !== null)
        country_code = getCookie('country_code');
     
        ReactPixel.init("2231476330510319", advancedMatching, options);
      
      if (country_code.toLowerCase() == 'in')
        ReactPixel.init("432564874336633", advancedMatching, options);
      else
        ReactPixel.init("432219770935494", advancedMatching, options);
      
        ReactPixel.pageView();

      // Google Analytics
      ReactGA.initialize('UA-57225000-1');
      ReactGA.pageview(window.location.pathname + window.location.search);

      // LinkedInTag.init('478243');
      // LinkedInTag.track(conversionId);

      ///Hot jar 1432138
      // hotjar.initialize(1432138, 6);
      /* analytics here */ 
    }
  }

  render() {
    return <div />;
  }
}
export default Tracking;
