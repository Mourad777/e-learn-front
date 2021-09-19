import { matchPath } from "react-router-dom";

export const getUserTypeFromUrl = (url) => {
    let userType, params;
    const matchInstructorPanel = matchPath(url, {
      path: "/instructor-panel/courses",
      exact: false,
    }) || matchPath(url, {
      path: "/instructor-panel/course/:courseId",
      exact: false,
    });
    const matchStudentPanel = matchPath(url, {
      path: "/student-panel/courses",
      exact: false,
    }) || matchPath(url, {
      path: "/student-panel/course/:courseId",
      exact: false,
    });
    if (matchInstructorPanel) {
      userType = 'instructor'
      params = matchInstructorPanel.params
    }
    if (matchStudentPanel) {
      userType = 'student'
      params = matchStudentPanel.params
    }
    return {
      userType,
      params,
    }
  }