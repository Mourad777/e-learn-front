export const coursesQuery = () => {
  const graphqlQuery = {
    query: `
                  query FetchAvailableCourses  {
                    courses {
                      _id
                      courseName
                      courseInstructor {
                        _id
                        firstName
                        lastName
                        profilePicture
                        email
                      }
                      enrollmentStartDate
                      enrollmentEndDate
                      courseStartDate
                      enrolled
                      droppedOut
                      grade
                      passed
                      numberOfStudents
                      
                      accessDenied
                      enrollmentRequested
                      courseEndDate
                      courseDropDeadline
                      resources {
                        _id
                        resourceName
                        resource
                      }
                      studentGrades {
                        student
                        grade
                        passed
                        gradeOverride
                        gradeAdjustmentExplanation
                      }
                      studentsEnrollRequests {
                        approved
                        denied
                        deniedReason
                        droppedOut
                        resubmissionAllowed
                        student {
                          _id
                          firstName
                          lastName
                          email
                          lastLogin
                          dob
                          
                          coursesEnrolled
                          profilePicture
                          documents {
                            documentType
                            document
                          }
                          testResults {
                            _id
                            test
                            course
                            student
                            closed
                            isExcused
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
                        }
                      }
                      syllabus
                      cost
                      couponCode
                      couponExpiration
                      courseImage
                      courseActive
                      studentCapacity
                      language
                      completed
                      totalIncludedTests
                      prerequisites {
                        _id
                        courseName
                      }
                      regularOfficeHours {
                        _id
                        day
                        startTime
                        endTime
                        timezoneRegion
                      }
                      irregularOfficeHours {
                       _id
                       date
                       startTime
                       endTime
                       timezoneRegion
                      }
                      tests {
                        _id
                        testName
                        course
                        published
                        testType
                        weight
                        timer
                        createdAt
                        passingGrade
                        passingRequired
                        availableOnDate
                        dueDate
                        isGradeIncluded
                        gradeReleaseDate
                        lateDaysAllowed
                        allowLateSubmission
                        latePenalty
                        assignment
                        blockedNotes
                        notes
                        classAverage
                        completed
                        sectionWeights {
                          mcSection
                          essaySection
                          fillBlankSection
                          speakingSection
                        }
                        multipleChoiceQuestions {
                          _id
                          question
                          marks
                          correctAnswers
                          answerOptions
                          solution
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
                      }
                      lessons {
                        _id
                        lessonName
                        availableOnDate
                        published
                        course
                        lessonSlides {
                          seen
                          studentsSeen
                          slideContent
                          audio
                          video
                        }
                      }
                    }
                  }
                `,
  };
  return graphqlQuery;
};
