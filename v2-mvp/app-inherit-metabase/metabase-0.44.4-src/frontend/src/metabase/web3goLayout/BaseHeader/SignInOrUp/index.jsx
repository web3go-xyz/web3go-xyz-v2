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
        currentUser: state.currentUser,
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
            timer: null,
            visible: false,
            verifyModalVisible: false,
            isSignIn: true,
            currentAccount: {}
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = (isSignIn) => {
        this.setState({
            visible: true,
            isSignIn: isSignIn
        }, () => {
            this.clearForm();
        });
    }
    openConnectWalletModal = () => {
        this.setState({
            visible: false,
        });
        this.props.openConnectWalletModal();
    }
    goForgetPsd = () => {
        this.setState({
            visible: false,
        });
        this.props.goForgetPsd();
    }
    clearForm = () => {
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }
    verifyEmail = () => {
        const form = this.formRef.current.getFields();
        LayoutLoginApi.sendVerifyEmail({
            "email": form.email,
            "accountId": this.state.currentAccount.accountId,
            "verifyCodePurpose": "account"
        }).then(d => {
            if (d) {
                if (this.state.verifyModalVisible) {
                    Message.success('Email has been sent. Please check the security code in the email.');
                } else {
                    this.setState({
                        visible: false,
                        verifyModalVisible: true
                    });
                }
                this.listenCookie();
            }
        })
    }
    sure = () => {
        this.formRef.current.validate().then((form) => {
            if (this.state.isSignIn) {
                LayoutLoginApi.signIn(form).then(d => {
                    localStorage.setItem('token', d.token);
                    location.replace(`/auth/sso?jwt=${d.token}&&return_to=/`)
                }).catch(e => {
                    if (e && e.data && e.data.message) {
                        Message.error({
                            content: e.data.message,
                            duration: 5000
                        });
                    }
                })
            } else {
                LayoutLoginApi.signUp(form).then(d => {
                    this.setState({
                        currentAccount: d.account
                    });
                    this.verifyEmail();
                }).catch(e => {
                    if (e && e.data && e.data.message) {
                        Message.error({
                            content: e.data.message,
                            duration: 5000
                        });
                    }
                })
            }
        })
    }
    listenCookie = () => {
        clearInterval(this.state.timer);
        const timer = setInterval(() => {
            if (this.props.currentUser) {
                this.setState({
                    visible: false,
                    verifyModalVisible: false
                });
                clearInterval(this.state.timer);
            }
        }, 2000);
        this.setState({
            timer
        });
    }
    render() {
        return (
            <Modal
                title={this.state.isSignIn ? 'Sign In' : 'Sign Up'}
                visible={this.state.visible}
                onOk={() => this.setState({ visible: false })}
                onCancel={() => this.setState({ visible: false })}
                footer={null}
            >
                <div className="dialot-content web3go-signin-modal-content">
                    <div className="subtitle">
                        Enter your email and password to {this.state.isSignIn ? "sign in" : "sign up"}!
                    </div>
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        requiredSymbol={{ position: 'end' }}
                    >
                        {!this.state.isSignIn ?
                            (
                                <FormItem label='Have a nick name' field='nickName' rules={[{ required: true }]}>
                                    <Input
                                        placeholder='Enter a nick name'
                                        maxLength={50}
                                        showWordLimit />
                                </FormItem>
                            )
                            : null}
                        <FormItem label='Email address' field='email' rules={[{ required: true, type: 'email' }]}>
                            <Input placeholder='helloworld@gmail.com' />
                        </FormItem>
                        <FormItem label='Password' field='password' rules={[{ required: true }]}>
                            <Input type='password' placeholder='please enter your password...' />
                        </FormItem>
                    </Form>

                    {this.state.isSignIn ? (<div className="link-wrap">
                        <div className="left">
                            <span>Not registered yet? </span>
                            <span className="a hover-item" onClick={() => this.init(false)}
                            >Create an Account</span
                            >
                        </div>

                        <div className="right hover-item" onClick={this.goForgetPsd}>
                            Forget password?
                        </div>
                    </div >) : (<div className="link-wrap center">
                        <div className="left">
                            <span>Already have an account? </span>
                            <span className="a hover-item" onClick={() => this.init(true)}>Sign in</span>
                        </div>
                    </div >)
                    }

                    <div className="btn-wrap">
                        <Button className="btn" type="primary" onClick={this.sure}>{
                            this.state.isSignIn ? "Sign In" : "Sign Up"
                        }</Button>
                    </div >
                    <div className="split-wrap">
                        <div className="split"></div>
                        <span>or connect wallet</span>
                        <div className="split"></div>
                    </div>
                    <div className="wallet-wrap">
                        <div className="item hover-item" onClick={this.openConnectWalletModal}>
                            {this.props.isDark ? <img
                                src={require('@/web3goLayout/assets/layout/metamaskicon.png')}
                                alt=""
                            /> : <img className="white" src={require('@/web3goLayout/assets/account/metamask.png')} alt="" />}
                        </div>
                        <div className="item hover-item" onClick={this.openConnectWalletModal}>
                            {this.props.isDark ? <img
                                src={require('@/web3goLayout/assets/layout/polkadoticon.png')}
                                alt=""
                            /> : <img className="white" src={require('@/web3goLayout/assets/account/polkadot.png')} alt="" />}
                        </div>
                    </div>
                    <Modal
                        title='Verify Email'
                        className="web3go-signUp-verifyEmail-modal"
                        visible={this.state.verifyModalVisible}
                        onCancel={() => this.setState({ verifyModalVisible: false })}
                        footer={null}
                    >
                        <div className="web3go-signUp-verifyEmail-modal-content">
                            <p>We've sent the security code to your provided email adress. Please verify your email.</p>
                            <p>The security code will expire in 10 minutes.  Please click button if you do not verify the email address within 10 minutes</p>
                            <div className="btn-wrap">
                                <Button className="btn" type="primary" onClick={this.verifyEmail}>Resend Email</Button>
                            </div >

                            <div className="link-wrap">
                                <div className="left">
                                    <span className="hover-item" onClick={() => this.setState({ verifyModalVisible: false, visible: true })}>Back to previous page</span>
                                </div>
                            </div>
                        </div >
                    </Modal >
                </div>
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
