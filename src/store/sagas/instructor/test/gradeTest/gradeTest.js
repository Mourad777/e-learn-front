import { call, fork, put, delay, takeLatest } from "redux-saga/effects";
import axiosGraphql from "../../../../actions/axios-base";
import * as actions from "../../../../actions/index";
import * as actionTypes from "../../../../actions/actionTypes";
import { gradeTestQuery } from "./query";
import { getKey, uploadFile } from "../../../../../utility/uploadFile";
import { formatResults } from "./formatResults";
import { urlKeyConverter } from "../../../../../utility/urlKeyConverter";
import i18n from "../../../../../i18n/index";

function* gradeTest({
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
}) {
  const audioFiles = ((formValues || {}).speakingSection || []).map(
    (q) => (q || {}).audioFile
  );

  const feedbackAudioKeys = audioFiles.map((file, i) => {
    let key;
    if (file instanceof File) {
      key = getKey(file, filePath);
    } else {
      key = urlKeyConverter(file);
    }
    if (!file) key = null;
    return key;
  });

  const {
    formattedMultipleChoiceResults,
    formattedEssayResults,
    formattedSpeakingResults,
    formattedFillBlankResults,
  } = formatResults(formValues, feedbackAudioKeys);

  const graphqlQuery = gradeTestQuery(
    formValues,
    formattedMultipleChoiceResults,
    formattedEssayResults,
    formattedSpeakingResults,
    formattedFillBlankResults,
    test._id,
    studentId,
    marking,
    grade,
    graded,
    gradingInProgress,
    sectionGrades
  );
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Grade test response", response);
    if (response.data.errors) {
      throw new Error(`Failed to ${graded ? "post" : "save"} the grades`);
    }
  } catch (e) {
    console.log("Failed to post or save the grades", e);
    const failMessage = graded
      ? i18n.t("alerts.test.postGradesFail")
      : i18n.t("alerts.test.saveGradesFail");
    yield put(actions.gradeTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  try {
    for (const i in audioFiles) {
      if (audioFiles.hasOwnProperty(i)) {
        if (audioFiles[i] instanceof File) {
          yield call(uploadFile, audioFiles[i], feedbackAudioKeys[i], token);
        }
      }
    }
  } catch (e) {
    console.log("Error uploading feedback audio file: ", e);
    const failMessage = i18n.t("alerts.test.uploadFeedbackAudioFail");
    yield put(actions.gradeTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  const successMessage = graded
    ? i18n.t("alerts.test.postGradesSuccess")
    : i18n.t("alerts.test.saveGradesSuccess");
  if ((filesToDelete || []).length > 0)
    yield put(actions.deleteFilesStart(filesToDelete, token));
  yield put(actions.fetchStudentsStart(test.course, token));
  yield put(actions.fetchCoursesStart(token));
  yield put(actions.gradeTestSuccess(successMessage));
  history.push(`/instructor-panel/course/${test.course}/grade-${test.assignment ? 'assignment' : 'test'}s`);
  console.log("after clear data action sent");
  yield delay(3000);
  yield put(actions.clearAlert());
}

function* watchGradeTest() {
  yield takeLatest(actionTypes.GRADE_TEST_START, gradeTest);
}

const instructorGradeTest = [fork(watchGradeTest)];

export default instructorGradeTest;
