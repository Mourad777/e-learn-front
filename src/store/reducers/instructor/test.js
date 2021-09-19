import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  loadedTestFormData: null,
  testFormSection: null,
  testGrading: null,
  studentGrading: null,
  initialGradeValues: null,
  testSection: null,
  testFormPage: 1,
  loading: false,
  successMessage: null,
  failMessage: null,
};

const resetState = (state) => {
  return updateObject(state, {
    loadedTestFormData: null,
    testFormSection: null,
    testGrading: null,
    studentGrading: null,
    initialGradeValues: null,
    testSection: null,
    testFormPage: 1,
    loading: false,
    successMessage: null,
    failMessage: null,
  });
};

const setTestSection = (state, action) => {
  return updateObject(state, {
    testSection: action.section,
  });
};

const fetchTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchTestSuccess = (state, action) => {
  return updateObject(state, {
    loadedTestFormData: action.formData,
    loading: false,
  });
};

const fetchTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const createUpdateTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const createUpdateTestSuccess = (state, action) => {
  return updateObject(state, {
    loadedTestFormData: null,
    loading: false,
    successMessage: action.message,
  });
};

const createUpdateTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const deleteTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const deleteTestSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const deleteTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const resetTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const resetTestSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const resetTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const closeTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const closeTestSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    testGrading: action.test,
    studentGrading: action.student,
  });
};

const closeTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const gradeTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const gradeTestSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const gradeTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const setTestFormSection = (state, action) => {
  return updateObject(state, {
    testFormSection: action.testSection,
  });
};

const setTestToGrade = (state, action) => {
  return updateObject(state, {
    testGrading: action.test,
    studentGrading: action.student,
  });
};

const setInitialGradeValues = (state, action) => {
  return updateObject(state, {
    initialGradeValues: action.gradeValues,
  });
};

const clearTestToGrade = (state) => {
  return updateObject(state, {
    testGrading: null,
    studentGrading: null,
  });
};

const clearLoadedData = (state) => {
  return updateObject(state, {
    initialGradeValues: null,
    loadedTestFormData: null,
    testFormPage: 1,
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
    case actionTypes.CREATE_UPDATE_TEST_START:
      return createUpdateTestStart(state, action);
    case actionTypes.CREATE_UPDATE_TEST_SUCCESS:
      return createUpdateTestSuccess(state, action);
    case actionTypes.CREATE_UPDATE_TEST_FAIL:
      return createUpdateTestFail(state, action);

    case actionTypes.FETCH_TEST_START:
      return fetchTestStart(state, action);
    case actionTypes.FETCH_TEST_SUCCESS:
      return fetchTestSuccess(state, action);
    case actionTypes.FETCH_TEST_FAIL:
      return fetchTestFail(state, action);

    case actionTypes.DELETE_TEST_START:
      return deleteTestStart(state, action);
    case actionTypes.DELETE_TEST_SUCCESS:
      return deleteTestSuccess(state, action);
    case actionTypes.DELETE_TEST_FAIL:
      return deleteTestFail(state, action);

    case actionTypes.RESET_TEST_START:
      return resetTestStart(state, action);
    case actionTypes.RESET_TEST_SUCCESS:
      return resetTestSuccess(state, action);
    case actionTypes.RESET_TEST_FAIL:
      return resetTestFail(state, action);

    case actionTypes.GRADE_TEST_START:
      return gradeTestStart(state, action);
    case actionTypes.GRADE_TEST_SUCCESS:
      return gradeTestSuccess(state, action);
    case actionTypes.GRADE_TEST_FAIL:
      return gradeTestFail(state, action);

    case actionTypes.CLOSE_TEST_START:
      return closeTestStart(state, action);
    case actionTypes.CLOSE_TEST_SUCCESS:
      return closeTestSuccess(state, action);
    case actionTypes.CLOSE_TEST_FAIL:
      return closeTestFail(state, action);

    case actionTypes.SET_TEST_FORM_SECTION:
      return setTestFormSection(state, action);
    case actionTypes.SET_TEST_TO_GRADE:
      return setTestToGrade(state, action);
    case actionTypes.SET_INITIAL_GRADE_VALUES:
      return setInitialGradeValues(state, action);
    case actionTypes.CLEAR_TEST_TO_GRADE:
      return clearTestToGrade(state);

    case actionTypes.CLEAR_LOADED_INSTRUCTOR_DATA:
      return clearLoadedData(state);

    case actionTypes.SET_INSTRUCTOR_TEST_SECTION:
      return setTestSection(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    default:
      return state;
  }
};

export default reducer;
