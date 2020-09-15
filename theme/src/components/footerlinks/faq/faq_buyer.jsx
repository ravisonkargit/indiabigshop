
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from "../../common/breadcrumb";
import $ from 'jquery';

class FaqBuyer extends Component {
    render() {
        
        return (
            <div>
                <Breadcrumb title={'FAQ'}/>
            
                    <section className="faq-section section-b-space">
                    <div className="container">
                        <div className="row">
                        <div className="col-12 mb-5">
                            <Link className="btn btn-outline-primary" to="/faq.html">Seller FAQ</Link>
                            <Link className="btn btn-primary" to="/faq_buyer.html">Buyer FAQ</Link>
                        </div>
                            <div className="col-sm-12">
                                <div className="accordion theme-accordion" id="accordionFaq">
                                    <div className="card">
                                        <div className="card-header" id="headingOne">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link" type="button" data-toggle="collapse"
                                                        data-target="#One" aria-expanded="true"
                                                        aria-controls="One">
                                                    Q: How to find a product to buy?
                                                </button>
                                            </h5>
                                        </div>

                                        <div id="One" className="collapse show" aria-labelledby="headingOne"
                                             data-parent="#accordionFaq">
                                            <div className="card-body">
                                            <p>If you are looking for a product, you can simply type its name in the search engine of Beldara.com and choose the relevant products from the list that appears. To make things easier, you should filter the results on the basis of price, type, etc. If you want to try another option, you can also post an RFQ that allows you to get quotes from the suppliers and select the one you find suitable.</p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingTwo">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" type="button"
                                                        data-toggle="collapse" data-target="#Two"
                                                        aria-expanded="false" aria-controls="Two">
                                                    Q: How do I connect with suppliers on Beldara.com?
                                                </button>
                                            </h5>
                                        </div>
                                        <div id="Two" className="collapse" aria-labelledby="headingTwo"
                                             data-parent="#accordionFaq">
                                            <div className="card-body">
                                            <p>You can connect with a supplier by clicking on the chat now button that’s available on the search listings page. You can also click on the contact supplier button and send an inquiry. You can also contact the supplier via the product detail page. If you have bought products from the seller earlier, you can also connect to supplier via the My Favorites Page or the Order Detail Page. </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingThree">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" type="button"
                                                        data-toggle="collapse" data-target="#Three"
                                                        aria-expanded="false" aria-controls="Three">
                                                    Q: How to buy directly from Beldara.com?
                                                </button>
                                            </h5>
                                        </div>
                                        <div id="Three" className="collapse" aria-labelledby="headingThree"
                                             data-parent="#accordionFaq">
                                            <div className="card-body">
                                                <p>Buying directly from Beldara.com is very easy. You just need to place an order and avail our payment protection. When you do that, we will hold the payment you made to the supplier until you receive the product and approve of its quality and quantity. Only when you assure us that you are happy with the purchase, we will release the payment to the supplier. This method is highly appreciated by first-time buyers at Beldara.com because it ensures them their money won’t be wasted if they receive a bad product or a seller tries to cheat them in any manner.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingFour">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" type="button"
                                                        data-toggle="collapse" data-target="#Four"
                                                        aria-expanded="false" aria-controls="Four">
                                                    Q: What are the order payment methods at Beldara.com?
                                                </button>
                                            </h5>
                                        </div>
                                        <div id="Four" className="collapse" aria-labelledby="headingFour"
                                             data-parent="#accordionFaq">
                                            <div className="card-body">
                                                <p>There are many payment options available at Beldara.com. They are a card, net banking, BDP wallet, and UPI. We want to be a part of the Digital India revolution and hence, have made online payments easy for all the buyers. Call us if you face any problems in getting the payment processed, or you have a doubt regarding payment security. Beldara.com makes sure that your payment transactions are highly secured and protected by using state of the art online security tools and upgrading them from time to time.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingFive">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" type="button"
                                                        data-toggle="collapse" data-target="#Five"
                                                        aria-expanded="false" aria-controls="Five">
                                                    Q: How should I deal with complaints and issues regarding Beldara.com?
                                                </button>
                                            </h5>
                                        </div>
                                        <div id="Five" className="collapse" aria-labelledby="headingFive"
                                             data-parent="#accordionFaq">
                                            <div className="card-body">
                                                <p>We are sorry that you have a complaint or you are facing a problem regarding Beldara.com. You can let us know about it by accessing our complaint form or contacting us via email or phone support. In case you contacted a seller, who has stopped responding for some reason (maybe the seller has stopped selling the product you seek or hasn’t checked the Beldara.com account for some time), we will help you by providing a list of equally competent sellers who will be able to meet your requirements.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingSix">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" type="button"
                                                        data-toggle="collapse" data-target="#Six"
                                                        aria-expanded="false" aria-controls="Six">
                                                    Q: How can I get the assurance of good quality from Beldara.com?
                                                </button>
                                            </h5>
                                        </div>
                                        <div id="Six" className="collapse" aria-labelledby="headingSix"
                                             data-parent="#accordionFaq">
                                            <div className="card-body">
                                                <p>Beldara.com is a reputed and global b2b marketplace that allows you to connect with multiple suppliers and filter them according to your criterion or judgment. We strive to ensure that every seller on Beldara.com is legit and verified, but we also request you to do some due diligence before making a decision. If you find any seller is fake or is not meeting the expected standards, you can report him or her and Beldara.com will initiate appropriate action. We also make payments secure for buyers via Beldara Pay and urge you to use it if you want to keep the transactions secure. </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

</div>
        )};
}

export default FaqBuyer;