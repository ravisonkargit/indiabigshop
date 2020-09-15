import React, {Component} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import {Link} from 'react-router-dom'
import Requirement from '../../form/requirement';
import { withTranslate } from 'react-redux-multilingual'
import $ from 'jquery';

class DetailsTopTabs extends Component {


    componentDidMount = () => {
        $('.desc_content').find('li').addClass('desc_contentli');
        $('.desc_content').find('ul').addClass('desc_contentul');
        $(".desc_content").find("td").css("border", "1px solid black");
    }

    componentDidUpdate = () => {
        this.updateClass()
    }

    updateClass = () => {
        $('.desc_content').find('li').removeClass('desc_contentli').addClass('desc_contentli');
        $('.desc_content').find('ul').removeClass('desc_contentul').addClass('desc_contentul');
    }

    render (){
        const { item,translate } = this.props;
        return (
            <section className="tab-product m-0" id="prodDetailSpec">
                <div className="row">
                    <div className="col-sm-12 col-lg-12">
                        <Tabs className="tab-content nav-material">
                            <TabList className="nav nav-tabs nav-material">
                                {item.attribute ?
                                    <Tab className="nav-item">
                                        <span className="nav-link" >
                                            <i className="icofont icofont-contacts"></i>{'PRODUCT SPECIFICATIONS'}</span>
                                        <div className="material-border"></div>
                                    </Tab>
                                    : ''}
                                {item.description ?
                                    <Tab className="nav-item" onClick={() => this.updateClass()}>
                                        <span className="nav-link active" onClick={() => this.updateClass()}>
                                            <i className="icofont icofont-ui-home"></i>{translate('PRODUCT DETAILS')}
                                        </span>
                                        <div className="material-border"></div>
                                    </Tab>
                                : ''}
                                {/* {item.company || item.country || item.city || item.mobile ?
                                    <Tab className="nav-item">
                                        <span className="nav-link" ><i className="icofont icofont-man-in-glasses"></i>{translate('COMPANY DETAILS')}</span>
                                        <div className="material-border"></div>
                                    </Tab>
                                    : ''} */}
                                { item.feature? 
                                <Tab className="nav-item">
                                    <span className="nav-link" >
                                        <i className="icofont icofont-contacts"></i>{'PRODUCT FEATURES'}</span>
                                    <div className="material-border"></div>
                                    </Tab>
                                     :'' }
                                
                                <Tab className="nav-item d-none">
                                    <span className="nav-link" >
                                        <i className="icofont icofont-contacts"></i>{translate('Contact supplier')}</span>
                                    <div className="material-border"></div>
                                </Tab>
                                {/* <Tab className="nav-item">
                                    <span className="nav-link" >
                                        <i className="icofont icofont-contacts"></i>Buyer reviews</span>
                                    <div className="material-border"></div>
                                </Tab> */}
                            </TabList>
                            {item.attribute ? 
                                <TabPanel>
                                <table className="table table-striped mb-0">
                                    <tbody>
                                            {item.attribute.map((vari, index) => (
                                                <React.Fragment key={index}>
                                                    {vari.fValue ? (
                                                        <tr>
                                                            <td className="text-capitalize">{vari.fName}:</td>
                                                            <td className="text-capitalize">{vari.fValue}</td>
                                                        </tr>
                                                    ) : (
                                                            ""
                                                        )}
                                                </React.Fragment>
                                            ))}
                                    </tbody>
                                </table>
                            </TabPanel>
                            : ''}
                            {item.description ?
                                <TabPanel className="desc_content tab-pane fade mt-4 show active">
                                    <p className="desc_content mt-4 p-0" dangerouslySetInnerHTML={{ __html: item.description }}>
                                    </p>
                                </TabPanel>
                            : ''}
                            {/* {item.company || item.country || item.city || item.mobile ?
                            <TabPanel>
                                <table className="table table-striped mb-0">
                                    <tbody>
                                    {item.company ?
                                    <tr>
                                        <th>{translate('Company Name')} :</th>
                                        <td>{item.company}</td>
                                    </tr>
                                    : ''}
                                    {item.country ?
                                    <tr>
                                        <th>{translate('Country')} :</th>
                                        <td>{item.country}</td>
                                    </tr>
                                    : ''}
                                    {item.city ?
                                    <tr>
                                        <th>{translate('City')} :</th>
                                        <td>{item.city}</td>
                                    </tr>
                                    : ''}
                                    {item.mobile ?
                                    <tr>
                                        <th>{translate('Mobile')} :</th>
                                        <td>{item.mobile}</td>
                                    </tr>
                                    : ''}
                                    </tbody>
                                </table>
                            </TabPanel>
                            :''} */}

                            {item.feature ? 
                                <TabPanel>
                                <table className="table table-striped mb-0">
                                        <tbody>
                                        {item.feature.map((vari, index) => (
                                        <React.Fragment key={index}>
                                            {vari.feature ? (
                                            <tr>
                                                <td className="small border-bottom">{vari.feature}</td>
                                            </tr>
                                            ) : (
                                                ""
                                            )}
                                        </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </TabPanel>
                            : ''}
                            
                            
                            
                            <TabPanel className="d-none">
                                <form className="theme-form mt-4">
                                    <div className="form-row">
                                        {/* <div className="col-md-12 ">
                                            <div className="media m-0">
                                                <label>Rating</label>
                                                <div className="media-body ml-3">
                                                    <div className="rating three-star">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        {/* <Requirement product={item} /> */}
                                        <div className="col-md-6">
                                            <label htmlFor="name">{translate('Enter your name')}</label>
                                            <input type="text" className="form-control" id="name" placeholder="Enter Your name" required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="email">{translate('Enter your email')}</label>
                                            <input type="text" className="form-control" id="email" placeholder="Email" required />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="review">Review Title</label>
                                            <input type="text" className="form-control" id="review" placeholder="Enter your Review Subjects" required />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="review">Review Title</label>
                                            <textarea className="form-control" placeholder="Wrire Your Testimonial Here" id="exampleFormControlTextarea1" rows="6"></textarea>
                                        </div>
                                        <div className="col-md-12">
                                            <button className="btn btn-solid" type="submit">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </TabPanel>
                            {/* <TabPanel>
                                <div className="mt-4 text-center">
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <iframe
                                            src="https://www.youtube.com/embed/BUWzX78Ye_8"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen>
                                        </iframe>
                                    </div>
                                </div>
                            </TabPanel> */}
                        </Tabs>
                    </div>
                </div>
            </section>
        )
    }
}

export default withTranslate(DetailsTopTabs);