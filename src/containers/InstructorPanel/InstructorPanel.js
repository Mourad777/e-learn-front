import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import socketIOClient from "socket.io-client";
import Spinner from "../../components/UI/Spinner/Spinner";
import { useHistory } from "react-router";

const InstructorPanel = ({
  loading,
  token,
  fetchUser,
  fetchAllStudents,
  fetchStudents,
  fetchInstructors,
  fetchNotifications,
  fetchCourses,
  fetchConfig,
  selectedCourse,
  logout,
}) => {
  const history = useHistory()
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (token) {

      const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
        query: { token: token },
      });

      const handleInactiveStatus = () => {
        //let server know that user is now inactive
        socket.emit("loggedOut", {
          user: userId,
        });
      };

      window.addEventListener("beforeunload", handleInactiveStatus);
      socket.open();

      socket.on("newAccount", (data) => {
        fetchAllStudents(token, 'noSpinner')
        fetchInstructors(token, 'noSpinner')
        fetchNotifications(token, 'noSpinner');
      });

      socket.on("updateCourses", (data) => {
        if (data.userType === "instructor" || data.userType === "all")
          fetchCourses(token, "noSpinner");
        fetchNotifications(token);
      });

      socket.on("updateStudents", (data) => {
        if (
          (data.userType === "instructor" || data.userType === "all") &&
          (data.userId === userId || data.courseId === selectedCourse)
        ) {
          if (selectedCourse) {
            fetchStudents(selectedCourse, token, "noSpinner");
          }
          fetchCourses(token, "noSpinner");
        }

        if (
          data.userId === userId &&
          data.fetchNotifications
        )
          fetchNotifications(token, 'noSpinner');
      });

      socket.on("activateAccount", (data) => {
        if (
          data.userId === userId
        ) {
          fetchUser(token, 'noSpinner')
          fetchConfig(token, 'noSpinner')
          fetchNotifications(token, 'noSpinner')
          fetchCourses(token, 'noSpinner')
          fetchInstructors(token, 'noSpinner')
        }
      });
      socket.on("suspendAccount", (data) => {
        //log user out when admin suspends account
        if (
          data.userId === userId
        ) {
          logout(history);
        }
      });
      socket.emit("loggedIn", {
        //let server know that the user is active so other see the user as online
        user: userId,
      });

      socket.on("alert", (data) => {
        //updates notification bell in real-time when someone send an instant message
        fetchNotifications(token, 'noSpinner');
      });

      return () => {
        //clean up timeouts
        socket.emit("loggedOut", {
          user: userId,
        });
        window.removeEventListener("beforeunload", handleInactiveStatus);
        socket.disconnect();
      };
    }

  }, [token]);

  useEffect(() => {
    if (token) {
      const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
        query: { token: token },
      });
      socket.on("updateConfig", (data) => {
        if (data.userType === 'all') {
          fetchConfig(token);
        }
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [selectedCourse, token])

  return (
    <Aux>
      <Spinner active={loading} transparent />
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: (token) => dispatch(actions.fetchUserStart(token)),
    fetchInstructors: (token) => dispatch(actions.fetchInstructorsStart(token)),
    fetchAllStudents: (courseId, token) =>
      dispatch(actions.fetchAllStudentsStart(courseId, token)),
    fetchStudents: (courseId, token) =>
      dispatch(actions.fetchStudentsStart(courseId, token)),
    fetchConfig: (token) =>
      dispatch(actions.fetchConfigStart(token)),
    fetchCourses: (token, spinner) =>
      dispatch(actions.fetchCoursesStart(token, spinner)),
    fetchNotifications: (token, spinner) => {
      dispatch(actions.fetchNotificationsStart(token, spinner));
    },
    logout: (history) => {
      dispatch(actions.logout(history));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.authentication.token,
    userId: state.authentication.userId,
    notification: state.common.notification,
    selectedCourse: state.common.selectedCourse,
    courses: state.common.courses,
    tab: state.common.tab,
    initialPath: state.authentication.initialPath,
    loading:
      state.authentication.loading ||
      state.instructorCourse.loading ||
      state.common.loading,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstructorPanel);
