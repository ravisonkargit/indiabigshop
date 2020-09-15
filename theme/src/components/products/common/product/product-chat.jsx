import React, { Component } from 'react'
import './product-chat.css'
import { imgUrl } from '../../../../constants/variable';
class ProductChat extends Component {
    render() {
        const {item} = this.props
        return (
            <React.Fragment>
                <div className="productChatWindow">
                    <div className="msgSticker my-1 p-2 rounded border border-1">
                            looking for this Product ?
                        <div className="msgQues text-right">
                        <a className="text-primary  m-1" href="#" onClick={(e)=>e.preventDefault()}>Yes</a>
                        <a className="text-secondary  m-1" href="#" onClick={(e)=>e.preventDefault()}>No</a>
                        </div>
                    </div>
                    <div className="msgSticker my-1 p-2 rounded border border-1">
                        We get you lot of supplier for this product
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default ProductChat