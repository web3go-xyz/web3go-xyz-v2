/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { IconCopy, IconRecord } from '@arco-design/web-react/icon';
import { position } from "tether";
import { LayoutLoginApi, LayoutDashboardApi } from '@/services'
import { copy } from '@/web3goLayout/utils'

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
            visible: false,
            record: {},
            publicUrlOfLinkObj: {}
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = (record) => {
        this.setState({
            record,
            visible: true,
        });
        LayoutDashboardApi.generateDatasetShareLink({
            "datasetId": record.id,
            "shareChannel": "link"
        }).then(d => {
            this.setState({
                publicUrlOfLinkObj: d
            });
        })
    }
    handleShare = (shareChannel) => {
        LayoutDashboardApi.generateDatasetShareLink({
            "datasetId": this.state.record.id,
            "shareChannel": shareChannel
        }).then(d => {
            if (shareChannel == 'twitter') {
                const title = `Check out ${this.state.record.name} on Web3go! Here is the link:`;
                const url = `https://twitter.com/share?text=${title}&url=${encodeURIComponent(d.shareLink)}&via=web3go&hashtags=blockChain%2Cweb3go`;
                window.open(url);
            }
            if (shareChannel == 'telegram') {
                const title = `Check out ${this.state.record.name} on Web3go!`;
                const url = `https://t.me/share/url?url=${encodeURIComponent(d.shareLink)}&text=${title}`;
                window.open(url);
            }
        })
    }
    handleCopy = () => {
        copy(this.state.publicUrlOfLinkObj.shareLink);
        this.addShareLog('link');
    }
    addShareLog = (shareChannel) => {
        LayoutDashboardApi.logShareDS({
            "datasetId": this.state.record.id,
            "shareChannel": shareChannel,
            "referralCode": this.state.publicUrlOfLinkObj.referralCode
        });
    }
    render() {
        return (
            <Modal
                style={{ width: '640px' }}
                wrapClassName="common-form-modal home-share-modal"
                title='Share'
                visible={this.state.visible}
                onCancel={() => this.setState({ visible: false })}
                footer={null}
            >
                <div className="modal-content" >
                    <div className="label">Public link</div>
                    <div className="value">
                        <Input readOnly className="a" value={this.state.publicUrlOfLinkObj.shareLink}></Input>
                        <Button className="copy" type="primary" onClick={() => { this.handleCopy() }}>
                            <IconCopy />
                            <span className="text">Copy</span>
                        </Button>
                    </div>
                    <div className="split-wrap">
                        <div className="line"></div>
                        <span>or share with</span>
                        <div className="line"></div>
                    </div>
                    <div className="icon-wrap">
                        {/* <img onClick={() => { this.handleShare('discord') }} title="Discord" className="hover-item" src={require("@/web3goLayout/assets/home/discord.png")} alt="" /> */}
                        <img onClick={() => { this.handleShare('telegram') }} title="Telegram" className="hover-item" src={require("@/web3goLayout/assets/home/telegram.png")} alt="" />
                        <img onClick={() => { this.handleShare('twitter') }} title="Twitter" className="hover-item" src={require("@/web3goLayout/assets/home/twitter.png")} alt="" />
                    </div>
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
