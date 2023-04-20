/* eslint-disable react/prop-types */
import React from "react";
import './index.less';
import { Button, Form, Tabs, Drawer } from '@arco-design/web-react';

export default function (props) {
    const { visible, onOk, onCancel, children } = props
    return (
        <Drawer
            {...props}
            width={480}
            title={null}
            footer={null}
            closable={false}
            focusLock={false}
            maskClosable={true}
            visible={visible}
            wrapClassName="web3go-common-drawer"
            onCancel={onCancel}
        >
            {children}
            {/* <div className="d-title">
                <span>{props.title || 'Filter'}</span>
                <img className="close hover-item" onClick={onCancel} src={require("@/web3goLayout/assets/dashboardCreate/close.png")} alt="" />
            </div>
            <div className="d-main">
                {children}
            </div>
            <div className="d-footer">
                <Button className="btn" type="secondary" onClick={onCancel}>Cancel</Button>
                <Button className="btn" type="primary" onClick={onOk}>OK</Button>
            </div> */}
        </Drawer>
    )
}

