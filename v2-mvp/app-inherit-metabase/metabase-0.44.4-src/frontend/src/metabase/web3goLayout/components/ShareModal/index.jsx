/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import { IconCopy } from '@arco-design/web-react/icon';
import { position } from "tether";
import { LayoutLoginApi } from '@/services'
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
        }
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = () => {
        this.setState({
            visible: true
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
                <div className="modal-content" onClick={() => { copy('http://www.web3go.xyz/@kelleng/NFT-Projects-Tracking-Kelleng') }}>
                    <div className="label">Public link</div>
                    <div className="value">
                        <div className="a">http://www.web3go.xyz/@kelleng/NFT-Projects-Tracking-Kelleng</div>
                        <Button  className="copy" type="primary">
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
                        <img title="Discord" className="hover-item" src={require("@/web3goLayout/assets/home/discord.png")} alt="" />
                        <img title="Twitter" className="hover-item" src={require("@/web3goLayout/assets/home/telegram.png")} alt="" />
                        <img title="Telegram" className="hover-item" src={require("@/web3goLayout/assets/home/twitter.png")} alt="" />
                    </div>
                </div>
            </Modal >
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
