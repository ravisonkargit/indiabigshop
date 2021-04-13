import React, { Component } from "react";

import Breadcrumb from "../../common/breadcrumb";
import { getAllLangContent } from "../../../actions";
import { connect } from "react-redux";

import "./about.css";
import axios from "axios";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
    };
  }
  tabChange(e) {
    var src = document.getElementById("myVideo").getAttribute("src");
    var allow = document.getElementById("myVideo").getAttribute("allow");
    allow = allow.replace(" autoplay;", "");
    src = src.replace("&autoplay=1", "");
    document.getElementById("myVideo").setAttribute("allow", allow);
    document.getElementById("myVideo").removeAttribute("autoplay");
    document.getElementById("myVideo").setAttribute("src", src);

    let id = e.target.id;
    let classtab = document.getElementsByClassName("nav-link-custom");
    for (let j = 0; j < classtab.length; j++) {
      classtab[j].classList.remove("active");
    }
    document.getElementById(id).classList.add("active");

    let tab_control = document.getElementById(id).getAttribute("aria-controls");

    let classarray = document.getElementsByClassName("all_pills");
    for (let i = 0; i < classarray.length; i++) {
      classarray[i].classList.remove("d-none");
      classarray[i].classList.add("d-none");
    }
    document.getElementById(tab_control).classList.remove("d-none");
  }

  async componentWillMount() {
    this.props.getAllLangContent("about", "en");
    var hostname = window.location.hostname;
    // if (hostname === undefined || hostname == '')
    // hostname = "german.beldara.com";
    let domain_language_code;
    let langDomain = hostname.split("beldara.com")[0];
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
            pageid: "1",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          console.log(response);
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
            pageid: "1",
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          console.log(response);
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
        <Breadcrumb
          title={"About US"}
          metaDesc={this.state.data.desc1}
          metaKeyword={this.state.data.keyword}
        />
        <div className="container mt-5">
          Indiabigshop.com is built around the idea that all Indians should be
          able to locate high-quality products at affordable prices and be
          entitled to upgrade their lives. As part of this mission, we want it
          to be simple for our consumers to make healthier and better choices in
          buying everyday products, and we do it by creating an assortment of
          high-quality grocery products accessible, affordable, and available at
          their doorsteps, on their favored schedules.
          <br></br>
          <div> Indiabigshop.com, as a
          platform, brings together the consumers looking for everyday
          essentials, partners that are serving their needs efficiently, and
          manufacturers looking for a conduit to the consumers. All of this
          prophecy happens through our exclusive technology stack. We know it’s
          a bold goal, and are certain that we will meet this challenge.</div>
        </div>
        <br></br>
        <div className="container">
          Indiabigshop.com, as a platform, brings together the consumers looking
          for everyday essentials, partners that are serving their needs
          efficiently, and manufacturers looking for a conduit to the consumers.
          All of this prophecy happens through our exclusive technology stack.
        </div>
        <br></br>
        <div className="container mb-5">
          We know it’s a bold goal, and are certain that we will meet this
          challenge
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  languageMaster: state.languageMaster.languageMaster,
});
export default connect(mapStateToProps, { getAllLangContent })(About);
//export default About;
