import * as firebase from "firebase/app";
import "firebase/messaging";
// import "./firebase-messaging-sw"

import { ApiUrl } from '../../../constants/ActionTypes';
import { imgUrl } from '../../../constants/variable';
import axios from "axios";
import ls from "local-storage";
import $ from 'jquery'
import { getCookie } from "../../../functions";

// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
    apiKey: "AIzaSyDNYE9M32BQm5cOZeaPU416aK9cywMgfgc",
    authDomain: "mybeldara.firebaseapp.com",
    databaseURL: "https://mybeldara.firebaseio.com",
    projectId: "mybeldara",
    storageBucket: "mybeldara.appspot.com",
    messagingSenderId: "944225435259"
  };
  
  // Initialize Firebase
  try{
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.usePublicVapidKey("BPlqEOm2KBrl6qVbavoOst-AzE-SLg775YPeTC8TN4ekDevf0xKUJnaq6YvCPpI0vo_0fQUBMTpRSbvEaIWhzC0");
messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  return messaging.getToken();
})
.then(function(token) {
    // if (ls.get('sellerid')) {
        axios
        .post(
          `${ApiUrl}/common/ajax-firebase.php`,
          { security_token: "", plateform_type: "", token : token,type:'messaging',sellerid:ls.get('sellerid'),visitorid:getCookie('mhinpbnb')},
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
        //   dispatch(receiveStoreFront(response.data.result));
          // console.log(response.data.result) ;
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    // $.ajax({
    //   type:"post",
    //   data:{"token":token,"type":"messaging","sellerid":ls.get('sellerid')},
    //   url:`${imgUrl}/ajax/ajax-firebase.php`,
    //   success:function(result) {
    //     console.log(result);
    //   }
    // })
  // }
  

})
.catch(function(err) {
  // console.log('Unable to get permission to notify.'+err);
});
messaging.onMessage(function(payload) {
  //console.log('onMessage',payload)
})

}catch(err){
  // console.log('firebase error: '+err);
}