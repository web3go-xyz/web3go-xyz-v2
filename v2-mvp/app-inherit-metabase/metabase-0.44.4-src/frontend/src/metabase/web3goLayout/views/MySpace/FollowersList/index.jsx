/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { IconDown, IconPlus, IconCheck } from '@arco-design/web-react/icon';
import { Button, Modal, Form, Input, Upload, Select, Checkbox, Pagination, Table, TableColumnProps, Dropdown, Menu, Spin } from '@arco-design/web-react';
import { push, replace } from "react-router-redux";
import "cropperjs/dist/cropper.css";
import { numberSplit } from '@/web3goLayout/utils';
import ShareModal from "@/web3goLayout/components/ShareModal";
import { LayoutDashboardApi, LayoutCreatorApi, LayoutLoginApi } from '@/services'
import UserHeadIcon from '@/web3goLayout/components/UserHeadIcon';

const Option = Select.Option;
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData
    }
};
const mapDispatchToProps = {
    push,
    replace
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shareVisible: false,
            filterList: [],
            currentFilter: {},
            tableData: [],
            paramsShow: false,
            params: {
                createBy: '',
                myFavorite: false
            },
            ifShowMore: false,
            loading: false,
            tableSort: {},
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
        this.ShareModalRef = React.createRef();
    }
    componentDidMount() {
        this.getList();
    }
    componentDidUpdate(prevProps) {
        if (this.props.viewType !== prevProps.viewType) {
            this.getList();
        }
    }
    getList = () => {
        this.setState({ loading: true });
        const request = this.props.viewType == 'following' ? LayoutCreatorApi.listFollowing : LayoutCreatorApi.listFollowed
        request({
            "pageSize": this.state.pagination.pageSize,
            "pageIndex": this.state.pagination.current,
            "orderBys": this.state.tableSort.field ? [{
                sort: this.state.tableSort.field,
                order: this.state.tableSort.direction === "ascend" ? 'ASC' : 'DESC',
            }] : [],
            "account_id": this.props.accountId,
            "includeDetail": true
        }).then(d => {
            this.setState({
                loading: false,
                tableData: d.list,
                pagination: { ...this.state.pagination, total: d.totalCount }
            })
        });

    }
    handleFollow = (v) => {
        LayoutCreatorApi.follow({
            "targetAccountId": v.accountId
        }).then(d => {
            this.props.getUserInfo();
            this.props.getAllFollowingList();
            this.getList();
        });
    }
    goMySpace = (accountId) => {
        // 刷新路由
        this.props.replace(`/layout/blank`);
        setTimeout(() => {
            this.props.replace(`/layout/mySpace?accountId=${accountId}`);
        });
    }
    handleUnfollow = (v) => {
        LayoutCreatorApi.unfollow({
            "targetAccountId": v.accountId
        }).then(d => {
            this.props.getUserInfo();
            this.props.getAllFollowingList();
            this.getList();
        });
    }
    render() {
        return (
            <div className="web3go-layout-myspace-followers-list">
                <div className="list">
                    <Spin style={{ display: 'block' }} loading={this.state.loading}>
                        {this.state.tableData.map((v, i) => (
                            <div className="item" key={i}>
                                <div className="i-left">
                                    <UserHeadIcon onClick={() => this.goMySpace(v.accountId)} className="hover-item" iconSize={44} avatar={v.avatar} nickName={v.nickName}></UserHeadIcon>
                                    <div className="ii-right">
                                        <div className="name hover-primary" onClick={() => this.goMySpace(v.accountId)}>{v.nickName}</div>
                                        <div className="iir-bottom">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.1 2.83H2.9C2.86134 2.83 2.83 2.86134 2.83 2.9V11.2415C2.83 11.2801 2.86134 11.3115 2.9 11.3115H13.1C13.1387 11.3115 13.17 11.2801 13.17 11.2415V2.9C13.17 2.86134 13.1387 2.83 13.1 2.83ZM2.9 1.5C2.1268 1.5 1.5 2.1268 1.5 2.9V11.2415C1.5 12.0147 2.1268 12.6415 2.9 12.6415H13.1C13.8732 12.6415 14.5 12.0147 14.5 11.2415V2.9C14.5 2.1268 13.8732 1.5 13.1 1.5H2.9ZM12.3313 5.84573C12.4964 6.06708 12.4508 6.38036 12.2294 6.54547L10.0245 8.19014C9.66304 8.4598 9.17356 8.48147 8.78965 8.24481L6.4326 6.79189C6.39666 6.76974 6.35068 6.77254 6.3177 6.79889L4.61666 8.158C4.40092 8.33037 4.0863 8.29521 3.91393 8.07947C3.74155 7.86374 3.77671 7.54911 3.99245 7.37674L5.69349 6.01763C6.05628 5.72777 6.56203 5.69695 6.95733 5.94062L9.31438 7.39355C9.34928 7.41506 9.39378 7.41309 9.42664 7.38858L11.6315 5.7439C11.8529 5.57879 12.1662 5.62438 12.3313 5.84573ZM3.82111 13.5816C3.5675 13.5816 3.36191 13.7872 3.36191 14.0408C3.36191 14.2944 3.5675 14.5 3.82111 14.5H12.1923C12.4459 14.5 12.6515 14.2944 12.6515 14.0408C12.6515 13.7872 12.4459 13.5816 12.1923 13.5816H3.82111Z" fill="#86909C" />
                                            </svg>
                                            <span>Dashboard</span>
                                            <span className="value">{numberSplit(v.dashboard_count)}</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.props.allFollowingList.find(sv => sv.accountId == v.accountId) ? (
                                        <div className="follow-btn" onClick={() => { this.handleUnfollow(v) }}>
                                            <IconCheck />
                                            <span className="text">Following</span>
                                        </div>
                                    ) : (
                                        <div className="follow-btn" onClick={() => { this.handleFollow(v) }}>
                                            <IconPlus />
                                            <span className="text">Follow</span>
                                        </div>
                                    )
                                }
                                <div className="i-right">
                                    <div className="form-item">
                                        <div className="value">{numberSplit(v.followedAccountCount)}</div>
                                        <div className="label">Followers</div>
                                    </div>
                                    <div className="form-item">
                                        <div className="value">{numberSplit(v.total_view_count)}</div>
                                        <div className="label">Views</div>
                                    </div>
                                    <div className="form-item">
                                        <div className="value">{numberSplit(v.total_share_count)}</div>
                                        <div className="label">Shares</div>
                                    </div>
                                    <div className="form-item">
                                        <div className="value">{numberSplit(v.total_favorite_count)}</div>
                                        <div className="label">Favorites</div>
                                    </div>
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
