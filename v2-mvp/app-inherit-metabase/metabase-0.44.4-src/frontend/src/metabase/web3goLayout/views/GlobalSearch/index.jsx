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
import DatasetList from '@/web3goLayout/components/DatasetList';
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
            autoCompleteList: [],
            myFollowingList: []
        }
    }
    handleSearch = () => {


    }
    listMyFollows = () => {
        if (!this.props.userData.account) {
            return;
        }
        LayoutCreatorApi.listFollowing({
            "pageSize": 9999999999,
            "pageIndex": 1,
            "orderBys": [],
            "account_id": this.props.userData.account.accountId,
            "includeDetail": true
        }).then(d => {
            this.setState({
                myFollowingList: d.list
            })
        });
    }
    render() {
        return (
            <div className="web3go-global-search-page">
                <div className="gray-bg">
                    <div className="common-layout">
                        <div className="common-bread">
                            <div className="item hover-primary" onClick={() => { this.props.push('/') }}>Home</div>
                            <div className="split">/</div>
                            <div className="item active">Searching Results</div>
                        </div>
                        <div className="search-wrap">
                            <svg
                                onClick={this.handleSearch}
                                className="icon hover-item"
                                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.25 19.5C15.8063 19.5 19.5 15.8063 19.5 11.25C19.5 6.69365 15.8063 3 11.25 3C6.69365 3 3 6.69365 3 11.25C3 15.8063 6.69365 19.5 11.25 19.5Z" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20.25 20.25L18 18" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AutoComplete
                                value={this.props.globalSearchValue}
                                onChange={(value) => { this.props.changeGlobalSearchValue(value) }}
                                placeholder='Token'
                                data={this.state.autoCompleteList}
                            />
                        </div>
                    </div>
                </div>
                <div className="common-layout">
                    <Tabs defaultActiveTab="1">
                        <TabPane key='1' title={'Dashboard 40'}>
                            <Typography.Paragraph>
                                <div className="dashboardlist-wrap">
                                    <DashBoardList myFollowingList={this.state.myFollowingList}></DashBoardList>
                                </div>
                            </Typography.Paragraph>
                        </TabPane>
                        <TabPane key='2' title={'Dashboard 3'}>
                            <Typography.Paragraph>
                                <div className="createlist-wrap">
                                    <DatasetList myFollowingList={this.state.myFollowingList}></DatasetList>
                                </div>
                            </Typography.Paragraph>
                        </TabPane>
                        <TabPane key='3' title={'Creators 3'}>
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
