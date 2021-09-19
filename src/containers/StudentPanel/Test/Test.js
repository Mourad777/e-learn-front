import React, { useState, useEffect } from "react";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import { reduxForm, getFormValues, getFormSyncErrors } from "redux-form";
import MultipleChoiceSection from "./MultipleChoiceSection";
import EssaySection from "./EssaySection";
import FillInBlankSection from "./FillInBlankSection";
import SpeakingSection from "./SpeakingSection";
import validate from "./validate";
import classes from "./Test.module.css";
import Button from "@material-ui/core/Button";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import TestMaterials from "./TestMaterials/TestMaterials";
import { previewAudio } from "../../../utility/audioRecorder";
import Typography from "@material-ui/core/Typography";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { getUrls } from "../../../utility/getUrls";
import Timer from "./Timer";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import socketIOClient from "socket.io-client";
import { useTranslation } from "react-i18next";
import { withRouter, Route, useHistory } from "react-router-dom"
import SubmitButton from "../../../components/UI/Button/SubmitButton";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const Lesson = React.lazy(() => import("../../InstructorPanel/Lessons/Lesson/Lesson"));
const Lessons = React.lazy(() => import("../../InstructorPanel/Lessons/Lessons"));
const testSessionRoutes = [
  {
    path: "/student-panel/course/:courseId/lessons",
    exact: true,
    component: Lessons,
  },
  {
    path: "/student-panel/course/:courseId/lesson/:lessonId/preview",
    exact: true,
    component: Lesson,

  },
]

const TestSession = ({
  courses,
  notifications,
  setCourse,
  markAsSeen,
  fetchNotifications,
  fetchCourses,
  fetchTestResults,
  userId,
  testInSession = {},
  isTest,
  loading,
  initialValues = {},
  formValues,
  formErrors,
  changeSection,
  width,
  studentTest,
  submitTest,
  assignmentDataInProgress,
  testResults,
  onStartAssignment,
  onContinueAssignment,
  match,
}) => {
  const token = localStorage.getItem('token');
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [initialUrls, setInitialUrls] = useState([]);
  const [isWarned, setIsWarned] = useState(false);
  const { t } = useTranslation('common');


  useEffect(() => {
    if (!testResults) return;
    const testTakingId = match.params.assignmentId;
    if (assignmentDataInProgress && !isTest) {
      onContinueAssignment(
        testTakingId,
        token,
        assignmentDataInProgress
      );
    }

    if (!assignmentDataInProgress && !isTest) {
      onStartAssignment(testTakingId, token);
    }


  }, [testResults])

  useEffect(() => {
    const initialUrls = getUrls(initialValues, "studentTest");
    const courseId = initialValues.course;

    const testCourse = (courses || []).find(
      (course) => course._id === courseId
    );
    setCourse(courseId);

    const notificationToMark = (notifications || []).find((n) => {
      if (
        n.documentId === initialValues.test &&
        n.documentType === "assignment"
      )
        return n;
    });

    if (notificationToMark) {
      markAsSeen(notificationToMark._id, token);
      fetchNotifications(token);
    }

    const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
      query: { token },
    });

    socket.on("mainMenu", (data) => {
      if (
        (data.userType === "student" || data.userId === userId) &&
        ((data.action === "deleteTest" && testInSession._id === data.testId) ||
          (data.action === "deactivateCourse" &&
            (testCourse || {})._id === data.course) ||
          ((data.action === "closeTest" || data.action === "excuseTest") &&
            (initialValues || {}).test === data.testId) ||
          (data.action === "denyStudentCourseAccess" &&
            (testCourse || {})._id === data.course &&
            data.userId === userId) ||
          (data.action === "resetTest" && testInSession._id === data.testId))
      ) {
        fetchCourses(token);
        fetchTestResults(token);
        history.push("/student-panel/courses");
      }
    });

    setInitialUrls(initialUrls);

    return () => {
      socket.disconnect();
    }
  }, [initialValues])

  useEffect(() => {
    if (formErrors.allAnswersFilled) {
      setIsWarned(false)
    }
  }, [formErrors])


  const onSubmit = (filePath, saveProgress, exitAssignment, isIgnoredWarning) => {
    if (
      !saveProgress &&
      !exitAssignment &&
      !formErrors.allAnswersFilled &&
      !isWarned &&
      !isIgnoredWarning
    ) {
      setIsWarned(true)
      return;
    }
    const updatedUrls = getUrls((studentTest || {}).values, "studentTest");
    const filesToDelete = (initialUrls || []).filter(
      (initialUrl) => {
        if (!updatedUrls.includes(initialUrl)) {
          return initialUrl;
        }
      }
    );

    submitTest(
      (studentTest || {}).values,
      token,
      userId,
      saveProgress ? false : true,
      testInSession,
      filesToDelete,
      exitAssignment,
      filePath,
      history,
    );
    if (exitAssignment) exitAssignment();
  };

  const nextPage = () => {
    setPage(page => page + 1)
  };

  const previousPage = () => {
    setPage(page => page - 1)
  };

  const filePath = `courses/${(testInSession || {}).course}/tests/${(testInSession || {})._id
    }/results/${(initialValues || {})._id}`;
  const secWeights = (testInSession || {}).sectionWeights || {};
  const mcSection = secWeights.mcSection;
  const essaySection = secWeights.essaySection;
  const fillBlankSection = secWeights.fillBlankSection;
  const speakingSection = secWeights.speakingSection;

  let mcSecPage = 1;
  let esSecPage = mcSection ? 2 : 1;

  let spSecPage;
  if (mcSection && essaySection) spSecPage = 3;
  if (!mcSection && essaySection) spSecPage = 2;
  if (mcSection && !essaySection) spSecPage = 2;
  if (!mcSection && !essaySection) spSecPage = 1;

  const audioMaterials =
    ((testInSession || {}).audioMaterials || [])[4] || {};
  const readingMaterials =
    ((testInSession || {}).readingMaterials || [])[4] || {};
  const videoMaterials =
    ((testInSession || {}).videoMaterials || [])[4] || {};

  const areTestMaterials =
    !!audioMaterials.audio ||
    !!readingMaterials.content ||
    !!videoMaterials.video;

  let totalPages = Object.values(
    (testInSession || {}).sectionWeights || {}
  ).filter((item) => item !== null).length;

  if (areTestMaterials) {
    mcSecPage = mcSecPage + 1;
    esSecPage = esSecPage + 1;
    spSecPage = spSecPage + 1;
    totalPages = totalPages + 1;
  }
  const fillBlankSectionPage = totalPages;
  if (page === 1 && areTestMaterials) {
    changeSection("materials");
  }
  if (page === mcSecPage && mcSection) {
    changeSection("mc");
  }
  if (page === esSecPage && essaySection) {
    changeSection("essay");
  }
  if (page === spSecPage && speakingSection) {
    changeSection("speaking");
  }
  if (page === fillBlankSectionPage && fillBlankSection) {
    changeSection("fillblanks");
  }

  const navButtons = (
    <div
      className={
        page !== 1
          ? classes.flexPositioningSpaceBetween
          : classes.flexPositioningEnd
      }
    >
      {!(page === 1) && (
        <Button
          color="primary"
          style={{ marginRight: "3px" }}
          onClick={() => {
            previousPage();
            setIsWarned(false)

          }}
          startIcon={<ArrowBackIosIcon />}
          size="small"
        >
          {areTestMaterials && page === 2
            ? (testInSession || {}).assignment
              ? t("testSession.assignmentResources")
              : t("testSession.testResources")
            : t("testSession.buttons.previousSection")}
        </Button>
      )}
      {!(page === totalPages) && (
        <Button
          onClick={() => {
            nextPage();
            setIsWarned(false)
          }}
          style={{ marginLeft: "3px" }}
          color="primary"
          endIcon={<ArrowForwardIosIcon />}
          size="small"
        >
          {areTestMaterials && page === 1
            ? t("testSession.buttons.questions")
            : t("testSession.buttons.nextSection")}
        </Button>
      )}
    </div>
  );
  let sectionName;
  if (page === mcSecPage && mcSection)
    sectionName = t("testSession.multiplechoicesection")
  if (page === esSecPage && essaySection) sectionName = t("testSession.essaysection")
  if (page === spSecPage && speakingSection) sectionName = t("testSession.speakingsection")
  if (page === fillBlankSectionPage && fillBlankSection)
    sectionName = t("testSession.fillintheblankssection")
  return (
    <div
      style={width < 500 ? { marginTop: 30 } : null}
      className={classes.TestContainer}
    >
      {(testInSession || {}).assignment && (
        <IconButton onClick={() => {
          history.push(`/student-panel/course/${testInSession.course}/assignments`)
        }}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Spinner active={loading} transparent />
      <div className={classes.flexPositioningSpaceBetween}>
        <Button
          onClick={() => onSubmit(filePath, true)}
          size="small"
        // disabled={(testInSession || {}).timer && timeLeft / 1000 - 1 < 0}
        >
          {t("testSession.buttons.save")}
        </Button>
      </div>
      {(testInSession || {}).timer && (
        <Timer
          classes={classes}
          submitTest={() => onSubmit(filePath, null, null, true)}
        />
      )}
      {testSessionRoutes.map(route => (
        <Route
          key={route.path}
          exact={route.exact}
          path={route.path}
          render={(props) => {
            return (
              <div style={{ maxWidth: route.maxWidth || 500, margin: 'auto' }}>
                <route.component
                  {...props}
                />
              </div>
            );
          }}
        />
      ))}
      <Typography style={{ margin: 20 }} variant="h4" gutterBottom>
        {sectionName}
      </Typography>
      {page === 1 && areTestMaterials && (
        <Aux>
          <TestMaterials
            audioId={"testAudioMaterial"}
            pdfIndex={0}
            readingContent={readingMaterials.content}
            audioSource={audioMaterials.audio}
            videoSource={videoMaterials.video}
            onPreview={() => previewAudio("testAudioMaterial")}
            fileUpload={readingMaterials.fileUpload}
          />
        </Aux>
      )}
      {page === mcSecPage && mcSection && (
        <Aux>
          <MultipleChoiceSection
            testInSession={testInSession}
            test={isTest}
          />
        </Aux>
      )}
      {page === esSecPage && essaySection && (
        <Aux>

          <EssaySection
            test={isTest}
            path={filePath}
            testInSession={testInSession}
          />
        </Aux>
      )}
      {page === spSecPage && speakingSection && (
        <Aux>
          <SpeakingSection
            testInSession={testInSession}
            test={isTest}
            formValues={formValues}
          />
        </Aux>
      )}
      {page === fillBlankSectionPage && fillBlankSection && (
        <Aux>
          <FillInBlankSection
            formValues={formValues}
            testInSession={testInSession}
            test={isTest}
          />
        </Aux>
      )}
      {navButtons}
      {isWarned && !formErrors.allAnswersFilled && (
        <Typography paragraph color="error" variant="subtitle1" gutterBottom>
          {t("testSession.errors.questionsUnanswered")}
        </Typography>
      )}
      <SubmitButton
        clicked={(e) => {
          onSubmit(filePath);
        }}
        isError={isWarned && !formErrors.allAnswersFilled}
      >
        {isWarned && !formErrors.allAnswersFilled
          ? t("testSession.buttons.submitAnyway")
          : t("testSession.buttons.submit")}
      </SubmitButton>
      {/* </Route> */}
      {/* <Route exact
        component={Lessons}
        path="/student-panel/test-in-session/lessons" /> */}

    </div>
  );

}

const mapStateToProps = (state, ownProps) => {
  const assignmentTakingId = ownProps.match.params.assignmentId;
  const testResults = (state.studentTest.testResults || {}).testResults;
  const assignmentDataInProgress = (testResults || []).find((item) => item.test === assignmentTakingId);
  return {
    formValues: getFormValues("studentTest")(state),
    formErrors: getFormSyncErrors("studentTest")(state),
    token: state.authentication.token,
    userId: state.authentication.userId,
    testInSession: ownProps.isTest
      ? state.studentTest.testInSession
      : state.studentTest.assignmentInSession,
    studentTest: state.form.studentTest,
    initialValues: state.studentTest.loadedTestDataInProgress || {},
    loading: state.studentTest.loading,
    courses: state.common.courses,
    testResults: state.studentTest.testResults,
    notifications: state.common.notifications,
    width: state.common.width,
    course: (state.studentTest.testInSession || {}).course || (state.studentTest.assignmentInSession || {}).course,
    assignmentDataInProgress,
    testResults,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitTest: (
      formValues,
      token,
      userId,
      closeTest,
      test,
      filesToDelete,
      exitAssignment,
      filePath,
      history,
    ) => {
      dispatch(
        actions.submitTestStart(
          formValues,
          token,
          userId,
          closeTest,
          test,
          filesToDelete,
          exitAssignment,
          filePath,
          history,
        )
      );
    },
    fetchNotifications: (token) => {
      dispatch(actions.fetchNotificationsStart(token));
    },
    fetchCourses: (token, spinner) =>
      dispatch(actions.fetchCoursesStart(token, spinner)),
    fetchTestResults: (token, spinner) =>
      dispatch(actions.fetchTestResultsStart(token, spinner)),
    onStartAssignment: (assignmentId, token) => {
      dispatch(actions.fetchTestStart(assignmentId, true, token, null, false)); //second boolean = isStudent
    },
    onContinueAssignment: (assignmentId, token, assignmentDataInProgress) => {
      dispatch(
        actions.fetchTestStart(
          assignmentId,
          true, //isStudent
          token,
          assignmentDataInProgress,
          false
        )
      );
      dispatch(actions.setCoursePanel("assignment"));
    },
    changeSection: () => {
      dispatch(actions.setStudentTestSection());
    },
    exitAssignment: () => {
      dispatch(actions.exitAssignment());
    },
    setCourse: (course) => {
      dispatch(actions.setCourse(course));
    },
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
    returnToCourses: () => {
      dispatch(actions.returnToCourses());
    },
  };
};

const wrappedForm = reduxForm({
  form: "studentTest",
  enableReinitialize: true,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate: validate,
})(TestSession);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(wrappedForm));
