import moment from "moment";
//course cannot start before localst
import i18n from '../../../i18n/index'
export const validate = (values = {}) => {
  const errors = {
    pageOne: false,
    pageTwo: false,
    pageThree: false,
    pageFour: false,
    regularOfficeHours: {
      times: {
        Monday: {
          timeRange: null,
        },
        Tuesday: {
          timeRange: null,
        },
        Wednesday: {
          timeRange: null,
        },
        Thursday: {
          timeRange: null,
        },
        Friday: {
          timeRange: null,
        },
        Saturday: {
          timeRange: null,
        },
        Sunday: {
          timeRange: null,
        },
      },
    },
  };
  //page 1 course name
  (values.instructorCourses || []).forEach((c) => {
    if (
      c._id !== values._id &&
      (c.courseName || "").toLowerCase().trim() ===
        (values.courseName || "").toLowerCase().trim()
    ) {
      errors.courseName = i18n.t('courseForm.errors.noDuplicateNames');
      errors.pageOne = true;
    }
  });

  if (!values.courseName || !(values.courseName||"").trim()) {
    errors.courseName = i18n.t('courseForm.errors.enterCourseName');
    errors.pageOne = true;
  }

  if (values.studentCapacity <= 0 && values.studentCapacity !== "" && values.studentCapacity !== null) {
    errors.studentCapacity = i18n.t('courseForm.errors.studentCapacityGreaterThanZero');
    errors.pageOne = true;
  }
  const course = (values.instructorCourses||[]).find(c=>c._id === values._id)||{};
  const studentsEnrolled = (course.studentsEnrollRequests||[]).filter(r=>r.approved).length;

  if (values.studentCapacity) {
    if (!Number.isInteger(parseFloat(values.studentCapacity))) {
      errors.studentCapacity = i18n.t('courseForm.errors.studentCapacityInteger');
      errors.pageOne = true;
    }
    if(studentsEnrolled > values.studentCapacity && studentsEnrolled >= 1 ){
      errors.studentCapacity = i18n.t('courseForm.errors.studentCapacityGreaterThanOrEqualTo');
      errors.pageOne = true;
    }
  }
  // if (values.courseImage && !(values.courseImage.size < 5 * 1000 * 1000) && values.courseImage instanceof File) {
  //   errors.courseImage = "File must be under 5 MB";
  //   errors.pageOne = true;
  // }
  //page 2 important dates
  const enrollStart = new Date((values.enrollmentPeriod || [])[0]).getTime();
  const enrollEnd = new Date((values.enrollmentPeriod || [])[1]).getTime();
  const courseStart = new Date((values.courseTimeline || [])[0]).getTime();
  const courseEnd = new Date((values.courseTimeline || [])[1]).getTime();
  const courseDrop = new Date(values.courseDropDeadline).getTime();
  const courseCreated = new Date(values.createdAt).getTime();
  if (enrollStart && values.editing && !(courseCreated <= enrollStart)) {
    errors.enrollmentPeriod =  i18n.t('courseForm.errors.laterDate');;
    errors.pageTwo = true;
  }
  if (enrollStart && enrollEnd && !(enrollEnd > enrollStart)) {
    errors.enrollmentPeriod = i18n.t('courseForm.errors.startDateNotBeforeEndDate')
    errors.pageTwo = true;
  }

  if (courseStart && values.editing && !(courseCreated <= courseStart)) {
    errors.courseTimeline =  i18n.t('courseForm.errors.laterDate');;
    errors.pageTwo = true;
  }
  if (courseStart && courseEnd && !(courseEnd > courseStart)) {
    errors.courseTimeline = i18n.t('courseForm.errors.startDateNotBeforeEndDate')
    errors.pageTwo = true;
  }

  if (courseDrop && values.editing && !(courseCreated <= courseDrop)) {
    errors.courseDropDeadline =  i18n.t('courseForm.errors.laterDate');;
    errors.pageTwo = true;
  }

  if (enrollStart && courseStart && courseStart < enrollStart) {
    //course cannot start before enrollment start date
    errors.courseTimeline = i18n.t('courseForm.errors.courseStartDateNotBeforeEnrollmentStartDate')
    errors.pageTwo = true;
  }
  if (courseDrop && enrollStart && courseDrop < enrollStart) {
    //course drop date cannot be before enrollment start date
    errors.courseDropDeadline =
    i18n.t('courseForm.errors.courseDropDateNotBeforeEnrollmentStartDate')
    errors.pageTwo = true;
  }
  if (courseEnd && courseDrop && courseDrop > courseEnd) {
    //course drop date cannot be after course end date
    errors.courseDropDeadline =
    i18n.t('courseForm.errors.courseDropDateNotAfterCourseEndDate')
    errors.pageTwo = true;
  }

  if (
    courseEnd &&
    enrollStart &&
    enrollEnd &&
    (enrollStart > courseEnd || enrollEnd > courseEnd)
  ) {
    //enrollment start and end date cannot be after course end date
    errors.enrollmentPeriod =
    i18n.t('courseForm.errors.enrollmentStartAndEndDateNotAfterCourseEndDate');
    errors.pageTwo = true;
  };

  Array.from(course.tests || []).forEach((test) => {
    if (
      test.availableOnDate &&
      courseStart &&
      courseEnd &&
      (!(parseInt(test.availableOnDate) >= courseStart) ||
        !(parseInt(test.availableOnDate) <= courseEnd))
    ) {
      errors.courseTimeline = `${i18n.t('courseForm.errors.testsHasAvailableOnDate')} ${moment(
        parseInt(test.availableOnDate)
      ).locale(localStorage.getItem('i18nextLng')).format(
        "dddd, MMMM DD YYYY, HH:mm"
      )}${i18n.t('courseForm.errors.fallsOutsideCourseDuration')}.`;
      errors.pageTwo = true;
    }
    if (
      test.dueDate &&
      courseStart &&
      courseEnd &&
      (!(parseInt(test.dueDate) >= courseStart) ||
        !(parseInt(test.dueDate) <= courseEnd))
    ) {
      errors.courseTimeline = `${i18n.t('courseForm.errors.testsHasDueDate')} ${moment(
        parseInt(test.dueDate)
      ).locale(localStorage.getItem('i18nextLng')).format(
        "dddd, MMMM DD YYYY, HH:mm"
      )}${i18n.t('courseForm.errors.fallsOutsideCourseDuration')}.`;
      errors.pageTwo = true;
    }
    if (
      test.gradeReleaseDate &&
      courseStart &&
      !(parseInt(test.gradeReleaseDate) >= courseStart)
    ) {
      errors.courseTimeline = `${i18n.t('courseForm.errors.testsHasGradeReleaseDate')} ${moment(
        parseInt(test.gradeReleaseDate)
      ).locale(localStorage.getItem('i18nextLng')).format(
        "dddd, MMMM DD YYYY, HH:mm"
      )}${i18n.t('courseForm.errors.isBeforeStartDateOfCourse')}`;
      errors.pageTwo = true;
    }
  });
  Array.from(course.lessons || []).forEach((lesson) => {
    if (
      lesson.availableOnDate &&
      courseStart &&
      courseEnd &&
      (!(parseInt(lesson.availableOnDate) >= courseStart) ||
        !(parseInt(lesson.availableOnDate) <= courseEnd))
    ) {
      errors.courseTimeline = `${i18n.t('courseForm.errors.lessonsHasAvailableOnDate')} ${moment(
        parseInt(lesson.availableOnDate)
      ).locale(localStorage.getItem('i18nextLng')).format(
        "dddd, MMMM DD YYYY, HH:mm"
      )}${i18n.t('courseForm.errors.fallsOutsideCourseDuration')}.`;
      errors.pageTwo = true;
    }
  });
  //page 3 
  //irregular office hours
  errors.irregularOfficeHours = (values.irregularOfficeHours || []).map(
    (item) => {
      if (!item) {
        errors.pageThree = true;
        return {
          date:  i18n.t('courseForm.errors.enterDateOrRemove'),
        };
      }

      let dateError;
      const officeHourDate = new Date(item.date).getTime();
      if (officeHourDate < courseCreated) {
        dateError =  i18n.t('courseForm.errors.laterDate');;
      } 
      if (courseEnd && courseStart) {
        if (!(officeHourDate < courseEnd)) {
          dateError = i18n.t('courseForm.errors.enterDateBeforeCourseEndDate');
        }
        if (!(officeHourDate > courseStart)) {
          dateError = i18n.t('courseForm.errors.enterDateAfterCourseStartDate');
        }
      }
      if (!item.date) {
        dateError = i18n.t('courseForm.errors.enterDateOrRemove');
      }
      let timeError;
      const timeRange = item.timeRange || [];
      if (
        Date.parse(`01/01/2011 ${timeRange[0]}`) ===
        Date.parse(`01/01/2011 ${timeRange[1]}`)
      ) {
        timeError = i18n.t('courseForm.errors.startTimeEndTimeCannotBeSame');
      }
      if (
        Date.parse(`01/01/2011 ${timeRange[0]}`) >
        Date.parse(`01/01/2011 ${timeRange[1]}`)
      ) {
        timeError = i18n.t('courseForm.errors.startTimeCannotBeAfterEndTime');
      }
      if (!timeRange[0] || !timeRange[1]) {
        timeError = i18n.t('courseForm.errors.enterCompleteTimeInterval');
      }
      if (timeError || dateError) errors.pageThree = true;
      return {
        date: dateError,
        timeRange: timeError,
      };
    }
  );
  //regular office hours
  Array.from((values.regularOfficeHours || {}).days || []).forEach((day) => {
    let timeRangeError;
    const timeRange =
      (((values.regularOfficeHours || {}).times || {})[day] || {}).timeRange ||
      "";
    if (
      Date.parse(`01/01/2011 ${timeRange[0]}`) >
      Date.parse(`01/01/2011 ${timeRange[1]}`)
    ) {
      timeRangeError = i18n.t('courseForm.errors.startTimeCannotBeAfterEndTime');
    }
    if (
      Date.parse(`01/01/2011 ${timeRange[0]}`) ===
      Date.parse(`01/01/2011 ${timeRange[1]}`)
    ) {
      timeRangeError = i18n.t('courseForm.errors.startTimeEndTimeCannotBeSame');
    }
    if (!timeRange[0] || !timeRange[1]) {
      timeRangeError = i18n.t('courseForm.errors.enterCompleteTimeInterval');
    }
    if (
      !(((values.regularOfficeHours || {}).times || {})[day] || {}).timeRange
    ) {
      timeRangeError = `${i18n.t('courseForm.errors.enterTimeIntervalOrUncheck')} ${localStorage.getItem('i18nextLng') === "en" ? i18n.t(`courseForm.days.${day.toLowerCase()}`) : i18n.t(`courseForm.days.${day.toLowerCase()}`).toLowerCase()}`;
    }
    if (timeRangeError) errors.pageThree = true;
    errors.regularOfficeHours.times[day].timeRange = timeRangeError;
  });

  return errors;
};