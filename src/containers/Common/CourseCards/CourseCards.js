import React from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import { useLocation, matchPath } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AdjustIcon from "@material-ui/icons/Adjust";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import darkThemeCourseImage from "../../../assets/images/course-icon.png";
import ProgressBarWithLabel from "../../../components/UI/ProgressBar/ProgressBar";
import { getProgress } from "./getCourseProgress";
import { useTranslation } from "react-i18next";
import Skeleton from '@material-ui/lab/Skeleton';
//syllabus
const SkeletonCards = ({ instructorLoggedIn }) => {
  return (
    <div>
      <Grid container justify={"space-around"} spacing={3}>
        {['1', '2', '3'].map(item => (
          <Grid style={{ maxWidth: 320 }} key={item} item xs={12} sm={6} md={4} lg={3} >
            <Card style={{ marginBottom: 20 }}>
              <CardHeader action={
                instructorLoggedIn ?
                  <FormControlLabel
                    disabled
                    control={<Switch options={{
                      label: "",
                      disabled: false,
                    }} />}
                  /> : <HighlightOffIcon
                    style={{ margin: "5px" }}
                    color="disabled"
                  />
              }
              />
              <Skeleton variant="rect" height="150px" />
              <CardContent style={{ height: 260 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  courseTitle: {
    textAlign: "center",
    cursor: "pointer",
  },
  button: {
    marginBottom: "10px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    cursor: "pointer",
  },
  gridContainer: {
    gridTemplateAreas: "Card Card",
  },
  gridItem: {
    gridArea: "Card",
  },
  smallFont: {
    fontSize: "0.8em",
  },
  redText: {
    color: "#F44336",
  },
}));

const Courses = ({
  studentLoggedIn,
  instructorLoggedIn,
  studentId,
  token,
  isDarkTheme,
  courses,
  openModal,
  changeStatus,
  onSelectCourse,
  testResults,
  configuration,
  loading,
  enroll,
  loadedUser,
  transactions,
  history
}) => {

  const { t } = useTranslation();
  // const history = useHistory();
  const currentLocation = useLocation().pathname
  const handleSelectedCourse = (id) => {
    onSelectCourse(id);
    if (instructorLoggedIn) {
      history.push(`/instructor-panel/course/${id}/modules`);
    }
    if (studentLoggedIn) {
      history.push(`/student-panel/course/${id}/modules`);
    }
  };
  const isMyCoursesPanel = !!matchPath(currentLocation, {
    path: "/student-panel/my-courses",
    exact: true,
  });
  const isApproveEnrollments = configuration.isApproveEnrollments;
  const isAccountActivated = (loadedUser || {}).isAccountActivated;
  const classes = useStyles();
  const completedCourseIds = (courses || [])
    .filter((item) => item.completed)
    .map((item) => item._id);
  if (!loadedUser) return null;
  if (!isAccountActivated && !loading && loadedUser) return <Typography color="secondary" align="center" >{t('layout.accountNotYetActivated')}</Typography>
  if (!courses)
    return <SkeletonCards instructorLoggedIn={instructorLoggedIn} isDarkTheme={isDarkTheme} />
  if (((courses || []).length === 0) && !loading && courses)
    return <Typography align="center">{t("courseCards.noCourses")}</Typography>;
  const display = (courses).filter(crs => (crs.enrolled && studentLoggedIn && isMyCoursesPanel) || (studentLoggedIn && !isMyCoursesPanel) || instructorLoggedIn).map(
    (item, index) => {
      const coursePrereqs = item.prerequisites;
      const foundIncompleteCourse = coursePrereqs.findIndex((item) => {
        if (!completedCourseIds.includes(item._id)) return item;
      });
      let buttons;
      if (studentLoggedIn) {
        const enrollmentStartDate = parseInt(item.enrollmentStartDate);
        const enrollmentEndDate = parseInt(item.enrollmentEndDate);
        const isEnrollmentPeriod =
          Date.now() > enrollmentStartDate && Date.now() < enrollmentEndDate;

        buttons = (
          <Aux>
            {((foundIncompleteCourse > -1 && !item.enrolled) ||
              item.enrolled || (!item.enrolled && !isApproveEnrollments) ||
              item.enrollmentRequested) && (
                <Button
                  color="primary"
                  onClick={() => openModal(item, "syllabus")}
                  fullWidth
                >
                  {t("courseCards.buttons.syllabus")}
                </Button>
              )}

            {!item.enrolled &&
              !item.accessDenied &&
              !item.enrollmentRequested &&
              !(foundIncompleteCourse > -1) &&
              ((item.studentCapacity > item.numberOfStudents &&
                item.studentCapacity) ||
                !item.studentCapacity) && (
                <Button
                  color="primary"
                  onClick={() => {
                    const isPayed = (transactions || []).findIndex(tr => tr.courseId === item._id) > -1
                    if (isApproveEnrollments || (item.cost && !isPayed)) {
                      openModal(item, "enrollRequest")
                    } else {
                      const isAutoEnroll = true;
                      enroll(studentId, item._id, token, history, isAutoEnroll)
                    }


                  }}
                  fullWidth
                  disabled={
                    item.grade ||
                    (parseInt(item.courseDropDeadline) > Date.now() && item.droppedOut && !(configuration || {}).isEnrollAllowedAfterDropCourse) ||
                    (item.droppedOut && item.courseDropDeadline && parseInt(item.courseDropDeadline) < Date.now()) ||
                    !item.courseActive ||
                    (!isEnrollmentPeriod &&
                      !!enrollmentStartDate &&
                      !!enrollmentEndDate) ||
                    foundIncompleteCourse > -1
                  }
                >
                  {t("courseCards.buttons.enroll")}
                </Button>
              )}
            {item.enrolled && (
              <Aux>
                <Button
                  color="secondary"
                  fullWidth
                  onClick={() => openModal(item, "dropConfirmation")}
                  disabled={
                    !item.courseActive
                    ||
                    item.grade
                  }
                >
                  {t("courseCards.buttons.drop")}
                </Button>
              </Aux>
            )}
            {item.enrollmentRequested && (
              <Typography
                style={{ textAlign: "center" }}
                paragraph
                color="error"
                variant="caption"
              >
                {t("courseCards.enrollmentRequested")}
              </Typography>
            )}
            {foundIncompleteCourse > -1 && !item.enrolled && (
              <Typography paragraph color="error" variant="caption">
                {t("courseCards.completePrereqs")}
              </Typography>
            )}
            {(item.passed && item.grade) && <Typography align="center" paragraph color="success" variant="caption">
              {t("courseCards.courseCompleted", { grade: item.grade })}
            </Typography>}
            {(!item.passed && item.grade) && <Typography align="center" paragraph color="error" variant="caption">
              {t("courseCards.courseFailed", { grade: item.grade })}
            </Typography>}
            {item.droppedOut && (
              <Typography align="center" paragraph color="error" variant="caption">
                {t("courseCards.droppedOut")}
              </Typography>
            )}
          </Aux>
        );
      }

      if (instructorLoggedIn) {
        buttons = (
          <Aux>
            <Button
              className={classes.button}
              color="primary"
              onClick={() => {
                history.push(`/instructor-panel/course/edit/${item._id}`)
                // editCourse(item._id, token);
              }}
              fullWidth
            >
              {t("courseCards.buttons.edit")}
            </Button>
            <Button
              className={classes.button}
              color="secondary"
              onClick={() => openModal(item, "deleteCourse")}
              fullWidth
            >
              {t("courseCards.buttons.delete")}
            </Button>
          </Aux>
        );
      }

      return (
        <Grid style={{ maxWidth: 320 }} item xs={12} sm={6} md={4} lg={3} key={item._id}>
          <Card>
            <CardHeader
              action={
                studentLoggedIn ? (
                  <Aux>
                    {item.courseActive ? (
                      <AdjustIcon style={{ margin: "5px" }} color="primary" />
                    ) : (
                      <HighlightOffIcon
                        style={{ margin: "5px" }}
                        color="error"
                      />
                    )}
                  </Aux>
                ) : (
                  <FormControlLabel
                    checked={item.courseActive}
                    onChange={() => {
                      changeStatus(item._id, token);
                    }}
                    control={<Switch color="primary" options={{
                      label: "",
                      disabled: false,
                    }} />}
                    label={
                      item.courseActive ? (
                        <Typography variant="body1">
                          {" "}
                          {t("courseCards.fields.courseActive")}
                        </Typography>
                      ) : (
                        <Typography variant="body1" className={classes.redText}>
                          {t("courseCards.fields.courseInactive")}
                        </Typography>
                      )
                    }
                  />
                )
              }
              subheader={
                studentLoggedIn && (
                  <Aux>
                    {item.courseActive ? (
                      <Typography variant="body1">
                        {" "}
                        {t("courseCards.fields.courseActive")}
                      </Typography>
                    ) : (
                      <Typography variant="body1" className={classes.redText}>
                        {t("courseCards.fields.courseInactive")}
                      </Typography>
                    )}
                  </Aux>
                )
              }
            />
            <CardMedia
              style={
                (!item.enrolled || !item.courseActive) && studentLoggedIn
                  ? { opacity: 0.2, cursor: "auto" }
                  : null
              }
              onClick={() => {
                if ((!item.enrolled || !item.courseActive) && studentLoggedIn)
                  return;
                handleSelectedCourse(item._id);
              }}
              className={classes.media}
              image={item.courseImage ? item.courseImage : darkThemeCourseImage}
              title="Course Image"
            />
            <CardContent>
              <h2
                style={
                  (!item.enrolled || !item.courseActive) && studentLoggedIn
                    ? { opacity: 0.2, cursor: "auto" }
                    : null
                }
                onClick={() => {
                  if ((!item.enrolled || !item.courseActive) && studentLoggedIn)
                    return;
                  handleSelectedCourse(item._id);
                }}
                className={classes.courseTitle}
              >
                {item.courseName}
              </h2>
              {item.enrolled && (
                <ProgressBarWithLabel progress={getProgress(item, (testResults || {}).testResults)} />
              )}
              {studentLoggedIn && (
                <Typography paragraph variant="caption">
                  {t("courseCards.instructor") + ":"}
                  {` ${item.courseInstructor.firstName} ${item.courseInstructor.lastName}`}
                </Typography>
              )}
              {item.courseActive && studentLoggedIn ? (
                <Aux>
                  <Typography paragraph variant="caption">
                    {t("courseCards.studentsEnrolled") + ":"}
                    {` ${item.numberOfStudents} ${item.studentCapacity
                      ? "/" + " " + item.studentCapacity
                      : ""
                      }`}
                  </Typography>
                  {item.enrollmentStartDate && (
                    <Typography paragraph variant="caption">
                      {t("courseCards.enrollmentStart") + ":"}
                      {` ${moment(parseInt(item.enrollmentStartDate))
                        .locale(localStorage.getItem("i18nextLng"))
                        .format("dddd, MMMM DD YYYY, HH:mm")} `}
                    </Typography>
                  )}
                  {item.enrollmentEndDate && (
                    <Typography paragraph variant="caption">
                      {t("courseCards.enrollmentDeadline") + ":"}
                      {` ${moment(parseInt(item.enrollmentEndDate))
                        .locale(localStorage.getItem("i18nextLng"))
                        .format("dddd, MMMM DD YYYY, HH:mm")} `}
                    </Typography>
                  )}
                </Aux>
              ) : (
                studentLoggedIn && (
                  <Typography paragraph color="error" variant="caption">
                    {t("courseCards.courseNotActivated")}
                  </Typography>
                )
              )}
              {item.accessDenied && (
                <Typography paragraph color="error" variant="caption">
                  {t("courseCards.deniedRequest")}
                </Typography>
              )}

              {instructorLoggedIn && (
                <Aux>
                  <Typography paragraph variant="caption">
                    {t("courseCards.studentsEnrolled") + ":"}
                    {` ${item.numberOfStudents} ${item.studentCapacity
                      ? "/" + " " + item.studentCapacity
                      : ""
                      }`}
                  </Typography>
                </Aux>
              )}
              {buttons}
            </CardContent>
          </Card>
        </Grid>
      );
    }
  );
  return (

    <div className={classes.root}>
      <Grid container justify={"space-around"} spacing={3}>
        {display}
      </Grid>
    </div>


  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    editCourse: (id, token) => dispatch(actions.fetchCourseStart(id, token)),
    changeStatus: (id, token) =>
      dispatch(actions.toggleCourseStateStart(id, token)),
    onSelectCourse: (course) => {
      dispatch(actions.setCourse(course));
    },
    openModal: (document, type) => dispatch(actions.openModal(document, type)),
    enroll: (student, course, token, history, isAutoEnroll) => {
      dispatch(actions.enrollCourseStart(student, course, token, history, isAutoEnroll));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.common.loading,
    courses: state.common.courses,
    tab: state.common.tab,
    loadedUser: state.authentication.loadedUser,
    studentLoggedIn: state.authentication.studentLoggedIn,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
    token: state.authentication.token,
    studentId: state.authentication.userId,
    testResults: state.studentTest.testResults,
    configuration: state.common.configuration,
    isDarkTheme: state.common.isDarkTheme,
    transactions: state.transactions.transactions,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
