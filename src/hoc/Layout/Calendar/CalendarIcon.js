import React from "react"
import AssessmentIcon from "@material-ui/icons/Assessment";
import EditIcon from "@material-ui/icons/Edit";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import ChatIcon from "@material-ui/icons/Chat";

const CalendarIcon = ({d}) => {

    let icon;
    if (
      d.documentType === "testDueDate" &&
      (d.document.testType === "midterm" ||
        d.document.testType === "final")
    ) {
      icon = (
        <AssessmentIcon
          style={{ color: "#e53935" }}
        />
      );
    }
    if (
      d.documentType === "testDueDate" &&
      d.document.testType === "quiz"
    ) {
      icon = (
        <AssessmentIcon
          style={{ color: "#ef6c00" }}
        />
      );
    }
    if (
      d.documentType === "testDueDate" &&
      d.document.assignment
    ) {
      icon = (
        <EditIcon
          style={{ color: "#ef6c00" }}
        />
      );
    }

    if (
      d.documentType === "courseDropDeadline"
    ) {
      icon = (
        <DesktopAccessDisabledIcon
          style={{ color: "#e53935" }}
        />
      );
    }

    if (
      d.documentType ===
      "testGradeReleaseDateInstructor"
    ) {
      icon = (
        <SpellcheckIcon
          style={{ color: "#e53935" }}
        />
      );
    }

    if (
      d.documentType === "lessonAvailableOnDate"
    ) {
      icon = (
        <ChromeReaderModeIcon
          style={{ color: "#43a047" }}
        />
      );
    }

    if (
      d.documentType === "testAvailableOnDate"
    ) {
      icon = (
        <AssessmentIcon
          style={{ color: "#43a047" }}
        />
      );
    }

    if (
      d.documentType ===
      "testGradeReleaseDateStudent"
    ) {
      icon = (
        <SpellcheckIcon
          style={{ color: "#43a047" }}
        />
      );
    }
    if (
      d.documentType === "regularOfficeHour"
    ) {
      icon = (
        <ChatIcon
          style={{ color: "#0277bd" }}
        />
      );
    }
    if (
      d.documentType === "irregularOfficeHour"
    ) {
      icon = (
        <ChatIcon
          style={{ color: "#0277bd" }}
        />
      );
    }

    return icon
}

export default CalendarIcon