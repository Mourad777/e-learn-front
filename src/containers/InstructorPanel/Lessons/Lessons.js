import React from "react";
import * as actions from "../../../store/actions/index";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import ListItemText from "@material-ui/core/ListItemText";
import moment from "moment";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { connect } from "react-redux";
import { ListItemIcon, Typography } from "@material-ui/core";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import { useHistory } from "react-router-dom";
import StyledBadge from "../../Common/Chat/StyledBadge";

//this component is used in the students lessons panel, in the instructors lesson panel as well as in the 
//students modules panel and instructors modules panel and is displayed slightly differently in different cases

const getCompletedSlidesPercentage = (lesson) => {
  const totalSlides = lesson.lessonSlides.length;
  const completedSlides = lesson.lessonSlides.filter(slide => slide.seen).length;
  const percentageCompleted = completedSlides / totalSlides * 100;
  return Number.isNaN(percentageCompleted) ? 0 : Math.round((percentageCompleted + Number.EPSILON) * 100) / 100;
}

const Lessons = ({
  course,
  courses,
  instructorLoggedIn,
  studentLoggedIn,
  folder,
  isModules,
  openModal,
  testInSession,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const populatedCourse = getCourse(courses, course);
  return (<Aux>
    {!isModules && <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.lessons")}</Typography>}
    {((populatedCourse || {}).lessons || []).map((lesson, index) => {
      const correctlyOrderedLessonIds = populatedCourse.lessons.map((l) => l._id);
      const folderIds =
        (folder || [])
          .filter((i) => i.documentType === "lesson")
          .map((item) => item.documentId) || [];
      if (!folderIds.includes(lesson._id) && isModules) return null;

      //for the purpose of showing the lessons header
      //in the correct location in student modules
      const sortedFolderIds = [];
      correctlyOrderedLessonIds.forEach((l) => {
        if (folderIds.includes(l)) sortedFolderIds.push(l);
      });

      return (
        <Aux key={lesson._id}>
          {(testInSession && index === 0) && <Typography style={{ margin: 20 }} variant="h4">Lessons</Typography>}
          {isModules && sortedFolderIds[0] === lesson._id && (
            <ListItem style={{ background: "#2196f3" }}>
              <Typography style={{ color: "white" }}>
                {t("lessons.lessons")}
              </Typography>
            </ListItem>
          )}
          <div>
            <ListItem
              onClick={() => {
                history.push(`/${instructorLoggedIn ? 'instructor' : 'student'}-panel/course/${course}/lesson/${lesson._id}/preview`)
              }}
              button
              disabled={studentLoggedIn && Date.now() < lesson.availableOnDate}
            >
              {(instructorLoggedIn && lesson.published) && (
                <div style={{ position: 'absolute', left: 0 }} >
                  {/* green dot so that the instructor clearly knows which lesson is visible to the students */}
                  <StyledBadge 
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                  />
                </div>
              )}
              {studentLoggedIn && (lesson.lessonSlides || []).length === 0 && (
                <FormControlLabel
                  control={<Checkbox disabled checked={false} value="checked" />}
                />
              )}
              {studentLoggedIn && (lesson.lessonSlides || []).length > 0 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        lesson.lessonSlides.findIndex((s) => !s.seen) === -1
                      }
                      value="checked"
                    />
                  }
                />
              )}
              {isModules && (
                <ListItemIcon style={{ margin: "auto", minWidth: "30px" }}>
                  <ChromeReaderModeIcon color="primary" />
                </ListItemIcon>
              )}
              <ListItemText
                primary={
                  isModules
                    ? studentLoggedIn ? `${lesson.lessonName} ${getCompletedSlidesPercentage(lesson)}%` : lesson.lessonName
                    : studentLoggedIn ? `${t("lessons.lesson")} ${index + 1} ${lesson.lessonName} ${getCompletedSlidesPercentage(lesson)}%` : `${t("lessons.lesson")} ${index + 1} ${lesson.lessonName}`
                }
                secondary={
                  Date.now() < lesson.availableOnDate
                    ? `${t("lessons.availableOn")} ${moment(
                      parseInt(lesson.availableOnDate)
                    )
                      .locale(localStorage.getItem("i18nextLng"))
                      .format("dddd, MMMM DD YYYY, HH:mm")}`
                    : null
                }
              />
              {instructorLoggedIn && (
                <Aux>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(`/instructor-panel/course/${course}/lesson/${lesson._id}/edit`)
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(lesson, "deleteLesson");
                    }}
                  >
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </Aux>
              )}
            </ListItem>
          </div>
        </Aux>
      )
    })}
  </Aux>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (document, modalType) =>
      dispatch(actions.openModal(document, modalType)),
  };
};

const mapStateToProps = (state) => {
  return {
    course: state.common.selectedCourse,
    courses: state.common.courses,
    studentLoggedIn: state.authentication.studentLoggedIn,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
    token: state.authentication.token,
    notifications: state.common.notifications,
    testInSession: state.studentTest.testInSession,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
