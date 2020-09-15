
import React, {Component} from 'react';
import { getMediaReleaseScreenShort } from "../../../functions";
//import "../mediaRelease/media.css";
import { getAllMediaRelease } from '../../../actions';
import { connect } from 'react-redux';
var type = 'MediaReleaseScreenShort';

class MediaScreenshot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            statusId:''
        }
    }
    componentWillMount(){
        this.props.getAllMediaRelease();
    }
    componentDidMount = async () => {
        await getMediaReleaseScreenShort(type).then(async res => {
            try{
                if(res != null && res != ''){
                    if(res.statusId==1 || res.statusId=="1"){
                        await this.setState({
                            data: res.result[0]
                        });
                    }
                }
            }catch(e){
                console.log(`😱 Axios request failed: ${e}`);
            }
        })
    }
    render() {  
        return (
            <div className="row py-2">
                { this.state.data &&
                    this.state.data.map(item => (item.img != '' && item.img != null)?
                        <div key={item.id} className="col-md-12 my-2">
                            <a href={item.link} rel="nofollow" target="_blank">
                                <div className="card media_wrapper1">
                                    <div className="card-body d-flex justify-content-center align-items-center p-0">
                                        <img className="media_img img-class2 w-100 h-100" src={item.img} alt={item.alt}/>
                                    </div>
                                </div>
                            </a>
                        </div>
                         : ''
                            )
                        }

                </div>
        );
    }
}

const mapStateToProps = (state) => {
    return  state.MediaScreenshot
}

export default connect(mapStateToProps,{getAllMediaRelease})(MediaScreenshot);
//export default MediaScreenshot;