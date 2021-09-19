import moment from "moment";
import momentTZ from "moment-timezone";
import { getDayIndex } from "../../../utility/getDayIndex";
export const getDocumentDates = (courses, studentLoggedIn, instructorLoggedIn,t) => {
    const documentDates = [];

    (courses || []).forEach((c) => {
        if (
            (studentLoggedIn && c.courseActive && c.enrolled) ||
            instructorLoggedIn
        ) {
            //remove docs that are in a course that the student is not enrolled in

            (c.irregularOfficeHours || []).forEach((oh) => {
                documentDates.push({
                    course: c._id,
                    document: oh,
                    documentType: "irregularOfficeHour",
                    date: new Date(parseInt(oh.date)).setHours(0, 0, 0, 0),
                    docName:
                        t("calendar.officehours", {
                            start: oh.startTime,
                            end: oh.endTime,
                        }) +
                        " " +
                        momentTZ(new Date(Date.now())).tz(oh.timezoneRegion).format("z"),
                });
            });

            (c.regularOfficeHours || []).forEach((oh) => {
                const threeMonths = 7862400000;
                const start = moment(
                    parseInt(c.courseStartDate || Date.now() - threeMonths)
                ),
                    end = moment(parseInt(c.courseEndDate) || Date.now() + threeMonths),
                    day = getDayIndex(oh.day);

                const result = [];
                const current = start.clone();

                while (current.day(7 + day).isBefore(end)) {
                    result.push(current.clone());
                    documentDates.push({
                        course: c._id,
                        document: oh,
                        documentType: "regularOfficeHour",
                        date: new Date(current.clone()._d).setHours(0, 0, 0, 0),
                        docName:
                            t("calendar.officehours", {
                                start: oh.startTime,
                                end: oh.endTime,
                            }) +
                            " " +
                            momentTZ(new Date(Date.now())).tz(oh.timezoneRegion).format("z"),
                    });
                }
            });

            if (studentLoggedIn) {
                if (c.courseDropDeadline) {
                    documentDates.push({
                        course: c._id,
                        document: c,
                        documentType: "courseDropDeadline",
                        date: new Date(parseInt(c.courseDropDeadline)).setHours(0, 0, 0, 0),
                        docName: t("calendar.dropDeadline", {
                            courseName: c.courseName,
                        }),
                    });
                }

                c.tests.forEach((test) => {
                    let testType = "assignment";
                    if (test.testType === "midterm") testType = "mid-term";
                    if (test.availableOnDate) {
                        const type =
                            test.testType !== "midterm" && test.testType
                                ? test.testType
                                : testType;
                        documentDates.push({
                            course: c._id,
                            document: test,
                            documentType: "testAvailableOnDate",
                            date: new Date(parseInt(test.availableOnDate)).setHours(
                                0,
                                0,
                                0,
                                0
                            ),
                            docName: t("calendar.testAvailableOnDate", {
                                testName: test.testName,
                                testType: t(`calendar.${type}`),
                                ofTheTestType: t(`calendar.ofThe${type}`),
                            }),
                        });
                    }
                    if (test.dueDate) {
                        let testType = "assignment";
                        const type =
                            test.testType !== "midterm" && test.testType
                                ? test.testType
                                : testType;
                        documentDates.push({
                            course: c._id,
                            document: test,
                            documentType: "testDueDate",
                            date: new Date(parseInt(test.dueDate)).setHours(0, 0, 0, 0),
                            docName: t("calendar.testDueDate", {
                                testType: t(`calendar.${type}`),
                                ofTheTestType: t(`calendar.ofThe${type}`),
                                testName: test.testName,
                            }),
                        });
                    }
                    if (test.gradeReleaseDate) {
                        let testType = "assignment";
                        const type =
                            test.testType !== "midterm" && t.test ? t.test : testType;
                        documentDates.push({
                            course: c._id,
                            document: test,
                            documentType: "testGradeReleaseDateStudent",
                            date: new Date(parseInt(test.gradeReleaseDate)).setHours(
                                0,
                                0,
                                0,
                                0
                            ),
                            docName: t("calendar.testGradeReleaseDateStudent", {
                                testName: test.testName,
                                testType: t(`calendar.${type}`),
                                ofTheTestType: t(`calendar.ofThe${type}`),
                            }),
                        });
                    }
                });
                (c.lessons || []).forEach((l) => {
                    documentDates.push({
                        course: c._id,
                        document: l,
                        documentType: "lessonAvailableOnDate",
                        date: new Date(parseInt(l.availableOnDate)).setHours(0, 0, 0, 0),
                        docName: t("calendar.lessonAvailableOnDate", {
                            lessonName: l.lessonName,
                        }),
                    });
                });
            }

            if (instructorLoggedIn) {
                c.tests.forEach((test) => {
                    let testType = "assignment";
                    const type =
                        test.testType !== "midterm" && test.testType
                            ? test.testType
                            : testType;
                    if (test.gradeReleaseDate) {
                        documentDates.push({
                            course: c._id,
                            document: test,
                            documentType: "testGradeReleaseDateInstructor",
                            date: parseInt(test.gradeReleaseDate),
                            docName: t("calendar.testGradeReleaseDateInstructor", {
                                testType: t(`calendar.${type}`),
                                ofTheTestType: t(`calendar.ofThe${type}`),
                                testName: test.testName,
                            }),
                        });
                    }
                });
            }
        }
    });
    return documentDates
}