export const resetTestQuery = (testId,studentId,message) => {
  const graphqlQuery = {
    query: `
          mutation ResetTest($testId: ID!,$studentId: ID,$message: String) {
            resetTest(testId: $testId,studentId: $studentId,message: $message)
          }
        `,
    variables: {
      testId,
      studentId,
      message
    },
  };
  return graphqlQuery;
};
