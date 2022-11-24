/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Radio, Form, Input, Button, Grid, Select, InputNumber, Tooltip, Space, Modal, Table } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { IconCopy, IconRecord } from '@arco-design/web-react/icon';
import { position } from "tether";
import { LayoutLoginApi, LayoutDashboardApi } from '@/services'
import { copy } from '@/web3goLayout/utils'
const RadioGroup = Radio.Group;

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark
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
            visible: false,
            cardData: {},
            columns: [],
            data: []
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = (cardData) => {
        this.setState({
            cardData,
            visible: true
        })
    }
    sure = () => {
        this.formRef.current.validate().then((form) => {

        })
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
                wrapClassName={"common-form-modal dashboard-detail-chart-download-modal" + columns.length}
                title='Download full results'
                visible={this.state.visible}
                onCancel={() => this.setState({ visible: false })}
                onOk={this.sure}
            >
                <div className="modal-content">
                    <Form
                        layout="vertical"
                        requiredSymbol={{ position: 'end' }}
                        ref={this.formRef}
                        initialValues={{ type: 'csv' }}
                        autoComplete='off'
                    >
                        <Form.Item label="Export as" field='type' rules={[{ required: true }]}>
                            <RadioGroup style={{ marginTop: 5 }}>
                                <Radio value='csv'>.csv</Radio>
                                <Radio value='xlsx'>.xlsx</Radio>
                                <Radio value='jason'>.jason</Radio>
                            </RadioGroup>
                        </Form.Item>
                    </Form>
                    <div className="split"></div>
                    <Table scroll={{ x: 'max-content' }} className='modal-table' borderCell columns={columns} data={data} />
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
