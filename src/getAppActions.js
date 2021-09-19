import * as actions from "./store/actions/index";

export const getAppActions = (dispatch) => {
    return {
        onTryAutoSignup: (history) => dispatch(actions.checkUserSession(history)),
        updateActivity: (userId, token, activity, isStayLoggedIn) => {
          dispatch(actions.updateActivityStart(userId, token, activity, isStayLoggedIn));
        },
        onSelectCourse: (course) => {
          dispatch(actions.setCourse(course));
        },
        fetchQuestionBank: (courseId, token) =>
          dispatch(actions.fetchQuestionBankStart(courseId, token)),
        fetchTestResults: (token) => dispatch(actions.fetchTestResultsStart(token)),
        fetchCourses: (token, spinner) =>
          dispatch(actions.fetchCoursesStart(token, spinner)),
        fetchConfig: (token, spinner) =>
          dispatch(actions.fetchConfigStart(token, spinner)),
        fetchUser: (token, spinner) =>
          dispatch(actions.fetchUserStart(token, spinner)),
        fetchNotifications: (token) =>
          dispatch(actions.fetchNotificationsStart(token)),
        fetchInstructors: (token) =>
          dispatch(actions.fetchInstructorsStart(token)),
        fetchAllStudents: (token) =>
          dispatch(actions.fetchAllStudentsStart(token)),
        fetchTransactions: (token) =>
          dispatch(actions.fetchTransactionsStart(token)),
        fetchCryptoCharges: (token) =>
          dispatch(actions.fetchCryptoChargesStart(token)),
        openModal: (document, type) => dispatch(actions.openModal(document, type)),
        logout: () => dispatch(actions.logout()),
      };
}