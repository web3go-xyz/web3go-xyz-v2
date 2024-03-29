import React, { ErrorInfo, ReactNode, useRef, useState } from "react";
import { connect } from "react-redux";
import { Location } from "history";

import AppErrorCard from "metabase/components/AppErrorCard/AppErrorCard";

import ScrollToTop from "metabase/hoc/ScrollToTop";
import {
  Archived,
  GenericError,
  NotFound,
  Unauthorized,
} from "metabase/containers/ErrorPages";
import UndoListing from "metabase/containers/UndoListing";

import {
  getErrorPage,
  getIsAdminApp,
  getIsAppBarVisible,
  getIsNavBarVisible,
} from "metabase/selectors/app";
import { useOnMount } from "metabase/hooks/use-on-mount";
import { initializeIframeResizer } from "metabase/lib/dom";

import AppBanner from "metabase/components/AppBanner";
import AppBar from "metabase/nav/containers/AppBar";
import Navbar from "metabase/nav/containers/Navbar";
import StatusListing from "metabase/status/containers/StatusListing";
import { ContentViewportContext } from "metabase/core/context/ContentViewportContext";

import { AppErrorDescriptor, State } from "metabase-types/store";

import { AppContainer, AppContent, AppContentContainer } from "./App.styled";
import { Route } from "react-router";

const getErrorComponent = ({ status, data, context }: AppErrorDescriptor) => {
  if (status === 403 || data?.error_code === "unauthorized") {
    return <Unauthorized />;
  }
  if (status === 404 || data?.error_code === "not-found") {
    return <NotFound />;
  }
  if (data?.error_code === "archived" && context === "dashboard") {
    return <Archived entityName="dashboard" linkTo="/dashboards/archive" />;
  }
  if (data?.error_code === "archived" && context === "query-builder") {
    return <Archived entityName="question" linkTo="/questions/archive" />;
  }
  return <GenericError details={data?.message} />;
};

interface AppStateProps {
  errorPage: AppErrorDescriptor | null;
  isAdminApp: boolean;
  bannerMessageDescriptor?: string;
  isAppBarVisible: boolean;
  isNavBarVisible: boolean;
  route: any;
}

interface AppRouterOwnProps {
  location: Location;
  children: ReactNode;
}

type AppProps = AppStateProps & AppRouterOwnProps;

const mapStateToProps = (
  state: State,
  props: AppRouterOwnProps,
): AppStateProps => ({
  errorPage: getErrorPage(state),
  isAdminApp: getIsAdminApp(state, props),
  isAppBarVisible: getIsAppBarVisible(state, props),
  isNavBarVisible: getIsNavBarVisible(state, props),
  route: state.routing.locationBeforeTransitions,

});

class ErrorBoundary extends React.Component<{
  onError: (errorInfo: ErrorInfo) => void;
}> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(errorInfo);
  }

  render() {
    return this.props.children;
  }
}

function App({
  errorPage,
  isAdminApp,
  isAppBarVisible,
  isNavBarVisible,
  children,
  route
}: AppProps) {
  const [viewportElement, setViewportElement] = useState<HTMLElement | null>();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  useOnMount(() => {
    initializeIframeResizer();
  });

  return (
    <ErrorBoundary onError={setErrorInfo}>
      <ScrollToTop>
        <AppContainer className="spread">
          <AppBanner />
          {isAppBarVisible && <AppBar isNavBarVisible={isNavBarVisible} />}
          <AppContentContainer isAdminApp={isAdminApp} isLayout={route.pathname.slice(0, 7) == '/layout'}>
            {isNavBarVisible && <Navbar />}
            <AppContent ref={setViewportElement} isLayout={route.pathname.slice(0, 7) == '/layout'}>
              <ContentViewportContext.Provider value={viewportElement ?? null}>
                {errorPage ? getErrorComponent(errorPage) : children}
              </ContentViewportContext.Provider>
            </AppContent>
            {location.pathname.includes('/layout') ? null : <UndoListing />}
            <StatusListing />
          </AppContentContainer>
          <AppErrorCard errorInfo={errorInfo} />
        </AppContainer>
      </ScrollToTop>
    </ErrorBoundary>
  );
}

export default connect<AppStateProps, unknown, AppRouterOwnProps, State>(
  mapStateToProps,
)(App);
