import {
    call,
    fork,
    put,
    delay,
    takeEvery,
  } from "redux-saga/effects";
  import axiosGraphql from "../../../../actions/axios-base";
  import * as actions from "../../../../actions/index";
  import * as actionTypes from "../../../../actions/actionTypes";
  import {
    deleteTestQuery,
  } from "./query";
  import i18n from "../../../../../i18n/index";
  import history from "../../../../../utility/history";
  
function* deleteTest({ payload }) {
    const { testId, token } = payload;
    const graphqlQuery = deleteTestQuery(testId);
    try {
      const response = yield call(axiosGraphql, graphqlQuery, token);
      console.log("Deleting test response: ", response);
      if (response.data.errors) {
        throw new Error("Deleting the test failed");
      }
      const successMessage = i18n.t("alerts.test.testDeleteSuccess")
      yield put(actions.deleteTestSuccess(successMessage));
      yield put(actions.fetchCoursesStart(token));
      yield put(actions.closeModal());
      yield put(actions.fetchNotificationsStart(token));
      yield delay(3000);
      yield put(actions.clearAlert());
    } catch (e) {
      console.log("err", e);
      const failMessage = i18n.t("alerts.test.testDeleteFail")
      yield put(actions.deleteTestFail(failMessage));
      yield delay(3000);
      yield put(actions.clearAlert());
    }
  }

  function* watchDeleteTest() {
    yield takeEvery(actionTypes.DELETE_TEST_START, deleteTest);
  }
  
  const instructorDeleteTestSaga = [
    fork(watchDeleteTest),
  ];
  
  export default instructorDeleteTestSaga;