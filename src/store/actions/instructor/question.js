import * as actionTypes from "../actionTypes";

export const setQuestionForm = (questionType, editing, questionFormData) => {
  return {
    type: actionTypes.SET_QUESTION_FORM,
    questionType: questionType,
    editing: editing,
    questionFormData: questionFormData,
  };
};

export const setQuestionEditing = (question) => {
  return {
    type: actionTypes.SET_QUESTION_EDITING,
    question: question,
  };
};

export const setQuestionDetail = (question) => {
  return {
    type: actionTypes.SET_QUESTION_DETAIL,
    question: question,
  };
};

export const fetchQuestionBankStart = (courseId, token) => {
  return {
    type: actionTypes.FETCH_QUESTION_BANK_START,
    payload: {
      courseId,
      token,
    },
  };
};

export const fetchQuestionBankSuccess = (questions) => {
  return {
    type: actionTypes.FETCH_QUESTION_BANK_SUCCESS,
    questions,
  };
};

export const fetchQuestionBankFail = (message) => {
  return {
    type: actionTypes.FETCH_QUESTION_BANK_FAIL,
    message: message,
  };
};

export const createUpdateQuestionStart = (
  formData,
  questionType,
  token,
  editing,
  courseId,
  filesToDelete
) => {
  return {
    type: actionTypes.CREATE_UPDATE_QUESTION_START,
    payload: {
      formData,
      questionType,
      token,
      editing,
      courseId,
      filesToDelete,
    },
  };
};

export const createUpdateQuestionSuccess = (message) => {
  return {
    type: actionTypes.CREATE_UPDATE_QUESTION_SUCCESS,
    message: message,
  };
};

export const createUpdateQuestionFail = (message) => {
  return {
    type: actionTypes.CREATE_UPDATE_QUESTION_FAIL,
    message: message,
  };
};

export const deleteQuestionStart = (questionId,token,courseId) => {
  return {
    type: actionTypes.DELETE_QUESTION_START,
    payload:{
      questionId,
      token,
      courseId,
    }
  };
};

export const deleteQuestionSuccess = (message) => {
  return {
    type: actionTypes.DELETE_QUESTION_SUCCESS,
    message: message,
  };
};

export const deleteQuestionFail = (message) => {
  return {
    type: actionTypes.DELETE_QUESTION_FAIL,
    message: message,
  };
};