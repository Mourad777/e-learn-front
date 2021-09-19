import { call, fork, put, delay, takeLatest } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { createUpdateModulesQuery } from "./queries";
import { adjustModules } from "./adjustedModules";
import i18n from "../../../../i18n/index";

function* createUpdateModules({
  payload: { formValues, token, editing, courseId },
}) {
  const modules = adjustModules(formValues);

  const graphqlQuery = createUpdateModulesQuery(courseId, modules, editing);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Creating or updating modules response: ", response);
    if (response.data.errors) {
      throw new Error("Creating or updating the modules failed");
    }
    yield put(actions.modulesChangeSuccess());
    yield put(actions.fetchModulesStart(courseId,token));
  } catch (e) {
    console.log("err", e);
    const failMessage = i18n.t("alerts.modules.updateModulesFailed");
    yield put(actions.modulesChangeFailed(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchCreateUpdateModules() {
  yield takeLatest(actionTypes.MODULES_CHANGE_START, createUpdateModules);
}

const instructorModulesSagas = [fork(watchCreateUpdateModules)];

export default instructorModulesSagas;