import $ from "jquery";
import { ApiUrl, CentralUrl, ImgUrl } from "../constants/ActionTypes";
import axios from "axios";
import { getLoggedIn } from "../actions";
import store from "../store";
import ls from "local-storage";

export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// check if email valid
export function isEmail(email) {
  const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

export function showToast(data, type) {
  $("#toast_message")
    .removeClass("hide")
    .addClass("show");
  if (type == "1")
    $(".toast-body")
      .removeClass("bg-success bg-danger")
      .addClass("bg-success")
      .html(
        '<span class="text-light"><i class="fa fa-check text-light"></i> ' +
          data +
          "</span>"
      );
  else
    $(".toast-body")
      .removeClass("bg-success bg-danger")
      .addClass("bg-danger")
      .html(
        '<span class="text-light"><i class="fa fa-times text-light"></i> ' +
          data +
          "</span>"
      );

  var clearint = setInterval(function() {
    $("#toast_message")
      .removeClass("show")
      .addClass("hide");
    clearInterval(clearint);
  }, 3000);
}

// s
export function isNumberKey(e) {
  // console.log(e);console.log(e);
  var charCode = e.which ? e.which : e.keyCode;
  // console.log(charCode);
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;

  return true;
}
export function getFileName(url) {
  var index = url.lastIndexOf("/") + 1;
  var filenameWithExtension = url.substr(index);
  var filename = filenameWithExtension.split(".")[0];
  filename = filename.replace(/(#|\?).*?$/, "");
  return filename;
}
//subscribe
export async function subscribe(email, sellerid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/subscribe.php`,
        { security_token: "", sellerid: sellerid, email: email },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

//Membership
export async function checkPremium(sellerid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/get_seller_package.php`,
        { security_token: "", sellerid: sellerid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

// send otp
export async function send_otp(email, mobile, sellerid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/otp_verify.php`,
        {
          email: email,
          mobile: mobile,
          plateform_type: "",
          sellerid: sellerid,
          type: "signupModal",
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data.result;
      })
      .catch((error) => {
        const result = error.response;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

// get all language master
export async function getlanguage() {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/get_language_master.php`,
        { security_token: "", plateform_type: "" },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data.result;
      })
      .catch((error) => {
        const result = error.response;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export function imageExists(image_url) {
  var http = new XMLHttpRequest();

  http.open("HEAD", image_url, true);
  http.send();

  return http.status != 404;
}

export async function getAllPackage() {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/get_all_package.php`,
        { security_token: "", sellerid: ls.get("log_id") },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        var data = {
          result: response.data.message,
          data: response.data.result,
        };
        return data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}
export async function getShippingAddress(sellerid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/getDefaultShipping.php`,
        { sellerid: sellerid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}
export async function captureEvent(
  page,
  event,
  value,
  ctrl,
  sellerid,
  visitorid
) {
  try {
    axios
      .post(
        "https://api.beldara.com/common/capture_event.php",
        {
          security_token: "",
          plateform_type: "",
          page: page,
          event: event,
          value: value,
          ctrl: ctrl,
          sellerid: sellerid,
          visitorid: visitorid,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function setCookie(cname, cvalue, exdays) {
  console.log('function called',255,cname, cvalue, exdays);
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "; expires=" + d.toUTCString();
  if (window.location.hostname === "localhost"){
    document.cookie = cname + "=" + (cvalue || "")  + expires + ";path=/;";
  }
  else{
    document.cookie = cname + "=" + (cvalue || "")  + expires + ";SameSite=None;domain=.beldara.com;path=/;Secure";
  }
  }

export async function footer_loginModal(allstate, e) {
  $("#errOtpSignUp")
    .css({ display: "none" })
    .text("");
  e.preventDefault();

  var brid = allstate.brid;
  var page_url = window.location.pathname;

  var email = $("#loginEmail").val();
  var pass = $("#loginPass").val();
  // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
  // if(/^[\s\S]{6,}$/.test(pass)) {
  //
  if (email != "" && pass != "") {
    if (
      page_url == "/buy-leads.html" ||
      page_url == "/buy_guaranteed_lead.html"
    ) {
      var lead_amount_inr = $("#lead_amount_inr").val();
      var lead_amount_usd = $("#lead_amount_usd").val();
      try {
        return await axios
          .post(
            `${ApiUrl}/common/logInSignUp.php`,
            { email: email, pass: pass, type: "loginModal_lead",visiterid:getCookie('mhinpbnb') },
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then(async (response) => {
            if (response.data.statusId == "1") {
              var sellerid = response.data.result.sellerid;

              // set cookie for 1 yr
              await setCookie("mhinpbn", sellerid, "365");
              //
              await store.dispatch(getLoggedIn());

              $("#sellerid").val(sellerid);
              $("#buyerid").val(sellerid);

              var data = {
                modalChange: true,
                modal: false,
                paymentModal: true,
                reload: false,
                success: true,
                data: response.data,
              };
              return data;
            } else {
              $("#errFooterLogIn")
                .removeClass("d-none")
                .text("Please try Again");
              var data = {
                modalChange: false,
                modal: true,
                paymentModal: false,
                reload: false,
                success: false,
                data: response.data,
              };

              return data;
            }
          })
          .catch((error) => {
            const result = error;
          });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }
    } else {
      try {
        return await axios
          .post(
            `${ApiUrl}/common/logInSignUp.php`,
            { email: email, pass: pass, type: "loginModal",visiterid:getCookie('mhinpbnb') },
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then(async (result) => {
            if (!isNaN(result.data.result.sellerid)) {
              // set cookie for 1 yr
              var sellerid = result.data.result.sellerid;
              await setCookie("mhinpbn", sellerid, "365");
              //
              await store.dispatch(getLoggedIn());

              if (page_url == "/support-ticket.html") {
                var data = {
                  modalChange: true,
                  modal: false,
                  paymentModal: false,
                  reload: false,
                  success: true,
                  data: result.data.result,
                };
              } else {
                var data = {
                  modalChange: true,
                  modal: false,
                  paymentModal: false,
                  reload: false,
                  success: true,
                  data: result.data.result,
                };
              }

              return data;
            } else {
              $("#errFooterLogIn")
                .removeClass("d-none")
                .text(result.data.message);
              var data = {
                modalChange: false,
                modal: true,
                paymentModal: false,
                reload: false,
                success: false,
                data: result.data.result,
              };
              return data;
            }
          })
          .catch((error) => {
            const result = error;
          });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }
    }
  }
  // }
  // else {
  //     $("#errFooterLogIn").removeClass('d-none').text('Password should be min 6 characters');
  //     var data = {'modalChange': false, 'modal': false, 'paymentModal': false, 'reload': false, 'success': false, 'data': ''}
  //     return data;
  // }
  // }
  // else {
  //     $("#errFooterLogIn").removeClass('d-none').text('Email is invalid');
  //     var data = {'modalChange': false, 'modal': false, 'paymentModal': false, 'reload': false, 'success': false, 'data': ''}
  //     return data;

  // }
}
export async function footer_signupModal(
  number,
  isoValue,
  dialCode,
  countryName,
  productid,
  e
) {
  e.preventDefault();
  $("#submit_success_spinner").removeClass("d-none");
  $("#submit_button").attr("disabled", true);
  $("#errOtpSignUp")
    .css({ display: "none" })
    .text("");
  var email = $("#universalEmail").val();
  var mobile = number;
  var userType = $("input[name=UserType]:checked").val();
  var manufacturer = $("#ManufacturerType").prop("checked") ? 1 : 0;
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    if (email != "" && mobile != "") {
      //$("#mobilenumber").intlTelInput("getSelectedCountryData").iso2.toUpperCase()
      //$("#mobilenumber").intlTelInput("getSelectedCountryData").dialCode
      try {
        return await axios
          .post(
            `${ApiUrl}/common/otp_verify.php`,
            {
              email: email,
              mobile: mobile,
              countryCode: isoValue,
              countryid: dialCode,
              countryName: countryName,
              userType: userType,
              manufacturer: manufacturer,
              productid: productid,
              type: "signupModal",
            },
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then(async (result) => {
            if (result.data.statusId == "1" || result.data.statusId == 1) {
              // set cookie for 1 yr
              //await setCookie('mhinpbn', result.data.result.sellerid, '365');
              await setCookie(
                "selleridForOTP",
                result.data.result.sellerid,
                "365"
              );
              //
              if (
                getCookie("refid") != "null" &&
                getCookie("refid") !== null &&
                getCookie("refid") != ""
              ) {
                axios
                  .post(
                    `${ImgUrl}/beta_api/manage_ref_log.php`,
                    {
                      sellerid: result.data.result.sellerid,
                      referersellerid: getCookie("refid"),
                      device: "web",
                    },
                    { headers: { "Content-Type": "multipart/form-data" } }
                  )
                  .then(async (result) => {
                    console.log(result, 334, "functions");
                  })
                  .catch((data) => {});
              }
              $("#buyerid").val(result.data.result.sellerid);

              $("#first_tab").css({ display: "none" });
              $("#second_tab").css({ display: "block" });

              axios
                .post(
                  `${CentralUrl}/bbapi/common_leads.php`,
                  {
                    lead_id: result.data.result.sellerid, //PrimaryID of your table
                    name: "", //FullName
                    mobile: mobile,
                    email: email,
                    company: "", //Company Name if any
                    countryid: isoValue, //Country ID if not pass 0
                    device: "Web", //Adnroid,iOS,Web
                    project_source: "1", //1- Beldara, 2 Limrat Advt, 3 Limray Publisher
                    source: getCookie("source"), //Medium from which lead is generated
                  },
                  { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(async (result) => {})
                .catch((data) => {});
              $("#submit_success_spinner").addClass("d-none");
              //await store.dispatch(getLoggedIn())
            } else {
              $("#submit_button").attr("disabled", false);
              $("#submit_success_spinner").addClass("d-none");
              $("#errFooterSignUp")
                .css({ display: "block" })
                .text(result.data.message);
              var data = {
                modalChange: false,
                modal: false,
                paymentModal: false,
                reload: false,
                success: false,
                data: result,
              };

              return data;
            }
          })
          .catch((error) => {
            const result = error;
            $("#submit_button").attr("disabled", false);
          });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }
    }
  } else {
    $("#submit_button").attr("disabled", false);
    $("#submit_success_spinner").addClass("d-none");
    $("#errFooterSignUp")
      .css({ display: "block" })
      .text("Email is invalid");
    var data = {
      modalChange: false,
      modal: false,
      paymentModal: false,
      reload: false,
      success: false,
      data: "Email is invalid",
    };
    return data;
  }
  //return false;
}

export async function otp_submit(allstate, e) {
  $("#errOtpSignUp")
    .css({ display: "none" })
    .text("");
  e.preventDefault();
  if (allstate != "" && allstate !== undefined) var brid = allstate.brid;

  //var sellerid = $("#buyerid").val();
  var otp = $("#universalOtp").val();
  var sellerid = getCookie("selleridForOTP");
  var password = $("#universalPass").val();
  var page_url = window.location.pathname;
  var lead_amount_inr = $("#lead_amount_inr").val();
  var lead_amount_usd = $("#lead_amount_usd").val();

  try {
    return await axios
      .post(
        `${ApiUrl}/common/otp_verify.php`,
        { otp: otp, sellerid: sellerid, pass: password, type: "otp_verify" },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((result) => {
        if (result.data.statusId == 2) {
          $("#errOtpSignUp")
            .css({ display: "block" })
            .text(result.data.message);
          var data = {
            modalChange: false,
            modal: false,
            paymentModal: false,
            reload: false,
            success: false,
            data: result,
          };
          return data;
        } else if (result.data.statusId == 1) {
          setCookie("mhinpbn", sellerid, "365");
          if (
            page_url == "/buy-leads.html" ||
            page_url == "/buy_guaranteed_lead.html"
          ) {
            var data = {
              modalChange: true,
              modal: false,
              paymentModal: true,
              reload: false,
              success: true,
              data: result,
            };
            store.dispatch(getLoggedIn());
            return data;
          } else if (
            page_url == "/support-ticket.html" ||
            page_url == "/post-requirement.html"
          ) {
            var data = {
              modalChange: true,
              modal: false,
              paymentModal: false,
              reload: false,
              success: true,
              data: result,
            };
            store.dispatch(getLoggedIn());
            return data;
          }
          else if(page_url == '/'){
            var data = {
              modalChange: true,
              modal: false,
              paymentModal: false,
              reload: false,
              success: true,
              data: result,
            };
            store.dispatch(getLoggedIn());
            return data;
          }
           else store.dispatch(getLoggedIn());
          window.location.reload();
        } else {
          $("#errOtpSignUp")
            .css({ display: "block" })
            .text(result.data.message);
          var data = {
            modalChange: false,
            modal: false,
            paymentModal: false,
            reload: false,
            success: false,
            data: result,
          };
          return data;
        }
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
  //return false;
}

// Get Brand Promotion Product
export async function brandpromotion(catname, pageNo, parentid, catid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/brand_promo.php`,
        { catname: catname, pageNo: pageNo, parentid: parentid, catid: catid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function brandpromotionall(pageNo, parentid, catid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/brand_promo_all.php`,
        { pageNo: pageNo, parentid: parentid, catid: catid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function auctionRelated(pageNo, brid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/auction_related_seller_list.php`,
        { page: pageNo, brid: brid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function auctionlist(pageNo, auctioncat, catid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/auction_list.php`,
        { page: pageNo, auctioncat: auctioncat, catid: catid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function categorylist(type) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/category_list.php`,
        { type: type },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function auctionDetail(brid, sellerid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/auction_detail.php`,
        { brid: brid, sellerid: sellerid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data.result;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function activity(id, type) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/get_event_details.php`,
        { id: id, type: type },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function activitylist(type) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/get_event.php`,
        { type: type },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function getSpecList(pid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/auction_spec_list.php`,
        { pid: pid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function getProductPrice(pid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/product_price_list.php`,
        { pid: pid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function getMediaReleaseScreenShort(type) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/GetScreenShortList.php`,
        { type: type },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function checkSellerPackage(sellerid, brid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/checkSellerPackage.php`,
        { sellerid: sellerid, brid: brid },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        console.log("checkSellerPackage inside", response);
        return response.data;
      })
      .catch((error) => {
        const result = error;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function getSellerProducts(sellerid, page) {
  try {
    // console.log('Ho')
    return await axios
      .post(
        `${ApiUrl}/common/MyProductList.php`,
        {
          security_token: "",
          plateform_type: "",
          sellerid: sellerid,
          page: page,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        return response.data.result;
      })
      .catch((error) => {
        const result = error.response;
        return Promise.reject(result);
      });
  } catch (e) {
    console.log(`😱 File not found: ${e}`);
  }
}

export async function SendotpForLogin(username) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/login-with-otp.php`,
        { data: username, type: "OTP" },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(async (response) => {
        return response.data.result;
      })
      .catch((error) => {
        const result = error.response;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

export async function FeedbackQuestions(id) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/feedback_questions.php`,
        { cat_id: id, type: "Questions" },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(async (response) => {
        return response.data;
      })
      .catch((error) => {
        const result = error.response;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}
export async function UpdateCategoryDashboard(sellerid, categoryid) {
  try {
    return await axios
      .post(
        `${ApiUrl}/common/check_user_type.php`,
        { sellerid: sellerid, categoryid: categoryid, type: "category" },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(async (response) => {
        return response.data.result;
      })
      .catch((error) => {
        const result = error.response;
      });
  } catch (e) {
    console.log(`😱 Axios request failed: ${e}`);
  }
}

 export async function offerExist(from_date,to_date){
    if(from_date !== undefined && from_date !== null && from_date !== '' && to_date !== undefined && to_date !== null && to_date !== ''){
      let dateObj = new Date();
    let month = dateObj.getMonth()+1;
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let todayDate = year + '-' + month + '-' + day;
    // let todayDate = '2021-5-8';


    //Generate an array where the first element is the year, second is month and third is day
    var splitFrom = from_date.split('-');
    var splitTo = to_date.split('-');
    var splitToday = todayDate.split('-');

    //Create a date object from the arrays
    var newFrom = splitFrom[1]+ "," + splitFrom[2] + "," + splitFrom[0];
    var newTo = splitTo[1]+ "," + splitTo[2] + "," + splitTo[0];
    var newToday = splitToday[1]+ "," + splitToday[2] + "," + splitToday[0];

    newFrom = newFrom.toString();
    newTo = newTo.toString();
    newToday = newToday.toString();

    var fromDate = Date.parse(newFrom);
    var toDate = Date.parse(newTo);
    var todayDates = Date.parse(newToday);

    // console.log(splitFrom,splitTo,splitToday,'array',fromDate,toDate,todayDates,'days',newFrom,newTo,newToday);
    if(todayDates >= fromDate){
        if(toDate >= todayDates){
          return true;
        }else{
          return false;
        }
    }else{
      return false;
    }
    }else{
      return false;
    }
  }

  export async function getOfferPackage() {
    try {
      return await axios
        .post(
          `${ApiUrl}/common/getOfferPackage.php`,
          { security_token: "", sellerid: ls.get("log_id") },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          var data = {
            result: response.data.message,
            data: response.data.result,
          };
          return data;
        })
        .catch((error) => {
          const result = error;
        });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  export async function numberWithCommas(price){
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }