// import React, {Component} from 'react';
// import { connect } from 'react-redux'
// import { withTranslate } from "react-redux-multilingual";

// import {CanvasJSReact} from '../../../../public/assets/canvasjs/canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// class RatingChart extends Component {

//     constructor(props) {
//         super(props);
//     }

//     render (){
//         const options = {
// 			animationEnabled: true,
// 			theme: "light2",
// 			title:{
// 				text: "Most Popular Social Networking Sites"
// 			},
// 			axisX: {
// 				title: "Social Network",
// 				reversed: true,
// 			},
// 			axisY: {
// 				title: "Monthly Active Users",
// 				labelFormatter: this.addSymbols
// 			},
// 			data: [{
// 				type: "bar",
// 				dataPoints: [
// 					{ y:  2200000000, label: "Facebook" },
// 					{ y:  1800000000, label: "YouTube" },
// 					{ y:  800000000, label: "Instagram" },
// 					{ y:  563000000, label: "Qzone" },
// 					{ y:  376000000, label: "Weibo" },
// 					{ y:  336000000, label: "Twitter" },
// 					{ y:  330000000, label: "Reddit" }
// 				]
// 			}]
// 		}
//         return (
//                 <CanvasJSChart options = {options}
// 				/* onRef={ref => this.chart = ref} */
// 			/>
//         )
//     }
//     addSymbols(e){
// 		var suffixes = ["", "K", "M", "B"];
// 		var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
// 		if(order > suffixes.length - 1)
// 			order = suffixes.length - 1;
// 		var suffix = suffixes[order];
// 		return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
// 	}
// }


// const mapStateToProps = (state, ownProps) => {
//    console.log(state, ownProps); 
// }

// export default withTranslate(connect(
//     mapStateToProps
// )(RatingChart));