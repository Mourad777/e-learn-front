import React, { useEffect, useRef, useState } from "react";
import { Route, Switch, withRouter, Redirect, Router, useParams } from "react-router-dom";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/core/styles";
import Tabbar from "./components/Navigation/Tabbar/Tabbar"
import defaultTheme from "./themes/Theme";
import darkTheme from "./themes/DarkTheme";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Alert from "./components/UI/Alert/Alert";
import IdleTimer from "react-idle-timer";
import { Helmet } from 'react-helmet';
import { LightThemeString } from "./themes/LightThemeString";
import { DarkThemeString } from "./themes/DarkThemeString";
import { GlobalCssOverrides } from "./themes/CssOverridesString";
import { getRoutes } from "./routes"
import "moment/locale/es.js";
import "moment/locale/fr.js";
import "moment/locale/ru.js";
import "moment/locale/ar.js";
import "moment/locale/en-ca.js";
import Spinner from "./components/UI/Spinner/Spinner";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import socketIOClient from "socket.io-client";
import { redirect } from "./utility/redirect";
import { getUserTypeFromUrl } from "./utility/getUserTypeFromUrl";
import { getAppActions } from "./getAppActions";
import { getAppState } from "./getAppState";
const Layout = React.lazy(() => import("./hoc/Layout/Layout"));
const SocketListenersInstructorPanel = React.lazy(() => import("./containers/InstructorPanel/InstructorPanel"));
const SocketListenersStudentPanel = React.lazy(() => import("./containers/StudentPanel/StudentPanel"));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const App = ({
  onTryAutoSignup,
  successMessage,
  failMessage,
  instructorLoggedIn,
  studentLoggedIn,
  updateActivity,
  configuration,
  isDarkTheme,
  selectedCourse,
  onSelectCourse,
  fetchTestResults,
  fetchUser,
  fetchConfig,
  fetchNotifications,
  fetchCourses,
  fetchInstructors,
  fetchAllStudents,
  fetchTransactions,
  fetchCryptoCharges,
  testInSession,
  history,
  tokenFromState,
  loadedUser,
}) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const currentLocation = history.location.pathname
  const [isSmallDrawer, setIsSmallDrawer] = useState(false);

  const handleUserActiveState = (socket, userId) => {
    //let the server know that the user is no longer active
    //when the window closes
    socket.emit("idle", {
      user: userId,
    });
  }

  useEffect(() => {
    if (token && userId) {
      const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
        query: { token },
      });
      window.addEventListener('beforeunload', () => handleUserActiveState(socket, userId))
    }
    //check to see if there is a token in local storage and if its still valid
    onTryAutoSignup(history);

    return () => {
      window.removeEventListener('beforeunload', handleUserActiveState)
    }
  }, [token]);

  useEffect(() => {
    //redirect student to test-session panel if a test has been started in order to restrict access to course content
    redirect(currentLocation, testInSession, instructorLoggedIn, studentLoggedIn, history, token);
  }, [currentLocation, testInSession])

  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current && !!tokenFromState && !!(loadedUser || {}).isAccountActivated) {
      // do componentDidMount logic

      //run only once and when the user logs in
      //fetch data that is needed by the entire app
      //not dependent upon a specific course
      fetchUser(tokenFromState)
      fetchConfig(tokenFromState)
      fetchNotifications(tokenFromState)
      fetchCourses(tokenFromState)
      fetchTransactions(tokenFromState)
      fetchCryptoCharges(tokenFromState)
      if (userType === 'instructor' || userType === 'admin') {
        fetchInstructors(tokenFromState)
      }
      if (userType === 'admin') {
        fetchAllStudents(tokenFromState)
      }
      if (userType === 'student') {
        fetchTestResults(tokenFromState)
      }
      mounted.current = true;
    }
  })

  useEffect(() => {
    if (!tokenFromState) {
      //if user logs out, reset the mounted.current variable
      //so that when the user logs in again, the functions
      //to fetch all the info from the database will run again
      mounted.current = false;
    }
  }, [tokenFromState])

  useEffect(() => {
    //watch for changes in url and detect the selected course
    //from the url
    //update the redux store accordingly
    const { params = {} } = getUserTypeFromUrl(currentLocation)
    const courseId = params.courseId
    if (courseId) {
      onSelectCourse(courseId === 'new' ? null : courseId)
    } else {
      onSelectCourse(null)
    }
  }, [history.location.pathname]);

  const params = useParams();

  const handleDrawerWidth = () => {
    //change from normal to compact drawer
    setIsSmallDrawer(!isSmallDrawer)
  }

  const isStayLoggedIn = configuration.isStayLoggedIn;
  return (
    <React.Suspense fallback={<Spinner active transparent />}>
      <Helmet>
        {/*
         implement custom styles that are used on components throughout the app
        for npm packages whose styling api is not clear in the docs
        */}
        <style type="text/css">
          {isDarkTheme ? DarkThemeString : LightThemeString}
        </style>
        <style type="text/css">
          {GlobalCssOverrides}
        </style>
      </Helmet>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={isDarkTheme ? darkTheme : defaultTheme}>
            {token && <IdleTimer
              element={document}
              onActive={() => { updateActivity(userId, token, 'active', isStayLoggedIn) }}
              onIdle={() => { updateActivity(userId, token, 'idle', isStayLoggedIn) }}
              debounce={1000}
              timeout={30 * 1000}
            />}
            <Elements stripe={stripePromise}>
              <Router history={history}>
                <Layout handleDrawerWidth={handleDrawerWidth} isSmallDrawer={isSmallDrawer}>
                  {/* top navigation underneath main appbar usually with 2 or 3 selections */}
                  <div style={{ marginBottom: 20, marginTop: 15 }}>
                    <Tabbar />
                  </div>
                  <Alert successMessage={successMessage} failMessage={failMessage} />
                  {/* load component that will listen to changes in the app in real time, also includes loading spinner  */}
                  {(studentLoggedIn && token) && <SocketListenersStudentPanel />}
                  {(instructorLoggedIn && token) && <SocketListenersInstructorPanel />}
                  <Switch>
                    {getRoutes().map(route => {
                      return (
                        <Route
                          key={route.path}
                          exact={route.exact}
                          path={route.path}
                          render={(props) => {

                            if (route.isStudentRoute && token && userType !== 'student') return <Redirect to={`/instructor-panel/courses`} />;
                            if (route.isInstructorRoute && token && !(userType === 'admin' || userType === 'instructor')) return <Redirect to={`/student-panel/courses`} />;
                            let panelType;
                            if (userType === 'student') panelType = 'student';
                            if (userType === 'admin' || userType === 'instructor') panelType = 'instructor';
                            const containerPadding = route.path === `/${panelType}-panel/course/:courseId/chat/user/:userId` ? '10px 15px 0px 15px' : '10px 15px 50px 15px';
                            return (
                              <div style={{ maxWidth: route.maxWidth || 500, margin: 'auto', width: '100%', marginTop: 0, padding: containerPadding }}>
                                {(!token && route.isTokenRequired !== false) && <Redirect //if the route requires a token and no token is present than redirect
                                  to={"/authentication"}
                                />}
                                <route.component
                                  enrollmentRequests={route.isEnrollmentRequests}
                                  isTest={route.isTest}
                                  isAssignment={!route.isTest}
                                  instructorPanel={route.instructorPanel}
                                  userType={route.userType}
                                  selectedCourse={selectedCourse}
                                  editing={route.isEditing}
                                  isStudent={route.isStudent}
                                  params={params}
                                  history={history}
                                  isSmallDrawer={isSmallDrawer}
                                  {...props}
                                />
                              </div>
                            );
                          }}
                        />
                      )
                    })}
                    {(userType === 'student') && <Redirect to={"/student-panel/courses"} />}
                    {((userType === 'instructor') || (userType === 'admin')) && <Redirect to={"/instructor-panel/courses"} />}
                    {(!token) && <Redirect to={"/authentication"} />}
                  </Switch>
                </Layout>
              </Router>
            </Elements>
          </ThemeProvider>
        </I18nextProvider>
      </MuiPickersUtilsProvider>
    </React.Suspense>
  );
};

const mapStateToProps = (state) => {
  return getAppState(state);
};

const mapDispatchToProps = (dispatch) => {
  return getAppActions(dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
