import React from "react";
import PropTypes from "prop-types";

import Sidebar from "metabase/dashboard/components/Sidebar";
import { Button, Switch, Form, Radio } from "@arco-design/web-react";
import cx from "classnames";
import { t } from "ttag";
import Text from "../../../visualizations/visualizations/Text/Text";
import { newDashboardConfigTmpl } from "../../actions";
import Media from "../../../visualizations/visualizations/Media/Media";
import styles from "./Style.less";
import { IconClose } from "@arco-design/web-react/icon";

export class NewCardEditorSidebar extends React.Component {
  constructor(props) {
    super(props);
    //this.props = props;

    NewCardEditorSidebar.propTypes = {
      sidebar: PropTypes.object,
      onUpdateDashCardVisualizationSettings: PropTypes.func,
    };
  }

  render() {
    const { action } = this.props.sidebar.props.params;
    const series =
      action === "add"
        ? [newDashboardConfigTmpl(this.props.sidebar.props.params.type)]
        : this.props.sidebar.props.params.series;
    let settings = series[0].card.visualization_settings;
    let type = this.props.sidebar.props.params.type;
    if (type === "media") {
      type = settings.type;
    }
    const componentAdapter = {
      text: {
        contentKey: "text",
        render: props => <Text {...props} />,
        uiSettings: { ...Text.settings },
      },
      image: {
        contentKey: "url",
        render: props => <Media {...props} />,
        uiSettings: { ...Media.settings },
      },
      video: {
        contentKey: "url",
        render: props => <Media {...props} />,
        uiSettings: { ...Media.settings },
      },
    }[type];
    const title =
      (action === "add" ? "Add" : "Edit") +
      " " +
      (type[0].toUpperCase() + type.substring(1));

    if (action === "add") {
      Object.keys(componentAdapter.uiSettings).forEach(key => {
        if (componentAdapter.uiSettings[key].default) {
          settings[key] = componentAdapter.uiSettings[key].default;
        }
      });
    }

    const onUpdateVisualizationSettings = ({ text, url }) => {
      /// console.info("editing.." + (url || text));
      settings[componentAdapter.contentKey] = url || text || "";
    };

    const handleCancel = () => this.props.closeSidebar();
    const done = () => {
      // '[{"card":{"query_average_duration":null,"name":null,"display":"text","visualization_settings":{},"dataset_query":{},"archived":false}}]'
      // '[{"card":{"query_average_duration":null,"name":null,"display":"media","visualization_settings":{},"dataset_query":{},"archived":false}}]'
      if (action === "add") {
        this.props.doSave(series[0]);
      } else {
        this.props.onUpdateDashCardVisualizationSettings(
          this.props.sidebar.props.params.dashcardId,
          settings,
        );
        // this.props.sidebar.props.onReplaceAllVisualizationSettings(
        //   this.props.sidebar.props.params.dashcardId,
        //   settings,
        // );
      }
      this.props.closeSidebar();
    };

    const Component = props => componentAdapter.render(props);

    const Settings = props => {
      const settingsUiConfigs = componentAdapter.uiSettings;
      return (
        <div className={styles["my-settings"]}>
          {Object.keys(settingsUiConfigs)
            .filter(name => settingsUiConfigs[name].widget)
            .map(name => {
              const conf = settingsUiConfigs[name];
              const { widget, title, props } = conf;
              if (widget === "toggle") {
                return (
                  <div className={cx("flex", styles["my-settings-row"])} key={name}>
                    <label style={{ paddingTop: 0 }}>{title} </label>
                    <Switch
                      className="ml-auto"
                      defaultChecked={settings[name]}
                      onChange={v => (settings[name] = v)}
                    />
                  </div>
                );
              } else if (widget === "radio") {
                return (
                  <div className={styles["my-settings-row"]} key={name}>
                    <label>{title} </label>
                    <Radio.Group
                      defaultValue={settings[name]}
                      onChange={v => console.info((settings[name] = v))}
                    >
                      {props.options.map(({ name, value }) => (
                        <Radio value={value} key={name}>
                          {name}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </div>
                );
              }
              return <></>;
            })}
        </div>
      );
    };

    return (
      <Sidebar>
        <div
          className={cx(
            "flex align-center border-bottom",
            styles["sidebar-title-wrap"],
          )}
        >
          <h5 className={cx(styles["sidebar-title"])}>{title}</h5>
          <IconClose
            className={cx("ml-auto", styles["sidebar-title-x"])}
            onClick={() => handleCancel()}
          />
        </div>
        <div
          className={cx(
            "flex flex-column flex-auto overflow-y-auto",
            styles["content"],
          )}
        >
          <Settings />
          <Component
            series={series}
            settings={settings}
            onUpdateVisualizationSettings={onUpdateVisualizationSettings}
            isEditing={true}
            isSettings={true}
          />
        </div>
        <div
          className="flex align-center border-top justify-end"
          style={{
            paddingTop: 12,
            paddingBottom: 12,
            paddingRight: 32,
            paddingLeft: 32,
          }}
        >
          <Button onClick={handleCancel}>{t`Cancel`}</Button>
          <Button
            type="primary"
            style={{
              marginLeft: 12,
            }}
            onClick={done}
          >{t`Done`}</Button>
        </div>
      </Sidebar>
    );
  }
}
