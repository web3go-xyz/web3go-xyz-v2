/* eslint-disable react/prop-types */
import React, { useState } from "react";
import './index.less';
import { Button, Drawer } from '@arco-design/web-react';
import PropTypes from "prop-types";

export default function CommonDrawer(props) {
    CommonDrawer.propTypes = {
        doMount: PropTypes.func
    }

    const { visible, onOk, onCancel, children } = props
    const [saveLoading, setSaveLoading] = useState(false)
    const setLoadingStatus= (status) => {
        setSaveLoading(status);
    }
    props.doMount && props.doMount({setLoadingStatus});
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
            <div className="d-title">
                <span>{props.title || 'Filter'}</span>
                <img className="close hover-item" onClick={onCancel} src={require("@/web3goLayout/assets/dashboardCreate/close.png")} alt="" />
            </div>
            <div className="d-main">
                {children}
            </div>
            <div className="d-footer">
                <Button className="btn" type="secondary" onClick={onCancel}>Cancel</Button>
                <Button className="btn" type="primary" onClick={onOk} loading={saveLoading || false}>OK</Button>
            </div>
        </Drawer>
    )
}

