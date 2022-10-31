/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography } from '@arco-design/web-react';
import { push } from "react-router-redux";
import { changeUserData } from "metabase/redux/app";
import { changeGlobalSearchValue } from "metabase/redux/app";
import { LayoutLoginApi } from '@/services'
import DashBoardList from '@/web3goLayout/components/DashBoardList';
import CreatorList from '@/web3goLayout/components/CreatorList';
import event from '@/web3goLayout/event';

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData,
        globalSearchValue: state.app.globalSearchValue,
    }
};
const mapDispatchToProps = {
    push,
    changeUserData,
    changeGlobalSearchValue,
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoCompleteList: []
        }
    }
    handleSearch = () => {

    }
    render() {
        return (
            <div className="web3go-global-search-page">
                <div className="common-layout">
                    <div className="common-bread">
                        <div className="item hover-primary" onClick={() => { this.props.push('/') }}>Home</div>
                        <div className="split">/</div>
                        <div className="item active">Creators</div>
                    </div>
                </div>
                <div className="common-layout">
                    <Tabs defaultActiveTab="2" onChange={() => { this.props.push('/layout/dashboardList') }}>
                        <TabPane key='1' title={'Dashboard'}>
                            <Typography.Paragraph>
                                <div className="dashboardlist-wrap">
                                    <DashBoardList></DashBoardList>
                                </div>
                            </Typography.Paragraph>
                        </TabPane>
                        <TabPane key='2' title={'Creators'}>

                        </TabPane>
                    </Tabs>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
