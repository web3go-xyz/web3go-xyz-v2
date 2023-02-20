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
            info: ''
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    init = (info) => {
        this.setState({
            info,
            visible: true
        })
    }

    render() {
        return (
            <Modal
                style={{ width: '640px' }}
                wrapClassName="common-form-modal dashboard-detail-chart-info-modal"
                title='Chart Info'
                visible={this.state.visible}
                onCancel={() => this.setState({ visible: false })}
                onOk={() => this.setState({ visible: false })}
            >
                <div className="modal-content">
                    {this.state.info}
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
