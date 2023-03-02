/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Select, Spin, Switch, Collapse, Tag, InputNumber } from '@arco-design/web-react';
import { push, replace } from "react-router-redux";
import { IconSync } from '@arco-design/web-react/icon';
import QueryBuilder from "metabase/query_builder/containers/QueryBuilder";
import { getQuestionSteps } from "@/query_builder/components/notebook/lib/steps";
import _ from "underscore";
import {
    getURLForCardState,
} from "@/query_builder/utils";
import { loadCard } from "metabase/lib/card";
import { getIn } from "icepick";

import cx from "classnames";
import { isReducedMotionPreferred } from "metabase/lib/dom";
import { parse as parseUrl } from "url";
import QuestionResultLoader from "metabase/containers/QuestionResultLoader";
import Visualization from "metabase/visualizations/components/Visualization";
import NewNativeQueryEditor from "@/query_builder/components/NewNativeQueryEditor";
import Question from "metabase-lib/lib/Question";
import { Motion, spring } from "react-motion";
import { ResizeBox } from '@arco-design/web-react';
import QueryValidationError from "metabase/query_builder/components/QueryValidationError";
import QueryVisualization from "@/query_builder/components/QueryVisualization";
import { loadMetadataForCard, resetQB } from "@/query_builder/actions/core/core";
import { adjustPositions, stripRemarks } from '@/query_builder/components/VisualizationError'
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
    loadMetadataForCard,
    push,
    replace
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            splitSize: 0.5,
            refreshFlag: true,
            question: null,
            previewFullScreen: false,
            resizeDirection: 'vertical',
            previewLimit: 10
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.tabIndex !== this.props.tabIndex) {
            this.setState({
                splitSize: 0.5,
                question: null
            });
            this.props.setIsNativeEditorOpen(true);
        }
    }
    getPreviewHeightForResult(result) {
        const rowCount = result ? result.data.rows.length : 1;
        return rowCount * 36 + 36 + 2;
    }
    previewDatasetInSqlMode = async (v) => {
        const card = {
            "dataset_query": {
                "database": v.db_id,
                "type": "query",
                "query": {
                    "source-table": v.id
                }
            },
            "visualization_settings": {},
            "display": "table"
        };
        await this.props.loadMetadataForCard(card);
        const metadata = this.props.metadata;
        let question = new Question(card, metadata);
        this.setState({
            question,
        });
    }
    async init(v) {
        if (this.props.tabIndex == '2') {
            this.previewDatasetInSqlMode(v);
            return;
        }
        const newState = {
            "card": {
                "dataset_query": {
                    "database": v.db_id,
                    "type": "query",
                    "query": {
                        "source-table": v.id
                    }
                },
                original_card_id: this.props.card && this.props.card.id ? this.props.card.id : undefined,
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
            .setQuery(query.limit() < this.state.previewLimit ? query : query.updateLimit(this.state.previewLimit))
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
        if (!step) {
            return;
        }
        const previewQuestion = this.getPreviewQuestion(step);
        this.setState({
            question: previewQuestion,
        });
    }
    executeSql = () => {
        const { question } = this.props;
        if (!question) {
            return;
        }
        this.setState({
            question,
        });
    }

    render() {
        const { refreshFlag, previewFullScreen, resizeDirection, previewLimit, splitSize } = this.state;
        const {
            query,
            result,
            isNativeEditorOpen
        } = this.props;
        let showPreviewComponent = true;
        const preferReducedMotion = isReducedMotionPreferred();
        const springOpts = preferReducedMotion
            ? { stiffness: 500 }
            : { stiffness: 170 };

        if (!this.state.question) {
            showPreviewComponent = false;
        }
        let processedError;
        if (result) {
            const error = result.error;
            const via = result.via;
            processedError = error;
            const origSql = getIn(via, [(via || "").length - 1, "ex-data", "sql"]);
            if (typeof error === "string" && typeof origSql === "string") {
                processedError = adjustPositions(error, origSql);
            }
            if (typeof error === "string") {
                processedError = stripRemarks(processedError);
            }
        }
        return (
            <div className="web3go-dataset-create-right-main">
                <ResizeBox.Split
                    direction={resizeDirection}
                    style={{
                        height: '100%',
                        width: '100%',
                        border: '1px solid #F2F3F5',
                    }}
                    icon={<img className="split-icon" style={{ transform: resizeDirection == 'horizontal' ? 'rotate(90deg)' : 'initial' }} src={require("@/web3goLayout/assets/dashboardCreate/Group46.png")} alt="" />}
                    size={this.props.tabIndex == '2' && !isNativeEditorOpen ? '48px' : splitSize}
                    disabled={this.props.tabIndex == '2' && !isNativeEditorOpen}
                    onMoving={(e, size) => {
                        this.setState({ splitSize: size });
                    }}
                    panes={[
                        this.props.tabIndex == '1' ? (
                            <div className="query-build" key="1">
                                {
                                    refreshFlag ? <QueryBuilder queryBuilderInitSuccess={this.queryBuilderInitSuccess} notebook={true} {...this.props}></QueryBuilder> : null
                                }
                            </div>
                        ) : (
                            <div className={cx("query-build sql", !isNativeEditorOpen ? 'editor-hide' : '')} key="2">
                                {
                                    refreshFlag ? <QueryBuilder queryBuilderInitSuccess={() => { this.props.ifEdit && this.executeSql() }} executeSql={this.executeSql} sqlEditor={true} {...this.props}></QueryBuilder> : null
                                }
                            </div>
                        ),
                        <div className={cx("preview", {
                            'full-screen': previewFullScreen,
                        })} >
                            <div className="preview-header">
                                <span className="title">Preview</span>
                                <div className="right-btn">
                                    {
                                        previewFullScreen ? null : <img onClick={() => { this.setState({ resizeDirection: resizeDirection == 'horizontal' ? 'vertical' : 'horizontal' }) }} className="hover-item" src={resizeDirection == 'horizontal' ? require("@/web3goLayout/assets/dashboardCreate/Frame21.png") : require("@/web3goLayout/assets/dashboardCreate/Frame2186.png")} alt="" />
                                    }

                                    <img onClick={() => { this.setState({ previewFullScreen: !previewFullScreen }) }} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/Frame2187.png")} alt="" />
                                </div>

                            </div>
                            {this.props.tabIndex == '1' ? (
                                showPreviewComponent ? (
                                    <div>
                                        <div className="preview-params">
                                            <div className="limit">
                                                <div className="prefix">Show</div>
                                                <InputNumber value={previewLimit} onChange={(value) => { this.setState({ previewLimit: value }) }} style={{ width: 117 }} />
                                                <div className="suffix">rows</div>
                                            </div>
                                            <Button type="primary" onClick={() => { this.refresh() }}>
                                                <IconSync style={{ fontSize: 16 }} />
                                                <span>Refresh</span>
                                            </Button>
                                        </div>
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
                                        </QuestionResultLoader>
                                    </div>
                                ) : <div className="none-wrap">The data you have selected will be presented here</div>
                            ) : (
                                showPreviewComponent ? (
                                    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                                        {
                                            processedError ? (
                                                <QueryValidationError error={{ message: processedError }} />
                                            ) : (
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
                                                </QuestionResultLoader>
                                            )
                                        }
                                    </div>
                                ) : <div className="none-wrap">Here's where your results will appear</div>
                            )}

                        </div>,
                    ]}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
