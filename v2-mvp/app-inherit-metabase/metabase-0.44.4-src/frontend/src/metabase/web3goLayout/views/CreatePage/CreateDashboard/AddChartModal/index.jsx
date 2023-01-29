/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Drawer } from '@arco-design/web-react';
import { IconSearch, IconPlus } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import cx from "classnames";
import QueryBuilder from "metabase/query_builder/containers/QueryBuilder";

const { Text } = Typography;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
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
            visible: true,
            ifEditChartName: false,
            chartName: 'New Chart',
        }
        this.ChartNameInputRef = React.createRef();

    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = () => {
        this.setState({
            visible: true
        });
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
    handleSure = () => {

    }
    handleSearchDataset = () => {
         
    }
    render() {
        const { chartName, ifEditChartName, visible } = this.state;
        return (
            <Drawer
                width={'100%'}
                title={null}
                footer={null}
                closable={false}
                visible={visible}
                wrapClassName="web3go-add-dashboard-add-chart-drawer"
                onOk={this.handleSure}
                onCancel={() => { this.setState({ visible: false }) }}
            >
                <div className={cx("d-title", { edit: ifEditChartName })}>
                    <div className="left">
                        <img className="back hover-item"
                            onClick={() => { this.setState({ visible: false }) }}
                            src={require("@/web3goLayout/assets/dashboardCreate/back.png")}
                            alt="" />
                        <Input ref={this.ChartNameInputRef} className="input" type="text" value={chartName} onChange={this.changeChartName} onBlur={this.finishEditChartName} onPressEnter={this.finishEditChartName} />
                        <span className="text">{chartName}</span>
                        {ifEditChartName ?
                            null :
                            <img className="edit hover-item" onClick={this.handleEditChartName} src={require("@/web3goLayout/assets/dashboardCreate/edit.png")} alt="" />
                        }
                    </div>
                    <img className="close hover-item" onClick={() => { this.setState({ visible: false }) }} src={require("@/web3goLayout/assets/dashboardCreate/close.png")} alt="" />
                </div>
                <div className="d-main">
                    <div className="dm-left">
                        <div className="dml-title">Dataset</div>
                        <div className="search-wrap">
                            <Input
                                prefix={<IconSearch className="hover-item" onClick={this.handleSearchDataset} />}
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
                            <div className="item">
                                <img src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                <div title="Marketing Coordinator Coordinator Coordinator Coordinator" className="text">Marketing Coordinator Coordinator Coordinator Coordinator</div>
                            </div>
                            <div className="item">
                                <img src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                <div className="text">Marketing Coordinator</div>
                            </div>
                            <div className="item">
                                <img src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                <div className="text">Marketing Coordinator</div>
                            </div>
                        </div>
                        <div className="manage-wrap">
                            <Button className="btn" type='outline'>Manage dataset</Button>
                        </div>
                    </div>
                    <div className="dm-middle">
                        {/* <QueryBuilder location={this.props.location} params={this.props.params}></QueryBuilder> */}
                    </div>
                </div>
                <div className="d-footer">
                    <div className="f-left">
                        <Button className="btn" type="secondary">duplicate from other dashboards</Button>
                    </div>
                    <div className="f-right">
                        <Button className="btn" type="primary">Cancel</Button>
                        <Button className="btn" type="secondary">OK</Button>
                    </div>
                </div>
            </Drawer>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
