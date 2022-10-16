/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { position } from "tether";
import { shorterAddress } from '@/web3goLayout/utils';
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
            visible: true,
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
        this.web3 = new Web3(ethereum);
        try {
            await ethereum.send("eth_requestAccounts");
        } catch (error) {
            console.error("User denied account access");
            this.linkLoading = false;
            return;
        }
        this.web3.eth.getAccounts((err, accs) => {
            console.log("web3 accounts:", accs);
            this.ethAccountList = accs;
            if (accs.length === 0) {
                console.error(
                    "cannot get account, please check if Metamask has been configured？"
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
    selectMetaBaseAccount = (acc) => {

    }
    solveAccounts = (acc) => {
        // 查询token余额
        this.web3.eth.getBalance(acc).then((d) => {
            debugger;
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
        this.polkadotAccountList = await web3Accounts({
            // ss58Format: ss58Format,
            accountType: ["ed25519", "sr25519", "ecdsa"],
        });
    }
    connect = () => {

    }
    render() {
        return (
            <Modal
                title='Connect Wallet'
                visible={this.state.visible}
                onOk={() => this.setState({ visible: false })}
                onCancel={() => this.setState({ visible: false })}
                footer={null}
            >
                <div className="dialot-content">
                    <div className="section">
                        <div className="section-title">Choose Wallet</div>
                        <div className="list">
                            <div
                                className={'item hover-item' + (walletType == 'metamask' ? ' active' : '')}
                                onClick="connectMetaMask"
                            >
                                <div className="center">
                                    <div className="img-wrap">
                                        <img src="@/assets/layout/metamaskicon.png" alt="" />
                                    </div>
                                    <div className="text">Metamask</div>
                                </div>
                            </div>
                            <div
                                className={'item hover-item' + (walletType == 'polkadot' ? ' active' : '')}
                                onClick={this.connectPolkadot}
                            >
                                <div className="center">
                                    <div className="img-wrap">
                                        <img src="@/assets/layout/polkadoticon.png" alt="" />
                                    </div>
                                    <div className="text">Polkadot.js</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section" v-if="walletType == 'polkadot'">
                        <div className="section-title">Choose Account</div>
                        <div className="list">
                            {
                                this.state.accounts.map((v, i) =>
                                (
                                    <div
                                        key="i"
                                        className="item hover-item"
                                        onClick={this.selectMetaBaseAccount}
                                    >
                                        <div className="center flex">
                                            {/* <IdentityIcon
                isPolkadot
                address="67GdmSznJLbqAX84JUY4GwYFXuEsAFQegEZCXFv1btzGbDbq"
              ></IdentityIcon> */}
                                            <div className="right">
                                                <div className="name">Account-01</div>
                                                <div className="address">
                                                    {
                                                        shorterAddress("67GdmSznJLbqAX84JUY4GwYFXuEsAFQegEZCXFv1btzGbDbq")
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
                    <div className="btn-wrap">
                        <el-button className="btn" type="primary" onClick={this.connect}
                        >Connect wallet</el-button
                        >
                    </div >
                </div >
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
