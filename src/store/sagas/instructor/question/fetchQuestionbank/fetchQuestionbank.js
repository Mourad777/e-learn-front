import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../../actions/axios-base";
import * as actions from "../../../../actions/index";
import * as actionTypes from "../../../../actions/actionTypes";
import { questionbankQuery } from "./query";
import i18n from "../../../../../i18n/index";

function* fetchQuestionbank({ payload: { courseId, token } }) {
  const graphqlQuery = questionbankQuery(courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Getting question bank response: ", response);
    if (response.data.errors) {
      throw new Error("Loading the question bank failed");
    }
    const questions = response.data.data.questions;
    yield put(actions.fetchQuestionBankSuccess(questions));
  } catch (e) {
    console.log("err", e);
    const failMessage = i18n.t("alerts.question.fetchQuestionBankFail");
    yield put(actions.fetchQuestionBankFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchFetchQuestionbank() {
  yield takeEvery(actionTypes.FETCH_QUESTION_BANK_START, fetchQuestionbank);
}

const instructorFetchQuestionbankSaga = [fork(watchFetchQuestionbank)];

export default instructorFetchQuestionbankSaga;
