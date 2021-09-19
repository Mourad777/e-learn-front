export const deleteTestQuery = (testId) => {
  const graphqlQuery = {
    query: `
            mutation {
              deleteTest(id: "${testId}")
            }
          `,
  };
  return graphqlQuery;
};
