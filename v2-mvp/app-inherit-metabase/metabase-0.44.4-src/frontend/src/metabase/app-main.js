// Enables hot reload in development and noop in production
// MUST be imported BEFORE `react` and `react-dom`
import "metabase-dev";

import { push } from "react-router-redux";
import _ from "underscore";

import { init } from "metabase/app";
import { getRoutes } from "metabase/routes";
import reducers from "metabase/reducers-main";

import api from "metabase/lib/api";
import web3goApi from "metabase/lib/web3goApi";

import { setErrorPage } from "metabase/redux/app";
import { clearCurrentUser } from "metabase/redux/user";
import { changeUserData } from "metabase/redux/app";

// If any of these receives a 403, we should display the "not authorized" page.
const NOT_AUTHORIZED_TRIGGERS = [
  /\/api\/dashboard\/\d+$/,
  /\/api\/collection\/\d+(?:\/items)?$/,
  /\/api\/card\/\d+$/,
  /\/api\/pulse\/\d+$/,
  /\/api\/dataset$/,
];

init(reducers, getRoutes, store => {
  // received a 401 response
  const handler401 = url => {
    localStorage.removeItem('token');
    if (url.indexOf("/api/user/current") >= 0) {
      return;
    }

    // If SSO is enabled, page url for login with email and password
    // is `/auth/login/password` instead of `/auth/login`.
    // So if call to api when signing in fails, let’s stay in the current page.
    // Otherwise it will always redirect us to the Google auth interaction.
    if (_.contains(["/api/session", "/api/session/"], url)) {
      return;
    }
    store.dispatch(clearCurrentUser());
    store.dispatch(changeUserData({})),
    store.dispatch(push("/layout/home#showLogin"));
  };
  api.on("401", handler401);
  web3goApi.on("401", handler401);
  // received a 403 response
  api.on("403", url => {
    if (NOT_AUTHORIZED_TRIGGERS.some(regex => regex.test(url))) {
      return store.dispatch(setErrorPage({ status: 403 }));
    }
  });
});
