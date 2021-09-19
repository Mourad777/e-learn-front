export const handleDocument = (
    notification,
    documentHandler,
    markAsSeen,
    courses,
    studentLoggedIn,
    instructorLoggedIn,
    handleClose,
    fetchStudents,
    openModal,
    fetchModules,
    fetchQuestionBank,
    token,
    setCourse,
    history,
) => {
    //users
    const isCalendarHandler = documentHandler === "calendar";
    if (!isCalendarHandler) {
        markAsSeen(notification._id, token);
    }
    const courseId = notification.course;
    const selectedCourse = (courses || []).find(
        (course) => course._id === notification.course
    ) || {};
    const foundAssignment = ((selectedCourse.tests || []).find(t => t._id === notification.documentId) || {}).assignment;
    //finds assignment if click is from bell icon
    const isAssignment = (notification.document || {}).assignment || foundAssignment
    //finds assignment if click is from calendar
    handleClose();
    if (notification.documentType === "newInstructorAccount") {
        history.push(`/users/instructors/${notification.fromUser}`);
        return
    }
    if (notification.documentType === "newStudentAccount") {
        history.push(`/users/students/${notification.fromUser}`);
        return
    }
    if (
        notification.documentType === "chat"
    ) {
        history.push(`/${instructorLoggedIn ? 'instructor' : 'student'}-panel/course/${courseId}/chat/user/${notification.fromUser}`);
    }
    if (
        notification.documentType === "irregularOfficeHour" ||
        notification.documentType === "regularOfficeHour"
    ) {
        history.push(`/${instructorLoggedIn ? 'instructor' : 'student'}-panel/course/${courseId}/chat/contacts`);
    }
    if (
        notification.documentType === "testReview" ||
        (notification.documentType === "testGradeReleaseDateStudent" &&
            !isAssignment)
    ) {
        history.push(`/student-panel/course/${courseId}/completed-tests/${notification.documentId}`);
    }
    if (
        notification.documentType === "assignmentReview" ||
        (notification.documentType === "testGradeReleaseDateStudent" &&
            isAssignment)
    ) {
        history.push(`/student-panel/course/${courseId}/completed-assignments/${notification.documentId}`);
    }
    if (notification.documentType === "testGradeReleaseDateInstructor") {
        const isAssignment = (notification.document||{}).assignment
        history.push(`/instructor-panel/course/${courseId}/grade-${isAssignment?'assignment':'test'}s`);
    }
    if (
        notification.documentType === "testSubmitted" ||
        notification.documentType === "assignmentSubmitted"
    ) {
        const test = selectedCourse.tests.find(
            (test) => test._id === notification.documentId
        );
        history.push(`/instructor-panel/course/${courseId}/${notification.documentType === 'testSubmitted' ? 'grade-tests' : 'grade-assignments'}/student/${notification.fromUser}/${notification.documentType === 'testSubmitted' ? 'test' : 'assignment'}/${test._id}`);

    }
    if (
        (notification.documentType === "test" ||
            notification.documentType === "testAvailableOnDate" ||
            notification.documentType === "testDueDate" ||
            notification.documentType === "resetTest" ||
            notification.documentType === "testExcused"
        ) &&
        !isAssignment
    ) {
        history.push(`/student-panel/course/${courseId}/tests/confirm/${notification.documentId || (notification.document || {})._id}`);

    }
    if (
        (notification.documentType === "assignment" ||
            notification.documentType === "testAvailableOnDate" ||
            notification.documentType === "testDueDate" ||
            notification.documentType === "resetAssignment" ||
            notification.documentType === "assignmentExcused") &&
        isAssignment
    ) {
        history.push(`/student-panel/course/${courseId}/tests/confirm/${notification.documentId || (notification.document || {})._id}`);
    }
    if (
        notification.documentType === "lesson" ||
        notification.documentType === "lessonAvailableOnDate"
    ) {
        const selectedLessonId = notification.documentId || (notification.document || {})._id;
        const lesson =
            selectedCourse.lessons.find(
                (lesson) =>
                    lesson._id === selectedLessonId
            ) || {};
        history.push(`/student-panel/course/${courseId}/lesson/${lesson._id}/preview`);
        const lessonIsAvailable =
            Date.now() > new Date(parseInt(lesson.availableOnDate)).getTime();
        if (
            (lesson.availableOnDate && lessonIsAvailable) ||
            !lesson.availableOnDate
        ) {
            history.push(`/student-panel/course/${courseId}/lesson/${lesson._id}/preview`);
            // openModal(lesson, "lesson");
        } else {
            history.push(`/student-panel/course/${courseId}/lessons`);
        }

    }
    if (notification.documentType === "courseEnrollRequest") {
        history.push(`/instructor-panel/course/${courseId}/students/requested/${notification.fromUser}`);
    }
    if (notification.documentType === "autoEnroll") {
        history.push(`/instructor-panel/course/${courseId}/students/enrolled/${notification.fromUser}`);
    }
    if (notification.documentType === "courseEnrollApprove") {
        history.push(`/student-panel/course/${courseId}/modules`);
    }
    let course;
    if (isCalendarHandler) {
        course = notification.course;
    } else {
        course = courseId
    }
    if (notification.documentType === "courseOfficeHours") {
        history.push(`/student-panel/courses/syllabus/${courseId}`);
        return;
    }
    if (notification.documentType === "courseDropDeadline") {
        history.push(`/student-panel/courses/syllabus/${courseId}`);
        return;
    }
    if (notification.documentType === "courseDrop") {
        history.push(`/instructor-panel/course/${courseId}/students/enrolled/${notification.fromUser}`);
        return
    }
    if (notification.documentType === "courseEnrollDeny") {
        return;
    }
}