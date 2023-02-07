/* eslint-disable react/prop-types */
import React from "react";

import cx from "classnames";
import styles from "./Style.less";
import { Button, Upload } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { LayoutDashboardApi } from "../../../services";


export default function Uploader(props) {
    const doUpload = (option) => {
        const formData = new FormData();
        formData.append('file', option.file);
        
        LayoutDashboardApi.uploadPublicImg(formData, { isUpload: true}).then(resp => {
            props.onUploadSuccess(resp)
        });
    }
  return (
    <>
      <div className={cx(styles["upload-wrap"])}>
        <Button
          size="large"
          shape="circle"
          type="primary"
          icon={<IconPlus />}
          onClick={() => document.getElementById("myUpload").click()}
        />
        <Upload
          customRequest={doUpload}
          key={Math.random()}
          accept=".jpg,.png"
          showUploadList={false}
        //   autoUpload={false}
          // onChange={this.fileChange}
        >
          <div className={cx(styles["upload-btn-text"])} id="myUpload">
            <span>Upload files</span>
          </div>
        </Upload>
        <div className={cx(styles["upload-tips"])}>
          <span>Format: JPG or PNG Max size of 1MB</span>
        </div>
      </div>
    </>
  );
}
