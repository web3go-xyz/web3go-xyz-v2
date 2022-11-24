import React, { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { IconDown, IconMoreVertical } from '@arco-design/web-react/icon';
import { Button, AutoComplete, Menu, Dropdown, Modal } from '@arco-design/web-react';
import { iconPropTypes } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import Ellipsified from "metabase/core/components/Ellipsified";
import LegendActions from "./LegendActions";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import ChartInfoModal from "./ChartInfoModal";
import DownloadModal from "./DownloadModal";
import DuplicateModal from "./DuplicateModal";
import event from '@/web3goLayout/event';
import {
  getCardData,
} from "metabase/dashboard/selectors";

import {
  LegendCaptionRoot,
  LegendDescriptionIcon,
  LegendLabel,
  LegendLabelIcon,
  OperationWrap
} from "./LegendCaption.styled";
import { relativeTimeRounding } from "moment";
const mapStateToProps = (state, props) => {
  return {
    dashcardData: getCardData(state, props),
    currentUser: state.currentUser,
    isDark: state.app.isDark,
    route: state.routing.locationBeforeTransitions,
  }
};
const mapDispatchToProps = {
  push,
};

const propTypes = {
  dashcard: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.shape(iconPropTypes),
  actionButtons: PropTypes.node,
  onSelectTitle: PropTypes.func,
};

let ChartInfoModalRef;
let DuplicateModalRef;
let DownloadModalRef;
const LegendCaption = ({
  dashcardData,
  dashcard,
  route,
  className,
  title,
  description,
  icon,
  actionButtons,
  onSelectTitle,
}) => {
  const cardData = useMemo(() => {
    if (!dashcardData[dashcard.id] || !dashcardData[dashcard.id][dashcard.card_id]) {
      return {}
    }
    return dashcardData[dashcard.id][dashcard.card_id].data;
  }, [dashcard, dashcardData])
  const operationList = [{
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.024 7.35696L8.00066 10.3806L4.97666 7.35696M13.3333 11.6666V13.6666H2.66666V11.6666M8 1.66663V10.3333" stroke="#6B7785" strokeWidth="1.33333" />
    </svg>,
    name: 'Download'
  },
  //  {
  //   icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  //     <path d="M8 3.05L11.5875 4.25L8 5.45L4.4125 4.25L8 3.05ZM8 2L2 4V4.5L8 6.5L14 4.5V4L8 2ZM8 7.83731L5.5 7.02481L3 6.21231H2V6.9625L8 8.9625L14 6.9625V6.21231H13L8 7.83731ZM8 10.3557L3 8.73068H2V9.5L8 11.5L14 9.5V8.73068H13L8 10.3557ZM8 12.8593L3 11.2343H2L2 12L8 14L14 12V11.2343H13L8 12.8593Z" fill="#6B7785" />
  //   </svg>,
  //   name: 'Dataset'
  // },
  {
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.66666 2H12.6667C12.8435 2 13.013 2.07024 13.1381 2.19526C13.2631 2.32029 13.3333 2.48986 13.3333 2.66667V10" stroke="#6B7785" strokeWidth="1.33333" />
      <path d="M2.66667 13.3333V5.33329C2.66667 5.15648 2.7369 4.98691 2.86193 4.86189C2.98695 4.73686 3.15652 4.66663 3.33333 4.66663H10C10.3683 4.66663 10.6667 4.96396 10.6667 5.33229V13.336C10.6668 13.4233 10.6496 13.5098 10.6161 13.5906C10.5827 13.6713 10.5336 13.7446 10.4718 13.8063C10.4099 13.868 10.3365 13.9168 10.2557 13.9501C10.1749 13.9833 10.0884 14.0003 10.001 14H3.332C3.24451 14 3.15789 13.9827 3.07708 13.9492C2.99627 13.9157 2.92286 13.8665 2.86106 13.8046C2.79927 13.7427 2.75029 13.6692 2.71693 13.5883C2.68357 13.5074 2.66649 13.4208 2.66667 13.3333V13.3333Z" stroke="#6B7785" strokeWidth="1.33333" />
    </svg>,
    name: 'Duplicate'
  }]
  if (description) {
    operationList.push({
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 6.66667V11.3333M8 6V4.66667M14 8C14 11.3137 11.3137 14 8 14C4.68633 14 2 11.3137 2 8C2 4.68633 4.68633 2 8 2C11.3137 2 14 4.68633 14 8Z" stroke="#6B7785" strokeWidth="1.33" />
      </svg>,
      name: 'Chart Info'
    });
  }
  const clickDropdownIcon = (key) => {
    if (key == 'Chart Info') {
      ChartInfoModalRef.init(description);
    } else if (key == 'Duplicate') {
      DuplicateModalRef.init(description);
    } else if (key == 'Download') {
      DownloadModalRef.init(cardData);
    }
  }
  let titleOperation = null;
  // description 不为undefined说明图表已加载完 
  if (route.pathname.includes('/layout/dashboardDetail/') && description !== undefined) {
    titleOperation = (
      <div className="dropdown-wrap">
        <Dropdown trigger='click' position="bottom" droplist={
          <Menu className="web3go-layout-myspace-dashboardlist-menu" onClickMenuItem={(key) => { clickDropdownIcon(key) }}>
            {operationList.map((v) => (
              <Menu.Item key={v.name}>
                {v.icon}
                <span>
                  {v.name}
                </span>
              </Menu.Item>
            ))}
          </Menu>
        }>
          <OperationWrap className="operation-wrap">
            <IconMoreVertical></IconMoreVertical>
          </OperationWrap>
        </Dropdown>
      </div>
    );
  }
  return (
    <LegendCaptionRoot className={className} data-testid="legend-caption">
      {titleOperation}
      {icon && <LegendLabelIcon {...icon} />}
      <LegendLabel
        className="fullscreen-normal-text fullscreen-night-text"
        onClick={onSelectTitle}
      >
        <Ellipsified>{title}</Ellipsified>
      </LegendLabel>
      {/* {description && (
        <Tooltip tooltip={description} maxWidth="22em">
          <LegendDescriptionIcon className="hover-child" />
        </Tooltip>
      )} */}
      {actionButtons && <LegendActions>{actionButtons}</LegendActions>}
      <ChartInfoModal onRef={(ref) => ChartInfoModalRef = ref} ></ChartInfoModal>
      <DuplicateModal onRef={(ref) => DuplicateModalRef = ref} ></DuplicateModal>
      <DownloadModal onRef={(ref) => DownloadModalRef = ref} ></DownloadModal>

    </LegendCaptionRoot>
  );
};

LegendCaption.propTypes = propTypes;

// export default LegendCaption;
export default connect(mapStateToProps, mapDispatchToProps)(LegendCaption);
