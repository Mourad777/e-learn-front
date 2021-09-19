import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  loadedQuestionFormData: null,
  questionBank: null,
  questionEditing: null,
  creatingQuestionType: null,
  loading: false,
  successMessage: null,
  failMessage: null,
};

const resetState = (state) => {
  return updateObject(state, {
    loadedQuestionFormData: null,
    questionBank: null,
    questionEditing: null,
    creatingQuestionType: null,
    loading: false,
    successMessage: null,
    failMessage: null,
  });
};

const fetchQuestionBankStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchQuestionBankSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    questionBank: action.questions,
  });
};

const fetchQuestionBankFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const createUpdateQuestionStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const createUpdateQuestionSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const createUpdateQuestionFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const deleteQuestionStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const deleteQuestionSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const deleteQuestionFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const setQuestionEditing = (state, action) => {
  return updateObject(state, {
    questionEditing: action.question,
  });
};

const setQuestionForm = (state, action) => {
  return updateObject(state, {
    creatingQuestionType: action.questionType,
    loadedQuestionFormData: action.questionFormData,
  });
};

const clearQuestionBank = (state) => {
  return updateObject(state, {
    questionBank: null,
  });
};

const clearLoadedData = (state) => {
  return updateObject(state, {
    loadedQuestionFormData: null,
    questionEditing:null,
    creatingQuestionType:null,
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
    case actionTypes.CREATE_UPDATE_QUESTION_START:
      return createUpdateQuestionStart(state, action);
    case actionTypes.CREATE_UPDATE_QUESTION_SUCCESS:
      return createUpdateQuestionSuccess(state, action);
    case actionTypes.CREATE_UPDATE_QUESTION_FAIL:
      return createUpdateQuestionFail(state, action);

    case actionTypes.FETCH_QUESTION_BANK_START:
      return fetchQuestionBankStart(state, action);
    case actionTypes.FETCH_QUESTION_BANK_SUCCESS:
      return fetchQuestionBankSuccess(state, action);
    case actionTypes.FETCH_QUESTION_BANK_FAIL:
      return fetchQuestionBankFail(state, action);

    case actionTypes.DELETE_QUESTION_START:
      return deleteQuestionStart(state, action);
    case actionTypes.DELETE_QUESTION_SUCCESS:
      return deleteQuestionSuccess(state, action);
    case actionTypes.DELETE_QUESTION_FAIL:
      return deleteQuestionFail(state, action);

    case actionTypes.CLEAR_LOADED_INSTRUCTOR_DATA:
      return clearLoadedData(state);

    case actionTypes.SET_QUESTION_FORM:
      return setQuestionForm(state, action);
    case actionTypes.SET_QUESTION_EDITING:
      return setQuestionEditing(state, action);

    case actionTypes.RETURN_TO_COURSES:
      return clearQuestionBank(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    default:
      return state;
  }
};

export default reducer;
