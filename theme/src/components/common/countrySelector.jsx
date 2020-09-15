import React, { Component } from 'react'
import Modal from "react-responsive-modal";
import axios from 'axios';
import { ApiUrl } from '../../constants/ActionTypes';
import ls from "local-storage";
import Select from 'react-select';
import $ from "jquery";
import { setCookie, getCookie } from '../../functions';
import { withTranslate } from 'react-redux-multilingual';

import './countrySelector.css';
var canGetContry = 1;
class CountrySelector extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ask_country: false,
            country: [],
            countrySelector: [],
            forceAsk: false
        }
    }

    componentDidMount = async () => {
        // console.log('ask country didmount: ', this.props, ' cid: ',getCookie('countryid'))
        try {
            await this.setState({
                ask_country: this.props.askCountry
            })
            
            // load country data
            if (this.props.askCountry) {
                this.get_country()
            }
        } catch (e) {
            console.log('could not get country')
        }

    }

    UNSAFE_componentWillReceiveProps = async (nextProps) => {
        // console.log('ask country receiveProps: ', nextProps, ' cid: ',getCookie('countryid'))
        try {         
                if (nextProps) {
                    if ((this.props.askCountry != nextProps.askCountry || nextProps.forceAsk) && nextProps.askCountry === true) {
                        await this.setState({
                            ask_country: nextProps.askCountry,
                            forceAsk: nextProps.forceAsk
                        })
                        // when pop up called again load country data
                        this.get_country()
                    }
                }

                if (this.props.askCountry === true && nextProps.forceAsk === false){
                    if (getCookie('countryid') && getCookie('countryid')!= '' && parseInt(getCookie('countryid')) > 0){
                        await this.setState({
                            ask_country: false,
                            forceAsk: false
                        })
                    }
                }

            //}

        } catch (e) {
            console.log('could not get country')
        }
    }

    get_country = () => {
        if (canGetContry == 1){
            canGetContry = 0;
        axios.post(`${ApiUrl}/common/country.php`,{ sellerid: ls.get('sellerid'),security_token : '', plateform_type : '' }, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(async response => {
            await this.setState({
                country: response.data.result
            })
            let countrySelector = [];
            this.state.country.forEach((val, index) => {
                countrySelector[index] = {"value": val.code, "label": val.country , "code": val.code2}
            })
            await this.setState({
                countrySelector: countrySelector
            })
            canGetContry = 1;
        }).catch(error => {
            const result = error.response;
            return Promise.reject(result);
        });
    }
    }

    see_all_country = () => {
        $('.all_country').toggleClass('d-none');
    }

    selectCountry = async (countryid, countrycode, countryname) => {
        console.log('country changed',101,countryid,countrycode,countryname);
        setCookie('country_name', countryname,"1")
        setCookie('country_code', countrycode,"1")
        setCookie('countryid', countryid,"1")

        if (countrycode) {
            if (countrycode.toLowerCase() == 'in') {
                setCookie('currency', 'INR')
            } else {
                setCookie('currency', 'USD')
            }
        }

        await this.setState({
            ask_country: false
        })  
        
        this.props.countrySelectorData(countrycode)
    }

    handleChange = selectedOption => {
        this.selectCountry(selectedOption.value, selectedOption.code , selectedOption.label)
        //unit = selectedOption.label;
    };

    
    render() {
        const { translate } = this.props;
        const { value, suggestions } = this.state;
        
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: `${translate('Search Your Country')}...`,
            value,
            data:'s',
            onChange: this.onChange,
            name: "prodName",
        };
        return (
            <Modal open={this.state.ask_country} onClose={() => ''} center className="cart-modal">
            
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                <div className="modal-header">
                            <h3 className="modal-title pr-2">Select Your Country: </h3>
                            {this.state.forceAsk ?
                                <button type="button" className="close" onClick={this.props.closeModal}>&times;</button>
                                :''}
                </div>
                    <div className="modal-body modal1">
                        <div className="container-fluid p-0">
                                <div className="row m-0 text-center">
                                    
                                <div className="col-12 my-1">
                                    <Select
                                        placeholder={translate('Search Your Country')}
                                        isOptionSelected='true'
                                        options={this.state.countrySelector}
                                        name='unit'
                                        onChange={this.handleChange}
                                        // formatGroupLabel={formatGroupLabel}
                                    />
                                </div>
                                    
                                <div className="col-4 p-0">
                                        <img className="img-thumbnail mouse_pointer set_width" onClick={() => this.selectCountry(91, 'in', 'india')} src="https://img.beldara.com/country_flags/Flag_of_India.svg" alt="india flag beldara.com" />
                                </div>
                                <div className="col-4 p-0">
                                    <img className="img-thumbnail mouse_pointer set_width" onClick={() => this.selectCountry(1, 'us', 'united states of america')} src="https://img.beldara.com/country_flags/flag_of_us.png" alt="us flag beldara.com" />
                                </div>
                                <div  className="col-4 p-0">
                                    <img className="img-thumbnail mouse_pointer set_width" onClick={() => this.selectCountry(44, 'uk', 'united kingdom')}   src="https://img.beldara.com/country_flags/flag_of_uk.png" alt="uk flag beldara.com" />
                                </div>
                                <div className="col-12 all_country_wrapper">
                                    <div className="mouse_pointer text-center mt-4 mb-4 " onClick={this.see_all_country}>
                                        View all countries
                                    </div>
                                        
                                    <div className="d-none all_country row">
                                        {this.state.country.map((val, index) => 
                                            <div key={index} className="mouse_pointer col-md-3 col-sm-4" onClick={() => this.selectCountry(val.code, val.code2, val.country)}> { val.country } </div>
                                        ) }
                                    </div >
                                </div >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Modal>
        )
    }
}

export default withTranslate(CountrySelector);