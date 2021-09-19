export const createTestQuery = (
  formData,
  formattedReadingMaterials,
  formattedAudioMaterials,
  formattedVideoMaterials,
  formattedMcQuestions,
  formattedEssayQuestions,
  formattedSpeakingQuestions,
  formattedFillBlankQuestions,
  testId,
  courseId,
  instructorId,
  editing,
  formType
) => {
  const sectionWeights = [
    parseFloat(formData.mcSectionWeight) || null,
    parseFloat(formData.essaySectionWeight) || null,
    parseFloat(formData.speakingSectionWeight) || null,
    parseFloat(formData.fillBlankSectionWeight) || null,
  ];
  const graphqlQuery = {
    query: `
                  mutation ${!editing ? "CreateNewTest" : "UpdateTest"}(
                   $testName: String!,
                   $course:ID!,
                   $published:Boolean!,
                   $instructor:ID!,
                   $testType: String,
                   $testWeight: Float!,
                   $passingRequired: Boolean,
                   $isGradeIncluded: Boolean!,
                   $passingGrade: Float,
                   $timer:Int,
                   $availableOnDate:String,
                   $dueDate:String,
                   $gradeReleaseDate:String,
                   $allowLateSubmission: Boolean,
                   $latePenalty: Float,
                   $lateDaysAllowed: Int,
                   $fillBlankContent:String,
                   $sectionWeights: [Float]!,
                   $testSections: [String!]!,
                   $testId: ID!,
                   $assignment: Boolean!,
                   $blockedNotes: Boolean!,
                   $notes: String,
                  ){
                    ${!editing ? "createTest" : "updateTest"}(
                     testInput: {
                       testName: $testName,
                       course: $course,
                       published: $published,
                       instructor: $instructor,
                       testType: $testType,
                       testWeight: $testWeight,
                       passingRequired: $passingRequired,
                       isGradeIncluded: $isGradeIncluded,
                       passingGrade: $passingGrade,
                       timer: $timer,
                       availableOnDate: $availableOnDate,
                       dueDate: $dueDate,
                       gradeReleaseDate: $gradeReleaseDate,
                       allowLateSubmission: $allowLateSubmission,
                       latePenalty: $latePenalty,
                       lateDaysAllowed: $lateDaysAllowed,
                       sectionWeights: $sectionWeights,
                       testSections: $testSections,
                       testId: $testId,
                       assignment: $assignment,
                       blockedNotes: $blockedNotes,
                       notes: $notes,
                       readingMaterials: [${formattedReadingMaterials}]
                       audioMaterials: [${formattedAudioMaterials}]
                       videoMaterials: [${formattedVideoMaterials}]
                      }
                      multipleChoiceQuestionsInput: [${formattedMcQuestions}]
                      essayQuestionsInput: [${formattedEssayQuestions}]
                      speakingQuestionsInput: [${formattedSpeakingQuestions}]
                      fillBlankQuestionsInput: {
                        blanks: [${formattedFillBlankQuestions}],
                        fillBlankContent: $fillBlankContent
                      }
                     ) {
                         _id
                    }
                  }
                `,
    variables: {
      testId: testId,
      course: courseId,
      published: formData.published,
      isGradeIncluded: formData.isGradeIncluded,
      instructor: instructorId,
      testName:
        formType === "test" ? formData.testName : formData.assignmentName,
      testType: formData.testType,
      passingGrade: parseFloat(formData.passingGrade),
      passingRequired: formData.testType === "quiz" ? false : formData.passingRequired,
      testWeight:
        formType === "test"
          ? formData.isGradeIncluded ? parseFloat(formData.testWeight) : 0
          : formData.isGradeIncluded ? parseFloat(formData.assignmentWeight) : 0,
      timer: formData.timedTest ? parseInt(formData.testTime) : null,
      availableOnDate: formData.availableOnDate,
      dueDate: formData.dueDate,
      gradeReleaseDate: formData.gradeReleaseDate,
      allowLateSubmission: formData.allowLateSubmission || false,
      latePenalty: parseFloat(formData.latePenalty),
      lateDaysAllowed: parseInt(formData.lateDaysAllowed),
      sectionWeights: sectionWeights,
      testSections: formData.testSections,
      fillBlankContent: (
        (formData.fillBlankQuestions || {}).question || ""
      ).replace(/"/g, "'"),
      assignment: formType === "test" ? false : true,
      blockedNotes: formData.blockedNotes ? true : false,
      notes: formData.notes,
    },
  };
  return graphqlQuery;
};
