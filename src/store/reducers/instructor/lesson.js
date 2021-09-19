import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  loadedLessonFormData: null,
  loading: false,
  successMessage: null,
  failMessage: null,
};

const resetState = (state) => {
  return updateObject(state, {
    loadedLessonFormData: null,
    loading: false,
    successMessage: null,
    failMessage: null,
  });
};

const fetchLessonStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchLessonSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    loadedLessonFormData: action.formData,
  });
};

const fetchLessonFail = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const createLessonStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const createLessonSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    loadedLessonFormData: null,
  });
};

const createLessonFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message
  });
};

const deleteLessonStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const deleteLessonSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const deleteLessonFail = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const setCreateLessonForm = (state, action) => {
  return updateObject(state, {
    //serves as a placeholder since the course form needs
    //something in loadedcourseformdata to be rendered,
    //the purpose for this is to only render the editing
    //course form with the loaded data before rendering
    //because i need to extract the initial urls to compare
    //them with the updated urls to know which files to delete
    //and which files to keep
    loadedLessonFormData: action.initialValues,
  });
};

const clearAlert = (state) => {
  return updateObject(state, {
    successMessage: null,
    failMessage: null,
  });
};

const clearLoadedData = (state) => {
  return updateObject(state, {
    loadedLessonFormData: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LESSON_START:
      return fetchLessonStart(state);
    case actionTypes.FETCH_LESSON_SUCCESS:
      return fetchLessonSuccess(state, action);
    case actionTypes.FETCH_LESSON_FAIL:
      return fetchLessonFail(state, action);

    case actionTypes.CREATE_LESSON_START:
      return createLessonStart(state);
    case actionTypes.CREATE_LESSON_SUCCESS:
      return createLessonSuccess(state, action);
    case actionTypes.CREATE_LESSON_FAIL:
      return createLessonFail(state, action);

    case actionTypes.DELETE_LESSON_START:
      return deleteLessonStart(state);
    case actionTypes.DELETE_LESSON_SUCCESS:
      return deleteLessonSuccess(state, action);
    case actionTypes.DELETE_LESSON_FAIL:
      return deleteLessonFail(state, action);

    case actionTypes.SET_CREATE_LESSON_FORM:
      return setCreateLessonForm(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    case actionTypes.CLEAR_LOADED_INSTRUCTOR_DATA:
      return clearLoadedData(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);
    default:
      return state;
  }
};

export default reducer;
