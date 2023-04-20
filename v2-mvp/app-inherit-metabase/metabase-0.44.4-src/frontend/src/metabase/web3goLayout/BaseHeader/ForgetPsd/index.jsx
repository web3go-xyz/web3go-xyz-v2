/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { position } from "tether";
import { LayoutLoginApi } from '@/services'

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
            canSend: true
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = (form) => {
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
        this.formRef.current.validate(['email']).then(() => {
            const form = this.formRef.current.getFields();
            LayoutLoginApi.sendVerifyEmail({
                "email": form.email.toLowerCase(),
                "verifyCodePurpose": "resetPassword"
            }).then(d => {
                this.setState({
                    canSend: false
                });
                setTimeout(() => {
                    this.setState({
                        canSend: true
                    });
                }, 30000);
                if (d) {
                    Message.success('Email has been sent. Please check the security code in the email.');
                }
            })
        })
    }
    clearForm = () => {
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }
    sure = () => {
        this.formRef.current.validate().then((form) => {
            LayoutLoginApi.searchAccountsByEmail({
                filter: form.email.toLowerCase(),
            }).then(d => {
                if (d.length) {
                    const accountId = d[0].accountId;
                    LayoutLoginApi.verifyCode({
                        "email": form.email,
                        "accountId": accountId,
                        code: form.code,
                        "verifyCodePurpose": "resetPassword"
                    }).then(d => {
                        this.setState({
                            visible: false
                        });
                        this.props.goResetPsd(form);
                    })
                }
            });
        })
    }
    render() {
        return (
            <Modal
                wrapClassName="web3go-signin-common-modal"
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
                            <FormItem field='email' noStyle={{ showErrorTip: true }} rules={[{ required: true, message: 'Email address cannot be empty' }, { type: 'email', message: 'Invalid email' }]}>
                                <Input placeholder='helloworld@gmail.com' />
                            </FormItem>
                            <FormItem shouldUpdate noStyle>
                                {(values) => {
                                    return this.state.canSend && values.email ?
                                        <div className="btn hover-item" onClick={this.sendEmail}>Send Email</div> :
                                        <div className="btn disabled">Send Email</div>
                                }}
                            </FormItem>
                        </FormItem>
                        <FormItem label='Security code' field='code' rules={[{ required: true, message: 'Code cannot be empty' }]}>
                            <Input onPressEnter={this.sure} placeholder='please enter your security code...' />
                        </FormItem>
                    </Form>
                    <div className="btn-wrap">
                        <Button className="btn" type="primary" onClick={this.sure}>Next Step</Button>
                    </div>
                    <div className="link-wrap">
                        <div className="left">
                            <span className="hover-item" onClick={this.goSignIn}
                            >Back to previous page
                            </span>
                        </div>
                    </div>
                </div >
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
