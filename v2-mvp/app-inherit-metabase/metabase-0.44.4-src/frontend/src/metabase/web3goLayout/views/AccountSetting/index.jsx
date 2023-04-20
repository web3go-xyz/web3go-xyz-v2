/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message } from '@arco-design/web-react';
import { push } from "react-router-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { changeUserData } from "metabase/redux/app";
import { LayoutLoginApi } from '@/services'
import event from '@/web3goLayout/event';
import MyHeadIcon from '@/web3goLayout/components/MyHeadIcon';
import { logout } from "@/auth/actions";

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData
    }
};
const mapDispatchToProps = {
    onLogout: logout,
    push,
    changeUserData
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canSend: true,
            nickNameCanEdit: false,
            visible: false,
            linkEmailVisible: false,
            img: '',
            cropper: null,
        }
        this.formRef = React.createRef();
        this.emailModalFormRef = React.createRef();
    }
    componentDidMount() {

    }
    // componentDidUpdate(prevProps) {
    //     if (JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData)) {
    //         this.setNickName();
    //     }
    // }
    cancelNickname = () => {
        this.setNickName();
        this.setState({
            nickNameCanEdit: false
        });
    }
    saveNickname = () => {
        const { nickName } = this.formRef.current.getFields();
        LayoutLoginApi.changeName({
            accountId: this.props.userData.account.accountId,
            nickName
        }).then(d => {
            if (d) {
                this.setState({
                    nickNameCanEdit: false
                });
                this.refreshAccountInfo();
            }
        })
    }
    setNickName = () => {
        if (!this.props.userData.account) {
            return;
        }
        this.formRef.current.setFieldsValue({
            nickName: this.props.userData.account.nickName,
        });
    }
    linkEmail = () => {
        this.emailModalFormRef.current.validate().then((form) => {
            LayoutLoginApi.linkEmail({
                accountId: this.props.userData.account.accountId,
                email: form.email,
                password: form.password,
                code: form.code
            }).then(d => {
                if (d) {
                    this.setState({
                        linkEmailVisible: false
                    })
                    this.refreshAccountInfo();
                }
            })
        })
    }
    handleLinkWallet = () => {
        event.emit('openAddWalletModal');
    }
    unlinkEmail = (v) => {
        let allAccountCount = 0;
        if (this.props.userData.accountEmails) {
            allAccountCount += this.props.userData.accountEmails.length;
        }
        if (this.props.userData.accountWallets) {
            allAccountCount += this.props.userData.accountWallets.length;
        }
        Modal.confirm({
            wrapClassName: allAccountCount > 1 ? 'common-confirm-modal' : 'common-confirm-modal account-settiong-error-icon-confirm-modal',
            closable: true,
            title: allAccountCount > 1 ? 'Are you sure to unlink Email Address ?' : 'Are you sure to delete Web3go Account?',
            content:
                allAccountCount > 1 ? 'After you unlink this email, you won’t be able to access data under this account.' : "You’re deleting your last log-in method. After you confirm, your Web3go account will be deleted. ",
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: () => {
                LayoutLoginApi.unlinkEmail({
                    accountId: this.props.userData.account.accountId,
                    email: v.email,
                }).then(d => {
                    if (d) {
                        this.refreshAccountInfo();
                    }
                })
            }
        });
    }
    unlinkWallet = (v) => {
        let allAccountCount = 0;
        if (this.props.userData.accountEmails) {
            allAccountCount += this.props.userData.accountEmails.length;
        }
        if (this.props.userData.accountWallets) {
            allAccountCount += this.props.userData.accountWallets.length;
        }

        Modal.confirm({
            wrapClassName: allAccountCount > 1 ? 'common-confirm-modal' : 'common-confirm-modal account-settiong-error-icon-confirm-modal',
            closable: true,
            title: allAccountCount > 1 ? 'Are you sure to unlink Wallet ?' : 'Are you sure to delete Web3go Account?',
            content:
                allAccountCount > 1 ? "After you unlink this wallet address , you won't be able to access data under this account." : "You’re deleting your last log-in method. After you confirm, your Web3go account will be deleted. ",
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: () => {
                LayoutLoginApi.unlinkWallet({
                    accountId: this.props.userData.account.accountId,
                    address: v.address,
                    chain: v.chain
                }).then(d => {
                    if (d) {
                        this.refreshAccountInfo();
                    }
                })
            }
        });
    }
    refreshAccountInfo() {
        LayoutLoginApi.getAccountInfo().then(d => {
            if(!d){
                this.props.onLogout();
                return;
            }
            this.props.changeUserData(d);
        })
    }
    copperSure = () => {
        if (this.state.cropper) {
            const avatar = this.state.cropper.getCroppedCanvas().toDataURL('image/jpeg');
            LayoutLoginApi.changeAvatar({
                accountId: this.props.userData.account.accountId,
                avatar
            }).then(d => {
                if (d) {
                    this.setState({
                        visible: false
                    });
                    this.refreshAccountInfo();
                }
            });
        }
    }
    openCropperModal = () => {
        this.setState({
            visible: true,
            img: ''
        });
    }
    fileChange = (files) => {
        const isLt1M = files[files.length - 1].originFile.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            Message.error('Max size is 1MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({
                visible: true,
                img: reader.result
            });
        };
        reader.readAsDataURL(files[0].originFile);
    }
    sendEmail = () => {
        this.emailModalFormRef.current.validate(['email']).then(() => {
            const form = this.emailModalFormRef.current.getFields();
            LayoutLoginApi.checkEmailBeforeLink({
                "email": form.email,
                accountId: this.props.userData.account.accountId,
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
    zoomBig = () => {
        this.state.cropper.zoom(0.1);
    }
    zoomSmall = () => {
        this.state.cropper.zoom(-0.1);
    }
    render() {
        return (
            <div className="web3go-layout-AccountSetting-page">
                <div className="common-bread">
                    <div className="item hover-primary" onClick={() => { this.props.push('/') }}>Home</div>
                    <div className="split">/</div>
                    <div className="item active">Account Setting</div>
                </div>
                <div className="page-main">
                    {/* <div className="nav">
                        <div className="nav-list">
                            <div className="item" onClick={()=>{this.props.push('/layout/mySpace')}}>My Space</div>
                            <div className="item active">Account Setting</div>
                        </div>
                    </div> */}
                    <div className="pm-right">
                        <div className="banner">
                            <div className="avatar">
                                <MyHeadIcon iconSize={116} fontSize={28}></MyHeadIcon>
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
                            initialValues={{ nickName: this.props.userData.account && this.props.userData.account.nickName }}
                        >
                            <div className="name">{this.props.userData.account && this.props.userData.account.nickName}</div>
                            <div className="id">Web3Go ID : {this.props.userData.account && this.props.userData.account.web3Id}</div>
                            <FormItem label="Nickname" className="nickName-row" required>
                                <FormItem style={{ width: '504px' }} field="nickName" noStyle={{ showErrorTip: true }} rules={[{ required: true }]}>
                                    <Input
                                        disabled={!this.state.nickNameCanEdit}
                                        maxLength={50}
                                        showWordLimit
                                    />
                                </FormItem>
                                <img onClick={() => { this.setState({ nickNameCanEdit: true }) }} className="hover-item" src={require("@/web3goLayout/assets/account/edit.png")} alt="" />
                            </FormItem>
                            {
                                this.state.nickNameCanEdit ? (
                                    <div className="save-row">
                                        <Button onClick={this.cancelNickname}>Cancel</Button>
                                        <Button onClick={this.saveNickname} type="primary">Save</Button>
                                    </div>
                                ) : null
                            }
                            <div className="form-item">
                                <div className="label">Avatar</div>
                                <div className="value">
                                    <MyHeadIcon iconSize={48}></MyHeadIcon>
                                    <Button onClick={this.openCropperModal}>Change</Button>
                                    <span className="tip">JPG or PNG. Max size is 1MB</span>
                                </div>
                            </div>
                            <div className="split"></div>
                            <div className="form-item">
                                <div className="label">Email</div>
                                {!(this.props.userData.accountEmails && this.props.userData.accountEmails.length) ? (
                                    <Button
                                        onClick={() => { this.setState({ linkEmailVisible: true }) }}
                                        className="add-email"
                                        type="primary"
                                    >
                                        <img src={require("@/web3goLayout/assets/account/add.png")} alt="" />
                                        <span> Link Email </span>
                                    </Button>
                                ) : (
                                    <div className="email-list">
                                        {
                                            this.props.userData.accountEmails.map((v, i) =>
                                            (
                                                <div className="item" key={i}>
                                                    <div className="email">{v.email}</div>
                                                    <img
                                                        onClick={() => { this.unlinkEmail(v) }}
                                                        className="a hover-item"
                                                        src={require("@/web3goLayout/assets/account/unlink.png")}
                                                        alt=""
                                                    />
                                                </div>
                                            )
                                            )
                                        }
                                        <div className="add-more-wrap">
                                            <div onClick={() => { this.setState({ linkEmailVisible: true }) }} className="add-more hover-item">
                                                <img className="icon" src={require("@/web3goLayout/assets/account/add2.png")} alt="" />
                                                <span>Add More</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="split"></div>
                            <div className="form-item">
                                <div className="label">Wallet</div>
                                {!(this.props.userData.accountWallets && this.props.userData.accountWallets.length) ? (
                                    <Button
                                        onClick={this.handleLinkWallet}
                                        className="add-email"
                                        type="primary"
                                    >
                                        <img src={require("@/web3goLayout/assets/account/add.png")} alt="" />
                                        <span> Link Wallet </span>
                                    </Button>
                                ) : (
                                    <div className="wallet-list">
                                        {
                                            this.props.userData.accountWallets.map((v, i) =>
                                            (
                                                <div className="item" key={i}>
                                                    {
                                                        v.walletSource == 'Metamask' ? (
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
                                                        ) : (
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
                                                        )

                                                    }
                                                    <span className="address"
                                                    >{v.address}</span
                                                    >
                                                    <img
                                                        onClick={() => { this.unlinkWallet(v) }}
                                                        className="a hover-item"
                                                        src={require("@/web3goLayout/assets/account/unlink.png")}
                                                        alt=""
                                                    />
                                                </div>
                                            )
                                            )
                                        }
                                        <div className="add-more-wrap">
                                            <div className="add-more hover-item" onClick={this.handleLinkWallet}>
                                                <img className="icon" src={require("@/web3goLayout/assets/account/add2.png")} alt="" />
                                                <span>Add More</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form>
                    </div>
                </div>
                <Modal
                    wrapClassName="common-form-modal web3go-account-setting-avatar-modal"
                    style={{ width: '640px' }}
                    title='Upload Avatar'
                    visible={this.state.visible}
                    onCancel={() => this.setState({ visible: false })}
                    footer={null}
                >
                    <div className="modal-content">
                        <div className="modal-main">
                            <div className="m-left">
                                {
                                    this.state.img ? (
                                        <div className="cropper-wrap">
                                            <Cropper
                                                style={{ height: 320, width: 320 }}
                                                zoomTo={0.5}
                                                initialAspectRatio={1}
                                                preview="#avatar-preview"
                                                src={this.state.img}
                                                viewMode={1}
                                                minCropBoxHeight={10}
                                                minCropBoxWidth={10}
                                                background={false}
                                                responsive={true}
                                                autoCropArea={0.6}
                                                aspectRatio={1}
                                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                                onInitialized={(instance) => {
                                                    this.setState({ cropper: instance });
                                                }}
                                                guides={true}
                                            />
                                            <div className="operation-wrap">
                                                <Upload action='/'
                                                    key={Math.random()}
                                                    accept='.jpg,.png'
                                                    showUploadList={false}
                                                    autoUpload={false}
                                                    onChange={this.fileChange}>
                                                    <span className="text hover-item">Reupload</span>
                                                </Upload>
                                                <div className="o-right">
                                                    <img
                                                        className="hover-item"
                                                        onClick={this.zoomBig}
                                                        src={require("@/web3goLayout/assets/account/plus.png")}
                                                        alt=""
                                                    />
                                                    <img
                                                        className="hover-item"
                                                        onClick={this.zoomSmall}
                                                        src={require("@/web3goLayout/assets/account/minus.png")}
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                        :
                                        (
                                            <Upload action='/'
                                                key={Math.random()}
                                                accept='.jpg,.png'
                                                showUploadList={false}
                                                autoUpload={false}
                                                onChange={this.fileChange}>
                                                <div className="m-btn-wrap">
                                                    <div className="img-wrap">
                                                        <img src={require("@/web3goLayout/assets/account/add-circle.png")} alt="" />
                                                    </div>
                                                    <div className="tip">
                                                        Format: JPG or PNG<br />
                                                        Max size of 1MB
                                                    </div>
                                                </div>
                                            </Upload>
                                        )
                                }
                            </div>
                            <div className="split"></div>
                            <div className="m-right">
                                <div id="avatar-preview"></div>
                                <div className="text">Preview</div>
                            </div>
                        </div>
                        <div className="btn-wrap" style={this.state.img ? { marginTop: '64px' } : {}}>
                            <Button className="btn" onClick={() => this.setState({ visible: false })}>Cancel</Button>
                            <Button className="btn" type="primary" onClick={this.copperSure}>Upload</Button>
                        </div >
                    </div >
                </Modal >
                <Modal
                    wrapClassName="common-form-modal"
                    style={{ width: '637px' }}
                    title='Link with email'
                    visible={this.state.linkEmailVisible}
                    onCancel={() => this.setState({ linkEmailVisible: false })}
                    footer={null}
                >
                    <div className="web3go-account-setting-email-modal">
                        <Form
                            ref={this.emailModalFormRef}
                            layout="vertical"
                            requiredSymbol={{ position: 'end' }}
                        >
                            <FormItem className="email-row" label='Email address' required>
                                <FormItem field='email' noStyle={{ showErrorTip: true }} rules={[{ required: true, type: 'email' }]}>
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
                            <FormItem label='Security code' field='code' rules={[{ required: true }]}>
                                <Input placeholder='please enter your security code' />
                            </FormItem>
                            <FormItem label='Password' field='password' rules={[{ required: true }]}>
                                <Input type="password" onPressEnter={this.linkEmail} placeholder='please enter your password...' />
                            </FormItem>
                        </Form>
                        <div className="btn-wrap">
                            <Button className="btn" type="primary" onClick={this.linkEmail}>Link</Button>
                        </div>
                    </div >
                </Modal >
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
