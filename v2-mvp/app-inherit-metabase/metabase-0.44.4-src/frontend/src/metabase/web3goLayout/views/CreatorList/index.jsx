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
    changeTab = (key) => {
        if (key == 1) {
            this.props.push('/layout/dashboardList')
        } else if (key == 2) {
            this.props.push('/layout/datasetList')
        }
    }
    render() {
        return (
            <div className="web3go-creatorlist-page">
                <div className="common-layout">
                    <div className="common-bread">
                        <div className="item hover-primary" onClick={() => { this.props.push('/') }}>Home</div>
                        <div className="split">/</div>
                        <div className="item active">Creators</div>
                    </div>
                </div>
                <div className="common-layout">
                    <Tabs defaultActiveTab="3" onChange={this.changeTab}>
                        <TabPane key='1' title={'Dashboard'}>

                        </TabPane>
                        <TabPane key='2' title={'Datasets'}>

                        </TabPane>
                        <TabPane key='3' title={'Creators'}>
                            <Typography.Paragraph>
                                <div className="createlist-wrap">
                                    <CreatorList></CreatorList>
                                </div>
                            </Typography.Paragraph>
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
