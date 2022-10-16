/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { position } from "tether";
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark
    }
};
const mapDispatchToProps = {
    toggleDark,
    push
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = () => {
        this.setState({
            visible: true,
        });
        this.clearForm();
    }

    goHome = () => {
        this.setState({
            visible: false
        });
        this.props.push('/');
    }

    clearForm = () => {
        this.formRef.current.resetFields();
    }
    sure = () => {
        this.formRef.current.validate().then(() => {

        })
    }
    render() {

        return (
            <Modal
                title='Reset Password'
                visible={this.state.visible}
                onOk={() => this.setState({ visible: false })}
                onCancel={() => this.setState({ visible: false })}
                footer={null}
            >
                <div className="dialot-content web3go-resetpsd-modal-content">
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        requiredSymbol={{ position: 'end' }}
                    >

                        <FormItem label='Enter your new password' field='password' rules={[{ required: true }]}>
                            <Input placeholder='please enter your new password...' />
                        </FormItem>
                    </Form>


                    <div className="btn-wrap">
                        <Button className="btn" type="primary" onClick={this.sure}>Save</Button>
                    </div >

                    <div className="link-wrap">
                        <div className="left">
                            <span className="hover-item" onClick={this.goHome}>Back to home page </span>
                        </div>
                    </div>
                </div >
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
