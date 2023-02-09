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
import event from '@/web3goLayout/event';

const { Text } = Typography;
const Option = Select.Option;
import ParameterValueWidget from "metabase/parameters/components/ParameterValueWidget";
import { OtherParameterList2 } from '@/parameters/components/ParameterSidebar'
import {
    canUseLinkedFilters
} from "metabase/parameters/utils/linked-filters";
import {
    createParameter,
    setParameterName as setParamName,
    setParameterDefaultValue as setParamDefaultValue,
    getDashboardUiParameters,
    getParametersMappedToDashcard,
    getFilteringParameterValuesMap,
    getParameterValuesSearchKey,
} from "metabase/parameters/utils/dashboards";
import {
    getIsEditing,
    getIsSharing,
    getDashboardBeforeEditing,
    getIsEditingParameter,
    getIsDirty,
    getDashboardComplete,
    getCardData,
    getSlowCards,
    getEditingParameter,
    getParameters,
    getParameterValues,
    getLoadingStartTime,
    getClickBehaviorSidebarDashcard,
    getIsAddParameterPopoverOpen,
    getSidebar,
    getShowAddQuestionSidebar,
    getFavicon,
    getDocumentTitle,
    getIsRunning,
    getIsLoadingComplete,
    getIsHeaderVisible,
    getIsAdditionalInfoVisible,
} from "@/dashboard/selectors";
const mapStateToProps = (state, props) => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        parameters: getParameters(state, props),
    }
};
const mapDispatchToProps = {
    ...dashboardActions,
    push,
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const Component = ({ addFilterDrawerVisible, changeAddFilterDrawerVisible, addFilterDrawerIsEdit, changeAddFilterDrawerIsEdit, addParameterNotOpenSideBar, parameters, setParameter }) => {
    const [currentRadioObj, setCurrentRadioObj] = useState({});
    const [currentSubTypeObj, setCurrentSubTypeObj] = useState({});
    const [tabIndex, setTabIndex] = useState(0);
    const [parameterObj, setParameterObj] = useState({});
    const PARAMETER_SECTIONS = getDashboardParameterSections();
    useEffect(() => {
        if (!addFilterDrawerIsEdit) {
            setCurrentRadioObj({});
            setCurrentSubTypeObj({});
            setTabIndex(0);
            setParameterObj({});
        }
    }, [addFilterDrawerIsEdit]);

    const editDashboardFilterHandler = (id) => {
        changeAddFilterDrawerIsEdit(true);
        changeAddFilterDrawerVisible(true);
        const parameter = parameters.find(v => v.id == id);
        console.log('parameter', parameter);
        setParameterObj(parameter);
        PARAMETER_SECTIONS.forEach(v => {
            v.options.forEach(sv => {
                if (sv.type == parameter.type) {
                    setCurrentRadioObj(v);
                    setCurrentSubTypeObj(sv);
                }
            });
        });
        setTabIndex(0);
    }
    useEffect(() => {
        event.on('editDashboardFilter', editDashboardFilterHandler)
        return () => {
            event.off('editDashboardFilter', editDashboardFilterHandler)
        };
    }, [parameters]);
    const handleCancel = () => {
        changeAddFilterDrawerVisible(false);
    }
    const handleOk = async () => {
        if (addFilterDrawerIsEdit) {
            setParameter(parameterObj.id, { ...parameterObj });
            changeAddFilterDrawerVisible(false);
        } else {
            const _parameter = await addParameterNotOpenSideBar(currentSubTypeObj);
            const parameter = _parameter.payload;
            setParameter(parameter.id, { ...parameterObj, id: parameter.id });
            changeAddFilterDrawerVisible(false);
        }
    }
    const handleChangeRadio = (v) => {
        setCurrentRadioObj(v);
        setCurrentSubTypeObj({});
        setTabIndex(0);
        setParameterObj({ id: parameterObj.id });
    }
    const handleTabClick = (tabIndex) => {
        setTabIndex(tabIndex);
    }
    const handleSelectSubType = (value, option) => {
        const find = option.find(v => v.type == value);
        setCurrentSubTypeObj(find);
        const param = createParameter(find, []);
        if (addFilterDrawerIsEdit) {
            param.id = parameterObj.id
        }
        setParameterObj({ ...param, fields: [] });
    }
    const parameterWidgetSetValue = (value) => {
        setParameterObj({ ...parameterObj, default: value });
    }
    const arr = _.partition(
        parameters,
        p => p.id === parameterObj.id,
    );
    const otherParameters = addFilterDrawerIsEdit ? arr[1] : parameters;
    return (
        <CommonDrawer visible={addFilterDrawerVisible} onCancel={handleCancel} onOk={handleOk}>
            <div className="web3go-add-filter-drawer common-form">
                <div className="switch-list">
                    {
                        PARAMETER_SECTIONS.map(v => (
                            <div className="s-item" key={v.id}>
                                <Radio onClick={() => handleChangeRadio(v)} checked={currentRadioObj.id == v.id}>{v.name} ({v.description})</Radio>
                                {
                                    currentRadioObj.id == v.id ? (
                                        <div className="si-inner">
                                            <Select value={currentSubTypeObj.type} onChange={(value) => handleSelectSubType(value, v.options)
                                            } placeholder='Please select the type of filter' style={{ width: '100%' }}>
                                                {v.options.map(sv => (
                                                    <Option key={sv.type} value={sv.type} title={sv.description}>
                                                        {sv.name}{sv.description ? `(${sv.description})` : ''}
                                                    </Option>
                                                ))}
                                            </Select>
                                            <div className="setting-content">
                                                <div className="tab-list">
                                                    <div className={cx("tab", { active: tabIndex == 0 })} onClick={() => handleTabClick(0)}>Setting</div>
                                                    {canUseLinkedFilters(parameterObj) ? <div className={cx("tab", { active: tabIndex == 1 })} onClick={() => handleTabClick(1)}>Linked filters</div> : null}

                                                </div>
                                                {
                                                    tabIndex == 0 ? (
                                                        <div className="tab-content">
                                                            <div className="label">Filter's name</div>
                                                            <Input value={parameterObj.name} onChange={(value) => setParameterObj({ ...parameterObj, name: value })} style={{ width: '100%' }} allowClear />
                                                            <div className="label second">Default value</div>
                                                            {
                                                                currentSubTypeObj.type ? <ParameterValueWidget
                                                                    parameter={parameterObj}
                                                                    name={parameterObj.name}
                                                                    value={parameterObj.default}
                                                                    setValue={parameterWidgetSetValue}
                                                                    placeholder={`No default`}
                                                                    className="input bg-white"
                                                                /> : null
                                                            }
                                                        </div>
                                                    ) :
                                                        (
                                                            <div className="tab-content">
                                                                {/* <div className="t-title">Limit this filter's choices</div>
                                                                <div className="tip">If you toggle on one of these dashboard filters, selecting a value for that filter will limit the available choices for this filter.</div> */}
                                                                <div className="switch-list">
                                                                    {/* <div className="switch-item">
                                                                        <span className="text">Data Filter</span>
                                                                        <Switch></Switch>
                                                                    </div>
                                                                    <div className="switch-item">
                                                                        <span className="text">Data Filter</span>
                                                                        <Switch></Switch>
                                                                    </div> */}
                                                                    <OtherParameterList2
                                                                        addFilterDrawerIsEdit={addFilterDrawerIsEdit}
                                                                        showAddParameterPopover={() => { }}
                                                                        parameter={parameterObj}
                                                                        otherParameters={otherParameters}
                                                                        setFilteringParameters={ids => setParameterObj({ ...parameterObj, filteringParameters: ids })}
                                                                    />
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
