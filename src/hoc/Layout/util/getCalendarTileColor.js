export const getCalendarTileColor = (date, documentDates) => {
    const timeStamp = new Date(date).setHours(0, 0, 0, 0);
    if (
      documentDates.findIndex((x) => {
        return (
          x.date === timeStamp &&
          x.documentType === "testDueDate" &&
          ((x.document || {}).testType === "midterm" ||
            (x.document || {}).testType === "final")
        );
      }) > -1
    ) {
      return "highlight-red";
    }
    if (
      documentDates.findIndex((x) => {
        return (
          x.date === timeStamp &&
          x.documentType === "courseDropDeadline"
        );
      }) > -1
    ) {
      return "highlight-red";
    }
    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          x.documentType ===
          "testGradeReleaseDateInstructor"
      ) > -1
    ) {
      return "highlight-red";
    }
    if (
      documentDates.findIndex((x) => {
        return (
          x.date === timeStamp &&
          x.documentType === "testDueDate"
        );
      }) > -1
    ) {
      return "highlight-orange";
    }
    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          (x.documentType === "lessonAvailableOnDate" ||
            x.documentType === "testAvailableOnDate" ||
            x.documentType ===
            "testGradeReleaseDateStudent")
      ) > -1
    ) {
      return "highlight-green";
    }
    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          x.documentType === "regularOfficeHour"
      ) > -1
    ) {
      return "highlight-blue";
    }
    if (
      documentDates.findIndex(
        (x) =>
          x.date === timeStamp &&
          x.documentType === "irregularOfficeHour"
      ) > -1
    ) {
      return "highlight-blue";
    }
}