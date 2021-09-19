import * as actionTypes from "../actionTypes";

export const setInstructorFolder = (folder) => {
  return {
    type: actionTypes.SET_INSTRUCTOR_FOLDER,
    folder: folder,
  };
};

export const modulesChangeStart = (formValues, token, editing, courseId) => {
  return {
    type: actionTypes.MODULES_CHANGE_START,
    payload: {
      formValues,
      token,
      editing,
      courseId,
    },
  };
};

export const modulesChangeSuccess = () => {
  return {
    type: actionTypes.MODULES_CHANGE_SUCCESS,
  };
};

export const modulesChangeFailed = (message) => {
  return {
    type: actionTypes.MODULES_CHANGE_FAILED,
    message: message,
  };
};
