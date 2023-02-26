/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Select, Spin, Switch, Collapse, Tag } from '@arco-design/web-react';
import { push, replace } from "react-router-redux";
import { IconSync } from '@arco-design/web-react/icon';
import QueryBuilder from "metabase/query_builder/containers/QueryBuilder";
import { getQuestionSteps } from "@/query_builder/components/notebook/lib/steps";
import {
    getURLForCardState,
} from "@/query_builder/utils";
import cx from "classnames";
import { isReducedMotionPreferred } from "metabase/lib/dom";
import { parse as parseUrl } from "url";
import QuestionResultLoader from "metabase/containers/QuestionResultLoader";
import Visualization from "metabase/visualizations/components/Visualization";
import Question from "metabase-lib/lib/Question";
import { Motion, spring } from "react-motion";
import { ResizeBox } from '@arco-design/web-react';
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
            question: null
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    getPreviewHeightForResult(result) {
        const rowCount = result ? result.data.rows.length : 1;
        return rowCount * 36 + 36 + 2;
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
        await this.setState({ question: null });
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
    getPreviewQuestion(step) {
        const query = step.previewQuery;
        return Question.create()
            .setQuery(query.limit() < 10 ? query : query.updateLimit(10))
            .setDisplay("table")
            .setSettings({ "table.pivot": false });
    }
    queryBuilderInitSuccess = () => {
        this.refresh();
    }
    refresh = () => {
        const { question } = this.props;
        if (!question) {
            return;
        }
        const steps = getQuestionSteps(question);
        const step = steps[steps.length - 1];
        const previewQuestion = this.getPreviewQuestion(step);
        this.setState({
            question: previewQuestion,
        });
    }
    render() {
        let showPreviewComponent = true;
        const preferReducedMotion = isReducedMotionPreferred();
        const springOpts = preferReducedMotion
            ? { stiffness: 500 }
            : { stiffness: 170 };

        if (!this.state.question) {
            showPreviewComponent = false;
        }
        const { refreshFlag } = this.state;
        return (
            <div className="web3go-dataset-create-right-main">
                <ResizeBox.Split
                    direction='vertical'
                    style={{
                        height: '100%',
                        width: '100%',
                        border: '1px solid #F2F3F5',
                    }}
                    // icon={require("@/web3goLayout/assets/dashboardCreate/Group46.png")}
                    max={0.8}
                    min={0.2}
                    panes={[
                        <div className="query-build">
                            {
                                refreshFlag ? <QueryBuilder queryBuilderInitSuccess={this.queryBuilderInitSuccess} notebook={true} {...this.props}></QueryBuilder> : null
                            }
                        </div>,
                        <div className="preview">
                            <div className="preview-header">
                                <span className="title">Preview</span>
                                <div className="right-btn">
                                    <img className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/Frame2186.png")} alt="" />
                                    <img className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/Frame2187.png")} alt="" />
                                </div>

                            </div>
                            <div className="preview-params">
                                <Button type="primary" onClick={() => { this.refresh() }}>
                                    <IconSync style={{ fontSize: 16 }} />
                                    <span>Refresh</span>
                                </Button>
                            </div>
                            {showPreviewComponent ? (
                                <QuestionResultLoader question={this.state.question}>
                                    {({ rawSeries, result }) => (
                                        <Motion
                                            defaultStyle={{ height: 36 }}
                                            style={{
                                                height: spring(this.getPreviewHeightForResult(result), springOpts),
                                            }}
                                        >
                                            {({ height }) => {
                                                const targetHeight = this.getPreviewHeightForResult(result);
                                                const snapHeight =
                                                    height > targetHeight / 2 ? targetHeight : 0;
                                                const minHeight = preferReducedMotion ? snapHeight : height;
                                                return (
                                                    <Visualization
                                                        rawSeries={rawSeries}
                                                        error={result && result.error}
                                                        className={cx("bordered shadowed rounded bg-white", {
                                                            p2: result && result.error,
                                                        })}
                                                        style={{ minHeight }}
                                                    />
                                                );
                                            }}
                                        </Motion>
                                    )}
                                </QuestionResultLoader>) : null}
                        </div>,
                    ]}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
