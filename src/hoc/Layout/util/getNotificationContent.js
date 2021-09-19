import moment from 'moment'

export const getNotificationContent = (n, courses, studentTestResults, t, allStudents, instructors) => {
  const course =
    (courses || []).find((c) => c._id === n.course) || {};
  let user;
  user = (allStudents||[]).find(st=>st._id === n.fromUser) || (instructors||[]).find(inst=>inst._id === n.fromUser)||""
  const student =
    (
      (course.studentsEnrollRequests || []).find(
        (r) =>
          r.student._id === n.toSpecificUser ||
          r.student._id === n.fromUser
      ) || {}
    ).student || {};
  const grade = course.grade;
  const passOrFailCourse = course.passed
    ? t("notifications.passed")
    : t("notifications.failed");
  const lesson =
    (course.lessons || []).find(
      (l) => l._id === n.documentId
    ) || {};
  const test =
    (course.tests || []).find(
      (t) => t._id === n.documentId
    ) || {};
  const result =
    ((studentTestResults || {}).testResults || []).find(
      (r) => r.test === n.documentId
    ) || {};
  const isTestPassed = test.passingGrade
    ? result.grade >= test.passingGrade
      ? t("notifications.passed")
      : t("notifications.failed")
    : "";
  let content = "";
  if (n.documentType === "chat") content = n.content[0];
  if (n.documentType === "courseOfficeHours") {
    content = t(`notifications.${n.content[0]}`, {
      courseName: course.courseName,
    });
  }
  if (n.documentType === "courseDropDeadline")
    content = t(`notifications.${n.content[0]}`, {
      courseName: course.courseName,
    });
  if (n.documentType === "courseEnrollRequest")
    content = t(`notifications.${n.content[0]}`, {
      firstName: student.firstName,
      lastName: student.lastName,
      courseName: course.courseName,
    });
    if (n.documentType === "newInstructorAccount")
    content = t(`notifications.${n.content[0]}`, {
      firstName: user.firstName,
      lastName: user.lastName,
    });
    if (n.documentType === "newStudentAccount")
    content = t(`notifications.${n.content[0]}`, {
      firstName: user.firstName,
      lastName: user.lastName,
    });
  if (n.documentType === "autoEnroll")
    content = t(`notifications.${n.content[0]}`, {
      firstName: student.firstName,
      lastName: student.lastName,
      courseName: course.courseName,
    });
  if (n.documentType === "courseEnrollApprove")
    content = t(`notifications.${n.content[0]}`, {
      courseName: course.courseName,
    });
  if (n.documentType === "courseEnrollDeny") {
    content = t(`notifications.${n.content[0]}`, {
      courseName: course.courseName,
    });

    content += n.message
      ? ` ${t("notifications.reason")}: ${n.message} `
      : "";
    if (n.content[1]) {
      content += t("notifications.allowResubmission") + " ";
    }
  }
  if (n.documentType === "courseDrop")
    content = t(`notifications.${n.content[0]}`, {
      firstName: student.firstName,
      lastName: student.lastName,
      courseName: course.courseName,
    });

  if (n.documentType === "courseGrade")
    content = t(`notifications.${n.content[0]}`, {
      passOrFail: passOrFailCourse,
      courseName: course.courseName,
      grade,
    });

  if (n.documentType === "lesson")
    content = t(`notifications.${n.content[0]}`, {
      lessonName: lesson.lessonName,
      date: moment(parseInt(lesson.availableOnDate))
        .locale(localStorage.getItem("i18nextLng"))
        .format("MMMM DD YYYY, HH:mm"),
    });

  if (
    n.documentType === "assignment" ||
    n.documentType === "test"
  ) {
    n.content.forEach((c, i) => {
      const isTest = n.documentType === "test";
      content +=
        t(`notifications.${c}`, {
          availableOnDate: moment(
            parseInt(test.availableOnDate)
          )
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMMM DD YYYY, HH:mm"),
          dueDate: moment(parseInt(test.dueDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMMM DD YYYY, HH:mm"),
          dueDateOrCloseDate: isTest
            ? "close date"
            : "due date",
          testOrAssignment: isTest
            ? t("notifications.test")
            : t("notifications.assignment"),
          grade: result.grade,
          passOrFail: isTestPassed,
          message: n.message,
          latePenalty: test.latePenalty,
          lateDaysAllowed: test.lateDaysAllowed,
          testName: test.testName,
        }) + " ";
    });
  }

  if (
    n.documentType === "assignmentSubmitted" ||
    n.documentType === "testSubmitted"
  ) {
    const isTest = n.documentType === "testSubmitted";
    content = t(`notifications.${n.content[0]}`, {
      firstName: student.firstName,
      testOrAssignment: isTest
        ? t("notifications.test")
        : t("notifications.assignment"),
      aOrAn: isTest ? "a" : "an",
    });
  }

  if (
    n.documentType === "assignmentReview" ||
    n.documentType === "testReview"
  ) {
    const isTest = n.documentType === "testReview";
    content = t(`notifications.${n.content[0]}`, {
      grade: result.grade,
      testOrAssignment: isTest
        ? t("notifications.test")
        : t("notifications.assignment"),
      passOrFail: isTestPassed,
      gradeReleaseDate: moment(
        parseInt(test.gradeReleaseDate)
      )
        .locale(localStorage.getItem("i18nextLng"))
        .format("MMMM DD YYYY, HH:mm"),
      testName: test.testName,
    });
  }
  if (
    n.documentType === "resetAssignment" ||
    n.documentType === "resetTest"
  ) {
    const isTest = n.documentType === "resetTest";
    content = t(`notifications.${n.content[0]}`, {
      testName: test.testName,
      testOrAssignment: isTest
        ? t("notifications.test")
        : t("notifications.assignment"),
      message: n.message,
    });
  }
  if (
    n.documentType === "assignmentExcused" ||
    n.documentType === "testExcused"
  ) {
    const isTest = n.documentType === "testExcused";
    content = t(`notifications.${n.content[0]}`, {
      testName: test.testName,
      testOrAssignment: isTest
        ? t("notifications.test")
        : t("notifications.assignment"),
      message: n.message,
    });
  }
  return content
}