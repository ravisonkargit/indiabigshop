import React, {Component} from 'react';
import Breadcrumb from "./breadcrumb";
import { withTranslate } from 'react-redux-multilingual';

class PageNotFound extends Component {

    render() {
        const {translate} = this.props;
        return (
            <div>
                <Breadcrumb title={'Page Not Found'}/>

                <section className="p-0">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="error-section">
                                    <h2>{translate('Page Not Found')}</h2>
                                    <a href="\" className="btn btn-solid">{translate('Back To Home')}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default withTranslate(PageNotFound)