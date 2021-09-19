import { getCourse } from "./utility/getCourse";
import { getFetchApiMessage } from "./utility/getFetchApiMessage";

export const getAppState = (state) => {
    const course = state.common.selectedCourse
    const populatedCourse = getCourse(state.common.courses, course)
    return {
        isAuthenticated: state.authentication.token !== null,
        tokenFromState: state.authentication.token,
        selectedCourse: course,
        width: state.common.width,
        course: populatedCourse,
        studentLoggedIn: state.authentication.studentLoggedIn,
        testInSession: state.studentTest.testInSession,
        instructorLoggedIn: state.authentication.instructorLoggedIn,
        loadedUser: state.authentication.loadedUser,
        loadedUser: state.authentication.loadedUser,
        testResults: state.studentTest.testResults,
        configuration: state.common.configuration,
        successMessage: getFetchApiMessage(state, 'successMessage'),
        failMessage: getFetchApiMessage(state, 'failMessage'),
        token: state.authentication.token,
        userId: state.authentication.userId,
        loadedTestDataInProgress: state.studentTest.loadedTestDataInProgress,
        loadedLessonFormData: state.instructorLesson.loadedLessonFormData,
        isDarkTheme: state.common.isDarkTheme,
        modules: state.common.modules,
    };
}