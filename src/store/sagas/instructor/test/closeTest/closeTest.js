import { call, put, delay, takeLatest, fork } from "redux-saga/effects";
import axiosGraphql from "../../../../actions/axios-base";
import * as actions from "../../../../actions/index";
import * as actionTypes from "../../../../actions/actionTypes";
import { closeTestQuery } from "./query";
import i18n from "../../../../../i18n/index";

function* closeTest({ payload: { testId, studentId, token, instructorTest, isExcused, history } }) {
  const graphqlQuery = closeTestQuery(testId, studentId,isExcused);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Closing test resonse: ", response);
    if (response.data.errors) {
      throw new Error("Closing the test failed!");
    }
    // const gradeValues = response.data.data.closeTest;
    yield put(actions.closeTestSuccess(testId, studentId));
    console.log("response.data.data", response.data.data);

    if (!isExcused) {
      history.push(`/instructor-panel/course/${instructorTest.course}/grade-${instructorTest.assignment ? 'assignment':'test'}s/student/${studentId}/${instructorTest.assignment ? 'assignment':'test'}/${testId}`)

    }
    yield put(actions.fetchStudentsStart(instructorTest.course, token));
    yield put(actions.fetchCoursesStart(token));

  } catch (e) {
    const failMessage = i18n.t("alerts.test.closeTestFail")
    yield put(actions.closeTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchCloseTest() {
  yield takeLatest(actionTypes.CLOSE_TEST_START, closeTest);
}

const instructorCloseTestSaga = [
  fork(watchCloseTest),
];

export default instructorCloseTestSaga;