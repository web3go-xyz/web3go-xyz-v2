/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { position } from "tether";
import { shorterAddress } from '@/web3goLayout/utils';
import Web3 from "web3";
import IdentityIcon from "@/web3goLayout/components/IdentityIcon";
import {
    web3Accounts,
    web3Enable,
    // web3AccountsSubscribe,
} from "@polkadot/extension-dapp";
let web3;
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,

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
            // connect or switch
            ifConnect: true,
            walletType: "",
            linkLoading: false,
            chooseWalletLoading: false,
            visible: false,
            polkadotAccountList: [],
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
    }
    connectMetaMask = async () => {
        // 引入web3
        this.linkLoading = true;
        web3 = new Web3(ethereum);
        try {
            await ethereum.send("eth_requestAccounts");
        } catch (error) {
            console.error("User denied account access");
            this.linkLoading = false;
            return;
        }
        web3.eth.getAccounts((err, accs) => {
            console.log("web3 accounts:", accs);
            this.ethAccountList = accs;
            if (accs.length === 0) {
                console.error(
                    "cannot get account, please check if Metamask has been configured?"
                );
                return;
            }
            if (err != null) {
                console.error(
                    "cannot get account, please check if the MetaMask has been installed."
                );
                return;
            }
            this.solveAccounts(accs[0]);
        });
        ethereum.on("accountsChanged", (accs) => {
            this.solveAccounts(accs[0]);
        });
    }
    solveAccounts = (acc) => {
        // 查询token余额
        web3.eth.getBalance(acc).then((d) => {
            // this.linkAccount.freeBalance = this.formatWithDecimals(d).toString();
            // this.linkAccount.address = acc[0];
            const walletData = {
                walletType: "metamask",
                address: acc,
                name: acc,
                balance: {
                    free: 0,
                    reserved: 0,
                    total: 0,
                },
            };
            localStorage.setItem("alreadyLinkMetaMask", true);
            this.linkLoading = false;
        });
    }
    connectPolkadot = async () => {
        this.setState({
            walletType: 'polkadot'
        });
        await web3Enable("Web3Go");
        const polkadotAccountList = await web3Accounts({
            // ss58Format: ss58Format,
            accountType: ["ed25519", "sr25519", "ecdsa"],
        });
        console.log('polkadotAccountList', polkadotAccountList);
        this.setState({
            visible: true,
            polkadotAccountList
        });

    }
    choosePolkadotWallet = async (account) => {
        this.setState({
            chooseWalletLoading: true
        });
        // await web3Enable(`Web3Go`);
        const walletData = {
            walletType: "polkadot",
            address: account.address,
            name: account.meta.name,
            balance: {
                free: 0,
                reserved: 0,
                total: 0,
            },
        };
    }
    render() {
        return (
            <Modal
                title={this.state.ifConnect ? 'Connect Wallet' : 'Switch Wallet'}
                visible={this.state.visible}
                onOk={() => this.setState({ visible: false })}
                onCancel={() => this.setState({ visible: false })}
                footer={null}
            >
                <div className="web3go-connectWallet-modal-content">
                    {this.state.ifConnect ? null : (
                        <div className="section">
                            <div className="section-title">Choose Wallet</div>
                            <div className="list">
                                <div
                                    className={'item hover-item' + (this.state.walletType == 'metamask' ? ' active' : '')}
                                    onClick={this.connectMetaMask}
                                >
                                    <div className="center">
                                        <div className="img-wrap">
                                            <img className="white" src={require('@/web3goLayout/assets/layout/metamaskicon.png')} alt="" />
                                        </div>
                                        <div className="text">Metamask</div>
                                    </div>
                                </div>
                                <div
                                    className={'item hover-item' + (this.state.walletType == 'polkadot' ? ' active' : '')}
                                    onClick={this.connectPolkadot}
                                >
                                    <div className="center">
                                        <div className="img-wrap">
                                            {this.props.isDark ? <img
                                                src={require('@/web3goLayout/assets/layout/polkadoticon.png')}
                                                alt=""
                                            /> : <img className="white" src={require('@/web3goLayout/assets/layout/polkadoticon-b.png')} alt="" />}
                                        </div>
                                        <div className="text">Polkadot.js</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {this.state.walletType == 'polkadot' ? (
                        <div className="section">
                            <div className="section-title">Choose Account</div>
                            <div className="list">
                                {
                                    this.state.polkadotAccountList.map((v, i) =>
                                    (
                                        <div
                                            key={i}
                                            className="item hover-item"
                                            onClick={() => this.choosePolkadotWallet(v)}
                                        >
                                            <div className="center flex">
                                                <IdentityIcon
                                                    isPolkadot
                                                    address={v.address}
                                                ></IdentityIcon>
                                                <div className="right">
                                                    <div className="name">{v.meta.name}</div>
                                                    <div className="address">
                                                        {
                                                            shorterAddress(v.address)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    )
                                }
                            </div>
                        </div >
                    ) : null}

                    <div className="btn-wrap">

                        {/* <Button className="btn" type="primary" onClick={this.connect}>Connect wallet</Button> */}
                    </div >
                </div >
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
