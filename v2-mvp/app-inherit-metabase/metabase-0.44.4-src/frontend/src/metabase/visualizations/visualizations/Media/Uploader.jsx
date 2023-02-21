/* eslint-disable react/prop-types */
import React, { useState } from "react";

import cx from "classnames";
import styles from "./Style.less";
import { Button, Upload, Message } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { LayoutDashboardApi } from "../../../services";
import PropTypes from "prop-types";

export default function Uploader(props) {

  Uploader.propTypes = {
    doMount: PropTypes.func
  }
  let [file, setFile] = useState();
  let [fileBlob, setFileBlob] = useState();
  const uploadRef = React.useRef();

  const doBeforeUpload = event => {
    const f = event.target.files[0];
    event.target.value = null;

    const { size, type } = f;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowExtensions = ["image/png", "image/jpeg", "image/jpg"];
    if (size > maxSize) {
      return Message.error("File is oversized!") && false;
    }
    if (allowExtensions.indexOf(type) < 0) {
      return Message.error("Not supported file format!") && false;
    }
    setFile(f);
    toLoadPreviewFile(f);
    return false;
  };

  const doUpload = option => {
    const formData = new FormData();
    formData.append("file", option.file);

    return LayoutDashboardApi.uploadPublicImg(formData, {
      isUpload: true,
    }).then(resp => {
      props.onUploadSuccess(resp);
    });
  };

  const doSync = async () => {
    if (!file) {
      return false;
    }
    await doUpload({ file });
    return true;
  };
  props.doMount && props.doMount({ doSync });

  const toLoadPreviewFile = file => {
    if (!file) {
      return null;
    }
    var reader = new FileReader();
    reader.onload = () => {
      setFileBlob(reader.result);
      props.updateEditStatus(false);
    };
    reader.readAsDataURL(file);
  };
  const letsUpload = () => {
    uploadRef.current.click();
  };
  const clearUpload = () => {
    setFileBlob(null);
    setFile(null);
    props.updateEditStatus(true);
    props.onUploadSuccess('');
  };
  const onPreviewImgLoadError = (e)=> {
    console.info(e);
  }

  const Component = () => {
    console.info('.........')
    return fileBlob || props.url ? (
      <>
        <div
          className={cx(styles["upload-wrap"], styles["upload-wrap-preview"])}
        >
          <img src={file ? fileBlob : props.url} onError={ (e) => e.target.style.display='none' } styles={ {display: ''}} />
        </div>
        <div className={cx(styles["upload-preview-actions"])}>
          <a onClick={letsUpload}>Reupload</a> |{" "}
          <a onClick={clearUpload}>Delete</a>
        </div>
      </>
    ) : (
      <div className={cx(styles["upload-wrap"])} onClick={() => letsUpload()}>
        <Button
          size="large"
          shape="circle"
          type="primary"
          icon={<IconPlus />}
        />
        <div className={cx(styles["upload-btn-text"])} id="myUpload">
          <span>Upload files</span>
        </div>
        <div className={cx(styles["upload-tips"])}>
          <span>Format: JPG or PNG Max size of 10MB</span>
        </div>
      </div>
    );
  };
  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
        ref={uploadRef}
        onChange={doBeforeUpload}
      />
      <Component />
    </>
  );
}
