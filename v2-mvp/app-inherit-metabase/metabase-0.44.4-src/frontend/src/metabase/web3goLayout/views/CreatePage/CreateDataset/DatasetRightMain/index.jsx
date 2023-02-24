/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Select, Spin, Switch, Collapse } from '@arco-design/web-react';
import { push, replace } from "react-router-redux";
import QueryBuilder from "metabase/query_builder/containers/QueryBuilder";
import {
    getURLForCardState,
} from "@/query_builder/utils";
import { parse as parseUrl } from "url";

const CollapseItem = Collapse.Item;
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        databaseList: state.entities.databases,
    }
};
const mapDispatchToProps = {
    push,
    replace
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshFlag: true,
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    async init(v) {
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
            pathname: this.props.params.dashboardSlug ? `/layout/create/${this.props.params.dashboardSlug}` : '/layout/create',
            search: urlParsed.search,
            // hash: encodeURIComponent(urlParsed.hash),
            hash: urlParsed.hash,
            state: newState
        };
        await this.hideQueryBuilder();
        this.props.replace(locationDescriptor);
        await this.showQueryBuilder();
    }
    hideQueryBuilder = async () => {
        await this.setState({
            refreshFlag: false
        })
    }
    showQueryBuilder = async () => {
        await this.setState({
            refreshFlag: true
        })
    }
    render() {
        const { refreshFlag } = this.state;
        return (
            <div className="web3go-dataset-create-right-main">
                {
                    refreshFlag ? <QueryBuilder notebook={true} {...this.props}></QueryBuilder> : null
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
