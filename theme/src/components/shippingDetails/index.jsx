import React, { Component } from "react";
import Slider from 'react-slick';
import { ImgUrl } from "../../constants/ActionTypes";
import './shippingDetails.css';
import $ from 'jquery';
// signup

class ShippingDetails extends Component {

    constructor(props){
        super(props)
        this.state = {
            shippingDet: [
                {'image' : `${ImgUrl}/images/Worth_Value.png`, 'title':'Worth Value', 'info':'1M + product range with competitive prices.'},
                {'image' : `${ImgUrl}/images/Shipping.png`, 'title':'Global Delivery & Multilingual', 'info':'Worldwide logistic support & 5+ international languages.'},
                {'image' : `${ImgUrl}/images/Payment_Security.png`, 'title':'Payment Security', 'info':'The fully protected payment methods with safety.'},
                {'image' : `${ImgUrl}/images/Shop_with_No_worries.png`, 'title':'Shop with No worries', 'info':'From click to delivery we handle the process with security.'},
                {'image' : `${ImgUrl}/images/Upload.png`, 'title':'Upload your product', 'info':'Boost up your selling experience and sell your product to the whole world.'},
                {'image' : `${ImgUrl}/images/24_7_Help_center.png`, 'title':'24/7 Help center', 'info':'To make your shopping smooth, 24/7 assistance available.'},
                {'image' : `${ImgUrl}/images/Shop_Anywhere.png`, 'title':'Shop anytime anywhere', 'info':'Download the app now and get the whole of Service in your hand.'}
                ]
        }
    }

    componentDidMount(){
        $('.shopping_details').find('.slick-track').css({'height':'220px'});
    }

  render() {
    var settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 70,
        slidesToShow: 7,
        slidesToScroll: 7,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 7,
              slidesToScroll: 7,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
    };
    const { shippingDet } = this.state
    const { title } = this.props
    return (
      <React.Fragment>
            {/* <div className="title1  section-t-space py-4">
                <h4>{title}</h4>
                <h2 className="title-inner1">{subtitle}</h2>
            </div> */}
            <section className="section-b-space pt-0">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 shopping_details">
                        <div className="title1  section-t-space py-4">
                            <h3 className="title-inner1">{title}</h3>
                        </div>
                            <Slider {...settings} className="slide-6 home-slider each_shopping">
                                {
                                    shippingDet.map((item, index) =>
                                        <div key={index} className="each_shopping">
                                          
                                            <div className="text-center">
                                               <div className="d-flex align-items-center justify-content-center"> 
                                                <img src={`${item.image}`} alt={`${item.title}beldara.com`} />
                                               </div>
                                                <div className="px-2 shipping_title h6 text-center">{`${item.title}`}</div>
                                                <div className="px-2 shipping_info small text-muted text-center">{`${item.info}`}</div>
                                            </div>
                                        </div>
                                    )       
                                }
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
  }
}
export default ShippingDetails;
