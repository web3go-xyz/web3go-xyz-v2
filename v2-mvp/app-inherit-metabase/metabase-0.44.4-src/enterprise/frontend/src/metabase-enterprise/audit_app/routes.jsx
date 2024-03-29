import React from "react";

import { Route } from "metabase/hoc/Title";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import { createAdminRouteGuard } from "metabase/admin/utils";
import { IndexRoute, IndexRedirect } from "react-router";
import { t } from "ttag";
import _ from "underscore";

import AuditApp from "./containers/AuditApp";
import UnsubscribeUserModal from "./containers/UnsubscribeUserModal/UnsubscribeUserModal";

import AuditOverview from "./pages/AuditOverview";

import AuditDatabases from "./pages/AuditDatabases";
import AuditDatabaseDetail from "./pages/AuditDatabaseDetail";
import AuditSchemas from "./pages/AuditSchemas";
import AuditSchemaDetail from "./pages/AuditSchemaDetail";
import AuditTables from "./pages/AuditTables";
import AuditTableDetail from "./pages/AuditTableDetail";
import AuditQuestions from "./pages/AuditQuestions";
import AuditQuestionDetail from "./pages/AuditQuestionDetail";
import AuditDashboards from "./pages/AuditDashboards";
import AuditDashboardDetail from "./pages/AuditDashboardDetail";
import AuditQueryDetail from "./pages/AuditQueryDetail";
import AuditUsers from "./pages/AuditUsers";
import AuditUserDetail from "./pages/AuditUserDetail";
import AuditDownloads from "./pages/AuditDownloads";
import AuditSubscriptions from "./pages/AuditSubscriptions";

function getPageRoutes(path, page) {
  const subRoutes = [];
  // add a redirect for the default tab
  const defaultTab = getDefaultTab(page);
  if (defaultTab) {
    subRoutes.push(
      <IndexRedirect key={defaultTab.path} to={defaultTab.path} />,
    );
  }
  // add sub routes for each tab
  if (page.tabs) {
    subRoutes.push(
      ...page.tabs.map(tab => (
        <Route key={tab.path} path={tab.path} component={tab.component}>
          {tab.modals &&
            tab.modals.map(modal => (
              <ModalRoute
                key={modal.path}
                path={modal.path}
                modal={modal.modal}
              />
            ))}
        </Route>
      )),
    );
  }
  // if path is provided, use that, otherwise use an IndexRoute
  return path ? (
    <Route path={path} component={page}>
      {subRoutes}
    </Route>
  ) : (
    <IndexRoute component={page}>{subRoutes}</IndexRoute>
  );
}

function getDefaultTab(page) {
  // use the tab with "default = true" or the first
  return (
    _.findWhere(page.tabs, { default: true }) ||
    (page.tabs && page.tabs[0]) ||
    null
  );
}

const getRoutes = store => (
  <Route
    key="audit"
    path="audit"
    title={t`Audit`}
    component={createAdminRouteGuard("audit", AuditApp)}
  >
    {/* <IndexRedirect to="overview" /> */}
    <IndexRedirect to="members" />

    <Route path="overview" component={AuditOverview} />

    {getPageRoutes("databases", AuditDatabases)}
    {getPageRoutes("database/:databaseId", AuditDatabaseDetail)}
    {getPageRoutes("schemas", AuditSchemas)}
    {getPageRoutes("schema/:schemaId", AuditSchemaDetail)}
    {getPageRoutes("tables", AuditTables)}
    {getPageRoutes("table/:tableId", AuditTableDetail)}
    {getPageRoutes("dashboards", AuditDashboards)}
    {getPageRoutes("dashboard/:dashboardId", AuditDashboardDetail)}
    {getPageRoutes("questions", AuditQuestions)}
    {getPageRoutes("question/:questionId", AuditQuestionDetail)}
    {getPageRoutes("query/:queryHash", AuditQueryDetail)}
    {getPageRoutes("downloads", AuditDownloads)}
    {getPageRoutes("members", AuditUsers)}
    {getPageRoutes("member/:userId", AuditUserDetail)}
    {getPageRoutes("subscriptions", AuditSubscriptions)}
  </Route>
);

export const getUserMenuRotes = () => (
  <ModalRoute key="modalRoute" path="unsubscribe" modal={UnsubscribeUserModal} />
);

export default getRoutes;
