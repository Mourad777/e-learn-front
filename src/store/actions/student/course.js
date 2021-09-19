import * as actionTypes from "../actionTypes";

export const showStudentCourseSyllabus = (course) => {
  return {
    type: actionTypes.SHOW_STUDENT_COURSE_SYLLABUS,
    course: course,
  };
};
export const clearStudentModalStates = () => {
  return {
    type: actionTypes.CLEAR_STUDENT_MODAL_STATES,
  };
};

export const confirmingEnrollment = (course) => {
  return {
    type: actionTypes.CONFIRMING_ENROLLMENT,
    course: course,
  };
};

export const confirmingDropCourse = (course) => {
  return {
    type: actionTypes.CONFIRMING_DROP_COURSE,
    course: course,
  };
};

export const showStudentCourseDetails = (courseId) => {
  return {
    type: actionTypes.SHOW_STUDENT_COURSE_DETAILS,
    courseId: courseId,
  };
};

export const selectCourse = (courseId) => {
  return {
    type: actionTypes.SELECT_COURSE,
    courseId: courseId,
  };
};

export const enrollRequestStart = (student, course, token) => {
  return {
    type: actionTypes.ENROLL_REQUEST_START,
    payload:{
      student, course, token
    }
  };
};

export const enrollRequestSuccess = (message) => {
  return {
    type: actionTypes.ENROLL_REQUEST_SUCCESS,
    message:message,
  };
};

export const enrollRequestFail = (message) => {
  return {
    type: actionTypes.ENROLL_REQUEST_FAIL,
    message:message,
  };
};

export const enrollCourseStart = (studentId, courseId, token, history, isAutoEnroll) => {
  return {
    type: actionTypes.ENROLL_COURSE_START,
    payload:{
      studentId, courseId, token, history, isAutoEnroll
    }
  };
};

export const enrollCourseSuccess = (message) => {
  return {
    type: actionTypes.ENROLL_COURSE_SUCCESS,
    message:message,
  };
};

export const enrollCourseFail = (message) => {
  return {
    type: actionTypes.ENROLL_COURSE_FAIL,
    message:message,
  };
};

export const enrollDenyStart = (student, course, token, reason, allowResubmission, history) => {
  return {
    type: actionTypes.ENROLL_DENY_START,
    payload:{
      student, course, token, reason, allowResubmission, history,
    }
  };
};

export const enrollDenySuccess = (message) => {
  return {
    type: actionTypes.ENROLL_DENY_SUCCESS,
    message:message,
  };
};

export const enrollDenyFail = (message) => {
  return {
    type: actionTypes.ENROLL_DENY_FAIL,
    message:message,
  };
};


export const dropCourseStart = (student, course, token) => {
  return {
    type: actionTypes.DROP_COURSE_START,
    payload:{
      student, course, token
    }
  };
};

export const dropCourseSuccess = (message) => {
  return {
    type: actionTypes.DROP_COURSE_SUCCESS,
    message:message,
  };
};

export const dropCourseFail = (message) => {
  return {
    type: actionTypes.DROP_COURSE_FAIL,
    message:message,
  };
};

export const setStudentTab = (tab) => {
  return {
    type: actionTypes.SET_STUDENT_TAB,
    tab: tab,
  };
};

export const clearStudentNotification = () => {
  return {
    type: actionTypes.CLEAR_STUDENT_NOTIFICATION,
  };
};

export const clearLoadedStudentData = () => {
  return {
    type: actionTypes.CLEAR_LOADED_STUDENT_DATA,
  };
};