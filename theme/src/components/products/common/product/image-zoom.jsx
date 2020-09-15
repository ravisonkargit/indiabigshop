import React, { Component } from 'react';
import ReactImageZoom from 'react-image-zoom';

export default class ImageZoom extends Component {
    render() {
        const {image} = this.props;
        const props = {width: 200, height: 250,   zoomWidth: 500, img: image};
        return (
            <React.Fragment>
                {/* <img src={`${image}`} className="img-fluid image_zoom_cls-0" /> */}
                <ReactImageZoom {...props} />
            </React.Fragment>
        );
    }
}