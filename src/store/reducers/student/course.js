import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  loading: false,
  successMessage: null,
  failMessage: null,
};

const resetState = (state) => {
  return updateObject(state, {
    loading: false,
    successMessage: null,
    failMessage: null,
  });
};

const enrollRequestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const enrollRequestSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const enrollRequestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const enrollCourseStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const enrollCourseSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const enrollCourseFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const enrollDenyStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const enrollDenySuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const enrollDenyFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const dropCourseStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const dropCourseSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const dropCourseFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const showStudentCourseDetails = (state, action) => {
  return updateObject(state, {
    loading: false,
    courseDetailId: action.courseId,
    lessonDetail: true,
  });
};

const selectCourse = (state, action) => {
  return updateObject(state, {
    loading: false,
    courseDetailId: action.courseId,
  });
};

const returnToCourses = (state) => {
  return updateObject(state, {
    assignmentDetail: false,
    testDetail: false,
    lessonDetail: false,
    gradeDetail: false,
  });
};

const clearAlert = (state) => {
  return updateObject(state, {
    successMessage: null,
    failMessage: null,
  });
};

const fetchCoursesStart = (state, action) => {
  return updateObject(state, {
    loading: action.payload.spinner === "noSpinner" ? false : true,
  });
};

const fetchCoursesSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const fetchCoursesFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_COURSES_START:
      return fetchCoursesStart(state, action);
    case actionTypes.FETCH_COURSES_SUCCESS:
      return fetchCoursesSuccess(state, action);
    case actionTypes.FETCH_COURSES_FAIL:
      return fetchCoursesFail(state, action);
      
    case actionTypes.ENROLL_COURSE_START:
      return enrollCourseStart(state, action);
    case actionTypes.ENROLL_COURSE_SUCCESS:
      return enrollCourseSuccess(state, action);
    case actionTypes.ENROLL_COURSE_FAIL:
      return enrollCourseFail(state, action);

    case actionTypes.ENROLL_REQUEST_START:
      return enrollRequestStart(state, action);
    case actionTypes.ENROLL_REQUEST_SUCCESS:
      return enrollRequestSuccess(state, action);
    case actionTypes.ENROLL_REQUEST_FAIL:
      return enrollRequestFail(state, action);

    case actionTypes.ENROLL_DENY_START:
      return enrollDenyStart(state, action);
    case actionTypes.ENROLL_DENY_SUCCESS:
      return enrollDenySuccess(state, action);
    case actionTypes.ENROLL_DENY_FAIL:
      return enrollDenyFail(state, action);

    case actionTypes.DROP_COURSE_START:
      return dropCourseStart(state, action);
    case actionTypes.DROP_COURSE_SUCCESS:
      return dropCourseSuccess(state, action);
    case actionTypes.DROP_COURSE_FAIL:
      return dropCourseFail(state, action);

    case actionTypes.SHOW_STUDENT_COURSE_DETAILS:
      return showStudentCourseDetails(state, action);
    case actionTypes.SELECT_COURSE:
      return selectCourse(state, action);
    case actionTypes.RETURN_TO_COURSES:
      return returnToCourses(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    default:
      return state;
  }
};

export default reducer;
