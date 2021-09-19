export const fetchCourseQuery = (courseId) => {
  const graphqlQuery = {
    query: `query FetchSingleCourse($courseId: ID!) {
          course(id: $courseId) {
            _id
            courseName
            createdAt
            courseActive
            studentCapacity
            language
            courseImage
            enrollmentStartDate
            enrollmentEndDate
            courseStartDate
            courseEndDate
            courseDropDeadline
            prerequisites {
              _id
              courseName
            }
            regularOfficeHours {
              day
              startTime
              endTime
              timezoneRegion
            }
            irregularOfficeHours {
             date
             startTime
             endTime
             timezoneRegion
            }
            syllabus
            cost
            couponCode
            couponExpiration
          }
        }
      `,
    variables: {
      courseId: courseId,
    },
  };
  return graphqlQuery;
};

export const createUpdateCourseQuery = ({
  formData,
  courseId,
  regularOfficeHours,
  irregularOfficeHours,
  editing,
  file,
  key,
}) => {
  const graphqlQuery = {
    query: `
            mutation ${editing ? "UpdateCourse, " : "CreateNewCourse"}(
              $courseId: ID!,
              $courseName: String!,
              $createdAt: String,
              $courseActive: Boolean!,
              $studentCapacity: Int, 
              $language: String, 
              $enrollmentStartDate: String, 
              $enrollmentEndDate: String, 
              $courseStartDate: String,
              $courseEndDate: String, 
              $courseDropDeadline: String, 
              $syllabus: String, 
              $courseImage: String, 
              $prerequisites:[ID],
              $cost:Float,
              $couponCode:String
              $couponExpiration:String
               ) {
                ${editing ? "updateCourse, " : "createCourse"}(
                courseInput: {
                  courseId: $courseId,
                  courseName: $courseName,
                  courseActive: $courseActive,
                  createdAt: $createdAt,
                  studentCapacity: $studentCapacity,
                  language: $language,
                  courseStartDate: $courseStartDate,
                  courseEndDate: $courseEndDate,
                  enrollmentStartDate: $enrollmentStartDate,
                  enrollmentEndDate: $enrollmentEndDate,
                  courseDropDeadline: $courseDropDeadline,
                  syllabus: $syllabus,
                  courseImage: $courseImage, 
                  prerequisites: $prerequisites,
                  regularOfficeHours: [${regularOfficeHours}],
                  irregularOfficeHours: [${irregularOfficeHours}],
                  cost: $cost,
                  couponCode: $couponCode,
                  couponExpiration: $couponExpiration,
                }) {
                _id
                courseName
              }
            }
          `,
    variables: {
      courseId: courseId,
      courseName: formData.courseName,
      createdAt: formData.createdAt,
      courseActive: formData.courseActive,
      studentCapacity: parseInt(formData.studentCapacity),
      language: formData.language,
      enrollmentStartDate: (formData.enrollmentPeriod || [])[0],
      enrollmentEndDate: (formData.enrollmentPeriod || [])[1],
      courseStartDate: (formData.courseTimeline || [])[0],
      courseEndDate: (formData.courseTimeline || [])[1],
      courseDropDeadline: formData.courseDropDeadline,
      syllabus: formData.syllabus,
      prerequisites: formData.prerequisites,
      courseImage: file instanceof File ? key : file,
      cost: parseFloat(formData.cost),
      couponCode: formData.couponCode,
      couponExpiration: formData.couponExpiration,
    },
  };
  return graphqlQuery;
};

export const updateCourseResourcesQuery = (courseId, formattedResources) => {
  const graphqlQuery = {
    query: `
        mutation UpdateCourseResources(
          $courseId: ID!, 
          ) {       
          updateCourseResources(
            courseId:$courseId,
            resources: [${formattedResources}]
            ) {
              _id
            }
        }
      `,
    variables: {
      courseId,
    },
  };
  return graphqlQuery;
};

export const toggleCourseStateQuery = (courseId) => {
  const graphqlQuery = {
    query: `
        mutation ChangeCourseState(
          $courseId: ID!, 
          ) {       
          changeCourseState(
            courseId:$courseId,
            ) {
              _id
            }
        }
      `,
    variables: {
      courseId,
    },
  };
  return graphqlQuery;
};

export const gradeCourseQuery = (
  courseId,
  studentId,
  formValues,
  suggestedGrade,
  passed,
) => {
  const grade = formValues.gradeOverride ? parseFloat(parseFloat(formValues.gradeAdjusted).toFixed(2)) : suggestedGrade;
  const graphqlQuery = {
    query: `
        mutation GradeCourse(
          $courseId: ID!,
          $studentId: ID!,
          $grade: Float!, 
          $gradeAdjustmentExplanation: String, 
          $gradeOverride: Boolean!,
          $passed:Boolean!,
          ) {       
          gradeCourse(gradeCourseInput:{
            courseId:$courseId,
            studentId:$studentId,
            grade:$grade,
            gradeAdjustmentExplanation:$gradeAdjustmentExplanation,
            gradeOverride:$gradeOverride,
            passed:$passed,
          }
        )
       }
      `,
    variables: {
      courseId,
      studentId,
      grade,
      gradeOverride:formValues.gradeOverride,
      gradeAdjustmentExplanation:formValues.gradeOverride ? formValues.gradeAdjustmentExplanation : null,
      passed,
    },
  };
  return graphqlQuery;
};

export const deleteCourseQuery = (courseId) => {
  const graphqlQuery = {
    query: `
        mutation {
          deleteCourse(id: "${courseId}")
        }
      `,
  };
  return graphqlQuery;
};
