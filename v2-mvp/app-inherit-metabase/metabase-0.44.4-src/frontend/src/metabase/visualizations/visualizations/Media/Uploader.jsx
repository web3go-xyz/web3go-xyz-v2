/* eslint-disable react/prop-types */
import React from "react";
// class Uploader extends React.Component {
//     render() {
//       return <h1>Hello, {this.props.name}</h1>;
//     }
//   }


import cx from "classnames";
import styles from "./Style.less";
import { Button } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";

export default function Uploader(props) {
    return (
        <>
            <div className={cx(styles['upload-wrap'])}>
                <Button size='large' shape='circle' type='primary' icon={<IconPlus />} />
                <div className={cx(styles['upload-btn-text'])}><span>Upload files</span></div>
                <div className={cx(styles['upload-tips'])}><span>Format: JPG or PNG   Max size of 1MB</span></div>
            </div>
        </>
    );
}