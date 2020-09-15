import React from 'react';
import {Link} from 'react-router-dom'


function LogoImage(props) {
    return <a href={`${process.env.PUBLIC_URL}/`} >
                
                <img src={`${process.env.PUBLIC_URL}/assets/images/icon/${props.logo}`} alt="Beldara.com" className="img-fluid" />
                {/* <img src={`${process.env.PUBLIC_URL}/assets/images/icon/layout3/logo.png`} alt="Beldara.com" className="img-fluid" /> */}
 
            </a>;
}

export default LogoImage;