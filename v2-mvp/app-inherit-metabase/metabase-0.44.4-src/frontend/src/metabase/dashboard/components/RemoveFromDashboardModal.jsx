import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import * as MetabaseAnalytics from "metabase/lib/analytics";

import Button from "metabase/core/components/Button";
import ModalContent from "metabase/components/ModalContent";

export default class RemoveFromDashboardModal extends Component {
  static propTypes = {
    dashcard: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    removeCardFromDashboard: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  onRemove() {
    this.props.removeCardFromDashboard({
      dashId: this.props.dashboard.id,
      dashcardId: this.props.dashcard.id,
    });
    this.props.onClose();

    MetabaseAnalytics.trackStructEvent("Dashboard", "Remove Card");
  }

  render() {
    const { onClose, dashcard } = this.props;
    let type;
    if (dashcard.visualization_settings.virtual_card) {
      try {
        type = dashcard.visualization_settings.virtual_card.display;
        if (type === 'media') {
          type = dashcard.visualization_settings.type;
        }
      } catch(e) {};
    }
    
    if (type === "media") {
      type = settings.type;
    }
    type = type || 'question';
    const text = {
      text: 'Remove this text box?',
      video: 'Remove this video?',
      image: 'Remove this image?',
      question: 'Remove this chart?'
    }[type];
    return (
      <ModalContent title={t`${text}`} onClose={() => onClose()}>
        <div className="flex-align-right">
          <Button onClick={onClose}>{t`Cancel`}</Button>
          <Button danger ml={2} onClick={() => this.onRemove()}>
            {t`Remove`}
          </Button>
        </div>
      </ModalContent>
    );
  }
}
