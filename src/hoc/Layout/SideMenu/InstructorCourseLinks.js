import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "react-i18next";
import LanguageChooser from "../../../components/UI/LanguageChooser/LanguageChooser";
import { matchPath, useLocation } from "react-router-dom";
import Aux from "../../Auxiliary/Auxiliary";
import { getCommonLinks, getInstructorCourseLinks, getLinks, getLogoutLink } from "../util/navLinks";


const InstructorCourseLinks = ({
  courses,
  classes,
  loadedUser,
  isSmallDrawer,
  handleDrawer,
}) => {
  const currentRoute = useLocation().pathname
  const { t } = useTranslation("common");
  const match = matchPath(currentRoute, {
    path: "/instructor-panel/course/:courseId",
    exact: false,
  });
  const isAccountActivated = (loadedUser || {}).isAccountActivated;
  let courseFromUrl, courseId;
  if (match) {
    courseId = match.params.courseId
    courseFromUrl = (courses || []).find(c => c._id === courseId);
  }
  // const handlePanelChange = (labels, panel, leaveCourse) => {
  //   if (mobileOpen) onHandleDrawerToggle();
  // };

  const isAdmin = (loadedUser || {}).admin
  return (
    <div>
      <div className={classes.toolbar} />
      {(!loadedUser||{}).admin && (<Divider />)}

      {(loadedUser||{}).admin && (
        <Aux>
          <ListItem className={classes.blueHeader}>
            <ListItemText
              primary={t("layout.drawer.admin")}
              className={classes.whiteColor}
              // style={{fontSize:'0.8em'}}
              primaryTypographyProps={{variant:isSmallDrawer ? 'caption' : 'subtitle1'}}
            />

          </ListItem>
        </Aux>)}

      <List>
        {getLinks(getCommonLinks(isAdmin ? "admin" : 'instructor', isAccountActivated), currentRoute, t, null, handleDrawer)}
        {getLinks(getLogoutLink(), currentRoute, t, null, handleDrawer)}
        {(courseFromUrl) && (<Aux>
          {isSmallDrawer && (<Divider />)}
          {!isSmallDrawer && (
            <ListItem className={classes.blueHeader}>
              {courseFromUrl.courseName && (
                <ListItemText
                  primary={courseFromUrl.courseName}
                  className={classes.whiteColor}
                />
              )}
            </ListItem>
          )}
          {getLinks(getInstructorCourseLinks(courseFromUrl._id), currentRoute, t, courseFromUrl._id, handleDrawer)}
        </Aux>)}
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
    token: state.authentication.token,
    userId: state.authentication.userId,
    loadedUser: state.authentication.loadedUser,
  };
};

export default connect(
  mapStateToProps,
)(InstructorCourseLinks);
