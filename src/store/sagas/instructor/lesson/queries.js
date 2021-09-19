export const createLessonQuery = (
  formValues,
  slideContent,
  audioKeys,
  videoKeys,
  course,
  editing
) => {
  const graphqlQuery = {
    query: `
          mutation ${editing ? "UpdateLesson" : "CreateNewLesson"}(
            $lessonId: ID!,
            $lessonName: String!,
            $createdAt:String, 
            $slideContent:[String],
            $slideAudio:[String],
            $slideVideo:[String],
            $course: ID!, 
            $published: Boolean!, 
            $availableOnDate: String) {
            ${editing ? "updateLesson" : "createLesson"}(lessonInput: {
            _id: $lessonId,
            lessonName: $lessonName,
            createdAt: $createdAt,
            slideContent:$slideContent,
            slideAudio:$slideAudio, 
            slideVideo:$slideVideo,  
            course: $course, 
            published: $published, 
            availableOnDate: $availableOnDate}) {
              _id
              lessonName
              published
              availableOnDate
              course
            }
          }
        `,
    variables: {
      lessonId: formValues._id,
      lessonName: formValues.lessonName,
      createdAt: formValues.createdAt,
      published: formValues.published,
      availableOnDate: formValues.availableOnDate,
      slideContent: slideContent,
      slideAudio: audioKeys,
      slideVideo: videoKeys,
      course: course,
    },
  };
  return graphqlQuery;
};

export const fetchLessonQuery = (lessonId) => {
  const graphqlQuery = {
    query: `query FetchLesson($lessonId: ID!) {
          lesson(id: $lessonId) {
            _id
            lessonName
            course
            createdAt
            published
            availableOnDate
            lessonSlides {
              _id
              slideContent
              audio
              video
            }
          }
        }
      `,
    variables: {
      lessonId: lessonId,
    },
  };
  return graphqlQuery
};

export const deleteLessonQuery = (lessonId) => {
  const graphqlQuery = {
    query: `
        mutation {
          deleteLesson(id: "${lessonId}")
        }
      `,
  };
  return graphqlQuery
}