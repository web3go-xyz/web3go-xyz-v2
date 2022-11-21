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
                    fgd fdg fdd dfg fd
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
