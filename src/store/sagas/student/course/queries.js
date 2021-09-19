export const studentTestResultsQuery = (studentId) => {
  const graphqlQuery = {
    query: `
               query FetchTestResults($studentId:ID!)  {
                testResults(studentId:$studentId) {
                  testResults {
                    _id
                    test
                    course
                    closed
                    latePenalty
                    graded
                    gradingInProgress
                    grade
                    gradeOverride
                    gradeAdjustmentExplanation
                    multiplechoiceSection {
                      grade
                      answers {
                        questionNumber
                        answers
                        additionalNotes
                        marks
                      }
                    }
                    essaySection {
                      grade
                      answers {
                        questionNumber
                        answer
                        additionalNotes
                        marks
                        instructorCorrection
                        allowCorrection
                      }
                    }
                    speakingSection {
                      grade
                      answers {
                        questionNumber
                        answer
                        additionalNotes
                        marks
                        feedbackAudio
                      }
                    }
                    fillInBlanksSection {
                      grade
                      answers {
                        questionNumber
                        answer
                        additionalNotes
                        marks
                      }
                    }
                  }
                  testInSession {
                    test
                    startTime
                    endTime
                  }
                  assignmentsInSession {
                      assignment
                      startTime
                    }
                 }
               }
             `,
    variables: {
      studentId: studentId,
    },
  };
  return graphqlQuery;
};

export const studentEnrollRequestQuery = (student, course) => {
  const graphqlQuery = {
    query: `mutation EnrollRequest($studentId: ID!, $courseId: ID!)  {
                 enrollRequest(studentId: $studentId, courseId: $courseId) 
               }
             `,
    variables: {
      studentId: student,
      courseId: course,
    },
  };
  return graphqlQuery
}

export const studentEnrollApproveQuery = (student, course) => {
  const graphqlQuery = {
    query: `mutation EnrollApprove($studentId: ID!, $courseId: ID!)  {
                 enrollApprove(studentId: $studentId, courseId: $courseId) 
               }
             `,
    variables: {
      studentId: student,
      courseId: course,
    },
  };
  return graphqlQuery
}

export const studentEnrollDenyQuery = (student, course, reason, allowResubmission) => {
  const graphqlQuery = {
    query: `mutation EnrollDeny($studentId: ID!, $courseId: ID!, $reason: String, $allowResubmission: Boolean!)  {
                 enrollDeny(studentId: $studentId, courseId: $courseId, reason: $reason, allowResubmission: $allowResubmission) 
               }
             `,
    variables: {
      studentId: student,
      courseId: course,
      reason:reason||"",
      allowResubmission:allowResubmission||false,
    },
  };
  return graphqlQuery
}

export const studentDropCourseQuery = (student, course) => {
  const graphqlQuery = {
    query: `
               mutation DropCourse ($studentId: ID!, $courseId: ID!)  {
                 dropCourse(studentId: $studentId, courseId: $courseId) {
                  coursesEnrolled
                  _id
                  firstName
                  lastName
                 }
               }
             `,
    variables: {
      studentId: student,
      courseId: course,
    },
  };
  return graphqlQuery
}