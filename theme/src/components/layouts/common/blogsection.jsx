import React, { Component } from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router-dom';

import {Slider3} from "../../../services/script"

class BlogSection extends Component {
    render (){
        return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Slider {...Slider3} className="slide-3 no-arrow ">
                                {
                                    this.props.tm.tm.map((item,index) => 
                                        <div key={index}>
                                            <div className="col-md-12">
                                                {/* <Link to={`${process.env.PUBLIC_URL}/blog/details`} > */}
                                                    <div className="classic-effect">
                                                        <img src={`${item.image}`} className="img-fluid m-auto w-50 h-50" alt={item.company} />
                                                            <span></span>
                                                    </div>
                                                {/* </Link> */}
                                                <div className="blog-details">
                                                    <h4>{item.company}</h4>
                                                    {/* <Link to={`${process.env.PUBLIC_URL}/blog/details`} > */}
                                                        <h6>{item.description}</h6>
                                                    {/* </Link> */}
                                                    <hr className="style1" />
                                                        <h6>by: {item.sellername}</h6>
                                                </div>
                                            </div>
                                        </div>    
                                        
                                    )
                                    
                                }
                            </Slider>
                        </div>
                    </div>
                </div>
        )
    }
}

export default BlogSection;