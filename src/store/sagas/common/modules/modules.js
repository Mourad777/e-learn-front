import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { adjustedModulesSchema } from "./adjustedSchema";
import { fetchModulesQuery } from "./queries";
import i18n from "../../../../i18n/index";

function* fetchModules({ payload: { courseId, token } }) {
  const graphqlQuery = fetchModulesQuery(courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Getting modules response: ", response);
    if (response.data.errors) {
      throw new Error("Getting modules failed");
    }
    const modules = (response.data.data.category || {}).modules || [];
    const adjustedModules = adjustedModulesSchema(modules);
    const categId = (response.data.data.category || {})._id;

    yield put(
      actions.fetchModulesSuccess({ modules: adjustedModules, _id: categId,courseId })
    );
  } catch (e) {
    console.log("Failed to retrieve modules", e);
    const failMessage = i18n.t("alerts.modules.retrieveModulesFailed");
    yield put(actions.fetchModulesFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchFetchModules() {
  yield takeEvery(actionTypes.FETCH_MODULES_START, fetchModules);
}

const modulesSagas = [fork(watchFetchModules)];

export default modulesSagas;