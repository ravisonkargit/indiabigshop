import React, { Component } from "react";

import "./career.css";

class FaqSeller extends Component {
  render() {
    return (
      <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12  mb--sm">
        <div class="accordion" id="accordionExample">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h5 class="mb-0">
                <button
                  id="How_to_sell_my_product_if_Im_new_on_Beldara.com"
                  class="btn btn-link"
                  type="button"
                  data-toggle="collapse"
                  data-target="#One"
                  aria-expanded="true"
                  aria-controls="One"
                  onclick="submit(this)"
                >
                  What is Indiabigshop.com?
                </button>
              </h5>
            </div>

            <div
              id="One"
              class="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>
                  Indiabigshop.com is India’s most extensive and most helpful
                  hyper-local delivery company, which enables you to order
                  groceries, fruits & vegetables, and other products that you
                  need every day, directly via your mobile or web browser.
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingTwo">
              <h5 class="mb-0">
                <button
                  id="How_to_get_more_buyer_inquiries"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Two"
                  aria-expanded="false"
                  aria-controls="Two"
                  onclick="submit(this)"
                >
                  Q: What kind of products do you sell?
                </button>
              </h5>
            </div>
            <div
              id="Two"
              class="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                You can choose from over 100,000 products spread across various
                categories such as grocery, fruits & vegetables, and many more.
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingThree">
              <h5 class="mb-0">
                <button
                  id="How_to_advertise_my_product_on_Beldara.com"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Three"
                  aria-expanded="false"
                  aria-controls="Three"
                  onclick="submit(this)"
                >
                  Q:What cities and locations do you operate in?
                </button>
              </h5>
            </div>
            <div
              id="Three"
              class="collapse"
              aria-labelledby="headingThree"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>Indiabigshop.com currently operates in PAN India.</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingFour">
              <h5 class="mb-0">
                <input
                  type="hidden"
                  id="manageinqueiry"
                  value="Q: How to manage buyers’ inquiries on Beldara.com?"
                />
                <button
                  id="How_to_manage_buyers_inquiries_on_Beldara.com"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Four"
                  aria-expanded="false"
                  aria-controls="Four"
                  onClick={() => submit(this)}
                >
                  Q: What are the customer Care channels for Indiabigshop.com?
                </button>
              </h5>
            </div>
            <div
              id="Four"
              class="collapse"
              aria-labelledby="headingFour"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                Indiabigshop.com has In-app Chat support available with the
                Indiabigshop App & web Indiabigshop.com. Also, customers can
                write to us at support@Indiabigshop.com.
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingFive">
              <h5 class="mb-0">
                <input
                  type="hidden"
                  id="hotlead"
                  value="Q: What is a hot lead on Beldara.com?"
                />
                <button
                  id="What_is_a_hot_lead_on_Beldara.com"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Five"
                  aria-expanded="false"
                  aria-controls="Five"
                  onClick={() => submit(this)}
                >
                  Q: Do you charge any amount or taxes over and above the rates
                  shown?
                </button>
              </h5>
            </div>
            <div
              id="Five"
              class="collapse"
              aria-labelledby="headingFive"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>
                  No, we do not charge anything over and above the rates shown.
                  However, we do have a delivery fee in case the order value per
                  commodity does not reach the minimum order value for free
                  delivery.
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingSix">
              <h5 class="mb-0">
                <button
                  id="How_do_I_pay_with_Beldara.com"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Six"
                  aria-expanded="false"
                  aria-controls="Six"
                  onClick={() => submit(this)}
                >
                  Q: Can I track the status of my order?
                </button>
              </h5>
            </div>
            <div
              id="Six"
              class="collapse"
              aria-labelledby="headingSix"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>
                  Yes, you can track the status of your order under the My
                  Orders section.
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingSeven">
              <h5 class="mb-0">
                <button
                  id="What_are_PPRs_(Product_Performance_Reports)"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Seven"
                  aria-expanded="false"
                  aria-controls="Seven"
                  onClick={() => submit(this)}
                >
                  Q: How can I make changes to my order before and after
                  confirmation?
                </button>
              </h5>
            </div>
            <div
              id="Seven"
              class="collapse"
              aria-labelledby="headingSeven"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>
                  You can edit your products in the cart before checkout. If
                  you’ve already placed an order, you can cancel and reorder it,
                  with the required list, from the app.
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingNine">
              <h5 class="mb-0">
                <button
                  id="What_to_Do_If_I_Have_Received_an_Irrelevant_Lead"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Nine"
                  aria-expanded="false"
                  aria-controls="Nine"
                  onClick={() => submit(this)}
                >
                  Q:How can I be sure the fruits and vegetables I order are of
                  good quality?
                </button>
              </h5>
            </div>
            <div
              id="Nine"
              class="collapse"
              aria-labelledby="headingNine"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                Our fruits and vegetable vendors have a quality check process in
                place to ensure the quality of the items delivered is up to the
                mark. Do let us know within 4 days of order delivery if you’re
                not happy with the quality of the product received.
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingTen">
              <h5 class="mb-0">
                <button
                  id="What_Can_be_Done_If_a_Buyer_Hasn’t_Responded_to_the_Quotation_I_Sent"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Ten"
                  aria-expanded="false"
                  aria-controls="Ten"
                  onClick={() => submit(this)}
                >
                  Q: How will I know if any item in my order is unavailable?
                </button>
              </h5>
            </div>
            <div
              id="Ten"
              class="collapse"
              aria-labelledby="headingTen"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>
                  You will receive an SMS notification informing you about the
                  unavailable items in this post. Refund (if any) will also be
                  initiated in 24 hours.
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingEleven">
              <h5 class="mb-0">
                <button
                  id="I_Dont_Like_Getting_Retail_Enquiries_Why_Is_It_Happening"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Eleven"
                  aria-expanded="false"
                  aria-controls="Eleven"
                  onClick={() => submit(this)}
                >
                  Q: Is it safe to use my debit/credit card to shop on Indiabigshop.com?
                </button>
              </h5>
            </div>
            <div
              id="Eleven"
              class="collapse"
              aria-labelledby="headingEleven"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>
                  • Yes, it is. All transactions on Indiabigshop.com are completed via secure payment gateways. We do not store your card details at any given time.

                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingTweleve">
              <h5 class="mb-0">
                <button
                  id="I_Have_Not_Received_a_Quick_Response_from_the_Buyer_What_are_My_Options_Now"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Tweleve"
                  aria-expanded="false"
                  aria-controls="Tweleve"
                  onClick={() => submit(this)}
                >
                  Q: I’m trying to place an order today but it is getting scheduled for the next day. What can I do?

                </button>
              </h5>
            </div>
            <div
              id="Tweleve"
              class="collapse"
              aria-labelledby="headingTweleve"
              data-parent="#accordionExample"
            >
              <div class="card-body">
              Depending on store timings and store capacities, your order may be scheduled for a different day.

              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="Thirteen">
              <h5 class="mb-0">
                <button
                  id="What_is_the_Process_of_Creating_a_Quotation_for_a_Buyers_Benefit"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Thirteen"
                  aria-expanded="false"
                  aria-controls="Thirteen"
                  onClick={() => submit(this)}
                >
                  Q: Can I schedule an order at my convenience?

                </button>
              </h5>
            </div>
            <div
              id="Thirteen"
              class="collapse"
              aria-labelledby="headingThirteen"
              data-parent="#accordionExample"
            >
              <div class="card-body">
              Sure. At the checkout page, you can select a delivery slot of your preference.

              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" id="headingFourteen">
              <h5 class="mb-0">
                <button
                  id="Will_a_Buyer_Contact_Me_(The_Seller)_Once_I_Have_Sent_the_Quotation"
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Fourteen"
                  aria-expanded="false"
                  aria-controls="Fourteen"
                  onClick={() => submit(this)}
                >
                  Q: Will a Buyer Contact Me (The Seller) Once I Have Sent the
                  Quotation?
                </button>
              </h5>
            </div>
            <div
              id="Fourteen"
              class="collapse"
              aria-labelledby="headingSeven"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <p>
                  • As buyers receive notifications from multiple sellers via
                  multiple channels, the buyer might not contact you. It is
                  strongly recommended that you follow up with the buyer and
                  mention how you are better than other sellers to motivate the
                  buyer to close the deal.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FaqSeller;
