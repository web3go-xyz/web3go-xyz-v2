/* eslint-disable react/prop-types */
import React from "react";
import slugg from "slugg";
import cx from "classnames";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Spin, Message, AutoComplete, Tabs, Typography, Tooltip, InputNumber, Table } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle, IconSearch } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import { changeUserData, changeMyDashboardList } from "metabase/redux/app";
import { changeGlobalSearchValue } from "metabase/redux/app";
import { LayoutDashboardApi, LayoutLoginApi, CardApi, MetabaseApi } from '@/services'
import RelatedDashboardList from './RelatedDashboardList';
import CreatorList from '@/web3goLayout/components/CreatorList';
import event from '@/web3goLayout/event';
import PublicQuestion from "@/public/containers/PublicQuestion";

import moment from 'moment';
import ShareModalDS from "@/web3goLayout/components/ShareModalDS";
import domtoimage from 'dom-to-image';
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
            ifTableMode: true,
            previewLimit: null,
            searchKey: '',
            loading: false,
            // 用来刷新
            showPublicDataset: true,
            screenShortLoading: false,
            myFollowingList: [],
            favouriteList: [],
            detailData: {
                name: '',
                tagList: [],
                nickName: '',
                createdAt: undefined
            },
            datasetData: {},
            dashboardId: '',
            refreshTime: moment().format('YYYY-MM-DD HH:mm'),
            pagination: {
                showJumper: true,
                total: 0,
                pageSize: 10,
                current: 1,
            },
            tableLoading: false
        }
        this.ShareModalRef = React.createRef();
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
        });
    }
    switchToTableMode = (flag) => {
        this.setState({
            ifTableMode: flag
        });
    }
    openShareModal() {
        this.ShareModalRef.init(this.state.detailData);
    }
    getMyFavourites = () => {
        if (!this.props.currentUser) {
            return;
        }
        LayoutDashboardApi.listMyFavoritesDS({
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
    componentDidMount() {
        this.getMyDashboards();
        this.getDatasetTable();
        this.getDatasetDetail();
    }
    getDatasetDetail = () => {
        LayoutDashboardApi.datasetDetail({ datasetIds: [this.props.params.id] }).then(d => {
            if (d.list.length) {
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
            }
        })
    }
    getDatasetTable = async () => {
        this.setState({
            loading: true
        });
        const id = this.props.params.id;
        const d = await CardApi.get({
            cardId: id
        })
        const obj = {
            "database": d.database_id,
            "type": "query",
            "query": { "source-table": 'card__' + id },
            "parameters": []
        }
        const d2 = await MetabaseApi.dataset(obj);
        this.setState({
            datasetData: { ...d, data: d2 },
            loading: false
        });
    }
    handleRefresh = async () => {
        this.setState({
            tableLoading: true
        });
        const id = this.props.params.id;
        const obj = {
            "database": this.state.datasetData.database_id,
            "type": "query",
            "query": { "source-table": 'card__' + id },
            "parameters": []
        }
        const d = await MetabaseApi.dataset(obj);
        this.setState({
            datasetData: { ...this.state.datasetData, data: d },
            loading: false,
            tableLoading: false,
            refreshTime: moment().format('YYYY-MM-DD HH:mm')
        });
    }
    getMyDashboards = () => {
        if (!this.props.userData.account) {
            this.props.changeMyDashboardList([]);
            return;
        }
        LayoutDashboardApi.datasetList({
            "pageSize": 999999999999,
            "pageIndex": 1,
            "orderBys": [],
            "tagIds": [],
            "searchName": '',
            "creator": this.props.userData.account.accountId,
        }).then(d => {
            this.props.changeMyDashboardList(d.list);
        });
    }
    goMySpace = (accountId) => {
        this.props.push(`/layout/mySpace?accountId=${accountId}`);
    }
    fork = (record) => {
        if (!this.props.currentUser) {
            event.emit('goSignIn');
            return;
        }
        const newName = record.name;
        LayoutDashboardApi.forkDS(record.id)().then(d => {
            const slug = slugg(newName);
            const suffix = slug ? `${d.newId}-${slug}` : d.newId;
            this.props.push({ pathname: `/layout/create/dataset/${suffix}` });
        })
    }
    toggleFavourite = () => {
        if (!this.props.currentUser) {
            event.emit('goSignIn');
            return;
        }
        const find = this.state.favouriteList.find(v => v.datasetId == this.state.detailData.id);
        LayoutDashboardApi.logFavoriteDS({
            "dataSetId": this.state.detailData.id,
            "operationFlag": find ? 'cancel' : 'add'
        }).then(d => {
            this.getMyFavourites();
        });
    }



    render() {
        const { detailData, refreshTime, previewLimit, searchKey, ifTableMode, datasetData, loading, tableLoading } = this.state;
        let columns = [];
        let formatTableData = [];
        if (datasetData.data && datasetData.data.data) {
            columns = datasetData.data.data.cols.map((v, i) => {
                return {
                    title: v.display_name,
                    dataIndex: i,
                }
            })
            formatTableData = datasetData.data.data.rows.map((v, i) => {
                const obj = {}
                obj.key = i;
                v.forEach((sv, si) => {
                    obj[si] = sv;
                });
                return obj
            });
        }

        formatTableData = formatTableData.filter((v, i) => {
            let limitFlag = true;

            if (previewLimit && i >= previewLimit) {
                limitFlag = false
            }
            let hasKey = false;
            for (const sv of Object.keys(v)) {
                if (v[sv] && String(v[sv]).includes(searchKey)) {
                    hasKey = true;
                }
            }
            return limitFlag && hasKey
        })
        return (
            <div className="web3go-datasetDetail-page common-form">
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
                                            <IconStar style={{ fontSize: 16 }} className={this.state.favouriteList.find(v => v.datasetId == this.state.detailData.id) ? 'star active' : 'star'} />
                                            <span>Favorite</span>
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="common-layout">
                    <Spin loading={loading} style={{ display: 'block', minHeight: 300 }}>
                        <div className="dashboard-wrap">
                            <div className="tab">
                                <div className={cx("item hover-item", { active: ifTableMode })} onClick={() => { this.switchToTableMode(true) }}>Table</div>
                                {
                                    datasetData.query_type == 'native' ? <div className={cx("item hover-item", { active: !ifTableMode })} onClick={() => { this.switchToTableMode(false) }}>SQL</div> : null
                                }
                            </div>
                            {
                                ifTableMode ? (
                                    <div className="table-mode">
                                        <div className="dashboard-top">
                                            <div className="left">
                                                <div className="search-item">
                                                    <Input
                                                        allowClear
                                                        onChange={(value) => { this.setState({ searchKey: value }) }}
                                                        prefix={<IconSearch />}
                                                        placeholder='Search in table'
                                                    />
                                                </div>
                                                <div className="limit">
                                                    <div className="prefix">Show</div>
                                                    <InputNumber min={0} value={previewLimit} onChange={(value) => { this.setState({ previewLimit: value }) }} style={{ width: 117 }} />
                                                    <div className="suffix">rows</div>
                                                </div>
                                                <Button type="primary" onClick={this.handleRefresh}>
                                                    <IconSync style={{ fontSize: 16 }} />
                                                    <span>Refresh</span>
                                                </Button>

                                            </div>
                                            <span className="time">Last run time:   {refreshTime}</span>
                                        </div>

                                        <Table loading={tableLoading} scroll={{ x: 'max-content' }} borderCell columns={columns} data={formatTableData} pagination={{ showTotal: true, showJumper: true, sizeCanChange: true, }} />
                                    </div>
                                ) : (
                                    <div className="sql-mode">
                                        {datasetData.dataset_query.native.query}
                                    </div>
                                )
                            }

                        </div>
                    </Spin>
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
                                // detailData.id ? <RelatedDashboardList detailData={detailData} myFollowingList={this.state.myFollowingList}></RelatedDashboardList> : null
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
                <ShareModalDS onRef={(ref) => this.ShareModalRef = ref}></ShareModalDS>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
