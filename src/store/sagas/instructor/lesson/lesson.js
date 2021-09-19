import {
  takeLatest,
  takeEvery,
  call,
  fork,
  put,
  delay,
} from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import {
  createLessonQuery,
  fetchLessonQuery,
  deleteLessonQuery,
} from "./queries";
import { getKey, uploadFile } from "../../../../utility/uploadFile";
import { urlKeyConverter } from "../../../../utility/urlKeyConverter";
import { adjustFormData } from "./adjustedLesson";
import i18n from "../../../../i18n/index";
import history from "../../../../utility/history";

function* createLesson({
  payload: { formValues, token, editing, course, filesToDelete },
}) {
  const path = `courses/${course}/lessons/${formValues._id}`;
  const slideContent = formValues.slides.map((slide) => {
    if (!slide.videoContent) return slide.slideContent;
    return "";
  });

  const audioFiles = (formValues.slides || []).map((slide) => slide.audioFile);
  const videoFiles = (formValues.slides || []).map((slide) => slide.videoFile);

  const audioKeys = audioFiles.map((file, i) => {
    let key;
    if (file instanceof File) {
      key = getKey(file, path);
    } else {
      key = urlKeyConverter(file);
    }
    if (((formValues.slides || [])[i] || {}).videoContent) key = "";
    return key;
  });

  const videoKeys = videoFiles.map((file, i) => {
    let key;
    if (file instanceof File) {
      key = getKey(file, path);
    } else {
      key = urlKeyConverter(file);
    }
    if (!((formValues.slides || [])[i] || {}).videoContent) {
      key = "";
    }
    return key;
  });

  try {
    const graphqlQuery = createLessonQuery(
      formValues,
      slideContent,
      audioKeys,
      videoKeys,
      course,
      editing
    );
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Create lesson response: ", response);
    if (response.data.errors) {
      throw new Error("Creating or updating the lesson failed");
    }
    if (filesToDelete.length > 0)
      yield put(actions.deleteFilesStart(filesToDelete, token));
    yield put(actions.createLessonSuccess());
    history.goBack();
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("Error creating lesson: ", e);
    const failMessage = editing
      ? i18n.t("alerts.lesson.lessonUpdatedFail")
      : i18n.t("alerts.lesson.lessonCreatedFail");
    yield put(actions.createLessonFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  try {
    for (const i in audioFiles) {
      if (audioFiles.hasOwnProperty(i)) {
        //check to make sure slide has audio OR video but not both
        const isAudioSlide = !((formValues.slides || [])[i] || {}).videoContent;
        if (audioFiles[i] instanceof File && isAudioSlide) {
          yield call(uploadFile, audioFiles[i], audioKeys[i], token);
        }
      }
    }
  } catch (e) {
    const failMessage = i18n.t("alerts.lesson.uploadingAudioFail")
    yield put(actions.createLessonFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    console.log("Error uploading audio: ", e);
    return;
  }

  try {
    for (const i in videoFiles) {
      if (videoFiles.hasOwnProperty(i)) {
        const isVidoSlide = ((formValues.slides || [])[i] || {}).videoContent;
        if (videoFiles[i] instanceof File && isVidoSlide) {
          yield call(uploadFile, videoFiles[i], videoKeys[i], token);
        }
      }
    }
  } catch (e) {
    console.log("Error uploading video: ", e);
    const failMessage = i18n.t("alerts.lesson.uploadingVideoFail")
    yield put(actions.createLessonFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }
  yield put(actions.fetchCoursesStart(token));
  //fetch courses a second time once the files finish uploading
  //this seams appropriate since video files can take a long time to upload
  //I don't want the user to have to wait to see changes in a piece of text
  //while a video is uploading
}

function* fetchLesson({ payload: { lessonId, token } }) {
  const graphqlQuery = fetchLessonQuery(lessonId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Fetching lesson response", response);
    if (response.data.errors) {
      throw new Error("Fetching the lesson failed!");
    }
    const formData = response.data.data.lesson;
    const adjustedFormData = adjustFormData(formData);
    yield put(actions.fetchLessonSuccess(adjustedFormData, lessonId));
    // yield put(actions.setEditing());
    // yield put(actions.setTabLabels(["Lessons", "Edit lesson"]));

  } catch (e) {
    console.log("Failed to load the lesson", e);
    const failMessage = i18n.t("alerts.lesson.lessonRetrieveFail")
    yield put(actions.fetchLessonFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* deleteLesson({ payload }) {
  const { lessonId, token } = payload;
  const graphqlQuery = deleteLessonQuery(lessonId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Deleting lesson response: ", response);
    if (response.data.errors) {
      throw new Error("Deleting the lesson failed");
    }
    yield put(actions.fetchCoursesStart(token));
    yield put(actions.closeModal());
    yield put(actions.setTab(0));
    const successMessage = i18n.t("alerts.lesson.lessonDeleteSuccess")
    yield put(actions.deleteLessonSuccess(successMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("Failed to delete the lesson", e);
    const failMessage = i18n.t("alerts.lesson.lessonDeleteFail")
    yield put(actions.deleteLessonFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchfetchLesson() {
  yield takeEvery(actionTypes.FETCH_LESSON_START, fetchLesson);
}

function* watchCreateLesson() {
  yield takeLatest(actionTypes.CREATE_LESSON_START, createLesson);
}

function* watchDeleteLesson() {
  yield takeEvery(actionTypes.DELETE_LESSON_START, deleteLesson);
}

const instructorLessonSagas = [
  fork(watchCreateLesson),
  fork(watchfetchLesson),
  fork(watchDeleteLesson),
];

export default instructorLessonSagas;
