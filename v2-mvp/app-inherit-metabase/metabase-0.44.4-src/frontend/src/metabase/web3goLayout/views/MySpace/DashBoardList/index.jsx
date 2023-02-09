/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import slugg from "slugg";
import { IconDown, IconMoreVertical } from '@arco-design/web-react/icon';
import { Button, Modal, Form, Input, Upload, Select, Checkbox, Table, TableColumnProps, Dropdown, Menu } from '@arco-design/web-react';
import { push } from "react-router-redux";
import moment from 'moment';
import { numberSplit } from '@/web3goLayout/utils';
import ShareModal from "@/web3goLayout/components/ShareModal";
import { LayoutDashboardApi } from '@/services'
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData
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
            filterList: [],
            currentFilter: {},
            tableData: [],
            tableSort: {},
            paramsShow: false,
            favouriteList: [],
            params: {
                createBy: '',
                myFavorite: false
            },
            ifShowMore: false,
            createByList: [{ name: 1 }, { name: 2 }],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    render: (col, record, index) => (
                        <div className="name-col">
                            <div className="right">
                                <div className="title hover-primary" onClick={() => { record.publicLink && window.open(record.publicLink) }}>{record.name}</div>
                                <div className="tag-list">
                                    {
                                        record.tagList.map(v => (
                                            <div key={v.id} title={v.tagDescription} className="item">{v.tagName}</div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    title: 'Views',
                    dataIndex: 'viewCount',
                    align: 'right',
                    sorter: true,
                    render: (col, record, index) => <span className="common-sort-td">{numberSplit(record.viewCount)}</span>
                },

                {
                    title: 'Shares',
                    dataIndex: 'shareCount',
                    align: 'right',
                    sorter: true,
                    render: (col, record, index) => <span className="common-sort-td">{numberSplit(record.shareCount)}</span>
                },

            ],
            operationColumn: [{
                title: (<div onClick={this.toggleShowParams} className="hide-icon hover-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.48535 12.7L12.1994 7.98597L7.48535 3.27197" stroke="#6B7785" strokeWidth="1.5" />
                        <path d="M3.71411 12.7L8.42811 7.98597L3.71411 3.27197" stroke="#6B7785" strokeWidth="1.5" />
                    </svg>
                </div>),
                dataIndex: '',
                align: 'right',
                width: 50,
                render: (col, record, index) => {
                    let operationList = [...this.state.operationList];
                    if (this.state.favouriteList.find(v => v.dashboardId == record.id)) {
                        operationList.shift();
                        operationList.unshift({
                            icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.83849 2.32133C7.85338 2.29241 7.87638 2.26806 7.90488 2.25104C7.93339 2.23402 7.96626 2.225 7.99981 2.225C8.03335 2.225 8.06623 2.23402 8.09473 2.25104C8.12324 2.26806 8.14623 2.29241 8.16113 2.32133L9.96879 5.84583C9.98167 5.87104 10.0007 5.89285 10.0243 5.90939C10.0479 5.92593 10.0753 5.93671 10.1042 5.94079L14.1458 6.50603C14.1791 6.51068 14.2103 6.52419 14.236 6.54503C14.2617 6.56588 14.2808 6.59323 14.2912 6.62399C14.3016 6.65475 14.3028 6.68769 14.2948 6.71909C14.2867 6.75048 14.2697 6.77908 14.2456 6.80164L11.3209 9.545C11.3001 9.56465 11.2845 9.5889 11.2755 9.61564C11.2665 9.64239 11.2644 9.67084 11.2694 9.69853L11.9597 13.5724C11.9654 13.6042 11.9617 13.637 11.9491 13.667C11.9364 13.697 11.9153 13.7229 11.8881 13.742C11.8608 13.761 11.8287 13.7723 11.7951 13.7746C11.7616 13.7769 11.728 13.7701 11.6983 13.755L8.08371 11.9259C8.05784 11.9127 8.02905 11.9059 7.99981 11.9059C7.97057 11.9059 7.94178 11.9127 7.91591 11.9259L4.30167 13.755C4.27194 13.7701 4.2384 13.7769 4.20486 13.7746C4.17133 13.7723 4.13913 13.761 4.11192 13.742C4.08472 13.7229 4.06358 13.697 4.05091 13.667C4.03825 13.637 4.03455 13.6042 4.04025 13.5724L4.7309 9.69853C4.73586 9.67081 4.73372 9.64234 4.72469 9.6156C4.71565 9.58885 4.69999 9.56462 4.67905 9.545L1.75439 6.80164C1.73031 6.77906 1.71329 6.75043 1.70524 6.71901C1.6972 6.68759 1.69845 6.65463 1.70887 6.62386C1.71929 6.59309 1.73846 6.56575 1.76419 6.54492C1.78993 6.5241 1.82121 6.51062 1.8545 6.50603L5.8958 5.94114C5.92467 5.93706 5.95208 5.92628 5.97567 5.90974C5.99926 5.8932 6.01831 5.87138 6.03119 5.84618L7.83885 2.32168L7.83849 2.32133Z" fill="#F34D4D" stroke="#F34D4D" strokeWidth="1.33" />
                            </svg>,
                            name: 'Unfavorite'
                        });
                    }
                    if (!this.props.userData.account || (record.creatorAccountId !== this.props.userData.account.accountId)) {
                        operationList.pop();
                        operationList.pop();
                    }
                    return (
                        <Dropdown trigger='click' position="bottom" droplist={
                            <Menu className="web3go-layout-myspace-dashboardlist-menu" onClickMenuItem={(key) => { this.clickDropdownIcon(key, record) }}>
                                {operationList.map((v) => (
                                    <Menu.Item key={v.name}>
                                        {v.icon}
                                        <span>
                                            {v.name}
                                        </span>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }>
                            <div className="operation-wrap">
                                <IconMoreVertical></IconMoreVertical>
                            </div>
                        </Dropdown>
                    )
                }
            },],
            moreColumn: [{
                title: 'Favorites',
                dataIndex: 'favoriteCount',
                align: 'right',
                sorter: true,
                render: (col, record, index) => <span className="common-sort-td">{numberSplit(record.favoriteCount)}</span>

            },
            {
                title: 'Updated on',
                dataIndex: 'updatedAt',
                align: 'right',
                sorter: true,
                render: (col, record, index) => <span className="common-sort-td">{moment(record.createdAt).fromNow()}</span>

            },],
            operationList: [{
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.83849 2.32133C7.85338 2.29241 7.87638 2.26806 7.90488 2.25104C7.93339 2.23402 7.96626 2.225 7.99981 2.225C8.03335 2.225 8.06623 2.23402 8.09473 2.25104C8.12324 2.26806 8.14623 2.29241 8.16113 2.32133L9.96879 5.84583C9.98167 5.87104 10.0007 5.89285 10.0243 5.90939C10.0479 5.92593 10.0753 5.93671 10.1042 5.94079L14.1458 6.50603C14.1791 6.51068 14.2103 6.52419 14.236 6.54503C14.2617 6.56588 14.2808 6.59323 14.2912 6.62399C14.3016 6.65475 14.3028 6.68769 14.2948 6.71909C14.2867 6.75048 14.2697 6.77908 14.2456 6.80164L11.3209 9.545C11.3001 9.56465 11.2845 9.5889 11.2755 9.61564C11.2665 9.64239 11.2644 9.67084 11.2694 9.69853L11.9597 13.5724C11.9654 13.6042 11.9617 13.637 11.9491 13.667C11.9364 13.697 11.9153 13.7229 11.8881 13.742C11.8608 13.761 11.8287 13.7723 11.7951 13.7746C11.7616 13.7769 11.728 13.7701 11.6983 13.755L8.08371 11.9259C8.05784 11.9127 8.02905 11.9059 7.99981 11.9059C7.97057 11.9059 7.94178 11.9127 7.91591 11.9259L4.30167 13.755C4.27194 13.7701 4.2384 13.7769 4.20486 13.7746C4.17133 13.7723 4.13913 13.761 4.11192 13.742C4.08472 13.7229 4.06358 13.697 4.05091 13.667C4.03825 13.637 4.03455 13.6042 4.04025 13.5724L4.7309 9.69853C4.73586 9.67081 4.73372 9.64234 4.72469 9.6156C4.71565 9.58885 4.69999 9.56462 4.67905 9.545L1.75439 6.80164C1.73031 6.77906 1.71329 6.75043 1.70524 6.71901C1.6972 6.68759 1.69845 6.65463 1.70887 6.62386C1.71929 6.59309 1.73846 6.56575 1.76419 6.54492C1.78993 6.5241 1.82121 6.51062 1.8545 6.50603L5.8958 5.94114C5.92467 5.93706 5.95208 5.92628 5.97567 5.90974C5.99926 5.8932 6.01831 5.87138 6.03119 5.84618L7.83885 2.32168L7.83849 2.32133Z" stroke="#6B7785" strokeWidth="1.33" />
                </svg>,
                name: 'Favorite'
            }, {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5625 8.6544V13.2353C13.5625 13.3221 13.528 13.4053 13.4667 13.4667C13.4053 13.528 13.3221 13.5625 13.2353 13.5625H2.76465C2.67787 13.5625 2.59464 13.528 2.53328 13.4667C2.47191 13.4053 2.43744 13.3221 2.43744 13.2353V2.76465C2.43744 2.67787 2.47191 2.59464 2.53328 2.53328C2.59464 2.47191 2.67787 2.43744 2.76465 2.43744H7.34556M6.6329 9.36706L13.2023 2.79737M13.5625 6.69115V2.43744H9.30881" stroke="#6B7785" strokeWidth="1.33333" />
                </svg>,
                name: 'Share'
            }, {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.1598 6.34592L12.0711 4.43459C12.1336 4.37208 12.1687 4.28731 12.1687 4.19892C12.1687 4.11054 12.1336 4.02577 12.0711 3.96326L10.2091 2.10126C10.1466 2.03877 10.0618 2.00366 9.97342 2.00366C9.88503 2.00366 9.80026 2.03877 9.73776 2.10126L7.82642 4.01259M10.1598 6.34592L5.25442 11.2513C5.20136 11.3043 5.13195 11.3379 5.05742 11.3466L3.04176 11.5826C2.99292 11.5883 2.94343 11.5831 2.89684 11.5674C2.85024 11.5518 2.80769 11.526 2.77223 11.4919C2.73677 11.4579 2.70929 11.4164 2.69174 11.3704C2.6742 11.3245 2.66703 11.2753 2.67076 11.2263L2.82976 9.12292C2.83582 9.04352 2.87011 8.9689 2.92642 8.91259L7.82642 4.01259M10.1598 6.34592L7.82642 4.01259M1.99976 13.9999H13.9998" stroke="#6B7785" strokeWidth="1.33" />
                </svg>
                ,
                name: 'Edit'
            }, {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.99999 5V10M4.99999 11.1667V10M4.99999 10C4.99999 8.33333 11.3333 7.66667 11.3333 5M6.33332 3.33333C6.33332 3.68696 6.19285 4.02609 5.9428 4.27614C5.69275 4.52619 5.35361 4.66667 4.99999 4.66667C4.64637 4.66667 4.30723 4.52619 4.05718 4.27614C3.80713 4.02609 3.66666 3.68696 3.66666 3.33333C3.66666 2.97971 3.80713 2.64057 4.05718 2.39052C4.30723 2.14048 4.64637 2 4.99999 2C5.35361 2 5.69275 2.14048 5.9428 2.39052C6.19285 2.64057 6.33332 2.97971 6.33332 3.33333V3.33333ZM12.6667 3.33333C12.6667 3.68696 12.5262 4.02609 12.2761 4.27614C12.0261 4.52619 11.6869 4.66667 11.3333 4.66667C10.9797 4.66667 10.6406 4.52619 10.3905 4.27614C10.1405 4.02609 9.99999 3.68696 9.99999 3.33333C9.99999 2.97971 10.1405 2.64057 10.3905 2.39052C10.6406 2.14048 10.9797 2 11.3333 2C11.6869 2 12.0261 2.14048 12.2761 2.39052C12.5262 2.64057 12.6667 2.97971 12.6667 3.33333V3.33333ZM6.33332 12.6667C6.33332 13.0203 6.19285 13.3594 5.9428 13.6095C5.69275 13.8595 5.35361 14 4.99999 14C4.64637 14 4.30723 13.8595 4.05718 13.6095C3.80713 13.3594 3.66666 13.0203 3.66666 12.6667C3.66666 12.313 3.80713 11.9739 4.05718 11.7239C4.30723 11.4738 4.64637 11.3333 4.99999 11.3333C5.35361 11.3333 5.69275 11.4738 5.9428 11.7239C6.19285 11.9739 6.33332 12.313 6.33332 12.6667V12.6667Z" stroke="#6B7785" strokeWidth="1.33333" />
                </svg>
                ,
                name: 'Forks'
            }, {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.66675 3.66659H3.50008M3.50008 3.66659V13.3333C3.50008 13.4217 3.5352 13.5064 3.59771 13.569C3.66022 13.6315 3.74501 13.6666 3.83341 13.6666H12.1667C12.2552 13.6666 12.3399 13.6315 12.4025 13.569C12.465 13.5064 12.5001 13.4217 12.5001 13.3333V3.66659M3.50008 3.66659H5.33341M12.5001 3.66659H14.3334M12.5001 3.66659H10.6667M5.33341 3.66659V2.33325H10.6667V3.66659M5.33341 3.66659H10.6667M6.66675 5.99992V10.9999M9.33341 5.99992V10.9999" stroke="#6B7785" strokeWidth="1.33333" />
                </svg>
                ,
                name: 'Delete'
            }],
            tableData: [

            ],
            loading: false,
            pagination: {
                total: 96,
                pageSize: 10,
                current: 1,
            }
        }
        this.ShareModalRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
        this.getMyFavourites();
    }
    componentDidUpdate(prevProps) {
        if (this.props.isFavourite !== prevProps.isFavourite) {
            this.getList();
        }
    }
    getMyFavourites = () => {
        // 查该用户的总收藏数
        LayoutDashboardApi.listFavorites({
            "pageSize": 9999999999,
            "pageIndex": 1,
            "orderBys": [],
            "accountId": this.props.accountId,
            "searchName": ""
        }).then(d => {
            if (this.props.setMyFavouriteCount) {
                this.props.setMyFavouriteCount(d.totalCount);
            }
        });
        if (!this.props.userData.account) {
            this.getList();
            return;
        }
        // 查自己的总收藏数
        LayoutDashboardApi.listFavorites({
            "pageSize": 9999999999,
            "pageIndex": 1,
            "orderBys": [],
            "accountId": this.props.userData.account.accountId,
            "searchName": ""
        }).then(d => {
            this.setState({
                favouriteList: d.list
            }, () => {
                this.getList();
            });
        });
    }
    openShareModal = (record) => {
        this.ShareModalRef.init(record);
    }
    toggleShowParams = () => {
        this.setState({
            ifShowMore: !this.state.ifShowMore
        });
    }
    changeFilter = (v) => {
        this.setState({
            currentFilter: v
        });
    }
    fork = (record) => {
        const newName = record.name + '-fork';
        LayoutDashboardApi.forkDashboard({
            originalDashboardId: record.id,
            description: newName,
            new_dashboard_name: newName
        }).then(d => {
            const slug = slugg(newName);
            const suffix = slug ? `${d.newDashboardId}-${slug}` : d.newDashboardId;
            this.props.push(`/dashboard/${suffix}`);
        })
    }
    clickDropdownIcon = (key, record) => {
        if (key == 'Favorite') {
            LayoutDashboardApi.logFavorite({
                "dashboardId": record.id,
                "operationFlag": 'add'
            }).then(d => {
                this.getMyFavourites();
            });
        } else if (key == 'Unfavorite') {
            LayoutDashboardApi.logFavorite({
                "dashboardId": record.id,
                "operationFlag": 'cancel'
            }).then(d => {
                this.getMyFavourites();
            });
        }
        else if (key == 'Share') {
            this.openShareModal(record);
        }
        else if (key == 'Edit') {
            const slug = slugg(record.name);
            const suffix = slug ? `${record.id}-${slug}` : record.id;
            this.props.push({ pathname: `/layout/create/${suffix}`, state: { tabIndex: 1 } });
        }
        else if (key == 'Forks') {
            this.fork(record);
        }
        else if (key == 'Delete') {
            const slug = slugg(record.name);
            const suffix = slug ? `${record.id}-${slug}` : record.id;
            this.props.push(`/dashboard/${suffix}`);
            // Modal.confirm({
            //     wrapClassName: 'common-confirm-modal',
            //     closable: true,
            //     title: 'Delete Dashboard',
            //     content:
            //         'Are you sure you want to delete this dashboard?',
            //     okText: 'Confirm',
            //     cancelText: 'Cancel',
            //     onOk: () => {

            //     }
            // });
        }
    }
    onChangeTable = (pagination, sorter) => {
        const { current } = pagination;
        this.setState((state) => {
            return {
                tableSort: sorter,
                pagination: {
                    ...state.pagination,
                    current
                }
            }
        }, () => {
            this.getList();
        });
    }
    getList = (turnFirstPage) => {
        if (turnFirstPage) {
            this.setState({
                pagination: { ...this.state.pagination, current: 1 }
            });
        }
        // if (this.props.isFavourite && !this.state.favouriteList.length) {
        //     this.setState({
        //         loading: false,
        //         tableData: [],
        //         pagination: { ...this.state.pagination, total: 0 }
        //     });
        //     return;
        // }
        this.setState({ loading: true });
        const request = this.props.isFavourite ? LayoutDashboardApi.listFavorites : LayoutDashboardApi.list;
        request({
            "pageSize": this.state.pagination.pageSize,
            "pageIndex": turnFirstPage ? 1 : this.state.pagination.current,
            "orderBys": this.state.tableSort.field ? [{
                sort: this.state.tableSort.field,
                order: this.state.tableSort.direction === "ascend" ? 'ASC' : 'DESC',
            }] : [],
            "tagIds": [],
            "searchName": this.props.searchValue,
            "creator": this.props.isFavourite ? '' : this.props.accountId,
            "dashboardIds": [],
            "accountId": this.props.isFavourite ? this.props.accountId : "",
        }).then(d => {
            if (!this.props.isFavourite) {
                this.props.setDashboardListCount(d.totalCount);
            }
            const resolveDashboardData = (list) => {
                this.setState({
                    loading: false,
                    tableData: list,
                    pagination: { ...this.state.pagination, total: d.totalCount }
                });
            }
            if (this.props.isFavourite) {
                if (!d.list.length) {
                    resolveDashboardData([]);
                    return;
                }
                LayoutDashboardApi.list({
                    "pageSize": 999999999,
                    "pageIndex": 1,
                    "orderBys": [],
                    "tagIds": [],
                    "searchName": '',
                    "creator": '',
                    "dashboardIds": d.list.map(v => v.dashboardId),
                }).then(d2 => {
                    resolveDashboardData(d2.list);
                })
            } else {
                resolveDashboardData(d.list);
            }
        });
    }
    render() {
        let columns = [...this.state.columns, ...this.state.operationColumn];
        if (this.state.ifShowMore) {
            columns = [...this.state.columns, ...this.state.moreColumn, ...this.state.operationColumn];
        }
        return (
            <div className="web3go-layout-myspace-dashbaoard-list">
                <Table
                    className={'pagination-right' + (this.state.ifShowMore ? 'show-more' : '')}
                    rowKey="id"
                    borderCell={false}
                    border={false}
                    pagePosition='bottomCenter'
                    loading={this.state.loading}
                    pagination={this.state.pagination}
                    onChange={this.onChangeTable}
                    columns={columns}
                    data={this.state.tableData} />
                <ShareModal onRef={(ref) => this.ShareModalRef = ref}></ShareModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
