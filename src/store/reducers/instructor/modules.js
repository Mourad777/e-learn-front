import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  openFolderPath: null,
  loading: false,
  successMessage: null,
  failMessage: null,
};

const resetState = (state) => {
  return updateObject(state, {
    openFolderPath: null,
    loading: false,
    successMessage: null,
    failMessage: null,
  });
};

const modulesChangeStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const modulesChangeSuccess = (state) => {
  return updateObject(state, {
    loading: false,
  });
};

const modulesChangeFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const setFolder = (state, action) => {
  return updateObject(state, {
    openFolderPath: action.folder,
  });
};

const clearAlert = (state) => {
  return updateObject(state, {
    successMessage: null,
    failMessage: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MODULES_CHANGE_START:
      return modulesChangeStart(state, action);
    case actionTypes.MODULES_CHANGE_SUCCESS:
      return modulesChangeSuccess(state, action);
    case actionTypes.MODULES_CHANGE_FAILED:
      return modulesChangeFailed(state, action);

    case actionTypes.SET_INSTRUCTOR_FOLDER:
      return setFolder(state, action);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    default:
      return state;
  }
};

export default reducer;
