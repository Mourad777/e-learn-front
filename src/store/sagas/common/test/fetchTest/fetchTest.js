import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../../actions/axios-base";
import * as actions from "../../../../actions/index";
import * as actionTypes from "../../../../actions/actionTypes";
import { fetchTestQuery } from "./fetchTestQuery";
import { adjustStudentTestProgress } from "./adjustStudentTestProgress";
import { adjustInstructorTest } from "./adjustInstructorTest";
import history from "../../../../../utility/history";
import { updateSyncErrors } from "redux-form";
import i18n from "../../../../../i18n/index";
//saga is triggered upon instructor editing a test
//or a student taking a test
function* fetchTest({
  payload: {
    testId,
    isStudent,
    token,
    testDataInProgress,
    studentResult,
    password,
  },
}) {
  const graphqlQuery = fetchTestQuery(testId, password);
  let response;
  // console.log("testDataInProgress", testDataInProgress);
  try {
    response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Fetching test response", response);
    let errorMessage;
    const resErrors = response.data.errors;
    if (resErrors) {
      errorMessage = resErrors[0].message;
    }
    if (resErrors && errorMessage === "wrongPassword") {
      yield put(
        updateSyncErrors("takeTestConfirmation", {
          password: i18n.t("auth.errors.wrongPassword"),
        })
      );
      yield put(actions.fetchTestFail());
      return;
    }
    if (response.data.errors) {
      throw new Error("Fetching the test failed!");
    }
    yield put(actions.closeModal());
    const resData = response.data.data;
    if (isStudent) {
      //this is to unmount and remount the test
      //needed to reset initial url values for audio
      //without this, audio does not get deleted correctly
      yield put(actions.clearTestInProgress());

      //this is a case where a student will save the test 1-2 seconds
      //before the timer expires in which case the server will block
      //the request to serve the test from the database since the timer
      //would have expired by the time the request reaches the server
      if (((response.data.errors || [])[0] || {}).status === 403) {
        yield put(actions.fetchTestResultsStart(token));
      }

      const testData = (resData.fetchTest || {}).test || {};
      const resultData = (resData.fetchTest || {}).result || {};
      //if student result is defined that means that the student is fetching the test questions to be reviewed
      //at this point the student has already taken the test or assignment and the test has been graded
      if (studentResult) {
        // dispatch(showTestReview(studentResult, testData, true));
        yield put(actions.fetchTestSuccess(null, null));
        yield put(
          actions.openModal(
            {
              test: {
                // testResult: studentResult,
                instructorTest: testData,
              },
            },
            "testReview"
          )
        );
        return;
      }
      if (!testData.assignment) {
        console.log('starting test: ',testData)
        yield put(actions.startTest(testData));
        //set course in redux because we need to potentially
        //be able to access the lessons
        // history.push(`/student-panel/course/${testData.course}/test-in-session`);
      }

      //case for student starting or continuing an assignment
      if (testData.assignment) {
        yield put(
          actions.startAssignment({ ...testData, course: testData.course })
        );
      }
      console.log('testData',testData,'resultData',resultData)
      yield put(
        actions.fetchTestSuccess(
          testData,
          adjustStudentTestProgress(testData, resultData)
        )
      );

      yield put(actions.selectCourse(testData.course));
    }
    //case for instructor getting test for editing
    if (!isStudent) {
      const formData = response.data.data.fetchTest.test || {};
      yield put(
        actions.fetchTestSuccess(testId, adjustInstructorTest(formData))
      );
    }
  } catch (e) {
    console.log("Failed to retrieve test", e);
    yield put(actions.cancelEditing());
    let failMessage = i18n.t("alerts.test.retrieveTestFail")
    if (response.data.errors[0].status === 403) {
      failMessage =
        response.data.errors[0].message === "retrieveTestFailDatePassed"
          ? i18n.t("alerts.test.retrieveTestFailDatePassed")
          : response.data.errors[0].message;
    }
    yield put(actions.fetchTestFail(failMessage));
    yield delay(5000);
    yield put(actions.clearAlert());
  }
}

function* watchfetchTest() {
  yield takeEvery(actionTypes.FETCH_TEST_START, fetchTest);
}

const instructorFetchTestSaga = [fork(watchfetchTest)];

export default instructorFetchTestSaga;
