import { push, LOCATION_CHANGE } from "react-router-redux";

import {
  combineReducers,
  createAction,
  handleActions,
} from "metabase/lib/redux";
import {
  isSmallScreen,
  openInBlankWindow,
  shouldOpenInBlankWindow,
} from "metabase/lib/dom";

export const SET_ERROR_PAGE = "metabase/app/SET_ERROR_PAGE";
export function setErrorPage(error) {
  console.error("Error:", error);
  return {
    type: SET_ERROR_PAGE,
    payload: error,
  };
}

export const openUrl = (url, options) => dispatch => {
  if (shouldOpenInBlankWindow(url, options)) {
    openInBlankWindow(url);
  } else {
    dispatch(push(url));
  }
};

const errorPage = handleActions(
  {
    [SET_ERROR_PAGE]: (state, { payload }) => payload,
    [LOCATION_CHANGE]: () => null,
  },
  null,
);

const PATHS_WITH_COLLAPSED_NAVBAR = [
  /\/model.*/,
  /\/question.*/,
  /\/dashboard.*/,
];

function checkIsSidebarInitiallyOpen() {
  return (
    !isSmallScreen() &&
    !PATHS_WITH_COLLAPSED_NAVBAR.some(pattern =>
      pattern.test(window.location.pathname),
    )
  );
}

export const OPEN_NAVBAR = "metabase/app/OPEN_NAVBAR";
export const CLOSE_NAVBAR = "metabase/app/CLOSE_NAVBAR";
export const TOGGLE_NAVBAR = "metabase/app/TOGGLE_NAVBAR";
export const TOGGLE_DARK = "metabase/app/TOGGLE_DARK";
export const CHANGE_USERDATA = "metabase/app/CHANGE_USERDATA";
export const CHANGE_GLOBAL_SEARCH_VALUE = "metabase/app/CHANGE_GLOBAL_SEARCH_VALUE";


export const openNavbar = createAction(OPEN_NAVBAR);
export const closeNavbar = createAction(CLOSE_NAVBAR);
export const toggleNavbar = createAction(TOGGLE_NAVBAR);
export const toggleDark = createAction(TOGGLE_DARK);
export const changeUserData = createAction(CHANGE_USERDATA);
export const changeGlobalSearchValue = createAction(CHANGE_GLOBAL_SEARCH_VALUE);

export function getIsNavbarOpen(state) {
  return state.app.isNavbarOpen;
}
const isNavbarOpen = handleActions(
  {
    [OPEN_NAVBAR]: () => true,
    [TOGGLE_NAVBAR]: isOpen => !isOpen,
    [CLOSE_NAVBAR]: () => false,
  },
  checkIsSidebarInitiallyOpen(),
);
const defaultIsDark = localStorage.getItem('isDark');

const isDark = handleActions(
  {
    [TOGGLE_DARK]: (state) => {
      localStorage.setItem('isDark', !state);
      if (!state) {
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        document.body.removeAttribute('arco-theme');
      }
      return !state
    },
  },
  defaultIsDark == 'true' ? true : false,
);

const userData = handleActions( 
  {
    [CHANGE_USERDATA]: (state, { payload }) => {
      return payload
    },
  },
  {}
);
const globalSearchValue = handleActions(
  {
    [CHANGE_GLOBAL_SEARCH_VALUE]: (state, { payload }) => {
      return payload
    },
  },
  '',
);
export default combineReducers({
  errorPage,
  isNavbarOpen,
  isDark,
  userData,
  globalSearchValue
});
