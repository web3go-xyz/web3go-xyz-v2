/* eslint-disable react/prop-types */
import React from "react";
import slugg from "slugg";
import { connect } from "react-redux";
import './index.less';
import { Alert, Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import { changeUserData, changeMyDashboardList } from "metabase/redux/app";
import { changeGlobalSearchValue } from "metabase/redux/app";
import { LayoutDashboardApi, LayoutLoginApi } from '@/services'
import RelatedDashboardList from './RelatedDashboardList';
import CreatorList from '@/web3goLayout/components/CreatorList';
import event from '@/web3goLayout/event';
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import moment from 'moment';
import ShareModal from "@/web3goLayout/components/ShareModal";
import domtoimage from 'dom-to-image';
import { copy } from '@/web3goLayout/utils'
import { WEB3GO_DOMAIN } from '@/services';

const { Text } = Typography;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        globalSearchValue: state.app.globalSearchValue,
    }
};
const mapDispatchToProps = {
    push,
    changeUserData,
    changeGlobalSearchValue,
    changeMyDashboardList
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 用来刷新
            showPublicDashboard: true,
            screenShortLoading: false,
            myFollowingList: [],
            favouriteList: [],
            detailData: {
                name: '',
                tagList: [],
                nickName: '',
                createdAt: undefined
            },
            dashboardId: '',
            refreshTime: moment().format('YYYY-MM-DD HH:mm')
        }
        this.ShareModalRef = React.createRef();
    }
    openShareModal() {
        this.ShareModalRef.init(this.state.detailData);
    }
    getMyFavourites = () => {
        if (!this.props.currentUser) {
            return;
        }
        LayoutDashboardApi.listMyFavorites({
            "pageSize": 9999999999,
            "pageIndex": 1,
            "orderBys": [],
            "accountId": this.props.userData.account.accountId,
            "searchName": ""
        }).then(d => {
            this.setState({
                favouriteList: d.list
            });
        });
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
        this.getMyDashboards();
    }
    getMyDashboards = () => {
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
        });
    }
    goMySpace = (accountId) => {
        this.props.push(`/layout/mySpace?accountId=${accountId}`);
    }
    fork = () => {
        if (!this.props.currentUser) {
            event.emit('goSignIn');
            return;
        }
        const newName = this.state.detailData.name + '-fork';
        LayoutDashboardApi.forkDashboard({
            originalDashboardId: this.state.detailData.id,
            description: newName,
            new_dashboard_name: newName
        }).then(d => {
            const slug = slugg(newName);
            const suffix = slug ? `${d.newDashboardId}-${slug}` : d.newDashboardId;
            this.props.push({ pathname: `/layout/create/dashboard/${suffix}`, state: { tabIndex: 1 } });
        })
    }
    toggleFavourite = () => {
        if (!this.props.currentUser) {
            event.emit('goSignIn');
            return;
        }
        const find = this.state.favouriteList.find(v => v.dashboardId == this.state.detailData.id);
        LayoutDashboardApi.logFavorite({
            "dashboardId": this.state.detailData.id,
            "operationFlag": find ? 'cancel' : 'add'
        }).then(d => {
            this.getMyFavourites();
        });
    }
    handleScreenshot = () => {
        this.setState({
            screenShortLoading: true
        });
        const el = document.getElementById('dashboard-detail-screenshort');
        domtoimage.toPng(el, {
            bgcolor: 'rgb(250,251,252)',
        })
            .then((dataUrl) => {
                var link = document.createElement('a');
                link.download = this.state.detailData.name + '.png';
                link.href = dataUrl;
                link.click();
                this.setState({
                    screenShortLoading: false
                });
                // const canvas1 = document.createElement("canvas");
                // // const canvas1 = document.getElementById("myCanvas");
                // // 设置宽高
                // canvas1.width = el.offsetWidth; //注意：没有单位
                // canvas1.height = el.offsetHeight; //注意：没有单位
                // const initalImg = new Image();
                // initalImg.crossOrigin = "anonymous"
                // initalImg.src = dataUrl; //由于图片异步加载，一定要等initalImg加载好，再设置src属性
                // initalImg.onload = () => {
                //     const iconImg = new Image();
                //     iconImg.crossOrigin = "anonymous"
                //     iconImg.src = require("@/web3goLayout/assets/layout/logo-white.png");
                //     iconImg.onload = () => {
                //         const ctx = canvas1.getContext("2d");
                //         // 绘制图片
                //         ctx.drawImage(initalImg, 0, 0);
                //         //水印文字添加
                //         // ctx.font = "14px Calibri";
                //         // ctx.fillStyle = "rgba(0,0,0,0.8)";
                //         // ctx.fillText("水印文字", 0, 14);
                //         // 绘制水印
                //         ctx.globalAlpha = 0.2;
                //         ctx.drawImage(iconImg, 0, el.offsetHeight - 68, 255, 68);
                //         const url = canvas1.toDataURL();
                //         var link = document.createElement('a');
                //         link.download = this.state.detailData.name + '.png';
                //         link.href = url;
                //         link.click();
                //         this.setState({
                //             screenShortLoading: false
                //         });
                //     };
                // };
            });
    }
    handleRefresh = () => {
        LayoutDashboardApi.refresh({
            "dashboardIds": [this.state.detailData.id]
        }).then(d => {
            this.setState({
                showPublicDashboard: false
            }, () => {
                this.setState({
                    showPublicDashboard: true,
                    refreshTime: moment().format('YYYY-MM-DD HH:mm')
                });
            })
        });
    }
    getDashboardOriginId = (id) => {
        this.setState({
            dashboardId: id
        });
        this.getMyFavourites();
        LayoutDashboardApi.detail({
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
    openEmbedModal = () => {
        Modal.confirm({
            wrapClassName: 'common-confirm-modal',
            closable: true,
            title: 'Embed',
            content:
                <div>
                    <div style={{ marginBottom: 8 }}>Embed this dashboard in blog posts or web pages by copying and pasting this snippet:</div>
                    <Alert
                        showIcon={false}
                        type='info'
                        content={`<iframe src="${WEB3GO_DOMAIN}public/dashboard/${this.state.detailData.publicUUID}" frameborder="0" width="1440" height="800" allowtransparency></iframe>`}
                    />
                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                        <Button type="primary" onClick={() => { copy(`<iframe src="${WEB3GO_DOMAIN}public/dashboard/${this.state.detailData.publicUUID}" frameborder="0" width="1440" height="800" allowtransparency></iframe>`) }}>
                            copy
                        </Button>
                    </div>
                </div>,
            footer: null
        });
    }
    render() {
        const { detailData, refreshTime } = this.state;
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
                                    <img src={require("@/web3goLayout/assets/dashboard/Dashboard-line.png")} alt="" />
                                </div>
                                <div className="info">
                                    <div className="title">
                                        <span>
                                            {detailData.name}
                                        </span>
                                        {
                                            detailData.publicUUID ? null : <div className="draft">Draft</div>
                                        }
                                    </div>
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
                                {detailData.publicUUID ? (
                                    <div className="operation-wrap">
                                        {
                                            detailData.publicUUID && <Button onClick={() => { this.openEmbedModal() }}>
                                                <span>Embed</span>
                                            </Button>
                                        }
                                        <Button onClick={() => { this.openShareModal() }}>
                                            <IconLaunch style={{ fontSize: 16 }} />
                                            <span>Share</span>
                                        </Button>
                                        <Button onClick={() => { this.fork() }}>
                                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.50002 5V10M5.50002 11.1667V10M5.50002 10C5.50002 8.33333 11.8334 7.66667 11.8334 5M6.83335 3.33333C6.83335 3.68696 6.69288 4.02609 6.44283 4.27614C6.19278 4.52619 5.85364 4.66667 5.50002 4.66667C5.1464 4.66667 4.80726 4.52619 4.55721 4.27614C4.30716 4.02609 4.16669 3.68696 4.16669 3.33333C4.16669 2.97971 4.30716 2.64057 4.55721 2.39052C4.80726 2.14048 5.1464 2 5.50002 2C5.85364 2 6.19278 2.14048 6.44283 2.39052C6.69288 2.64057 6.83335 2.97971 6.83335 3.33333V3.33333ZM13.1667 3.33333C13.1667 3.68696 13.0262 4.02609 12.7762 4.27614C12.5261 4.52619 12.187 4.66667 11.8334 4.66667C11.4797 4.66667 11.1406 4.52619 10.8905 4.27614C10.6405 4.02609 10.5 3.68696 10.5 3.33333C10.5 2.97971 10.6405 2.64057 10.8905 2.39052C11.1406 2.14048 11.4797 2 11.8334 2C12.187 2 12.5261 2.14048 12.7762 2.39052C13.0262 2.64057 13.1667 2.97971 13.1667 3.33333V3.33333ZM6.83335 12.6667C6.83335 13.0203 6.69288 13.3594 6.44283 13.6095C6.19278 13.8595 5.85364 14 5.50002 14C5.1464 14 4.80726 13.8595 4.55721 13.6095C4.30716 13.3594 4.16669 13.0203 4.16669 12.6667C4.16669 12.313 4.30716 11.9739 4.55721 11.7239C4.80726 11.4738 5.1464 11.3333 5.50002 11.3333C5.85364 11.3333 6.19278 11.4738 6.44283 11.7239C6.69288 11.9739 6.83335 12.313 6.83335 12.6667V12.6667Z" stroke="#6B7785" strokeWidth="1.33" />
                                            </svg>
                                            <span>Fork</span>
                                        </Button>
                                        <Button onClick={() => { this.toggleFavourite() }}>
                                            <IconStar style={{ fontSize: 16 }} className={this.state.favouriteList.find(v => v.dashboardId == this.state.detailData.id) ? 'star active' : 'star'} />
                                            <span>Favorite</span>
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="common-layout">
                    <div className="dashboard-top">
                        <div className="left">
                            <Button type="primary" onClick={this.handleRefresh}>
                                <IconSync style={{ fontSize: 16 }} />
                                <span>Refresh</span>
                            </Button>
                            <Button type="secondary" onClick={this.handleScreenshot}>
                                <IconCamera style={{ fontSize: 16 }} />
                                <span>Screenshot</span>
                            </Button>
                        </div>
                        <span className="time">Last run time:  {refreshTime}</span>
                    </div>
                    <div id="dashboard-detail-screenshort" className="dashboard-wrap">
                        {this.state.showPublicDashboard ?
                            <PublicDashboard getDashboardOriginId={this.getDashboardOriginId} {...this.props}></PublicDashboard>
                            : ''
                        }
                    </div>
                    {detailData.publicUUID ? (
                        <div className="relatedDashboardList-wrap">
                            <div className="r-title">
                                <span>
                                    Related Dashboards
                                </span>
                                <Tooltip content='dashboards with same labels'>
                                    <IconInfoCircle />
                                </Tooltip>
                            </div>
                            {
                                detailData.id ? <RelatedDashboardList detailData={detailData} myFollowingList={this.state.myFollowingList}></RelatedDashboardList> : null
                            }

                        </div>
                    ) : null}
                </div>
                {
                    this.state.screenShortLoading ? (<div className="loading-wrap">
                        <div className="box">
                            <IconSync spin style={{ fontSize: 16 }} />
                            <span>
                                Taking screenshot…
                            </span>
                        </div>
                    </div>) : null
                }

                <ShareModal onRef={(ref) => this.ShareModalRef = ref}></ShareModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
