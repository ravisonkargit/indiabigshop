
import React, { Component } from 'react';
import Slider from 'react-slick';
import { imgUrl } from '../../../../constants/variable';
import $ from 'jquery';

class SmallImages extends Component {
    constructor (props) {
        super(props);
        this.state = {
            nav2: null
        }
     
    }
    componentDidMount() {
        this.setState({
            nav2: this.slider2
        });
    }
    componentWillReceiveProps(nextProps){
        try{
            if(this.props.navOne != nextProps.navOne){
                // console.log(this.props,nextProps);
            var inter = setInterval(()=>{
            var slick_length = $('#'+this.props.item.id+' .slick-track').find('.slick-slide').length;
            // console.log(slick_length,'componentWillReceiveProps','#'+this.props.item.id+' .slick-track');
            if(slick_length > 0){
                var parent_width = slick_length * 100;
                // var pixels = parent_width+'px !important';
                var parent_element = document.getElementById(this.props.item.id);
                var parent = parent_element.querySelector('.slick-track');
                var children = parent.children;
                // console.log(parent_element,parent,children);
                if(children.length > 0){
                    // console.log('if');
                    parent.style.width=parent_width+'px';
                    // parent.style.width='2000px';
                    var i;
                    for(i=0;i<children.length;i++){
                        // console.log(children[i]);
                        children[i].style.width='100px';
                    }
                }
            }
            clearInterval(inter);
        },3000);
            }
        }catch(error){
            console.error(error);
        }
        
    }

    render() {
        // console.log('small','render',this.props);
        const { item, settings } = this.props;

        var productsnav = settings;

        return (
            <div className="row parent" id={this.props.item.id}>
               
                <div className="col-12 p-0">
                    {/* {this.props.navOne != null && this.props.navOne.innerSlider !== undefined? */}
                        <Slider {...productsnav} asNavFor={this.props.navOne} ref={slider => (this.slider2 = slider)} className="slider-nav" >
                        
                        <div key={item.img} className="small_images" style={{width:'125px !important'}}>
                            <img src={imgUrl+`/product_images_small/${item.img}`} key={item.img} alt={item.name}  className="img-fluid" />
                        </div>
                    
                        {item.other_images.map((vari, index) =>
                            <div key={index} className="small_images" style={{width:'125px !important'}}>
                                <img src={imgUrl+`/product_images_small/${vari}`} key={index} alt={item.name}  className="img-fluid" />
                            </div>
                        )}
                        </Slider>
                        {/* :'' */}
                    {/* } */}
                </div>
            </div>
        );
    }
}

export default SmallImages;