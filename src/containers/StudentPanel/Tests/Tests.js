import React from "react";
import List from "@material-ui/core/List";
import IncompleteTests from "./IncompleteTests";
import CompletedTests from "./CompletedTests";

const Tests = ({
  studentCourseId,
  onContinueAssignment,
  onStartAssignment,
  isTest
}) => (
  <List>
    <IncompleteTests //incomplete tests
      onContinueAssignment={onContinueAssignment}
      onStartAssignment={onStartAssignment}
      isTest
    />
    <IncompleteTests //incomplete assignments
      onContinueAssignment={onContinueAssignment}
      onStartAssignment={onStartAssignment}
      isAssignment
    />

    <CompletedTests //completed tests
      isTest={isTest}
      studentCourseId={studentCourseId}
    />
  </List>
);
export default Tests;
