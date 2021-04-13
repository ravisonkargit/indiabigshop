import React, { Component } from "react";
import Breadcrumb from "../../common/breadcrumb";
import axios from "axios";
import { connect } from "react-redux";

var langDomain, domain_language_code;
class ReturnPolicy extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
    };
  }

  async componentWillMount() {
    var hostname = window.location.hostname;
    langDomain = hostname.split("beldara.com")[0];
    langDomain = langDomain.replace(".", "");
    this.props.languageMaster.forEach((element) => {
      if (element.main_language.toLowerCase() == langDomain.toLowerCase())
        domain_language_code = element.code;
    }, this);
    if (domain_language_code !== "" && domain_language_code !== undefined) {
      await axios
        .post(
          "https://api.indiabigshop.com/common/static_page.php",
          {
            security_token: "",
            plateform_type: "",
            langCode: domain_language_code,
            pageid: "5",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          this.setState({
            data: response.data.result,
          });
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    } else {
      await axios
        .post(
          "https://api.indiabigshop.com/common/static_page.php",
          {
            security_token: "",
            plateform_type: "",
            langCode: "en",
            pageid: "5",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          this.setState({
            data: response.data.result,
          });
        })
        .catch((error) => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
  }

  render() {
    return (
      <div>
        {this.props.location.pathname == "/return-policy.html" ? (
          <Breadcrumb
            title={"Return Policy"}
            metaDesc={this.state.data.desc1}
            metaKeyword={this.state.data.keyword}
            metaTitle={this.state.data.title}
          />
        ) : (
          ""
        )}
        <section className="faq-section section-b-space">
          <div className="container">
            <div className="row">
              <div className="col-12  mb--sm">
                <div className="card">
                  <div className="card-header">
                    <h2>Return Policy</h2>
                  </div>
                  <div className="input-layout1 card-body post-ad-page">
                    <p>
                      Beldara is an intermediary platform and will only be
                      responsible to mediate the return request raised by buyers
                      with the Seller. The resolution of issues or concerns
                      raised by the buyer in return request shall be the sole
                      responsibility of the Seller. Beldara shall not assume any
                      liability for any failure on the part of the Seller to
                      resolve buyer issues.
                    </p>
                    <b>General return policy:</b>
                    <br></br>
                    <br></br>
                    <p>
                      1. For timely booking of return of defective products, the
                      order should be open at the time of delivery.
                    </p>
                    <p>
                      2. Return the faulty products within 10 days of the date
                      of delivery (varies detailed below).
                    </p>
                    <p>
                      3. The return pickup time will be within 72 hours of a
                      return booking.
                    </p>
                    <p>
                      4. The return of the amount will proceed from the time of
                      pickup i.e 48 hrs.
                    </p>
                    <p>
                      5. Upload a clear picture of defective products that are
                      needed to be returned.
                    </p>
                    <p>6. Return the product in the exact way as received.</p>
                    <p>
                      7. Paid transportation charge of the product will be
                      included in the refund amount.
                    </p>
                    <p>
                      8. Upload a clear picture of the bank details/passbook to
                      get a refund.
                    </p>
                    <p>
                      The return can be done when there is the wrong color,
                      Product not matching the description or specifications
                      mentioned on the listing page on the Platform, Warranty
                      issues with respect to the Product, items are found to be
                      missing (not due to logistics reasons), Issues related to
                      the quality of the product, defective Product, size set,
                      or packaging issues or if the product is damaged.
                    </p>
                    <p>
                      The responsibility of the logistics partner to settle any
                      of the below-mentioned concerns raised by the buyer.
                      Contact the logistics service provider for resolving the
                      below issues. It is hereby clarified that Beldara shall
                      not assume any responsibility for the below points:
                    </p>
                    <p>
                      <b>
                        Any return request/ issues raised by the buyer for any
                        of the following reasons:
                      </b>
                    </p>
                    <p>
                      {" "}
                      a. Missing products/Goods or some items from the entire
                      order placed found to be missing due to reasons
                      attributable to the logistics provider;
                    </p>
                    <p>
                      {" "}
                      b. Damage to the outer box delivered or Product/good
                      damaged in transit; or
                    </p>
                    <p> c. Any other logistics-related issues;</p>
                    <p>
                      <b>
                        Depending on the category of Product timelines
                        prescribed below, raise a return request accordingly:
                      </b>
                    </p>
                    <p>
                      <b>a. Clothing : 7 days </b>from the date of delivery of
                      shipment
                    </p>
                    <p>
                      <b>b. Fresh Products : 1 day </b>from the date of delivery
                      of shipment
                    </p>
                    <p>
                      <b>c. Home and Kitchen : 7 days </b>from the date of
                      delivery of shipment
                    </p>
                    <p>
                      <b>d. Food-FMCG : 3 days </b>from the date of delivery of
                      shipment
                    </p>
                    <p>
                      <b>e. IT : 2 days </b>from the date of delivery of
                      shipment
                    </p>
                    <p>
                      <b>f. Pharmaceutical : 7 days </b>from the date of
                      delivery of shipment
                    </p>
                    <p>
                      <b>g. Phones : 2 days </b>from the date of delivery of
                      shipment
                    </p>
                    <p>
                      <b>h. VAS : 2 days </b>from the date of delivery of
                      shipment
                    </p>
                    <p>
                      <b>i. Accessories and Consumer Electronics : 2 days </b>
                      from the date of delivery of shipment
                    </p>
                    <p>
                      <b>j. Footwear : 7 days </b>from the date of delivery of
                      shipment
                    </p>
                    <p>
                      <b>k. Toys and Baby care : 7 days </b>from the date of
                      delivery of shipment
                    </p>
                    <p>
                      <b>l. Stationary and Office Supply : 7 days </b>from the
                      date of delivery of shipment
                    </p>
                    <p>
                      The return request may get rejected and the same will be
                      communicated to the buyer. Due to the following reasons:
                      (a) The buyer does not respond to the inquiry calls and/or
                      calls made by us to procure missing documentation and
                      information, or (b) supportive documents are insufficient,
                      or Buyer is unable to provide sufficient proof in support
                      of the claim, Buyer may raise a new return request within
                      three (3) days from the date of such rejection.
                    </p>
                    <p>
                      If your return request is approved, it shall be the buyer
                      sole responsibility to return the Product directly to the
                      Seller. In all cases of Seller approved returns, a refund
                      will be initiated to the buyer. On all Seller approved
                      returns, Beldara undertakes no guarantee as regards return
                      of monies or timeline for such return.
                    </p>
                    <p>
                      At the time of raising a dispute, Seller will be required
                      to provide documents/ proof in support of the claim, which
                      includes without limitation, images of the returned
                      product(s)/ goods indicating the issue in the shipment
                      received. The images need to clearly capture the
                      following:
                    </p>
                    <p>1. the Return ID;</p>
                    <p>2. AWB number of the shipment;</p>
                    <p>3. issue observed by Seller in the returned product;</p>
                    <p>
                      4. brand name/ manufacturer’s name of the returned
                      product; and/or
                    </p>
                    <p>
                      5. the IMEI number (in case the product is a mobile
                      phone).
                    </p>
                    <p>
                      The Seller’s claim/ dispute will either be approved or
                      rejected and the same will be communicated to the Seller.
                    </p>
                    <p>
                      Members (who use the platform) agree to be bound to any
                      changes or modifications made to this Policy as may be
                      updated on the Platform, from time to time or any
                      additional terms that may be communicated to you, from
                      time to time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  languageMaster: state.languageMaster.languageMaster,
});

export default connect(mapStateToProps)(ReturnPolicy);
