/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ParameterValueWidget from "./ParameterValueWidget";
import Icon from "metabase/components/Icon";
import { color } from "metabase/lib/colors";
import { IconSettings, IconMinusCircle } from '@arco-design/web-react/icon';
import S from "./ParameterWidget.css";
import cx from "classnames";

import FieldSet from "../../components/FieldSet";
import { flex } from "styled-system";
import * as dashboardActions from "@/dashboard/actions";

const mapDispatchToProps = {
  ...dashboardActions,
};
class ParameterWidget extends Component {
  state = {
    isEditingName: false,
    editingNameValue: undefined,
    isFocused: false,
  };

  static propTypes = {
    parameter: PropTypes.object,
    commitImmediately: PropTypes.bool,
  };

  static defaultProps = {
    parameter: null,
    commitImmediately: false,
  };

  renderPopover(value, setValue, placeholder, isFullscreen) {
    const {
      dashboard,
      parameter,
      editingParameter,
      commitImmediately,
      parameters,
    } = this.props;

    const isEditingParameter = editingParameter?.id === parameter.id;

    return (
      <ParameterValueWidget
        parameter={parameter}
        parameters={parameters}
        dashboard={dashboard}
        name={name}
        value={value}
        setValue={setValue}
        isEditing={isEditingParameter}
        placeholder={placeholder}
        focusChanged={this.focusChanged}
        isFullscreen={isFullscreen}
        commitImmediately={commitImmediately}
      />
    );
  }

  focusChanged = isFocused => {
    this.setState({ isFocused });
  };

  render() {
    const {
      className,
      parameter,
      isEditing,
      isFullscreen,
      editingParameter,
      setEditingParameter,
      setValue,
      children,
      dragHandle,
    } = this.props;

    const isEditingParameter =
      editingParameter && editingParameter.id === parameter.id;

    const renderFieldInNormalMode = () => {
      const fieldHasValueOrFocus =
        parameter.value != null || this.state.isFocused;
      const legend = fieldHasValueOrFocus ? parameter.name : "";

      return (
        <FieldSet
          legend={legend}
          noPadding={true}
          className={cx(className, S.container, {
            "border-brand": fieldHasValueOrFocus,
          })}
        >
          {this.renderPopover(
            parameter.value,
            value => setValue(value),
            parameter.name,
            isFullscreen,
          )}
          {children}
        </FieldSet>
      );
    };

    const renderEditing = () => (
      <div
        className={cx(
          className,
          // "flex align-center bordered rounded cursor-pointer text-bold mr1 mb1",
          "flex align-center bordered rounded cursor-pointer mr1 mb1 bg-white text-brand-hover",
          {
            // "bg-brand text-white": isEditingParameter,
            // "text-brand-hover bg-white": !isEditingParameter,
          },
        )}

        style={{
          padding: '5px 8px',
          width: 200,
          borderColor: '#E5E6E8',
          color: '#6B7785',
          fontSize: 14,
          justifyContent: 'space-between'
          // borderColor: isEditingParameter && color("brand"),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="mr1" onClick={e => e.stopPropagation()}>
            {dragHandle}
          </div>
          {parameter.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconSettings className="hover-item" onClick={() => {
            setEditingParameter(isEditingParameter ? null : parameter.id)
          }} />
          <IconMinusCircle className="hover-item" style={{ marginLeft: 4 }} onClick={() => {
            this.props.closeSidebar();
            this.props.removeParameter(parameter.id);
          }} />
        </div>
      </div>
    );

    if (isFullscreen) {
      if (parameter.value != null) {
        return (
          <div style={{ fontSize: "0.833em" }}>{renderFieldInNormalMode()}</div>
        );
      } else {
        return <span className="hide" />;
      }
    } else if (isEditing && setEditingParameter) {
      return renderEditing();
    } else {
      return renderFieldInNormalMode();
    }
  }
}
export default connect(null, mapDispatchToProps)(ParameterWidget);