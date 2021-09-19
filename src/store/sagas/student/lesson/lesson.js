import { takeLatest, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { markSlideAsSeenQuery } from "./query";
import i18n from "../../../../i18n/index";

function* markSlideAsSeen({ payload: { token, lessonId, slideNumber } }) {
  console.log('lessonId, slideNumber',lessonId, slideNumber)
  console.log('token: ',token)
  const graphqlQuery = markSlideAsSeenQuery(lessonId, slideNumber);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Mark slide as seen response: ", response);
    yield put(actions.markSlideAsSeenSuccess());
    yield put(actions.fetchCoursesStart(token,'noSpinner'));
  } catch (e) {
    console.log("Failed to mark slide as seen", e);
    const failMessage = i18n.t("alerts.lesson.markSlideFail")
    yield put(actions.markSlideAsSeenFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchMarkSlideAsSeen() {
  yield takeLatest(actionTypes.MARK_SLIDE_AS_SEEN_START, markSlideAsSeen);
}

const sudentLessonSaga = [fork(watchMarkSlideAsSeen)];

export default sudentLessonSaga;
