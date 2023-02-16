/* eslint-disable react/prop-types */
import React from "react";

import cx from "classnames";
import styles from "./Style.less";
import { Button, Upload, Message } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { LayoutDashboardApi } from "../../../services";

export default function Uploader(props) {
  const doValidate = async (file) => {
    const {size, type} = file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowExtensions = ["image/png", "image/jpeg", "image/jpg"];
    if (size > maxSize) {
      return Message.error('File is oversized!') && false;
    }
    if (allowExtensions.indexOf(type) < 0) {
      return Message.error('Not supported file format!') && false;
    }
    return true;
  };
  const doUpload = option => {
    const formData = new FormData();
    formData.append("file", option.file);

    LayoutDashboardApi.uploadPublicImg(formData, { isUpload: true }).then(
      resp => {
        props.onUploadSuccess(resp);
      },
    );
  };
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
          beforeUpload={doValidate}
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
          <span>Format: JPG or PNG Max size of 10MB</span>
        </div>
      </div>
    </>
  );
}
