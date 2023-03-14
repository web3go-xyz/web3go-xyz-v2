/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Radio, Form, Input, Button, Grid, Select, InputNumber, Tooltip, Space, Modal, Table, Spin } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { IconCopy, IconRecord } from '@arco-design/web-react/icon';
import { position } from "tether";
import { LayoutLoginApi, LayoutDashboardApi, CardApi, MetabaseApi } from '@/services'
import { copy } from '@/web3goLayout/utils'
import {
    getTables
} from "@/query_builder/selectors";
import slugg from "slugg";

const RadioGroup = Radio.Group;

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        tables: getTables(state),
    }
};
const mapDispatchToProps = {
    toggleDark,
    push
};

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datasetCardResult: {},
            loading: false,
            visible: false,
            cardData: {},
            columns: [],
            data: [],
            datasetData: {}
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = async (cardData) => {
        const { card_id } = cardData;
        this.setState({
            cardData,
            visible: true,
            loading: true
        })
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
        const d = await CardApi.get({
            cardId: card_id
        })
        if (d.dataset_query && d.dataset_query.query && d.dataset_query.query['source-table']) {
            const str = d.dataset_query.query['source-table'];
            let card_id2;
            if (str.startsWith('card__')) {
                card_id2 = str.split('__')[1];
            } else {
                card_id2 = str;
            }
            const datasetCardResult = await CardApi.get({
                cardId: card_id2
            })

            const obj = {
                "database": d.database_id,
                "type": "query",
                "query": { "source-table": str },
                "parameters": []
            }
            const d2 = await MetabaseApi.dataset(obj);
            this.setState({
                datasetCardResult,
                cardData: d2.data,
                loading: false
            });
        }
    }
    get columns() {
        if (!this.state.cardData.cols) {
            return []
        }
        return this.state.cardData.cols.map((v, i) => {
            return {
                title: v.display_name,
                dataIndex: i,
            }
        })
    }
    jump = async () => {
        const { datasetCardResult } = this.state;
        const cardId = datasetCardResult.id;
        const slug = slugg(datasetCardResult.name);
        const suffix = slug ? `${cardId}-${slug}` : cardId;
        window.open(`/layout/datasetDetail/${cardId}`);

    }
    get data() {
        if (!this.state.cardData.rows) {
            return []
        }
        return this.state.cardData.rows.map((v, i) => {
            const obj = {}
            obj.key = i;
            v.forEach((sv, si) => {
                obj[si] = sv;
            });
            return obj
        });
    }
    render() {
        const { columns, data } = this;
        return (
            <Modal
                style={{ width: '60%' }}
                wrapClassName="common-form-modal dashboard-detail-chart-dataset-modal"
                title='Dataset'
                visible={this.state.visible}
                onCancel={() => this.setState({ visible: false })}
                onOk={this.sure}
                footer={null}
            >
                <Spin style={{ display: 'block', minHeight: 100 }} loading={this.state.loading}>
                    <div className="modal-content">
                        {
                            this.state.datasetCardResult.name ? (<div className="z-link" onClick={this.jump}>
                                <div className="inner hover-primary">
                                    <span>
                                        {this.state.datasetCardResult.name}
                                    </span>
                                    <svg className="arrow" onClick={() => { }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.24269 3.75667L13.4854 7.99933L9.24269 12.242M1.66669 8H13.0984" strokeWidth="1.5" />
                                    </svg>
                                </div>
                            </div>) : null
                        }
                        <Table scroll={{ x: 'max-content' }} className='modal-table' borderCell columns={columns} data={data} />
                    </div>
                </Spin>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
