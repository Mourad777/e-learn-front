import React from 'react'
import AssessmentIcon from "@material-ui/icons/Assessment";
import EditIcon from "@material-ui/icons/Edit";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import ChatIcon from "@material-ui/icons/Chat";

const CalendarTileIcon = ({date,documentDates}) => {

    const timeStamp = new Date(date).getTime();
    let isTest,
      isAssignment,
      isGradeReleaseDate,
      isLesson,
      isCourseDropDeadline,
      isOfficeHour;
    if (
      documentDates.findIndex((x) => {
        return (
          x.date === timeStamp &&
          (x.documentType === "testDueDate" ||
            x.documentType === "testAvailableOnDate") &&
          !x.document.assignment
        );
      }) > -1
    )
      isTest = true;

    if (
      documentDates.findIndex((x) => {
        return (
          x.date === timeStamp &&
          (x.documentType === "testDueDate" ||
            x.documentType === "testAvailableOnDate") &&
          x.document.assignment
        );
      }) > -1
    )
      isAssignment = true;

    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          (x.documentType === "regularOfficeHour" ||
            x.documentType === "irregularOfficeHour")
      ) > -1
    )
      isOfficeHour = true;

    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          x.documentType === "lessonAvailableOnDate"
      ) > -1
    )
      isLesson = true;
    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          x.documentType === "courseDropDeadline"
      ) > -1
    )
      isCourseDropDeadline = true;
    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          (x.documentType ===
            "testGradeReleaseDateInstructor" ||
            x.documentType ===
            "testGradeReleaseDateStudent")
      ) > -1
    )
      isGradeReleaseDate = true;
    return (
      <div style={{ display: "block" }}>
        {isTest && (
          <AssessmentIcon
            style={{ fontSize: "0.7rem" }}
          />
        )}
        {isAssignment && (
          <EditIcon style={{ fontSize: "0.7rem" }} />
        )}
        {isGradeReleaseDate && (
          <SpellcheckIcon
            style={{ fontSize: "0.7rem" }}
          />
        )}
        {isLesson && (
          <ChromeReaderModeIcon
            style={{ fontSize: "0.7rem" }}
          />
        )}
        {isOfficeHour && (
          <ChatIcon style={{ fontSize: "0.7rem" }} />
        )}
        {isCourseDropDeadline && (
          <DesktopAccessDisabledIcon
            style={{ fontSize: "0.7rem" }}
          />
        )}
      </div>
    );
}

export default CalendarTileIcon