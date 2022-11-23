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
            info: '',
            columns: [{
                title: 'Name',
                dataIndex: 'name',
            },
            {
                title: 'Salary',
                dataIndex: 'salary',
            },
            {
                title: 'Address',
                dataIndex: 'salary',
            },
            {
                title: 'Email',
                dataIndex: 'salary',
            }],
            data: [{
                key: '1',
                name: 'Jane Doe',
                salary: 23000,
                address: '32 Park Road, London',
                email: 'jane.doe@example.com',
            },
            {
                key: '2',
                name: 'Alisa Ross',
                salary: 25000,
                address: '35 Park Road, London',
                email: 'alisa.ross@example.com',
            },
            {
                key: '3',
                name: 'Kevin Sandra',
                salary: 22000,
                address: '31 Park Road, London',
                email: 'kevin.sandra@example.com',
            },
            {
                key: '4',
                name: 'Ed Hellen',
                salary: 17000,
                address: '42 Park Road, London',
                email: 'ed.hellen@example.com',
            },
            {
                key: '5',
                name: 'William Smith',
                salary: 27000,
                address: '62 Park Road, London',
                email: 'william.smith@example.com',
            }]
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = (info) => {
        this.setState({
            info,
            visible: true
        })
    }
    sure = () => {
        this.formRef.current.validate().then((form) => {

        })
    }
    render() {
        const { columns, data } = this.state;
        return (
            <Modal
                style={{ width: '640px' }}
                wrapClassName="common-form-modal dashboard-detail-chart-download-modal"
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
                    <Table className='modal-table' borderCell columns={columns} data={data} />
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
