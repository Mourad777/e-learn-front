import * as actionTypes from "../actionTypes";

export const deleteFilesStart = (fileUrls, token) => {
  return {
    type: actionTypes.DELETE_FILES_START,
    payload:{
      fileUrls,
      token,
    }
  };
};

export const deleteFilesSuccess = () => {
  return {
    type: actionTypes.DELETE_FILES_SUCCESS,
  };
};

export const deleteFilesFail = (message) => {
  return {
    type: actionTypes.DELETE_FILES_FAIL,
    message: message,
  };
};

export const uploadFileStart = (file,key, token, type) => {
  return {
    type: actionTypes.UPLOAD_FILE_START,
    payload:{
      file,
      key,
      type,
      token,
    }
  };
};

export const uploadFileSuccess = () => {
  return {
    type: actionTypes.UPLOAD_FILE_SUCCESS,
  };
};

export const uploadFileFail = (message) => {
  return {
    type: actionTypes.UPLOAD_FILE_FAIL,
    message: message,
  };
};