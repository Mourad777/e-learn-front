import { takeLatest, fork, put } from "redux-saga/effects";
import * as actionTypes from "../../../actions/actionTypes";
import socketIOClient from "socket.io-client";
import * as actions from "../../../actions/index";

function* updateActivity({ payload }) {
  const { token, userId, activity, isStayLoggedIn } = payload;
  if (window.location.pathname === "/authentication") return;
  const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
    query: { token },
  });
  if (activity === "active") {
    socket.emit("active", {
      user: userId,
    });
    if (!isStayLoggedIn) {
      yield put(actions.refreshTokenStart(token));
    }
  }
  if (activity === "idle") {
    socket.emit("idle", {
      user: userId,
    });

  }
}

function* watchUpdateActivity() {
  yield takeLatest(actionTypes.UPDATE_ACTIVITY_START, updateActivity);
}

const activitySagas = [fork(watchUpdateActivity)];

export default activitySagas;
