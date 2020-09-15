import React, { Component } from "react";
import Breadcrumb from "../../common/breadcrumb";
import axios from "axios";
import { connect } from "react-redux";
import { apiUrl, sellerUrl, imgUrl } from "../../../constants/variable";

var sellerid, langDomain, domain_language_code, hostname;
var language = "English";
class ProductListingGuide extends Component {
  constructor() {
    super();
    this.state = {
      data: ""
    };
  }
  async componentWillMount() {
    var hostname = window.location.hostname;
    // if (hostname === undefined || hostname == '')
    // hostname = "german.beldara.com";
    langDomain = hostname.split("beldara.com")[0];
    langDomain = langDomain.replace(".", "");
    this.props.languageMaster.forEach(element => {
      if (element.main_language.toLowerCase() == langDomain.toLowerCase())
        domain_language_code = element.code;
    }, this);
    if (domain_language_code !== "" && domain_language_code !== undefined) {
      await axios
        .post(
          "https://api.beldara.com/common/static_page.php",
          {
            security_token: "",
            plateform_type: "",
            langCode: domain_language_code,
            pageid: "14"
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
          console.log(response);
          this.setState({
            data: response.data.result
          });
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    } else {
      await axios
        .post(
          "https://api.beldara.com/common/static_page.php",
          {
            security_token: "",
            plateform_type: "",
            langCode: "en",
            pageid: "14"
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(response => {
          console.log(response);
          this.setState({
            data: response.data.result
          });
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
  }
  render() {
    // const { title, head, content, desc1 } = this.state.data;
    return (
      <div>
        {/* <Breadcrumb
          title={"Product Listing Guidelines"}
          metaTitle={title ? title : ""}
          metaDesc={desc1 ? desc1 : ""}
        /> */}
        <Breadcrumb title={'Product Listing Guidelines'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title} />
        
        <section className="faq-section section-b-space">
          <div className="container">
            <div className="row">
              <div className="col-12  mb--sm">
                <div className="card">
                  <div className="card-header">
                    <h2>Product Listing Guidelines</h2>
                  </div>
                  <div className="input-layout1 card-body post-ad-page">
                    <h3 className="my-3">
                      1.{" "}
                      <a href={`${sellerUrl}/login.html`}>
                        {" "}
                        Login to your account first at seller.beldara.com
                      </a>
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/login1_beldara.JPG`}
                        alt="login"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      2. Add Products: Now select the add products from the
                      options given on your left.
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/Add_Product_beldara.JPG`}
                        alt="profile"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      3. Product Category : Here you will have to select the
                      category of your product, for that you can either check
                      the name of your product or select from the below
                      mentioned options for the category of your product.{" "}
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/Product_Category_beldara.JPG`}
                        alt="category"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      4. Product Title: Here you have to say about the name of
                      your product, size, color and materials etc. in just one
                      line. This gives you the advantage when a customer
                      searches your product with any size, color, material etc.
                      then there will be more chances to visible your products
                      frequently. For example – Mens T-shirt 24-36 Pink Cotton,
                      Wooden handmade jewelry box storage box
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/Produt_title_beldara.JPG`}
                        alt="product_title"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      5. Brand Name :- If you have a brand of your product, you
                      can mention like – Whopper Handicraft Here Whopper, is the
                      name of the brand.
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/Brand_Name_beldara.JPG`}
                        alt="brand_name"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      6. Delivery, Processing Days: - Here you will have to tell
                      how many days you will get the product to the buyer. You
                      can mention the days like 8, 10, 15 etc.
                    </h3>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/Delivery_processing_Days.JPG`}
                        alt="delivery_time"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      7.Free Sample : - sometimes, before ordering, customers
                      need a sample to check the quality of the product. If you
                      are able to provide the sample, click on the free sample
                      box. If not, leave blank.
                    </h3>

                    <h3 className="my-3">
                      8. Product Customization : -If you can modify the product
                      quality, size, brand name according to the needs of the
                      customer, then click on the given box. If not, leave
                      empty.
                    </h3>

                    <h3 className="my-3">
                      9. Customize logo :- If a customer wants to put your own
                      logo on your product, if you give this facility, then
                      click on the box. If not, leave it blank.
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/Free_sample_beldara.JPG`}
                        alt="Free_sample_beldara"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      10. Keywords – : - Here, you have to enter keywords
                      related to your Products. Keywords are very important to
                      get your product to more people online. Such as Handmade
                      storage box, Vintage box, jewelry box etc.
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/Keywords_beldara.JPG`}
                        alt="keyword"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      11. Currency – : - Here you can determine the currency of
                      the product. If you want to sell your product in India
                      then you can keep the Indian currency (₹) if you want to
                      sell outside India, then you can set it in $.
                    </h3>

                    <h3 className="my-3">
                      12. Unit – : Here you can determine the unit of your
                      product such as kilograms, pieces, liters etc.
                    </h3>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/currency_beldara.JPG`}
                        alt="currancy"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      13. Price Range - : Here you can set the min order on your
                      product to deliver, You need to set the value of your
                      single product.
                    </h3>

                    <div>Note: Mention only price/piece</div>
                    <div>
                      <img
                        src={`${imgUrl}/about_img/Product_price_beldara.JPG`}
                        alt="price_range"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      14. SKU / MSKU - : This is a type of product identifying
                      code that is often displayed as a Machine’s readable bar
                      code which helps to track items from the item list. If you
                      are using this kind of code for your product, then you can
                      also display here.
                    </h3>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/SKU_beldara.JPG`}
                        alt="msku"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      15. Modal Number - : If you have a model number of your
                      product, you can display it.
                    </h3>

                    <h3 className="my-3">
                      16. Manufacturer Name - : Here you can show the name of
                      the manufacturer of your product. If you are a Supplier,
                      Merchant, Importer, Exporter, Dealer, Distributor.
                    </h3>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/Model_number_beldara.JPG`}
                        alt="modal"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      17. Product Features - : It is a very important part of
                      attracting online customers, because the features of your
                      products are unknown to everyone, therefore, it is
                      necessary to display the features of your products here.
                    </h3>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/Product_features_beldara.JPG`}
                        alt="feature"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      18. Add Product specification - : It is also a very
                      important part to attract online customers. In this you
                      can display the product color, material, size, capacity,
                      etc. according to the product.
                    </h3>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/Product_specification_beldara.JPG`}
                        alt="specification"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <div>
                      <b>
                        {" "}
                        After completing all step click on Save & Continue
                        button.{" "}
                      </b>
                    </div>

                    <h3 className="my-3">
                      19. Product Description - : In this you can describe more
                      information about your product that has remained.
                    </h3>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/Product_description_beldara.JPG`}
                        alt="description"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <h3 className="my-3">
                      20. Product Images - : This is also a very important part
                      of attracting online customers. In this, you have to put
                      the best image of your product, for that, you can click
                      the image of the product in different angles because the
                      customers are more attracted to the good quality images.
                      You can Upload Main Image (Thumbnail) and all subimages
                      here.
                    </h3>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/Main_Image_beldara.JPG`}
                        alt="main_img"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>

                    <div>
                      <img
                        src={`${imgUrl}/about_img/mutliple_img.png`}
                        alt="multiple_img"
                        height="800px"
                        width="900px"
                        align="middle"
                      />
                    </div>
                    <div>
                      If you require any assistance we are here to help you.
                      Reach us at{" "}
                      <b>
                        <a href="/contact.html">
                          Support@beldara.com
                        </a>
                      </b>
                    </div>
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

const mapStateToProps = state => ({
  languageMaster: state.languageMaster.languageMaster
});

export default connect(mapStateToProps)(ProductListingGuide);

// export default PrivacyPolicy;
