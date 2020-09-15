import React, { Component, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { withTranslate } from 'react-redux-multilingual'
import { imgUrl } from '../../../constants/variable'
import ReactImageFallback from "react-image-fallback";
// import PriceCalc from '../../collection/common/priceCalc';
const PriceCalc = lazy(() => import('../../collection/common/priceCalc'))

class ProductItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            cartModalopen: false,
            stock: 'InStock',
            quantity: 1,
            image: '',
            price: 0
        }
    }

    onClickHandle(img) {
        this.setState({ image: img });
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };
    onCloseModal = () => {
        this.setState({ open: false });
    };

    onOpenCartModal = () => {
        this.setState({ cartModalopen: true });
        this.props.onAddToCartClicked();
    };
    onCloseCartModal = () => {
        this.setState({ cartModalopen: false });
    };

    minusQty = () => {
        if (this.state.quantity > 1) {
            this.setState({ stock: 'InStock' })
            this.setState({ quantity: this.state.quantity - 1 })
        }
    }

    plusQty = () => {
        if (this.props.product.stock >= this.state.quantity) {
            this.setState({ quantity: this.state.quantity + 1 })
        } else {
            this.setState({ stock: 'Out of Stock !' })
        }
    }
    changeQty = (e) => {
        this.setState({ quantity: parseInt(e.target.value) })
    }

    finalCost = async (Cost, qty) => {
        
        var tprice = 0;
        tprice = Cost * qty;
        tprice = tprice.toFixed(2);
        await this.setState({
          price: tprice
        })
      
    }

    deadEnd = () => {
         
    }

    render() {
        const { product, symbol, onAddToCartClicked, onAddToWishlistClicked, onAddToCompareClicked, relatedItems, translate } = this.props;

        let RatingStars = []
        for (var i = 0; i < product.rating; i++) {
            RatingStars.push(<i className="fa fa-star" key={i}></i>)
        }
        return (
            <div>
                <div className="product-box">
                    <div className="img-wrapper">
                        <div className="lable-block">
                            {(product.new == true) ? <span className="lable3">new</span> : ''}
                            {(product.sale == true) ? <span className="lable4">on sale</span> : ''}
                        </div>
                        <div className="front">
                            <Link target="_blank" to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url).toLowerCase()}.html`} state={'searchProducts'}>
                            {/* <Link target="_blank" to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url)}.html`} state={'searchProducts'}> */}

                                <ReactImageFallback
                                    src={product.variants ?
                                        this.state.image ? this.state.image : product.variants[0].images
                                        : `${imgUrl}/product_images_thumb/` + product.img}
                                    // src={`${imgUrl+'/images/ajax-loader.gif'}`}
                                    fallbackImage={`${imgUrl + '/images/default.jpg'}`}
                                    // fallbackImage={`${imgUrl}/product_images_thumb/`+product.img}
                                    // initialImage={`${imgUrl}/product_images_thumb/`+product.img}
                                    initialImage={`${imgUrl + '/images/ajax-loader.gif'}`}
                                    alt={`${product.name} beldara.com`}
                                    className="img-fluid lazyload bg-img prd_img"

                                />
                                {/* <img src={`${
                                    product.variants?
                                        this.state.image?this.state.image:product.variants[0].images
                                        : product.img
                                    }`}
                                className="img-fluid lazyload bg-img prd_img"
                                alt={product.name} /> */}
                            </Link>
                        </div>
                        <div className="cart-info cart-wrap d-none">
                            <button title="Add to cart" onClick={() => this.onOpenCartModal()}>
                                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                            </button>
                            <a title="Add to Wishlist" onClick={onAddToWishlistClicked}>
                                <i className="fa fa-heart" aria-hidden="true"></i>
                            </a>
                            {/* <a href="javascript:void(0)" data-toggle="modal"
                               data-target="#quick-view"
                               title="Quick View"
                                onClick={this.onOpenModal}><i className="fa fa-search" aria-hidden="true"></i>
                            </a> */}
                            {/* <Link to={`${process.env.PUBLIC_URL}/compare`} title="Compare" onClick={onAddToCompareClicked}>
                                <i className="fa fa-refresh" aria-hidden="true"></i></Link> */}
                        </div>
                    </div>
                    <div className="product-detail">
                        <div>
                            <div className="rating">
                                {RatingStars}
                            </div>
                            {/* <Link to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url)}.html`} >
                                <h6 className="text-truncate text-capitalize">{product.name}</h6>
                            </Link> */}
                            <Link to={`${process.env.PUBLIC_URL}/product/${encodeURIComponent(product.url).toLowerCase()}.html`} >
                                <h6 className="text-truncate text-capitalize">{product.name}</h6>
                            </Link>
                            {/* <Link to={encodeURIComponent(`${process.env.PUBLIC_URL}/product/${product.url}.html`)} >
                                <h6 className="text-truncate text-capitalize">{product.name}</h6>
                            </Link> */}
                            {product.company ? <h6 className="text-truncate"><small><i className="fa fa-user"></i> {product.company}</small></h6> : ''}
                            <h4>
                                {/* {symbol}{product.price} */}
                                <Suspense fallback={''}>
                                { product.qty === undefined || product.qty === null || isNaN(product.qty) ?  '' : <div className="small">{translate('MOQ')} : {product.qty}</div> }
                                    <PriceCalc productCost={this.deadEnd} finalCost={this.finalCost} start_price={product.start_price} symbol={product.currency} end_price={product.end_price} />
                                </Suspense>
                                {/* {symbol}{product.price - (product.price * product.discount / 100)} */}
                                {/* <del><span className="money">{symbol}{product.price}</span></del> */}
                            </h4>
                        </div>
                    </div>



                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    symbol: state.data.symbol
})

export default withTranslate(connect(mapStateToProps)(ProductItem));