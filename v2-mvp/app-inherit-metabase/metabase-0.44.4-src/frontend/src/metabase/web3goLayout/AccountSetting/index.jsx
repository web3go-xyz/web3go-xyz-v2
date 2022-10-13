/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input } from '@arco-design/web-react';
import { push } from "react-router-redux";

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark
    }
};
const mapDispatchToProps = {
    push
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletList: [],
            emailList: [],
        }
    }

    render() {
        return (
            <div className="web3go-layout-AccountSetting-page">
                <div className="common-bread">
                    <div className="item">User</div>
                    <div className="split">/</div>
                    <div className="item active">Account Setting</div>
                </div>
                <div className="page-main">
                    <div className="nav">
                        <div className="n-title">My Space</div>
                        <div className="nav-list">
                            <div className="item">Account Setting</div>
                        </div>
                    </div>
                    <div className="pm-right">
                        <div className="banner">
                            <div className="avatar">
                                <img src={require("@/web3goLayout/assets/account/Avatar.png")} alt="" />
                            </div>
                            <div className="text">
                                Everyone can <br />
                                play with blockchain data
                            </div>
                        </div>
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            requiredSymbol={{ position: 'end' }}
                            className="form"
                            initialValues={{ nickname: 'admin' }}
                        >

                            <div className="name">Arthur</div>
                            <div className="id">Web3Go ID : 234156567</div>
                            <FormItem label="Nickname" className="nickname-row" required>
                                <FormItem style={{ width: '504px', marginBottom: 0 }} field="nickname" rules={[{ required: true }]}>
                                    <Input
                                        disabled
                                        maxLength={50}
                                        showWordLimit
                                    />
                                </FormItem>
                                <img className="hover-item" src={require("@/web3goLayout/assets/account/edit.png")} alt="" />
                            </FormItem>

                            <div className="form-item">
                                <div className="label">Avatar</div>
                                <div className="value">
                                    <img src={require("@/web3goLayout/assets/account/Avatar.png")} alt="" />
                                    {/* <el-upload
                                        v-model:file-list="fileList"
                                        className="upload"
                                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :limit="1"
              >
                                    <Button plain>Change</Button>
                                </el-upload> */}
                                    <Button type='secondary' onClick={this.changeAvatar}>Change</Button>
                                    <span className="tip">JPG or PNG. Max size is 1MB</span>
                                </div>
                            </div>
                            <div className="split"></div>
                            <div className="form-item">
                                <div className="label">Email</div>
                                {!this.state.emailList.length ? (
                                    <Button
                                        className="add-email"
                                        type="primary"
                                    >
                                        <img src={require("@/web3goLayout/assets/account/add.png")} alt="" />
                                        <span> Link Email </span>
                                    </Button>
                                ) : (
                                    <div className="email-list">
                                        <div className="item">
                                            <div className="email">nevaeh.simmons@example.com</div>
                                            <img
                                                className="a hover-item"
                                                src={require("@/web3goLayout/assets/account/unlink.png")}
                                                alt=""
                                            />
                                        </div>
                                        <div className="add-more hover-item">
                                            <img className="icon" src={require("@/web3goLayout/assets/account/add2.png")} alt="" />
                                            <span>Add More</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="split"></div>
                            <div className="form-item">
                                <div className="label">Wallet</div>
                                {!this.state.walletList.length ? (
                                    <Button
                                        className="add-email"
                                        type="primary"
                                    >
                                        <img src={require("@/web3goLayout/assets/account/add.png")} alt="" />
                                        <span> Link Wallet </span>
                                    </Button>
                                ) : (
                                    <div className="wallet-list">
                                        <div className="item">
                                            {
                                                this.props.isDark ?
                                                    <img
                                                        className="icon"
                                                        src={require("@/web3goLayout/assets/account/polkadot-b.png")}
                                                        alt=""
                                                    /> :
                                                    <img
                                                        className="icon"
                                                        src={require("@/web3goLayout/assets/account/polkadot.png")}
                                                        alt=""
                                                    />
                                            }
                                            <span className="address"
                                            >14gVLR3kd8bYp9Hc6DuB7FfCtBNwk543EGe8uT8C2Rn1UWFC</span
                                            >
                                            <img
                                                className="a hover-item"
                                                src={require("@/web3goLayout/assets/account/unlink.png")}
                                                alt=""
                                            />
                                        </div>
                                        <div className="item">
                                            {
                                                this.props.isDark ?
                                                    <img
                                                        className="icon"
                                                        src={require("@/web3goLayout/assets/account/metamask-b.png")}
                                                        alt=""
                                                    /> :
                                                    <img
                                                        className="icon"
                                                        src={require("@/web3goLayout/assets/account/metamask.png")}
                                                        alt=""
                                                    />

                                            }

                                            <span className="address"
                                            >14gVLR3kd8bYp9Hc6DuB7FfCtBNwk543EGe8uT8C2Rn1UWFC</span
                                            >
                                            <img
                                                className="a hover-item"
                                                src={require("@/web3goLayout/assets/account/unlink.png")}
                                                alt=""
                                            />
                                        </div>
                                        <div className="add-more hover-item">
                                            <img className="icon" src={require("@/web3goLayout/assets/account/add2.png")} alt="" />
                                            <span>Add More</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form>
                    </div >
                </div >
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
