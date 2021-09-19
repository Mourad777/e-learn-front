import * as actionTypes from "../actionTypes";

export const fetchConfigStart = (token,spinner) => {
  return {
    type: actionTypes.FETCH_CONFIG_START,
    payload:{
      token,
    },
    spinner,
  };
};

export const fetchConfigSuccess = (configuration) => {
  return {
    type: actionTypes.FETCH_CONFIG_SUCCESS,
    configuration,
  };
};
export const fetchConfigFail = (message) => {
  return {
    type: actionTypes.FETCH_CONFIG_FAIL,
    message
  };
};

export const updateConfigStart = (configData,token) => {
    return {
      type: actionTypes.UPDATE_CONFIG_START,
      payload:{
        token,
        configData,
      }
    };
  };
  
  export const updateConfigSuccess = (newTokenData, message) => {
    return {
      type: actionTypes.UPDATE_CONFIG_SUCCESS,
      message,
      newTokenData,
    };
  };
  export const updateConfigFail = (message) => {
    return {
      type: actionTypes.UPDATE_CONFIG_FAIL,
      message
    };
  };
  
