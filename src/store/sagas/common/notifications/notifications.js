import { takeEvery,takeLatest, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { notificationsQuery,markAsSeenQuery } from "./query";
import i18n from "../../../../i18n/index";

function* fetchNotifications({payload}) {
  const token = payload.token;
  const graphqlQuery = notificationsQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Fetch notifications response: ", response);
    const notifications = response.data.data.notifications;
    yield put(actions.fetchNotificationsSuccess(notifications));

  } catch (e) {
    console.log("Failed to retrieve the notifications", e);
    const failMessage = i18n.t("alerts.notifications.retrieveNotificationsFail");
    yield put(actions.fetchNotificationsFail(failMessage));
    yield delay(3000)
    yield put(actions.clearAlert());
  }
}

function* markAsSeen({payload:{token,notificationId}}) {

  const graphqlQuery = markAsSeenQuery(notificationId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Mark as seen response: ", response);
    yield put(actions.markAsSeenSuccess());
    yield put(actions.fetchNotificationsStart(token));

  } catch (e) {
    console.log("Failed to mark notification as seen", e);
    const failMessage = i18n.t("alerts.notifications.markNotificationsFail");
    yield put(actions.markAsSeenFail(failMessage));
    yield delay(3000)
    yield put(actions.clearAlert());
  }
}

function* watchMarkAsSeen() {
  yield takeLatest(actionTypes.MARK_AS_SEEN_START, markAsSeen);
}

function* watchFetchNotifications() {
  yield takeEvery(actionTypes.FETCH_NOTIFICATIONS_START, fetchNotifications);
}

const commonNotificationsSaga = [fork(watchFetchNotifications),fork(watchMarkAsSeen)];

export default commonNotificationsSaga;