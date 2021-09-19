import * as actionTypes from "../actionTypes";

export const selectLesson = (lesson) => {
  return {
    type: actionTypes.SELECT_LESSON,
    lesson: lesson,
  };
};

export const fetchLessonStart = (lessonId,token) => {
  return {
    type: actionTypes.FETCH_LESSON_START,
    payload:{
      lessonId,
      token,
    }
  };
};

export const fetchLessonSuccess = (formData, lessonId) => {
  return {
    type: actionTypes.FETCH_LESSON_SUCCESS,
    formData: formData,
    lessonId: lessonId,
  };
};

export const fetchLessonFail = (message) => {
  return {
    type: actionTypes.FETCH_LESSON_FAIL,
    message: message,
  };
};

export const createLessonStart = (
  formValues,
  token,
  editing,
  course,
  filesToDelete
) => {
  return {
    type: actionTypes.CREATE_LESSON_START,
    payload: {
      formValues,
      token,
      editing,
      course,
      filesToDelete,
    },
  };
};

export const createLessonSuccess = (message) => {
  return {
    type: actionTypes.CREATE_LESSON_SUCCESS,
    message: message,
  };
};

export const createLessonFail = (message) => {
  return {
    type: actionTypes.CREATE_LESSON_FAIL,
    message: message,
  };
};

export const deleteLessonStart = (lessonId,token) => {
  return {
    type: actionTypes.DELETE_LESSON_START,
    payload:{
      lessonId,
      token,
    }
  };
};

export const deleteLessonSuccess = (message) => {
  return {
    type: actionTypes.DELETE_LESSON_SUCCESS,
    message: message,
  };
};

export const deleteLessonFail = (message) => {
  return {
    type: actionTypes.DELETE_LESSON_FAIL,
    message: message,
  };
};

export const setCreateLessonForm = (initialValues) => {
  return {
    type: actionTypes.SET_CREATE_LESSON_FORM,
    initialValues: initialValues,
  };
};