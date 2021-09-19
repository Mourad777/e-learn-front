import { takeLatest, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../../actions/axios-base";
import * as actions from "../../../../actions/index";
import * as actionTypes from "../../../../actions/actionTypes";
import { createUpdateQuestionQuery } from "./query";
import { getKey, uploadFile } from "../../../../../utility/uploadFile";
import { urlKeyConverter } from "../../../../../utility/urlKeyConverter";
import { formatFillblankQuestion } from "./formatFillblankQuestion";
import i18n from "../../../../../i18n/index";
import history from "../../../../../utility/history";
import { matchPath } from "react-router-dom";
import {createBrowserHistory} from 'history'
function* createUpdateQuestion({
  payload: {
    formData = {},
    questionType,
    token,
    editing,
    courseId,
    filesToDelete,
  },
}) {
  const path = `courses/${courseId}/questions/${formData._id}`;

  const answers = (formData.fillBlankQuestions || {}).answers || [];

  let fillInTheBlanksAudioKeys;
  if (questionType === "fillInBlank") {
    fillInTheBlanksAudioKeys = answers.map((a, i) => {
      let key = a;
      if (a.audioFile instanceof File) {
        key = getKey(a.audioFile, path);
      } else {
        key = urlKeyConverter(a.audioFile);
      }
      if (!a.audio) key = null;
      return key;
    });
  }

  let speakingSectionQuestionKey = "";
  let speakingSectionAnswerKey = "";
  let speakQFile;
  let speakAnsFile;
  const speakingQuestion = formData.speakingQuestion || [];

  if (questionType === "speaking") {
    speakQFile = speakingQuestion.map((item) => {
      if (item.audioQuestion) {
        return item.audioFileQuestion;
      }
      return item.question;
    })[0];

    if (speakQFile instanceof File) {
      speakingSectionQuestionKey = getKey(speakQFile, path);
    } else {
      speakingSectionQuestionKey = speakingQuestion[0].audioQuestion
        ? urlKeyConverter(speakQFile)
        : speakQFile;
    }

    speakAnsFile = speakingQuestion.map((item) => {
      if (item.audioAnswer) {
        return item.audioFile;
      }
      return "";
    })[0];

    if (speakAnsFile instanceof File) {
      speakingSectionAnswerKey = getKey(speakAnsFile, path);
    } else {
      speakingSectionAnswerKey = urlKeyConverter(speakAnsFile);
    }
  }

  try {
    const graphqlQuery = createUpdateQuestionQuery(
      formData,
      editing,
      courseId,
      questionType,
      speakingQuestion,
      speakingSectionQuestionKey,
      speakingSectionAnswerKey,
      formatFillblankQuestion(formData, answers, fillInTheBlanksAudioKeys)
    );

    const response = yield call(axiosGraphql, graphqlQuery, token);

    console.log("Create or update question response: ", response);
    if (response.data.errors) {
      throw new Error("Creating or updating the question failed");
    }
  } catch (e) {
    console.log("Error creating question: ", e);
    const failMessage = editing
      ? i18n.t("alerts.question.updateQuestionFail")
      : i18n.t("alerts.question.createQuestionFail");
    yield put(actions.createUpdateQuestionFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  if (questionType === "fillInBlank") {
    const fillBlankAudioFiles = answers.map((a) => {
      if (a.audio) return a.audioFile;
      return null;
    });
    try {
      for (const i in fillBlankAudioFiles) {
        if (fillBlankAudioFiles.hasOwnProperty(i)) {
          if (fillBlankAudioFiles[i] instanceof File) {
            yield call(
              uploadFile,
              fillBlankAudioFiles[i],
              fillInTheBlanksAudioKeys[i],
              token
            );
          }
        }
      }
    } catch (e) {
      console.log("Error fill in the blanks section audio files: ", e);
      const failMessage = i18n.t(
        "alerts.question.uploadingFillblanksAudioFail"
      );
      yield put(actions.createUpdateQuestionFail(failMessage));
      yield delay(3000);
      yield put(actions.clearAlert());
      return;
    }
  }
  if (questionType === "speaking") {
    try {
      if (speakQFile instanceof File) {
        yield call(uploadFile, speakQFile, speakingSectionQuestionKey, token);
      }
    } catch (e) {
      console.log("Error uploading speaking question audio file: ", e);
      const failMessage = i18n.t(
        "alerts.question.uploadingSpeakingQuestionAudioFail"
      );
      yield put(actions.createUpdateQuestionFail(failMessage));
      yield delay(3000);
      yield put(actions.clearAlert());
      return;
    }

    try {
      if (speakAnsFile instanceof File) {
        yield call(uploadFile, speakAnsFile, speakingSectionAnswerKey, token);
      }
    } catch (e) {
      console.log("Error uploading speaking answer audio file: ", e);
      const failMessage = i18n.t(
        "alerts.question.uploadingSpeakingAnswerAudioFail"
      );
      yield put(actions.createUpdateQuestionFail(failMessage));
      yield delay(3000);
      yield put(actions.clearAlert());
      return;
    }
  }
  yield put(actions.fetchQuestionBankStart(courseId, token));
  yield put(actions.createUpdateQuestionSuccess());
  console.log('history.location.pathname',history.location.pathname)
  // const isTestPanel = !!matchPath(history.location.pathname, {
  //   path: "/instructor-panel/course/:courseId/tests",
  //   exact: false,
  // });
  history.goBack()
  yield delay(3000);
  yield put(actions.clearAlert());
  if (filesToDelete.length > 0)
    yield put(actions.deleteFilesStart(filesToDelete, token));
}

function* watchCreateUpdateQuestion() {
  yield takeLatest(
    actionTypes.CREATE_UPDATE_QUESTION_START,
    createUpdateQuestion
  );
}

const instructorCreateUpdateQuestionSaga = [fork(watchCreateUpdateQuestion)];

export default instructorCreateUpdateQuestionSaga;
