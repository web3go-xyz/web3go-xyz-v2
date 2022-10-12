/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal } from '@arco-design/web-react';
import { toggleDark } from "metabase/redux/app";
import { push } from "react-router-redux";

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
    }
    init(isSignIn) {
        this.visible = true;
        this.clearForm();
        this.isSignIn = isSignIn;
    }
    render() {
        return (
            <Modal
                title='Modal Title'
                visible={this.visible}
                onOk={() => this.setState({ visible: true })}
                onCancel={() => this.setState({ visible: true })}
            >   <p>
                    You can customize modal body text by the current situation. This modal will be closed
                    immediately once you press the OK button.
                </p>
            </Modal>
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
