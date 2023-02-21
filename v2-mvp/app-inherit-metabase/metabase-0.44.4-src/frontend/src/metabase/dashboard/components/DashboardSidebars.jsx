import React, { useCallback } from "react";
import PropTypes from "prop-types";
import _ from "underscore";

import { SIDEBAR_NAME } from "metabase/dashboard/constants";

import ClickBehaviorSidebar from "./ClickBehaviorSidebar";
import DashboardInfoSidebar from "./DashboardInfoSidebar";
import ParameterSidebar from "metabase/parameters/components/ParameterSidebar";
import SharingSidebar from "metabase/sharing/components/SharingSidebar";
import { AddCardSidebar } from "./add-card-sidebar/AddCardSidebar";

import * as MetabaseAnalytics from "metabase/lib/analytics";
import { NewCardEditorSidebar } from "./new-card-editor-sidebar/NewCardEditorSidebar";
import BlankDrawer from "../../web3goLayout/components/BlankDrawer";

DashboardSidebars.propTypes = {
  dashboard: PropTypes.object,
  parameters: PropTypes.array,
  showAddParameterPopover: PropTypes.func.isRequired,
  removeParameter: PropTypes.func.isRequired,
  addCardToDashboard: PropTypes.func.isRequired,
  addDashCardToDashboard: PropTypes.func.isRequired,
  editingParameter: PropTypes.object,
  isEditingParameter: PropTypes.bool.isRequired,
  showAddQuestionSidebar: PropTypes.bool.isRequired,
  clickBehaviorSidebarDashcard: PropTypes.object, // only defined when click-behavior sidebar is open
  onReplaceAllDashCardVisualizationSettings: PropTypes.func.isRequired,
  onUpdateDashCardVisualizationSettings: PropTypes.func.isRequired,
  onUpdateDashCardColumnSettings: PropTypes.func.isRequired,
  setEditingParameter: PropTypes.func.isRequired,
  setParameter: PropTypes.func.isRequired,
  setParameterName: PropTypes.func.isRequired,
  setParameterDefaultValue: PropTypes.func.isRequired,
  dashcardData: PropTypes.object,
  setParameterFilteringParameters: PropTypes.func.isRequired,
  isSharing: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  params: PropTypes.object,
  sidebar: PropTypes.shape({
    name: PropTypes.string,
    props: PropTypes.object,
  }).isRequired,
  closeSidebar: PropTypes.func.isRequired,
  setDashboardAttribute: PropTypes.func,
  saveDashboardAndCards: PropTypes.func,
};

export function DashboardSidebars({
  dashboard,
  parameters,
  showAddParameterPopover,
  removeParameter,
  addCardToDashboard,
  addDashCardToDashboard,
  editingParameter,
  isEditingParameter,
  showAddQuestionSidebar,
  clickBehaviorSidebarDashcard,
  onReplaceAllDashCardVisualizationSettings,
  onUpdateDashCardVisualizationSettings,
  onUpdateDashCardColumnSettings,
  setEditingParameter,
  setParameter,
  setParameterName,
  setParameterDefaultValue,
  dashcardData,
  setParameterFilteringParameters,
  isSharing,
  isEditing,
  isFullscreen,
  onCancel,
  params,
  sidebar,
  closeSidebar,
  setDashboardAttribute,
  saveDashboardAndCards,
}) {
  const handleAddCard = useCallback(
    cardId => {
      addCardToDashboard({
        dashId: dashboard.id,
        cardId: cardId,
      });
      MetabaseAnalytics.trackStructEvent("Dashboard", "Add Card");
    },
    [addCardToDashboard, dashboard.id],
  );

  const doNewCardEditorSave = useCallback(
    (dashcardOverrides) => {
      addDashCardToDashboard({
        dashId: dashboard.id,
        dashcardOverrides,
      });
      MetabaseAnalytics.trackStructEvent("Dashboard", "Add Card");
    },
    [addDashCardToDashboard, dashboard.id],
  );
  let modalContent;
  if (isFullscreen) {
    modalContent = null;
  }
  switch (sidebar.name) {
    // TODO ADD A TEXT
    case SIDEBAR_NAME.addQuestion:
      modalContent = (
        <AddCardSidebar
          initialCollection={dashboard.collection_id}
          onSelect={handleAddCard}
        />
      );
      break;
    case SIDEBAR_NAME.clickBehavior:
      modalContent = (
        <ClickBehaviorSidebar
          dashboard={dashboard}
          dashcard={clickBehaviorSidebarDashcard}
          parameters={parameters}
          dashcardData={dashcardData[clickBehaviorSidebarDashcard.id]}
          onUpdateDashCardVisualizationSettings={
            onUpdateDashCardVisualizationSettings
          }
          onUpdateDashCardColumnSettings={onUpdateDashCardColumnSettings}
          hideClickBehaviorSidebar={closeSidebar}
          onReplaceAllDashCardVisualizationSettings={
            onReplaceAllDashCardVisualizationSettings
          }
        />
      );
      break;
    case SIDEBAR_NAME.editParameter: {
      const { id: editingParameterId } = editingParameter || {};
      const [[parameter], otherParameters] = _.partition(
        parameters,
        p => p.id === editingParameterId,
      );
      if (location.pathname.includes('/layout')) {
        modalContent = null;
      } else {
        modalContent = (
          <ParameterSidebar
            parameter={parameter}
            otherParameters={otherParameters}
            remove={() => {
              closeSidebar();
              removeParameter(editingParameterId);
            }}
            done={() => closeSidebar()}
            showAddParameterPopover={showAddParameterPopover}
            setParameter={setParameter}
            setName={name => setParameterName(editingParameterId, name)}
            setDefaultValue={value =>
              setParameterDefaultValue(editingParameterId, value)
            }
            setFilteringParameters={ids =>
              setParameterFilteringParameters(editingParameterId, ids)
            }
          />
        );
      }
      break;
    }
    case SIDEBAR_NAME.sharing:
      modalContent = (
        <SharingSidebar
          dashboard={dashboard}
          params={params}
          onCancel={onCancel}
        />
      );
      break;
    case SIDEBAR_NAME.info:
      modalContent = (
        <aside data-testid="sidebar-right">
          <DashboardInfoSidebar
            dashboard={dashboard}
            saveDashboardAndCards={saveDashboardAndCards}
            setDashboardAttribute={setDashboardAttribute}
          />
        </aside>
      );
      break;
    case SIDEBAR_NAME.newCardEditor:
      modalContent = (
        <NewCardEditorSidebar
          sidebar={sidebar}
          // dashcardId={dashboard.collection_id}
          dashcardId={dashboard.id}
          doSave={doNewCardEditorSave}
          closeSidebar={closeSidebar}
          onUpdateDashCardVisualizationSettings={
            onUpdateDashCardVisualizationSettings
          }
        />

      );
      break;
    default:
      modalContent = null;
      break;
  }
  if (location.pathname.includes('/layout')) {
    return (
      <BlankDrawer
        visible={sidebar.name}
        onCancel={closeSidebar}
      >
        {modalContent}
      </BlankDrawer>
    )
  }
  return modalContent;
}
