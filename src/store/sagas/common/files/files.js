import { call, fork, put, delay, take } from "redux-saga/effects";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import axios from "axios";
import i18n from "../../../../i18n/index";
import { uploadFile, getKey } from "../../../../utility/uploadFile";

function* upload({ payload }) {
  const { file, key, type, token } = payload;
  try {
    yield call(uploadFile,file, key, token, type);
    yield put(actions.uploadFileSuccess());
  } catch (e) {
    console.log("err", e);
    const failMessage = i18n.t("alerts.files.uploadFileFailed");
    yield put(actions.uploadFileFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* deleteFiles({ payload }) {
  const { fileUrls, token } = payload;
  const fixedUrls = (fileUrls || [])
    .filter((f) => typeof f === "string")
    .map((fileUrl) => fileUrl.replace(process.env.REACT_APP_AWS_URL, ""));
  if (!fileUrls || !(fileUrls.length > 0) || !(fixedUrls.length > 0)) {
    yield put(actions.deleteFilesSuccess());
    return;
  }
  const formData = new FormData();
  fixedUrls.forEach((url) => {
    formData.append("url", url);
  });
  try {
    const parameters = {
      url: `${process.env.REACT_APP_SERVER_URL}delete-files`,
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: formData,
    };
    const response = yield call(axios, parameters);
    console.log("Deleting files response: ", response);
    if (response.data.errors) {
      throw new Error("Deleting the files failed");
    }
    yield put(actions.deleteFilesSuccess());
  } catch (e) {
    console.log("err", e);
    const failMessage = i18n.t("alerts.files.deleteFilesFailed");
    yield put(actions.deleteFilesFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchUpload() {
  while (true) {
    const payload = yield take(actionTypes.UPLOAD_FILE_START);
    yield call(upload, payload);
  }
}

function* watchDeleteFiles() {
  while (true) {
    const payload = yield take(actionTypes.DELETE_FILES_START);
    yield call(deleteFiles, payload);
  }
}

const commonFileSagas = [fork(watchDeleteFiles), fork(watchUpload)];

export default commonFileSagas;
