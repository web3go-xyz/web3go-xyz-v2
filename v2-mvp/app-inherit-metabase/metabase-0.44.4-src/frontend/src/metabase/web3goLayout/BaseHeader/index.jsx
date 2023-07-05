/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, AutoComplete, Menu, Dropdown, Modal } from '@arco-design/web-react';
import { toggleDark, changeGlobalSearchValue } from "metabase/redux/app";
import { IconDown } from '@arco-design/web-react/icon';
import { changeUserData } from "metabase/redux/app";
import { push, replace } from "react-router-redux";
import SignInOrUp from './SignInOrUp';
import ForgetPsd from './ForgetPsd';
import ResetPsd from './ResetPsd';
import ConnectWallet from './ConnectWallet';
import { LayoutLoginApi } from '@/services'
import event from '@/web3goLayout/event';
import MyHeadIcon from '@/web3goLayout/components/MyHeadIcon';
import { logout } from "@/auth/actions";
import { Link } from "react-router";

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        route: state.routing.locationBeforeTransitions,
        isDark: state.app.isDark,
        userData: state.app.userData,
        globalSearchValue: state.app.globalSearchValue,
    }
};
const mapDispatchToProps = {
    onLogout: logout,
    toggleDark,
    changeUserData,
    changeGlobalSearchValue,
    push,
    replace
};
class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoCompleteList: [],
            ifScroll: false
        }
        this.SignInOrUpRef = React.createRef();
        this.ForgetPsdRef = React.createRef();
        this.ResetPsdRef = React.createRef();
        this.ConnectWalletRef = React.createRef();
    }

    componentDidMount() {
        event.on('goSignIn', (text) => {
            this.goSignIn();
        })
        const mainEl = document.documentElement;
        // window.addEventListener("scroll", (e) => {
        //     let ifScroll;
        //     if (mainEl.scrollTop > 10) {
        //         ifScroll = true;

        //     } else {
        //         ifScroll = false;
        //     }
        //     if (this.state.ifScroll !== ifScroll) {
        //         this.setState({
        //             ifScroll
        //         });
        //     }
        // });

    }
    componentDidUpdate(prevProps) {
        if (this.props.route.key !== prevProps.route.key) {
            const { route } = this.props;
            if (route.hash == '#showLogin') {
                // 去掉hash
                this.props.replace(route.pathname + route.search);
                this.SignInOrUpRef.init(true);
            }
        }
    }
    clickDropdownIcon = (key) => {
        if (key == 1) {
            if (this.props.route.pathname == "/layout/mySpace") {
                // 刷新路由
                this.props.replace(`/layout/blank`);
                setTimeout(() => {
                    this.props.replace('/layout/mySpace');
                });
            } else {
                this.props.push('/layout/mySpace');
            }
        } else if (key == 2) {
            this.props.push('/layout/accountSetting');
        } else if (key == 3) {
            Modal.confirm({
                wrapClassName: 'common-confirm-modal',
                closable: true,
                title: 'Confirm',
                content:
                    'Are you sure to sign out ?',
                cancelText: 'Cancel',
                onOk: () => {
                    this.props.onLogout();
                }
            });
        }
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
    goResetPsd = (form) => {
        this.ResetPsdRef.init(form);
    }
    openConnectWalletModal = () => {
        this.ConnectWalletRef.openConnectWalletModal();
    }
    goAccountSetting = () => {
        this.props.push('/layout/accountSetting');
    }
    handleSearch = () => {
        this.props.push({ pathname: '/redirect', state: { pathname: "/layout/globalSearch" } });
    }
    clickCreate = (key) => {
        if (key == '1') {
            this.props.push({ pathname: '/redirect', state: { pathname: "/layout/create/dataset" } });
        } else {
            this.props.push({ pathname: '/redirect', state: { pathname: "/layout/create/dashboard" } });
        }
    }
    render() {
        const dropList = (
            <Menu onClickMenuItem={(key) => { this.clickCreate(key) }}>
                <Menu.Item key='1'>Dataset</Menu.Item>
                <Menu.Item key='2'>Dashboard</Menu.Item>
            </Menu>
        );
        return (
            // <div className={'web3go-layout-baseheader-component' + (this.state.ifScroll ? ' scroll' : '')}>
            <div className='web3go-layout-baseheader-component scroll'>
                <div className="head-wrap">
                    <div className="h-left">
                        {this.props.isDark ? <img
                            className="logo hover-item" onClick={this.goLayout}
                            src={require('@/web3goLayout/assets/layout/logo.png')}
                            alt=""
                        /> : <img className="logo hover-item" onClick={this.goLayout} src={require('@/web3goLayout/assets/layout/logo-white.png')} alt="" />}
                        <div className="search-wrap">
                            <svg
                                onClick={this.handleSearch}
                                className="icon hover-item"
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
                                onPressEnter={this.handleSearch}
                                value={this.props.globalSearchValue}
                                onChange={(value) => { this.props.changeGlobalSearchValue(value) }}
                                placeholder='Search dashboards/datasets/creators'
                                data={this.state.autoCompleteList}
                            />
                        </div>
                    </div>
                    <div className="h-right">
                        {/* <div className="a">Community</div>
                        <div className="a">Learn</div> */}
                        {/* <div className="circle" onClick={this.props.toggleDark}>
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
                        </div> */}
                        <Dropdown trigger='click' droplist={dropList} position='bl'>
                            <Button className="btn" type='primary'>
                                <span>Create</span>
                                <IconDown />
                            </Button>
                        </Dropdown>
                        {/* <Link
                            to="/home"
                        >
                            <Button className="btn" style={{ marginLeft: '8px' }} type='primary'>OldCreate</Button>
                        </Link> */}
                        {this.props.currentUser ?
                            (
                                <Dropdown trigger='click' position="br" droplist={
                                    <Menu onClickMenuItem={(key) => { this.clickDropdownIcon(key) }}>
                                        <Menu.Item key='1'>My Space</Menu.Item>
                                        <Menu.Item key='2'>Account Setting</Menu.Item>
                                        <Menu.Item key='3'>Sign Out</Menu.Item>
                                    </Menu>
                                }>
                                    <div className="headicon-wrap">
                                        <MyHeadIcon></MyHeadIcon>
                                    </div>
                                </Dropdown>
                            )
                            :
                            <Button className="btn2" type='secondary' onClick={this.goSignIn}>Sign In</Button>
                        }
                    </div>
                    <SignInOrUp
                        onRef={(ref) => this.SignInOrUpRef = ref}
                        goForgetPsd={this.goForgetPsd}
                        openConnectWalletModal={this.openConnectWalletModal}

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
