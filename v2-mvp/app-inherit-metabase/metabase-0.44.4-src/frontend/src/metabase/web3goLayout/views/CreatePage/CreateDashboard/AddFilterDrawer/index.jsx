/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { useState, useMemo, useEffect } from "react";
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Drawer, Radio, Switch, Select, } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import cx from "classnames";
import * as dashboardActions from "@/dashboard/actions";
import CommonDrawer from '@/web3goLayout/components/CommonDrawer';
import { getDashboardParameterSections } from "metabase/parameters/utils/dashboard-options";
const { Text } = Typography;
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
    }
};
const mapDispatchToProps = {
    ...dashboardActions,
    push,
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const Component = ({ addFilterDrawerVisible, changeAddFilterDrawerVisible, addParameter }) => {
    const [currentRadioObj, setCurrentRadioObj] = useState({});
    const [currentSubTypeObj, setCurrentSubTypeObj] = useState({});
    const [tabIndex, setTabIndex] = useState(0);
    const [labelName, setLabelName] = useState('');
    const PARAMETER_SECTIONS = getDashboardParameterSections();
    console.log('111', PARAMETER_SECTIONS);
    const handleCancel = () => {
        changeAddFilterDrawerVisible(false);
    }
    const handleOk = () => {
        addParameter({
            "type": "id",
            "name": "ID",
            "sectionId": "id"
        });
        changeAddFilterDrawerVisible(false);
    }
    const handleTabClick = (tabIndex) => {
        setTabIndex(tabIndex);
    }
    const handleSelectSubType = (value, option) => {
        const find = option.find(v => v.type == value);
        setCurrentSubTypeObj(find);
        setLabelName(find.name);
    }
    return (
        <CommonDrawer visible={addFilterDrawerVisible} onCancel={handleCancel} onOk={handleOk}>
            <div className="web3go-add-filter-drawer common-form">
                <div className="switch-list">
                    {
                        PARAMETER_SECTIONS.map(v => (
                            <div className="s-item" key={v.id}>
                                <Radio onClick={() => setCurrentRadioObj(v)} checked={currentRadioObj.id == v.id}>{v.name} ({v.description})</Radio>
                                {
                                    currentRadioObj.id == v.id ? (
                                        <div className="si-inner">
                                            <Select onChange={(value) => handleSelectSubType(value, v.options)
                                            } placeholder='Please select the type of filter' style={{ width: '100%' }}>
                                                {v.options.map(sv => (
                                                    <Option key={sv.type} value={sv.type}>
                                                        {sv.name}({sv.description})
                                                    </Option>
                                                ))}
                                            </Select>
                                            <div className="setting-content">
                                                <div className="tab-list">
                                                    <div className={cx("tab", { active: tabIndex == 0 })} onClick={() => handleTabClick(0)}>Setting</div>
                                                    <div className={cx("tab", { active: tabIndex == 1 })} onClick={() => handleTabClick(1)}>Linked filters</div>
                                                </div>
                                                {
                                                    tabIndex == 0 ? (
                                                        <div className="tab-content">
                                                            <div className="label">Filter's name</div>
                                                            <Input value={labelName} onChange={setLabelName} style={{ width: '100%' }} allowClear />
                                                            <div className="label second">Default value</div>
                                                            <Input style={{ width: '100%' }} allowClear />
                                                        </div>
                                                    ) :
                                                        (
                                                            <div className="tab-content">
                                                                <div className="t-title">Limit this filter's choices</div>
                                                                <div className="tip">If you toggle on one of these dashboard filters, selecting a value for that filter will limit the available choices for this filter.</div>
                                                                <div className="switch-list">
                                                                    <div className="switch-item">
                                                                        <span className="text">Data Filter</span>
                                                                        <Switch></Switch>
                                                                    </div>
                                                                    <div className="switch-item">
                                                                        <span className="text">Data Filter</span>
                                                                        <Switch></Switch>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                }
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </CommonDrawer>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
