
import React, {Component} from 'react';
import "./media.css";
import { getAllMediaRelease } from '../../../actions';
import { connect } from 'react-redux';
import { imgUrl } from "../../../constants/variable";
import { isMobile } from "react-device-detect";

class MediaRelease extends Component {
    componentWillMount(){
        this.props.getAllMediaRelease();
    }
    render() {  
        return (
            <div className="row py-5">
                {
                            this.props.mediaRelease.map(item => item.isDelete == 0?
                                <div key={item.id} className="col-md-3 my-2">
                            <a href={item.link} rel="nofollow" target="_blank">
                                {isMobile ?
                                <div className="card media_wrapper_mobile">
                                    <div className="card-body d-flex justify-content-center align-items-center p-0">
                                        <img className="media_img img-class1" src={`${imgUrl}/press/${item.img}`} alt={item.alt} />
                                    </div>
                                </div>
                                : 
                                <div className="card media_wrapper">
                                    <div className="card-body d-flex justify-content-center align-items-center p-0">
                                        <img className="media_img img-class1" src={`${imgUrl}/press/${item.img}`} alt={item.alt} />
                                    </div>
                                </div>
                                }
                            </a>
                        </div> : ''
                            )
                        }

                </div>
        );
    }
}

const mapStateToProps = (state) => {
    return  state.mediaRelease
}

export default connect(mapStateToProps,{getAllMediaRelease})(MediaRelease);
// export default MediaRelease;