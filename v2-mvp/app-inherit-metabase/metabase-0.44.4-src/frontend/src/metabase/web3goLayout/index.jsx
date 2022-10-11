/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import BaseHeader from './BaseHeader';
const mapStateToProps = state => ({

});
class Component extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {

        return (<div className="web3go-layout-page">
            <BaseHeader />
            {/* <div class="container-content">
            <div class="content">
                <router-view></router-view>
            </div>
            <BaseFooter />
        </div> */}
        </div>)

    }

}


export default connect(mapStateToProps)(Component);
