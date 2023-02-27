/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Spin, Tabs, Typography, Tooltip } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push, replace } from "react-router-redux";
import cx from "classnames";
import CreateDataset from './CreateDataset';
import CreateDashboard from './CreateDashboard';
import { pseudoStyle } from "styled-system";
import { CollectionsApi } from '@/services'
import { publicSpaceCollectionId, changePublicSpaceCollectionId } from "metabase/redux/app";


const { Text } = Typography;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        publicSpaceCollectionId: state.app.publicSpaceCollectionId,
    }
};
const mapDispatchToProps = {
    push,
    replace,
    changePublicSpaceCollectionId
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            refreshFlag: true
        }
        this.ShareModalRef = React.createRef();
    }
    changeTab = (tabIndex) => {
        this.setState({
            tabIndex
        });
        this.props.replace({
            pathname: this.props.params.dashboardSlug ? `/layout/create/${this.props.params.dashboardSlug}` : '/layout/create',
        });
    }
    async componentDidMount() {
        // addChart后没关闭弹窗直接刷新，导致参数残留
        if (!location.pathname.includes('/dataset') && (this.props.params.chartSlug || this.props.location.hash)) {
            this.props.replace({
                pathname: '/layout/create',
            });
            return;
        }
        if (this.props.location.state && this.props.location.state.tabIndex) {
            this.setState({
                tabIndex: this.props.location.state.tabIndex
            });
        }
        //测试用，加快速度
        this.props.changePublicSpaceCollectionId(40);
        // const collectionList = await CollectionsApi.list();
        // const publicSpaceCollection = collectionList.find(v => v.name == 'PublicSpace');
        // this.props.changePublicSpaceCollectionId(publicSpaceCollection.id);
    }
    async componentDidUpdate(prevProps) {
        // 处理在create页面再次点击create， 刷新页面
        if ((this.props.location !== prevProps.location) && this.props.location.state && this.props.location.state.refresh) {
            await this.setState({ refreshFlag: false, tabIndex: 0 });
            this.props.replace({
                pathname: '/layout/create',
            });
            await this.setState({ refreshFlag: true });
        }
    }
    render() {
        if (!this.props.publicSpaceCollectionId || !this.state.refreshFlag) {
            return <Spin style={
                {
                    display: 'block', minHeight: 100, display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }></Spin >
        }
        return (
            <div className="web3go-create-page common-form">
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
                <div className="p-main">
                    {
                        this.state.tabIndex == 0 ?
                            <CreateDataset {...this.props} changeTopTab={this.changeTab}></CreateDataset>
                            :
                            <CreateDashboard {...this.props} changeTopTab={this.changeTab}></CreateDashboard>
                    }
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
