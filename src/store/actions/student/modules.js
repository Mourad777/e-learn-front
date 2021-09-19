import * as actionTypes from "../actionTypes";

export const fetchStudentModulesStart = () => {
  return {
    type: actionTypes.FETCH_STUDENT_MODULES_START,
  };
};

export const fetchStudentModulesSuccess = () => {
  return {
    type: actionTypes.FETCH_STUDENT_MODULES_SUCCESS,
  };
};

export const fetchStudentModulesFailed = (message) => {
  return {
    type: actionTypes.FETCH_STUDENT_MODULES_FAILED,
    message:message,
  };
};