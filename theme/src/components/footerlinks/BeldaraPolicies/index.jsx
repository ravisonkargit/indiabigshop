import React, { Component } from "react";
import Breadcrumb from "../../common/breadcrumb";
import axios from "axios";
import { connect } from "react-redux";

var sellerid, langDomain, domain_language_code, hostname;
var language = "English";
class BeldaraPolicies extends Component {
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
            pageid: "32812",
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
            pageid: "32812",
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
    const { title, head, content, desc1, keyword } = this.state.data;
    return (
      <div>
        {this.props.location.pathname !== "/app-policies.html" ? (
          <Breadcrumb
            title={"Privacy Policies"}
            metaTitle={title}
            metaDesc={desc1}
            metaKeyword={keyword}
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
                    <h2>{head}</h2>
                  </div>
                  <div className="container">
                      <p>
                        “Indiabigshop.com” is a trademark of PMK E-commerce Pvt
                        Ltd.<br></br>
                        <br></br> (“Company”), a company incorporated under the
                        Companies Act, with its registered and corporate office
                        at Mumbai 400072, in the course of its business.
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>The domain name Indiabigshop.com is owned by
                        the Company.<br></br>
                        <br></br>
                        The Company respects your privacy and values the trust
                        you place in it. <br></br>
                        <br></br>Set out below is the Company’s ‘Privacy Policy
                        which details how information relating to you is
                        collected, used, and disclosed.<br></br>
                        <br></br>
                        Customers are advised to read and understand our Privacy
                        Policy carefully, as by accessing the website/app you
                        agree to be bound by the terms and conditions of the
                        Privacy Policy and consent to the collection, storage,
                        and use of information relating to you as provided
                        herein.<br></br>
                        <br></br>
                        If you do not agree with the terms and conditions of our
                        Privacy Policy, including the manner of collection or
                        use of your information, please do not use or access the
                        website/app.<br></br>
                        <br></br>
                        Our Privacy Policy is incorporated into the Terms and
                        Conditions of Use of the website/app and is subject to
                        change from time to time without notice.<br></br>
                        <br></br> It is strongly recommended that you
                        periodically review our Privacy Policy as posted on the
                        App/Web.<br></br>
                        <br></br>
                        Should you have any clarifications regarding this
                        Privacy Policy, please do not hesitate to contact us at
                        support@Indiabigshop.com.
                      </p>
                      <h4>
                        The collection, Storage and Use of Information Related
                        to You
                      </h4>
                      <p>
                        The collection, Storage and Use of Information Related
                        to You We may automatically track certain information
                        about you based upon your behavior on the website.
                        <br></br>
                        <br></br> We use this information to do internal
                        research on our users’ demographics, interests, and
                        behavior to better understand, protect and serve our
                        users.<br></br>
                        <br></br> This information is compiled and analyzed on
                        an aggregated basis.<br></br> <br></br>This information
                        may include the URL that you just came from (whether
                        this URL is on the website or not), which URL you next
                        go to (whether this URL is on the website or not), your
                        computer browser information, your IP address, and other
                        information associated with your interaction with the
                        website.<br></br>
                        <br></br> We may also share your Mobile IP/Device IP
                        with a third party(ies) and to the best of our
                        knowledge, be-life, and representations given to us by
                        these third party(ies) this information is not stored by
                        them.<br></br>
                        <br></br>
                        We also collect and store personal information provided
                        by you from time to time on the website/app. <br></br>
                        <br></br>We only collect and use such information from
                        you that we consider necessary for achieving a seamless,
                        efficient, and safe experience, customized to your needs
                        <br></br>
                        <br></br> including: To enable the provision of services
                        opted for by you; To communicate necessary account and
                        product/service related information from time to time;
                        To allow you to receive quality customer care services;
                        To undertake necessary fraud and money laundering
                        prevention checks, and comply with the highest security
                        standards; To comply with applicable laws, rules, and
                        regulations; and To provide you with information and
                        offers on products and services, on updates, on
                        promotions, on related, affiliated, or associated
                        service providers and partners, that we believe would be
                        of interest to you.<br></br>
                        <br></br>
                      </p>
                      <br></br>
                      <p>
                        Where any service requested by you involves a third
                        party, such information as is reasonably necessary by
                        the Company to carry out your service request may be
                        shared with such third party.<br></br>
                        <br></br>
                        We also do use your contact information to send you
                        offers based on your interests and prior activity.
                        <br></br>
                        <br></br>The Company may also use contact information
                        internally to direct its efforts for product
                        improvement, to contact you as a survey respondent, to
                        notify you if you win any contest; and to send you
                        promotional materials from its contest sponsors or
                        advertisers.<br></br>
                        <br></br>
                        <br></br>
                        <br></br>Contacts Permissions: If you allow
                        Indiabigshop.com to access your contacts (including
                        contact number, email id, etc.), it enables
                        Indiabigshop.com to subscribe you and your contacts to
                        Indiabigshop.com promotional emails, messages, ongoing
                        offers, etc., and through this permission, you and your
                        contacts will be able to access a variety of social
                        features such as inviting your friends to try our app,
                        send across referral links to your friends, etc. We may
                        also use this information to make recommendations for
                        the grocery items you placed.<br></br>
                        <br></br> This information will be synced from your
                        phone and stored on our servers.<br></br>
                        <br></br>
                        Further, you may from time to time choose to provide
                        payment-related financial information (credit card,
                        debit card, bank account details, billing address, etc.)
                        on the website. We are committed to keeping all such
                        sensitive data/information safe at all times and ensure
                        that such data/information is only transacted over a
                        secure website [of approved payment gateways which are
                        digitally encrypted], and provide the highest possible
                        degree of care available under the technology presently
                        in use.<br></br>
                        <br></br>
                        The Company will not use your financial information for
                        any purpose other than to complete a transaction with
                        you.<br></br>
                        <br></br>
                        To the extent possible, we provide you the option of not
                        divulging any specific information that you wish for us
                        not to collect, store or use.<br></br>
                        <br></br> You may also choose not to use a particular
                        service or feature on the website/application, and
                        opt-out of any non-essential communications from the
                        Company.<br></br>
                        <br></br>
                        Further, transacting over the internet has inherent
                        risks which can only be avoided by you following
                        security practices yourself, such as not revealing
                        account/login-related information to any other person
                        and informing our customer care team about any
                        suspicious activity or where your account has/may have
                        been compromised.<br></br>
                        <br></br>
                        The company uses data collection devices such as
                        “cookies” on certain pages of the website to help
                        analyze our web page flow, measure promotional
                        effectiveness, and promote trust and safety.<br></br>
                        <br></br> “Cookies” are small files placed on your hard
                        drive that assist us in providing our services.<br></br>
                        <br></br> The company offers certain features that are
                        only available through the use of a “cookie”.<br></br>
                        <br></br>
                        The Company also uses cookies to allow you to enter your
                        password less frequently during a session.<br></br>
                        <br></br> Cookies can also help the Company provide
                        information that is targeted to your interests.<br></br>
                        <br></br> Most cookies are “session cookies,” meaning
                        that they are automatically deleted from your hard drive
                        at the end of a session.<br></br>
                        <br></br> You are always free to decline our cookies if
                        your browser permits, although in that case, you may not
                        be able to use certain features on the website and you
                        may be required to re-enter your password more
                        frequently during a session.<br></br>
                        <br></br>
                        Additionally, you may encounter “cookies” or other
                        similar devices on certain pages of the website that are
                        placed by third parties.<br></br>
                        <br></br> The Company does not control the use of
                        cookies by third parties.<br></br>
                        <br></br>
                        If you send the Company personal correspondence, such as
                        emails or letters, or if other users or third parties
                        send us correspondence about your activities on the
                        website, the Company may collect such information into a
                        file specific to you.<br></br>
                        <br></br>
                        The Company does not retain any information collected
                        for any longer than is reasonably considered necessary
                        by us, or such period as may be required by applicable
                        laws.<br></br>
                        <br></br> The Company may be required to disclose any
                        information that is lawfully sought from it by a
                        judicial or other competent body under applicable laws.
                        <br></br>
                        <br></br>
                        The website may contain links to other websites.
                        <br></br>
                        <br></br> We are not responsible for the privacy
                        practices of such websites which we do not manage and
                        control.<br></br>
                        <br></br>
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

export default connect(mapStateToProps)(BeldaraPolicies);

// export default PrivacyPolicy;
