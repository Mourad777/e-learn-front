import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../actions/axios-base";
import * as actions from "../../actions/index";
import * as actionTypes from "../../actions/actionTypes";
import { activateAccountQuery, suspendAccountQuery } from "./queries";
import i18n from "../../../i18n/index";

function* activateAccount({payload:{user, token, history}}) {
  const graphqlQuery = activateAccountQuery(user);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Activate account request response: ", response);
    if (response.data.errors) {
      throw new Error("Activating account failed");
    }
    yield put(actions.fetchInstructorsStart(token));
    yield put(actions.fetchAllStudentsStart(token));
    const successMessage = i18n.t("alerts.admin.accountActivatedSuccess");
    yield put(actions.activateAccountSuccess(successMessage));
    history.push(`/users/instructors`)
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log(e);
    const failMessage =i18n.t("alerts.admin.accountActivatedFailed");
    yield put(actions.activateAccountFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* suspendAccount({payload:{user,action, reason, token, history}}) {
  const graphqlQuery = suspendAccountQuery(user,reason);
  const isReactivatingAccount = action === "reactivate"
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log(isReactivatingAccount ? "Reactivate account response" : "Suspend account response", response);
    if (response.data.errors) {
      throw new Error(isReactivatingAccount ? "Reactivating account failed" : "Suspending account failed");
    }
    yield put(actions.fetchInstructorsStart(token));
    yield put(actions.fetchAllStudentsStart(token));
    const successMessage = i18n.t(isReactivatingAccount ? "alerts.admin.accountReactivatedSuccess" : "alerts.admin.accountSuspendSuccess");
    yield put(actions.suspendAccountSuccess(successMessage));
    history.push(`/users/instructors`)
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log(e);
    const failMessage = i18n.t(isReactivatingAccount ? "alerts.admin.accountReactivatedFail" : "alerts.admin.accountSuspendFail");
    yield put(actions.suspendAccountFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchActivateAccount() {
  yield takeEvery(actionTypes.ACTIVATE_ACCOUNT_START, activateAccount);
}

function* watchSuspendAccount() {
  yield takeEvery(actionTypes.SUSPEND_ACCOUNT_START, suspendAccount);
}

const adminAccountSagas = [
  fork(watchActivateAccount),
  fork(watchSuspendAccount),
];

export default adminAccountSagas;