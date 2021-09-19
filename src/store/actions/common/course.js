import * as actionTypes from "../actionTypes";

export const setCourse = (course) => {
  return {
    type: actionTypes.SET_COURSE,
    course,
  };
};

export const setCourses = (courses) => {
  return {
    type: actionTypes.SET_COURSES,
    courses,
  };
};

export const returnToCourses = () => {
  return {
    type: actionTypes.RETURN_TO_COURSES,
  };
};

export const fetchCoursesStart = (token,spinner) => {
  return {
    type: actionTypes.FETCH_COURSES_START,
    payload:{
      token,
      spinner,
    }
  };
};

export const fetchCoursesSuccess = (courses) => {
  return {
    type: actionTypes.FETCH_COURSES_SUCCESS,
    courses: courses,
  };
};

export const fetchCoursesFail = (message) => {
  return {
    type: actionTypes.FETCH_COURSES_FAIL,
    message:message,
  };
};

export const setCoursePanel = (panel) => {
  return {
    type: actionTypes.SET_COURSE_PANEL,
    panel,
  };
};