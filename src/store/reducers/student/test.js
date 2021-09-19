import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  testReviewing: null,
  testInSession: null,
  assignmentInSession: null,
  testResults: null,
  loading: false,
  successMessage: null,
  failMessage: null,
};

const resetState = (state) => {
  return updateObject(state, {
    testReviewing: null,
    testInSession: null,
    assignmentInSession: null,
    testResults: null,
    loading: false,
    successMessage: null,
    failMessage: null,
  });
};

const startTest = (state, action) => {
  return updateObject(state, {
    testInSession: action.test,
  });
};

const startAssignment = (state, action) => {
  return updateObject(state, {
    assignmentInSession: action.assignment,
  });
};

const clearTestInProgress = (state) => {
  return updateObject(state, {
    loadedTestDataInProgress: null,
  });
};

const fetchTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchTestSuccess = (state, action) => {
  if ((action.test || {}).testResult) {
    return updateObject(state, {
      testReviewing: action.test,
      loading: false,
    });
  }
  return updateObject(state, {
    loadedTestDataInProgress: action.formData,
    loading: false,
  });
};

const fetchTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const fetchTestResultsStart = (state, action) => {
  return updateObject(state, {
    loading: action.spinner === "noSpinner" ? true : false,
  });
};

const fetchTestResultsSuccess = (state, action) => {
  return updateObject(state, {
    testResults: action.testResults,
    loading: false,
  });
};

const fetchTestResultsFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const submitTestStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const submitTestSuccess = (state, action) => {
  if (action.testClosed) {
    return updateObject(state, {
      loading: false,
      testInSession: null,
      assignmentInSession: null,
      loadedTestDataInProgress: null,
      successMessage: action.message,
    });
  }
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const submitTestFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const setTestResults = (state, action) => {
  return updateObject(state, {
    testResults: action.testResults,
  });
};

const exitAssignment = (state) => {
  return updateObject(state, {
    assignmentInSession: null,
    loadedTestDataInProgress: null,
  });
};

const clearTestProgress = (state) => {
  return updateObject(state, {
    loadedTestDataInProgress: null,
  });
};

const clearAlert = (state) => {
  return updateObject(state, {
    successMessage: null,
    failMessage: null,
  });
};

const returnToCourses = (state) => {
  return updateObject(state, {
    testInSession: null,
    assignmentInSession: null,
    loadedTestDataInProgress: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TEST_START:
      return fetchTestStart(state, action);
    case actionTypes.FETCH_TEST_SUCCESS:
      return fetchTestSuccess(state, action);
    case actionTypes.FETCH_TEST_FAIL:
      return fetchTestFail(state, action);

    case actionTypes.FETCH_TEST_RESULTS_START:
      return fetchTestResultsStart(state, action);
    case actionTypes.FETCH_TEST_RESULTS_SUCCESS:
      return fetchTestResultsSuccess(state, action);
    case actionTypes.FETCH_TEST_RESULTS_FAIL:
      return fetchTestResultsFail(state, action);

    case actionTypes.SUBMIT_TEST_START:
      return submitTestStart(state, action);
    case actionTypes.SUBMIT_TEST_SUCCESS:
      return submitTestSuccess(state, action);
    case actionTypes.SUBMIT_TEST_FAIL:
      return submitTestFail(state, action);

    case actionTypes.START_TEST:
      return startTest(state, action);
    case actionTypes.START_ASSIGNMENT:
      return startAssignment(state, action);

    case actionTypes.EXIT_ASSIGNMENT:
      return exitAssignment(state);
    case actionTypes.CLEAR_TEST_IN_PROGRESS:
      return clearTestInProgress(state);
    // case actionTypes.CLEAR_STUDENT_MODAL_STATES:
    //   return clearModalStates(state);

    case actionTypes.FETCH_TEST_RESULTS:
      return setTestResults(state, action);

    case actionTypes.CLEAR_LOADED_STUDENT_DATA:
      return clearTestProgress(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    case actionTypes.RETURN_TO_COURSES:
      return returnToCourses(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    default:
      return state;
  }
};

export default reducer;
