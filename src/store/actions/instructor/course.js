import * as actionTypes from "../actionTypes";

export const finishEdit = () => {
  return {
    type: actionTypes.FINISH_EDIT,
  };
};

export const showCourseDetails = (courseId) => {
  return {
    type: actionTypes.SHOW_COURSE_DETAILS,
    courseId: courseId,
  };
};

export const hideCourseDetails = () => {
  return {
    type: actionTypes.HIDE_COURSE_DETAILS,
  };
};

export const fetchCoursesSuccess = (instructors) => {
  return {
    type: actionTypes.FETCH_INSTRUCTORS_SUCCESS,
    instructors: instructors,
  };
};

export const fetchTextEditorContent = (content, index) => {
  return {
    type: actionTypes.FETCH_TEXT_EDITOR_CONTENT,
    content: content,
  };
};

export const setInstructorTab = (tab) => {
  return {
    type: actionTypes.SET_INSTRUCTOR_TAB,
    tab: tab,
  };
};

export const clearInstructorModalStates = () => {
  return {
    type: actionTypes.CLEAR_INSTRUCTOR_MODAL_STATES,
  };
};

export const clearInstructorTabContent = () => {
  return {
    type: actionTypes.CLEAR_INSTRUCTOR_TAB_CONTENT,
  };
};

export const setCourseFormPage = (page) => {
  return {
    type: actionTypes.SET_COURSE_FORM_PAGE,
    page: page,
  };
};

export const fetchCourseStart = (courseId, token, changeStatus) => {
  return {
    type: actionTypes.FETCH_COURSE_START,
    payload: {
      courseId,
      token,
      changeStatus,
    },
  };
};

export const fetchCourseSuccess = (formData, courseId) => {
  return {
    type: actionTypes.FETCH_COURSE_SUCCESS,
    formData: formData,
    courseId: courseId,
  };
};

export const fetchCourseFail = (message) => {
  return {
    type: actionTypes.FETCH_COURSE_FAIL,
    message: message,
  };
};

export const gradeCourseStart = (formValues,studentId, courseId,suggestedGrade, passed, token, history) => {
  return {
    type: actionTypes.GRADE_COURSE_START,
    payload: {
      courseId,
      studentId,
      token,
      formValues,
      passed,
      suggestedGrade,
      history,
    },
  };
};

export const gradeCourseSuccess = (message) => {
  return {
    type: actionTypes.GRADE_COURSE_SUCCESS,
    message,
  };
};

export const gradeCourseFail = (message) => {
  return {
    type: actionTypes.GRADE_COURSE_FAIL,
    message: message,
  };
};

export const updateCourseResourcesStart = (courseId,resources,filesToDelete, token) => {
  return {
    type: actionTypes.UPDATE_COURSE_RESOURCES_START,
    payload: {
      courseId,
      resources,
      filesToDelete,
      token,
    },
  };
};

export const updateCourseResourcesSuccess = () => {
  return {
    type: actionTypes.UPDATE_COURSE_RESOURCES_SUCCESS,
  };
};

export const updateCourseResourcesFail = (message) => {
  return {
    type: actionTypes.UPDATE_COURSE_RESOURCES_FAIL,
    message: message,
  };
};

export const toggleCourseStateStart = (courseId, token) => {
  return {
    type: actionTypes.TOGGLE_COURSE_STATE_START,
    payload: {
      courseId,
      token,
    },
  };
};

export const toggleCourseStateSuccess = () => {
  return {
    type: actionTypes.TOGGLE_COURSE_STATE_SUCCESS,
  };
};

export const toggleCourseStateFail = (message) => {
  return {
    type: actionTypes.TOGGLE_COURSE_STATE_FAIL,
    message: message,
  };
};

export const createUpdateCourseStart = (
  formData,
  token,
  editing,
  courseId,
  changeStatus,
  filesToDelete,
  history,
) => {
  return {
    type: actionTypes.CREATE_UPDATE_COURSE_START,
    payload: {
      formData,
      token,
      editing,
      courseId,
      changeStatus,
      filesToDelete,
      history,
    },
  };
};

export const createUpdateCourseSuccess = (message) => {
  return {
    type: actionTypes.CREATE_UPDATE_COURSE_SUCCESS,
    message,
  };
};

export const createUpdateCourseFail = (message) => {
  return {
    type: actionTypes.CREATE_UPDATE_COURSE_FAIL,
    message,
  };
};

export const deleteCourseStart = (courseId,token) => {
  return {
    type: actionTypes.DELETE_COURSE_START,
    payload:{
      courseId,
      token,
    }
  };
};

export const deleteCourseSuccess = (message) => {
  return {
    type: actionTypes.DELETE_COURSE_SUCCESS,
    message: message,
  };
};

export const deleteCourseFail = (message) => {
  return {
    type: actionTypes.DELETE_COURSE_FAIL,
    message: message,
  };
};

export const setCreateCourseForm = () => {
  return {
    type: actionTypes.SET_CREATE_COURSE_FORM,
  };
};

export const clearInstructorNotification = () => {
  return {
    type: actionTypes.CLEAR_INSTRUCTOR_NOTIFICATION,
  };
};

export const clearLoadedInstructorData = () => {
  return {
    type: actionTypes.CLEAR_LOADED_INSTRUCTOR_DATA,
  };
};