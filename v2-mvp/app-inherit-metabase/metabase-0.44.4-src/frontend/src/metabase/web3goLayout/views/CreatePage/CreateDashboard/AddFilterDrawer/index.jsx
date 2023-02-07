/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { useState, useMemo, useEffect } from "react";
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Drawer, Switch } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import cx from "classnames";
import * as dashboardActions from "@/dashboard/actions";
import CommonDrawer from '@/web3goLayout/components/CommonDrawer';
import { getDashboardParameterSections } from "metabase/parameters/utils/dashboard-options";
const { Text } = Typography;
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
    // const [] = useState(false);
    const PARAMETER_SECTIONS = getDashboardParameterSections();
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
    return (
        <CommonDrawer visible={addFilterDrawerVisible} onCancel={handleCancel} onOk={handleOk}>
            <div className="web3go-add-filter-drawer">
                <div className="switch-list">
                    {
                        PARAMETER_SECTIONS.map(v => (
                            <div className="s-item" key={v.id}>
                                <span className="text">{v.name} ({v.description})</span>
                                <Switch></Switch>
                            </div>
                        ))
                    }
                </div>
            </div>
        </CommonDrawer>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
