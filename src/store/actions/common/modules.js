import * as actionTypes from "../actionTypes";

export const fetchModulesStart = (courseId,token,spinner) => {
  return {
    type: actionTypes.FETCH_MODULES_START,
    payload: {
      token,
      courseId,
      spinner,
    },
  };
};

export const fetchModulesSuccess = (modules) => {
  return {
    type: actionTypes.FETCH_MODULES_SUCCESS,
    modules,
  };
};

export const fetchModulesFail = (message) => {
  return {
    type: actionTypes.FETCH_MODULES_FAIL,
    message: message,
  };
};