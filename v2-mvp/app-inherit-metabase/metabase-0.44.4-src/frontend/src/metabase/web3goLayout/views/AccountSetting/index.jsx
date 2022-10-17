/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload } from '@arco-design/web-react';
import { push } from "react-router-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

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
            visible: false,
            walletList: [],
            emailList: [],
            img: '',
            cropper: null,
        }
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
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
