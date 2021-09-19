export const fetchTestQuery = (testId,password) => {
    const graphqlQuery = {
        query: `mutation FetchTest($testId:ID!,$password:String) {       
                        fetchTest(testId:$testId,password:$password) {
                          test{
                          _id
                          course
                          testName
                          published
                          testType
                          weight
                          createdAt
                          timer
                          passingGrade
                          passingRequired
                          availableOnDate
                          dueDate
                          gradeReleaseDate
                          allowLateSubmission
                          lateDaysAllowed
                          isGradeIncluded
                          latePenalty
                          blockedNotes
                          assignment
                          startTime
                          endTime
                          notes
                          readingMaterials {
                            content
                            section
                            fileUpload
                          }
                          audioMaterials {
                            audio
                            section
                            fileUpload
                          }
                          videoMaterials {
                            video
                            section
                          }
                          sectionWeights {
                            mcSection
                            essaySection
                            fillBlankSection
                            speakingSection
                          }
                          essayQuestions {
                            _id
                            question
                            marks
                            solution
                          }
                          speakingQuestions {
                           _id
                           question
                           marks
                           questionAudio
                           audio
                         }
                          multipleChoiceQuestions {
                           _id
                           question
                           marks
                           correctAnswers
                           answerOptions
                           solution
                          }
                          fillInBlanksQuestions {
                            text
                            blanks {
                              _id
                              incorrectAnswers
                              correctAnswer
                              marks
                              selectableAnswer
                              audio
                              answerOptions
                            }
                          }
                        }
                        result {
                          _id
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
          testId,
          password,
        },
      };
      return graphqlQuery
}