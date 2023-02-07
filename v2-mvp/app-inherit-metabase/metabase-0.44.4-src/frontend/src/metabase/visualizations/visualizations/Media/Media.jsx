/* eslint-disable react/prop-types */
import React, { Component } from "react";
import remarkGfm from "remark-gfm";
import styles from "./Style.less";

import _ from "underscore";
import cx from "classnames";
import { t } from "ttag";

import { withInstanceLanguage, siteLocale } from "metabase/lib/i18n";

import { substitute_tags } from "cljs/metabase.shared.parameters.parameters";
import Uploader from "./Uploader";
import Input from "metabase/core/components/Input";
import { Image } from "@arco-design/web-react";
import ReactPlayer from "react-player/lazy";

const getSettingsStyle = settings => ({
  "align-center": settings["text.align_horizontal"] === "center",
  "align-end": settings["text.align_horizontal"] === "right",
  "justify-center": settings["text.align_vertical"] === "middle",
  "justify-end": settings["text.align_vertical"] === "bottom",
});

const REMARK_PLUGINS = [remarkGfm];

export default class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
    };
  }

  static uiName = "Media";
  static identifier = "media";
  // static iconName = "image";

  static disableSettingsConfig = false;
  static noHeader = true;
  static supportsSeries = false;
  static hidden = true;
  static supportPreviewing = false;
  static isOpen = true;

  static minSize = { width: 4, height: 1 };

  static checkRenderable() {
    // text can always be rendered, nothing needed here
  }

  static settings = {
    "card.title": {
      dashboard: false,
      default: t`Image card`,
    },
    "card.description": {
      dashboard: false,
    },
    url: {
      value: "",
      default: "",
    },
    "dashcard.background": {
      section: t`Display`,
      title: t`Show background`,
      dashboard: true,
      widget: "toggle",
      default: true,
    },
  };

  handleTextChange(url) {
    this.setState({url})
    this.props.onUpdateVisualizationSettings({ url });
  }

  componentDidMount() {
    this.setState({url: this.props.settings.url})
  }

  preventDragging = e => e.stopPropagation();
  handleImgClick = e => {
    const candinateEle = e.target.querySelector('img');
    candinateEle && candinateEle.click && candinateEle.click();
  }

  render() {
    const {
      className,
      dashboard,
      dashcard,
      gridSize,
      settings,
      isEditing,
      isSettings,
      isPreviewing,
      parameterValues,
    } = this.props;
    const isSingleRow = gridSize && gridSize.height === 1;

    let parametersByTag = {};
    if (dashcard && dashcard.parameter_mappings) {
      parametersByTag = dashcard.parameter_mappings.reduce((acc, mapping) => {
        const tagId = mapping.target[1];
        const parameter = dashboard.parameters.find(
          p => p.id === mapping.parameter_id,
        );
        if (parameter) {
          const parameterValue = parameterValues[parameter.id];
          return {
            ...acc,
            [tagId]: { ...parameter, value: parameterValue },
          };
        } else {
          return acc;
        }
      }, {});
    }

    let content = settings["url"];
    if (!_.isEmpty(parametersByTag)) {
      // Temporarily override language to use site language, so that all viewers of a dashboard see parameter values
      // translated the same way.
      content = withInstanceLanguage(() =>
        substitute_tags(content, parametersByTag, siteLocale()),
      );
    }
    const type =( this.props.card ? 
      this.props.card.visualization_settings.type : this.props.series[0].card.visualization_settings.type) ||
      this.props.series[0].visualization_settings.type
      ;

    const onUploadSuccess = (url) => {
      this.handleTextChange(url);
    }
    
    if (type === "image") {
      if (!isSettings) {
        return (
          <div
            className={cx(className, styles.Text, {
              [styles.padded]: !isEditing,
            })}
            onClick={this.handleImgClick}
          >
            {content ? (
              <Image src={this.state.url} loader={true} width={'100%'}/>
            ) : (
              <></>
            )}
          </div>
        );
      } else {
        return (
          <div
            className={cx(styles.Text, {
              [styles.padded]: !isEditing,
            })}
          >
            <>
              <Uploader onUploadSuccess={onUploadSuccess} />
              <div className={cx(styles["split-title"])}>
                Or put your image URL here
              </div>
              <Input
                className={cx(styles["my-input"])}
                fullWidth
                value={this.state.url}
                onChange={e => this.handleTextChange(e.target.value)}
                placeholder="e.g. https://example.com/image.png"
              />
            </>
          </div>
        );
      }
    } else if (type === "video") {
      if (!isSettings) {
        return (
          <div
            className={cx(className, styles.Text, {
              [styles.padded]: !isEditing,
            })}
            onMouseDown={this.preventDragging}
          >
            {content ? (
              <ReactPlayer url={this.state.url} width="100%" height="100%" />
            ) : (
              <></>
            )}
          </div>
        );
      } else {
        return (
          <div
            className={cx(styles.Text, {
              [styles.padded]: !isEditing,
            }, cx(styles["my-input"]))}
          >
            <>
              <textarea
                fullWidth
                value={this.state.url}
                placeholder="Type or paste video url here, only YouTube videos are supported now, e.g. https://www.youtube.com/watch?v=yL1o7axk1pg"
                onChange={e => this.handleTextChange(e.target.value)}
              />
            </>
          </div>
        );
      }
    } else throw new Error("future features");
  }
}
