import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Aux from "../../Auxiliary/Auxiliary";
import { useTranslation } from "react-i18next";
import LanguageChooser from "../../../components/UI/LanguageChooser/LanguageChooser";
import { useLocation, matchPath } from "react-router-dom";
import { getCourse } from "../../../utility/getCourse";
import { getCommonLinks, getLinks, getLogoutLink, getStudentCourseLinks, getTestSessionLinks } from "../util/navLinks";


const StudentCourseLinks = ({
  testInSession,
  courses,
  classes,
  isSmallDrawer,
  loadedUser,
  handleDrawer
}) => {
  const currentRoute = useLocation().pathname;
  const { t } = useTranslation("common");
  // const handlePanelChange = (labels, panel, leaveCourse) => {
  //   if (mobileOpen) onHandleDrawerToggle();
  // };
  const match = matchPath(currentRoute, {
    path: "/student-panel/course/:courseId",
    exact: false,
  });
  let courseFromUrl, courseId;
  if (match) {
    courseId = match.params.courseId
    courseFromUrl = getCourse(courses, courseId)||{}
  }
  const isAccountActivated = (loadedUser || {}).isAccountActivated;
  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {!testInSession && (
          <Aux>
            {getLinks(getCommonLinks('student',isAccountActivated), currentRoute, t,null,handleDrawer)}
          </Aux>
        )}
        {getLinks(getLogoutLink(), currentRoute, t,null,handleDrawer)}
        {(!testInSession && courseFromUrl) && (
          <Aux>
            <Divider />
            {!isSmallDrawer && (
              <ListItem className={classes.blueHeader}>
                {courseFromUrl.courseName && (
                  <ListItemText
                    primary={`${courseFromUrl.courseName} `}
                    className={classes.whiteColor}
                  />
                )}
              </ListItem>
            )}
            {getLinks(getStudentCourseLinks(courseFromUrl._id), currentRoute, t, courseFromUrl._id,handleDrawer)}
          </Aux>
        )}

        {!(testInSession || {}).blockedNotes && testInSession && (
          <Aux>
            {getLinks(getTestSessionLinks((courseFromUrl||{})._id), currentRoute, t, (courseFromUrl||{})._id,handleDrawer)}
          </Aux>
        )}
      </List>
      <Divider />
      <LanguageChooser />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    courses: state.common.courses,
    coursePanel: state.common.coursePanel,
    testInSession: state.studentTest.testInSession,
    loadedUser: state.authentication.loadedUser,
  };
};

export default connect(mapStateToProps)(StudentCourseLinks);
