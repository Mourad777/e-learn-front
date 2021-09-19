import {
  takeLatest,
  call,
  fork,
  put,
  delay,
  takeEvery,
} from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { updateConfigurationQuery, fetchConfigurationQuery } from "./queries";
import i18n from "../../../../i18n/index";

function* fetchConfig({ payload: { token } }) {
  const graphqlQuery = fetchConfigurationQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Fetch config response", response);
    if (response.data.errors) {
      throw new Error("Failed to get the configuration");
    }

    yield put(actions.fetchConfigSuccess(response.data.data.configuration || {}));
  } catch (e) {
    console.log("e: ", e);
    const failMessage = i18n.t("alerts.config.fetchConfigFail");
    yield put(actions.fetchConfigFail());
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* updateConfig({ payload: { token, configData } }) {
  console.log('configData', configData)
  let response
  try {
    const graphqlQuery = updateConfigurationQuery({
      configData,
    });

     response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Update configuration response: ", response);
    if (response.data.errors) {
      throw new Error("Failed to update the configuration");
    }

  } catch (e) {
    console.log("Error updating the configuration: ", e);
    const failMessage = i18n.t("alerts.config.updatedConfigFail");
    yield put(actions.updateConfigFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }
  const newTokenData = response.data.data.updateConfiguration;
  const successMessage = i18n.t("alerts.config.updatedConfigSuccess");
  yield put(actions.updateConfigSuccess(newTokenData,successMessage));
  yield delay(3000);
  yield put(actions.clearAlert());
  yield put(actions.fetchConfigStart(token));
}

function* watchFetchConfig() {
  yield takeEvery(actionTypes.FETCH_CONFIG_START, fetchConfig);
}

function* watchUpdateConfig() {
  yield takeLatest(actionTypes.UPDATE_CONFIG_START, updateConfig);
}

const configurationSagas = [fork(watchFetchConfig), fork(watchUpdateConfig)];

export default configurationSagas;
