export const createUpdateModulesQuery = (courseId,modules,editing) => {
  const graphqlQuery = {
    query: `
          mutation ${
            editing ? "UpdateCategory" : "CreateCategory"
          }($courseId: ID!,) {
            ${
              editing ? "updateCategory" : "createCategory"
            }(categoryInput: [${modules}], courseId: $courseId)
          }
        `,
    variables: {
      courseId: courseId,
    },
  };
  return graphqlQuery;
};