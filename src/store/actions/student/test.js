import * as actionTypes from "../actionTypes";

export const startTestConfirming = (test) => {
  return {
    type: actionTypes.START_TEST_CONFIRMING,
    test: test,
  };
};

export const startTest = (test) => {
  return {
    type: actionTypes.START_TEST,
    test: test,
  };
};

export const startAssignment = (assignment) => {
  return {
    type: actionTypes.START_ASSIGNMENT,
    assignment: assignment,
  };
};

export const setStudentTestSection = (section) => {
  return {
    type: actionTypes.SET_STUDENT_TEST_SECTION,
    section: section,
  };
};

export const testSaved = () => {
  return {
    type: actionTypes.STUDENT_TEST_SAVED,
  };
};

export const clearTestInProgress = () => {
  return {
    type: actionTypes.CLEAR_TEST_IN_PROGRESS,
  };
};

export const setIncompleteAssignmentsReferences = (assignments) => {
  return {
    type: actionTypes.SET_INCOMPLETE_ASSIGNMENTS_REFERENCES,
    assignments: assignments,
  };
};

export const exitAssignment = () => {
  return {
    type: actionTypes.EXIT_ASSIGNMENT,
  };
};

export const fetchTestResultsStart = (token,spinner) => {
  return {
    type: actionTypes.FETCH_TEST_RESULTS_START,
    payload: {
      token,
      spinner,
    },
  };
};

export const fetchTestResultsSuccess = (testResults) => {
  return {
    type: actionTypes.FETCH_TEST_RESULTS_SUCCESS,
    testResults: testResults,
  };
};

export const fetchTestResultsFail = (message) => {
  return {
    type: actionTypes.FETCH_TEST_RESULTS_FAIL,
    message: message,
  };
};


export const submitTestStart = (  
  formValues,
  token,
  studentId,
  testClosed,
  test,
  filesToDelete,
  exitAssignment,
  filePath,
  history,
  ) => {
  return {
    type: actionTypes.SUBMIT_TEST_START,
    payload:{
      formValues,
      token,
      studentId,
      testClosed,
      test,
      courseId:test.course,
      filesToDelete,
      exitAssignment,
      filePath,
      history,
    }
  };
};
export const submitTestSuccess = (testClosed, message) => {
  return {
    type: actionTypes.SUBMIT_TEST_SUCCESS,
    testClosed: testClosed,
    message: message,
  };
};

export const submitTestFail = (message) => {
  return {
    type: actionTypes.SUBMIT_TEST_FAIL,
    message: message,
  };
};