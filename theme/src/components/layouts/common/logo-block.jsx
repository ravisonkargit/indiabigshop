import React, { Component } from 'react';
import Slider from 'react-slick';

import {Slider5} from "../../../services/script";

class LogoBlock extends Component {

    render (){
        var settings = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
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
        const {brands,title,subtitle} = this.props
        return (
            <React.Fragment>
            <div className="title1  section-t-space py-4">
                    <h4>{title}</h4>
                    <h2 className="title-inner1">{subtitle}</h2>
            </div>
            <section className="section-b-space pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Slider {...settings} className="slide-6 home-slider">
                                {
                                    brands.map((item, index) =>
                                        <div key={index}>
                                            <div className="logo-block">
                                                <a href={item.link}>
                                                    <img src={`${item.imagefile}`} alt="beldara.com" />
                                                </a>
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
        )
    }
}

export default LogoBlock;