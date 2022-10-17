/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, AutoComplete } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import SignInOrUp from './SignInOrUp';
import ForgetPsd from './ForgetPsd';
import ResetPsd from './ResetPsd';
import ConnectWallet from './ConnectWallet';

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
            autoCompleteList: []
        }
        this.SignInOrUpRef = React.createRef();
        this.ForgetPsdRef = React.createRef();
        this.ResetPsdRef = React.createRef();
        this.ConnectWalletRef = React.createRef();

    }
    goLayout = () => {
        this.props.push('/');
    }
    goSignIn = () => {
        this.SignInOrUpRef.init(true);
    }
    goForgetPsd = () => {
        this.ForgetPsdRef.init();
    }
    goResetPsd = () => {
        this.ResetPsdRef.init();
    }
    connectMetaMask = () => {
        this.ConnectWalletRef.connectMetaMask();
    }
    connectPolkadot = () => {
        this.ConnectWalletRef.connectPolkadot();
    }
    render() {
        return (
            <div className="web3go-layout-baseheader-component">
                <div className="head-wrap">
                    <div className="h-left">
                        {this.props.isDark ? <img
                            className="logo" onClick={this.goLayout}
                            src={require('@/web3goLayout/assets/layout/logo.png')}
                            alt=""
                        /> : <img className="logo" onClick={this.goLayout} src={require('@/web3goLayout/assets/layout/logo-white.png')} alt="" />}
                        <div className="search-wrap">
                            <svg
                                className="icon"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.5 13C10.5376 13 13 10.5376 13 7.5C13 4.46243 10.5376 2 7.5 2C4.46243 2 2 4.46243 2 7.5C2 10.5376 4.46243 13 7.5 13Z"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.5 13.5L12 12"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <AutoComplete
                                placeholder='Search'
                                data={this.state.autoCompleteList}
                            />
                        </div>
                    </div>
                    <div className="h-right">
                        <div className="a">Community</div>
                        <div className="a">Learn</div>
                        <div className="circle" onClick={this.props.toggleDark}>
                            {this.props.isDark ?
                                (<svg
                                    className="icon"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.01665 8.04391C3.01633 8.04438 3.01598 8.04483 3.0156 8.04525C3.0135 8.04762 3.01 8.04961 3.00574 8.04878L3.01665 8.04391ZM3.01665 8.04391C3.66749 8.72997 4.58572 9.1594 5.60781 9.1594C7.59806 9.1594 9.21094 7.54653 9.21094 5.55627C9.21094 4.52467 8.7754 3.60349 8.08111 2.95091C8.08128 2.95058 8.08144 2.95024 8.08157 2.94987C8.08345 2.94479 8.08015 2.941 8.07896 2.93981L8.07897 2.93981L8.07875 2.93961C7.97089 2.83945 7.90312 2.69774 7.90312 2.53752C7.90312 2.24516 8.13223 2.01258 8.42178 1.9938C11.4191 2.26091 13.7719 4.77619 13.7719 7.84534C13.7719 11.091 11.1426 13.7203 7.89687 13.7203C4.82772 13.7203 2.31087 11.3659 2.04689 8.36708C2.06257 8.08074 2.29508 7.85315 2.58437 7.85315C2.75065 7.85315 2.89993 7.92698 2.99848 8.04385L3.01665 8.04391Z"
                                        fill="#F8F8F8"
                                        stroke="#F8F8F8"
                                        strokeWidth="0.015625"
                                    />
                                </svg>) :
                                <img className="light" src={require('@/web3goLayout/assets/layout/light.png')} alt="" />}
                        </div>
                        <Button className="btn" type='primary'>Create</Button>
                        <Button className="btn2" type='secondary' onClick={this.goSignIn}>Sign In</Button>
                    </div>
                    <SignInOrUp
                        onRef={(ref) => this.SignInOrUpRef = ref}
                        goForgetPsd={this.goForgetPsd}
                        connectMetaMask={this.connectMetaMask}
                        connectPolkadot={this.connectPolkadot}
                        
                    ></SignInOrUp>
                    <ForgetPsd
                        onRef={(ref) => this.ForgetPsdRef = ref}
                        goSignIn={this.goSignIn}
                        goResetPsd={this.goResetPsd}
                    ></ForgetPsd>
                    <ResetPsd onRef={(ref) => this.ResetPsdRef = ref}></ResetPsd>

                    <ConnectWallet onRef={(ref) => this.ConnectWalletRef = ref}></ConnectWallet>
                </div>
            </div >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
