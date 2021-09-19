import * as actionTypes from "../actionTypes";

export const fetchStudentsStart = (courseId,token,action,spinner) => {
    return {
      type: actionTypes.FETCH_STUDENTS_START,
      payload:{
        token,
        courseId,
        action,
        spinner,
      }
    };
  };
  
  export const fetchStudentsSuccess = (students) => {
    return {
      type: actionTypes.FETCH_STUDENTS_SUCCESS,
      students: students,
    };
  };
  
  export const fetchStudentsFail = (message) => {
    return {
      type: actionTypes.FETCH_STUDENTS_FAIL,
      message:message,
    };
  };