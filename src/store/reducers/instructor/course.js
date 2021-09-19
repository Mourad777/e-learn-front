import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  loadedCourseFormData: null,
  instructors: null,
  courseFormPage: 1,
  loading: false,
  successMessage: null,
  failMessage: null,
};

const resetState = (state) => {
  return updateObject(state, {
    loadedCourseFormData: null,
    instructors: null,
    courseFormPage: 1,
    loading: false,
    successMessage: null,
    failMessage: null,
  });
};

const createUpdateCourseStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const createUpdateCourseSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    courseFormPage: 1,
    loadedCourseFormData: null,
  });
};

const createUpdateCourseFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const updateCourseResourcesStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const updateCourseResourcesSuccess = (state) => {
  return updateObject(state, {
    loading: false,
  });
};

const updateCourseResourcesFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const toggleCourseStateStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const toggleCourseStateSuccess = (state) => {
  return updateObject(state, {
    loading: false,
  });
};

const toggleCourseStateFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const deleteCourseStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const deleteCourseSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const deleteCourseFail = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const fetchInstructorsStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchInstructorsSuccess = (state, action) => {
  return updateObject(state, {
    instructors: action.instructors,
    loading: false,
  });
};

const fetchInstructorsFail = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const gradeCourseStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const gradeCourseSuccess = (state, action) => {
  return updateObject(state, {
    successMessage: action.message,
    loading: false,
  });
};

const gradeCourseFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const fetchCourseStart = (state, action) => {
  return updateObject(state, {
    loading: action.spinner === "noSpinner" ? true : false,
  });
};

const fetchCourseSuccess = (state, action) => {
  return updateObject(state, {
    loadedCourseFormData: action.formData,
    loading: false,
  });
};

const fetchCourseFail = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const showCourseDetails = (state, action) => {
  return updateObject(state, {
    courseDetailId: action.courseId,
  });
};

const hideCourseDetails = (state) => {
  return updateObject(state, {
    courseDetailId: null,
    loadedCategoryFormData: null,
  });
};

const returnToCourses = (state) => {
  return updateObject(state, {
    courseDetailId: null,
    loadedCategoryFormData: null,
  });
};

const setCourseFormPage = (state, action) => {
  return updateObject(state, {
    courseFormPage: action.page,
  });
};

const setCreateCourseForm = (state) => {
  return updateObject(state, {
    loadedCourseFormData: {},
  });
};

const clearLoadedData = (state) => {
  return updateObject(state, {
    loadedCourseFormData: null,
  });
};

const clearModalStates = (state) => {
  return updateObject(state, {
    confirmingDeletingCourse: null,
  });
};

const clearAlert = (state) => {
  return updateObject(state, {
    successMessage: null,
    failMessage: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_INSTRUCTORS_START:
      return fetchInstructorsStart(state);
    case actionTypes.FETCH_INSTRUCTORS_SUCCESS:
      return fetchInstructorsSuccess(state, action);
    case actionTypes.FETCH_INSTRUCTORS_FAIL:
      return fetchInstructorsFail(state, action);

    case actionTypes.FETCH_COURSE_START:
      return fetchCourseStart(state, action);
    case actionTypes.FETCH_COURSE_SUCCESS:
      return fetchCourseSuccess(state, action);
    case actionTypes.FETCH_COURSE_FAIL:
      return fetchCourseFail(state, action);

    case actionTypes.GRADE_COURSE_START:
      return gradeCourseStart(state, action);
    case actionTypes.GRADE_COURSE_SUCCESS:
      return gradeCourseSuccess(state, action);
    case actionTypes.GRADE_COURSE_FAIL:
      return gradeCourseFail(state, action);

    case actionTypes.CREATE_UPDATE_COURSE_START:
      return createUpdateCourseStart(state);
    case actionTypes.CREATE_UPDATE_COURSE_SUCCESS:
      return createUpdateCourseSuccess(state, action);
    case actionTypes.CREATE_UPDATE_COURSE_FAIL:
      return createUpdateCourseFail(state, action);

    case actionTypes.UPDATE_COURSE_RESOURCES_START:
      return updateCourseResourcesStart(state, action);
    case actionTypes.UPDATE_COURSE_RESOURCES_SUCCESS:
      return updateCourseResourcesSuccess(state, action);
    case actionTypes.UPDATE_COURSE_RESOURCES_FAIL:
      return updateCourseResourcesFail(state, action);

    case actionTypes.TOGGLE_COURSE_STATE_START:
      return toggleCourseStateStart(state, action);
    case actionTypes.TOGGLE_COURSE_STATE_SUCCESS:
      return toggleCourseStateSuccess(state, action);
    case actionTypes.TOGGLE_COURSE_STATE_FAIL:
      return toggleCourseStateFail(state, action);

    case actionTypes.DELETE_COURSE_START:
      return deleteCourseStart(state, action);
    case actionTypes.DELETE_COURSE_SUCCESS:
      return deleteCourseSuccess(state, action);
    case actionTypes.DELETE_COURSE_FAIL:
      return deleteCourseFail(state, action);

    case actionTypes.SHOW_COURSE_DETAILS:
      return showCourseDetails(state, action);
    case actionTypes.HIDE_COURSE_DETAILS:
      return hideCourseDetails(state, action);

    case actionTypes.RETURN_TO_COURSES:
      return returnToCourses(state, action);

    case actionTypes.CLEAR_LOADED_INSTRUCTOR_DATA:
      return clearLoadedData(state);

    case actionTypes.SET_COURSE_FORM_PAGE:
      return setCourseFormPage(state, action);
    case actionTypes.SET_CREATE_COURSE_FORM:
      return setCreateCourseForm(state, action);

    case actionTypes.CLEAR_INSTRUCTOR_MODAL_STATES:
      return clearModalStates(state);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    default:
      return state;
  }
};

export default reducer;
