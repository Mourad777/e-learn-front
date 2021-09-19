import React from "react";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import IncompleteTests from "../Tests/IncompleteTests";
import CompletedTests from "../Tests/CompletedTests";
import Lessons from "../../InstructorPanel/Lessons/Lessons";
import ListItem from "@material-ui/core/ListItem";
import {connect} from "react-redux"
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";

const RenderDocuments = ({ folder=[],course, courses }) => {
  const populatedCourse = getCourse(courses,course);
  const testIds = (populatedCourse.tests||[]).filter(t=>!t.assignment).map(t=>t._id);
  const assignmentIds = (populatedCourse.tests||[]).filter(t=>t.assignment).map(t=>t._id);
  const includesAssignment = folder.find(d=>assignmentIds.includes(d.documentId));
  const includesTest = folder.find(d=>testIds.includes(d.documentId));
  const {t}= useTranslation();
  return (
    <Aux>
      <Lessons isModules folder={folder} />
      {includesAssignment && (
        <ListItem style={{background:'#2196f3'}}>
         <Typography style={{color:'white'}}>{t("studentModules.assignments")}</Typography>
        </ListItem>
      )}
      <div>
        <IncompleteTests folder={folder} isAssignment isModules />
        <CompletedTests
          folder={folder} //completed assignments
          isModules
          isAssignment
        />
      </div>
      {includesTest && (
        <ListItem style={{background:'#2196f3'}}>
          <Typography style={{color:'white'}}>{t("studentModules.tests")}</Typography>
        </ListItem>
      )}
      <div>
        <IncompleteTests folder={folder} isTest isModules />
        <CompletedTests
          folder={folder} //completed tests
          isModules
          isTest
        />
      </div>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    course: state.common.selectedCourse,
    courses: state.common.courses,
  };
};

export default connect(mapStateToProps)(RenderDocuments);
