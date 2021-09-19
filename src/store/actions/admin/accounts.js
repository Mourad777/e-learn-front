import * as actionTypes from "../actionTypes";

export const suspendAccountStart = (user,action, reason, token, history) => {
  return {
    type: actionTypes.SUSPEND_ACCOUNT_START,
    payload:{
      user,
      action,
      reason,
      token,
      history,
    }
  };
};

export const suspendAccountSuccess = (message) => {
  return {
    type: actionTypes.SUSPEND_ACCOUNT_SUCCESS,
    message,
  };
};

export const suspendAccountFail = (message) => {
  return {
    type: actionTypes.SUSPEND_ACCOUNT_FAIL,
    message,
  };
};

export const activateAccountStart = (user,token,history) => {
    return {
      type: actionTypes.ACTIVATE_ACCOUNT_START,
      payload:{
        user,
        token,
        history
      }
    };
  };
  
  export const activateAccountSuccess = (message) => {
    return {
      type: actionTypes.ACTIVATE_ACCOUNT_SUCCESS,
      message,
    };
  };
  
  export const activateAccountFail = (message) => {
    return {
      type: actionTypes.ACTIVATE_ACCOUNT_FAIL,
      message,
    };
  };