import { getKeyFromAWSUrl } from "../../../../../utility/getKeyFromUrl";
import i18n from "../../../../../i18n/index";

export const adjustInstructorTest = (formData) => {
  const testSections = [];
  if (formData.sectionWeights.mcSection > 0) testSections.push("mc");
  if (formData.sectionWeights.essaySection > 0) testSections.push("essay");
  if (formData.sectionWeights.speakingSection > 0)
    testSections.push("speaking");
  if (formData.sectionWeights.fillBlankSection > 0)
    testSections.push("fillblanks");

  const readingMaterials = (formData.readingMaterials || []).map((item) => {
    return {
      file: item.fileUpload ? getKeyFromAWSUrl(item.content) : "",
      fileUpload: item.fileUpload,
      loadedPDF: item.fileUpload ? item.content : "",
      content: !item.fileUpload ? item.content : "",
    };
  });

  const audioMaterials = (formData.audioMaterials || []).map((item) => {
    return {
      audioFile: item.audio,
      fileUpload: item.fileUpload,
      recordedBlob: item.audio ? item.audio : null,
    };
  });

  const videoMaterials = (formData.videoMaterials || []).map((item) => {
    return {
      videoFile: item.video,
      videoBlob: item.video ? item.video : null,
    };
  });

  const readingMaterial = {
    multipleChoice: readingMaterials[0],
    essay: readingMaterials[1],
    speaking: readingMaterials[2],
    fillInTheBlanks: readingMaterials[3],
    test: readingMaterials[4],
  };

  const audioMaterial = {
    multipleChoice: audioMaterials[0],
    essay: audioMaterials[1],
    speaking: audioMaterials[2],
    fillInTheBlanks: audioMaterials[3],
    test: audioMaterials[4],
  };

  const videoMaterial = {
    multipleChoice: videoMaterials[0],
    essay: videoMaterials[1],
    speaking: videoMaterials[2],
    fillInTheBlanks: videoMaterials[3],
    test: videoMaterials[4],
  };

  const mcQuestions = (formData.multipleChoiceQuestions || []).map((item) => {
    return {
      question: item.question,
      marks: item.marks,
      solution: item.solution,
      correctAnswers: item.correctAnswers,
      answers: item.answerOptions,
    };
  });

  const speakingQuestions = (formData.speakingQuestions || []).map((item) => {
    return {
      question: item.question,
      marks: item.marks,
      audioAnswer: item.audio ? true : false,
      recordedBlob: item.audio && item.audio !== "" ? item.audio : null,
      audioFile: item.audio,
      audioQuestion: item.questionAudio ? true : false,
      questionRecordedBlob:
        item.questionAudio && item.questionAudio !== ""
          ? item.questionAudio
          : null,
      audioFileQuestion: item.questionAudio,
    };
  });

  const fillBlankCorrectAnswers = (
    (formData.fillInBlanksQuestions || {}).blanks || []
  ).map((blank) => blank.correctAnswer);
  const fillBlankAnswers = (
    (formData.fillInBlanksQuestions || {}).blanks || []
  ).map((blank) => {
    const answerOptions = (blank.incorrectAnswers || [])
      .filter((i) => i)
      .reduce(function (result, item, index) {
        let propNumber;
        if (index === 0) propNumber = "One";
        if (index === 1) propNumber = "Two";
        if (index === 2) propNumber = "Three";
        result[`incorrectAnswer${propNumber}`] = item;
        return result;
      }, {});
    return {
      answer: blank.correctAnswer,
      marks: blank.marks,
      selectableAnswer: blank.selectableAnswer,
      answerOptions,
      browserAudioFile: blank.audio !== "" && blank.audio ? blank.audio : "",
      audioFile: blank.audio !== "" && blank.audio ? blank.audio : "",
      audio: blank.audio !== "" && blank.audio ? true : false,
    };
  });
  const fillBlankQuestions = {
    question: (formData.fillInBlanksQuestions || {}).text,
    answers: fillBlankAnswers,
    correctAnswers: fillBlankCorrectAnswers,
  };
  const adjustedFormData = {
    _id: formData._id,
    editing: true,
    assignment: formData.assignment,
    published: formData.published,
    isGradeIncluded:formData.isGradeIncluded,
    passingRequired: formData.passingRequired,
    passingGrade: formData.passingGrade,
    createdAt: formData.createdAt
      ? new Date(parseInt(formData.createdAt))
      : null,
    [formData.assignment ? "assignmentName" : "testName"]: formData.testName,
    testType: formData.testType,
    [formData.assignment ? "assignmentWeight" : "testWeight"]: formData.weight,

    latePenalty: formData.allowLateSubmission
      ? formData.latePenalty.toString()
      : null,
    lateDaysAllowed: formData.allowLateSubmission
      ? formData.lateDaysAllowed.toString()
      : null,
    allowLateSubmission: formData.allowLateSubmission ? true : false,

    timedTest: formData.timer ? true : false,
    testTime: formData.timer ? formData.timer.toString() : null,
    blockedNotes: formData.blockedNotes,
    notes: formData.notes,
    availableOnDate: formData.availableOnDate
      ? new Date(parseInt(formData.availableOnDate))
      : null,
    dueDate: formData.dueDate ? new Date(parseInt(formData.dueDate)) : null,
    gradeReleaseDate: formData.gradeReleaseDate
      ? new Date(parseInt(formData.gradeReleaseDate))
      : null,
    testSections: testSections,
    mcSectionWeight: formData.sectionWeights.mcSection,
    essaySectionWeight: formData.sectionWeights.essaySection,
    speakingSectionWeight: formData.sectionWeights.speakingSection,
    fillBlankSectionWeight: formData.sectionWeights.fillBlankSection,
    speakingQuestions:
      speakingQuestions && (speakingQuestions || []).length > 0
        ? speakingQuestions
        : [{ marks: 1 }],
    essayQuestions:
      formData.essayQuestions && (formData.essayQuestions || []).length > 0
        ? formData.essayQuestions
        : [{ marks: 1 }],
    mcQuestions:
      mcQuestions && (mcQuestions || []).length > 0
        ? mcQuestions
        : [
            {
              marks: 1,
              answers: [
                `${i18n.t("testForm.fields.option")} 1`,
                `${i18n.t("testForm.fields.option")} 2`,
              ],
              correctAnswers: ["1"],
            },
          ],
    fillBlankQuestions: fillBlankQuestions,
    readingMaterial: readingMaterial,
    audioMaterial: audioMaterial,
    videoMaterial: videoMaterial,
  };
  return adjustedFormData;
};
