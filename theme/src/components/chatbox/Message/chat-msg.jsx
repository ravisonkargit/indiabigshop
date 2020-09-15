<div className="card chat-room small-chat wide msg-overlay-conversation-bubble " id="myForm">
    <div className="card-header white d-flex justify-content-between p-2 msg-overlay-conversation-header" onClick={this.msgOver} id="toggle" style={{ backgroundColor: '#0f75cc' }}>
        <div className="heading d-flex justify-content-start">
            <div className="profile-photo align-self-center">
                {/* <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="avatar" className="avatar rounded-circle mr-2 ml-0 cntImg align-self-center" /> */}
                <span className="state"></span>
            </div>
            <div className="data">
                <p className="name mb-0 text-white"><strong>{this.state.tomsg}</strong></p>
                {/* <p className="activity mb-0 text-white" style={{fontSize:'12px'}}>Active now</p> */}
            </div>
        </div>
        <div className="icons grey-text text-white">
            {/* <a className="feature text-white"><i className="fa fa-video mr-2 text-white bg-white"></i></a> */}
            {/* <a className="feature"><i className="fa fa-phone mr-2"></i></a> */}
            {/* <a className="feature"><i className="fa fa-cog mr-2"></i></a> */}
            <a id="closeMsgBtn" onClick={() => {
                $("#myForm").hide()
            }} className="scrollCnt"><i className="fa fa-times mr-2"></i></a>
        </div>
    </div>
    {/* <div className="messages"> */}
    <div className="my-custom-scrollbar scrollCnt" id="message">
        <div className="card-body p-3">
            <div className="media mb-1">
                <img className="d-flex rounded mr-2 cntImg align-self-center" src="https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg" alt="Generic placeholder image" onError={(e) => { e.target.onerror = null; e.target.src = "https://img.beldara.com/images/User_Avatarpng.png" }} />
                <div className="media-body">
                    <div className="my-0">{this.state.tomsg}</div>
                    <div className="mb-0 text-muted" style={{ fontSize: '12px' }}>Web Designer at MDBootstrap</div>
                </div>
            </div>
            <hr className="my-2" />
            {this.renderMessages()}

        </div>
    </div>
    <div className="card-footer text-muted white pt-1 pb-2 px-3 scrollCnt">
        <form className="" onSubmit={this.msgSubmit}>
            <input type="text" id="exampleForm2" className="form-control" placeholder="Type a message..." name="msg" />
            <div className="">
                <a><i className="fa fa-file-image mr-2"></i></a>
                <a><i className="fa fa-laugh mr-2"></i></a>
                <a><i className="fa fa-gamepad mr-2"></i></a>
                <a><i className="fa fa-paperclip mr-2"></i></a>
                <a><i className="fa fa-camera mr-2"></i></a>
                {/* <a><i className="fa fa-thumbs-up float-right"></i></a> */}
            </div>
            <div className="">
                <button className="float-right py-0 mt-1 btn text-white" style={{ backgroundColor: '#f5821e' }}><small>Send</small></button>
            </div>
        </form>
    </div>
    {/* </div> */}
</div>

