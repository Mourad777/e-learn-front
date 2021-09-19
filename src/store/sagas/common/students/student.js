import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { studentsQuery } from "./queries";
import setInitialValues from "../../../../containers/InstructorPanel/GradeDetail/setInitialGradeValues";
import i18n from "../../../../i18n/index";

function* fetchStudents({ payload: { courseId, token, action = {} } }) {
  const graphqlQuery = studentsQuery(courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token); //no call backs, waits for it to resolve
    //code here will run once call has resolved
    console.log("Getting students response: ", response);
    if (response.data.errors) {
      throw new Error("Failed to get students");
    }
    const students = response.data.data.students;
    yield put(actions.fetchStudentsSuccess(students));
    if ((action||{}).actionType === "openSubmittedTest") {
      const notification = action.payload.notification;
      const test = (action||{}).payload.test;
      const student =
        (students || []).find(
          (student) => student._id === notification.fromUser
        ) || {};

      const results =
        (student.testResults || []).map((testResult) => {
          return {
            testResult,
            student,
            test:testResult.test === test._id ? test : {},
          };
        }) || [];

      const result = {
        results: results,
        testId: notification.documentId,
        studentId: notification.fromUser,
      };

      const foundResult =
        results.find((result) => {
          if (
            result.student._id === notification.fromUser &&
            result.test._id === notification.documentId
          ) {
            return result;
          }
        }) || {};

      yield put(actions.openModal(result, "gradeTest"));
      const values = yield setInitialValues(foundResult, results);
      yield put(actions.setInitialGradeValues(values));
    }
  } catch (e) {
    console.log("Failed to retrieve students", e);
    const failMessage = i18n.t("alerts.student.retrieveStudentsFail")
    yield put(actions.fetchStudentsFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchFetchStudents() {
  yield takeEvery(actionTypes.FETCH_STUDENTS_START, fetchStudents);
}

const studentCourseSagas = [fork(watchFetchStudents)];

export default studentCourseSagas;
