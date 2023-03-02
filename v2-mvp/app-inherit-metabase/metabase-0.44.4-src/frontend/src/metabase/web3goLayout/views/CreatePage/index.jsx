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
import { toggleDark, changeMyDashboardList } from "metabase/redux/app";
import { LayoutLoginApi, LayoutDashboardApi } from '@/services'
import { pseudoStyle } from "styled-system";
import { CollectionsApi } from '@/services'
import { publicSpaceCollectionId, changePublicSpaceCollectionId } from "metabase/redux/app";
import SelectDashboardToEditModal from './SelectDashboardToEditModal';


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
    changePublicSpaceCollectionId,
    changeMyDashboardList
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
        this.SelectDashboardToEditModalRef = React.createRef();
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
        //测试用，加快速度
        this.props.changePublicSpaceCollectionId(40);
        // const collectionList = await CollectionsApi.list();
        // const publicSpaceCollection = collectionList.find(v => v.name == 'PublicSpace');
        // this.props.changePublicSpaceCollectionId(publicSpaceCollection.id);

        // addChart后没关闭弹窗直接刷新，导致参数残留
        if (!location.pathname.includes('/dataset') && (this.props.params.chartSlug || this.props.location.hash)) {
            this.props.replace({
                pathname: '/layout/create',
            });
            return;
        }
        if (this.props.location.state && this.props.location.state.selectDashboardToEdit) {
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
    }
    getMyDashboards = (cb) => {
        if (!this.props.userData.account) {
            this.props.changeMyDashboardList([]);
            return;
        }
        LayoutDashboardApi.list({
            "pageSize": 999999999999,
            "pageIndex": 1,
            "orderBys": [],
            "tagIds": [],
            "searchName": '',
            "creator": this.props.userData.account.accountId,
            "dashboardIds": []
        }).then(d => {
            this.props.changeMyDashboardList(d.list);
            if (cb) {
                cb();
            }
        });
    }
    async componentDidUpdate(prevProps) {
        // 处理在create页面再次点击create， 刷新页面
        if ((this.props.location !== prevProps.location) && this.props.location.state && this.props.location.state.refresh) {
            if (this.props.location.state.selectDashboardToEdit) {
                this.getMyDashboards(() => {
                    this.SelectDashboardToEditModalRef.init();
                });
            }
            await this.setState({ refreshFlag: false, tabIndex: this.props.location.state.tabIndex });
            this.props.replace({
                pathname: this.props.location.pathname,
            });
            await this.setState({ refreshFlag: true });
        }
    }
    render() {
        return (
            <div className="web3go-create-page common-form">
                {/* <div className="p-side-bar">
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
                </div> */}

                {
                    !this.props.publicSpaceCollectionId || !this.state.refreshFlag ? <Spin style={
                        {
                            display: 'block', minHeight: 100, display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    }></Spin>
                        : (
                            <div className="p-main">
                                {
                                    this.state.tabIndex == 0 ?
                                        <CreateDataset {...this.props} changeTopTab={this.changeTab}></CreateDataset>
                                        :
                                        <CreateDashboard {...this.props} changeTopTab={this.changeTab}></CreateDashboard>
                                }
                            </div>
                        )
                }
                <SelectDashboardToEditModal {...this.props} onRef={(ref) => this.SelectDashboardToEditModalRef = ref} ></SelectDashboardToEditModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
