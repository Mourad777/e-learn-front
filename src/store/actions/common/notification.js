import * as actionTypes from "../actionTypes";

export const setNotification = (notification,timeoutId) => {
  return {
    type: actionTypes.SET_NOTIFICATION,
    notification,
    timeoutId,
  };
};

export const fetchNotificationsStart = (token,spinner) => {
  return {
    type: actionTypes.FETCH_NOTIFICATIONS_START,
    payload:{
      token,
    },
    spinner,
  };
};
export const fetchNotificationsSuccess = (notifications,spinner) => {
  return {
    type: actionTypes.FETCH_NOTIFICATIONS_SUCCESS,
    notifications,
    spinner,
  };
};
export const fetchNotificationsFail = () => {
  return {
    type: actionTypes.FETCH_NOTIFICATIONS_FAIL,
  };
};

export const markAsSeenStart = (notificationId,token) => {
  return {
    type: actionTypes.MARK_AS_SEEN_START,
    payload:{
      notificationId,
      token,
    }
  };
};
export const markAsSeenSuccess = () => {
  return {
    type: actionTypes.MARK_AS_SEEN_SUCCESS,
  };
};
export const markAsSeenFail = () => {
  return {
    type: actionTypes.MARK_AS_SEEN_FAIL,
  };
};