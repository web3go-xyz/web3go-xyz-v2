/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload } from '@arco-design/web-react';
import { push } from "react-router-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { LayoutLoginApi } from '@/services'

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData
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
            canSend: true,
            nickNameCanEdit: false,
            visible: false,
            linkEmailVisible: false,
            walletList: [],
            emailList: [{}],
            img: '',
            cropper: null,
        }
        this.formRef = React.createRef();
        this.emailModalFormRef = React.createRef();
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData)) {
            this.setNickName();
        }
    }
    cancelNickname = () => {
        this.setNickName();
        this.setState({
            nickNameCanEdit: false
        });
    }
    saveNickname = () => {
        this.setState({
            nickNameCanEdit: false
        });
    }
    setNickName = () => {
        if (!this.props.userData.account) {
            return;
        }
        this.formRef.current.setFieldsValue({
            nickname: this.props.userData.account.nickName,
        });
    }
    sureLink = () => {
        this.setState({
            linkEmailVisible: false
        })
    }
    unlinkEmail = () => {
        Modal.confirm({
            wrapClassName: 'common-confirm-modal',
            closable: true,
            title: 'Are you sure to unlink Email Address ?',
            content:
                'After you click ok, your Web3go account will be deleted. Your will lose all your data.',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: () => {
                console.log('ok');
            }
        });
    }
    copperSure = () => {
        if (this.state.cropper) {
            this.state.cropper.getCroppedCanvas().toBlob((blob) => {
                const formData = new FormData();

                // Pass the image file name as the third parameter if necessary.
                formData.append('croppedImage', blob/*, 'example.png' */);

                // Use `jQuery.ajax` method for example
                // $.ajax('/path/to/upload', {
                //   method: 'POST',
                //   data: formData,
                //   processData: false,
                //   contentType: false,
                //   success() {
                //     console.log('Upload success');
                //   },
                //   error() {
                //     console.log('Upload error');
                //   },
                // });
            }/*, 'image/png' */);
        }
    }
    fileChange = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({
                visible: true,
                img: reader.result
            });
        };
        reader.readAsDataURL(files[0].originFile);
    }
    handleLinkEmail = () => {

    }
    sendEmail = () => {
        this.emailModalFormRef.current.validate(['email']).then(() => {
            const form = this.emailModalFormRef.current.getFields();
            LayoutLoginApi.sendVerifyEmail({
                "email": form.email,
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
            }).catch(e => {
                if (e && e.data && e.data.message) {
                    Message.error({
                        content: e.data.message,
                        duration: 5000
                    });
                }
            })
        })
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
                            initialValues={{ nickname: this.props.userData.account && this.props.userData.account.nickName }}
                        >
                            <div className="name">{this.props.userData.account && this.props.userData.account.nickName}</div>
                            <div className="id">Web3Go ID : {this.props.userData.account && this.props.userData.account.web3Id}</div>
                            <FormItem label="Nickname" className="nickname-row" required>
                                <FormItem style={{ width: '504px' }} field="nickname" noStyle={{ showErrorTip: true }} rules={[{ required: true }]}>
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
                                    <img src={require("@/web3goLayout/assets/account/Avatar.png")} alt="" />
                                    <Upload action='/' showUploadList={false} autoUpload={false} onChange={this.fileChange}>
                                        <Button>Change</Button>
                                    </Upload>
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
                                                onClick={() => { this.unlinkEmail() }}
                                                className="a hover-item"
                                                src={require("@/web3goLayout/assets/account/unlink.png")}
                                                alt=""
                                            />
                                        </div>
                                        <div onClick={() => { this.setState({ linkEmailVisible: true }) }} className="add-more hover-item">
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
                    </div>
                </div>
                <Modal
                    style={{ width: '800px' }}
                    title='Upload Avatar'
                    visible={this.state.visible}
                    onCancel={() => this.setState({ visible: false })}
                    footer={null}
                >
                    <div className="web3go-account-setting-avatar-modal">
                        <Cropper
                            style={{ height: 400, width: '100%' }}
                            zoomTo={0.5}
                            initialAspectRatio={1}
                            preview="#avatar-preview"
                            src={this.state.img}
                            viewMode={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            aspectRatio={1}
                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            onInitialized={(instance) => {
                                this.setState({ cropper: instance });
                            }}
                            guides={true}
                        />
                        <div id="avatar-preview"></div>
                        <div className="btn-wrap">
                            <Button className="btn" type="primary" onClick={this.copperSure}>Sure</Button>
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
                                <Input type="password" onPressEnter={this.handleLinkEmail} placeholder='please enter your password...' />
                            </FormItem>
                        </Form>
                        <div className="btn-wrap">
                            <Button className="btn" type="primary" onClick={this.handleLinkEmail}>Link</Button>
                        </div>
                    </div >
                </Modal >
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
