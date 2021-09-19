import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { studentTestResultsQuery, studentSubmitTestQuery } from "./queries";
import { formatQuestions } from "./formatQuestions";
import { getKey, uploadFile } from "../../../../utility/uploadFile";
import { urlKeyConverter } from "../../../../utility/urlKeyConverter";
import i18n from "../../../../i18n/index";


function* fetchStudentTestResults({ payload: { token } }) {
  const graphqlQuery = studentTestResultsQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Getting student test results response", response);
    if (response.data.errors) {
      throw new Error("Getting the test results failed!");
    }
    const resData = response.data.data;
    yield put(actions.fetchTestResultsSuccess((resData || []).testResults));
    const testInSession = (
      ((resData || {}).testResults || {}).testInSession || {}
    ).test;

    const testDataInProgress = (
      ((resData || {}).testResults || {}).testResults || []
    ).find((result) => result.closed === false && result.test === testInSession);
    if (testInSession) {
      yield put(
        actions.fetchTestStart(testInSession, true, token, testDataInProgress)
      );
    }
  } catch (e) {
    console.log(e);
    const failMessage = i18n.t("alerts.test.fetchTestResultsFail");
    yield put(actions.fetchTestResultsFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* submitTest({
  payload: {
    formValues,
    token,
    studentId,
    testClosed,
    test,
    courseId,
    filesToDelete,
    exitAssignment,
    filePath,
    history,
  },
}) {
  const audioFiles = ((test || {}).speakingQuestions || []).map(
    (item, index) => {
      const answer = ((formValues || {}).speakingQuestions || [])[index];
      return (answer || {}).audioFile;
    }
  );

  const answerAudioKeys = audioFiles.map((file, i) => {
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
    formattedMultipleChoiceAnswers,
    formattedEssayAnswers,
    formattedSpeakingAnswers,
    formattedFillBlankAnswers,
  } = formatQuestions(formValues, test, answerAudioKeys);

  const graphqlQuery = studentSubmitTestQuery(
    studentId,
    test,
    testClosed,
    formattedMultipleChoiceAnswers,
    formattedEssayAnswers,
    formattedSpeakingAnswers,
    formattedFillBlankAnswers
  );

  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("test or assignment submit response: ", response);
    if (response.data.errors) {
      throw new Error("Submitting the test or assignment failed!");
    }
  } catch (e) {
    console.log("error submitting the test or assignment", e);
    const failMessage = testClosed
      ? i18n.t("alerts.test.studentTestSubmittedSuccess")
      : i18n.t("alerts.test.studentTestSavedSuccess");
    yield put(actions.submitTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  try {
    for (const i in audioFiles) {
      if (audioFiles.hasOwnProperty(i)) {
        if (audioFiles[i] instanceof File) {
          yield call(uploadFile, audioFiles[i], answerAudioKeys[i], token);
        }
      }
    }
  } catch (e) {
    console.log("Error uploading audio file: ", e);
    const failMessage = i18n.t("alerts.test.uploadAudioFail");
    yield put(actions.submitTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  //if uploading both the test and files succeeded
  yield put(actions.fetchTestResultsStart(token));
  if (!testClosed && !exitAssignment) {
    //fetching test after saving it
    yield put(actions.fetchTestStart(test._id, true, token, true));
  }
  if (filesToDelete.length > 0) {
    yield put(actions.deleteFilesStart(filesToDelete, token));
  }
  const successMessage = testClosed
    ? i18n.t("alerts.test.studentTestSubmittedSuccess")
    : i18n.t("alerts.test.studentTestSavedSuccess");

  yield put(actions.submitTestSuccess(testClosed, successMessage));
  if (testClosed) {
    console.log('pushing: ',`/student-panel/course/${courseId}/modules`)
    console.log('history in saga: ',history)
    history.push(`/student-panel/course/${courseId}/modules`);
    // yield put(actions.setTabLabels([""]));
    yield put(actions.fetchTestResultsStart(token));
    // yield put(actions.fetchCoursesStart(token));
    // yield put(actions.fetchModulesStart(courseId, token));
    // yield put(actions.fetchStudentsStart(courseId, token));
  }
  yield delay(3000);
  yield put(actions.clearAlert());
}

function* watchFetchStudentTestResults() {
  yield takeEvery(
    actionTypes.FETCH_TEST_RESULTS_START,
    fetchStudentTestResults
  );
}

function* watchSubmitTest() {
  yield takeEvery(actionTypes.SUBMIT_TEST_START, submitTest);
}

const studentTestSagas = [
  fork(watchFetchStudentTestResults),
  fork(watchSubmitTest),
];

export default studentTestSagas;
