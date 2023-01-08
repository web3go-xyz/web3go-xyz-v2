/* eslint-disable react/prop-types */
import React from "react";
import slugg from "slugg";

import { connect } from "react-redux";
import './index.less';
import { Form, Input, Button, Grid, Select, InputNumber, Tooltip, Space, Modal,Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { IconPlus } from '@arco-design/web-react/icon';
import { position } from "tether";
import { LayoutLoginApi, LayoutDashboardApi } from '@/services'
import { copy } from '@/web3goLayout/utils'
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        myDashboardList: state.app.myDashboardList,
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
            cardData: ''
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
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }
    sure = () => {
        this.formRef.current.validate().then((form) => {
            LayoutDashboardApi.forkQuestion({
                "originalQuestionId": this.state.cardData.card_id,
                "targetDashboardId": form.dashboardId
            }).then(d => {
                Message.success('Fork question success');
                this.setState({
                    visible: false
                })
                // const dashboardData = this.props.myDashboardList.find(v => v.v.id == form.dashboardId)
                // const slug = slugg(dashboardData.name);
                // const suffix = slug ? `${form.dashboardId}-${slug}` : form.dashboardId;
                // this.props.push(`/dashboard/${suffix}`);
            })
        })
    }
    render() {
        return (
            <Modal
                style={{ width: '635px' }}
                wrapClassName="common-form-modal dashboard-detail-chart-duplicate-modal"
                title='Duplicate'
                visible={this.state.visible}
                onCancel={() => this.setState({ visible: false })}
                onOk={this.sure}
            >
                <div className="modal-content">
                    <Form
                        layout="vertical"
                        requiredSymbol={{ position: 'end' }}
                        ref={this.formRef}
                        initialValues={{ type: 'My Dashboard-Posted' }}
                        autoComplete='off'
                    >
                        <Form.Item label='Duplicate to' required style={{ marginBottom: 0 }}>
                            <Grid.Row gutter={8}>
                                <Grid.Col span={12}>
                                    <Form.Item field='type' rules={[{ required: true }]}>
                                        <Select placeholder='please select' options={['My Dashboard-Posted']}></Select>
                                    </Form.Item>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Form.Item field='dashboardId' rules={[{ required: true }]}>
                                        <Select placeholder='please select'>
                                            {this.props.myDashboardList.map((v, i) => (
                                                <Option key={v.id} value={v.id}>
                                                    {v.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Grid.Col>
                            </Grid.Row>
                        </Form.Item>
                    </Form>
                    <div className="split-wrap">
                        <span className="line"></span>
                        <span className="text">or</span>
                        <span className="line"></span>
                    </div>
                    <Button onClick={() => { this.props.push('/home') }} type='primary' icon={<IconPlus />}>
                        New Dashboard
                    </Button>
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
