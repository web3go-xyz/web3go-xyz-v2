import React from "react";
import PropTypes from "prop-types";

import Sidebar from "metabase/dashboard/components/Sidebar";
import { Button, Switch, Form, Radio, Drawer, Spin } from "@arco-design/web-react";
import cx from "classnames";
import { t } from "ttag";
import Text from "../../../visualizations/visualizations/Text/Text";
import { newDashboardConfigTmpl } from "../../actions";
import Media from "../../../visualizations/visualizations/Media/Media";
import styles from "./Style.less";
import { IconClose } from "@arco-design/web-react/icon";
import CommonDrawer  from "../../../web3goLayout/components/CommonDrawer";
// import CommonDrawer from "@/web3goLayout/components/CommonDrawer";

export class NewCardEditorSidebar extends React.Component {
  constructor(props) {
    super(props);
    //this.props = props;

    this.state = {
      //show: -1,
      sidebar: null,
      // saveLoading: false,
      // : null,
    };

    NewCardEditorSidebar.propTypes = {
      sidebar: PropTypes.object,
      onUpdateDashCardVisualizationSettings: PropTypes.func,
    };

    this.drawerComponentRef = null;

    this.imageComponentRef = React.createRef();
  }

  doShow(sidebar) {
    this.setState({
      //show: true,
      sidebar
    })
  }

  render() {
    if (!this.props.sidebar && !this.state.sidebar) {
      return null;
    }
    const rawData =  this.state.sidebar? this.state.sidebar.params : this.props.sidebar.props.params;
    const { action, vanillaMode } = rawData;
    // debugger;
    // if (preload === true) {
    //   return <></>;
    // }

    const handleCancel = () => {
      console.info('.....')
      if (this.state.sidebar) {
        this.setState({sidebar: null});
      } else if (this.props.closeSidebar) {
        this.props.closeSidebar();
      }
    }
    let setDrawerLoadingStatus = null;
    const done = () => {
      // '[{"card":{"query_average_duration":null,"name":null,"display":"text","visualization_settings":{},"dataset_query":{},"archived":false}}]'
      // '[{"card":{"query_average_duration":null,"name":null,"display":"media","visualization_settings":{},"dataset_query":{},"archived":false}}]'
      const proxy = () => {
        if (action === "add") {
          if (this.props.doSave) { // legacy ui
            this.props.doSave(series[0]);
          } else { // new ui
            this.props.addDashCardToDashboard({
                  dashId: rawData.dashboardId,
                  dashcardOverrides: series[0],
            });
          }
        } else {
          console.info(settings);
          this.props.onUpdateDashCardVisualizationSettings(
            this.props.sidebar.props.params.dashcardId,
            settings,
          );
          // this.props.sidebar.props.onReplaceAllVisualizationSettings(
          //   this.props.sidebar.props.params.dashcardId,
          //   settings,
          // );
        }
        handleCancel();
      };
      if (
        this.imageComponentRef &&
        this.imageComponentRef.current &&
        this.imageComponentRef.current.done
      ) {
        const setSaveStatus = status =>
        setDrawerLoadingStatus && setDrawerLoadingStatus(status || false );
        this.imageComponentRef.current.done({ setSaveStatus }).then(status => {
          if (status) {
            proxy();
          }
        });
      } else {
        proxy();
      }
    };

    const StyleComponent = props => {
      if (vanillaMode) {
        return (
          <Sidebar className={cx(styles["vanilla-wrap"])}>
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
            <React.Fragment {...props} />
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
      return (
        <CommonDrawer
          className={cx(styles["new-wrap"])}
          visible={true}
          title={title}
          onOk={done}
          onCancel={handleCancel}
          doMount={ ({setLoadingStatus}) => {
            // this.setState({drawerComponentRef});
            setDrawerLoadingStatus = setLoadingStatus;
          }}
          // saveLoading={this.state.saveLoading}
          {...props}
        ></CommonDrawer>
      );
    };

    const series =
      action === "add"
        ? [newDashboardConfigTmpl(rawData.type)]
        : rawData.series;
    let settings = series[0].card.visualization_settings;
    let type = rawData.type;
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
        render: props => <Media {...props} ref={this.imageComponentRef} />,
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
    
    // let isPreload = false;
    // if (!vanillaMode && !window.FIRST_NEW_CARD_SHOW) {
    //   window.FIRST_NEW_CARD_SHOW = true;
    //   isPreload = true;
    //   // return (
    //   //   <StyleComponent>
    //   //   <Spin loading={true}></Spin>
    //   //   </StyleComponent>
    //   // )
    // } else {
    //   window.FIRST_NEW_CARD_SHOW = true;
    // }

    // if (!vanillaMode && typeof window.FIRST_NEW_CARD_SHOW === 'undefined') {
    //   window.FIRST_NEW_CARD_SHOW = true;
    //   return null;
    // } else if (window.FIRST_NEW_CARD_SHOW === true){
    //   window.FIRST_NEW_CARD_SHOW = false;
    //   return null;
    // } else {
    //   window.FIRST_NEW_CARD_SHOW = false;
    // }


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
                  <div
                    className={cx("flex", styles["my-settings-row"])}
                    key={name}
                  >
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
      <StyleComponent>
        <div
          className={cx(
            "flex flex-column flex-auto overflow-y-auto",
            styles[vanillaMode ? "vanilla-wrap-content" : "new-wrap-content"],
          )}
        >
          {/* <Spin loading={isPreload}> */}
          <Settings />
          <Component
            series={series}
            settings={settings}
            onUpdateVisualizationSettings={onUpdateVisualizationSettings}
            isEditing={true}
            isSettings={true}
          />
          {/* </Spin> */}
        </div>
      </StyleComponent>
    );
  }
}
