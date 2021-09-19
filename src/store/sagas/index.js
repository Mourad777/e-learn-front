import AuthenticationSagas from "./authentication/authentication";
import StudentCourseSagas from "./student/course/course";
import StudentTestSagas from "./student/test/test";
import StudentLessonSagas from "./student/lesson/lesson"
import InstructorFetchQuestionbankSaga from "./instructor/question/fetchQuestionbank/fetchQuestionbank";
import InstructorCreateUpdateQuestionSaga from "./instructor/question/createUpdateQuestion/createUpdateQuestion"
import InstructorDeleteQuestionSaga from "./instructor/question/deleteQuestion/deleteQuestion"
import InstructorLessonSagas from "./instructor/lesson/lesson";
import InstructorCourseSagas from "./instructor/course/course";
import InstructorStudentSagas from "./instructor/students/student";
import InstructorModulesSagas from "./instructor/modules/modules";
import InstructorCreateUpdateTestSaga from "./instructor/test/createUpdateTest/createUpdateTest"
import InstructorDeleteTestSaga from "./instructor/test/deleteTest/deleteTest"
import InstructorResetTestSaga from "./instructor/test/resetTest/resetTest"
import InstructorGradeTestSaga from "./instructor/test/gradeTest/gradeTest"
import InstructorCloseTestSaga from "./instructor/test/closeTest/closeTest"
import InstructorInstructorSaga from "./instructor/instructor/instructor"
import CommonModulesSagas from "./common/modules/modules";
import CommonStudentSagas from "./common/students/student";
import CommonCourseSagas from "./common/course/course";
import CommonFileSagas from "./common/files/files";
import CommonFetchTestSaga from "./common/test/fetchTest/fetchTest";
import CommonNotificationsSaga from "./common/notifications/notifications";
import ConfigurationSaga from "./common/configuration/configuration"
import AdminAccountSaga from "./admin/accounts"
import TransactionsSaga from "./transactions/transactions"
import { all } from "redux-saga/effects";
import activitySagas from "./common/activity/activity";

export default function* rootSaga() {
  yield all([
    ...CommonModulesSagas,
    ...CommonStudentSagas,
    ...CommonCourseSagas,
    ...CommonFetchTestSaga,
    ...AuthenticationSagas,
    ...InstructorLessonSagas,
    ...InstructorCourseSagas,
    ...InstructorCreateUpdateTestSaga,
    ...InstructorDeleteTestSaga,
    ...InstructorResetTestSaga,
    ...InstructorGradeTestSaga,
    ...InstructorCloseTestSaga,
    ...InstructorFetchQuestionbankSaga,
    ...InstructorCreateUpdateQuestionSaga,
    ...InstructorDeleteQuestionSaga,
    ...InstructorModulesSagas,
    ...InstructorInstructorSaga,
    ...InstructorStudentSagas,
    ...StudentCourseSagas,
    ...StudentTestSagas,
    ...StudentLessonSagas,
    ...CommonFileSagas,
    ...CommonNotificationsSaga,
    ...ConfigurationSaga,
    ...AdminAccountSaga,
    ...activitySagas,
    ...TransactionsSaga,
  ]);
}

//yeild all in rootsaga allows all these forked
//processes to be created in parallel