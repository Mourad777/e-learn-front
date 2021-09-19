import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  selectedChatUser: null,
  loading: false,
  editing: false,
  successMessage: null,
  failMessage: null,
  students: null,
  notification: null,
  notificationTimeout: null,
  selectedCourse: null,
  tabLabels: [],
  tab: 0,
  coursePanel: "modules",
  courses: null,
  modules: null,
  isModal: false,
  modalDocument: null,
  modalType: null,
  notifications: null,
  width: 600,
  sessionAlert: false,
  configuration: {},
  uploading: false,
  isDarkTheme: false,
};

const resetState = (state) => {
  return updateObject(state, {
    selectedChatUser: null,
    loading: false,
    editing: false,
    successMessage: null,
    failMessage: null,
    students: null,
    notification: null,
    notificationTimeout: null,
    selectedCourse: null,
    tabLabels: [],
    tab: 0,
    coursePanel: "modules",
    courses: null,
    modules: null,
    isModal: false,
    modalDocument: null,
    modalType: null,
    notifications: null,
    width: 600,
    sessionAlert: false,
    configuration: {},
    uploading: false,
    isDarkTheme: false,
  });
};

const setTheme = (state, action) => {
  if(action.theme === "dark"){
    localStorage.setItem('theme',"dark");
  } else {
    localStorage.setItem('theme','light');
  }
  return updateObject(state, {
    isDarkTheme: action.theme === 'dark',
  });
};

const setWidth = (state, action) => {
  return updateObject(state, {
    width: action.width,
  });
};

const setLoading = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
  });
};

const setSuccessMessage = (state, action) => {
  return updateObject(state, {
    successMessage: action.message,
  });
};

const setFailMessage = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
  });
};

const fetchCoursesStart = (state, action) => {
  return updateObject(state, {
    loading: action.payload.spinner === "noSpinner" ? false : true,
  });
};

const fetchCoursesSuccess = (state, action) => {
  return updateObject(state, {
    courses: action.courses,
    loading: false,
  });
};

const fetchCoursesFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const fetchNotificationsStart = (state) => {
  return updateObject(state, {
    // loading: true,
  });
};

const fetchNotificationsSuccess = (state, action) => {
  return updateObject(state, {
    notifications: action.notifications,
    // loading: false,
  });
};

const fetchNotificationsFail = (state) => {
  return updateObject(state, {
    // loading: false,
  });
};

const fetchConfigurationStart = (state,action) => {
  return updateObject(state, {
    loading:action.spinner === "noSpinner" ? false : true,
  });
};

const fetchConfigurationSuccess = (state, action) => {
  return updateObject(state, {
    configuration: action.configuration,
    loading: false,
  });
};

const fetchConfigurationFail = (state) => {
  return updateObject(state, {
    loading: false,
  });
};

const updateConfigurationStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const updateConfigurationSuccess = (state, action) => {
  const newTokenData = action.newTokenData;
  
  if(newTokenData){
    const expirationDate = new Date(Date.now() + newTokenData.expiresIn * 1000);
    localStorage.setItem('expirationDate',expirationDate);
    localStorage.setItem('refreshTokenExpiration',newTokenData.refreshTokenExpiration);
    localStorage.setItem('token',newTokenData.token);
  }
  return updateObject(state, {
    successMessage: action.message,
    loading: false,
  });
};

const updateConfigurationFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const markAsSeenStart = (state) => {
  return updateObject(state, {
    // loading: true,
  });
};

const markAsSeenSuccess = (state) => {
  return updateObject(state, {
    // loading: false,
  });
};

const markAsSeenFail = (state) => {
  return updateObject(state, {
    // loading: false,
  });
};

const updateActivityStart = (state) => {
  return updateObject(state, {
    // loading: true,
  });
};

const updateActivitySuccess = (state) => {
  return updateObject(state, {
    // loading: false,
  });
};

const updateActivityFail = (state) => {
  return updateObject(state, {
    // loading: false,
  });
};

const setCourse = (state, action) => {
  return updateObject(state, {
    selectedCourse: action.course,
  });
};

const setCourses = (state, action) => {
  return updateObject(state, {
    courses: action.courses,
  });
};

const setChatUser = (state, action) => {
  return updateObject(state, {
    selectedChatUser: action.user,
  });
};

const fetchStudentsStart = (state, action) => {
  return updateObject(state, {
    // loading: action.spinner === "noSpinner" ? true : false,
    loading: true,
  });
};

const fetchStudentsSuccess = (state, action) => {
  return updateObject(state, {
    students: action.students,
    loading: false,
  });
};

const fetchStudentsFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const fetchModulesStart = (state, action) => {
  return updateObject(state, {
    // loading: action.spinner === "noSpinner" ? true : false,
    loading: true,
  });
};

const fetchModulesSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    modules: action.modules,
  });
};

const fetchModulesFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const uploadFileStart = (state) => {
  return updateObject(state, {
    loading: false,
    uploading: true,
  });
};

const uploadFileSuccess = (state) => {
  return updateObject(state, {
    loading: false,
    uploading: false,
  });
};

const uploadFileFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
    uploading: false,
  });
};

const deleteFilesStart = (state) => {
  return updateObject(state, {
    loading: false,
  });
};

const deleteFilesSuccess = (state) => {
  return updateObject(state, {
    loading: false,
  });
};

const deleteFilesFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};


const setNotification = (state, action) => {
  clearTimeout(state.notificationTimeout);
  return updateObject(state, {
    notification: action.notification,
    notificationTimeout: action.timeoutId,
  });
};

const setTabLabels = (state, action) => {
  return updateObject(state, {
    tabLabels: action.tabLabels,
  });
};

const returnToCourses = (state, action) => {
  return updateObject(state, {
    tab: 0,
    editing: false,
    selectedCourse: null,
    modules: null,
    students: null,
    selectedChatUser: null,
    modalType: null,
    modalDocument: null,
    isModal: false,
  });
};

const setTab = (state, action) => {
  return updateObject(state, {
    tab: action.tab,
  });
};

const hideCourseDetails = (state, action) => {
  return updateObject(state, {
    modules: null,
  });
};

const setEditing = (state) => {
  return updateObject(state, {
    editing: true,
  });
};

const cancelEditing = (state) => {
  return updateObject(state, {
    editing: false,
  });
};

const openModal = (state, action) => {
  let isModal = true
  if(action.modalType === 'testReview') {
    isModal = false;
  }
  return updateObject(state, {
    isModal,
    modalDocument: action.modalDocument,
    modalType: action.modalType,
  });
};

const closeModal = (state) => {
  return updateObject(state, {
    isModal: false,
    modalDocument: null,
    modalType: null,
  });
};

const clearAlert = (state) => {
  return updateObject(state, {
    successMessage: null,
    failMessage: null,
  });
};

const setCoursePanel = (state, action) => {
  return updateObject(state, {
    coursePanel: action.panel,
  });
};

const setSessionAlert = (state, action) => {
  return updateObject(state, {
    sessionAlert: action.alert === "on" ? true : false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_WIDTH:
      return setWidth(state, action);

    case actionTypes.SET_CHAT_USER:
      return setChatUser(state, action);
    case actionTypes.SET_NOTIFICATION:
      return setNotification(state, action);

    case actionTypes.FETCH_COURSES_START:
      return fetchCoursesStart(state, action);
    case actionTypes.FETCH_COURSES_SUCCESS:
      return fetchCoursesSuccess(state, action);
    case actionTypes.FETCH_COURSES_FAIL:
      return fetchCoursesFail(state, action);

    case actionTypes.FETCH_NOTIFICATIONS_START:
      return fetchNotificationsStart(state, action);
    case actionTypes.FETCH_NOTIFICATIONS_SUCCESS:
      return fetchNotificationsSuccess(state, action);
    case actionTypes.FETCH_NOTIFICATIONS_FAIL:
      return fetchNotificationsFail(state, action);

    case actionTypes.MARK_AS_SEEN_START:
      return markAsSeenStart(state, action);
    case actionTypes.MARK_AS_SEEN_SUCCESS:
      return markAsSeenSuccess(state, action);
    case actionTypes.MARK_AS_SEEN_FAIL:
      return markAsSeenFail(state, action);

    case actionTypes.UPDATE_ACTIVITY_START:
      return updateActivityStart(state, action);
    case actionTypes.UPDATE_ACTIVITY_SUCCESS:
      return updateActivitySuccess(state, action);
    case actionTypes.UPDATE_ACTIVITY_FAIL:
      return updateActivityFail(state, action);

    case actionTypes.FETCH_CONFIG_START:
      return fetchConfigurationStart(state, action);
    case actionTypes.FETCH_CONFIG_SUCCESS:
      return fetchConfigurationSuccess(state, action);
    case actionTypes.FETCH_CONFIG_FAIL:
      return fetchConfigurationFail(state, action);

    case actionTypes.UPDATE_CONFIG_START:
      return updateConfigurationStart(state, action);
    case actionTypes.UPDATE_CONFIG_SUCCESS:
      return updateConfigurationSuccess(state, action);
    case actionTypes.UPDATE_CONFIG_FAIL:
      return updateConfigurationFail(state, action);

    case actionTypes.FETCH_STUDENTS_START:
      return fetchStudentsStart(state, action);
    case actionTypes.FETCH_STUDENTS_SUCCESS:
      return fetchStudentsSuccess(state, action);
    case actionTypes.FETCH_STUDENTS_FAIL:
      return fetchStudentsFail(state, action);

    case actionTypes.FETCH_MODULES_START:
      return fetchModulesStart(state, action);
    case actionTypes.FETCH_MODULES_SUCCESS:
      return fetchModulesSuccess(state, action);
    case actionTypes.FETCH_MODULES_FAIL:
      return fetchModulesFail(state, action);

    case actionTypes.UPLOAD_FILE_START:
      return uploadFileStart(state, action);
    case actionTypes.UPLOAD_FILE_SUCCESS:
      return uploadFileSuccess(state);
    case actionTypes.UPLOAD_FILE_FAIL:
      return uploadFileFail(state, action);

    case actionTypes.DELETE_FILES_START:
      return deleteFilesStart(state, action);
    case actionTypes.DELETE_FILES_SUCCESS:
      return deleteFilesSuccess(state);
    case actionTypes.DELETE_FILES_FAIL:
      return deleteFilesFail(state, action);

    case actionTypes.SET_COURSE:
      return setCourse(state, action);
    case actionTypes.SET_COURSES:
      return setCourses(state, action);

    case actionTypes.SET_TAB_LABELS:
      return setTabLabels(state, action);

    case actionTypes.SET_COURSE_PANEL:
      return setCoursePanel(state, action);

    case actionTypes.SET_TAB:
      return setTab(state, action);

    case actionTypes.SET_LOADING:
      return setLoading(state, action);

    case actionTypes.SET_SUCCESS_MESSAGE:
      return setSuccessMessage(state, action);

    case actionTypes.SET_FAIL_MESSAGE:
      return setFailMessage(state, action);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    case actionTypes.RETURN_TO_COURSES:
      return returnToCourses(state, action);

    case actionTypes.HIDE_COURSE_DETAILS:
      return hideCourseDetails(state, action);

    case actionTypes.SET_EDITING:
      return setEditing(state);

    case actionTypes.CANCEL_EDITING:
      return cancelEditing(state);

    case actionTypes.OPEN_MODAL:
      return openModal(state, action);

    case actionTypes.CLOSE_MODAL:
      return closeModal(state);

    case actionTypes.SET_SESSION_ALERT:
      return setSessionAlert(state, action);

    case actionTypes.SET_THEME:
      return setTheme(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);
    default:
      return state;
  }
};

export default reducer;
