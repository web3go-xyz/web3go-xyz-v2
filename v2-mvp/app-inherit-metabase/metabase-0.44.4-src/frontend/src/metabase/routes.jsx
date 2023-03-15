import React from "react";

import { PLUGIN_LANDING_PAGE } from "metabase/plugins";

import { Route } from "metabase/hoc/Title";
import { Redirect, IndexRedirect, IndexRoute } from "react-router";
import { routerActions } from "react-router-redux";
import { UserAuthWrapper } from "redux-auth-wrapper";
import { t } from "ttag";

import { loadCurrentUser } from "metabase/redux/user";
import MetabaseSettings from "metabase/lib/settings";

import App from "metabase/App.tsx";

import ActivityApp from "metabase/home/containers/ActivityApp";
// web3go

import web3goLayout from "metabase/web3goLayout";
import RedirectComponent from "metabase/web3goLayout/components/RedirectComponent";
import AccountSetting from "metabase/web3goLayout/views/AccountSetting";
import MySpace from "metabase/web3goLayout/views/MySpace";
import GlobalSearch from "metabase/web3goLayout/views/GlobalSearch";
import DashBoardList from "metabase/web3goLayout/views/DashBoardList";
import DatasetList from "metabase/web3goLayout/views/DatasetList";
import DashBoardDetail from "metabase/web3goLayout/views/DashBoardDetail";
import DatasetDetail from "metabase/web3goLayout/views/DatasetDetail";
import CreateDashboard from "metabase/web3goLayout/views/CreatePage/CreateDashboard";
import CreateDataset from "metabase/web3goLayout/views/CreatePage/CreateDataset";

import CreatorList from "metabase/web3goLayout/views/CreatorList";
import Home from "metabase/web3goLayout/views/Home";
import VerifyEmailPage from "metabase/web3goLayout/views/VerifyEmailPage";

// auth containers
import ForgotPasswordApp from "metabase/auth/containers/ForgotPasswordApp";
import LoginApp from "metabase/auth/containers/LoginApp";
import LogoutApp from "metabase/auth/containers/LogoutApp";
import ResetPasswordApp from "metabase/auth/containers/ResetPasswordApp";

/* Dashboards */
import DashboardApp from "metabase/dashboard/containers/DashboardApp";
import AutomaticDashboardApp from "metabase/dashboard/containers/AutomaticDashboardApp";

/* Browse data */
import BrowseApp from "metabase/browse/components/BrowseApp";
import DatabaseBrowser from "metabase/browse/containers/DatabaseBrowser";
import SchemaBrowser from "metabase/browse/containers/SchemaBrowser";
import TableBrowser from "metabase/browse/containers/TableBrowser";

import QueryBuilder from "metabase/query_builder/containers/QueryBuilder";

import CollectionCreate from "metabase/collections/containers/CollectionCreate";
import MoveCollectionModal from "metabase/collections/containers/MoveCollectionModal";
import ArchiveCollectionModal from "metabase/components/ArchiveCollectionModal";
import CollectionPermissionsModal from "metabase/admin/permissions/components/CollectionPermissionsModal/CollectionPermissionsModal";
import UserCollectionList from "metabase/containers/UserCollectionList";

import PulseEditApp from "metabase/pulse/containers/PulseEditApp";
import SetupApp from "metabase/setup/containers/SetupApp";
// new question
import NewQueryOptions from "metabase/new_query/containers/NewQueryOptions";

import CreateDashboardModal from "metabase/components/CreateDashboardModal";

import { Unauthorized } from "metabase/containers/ErrorPages";
import NotFoundFallbackPage from "metabase/containers/NotFoundFallbackPage";

// Reference Metrics
import MetricListContainer from "metabase/reference/metrics/MetricListContainer";
import MetricDetailContainer from "metabase/reference/metrics/MetricDetailContainer";
import MetricQuestionsContainer from "metabase/reference/metrics/MetricQuestionsContainer";
import MetricRevisionsContainer from "metabase/reference/metrics/MetricRevisionsContainer";
// Reference Segments
import SegmentListContainer from "metabase/reference/segments/SegmentListContainer";
import SegmentDetailContainer from "metabase/reference/segments/SegmentDetailContainer";
import SegmentQuestionsContainer from "metabase/reference/segments/SegmentQuestionsContainer";
import SegmentRevisionsContainer from "metabase/reference/segments/SegmentRevisionsContainer";
import SegmentFieldListContainer from "metabase/reference/segments/SegmentFieldListContainer";
import SegmentFieldDetailContainer from "metabase/reference/segments/SegmentFieldDetailContainer";
// Reference Databases
import DatabaseListContainer from "metabase/reference/databases/DatabaseListContainer";
import DatabaseDetailContainer from "metabase/reference/databases/DatabaseDetailContainer";
import TableListContainer from "metabase/reference/databases/TableListContainer";
import TableDetailContainer from "metabase/reference/databases/TableDetailContainer";
import TableQuestionsContainer from "metabase/reference/databases/TableQuestionsContainer";
import FieldListContainer from "metabase/reference/databases/FieldListContainer";
import FieldDetailContainer from "metabase/reference/databases/FieldDetailContainer";

import getAccountRoutes from "metabase/account/routes";
import getAdminRoutes from "metabase/admin/routes";
import getCollectionTimelineRoutes from "metabase/timelines/collections/routes";

import PublicQuestion from "metabase/public/containers/PublicQuestion";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import ArchiveDashboardModal from "metabase/dashboard/containers/ArchiveDashboardModal";
import DashboardMoveModal from "metabase/dashboard/components/DashboardMoveModal";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import { ModalRoute } from "metabase/hoc/ModalRoute";

import HomePage from "metabase/home/homepage/containers/HomePage";
import CollectionLanding from "metabase/collections/components/CollectionLanding";

import ArchiveApp from "metabase/home/containers/ArchiveApp";
import SearchApp from "metabase/home/containers/SearchApp";
import { trackPageView } from "metabase/lib/analytics";
import { getAdminPaths } from "metabase/admin/app/selectors";
import { LayoutLoginApi } from '@/services'
import { changeUserData } from "metabase/redux/app";

const MetabaseIsSetup = UserAuthWrapper({
  predicate: authData => authData.hasUserSetup,
  failureRedirectPath: "/setup",
  authSelector: state => ({ hasUserSetup: MetabaseSettings.hasUserSetup() }), // HACK
  wrapperDisplayName: "MetabaseIsSetup",
  allowRedirectBack: false,
  redirectAction: routerActions.replace,
});

const UserIsAuthenticated = UserAuthWrapper({
  // failureRedirectPath: "/auth/login",
  failureRedirectPath: "/layout/home#showLogin",
  authSelector: state => state.currentUser,
  wrapperDisplayName: "UserIsAuthenticated",
  redirectAction: routerActions.replace,
});

const UserIsAdmin = UserAuthWrapper({
  predicate: currentUser => currentUser && currentUser.is_superuser,
  failureRedirectPath: "/unauthorized",
  authSelector: state => state.currentUser,
  allowRedirectBack: false,
  wrapperDisplayName: "UserIsAdmin",
  redirectAction: routerActions.replace,
});

const UserIsNotAuthenticated = UserAuthWrapper({
  predicate: currentUser => !currentUser,
  failureRedirectPath: "/",
  authSelector: state => state.currentUser,
  allowRedirectBack: false,
  wrapperDisplayName: "UserIsNotAuthenticated",
  redirectAction: routerActions.replace,
});

const UserCanAccessSettings = UserAuthWrapper({
  predicate: adminItems => adminItems?.length > 0,
  failureRedirectPath: "/unauthorized",
  authSelector: getAdminPaths,
  allowRedirectBack: false,
  wrapperDisplayName: "UserCanAccessSettings",
  redirectAction: routerActions.replace,
});

const IsAuthenticated = MetabaseIsSetup(
  UserIsAuthenticated(({ children }) => children),
);
const IsAdmin = MetabaseIsSetup(
  UserIsAuthenticated(UserIsAdmin(({ children }) => children)),
);

const IsNotAuthenticated = MetabaseIsSetup(
  UserIsNotAuthenticated(({ children }) => children),
);

const CanAccessSettings = MetabaseIsSetup(
  UserIsAuthenticated(UserCanAccessSettings(({ children }) => children)),
);

export const getRoutes = store => (
  <Route title={t`Metabase`} component={App}>

    <Route
      path="/redirect"
      component={RedirectComponent}
    />
    <Route
      path="/verifyEmail"
      component={VerifyEmailPage}
    >
    </Route>
    {/* SETUP */}
    <Route
      path="/setup"
      component={SetupApp}
      onEnter={(nextState, replace) => {
        if (MetabaseSettings.hasUserSetup()) {
          replace("/");
        }
        trackPageView(location.pathname);
      }}
      onChange={(prevState, nextState) => {
        trackPageView(nextState.location.pathname);
      }}
    />

    {/* PUBLICLY SHARED LINKS */}
    <Route path="public">
      <Route path="question/:uuid" component={PublicQuestion} />
      <Route path="dashboard/:uuid" component={PublicDashboard} />
    </Route>

    {/* APP */}
    <Route
      onEnter={async (nextState, replace, done) => {
        await store.dispatch(loadCurrentUser());
        if (localStorage.getItem('token')) {
          const userData = await LayoutLoginApi.getAccountInfo()
          await store.dispatch(changeUserData(userData))
        }
        trackPageView(nextState.location.pathname);
        done();
      }}
      onChange={(prevState, nextState) => {
        trackPageView(nextState.location.pathname);
      }}
    >
      {/* WEB3GO */}
      <Route
        path="/"
      >
        <IndexRedirect to="/layout" />
        <Route
          path="/layout"
          component={web3goLayout}
        >
          <IndexRedirect to="home" />
          <Route
            path="blank"
            component={() => <div></div>}
          >
          </Route>
          <Route
            path="home"
            component={Home}
          >
          </Route>
          <Route
            path="dashboardDetail/:uuid"
            component={DashBoardDetail}
          >
          </Route>
          <Route
            path="datasetDetail/:id"
            component={DatasetDetail}
          >
          </Route>
          <Route
            path="accountSetting"
            component={AccountSetting}
          >
          </Route>
          <Route
            path="mySpace"
            component={MySpace}
          >
          </Route>
          <Route
            path="globalSearch"
            component={GlobalSearch}
          >
          </Route>
          <Route
            path="dashBoardList"
            component={DashBoardList}
          >
          </Route>
          <Route
            path="datasetList"
            component={DatasetList}
          >
          </Route>
          <Route
            path="creatorList"
            component={CreatorList}
          >
          </Route>
          <Route component={IsAuthenticated}>
            <Route
              path="create/dashboard"
              component={CreateDashboard}
            />
            <Route
              path="create/dashboard/:dashboardSlug"
              component={CreateDashboard}
            />
            <Route
              path="create/dataset"
              component={CreateDataset}
            />
            <Route
              path="create/dataset/:chartSlug"
              component={CreateDataset}
            />
            <Route
              path="create/chart/:chartSlug"
              component={CreateDashboard}
            />
            <Route
              path="create/chart/:chartSlug/:dashboardSlug"
              component={CreateDashboard}
            />
          </Route>

        </Route>
      </Route>
      {/* AUTH */}
      <Route path="/auth">
        <IndexRedirect to="/auth/login" />
        <Route component={IsNotAuthenticated}>
          <Route path="login" title={t`Login`} component={LoginApp} />
          <Route path="login/:provider" title={t`Login`} component={LoginApp} />
        </Route>
        <Route path="logout" component={LogoutApp} />
        <Route path="forgot_password" component={ForgotPasswordApp} />
        <Route path="reset_password/:token" component={ResetPasswordApp} />
      </Route>

      {/* MAIN */}
      <Route component={IsAuthenticated}>
        {/* The global all hands rotues, things in here are for all the folks */}
        <Route
          path="/home"
          component={HomePage}
          onEnter={(nextState, replace) => {
            const page = PLUGIN_LANDING_PAGE[0] && PLUGIN_LANDING_PAGE[0]();
            if (page && page !== "/") {
              replace(page);
            }
          }}
        />

        <Route path="search" title={t`Search`} component={SearchApp} />
        <Route path="archive" title={t`Archive`} component={ArchiveApp} />

        <Route path="collection/users" component={IsAdmin}>
          <IndexRoute component={UserCollectionList} />
        </Route>

        <Route path="collection/:slug" component={CollectionLanding}>
          <ModalRoute path="move" modal={MoveCollectionModal} />
          <ModalRoute path="archive" modal={ArchiveCollectionModal} />
          <ModalRoute path="new_collection" modal={CollectionCreate} />
          <ModalRoute path="new_dashboard" modal={CreateDashboardModal} />
          <ModalRoute path="permissions" modal={CollectionPermissionsModal} />
          {getCollectionTimelineRoutes()}
        </Route>

        <Route path="activity" component={ActivityApp} />

        <Route
          path="dashboard/:slug"
          title={t`Dashboard`}
          component={DashboardApp}
        >
          <ModalRoute path="move" modal={DashboardMoveModal} />
          <ModalRoute path="copy" modal={DashboardCopyModal} />
          <ModalRoute path="archive" modal={ArchiveDashboardModal} />
        </Route>

        <Route path="/question">
          <IndexRoute component={QueryBuilder} />
          {/* NEW QUESTION FLOW */}
          <Route
            path="new"
            title={t`New Question`}
            component={NewQueryOptions}
          />
          <Route path="notebook" component={QueryBuilder} />
          <Route path=":slug" component={QueryBuilder} />
          <Route path=":slug/notebook" component={QueryBuilder} />
          <Route path=":slug/:objectId" component={QueryBuilder} />
        </Route>

        <Route path="/model">
          <IndexRoute component={QueryBuilder} />
          <Route path="notebook" component={QueryBuilder} />
          <Route path=":slug" component={QueryBuilder} />
          <Route path=":slug/notebook" component={QueryBuilder} />
          <Route path=":slug/query" component={QueryBuilder} />
          <Route path=":slug/metadata" component={QueryBuilder} />
          <Route path=":slug/:objectId" component={QueryBuilder} />
        </Route>

        <Route path="browse" component={BrowseApp}>
          <IndexRoute component={DatabaseBrowser} />
          <Route path=":slug" component={SchemaBrowser} />
          <Route path=":dbId/schema/:schemaName" component={TableBrowser} />
        </Route>

        {/* INDIVIDUAL DASHBOARDS */}

        <Route path="/auto/dashboard/*" component={AutomaticDashboardApp} />

        <Route path="/collections">
          <Route path="create" component={CollectionCreate} />
        </Route>

        {/* REFERENCE */}
        <Route path="/reference" title={t`Data Reference`}>
          <IndexRedirect to="/reference/databases" />
          <Route path="metrics" component={MetricListContainer} />
          <Route path="metrics/:metricId" component={MetricDetailContainer} />
          <Route
            path="metrics/:metricId/edit"
            component={MetricDetailContainer}
          />
          <Route
            path="metrics/:metricId/questions"
            component={MetricQuestionsContainer}
          />
          <Route
            path="metrics/:metricId/revisions"
            component={MetricRevisionsContainer}
          />
          <Route path="segments" component={SegmentListContainer} />
          <Route
            path="segments/:segmentId"
            component={SegmentDetailContainer}
          />
          <Route
            path="segments/:segmentId/fields"
            component={SegmentFieldListContainer}
          />
          <Route
            path="segments/:segmentId/fields/:fieldId"
            component={SegmentFieldDetailContainer}
          />
          <Route
            path="segments/:segmentId/questions"
            component={SegmentQuestionsContainer}
          />
          <Route
            path="segments/:segmentId/revisions"
            component={SegmentRevisionsContainer}
          />
          <Route path="databases" component={DatabaseListContainer} />
          <Route
            path="databases/:databaseId"
            component={DatabaseDetailContainer}
          />
          <Route
            path="databases/:databaseId/tables"
            component={TableListContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId"
            component={TableDetailContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId/fields"
            component={FieldListContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId/fields/:fieldId"
            component={FieldDetailContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId/questions"
            component={TableQuestionsContainer}
          />
        </Route>

        {/* PULSE */}
        <Route path="/pulse" title={t`Pulses`}>
          {/* NOTE: legacy route, not linked to in app */}
          <IndexRedirect to="/search" query={{ type: "pulse" }} />
          <Route path="create" component={PulseEditApp} />
          <Route path=":pulseId">
            <IndexRoute component={PulseEditApp} />
          </Route>
        </Route>

        {/* ACCOUNT */}
        {getAccountRoutes(store, IsAuthenticated)}

        {/* ADMIN */}
        {getAdminRoutes(store, CanAccessSettings, IsAdmin)}
      </Route>
    </Route>

    {/* INTERNAL */}
    <Route
      path="/_internal"
      getChildRoutes={(partialNextState, callback) =>
        require.ensure([], function (require) {
          callback(null, [require("metabase/internal/routes").default]);
        })
      }
    />

    {/* DEPRECATED */}
    {/* NOTE: these custom routes are needed because <Redirect> doesn't preserve the hash */}
    <Route
      path="/q"
      onEnter={({ location }, replace) =>
        replace({ pathname: "/question", hash: location.hash })
      }
    />
    <Route
      path="/card/:slug"
      onEnter={({ location, params }, replace) =>
        replace({
          pathname: `/question/${params.slug}`,
          hash: location.hash,
        })
      }
    />
    <Redirect from="/dash/:dashboardId" to="/dashboard/:dashboardId" />
    <Redirect
      from="/collections/permissions"
      to="/admin/permissions/collections"
    />

    {/* MISC */}
    <Route path="/unauthorized" component={Unauthorized} />
    <Route path="/*" component={NotFoundFallbackPage} />
  </Route>
);
