export const deleteQuestionQuery = (questionId) => {
    const graphqlQuery = {
        query: `
            mutation {
              deleteQuestion(id: "${questionId}")
            }
          `,
      };
      return graphqlQuery
}