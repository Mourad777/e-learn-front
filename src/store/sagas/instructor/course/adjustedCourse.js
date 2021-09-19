export const adjustFormData = (formData) => {
  const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  const regularOfficeHourTimeRanges = (formData.regularOfficeHours || []).map(
    (item) => {
      return { day: item.day, timeRange: [item.startTime, item.endTime] };
    }
  );

  const irregularOfficeHours = (formData.irregularOfficeHours || []).map(
    (item) => {
      return {
        date: new Date(parseInt(item.date)),
        timeRange: [item.startTime, item.endTime],
      };
    }
  );

  const regularOfficeHourDays = formData.regularOfficeHours.map(
    (item) => item.day
  );

  const regularOfficeHourTimes = convertArrayToObject(
    regularOfficeHourTimeRanges,
    "day"
  );
  const regularOfficeHours = {
    days: regularOfficeHourDays,
    times: regularOfficeHourTimes,
  };
  const parsedPrerequisites = formData.prerequisites.map((item) => item._id);

  const parsedImportantDates = {
    enrollmentPeriod: [
      formData.enrollmentStartDate
        ? new Date(parseInt(formData.enrollmentStartDate))
        : null,
      formData.enrollmentEndDate
        ? new Date(parseInt(formData.enrollmentEndDate))
        : null,
    ],
    courseTimeline: [
      formData.courseStartDate
        ? new Date(parseInt(formData.courseStartDate))
        : null,
      formData.courseEndDate
        ? new Date(parseInt(formData.courseEndDate))
        : null,
    ],
    courseDropDeadline: formData.courseDropDeadline
      ? new Date(parseInt(formData.courseDropDeadline))
      : null,
    couponExpiration: formData.couponExpiration
      ? new Date(parseInt(formData.couponExpiration))
      : null,
  };

  const courseThumbnailKey = ((formData.courseImage || "").match(
    new RegExp(process.env.REACT_APP_AWS_URL + "(.*)" + "\\?X-Amz")
  ) || [])[1];

  const adjustedFormData = {
    _id: formData._id,
    courseName: formData.courseName,
    studentCapacity: formData.studentCapacity,
    studentsEnrolled: formData.studentsEnrolled,
    language: formData.language,
    syllabus: formData.syllabus,
    courseActive: formData.courseActive,
    courseImage: courseThumbnailKey,
    editing: true,
    createdAt: formData.createdAt
      ? new Date(parseInt(formData.createdAt))
      : null,
    cost:formData.cost,
    couponCode:formData.couponCode,
    couponExpiration:formData.couponExpiration,
    prerequisites: parsedPrerequisites,
    ...parsedImportantDates,
    regularOfficeHours: regularOfficeHours,
    irregularOfficeHours: irregularOfficeHours,
    loadedCourseImage: formData.courseImage,
  };
  return adjustedFormData
}