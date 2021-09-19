import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { studentsQuery } from "./queries";
import i18n from "../../../../i18n/index";

function* fetchAllStudents({ payload: {  token } }) {
  const graphqlQuery = studentsQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Getting all students response: ", response);
    if (response.data.errors) {
      throw new Error("Failed to get all students");
    }
    const students = response.data.data.allStudents;
    yield put(actions.fetchAllStudentsSuccess(students));

  } catch (e) {
    console.log("Failed to get all students", e);
    const failMessage = i18n.t("alerts.student.retrieveStudentsFail")
    yield put(actions.fetchStudentsFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchFetchAllStudents() {
  yield takeEvery(actionTypes.FETCH_ALL_STUDENTS_START, fetchAllStudents);
}

const studentCourseSagas = [fork(watchFetchAllStudents)];

export default studentCourseSagas;
