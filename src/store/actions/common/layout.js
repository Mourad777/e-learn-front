import * as actionTypes from "../actionTypes";

export const setTheme = (theme) => {
  return {
    type: actionTypes.SET_THEME,
    theme,
  };
};

export const setWidth = (width) => {
  return {
    type: actionTypes.SET_WIDTH,
    width,
  };
};

export const setTabLabels = (tabLabels) => {
  return {
    type: actionTypes.SET_TAB_LABELS,
    tabLabels,
  };
};

export const setTab = (tab) => {
  return {
    type: actionTypes.SET_TAB,
    tab,
  };
};

export const setEditing = () => {
  return {
    type: actionTypes.SET_EDITING,
  };
};

export const cancelEditing = () => {
  return {
    type: actionTypes.CANCEL_EDITING,
  };
};

export const openModal = (document, type) => {
  return {
    type: actionTypes.OPEN_MODAL,
    modalDocument: document,
    modalType: type,
  };
};

export const closeModal = () => {
  return {
    type: actionTypes.CLOSE_MODAL,
  };
};

export const clearAlert = () => {
  return {
    type: actionTypes.CLEAR_ALERT,
  };
};

export const setSessionAlert = (alert) => {
  return {
    type: actionTypes.SET_SESSION_ALERT,
    alert,
  };
  
};

export const setMic = (mic) => {
  return {
    type: actionTypes.SET_MIC,
    mic,
  };
  
};
