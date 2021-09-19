import * as actionTypes from "../actionTypes";

export const fetchAllStudentsStart = (token,spinner) => {
    return {
      type: actionTypes.FETCH_ALL_STUDENTS_START,
      payload:{
        token,
        spinner,
      }
    };
  };
  
  export const fetchAllStudentsSuccess = (students) => {
    return {
      type: actionTypes.FETCH_ALL_STUDENTS_SUCCESS,
      students,
    };
  };
  
  export const fetchAllStudentsFail = (message) => {
    return {
      type: actionTypes.FETCH_ALL_STUDENTS_FAIL,
      message:message,
    };
  };