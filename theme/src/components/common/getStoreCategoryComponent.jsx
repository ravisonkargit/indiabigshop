import React, { Component } from 'react';
import LoadingComponent from '../products/common/loading-bar';
import { getStoreCategory } from '../../functions';
import $ from 'jquery';
import './categoryComponent.css';
import { Link } from 'react-router-dom';

class getStoreCategoryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sellerid: this.props.type.sellerDetail.sellerid,
            pageUrl: this.props.type.pageUrl,
            catid: 0,
            totalcat: 1,
            isCategoryReceived: 0,
            categoryData: [],
            parentid: 0,
        };
       
    }

    componentDidMount = async () => {
        if (this.state.sellerid > 0){
            await getStoreCategory(this.state.sellerid).then(async res =>
                await this.setState({
                    categoryData: res.result,
                    isCategoryReceived:1,
                    totalcat: res.message
                })
            );
        }else{
            await this.setState({
                isCategoryReceived:1
            })
        }

        await this.setState({
            catid: this.props.type.catid,
            parentid: this.props.type.parentid
        })
        
        if ( parseInt(this.state.catid) > 0){
            $('#'+this.state.catid).addClass('cat_label_selected');
            $('.accordion').find('#'+this.state.catid).addClass('cat_label_selected');
        }
    }

    render() {
        return (
            <div>
                <a href={`${this.state.pageUrl}.html`} className="showAllCat mouse_pointer"  >Show All </a>
                <div className="h5 border-bottom mt-2">Category</div>
                {this.state.categoryData ? this.state.isCategoryReceived  == 1 ?
                    this.state.categoryData.length > 0 ?
                    <ul>
                        {
                        this.state.categoryData.map((item, index) =>
                        <li key={index} className="catList">
                            <a id={item.cat_id} parent-id={item.parent_id} href={`${this.state.pageUrl}.html/${item.cat_id}`}> 
                                {/* {item.name} <span className="text-muted">({item.cnt})</span>  */}
                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                            </a>
                        </li>
                        )
                        }
                    </ul>
                    : '' 
                :  <LoadingComponent /> :''}
            </div>
        )
    }
}

export default getStoreCategoryComponent;
