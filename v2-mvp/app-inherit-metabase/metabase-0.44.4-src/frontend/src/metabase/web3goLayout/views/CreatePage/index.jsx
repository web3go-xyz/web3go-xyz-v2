/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import cx from "classnames";
import CreateDataset from './CreateDataset';
import CreateDashboard from './CreateDashboard';

const { Text } = Typography;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
    }
};
const mapDispatchToProps = {
    push,

};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 1
        }
        this.ShareModalRef = React.createRef();
    }
    changeTab(tabIndex) {
        this.setState({
            tabIndex
        });
    }
    render() {
        const { detailData } = this.state;
        return (
            <div className="web3go-create-page">
                <div className="p-side-bar">
                    <div className="item">
                        <div className={cx("icon-wrap hover-item",
                            {
                                active: this.state.tabIndex == 0
                            })} onClick={() => { this.changeTab(0) }}>
                            <img className="normal" src={require("@/web3goLayout/assets/dashboardCreate/datasets.png")} alt="" />
                            <img className="white" src={require("@/web3goLayout/assets/dashboardCreate/datasets-w.png")} alt="" />
                        </div>
                    </div>
                    <div className="item">
                        <div className={cx("icon-wrap hover-item",
                            {
                                active: this.state.tabIndex == 1
                            })} onClick={() => { this.changeTab(1) }}>
                            <img className="normal" src={require("@/web3goLayout/assets/dashboardCreate/Dashboard.png")} alt="" />
                            <img className="white" src={require("@/web3goLayout/assets/dashboardCreate/Dashboard-w.png")} alt="" />
                        </div>
                    </div>
                </div>
                <div className={cx("p-main", this.state.tabIndex == 0 ? 'dataset' : 'dashboard'
                )}>
                    <div className="datasetTab">
                        <CreateDataset ></CreateDataset>
                    </div>
                    <div className="dashboardTab">
                        <CreateDashboard ></CreateDashboard>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
