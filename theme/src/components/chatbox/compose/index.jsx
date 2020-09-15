import React, { Component } from 'react'
// import EmojiPicker from 'emoji-picker-react';
import $ from 'jquery';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart'
export default class Compose extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emojiShow: false
        }
    }
    UNSAFE_componentWillMount() {
        this.setState({ emojiShow: false })
    }

    addEmoji = (emoji) => {
        // console.log(emoji)
        // $("#m").val(emoji.native)
        $("#exampleForm2").val($("#exampleForm2").val() + emoji.native);
        // this.setState({
        //   value:$("#m").val()
        // })
        this.props.handleChange($("#exampleForm2").val())
        $("#exampleForm2").focus()
    }
    emojiShow = () => {
        this.setState({
            emojiShow: !this.state.emojiShow
        })
        $("#exampleForm2").focus()
    }
    render() {

        const myCallback = ''
        return (
            <React.Fragment>
                <div className="card-footer text-muted white pt-1 pb-2 px-3 scrollCnt mblFooterChat">
                    <div className="userType position-absolute text-primary" style={{ marginTop: '-24px' }} ></div>
                    <form className="" onSubmit={this.props.msgSubmit}>
                        <input type="text" id="exampleForm2" className="form-control" placeholder="Type a message..." autoComplete="off" value={this.props.value} onChange={(e)=>this.props.handleChange(e.target.value)} />
                        <div className="d-none">
                            <a><i className="fa fa-file-image mr-2"></i></a>
                            <a><i className="fa fa-laugh mr-2"></i></a>
                            <a><i className="fa fa-gamepad mr-2"></i></a>
                            <a><i className="fa fa-paperclip mr-2"></i></a>
                            <a><i className="fa fa-camera mr-2"></i></a>
                            {/* <a><i className="fa fa-thumbs-up float-right"></i></a> */}
                        </div>
                        <div className="">
                            {
                                this.state.emojiShow && <Picker onSelect={(emoji) => this.addEmoji(emoji)} set='emojione' style={{ position: 'absolute', bottom: '80px', boxShadow: '1px 0px 16px 4px #CCc', zIndex: 1 }} />
                            }
                            <span className="" style={{ cursor: 'pointer' }} onClick={this.emojiShow} >
                                <img src="https://img.beldara.com/images/emoji_smile.png" width="25px" className={`mt-1 ${this.state.emojiShow && 'isClicked' }`} />
                                <i className="fa fa-grin" style={{ color: '#f4811f', fontSize: '18px' }} ></i>
                            </span>
                            <i className="fa fa-smile py-0 mt-1 text-dark d-none" onClick={() => this.setState({ emojiShow: !this.state.emojiShow })}></i>
                            {/* <i className="fa fa-paperclip py-0 mt-1 btn text-dark"><input className="attachImg_worksn" onChange={this.props.imgSubmit} name="file_upload" type="file"/></i> */}
                            <button className="float-right py-0 mt-1 btn text-white" style={{ backgroundColor: '#f5821e' }} onClick={() => $("#exampleForm2").focus()}><small>Send</small></button>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

