import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Spinner from "../../components/UI/Spinner/Spinner";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router";
import { getCourse } from "../../utility/getCourse";

const StudentPanel = ({
  fetchTestResults,
  loading,
  fetchCourses,
  fetchNotifications,
  fetchConfig,
  testInSession,
  fetchStudents,
  fetchUser,
  fetchModules,
  clearTestSessionData,
  fetchTransactions,
  course,
  courses,
  closeModal,
  logout,
}) => {
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
      query: { token },
    });

    const handleInactiveStatus = () => {
      socket.emit("loggedOut", {
        user: userId,
      });
    };

    window.addEventListener("beforeunload", handleInactiveStatus);

    socket.open();
    socket.on("updateCourses", (data) => {
      if (
        data.userType === "student" ||
        data.userType === "all" ||
        data.userId === userId
      ) {

        fetchCourses(token, "noSpinner");
        fetchNotifications(token, 'noSpinner');
      }
    });

    socket.on("updateResults", (data) => {
      if (data.userType === "student" || data.userId === userId) {
        fetchTestResults(token, "noSpinner");
        fetchNotifications(token, 'noSpinner');
      }
    });

    socket.on("cryptoChargeEvent", (data) => {
      //watch for confirmation of crypto transaction
      const event = data.event;
      if (data.userId === userId) {
        fetchTransactions(token);
        if (event.type === 'charge:confirmed' || event.type === 'charge:delayed') {
          closeModal()
          fetchCourses(token);
        }
      }

    });

    socket.emit("loggedIn", {
      //let server know to show user as active
      user: userId,
    });

    socket.on("mainMenu", (data) => {
      //triggered when instructor deletes a course and many other cases
      if ((data.userId === userId || data.userType === 'student') && testInSession) {
        fetchNotifications(token, 'noSpinner');
        fetchCourses(token, "noSpinner");
        clearTestSessionData()
        if (course) {
          history.push(`/student-panel/courses/${course}/modules`)
        } else {
          history.push(`/student-panel/course`)
        }

      }
    });

    socket.on("activateAccount", (data) => {
      //when admin activates the account of a new user
      if (
        data.userId === userId
      ) {
        fetchUser(token, 'noSpinner')
        fetchConfig(token, 'noSpinner')
        fetchNotifications(token, 'noSpinner')
        fetchCourses(token, 'noSpinner')
        fetchTestResults(token, 'noSpinner')
      }
    });

    socket.on("suspendAccount", (data) => {
      //if admin suspends user account log user out
      if (
        data.userId === userId
      ) {
        logout(history);
      }
    });

    socket.on("alert", (data) => {
      //to be notified by bell notification if someone sends an instant message
      fetchNotifications(token, 'noSpinner');
    });

    socket.on("updateStudents", (data) => {
      if (!course) return
      if (
        (data.userType === "all" || data.userType === "student") &&
        data.courseId === course
      ) {
        fetchStudents(course, token, "noSpinner");
        fetchNotifications(token, 'noSpinner');
      }
    });

    socket.on("updateModules", (data) => {
      if (!course) return;
      if (data.userType === "student")
        fetchModules(course, token, "noSpinner");
    });

    socket.on("updateConfig", (data) => {
      if (
        data.userType === "all" ||
        data.courseId === course
      ) {
        fetchConfig(token, 'noSpinner');
      }
    });


    //get all dates from documents that require a rerender
    //when that date/time is reached
    //for example when a test available on date is reached
    //the user will see the start test button appear
    const populatedCourse = getCourse(courses, course);

    /////////////////////////////////////////////////////////////////////////////////////
    const lessonDates = (populatedCourse.lessons || [])
      .filter(
        (l) => l.availableOnDate && Date.now() < parseInt(l.availableOnDate)
      )
      .map((l) => parseInt(l.availableOnDate));

    const testAssignmentStartDates = (populatedCourse.tests || [])
      .filter(
        (t) => t.availableOnDate && Date.now() < parseInt(t.availableOnDate)
      )
      .map((t) => parseInt(t.availableOnDate));

    const testEndDates = (populatedCourse.tests || [])
      .filter(
        (t) =>
          t.dueDate &&
          Date.now() < parseInt(t.dueDate) &&
          !t.allowLateSubmission
      )
      .map((t) => parseInt(t.dueDate));

    //get all assignments due dates that do not allow late submission and all assignment due dates
    //that allow late submissions adding to the due date the late days allowed

    const assignmentDailyEndDates = [];

    //get timestamps for time of day when the late penalty hits for the assignments that
    //allow late submissions
    (populatedCourse.tests || []).forEach((t) => {
      //check if late submission is allowed and close date is in the future
      if (
        t.allowLateSubmission &&
        Date.now() < parseInt(t.dueDate) + t.lateDaysAllowed * 86400000
      ) {
        //loop through numbers starting from due date by increments of 86400000 (1 day) to a max of the late days allowed
        for (
          let i = parseInt(t.dueDate);
          i < parseInt(t.dueDate) + t.lateDaysAllowed * 86400000;
          i += 86400000
        ) {
          if (i > Date.now()) assignmentDailyEndDates.push(i);
        }
      }
    });

    const assignmentEndDatesWithLateSubmission = (populatedCourse.tests || [])
      .filter(
        (t) =>
          Date.now() < parseInt(t.dueDate) + t.lateDaysAllowed * 86400000 &&
          t.allowLateSubmission
      )
      .map((t) => parseInt(t.dueDate) + t.lateDaysAllowed * 86400000);

    const testGradeReleaseDates = (populatedCourse.tests || [])
      .filter(
        (t) => t.gradeReleaseDate && Date.now() < parseInt(t.gradeReleaseDate)
      )
      .map((t) => parseInt(t.gradeReleaseDate));

    let tOutId;
    const docDatesTimoutIds = [];
    [
      ...lessonDates,
      ...testAssignmentStartDates,
      ...testEndDates,
      ...assignmentEndDatesWithLateSubmission,
      ...assignmentDailyEndDates,
      ...testGradeReleaseDates,
    ].forEach((d) => {
      tOutId = setTimeout(() => {
        // block loading spinner when time is reached
        docDatesTimoutIds.push(tOutId);
        fetchCourses(token, 'noSpinner');
        fetchTestResults(token, 'noSpinner');
      }, d - Date.now());
    });

    return () => {
      //clean up timouts
      docDatesTimoutIds.forEach((tId) => {
        clearTimeout(tId);
      });
      socket.emit("loggedOut", {
        user: userId,
      });
      window.removeEventListener("beforeunload", handleInactiveStatus);
      socket.disconnect();
    };
  }, [course, courses, testInSession]);

  return (
    <Aux>
      <Spinner active={loading} transparent />
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCourses: (token, spinner) =>
      dispatch(actions.fetchCoursesStart(token, spinner)),
    fetchTestResults: (token, spinner) =>
      dispatch(actions.fetchTestResultsStart(token, spinner)),
    fetchNotifications: (token, spinner) =>
      dispatch(actions.fetchNotificationsStart(token, spinner)),
    fetchStudents: (courseId, token, spinner) =>
      dispatch(actions.fetchStudentsStart(courseId, token, null, spinner)),
    fetchModules: (courseId, token, spinner) =>
      dispatch(actions.fetchModulesStart(courseId, token, spinner)),
    fetchUser: (token, spinner) =>
      dispatch(actions.fetchUserStart(token, spinner)),
    fetchTransactions: (token) =>
      dispatch(actions.fetchTransactionsStart(token)),
    closeModal: () => {
      dispatch(actions.closeModal());
    },
    logout: (history) => {
      dispatch(actions.logout(history));
    },
    fetchConfig: (token, spinner) => dispatch(actions.fetchConfigStart(token, spinner)),
    clearTestSessionData: () => dispatch(actions.returnToCourses()),
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.authentication.token,
    userId: state.authentication.userId,
    loading:
      state.studentCourse.loading ||
      state.studentTest.loading ||
      state.common.loading,
    notification: state.common.notification,
    tab: state.common.tab,
    course: state.common.selectedCourse,
    courses: state.common.courses,
    testInSession: state.studentTest.testInSession,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentPanel);