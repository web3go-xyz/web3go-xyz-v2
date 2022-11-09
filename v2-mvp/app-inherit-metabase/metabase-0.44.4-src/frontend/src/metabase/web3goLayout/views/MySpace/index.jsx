/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, Tabs, Typography } from '@arco-design/web-react';
import { push } from "react-router-redux";
import { IconEdit, IconSearch, IconArrowLeft, IconCheck } from '@arco-design/web-react/icon';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { LayoutLoginApi } from '@/services'
import event from '@/web3goLayout/event';
import UserHeadIcon from '@/web3goLayout/components/UserHeadIcon';
import DashBoardList from './DashBoardList';
import FollowersList from './FollowersList';
import moment from 'moment';
const mapStateToProps = state => {
    return {
        route: state.routing.locationBeforeTransitions,
        isDark: state.app.isDark,
        userData: state.app.userData
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
            // default,followers,following
            viewType: 'default',
            activeTab: '1',
            isMyself: true,
            userInfo: {},
            searchValue: '',
            dashboardListCount: 0,
            myFavouriteCount: 0,
        }
        this.DashboardRef = React.createRef();
    }
    componentDidMount() {
        if (this.props.userData.account) {
            this.getUserInfo();
        }
    }
    // componentDidUpdate(prevProps) {
    //     if (JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData)) {
    //         this.getUserInfo();
    //     }
    // }
    setDashboardListCount = (dashboardListCount) => {
        this.setState({
            dashboardListCount
        });
    }
    setMyFavouriteCount = (myFavouriteCount) => {
        this.setState({
            myFavouriteCount
        });
    }
    getUserInfo() {
        const accountId = this.props.route.query.accountId;
        if (accountId && accountId != this.props.userData.account.accountId) {
            LayoutLoginApi.searchAccountInfo({
                accountIds: [accountId],
                includeExtraInfo: true
            }).then(d => {
                this.setState({
                    isMyself: false,
                    userInfo: d[0].account
                })
            });
        } else {
            this.setState({
                isMyself: true,
                userInfo: this.props.userData.account
            })
        }
    }
    setActiveTab = (value) => {
        this.setState({
            activeTab: value
        });
    }
    handleSearch = () => {
        this.DashboardRef.getList(true);
    }
    render() {
        const { userInfo, isMyself, dashboardListCount, myFavouriteCount } = this.state;

        let main = (<div className="table-header">
            <Tabs activeTab={this.state.activeTab} onChange={this.setActiveTab}>
                <TabPane key='1' title={`Dashboard ${dashboardListCount}`}>
                </TabPane>
                <TabPane key='2' title={`My Favorites ${myFavouriteCount}`}>
                </TabPane>
            </Tabs>
            <DashBoardList
                isFavourite={this.state.activeTab == '2'}
                onRef={(ref) => this.DashboardRef = ref}
                accountId={userInfo.accountId}
                searchValue={this.state.searchValue}
                setDashboardListCount={this.setDashboardListCount}
                setMyFavouriteCount={this.setMyFavouriteCount}
            ></DashBoardList>
            <Input
                onChange={(value) => { this.setState({ searchValue: value }) }}
                className="search-input"
                allowClear
                onPressEnter={this.handleSearch}
                prefix={<IconSearch className="hover-item" onClick={this.handleSearch} />}
                placeholder='Search in my space'
            />
        </div>);
        if (this.state.viewType == 'followers') {
            main = (
                <div className="list-wrap">
                    <div className="l-header">
                        <IconArrowLeft onClick={() => { this.setState({ viewType: 'default' }) }} className="hover-item" />
                        <span>Followers 436</span>
                    </div>
                    <FollowersList></FollowersList>
                </div>
            )
        } else if (this.state.viewType == 'following') {
            main = (
                <div className="list-wrap">
                    <div className="l-header">
                        <IconArrowLeft onClick={() => { this.setState({ viewType: 'default' }) }} className="hover-item" />
                        <span>Following 583</span>
                    </div>
                    <FollowersList></FollowersList>
                </div>
            )
        }
        return (
            <div className="web3go-layout-myspace-page">
                <div className="common-layout bread-wrap">
                    {
                        this.state.isMyself ? (
                            <div className="common-bread">
                                <div className="item hover-primary" onClick={() => { this.props.push('/') }}>Home</div>
                                <div className="split">/</div>
                                <div className="item active">My Space</div>
                            </div>
                        ) : (
                            <div className="common-bread">
                                <div className="item hover-primary" onClick={() => { this.props.push('/') }}>Home</div>
                                <div className="split">/</div>
                                <div className="item hover-primary" onClick={() => { this.props.push('/layout/creatorList') }}>Creators</div>
                                <div className="split">/</div>
                                <div className="item active">{userInfo.nickName}</div>
                            </div>
                        )
                    }
                </div>
                <div className="big-bg" style={{ backgroundImage: `url(${this.props.isDark ? require("@/web3goLayout/assets/account/bg-b.png") : require("@/web3goLayout/assets/account/bg.png")})` }}></div>
                <div className="main-wrap common-layout">
                    <div className="side">
                        <div className="headicon-wrap">
                            <UserHeadIcon iconSize={116} fontSize={22} nickName='khuiy'></UserHeadIcon>
                        </div>
                        <div className="nickname">{userInfo.nickName}</div>
                        <div className="join-time">Joined on {moment(userInfo.created_time).format('YYYY/MM/DD')}</div>
                        <div className="btn-wrap">
                            {
                                isMyself ? (
                                    <Button onClick={() => { this.props.push('/layout/accountSetting') }}>
                                        <IconEdit />
                                        <span>Edit Profile</span>
                                    </Button>
                                ) : (
                                    <Button type="outline">
                                        <IconCheck />
                                        <span>Following</span>
                                    </Button>
                                )
                            }
                        </div>
                        <div className="follow-wrap">
                            <div className="follow-row">
                                <div className="f-left">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.54889 0.989502C4.65271 0.989502 3.11556 2.52666 3.11556 4.42283C3.11556 6.31902 4.65271 7.85618 6.54889 7.85618C8.44507 7.85618 9.98224 6.31902 9.98224 4.42283C9.98224 2.52666 8.44507 0.989502 6.54889 0.989502ZM4.31556 4.42283C4.31556 3.1894 5.31546 2.1895 6.54889 2.1895C7.78235 2.1895 8.78224 3.1894 8.78224 4.42283C8.78224 5.65627 7.78234 6.65618 6.54889 6.65618C5.31546 6.65618 4.31556 5.65627 4.31556 4.42283ZM7.98125 9.13991L8.07984 8.98597L2.71716 8.98638C1.83393 8.98638 1.11792 9.70235 1.11792 10.5856V10.9707C1.11792 11.5897 1.33876 12.1884 1.74073 12.6591C2.80969 13.911 4.43262 14.5204 6.54889 14.5204C7.17538 14.5204 7.75868 14.4671 8.29645 14.3588L8.4649 14.3249L8.35219 14.1952C8.11848 13.9262 7.91826 13.6276 7.75865 13.3055L7.7268 13.2412L7.6557 13.2507C7.31136 13.2971 6.94258 13.3204 6.54889 13.3204C4.74079 13.3204 3.46328 12.8284 2.65327 11.8798C2.43683 11.6264 2.31792 11.304 2.31792 10.9707V10.5856C2.31792 10.3651 2.49667 10.1864 2.71717 10.1864L7.49742 10.1862L7.5198 10.1169C7.63205 9.76947 7.78801 9.44166 7.98125 9.13991Z" fill="#86909C" />
                                        <path d="M11.3821 8.0105C13.315 8.0105 14.8821 9.57748 14.8821 11.5105C14.8821 13.4435 13.315 15.0105 11.3821 15.0105C9.44906 15.0105 7.88208 13.4435 7.88208 11.5105C7.88208 9.57748 9.44906 8.0105 11.3821 8.0105ZM9.69794 11.2855C9.57373 11.1612 9.37225 11.1612 9.24797 11.2855C9.12375 11.4098 9.12375 11.6112 9.24797 11.7355L10.5207 13.0082C10.645 13.1325 10.8465 13.1325 10.9707 13.0082L13.5161 10.4627C13.6404 10.3385 13.6404 10.137 13.5161 10.0128C13.3919 9.88847 13.1904 9.88847 13.0662 10.0128L10.7457 12.3332L9.69794 11.2855Z" fill="#86909C" />
                                    </svg>
                                    <span>Followers</span>
                                </div>
                                <div onClick={() => { this.setState({ viewType: 'followers' }) }} className="f-right hover-item">
                                    <span>583</span>
                                    <img src={require("@/web3goLayout/assets/account/right_arrow.png")} alt="" />
                                </div>
                            </div>
                            <div className="follow-row">
                                <div className="f-left">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.54889 0.989502C4.65271 0.989502 3.11556 2.52666 3.11556 4.42283C3.11556 6.31902 4.65271 7.85618 6.54889 7.85618C8.44507 7.85618 9.98224 6.31902 9.98224 4.42283C9.98224 2.52666 8.44507 0.989502 6.54889 0.989502ZM4.31556 4.42283C4.31556 3.1894 5.31546 2.1895 6.54889 2.1895C7.78235 2.1895 8.78224 3.1894 8.78224 4.42283C8.78224 5.65627 7.78234 6.65618 6.54889 6.65618C5.31546 6.65618 4.31556 5.65627 4.31556 4.42283ZM7.98125 9.13991L8.07984 8.98597L2.71716 8.98638C1.83393 8.98638 1.11792 9.70235 1.11792 10.5856V10.9707C1.11792 11.5897 1.33876 12.1884 1.74073 12.6591C2.80969 13.911 4.43262 14.5204 6.54889 14.5204C7.17538 14.5204 7.75868 14.4671 8.29645 14.3588L8.4649 14.3249L8.35219 14.1952C8.11848 13.9262 7.91826 13.6276 7.75865 13.3055L7.7268 13.2412L7.6557 13.2507C7.31136 13.2971 6.94258 13.3204 6.54889 13.3204C4.74079 13.3204 3.46328 12.8284 2.65327 11.8798C2.43683 11.6264 2.31792 11.304 2.31792 10.9707V10.5856C2.31792 10.3651 2.49667 10.1864 2.71717 10.1864L7.49742 10.1862L7.5198 10.1169C7.63205 9.76947 7.78801 9.44166 7.98125 9.13991Z" fill="#86909C" />
                                        <path d="M15 11.5C15 13.433 13.433 15 11.5 15C9.56698 15 8 13.433 8 11.5C8 9.56705 9.56698 8 11.5 8C13.433 8 15 9.56705 15 11.5ZM12.0431 9.68414C11.9189 9.55992 11.7174 9.55992 11.5932 9.68414C11.4689 9.80842 11.4689 10.0099 11.5932 10.1341L12.6409 11.1818H9.90909C9.73333 11.1818 9.59091 11.3243 9.59091 11.5C9.59091 11.6758 9.73333 11.8182 9.90909 11.8182H12.6409L11.5932 12.866C11.4689 12.9902 11.4689 13.1917 11.5932 13.3159C11.7174 13.4402 11.9189 13.4402 12.0431 13.3159L13.634 11.725C13.6679 11.6912 13.6925 11.6516 13.7079 11.6095C13.7198 11.5771 13.7266 11.5423 13.7272 11.5059L13.7273 11.5C13.7273 11.4509 13.7161 11.4044 13.6963 11.3629C13.6865 11.3425 13.6745 11.3229 13.6601 11.3046C13.6513 11.2932 13.6417 11.2825 13.6314 11.2724L12.0431 9.68414Z" fill="#86909C" />
                                    </svg>

                                    <span>Following</span>
                                </div>
                                <div onClick={() => { this.setState({ viewType: 'following' }) }} className="f-right hover-item">
                                    <span>1,577</span>
                                    <img src={require("@/web3goLayout/assets/account/right_arrow.png")} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="info">
                            <div className="item">
                                <div className="value">78,588</div>
                                <div className="label">Views</div>
                            </div>
                            <div className="item">
                                <div className="value">9,628,577</div>
                                <div className="label">Favorites</div>
                            </div>
                            <div className="item">
                                <div className="value">83,400</div>
                                <div className="label">Shares</div>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        {main}
                    </div>
                </div>
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
