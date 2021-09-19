import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  selectedLesson: null,
  loading:false,
  successMessage:null,
  failMessage:null,
};

const markSlideAsSeenStart = (state,) => {
  return updateObject(state, {
    loading: false,
  });
};

const markSlideAsSeenSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const markSlideAsSeenFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const resetState = (state) => {
  return updateObject(state, {
    selectedLesson: null,
  });
};

const selectLesson = (state, action) => {
  return updateObject(state, {
    selectedLesson: action.lesson,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_STUDENT_LESSON:
      return selectLesson(state, action);

    case actionTypes.MARK_SLIDE_AS_SEEN_START:
      return markSlideAsSeenStart(state, action);
    case actionTypes.MARK_SLIDE_AS_SEEN_SUCCESS:
      return markSlideAsSeenSuccess(state, action);
    case actionTypes.MARK_SLIDE_AS_SEEN_FAIL:
      return markSlideAsSeenFail(state, action);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    default:
      return state;
  }
};

export default reducer;
