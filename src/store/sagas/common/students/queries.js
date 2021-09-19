export const studentsQuery = (courseId) => {
  const graphqlQuery = {
    query: `
           query FetchStudents($courseId: ID!)  {
             students(courseId: $courseId) {
               _id
               firstName
               lastName
               email
               profilePicture
               dob
               completedCourses
               lastLogin
               documents {
                 document
                 documentType
               }
               testInSession {
                test
                startTime
                endTime
               }
               testResults {
                _id
                closed
                test
                student
                course
                latePenalty
                graded
                gradingInProgress
                grade
                gradeOverride
                gradeAdjustmentExplanation
                isExcused
                submittedOn
                lastSavedOn
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
             }
           }
         `,
         variables: {
          courseId: courseId,
        },
  };
      return graphqlQuery
}