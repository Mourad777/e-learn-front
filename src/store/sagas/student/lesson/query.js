export const markSlideAsSeenQuery = (lessonId,slideNumber) => {
  const graphqlQuery = {
    query: `
        mutation MarkSlideAsSeen(
          $lessonId: ID!,
          $slideNumber: Int!, 
          )  {       
          markSlideAsSeen(
            lessonId:$lessonId,
            slideNumber:$slideNumber,
            )
        }
      `,
      variables: {
        lessonId,
        slideNumber,
      },
  };
  return graphqlQuery;
};
