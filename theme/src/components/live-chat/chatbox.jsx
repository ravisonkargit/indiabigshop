import React, { Component, Suspense, lazy } from 'react'
import $ from 'jquery'
import axios from 'axios'
import { imgUrl } from "../../constants/variable";
import { connect } from "react-redux";

var jsonp_url = "https://chat.beldara.com";
function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}
function getUrlParam(parameter, defaultvalue) {
  var urlparameter = defaultvalue;
  if (window.location.href.indexOf(parameter) > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  // console.log(urlparameter)
  return urlparameter;
}
var s, param;
const Main = lazy(() => import('../chatbox/main'))
 class ChatBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chatWithSupplier:false
    }
  }
  componentDidMount() {
    // s = getUrlParam('s', undefined);
    // console.log(param)
    s = getCookie('mhinpbn')
    if (s !== undefined) {
      // console.log(param)
      window.localStorage.setItem('log_id', s)
    }
  }
  componentWillReceiveProps(){
    // if(this.props.chatWithSupplier!==false && this.state.chatWithSupplier===false) {
    //   this.setState({
    //     chatWithSupplier:this.props.chatWithSupplier
    //   })
    // }
  }
  // componentDidUpdate = async () => {
  //   if(this.props.chatWithSupplier && !this.state.chatWithSupplier) {
  //     console.log(this.props,'componentDidupdate')
  //     await this.setState({
  //       chatWithSupplier:this.props.chatWithSupplier
  //     })
  //   }
  // }
  render() {
    console.log(this.props.chatToSeller)
    // const { chatWithSupplier } = this.props
    // console.log(chatWithSupplier)
    return (
      <div id="example-widget-container">
        <Suspense fallback={'Loading'}>
          <Main item={this.props.product} chatWithSupplier={this.props.chatWithSupplier} chatToSeller={this.props.chatToSeller ? this.props.chatToSeller:false}/>
        </Suspense>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  chatToSeller:state.chat.chatToSeller
})
export default connect(mapStateToProps)(ChatBox);