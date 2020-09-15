import React, { Component } from 'react'
import { Redirect } from 'react-router';
import 'react-intl-tel-input/dist/main.css';
import './requirement.css';
import Select from 'react-select';
import { connect } from 'react-redux'
import ls from 'local-storage'
import $ from 'jquery'
import {getAllUnits, getLoggedIn} from '../../actions'
import axios from 'axios';
import store from '../../store';
import { ApiUrl } from '../../constants/ActionTypes';
import { withTranslate } from 'react-redux-multilingual';
import {setCookie, getCookie} from '../../functions';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
 
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
var type,number,isoValue,dialCode,countryName,unit;
class ReqComponent extends Component {
    constructor(props){
        super(props);
        this.state = { 
            value: '',
            otp:'',
            result:0 , 
            error:0,
            suggestions: [],
            productid: ''
        };
     }
     
    componentWillMount() {
        store.dispatch(getAllUnits())
    }

    handleChange = selectedOption => {
        unit = selectedOption.label;
    };
    onChange = (err, no, data) => {

        type = err
        number = no
        isoValue = data.iso2
        dialCode = data.dialCode
        countryName = data.name.replace(/ *\([^)]*\) */g, "")
        
    }
   
    reqFormSubmit = (e) => {
        e.preventDefault()
        $('#loading').removeClass('d-none');
        $('#no_loading').removeClass('d-none').addClass('d-none');
        $('#no_loading_btn').attr('disabled','');
        var email = $("#buyer_email").val()
        const number = $("#buyer_mobile").val()
        const qty = $("#qty").val()
        const prodName = $("#prodName").val()
        const reqDetail = $("#reqDetail").val()
        try {
            if (!type) {
                this.setState({ error: true, msg: 'Mobile is invalid' })
                return 
            }
            axios.post(`${ApiUrl}/common/contact_supplier.php`,
                {
                    email: email,
                    mobile: number,
                    qty: qty,
                    unit: unit,
                    prodName: prodName,
                    reqDetail: reqDetail,
                    country: isoValue.toUpperCase,
                    countryid: dialCode,
                    country_name: countryName,
                    currentUrl: window.location.pathname,
                    prodId: this.state.productid,
                    type:1,
                    sellerid:ls.get('sellerid'),
                    visitorid: getCookie('mhinpbnb'),
                    source: getCookie('source'),
                    target: getCookie('target'),
                    campaign: getCookie('cname'),
                    security_token: '', plateform_type: ''
                },
                { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(async response => {

                    this.allow_submit()

                    // console.log(response);
                if (response.data.status === 'Success') {
                    
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
                    }else{
                        this.setState({
                            error: 1
                        })
                    }
                    await store.dispatch(getLoggedIn())
                }
                else {
                    console.log(false)
                    this.allow_submit()
                }
            })
            .catch(error => {
                this.allow_submit()
                const result = error.response;
                return Promise.reject(result);
            });
        }
        catch (e) {
            this.allow_submit()
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

    onChange = (event, { newValue, newId, method }) => {
      
        this.setState({
            value: newValue,
            productid: '',
            id: newId
        });
        
    };

    render() {
        const { value, suggestions } = this.state;
        const { translate } = this.props  
        const { mobile, company, email, country } = this.props.user.user
        
        const inputProps = {
            placeholder: ` `,
            value,
            data:'s',
            onChange: this.onChange,
            name: "prodName",
        };

        return (
            <div >
                
                <form className="theme-form mt-0" onSubmit={this.reqFormSubmit}>
                    <div className="form-row">

                    <div className="col-md-12 my-2">
                    {
                        this.state.error == 1 ?
                            <div className="alert alert-danger">Something went wrong please try again later.</div >
                        : ''
                        }
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
                            <div className="has-float-label ">
                                <input id="qty" type="tel" placeholder=" " className="form-control" required/>
                                <label htmlFor="qty">{translate('Quantity')}</label>
                            </div>
                        </div>
                        <div className="col-md-6 my-2">
                            
                            <Select
                                placeholder={translate('Select Unit')}
                                isOptionSelected='true'
                                options={this.props.data.units}
                                onChange={this.handleChange}
                            />
                            
                        </div>
                        <div className="col-md-12 my-2">
                            <div className="has-float-label">
                                <textarea className="form-control" placeholder=" " id="reqDetail" rows="4" ></textarea>
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
                        <div className="col-md-12 my-2">
                            <div className={`alert alert-danger ${this.state.error ? '' : 'd-none'}`}>{this.state.msg}</div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return  {
        data: state.units,
        user:state.user
   }   
       
}

export default withTranslate(connect(mapStateToProps)(ReqComponent));

// export default Requirement;