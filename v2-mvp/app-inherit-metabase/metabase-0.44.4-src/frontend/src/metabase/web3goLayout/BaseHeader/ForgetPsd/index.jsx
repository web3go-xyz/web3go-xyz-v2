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
            alreadySend: false
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = () => {
        this.setState({
            visible: true,
        }, () => {
            this.clearForm();
        });
    }

    goSignIn = () => {
        this.setState({
            visible: false,
        });
        this.props.goSignIn();
    }
    sendEmail = () => {
        this.setState({
            alreadySend: true
        });

        Message.success("Email has been sent. Please check the security code in the email.");
    }
    resendEmail = () => {

    }
    clearForm = () => {
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }
    sure = () => {
        this.formRef.current.validate().then(() => {
            this.setState({
                visible: false
            });
            this.props.goResetPsd();
        })
    }
    render() {

        return (
            <Modal
                title='Forgot Password'
                visible={this.state.visible}
                onOk={() => this.setState({ visible: false })}
                onCancel={() => this.setState({ visible: false })}
                footer={null}
            >
                <div className="dialot-content web3go-forgetpsd-modal-content">
                    <div className="subtitle">
                        No problem. Just let us know the email you use for Web3go account and
                        we'll email you a security code and you can input at next step.
                    </div>
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        requiredSymbol={{ position: 'end' }}
                    >

                        <FormItem className="email-row" label='Email address' required>
                            <FormItem style={{ marginBottom: 0 }} field='email' rules={[{ required: true }]}>
                                <Input placeholder='helloworld@gmail.com' />
                            </FormItem>
                            {this.state.alreadySend ?
                                <div className="btn disabled">Send Email</div> :
                                <div className="btn hover-item" onClick={this.sendEmail}>Send Email</div>
                            }
                        </FormItem>
                        <FormItem label='Security code' field='code' rules={[{ required: true }]}>
                            <Input placeholder='please enter your Security code...' />
                        </FormItem>
                    </Form>


                    <div className="btn-wrap">
                        <Button className="btn" type="primary" onClick={this.sure}>Next Step</Button>
                    </div >

                    <div className="link-wrap">
                        <div className="left">
                            <span className="hover-item" onClick={this.goSignIn}
                            >Back to previous page
                            </span>
                        </div>
                        <div className="hover-item a" onClick={this.resendEmail}>
                            Resend password reset email
                        </div>
                    </div>
                </div >
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
