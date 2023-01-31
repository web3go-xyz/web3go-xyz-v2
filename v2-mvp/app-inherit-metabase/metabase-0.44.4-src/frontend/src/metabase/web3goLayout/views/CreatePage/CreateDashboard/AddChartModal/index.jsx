/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Spin, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Drawer } from '@arco-design/web-react';
import { IconSearch, IconPlus } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import cx from "classnames";
import QueryBuilder from "metabase/query_builder/containers/QueryBuilder";
import event from '@/web3goLayout/event';
import { GET } from "metabase/lib/api";
import { parse as parseUrl } from "url";

import {
    getURLForCardState,
} from "@/query_builder/utils";
import {
    getQuery,
    getQuestion
} from "@/query_builder/selectors";
const { Text } = Typography;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        query: getQuery(state),
        question: getQuestion(state),
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
            searchKey: '',
            datasetLoading: false,
            visible: false,
            ifEditChartName: false,
            chartName: 'New Chart',
            datasetList: [],
            refreshFlag: true
        }
        this.ChartNameInputRef = React.createRef();

    }
    componentDidMount() {
        this.props.onRef(this);
    }
    init = () => {
        this.setState({
            visible: true
        });
        this.getDatasetList();
    }
    getDatasetList = () => {
        this.setState({
            datasetLoading: true
        })
        const getVirtualDatasetTables = GET("/api/database/:dbId/datasets/:schemaName");
        getVirtualDatasetTables({ dbId: -1337, schemaName: 'PublicSpace' }).then(d => {
            this.setState({
                datasetList: d,
                datasetLoading: false
            });
        })
    }
    changeChartName = (value) => {
        this.setState({
            chartName: value
        })
    }
    handleEditChartName = () => {
        this.setState({ ifEditChartName: true }, () => {
            this.ChartNameInputRef.current.focus();
        });
    }
    finishEditChartName = () => {
        this.setState({
            ifEditChartName: false
        })
    }
    changeSearchKey = (value) => {
        this.setState({
            searchKey: value
        })
    }

    clickDatasetItem = (v) => {
        const newState = {
            "card": {
                "dataset_query": {
                    "database": v.db_id,
                    "type": "query",
                    "query": {
                        "source-table": v.id
                    }
                },
                "visualization_settings": {},
                "display": "table"
            }
        };
        const url = getURLForCardState(newState, true, {}, undefined);
        const urlParsed = parseUrl(url);
        const locationDescriptor = {
            pathname: window.location.pathname,
            search: urlParsed.search,
            hash: urlParsed.hash,
            state: newState
        };
        this.props.push(locationDescriptor);
        this.setState({
            refreshFlag: false
        }, () => {
            this.setState({
                refreshFlag: true
            })
        });
    }
    handleOk = () => {
        event.emit('addChartSave', this.state.chartName);
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            datasetList: []
        });
        this.props.push({
            pathname: window.location.pathname,
            hash: '',
            query: this.props.location.query,
            search: this.props.location.search,
            state: {}
        });
    }
    get formatDatasetList() {
        const { datasetList, searchKey } = this.state;
        return datasetList.filter(v => v.display_name.includes(searchKey));
    }
    render() {
        const { chartName, ifEditChartName, visible, refreshFlag } = this.state;
        return (
            <Drawer
                width={'100%'}
                title={null}
                footer={null}
                closable={false}
                visible={visible}
                wrapClassName="web3go-add-dashboard-add-chart-drawer"
            >
                <div className={cx("d-title", { edit: ifEditChartName })}>
                    <div className="left">
                        <img className="back hover-item"
                            onClick={this.handleCancel}
                            src={require("@/web3goLayout/assets/dashboardCreate/back.png")}
                            alt="" />
                        <Input ref={this.ChartNameInputRef} className="input" type="text" value={chartName} onChange={this.changeChartName} onBlur={this.finishEditChartName} onPressEnter={this.finishEditChartName} />
                        <span className="text">{chartName}</span>
                        {ifEditChartName ?
                            null :
                            <img className="edit hover-item" onClick={this.handleEditChartName} src={require("@/web3goLayout/assets/dashboardCreate/edit.png")} alt="" />
                        }
                    </div>
                    <img className="close hover-item" onClick={this.handleCancel} src={require("@/web3goLayout/assets/dashboardCreate/close.png")} alt="" />
                </div>
                <div className="d-main">
                    <div className="dm-left">
                        <div className="dml-title">Dataset</div>
                        <div className="search-wrap">
                            <Input
                                onChange={this.changeSearchKey}
                                prefix={<IconSearch />}
                                placeholder='Search dataset…'
                            />
                        </div>
                        <div className="add-btn-wrap">
                            <Button className="btn" type="primary">
                                <IconPlus />
                                <span>Add NewDataset</span>
                            </Button>
                        </div>
                        <div className="dataset-list">
                            <Spin loading={this.state.datasetLoading} style={{ display: 'block', minHeight: 100 }}>
                                {this.formatDatasetList.map(v => (
                                    <div className="item" key={v.id} onClick={() => { this.clickDatasetItem(v) }}>
                                        <img src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                        <div title={v.display_name} className="text">{v.display_name}</div>
                                    </div>
                                ))}
                            </Spin>
                        </div>
                        <div className="manage-wrap">
                            <Button className="btn" type='outline'>Manage dataset</Button>
                        </div>
                    </div>
                    <div className="dm-middle">
                        {
                            refreshFlag && visible ? <QueryBuilder {...this.props}></QueryBuilder> : null
                        }

                    </div>
                </div>
                <div className="d-footer">
                    <div className="f-left">
                        <Button className="btn" type="secondary">duplicate from other dashboards</Button>
                    </div>
                    <div className="f-right">
                        <Button className="btn" type="primary" onClick={this.handleCancel}>Cancel</Button>
                        <Button className="btn" type="secondary" onClick={this.handleOk}>OK</Button>
                    </div>
                </div>
            </Drawer>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
