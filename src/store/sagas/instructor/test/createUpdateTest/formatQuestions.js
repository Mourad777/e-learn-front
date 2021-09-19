export const formatQuestions = (
  formData,
  speakSecAudioQs,
  spQAudioKeys,
  spAnsAudioKeys,
  fillBlankAnswers,
  fillBlankAudioKeys,
  pdfFilesReadingMaterial,
  audioFilesListeningMaterial,
  videoFilesWatchingMaterial,
  pdfKeys,
  rm,
  audioMaterialKeys,
  am,
  videoMaterialKeys,
  vm,
) => {
  //it is necessary to remove line breaks with .replace(/(\r\n|\n|\r)/gm, " ")
  //so that graphql doesnt throw an error
  //possible solution is to use variables instead of string interpolation?
  const testMaterialSections = [
    "multipleChoice",
    "essay",
    "speaking",
    "fillInTheBlanks",
    "test",
  ];
  let formattedMcQuestions = "";
  (formData.mcQuestions || []).forEach((item) => {
    item.answers.forEach((item) => (item || "").replace(/"/g, "'"));
    (item.correctAnswers || []).forEach((item) =>
      (item || "").replace(/"/g, "'")
    );
    formattedMcQuestions += `{ 
                            question: "${(item.question || "").replace(
                              /"/g,
                              "'"
                            )}",
                            marks: ${item.marks},
                            answerOptions: ${JSON.stringify(item.answers)}, 
                            correctAnswers: ${JSON.stringify(
                              item.correctAnswers
                            )}, 
                            solution: "${(item.solution || "")
                              .replace(/"/g, "'")
                              .replace(/(\r\n|\n|\r)/gm, " ")}" 
                            }`;
  });

  let formattedEssayQuestions = "";
  (formData.essayQuestions || []).forEach((item) => {
    formattedEssayQuestions += `{ 
                            question: "${(item.question || "").replace(
                              /"/g,
                              "'"
                            )}", 
                            solution: "${(item.solution || "")
                              .replace(/"/g, "'")
                              .replace(/(\r\n|\n|\r)/gm, " ")}",
                            marks: ${item.marks},
                            }`;
  });

  let formattedSpeakingQuestions = "";
  (formData.speakingQuestions || []).forEach((item, index) => {
    formattedSpeakingQuestions += `{
                              question: "${
                                !speakSecAudioQs[index]
                                  ? (item.question || "").replace(/"/g, "'")
                                  : ""
                              }", 
                              marks: ${item.marks},
                              audio: ${JSON.stringify(
                                spAnsAudioKeys[index] || ""
                              )}, 
                              questionAudio: ${JSON.stringify(
                                spQAudioKeys[index] || ""
                              )}
                            }`;
  });

  let formattedFillBlankQuestions = "";
  ((formData.fillBlankQuestions || {}).answers || []).forEach((item, index) => {
    const incorrectOptions = Object.values(
      (fillBlankAnswers[index] || {}).answerOptions || {}
    );
    formattedFillBlankQuestions += `{ 
                            incorrectAnswers: ${JSON.stringify(
                              (fillBlankAnswers[index] || {}).selectableAnswer
                                ? incorrectOptions.map(a=>a.trim())
                                : ["", "", ""]
                            )}, 
                            correctAnswer: "${(item.answer || "").replace(
                              /"/g,
                              "'"
                            )
                            .replace(/&nbsp;/g, ' ')
                            .trim()}", 
                            selectableAnswer: ${
                              (fillBlankAnswers[index] || {}).selectableAnswer
                            }, 
                            audio: ${JSON.stringify(
                              fillBlankAudioKeys[index] || ""
                            )},
                            marks: ${(fillBlankAnswers[index] || {}).marks}, 
                            }`;
  });
  let formattedReadingMaterials = "";
  (pdfFilesReadingMaterial || []).forEach((item, index) => {
    formattedReadingMaterials += `{ 
                        content: "${
                          (pdfKeys[index] || "").replace(/"/g, "'") || ""
                        }",
                        fileUpload: ${
                          (rm[testMaterialSections[index]] || {}).fileUpload ||
                          false
                        },
                        section: "${testMaterialSections[index]}",
                        }`;
  });
  let formattedAudioMaterials = "";
  audioFilesListeningMaterial.forEach((item, index) => {
    formattedAudioMaterials += `{ 
                        audio: "${audioMaterialKeys[index] || ""}", 
                        fileUpload: ${
                          (am[testMaterialSections[index]] || {}).fileUpload ||
                          false
                        },
                        section: "${testMaterialSections[index]}",
                        }`;
  });
  let formattedVideoMaterials = "";
  videoFilesWatchingMaterial.forEach((item, index) => {
    formattedVideoMaterials += `{ 
                        video: "${videoMaterialKeys[index] || ""}", 
                        section: "${testMaterialSections[index]}",
                        }`;
  });
  const formattedQuestions = {
    formattedMcQuestions,
    formattedEssayQuestions,
    formattedSpeakingQuestions,
    formattedFillBlankQuestions,
    formattedReadingMaterials,
    formattedAudioMaterials,
    formattedVideoMaterials,
  };
  return formattedQuestions;
};
