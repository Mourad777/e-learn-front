export const closeTestQuery = (testId, studentId,isExcused) => {
  const graphqlQuery = {
    query: `
            mutation CloseTest {
              closeTest(test: "${testId}",student: "${studentId}",isExcused: ${isExcused})
             {   
              _id
              test
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
          }
          `,
  };
  return graphqlQuery;
};
