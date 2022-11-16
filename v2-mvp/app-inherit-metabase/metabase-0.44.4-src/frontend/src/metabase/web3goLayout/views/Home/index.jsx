/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Carousel, Spin } from '@arco-design/web-react';
import { push } from "react-router-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import event from '@/web3goLayout/event';
import { IconPlus, IconCheck } from '@arco-design/web-react/icon';
import UserHeadIcon from '@/web3goLayout/components/UserHeadIcon';
import { numberSplit } from '@/web3goLayout/utils';
import { LayoutLoginApi, LayoutDashboardApi, LayoutCreatorApi } from '@/services';
import DashBoardList from '@/web3goLayout/components/DashBoardList';
const mapStateToProps = state => {
    return {
        userData: state.app.userData,
        isDark: state.app.isDark,
        currentUser: state.currentUser,
    }
};
const mapDispatchToProps = {
    push
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dashboardListCount: 0,
            myFavouriteCount: 0,
            slideList: [
                require("@/web3goLayout/assets/home/banner.png"),
                require("@/web3goLayout/assets/home/banner.png"),
                require("@/web3goLayout/assets/home/banner.png"),
                require("@/web3goLayout/assets/home/banner.png"),
            ],
            creatorList: [],
            myFollowingList: [],
            creatorListLoading: false
        }
    }
    componentDidMount() {
        this.getDashboardListCount();
        this.getCreatorList();
        this.listMyFollows();
    }
    // componentDidUpdate(prevProps) {
    //     if (JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData)) {
    //         this.getDashboardListCount();
    //     }
    // }
    listMyFollows = () => {
        if (!this.props.userData.account) {
            return;
        }
        LayoutCreatorApi.listFollowing({
            "pageSize": 9999999999,
            "pageIndex": 1,
            "orderBys": [],
            "account_id": this.props.userData.account.accountId,
            "includeDetail": true
        }).then(d => {
            this.followUnLoading();
            this.setState({
                myFollowingList: d.list
            })
        });
    }
    getCreatorList = () => {
        this.setState({
            creatorListLoading: true
        });
        LayoutCreatorApi.listCreators({
            "pageSize": 6,
            "pageIndex": 1,
            "orderBys": [{
                sort: 'dashboard_count',
                order: 'DESC'
            }]
        }
        ).then(d => {
            LayoutLoginApi.searchAccountInfo({
                accountIds: d.list.map(v => v.creator_account_id),
                includeExtraInfo: false
            }).then(data => {
                this.setState({
                    creatorListLoading: false,
                    creatorList: d.list.map(v => {
                        const find = data.find(sv => sv.account.accountId == v.creator_account_id)
                        return {
                            ...v,
                            ...find.account
                        }
                    })
                });

            });
        })
    }
    getDashboardListCount = () => {
        if (!this.props.userData.account) {
            return;
        }
        LayoutDashboardApi.list({
            "pageSize": 10,
            "pageIndex": 1,
            "creator": this.props.userData.account.accountId,
        }).then(d => {
            this.setState({
                dashboardListCount: d.totalCount
            })
        });
    }
    goSignIn = () => {
        event.emit('goSignIn');
    }
    setMyFavouriteCount = (myFavouriteCount) => {
        this.setState({
            myFavouriteCount
        });
    }
    followLoading = (v) => {
        const newCreatorList = JSON.parse(JSON.stringify(this.state.creatorList));
        newCreatorList.forEach(sv => {
            if (sv.accountId == v.accountId) {
                sv.loading = true;
            }
        });
        this.setState({
            creatorList: newCreatorList
        });
    }
    followUnLoading = () => {
        const newCreatorList = JSON.parse(JSON.stringify(this.state.creatorList));
        newCreatorList.forEach(sv => {
            sv.loading = false;
        });
        this.setState({
            creatorList: newCreatorList
        });
    }
    handleFollow = (v) => {
        if (!this.props.userData.account) {
            this.goSignIn();
            return;
        }
        this.followLoading(v);
        LayoutCreatorApi.follow({
            "targetAccountId": v.accountId
        }).then(d => {
            this.listMyFollows();
        });
    }
    handleUnfollow = (v) => {
        const newCreatorList = JSON.parse(JSON.stringify(this.state.creatorList));
        this.followLoading(v);
        LayoutCreatorApi.unfollow({
            "targetAccountId": v.accountId
        }).then(d => {
            this.listMyFollows();
        });
    }

    render() {
        return (
            <div className="web3go-layout-home-page">
                <div className="banner-wrap">
                    <div className="common-layout">
                        <Carousel
                            showArrow='never'
                            autoPlay={true}
                            moveSpeed={1500}
                            style={{ height: 350 }}
                            indicatorType="line"
                        >
                            {this.state.slideList.map((v, index) => (
                                <div className="slide-item" key={index} style={{ backgroundImage: `url(${v})` }}>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div >
                <div className="home-main common-layout">
                    <div className="section-title">
                        <span>My Space</span>
                        {
                            this.props.currentUser ? (
                                <svg onClick={() => { this.props.push('/layout/mySpace') }} className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.24269 3.75667L13.4854 7.99933L9.24269 12.242M1.66669 8H13.0984" strokeWidth="1.5" />
                                </svg>
                            ) : null
                        }
                    </div>
                    {
                        !this.props.currentUser ? (
                            <div className="signin-wrap" style={{ backgroundImage: this.props.isDark ? `url(${require("@/web3goLayout/assets/home/Conten1.png")})` : `url(${require("@/web3goLayout/assets/home/Conten.png")})` }}>
                                <div className="left">
                                    <div className="title">Create your own analytics and build personal space </div>
                                    <div className="sub-title">sign in to unlock more access</div>
                                </div>
                                <div className="right">
                                    <Button type='primary' onClick={this.goSignIn}>Sign in</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="section-content info">
                                <div className="info-item">
                                    <div className="i-left">
                                        <div className="circle">
                                            <img src={require("@/web3goLayout/assets/home/info1.png")} alt="" />
                                        </div>
                                        <div className="text-wrap">
                                            <div className="label">Dashboards</div>
                                            <div className="value">{numberSplit(this.state.dashboardListCount)}</div>
                                        </div>
                                    </div>
                                    {
                                        this.props.isDark ?
                                            <img src={require("@/web3goLayout/assets/home/info11-b.png")} alt="" />
                                            :
                                            <img src={require("@/web3goLayout/assets/home/info11.png")} alt="" />
                                    }
                                </div >
                                {/* <div className="info-item hover-item">
                                    <div className="i-left">
                                        <div className="circle">
                                            <img src={require("@/web3goLayout/assets/home/info2.png")} alt="" />
                                        </div>
                                        <div className="text-wrap">
                                            <div className="label">Datasets</div>
                                            <div className="value">800,246</div>
                                        </div>
                                    </div>
                                    <img src={require("@/web3goLayout/assets/home/info22.png")} alt="" />
                                </div> */}
                                <div className="info-item">
                                    <div className="i-left">
                                        <div className="circle">
                                            <img src={require("@/web3goLayout/assets/home/info3.png")} alt="" />
                                        </div>
                                        <div className="text-wrap">
                                            <div className="label">My Favorites</div>
                                            <div className="value">{numberSplit(this.state.myFavouriteCount)}</div>
                                        </div>
                                    </div>
                                    {
                                        this.props.isDark ?
                                            <img src={require("@/web3goLayout/assets/home/info33-b.png")} alt="" />
                                            :
                                            <img src={require("@/web3goLayout/assets/home/info33.png")} alt="" />
                                    }
                                </div>
                                <div className="btn hover-item" onClick={() => { this.props.push('/home'); }}>
                                    <img src={require("@/web3goLayout/assets/home/add.png")} alt="" />
                                    <span>New Dashboard</span>
                                </div>
                            </div >
                        )
                    }
                    <div className="section-title">
                        <span>Dashboard</span>
                        <svg onClick={() => { this.props.push('/layout/dashboardList') }} className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.24269 3.75667L13.4854 7.99933L9.24269 12.242M1.66669 8H13.0984" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div className="section-content">
                        <DashBoardList myFollowingList={this.state.myFollowingList} setMyFavouriteCount={this.setMyFavouriteCount}></DashBoardList>
                    </div>
                    <div className="section-title">
                        <span>Top Creators</span>
                        <svg onClick={() => { this.props.push('/layout/creatorList') }} className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.24269 3.75667L13.4854 7.99933L9.24269 12.242M1.66669 8H13.0984" strokeWidth="1.5" />
                        </svg>
                    </div>
                    {
                        this.state.creatorListLoading ? (
                            <div className="section-content creator-list spin">
                                <Spin></Spin>
                            </div>
                        ) : (
                            <div className="section-content creator-list">
                                {this.state.creatorList.slice(0, 6).map((v, i) => (
                                    <div key={i} className={"item" + (i == 0 ? ' active' : '')}>
                                        <div className="i-top">
                                            <div className="headicon-wrap">
                                                <img className="icon" src={require(`@/web3goLayout/assets/home/${i + 1}.png`)} alt="" />
                                                <span className="rank">{i + 1}</span>
                                                <UserHeadIcon className="headicon" iconSize={64} fontSize={18} avatar={v.avatar} nickName={v.nickName}></UserHeadIcon>
                                            </div>
                                            <div className="it-right">
                                                <div className="name" title={v.nickName}>{v.nickName}</div>
                                                <div className="btn-wrap">
                                                    {
                                                        v.loading ? (
                                                            <div className="btn hover-item spin" >
                                                                <Spin />
                                                                <span className="text">loading</span>
                                                            </div>
                                                        ) :
                                                            (
                                                                this.state.myFollowingList.find(sv => sv.accountId == v.creator_account_id) ? (
                                                                    <div className="btn hover-item" onClick={() => { this.handleUnfollow(v) }}>
                                                                        <IconCheck />
                                                                        <span className="text">Following</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="btn hover-item" onClick={() => { this.handleFollow(v) }}>
                                                                        <IconPlus />
                                                                        <span className="text">Follow</span>
                                                                    </div>
                                                                )
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="i-bottom">
                                            <span className="label">Dashboards</span>
                                            <span className="value">{numberSplit(v.dashboard_count)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div >
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
