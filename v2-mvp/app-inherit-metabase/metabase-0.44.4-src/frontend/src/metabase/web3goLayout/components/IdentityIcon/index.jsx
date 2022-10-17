/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import makeBlockie from "ethereum-blockies-base64";
import Identicon from '@polkadot/react-identicon';

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


    render() {
        return (
            <div className="web3go-layout-component-identity-icon">
                {
                    this.props.isPolkadot ?
                        <Identicon
                            value={this.props.address}
                            size={this.props.iconSize || 24}
                            theme='polkadot'
                        />
                        :
                        <img
                            className="eth-icon"
                            style={{ width: this.props.iconSize || 24 + 'px' }}
                            src={makeBlockie(this.props.address)}
                            alt=""
                        />
                }
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
