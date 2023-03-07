/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { IconDown } from '@arco-design/web-react/icon';
import { Button, Modal, Form, Input, Upload, Select, Checkbox, Table, TableColumnProps } from '@arco-design/web-react';
import { push } from "react-router-redux";
import UserHeadIcon from '@/web3goLayout/components/UserHeadIcon';
import { numberSplit } from '@/web3goLayout/utils';
import ShareModal from "@/web3goLayout/components/ShareModal";
import { LayoutDashboardApi, LayoutLoginApi, WEB3GO_BASE_URL } from '@/services'
import event from '@/web3goLayout/event';
import slugg from "slugg";

import moment from 'moment';
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        route: state.routing.locationBeforeTransitions,
        userData: state.app.userData,
        currentUser: state.currentUser,
        isDark: state.app.isDark
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
            showMyFavorite: false,
            accountList: [],
            favouriteList: [],
            shareVisible: false,
            filterList: [],
            currentTag: {},
            tableData: [],
            paramsShow: false,
            params: {
                createBy: '',
                myFavorite: false
            },
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    render: (col, record, index) => {
                        let nickName;
                        let avatar;
                        const find = this.state.accountList.find(v => v.accountId == record.creatorAccountId);
                        if (find) {
                            nickName = find.nickName;
                            avatar = find.avatar;
                        }
                        return (
                            <div className="name-col">
                                <UserHeadIcon onClick={() => this.goMySpace(record.creatorAccountId)} className="headicon hover-item" iconSize={32} avatar={avatar} nickName={nickName}></UserHeadIcon>
                                <div className="right">
                                    <div className="title hover-primary" onClick={() => { record.publicLink && window.open(record.publicLink) }}>{record.name}</div>
                                    <div className="tag-list">
                                        {
                                            record.tagList.map(v => (
                                                <div key={v.id} title={v.tagDescription} className="item">{v.tagName}</div>
                                            ))
                                        }
                                    </div>
                                    <div className="bottom">
                                        <span className="undeline hover-primary" onClick={() => this.goMySpace(record.creatorAccountId)}>
                                            {nickName}
                                        </span>
                                        <span> - {moment(record.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    title: 'Views',
                    dataIndex: 'viewCount',
                    align: 'right',
                    sorter: true,
                    render: (col, record, index) => <span className="common-sort-td">{numberSplit(record.viewCount)}</span>
                },
                {
                    title: 'Favorites',
                    dataIndex: 'favoriteCount',
                    align: 'right',
                    sorter: true,
                    render: (col, record, index) => <span className="common-sort-td">{numberSplit(record.favoriteCount)}</span>

                },
                {
                    title: 'Shares',
                    dataIndex: 'shareCount',
                    align: 'right',
                    sorter: true,
                    render: (col, record, index) => <span className="common-sort-td">{numberSplit(record.shareCount)}</span>
                },
                {
                    title: '24h',
                    dataIndex: '24h',
                    align: 'right',
                    width: 105,
                    filterIcon: <IconDown />,
                    filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
                        return (
                            <div className='home-arco-table-custom-filter'>
                                <div className="item" onClick={() => { this.change24h('24h', confirm); }}>24h</div>
                                <div className="item" onClick={() => { this.change24h('All time', confirm); }}>All time</div>
                            </div>
                        );
                    },
                    onFilter: (value, row) => {
                        return true
                    },
                    render: (col, record, index) => {
                        return (
                            <div className="operation-wrap">
                                <svg onClick={() => { this.toggleFavourite(record) }} className={"hover-item star" + (record.hasFavourite ? ' active' : "")} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <title>Favourite</title>
                                    <path d="M7.83849 2.32143C7.85338 2.29251 7.87638 2.26816 7.90488 2.25114C7.93339 2.23412 7.96626 2.2251 7.99981 2.2251C8.03335 2.2251 8.06623 2.23412 8.09474 2.25114C8.12324 2.26816 8.14623 2.29251 8.16113 2.32143L9.96879 5.84593C9.98167 5.87114 10.0007 5.89295 10.0243 5.90949C10.0479 5.92603 10.0753 5.93681 10.1042 5.94089L14.1458 6.50613C14.1791 6.51077 14.2103 6.52429 14.236 6.54513C14.2617 6.56598 14.2808 6.59333 14.2912 6.62409C14.3016 6.65485 14.3028 6.68779 14.2948 6.71918C14.2867 6.75058 14.2697 6.77918 14.2456 6.80174L11.3209 9.5451C11.3001 9.56475 11.2845 9.589 11.2755 9.61574C11.2665 9.64249 11.2644 9.67093 11.2694 9.69862L11.9597 13.5725C11.9654 13.6043 11.9617 13.6371 11.9491 13.6671C11.9364 13.6971 11.9153 13.723 11.8881 13.742C11.8608 13.7611 11.8287 13.7724 11.7951 13.7747C11.7616 13.777 11.728 13.7702 11.6983 13.7551L8.08371 11.926C8.05784 11.9128 8.02905 11.906 7.99981 11.906C7.97057 11.906 7.94178 11.9128 7.91591 11.926L4.30167 13.7551C4.27194 13.7702 4.2384 13.777 4.20486 13.7747C4.17133 13.7724 4.13913 13.7611 4.11192 13.742C4.08472 13.723 4.06358 13.6971 4.05091 13.6671C4.03825 13.6371 4.03455 13.6043 4.04025 13.5725L4.7309 9.69862C4.73586 9.6709 4.73372 9.64244 4.72469 9.61569C4.71565 9.58895 4.69999 9.56472 4.67905 9.5451L1.75439 6.80174C1.73031 6.77915 1.71329 6.75053 1.70524 6.71911C1.6972 6.68769 1.69845 6.65473 1.70887 6.62396C1.71929 6.59319 1.73846 6.56584 1.76419 6.54502C1.78993 6.52419 1.82121 6.51072 1.8545 6.50613L5.8958 5.94124C5.92467 5.93715 5.95208 5.92638 5.97567 5.90984C5.99926 5.89329 6.01831 5.87148 6.03119 5.84628L7.83885 2.32178L7.83849 2.32143Z" strokeWidth="1.575" />
                                </svg>
                                <svg onClick={() => { this.openShareModal(record) }} className="hover-item" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <title>Share</title>
                                    <path d="M13.5626 8.65446V13.2354C13.5626 13.3222 13.5281 13.4054 13.4667 13.4667C13.4054 13.5281 13.3221 13.5626 13.2353 13.5626H2.76468C2.6779 13.5626 2.59467 13.5281 2.53331 13.4667C2.47194 13.4054 2.43747 13.3222 2.43747 13.2354V2.76471C2.43747 2.67793 2.47194 2.5947 2.53331 2.53334C2.59467 2.47197 2.6779 2.4375 2.76468 2.4375H7.34559M6.63293 9.36712L13.2023 2.79743M13.5626 6.69121V2.4375H9.30884" strokeWidth="1.33333" />
                                </svg>
                                <svg onClick={() => { this.fork(record) }} className="hover-item" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <title>Forks</title>
                                    <path d="M4.99999 5V10M4.99999 11.1667V10M4.99999 10C4.99999 8.33333 11.3333 7.66667 11.3333 5M6.33332 3.33333C6.33332 3.68696 6.19285 4.02609 5.9428 4.27614C5.69275 4.52619 5.35361 4.66667 4.99999 4.66667C4.64637 4.66667 4.30723 4.52619 4.05718 4.27614C3.80713 4.02609 3.66666 3.68696 3.66666 3.33333C3.66666 2.97971 3.80713 2.64057 4.05718 2.39052C4.30723 2.14048 4.64637 2 4.99999 2C5.35361 2 5.69275 2.14048 5.9428 2.39052C6.19285 2.64057 6.33332 2.97971 6.33332 3.33333V3.33333ZM12.6667 3.33333C12.6667 3.68696 12.5262 4.02609 12.2761 4.27614C12.0261 4.52619 11.6869 4.66667 11.3333 4.66667C10.9797 4.66667 10.6406 4.52619 10.3905 4.27614C10.1405 4.02609 9.99999 3.68696 9.99999 3.33333C9.99999 2.97971 10.1405 2.64057 10.3905 2.39052C10.6406 2.14048 10.9797 2 11.3333 2C11.6869 2 12.0261 2.14048 12.2761 2.39052C12.5262 2.64057 12.6667 2.97971 12.6667 3.33333V3.33333ZM6.33332 12.6667C6.33332 13.0203 6.19285 13.3594 5.9428 13.6095C5.69275 13.8595 5.35361 14 4.99999 14C4.64637 14 4.30723 13.8595 4.05718 13.6095C3.80713 13.3594 3.66666 13.0203 3.66666 12.6667C3.66666 12.313 3.80713 11.9739 4.05718 11.7239C4.30723 11.4738 4.64637 11.3333 4.99999 11.3333C5.35361 11.3333 5.69275 11.4738 5.9428 11.7239C6.19285 11.9739 6.33332 12.313 6.33332 12.6667V12.6667Z" strokeWidth="1.33333" />
                                </svg>
                            </div>
                        )
                    }
                },
            ],
            tableData: [

            ],
            tableSort: {},
            loading: false,
            pagination: {
                showJumper: this.props.route.pathname == '/layout/home' ? false : true,
                total: 0,
                pageSize: 10,
                current: 1,
            }
        }
        this.ShareModalRef = React.createRef();
    }
    fork = (record) => {
        if (!this.props.currentUser) {
            event.emit('goSignIn');
            return;
        }
        const newName = record.name + '-fork';
        LayoutDashboardApi.forkDashboard({
            originalDashboardId: record.id,
            description: newName,
            new_dashboard_name: newName
        }).then(d => {
            const slug = slugg(newName);
            const suffix = slug ? `${d.newDashboardId}-${slug}` : d.newDashboardId;
            this.props.push({ pathname: `/layout/create/${suffix}`, state: { tabIndex: 1 } });
        })
    }
    goMySpace = (accountId) => {
        this.props.push(`/layout/mySpace?accountId=${accountId}`);
    }
    componentDidMount() {
        this.getTags();
        this.getList();
        if (this.props.currentUser) {
            this.getMyFavourites();
        }
    }
    changeMyFavoriteCheckbox = (checked) => {
        this.setState({
            showMyFavorite: checked
        }, () => {
            this.getList(true);
        });
    }
    refreshTableAndFavourites = () => {
        this.getList();
        if (this.props.currentUser) {
            this.getMyFavourites();
        }
    }
    toggleFavourite = (record) => {
        if (!this.props.currentUser) {
            event.emit('goSignIn');
            return;
        }
        LayoutDashboardApi.logFavorite({
            "dashboardId": record.id,
            "operationFlag": record.hasFavourite ? 'cancel' : 'add'
        }).then(d => {
            this.refreshTableAndFavourites();
        });
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
            if (this.props.setMyFavouriteCount) {
                this.props.setMyFavouriteCount(d.totalCount);
            }
        });
    }
    getTags = () => {
        LayoutDashboardApi.listAllTags().then(d => {
            this.setState({
                filterList: d
            });
        });
    }
    openShareModal(record) {
        this.ShareModalRef.init(record);
    }
    changeCurrentTag = (v) => {
        this.setState({
            currentTag: v
        }, () => {
            this.getList(true);
        });
    }
    clickFilter = () => {
        if (!this.props.userData.account) {
            event.emit('goSignIn');
            return;
        }
        this.setState({ paramsShow: !this.state.paramsShow })
    }
    getAccountList = (accountIdList) => {
        LayoutLoginApi.searchAccountInfo({
            accountIds: accountIdList,
            includeExtraInfo: false
        }).then(d => {
            this.setState({
                accountList: d.map(v => v.account)
            });
        });
    }
    getList = (turnFirstPage) => {
        if (turnFirstPage) {
            this.setState({
                pagination: { ...this.state.pagination, current: 1 }
            });
        }
        if (this.state.showMyFavorite && !this.state.favouriteList.length) {
            this.setState({
                loading: false,
                tableData: [],
                pagination: { ...this.state.pagination, total: 0 }
            });
            return;
        }
        this.setState({ loading: true });
        LayoutDashboardApi.list({
            "pageSize": this.state.pagination.pageSize,
            "pageIndex": turnFirstPage ? 1 : this.state.pagination.current,
            "orderBys": this.state.tableSort.field ? [{
                sort: this.state.tableSort.field,
                order: this.state.tableSort.direction === "ascend" ? 'ASC' : 'DESC',
            }] : [],
            "tagIds": this.state.currentTag.id ? [this.state.currentTag.id] : [],
            "searchName": "",
            "creator": this.state.params.createBy,
            "dashboardIds": this.state.showMyFavorite ? this.state.favouriteList.map(v => v.dashboardId) : []
        }).then(d => {
            this.getAccountList(d.list.map(v => v.creatorAccountId));
            this.setState({
                loading: false,
                tableData: d.list,
                pagination: { ...this.state.pagination, total: d.totalCount }
            });

        });
    }
    change24h = (str, confirm) => {
        this.setState((state => {
            const columns = [...state.columns];
            columns[4].title = str;
            return {
                columns
            }
        }));
        confirm();
    }
    get formatTableData() {
        let newTableData = JSON.parse(JSON.stringify(this.state.tableData));
        newTableData.forEach(v => {
            if (this.state.favouriteList.find(sv => sv.dashboardId == v.id)) {
                v.hasFavourite = true;
            }
        });
        return newTableData;
    }
    render() {
        return (
            <div className="web3go-layout-home-dashbaoard-list">
                <div className="filter-wrap">
                    <div className="filter-btn" onClick={() => { this.clickFilter(); }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5H13.5M11.5 11.5H4.71052M12.5 8H3.5" stroke="#6B7785" strokeWidth="1.5" />
                        </svg>
                        <span>Filters</span>
                    </div>
                    <div className="filter-list">
                        <div
                            className={"item" + (!this.state.currentTag.id ? ' active' : '')}
                            onClick={() => { this.changeCurrentTag({}) }}
                            title="All"
                        >All</div>
                        {
                            this.state.filterList.map((v, i) =>
                                <div
                                    className={"item" + (this.state.currentTag.id == v.id ? ' active' : '')}
                                    onClick={() => { this.changeCurrentTag(v) }}
                                    title={v.tagName}
                                    key={i}>{v.tagName}</div>
                            )
                        }
                    </div>
                </div>
                <div className={"search-params-wrap" + (this.state.paramsShow ? ' open' : '')}>
                    <div className="Dashboard-tag">
                        <div className="label">Dashboard tags</div>
                        <Select
                            placeholder='Please select tags'
                            style={{ width: 386 }}
                            allowClear
                            onChange={(value) => {
                                this.setState({
                                    params: {
                                        ...this.state.params,
                                        createBy: value
                                    }
                                }, () => {
                                    this.getList(true);
                                });
                            }
                            }
                        >
                            {/* {this.props.myFollowingList.map((v, i) => (
                                <Option key={i} value={v.accountId}>
                                    {v.nickName}
                                </Option>
                            ))} */}
                            <Option value="1">
                                My following creators
                            </Option>
                            <Option value="2">
                                Created by myself
                            </Option>
                        </Select>
                    </div>
                    <div className="createby">
                        <div className="label">Created by</div>
                        <Select
                            placeholder='Please select creators'
                            style={{ width: 386 }}
                            allowClear
                            onChange={(value) => {
                                this.setState({
                                    params: {
                                        ...this.state.params,
                                        createBy: value
                                    }
                                }, () => {
                                    this.getList(true);
                                });
                            }
                            }
                        >
                            {/* {this.props.myFollowingList.map((v, i) => (
                                <Option key={i} value={v.accountId}>
                                    {v.nickName}
                                </Option>
                            ))} */}
                            <Option value="1">
                                My following creators
                            </Option>
                            <Option value="2">
                                Created by myself
                            </Option>
                        </Select>
                    </div>
                    <Checkbox onChange={this.changeMyFavoriteCheckbox}>My favorite</Checkbox>
                </div>

                {/* <div className="total-wrap">123 dashboards with selected label on Web3go</div> */}
                <Table
                    className={this.props.route.pathname == '/layout/home' ? '' : 'pagination-right'}
                    rowKey="id"
                    borderCell={false}
                    border={false}
                    pagePosition='bottomCenter'
                    loading={this.state.loading}
                    pagination={this.state.pagination}
                    onChange={this.onChangeTable}
                    columns={this.state.columns}
                    data={this.formatTableData} />
                <ShareModal onRef={(ref) => this.ShareModalRef = ref}></ShareModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
