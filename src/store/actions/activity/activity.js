import * as actionTypes from "../actionTypes";

export const updateActivityStart = (userId, token, activity, isStayLoggedIn,) => {
  return {
    type: actionTypes.UPDATE_ACTIVITY_START,
    payload: {
      userId,
      token,
      activity,
      isStayLoggedIn,
    },
  };
};

export const updateActivitySuccess = (message) => {
  return {
    type: actionTypes.UPDATE_ACTIVITY_SUCCESS,
  };
};

export const updateActivityFail = (message) => {
  return {
    type: actionTypes.UPDATE_ACTIVITY_FAIL,
  };
};