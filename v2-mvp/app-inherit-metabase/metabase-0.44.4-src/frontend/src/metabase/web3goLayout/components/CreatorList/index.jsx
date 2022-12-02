/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { IconDown, IconClose } from '@arco-design/web-react/icon';
import { Button, Modal, Form, Input, Upload, Select, Pagination, Spin } from '@arco-design/web-react';
import { push } from "react-router-redux";
import UserHeadIcon from '@/web3goLayout/components/UserHeadIcon';
import { IconPlus, IconCheck } from '@arco-design/web-react/icon';
import { numberSplit } from '@/web3goLayout/utils';
import ShareModal from "@/web3goLayout/components/ShareModal";
import { LayoutLoginApi, LayoutDashboardApi, LayoutCreatorApi } from '@/services';
import event from '@/web3goLayout/event';

const Option = Select.Option;
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData,
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
            shareVisible: false,
            filterList: [{
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.364554 7.60167C2.51446 4.17184 5.0473 2.25 8.00003 2.25C10.9528 2.25 13.4856 4.17184 15.6355 7.60167L15.8852 8L15.6355 8.39833C13.4856 11.8282 10.9528 13.75 8.00003 13.75C5.0473 13.75 2.51446 11.8282 0.364554 8.39833L0.114868 8L0.364554 7.60167ZM1.89178 8C3.84401 10.9548 5.89092 12.25 8.00003 12.25C10.1091 12.25 12.1561 10.9548 14.1083 8C12.1561 5.04516 10.1091 3.75 8.00003 3.75C5.89092 3.75 3.84401 5.04516 1.89178 8Z" fill="#6B7785" />
                    <path d="M9.66671 7.99998C9.66671 8.44201 9.49111 8.86593 9.17855 9.17849C8.86599 9.49105 8.44207 9.66665 8.00004 9.66665C7.55801 9.66665 7.13409 9.49105 6.82153 9.17849C6.50897 8.86593 6.33337 8.44201 6.33337 7.99998C6.33337 7.55795 6.50897 7.13403 6.82153 6.82147C7.13409 6.50891 7.55801 6.33331 8.00004 6.33331C8.44207 6.33331 8.86599 6.50891 9.17855 6.82147C9.49111 7.13403 9.66671 7.55795 9.66671 7.99998Z" fill="#6B7785" />
                </svg>,
                name: 'Views',
                key: 'total_view_count'
            }, {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5625 8.6544V13.2353C13.5625 13.3221 13.528 13.4053 13.4667 13.4667C13.4053 13.528 13.3221 13.5625 13.2353 13.5625H2.76465C2.67787 13.5625 2.59464 13.528 2.53328 13.4667C2.47191 13.4053 2.43744 13.3221 2.43744 13.2353V2.76465C2.43744 2.67787 2.47191 2.59464 2.53328 2.53328C2.59464 2.47191 2.67787 2.43744 2.76465 2.43744H7.34556M6.6329 9.36706L13.2023 2.79737M13.5625 6.69115V2.43744H9.30881" stroke="#6B7785" strokeWidth="1.33333" />
                </svg>,
                name: 'Share',
                key: 'total_share_count'
            }, {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.83849 2.32133C7.85338 2.29241 7.87638 2.26806 7.90488 2.25104C7.93339 2.23402 7.96626 2.225 7.99981 2.225C8.03335 2.225 8.06623 2.23402 8.09473 2.25104C8.12324 2.26806 8.14623 2.29241 8.16113 2.32133L9.96879 5.84583C9.98167 5.87104 10.0007 5.89285 10.0243 5.90939C10.0479 5.92593 10.0753 5.93671 10.1042 5.94079L14.1458 6.50603C14.1791 6.51068 14.2103 6.52419 14.236 6.54503C14.2617 6.56588 14.2808 6.59323 14.2912 6.62399C14.3016 6.65475 14.3028 6.68769 14.2948 6.71909C14.2867 6.75048 14.2697 6.77908 14.2456 6.80164L11.3209 9.545C11.3001 9.56465 11.2845 9.5889 11.2755 9.61564C11.2665 9.64239 11.2644 9.67084 11.2694 9.69853L11.9597 13.5724C11.9654 13.6042 11.9617 13.637 11.9491 13.667C11.9364 13.697 11.9153 13.7229 11.8881 13.742C11.8608 13.761 11.8287 13.7723 11.7951 13.7746C11.7616 13.7769 11.728 13.7701 11.6983 13.755L8.08371 11.9259C8.05784 11.9127 8.02905 11.9059 7.99981 11.9059C7.97057 11.9059 7.94178 11.9127 7.91591 11.9259L4.30167 13.755C4.27194 13.7701 4.2384 13.7769 4.20486 13.7746C4.17133 13.7723 4.13913 13.761 4.11192 13.742C4.08472 13.7229 4.06358 13.697 4.05091 13.667C4.03825 13.637 4.03455 13.6042 4.04025 13.5724L4.7309 9.69853C4.73586 9.67081 4.73372 9.64234 4.72469 9.6156C4.71565 9.58885 4.69999 9.56462 4.67905 9.545L1.75439 6.80164C1.73031 6.77906 1.71329 6.75043 1.70524 6.71901C1.6972 6.68759 1.69845 6.65463 1.70887 6.62386C1.71929 6.59309 1.73846 6.56575 1.76419 6.54492C1.78993 6.5241 1.82121 6.51062 1.8545 6.50603L5.8958 5.94114C5.92467 5.93706 5.95208 5.92628 5.97567 5.90974C5.99926 5.8932 6.01831 5.87138 6.03119 5.84618L7.83885 2.32168L7.83849 2.32133Z" stroke="#6B7785" strokeWidth="1.33" />
                </svg>,
                name: 'Favorite',
                key: 'total_favorite_count'
            }, {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.54877 0.989532C4.65259 0.989532 3.11544 2.52669 3.11544 4.42287C3.11544 6.31905 4.65259 7.85621 6.54877 7.85621C8.44495 7.85621 9.98212 6.31905 9.98212 4.42287C9.98212 2.52669 8.44495 0.989532 6.54877 0.989532ZM4.31544 4.42287C4.31544 3.18943 5.31533 2.18953 6.54877 2.18953C7.78222 2.18953 8.78212 3.18943 8.78212 4.42287C8.78212 5.6563 7.78222 6.65621 6.54877 6.65621C5.31533 6.65621 4.31544 5.6563 4.31544 4.42287ZM7.98113 9.13994L8.07972 8.986L2.71704 8.98641C1.8338 8.98641 1.1178 9.70238 1.1178 10.5857V10.9707C1.1178 11.5898 1.33864 12.1884 1.74061 12.6592C2.80957 13.911 4.4325 14.5205 6.54877 14.5205C7.17525 14.5205 7.75856 14.4671 8.29633 14.3588L8.46478 14.3249L8.35207 14.1952C8.11835 13.9263 7.91814 13.6276 7.75852 13.3055L7.72668 13.2412L7.65558 13.2508C7.31123 13.2971 6.94246 13.3205 6.54877 13.3205C4.74067 13.3205 3.46316 12.8284 2.65315 11.8799C2.43671 11.6264 2.3178 11.3041 2.3178 10.9707V10.5857C2.3178 10.3652 2.49655 10.1864 2.71705 10.1864L7.4973 10.1862L7.51967 10.117C7.63193 9.7695 7.78789 9.44169 7.98113 9.13994Z" fill="#6B7785" />
                    <path d="M8.89454 10.9319L8.89445 10.932C8.57514 11.2515 8.57501 11.7694 8.89454 12.089L10.1673 13.3617C10.4867 13.6812 11.0048 13.6813 11.3243 13.3617C11.3244 13.3617 11.3244 13.3616 11.3244 13.3616L13.8697 10.8163C14.0243 10.6618 14.1041 10.4608 14.1092 10.2583C14.2845 10.6394 14.3822 11.0635 14.3822 11.5105C14.3822 13.1673 13.039 14.5105 11.3822 14.5105C9.72533 14.5105 8.3822 13.1673 8.3822 11.5105C8.3822 9.85359 9.72533 8.51047 11.3822 8.51047C12.2529 8.51047 13.0369 8.88138 13.5849 9.47381C13.2925 9.36154 12.9485 9.42339 12.7127 9.65917L10.7458 11.6261L10.0517 10.932C10.0517 10.932 10.0516 10.9319 10.0516 10.9319C9.73205 10.6123 9.214 10.6124 8.89454 10.9319Z" fill="#6B7785" stroke="#6B7785" />
                </svg>,
                name: 'Followers',
                key: 'followed_account_count'
            }],
            currentFilter: { name: '' },
            tableData: [],
            myFollowingList: [],
            loading: false,
            pagination: {
                total: 0,
                pageSize: 10,
                current: 1,
                onChange: (current) => {
                    this.setState((state) => {
                        return {
                            pagination: {
                                ...state.pagination,
                                current
                            }
                        }
                    }, () => {
                        this.getList();
                    });
                }
            }
        }
    }
    componentDidMount() {
        this.getList();
        this.listMyFollows();
    }
    refreshCreatorListAndMyFollowsList() {
        this.getList();
        this.listMyFollows();
    }
    changeFilter = (v) => {
        const find = this.state.filterList.find(sv => sv.name == v)
        this.setState({
            currentFilter: find || { name: '' }
        }, () => {
            this.getList(true);
        });
    }
    clearFilter = (e) => {
        e.stopPropagation();
        this.setState({
            currentFilter: { name: '' }
        }, () => {
            this.getList(true);
        });
    }
    getList = (turnFirstPage) => {
        this.setState({
            loading: true,
        });
        if (turnFirstPage) {
            this.setState({
                pagination: { ...this.state.pagination, current: 1 }
            });
        }
        LayoutCreatorApi.listCreators({
            "pageSize": this.state.pagination.pageSize,
            "pageIndex": turnFirstPage ? 1 : this.state.pagination.current,
            "orderBys": this.state.currentFilter.name ? [{
                sort: this.state.currentFilter.key,
                order: 'DESC'
            }] : []
        }).then(d => {
            LayoutLoginApi.searchAccountInfo({
                accountIds: d.list.map(v => v.creator_account_id),
                includeExtraInfo: false
            }).then(data => {
                this.setState({
                    loading: false,
                    pagination: { ...this.state.pagination, total: d.totalCount },
                    tableData: d.list.map(v => {
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
            this.setState({
                myFollowingList: d.list
            })
        });
    }
    goSignIn = () => {
        event.emit('goSignIn');
    }
    handleFollow = (v) => {
        if (!this.props.userData.account) {
            this.goSignIn();
            return;
        }
        LayoutCreatorApi.follow({
            "targetAccountId": v.creator_account_id
        }).then(d => {
            this.refreshCreatorListAndMyFollowsList();
        });
    }
    handleUnfollow = (v) => {
        LayoutCreatorApi.unfollow({
            "targetAccountId": v.creator_account_id
        }).then(d => {
            this.refreshCreatorListAndMyFollowsList();
        });
    }
    goMySpace = (accountId) => {
        this.props.push(`/layout/mySpace?accountId=${accountId}`);
    }
    render() {
        return (
            <div className="web3go-layout-home-creator-list">
                <div className="sort-row">
                    <div className="sort-wrap">
                        <Select
                            dropdownMenuClassName="web3go-layout-home-creator-list-sort"
                            onChange={this.changeFilter}
                            triggerElement={
                                <div className={'select-wrap' + (this.state.currentFilter.name ? ' hasvalue' : '')}>
                                    <img src={require("@/web3goLayout/assets/home/trending.png")} alt="" />
                                    <span className="text">
                                        {this.state.currentFilter.name || 'Sort by'}
                                    </span>
                                    <IconDown className="down" />
                                    <IconClose className="close" onClick={this.clearFilter} />
                                </div>
                            }
                        >
                            {
                                this.state.filterList.map((v, i) => (
                                    <Option key={i} value={v.name}>
                                        {v.icon}
                                        <span>{v.name}</span>
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                    <span className="total">{this.state.tableData.length} creators on Web3go</span>
                </div>
                <div className="table-list">
                    <Spin style={{ display: 'block' }} loading={this.state.loading}>
                        {
                            this.state.tableData.map((v, i) => (
                                <div className="item" key={i}>
                                    <div className="i-top">
                                        <UserHeadIcon className="headicon" iconSize={48} fontSize={16} avatar={v.avatar} nickName={v.nickName}></UserHeadIcon>
                                        <div className="it-right">
                                            <div className="title hover-primary" onClick={() => this.goMySpace(v.accountId)} title={v.nickName}>{v.nickName}</div>
                                            <div className="info">
                                                <div className="svg-wrap" title="dashboards">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.1 2.83H2.9C2.86134 2.83 2.83 2.86134 2.83 2.9V11.2415C2.83 11.2801 2.86134 11.3115 2.9 11.3115H13.1C13.1387 11.3115 13.17 11.2801 13.17 11.2415V2.9C13.17 2.86134 13.1387 2.83 13.1 2.83ZM2.9 1.5C2.1268 1.5 1.5 2.1268 1.5 2.9V11.2415C1.5 12.0147 2.1268 12.6415 2.9 12.6415H13.1C13.8732 12.6415 14.5 12.0147 14.5 11.2415V2.9C14.5 2.1268 13.8732 1.5 13.1 1.5H2.9ZM12.3313 5.84573C12.4964 6.06708 12.4508 6.38036 12.2294 6.54547L10.0245 8.19014C9.66304 8.4598 9.17356 8.48147 8.78965 8.24481L6.4326 6.79189C6.39666 6.76974 6.35068 6.77254 6.3177 6.79889L4.61666 8.158C4.40092 8.33037 4.0863 8.29521 3.91393 8.07947C3.74155 7.86374 3.77671 7.54911 3.99245 7.37674L5.69349 6.01763C6.05628 5.72777 6.56203 5.69695 6.95733 5.94062L9.31438 7.39355C9.34928 7.41506 9.39378 7.41309 9.42664 7.38858L11.6315 5.7439C11.8529 5.57879 12.1662 5.62438 12.3313 5.84573ZM3.82111 13.5816C3.5675 13.5816 3.36191 13.7872 3.36191 14.0408C3.36191 14.2944 3.5675 14.5 3.82111 14.5H12.1923C12.4459 14.5 12.6515 14.2944 12.6515 14.0408C12.6515 13.7872 12.4459 13.5816 12.1923 13.5816H3.82111Z" fill="#86909C" />
                                                    </svg>
                                                </div>
                                                <span className="num">{v.dashboard_count}</span>
                                                <div className="split"></div>
                                                <div className="svg-wrap" title="followers">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.54877 0.989532C4.65259 0.989532 3.11544 2.52669 3.11544 4.42287C3.11544 6.31905 4.65259 7.85621 6.54877 7.85621C8.44495 7.85621 9.98212 6.31905 9.98212 4.42287C9.98212 2.52669 8.44495 0.989532 6.54877 0.989532ZM4.31544 4.42287C4.31544 3.18943 5.31533 2.18953 6.54877 2.18953C7.78222 2.18953 8.78212 3.18943 8.78212 4.42287C8.78212 5.6563 7.78222 6.65621 6.54877 6.65621C5.31533 6.65621 4.31544 5.6563 4.31544 4.42287ZM7.98113 9.13994L8.07972 8.986L2.71704 8.98641C1.8338 8.98641 1.1178 9.70238 1.1178 10.5857V10.9707C1.1178 11.5898 1.33864 12.1884 1.74061 12.6592C2.80957 13.911 4.4325 14.5205 6.54877 14.5205C7.17525 14.5205 7.75856 14.4671 8.29633 14.3588L8.46478 14.3249L8.35207 14.1952C8.11835 13.9263 7.91814 13.6276 7.75852 13.3055L7.72668 13.2412L7.65558 13.2508C7.31123 13.2971 6.94246 13.3205 6.54877 13.3205C4.74067 13.3205 3.46316 12.8284 2.65315 11.8799C2.43671 11.6264 2.3178 11.3041 2.3178 10.9707V10.5857C2.3178 10.3652 2.49655 10.1864 2.71705 10.1864L7.4973 10.1862L7.51967 10.117C7.63193 9.7695 7.78789 9.44169 7.98113 9.13994Z" fill="#86909C" />
                                                        <path d="M11.3822 8.01047C13.3152 8.01047 14.8822 9.57745 14.8822 11.5105C14.8822 13.4434 13.3152 15.0105 11.3822 15.0105C9.44918 15.0105 7.8822 13.4434 7.8822 11.5105C7.8822 9.57745 9.44918 8.01047 11.3822 8.01047ZM9.69807 11.2854C9.57385 11.1612 9.37238 11.1612 9.24809 11.2854C9.12388 11.4097 9.12388 11.6112 9.24809 11.7354L10.5208 13.0081C10.6451 13.1324 10.8466 13.1324 10.9708 13.0081L13.5162 10.4627C13.6405 10.3385 13.6405 10.137 13.5162 10.0127C13.392 9.88844 13.1906 9.88844 13.0663 10.0127L10.7458 12.3332L9.69807 11.2854Z" fill="#86909C" />
                                                    </svg>
                                                </div>
                                                <span className="num">{v.followed_account_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="i-bottom">
                                        <div className="form-item">
                                            <div className="inner">
                                                <div className="label">
                                                    Views
                                                </div>
                                                <div className="value">{v.total_view_count}</div>
                                            </div>
                                        </div>
                                        <div className="form-item">
                                            <div className="inner">
                                                <div className="label">
                                                    Favorites
                                                </div>
                                                <div className="value">{v.total_favorite_count}</div>
                                            </div>
                                        </div>
                                        <div className="form-item">
                                            <div className="inner">
                                                <div className="label">
                                                    Shares
                                                </div>
                                                <div className="value">{v.total_share_count}</div>
                                            </div>
                                        </div>
                                        {
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
                                        }
                                    </div>
                                </div>
                            ))}
                    </Spin>
                </div>
                <div className="pagination-wrap">
                    <Pagination {...this.state.pagination} showJumper />
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
