/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Select, Spin, Switch, Collapse } from '@arco-design/web-react';
import { IconSearch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push, replace } from "react-router-redux";
import cx from "classnames";
import { LayoutDashboardApi, MetabaseApi } from '@/services'
import event from '@/web3goLayout/event';
import slugg from "slugg";

import DatasetRightMain from "./DatasetRightMain";
import {
    getCard,
    getQuestion,
    getDatabasesList,
} from "@/query_builder/selectors";
const CollapseItem = Collapse.Item;
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        question: getQuestion(state),
        card: getCard(state),
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        databaseList: state.entities.databases,
    }
};
const mapDispatchToProps = {
    push,
    replace
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hideSideBar: false,
            tabIndex: '1',
            ifEditDatasetName: false,
            datasetName: 'New dataset',
            tagList: [],
            savedCurrentTagList: [],
            ifEditTag: false,
            addTagName: '',
            allTagList: [],
            searchKey: '',
            datasetList: [],
            rawDataList: [],
            savedAllTagList: [],
            saveBtnLoading: false,
            postBtnLoading: false,
            rawDataLoading: false,
            isEditing: true,
            options: ['Beijing', 'Shanghai', 'Guangzhou', 'Disabled']
        }
        this.datasetNameInputRef = React.createRef();
        this.tagInputRef = React.createRef();
        this.DatasetRightMainRef = React.createRef();
    }
    componentDidMount() {
        // this.getDashboardTags(currentDashboardId);
        // this.getAllTagList();
        this.getDatasetList();
    }
    componentDidUpdate(prevProp) {
        if (prevProp.databaseList !== this.props.databaseList) {
            this.getAllRawData();
        }
    }
    getAllRawData = async () => {
        this.setState({
            rawDataLoading: true
        });
        const { databaseList } = this.props;
        const databaserIdList = Object.keys(databaseList);
        const promiseArr = [];
        for (const v of databaserIdList) {
            promiseArr.push(MetabaseApi.db_schemas({ dbId: v }))
        }
        const schemasResult = await Promise.all(promiseArr);
        const promiseArr2 = [];
        for (const [i, v] of schemasResult.entries()) {
            for (const sv of v) {
                promiseArr2.push(MetabaseApi.db_schema_tables({ dbId: databaserIdList[i], schemaName: sv }))
            }
        }
        const tableResults = await Promise.all(promiseArr2);
        let rawDataList = [];
        tableResults.forEach(v => {
            rawDataList = [...rawDataList, ...v]
        })
        this.setState({
            rawDataList,
            rawDataLoading: false
        });
    }
    changeSearchKey = (value) => {
        this.setState({
            searchKey: value
        })
    }
    getDatasetList = () => {
        this.setState({
            datasetLoading: true
        })
        LayoutDashboardApi.getDataSets().then(d => {
            this.setState({
                datasetList: d,
                datasetLoading: false
            });
        })
    }
    getDashboardTags = (currentDashboardId) => {
        LayoutDashboardApi.listDashboardTags(currentDashboardId)().then(d => {
            this.setState({
                tagList: d.map(v => v.tag_name),
                savedCurrentTagList: d
            });
        })
    }
    getAllTagList = () => {
        LayoutDashboardApi.listAllTags().then(d => {
            this.setState({
                savedAllTagList: d,
                allTagList: d.map(v => v.tagName)
            });
        });
    }
    changeDataset = (value) => {
        this.setState({
            datasetName: value
        })
    }
    handleEditDatasetName = () => {
        this.setState({ ifEditDatasetName: true }, () => {
            this.datasetNameInputRef.current.focus();
        });
    }
    finishEditDatasetName = () => {
        this.setState({
            ifEditDatasetName: false
        })
    }
    handleEditTag = () => {
        this.setState({ ifEditTag: true, addTagName: '' }, () => {
            this.tagInputRef.current.focus();
        });
    }
    changeTagName = (value) => {
        this.setState({
            addTagName: value
        })
    }
    finishEditTag = () => {
        if (!this.state.addTagName) {
            this.setState({
                ifEditTag: false
            })
            return;
        }
        this.setState({
            tagList: [...this.state.tagList, this.state.addTagName],
            ifEditTag: false
        })
    }
    removeTag = (i) => {
        const tagList = [...this.state.tagList];
        tagList.splice(i, 1);
        this.setState({
            tagList,
        })
    }
    handleCancel = () => {
        this.props.replace('/layout/mySpace');
    }
    saveTag = (newDashbarodId) => {
        const { tagList, savedAllTagList, savedCurrentTagList } = this.state;
        let currentDashboardId = newDashbarodId || this.state.currentDashboardId;
        const removeTagList = [];
        const markTagList = [];
        tagList.forEach(v => {
            if (!savedCurrentTagList.find(sv => sv.tag_name == v)) {
                const find = savedAllTagList.find(sv => sv.tagName == v)
                if (find) {
                    markTagList.push(find);

                } else {
                    LayoutDashboardApi.AddTag({
                        "dashboardId": currentDashboardId,
                        "tagName": v
                    })
                }
            }
        });
        savedCurrentTagList.forEach(v => {
            if (!tagList.includes(v.tag_name)) {
                removeTagList.push(v);
            }
        })
        if (markTagList.length) {
            LayoutDashboardApi.markTags({
                "dashboardId": currentDashboardId,
                "tagIds": markTagList.map(v => v.id)
            })
        }
        if (removeTagList.length) {
            LayoutDashboardApi.removeTags({
                "dashboardId": currentDashboardId,
                "tagIds": removeTagList.map(v => v.id)
            })
        }
    }
    handlePostDashboard = (isDraft) => {
        if (this.state.saveBtnLoading || this.state.postBtnLoading) {
            return;
        }
        const loadingKey = isDraft ? 'saveBtnLoading' : 'postBtnLoading';
        // 改了名字，得先触发blur事件再保存
        setTimeout(async () => {
            this.setState({
                [loadingKey]: true
            });
            event.emit('addChartSave', this.state.datasetName, async (cardId, card) => {
                this.setState({
                    chartName: card.name
                });
                const slug = slugg(card.name);
                const suffix = slug ? `${cardId}-${slug}` : cardId;
                const dashboardSlug = this.props.params.dashboardSlug;
                if (!dashboardSlug) {
                    this.props.replace({ pathname: `/layout/create/dataset/${suffix}` });
                } else {
                    this.props.replace({ pathname: `/layout/create/dataset/${suffix}/${this.props.params.dashboardSlug}` });
                }
                this.DatasetRightMainRef.refreshQueryBuilder();
                this.setState({
                    [loadingKey]: false
                });
            }, () => { }, true);
        }, 0);
    }
    changeTab = (key) => {
        this.setState({ tabIndex: key });
    }
    clickRowDataItem = (v) => {
        this.DatasetRightMainRef.init(v);
    }
    clickDatasetItem = (v) => {
        this.DatasetRightMainRef.init(v);
    }
    get formatDatasetList() {
        const { datasetList, searchKey } = this.state;
        return datasetList.filter(v => v.display_name.toLowerCase().includes(searchKey.toLowerCase()));
    }
    get formatRowDataList() {
        const { rawDataList, searchKey } = this.state;
        return rawDataList.filter(v => v.display_name.toLowerCase().includes(searchKey.toLowerCase()));
    }
    render() {
        const { tagList, datasetName, ifEditDatasetName, ifEditTag, allTagList,
            isEditing, originDashboardDetail, options, rawDataLoading, hideSideBar } = this.state;
        return (
            <div className="web3go-dataset-create-page">
                <div className="p-top">
                    <div className="pt-left">
                        <div className="ptl-icon">
                            <img src={require("@/web3goLayout/assets/dashboardCreate/Dashboard-line1.png")} alt="" />
                        </div>
                        <div className="ptl-right">
                            <div className={cx("title", { edit: ifEditDatasetName })}>
                                <Input ref={this.datasetNameInputRef} className="input" type="text" value={datasetName} onChange={this.changeDataset} onBlur={this.finishEditDatasetName} onPressEnter={this.finishEditDatasetName} />
                                <span className="text">{datasetName}</span>
                                {ifEditDatasetName ?
                                    null :
                                    <img onClick={this.handleEditDatasetName} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/edit.png")} alt="" />
                                }
                            </div>
                            <div className="tag-list">
                                {tagList.map((v, i) => (<div className="item" key={i}>
                                    <span>{v}</span>
                                    <img onClick={() => { this.removeTag(i) }} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/close.png")} alt="" />
                                </div>))}
                                {
                                    ifEditTag ? (
                                        <div className="add-tag hover-item">
                                            <AutoComplete ref={this.tagInputRef} data={allTagList} className="input" type="text" onChange={this.changeTagName} onBlur={this.finishEditTag} onPressEnter={this.finishEditTag} ></AutoComplete>
                                            {/* <Input ref={this.tagInputRef} className="input" type="text" onChange={this.changeTagName} onBlur={this.finishEditTag} onPressEnter={this.finishEditTag} /> */}
                                        </div>
                                    ) : (
                                        <div className="add-tag hover-item" onClick={this.handleEditTag}>
                                            <img src={require("@/web3goLayout/assets/dashboardCreate/add.png")} alt="" />
                                            <span>Add tag</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {

                        <div className="pt-right">
                            <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                            <Button className="btn" loading={this.state.saveBtnLoading} onClick={() => this.handlePostDashboard(true)}>Save Draft</Button>
                            <Button className="btn" loading={this.state.postBtnLoading} onClick={() => this.handlePostDashboard(false)} type="primary">Post</Button>
                            <Button disabled className="btn" onClick={() => this.handlePostDashboard(false)} type="primary">Build Dashboard</Button>
                        </div>
                        // <div className="pt-right">
                        //     <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                        //     <Button className="btn" loading={this.state.postBtnLoading} onClick={() => this.handlePostDashboard(false)} type="primary">Save</Button>
                        // </div>
                    }
                </div>
                <div className="tabs">
                    <Tabs defaultActiveTab='1' onChange={this.changeTab}>
                        <TabPane key='1' title='Data Editor'>
                        </TabPane>
                        <TabPane key='2' title='SQL'>
                        </TabPane>
                    </Tabs>
                </div>
                <div className={cx("p-main", { 's-hide': hideSideBar ? true : false })}>
                    <img onClick={() => { this.setState({ hideSideBar: !hideSideBar }) }} className="side-hide-icon hover-item" src={require("@/web3goLayout/assets/dashboardCreate/right_circle.png")} alt="" />
                    <div className={cx("side")}>
                        <div className="scroll">
                            <div className="search-item">
                                <Input
                                    allowClear
                                    onChange={this.changeSearchKey}
                                    prefix={<IconSearch />}
                                    placeholder='Search dataset…'
                                />
                            </div>
                            <div className="search-item">
                                <Select
                                    allowClear
                                    placeholder='All dataset tags'
                                    onChange={(value) => { }}
                                >
                                    {options.map((option, index) => (
                                        <Option key={option} value={option}>
                                            {option}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="search-item">
                                <Select
                                    allowClear
                                    placeholder='Created by following creator'
                                    onChange={(value) => { }}
                                >
                                    {options.map((option, index) => (
                                        <Option key={option} value={option}>
                                            {option}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="search-item switch-wrap">
                                <span>My favorite</span>
                                <Switch />
                            </div>
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1']}
                            >
                                <CollapseItem header='Community datasets' name='1'>
                                    <div className="dataset-list">
                                        {this.formatDatasetList.map(v => (
                                            <div className="item" key={v.id} onClick={() => { this.clickDatasetItem(v) }}>
                                                <img src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                                <Tooltip content={v.display_name}>
                                                    <div className="text">{v.display_name}</div>
                                                </Tooltip>
                                            </div>
                                        ))}
                                    </div>
                                </CollapseItem>
                                <CollapseItem header='Raw data' name='2'>
                                    <Spin loading={rawDataLoading} style={{ display: 'block', minHeight: 100 }}>
                                        <div className="raw-data-list">
                                            {this.formatRowDataList.map(v => (
                                                <div className="item" key={v.id} onClick={() => { this.clickRowDataItem(v) }}>
                                                    <img src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                                    <Tooltip content={v.display_name}>
                                                        <div className="text">{v.display_name}</div>
                                                    </Tooltip>
                                                </div>
                                            ))}
                                        </div>
                                    </Spin>
                                </CollapseItem>
                            </Collapse>
                        </div>
                    </div>
                    <div className="r-main">
                        <DatasetRightMain {...this.props} onRef={(ref) => this.DatasetRightMainRef = ref}></DatasetRightMain>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
