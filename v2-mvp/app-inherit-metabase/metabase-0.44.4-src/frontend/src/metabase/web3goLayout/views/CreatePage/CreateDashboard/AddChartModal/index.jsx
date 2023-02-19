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
import { LayoutDashboardApi } from '@/services'
// import { GET } from "metabase/lib/api";
import { parse as parseUrl } from "url";
import slugg from "slugg";

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
            saveChartLoading: false,
            searchKey: '',
            datasetLoading: false,
            visible: false,
            ifEditChartName: false,
            chartName: 'New Chart',
            datasetList: [],
            refreshFlag: true,
            ifAdd: true
        }
        this.ChartNameInputRef = React.createRef();

    }
    componentDidMount() {
        this.props.onRef(this);
    }
    init = (chartObj) => {
        this.setState({
            visible: true,
            ifAdd: chartObj ? false : true,
            currentModifyChart: chartObj,
        });
        this.getDatasetList();
        if (chartObj) {
            const chartData = chartObj.dashboard.ordered_cards.find(v => v.id == chartObj.dashcardId);
            const name = chartData.card.name;
            this.setState({
                chartName: name
            });
            const slug = slugg(name);
            const suffix = slug ? `${chartData.card.id}-${slug}` : chartData.card.id;
            if (chartObj.dashboard.id == '-1') {
                this.props.push({ pathname: `/layout/create/question/${suffix}` });
            } else {
                this.props.push({ pathname: `/layout/create/question/${suffix}/${this.props.params.dashboardSlug}` });
            }
            this.setState({
                refreshFlag: false
            }, () => {
                this.setState({
                    refreshFlag: true
                })
            });
        }
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
        // const getVirtualDatasetTables = GET("/api/database/:dbId/datasets/:schemaName");
        // getVirtualDatasetTables({ dbId: -1337, schemaName: 'PublicSpace' }).then(d => {
        //     this.setState({
        //         datasetList: d,
        //         datasetLoading: false
        //     });
        // })
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
            // hash: encodeURIComponent(urlParsed.hash),
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
        this.setState({
            saveChartLoading: true
        });
        event.emit('addChartSave', this.state.chartName, async (cardId) => {
            if (this.state.ifAdd) {
                await this.props.addChartToDashboard(cardId);
            } else {
                await this.props.removeAndAddChatToDashboard(cardId, this.state.currentModifyChart);
            }
            this.setState({
                visible: false,
                saveChartLoading: false
            })
        }, () => {
            this.setState({
                saveChartLoading: false
            });
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            datasetList: []
        });
        this.props.push({
            pathname: this.props.params.dashboardSlug ? `/layout/create/${this.props.params.dashboardSlug}` : '/layout/create',
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
        const { chartName, ifEditChartName, visible, refreshFlag, saveChartLoading } = this.state;
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
                            <Button className="btn" type='outline' onClick={() => { this.props.changeTopTab(0) }}>Manage dataset</Button>
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
                        <Button className="btn" type="secondary" onClick={() => { this.props.push('/layout/dashBoardList') }}>duplicate from other dashboards</Button>
                    </div>
                    <div className="f-right">
                        <Button className="btn" type="secondary" onClick={this.handleCancel}>Cancel</Button>
                        <Button loading={saveChartLoading} className="btn" type="primary" onClick={this.handleOk}>OK</Button>
                    </div>
                </div>
            </Drawer>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
