export const adjustStudentTestProgress = (testData,resultData) => {
    const fixedTestDataInProgress = {
        _id: resultData._id,
        course:testData.course,
        test:testData._id,
        mcQuestions: (testData.multipleChoiceQuestions || []).map(
          (item, index) => {
            const foundAnswers = (
              (resultData.multiplechoiceSection || {}).answers || []
            ).find((item) => item.questionNumber === index + 1);
            if (foundAnswers) {
              return foundAnswers.answers;
            } else {
              return [];
            }
          }
        ),

        essayQuestions: (testData.essayQuestions || []).map(
          (item, index) => {
            const foundAnswers = (
              (resultData.essaySection || {}).answers || []
            ).find((item) => item.questionNumber === index + 1);
            if (foundAnswers) {
              return foundAnswers.answer;
            } else {
              return "";
            }
          }
        ),

        speakingQuestions: (testData.speakingQuestions || []).map(
          (item, index) => {
            const foundAnswers = (
              (resultData.speakingSection || {}).answers || []
            ).find((item) => item.questionNumber === index + 1);
            if (foundAnswers) {
              return {
                recordedBlob:
                  !(foundAnswers || {}).answer ||
                  (foundAnswers || {}).answer === ""
                    ? ""
                    : foundAnswers.answer,
                audioFile: (foundAnswers || {}).answer || "",
              };
            } else {
              return { recordedBlob: "", audioFile: "" };
            }
          }
        ),

        fillBlankQuestions: {
          answers: (
            (testData.fillInBlanksQuestions || {}).blanks || []
          ).map((item, index) => {
            const foundAnswers = (
              (resultData.fillInBlanksSection || {}).answers || []
            ).find((item) => item.questionNumber === index + 1);
            if (foundAnswers) {
              return foundAnswers.answer;
            } else {
              return "";
            }
          }),
        },
        readingMaterials: testData.readingMaterials,
        audioMaterials: testData.audioMaterials,
        videoMaterials: testData.videoMaterials,
      };
      return fixedTestDataInProgress
}