export const questionbankQuery = (courseId) => {
    const graphqlQuery = {
      query: `query FetchQuestions($courseId: ID!) {
                questions(courseId: $courseId) {
                  _id
                  course
                  language
                  tags
                  difficulty
                  type
        
                  mcQuestion {
                    question
                    solution
                    correctAnswers
                    answers
                  }
        
                  essayQuestion {
                    question
                    solution
                  }
        
                  speakingQuestion {
                    question
                    audioQuestion
                    audio
                  }
        
                  fillBlankQuestions {
                    question
                    blanks {
                      correctAnswer
                      selectableAnswer
                      incorrectAnswers
                      audio
                      answerOptions
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
  