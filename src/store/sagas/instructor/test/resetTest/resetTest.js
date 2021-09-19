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
    resetTestQuery,
  } from "./query";
  import i18n from "../../../../../i18n/index";

function* resetTest({ payload }) {
    const { testId, token, studentId, courseId, message } = payload;
    const graphqlQuery = resetTestQuery(testId,studentId,message);
    try {
      const response = yield call(axiosGraphql, graphqlQuery, token);
      console.log("Reseting test response: ", response);
      if (response.data.errors) {
        throw new Error("Reseting the test failed");
      }
      const successMessage = i18n.t("alerts.test.testResetSuccess")
      yield put(actions.resetTestSuccess(successMessage));
      yield put(actions.fetchCoursesStart(token));
      yield put(actions.fetchStudentsStart(courseId,token));
      yield put(actions.closeModal());
      yield put(actions.fetchNotificationsStart(token));
      yield delay(3000);
      yield put(actions.clearAlert());
    } catch (e) {
      console.log("err", e);
      const failMessage =i18n.t("alerts.test.testResetFail")
      yield put(actions.resetTestFail(failMessage));
      yield delay(3000);
      yield put(actions.clearAlert());
    }
  }

  function* watchResetTest() {
    yield takeEvery(actionTypes.RESET_TEST_START, resetTest);
  }
  
  const instructorResetTestSaga = [
    fork(watchResetTest),
  ];
  
  export default instructorResetTestSaga;