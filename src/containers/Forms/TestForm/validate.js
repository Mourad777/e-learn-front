import i18n from "../../../i18n/index";

const validate = (values = {}) => {
  const errors = {
    mcQuestions: [],
    essayQuestions: [],
    speakingQuestions: [],
    fillBlankQuestions: {
      answers: [],
    },
    infoPageOneError: false,
    infoPageTwoError: false,
    infoPageThreeError: false,
    infoPageFourError: false,
    mcSectionPageError: false,
    essayPageError: false,
    speakingPageError: false,
    fillblankPageError: false,
    readingMaterial: {
      multipleChoice: {},
      essay: {},
      speaking: {},
      fillInTheBlanks: {},
      test: {},
    },
    audioMaterial: {
      multipleChoice: {},
      essay: {},
      speaking: {},
      fillInTheBlanks: {},
      test: {},
    },
  };

  const checkDuplicates = (arr) => {
    const duplicates = (arr || []).reduce((acc, el, i, arr) => {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
      return acc;
    }, []);
    return duplicates;
  };
  //page 1
  if ((!values.testName && !values.assignment) || (!(values.testName || '').trim() && !values.assignment)) {
    errors.testName = i18n.t("testForm.errors.required");
    errors.infoPageOneError = true;
  }
  (values.tests || []).forEach((test) => {
    if (
      values._id !== test._id &&
      !values.assignment &&
      (test.testName || "").toLowerCase().trim() ===
      (values.testName || "").toLowerCase().trim()
    ) {
      errors.testName = i18n.t("testForm.errors.noDuplicateTestNames");
      errors.infoPageOneError = true;
    }
  });

  (values.assignments || []).forEach((assignment) => {
    if (
      values._id !== assignment._id &&
      values.assignment &&
      (assignment.testName || "").toLowerCase().trim() ===
      (values.assignmentName || "").toLowerCase().trim()
    ) {
      errors.assignmentName = i18n.t(
        "testForm.errors.noDuplicateAssignmentNames"
      );
    }
  });
  if ((!values.assignmentName && values.assignment) || (!(values.assignmentName || '').trim() && values.assignment)) {
    errors.assignmentName = i18n.t("testForm.errors.required");
    errors.infoPageOneError = true;
  }
  if (values.isGradeIncluded) {
    if (
      (values.testWeight > 1000 || !(values.testWeight > 0)) &&
      !values.assignment
    ) {
      errors.testWeight = i18n.t("testForm.errors.mustBeBetweenZeroAndThousand");
      errors.infoPageOneError = true;
    }
    if (!values.testWeight && !values.assignment) {
      errors.testWeight = i18n.t("testForm.errors.required");
      errors.infoPageOneError = true;
    }
    if (
      (values.assignmentWeight > 1000 || !(values.assignmentWeight > 0)) &&
      values.assignment
    ) {
      errors.assignmentWeight = i18n.t(
        "testForm.errors.mustBeBetweenZeroAndThousand"
      );
      errors.infoPageOneError = true;
    }
    if (!values.assignmentWeight && values.assignment) {
      errors.assignmentWeight = i18n.t("testForm.errors.required");
      errors.infoPageOneError = true;
    }
  }

  if (
    values.passingGrade &&
    (values.passingGrade > 100 || !(values.passingGrade >= 1))
  ) {
    errors.passingGrade = i18n.t("testForm.errors.mustBeBetweenOneAndHundred");
    errors.infoPageOneError = true;
  }
  if (!values.passingGrade && values.passingRequired) {
    errors.passingGrade = i18n.t("testForm.errors.specifyPassGrade");
    errors.infoPageOneError = true;
  }
  if (
    values.allowLateSubmission &&
    (!(values.latePenalty < 100) || !(values.latePenalty > 0))
  ) {
    errors.latePenalty = i18n.t(
      "testForm.errors.mustBeGreaterThanZeroAndLessThanHundred"
    );
    errors.infoPageOneError = true;
  }
  if (values.allowLateSubmission && !values.latePenalty) {
    errors.latePenalty = i18n.t("testForm.errors.required");
    errors.infoPageOneError = true;
  }
  if (
    values.allowLateSubmission &&
    (parseFloat(values.lateDaysAllowed) <= 0 ||
      !Number.isInteger(parseFloat(values.lateDaysAllowed)))
  ) {
    errors.lateDaysAllowed = i18n.t("testForm.errors.intGreaterThanZero");
    errors.infoPageOneError = true;
  }
  if (values.allowLateSubmission && !values.lateDaysAllowed) {
    errors.lateDaysAllowed = i18n.t("testForm.errors.required");
    errors.infoPageOneError = true;
  }
  if (
    !values.assignment &&
    values.timedTest &&
    (parseFloat(values.testTime) === 0 || (values.testTime < 0) ||
      !Number.isInteger(parseFloat(values.testTime)))
  ) {
    errors.testTime = i18n.t("testForm.errors.intGreaterThanZero");
    errors.infoPageOneError = true;
  }
  if (!values.assignment && values.timedTest && !values.testTime) {
    errors.testTime = i18n.t("testForm.errors.requiredOrDisableTimedTest");
    errors.infoPageOneError = true;
  }
  if (!values.testType && !values.assignment) {
    errors.testType = i18n.t("testForm.errors.required");
    errors.infoPageOneError = true;
  }
  const foundFinalExam = (values.tests || []).find(
    (t) => t.testType === "final"
  );
  if (
    foundFinalExam &&
    values.testType === "final" &&
    foundFinalExam._id !== values._id
  ) {
    errors.testType = i18n.t("testForm.errors.onlyOneFinal");
    errors.infoPageOneError = true;
  }

  //page 2
  if (
    (values.testSections || []).includes("mc") &&
    !(values.mcSectionWeight > 0)
  ) {
    errors.mcSectionWeight = i18n.t("testForm.errors.greaterThanZero");
    errors.infoPageTwoError = true;
  }
  if ((values.testSections || []).includes("mc") && !values.mcSectionWeight) {
    errors.mcSectionWeight = i18n.t("testForm.errors.required");
    errors.infoPageTwoError = true;
  }
  if (
    (values.testSections || []).includes("essay") &&
    !(values.essaySectionWeight > 0)
  ) {
    errors.essaySectionWeight = i18n.t("testForm.errors.greaterThanZero");
    errors.infoPageTwoError = true;
  }
  if (
    (values.testSections || []).includes("essay") &&
    !values.essaySectionWeight
  ) {
    errors.essaySectionWeight = i18n.t("testForm.errors.required");
    errors.infoPageTwoError = true;
  }
  if (
    (values.testSections || []).includes("speaking") &&
    !(values.speakingSectionWeight > 0)
  ) {
    errors.speakingSectionWeight = i18n.t("testForm.errors.greaterThanZero");
    errors.infoPageTwoError = true;
  }
  if (
    (values.testSections || []).includes("speaking") &&
    !values.speakingSectionWeight
  ) {
    errors.speakingSectionWeight = i18n.t("testForm.errors.required");
    errors.infoPageTwoError = true;
  }
  if (
    (values.testSections || []).includes("fillblanks") &&
    !(values.fillBlankSectionWeight > 0)
  ) {
    errors.fillBlankSectionWeight = i18n.t("testForm.errors.greaterThanZero");
    errors.infoPageTwoError = true;
  }
  if (
    (values.testSections || []).includes("fillblanks") &&
    !values.fillBlankSectionWeight
  ) {
    errors.fillBlankSectionWeight = i18n.t("testForm.errors.required");
    errors.infoPageTwoError = true;
  }
  //check if sections add up to 100%
  const sumOfSectionWeights = [
    (values.testSections || []).includes("mc")
      ? parseFloat(values.mcSectionWeight)
      : 0,
    (values.testSections || []).includes("essay")
      ? parseFloat(values.essaySectionWeight)
      : 0,
    (values.testSections || []).includes("speaking")
      ? parseFloat(values.speakingSectionWeight)
      : 0,
    (values.testSections || []).includes("fillblanks")
      ? parseFloat(values.fillBlankSectionWeight)
      : 0,
  ].reduce((a, b) => a + b, 0);

  if (
    (sumOfSectionWeights < 99.99 || sumOfSectionWeights > 100) &&
    (!values.testSections || (values.testSections || []).length > 0)
  ) {
    errors.testSections = i18n.t("testForm.errors.addToHundred");
    errors.infoPageTwoError = true;
  }
  if (!values.testSections || (values.testSections || []).length === 0) {
    errors.testSections = i18n.t("testForm.errors.selectSections");
    errors.infoPageTwoError = true;
  }
  //page 3
  if (
    values.dueDate &&
    ((!values.editing && !(Date.now() <= new Date(values.dueDate).getTime())) ||
      (values.editing &&
        !(
          new Date(values.createdAt).getTime() <=
          new Date(values.dueDate).getTime()
        )))
  ) {
    errors.dueDate = i18n.t("testForm.errors.laterDate");
    errors.infoPageThreeError = true;
  }
  if (
    values.gradeReleaseDate &&
    ((!values.editing &&
      !(Date.now() <= new Date(values.gradeReleaseDate).getTime())) ||
      (values.editing &&
        !(
          new Date(values.createdAt).getTime() <=
          new Date(values.gradeReleaseDate).getTime()
        )))
  ) {
    errors.gradeReleaseDate = i18n.t("testForm.errors.laterDate");
    errors.infoPageThreeError = true;
  }
  if (
    values.availableOnDate &&
    ((!values.editing &&
      !(Date.now() <= new Date(values.availableOnDate).getTime())) ||
      (values.editing &&
        !(
          new Date(values.createdAt).getTime() <=
          new Date(values.availableOnDate).getTime()
        )))
  ) {
    errors.availableOnDate = i18n.t("testForm.errors.laterDate");
    errors.infoPageThreeError = true;
  }
  if (values.allowLateSubmission && !values.dueDate) {
    errors.dueDate = i18n.t("testForm.errors.disableLateSubmission");
    errors.infoPageThreeError = true;
  }
  //the 3 dates need to fall within the course duration except the grade release date which only
  //has to be after the course start date but can fall after the course end date
  const courseStart = parseInt((values.course || {}).courseStartDate);
  const courseEnd = parseInt((values.course || {}).courseEndDate);
  const availableOn = new Date(values.availableOnDate).getTime();
  const dueOn = new Date(values.dueDate).getTime();
  const gradeRelease = new Date(values.gradeReleaseDate).getTime();
  if (
    courseStart &&
    courseEnd &&
    availableOn &&
    (!(availableOn > courseStart) || !(availableOn < courseEnd))
  ) {
    errors.availableOnDate = i18n.t(
      "testForm.errors.availableOnDateInCourseDuration"
    );
    errors.infoPageThreeError = true;
  }
  if (
    courseStart &&
    courseEnd &&
    dueOn &&
    (!(dueOn > courseStart) || !(dueOn < courseEnd))
  ) {
    errors.dueDate = i18n.t("testForm.errors.dueDateInCourseDuration");
    errors.infoPageThreeError = true;
  }
  if (
    courseStart &&
    courseEnd &&
    gradeRelease &&
    !(gradeRelease > courseStart)
  ) {
    errors.gradeReleaseDate =
      i18n.t("testForm.errors.gradeReleaseDateAfterCourseStart");
    errors.infoPageThreeError = true;
  }
  //the 3 dates need to be in the correct chronological order
  if (dueOn && availableOn && !(availableOn < dueOn)) {
    errors.dueDate = i18n.t("testForm.errors.dueDateAfterAvailableOnDate");
    errors.availableOnDate = values.assignment
      ? i18n.t("testForm.errors.availableOnDateBeforeDueDate")
      : i18n.t("testForm.errors.availableOnDateBeforeCloseDate")
    errors.infoPageThreeError = true;
  }
  if (gradeRelease && availableOn && !(availableOn < gradeRelease)) {
    errors.gradeReleaseDate =
      i18n.t("testForm.errors.gradeReleaseDateAfterAvailableOnDate")
    errors.availableOnDate =
      i18n.t("testForm.errors.availableOnDateBeforeGradeReleaseDate")
    errors.infoPageThreeError = true;
  }
  if (gradeRelease && dueOn && !(dueOn < gradeRelease)) {
    errors.gradeReleaseDate = values.assignment
      ? i18n.t("testForm.errors.gradeReleaseDateAfterDueDate")
      : i18n.t("testForm.errors.gradeReleaseDateAfterCloseDate")
    errors.dueDate = values.assignment
      ? i18n.t("testForm.errors.dueDateBeforeGradeReleaseDate")
      : i18n.t("testForm.errors.closeDateBeforeGradeReleaseDate")
    errors.infoPageThreeError = true;
  }
  if (gradeRelease && dueOn && values.allowLateSubmission && !((dueOn + values.lateDaysAllowed * 86400000) < gradeRelease)) {
    errors.gradeReleaseDate = i18n.t("testForm.errors.gradeReleaseDateAfterDueDatePlusLateDays");
    errors.dueDate = i18n.t("testForm.errors.dueDatePlusLateDaysBeforeGradeReleaseDate");
    errors.infoPageThreeError = true;
  }
  //page 4
  const materialDisplay = [
    "multipleChoice",
    "essay",
    "speaking",
    "fillInTheBlanks",
    "test",
  ];
  materialDisplay.forEach((section) => {
    const pdfFile = ((values.readingMaterial || {})[section] || {}).file;
    const isPDFFile = ((values.readingMaterial || {})[section] || {})
      .fileUpload;
    const audioFile = ((values.audioMaterial || {})[section] || {}).audioFile;
    const isAudioFile = ((values.audioMaterial || {})[section] || {})
      .fileUpload;
    const videoFile = ((values.audioMaterial || {})[section] || {}).videoFile;
    if (
      pdfFile instanceof File &&
      !(pdfFile.size < values.instructorFileSizeLimit * 1000 * 1000) &&
      isPDFFile
    ) {
      (
        errors.readingMaterial[section] || {}
      ).file = `${i18n.t("testForm.errors.docCannotExceed")} ${values.instructorFileSizeLimit}MB`;
      errors.infoPageFourError = true;
    }
    if (
      audioFile instanceof File &&
      !(audioFile.size < values.instructorFileSizeLimit * 1000 * 1000) &&
      isAudioFile
    ) {
      (
        errors.audioMaterial[section] || {}
      ).audioFile = `${i18n.t("testForm.errors.audioCannotExceed")} ${values.instructorFileSizeLimit}MB`;
      errors.infoPageFourError = true;
    }
    if (
      videoFile instanceof File &&
      !(videoFile.size < values.instructorFileSizeLimit * 1000 * 1000) &&
      !!videoFile
    ) {
      (
        errors.videoMaterial[section] || {}
      ).videoFile = `${i18n.t("testForm.errors.videoCannotExceed")} ${values.instructorFileSizeLimit}MB`;
      errors.infoPageFourError = true;
    }
  });
  //mc validation
  errors.mcQuestions = (values.mcQuestions || []).map((mcq, index) => {
    let correctAnswersError;
    if (
      ((mcq.answers || []).includes(undefined) ||
        (mcq.answers || []).includes("")) &&
      (mcq.answers || []).length > 1
    ) {
      correctAnswersError = i18n.t("testForm.errors.answersCantBeEmpty")
    }
    if ((mcq.answers || []).length < 2) {
      correctAnswersError = i18n.t("testForm.errors.atleastTwoAnswers")
    }
    if (
      (mcq.answers || []).length === (mcq.correctAnswers || []).length &&
      (mcq.answers || []).length > 1
    ) {
      correctAnswersError = i18n.t("testForm.errors.atleastOneUnchecked")
    }

    if (
      (!mcq.correctAnswers || (mcq.correctAnswers || []).length === 0) &&
      (mcq.answers || []).length > 1
    ) {
      correctAnswersError = i18n.t("testForm.errors.selectAtleastOneAnswer")
    }
    const trimmedAnswers = (mcq.answers || []).map((item) =>
      (item || "").trim()
    );
    const duplicates = checkDuplicates(trimmedAnswers);
    if ((mcq.answers || []).length > 1 && (duplicates || []).length > 0) {
      correctAnswersError = i18n.t("testForm.errors.answersDifferent")
    }
    let marksError = null;
    if (!(parseFloat(mcq.marks) > 0)) {
      marksError = i18n.t("testForm.errors.greaterThanZero");
    }
    if (!mcq.marks || mcq.marks === "") {
      marksError = i18n.t("testForm.errors.required");
    }
    let questionError = null;
    if (!mcq.question || mcq.question === "") {
      questionError = i18n.t("testForm.errors.required");
      errors.mcSectionPageError = true;
    }
    if (marksError || questionError || correctAnswersError)
      errors.mcSectionPageError = true;
    return {
      question: questionError,
      marks: marksError,
      correctAnswers: correctAnswersError,
    };
  });
  //essay validation
  errors.essayQuestions = (values.essayQuestions || []).map((essayq, index) => {
    let marksError;
    if (!(parseFloat(essayq.marks) > 0))
      marksError = i18n.t("testForm.errors.greaterThanZero");
    if (!essayq.marks || essayq.marks === "")
      marksError = i18n.t("testForm.errors.required");
    return {
      question: !essayq.question || essayq.question === "" ? i18n.t("testForm.errors.required") : null,
      marks: marksError,
    };
  });
  errors.essayQuestions.map((question) => {
    if (question.question || question.marks) errors.essayPageError = true;
  });
  // speaking section validation
  errors.speakingQuestions = (values.speakingQuestions || []).map(
    (speakingq, index) => {
      let questionError = null;
      if (
        (!speakingq.question || speakingq.question === "") &&
        !speakingq.audioQuestion
      ) {
        questionError = i18n.t("testForm.errors.requiredOrMakeAudioQuestion")
      }
      let questionAudioError = null;
      if (
        speakingq.audioQuestion &&
        (!speakingq.questionRecordedBlob ||
          speakingq.questionRecordedBlob === "")
      ) {
        questionAudioError = i18n.t("testForm.errors.requiredOrMakeTextQuestion")
      }

      let answerAudioError = null;
      if (
        speakingq.audioAnswer &&
        (!speakingq.recordedBlob || speakingq.recordedBlob === "")
      ) {
        answerAudioError = i18n.t("testForm.errors.requiredOrDisableAudioAnswer")
      }

      if (
        speakingq.audioFile instanceof File &&
        speakingq.audioFile.size > values.instructorFileSizeLimit * 1000 * 1000 &&
        speakingq.audioAnswer
      ) {
        answerAudioError = `${i18n.t("testForm.errors.audioCannotExceed")} ${values.instructorFileSizeLimit}MB`;
      }

      if (
        speakingq.audioFileQuestion instanceof File &&
        speakingq.audioFileQuestion.size > values.instructorFileSizeLimit * 1000 * 1000 &&
        speakingq.audioQuestion
      ) {
        questionAudioError = `${i18n.t("testForm.errors.audioCannotExceed")} ${values.instructorFileSizeLimit}MB`;
      }

      if (
        speakingq.audioAnswer &&
        (!speakingq.recordedBlob || speakingq.recordedBlob === "")
      ) {
        answerAudioError = i18n.t("testForm.errors.requiredOrDisableAudioAnswer");
      }

      let marksError = null;
      if (!(parseFloat(speakingq.marks) > 0)) {
        marksError = i18n.t("testForm.errors.greaterThanZero");
      }
      if (!speakingq.marks || speakingq.marks === "") {
        marksError = i18n.t("testForm.errors.required");
      }
      if (marksError || questionAudioError || questionError || answerAudioError)
        errors.speakingPageError = true;
      return {
        question: questionError,
        marks: marksError,
        questionRecordedBlob: questionAudioError,
        recordedBlob: answerAudioError,
      };
    }
  );
  errors.speakingQuestions.map((question) => {
    if (
      question.audioQuestion ||
      question.marks ||
      question.questionRecordedBlob
    )
      errors.speakingSectionPageError = true;
  });
  // fill in the blanks validation
  const answers = (values.fillBlankQuestions || {}).answers || [];
  errors.fillBlankQuestions.answers = answers.map((answer, index) => {
    let incorrectOptionsMessage;
    const answerOptions = Object.values(answer.answerOptions || {});
    const trimmedAnswerOptions =
      (answerOptions || []).map((item) => (item || "").trim()) || [];
    if (trimmedAnswerOptions.includes((answer.answer || "").trim())) {
      incorrectOptionsMessage =
        i18n.t("testForm.errors.incorrectAnswersCantBeSameAsCorrectAnswer");
    }
    const incorrectOptions = (
      (Object.values(answer.answerOptions || {}) || []).map((item) =>
        (item || "").trim()
      ) || []
    ).filter((item) => item !== "");
    //check for atleast 1 answer
    const atLeastOneOption =
      incorrectOptions.findIndex((item) => item !== "" && item) > -1;
    if (!atLeastOneOption && answer.selectableAnswer) {
      incorrectOptionsMessage =
        i18n.t("testForm.errors.atLeastOneIncorrectAnswer");
    }
    //check for duplicate incorrect answers
    const duplicates = checkDuplicates(incorrectOptions);
    if (duplicates.length > 0) {
      incorrectOptionsMessage = i18n.t("testForm.errors.noDuplicateIncorrectAnswers");
    }
    let marksError = null;
    if (!(parseFloat(answer.marks) > 0)) {
      marksError = i18n.t("testForm.errors.greaterThanZero");
    }
    if (!answer.marks || answer.marks === "") {
      marksError = i18n.t("testForm.errors.required");
    }
    let audioError = null;
    if (answer.audio && !answer.browserAudioFile) {
      audioError = i18n.t("testForm.errors.requiredAudioOrDisableAudio");
    }
    if (
      answer.audioFile instanceof File &&
      answer.audioFile.size > values.instructorFileSizeLimit * 1000 * 1000 &&
      answer.audio
    ) {
      audioError = `${i18n.t("testForm.errors.audioCannotExceed")} ${values.instructorFileSizeLimit}MB`;
    }
    let incorrectOptionsError = null;
    if (answer.selectableAnswer && incorrectOptionsMessage) {
      incorrectOptionsError = incorrectOptionsMessage;
    }
    if (audioError || marksError || incorrectOptionsError)
      errors.fillblankPageError = true;
    return {
      marks: marksError,
      answerOptions: {
        incorrectAnswerThree: incorrectOptionsMessage,
      },
      browserAudioFile: audioError,
    };
  });
  let questionMessage = null;

  if (((values.fillBlankQuestions || {}).question || "").includes("-BLANK-"))
    questionMessage = i18n.t("testForm.errors.blankIsReserved");

  if (!(answers.length > 0)) questionMessage = i18n.t("testForm.errors.createAtleastOneBlank");
  if (
    (!values.fillBlankQuestions || {}).question ||
    (values.fillBlankQuestions || {}).question === ""
  )
    questionMessage = i18n.t("testForm.errors.required");
  if (questionMessage) {
    errors.fillBlankQuestions.question = questionMessage;
    errors.fillblankPageError = true;
  }

  if (!(values.testSections || []).includes("mc"))
    errors.mcSectionPageError = false;
  if (!(values.testSections || []).includes("essay"))
    errors.essayPageError = false;
  if (!(values.testSections || []).includes("speaking"))
    errors.speakingPageError = false;
  if (!(values.testSections || []).includes("fillblanks"))
    errors.fillblankPageError = false;

  return errors;
};

export default validate;
