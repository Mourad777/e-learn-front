import React from 'react'
import {connect} from 'react-redux'
import InstructorCourseLinks from "./InstructorCourseLinks";
import StudentCourseLinks from "./StudentCourseLinks";

const SideMenu = ({classes,mobileOpen,handleDrawerToggle ,isSmallDrawer,handleDrawer}) => {
    const userType = localStorage.getItem('userType')
    if (userType === 'student'){
      return (
        <StudentCourseLinks
          classes={classes}
          onHandleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
          isSmallDrawer={isSmallDrawer}
          handleDrawer={handleDrawer}
        />
      );
    }
  
    if (userType === 'instructor' || userType === 'admin'){
      return (
        <InstructorCourseLinks
          mobileOpen={mobileOpen}
          onHandleDrawerToggle={handleDrawerToggle}
          classes={classes}
          isSmallDrawer={isSmallDrawer}
          handleDrawer={handleDrawer}
        />
      );
    }
    return <div></div>
}

const mapStateToProps = (state) => {
    return {
      studentLoggedIn: state.authentication.studentLoggedIn,
      instructorLoggedIn: state.authentication.instructorLoggedIn,
      course: state.common.selectedCourse,
      testInSession: state.studentTest.testInSession,
    };
  };

export default connect(mapStateToProps)(SideMenu)