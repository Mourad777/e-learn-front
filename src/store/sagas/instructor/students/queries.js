export const studentsQuery = () => {
  const graphqlQuery = {
    query: `
           query FetchAllStudents {
             allStudents {
               _id
               firstName
               lastName
               email
               profilePicture
               dob
               isAccountSuspended
               isAccountApproved
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
  };
      return graphqlQuery
}