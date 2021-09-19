import { call, fork, put, delay, take } from "redux-saga/effects";
import axiosGraphql from "../../../../actions/axios-base";
import * as actions from "../../../../actions/index";
import * as actionTypes from "../../../../actions/actionTypes";
import { deleteQuestionQuery } from "./query";
import i18n from "../../../../../i18n/index";
import history from "../../../../../utility/history";
function* deleteQuestion({ payload }) {
  const { questionId, token, courseId } = payload;
  const graphqlQuery = deleteQuestionQuery(questionId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("delete question response: ", response);
    if (response.data.errors) {
      throw new Error("Deleting the question failed");
    }

    yield put(actions.fetchQuestionBankStart(courseId, token));

    const successMessage = i18n.t("alerts.question.deleteQuestionSuccess");
    yield put(actions.deleteQuestionSuccess(successMessage));
    history.goBack()
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("err", e);
    const failMessage = i18n.t("alerts.question.deleteQuestionFail");
    yield put(actions.deleteQuestionFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchDeleteQuestion() {
  while (true) {
    const payload = yield take(actionTypes.DELETE_QUESTION_START);
    yield call(deleteQuestion, payload);
  }
}

const instructorDeleteQuestionSaga = [fork(watchDeleteQuestion)];

export default instructorDeleteQuestionSaga;
