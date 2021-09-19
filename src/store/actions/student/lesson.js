import * as actionTypes from "../actionTypes";

export const selectStudentLesson = (id) => {
  return {
    type: actionTypes.SELECT_STUDENT_LESSON,
    lesson:id,
  };
};

export const markSlideAsSeenStart = (lessonId, slideNumber, token, spinner) => {
  return {
    type: actionTypes.MARK_SLIDE_AS_SEEN_START,
    payload:{
      lessonId, slideNumber, token, spinner
    }
  };
};

export const markSlideAsSeenSuccess = (message) => {
  return {
    type: actionTypes.MARK_SLIDE_AS_SEEN_SUCCESS,
    message:message,
  };
};

export const markSlideAsSeenFail = (message) => {
  return {
    type: actionTypes.MARK_SLIDE_AS_SEEN_FAIL,
    message:message,
  };
};