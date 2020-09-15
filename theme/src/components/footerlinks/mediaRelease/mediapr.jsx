import React, {Component} from 'react';
import { getAllMediapr } from '../../../actions';
import { connect } from 'react-redux';
import $ from 'jquery'
import { imgUrl } from '../../../constants/variable';
import './media.css';
class Mediapr extends Component {
    componentWillMount(){
        this.props.getAllMediapr();
    }
    componentDidMount(){
        console.log('componentDidMount');
        // $(".videoWrapper").click(function (event) {
        //     console.log('this is loader')
        //     var id = $(this).attr('id');
        //     var button = $(event.relatedTarget) // Button that triggered the modal
        //         console.log($(this.dataset), this)
        //     var modal = $(this.dataset);
        //     console.log(modal, modal[0].video)
        //     $('.modal-title').html('On Channel ' + modal[0].channel);
        //     $("#video").attr("src",modal[0].video+"?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        // });
        $('#closed').click(function (){
            $("#video").attr("src","");    
        });
    }

    videoLoader = (e,thisele) => {
        var id = e.target.id;
        $('.modal-title').html('On Channel ' + $('#'+id).attr('data-channel'));
        $("#video").attr("src",$('#'+id).attr('data-video')+"?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    }
    // modalgenerate = (e) => {
    
        // $("#closed").click(function(){
        //     // $(".modal-content").html("");
        //     $("#video").attr("src","");
        //     //$('#iframe_before_load').removeClass('d-none');
        // });
    // } 
    render() {
        // console.log(this.props);
        // console.log(this.props.media);  
        return (
                <div className="row">
                    {
                                this.props.mediapr.map(item =>
                                    <div key={item.id}  className="col-lg-4 col-sm-6 mb-4">
                                        <div className="card shadow border-0 h-100">
                                            
                                        <img data-toggle="modal" id={`media_ad${item.id}`} onClick={(e) => this.videoLoader(e, this)} data-target="#exampleModalCenter" data-channel={item.channel} data-video={item.videofile} src={imgUrl+('/press/')+item.imagefile} alt={item.title} className="videoWrapper img-fluid card-img-top cursor img-class w-100" />
                                        <div className="card-body">
                                            <a className="text-dark cursor" data-toggle="modal" data-target="#exampleModalCenter" data-channel={item.channel} data-video={item.videofile}>{item.channel}</a>
                                            <h5 className="my-2">
                                                <a className="text-dark cursor" data-toggle="modal" data-target="#exampleModalCenter" data-channel={item.channel} data-video={item.videofile}>
                                                    {item.title}
                                                </a>
                                            </h5>
                                            <p className="text-gray-500 text-sm my-3"><i className="far fa-clock mr-2"></i>{item.date}</p>
                                            <p className="my-2 text-muted text-sm">{item.description}</p>
                                            
                                        </div>
                                    </div>
                                </div>
                                )
                            }
                            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered m-auto" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                                            <button id="closed" type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div id="iframe_wrapper" className="embed-responsive embed-responsive-16by9">
                                                <iframe className="embed-responsive-item onload" src="" id="video"  allowscriptaccess="always" allow="autoplay">
                                                    <img id="iframe_before_load" src={`${imgUrl}/images/iframe_loader.gif`}/>
                                                </iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
        );
    }
}

const mapStateToProps = (state) => {
    return  state.mediapr
}

export default connect(mapStateToProps,{getAllMediapr})(Mediapr);
// export default Mediapr;