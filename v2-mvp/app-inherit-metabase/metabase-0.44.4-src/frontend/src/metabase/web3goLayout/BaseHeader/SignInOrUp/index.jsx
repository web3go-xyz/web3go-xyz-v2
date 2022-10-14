/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, } from '@arco-design/web-react';
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
            isSignIn: true
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
        });
        // this.clearForm();
    }
    connectMetaMask = () => {
        this.setState({
            visible: false,
        });
        this.props.connectMetaMask();
    }
    goForgetPsd = () => {
        this.setState({
            visible: false,
        });
        this.props.goForgetPsd();
    }
    clearForm = () => {
        this.form = {
            nickname: "",
            email: "",
            password: "",
        };
        this.$nextTick(() => {
            this.$refs.form.clearValidate();
        });
    }
    sure = () => {
        this.formRef.current.validate().then(() => {

        })
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
                                <FormItem label='nickname' field='nickname' rules={[{ required: true }]}>
                                    <Input placeholder='Enter a nick name' />
                                </FormItem>
                            )
                            : null}
                        <FormItem label='Email address' field='email' rules={[{ required: true }]}>
                            <Input placeholder='helloworld@gmail.com' />
                        </FormItem>
                        <FormItem label='Password' field='password' rules={[{ required: true }]}>
                            <Input placeholder='please enter your password...' />
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
                        <div className="item hover-item" onClick={this.connectMetaMask}>
                            {this.props.isDark ? <img
                                src={require('@/web3goLayout/assets/layout/metamaskicon.png')}
                                alt=""
                            /> : <img className="white" src={require('@/web3goLayout/assets/account/metamask.png')} alt="" />}
                        </div>
                        <div className="item hover-item">
                            {this.props.isDark ? <img
                                src={require('@/web3goLayout/assets/layout/polkadoticon.png')}
                                alt=""
                            /> : <img className="white" src={require('@/web3goLayout/assets/account/polkadot.png')} alt="" />}
                        </div>
                    </div>
                </div>
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
