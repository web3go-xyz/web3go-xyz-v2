import React, {
  useState,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { t } from "ttag";
import cx from "classnames";

import { useOnMount } from "metabase/hooks/use-on-mount";

import { getScrollY } from "metabase/lib/dom";
import { Dashboard } from "metabase-types/api";

import EditBar from "metabase/components/EditBar";
import EditWarning from "metabase/components/EditWarning";
import HeaderModal from "metabase/components/HeaderModal";
import { Button, Modal, Upload, Message } from '@arco-design/web-react';
import { WEB3GO_BASE_URL } from '@/services'
import { LayoutDashboardApi } from "../../services";

import {
  HeaderRoot,
  HeaderBadges,
  HeaderContent,
  HeaderButtonsContainer,
  HeaderButtonSection,
  HeaderLastEditInfoLabel,
  HeaderCaption,
  HeaderCaptionContainer,
} from "./DashboardHeader.styled";

interface DashboardHeaderProps {
  editingTitle: string;
  editingSubtitle: string;
  editingButtons: JSX.Element[];
  editWarning: string;
  headerButtons: React.ReactNode[];
  headerClassName: string;
  headerModalMessage: string;
  isEditing: boolean;
  isEditingInfo: boolean;
  isNavBarOpen: boolean;
  dashboard: Dashboard;
  isBadgeVisible: boolean;
  isLastEditInfoVisible: boolean;
  children: React.ReactNode;
  onHeaderModalDone: () => null;
  onHeaderModalCancel: () => null;
  onLastEditInfoClick: () => null;
  onSave: () => null;
  setDashboardAttribute: (prop: string, value: string) => null;
}

const DashboardHeader = ({
  editingTitle = "",
  editingSubtitle = "",
  editingButtons = [],
  editWarning,
  headerButtons = [],
  headerClassName = "py1 lg-py2 xl-py3 wrapper",
  headerModalMessage,
  isEditing,
  isNavBarOpen,
  dashboard,
  isLastEditInfoVisible,
  children,
  onHeaderModalDone,
  onHeaderModalCancel,
  onLastEditInfoClick,
  onSave,
  setDashboardAttribute,
}: DashboardHeaderProps) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showSubHeader, setShowSubHeader] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const header = useRef<HTMLDivElement>(null);
  const isModalOpened = headerModalMessage != null;
  const uploadRef = useRef(null);
  const [previewImg, setPreviewImg] = useState<any>('');
  const [previewBlob, setPreviewBlob] = useState<any>(null);

  useLayoutEffect(() => {
    if (isModalOpened) {
      const headerRect = header.current?.getBoundingClientRect();
      if (headerRect) {
        const headerHeight = headerRect.top + getScrollY();
        setHeaderHeight(headerHeight);
      }
    }
  }, [isModalOpened]);

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append('file', previewBlob);
    await LayoutDashboardApi.previewUrl(dashboard.id)(formData, { isUpload: true })
    Message.success('Upload success');
    setPreviewVisible(false);
  };

  const onChange = (files) => {
    const isLt1M = files[files.length - 1].originFile.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      Message.error('Max size is 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(files[files.length - 1].originFile);
    setPreviewBlob(files[files.length - 1].originFile);
  };
  const openUploadModal = () => {
    setPreviewVisible(true);
    setPreviewImg('');
    setPreviewBlob(null);
  }
  const _headerButtons = useMemo(
    () => (
      <HeaderButtonSection
        className="Header-buttonSection"
        isNavBarOpen={isNavBarOpen}
      >
        <Button type='primary' style={{ marginRight: 20 }} onClick={() => { openUploadModal() }}>Set Preview</Button>

        {headerButtons}
      </HeaderButtonSection>
    ),
    [headerButtons, isNavBarOpen],
  );

  const handleUpdateCaption = useCallback(
    async (name: string) => {
      await setDashboardAttribute("name", name);
      if (!isEditing) {
        await onSave();
      }
    },
    [setDashboardAttribute, onSave, isEditing],
  );

  useOnMount(() => {
    const timerId = setTimeout(() => {
      setShowSubHeader(false);
    }, 4000);
    return () => clearTimeout(timerId);
  });
  return (
    <div>
      {isEditing && (
        <EditBar
          title={editingTitle}
          subtitle={editingSubtitle}
          buttons={editingButtons}
        />
      )}
      {editWarning && <EditWarning title={editWarning} />}
      <HeaderModal
        isOpen={!!headerModalMessage}
        height={headerHeight}
        title={headerModalMessage}
        onDone={onHeaderModalDone}
        onCancel={onHeaderModalCancel}
      />
      <HeaderRoot
        isNavBarOpen={isNavBarOpen}
        className={cx("QueryBuilder-section", headerClassName)}
        ref={header}
      >
        <HeaderContent showSubHeader={showSubHeader}>
          <HeaderCaptionContainer>
            <HeaderCaption
              key={dashboard.name}
              initialValue={dashboard.name}
              placeholder={t`Add title`}
              isDisabled={!dashboard.can_write}
              data-testid="dashboard-name-heading"
              onChange={handleUpdateCaption}
            />
          </HeaderCaptionContainer>
          <HeaderBadges>
            {isLastEditInfoVisible && (
              <HeaderLastEditInfoLabel
                item={dashboard}
                onClick={onLastEditInfoClick}
                className=""
              />
            )}
          </HeaderBadges>
        </HeaderContent>

        <HeaderButtonsContainer isNavBarOpen={isNavBarOpen}>
          {_headerButtons}
        </HeaderButtonsContainer>
      </HeaderRoot>
      {children}
      <Modal
        title='Set Preview'
        style={{ width: 800 }}
        visible={previewVisible}
        footer={null}
        unmountOnExit
        onOk={() => setPreviewVisible(false)}
        onCancel={() => setPreviewVisible(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Upload
            ref={uploadRef}
            accept='.jpg,.png'
            autoUpload={false}
            action='/'
            onChange={onChange}
            showUploadList={false}
          >
            <div>
              <Button style={{ marginRight: 20 }}>Select image</Button>
            </div>
          </Upload>
          <span>(suggest size: 1200 x 630)</span>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, }}>
          <img src={previewImg} alt="" style={{ maxWidth: '100%' }} />
        </div>
        {
          previewImg && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Button
                type='primary'
                onClick={(e) => {
                  onSubmit();
                }}
              >
                upload
              </Button>
            </div>
          )
        }

      </Modal>
    </div>
  );
};

export default DashboardHeader;
