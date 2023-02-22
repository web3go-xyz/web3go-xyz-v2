/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Select, Spin, Switch, Collapse } from '@arco-design/web-react';
import { IconSearch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import cx from "classnames";
import { LayoutDashboardApi } from '@/services'
import {
    getDatabasesList,
} from "@/query_builder/selectors";
const CollapseItem = Collapse.Item;
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        // databaseList: state.entities.,
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
            tabIndex: '1',
            ifEditDashboardName: false,
            dashboardName: 'New dataset',
            tagList: [],
            savedCurrentTagList: [],
            ifEditTag: false,
            addTagName: '',
            allTagList: [],
            searchKey: '',
            datasetList: [],
            savedAllTagList: [],
            saveBtnLoading: false,
            postBtnLoading: false,
            collapseLoading: false,
            isEditing: true,
            options: ['Beijing', 'Shanghai', 'Guangzhou', 'Disabled']
        }
        this.dashboardNameInputRef = React.createRef();
        this.tagInputRef = React.createRef();
    }
    componentDidMount() {
        // this.getDashboardTags(currentDashboardId);
        // this.getAllTagList();
        this.getDatasetList();
        this.getAllRawData();
    }
    getAllRawData = () => {

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
    changeDashboardName = (value) => {
        this.setState({
            dashboardName: value
        })
    }
    handleEditDashboardName = () => {
        this.setState({ ifEditDashboardName: true }, () => {
            this.dashboardNameInputRef.current.focus();
        });
    }
    finishEditDashboardName = () => {
        this.setState({
            ifEditDashboardName: false
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
    handlePostDashboard = () => {

    }
    changeTab = (key) => {
        this.setState({ tabIndex: key });
    }
    clickDatasetItem = (v) => {
        // const newState = {
        //     "card": {
        //         "dataset_query": {
        //             "database": v.db_id,
        //             "type": "query",
        //             "query": {
        //                 "source-table": v.id
        //             }
        //         },
        //         "visualization_settings": {},
        //         "display": "table"
        //     }
        // };
        // const url = getURLForCardState(newState, true, {}, undefined);
        // const urlParsed = parseUrl(url);
        // const locationDescriptor = {
        //     pathname: window.location.pathname,
        //     search: urlParsed.search,
        //     // hash: encodeURIComponent(urlParsed.hash),
        //     hash: urlParsed.hash,
        //     state: newState
        // };
        // this.props.replace(locationDescriptor);
        // this.setState({
        //     refreshFlag: false
        // }, () => {
        //     this.setState({
        //         refreshFlag: true
        //     })
        // });
    }
    get formatDatasetList() {
        const { datasetList, searchKey } = this.state;
        return datasetList.filter(v => v.display_name.includes(searchKey));
    }
    render() {
        console.log('111', this.props);
        const { tagList, dashboardName, ifEditDashboardName, ifEditTag, allTagList, isEditing, originDashboardDetail, options, collapseLoading } = this.state;
        return (
            <div className="web3go-dataset-create-page">
                <div className="p-top">
                    <div className="pt-left">
                        <div className="ptl-icon">
                            <img src={require("@/web3goLayout/assets/dashboardCreate/Dashboard-line1.png")} alt="" />
                        </div>
                        <div className="ptl-right">
                            <div className={cx("title", { edit: ifEditDashboardName })}>
                                <Input ref={this.dashboardNameInputRef} className="input" type="text" value={dashboardName} onChange={this.changeDashboardName} onBlur={this.finishEditDashboardName} onPressEnter={this.finishEditDashboardName} />
                                <span className="text">{dashboardName}</span>
                                {ifEditDashboardName ?
                                    null :
                                    <img onClick={this.handleEditDashboardName} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/edit.png")} alt="" />
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
                            <Button disabled className="btn" loading={this.state.postBtnLoading} onClick={() => this.handlePostDashboard(false)} type="primary">Build Dashboard</Button>
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
                <div className="p-main">
                    <div className="side">
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
                        <Spin loading={collapseLoading} style={{ display: 'block', minHeight: 100 }}>
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1']}
                            >
                                <CollapseItem header='Community datasets' name='1'>
                                    <div className="dataset-list">
                                        {this.formatDatasetList.map(v => (
                                            <div className="item" key={v.id} onClick={() => { this.clickDatasetItem(v) }}>
                                                <img src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                                <div title={v.display_name} className="text">{v.display_name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapseItem>
                                <CollapseItem header='Raw data' name='2'>
                                    <div className="raw-data-list">
                                        <div className="item">

                                        </div>
                                    </div>
                                </CollapseItem>

                            </Collapse>
                        </Spin>
                    </div>
                    <div className="r-main">

                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
