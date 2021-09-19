import * as actionTypes from "../actionTypes";

export const fetchTestStart = (testId, isStudent, token, testDataInProgress, studentResult,password) => {
  return {
    type: actionTypes.FETCH_TEST_START,
    payload: {
      testId,
      isStudent,
      token,
      testDataInProgress,
      studentResult,
      password,
    },
  };
};

export const fetchTestSuccess = (test, testDataInProgress) => {
  return {
    type: actionTypes.FETCH_TEST_SUCCESS,
    test,
    formData: testDataInProgress,
  };
};

export const fetchTestFail = (message) => {
  return {
    type: actionTypes.FETCH_TEST_FAIL,
    message: message,
  };
};
