import React, { Component } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Requirement from './requirement';
import '../common/index.scss';
import './requirement.css';
import Select from 'react-select';
import { connect } from 'react-redux'
import store from '../../store';
import {getAllUnits, getLoggedIn} from '../../actions'
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import { withTranslate } from 'react-redux-multilingual';
import { Redirect } from 'react-router';
//packages
import ls from 'local-storage'
import axios from 'axios';
import $ from 'jquery'
import { ApiUrl } from '../../constants/ActionTypes';
import LoginPopUp from '../loginPopUp'
import SignUpPopUp from '../signUpPopUp'
import {setCookie, getCookie} from '../../functions';
import { imgUrl } from '../../constants/variable';

var email, mobile ,qty ,unit ,price ,prodName ,reqDetail, type ,checkOtp, currency;
var currency = getCookie('currency');
type = 1;
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function getSuggestionValue(suggestion) {
    return suggestion.name;
}

function renderSuggestion(suggestion, { query }) {
    const matches = AutosuggestHighlightMatch(suggestion.name, query);
    const parts = AutosuggestHighlightParse(suggestion.name, matches);

    return (
    <span>
        {parts.map((part, index) => {
        const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

        return (
            <span className={className} key={index}>
            {part.text}
            </span>
        );
        })}
    </span>
    );
}
var data_suggestion, productid , country_name= '';
class PostRequirement extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            query: "",
            data: [],
            filteredData: [],
            value: '',
            productid: '',
            suggestions: [],
            languages: [],
            login: false,
            signup: false,
            error: 0,
            result: 0,
            otp: 0,
            data: '',
            unit: '',
            quantity: '',
            price: '',
            errorText: 'Something went wrong! Please try again after sometime.'
        }
    }
    onChange = (event, { newValue, newId, method }) => {
      
        this.setState({
            value: newValue,
            productid: '',
            id: newId
        });
        // console.log('productid on change: '+this.state.productid);

        // $(".form_search").submit()
    };
    //Returning a values from Functions 
    footerData = (data) => {
        // console.log('footerData');
       
        if (data.modalChange) {
            this.setState({
                signup: data.modal,
                login: data.modal
            })
        }

        if (data.success) {
            country_name = data.data.country_name;
            this.submitRequirement();
        }
        
        this.setState({
            reload: data.reload
        })
        
    };
    //Opening Signup modal
    openSignUpModal = () => {
        this.setState({
            signup: true,
            login: false,
        });
    }
    //Opening Login modal   
    openLoginModal = () => {
        this.setState({
            signup: false,
            login: true,
        });
    }
    // Close Modal 
    closeModal = () => {
        this.setState({
            login: false,
            signup: false,
        })
    }
    //Post Requirement Form Submit
    postFormSubmit = (e) => {
        e.preventDefault()
        
        this.setState({
            error: 0
        })
        
        email = $("#email").val()
        mobile = $("#mobile").val()
        qty = $("#qty").val()
        prodName = $('input[name="prodName"]').val()
        reqDetail = $("#reqDetail").val()
        price = $("#price").val()
        
        // console.log('sellerid inside post requirement '+ls.get('sellerid'));
        
        if (!ls.get('sellerid')) {
           
            this.setState({ login: true })
            //this.submitRequirement();
        }
        else {
            this.submitRequirement();
        }
    }
    
    async componentWillMount() {
        store.dispatch(getAllUnits())
        var hostname = window.location.hostname;
        // if (hostname === undefined || hostname == '')
        // hostname = "german.beldara.com";
        let domain_language_code = '';
        let langDomain = hostname.split("beldara.com")[0];
        langDomain = langDomain.replace(".", "");
        this.props.languageMaster.forEach(element => {
            if (element.main_language.toLowerCase() == langDomain.toLowerCase())
                domain_language_code = element.code;
        }, this);
        if (domain_language_code !== "" && domain_language_code !== undefined) {
            await axios
                .post(
                    "https://api.beldara.com/common/static_page.php",
                    { security_token: "", plateform_type: "", langCode: domain_language_code, pageid: '17' },
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(response => {
                    this.setState({
                        data: response.data.result
                    })
                })
                .catch(error => {
                    const result = error.response;
                    return Promise.reject(result);
                });
        } else {
            await axios
                .post(
                    "https://api.beldara.com/common/static_page.php",
                    { security_token: "", plateform_type: "", langCode: 'en', pageid: '17' },
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(response => {
                    this.setState({
                        data: response.data.result
                    })
                })
                .catch(error => {
                    const result = error.response;
                    return Promise.reject(result);
                });
        }
        
    }
        
    submitRequirement = () => {
        $('#no_loading_btn').attr('disabled','');
        $('#no_loading').removeClass('d-none').addClass('d-none');
        $('#loading').removeClass('d-none');
        
        // if ( parseFloat(price) > 0 ){
        if ( parseInt(qty) > 0 ){
            var seller_invoice = $('#inputFile')[0];
            var seller_file = seller_invoice.files[0];
            
            var formData1 = new FormData();
            formData1.append('email', email);
            formData1.append('mobile', mobile);
            formData1.append('qty', qty);
            formData1.append('price', price);
            formData1.append('currency', currency);
            formData1.set('unit', unit);
            formData1.append('prodName', prodName);
            formData1.append('reqDetail', reqDetail);
            formData1.append('prodId', this.state.productid);
            formData1.append('currentUrl', window.location.pathname);
            formData1.append('country_name', getCookie('country_name'));
            formData1.append('type', '1');
            formData1.append('sellerid', ls.get('sellerid'));
            formData1.append('visitorid', getCookie('mhinpbnb'));
            formData1.append('source', getCookie('source'));
            formData1.append('target', getCookie('target'));
            formData1.append('campaign', getCookie('cname'));
            formData1.append('security_token', '');
            formData1.append('plateform_type', '');
            formData1.append('inputFile', seller_file);

            try {

                axios({
                    method: 'post',
                    url: `${ApiUrl}/common/post_req.php`,
                    data: formData1,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                })
                    .then(async response => {
                        this.allow_submit()
                        if (response.data.statusId === 1) {
                        
                            if (response.data.message == 1 || response.data.message == '1') {
                                await setCookie('mhinpbn', response.data.result, '365');
                                this.setState({
                                    result: 1,
                                    otp: 0
                                })
                            } else if (response.data.statusId == 1) {
                                await setCookie('mhinpbn', response.data.message, '365');
                                this.setState({
                                    result: 1,
                                    otp: 1
                                })
                            } else {
                                this.setState({
                                    error: 1,
                                    errorText: 'Something went wrong! Please try again after sometime.'
                                })
                            }
                            await store.dispatch(getLoggedIn())
                        } else {
                            this.setState({
                                error: 1,
                                errorText: 'Something went wrong! Please try again after sometime.'
                            })
                            
                        }
                    })
                    .catch(error => {
                        this.allow_submit()
                        this.setState({
                            error: 1,
                            errorText: 'Something went wrong! Please try again after sometime.'
                        })
                        const result = error.response;
                        return Promise.reject(result);
                    });
            } catch (e) {
                this.allow_submit()
                this.setState({
                    error: 1,
                    errorText: 'Something went wrong! Please try again after sometime.'
                })
                console.log(e);
            }
        }else{
            this.allow_submit()
            this.setState({
                error: 1,
                errorText: 'Pleae enter quantity greater than zero.'
            })
        }
    // }else{
    //     this.allow_submit()
    //     this.setState({
    //         error: 1,
    //         errorText: 'Pleae enter Price greater than zero.'
    //     })
    // }
    }

    allow_submit = () => {
        $('#no_loading').removeClass('d-none');
        $('#loading').removeClass('d-none').addClass('d-none');
        $('#no_loading_btn').removeAttr('disabled');
    }

    onSuggestionsFetchRequested = ({ value }) => {
        let userData = {
            term: value
        }
        productid = '';
        userData = JSON.stringify(userData)
        let formData = new FormData()
        formData.append('data', userData)
        axios.post("https://api.beldara.com/common/search_universal.php", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                // console.log('productid axios: '+this.state.productid);
                let data = response.data.result.map(result => {
                    return {
                        name: `${result.name}`
                    };
                });

                data_suggestion = response.data.result.map(result => {
                    return {
                        name: `${result.name}`,
                        id: `${result.id}`
                    };
                });
                this.setState({
                    suggestions: data
                    // suggestions: getSuggestions(value)
                });
            })
            .catch(error => {
                const result = error.response;
                return Promise.reject(result);
            });
      
    };
     
        
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handleChange = selectedOption => {
        unit = selectedOption.label;
    };

    handleCurrency = selectedOption => {
        currency = selectedOption.label;
    };
    
    componentDidMount = async () => {
        // console.log(this.props,'componentDidMount');
        if (this.props.location.state) {
            await this.setState({
                value: this.props.location.state.name,
                productid: this.props.location.state.id,
                id: this.props.location.state.id,
                unit: this.props.location.state.unit,
                quantity: this.props.location.state.qty
            })
        }
    }

    componentDidUpdate(){
        if (data_suggestion) {
            productid = data_suggestion.filter(item => {
                if (this.state.value == item.name )
                    return item.id;
            },this)
            if (productid[0])
                this.state.productid = productid[0].id;
        }
    }

    changeQty = (e) => {
        this.setState({
            quantity: e.target.value
        })
    } 
    
    changePrice = (e) => {
        this.setState({
            price: e.target.value
        })
    } 

    render() {
        // console.log(this.props,'render');
        const { translate,item } = this.props;
        const { value, suggestions, unit, quantity , price} = this.state;
        
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: `${translate('What are you looking for')}...`,
            value,
            data:'s',
            onChange: this.onChange,
            name: "prodName",
        };

        const defaultCurrency = [
            {
              value: getCookie('currency'),
              label: getCookie('currency')
            }
          ];

        const currencyOption = [
            {value:'INR', label:'INR'},
            {value:'USD', label:'USD'}
        ]
        return (
            
            <div>
                <Breadcrumb title={'Post Requirement'} metaDesc={this.state.data.desc1} metaKeyword={this.state.data.keyword} metaTitle={this.state.data.title}/>
                <section className="section-b-space">

                {
                    this.state.result == 1 ?
                       <Redirect to={{ pathname: '/additional_data_req.html', state: { otp: this.state.otp, type: 1, error:0, otpCheck:1 }}}/>
                    : ''
                }
                    
                    <div className="collection-wrapper">
                        <div className="container">
                            <div className="row">
                                
                                    <div className="page-main-content">
                                        <div className="container-fluid">
                                            <div className="row">
                                            {this.state.error == 1?
                                                 <div className="col-12 alert alert-danger"> {this.state.errorText}</div>
                                                :''}
                                                <div className="col-md-8">
                                                    <div className="card">
                                                        <h5 className="card-header">{translate('Post Requirement')}</h5>
                                                        <div className="card-body">
                                                            <h5 className="card-title">Connect with local and global B2B Manufacturers, suppliers, importers, exporters to buy in Wholesale or Buy in Bulk. Post your buying requirement to get the best quotations.</h5>
                                                            <input id="sellerid" type="hidden" name="sellerid" />
                                                            <input id="buyerid" type="hidden" name="buyerid" />
                                                            <form className="theme-form mt-0" onSubmit={this.postFormSubmit}>
                                                                <div className="form-row">
                                                                    <div className="col-md-12 my-2">
                                                                        <div className="has-float-label ">
                                                                            <Autosuggest
                                                                                suggestions={suggestions}
                                                                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                                                getSuggestionValue={getSuggestionValue}
                                                                                renderSuggestion={renderSuggestion}
                                                                                inputProps={inputProps}
                                                                                className="form-control"
                                                                                id="prodName" 
                                                                                style={{width:'100%'}}
                                                                            />
                                                                            {/* <input type="text" className="form-control" id="prodName" placeholder=" " defaultValue="" required /> */}
                                                                            <label htmlFor="prodName">{translate('Product name')}</label>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="col-md-6 my-2">
                                                                        <Select
                                                                            placeholder={translate('Select Unit')}
                                                                            isOptionSelected='true'
                                                                            options={this.props.data.units}
                                                                            name='unit'
                                                                            onChange={this.handleChange}
                                                                            // formatGroupLabel={formatGroupLabel}
                                                                        />
                                                                    </div>

                                                                    <div className="col-md-6 my-2">
                                                                        <div className="has-float-label ">
                                                                        <input id="qty" type="number" placeholder=" " name="qty" value={quantity} onChange={this.changeQty} className="form-control" required/>
                                                                            <label htmlFor="qty">{translate('Quantity')}</label>
                                                                        </div>
                                                                    </div>

                                                                    {/* <div className="col-md-6 my-2">
                                                                        <div className="has-float-label ">
                                                                            <Select
                                                                                placeholder={translate('Currency')}
                                                                                isOptionSelected='true'
                                                                                options={currencyOption}
                                                                                name='currency'
                                                                                onChange={this.handleCurrency}
                                                                                defaultValue={defaultCurrency}
                                                                                // formatGroupLabel={formatGroupLabel}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6 my-2">
                                                                        <div className="has-float-label ">
                                                                            <input id="price" type="tel" placeholder=" " name="price" onChange={this.changePrice} className="form-control"/>
                                                                            <label htmlFor="price">{`${translate('Price')}`}</label>
                                                                        </div>
                                                                    </div> */}
                                                                    <div className="col-md-12 my-2">
                                                                        <div className="has-float-label ">
                                                                            <input id="inputFile" type="file" placeholder=" " name="inputFile" className="form-control"/>
                                                                            <label htmlFor="inputFile">{translate('Select File')}</label>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="col-md-12 my-2">
                                                                        <div className="has-float-label">
                                                                            <textarea className="form-control" placeholder=" " name="reqDetail" id="reqDetail" rows="4" defaultValue={``} required></textarea>
                                                                            <label htmlFor="reqDetail">{translate('Requirement details')}</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12 text-center mt-1">

                                                                        <button id="no_loading_btn" className="btn btn-solid" type="submit">
                                                                            <i id="no_loading" className="fa fa-paper-plane mr-2"></i>
                                                                            <div id="loading" className="spinner-border d-none mr-2" role="status">
                                                                                <span className="sr-only">Loading...</span>
                                                                            </div>
                                                                            {translate('Submit requirement')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-4 d-none  d-sm-none d-md-block">
                                                    

                                                    {/* <a href="https://loverlovely.com" >
                                                        <img src={`${imgUrl}/images/loverlovelyad.png`} alt="LoverLovely Beldara.com" className="mb-2">

                                                        </img>
                                                    </a> */}

                                                    <a href="https://limray.com">
                                                        <img src={`${imgUrl}/images/limrayad2.png`} alt="Limray Beldara.com" >

                                                        </img>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </section>
                <LoginPopUp footerData={this.footerData} login={this.state} openSignUpModal={this.openSignUpModal} closeModal={this.closeModal} />
                <SignUpPopUp footerData={this.footerData} signup={this.state} openLoginModal={this.openLoginModal} closeModal={this.closeModal} />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return  {
        data: state.units,
        languageMaster: state.languageMaster.languageMaster,
        user:state.user
   }    
}

export default withTranslate(connect(mapStateToProps)(PostRequirement));
//export default connect(mapStateToProps) (PostRequirement);

// export default PostRequirement