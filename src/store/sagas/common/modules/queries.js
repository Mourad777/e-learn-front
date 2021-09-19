export const fetchModulesQuery = (courseId) => {
  const graphqlQuery = {
    query: `query FetchCategory($courseId: ID!) {
          category(courseId: $courseId) {
            _id
            course
            modules {
            _id
            moduleName
            lessons
            tests
            assignments
            subjects {
              _id
              subjectName
              lessons
              tests
              assignments
              topics {
                _id
                topicName
                lessons
                tests
                assignments
              }
            }
          }
        }
      } 
      `,
    variables: {
      courseId: courseId,
    },
  };
  return graphqlQuery;
};
