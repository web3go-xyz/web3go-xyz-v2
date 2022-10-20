/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message, Spin } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { position } from "tether";
import { shorterAddress } from '@/web3goLayout/utils';
import Web3 from "web3";
import IdentityIcon from "@/web3goLayout/components/IdentityIcon";
import {
    web3Accounts,
    web3Enable,
    web3FromSource,
    // web3AccountsSubscribe,
} from "@polkadot/extension-dapp";
import { LayoutLoginApi } from '@/services'
import {
    cryptoWaitReady,
    decodeAddress,
    signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";

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
            networkObj: {
                supportWallet: []
            },
            linkLoading: false,
            chooseWalletLoading: false,
            visible: false,
            polkadotAccountList: [],
            networkList: [{
                name: 'BNB Chain',
                key: 'BSC',
                icon: require('@/web3goLayout/assets/layout/bnb.png'),
            }, {
                name: 'Polkadot',
                key: 'Polkadot',
                icon: require('@/web3goLayout/assets/layout/boka.png'),
            }],
            walletTypeList: [],
        }
        this.formRef = React.createRef();
    }
    async componentDidMount() {
        const walletTypeList = await LayoutLoginApi.getSupportedWallet()
        this.setState({
            walletTypeList
        });
        this.props.onRef(this)


    }
    openConnectWalletModal = () => {
        this.setState({
            visible: true,
        });
    }
    getWalletIcon = (v) => {
        if (v.wallet == 'Metamask') {
            return require('@/web3goLayout/assets/layout/metamaskicon.png')
        } else if (v.wallet == 'Polkadot.js') {
            return require('@/web3goLayout/assets/layout/polkadoticon-b.png')
        }
    }
    getWalletBlackIcon = (v) => {
        if (v.wallet == 'Metamask') {
            return require('@/web3goLayout/assets/layout/metamaskicon.png')
        } else if (v.wallet == 'Polkadot.js') {
            return require('@/web3goLayout/assets/layout/polkadoticon.png')
        }
    }
    handleClickWalletType = (v) => {
        this.setState({
            walletType: v.wallet
        });
        if (v.wallet == 'Metamask') {
            this.connectMetaMask();
        } else if (v.wallet == 'Polkadot.js') {
            this.connectPolkadot();
        }
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
    isValidSignature = async (message, signature, address) => {
        await cryptoWaitReady();
        const publicKey = decodeAddress(address);
        const hexPublicKey = u8aToHex(publicKey);
        return signatureVerify(message, signature, hexPublicKey)
            .isValid;
    }
    choosePolkadotWallet = async (account) => {
        this.setState({
            chooseWalletLoading: true
        });
        const challengeObj = await LayoutLoginApi.web3_nonce({
            "chain": this.state.networkObj.key,
            "walletSource": this.state.walletType,
            "address": account.address
        });
        const injector = await web3FromSource(account.meta.source);
        // this injector object has a signer and a signRaw method
        // to be able to sign raw bytes
        const signRaw = injector && injector.signer && injector.signer.signRaw;

        if (signRaw) {
            // after making sure that signRaw is defined
            // we can use it to sign our message
            let accountAddress = account.address;
            // const message = "challenge message at 20210-11-21 10:00:00";
            const message = challengeObj.challenge;

            const { signature } = await signRaw({
                address: accountAddress,
                data: message,
                type: "bytes",
            });
            const isValid = await this.isValidSignature(
                message,
                signature,
                accountAddress
            );
            console.log("isValid", isValid);
            const tokenObj = await LayoutLoginApi.web3_challenge({
                "chain": this.state.networkObj.key,
                "walletSource": this.state.walletType,
                signature,
                identityNetwork: "polkadot",
                scope: ["address", "balance"],
                challenge: message,
                address: accountAddress,
                nonce: challengeObj.nonce,
            });
        }

        // await web3Enable(`Web3Go`);
        const walletData = {
            walletType: "polkadotjs",
            address: account.address,
            name: account.meta.name,
            balance: {
                free: 0,
                reserved: 0,
                total: 0,
            },
        };
    }
    changeNetwork = (v) => {
        this.setState({
            networkObj: v,
            walletType: '',
            polkadotAccountList: []
        });
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
                    <div className="section">
                        <div className="section-title">Choose Network</div>
                        <div className="list">
                            {
                                this.state.networkList.map(v => (
                                    <div
                                        key={v.name}
                                        className={'item hover-item' + (this.state.networkObj.name == v.name ? ' active' : '')}
                                        onClick={() => this.changeNetwork(v)}
                                    >
                                        <div className="center">
                                            <div className="img-wrap">
                                                <img className="white" src={v.icon} alt="" />
                                            </div>
                                            <div className="text">{v.name}</div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                    <div className="section">
                        <div className="section-title">Choose Wallet</div>
                        <div className="list">
                            {
                                this.state.walletTypeList.map(v => (
                                    <div
                                        key={v.wallet}
                                        className={'item hover-item'
                                            +
                                            (this.state.walletType == v.wallet ? ' active' : '')
                                            +
                                            (v.chains.includes(this.state.networkObj.key) ? '' : ' disabled')}
                                        onClick={() => { this.handleClickWalletType(v) }}
                                    >
                                        <div className="center">
                                            <div className="img-wrap">
                                                {this.props.isDark ? <img
                                                    src={this.getWalletBlackIcon(v)}
                                                    alt=""
                                                /> : <img className="white" src={this.getWalletIcon(v)} alt="" />}
                                            </div>
                                            <div className="text">{v.wallet}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {this.state.walletType == 'Polkadot.js' ? (
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
                    {
                        this.state.chooseWalletLoading ? (

                            <div className="btn-wrap">
                                <Spin />
                                <span>Connecting</span>
                            </div >
                        ) : null
                    }
                </div >
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);