import {
  takeEvery,
  call,
  fork,
  put,
  delay,
  takeLatest,
} from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import {
  fetchCourseQuery,
  createUpdateCourseQuery,
  toggleCourseStateQuery,
  deleteCourseQuery,
  gradeCourseQuery,
  updateCourseResourcesQuery,
} from "./queries";
import { adjustFormData } from "./adjustedCourse";
import { getOfficeHours } from "./getOfficeHours";
import { getKey, uploadFile } from "../../../../utility/uploadFile";
import { docSocketNotification } from "../../../../utility/socketDocNotification";
import i18n from "../../../../i18n/index";
import { urlKeyConverter } from "../../../../utility/urlKeyConverter";

function* fetchCourse({ payload: { courseId, token, changeStatus } }) {
  const graphqlQuery = fetchCourseQuery(courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Getting course response", response);
    if (response.data.errors) {
      throw new Error("Loading the course failed!");
    }
    const formData = response.data.data.course;
    const adjustedFormData = adjustFormData(formData);
    if (!changeStatus)
      yield put(actions.fetchCourseSuccess(adjustedFormData, courseId));
    if (changeStatus)
      put(
        actions.createUpdateCourseStart(
          adjustedFormData,
          token,
          true,
          courseId,
          true
        )
      );
    yield put(actions.setEditing());
    yield put(actions.setTabLabels(["Courses", "Edit course"]));
  } catch (e) {
    console.log("Failed to retrieve the course", e);
    const failMessage = i18n.t("alerts.course.fetchCourseFail");
    yield put(actions.fetchCourseFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* createUpdateCourse({ payload }) {
  const { formData, token, editing, courseId, filesToDelete, history } = payload;
  const { regularOfficeHours, irregularOfficeHours } = getOfficeHours(formData);
  const file = formData.courseImage;

  const path = `courses/${courseId}/thumbnail`;
  const key = getKey(file, path);
  const graphqlQuery = createUpdateCourseQuery({
    ...payload,
    regularOfficeHours,
    irregularOfficeHours,
    file,
    key,
  });
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Creating or updating course response: ", response);

    if (response.data.errors) {
      throw new Error("Creating or updating the course failed");
    }
    history.push('/instructor-panel/courses')
    yield put(actions.fetchInstructorsStart(token));
  } catch (e) {
    console.log("Failed to create or update the course", e);
    const failMessage = i18n.t("alerts.course.createCourseFail");
    yield put(actions.createUpdateCourseFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return; //dont upload file if document failed to upload
  }
  const socketNotification = {
    userType: "all",
    notification: "updateCourses",
  };
  const successMessage = editing
    ? i18n.t("alerts.course.updateCourseSuccess")
    : i18n.t("alerts.course.createCourseSuccess");

  if (formData.courseImage instanceof File) {
    try {
      yield call(uploadFile, file, key, token);
      docSocketNotification(socketNotification, token);
    } catch (e) {
      console.log("Error uploading course thumbnail: ", e);
      const failMessage = i18n.t("alerts.course.uploadThumbnailFail");
      yield put(actions.createUpdateCourseFail(failMessage));
      yield delay(3000);
      yield put(actions.clearAlert());
      return;
    }

    yield put(actions.createUpdateCourseSuccess(successMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  } else {
    docSocketNotification(socketNotification, token);
    yield put(actions.createUpdateCourseSuccess(successMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }

  if ((filesToDelete || []).length > 0)
    yield put(actions.deleteFilesStart(filesToDelete, token));
}

function* updateCourseResources({ payload }) {
  const { courseId, resources, filesToDelete, token } = payload;
  const resourcesPath = `courses/${courseId}/resources`;

  const courseResources = (resources || []).map((r) => {
    let key;
    if (r.resource instanceof File) {
      key = getKey(r.resource, resourcesPath);
    } else {
      key = urlKeyConverter(r.resource);
    }
    return { ...r, key };
  });

  let formattedResources = "";
  resources.forEach((item, index) => {
    formattedResources += `{ 
                        resource: "${courseResources[index].key || ""}", 
                        resourceName: "${courseResources[index].resourceName}",
                        }`;
  });

  const graphqlQuery = updateCourseResourcesQuery(courseId, formattedResources);

  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Updating course resources response: ", response);

    if (response.data.errors) {
      throw new Error("Updating the course resources failed");
    }
    // yield put(actions.toggleCourseStateSuccess());
    yield put(actions.fetchCoursesStart(token));
  } catch (e) {
    console.log("Failed to update course resources", e);
    const failMessage = i18n.t("alerts.course.updatingResourcesFail");
    yield put(actions.updateCourseResourcesFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }

  try {
    for (const i in courseResources) {
      if (courseResources.hasOwnProperty(i)) {
        if (courseResources[i].resource instanceof File) {
          yield call(
            uploadFile,
            courseResources[i].resource,
            courseResources[i].key,
            token
          );
          continue;
        }
      }
    }
  } catch (e) {
    console.log("Error uploading course resources: ", e);
    const failMessage = i18n.t("alerts.course.uploadingResourcesFail");
    yield put(actions.updateCourseResourcesFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }
  yield put(actions.fetchCoursesStart(token));
  const socketNotification = {
    userType: "all",
    notification: "updateCourses",
  };
  docSocketNotification(socketNotification, token);
  const successMessage = i18n.t("alerts.course.updatingResourcesSuccess");
  yield put(actions.updateCourseResourcesSuccess(successMessage));
  yield delay(3000);
  yield put(actions.clearAlert());

  if ((filesToDelete || []).length > 0)
    yield put(actions.deleteFilesStart(filesToDelete, token));
}

function* toggleCourseState({ payload }) {
  const { courseId, token } = payload;

  const graphqlQuery = toggleCourseStateQuery(courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Changing course state response: ", response);

    if (response.data.errors) {
      throw new Error("Changing the course state failed");
    }
    yield put(actions.toggleCourseStateSuccess());
    yield put(actions.fetchCoursesStart(token));
    yield put(actions.closeModal());
  } catch (e) {
    console.log("Failed to change the course state", e);
    const failMessage = i18n.t("alerts.course.changeStateFail");
    yield put(actions.toggleCourseStateFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* deleteCourse({ payload }) {
  const { courseId, token } = payload;
  const graphqlQuery = deleteCourseQuery(courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Deleting course response: ", response);
    if (response.data.errors) {
      throw new Error("Deleting the course failed");
    }
    yield put(actions.deleteCourseSuccess());
    yield put(actions.fetchCoursesStart(token));
    yield put(actions.fetchInstructorsStart(token));
    yield put(actions.closeModal());
  } catch (e) {
    console.log("Failed to delete the course", e);
    const failMessage = i18n.t("alerts.course.deleteCourseFail");
    yield put(actions.deleteCourseFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* gradeCourse({ payload }) {
  const {
    courseId,
    studentId,
    formValues,
    suggestedGrade,
    passed,
    token,
    history,
  } = payload;

  const graphqlQuery = gradeCourseQuery(
    courseId,
    studentId,
    formValues,
    suggestedGrade,
    passed
  );
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Grading course response: ", response);
    if (response.data.errors) {
      throw new Error("Grading the course failed");
    }
    yield put(actions.gradeCourseSuccess());
    history.push(`/instructor-panel/course/${courseId}/students/enrolled`);
    yield put(actions.fetchCoursesStart(token));
    yield put(actions.closeModal());
  } catch (e) {
    console.log("Failed to grade the course", e);
    const failMessage = i18n.t("alerts.course.gradeCourseFail");
    yield put(actions.gradeCourseFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchToggleCourseState() {
  yield takeEvery(actionTypes.TOGGLE_COURSE_STATE_START, toggleCourseState);
}

function* watchUpdateCourseResources() {
  yield takeLatest(
    actionTypes.UPDATE_COURSE_RESOURCES_START,
    updateCourseResources
  );
}

function* watchFetchCourse() {
  yield takeEvery(actionTypes.FETCH_COURSE_START, fetchCourse);
}

function* watchCreateUpdateCourse() {
  yield takeLatest(actionTypes.CREATE_UPDATE_COURSE_START, createUpdateCourse);
}

function* watchDeleteCourse() {
  yield takeEvery(actionTypes.DELETE_COURSE_START, deleteCourse);
}

function* watchGradeCourse() {
  yield takeEvery(actionTypes.GRADE_COURSE_START, gradeCourse);
}

const instructorCourseSagas = [
  fork(watchFetchCourse),
  fork(watchCreateUpdateCourse),
  fork(watchUpdateCourseResources),
  fork(watchToggleCourseState),
  fork(watchDeleteCourse),
  fork(watchGradeCourse),
];

export default instructorCourseSagas;
