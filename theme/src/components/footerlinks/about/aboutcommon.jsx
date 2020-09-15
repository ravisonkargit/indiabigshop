import React, {Component} from 'react';

class AboutCommon extends Component {
    
    render() {
        return (
            <React.Fragment>
            
                
                    <div className="col-md-offset-1 col-md-8 nopadding about_header_wrapper">
                        <h2 className="responsive about_header1">Global B2B marketplace that enables businesses to</h2>
                        <h1 className="responsive about_header2">SELL INTERNATIONALLY</h1>
                    </div>
                    <div className="col-md-4 nopadding">
                        <img className="banner_image" src={`${process.env.PUBLIC_URL}/assets/images/main_banner_image.png`} about="beldara" />
                    </div>

            
            </React.Fragment>
        );
    }
}

export default AboutCommon;
