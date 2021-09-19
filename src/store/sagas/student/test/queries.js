export const studentTestResultsQuery = () => {
  const graphqlQuery = {
    query: `
               query FetchTestResults {
                testResults {
                  testResults {
                    _id
                    test
                    student
                    course
                    closed
                    latePenalty
                    graded
                    gradingInProgress
                    grade
                    gradeOverride
                    isExcused
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
  };
  return graphqlQuery;
};

export const studentSubmitTestQuery = (
  studentId,
  test,
  testClosed,
  formattedMultipleChoiceAnswers,
  formattedEssayAnswers,
  formattedSpeakingAnswers,
  formattedFillBlankAnswers
) => {
  // console.log('formattedFillBlankAnswers',formattedFillBlankAnswers);
  const graphqlQuery = {
    query: `
            mutation SubmitTest(
              $studentId: ID!, 
              $testId:ID!
              $testClosed:Boolean!
              $lastSavedOn:String
              $submittedOn:String
              $graded:Boolean!
              $gradingInProgress:Boolean!
              $grade: Float
              $gradeOverride: Boolean
              $gradeAdjustmentExplanation: String
              $marking: Boolean!
              ) {       
              submitTest(
                studentId:$studentId,
                testId:$testId,
                testClosed: $testClosed,
                lastSavedOn: $lastSavedOn,
                submittedOn: $submittedOn,
                graded: $graded,
                grade: $grade,
                gradeAdjustmentExplanation: $gradeAdjustmentExplanation,
                gradeOverride: $gradeOverride,
                gradingInProgress: $gradingInProgress,
                marking: $marking,
                multipleChoiceAnswersInput: [${formattedMultipleChoiceAnswers}],
                essayAnswersInput: [${formattedEssayAnswers}],
                speakingAnswersInput: [${formattedSpeakingAnswers}],
                fillBlankAnswersInput: [${formattedFillBlankAnswers}],
                )
            }
          `,
    variables: {
      testId: test._id,
      studentId: studentId,
      testClosed: testClosed,
      gradingInProgress: false,
      graded: false,
      grade: null,
      gradeAdjustmentExplanation: null,
      gradeOverride: false,
      marking: false,
      lastSavedOn: !testClosed ? Date.now().toString() : null,
      submittedOn: testClosed ? Date.now().toString() : null,
    },
  };
  return graphqlQuery;
};