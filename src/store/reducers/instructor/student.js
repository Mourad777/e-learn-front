import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  loading: false,
  successMessage: null,
  failMessage: null,
  allStudents: null,
};

const resetState = (state) => {
  return updateObject(state, {
    loading: false,
    successMessage: null,
    failMessage: null,
    allStudents: null
  });
};

const fetchAllStudentsStart = (state, action) => {
  return updateObject(state, {
    // loading: action.spinner === "noSpinner" ? true : false,
    loading: true,
  });
};

const fetchAllStudentsSuccess = (state, action) => {
  return updateObject(state, {
    allStudents: action.students,
    loading: false,
  });
};

const fetchAllStudentsFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
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

    case actionTypes.FETCH_ALL_STUDENTS_START:
      return fetchAllStudentsStart(state, action);
    case actionTypes.FETCH_ALL_STUDENTS_SUCCESS:
      return fetchAllStudentsSuccess(state, action);
    case actionTypes.FETCH_ALL_STUDENTS_FAIL:
      return fetchAllStudentsFail(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    default:
      return state;
  }
};

export default reducer;
