import * as actionTypes from "../actionTypes";

export const fetchInstructorsStart = (token) => {
  return {
    type: actionTypes.FETCH_INSTRUCTORS_START,
    payload:{
      token
    }
  };
};

export const fetchInstructorsSuccess = (instructors) => {
  return {
    type: actionTypes.FETCH_INSTRUCTORS_SUCCESS,
    instructors,
  };
};

export const fetchInstructorsFail = (message) => {
  return {
    type: actionTypes.FETCH_INSTRUCTORS_FAIL,
    message: message,
  };
};