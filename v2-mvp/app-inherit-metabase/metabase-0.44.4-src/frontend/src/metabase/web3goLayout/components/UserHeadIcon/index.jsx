/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";
import makeBlockie from "ethereum-blockies-base64";
import Identicon from '@polkadot/react-identicon';
import { fontSize } from "styled-system";

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
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
        if (this.props.avatar) {
            return < img className={"head-icon-component" + (this.props.className ? ' ' + this.props.className : '')} style={{
                width: (this.props.iconSize || 44) + 'px',
                height: (this.props.iconSize || 44) + 'px',
                borderRadius: '50%',
            }}
                src={this.props.avatar} alt="" />
        }
        let firstWord = '';
        if (this.props.nickName) {
            firstWord = this.props.nickName.slice(0, 1)
        }
        if (!firstWord) {
            return <div></div>
        }

        let bgColor = "#615CF6";
        if ('GHIJKL'.includes(firstWord.toUpperCase())) {
            bgColor = '#00B449'
        } else if ('MNOPQR'.includes(firstWord.toUpperCase())) {
            bgColor = '#165DFF'
        } else if ('STUVWXYZ'.includes(firstWord.toUpperCase())) {
            bgColor = '#FFC225'
        }
        return <div className={"head-icon-component" + (this.props.className ? ' ' + this.props.className : '')} style={{
            width: (this.props.iconSize || 44) + 'px',
            height: (this.props.iconSize || 44) + 'px',
            background: bgColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            justifyContent: 'center'
        }}>
            <span style={{ fontSize: (this.props.fontSize || 14) + 'px' }}>{firstWord}</span>
        </div>

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
