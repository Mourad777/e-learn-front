import { takeEvery, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../../actions/axios-base";
import * as actions from "../../../actions/index";
import * as actionTypes from "../../../actions/actionTypes";
import { coursesQuery } from "./query";
import i18n from "../../../../i18n/index";
import { getKeyFromAWSUrl } from "../../../../utility/getKeyFromUrl";


function* fetchCourses({payload}) {
  const token = payload.token;
  const graphqlQuery = coursesQuery();
  let errorMessage;
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token); //no call backs, waits for it to resolve
    errorMessage = (((response.data.data||{}).errors||[])[0]||{}).message
    console.log('error message',errorMessage)
    console.log("Fetching courses response", response);
    //code here will run once call has resolved
    if (response.data.errors) {
      throw new Error("Failed to get the courses");
    }
    const courses = response.data.data.courses;
    const fixedCourses = courses.map(c=>{
      return {
        ...c,
        resources:c.resources.map((r) => {
          return {
            _id:r._id,
            resourceName: r.resourceName,
            resource: getKeyFromAWSUrl(r.resource),
            loadedResource: r.resource,
          };
        }),
      }
    })
    //update selected course
    yield put(actions.fetchCoursesSuccess(fixedCourses));
  } catch (e) {
    console.log("Failed to get the courses", e);
    const failMessage = i18n.t("alerts.course.fetchCoursesFail");
    if(errorMessage !== 'accountNotActivated') {
      yield put(actions.fetchCoursesFail(failMessage));
      yield delay(3000)
      yield put(actions.clearAlert());
    }
  }
}

function* watchFetchCourses() {
  //take every is a non-blocking call, it doesn't stop other
  //generators from running
  //it spawns new sagas everytime it hears the specific action type
  yield takeEvery(actionTypes.FETCH_COURSES_START, fetchCourses);
}

const commonCourseSagas = [fork(watchFetchCourses)];

export default commonCourseSagas;