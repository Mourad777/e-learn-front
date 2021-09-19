import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { studentDropCourseQuery, studentEnrollRequestQuery, studentEnrollApproveQuery, studentEnrollDenyQuery } from "./queries";
import i18n from "../../../../i18n/index";

function* enrollRequest({payload:{student, course, token}}) {
  const graphqlQuery = studentEnrollRequestQuery(student, course);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Enroll request response: ", response);
    if (response.data.errors) {
      throw new Error("Enroll request failed!");
    }
    yield put(actions.fetchCoursesStart(token));
    const successMessage = i18n.t("alerts.course.requestSentSuccess");
    yield put(actions.enrollRequestSuccess(successMessage));
    yield put(actions.closeModal());
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log(e);
    const failMessage =i18n.t("alerts.course.requestSentFailed");
    yield put(actions.enrollRequestFail(failMessage));
    yield put(actions.closeModal());
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* enrollApprove({payload:{studentId, courseId, token, history ,isAutoEnroll}}) {
  const graphqlQuery = studentEnrollApproveQuery(studentId, courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Enroll student approved response: ", response);
    if (response.data.errors) {
      throw new Error("Approving enrollment of the student failed!");
    }
    yield put(actions.fetchCoursesStart(token));
    yield put(actions.fetchStudentsStart(courseId,token));
    // const successMessage = "The student is now enrolled";
    yield put(actions.enrollCourseSuccess());
    if(isAutoEnroll) {
      history.push(`/student-panel/course/${courseId}/modules`)
    } else {
      history.push(`/instructor-panel/course/${courseId}/students/enrolled`)
    }
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log(e);
    const failMessage = i18n.t("alerts.course.enrollmentApproveFail");
    yield put(actions.enrollCourseFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* enrollDeny({payload:{student, course, token, reason, allowResubmission, history}}) {
  const graphqlQuery = studentEnrollDenyQuery(student, course,reason,allowResubmission);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Enroll course response: ", response);
    if (response.data.errors) {
      throw new Error("Enrolling in the course failed!");
    }
    yield put(actions.fetchCoursesStart(token));
    yield put(actions.fetchStudentsStart(course,token));
    const successMessage = i18n.t("alerts.course.studentDenySuccess");
    yield put(actions.enrollDenySuccess(successMessage));
    history.push(`/instructor-panel/course/${course}/students/requested`)
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log(e);
    const failMessage =i18n.t("alerts.course.studentDenyFail");
    yield put(actions.enrollDenyFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* dropCourse({payload:{student, course, token}}) {
  const graphqlQuery = studentDropCourseQuery(student, course);

  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Drop course response: ", response);
    if (response.data.errors) {
      throw new Error("Dropping the course failed!");
    }
    yield put(actions.fetchCoursesStart(token));
    const successMessage = i18n.t("alerts.course.courseDropSuccess");
    yield put(actions.dropCourseSuccess(successMessage));
    yield put(actions.closeModal());
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    const failMessage = i18n.t("alerts.course.courseDropFail");
    yield put(actions.dropCourseFail(failMessage));
    yield put(actions.closeModal());
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchEnrollRequest() {
  yield takeEvery(actionTypes.ENROLL_REQUEST_START, enrollRequest);
}

function* watchEnrollCourse() {
  yield takeEvery(actionTypes.ENROLL_COURSE_START, enrollApprove);
}

function* watchEnrollDeny() {
  yield takeEvery(actionTypes.ENROLL_DENY_START, enrollDeny);
}

function* watchDropCourse() {
  yield takeEvery(actionTypes.DROP_COURSE_START, dropCourse);
}

const studentCourseSagas = [
  fork(watchEnrollRequest),
  fork(watchEnrollCourse),
  fork(watchEnrollDeny),
  fork(watchDropCourse),
];

export default studentCourseSagas;