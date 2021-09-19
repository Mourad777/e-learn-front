import * as actionTypes from "../actionTypes";

export const selectTest = (test) => {
  return {
    type: actionTypes.SELECT_TEST,
    test: test,
  };
};

export const selectAssignment = (assignment) => {
  return {
    type: actionTypes.SELECT_ASSIGNMENT,
    assignment: assignment,
  };
};

export const setInitialGradeValues = (gradeValues) => {
  return {
    type: actionTypes.SET_INITIAL_GRADE_VALUES,
    gradeValues: gradeValues,
  };
};

export const setInitialTestFormValues = (initialValues) => {
  return {
    type: actionTypes.SET_INITIAL_TEST_FORM_VALUES,
    initialValues,
  };
};

export const setTestToGrade = (test, student) => {
  return {
    type: actionTypes.SET_TEST_TO_GRADE,
    test: test,
    student: student,
  };
};

export const clearTestToGrade = () => {
  return {
    type: actionTypes.CLEAR_TEST_TO_GRADE,
  };
};

export const createUpdateTestStart = (
  formData,
  token,
  editing,
  courseId,
  instructorId,
  testId,
  formType,
  filesToDelete
) => {
  return {
    type: actionTypes.CREATE_UPDATE_TEST_START,
    payload: {
      formData,
      token,
      editing,
      courseId,
      instructorId,
      testId,
      formType,
      filesToDelete,
    },
  };
};

export const createUpdateTestSuccess = (message) => {
  return {
    type: actionTypes.CREATE_UPDATE_TEST_SUCCESS,
    message: message,
  };
};

export const createUpdateTestFail = (message) => {
  return {
    type: actionTypes.CREATE_UPDATE_TEST_FAIL,
    message: message,
  };
};

export const deleteTestStart = (testId, token) => {
  return {
    type: actionTypes.DELETE_TEST_START,
    payload: {
      testId,
      token,
    },
  };
};

export const deleteTestSuccess = (message) => {
  return {
    type: actionTypes.DELETE_TEST_SUCCESS,
    message: message,
  };
};

export const deleteTestFail = (message) => {
  return {
    type: actionTypes.DELETE_TEST_FAIL,
    message: message,
  };
};

export const resetTestStart = (testId, studentId,courseId,message,token) => {
  return {
    type: actionTypes.RESET_TEST_START,
    payload: {
      testId,
      token,
      studentId,
      courseId,
      message,
    },
  };
};

export const resetTestSuccess = (message) => {
  return {
    type: actionTypes.RESET_TEST_SUCCESS,
    message: message,
  };
};

export const resetTestFail = (message) => {
  return {
    type: actionTypes.RESET_TEST_FAIL,
    message: message,
  };
};

export const gradeTestStart = (
  formValues,
  token,
  studentId,
  test,
  graded,
  marking,
  sectionGrades,
  gradingInProgress,
  grade,
  filesToDelete,
  filePath,
  history,
) => {
  return {
    type: actionTypes.GRADE_TEST_START,
    payload: {
      formValues,
      token,
      studentId,
      test,
      graded,
      marking,
      sectionGrades,
      gradingInProgress,
      grade,
      filesToDelete,
      filePath,
      history,
    },
  };
};

export const gradeTestSuccess = (message) => {
  return {
    type: actionTypes.GRADE_TEST_SUCCESS,
    message: message,
  };
};

export const gradeTestFail = (message) => {
  return {
    type: actionTypes.GRADE_TEST_FAIL,
    message: message,
  };
};

export const closeTestStart = (testId, studentId, token, instructorTest,isExcused, history) => {
  return {
    type: actionTypes.CLOSE_TEST_START,
    payload: {
      testId,
      studentId,
      token,
      instructorTest,
      isExcused,
      history,
    },
  };
};

export const closeTestSuccess = (test, student) => {
  return {
    type: actionTypes.CLOSE_TEST_SUCCESS,
    test: test,
    student: student,
  };
};

export const closeTestFail = (message) => {
  return {
    type: actionTypes.CLOSE_TEST_FAIL,
    message: message,
  };
};

export const setInstructorTestSection = (section) => {
  return {
    type: actionTypes.SET_INSTRUCTOR_TEST_SECTION,
    section: section,
  };
};

export const setTestFormSection = (testSection) => {
  return {
    type: actionTypes.SET_TEST_FORM_SECTION,
    testSection,
  };
};