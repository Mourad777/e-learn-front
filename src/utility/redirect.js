import { matchPath } from "react-router-dom";

export const redirect = (currentLocation, testInSession, instructorLoggedIn, studentLoggedIn, history, token) => {
    const isTestSessionPanelMatch = !!matchPath(currentLocation, {
        path: '/student-panel/course/:courseId/test-in-session',
        exact: true,
    });
    const isLessonPanelMatch = !!matchPath(currentLocation, {
        path: '/student-panel/course/:courseId/lessons',
        exact: true,
    });
    const isLessonMatch = !!matchPath(currentLocation, {
        path: '/student-panel/course/:courseId/lesson/:lessonId/preview',
        exact: true,
    });
    const isAuthMatch = !!matchPath(currentLocation, {
        path: '/authentication',
        exact: false,
    });
    const isLogoutMatch = !!matchPath(currentLocation, {
        path: '/logout',
        exact: false,
    });


    //redirect student to test-session panel if a test has been started in order to restrict access to course content
    if (!isTestSessionPanelMatch && !isLessonPanelMatch && !isLogoutMatch && !isLessonMatch && testInSession) {
        history.push(`/student-panel/course/${testInSession.course}/test-in-session`)
    }
    return {
        isTestSessionPanelMatch,
        isLessonPanelMatch,
        isLessonMatch,
        isAuthMatch,
        isLogoutMatch,
    }
}