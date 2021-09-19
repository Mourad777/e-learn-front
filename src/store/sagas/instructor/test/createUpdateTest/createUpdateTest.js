import { takeLatest, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../../actions/axios-base";
import * as actions from "../../../../actions/index";
import * as actionTypes from "../../../../actions/actionTypes";
import { createTestQuery } from "./query";
import { getKey, uploadFile } from "../../../../../utility/uploadFile";
import { urlKeyConverter } from "../../../../../utility/urlKeyConverter";
import { formatQuestions } from "./formatQuestions";
import { filterFiles } from "./filterFiles";
import i18n from "../../../../../i18n/index";
import history from "../../../../../utility/history";

function* createUpdateTest({
  payload: {
    formData = {},
    token,
    editing,
    courseId,
    instructorId,
    testId,
    formType,
    filesToDelete,
  },
}) {
  const path = `courses/${courseId}/tests/${testId}`;
  const {
    pdfFilesReadingMaterial,
    audioFilesListeningMaterial,
    videoFilesWatchingMaterial,
    rm,
    am,
    vm,
    rmMc,
    rmEs,
    rmSp,
    rmFill,
    rmT,
  } = filterFiles(formData);

  const pdfKeys = pdfFilesReadingMaterial.map((file, i) => {
    let key = file;
    if (
      (i === 0 && rmMc.fileUpload) ||
      (i === 1 && rmEs.fileUpload) ||
      (i === 2 && rmSp.fileUpload) ||
      (i === 3 && rmFill.fileUpload) ||
      (i === 4 && rmT.fileUpload)
    ) {
      key = urlKeyConverter(file);
    }
    if (file instanceof File) {
      key = getKey(file, path);
    }
    return key;
  });

  const audioMaterialKeys = audioFilesListeningMaterial.map((file, i) => {
    let key = file;
    if (file instanceof File) {
      key = getKey(file, path);
    } else {
      key = urlKeyConverter(file);
    }
    return key;
  });

  const videoMaterialKeys = videoFilesWatchingMaterial.map((file, i) => {
    let key = file;
    if (file instanceof File) {
      key = getKey(file, path);
    } else {
      key = urlKeyConverter(file);
    }
    return key;
  });

  const fillBlankAnswers = (formData.fillBlankQuestions || {}).answers;
  const fillBlankAudioKeys = fillBlankAnswers.map((a, i) => {
    let key = a;
    if (a.audioFile instanceof File) {
      key = getKey(a.audioFile, path);
    } else {
      key = urlKeyConverter(a.audioFile);
    }
    if (!a.audio) key = null;
    return key;
  });

  const speakingSectionAudioAnswers = (formData.speakingQuestions || []).map(
    (item) => item.audioAnswer
  );
  const speakAnswerAudFiles = (formData.speakingQuestions || []).map(
    (item) => item.audioFile
  );

  const spAnsAudioKeys = speakAnswerAudFiles.map((file, i) => {
    let key;
    if (file instanceof File) {
      key = getKey(file, path);
    } else {
      key = urlKeyConverter(file);
    }
    if (!speakingSectionAudioAnswers[i]) key = null;
    return key;
  });

  const speakSecAudioQs = (formData.speakingQuestions || []).map(
    (item) => item.audioQuestion
  );
  const speakSecQAudioFiles = (formData.speakingQuestions || []).map(
    (item) => item.audioFileQuestion
  );

  const spQAudioKeys = speakSecQAudioFiles.map((file, i) => {
    let key;
    if (file instanceof File) {
      key = getKey(file, path);
    } else {
      key = urlKeyConverter(file);
    }
    if (!speakSecAudioQs[i]) key = null;
    return key;
  });

  const {
    formattedAudioMaterials,
    formattedReadingMaterials,
    formattedVideoMaterials,
    formattedMcQuestions,
    formattedEssayQuestions,
    formattedSpeakingQuestions,
    formattedFillBlankQuestions,
  } = formatQuestions(
    formData,
    speakSecAudioQs,
    spQAudioKeys,
    spAnsAudioKeys,
    fillBlankAnswers,
    fillBlankAudioKeys,
    pdfFilesReadingMaterial,
    audioFilesListeningMaterial,
    videoFilesWatchingMaterial,
    pdfKeys,
    rm,
    audioMaterialKeys,
    am,
    videoMaterialKeys,
    vm,

  );

  try {
    const graphqlQuery = createTestQuery(
      formData,
      formattedReadingMaterials,
      formattedAudioMaterials,
      formattedVideoMaterials,
      formattedMcQuestions,
      formattedEssayQuestions,
      formattedSpeakingQuestions,
      formattedFillBlankQuestions,
      testId,
      courseId,
      instructorId,
      editing,
      formType
    );
    console.log('graphqlQuery',graphqlQuery);
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Create test response: ", response);
    if (response.data.errors) {
      throw new Error(
        `Failed to ${editing ? "update" : "create"} the ${
          formType === "test" ? "test" : "assignment"
        }`
      );
    }
    if (filesToDelete.length > 0)
      yield put(actions.deleteFilesStart(filesToDelete, token));
    yield put(actions.fetchCoursesStart(token));
    history.goBack();
    yield put(actions.createUpdateTestSuccess());
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log(
      `Error ${editing ? "updating" : "creating"} the ${
        formType === "test" ? "test" : "assignment"
      }`,
      e
    );
    const failMessage = editing
      ? i18n.t("alerts.test.updatingFail")
      : i18n.t("alerts.test.creatingFail");
    yield put(actions.createUpdateTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  try {
    for (const i in pdfFilesReadingMaterial) {
      if (pdfFilesReadingMaterial.hasOwnProperty(i)) {
        //check to make sure slide has audio OR video but not both
        if (pdfFilesReadingMaterial[i] instanceof File) {
          yield call(uploadFile, pdfFilesReadingMaterial[i], pdfKeys[i], token);
        }
      }
    }
  } catch (e) {
    console.log("error uploading pdf files: ", e);
    const failMessage = i18n.t("alerts.test.uploadingTestResourcesFail");
    yield put(actions.createUpdateTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  try {
    for (const i in audioFilesListeningMaterial) {
      if (audioFilesListeningMaterial.hasOwnProperty(i)) {
        if (audioFilesListeningMaterial[i] instanceof File) {
          yield call(
            uploadFile,
            audioFilesListeningMaterial[i],
            audioMaterialKeys[i],
            token
          );
        }
      }
    }
  } catch (e) {
    console.log("error audio material audio files: ", e);
    const failMessage = i18n.t("alerts.test.uploadingAudioResourcesFail");
    yield put(actions.createUpdateTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }
  try {
    for (const i in videoFilesWatchingMaterial) {
      if (videoFilesWatchingMaterial.hasOwnProperty(i)) {
        if (videoFilesWatchingMaterial[i] instanceof File) {
          yield call(
            uploadFile,
            videoFilesWatchingMaterial[i],
            videoMaterialKeys[i],
            token
          );
        }
      }
    }
  } catch (e) {
    console.log("error video materialfiles: ", e);
    const failMessage = i18n.t("alerts.test.uploadingVideoResourcesFail");
    yield put(actions.createUpdateTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }
  const fillBlankAudioFiles = fillBlankAnswers.map((a) => {
    if (a.audio) return a.audioFile;
    return null;
  });

  try {
    for (const i in fillBlankAudioFiles) {
      if (fillBlankAudioFiles.hasOwnProperty(i)) {
        if (fillBlankAudioFiles[i] instanceof File) {
          yield call(
            uploadFile,
            fillBlankAudioFiles[i],
            fillBlankAudioKeys[i],
            token
          );
        }
      }
    }
  } catch (e) {
    console.log("Error fill in the blanks section audio files: ", e);
    const failMessage = i18n.t("alerts.test.uploadingFillblanksAudioFail");
    yield put(actions.createUpdateTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  try {
    for (const i in speakAnswerAudFiles) {
      if (speakAnswerAudFiles.hasOwnProperty(i)) {
        if (speakAnswerAudFiles[i] instanceof File) {
          yield call(
            uploadFile,
            speakAnswerAudFiles[i],
            spAnsAudioKeys[i],
            token
          );
        }
      }
    }
  } catch (e) {
    console.log("error uploading speaking section answer files: ", e);
    const failMessage = i18n.t("alerts.test.uploadingSpeakingAnswerAudioFail");
    yield put(actions.createUpdateTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  try {
    for (const i in speakSecQAudioFiles) {
      if (speakSecQAudioFiles.hasOwnProperty(i)) {
        if (speakSecQAudioFiles[i] instanceof File) {
          yield call(
            uploadFile,
            speakSecQAudioFiles[i],
            spQAudioKeys[i],
            token
          );
        }
      }
    }
  } catch (e) {
    console.log("Error uploading speaking section question files: ", e);
    const failMessage = i18n.t(
      "alerts.test.uploadingSpeakingQuestionAudioFail"
    );
    yield put(actions.createUpdateTestFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }
}

function* watchCreateTest() {
  yield takeLatest(actionTypes.CREATE_UPDATE_TEST_START, createUpdateTest);
}

const instructorCreateUpdateTestSaga = [fork(watchCreateTest)];

export default instructorCreateUpdateTestSaga;
