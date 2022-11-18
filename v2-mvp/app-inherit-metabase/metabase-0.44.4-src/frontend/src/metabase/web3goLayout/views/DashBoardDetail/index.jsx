/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip } from '@arco-design/web-react';
import { IconLaunch, IconStar, IconSync, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import { changeUserData } from "metabase/redux/app";
import { changeGlobalSearchValue } from "metabase/redux/app";
import { LayoutDashboardApi, LayoutLoginApi } from '@/services'
import RelatedDashboardList from './RelatedDashboardList';
import CreatorList from '@/web3goLayout/components/CreatorList';
import event from '@/web3goLayout/event';
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import moment from 'moment';
import ShareModal from "@/web3goLayout/components/ShareModal";

const { Text } = Typography;
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData,
        globalSearchValue: state.app.globalSearchValue,
    }
};
const mapDispatchToProps = {
    push,
    changeUserData,
    changeGlobalSearchValue,
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myFollowingList: [],
            detailData: {
                name: '',
                tagList: [],
                nickName: '',
                createdAt: undefined
            },
            dashboardId: ''
        }
        this.ShareModalRef = React.createRef();
    }
    openShareModal() {
        this.ShareModalRef.init(this.state.detailData);
    }
    getAccountList = (accountIdList) => {
        LayoutLoginApi.searchAccountInfo({
            accountIds: accountIdList,
            includeExtraInfo: false
        }).then(d => {
            this.setState({
                accountList: d.map(v => v.account),
                tableData: d.list,
                detailData: {
                    ...d.list[0],
                    nickName: nickName
                }
            });
        });
    }
    componentDidMount() {
    }
    goMySpace = (accountId) => {
        this.props.push(`/layout/mySpace?accountId=${accountId}`);
    }
    getDashboardOriginId = (id) => {
        this.setState({
            dashboardId: id
        });
        LayoutDashboardApi.list({
            "pageSize": 10,
            "pageIndex": 1,
            "orderBys": [],
            "tagIds": [],
            "searchName": "",
            "creator": '',
            "dashboardIds": [id]
        }).then(d => {
            LayoutLoginApi.searchAccountInfo({
                accountIds: d.list.map(v => v.creatorAccountId),
                includeExtraInfo: false
            }).then(data => {
                this.setState({
                    detailData: {
                        ...d.list[0],
                        nickName: data[0].account.nickName
                    }
                });
            });
        });
    }
    render() {
        const { detailData } = this.state;
        return (
            <div className="web3go-dashboardDetail-page">
                {detailData.name ? (
                    <div className="white-bg">
                        <div className="common-layout">
                            <div className="common-bread">
                                <div className="item hover-primary" onClick={() => { this.props.push('/') }}>Home</div>
                                <div className="split">/</div>
                                <div className="item active">Dashboard</div>
                            </div>
                            <div className="info-wrap">
                                <div className="circle">
                                    <img src={require("@/web3goLayout/assets/dashboard/datasets.png")} alt="" />
                                </div>
                                <div className="info">
                                    <div className="title">{detailData.name}</div>
                                    <div className="tag-list">
                                        {
                                            detailData.tagList.map(v => (
                                                <div key={v.id} title={v.tagDescription} className="item">{v.tagName}</div>
                                            ))
                                        }
                                    </div>
                                    <div className="bottom">
                                        <span className="undeline hover-primary" onClick={() => this.goMySpace(detailData.creatorAccountId)}>
                                            {detailData.nickName}
                                        </span>
                                        <span> - {moment(detailData.createdAt).fromNow()}</span>
                                    </div>
                                    <div className="number-wrap">
                                        <span className="label">Views</span>
                                        <span className="value">{detailData.viewCount}</span>
                                        <span className="split"></span>
                                        <span className="label">Favorties</span>
                                        <span className="value">{detailData.favoriteCount}</span>
                                        <span className="split"></span>
                                        <span className="label">Shares</span>
                                        <span className="value">{detailData.shareCount}</span>
                                        <span className="split"></span>
                                        <span className="label">Forks</span>
                                        <span className="value">{detailData.forkCount}</span>
                                    </div>
                                </div>
                                <div className="operation-wrap">
                                    <Button onClick={() => { this.openShareModal() }}>
                                        <IconLaunch style={{ fontSize: 16 }} />
                                        <span>Share</span>
                                    </Button>
                                    <Button>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.50002 5V10M5.50002 11.1667V10M5.50002 10C5.50002 8.33333 11.8334 7.66667 11.8334 5M6.83335 3.33333C6.83335 3.68696 6.69288 4.02609 6.44283 4.27614C6.19278 4.52619 5.85364 4.66667 5.50002 4.66667C5.1464 4.66667 4.80726 4.52619 4.55721 4.27614C4.30716 4.02609 4.16669 3.68696 4.16669 3.33333C4.16669 2.97971 4.30716 2.64057 4.55721 2.39052C4.80726 2.14048 5.1464 2 5.50002 2C5.85364 2 6.19278 2.14048 6.44283 2.39052C6.69288 2.64057 6.83335 2.97971 6.83335 3.33333V3.33333ZM13.1667 3.33333C13.1667 3.68696 13.0262 4.02609 12.7762 4.27614C12.5261 4.52619 12.187 4.66667 11.8334 4.66667C11.4797 4.66667 11.1406 4.52619 10.8905 4.27614C10.6405 4.02609 10.5 3.68696 10.5 3.33333C10.5 2.97971 10.6405 2.64057 10.8905 2.39052C11.1406 2.14048 11.4797 2 11.8334 2C12.187 2 12.5261 2.14048 12.7762 2.39052C13.0262 2.64057 13.1667 2.97971 13.1667 3.33333V3.33333ZM6.83335 12.6667C6.83335 13.0203 6.69288 13.3594 6.44283 13.6095C6.19278 13.8595 5.85364 14 5.50002 14C5.1464 14 4.80726 13.8595 4.55721 13.6095C4.30716 13.3594 4.16669 13.0203 4.16669 12.6667C4.16669 12.313 4.30716 11.9739 4.55721 11.7239C4.80726 11.4738 5.1464 11.3333 5.50002 11.3333C5.85364 11.3333 6.19278 11.4738 6.44283 11.7239C6.69288 11.9739 6.83335 12.313 6.83335 12.6667V12.6667Z" stroke="#6B7785" strokeWidth="1.33" />
                                        </svg>
                                        <span>Fork</span>
                                    </Button>
                                    <Button>
                                        <IconStar style={{ fontSize: 16 }} />
                                        <span>Favorite</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="common-layout">
                    <div className="dashboard-top">
                        <div className="left">
                            <Button type="primary">
                                <IconSync style={{ fontSize: 16 }} />
                                <span>Refresh</span>
                            </Button>
                            <Button type="secondary">
                                <IconCamera style={{ fontSize: 16 }} />
                                <span>Screenshot</span>
                            </Button>
                        </div>
                        <span className="time">Last run time:  2022-12-08 17:23</span>
                    </div>
                    <div className="dashboard-wrap">
                        <PublicDashboard getDashboardOriginId={this.getDashboardOriginId} {...this.props}></PublicDashboard>
                    </div>
                    <div className="relatedDashboardList-wrap">
                        <div className="r-title">
                            <span>

                                Related Dashboards
                            </span>
                            <Tooltip content='dashboards with same labels'>
                                <IconInfoCircle />
                            </Tooltip>
                        </div>
                        <RelatedDashboardList myFollowingList={this.state.myFollowingList}></RelatedDashboardList>
                    </div>

                </div>
                <ShareModal onRef={(ref) => this.ShareModalRef = ref}></ShareModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
