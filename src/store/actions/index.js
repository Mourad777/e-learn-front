export {
  startTest,
  startAssignment,
  clearTestInProgress,
  submitTestStart,
  submitTestSuccess,
  submitTestFail,
  fetchTestResultsStart,
  fetchTestResultsSuccess,
  fetchTestResultsFail,
  setStudentTestSection,
  exitAssignment,
} from "./student/test";

export {
  selectStudentLesson,
  markSlideAsSeenStart,
  markSlideAsSeenSuccess,
  markSlideAsSeenFail,
} from "./student/lesson";

export {
  clearStudentModalStates,
  showStudentCourseDetails,
  enrollCourseStart,
  enrollCourseSuccess,
  enrollCourseFail,
  enrollRequestStart,
  enrollRequestSuccess,
  enrollRequestFail,
  enrollDenyStart,
  enrollDenySuccess,
  enrollDenyFail,
  dropCourseStart,
  dropCourseSuccess,
  dropCourseFail,
  showStudentCourseSyllabus,
  selectCourse,
  clearStudentNotification,
  clearLoadedStudentData,
  setStudentTab,
} from "./student/course";

//instructor panel exports
export {
  fetchCourseStart,
  fetchCourseSuccess,
  fetchCourseFail,
  gradeCourseStart,
  gradeCourseSuccess,
  gradeCourseFail,
  createUpdateCourseStart,
  createUpdateCourseSuccess,
  createUpdateCourseFail,
  updateCourseResourcesStart,
  updateCourseResourcesSuccess,
  updateCourseResourcesFail,
  toggleCourseStateStart,
  toggleCourseStateSuccess,
  toggleCourseStateFail,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFail,
  finishEdit,
  clearInstructorModalStates,
  showCourseDetails,
  fetchTextEditorContent,
  clearInstructorTabContent,
  setCourseFormPage,
  setCreateCourseForm,
  setInstructorTab,
  clearInstructorNotification,
  clearLoadedInstructorData,
} from "./instructor/course";

export {
  fetchInstructorsStart,
  fetchInstructorsSuccess,
  fetchInstructorsFail,
} from "./instructor/instructor";

export {
  fetchAllStudentsStart,
  fetchAllStudentsSuccess,
  fetchAllStudentsFail,
} from "./instructor/student";

export {
  selectLesson,
  setCreateLessonForm,
  fetchLessonStart,
  fetchLessonSuccess,
  fetchLessonFail,
  createLessonStart,
  createLessonSuccess,
  createLessonFail,
  deleteLessonStart,
  deleteLessonSuccess,
  deleteLessonFail,
} from "./instructor/lesson";

export {
  fetchQuestionBankStart,
  fetchQuestionBankSuccess,
  fetchQuestionBankFail,
  createUpdateQuestionStart,
  createUpdateQuestionSuccess,
  createUpdateQuestionFail,
  deleteQuestionStart,
  deleteQuestionSuccess,
  deleteQuestionFail,
  setQuestionForm,
  setQuestionEditing,
  setQuestionDetail,
} from "./instructor/question";

export {
  setInstructorFolder,
  modulesChangeStart,
  modulesChangeSuccess,
  modulesChangeFailed,
} from "./instructor/category";

export {
  setTestToGrade,
  setInitialTestFormValues,
  clearTestToGrade,
  setInitialGradeValues,
  setTestFormSection,
  selectTest,
  selectAssignment,
  setInstructorTestSection,
  gradeTestStart,
  gradeTestSuccess,
  gradeTestFail,
  createUpdateTestStart,
  createUpdateTestSuccess,
  createUpdateTestFail,
  deleteTestStart,
  deleteTestSuccess,
  deleteTestFail,
  resetTestStart,
  resetTestSuccess,
  resetTestFail,
  closeTestStart,
  closeTestSuccess,
  closeTestFail,
} from "./instructor/test";

export {
  setAuthRedirectPath,
  checkUserSession,
  toggleForm,
  forgotPasswordPage,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFail,
  sendPasswordResetLinkStart,
  sendPasswordResetLinkSuccess,
  sendPasswordResetLinkFail,
  createAccountStart,
  createAccountSuccess,
  createAccountFail,
  updateAccountStart,
  updateAccountSuccess,
  updateAccountFail,
  setSignupFormPage,
  clearAuthNotification,
  authenticationStart,
  authenticationSuccess,
  authenticationFail,
  accountVerificationStart,
  accountVerificationSuccess,
  accountVerificationFail,
  resendEmailVerificationStart,
  resendEmailVerificationSuccess,
  resendEmailVerificationFail,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFail,
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFail,
  logout,
} from "./authentication/authentication";

export {
  updateActivityStart,
  updateActivitySuccess,
  updateActivityFail,
} from "./activity/activity";

export {
  uploadFileStart,
  uploadFileSuccess,
  uploadFileFail,
  deleteFilesStart,
  deleteFilesSuccess,
  deleteFilesFail,
} from "./files/files";

export { setChatUser } from "./common/chat";

export {
  fetchConfigStart,
  fetchConfigSuccess,
  fetchConfigFail,

  updateConfigStart,
  updateConfigSuccess,
  updateConfigFail,
} from "./common/configuration";

export {
  setNotification,
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFail,
  markAsSeenStart,
  markAsSeenSuccess,
  markAsSeenFail,
} from "./common/notification";

export {
  fetchModulesStart,
  fetchModulesSuccess,
  fetchModulesFail,
} from "./common/modules";

export {
  setTabLabels,
  setTab,
  clearAlert,
  setEditing,
  cancelEditing,
  openModal,
  closeModal,
  setWidth,
  setSessionAlert,
  setMic,
  setTheme,
} from "./common/layout";

export {
  setCourse,
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFail,
  setCoursePanel,
  returnToCourses,
} from "./common/course";

export {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFail,
} from "./common/student";

export {
  activateAccountStart,
  activateAccountSuccess,
  activateAccountFail,

  suspendAccountStart,
  suspendAccountSuccess,
  suspendAccountFail,
} from "./admin/accounts";

export {
  requestBitcoinAddressStart,
  requestBitcoinAddressSuccess,
  requestBitcoinAddressFail,

  intentCreditcardPaymentStart,
  intentCreditcardPaymentSuccess,
  intentCreditcardPaymentFail,

  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFail,

  fetchCryptoChargesStart,
  fetchCryptoChargesSuccess,
  fetchCryptoChargesFail,
} from "./transactions/transactions";

export { fetchTestStart, fetchTestSuccess, fetchTestFail } from "./common/test";
