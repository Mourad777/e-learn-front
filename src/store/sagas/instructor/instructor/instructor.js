import { takeEvery, fork, put, delay, call } from "redux-saga/effects";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { fetchInstructorsQuery } from "./query";
import axiosGraphql from "../../../actions/axios-base";
import i18n from "../../../../i18n/index";

function* fetchInstructors({ payload }) {
  const token = payload.token;
  const graphqlQuery = fetchInstructorsQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);

    console.log("Fetching instructors response: ", response);
    if (response.data.errors) {
      throw new Error("Getting instructors failed");
    }
    yield put(actions.fetchInstructorsSuccess(response.data.data.instructors));
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("Fetching instructors error: ", e);
    const failMessage = i18n.t("alerts.instructor.retrieveInstructorsFail");
    yield put(actions.fetchInstructorsFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchFetchInstructors() {
  yield takeEvery(actionTypes.FETCH_INSTRUCTORS_START, fetchInstructors);
}

const instructorSagas = [fork(watchFetchInstructors)];

export default instructorSagas;
