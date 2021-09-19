export const createUpdateQuestionQuery = (
  formData,
  editing,
  courseId,
  questionType,
  speakingQuestion,
  speakingSectionQuestionKey,
  speakingSectionAnswerKey,
  formattedFillBlankQuestion,
) => {
  const graphqlQuery = {
    query: `
                  mutation ${!editing ? "CreateQuestion" : "UpdateQuestion"}(
                   $course:ID!
                   $type:String
                   $language:String
                   $tags:[String]
                   $difficulty:String
                   $id:ID!
                   $fillBlankContent:String
                   $mcQuestion:String
                   $mcSolution:String
                   $mcAnswerOptions:[String]
                   $mcCorrectAnswers:[String]
                   $essayQuestion:String
                   $essaySolution:String
                   $speakingQuestion:String
                   $speakingQuestionAudio:String
                   $speakingQuestionAudioExplanation:String
                  ){
                    ${!editing ? "createQuestion" : "updateQuestion"}(
                     questionInput: {
                       course: $course
                       type:$type
                       language:$language
                       tags:$tags
                       difficulty:$difficulty
                       id:$id
                      }
                      speakingQuestionInput: {
                        question:$speakingQuestion
                        questionAudio:$speakingQuestionAudio
                        audio:$speakingQuestionAudioExplanation
                      }

                      multipleChoiceQuestionInput: {
                        question:$mcQuestion
                        solution:$mcSolution
                        answerOptions:$mcAnswerOptions
                        correctAnswers:$mcCorrectAnswers
                      }

                      essayQuestionInput: {
                        question:$essayQuestion
                        solution:$essaySolution
                      }

                      fillBlankQuestionInput: {
                        blanks: [${formattedFillBlankQuestion}],
                        fillBlankContent: $fillBlankContent
                      }
                     ) {
                         _id
                    }
                  }
                `,
    variables: {
      id: formData._id,
      course: courseId,
      type: questionType,

      language:
        formData.language.charAt(0).toUpperCase() +
        formData.language.slice(1).toLowerCase(),
      tags: formData.tags,
      difficulty: formData.difficulty,

      mcQuestion: ((formData.mcQuestion || {}).question || "").replace(
        /"/g,
        "'"
      ),
      mcSolution: ((formData.mcQuestion || {}).solution || "").replace(
        /"/g,
        "'"
      ),
      mcAnswerOptions: ((formData.mcQuestion || {}).answers || []).map((item) =>
        item.replace(/"/g, "'")
      ),
      mcCorrectAnswers: (formData.mcQuestion || {}).correctAnswers,

      essayQuestion: ((formData.essayQuestion || {}).question || "").replace(
        /"/g,
        "'"
      ),
      essaySolution: ((formData.essayQuestion || {}).solution || "").replace(
        /"/g,
        "'"
      ),

      speakingQuestion: !(speakingQuestion[0] || {}).audioQuestion
        ? (speakingSectionQuestionKey || "").replace(/"/g, "'")
        : "",
      speakingQuestionAudio: (speakingQuestion[0] || {}).audioQuestion
        ? speakingSectionQuestionKey
        : "",
      speakingQuestionAudioExplanation: (speakingQuestion[0] || {}).audioAnswer
        ? speakingSectionAnswerKey
        : "",
      fillBlankContent: (
        (formData.fillBlankQuestions || {}).question || ""
      ).replace(/"/g, "'"),
    },
  };
  return graphqlQuery;
};
