/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message } from '@arco-design/web-react';
import { replace } from "react-router-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { LayoutLoginApi } from '@/services'

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark
    }
};
const mapDispatchToProps = {
    replace
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        let email = this.props.location.query['email'] || '';
        let accountId = this.props.location.query['accountId'] || '';
        let code = this.props.location.query['code'] || '';
        let verifyCodePurpose = this.props.location.query['verifyCodePurpose'] || '';
        LayoutLoginApi.verifyCode({
            "email": email,
            "accountId": accountId,
            code: code,
            "verifyCodePurpose": verifyCodePurpose
        }).then(d => {
            localStorage.setItem('token', d.token);
            location.replace(`/auth/sso?jwt=${d.token}&&return_to=/`)
        }).catch(e => {
            if (e && e.data && e.data.message) {
                this.props.replace('/layout/home#showLogin');
                Message.error(e.data.message);
                // document.write(e.data.message)
            }
        })
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
