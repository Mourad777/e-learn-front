export const gradeTestQuery = (
  formValues,
  formattedMultipleChoiceResults,
  formattedEssayResults,
  formattedSpeakingResults,
  formattedFillBlankResults,
  test,
  studentId,
  marking,
  grade,
  graded,
  gradingInProgress,
  sectionGrades,
) => {
  const graphqlQuery = {
    query: `
                mutation GradeTest(
                  $studentId: ID!, 
                  $testId:ID!,
                  $testClosed:Boolean!,
                  $graded:Boolean!,
                  $grade:Float!,
                  $gradeOverride:Boolean!,
                  $gradeAdjustmentExplanation:String,
                  $gradingInProgress:Boolean!,
                  $marking:Boolean!,
                  $latePenalty:Float,
                  $sectionGrades:[Float]
                  ) {       
                  submitTest(
                    studentId:$studentId,
                    testId:$testId,
                    testClosed: $testClosed,
                    graded: $graded,
                    grade: $grade,
                    gradeOverride: $gradeOverride,
                    gradeAdjustmentExplanation: $gradeAdjustmentExplanation,
                    gradingInProgress: $gradingInProgress,
                    marking: $marking,
                    latePenalty: $latePenalty,
                    sectionGrades: $sectionGrades,
                    multipleChoiceAnswersInput: [${formattedMultipleChoiceResults}],
                    essayAnswersInput: [${formattedEssayResults}],
                    speakingAnswersInput: [${formattedSpeakingResults}],
                    fillBlankAnswersInput: [${formattedFillBlankResults}],
                    )
                }
              `,
    variables: {
      testId: test,
      studentId: studentId,
      testClosed: true,
      marking: marking,
      grade: formValues.gradeOverride
        ? parseFloat(parseFloat(formValues.gradeAdjusted).toFixed(2))
        : grade > 0 ? parseFloat(parseFloat(grade).toFixed(2)) : 0,
      gradeOverride: formValues.gradeOverride || false,
      gradeAdjustmentExplanation: formValues.gradeAdjustmentExplanation,
      graded: graded,
      gradingInProgress: gradingInProgress,
      latePenalty: parseFloat(formValues.latePenalty),
      sectionGrades: (sectionGrades || []).map((grade) =>
        parseFloat(grade.toFixed(2))
      ),
    },
  };
  return graphqlQuery;
};
